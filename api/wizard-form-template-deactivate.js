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
    if (current.status !== "active") {
      return res.status(409).json({ error: "Only active form templates can be deactivated" });
    }
    if (current.is_default) {
      return res.status(409).json({ error: "The active default template cannot be deactivated. Activate another default template first." });
    }

    const changeNote = String(body.changeNote || "Form template deactivated from Admin Page.").trim();
    const rows = await sql`
      with updated as (
        update wizard_form_templates
        set status = 'inactive', is_default = false,
          change_note = ${changeNote}, updated_at = now()
        where id = ${id}::uuid
          and status = 'active'
          and is_default = false
          and exists (
            select 1 from wizard_form_templates other
            where other.status = 'active' and other.id <> ${id}::uuid
          )
        returning *
      ), history as (
        insert into wizard_form_template_histories (
          template_key, form_template_id, previous_version, new_version,
          previous_status, new_status, change_note
        )
        select template_key, id, version, version, 'active', 'inactive', ${changeNote}
        from updated
        returning id
      )
      select id::text, template_key, name, description, status, version,
        is_default, change_note, design_token_set_version_id::text,
        archived_at, created_at, updated_at
      from updated
    `;
    if (!rows.length) {
      return res.status(409).json({ error: "At least one active form template must remain" });
    }
    return res.status(200).json({ ok: true, template: toFormTemplate(rows[0]) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template deactivation failed", message: error.message });
  }
};
