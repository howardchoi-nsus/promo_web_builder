const { getSql, parseBody } = require("./_promo-section-design-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateStructuredPlannerResult } = require("./_promo-section-design-provider");
const {
  PROMOTION_PURPOSES,
  AUDIENCES,
  CAMPAIGN_TONES,
  OVERVIEW_PARSE_SCHEMA,
  normalizeOverview,
  normalizeParsedOverview,
  overviewFingerprint,
} = require("./_promo-overview-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const instruction = String(body.naturalLanguage || "").trim();
    if (instruction.length < 10 || instruction.length > 4000) {
      return res.status(422).json({ error: "Natural-language overview must be between 10 and 4000 characters" });
    }
    const currentOverview = normalizeOverview(body.currentOverview || {});
    const allowedValues = {
      promotionPurposes: PROMOTION_PURPOSES,
      audiences: AUDIENCES,
      campaignTones: CAMPAIGN_TONES,
    };
    const sql = getSql();
    const promptSnapshot = await createPromptExecutionSnapshot(sql, "promo_overview_parser", {
      naturalLanguage: instruction,
      currentOverviewJson: JSON.stringify(currentOverview),
      allowedValuesJson: JSON.stringify(allowedValues),
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
      currentOverview,
    });
    return res.status(200).json({
      ok: true,
      ...parsed,
      overviewFingerprint: overviewFingerprint(parsed.overview),
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
      error: "Promotion overview parsing failed",
      message: error.message,
      code: error.code || null,
    });
  }
};
