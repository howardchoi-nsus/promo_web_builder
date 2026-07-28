const assert = require("node:assert/strict");
const {
  rankTemplateRecommendations,
  recommendationFingerprint,
} = require("../api/_promo-template-recommendation-contract");
const { mergeSemanticRanking } = require("../api/promo-template-recommendations");

const overview = {
  title: "첫 충전 이벤트",
  promotionPurpose: "이벤트",
  market: "KR",
  audience: "신규",
  campaignTone: "프리미엄",
  mainOffer: "100% 보너스",
};
const templates = [{
  id: "template-best",
  templateKey: "best",
  version: 2,
  name: "신규 고객 이벤트",
  description: "첫 충전 프로모션",
  status: "active",
  isDefault: false,
  recommendationProfile: {
    promotionTypes: ["이벤트"],
    markets: ["KR"],
    audiences: ["신규"],
    tones: ["프리미엄"],
    requiredInputs: ["primaryAction.url"],
    tags: ["충전", "보너스"],
  },
}, {
  id: "template-generic",
  templateKey: "generic",
  version: 1,
  name: "Generic",
  description: "",
  status: "active",
  isDefault: true,
  recommendationProfile: {},
}, {
  id: "template-other-market",
  templateKey: "other",
  version: 1,
  name: "Ontario",
  status: "active",
  recommendationProfile: { markets: ["Ontario"] },
}, {
  id: "template-draft",
  templateKey: "draft",
  version: 1,
  name: "Draft",
  status: "draft",
  recommendationProfile: {},
}];

const ranked = rankTemplateRecommendations(templates, overview, 3);
assert.deepEqual(ranked.map((item) => item.templateId), ["template-best", "template-generic"]);
assert.ok(ranked[0].score > ranked[1].score);
assert.deepEqual(ranked[0].requiredConfirmations, []);
assert.equal(ranked[0].warnings.some((warning) => warning.includes("primaryAction")), false);
assert.equal(ranked.some((item) => item.templateId === "template-other-market"), false);
assert.equal(recommendationFingerprint(overview), recommendationFingerprint({ ...overview }));

const semantic = mergeSemanticRanking(ranked, {
  rankedCandidates: [
    { templateId: "template-generic", reasons: ["의미 기반 우선"], warnings: [] },
    { templateId: "template-best", reasons: ["혜택 표현 적합"], warnings: ["CTA 확인"] },
  ],
});
assert.deepEqual(semantic.map((item) => item.templateId), ["template-generic", "template-best"]);
assert.ok(semantic[0].reasons.includes("의미 기반 우선"));
assert.throws(
  () => mergeSemanticRanking(ranked, {
    rankedCandidates: [{ templateId: "template-best", reasons: [], warnings: [] }],
  }),
  /exactly once/
);

console.log("promo template recommendation contract tests passed");
