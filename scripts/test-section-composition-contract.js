const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  publicSectionContract,
  selectableTokens,
  compositionFingerprint,
  allowedTokenBindings,
  stableFingerprint,
  normalizeCompositionPlan,
} = require("../api/_promo-section-composition-contract");

assert.equal(
  stableFingerprint({ sectionStyle: { backgroundColor: "#000", padding: "10px" }, itemStyles: { "intro.title": { width: 320, x: 10 } } }),
  stableFingerprint({ itemStyles: { "intro.title": { x: 10, width: 320 } }, sectionStyle: { padding: "10px", backgroundColor: "#000" } }),
  "layout fingerprint must ignore object key order while preserving layout values",
);

const section = {
  sectionKey: "promotionIntro",
  sectionVersion: 3,
  name: "Promotion Intro",
  items: [
    {
      itemKey: "title",
      name: "Title",
      fieldKind: "text",
      textType: "title",
      isVisibleInWizard: true,
      editorSchema: { maxLength: 12 },
      styleSlots: [{ slotKey: "titleColor", semanticRole: "accent-color", aiSelectable: true }],
      fields: [],
    },
    {
      itemKey: "action",
      name: "Action",
      fieldKind: "cta",
      isVisibleInWizard: true,
      styleSlots: [{ slotKey: "ctaRadius", semanticRole: "radius", aiSelectable: true }],
      fields: [],
    },
    {
      itemKey: "locked",
      name: "Legal",
      fieldKind: "text",
      isVisibleInWizard: true,
      isLocked: true,
      fields: [],
    },
  ],
};
const tokenSet = {
  id: "token-version",
  values: [
    { tokenKey: "--promo-accent", value: "#ff0000", semanticRole: "accent-color", cssProperty: "color", aiSelectable: true },
    { tokenKey: "--promo-radius", value: "24px", semanticRole: "radius", cssProperty: "border-radius", aiSelectable: true },
    { tokenKey: "--unsafe", value: "url(x)", semanticRole: "accent-color", cssProperty: "background-image", aiSelectable: true },
  ],
};
const template = { id: "template", version: 2 };
const current = {
  title: "Before",
  action: { label: "Before CTA", link: "https://example.com/current" },
  locked: "Required legal copy",
};
const plan = {
  sectionIntent: "Promote the event",
  componentSelections: [
    { itemKey: "title", role: "primary-title", fields: [{ fieldKey: null, textValue: "A very long promotional title", ctaLabel: null, ctaUrl: null }] },
    { itemKey: "action", role: "primary-action", fields: [{ fieldKey: null, textValue: null, ctaLabel: "Join", ctaUrl: null }] },
    { itemKey: "locked", role: "supporting-copy", fields: [] },
  ],
  itemPlacements: [
    { itemKey: "title", region: "left", order: 0 },
    { itemKey: "action", region: "left", order: 1 },
    { itemKey: "locked", region: "center", order: 2 },
  ],
  tokenBindings: [
    { itemKey: "title", fieldKey: null, slotKey: "titleColor", tokenKey: "--promo-accent" },
    { itemKey: "action", fieldKey: null, slotKey: "ctaRadius", tokenKey: "--promo-radius" },
  ],
  backgroundImage: { requested: true, concept: "Celebratory game scene", safeArea: "left-copy", fadeMode: "left" },
  missingInputs: [{ field: "action.link", reason: "No URL supplied" }],
  adjustments: [],
  rationale: "Keep the primary copy grouped.",
};

assert.equal(publicSectionContract(section).items.length, 3);
assert.deepEqual(selectableTokens(tokenSet).map((token) => token.tokenKey), ["--promo-accent", "--promo-radius"]);
assert.deepEqual(allowedTokenBindings(section, tokenSet)[0], {
  itemKey: "title",
  fieldKey: null,
  slotKey: "titleColor",
  semanticRole: "accent-color",
  allowedTokenKeys: ["--promo-accent"],
});
assert.equal(
  compositionFingerprint({ template, section, tokenSet }),
  compositionFingerprint({ template, section, tokenSet }),
);

