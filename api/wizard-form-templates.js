const {
  getSql, parseBody, createTemplateKey, fetchTemplates, fetchTemplateRow, toFormTemplate,
  normalizeRecommendationProfile, recommendationProfileColumnAvailable,
} = require("./_wizard-form-templates-store");
const { ensureLayout, cloneLayout } = require("./_wizard-form-template-layout-store");

async function saveRecommendationProfile(sql, templateId, profile) {
  if (!await recommendationProfileColumnAvailable(sql)) return;
  const normalized = normalizeRecommendationProfile(profile);
  await sql`
    update wizard_form_templates
    set recommendation_profile = ${JSON.stringify(normalized)}::jsonb, updated_at = now()
    where id = ${templateId}::uuid
  `;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const sql = getSql();
      const scope = String(req.query.scope || "").toLowerCase();
      const templates = await fetchTemplates(sql, {
        activeOnly: scope === "public",
        includeArchived: String(req.query.includeArchived || "").toLowerCase() === "true",
      });
      return res.status(200).json({ ok: true, templates });
    }
    if (req.method === "POST") return await createTemplate(req, res);
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form templates API failed", message: error.message });
  }
};

async function createTemplate(req, res) {
  const body = parseBody(req.body);
  const sql = getSql();
  const duplicateSourceId = String(body.sourceId || "").trim();
  if (duplicateSourceId) {
    const templateKey = String(body.templateKey || "").trim() || createTemplateKey();
    const name = String(body.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(templateKey)) {
      return res.status(400).json({ error: "templateKey must start with a letter and contain only letters, numbers, and underscores" });
    }
    const duplicateKeyRows = await sql`
      select id::text from wizard_form_templates where template_key = ${templateKey} limit 1
    `;
    if (duplicateKeyRows.length) return res.status(409).json({ error: "templateKey already exists" });
    const sourceTemplate = await fetchTemplateRow(sql, duplicateSourceId);
    if (!sourceTemplate) {
      return res.status(404).json({ error: "Source form template not found" });
    }
    const rows = await sql`
      select duplicate_wizard_form_template(
        ${duplicateSourceId}::uuid, ${templateKey}, ${name}, ${String(body.description || "")},
        ${String(body.changeNote || "Form template duplicated from Admin Page.")}
      )::text as id
    `;
    const row = await fetchTemplateRow(sql, rows[0]?.id);
    await saveRecommendationProfile(sql, row.id, sourceTemplate.recommendation_profile);
    await cloneLayout(sql, duplicateSourceId, row.id);
    return res.status(201).json({ ok: true, template: toFormTemplate(await fetchTemplateRow(sql, row.id)) });
  }

  const sourceId = String(body.id || "").trim();
  if (sourceId) {
    const sourceTemplate = await fetchTemplateRow(sql, sourceId);
    if (!sourceTemplate) {
      return res.status(404).json({ error: "Source form template not found" });
    }
    const rows = await sql`
      select clone_wizard_form_template_draft(
        ${sourceId}::uuid,
        ${String(body.changeNote || "Draft created from Admin Page.").trim()}
      )::text as id
    `;
    await sql`
      update wizard_form_templates
      set design_token_set_version_id = null, updated_at = now()
      where id = ${rows[0]?.id}::uuid
    `;
    const row = await fetchTemplateRow(sql, rows[0]?.id);
    await saveRecommendationProfile(sql, row.id, sourceTemplate.recommendation_profile);
    await cloneLayout(sql, sourceId, row.id);
    return res.status(201).json({ ok: true, template: toFormTemplate(await fetchTemplateRow(sql, row.id)) });
  }

  const templateKey = String(body.templateKey || "").trim() || createTemplateKey();
  const name = String(body.name || "").trim();
  if (!name) return res.status(400).json({ error: "name is required" });
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(templateKey)) {
    return res.status(400).json({ error: "templateKey must start with a letter and contain only letters, numbers, and underscores" });
  }
  const existing = await sql`select id::text from wizard_form_templates where template_key = ${templateKey} limit 1`;
  if (existing.length) return res.status(409).json({ error: "templateKey already exists" });

  const rows = await sql`
    insert into wizard_form_templates (
      template_key, name, description, status, version, is_default, change_note
    ) values (
      ${templateKey}, ${name}, ${String(body.description || "")}, 'draft', 1, false,
      ${String(body.changeNote || "Form template created from Admin Page.")}
    )
    returning id::text, template_key, name, description, status, version,
      is_default, change_note, design_token_set_version_id::text, archived_at, created_at, updated_at
  `;
  await ensureLayout(sql, rows[0].id);
  await saveRecommendationProfile(sql, rows[0].id, body.recommendationProfile);
  return res.status(201).json({ ok: true, template: toFormTemplate(await fetchTemplateRow(sql, rows[0].id)) });
}
