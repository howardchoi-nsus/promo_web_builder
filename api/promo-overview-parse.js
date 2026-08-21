const { getSql, parseBody } = require("./_promo-section-design-store");
const { randomUUID } = require("node:crypto");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateStructuredPlannerResult, isRetryableProviderError } = require("./_promo-section-design-provider");
const { toAiExecutionDisplay } = require("./_ai-execution-display");
const {
  PROMOTION_PURPOSES,
  AUDIENCES,
  CAMPAIGN_TONES,
  OVERVIEW_PARSE_SCHEMA,
  buildOverviewPromptContexts,
  normalizeParsedOverview,
  inputLanguageLocale,
  overviewFingerprint,
  overviewRequestFingerprint,
} = require("./_promo-overview-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  let promptSnapshot = null;
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const instruction = String(body.naturalLanguage || "").trim();
    const generationMode = String(body.generationMode || "new-draft").trim();
    if (instruction.length < 10 || instruction.length > 4000) {
      return res.status(422).json({ error: "Natural-language overview must be between 10 and 4000 characters" });
    }
    if (generationMode !== "new-draft") {
      return res.status(422).json({ error: "Unsupported promotion overview generation mode" });
    }
    const allowedValues = {
      promotionPurposes: PROMOTION_PURPOSES,
      audiences: AUDIENCES,
      campaignTones: CAMPAIGN_TONES,
    };
    const currentOverview = body.currentOverview && typeof body.currentOverview === "object"
      && !Array.isArray(body.currentOverview)
      ? body.currentOverview
      : {};
    const promptContexts = buildOverviewPromptContexts({
      productCatalog: body.productCatalog ?? body.product_catalog ?? body.productCatalogJson,
      localeAndMarket: body.localeAndMarket ?? body.locale_and_market ?? body.localeAndMarketJson,
      naturalLanguage: instruction,
      locale: body.locale,
      market: body.market,
      acceptLanguage: req.headers["accept-language"],
      currentOverview,
    });
    const sql = getSql();
    promptSnapshot = await createPromptExecutionSnapshot(sql, "promo_overview_parser", {
      naturalLanguage: instruction,
      currentOverviewJson: JSON.stringify(currentOverview),
      allowedValuesJson: JSON.stringify(allowedValues),
      generationMode: "new-draft",
      ...promptContexts,
    });
    const generation = await generateStructuredPlannerResult({
      type: "promo_overview_parser",
      schemaName: "promo_overview_parse",
      schema: OVERVIEW_PARSE_SCHEMA,
      promptConfig: promptSnapshot.promptConfig,
    });
    const parsed = normalizeParsedOverview({
      result: generation.result,
      instruction,
    });
    return res.status(200).json({
      ok: true,
      draftId: randomUUID(),
      createdAt: new Date().toISOString(),
      ...parsed,
      inputLocale: inputLanguageLocale(instruction)
        || JSON.parse(promptContexts.localeAndMarketJson || "{}").locale
        || "",
      overviewFingerprint: overviewFingerprint(parsed.overview),
      requestFingerprint: overviewRequestFingerprint(instruction),
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
      error: "Promotion overview parsing failed",
      message: error.message,
      code: error.code || null,
      retryable: isRetryableProviderError(error),
      retryPolicy: {
        maxAttempts: Number(runtimeConfig.maxAttempts || 1),
        retryBaseMs: Number(runtimeConfig.retryBaseMs || 0),
        retryMaxMs: Number(runtimeConfig.retryMaxMs || 0),
      },
      requestId: error.requestId || null,
      providerErrorType: error.providerErrorType || null,
      executionDisplay: promptSnapshot ? toAiExecutionDisplay(promptSnapshot.promptConfig) : null,
    });
  }
};
