const {
  getSql, parseBody, normalizeBoolean, normalizeNumber,
  fetchTemplateRow, fetchTemplateSections, toTemplateSection,
} = require("./_wizard-form-templates-store");
const { remapLayoutSectionKey } = require("./_wizard-form-template-layout-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await listSections(req, res);
    if (req.method === "POST") return await addSection(req, res);
    if (req.method === "PATCH") return await updateSection(req, res);
    if (req.method === "DELETE") return await removeSection(req, res);
    res.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template sections API failed", message: error.message });
  }
};

async function requireDraftTemplate(sql, templateId) {
  const template = await fetchTemplateRow(sql, templateId);
  if (!template) {
    const error = new Error("Form template not found");
    error.statusCode = 404;
    throw error;
  }
  if (template.status !== "draft") {
    const error = new Error("Only draft form templates can change section membership");
    error.statusCode = 409;
    throw error;
  }
  return template;
}

async function listSections(req, res) {
  const templateId = String(req.query.templateId || "").trim();
  if (!templateId) return res.status(400).json({ error: "templateId is required" });
  const sql = getSql();
  const template = await fetchTemplateRow(sql, templateId);
  if (!template) return res.status(404).json({ error: "Form template not found" });
  return res.status(200).json({ ok: true, sections: await fetchTemplateSections(sql, templateId) });
}

async function addSection(req, res) {
  const body = parseBody(req.body);
  const templateId = String(body.templateId || "").trim();
  const sectionKey = String(body.sectionKey || "").trim();
  if (!templateId) return res.status(400).json({ error: "templateId is required" });
  const sql = getSql();
  const template = await requireDraftTemplate(sql, templateId);
  if (body.createNew === true) return await createOwnedSection(sql, template, body, res);
  if (!sectionKey) return res.status(400).json({ error: "sectionKey is required" });
  const sourceRows = await sql`
    select id::text, section_key, is_required, order_change_allowed, fixed_position, is_visible_in_wizard
    from wizard_content_sections
    where section_key = ${sectionKey} and status = 'active'
    limit 1
  `;
  if (!sourceRows.length) return res.status(422).json({ error: "sectionKey needs an active section version" });
  const duplicate = await sql`
    select id::text from wizard_form_template_sections
    where form_template_id = ${templateId}::uuid and section_key = ${sectionKey}
    limit 1
  `;
  if (duplicate.length) return res.status(409).json({ error: "Section is already included in this form template" });

  const source = sourceRows[0];
  const maxRows = await sql`
    select coalesce(max(sort_order), -10)::integer as max_sort_order
    from wizard_form_template_sections where form_template_id = ${templateId}::uuid
  `;
  const fixedPosition = Object.prototype.hasOwnProperty.call(body, "fixedPosition")
    ? (body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null)
    : source.fixed_position;
  const rows = await sql`
    insert into wizard_form_template_sections (
      form_template_id, section_id, section_key, sort_order, is_required,
      is_visible, order_change_allowed, user_reorder_allowed, fixed_position
    ) values (
      ${templateId}::uuid, ${source.id}::uuid, ${sectionKey},
      ${Object.prototype.hasOwnProperty.call(body, "sortOrder") ? normalizeNumber(body.sortOrder) : Number(maxRows[0].max_sort_order) + 10},
      ${normalizeBoolean(body.isRequired, source.is_required)},
      ${normalizeBoolean(body.isVisible, source.is_visible_in_wizard)},
      true, ${fixedPosition ? false : normalizeBoolean(body.userReorderAllowed, source.order_change_allowed)},
      ${fixedPosition || null}
    )
    returning id::text, form_template_id::text, section_id::text, section_key, sort_order,
      is_required, is_visible, order_change_allowed, user_reorder_allowed, fixed_position, created_at, updated_at
  `;
  return res.status(201).json({ ok: true, section: toTemplateSection(rows[0]) });
}

