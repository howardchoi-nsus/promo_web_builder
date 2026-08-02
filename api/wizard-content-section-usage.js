const { getSql } = require("./_wizard-content-sections-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const sectionId = String(req.query.sectionId || "").trim();
    if (!sectionId) return res.status(400).json({ error: "sectionId is required" });
    const rows = await getSql()`
      with target_section as (
        select section_key
        from wizard_content_sections
        where id = ${sectionId}::uuid
        limit 1
      )
      select distinct template.id::text, template.template_key, template.name, template.version, template.status
      from wizard_form_template_sections membership
      join wizard_form_templates template on template.id = membership.form_template_id
      where (
          membership.section_key in (select section_key from target_section)
          or membership.section_id in (
            select section.id
            from wizard_content_sections section
            where section.section_key in (select section_key from target_section)
          )
        )
        and template.status in ('active', 'draft')
      order by template.name, template.version desc
    `;
    return res.status(200).json({ ok: true, templates: rows.map((row) => ({
      id: row.id, templateKey: row.template_key, name: row.name, version: Number(row.version), status: row.status,
    })) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section usage lookup failed", message: error.message });
  }
};
