const { getSql, parseBody } = require("./_wizard-form-templates-store");
const { fetchTemplates } = require("./_wizard-form-templates-store");
const { normalizeOverview } = require("./_promo-overview-contract");
const {
  rankTemplateRecommendations,
  recommendationFingerprint,
} = require("./_promo-template-recommendation-contract");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateStructuredPlannerResult } = require("./_promo-section-design-provider");

function recommendationSchema(candidateIds) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["rankedCandidates"],
    properties: {
      rankedCandidates: {
        type: "array",
        minItems: candidateIds.length,
        maxItems: candidateIds.length,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["templateId", "reasons", "warnings"],
          properties: {
            templateId: { type: "string", enum: candidateIds },
            reasons: {
              type: "array",
              maxItems: 5,
              items: { type: "string", maxLength: 240 },
            },
            warnings: {
              type: "array",
              maxItems: 5,
              items: { type: "string", maxLength: 240 },
            },
          },
        },
      },
    },
  };
}

function mergeSemanticRanking(ruleRecommendations, result) {
  const byId = new Map(ruleRecommendations.map((item) => [item.templateId, item]));
  const ranked = Array.isArray(result?.rankedCandidates) ? result.rankedCandidates : [];
  const seen = new Set();
  const merged = [];
  ranked.forEach((item) => {
    const rule = byId.get(String(item?.templateId || ""));
    if (!rule || seen.has(rule.templateId)) return;
    seen.add(rule.templateId);
    merged.push({
      ...rule,
      reasons: Array.from(new Set([
        ...(Array.isArray(item.reasons) ? item.reasons : []),
        ...rule.reasons,
      ])).slice(0, 6),
      warnings: Array.from(new Set([
        ...rule.warnings,
        ...(Array.isArray(item.warnings) ? item.warnings : []),
      ])).slice(0, 6),
    });
  });
  if (seen.size !== ruleRecommendations.length) {
    throw new Error("Template recommender must rank every server-filtered candidate exactly once");
  }
  return merged;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const overview = normalizeOverview(body.overview || {});
    const fingerprint = recommendationFingerprint(overview);
    if (body.overviewFingerprint && String(body.overviewFingerprint) !== fingerprint) {
      return res.status(409).json({
        error: "Overview changed before template recommendation",
        code: "OVERVIEW_FINGERPRINT_MISMATCH",
        overviewFingerprint: fingerprint,
      });
    }
    const limit = Math.max(1, Math.min(10, Number(body.limit) || 3));
    const sql = getSql();
    const templates = await fetchTemplates(sql, { activeOnly: true });
    const allRanked = rankTemplateRecommendations(templates, overview, Math.max(limit, templates.length));
    const fallbackTemplateId = templates.find((template) => template.isDefault)?.id
      || templates[0]?.id || null;
    if (!allRanked.length) {
      return res.status(200).json({
        ok: true,
        overviewFingerprint: fingerprint,
        recommendations: [],
        fallbackTemplateId,
        source: "rule-base",
        warnings: ["적합한 활성 템플릿이 없어 전체 템플릿에서 직접 선택해야 합니다."],
      });
    }

    let recommendations = allRanked;
    let source = "rule-base";
    let plannerWarning = "";
    try {
      const candidatesForPrompt = allRanked.map((item) => ({
        templateId: item.templateId,
        templateKey: item.templateKey,
        templateName: item.templateName,
        ruleScore: item.score,
        reasons: item.reasons,
        warnings: item.warnings,
        requiredConfirmations: item.requiredConfirmations,
      }));
      const promptSnapshot = await createPromptExecutionSnapshot(sql, "promo_template_recommender", {
        overviewJson: JSON.stringify(overview),
        candidatesJson: JSON.stringify(candidatesForPrompt),
      });
      const generation = await generateStructuredPlannerResult({
        type: "promo_template_recommender",
        schemaName: "promo_template_recommendations",
        schema: recommendationSchema(allRanked.map((item) => item.templateId)),
        promptConfig: promptSnapshot.promptConfig,
      });
      recommendations = mergeSemanticRanking(allRanked, generation.result);
      source = "llm-assisted";
    } catch (error) {
      plannerWarning = `LLM 추천을 사용할 수 없어 규칙 기반 결과를 표시합니다: ${error.message}`;
    }

    return res.status(200).json({
      ok: true,
      overviewFingerprint: fingerprint,
      recommendations: recommendations.slice(0, limit),
      fallbackTemplateId,
      source,
      warnings: plannerWarning ? [plannerWarning] : [],
    });
  } catch (error) {
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 500).json({
      error: "Promotion template recommendation failed",
      message: error.message,
      code: error.code || null,
    });
  }
};

module.exports.mergeSemanticRanking = mergeSemanticRanking;
