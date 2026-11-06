const QUALITY_SCORE_KEYS = ["hierarchy", "composition", "originality", "responsiveness", "reusability"];

const LAYOUT_REFERENCE_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title", "sourceSite", "pageType", "industry", "promotionGoal", "viewport",
    "visualStyles", "sectionTypes", "tags", "designSummary", "strengths", "risks",
    "layoutSpec", "qualityScores", "confidence", "warnings",
  ],
  properties: {
    title: { type: "string", minLength: 1, maxLength: 200 },
    sourceSite: { type: "string", maxLength: 160 },
    pageType: { type: "string", maxLength: 120 },
    industry: { type: "string", maxLength: 120 },
    promotionGoal: { type: "string", maxLength: 160 },
    viewport: { type: "string", enum: ["desktop", "mobile", "responsive"] },
    visualStyles: { type: "array", maxItems: 12, items: { type: "string", minLength: 1, maxLength: 80 } },
    sectionTypes: { type: "array", minItems: 1, maxItems: 20, items: { type: "string", minLength: 1, maxLength: 80 } },
    tags: { type: "array", maxItems: 24, items: { type: "string", minLength: 1, maxLength: 80 } },
    designSummary: { type: "string", minLength: 1, maxLength: 3000 },
    strengths: { type: "string", maxLength: 3000 },
    risks: { type: "string", maxLength: 3000 },
    layoutSpec: {
      type: "object",
      additionalProperties: false,
      required: [
        "layoutFamily", "primitives", "desktopStrategy", "mobileStrategy", "contentHierarchy",
        "imageStrategy", "ctaStrategy", "reusableConstraints",
      ],
      properties: {
        layoutFamily: { type: "string", maxLength: 120 },
        primitives: { type: "array", maxItems: 20, items: { type: "string", maxLength: 100 } },
        desktopStrategy: { type: "string", maxLength: 1000 },
        mobileStrategy: { type: "string", maxLength: 1000 },
        contentHierarchy: { type: "array", maxItems: 20, items: { type: "string", maxLength: 200 } },
        imageStrategy: { type: "string", maxLength: 1000 },
        ctaStrategy: { type: "string", maxLength: 1000 },
        reusableConstraints: { type: "array", maxItems: 20, items: { type: "string", maxLength: 300 } },
      },
    },
    qualityScores: {
      type: "object",
      additionalProperties: false,
      required: QUALITY_SCORE_KEYS,
      properties: Object.fromEntries(QUALITY_SCORE_KEYS.map((key) => [key, {
        type: "number", minimum: 1, maximum: 5,
      }])),
    },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    warnings: { type: "array", maxItems: 20, items: { type: "string", maxLength: 500 } },
  },
};

function stringList(value, limit) {
  return Array.from(new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item || "").trim())
      .filter(Boolean),
  )).slice(0, limit);
}

function normalizeLayoutReferenceAnalysis(value = {}) {
  const layoutSpec = value.layoutSpec && typeof value.layoutSpec === "object" && !Array.isArray(value.layoutSpec)
    ? value.layoutSpec : {};
  const qualityScores = Object.fromEntries(QUALITY_SCORE_KEYS.map((key) => {
    const score = Number(value.qualityScores?.[key] || 0);
    return [key, Math.min(5, Math.max(1, Math.round(score * 10) / 10))];
  }));
  return {
    title: String(value.title || "").trim().slice(0, 200),
    sourceSite: String(value.sourceSite || "").trim().slice(0, 160),
    pageType: String(value.pageType || "").trim().slice(0, 120),
    industry: String(value.industry || "").trim().slice(0, 120),
    promotionGoal: String(value.promotionGoal || "").trim().slice(0, 160),
    viewport: ["desktop", "mobile", "responsive"].includes(value.viewport) ? value.viewport : "responsive",
    visualStyles: stringList(value.visualStyles, 12),
    sectionTypes: stringList(value.sectionTypes, 20),
    tags: stringList(value.tags, 24),
    designSummary: String(value.designSummary || "").trim().slice(0, 3000),
    strengths: String(value.strengths || "").trim().slice(0, 3000),
    risks: String(value.risks || "").trim().slice(0, 3000),
    layoutSpec: {
      layoutFamily: String(layoutSpec.layoutFamily || "").trim().slice(0, 120),
      primitives: stringList(layoutSpec.primitives, 20),
      desktopStrategy: String(layoutSpec.desktopStrategy || "").trim().slice(0, 1000),
      mobileStrategy: String(layoutSpec.mobileStrategy || "").trim().slice(0, 1000),
      contentHierarchy: stringList(layoutSpec.contentHierarchy, 20),
      imageStrategy: String(layoutSpec.imageStrategy || "").trim().slice(0, 1000),
      ctaStrategy: String(layoutSpec.ctaStrategy || "").trim().slice(0, 1000),
      reusableConstraints: stringList(layoutSpec.reusableConstraints, 20),
    },
    qualityScores,
    confidence: Math.min(1, Math.max(0, Number(value.confidence || 0))),
    warnings: stringList(value.warnings, 20),
  };
}

module.exports = {
  LAYOUT_REFERENCE_ANALYSIS_SCHEMA,
  QUALITY_SCORE_KEYS,
  normalizeLayoutReferenceAnalysis,
};