const normalized = normalizeCompositionPlan({
  plan,
  instruction: "이벤트 참여 버튼을 구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
  generateBackgroundImage: true,
  imageGuidance: "No text",
  fadeMode: "both",
});
assert.equal(normalized.content.title, "A very long ");
assert.deepEqual(normalized.content.action, { label: "Join", link: "https://example.com/current" });
assert.equal(normalized.content.locked, "Required legal copy");
assert.equal(normalized.layoutPatch.itemStyles["promotionIntro.title"].color, "#ff0000");
assert.equal(normalized.layoutPatch.itemStyles["promotionIntro.action"].borderRadius, "24px");
assert.equal(normalized.backgroundImage.requested, true);
assert.equal(normalized.backgroundImage.fadeMode, "both");

const repeatedCurrentUrl = normalizeCompositionPlan({
  plan: {
    ...plan,
    componentSelections: plan.componentSelections.map((selection) => selection.itemKey === "action"
      ? {
        ...selection,
        fields: [{
          fieldKey: null,
          textValue: null,
          ctaLabel: "Join",
          ctaUrl: "https://example.com/current",
        }],
      }
      : selection),
  },
  instruction: "버튼을 구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
});
assert.equal(repeatedCurrentUrl.content.action.link, "https://example.com/current");

const blankUrl = normalizeCompositionPlan({
  plan: {
    ...plan,
    componentSelections: plan.componentSelections.map((selection) => selection.itemKey === "action"
      ? {
        ...selection,
        fields: [{ fieldKey: null, textValue: null, ctaLabel: "Join", ctaUrl: "" }],
      }
      : selection),
  },
  instruction: "버튼을 구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
});
assert.equal(blankUrl.content.action.link, "https://example.com/current");

const correctedToken = normalizeCompositionPlan({
  plan: {
    ...plan,
    tokenBindings: [
      { itemKey: "title", fieldKey: null, slotKey: "titleColor", tokenKey: "--promo-radius" },
    ],
  },
  instruction: "구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
});
assert.equal(correctedToken.tokenBindings[0].tokenKey, "--promo-accent");
assert.match(correctedToken.adjustments.join("\n"), /보정했습니다/);

assert.throws(() => normalizeCompositionPlan({
  plan: {
    ...plan,
    componentSelections: plan.componentSelections.map((selection) => selection.itemKey === "action"
      ? { ...selection, fields: [{ fieldKey: null, textValue: null, ctaLabel: "Join", ctaUrl: "https://evil.example" }] }
      : selection),
  },
  instruction: "버튼을 구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
}), /not explicitly supplied/);

assert.throws(() => normalizeCompositionPlan({
  plan: {
    ...plan,
    componentSelections: plan.componentSelections.map((selection) => selection.itemKey === "action"
      ? { ...selection, fields: [{ fieldKey: null, textValue: null, ctaLabel: "Join", ctaUrl: "javascript:alert(1)" }] }
      : selection),
  },
  instruction: "javascript:alert(1) 버튼",
  section,
  sectionInputs: current,
  tokenSet,
}), /not explicitly supplied/);

const partialPlacement = normalizeCompositionPlan({
  plan: { ...plan, itemPlacements: plan.itemPlacements.slice(0, 2) },
  instruction: "구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
});
assert.equal(partialPlacement.layoutPatch.itemStyles["promotionIntro.locked"], undefined);
assert.equal(partialPlacement.layoutPatch.sectionStyles.promotionIntro, undefined);

assert.throws(() => normalizeCompositionPlan({
  plan: { ...plan, itemPlacements: [plan.itemPlacements[0], plan.itemPlacements[0]] },
  instruction: "구성해줘",
  section,
  sectionInputs: current,
  tokenSet,
}), /duplicate component placement/);

const provider = fs.readFileSync(path.join(__dirname, "../api/_promo-section-design-provider.js"), "utf8");
const promptStore = fs.readFileSync(path.join(__dirname, "../api/_prompt-template-store.js"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "../visual-editor/src/App.vue"), "utf8");
const context = fs.readFileSync(path.join(__dirname, "../api/_promo-section-composition-context.js"), "utf8");
assert.match(provider, /SECTION_COMPOSITION_PLAN_SCHEMA/);
assert.match(promptStore, /section_composition_planner/);
assert.match(app, /promo-section-composition-validate/);
assert.match(app, /designTokenSetVersionId:\s*template\.value\?\.designTokens\?\.versionId/);
assert.match(context, /fetchTokenVersion\(sql,\s*selectedTokenVersionId\)/);
assert.doesNotMatch(context, /template\.designTokenSetVersionId/);
assert.match(app, /EditorCommandType\.DOCUMENT_PATCH/);

console.log("Natural-language section composition contract tests passed.");
