const {
  getSql, parseBody, fetchTemplateRow, toFormTemplate,
} = require("./_wizard-form-templates-store");

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
    if (current.status === "active") return res.status(409).json({ error: "Active form templates cannot be archived directly" });
    if (current.status === "archived") return res.status(409).json({ error: "Form template is already archived" });
    const rows = await sql`
      update wizard_form_templates set status = 'archived', is_default = false,
        archived_at = now(), change_note = ${String(body.changeNote || "Form template archived from Admin Page.")}, updated_at = now()
      where id = ${id}::uuid
      returning id::text, template_key, name, description, status, version,
        is_default, change_note, archived_at, created_at, updated_at
    `;
    return res.status(200).json({ ok: true, template: toFormTemplate(rows[0]) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template archive failed", message: error.message });
  }
};
