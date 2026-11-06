const { resolveAdminOwner } = require("./_promo-admin-auth");
const { parseBody } = require("./_wizard-form-templates-store");
const { getSql, normalizeInput } = require("./_layout-reference-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateStructuredVisionResult, isRetryableProviderError } = require("./_promo-section-design-provider");
const { validateRemoteImageUrl } = require("./_safe-remote-image");
const { toAiExecutionDisplay } = require("./_ai-execution-display");
const {
  LAYOUT_REFERENCE_ANALYSIS_SCHEMA,
  normalizeLayoutReferenceAnalysis,
} = require("./_layout-reference-analysis-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  let promptSnapshot = null;
  try {
    res.setHeader("Cache-Control", "private, no-store");
    resolveAdminOwner(req, res);
    const body = parseBody(req.body);
    const normalized = normalizeInput({
      title: String(body.title || "AI analysis draft").trim() || "AI analysis draft",
      sourceUrl: body.sourceUrl,
      previewImageUrl: body.previewImageUrl,
      sourceSite: body.sourceSite,
      pageType: body.pageType,
      industry: body.industry,
      promotionGoal: body.promotionGoal,
      viewport: body.viewport,
      qualityScores: {},
    });
    if (!normalized.previewImageUrl) {
      return res.status(422).json({ error: "previewImageUrl is required", code: "LAYOUT_REFERENCE_IMAGE_REQUIRED" });
    }
    const imageHost = new URL(normalized.previewImageUrl).hostname;
    await validateRemoteImageUrl(normalized.previewImageUrl, { allowedHosts: [imageHost] });
    const context = {
      pageType: normalized.pageType,
      industry: normalized.industry,
      promotionGoal: normalized.promotionGoal,
      viewport: normalized.viewport,
    };
    promptSnapshot = await createPromptExecutionSnapshot(getSql(), "layout_reference_analyzer", {
      sourceUrl: normalized.sourceUrl,
      sourceSite: normalized.sourceSite,
      contextJson: JSON.stringify(context),
      adminNotes: String(body.adminNotes || "").trim().slice(0, 3000),
    });
    const generation = await generateStructuredVisionResult({
      type: "layout_reference_analyzer",
      schemaName: "layout_reference_analysis",
      schema: LAYOUT_REFERENCE_ANALYSIS_SCHEMA,
      imageUrl: normalized.previewImageUrl,
      promptConfig: promptSnapshot.promptConfig,
    });
    const analysis = normalizeLayoutReferenceAnalysis(generation.result);
    return res.status(200).json({
      ok: true,
      analysis,
      analyzedAt: new Date().toISOString(),
      prompt: {
        id: promptSnapshot.promptConfig.promptId,
        version: promptSnapshot.promptConfig.promptVersion,
        hash: promptSnapshot.promptConfig.renderedPromptHash,
      },
      provider: generation.provider,
      executionDisplay: toAiExecutionDisplay(promptSnapshot.promptConfig),
      usage: generation.usage,
    });
  } catch (error) {
    const runtimeConfig = promptSnapshot?.promptConfig?.runtimeConfig || {};
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Layout reference analysis failed",
      message: error.message,
      code: error.code || null,
      retryable: isRetryableProviderError(error),
      retryPolicy: {
        maxAttempts: Number(runtimeConfig.maxAttempts || 1),
        retryBaseMs: Number(runtimeConfig.retryBaseMs || 0),
        retryMaxMs: Number(runtimeConfig.retryMaxMs || 0),
      },
      requestId: error.requestId || null,
      executionDisplay: promptSnapshot ? toAiExecutionDisplay(promptSnapshot.promptConfig) : null,
    });
  }
};
