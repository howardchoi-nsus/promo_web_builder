const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { fetchTemplateWithItems, fetchLayoutRow, toLayout } = require("./_wizard-form-template-layout-store");
const { toFormTemplate } = require("./_wizard-form-templates-store");
const {
  inputHash, defaultConstraints, normalizeBackgroundColor, resolveImageTarget, validatePatch, validateDesignPlan,
} = require("./_promo-section-design-contract");
const { fetchTokenVersion } = require("./_design-token-store");

const defaultDependencies = {
  getSql,
  parseBody,
  fetchRun,
  transitionRun,
  fetchTemplateWithItems,
  fetchLayoutRow,
  toLayout,
  toFormTemplate,
};

function createHandler(overrides = {}) {
  const dependencies = { ...defaultDependencies, ...overrides };
  return async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = dependencies.parseBody(req.body);
    const id = String(body.runId || body.id || "").trim();
    if (!id) return res.status(400).json({ error: "runId is required" });
    const sql = dependencies.getSql();
    const run = await dependencies.fetchRun(sql, id);
    if (!run) return res.status(404).json({ error: "Section design run not found" });
    if (run.status === "applied") return res.status(200).json({ ok: true, run });
    if (run.status !== "ready") return res.status(409).json({ error: "Only a ready run can be applied", run });
    const currentSectionInputs = body.sectionInputs && typeof body.sectionInputs === "object" ? body.sectionInputs : null;
    if (!currentSectionInputs) return res.status(400).json({ error: "sectionInputs is required" });
    if (inputHash(currentSectionInputs) !== inputHash(run.inputSnapshot?.section?.sectionInputs || {})) {
      return res.status(409).json({ error: "Section content changed; regenerate the design", code: "INPUT_HASH_MISMATCH" });
    }
    const generatedBackgroundColor = run.inputSnapshot?.design?.backgroundColor;
    if (generatedBackgroundColor) {
      const currentBackgroundColor = normalizeBackgroundColor(body.backgroundColor, "");
      if (!currentBackgroundColor || currentBackgroundColor !== generatedBackgroundColor) {
        return res.status(409).json({
          error: "Promotion background color changed; regenerate the design",
          code: "BACKGROUND_COLOR_MISMATCH",
        });
      }
    }
    const templateData = await dependencies.fetchTemplateWithItems(sql, run.formTemplateId);
    if (!templateData || templateData.template.status !== "active") {
      return res.status(409).json({ error: "The active template changed; regenerate the design", code: "TEMPLATE_NOT_ACTIVE" });
    }
    const template = dependencies.toFormTemplate(templateData.template);
    if (template.version !== run.templateVersion) {
      return res.status(409).json({
        error: "Template version changed; regenerate the design",
        code: "TEMPLATE_VERSION_MISMATCH",
        expectedVersion: run.templateVersion,
        currentVersion: template.version,
      });
    }
    if (run.tokenSetVersionId && template.designTokenSetVersionId !== run.tokenSetVersionId) {
      return res.status(409).json({ error: "Template design token set changed; regenerate the design", code: "TOKEN_SET_VERSION_MISMATCH" });
    }
    const layout = dependencies.toLayout(await dependencies.fetchLayoutRow(sql, run.formTemplateId));
    if (layout.layoutRevision !== run.layoutRevision) {
      return res.status(409).json({
        error: "Template layout changed; regenerate the design",
        code: "LAYOUT_REVISION_MISMATCH",
        expectedRevision: run.layoutRevision,
        currentRevision: layout.layoutRevision,
      });
    }
    const section = templateData.sections.find((item) => (
      item.sectionKey === run.sectionKey && item.isVisible !== false
    ));
    if (!section) {
      return res.status(409).json({ error: "Template section changed; regenerate the design", code: "SECTION_DEFINITION_MISMATCH" });
    }
    const currentComponentVersions = (section.items || []).map((item) => ({
      itemKey: item.itemKey, componentId: item.componentId,
      componentVersionId: item.componentVersionId, version: item.componentVersion,
    }));
    if ((run.componentVersionsSnapshot || []).length
      && inputHash(currentComponentVersions) !== inputHash(run.componentVersionsSnapshot)) {
      return res.status(409).json({ error: "Section component versions changed; regenerate the design", code: "COMPONENT_VERSION_MISMATCH" });
    }
    const savedImageTarget = run.constraintsSnapshot?.imageTarget;
    const targetResolution = resolveImageTarget(
      defaultConstraints(section, layout.layoutSpec),
      run.sectionKey,
      savedImageTarget?.type === "item" ? savedImageTarget.itemKey : "",
      savedImageTarget?.type || ""
    );
    const currentConstraints = targetResolution.constraints;
    if (!targetResolution.ok) {
      return res.status(409).json({ error: "Section AI image target changed; regenerate the design", code: "CONSTRAINTS_MISMATCH" });
    }
    if (inputHash(currentConstraints) !== inputHash(run.constraintsSnapshot || {})) {
      return res.status(409).json({ error: "Section AI policy changed; regenerate the design", code: "CONSTRAINTS_MISMATCH" });
    }
    const tokenSet = run.tokenSetVersionId ? await fetchTokenVersion(sql, run.tokenSetVersionId) : null;
    const validation = run.designPlan
      ? validateDesignPlan(section, run.designPlan, currentConstraints, tokenSet)
      : validatePatch(section, run.layoutResult || {}, currentConstraints);
    if (!validation.ok) {
      return res.status(409).json({
        error: "Section design no longer satisfies the current template policy",
        code: "APPLY_VALIDATION_FAILED",
        validationErrors: validation.errors,
      });
    }
    const applied = await dependencies.transitionRun(sql, id, ["ready"], "applied");
    if (!applied) return res.status(409).json({ error: "Section design run changed before apply", code: "APPLY_STATE_CONFLICT" });
    return res.status(200).json({ ok: true, run: applied });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section design apply failed", message: error.message });
  }
  };
}

const handler = createHandler();
handler.createHandler = createHandler;
module.exports = handler;
