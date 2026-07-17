const {
  getSql, parseBody, fetchTemplateRow, toFormTemplate, validateTemplateDraft,
} = require("./_wizard-form-templates-store");
const {
  ensureLayout, toLayout, fetchTemplateWithItems, validateLayoutSpec,
} = require("./_wizard-form-template-layout-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const id = String(body.id || req.query.id || "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });
    const sql = getSql();
    const current = await fetchTemplateRow(sql, id);
    if (!current) return res.status(404).json({ error: "Form template not found" });
    if (current.status === "active") return res.status(409).json({ error: "This form template is already active" });
    if (current.status === "archived") return res.status(409).json({ error: "Archived form templates cannot be activated" });
    if (!current.is_default) {
      const defaultRows = await sql`
        select id::text from wizard_form_templates
        where status = 'active' and is_default = true and template_key <> ${current.template_key}
        limit 1
      `;
      const replacingDefaultRows = await sql`
        select id::text from wizard_form_templates
        where status = 'active' and is_default = true and template_key = ${current.template_key}
        limit 1
      `;
      if (replacingDefaultRows.length && !defaultRows.length) {
        return res.status(422).json({ error: "Another active default form template is required before removing this default" });
      }
    }
    const errors = await validateTemplateDraft(sql, id);
    const detail = await fetchTemplateWithItems(sql, id);
    const layout = toLayout(await ensureLayout(sql, id));
    const layoutValidation = validateLayoutSpec(layout.layoutSpec, detail?.sections || []);
    if (!layoutValidation.ok) {
      return res.status(422).json({ error: "Form template layout validation failed", validation: layoutValidation });
    }
    if (errors.length) return res.status(422).json({ error: "Form template validation failed", errors });
    await sql`select activate_wizard_form_template_owned_sections(${id}::uuid)`;
    await sql`select activate_wizard_form_template(
      ${id}::uuid, ${String(body.changeNote || "Form template activated from Admin Page.").trim()}
    )`;
    const updated = await fetchTemplateRow(sql, id);
    await sql`
      insert into wizard_form_template_layout_histories (
        form_template_id, template_key, template_version, layout_id,
        previous_revision, new_revision, action, previous_spec, new_spec,
        validation_result, change_note
      ) values (
        ${id}::uuid, ${updated.template_key}, ${Number(updated.version || 1)},
        ${layout.id}::uuid, ${layout.layoutRevision}, ${layout.layoutRevision}, 'activate',
        ${JSON.stringify(layout.layoutSpec)}::jsonb, ${JSON.stringify(layout.layoutSpec)}::jsonb,
        ${JSON.stringify(layoutValidation)}::jsonb,
        ${String(body.changeNote || "Form template and default layout activated.")}
      )
    `;
    return res.status(200).json({ ok: true, template: toFormTemplate(updated) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template activation failed", message: error.message });
  }
};
