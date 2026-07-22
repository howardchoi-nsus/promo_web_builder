const {
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  fetchTemplateRow,
  fetchTemplateSections,
  toTemplateSection,
} = require("./_wizard-form-templates-store");

const COMPONENT_DEFINITION_FIELDS = [
  "name",
  "description",
  "aiDesign",
  "items",
  "sectionKey",
  "componentId",
];

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await listSections(req, res);
    if (req.method === "POST") return await addSection(req, res);
    if (req.method === "PATCH") return await updateSection(req, res);
    if (req.method === "DELETE") return await removeSection(req, res);
    res.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard form template sections API failed",
      message: error.message,
    });
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
    const error = new Error("Only draft form templates can change component membership");
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
  const componentId = String(body.componentId || "").trim();
  const legacySectionKey = String(body.sectionKey || "").trim();
  if (!templateId) return res.status(400).json({ error: "templateId is required" });
  if (body.createNew === true) {
    return res.status(400).json({
      error: "Create components in Component Management before adding them to a template",
    });
  }
  if (!componentId && !legacySectionKey) {
    return res.status(400).json({ error: "componentId is required" });
  }

  const sql = getSql();
  await requireDraftTemplate(sql, templateId);
  const sourceRows = componentId
    ? await sql`
      select component.id::text as component_id, component.component_key,
        section.is_required, section.order_change_allowed, section.fixed_position,
        section.is_visible_in_wizard
      from wizard_section_components component
      join wizard_content_sections section
        on section.component_id = component.id and section.status = 'active'
      where component.id = ${componentId}::uuid
      limit 1
    `
    : await sql`
      select component.id::text as component_id, component.component_key,
        section.is_required, section.order_change_allowed, section.fixed_position,
        section.is_visible_in_wizard
      from wizard_section_components component
      join wizard_content_sections section
        on section.component_id = component.id and section.status = 'active'
      where component.component_key = ${legacySectionKey}
      limit 1
    `;
  if (!sourceRows.length) {
    return res.status(422).json({ error: "componentId needs an active component version" });
  }
  const source = sourceRows[0];
  const duplicate = await sql`
    select id::text from wizard_form_template_sections
    where form_template_id = ${templateId}::uuid
      and component_id = ${source.component_id}::uuid
    limit 1
  `;
  if (duplicate.length) {
    return res.status(409).json({ error: "Component is already included in this form template" });
  }

  const maxRows = await sql`
    select coalesce(max(sort_order), -10)::integer as max_sort_order
    from wizard_form_template_sections where form_template_id = ${templateId}::uuid
  `;
  const fixedPosition = Object.prototype.hasOwnProperty.call(body, "fixedPosition")
    ? (body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null)
    : source.fixed_position;
  const rows = await sql`
    insert into wizard_form_template_sections (
      form_template_id, component_id, section_id, section_key, sort_order, is_required,
      is_visible, order_change_allowed, user_reorder_allowed, fixed_position
    ) values (
      ${templateId}::uuid, ${source.component_id}::uuid, null, ${source.component_key},
      ${Object.prototype.hasOwnProperty.call(body, "sortOrder")
        ? normalizeNumber(body.sortOrder)
        : Number(maxRows[0].max_sort_order) + 10},
      ${normalizeBoolean(body.isRequired, source.is_required)},
      ${normalizeBoolean(body.isVisible, source.is_visible_in_wizard)},
      true,
      ${fixedPosition ? false : normalizeBoolean(body.userReorderAllowed, source.order_change_allowed)},
      ${fixedPosition || null}
    )
    returning id::text, form_template_id::text, component_id::text, section_id::text,
      section_key, sort_order, is_required, is_visible, order_change_allowed,
      user_reorder_allowed, fixed_position, created_at, updated_at
  `;
  const sections = await fetchTemplateSections(sql, templateId);
  return res.status(201).json({
    ok: true,
    section: sections.find((section) => section.id === rows[0].id) || toTemplateSection(rows[0]),
  });
}

async function updateSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const forbiddenFields = COMPONENT_DEFINITION_FIELDS.filter((field) => (
    Object.prototype.hasOwnProperty.call(body, field)
  ));
  if (forbiddenFields.length) {
    return res.status(400).json({
      error: "Component definitions cannot be changed from Template Management",
      fields: forbiddenFields,
    });
  }

  const sql = getSql();
  const currentRows = await sql`
    select id::text, form_template_id::text, component_id::text, section_id::text,
      section_key, sort_order, is_required, is_visible, order_change_allowed,
      user_reorder_allowed, fixed_position, created_at, updated_at
    from wizard_form_template_sections where id = ${id}::uuid limit 1
  `;
  if (!currentRows.length) return res.status(404).json({ error: "Form template component not found" });
  const current = currentRows[0];
  await requireDraftTemplate(sql, current.form_template_id);
  const fixedPosition = Object.prototype.hasOwnProperty.call(body, "fixedPosition")
    ? (body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null)
    : current.fixed_position;

  await sql`
    update wizard_form_template_sections set
      is_required = ${Object.prototype.hasOwnProperty.call(body, "isRequired")
        ? normalizeBoolean(body.isRequired, current.is_required)
        : current.is_required},
      is_visible = ${Object.prototype.hasOwnProperty.call(body, "isVisible")
        ? normalizeBoolean(body.isVisible, current.is_visible)
        : current.is_visible},
      order_change_allowed = true,
      user_reorder_allowed = ${fixedPosition
        ? false
        : (Object.prototype.hasOwnProperty.call(body, "userReorderAllowed")
          ? normalizeBoolean(body.userReorderAllowed, current.user_reorder_allowed)
          : current.user_reorder_allowed)},
      fixed_position = ${fixedPosition},
      updated_at = now()
    where id = ${id}::uuid
  `;
  const sections = await fetchTemplateSections(sql, current.form_template_id);
  return res.status(200).json({
    ok: true,
    section: sections.find((section) => section.id === id) || null,
  });
}

async function removeSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const rows = await sql`
    select id::text, form_template_id::text
    from wizard_form_template_sections where id = ${id}::uuid limit 1
  `;
  if (!rows.length) return res.status(404).json({ error: "Form template component not found" });
  await requireDraftTemplate(sql, rows[0].form_template_id);
  await sql`delete from wizard_form_template_sections where id = ${id}::uuid`;
  return res.status(200).json({ ok: true, id });
}

module.exports.COMPONENT_DEFINITION_FIELDS = COMPONENT_DEFINITION_FIELDS;
