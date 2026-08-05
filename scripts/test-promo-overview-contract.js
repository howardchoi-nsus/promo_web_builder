const assert = require("node:assert/strict");
const {
  normalizeOverview,
  normalizeParsedOverview,
  overviewFingerprint,
  overviewRequestFingerprint,
} = require("../api/_promo-overview-contract");

const baseOverview = {
  title: "첫 충전 프로모션",
  leadText: "신규 고객을 위한 첫 충전 혜택",
  ctaLabel: "지금 참여하기",
  promotionPurpose: "이벤트",
  market: "KR",
  audience: "신규",
  campaignTone: "프리미엄",
  mainOffer: "첫 충전 100% 보너스",
  primaryAction: { label: "게임 참가", url: "https://legacy.example/start" },
};

const normalized = normalizeOverview(baseOverview);
assert.equal(normalized.schemaVersion, 5);
assert.equal(normalized.leadText, "신규 고객을 위한 첫 충전 혜택");
assert.equal(normalized.ctaLabel, "지금 참여하기");
assert.equal(Object.hasOwn(normalized, "primaryAction"), false);

const generatedDraft = normalizeParsedOverview({
  instruction: "신규 고객을 위한 첫 충전 이벤트를 만들어 주세요.",
  currentOverview: {
    ...baseOverview,
    title: "이전 정형 입력 제목",
  },
  result: {
    overview: {
      title: "첫 만남 충전 보너스",
      leadText: "첫 충전부터 특별하게",
      ctaLabel: "혜택 받기",
      promotionPurpose: "이벤트",
      promotionPurposeOther: "",
      market: "",
      audience: "신규",
      campaignTone: "프리미엄",
      mainOffer: "첫 충전 혜택을 강조하는 프로모션",
    },
    fieldDecisions: [
      {
        field: "title",
        origin: "generated",
        confidence: 0.88,
        reason: "간단한 설명을 기반으로 제목을 생성했습니다.",
        requiresConfirmation: false,
      },
      {
        field: "market",
        origin: "needs-confirmation",
        confidence: 0,
        reason: "운영 국가가 제공되지 않았습니다.",
        requiresConfirmation: true,
      },
    ],
    assumptions: ["첫 충전 대상은 신규 고객으로 해석했습니다."],
    missingCriticalInputs: [],
    warnings: ["정확한 혜택 수치는 확정 후 입력해야 합니다."],
    summary: "신규 고객 첫 충전 프로모션 초안",
    confidence: 0.8,
  },
});
assert.equal(generatedDraft.overview.title, "첫 만남 충전 보너스");
assert.equal(generatedDraft.overview.leadText, "첫 충전부터 특별하게");
assert.equal(generatedDraft.overview.ctaLabel, "혜택 받기");
assert.notEqual(generatedDraft.overview.title, "이전 정형 입력 제목");
assert.ok(generatedDraft.missingCriticalInputs.includes("market"));
assert.equal(generatedDraft.fieldDecisions[0].origin, "generated");
assert.equal(generatedDraft.assumptions.length, 1);

assert.equal(overviewFingerprint(baseOverview), overviewFingerprint({ ...baseOverview }));
assert.equal(
  overviewFingerprint(baseOverview),
  overviewFingerprint({
    ...baseOverview,
    primaryAction: { label: "다른 CTA", url: "https://other.example" },
  }),
  "Legacy primaryAction changes must not alter the Overview v5 fingerprint"
);
assert.notEqual(
  overviewFingerprint(baseOverview),
  overviewFingerprint({ ...baseOverview, market: "Global" })
);
assert.notEqual(
  overviewFingerprint(baseOverview),
  overviewFingerprint({ ...baseOverview, ctaLabel: "다른 혜택 보기" }),
  "CTA label changes must alter the Overview v5 fingerprint",
);
assert.throws(
  () => normalizeOverview({ ...baseOverview, ctaLabel: "가".repeat(21) }),
  (error) => error.code === "CTA_LABEL_TOO_LONG",
);
assert.equal(
  overviewRequestFingerprint(" 간단한 이벤트 설명 "),
  overviewRequestFingerprint("간단한 이벤트 설명")
);
assert.notEqual(
  overviewRequestFingerprint("첫 번째 요청"),
  overviewRequestFingerprint("두 번째 요청")
);

console.log("promo overview contract tests passed");
