const assert = require("node:assert/strict");
const {
  normalizeOverview,
  normalizeParsedOverview,
  overviewFingerprint,
} = require("../api/_promo-overview-contract");

const baseOverview = {
  title: "첫 충전 프로모션",
  promotionPurpose: "이벤트",
  market: "KR",
  audience: "신규",
  campaignTone: "프리미엄",
  mainOffer: "첫 충전 100% 보너스",
  primaryAction: { label: "게임 참가", url: "" },
};

const normalized = normalizeOverview(baseOverview);
assert.equal(normalized.schemaVersion, 2);
assert.equal(normalized.primaryAction.label, "게임 참가");
assert.equal(normalized.primaryAction.url, "");

const inventedUrl = normalizeParsedOverview({
  instruction: "첫 충전 이벤트를 안내해 주세요.",
  currentOverview: baseOverview,
  result: {
    overview: {
      ...baseOverview,
      primaryAction: { label: "게임 참가", url: "https://invented.example/path" },
    },
    missingInputs: [],
    uncertainInputs: [],
    summary: "신규 고객 이벤트",
    confidence: 0.8,
  },
});
assert.equal(inventedUrl.overview.primaryAction.url, "");
assert.ok(inventedUrl.missingInputs.includes("primaryAction.url"));

const explicitUrl = normalizeParsedOverview({
  instruction: "https://promo.example/start 로 이동하는 게임 참가 버튼을 추가해 주세요.",
  currentOverview: baseOverview,
  result: {
    overview: {
      ...baseOverview,
      primaryAction: { label: "게임 참가", url: "https://promo.example/start" },
    },
    missingInputs: [],
    uncertainInputs: [],
    summary: "명시된 CTA를 포함한 신규 고객 이벤트",
    confidence: 0.95,
  },
});
assert.equal(explicitUrl.overview.primaryAction.url, "https://promo.example/start");

assert.equal(overviewFingerprint(baseOverview), overviewFingerprint({ ...baseOverview }));
assert.notEqual(
  overviewFingerprint(baseOverview),
  overviewFingerprint({ ...baseOverview, market: "Global" })
);

console.log("promo overview contract tests passed");
