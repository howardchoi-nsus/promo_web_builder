const {
  getSql, parseBody, normalizeBoolean, normalizeNumber,
  fetchTemplateRow, fetchTemplateSections,
} = require("./_wizard-form-templates-store");
const { normalizeAiDesign } = require("./_wizard-content-sections-store");

async function requireDraftTemplate(sql, templateId) {
  const template = await fetchTemplateRow(sql, templateId);
  if (!template) { const error = new Error("Form template not found"); error.statusCode = 404; throw error; }
  if (template.status !== "draft") { const error = new Error("Only draft templates can change section membership"); error.statusCode = 409; throw error; }
  return template;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const templateId = String(req.query.templateId || "").trim();
      if (!templateId) return res.status(400).json({ error: "templateId is required" });
      const sql = getSql();
      if (!await fetchTemplateRow(sql, templateId)) return res.status(404).json({ error: "Form template not found" });
      return res.status(200).json({ ok: true, sections: await fetchTemplateSections(sql, templateId) });
    }
    if (req.method === "POST") return await addSection(req, res);
    if (req.method === "PATCH") return await updateMembership(req, res);
    if (req.method === "DELETE") return await removeSection(req, res);
    res.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template sections API failed", message: error.message });
  }
};

async function addSection(req, res) {
  const body = parseBody(req.body);
  const templateId = String(body.templateId || "").trim();
  const sectionId = String(body.sectionId || "").trim();
  if (!templateId || !sectionId) return res.status(400).json({ error: "templateId and sectionId are required" });
  if (body.createNew === true) return res.status(400).json({ error: "Create and activate a section in Section Management before adding it" });
  const sql = getSql();
  await requireDraftTemplate(sql, templateId);
  const sourceRows = await sql`
    select id::text, section_key, is_required, order_change_allowed, fixed_position, is_visible_in_wizard, ai_design
    from wizard_content_sections where id = ${sectionId}::uuid and status in ('draft', 'active') limit 1
  `;
  if (!sourceRows.length) return res.status(422).json({ error: "sectionId must reference a draft or active section version" });
  const source = sourceRows[0];
  const duplicate = await sql`
    select id::text from wizard_form_template_sections
    where form_template_id = ${templateId}::uuid and section_key = ${source.section_key} limit 1
  `;
  if (duplicate.length) return res.status(409).json({ error: "Section is already included in this template" });
  const maxRows = await sql`select coalesce(max(sort_order), -10)::integer as value from wizard_form_template_sections where form_template_id = ${templateId}::uuid`;
  const fixedPosition = source.fixed_position || null;
  const rows = await sql`
    insert into wizard_form_template_sections (
      form_template_id, section_id, section_key, sort_order, is_required, is_visible,
      order_change_allowed, user_reorder_allowed, fixed_position, ai_design
    ) values (
      ${templateId}::uuid, ${sectionId}::uuid, ${source.section_key},
      ${Object.prototype.hasOwnProperty.call(body, "sortOrder") ? normalizeNumber(body.sortOrder) : Number(maxRows[0].value) + 10},
      ${normalizeBoolean(body.isRequired, source.is_required)}, ${normalizeBoolean(body.isVisible, source.is_visible_in_wizard)},
      true, ${fixedPosition ? false : normalizeBoolean(body.userReorderAllowed, source.order_change_allowed)}, ${fixedPosition},
      ${JSON.stringify(normalizeAiDesign(source.ai_design))}::jsonb
    ) returning id::text
  `;
  const sections = await fetchTemplateSections(sql, templateId);
  return res.status(201).json({ ok: true, section: sections.find((section) => section.id === rows[0].id) });
}

async function updateMembership(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const forbidden = ["componentId", "componentVersionId", "sectionId", "sectionKey", "items", "name", "description"]
    .filter((key) => Object.prototype.hasOwnProperty.call(body, key));
  if (forbidden.length) return res.status(400).json({ error: "Section definitions cannot be changed from Template Management", fields: forbidden });
  const sql = getSql();
  const current = await sql`select * from wizard_form_template_sections where id = ${id}::uuid limit 1`;
  if (!current.length) return res.status(404).json({ error: "Template section membership not found" });
  await requireDraftTemplate(sql, current[0].form_template_id);
  const fixedPosition = current[0].fixed_position || null;
  await sql`
    update wizard_form_template_sections set
      is_required = ${Object.prototype.hasOwnProperty.call(body, "isRequired") ? normalizeBoolean(body.isRequired, current[0].is_required) : current[0].is_required},
      is_visible = ${Object.prototype.hasOwnProperty.call(body, "isVisible") ? normalizeBoolean(body.isVisible, current[0].is_visible) : current[0].is_visible},
      user_reorder_allowed = ${fixedPosition ? false : (Object.prototype.hasOwnProperty.call(body, "userReorderAllowed") ? normalizeBoolean(body.userReorderAllowed, current[0].user_reorder_allowed) : current[0].user_reorder_allowed)},
      ai_design = ${JSON.stringify(Object.prototype.hasOwnProperty.call(body, "aiDesign")
        ? normalizeAiDesign(body.aiDesign)
        : normalizeAiDesign(current[0].ai_design))}::jsonb,
      updated_at = now() where id = ${id}::uuid
  `;
  const sections = await fetchTemplateSections(sql, current[0].form_template_id);
  return res.status(200).json({ ok: true, section: sections.find((section) => section.id === id) });
}

async function removeSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const rows = await sql`select form_template_id::text from wizard_form_template_sections where id = ${id}::uuid limit 1`;
  if (!rows.length) return res.status(404).json({ error: "Template section membership not found" });
  await requireDraftTemplate(sql, rows[0].form_template_id);
  await sql`delete from wizard_form_template_sections where id = ${id}::uuid`;
  return res.status(200).json({ ok: true, id });
}
