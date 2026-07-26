const {
  getSql, parseBody, normalizeBoolean, fetchTemplateRow,
  fetchTemplateSections, toFormTemplate,
} = require("./_wizard-form-templates-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getTemplate(req, res);
    if (req.method === "PATCH") return await updateTemplate(req, res);
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template API failed", message: error.message });
  }
};

async function getTemplate(req, res) {
  const id = String(req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const row = await fetchTemplateRow(sql, id);
  if (!row) return res.status(404).json({ error: "Form template not found" });
  const sections = await fetchTemplateSections(sql, id);
  return res.status(200).json({ ok: true, template: toFormTemplate(row), sections });
}

async function updateTemplate(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const current = await fetchTemplateRow(sql, id);
  if (!current) return res.status(404).json({ error: "Form template not found" });
  if (current.status !== "draft") return res.status(409).json({ error: "Only draft form templates can be edited directly" });

  const name = Object.prototype.hasOwnProperty.call(body, "name") ? String(body.name || "").trim() : current.name;
  if (!name) return res.status(400).json({ error: "name is required" });
  const hasDesignTokenUpdate = Object.prototype.hasOwnProperty.call(body, "designTokenSetVersionId");
  const designTokenSetVersionId = hasDesignTokenUpdate
    ? String(body.designTokenSetVersionId || "").trim()
    : current.design_token_set_version_id;
  if (hasDesignTokenUpdate && !designTokenSetVersionId) {
    return res.status(400).json({ error: "designTokenSetVersionId is required" });
  }
  if (hasDesignTokenUpdate) {
    const activeTokenVersions = await sql`
      select version.id::text
      from promo_design_token_set_versions version
      join promo_design_token_sets token_set on token_set.id = version.token_set_id
      where version.id = ${designTokenSetVersionId}::uuid
        and version.status = 'active'
        and token_set.status = 'active'
      limit 1
    `;
    if (!activeTokenVersions.length) {
      return res.status(422).json({ error: "Only an active design token version can be assigned" });
    }
  }
  const rows = await sql`
    update wizard_form_templates set
      name = ${name},
      description = ${Object.prototype.hasOwnProperty.call(body, "description") ? String(body.description || "") : current.description || ""},
      is_default = ${Object.prototype.hasOwnProperty.call(body, "isDefault") ? normalizeBoolean(body.isDefault, current.is_default) : current.is_default},
      design_token_set_version_id = ${designTokenSetVersionId}::uuid,
      change_note = ${String(body.changeNote || "Form template draft updated.")},
      updated_at = now()
    where id = ${id}::uuid
    returning id::text, template_key, name, description, status, version,
      is_default, change_note, design_token_set_version_id::text, archived_at, created_at, updated_at
  `;
  return res.status(200).json({ ok: true, template: toFormTemplate(rows[0]) });
}
