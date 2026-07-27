const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "prototype", "wizard", "promotion-overview.js"),
  "utf8"
);
const context = { globalThis: {}, URL };
vm.runInNewContext(source, context);
const overview = context.globalThis.PromoPromotionOverview;
const { overviewFingerprint: serverOverviewFingerprint } = require("../api/_promo-overview-contract");

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
assert.equal(canonical.title, "신규 이벤트");
assert.equal(canonical.mainOffer, "100% 보너스");
assert.equal(canonical.primaryAction.url, "https://promo.example/start");

overview.applyToLegacy(content, {
  title: "기존 고객 이벤트",
  promotionPurpose: "할인쿠폰",
  market: "Global",
  audience: "기존고객",
  campaignTone: "친근함",
  mainOffer: "20% 할인",
  primaryAction: { label: "쿠폰 받기", url: "" },
});
assert.equal(content.promo.title, "기존 고객 이벤트");
assert.equal(content.simpleBrief.mainOffer, "20% 할인");
assert.equal(content.promo.ctaLabel, "쿠폰 받기");

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
  "Browser and server normalization must match for stale other-purpose values and canonical URLs"
);
assert.equal(overview.normalize(normalizationEdgeCase).promotionPurposeOther, "");
assert.equal(overview.normalize(normalizationEdgeCase).primaryAction.url, "https://promo.example/");

console.log("promotion overview browser module tests passed");