async function createOwnedSection(sql, template, body, res) {
  const name = String(body.name || "").trim();
  if (!name) return res.status(400).json({ error: "name is required" });
  const slug = String(body.sectionKey || name).trim().replace(/[^a-zA-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "section";
  const sectionKey = `${template.template_key}_${slug}_${Date.now().toString(36)}`;
  const fixedPosition = body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null;
  const maxRows = await sql`
    select coalesce(max(sort_order), -10)::integer as max_sort_order
    from wizard_form_template_sections where form_template_id = ${template.id}::uuid
  `;
  const rows = await sql`
    with new_section as (
      insert into wizard_content_sections (
        section_key, name, description, is_required, order_change_allowed,
        fixed_position, sort_order, is_visible_in_wizard, status, version,
        change_note, owner_form_template_id
      ) values (
        ${sectionKey}, ${name}, ${String(body.description || "")},
        ${normalizeBoolean(body.isRequired, false)}, true, ${fixedPosition},
        ${Number(maxRows[0].max_sort_order) + 10}, ${normalizeBoolean(body.isVisible, true)},
        'draft', 1, ${String(body.changeNote || "Template-owned section created.")}, ${template.id}::uuid
      ) returning id, section_key
    )
    insert into wizard_form_template_sections (
      form_template_id, section_id, section_key, sort_order, is_required,
      is_visible, order_change_allowed, user_reorder_allowed, fixed_position
    )
    select ${template.id}::uuid, id, section_key, ${Number(maxRows[0].max_sort_order) + 10},
      ${normalizeBoolean(body.isRequired, false)}, ${normalizeBoolean(body.isVisible, true)}, true,
      ${fixedPosition ? false : normalizeBoolean(body.userReorderAllowed, true)}, ${fixedPosition}
    from new_section
    returning id::text, form_template_id::text, section_id::text, section_key, sort_order,
      is_required, is_visible, order_change_allowed, user_reorder_allowed, fixed_position, created_at, updated_at
  `;
  return res.status(201).json({ ok: true, section: toTemplateSection({ ...rows[0], section_name: name, section_version: 1, section_status: "draft" }) });
}

async function updateSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const currentRows = await sql`
    select ts.id::text, ts.form_template_id::text, ts.section_id::text, ts.section_key, ts.sort_order,
      ts.is_required, ts.is_visible, ts.order_change_allowed, ts.user_reorder_allowed, ts.fixed_position,
      ts.created_at, ts.updated_at, template.template_key,
      source.owner_form_template_id::text as source_owner_template_id, source.status as source_status
    from wizard_form_template_sections ts
    join wizard_form_templates template on template.id = ts.form_template_id
    left join wizard_content_sections source on source.id = ts.section_id
    where ts.id = ${id}::uuid limit 1
  `;
  if (!currentRows.length) return res.status(404).json({ error: "Form template section not found" });
  const current = currentRows[0];
  await requireDraftTemplate(sql, current.form_template_id);
  if (current.section_id && (current.source_owner_template_id !== current.form_template_id || current.source_status !== "draft")) {
    const previousSectionKey = current.section_key;
    const ownedSectionKey = `${current.template_key}_${current.section_key}_edit_${Date.now().toString(36)}`
      .replace(/[^a-zA-Z0-9_]+/g, "_");
    const clonedRows = await sql`
      insert into wizard_content_sections (
        section_key, name, description, is_required, order_change_allowed, fixed_position,
        sort_order, is_visible_in_wizard, status, version, change_note, owner_form_template_id, ai_design
      )
      select ${ownedSectionKey}, name, description, is_required, order_change_allowed, fixed_position,
        sort_order, is_visible_in_wizard, 'draft', 1, 'Template-owned draft created for editing.',
        ${current.form_template_id}::uuid, ai_design
      from wizard_content_sections where id = ${current.section_id}::uuid
      returning id::text, section_key
    `;
    if (!clonedRows.length) return res.status(409).json({ error: "Section source could not be prepared for editing" });
    const clonedSection = clonedRows[0];
    await sql`
      insert into wizard_content_section_items (
        section_id, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed,
        sort_order, field_kind, text_type, image_allowed_sources, image_prompt_text, image_description_enabled,
        image_alt_text_required, image_aspect_ratio, image_max_size_kb,
        cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
        is_locked, locked_value
      )
      select ${clonedSection.id}::uuid, item_key, name, is_visible_in_wizard, is_required,
        user_reorder_allowed, sort_order, field_kind, text_type, image_allowed_sources,
        image_prompt_text, image_description_enabled, image_alt_text_required, image_aspect_ratio, image_max_size_kb,
        cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
        is_locked, locked_value
      from wizard_content_section_items where section_id = ${current.section_id}::uuid
    `;
    await sql`
      update wizard_form_template_sections
      set section_id = ${clonedSection.id}::uuid, section_key = ${clonedSection.section_key}, updated_at = now()
      where id = ${id}::uuid
    `;
    await remapLayoutSectionKey(sql, current.form_template_id, previousSectionKey, clonedSection.section_key);
    current.section_id = clonedSection.id;
    current.section_key = clonedSection.section_key;
  }
  if (current.section_id && (Object.prototype.hasOwnProperty.call(body, "name") || Object.prototype.hasOwnProperty.call(body, "description"))) {
    await sql`
      update wizard_content_sections set
        name = ${String(body.name || "").trim()},
        description = ${String(body.description || "")},
        updated_at = now()
      where id = ${current.section_id}::uuid
        and owner_form_template_id = ${current.form_template_id}::uuid
        and status = 'draft'
    `;
  }
  const fixedPosition = Object.prototype.hasOwnProperty.call(body, "fixedPosition")
    ? (body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null)
    : current.fixed_position;
  const rows = await sql`
    update wizard_form_template_sections set
      is_required = ${Object.prototype.hasOwnProperty.call(body, "isRequired") ? normalizeBoolean(body.isRequired, current.is_required) : current.is_required},
      is_visible = ${Object.prototype.hasOwnProperty.call(body, "isVisible") ? normalizeBoolean(body.isVisible, current.is_visible) : current.is_visible},
      order_change_allowed = true,
      user_reorder_allowed = ${fixedPosition ? false : (Object.prototype.hasOwnProperty.call(body, "userReorderAllowed") ? normalizeBoolean(body.userReorderAllowed, current.user_reorder_allowed) : current.user_reorder_allowed)},
      fixed_position = ${fixedPosition},
      updated_at = now()
    where id = ${id}::uuid
    returning id::text, form_template_id::text, section_id::text, section_key, sort_order,
      is_required, is_visible, order_change_allowed, user_reorder_allowed, fixed_position, created_at, updated_at
  `;
  const sections = await fetchTemplateSections(sql, current.form_template_id);
  return res.status(200).json({ ok: true, section: sections.find((section) => section.id === id) || toTemplateSection(rows[0]) });
}

async function removeSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const rows = await sql`
    select id::text, form_template_id::text, section_id::text from wizard_form_template_sections
    where id = ${id}::uuid limit 1
  `;
  if (!rows.length) return res.status(404).json({ error: "Form template section not found" });
  await requireDraftTemplate(sql, rows[0].form_template_id);
  const ownedRows = rows[0].section_id ? await sql`
    delete from wizard_content_sections
    where id = ${rows[0].section_id}::uuid
      and owner_form_template_id = ${rows[0].form_template_id}::uuid
      and status = 'draft'
    returning id::text
  ` : [];
  if (!ownedRows.length) await sql`delete from wizard_form_template_sections where id = ${id}::uuid`;
  return res.status(200).json({ ok: true, id });
}
