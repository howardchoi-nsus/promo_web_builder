const { getSql, parseBody } = require("./_promo-section-design-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateSectionCompositionPlan } = require("./_promo-section-design-provider");
const {
  normalizeCompositionPlan,
  stableFingerprint,
  compositionOptionsFromBody,
  allowedTokenBindings,
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
    const sectionInputs = body.sectionInputs && typeof body.sectionInputs === "object" && !Array.isArray(body.sectionInputs)
      ? body.sectionInputs : {};
    const currentLayout = body.currentLayout && typeof body.currentLayout === "object" && !Array.isArray(body.currentLayout)
      ? body.currentLayout : {};
    if (!formTemplateId || !sectionKey) return res.status(400).json({ error: "formTemplateId and sectionKey are required" });
    if (instruction.length < 3 || instruction.length > 4000) {
      return res.status(422).json({ error: "Instruction must be between 3 and 4000 characters" });
    }
    const sql = getSql();
    const context = await loadCompositionContext(
      sql,
      formTemplateId,
      sectionKey,
      String(body.designTokenSetVersionId || "").trim()
    );
    const options = compositionOptionsFromBody(body);
    const constraints = {
      existingComponentsOnly: true,
      preserveLockedValues: true,
      preserveUnmentionedComponents: true,
      allowedRegions: ["left", "center", "right"],
      allowArbitraryCss: false,
      allowInventedUrls: false,
      designScope: options.scope,
      allowedTokenBindings: allowedTokenBindings(context.section, context.tokenSet),
    };
    const promptSnapshot = await createPromptExecutionSnapshot(sql, "section_composition_planner", {
      instruction,
      sectionJson: JSON.stringify({ ...context.sectionContract, currentLayout }),
      contentJson: JSON.stringify(sectionInputs),
      constraintsJson: JSON.stringify(constraints),
      tokenSetJson: JSON.stringify(context.tokens),
      generateBackgroundImage: String(options.generateBackgroundImage),
      imageGuidance: options.imageGuidance,
    });
    const generation = await generateSectionCompositionPlan({ promptConfig: promptSnapshot.promptConfig });
    const proposal = normalizeCompositionPlan({
      plan: generation.result,
      instruction,
      section: context.section,
      sectionInputs,
      tokenSet: context.tokenSet,
      ...options,
    });
    return res.status(200).json({
      ok: true,
      fingerprint: context.fingerprint,
      inputFingerprint: stableFingerprint(sectionInputs),
      layoutFingerprint: stableFingerprint(currentLayout),
      rawPlan: generation.result,
      proposal,
      prompt: {
        id: promptSnapshot.promptConfig.promptId,
        version: promptSnapshot.promptConfig.promptVersion,
        hash: promptSnapshot.promptConfig.renderedPromptHash,
      },
      provider: generation.provider,
      usage: generation.usage,
    });
  } catch (error) {
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Section composition planning failed",
      message: error.message,
      code: error.code || null,
    });
  }
};
