const { getSql, parseBody, fetchTemplateRow, toFormTemplate } = require("./_wizard-form-templates-store");
const {
  fetchLayoutRow, toLayout, fetchTemplateWithItems, ensureLayout, validateLayoutSpec, normalizeDefaultContent,
  normalizeCompositionSnapshot, createLayoutIdentity,
} = require("./_wizard-form-template-layout-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getLayout(req, res);
    if (req.method === "PATCH") return await updateLayout(req, res);
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template layout API failed", message: error.message });
  }
};

async function getLayout(req, res) {
  const templateId = String(req.query.templateId || req.query.id || "").trim();
  if (!templateId) return res.status(400).json({ error: "templateId is required" });
  const sql = getSql();
  const detail = await fetchTemplateWithItems(sql, templateId);
  if (!detail) return res.status(404).json({ error: "Form template not found" });
  const row = await ensureLayout(sql, templateId);
  const template = toFormTemplate(detail.template);
  const layout = toLayout(row);
  const sections = layout.compositionSnapshot.length
    ? layout.compositionSnapshot
    : detail.sections;
  return res.status(200).json({
    ok: true,
    template,
    sections,
    layout,
    layoutIdentity: createLayoutIdentity(template, layout),
  });
}

async function updateLayout(req, res) {
  const body = parseBody(req.body);
  const templateId = String(body.templateId || body.id || "").trim();
  if (!templateId) return res.status(400).json({ error: "templateId is required" });
  const sql = getSql();
  const template = await fetchTemplateRow(sql, templateId);
  if (!template) return res.status(404).json({ error: "Form template not found" });
  if (template.status !== "draft") return res.status(409).json({ error: "Only draft form template layouts can be edited" });
  const current = toLayout(await ensureLayout(sql, templateId));
  const expectedRevision = Number(body.expectedRevision || current.layoutRevision);
  if (expectedRevision !== current.layoutRevision) {
    return res.status(409).json({ error: "Layout revision conflict", currentRevision: current.layoutRevision });
  }
  const detail = await fetchTemplateWithItems(sql, templateId);
  const compositionSnapshot = normalizeCompositionSnapshot(
    body.compositionSnapshot,
    current.compositionSnapshot.length ? current.compositionSnapshot : detail.sections,
  );
  const validation = validateLayoutSpec(body.layoutSpec, compositionSnapshot);
  if (!validation.ok) return res.status(422).json({ error: "Layout validation failed", validation });
  const defaultContent = normalizeDefaultContent(
    body.defaultContent === undefined ? current.defaultContent : body.defaultContent,
    compositionSnapshot,
  );
  const nextRevision = current.layoutRevision + 1;
  const rows = await sql`
    update wizard_form_template_layouts set
      renderer_key = ${String(body.rendererKey || current.rendererKey)},
      renderer_version = ${Number(body.rendererVersion || current.rendererVersion)},
      contract_version = ${validation.spec.contractVersion},
      layout_revision = ${nextRevision},
      layout_spec = ${JSON.stringify(validation.spec)}::jsonb,
      default_content = ${JSON.stringify(defaultContent)}::jsonb,
      composition_snapshot = ${JSON.stringify(compositionSnapshot)}::jsonb,
      validation_result = ${JSON.stringify(validation)}::jsonb,
      change_note = ${String(body.changeNote || "Template default layout updated.")},
      updated_at = now()
    where form_template_id = ${templateId}::uuid
      and layout_revision = ${current.layoutRevision}
    returning id::text, form_template_id::text, renderer_key, renderer_version,
      contract_version, layout_revision, layout_spec, default_content, composition_snapshot, validation_result,
      change_note, created_at, updated_at
  `;
  if (!rows.length) return res.status(409).json({ error: "Layout revision conflict" });
  await sql`
    insert into wizard_form_template_layout_histories (
      form_template_id, template_key, template_version, layout_id,
      previous_revision, new_revision, action, previous_spec, new_spec,
      previous_content, new_content, previous_composition, new_composition,
      validation_result, change_note
    ) values (
      ${templateId}::uuid, ${template.template_key}, ${Number(template.version || 1)},
      ${rows[0].id}::uuid, ${current.layoutRevision}, ${nextRevision}, 'update',
      ${JSON.stringify(current.layoutSpec)}::jsonb, ${JSON.stringify(validation.spec)}::jsonb,
      ${JSON.stringify(current.defaultContent)}::jsonb, ${JSON.stringify(defaultContent)}::jsonb,
      ${JSON.stringify(current.compositionSnapshot)}::jsonb, ${JSON.stringify(compositionSnapshot)}::jsonb,
      ${JSON.stringify(validation)}::jsonb,
      ${String(body.changeNote || "Template default layout updated.")}
    )
  `;
  const updatedLayout = toLayout(rows[0]);
  const publicTemplate = toFormTemplate(template);
  return res.status(200).json({
    ok: true,
    template: publicTemplate,
    layout: updatedLayout,
    layoutIdentity: createLayoutIdentity(publicTemplate, updatedLayout),
  });
}
