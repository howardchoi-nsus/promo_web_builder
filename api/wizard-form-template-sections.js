const {
  getSql, parseBody, normalizeBoolean, normalizeNumber,
  fetchTemplateRow, fetchTemplateSections, toTemplateSection,
} = require("./_wizard-form-templates-store");

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
  if (!sectionKey) return res.status(400).json({ error: "sectionKey is required" });
  const sql = getSql();
  await requireDraftTemplate(sql, templateId);
  const sourceRows = await sql`
    select section_key, is_required, order_change_allowed, fixed_position, is_visible_in_wizard
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
      form_template_id, section_key, sort_order, is_required,
      is_visible, order_change_allowed, fixed_position
    ) values (
      ${templateId}::uuid, ${sectionKey},
      ${Object.prototype.hasOwnProperty.call(body, "sortOrder") ? normalizeNumber(body.sortOrder) : Number(maxRows[0].max_sort_order) + 10},
      ${normalizeBoolean(body.isRequired, source.is_required)},
      ${normalizeBoolean(body.isVisible, source.is_visible_in_wizard)},
      ${fixedPosition ? false : normalizeBoolean(body.orderChangeAllowed, source.order_change_allowed)},
      ${fixedPosition || null}
    )
    returning id::text, form_template_id::text, section_key, sort_order,
      is_required, is_visible, order_change_allowed, fixed_position, created_at, updated_at
  `;
  return res.status(201).json({ ok: true, section: toTemplateSection(rows[0]) });
}

async function updateSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const currentRows = await sql`
    select id::text, form_template_id::text, section_key, sort_order,
      is_required, is_visible, order_change_allowed, fixed_position, created_at, updated_at
    from wizard_form_template_sections where id = ${id}::uuid limit 1
  `;
  if (!currentRows.length) return res.status(404).json({ error: "Form template section not found" });
  const current = currentRows[0];
  await requireDraftTemplate(sql, current.form_template_id);
  const fixedPosition = Object.prototype.hasOwnProperty.call(body, "fixedPosition")
    ? (body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null)
    : current.fixed_position;
  const rows = await sql`
    update wizard_form_template_sections set
      is_required = ${Object.prototype.hasOwnProperty.call(body, "isRequired") ? normalizeBoolean(body.isRequired, current.is_required) : current.is_required},
      is_visible = ${Object.prototype.hasOwnProperty.call(body, "isVisible") ? normalizeBoolean(body.isVisible, current.is_visible) : current.is_visible},
      order_change_allowed = ${fixedPosition ? false : (Object.prototype.hasOwnProperty.call(body, "orderChangeAllowed") ? normalizeBoolean(body.orderChangeAllowed, current.order_change_allowed) : current.order_change_allowed)},
      fixed_position = ${fixedPosition},
      updated_at = now()
    where id = ${id}::uuid
    returning id::text, form_template_id::text, section_key, sort_order,
      is_required, is_visible, order_change_allowed, fixed_position, created_at, updated_at
  `;
  return res.status(200).json({ ok: true, section: toTemplateSection(rows[0]) });
}

async function removeSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const rows = await sql`
    select id::text, form_template_id::text from wizard_form_template_sections
    where id = ${id}::uuid limit 1
  `;
  if (!rows.length) return res.status(404).json({ error: "Form template section not found" });
  await requireDraftTemplate(sql, rows[0].form_template_id);
  await sql`delete from wizard_form_template_sections where id = ${id}::uuid`;
  return res.status(200).json({ ok: true, id });
}
