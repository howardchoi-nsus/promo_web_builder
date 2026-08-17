const assert = require("node:assert/strict");
const { avoidTextComponentOverlaps } = require("../api/_promo-layout-text-collision");
const { validateLayoutSpec } = require("../api/_wizard-form-template-layout-store");

const section = {
  sectionKey: "hero",
  items: [
    { itemKey: "title", name: "Title", fieldKind: "text", textType: "title", fields: [{ fieldKey: "text", fieldKind: "text", textType: "title" }] },
    { itemKey: "subtitle", name: "Subtitle", fieldKind: "text", textType: "headline", fields: [{ fieldKey: "text", fieldKind: "text", textType: "headline" }] },
    { itemKey: "description", name: "Description", fieldKind: "text", textType: "multi", fields: [{ fieldKey: "text", fieldKind: "text", textType: "multi" }] },
  ],
};
const result = avoidTextComponentOverlaps({
  sections: [section],
  sectionInputs: { hero: {
    title: "신규 사용자를 위한 여름 환영 보너스",
    subtitle: "Bright Summer Welcome Bonus for New Users",
    description: "첫 입금 보너스와 다양한 혜택을 안내하는 프로모션 설명입니다.",
  } },
  itemStyles: {
    "hero.title": { positionMode: "free", xPct: 10, yPx: 40, widthPct: 80, heightPx: 70 },
    "hero.subtitle": { positionMode: "free", xPct: 10, yPx: 50, widthPct: 80, heightPx: 70 },
    "hero.description": { positionMode: "free", xPct: 10, yPx: 60, widthPct: 80, heightPx: 70 },
  },
  mobileItemStyles: {
    "hero.title": { positionMode: "free", xPct: 5, yPx: 20, widthPct: 90, heightPx: 70 },
    "hero.subtitle": { positionMode: "free", xPct: 5, yPx: 30, widthPct: 90, heightPx: 70 },
    "hero.description": { positionMode: "free", xPct: 5, yPx: 40, widthPct: 90, heightPx: 70 },
  },
  sectionStyles: { hero: { minHeight: 240 } },
  tokenValues: { "--app-font-size-heading": "48px" },
});

assert.equal(result.itemStyles["hero.title"].heightMode, "auto");
assert.equal(Object.hasOwn(result.itemStyles["hero.title"], "heightPx"), false);
assert.ok(result.itemStyles["hero.subtitle"].yPx > result.itemStyles["hero.title"].yPx);
assert.ok(result.itemStyles["hero.description"].yPx > result.itemStyles["hero.subtitle"].yPx);
assert.ok(result.mobileItemStyles["hero.subtitle"].yPx > result.mobileItemStyles["hero.title"].yPx);
assert.ok(result.mobileItemStyles["hero.description"].yPx > result.mobileItemStyles["hero.subtitle"].yPx);
assert.ok(result.sectionStyles.hero.minHeight > 240);
assert.ok(result.diagnostics.some((entry) => entry.code === "TEXT_LAYOUT_OVERLAP_ADJUSTED"));

const separated = avoidTextComponentOverlaps({
  sections: [{ ...section, items: section.items.slice(0, 2) }],
  sectionInputs: { hero: { title: "Left", subtitle: "Right" } },
  itemStyles: {
    "hero.title": { positionMode: "free", xPct: 0, yPx: 40, widthPct: 40 },
    "hero.subtitle": { positionMode: "free", xPct: 60, yPx: 40, widthPct: 40 },
  },
});
assert.equal(separated.itemStyles["hero.subtitle"].yPx, 40);

const compositeCard = {
  itemKey: "cardOne",
  name: "Promotion Card",
  fieldKind: "text",
  textType: "multi",
  fields: [
    { fieldKey: "image", fieldKind: "image", image: { aspectRatio: "4:3" } },
    { fieldKey: "description", fieldKind: "text", textType: "multi", name: "Description" },
    { fieldKey: "action", fieldKind: "cta", name: "Action" },
  ],
};
const compositeResult = avoidTextComponentOverlaps({
  sections: [{ sectionKey: "cards", items: [
    compositeCard,
    { ...compositeCard, itemKey: "cardTwo", name: "Promotion Card 2" },
  ] }],
  sectionInputs: { cards: {
    cardOne: { fields: { image: { value: "one.jpg" }, description: "첫 번째 카드 설명", action: { label: "보기" } } },
    cardTwo: { fields: { image: { value: "two.jpg" }, description: "두 번째 카드 설명", action: { label: "보기" } } },
  } },
  itemStyles: {
    "cards.cardOne": { positionMode: "free", xPct: 5, yPx: 20, widthPct: 42, heightPx: 120 },
    "cards.cardTwo": { positionMode: "free", xPct: 5, yPx: 160, widthPct: 42, heightPx: 120 },
  },
  mobileItemStyles: {
    "cards.cardOne": { positionMode: "free", xPct: 5, yPx: 20, widthPct: 90, heightPx: 120 },
    "cards.cardTwo": { positionMode: "free", xPct: 5, yPx: 160, widthPct: 90, heightPx: 120 },
  },
});
assert.ok(compositeResult.itemStyles["cards.cardTwo"].yPx > 500, "desktop image/text/CTA height must move the next card");
assert.ok(compositeResult.mobileItemStyles["cards.cardTwo"].yPx > 600, "mobile image/text/CTA height must move the next card");
assert.ok(compositeResult.sectionStyles.cards.minHeight > compositeResult.mobileItemStyles["cards.cardTwo"].yPx);

const longCardDescription = "Get a 100% bonus on your first deposit, available once per new user. Enhance your experience with this limited-time summer offer, encouraging early participation and maximizing initial engagement.";
const repeatedCards = [1, 2, 3, 4].map((index) => ({
  ...compositeCard,
  itemKey: `card${index}`,
  name: `Promotion Card ${index}`,
}));
const repeatedCompositeResult = avoidTextComponentOverlaps({
  sections: [{ sectionKey: "repeatedCards", items: repeatedCards }],
  sectionInputs: { repeatedCards: Object.fromEntries(repeatedCards.map((item) => [
    item.itemKey,
    { fields: { image: { value: `${item.itemKey}.jpg` }, description: longCardDescription, action: { label: "Join" } } },
  ])) },
  itemStyles: Object.fromEntries(repeatedCards.map((item, index) => [
    `repeatedCards.${item.itemKey}`,
    { positionMode: "free", xPct: 5, yPx: 20 + (index * 160), widthPct: 42 },
  ])),
  mobileItemStyles: Object.fromEntries(repeatedCards.map((item, index) => [
    `repeatedCards.${item.itemKey}`,
    { positionMode: "free", xPct: 5, yPx: 20 + (index * 160), widthPct: 90 },
  ])),
});
assert.ok(repeatedCompositeResult.mobileItemStyles["repeatedCards.card4"].yPx > 1200);
assert.ok(repeatedCompositeResult.sectionStyles.repeatedCards.minHeight > 1200);
assert.equal(validateLayoutSpec({
  contractVersion: 1,
  itemStyles: repeatedCompositeResult.itemStyles,
  sectionStyles: repeatedCompositeResult.sectionStyles,
  responsiveLayouts: { mobile: { itemStyles: repeatedCompositeResult.mobileItemStyles } },
}, [{ sectionKey: "repeatedCards", items: repeatedCards }]).ok, true, "collision-safe repeated composite layouts must remain valid Contract v3 output");

console.log("Promo text collision normalization tests passed.");
