const { getSql } = require("./_wizard-content-sections-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const sectionId = String(req.query.sectionId || "").trim();
    if (!sectionId) return res.status(400).json({ error: "sectionId is required" });
    const rows = await getSql()`
      select template.id::text, template.template_key, template.name, template.version, template.status
      from wizard_form_template_sections membership
      join wizard_form_templates template on template.id = membership.form_template_id
      where membership.section_id = ${sectionId}::uuid and template.status in ('active', 'draft')
      order by template.name, template.version desc
    `;
    return res.status(200).json({ ok: true, templates: rows.map((row) => ({
      id: row.id, templateKey: row.template_key, name: row.name, version: Number(row.version), status: row.status,
    })) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section usage lookup failed", message: error.message });
  }
};
