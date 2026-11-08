const assert = require("node:assert/strict");
const { applyFlowLayoutRecipe } = require("../api/_promo-layout-recipe");
const { validateLayoutSpec } = require("../api/_wizard-form-template-layout-store");

const tokens = {
  surface: "--promo-color-surface",
  radius: "--promo-radius-card",
  shadow: "--promo-shadow-card",
};

const cards = [1, 2, 3].map((index) => ({
  id: `card#${index}`,
  itemKey: `card#${index}`,
  fieldKind: "component",
  collection: { enabled: true, collectionKey: "cards" },
  fields: [{ fieldKey: "title", fieldKind: "text", textType: "title" }],
}));
const result = applyFlowLayoutRecipe({
  section: { sectionKey: "benefits", sectionRole: "benefits" },
  items: cards,
  sectionStyle: { minHeight: 200 },
  tokenBindings: tokens,
  referenceLayoutSpec: {
    layoutFamily: "Premium editorial three-column grid",
    primitives: ["card grid"],
    desktopStrategy: "Spacious three-column composition",
  },
});

assert.equal(result.sectionStyle.layoutMode, "flow");
assert.equal(result.sectionStyle.layoutColumns, 3);
assert.equal(result.sectionStyle.mobileLayoutColumns, 1);
assert.equal(result.desktopItemStyles["benefits.card#1"].positionMode, "flow");
assert.equal(result.desktopItemStyles["benefits.card#1"].heightMode, "auto");
assert.equal(result.desktopItemStyles["benefits.card#1"].paddingPx, 24);
assert.equal(result.desktopItemStyles["benefits.card#1"].backgroundColorToken, tokens.surface);
assert.equal(result.mobileItemStyles["benefits.card#1"].positionMode, "flow");
assert.equal(result.recipe.referenceDerived, true);
assert.equal(result.recipe.referenceFamily, "Premium editorial three-column grid");
assert.equal(result.sectionStyle.layoutGapPx, 32);

const hero = applyFlowLayoutRecipe({
  section: { sectionKey: "hero", sectionRole: "hero" },
  items: [{ id: "title", itemKey: "title", fieldKind: "text", textType: "title" }],
  sectionStyle: {},
  tokenBindings: tokens,
});
assert.equal(hero.sectionStyle.layoutColumns, 1);
assert.ok(hero.sectionStyle.minHeight >= 560);
assert.equal(hero.desktopItemStyles["hero.title"].textAlign, "center");
assert.equal(hero.desktopItemStyles["hero.title"].justifySelf, "center");
const validation = validateLayoutSpec({
  contractVersion: 1,
  theme: {},
  responsive: {},
  itemStyles: result.desktopItemStyles,
  sectionStyles: { benefits: result.sectionStyle },
  responsiveLayouts: { mobile: { itemStyles: result.mobileItemStyles } },
}, [{ sectionKey: "benefits", items: cards.map((item) => ({ ...item, itemKey: item.id })) }]);
assert.equal(validation.ok, true, JSON.stringify(validation.errors));

console.log("Promo layout recipe tests passed.");
