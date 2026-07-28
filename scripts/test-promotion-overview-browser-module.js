const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "prototype", "wizard", "promotion-overview.js"),
  "utf8"
);
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const overview = context.globalThis.PromoPromotionOverview;
const {
  overviewFingerprint: serverOverviewFingerprint,
  overviewRequestFingerprint: serverOverviewRequestFingerprint,
} = require("../api/_promo-overview-contract");

const content = {
  promo: {
    title: "신규 이벤트",
    promotionPurpose: "이벤트",
    promotionPurposeOther: "",
    market: "KR",
    ctaLabel: "참가",
    ctaUrl: "https://promo.example/start",
  },
  simpleBrief: {
    audience: "신규",
    campaignTone: "프리미엄",
    mainOffer: "100% 보너스",
  },
};

const canonical = overview.syncFromLegacy(content);
assert.equal(canonical.schemaVersion, 3);
assert.equal(canonical.title, "신규 이벤트");
assert.equal(canonical.mainOffer, "100% 보너스");
assert.equal(Object.hasOwn(canonical, "primaryAction"), false);

overview.applyToLegacy(content, {
  title: "기존 고객 이벤트",
  promotionPurpose: "할인쿠폰",
  market: "Global",
  audience: "기존고객",
  campaignTone: "친근함",
  mainOffer: "20% 할인",
  primaryAction: { label: "무시할 CTA", url: "" },
});
assert.equal(content.promo.title, "기존 고객 이벤트");
assert.equal(content.simpleBrief.mainOffer, "20% 할인");
assert.equal(content.promo.ctaLabel, "참가", "Legacy CTA content must be preserved but excluded from Overview v3");
assert.equal(content.promo.ctaUrl, "https://promo.example/start");

assert.equal(overview.fingerprint(content.promotionOverview), overview.fingerprint({
  ...content.promotionOverview,
}));
assert.equal(
  overview.fingerprint(content.promotionOverview),
  serverOverviewFingerprint(content.promotionOverview),
  "Browser and server must use the same Overview fingerprint contract"
);

const normalizationEdgeCase = {
  ...content.promotionOverview,
  promotionPurpose: "이벤트",
  promotionPurposeOther: "이 값은 기타 목적이 아니므로 제거되어야 함",
  primaryAction: { label: "참가", url: "https://promo.example" },
};
assert.equal(
  overview.fingerprint(normalizationEdgeCase),
  serverOverviewFingerprint(normalizationEdgeCase),
  "Browser and server normalization must ignore legacy CTA values"
);
assert.equal(overview.normalize(normalizationEdgeCase).promotionPurposeOther, "");
assert.equal(Object.hasOwn(overview.normalize(normalizationEdgeCase), "primaryAction"), false);
assert.equal(
  overview.requestFingerprint(" 간단한 설명 "),
  serverOverviewRequestFingerprint("간단한 설명")
);

console.log("promotion overview browser module tests passed");
