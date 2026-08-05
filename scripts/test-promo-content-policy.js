const assert = require("node:assert/strict");
const {
  CTA_LABEL_MAX_CHARACTERS,
  contentCharacterLength,
  normalizeCtaLabel,
} = require("../api/_promo-content-policy");
const { normalizeDefaultContent } = require("../api/_wizard-form-template-layout-store");

assert.equal(CTA_LABEL_MAX_CHARACTERS, 20);
assert.equal(contentCharacterLength("혜택 확인하기"), 7);
assert.equal(normalizeCtaLabel("  지금   참여하기  "), "지금 참여하기");
assert.equal(normalizeCtaLabel("가".repeat(20)), "가".repeat(20));
assert.throws(
  () => normalizeCtaLabel("가".repeat(21)),
  (error) => error.code === "CTA_LABEL_TOO_LONG" && error.maxCharacters === 20,
);

const sections = [{
  sectionKey: "hero",
  items: [{
    itemKey: "card",
    fields: [
      { fieldKey: "description", fieldKind: "text" },
      { fieldKey: "action", fieldKind: "cta" },
    ],
  }],
}];
const normalized = normalizeDefaultContent({
  hero: {
    card: {
      fields: {
        description: "혜택 설명",
        action: { label: "  혜택   받기  ", link: "#", target: "_self" },
        legacy: "preserve-me",
      },
    },
  },
}, sections);
assert.equal(normalized.hero.card.fields.action.label, "혜택 받기");
assert.equal(normalized.hero.card.fields.legacy, "preserve-me");
assert.throws(
  () => normalizeDefaultContent({
    hero: { card: { fields: { action: { label: "나".repeat(21), link: "#" } } } },
  }, sections),
  (error) => error.code === "CTA_LABEL_TOO_LONG"
    && error.path === "hero.card.fields.action.label",
);

console.log("Promo content policy tests passed");
