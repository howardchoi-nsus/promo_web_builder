const assert = require("node:assert/strict");
const {
  STYLE_SLOT_TARGET_PROPERTIES,
  normalizeStyleSlot,
  styleSlotTargetProperty,
} = require("../api/_promo-style-slot-contract");
const { buildDefaultItemStyles } = require("../api/_promo-page-composition-contract");

assert.ok(STYLE_SLOT_TARGET_PROPERTIES.includes("colorToken"));
assert.ok(STYLE_SLOT_TARGET_PROPERTIES.includes("backgroundColorToken"));
assert.equal(normalizeStyleSlot(null).slotKey, "");
assert.equal(styleSlotTargetProperty(null), "");
assert.equal(styleSlotTargetProperty({
  slotKey: "titleColor",
  semanticRole: "accent-color",
}), "colorToken", "legacy title color slots must remain text color");
assert.equal(styleSlotTargetProperty({
  slotKey: "ctaBackground",
  semanticRole: "accent-color",
}), "backgroundColorToken", "legacy CTA background slots must remain background color");
assert.equal(styleSlotTargetProperty({
  slotKey: "customAccent",
  semanticRole: "accent-color",
  targetProperty: "colorToken",
}), "colorToken", "explicit targetProperty must take precedence");
assert.throws(() => normalizeStyleSlot({
  slotKey: "unsafe",
  semanticRole: "accent-color",
  targetProperty: "position",
}), (error) => error.code === "INVALID_STYLE_SLOT_TARGET_PROPERTY");

const tokenValues = {
  "--app-accent": "#ff0000",
  "--app-ink": "#ffffff",
};
const selectableTokens = [
  { tokenKey: "--app-accent", semanticRole: "accent-color" },
  { tokenKey: "--app-ink", semanticRole: "text-color" },
];
const styles = buildDefaultItemStyles([{
  sectionKey: "hero",
  items: [{
    itemKey: "title",
    fieldKind: "text",
    textType: "title",
    styleSlots: [{
      slotKey: "titleColor",
      semanticRole: "accent-color",
      targetProperty: "colorToken",
      aiSelectable: true,
    }],
    fields: [],
  }, {
    itemKey: "cta",
    fieldKind: "cta",
    styleSlots: [{
      slotKey: "ctaBackground",
      semanticRole: "accent-color",
      targetProperty: "backgroundColorToken",
      aiSelectable: true,
    }],
    fields: [],
  }],
}], tokenValues, selectableTokens);

assert.equal(styles["hero.title"].colorToken, "--app-accent");
assert.equal(styles["hero.title"].backgroundColorToken, undefined);
assert.equal(styles["hero.cta"].backgroundColorToken, "--app-accent");

console.log("Promo style slot target property tests passed");
