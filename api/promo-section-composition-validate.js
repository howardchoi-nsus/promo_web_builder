const { getSql, parseBody } = require("./_promo-section-design-store");
const {
  normalizeCompositionPlan,
  stableFingerprint,
  compositionOptionsFromBody,
} = require("./_promo-section-composition-contract");
const { loadCompositionContext } = require("./_promo-section-composition-context");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const formTemplateId = String(body.formTemplateId || "").trim();
    const sectionKey = String(body.sectionKey || "").trim();
    const instruction = String(body.instruction || "").trim();
    const fingerprint = String(body.fingerprint || "").trim();
    const inputFingerprint = String(body.inputFingerprint || "").trim();
    const rawPlan = body.rawPlan && typeof body.rawPlan === "object" && !Array.isArray(body.rawPlan) ? body.rawPlan : null;
    const sectionInputs = body.sectionInputs && typeof body.sectionInputs === "object" && !Array.isArray(body.sectionInputs)
      ? body.sectionInputs : {};
    if (!formTemplateId || !sectionKey || !fingerprint || !inputFingerprint || !rawPlan) {
      return res.status(400).json({ error: "formTemplateId, sectionKey, fingerprints, and rawPlan are required" });
    }
    const context = await loadCompositionContext(getSql(), formTemplateId, sectionKey);
    if (context.fingerprint !== fingerprint) {
      return res.status(409).json({
        error: "Template, component, or design token configuration changed. Generate a new proposal.",
        code: "COMPOSITION_CONTEXT_CHANGED",
      });
    }
    if (stableFingerprint(sectionInputs) !== inputFingerprint) {
      return res.status(409).json({
        error: "Section content changed after the proposal was generated. Generate a new proposal.",
        code: "COMPOSITION_INPUT_CHANGED",
      });
    }
    const proposal = normalizeCompositionPlan({
      plan: rawPlan,
      instruction,
      section: context.section,
      sectionInputs,
      tokenSet: context.tokenSet,
      ...compositionOptionsFromBody(body),
    });
    return res.status(200).json({ ok: true, fingerprint: context.fingerprint, proposal });
  } catch (error) {
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Section composition validation failed",
      message: error.message,
      code: error.code || null,
    });
  }
};
