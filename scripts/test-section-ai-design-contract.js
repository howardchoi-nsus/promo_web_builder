const assert = require("node:assert/strict");
const {
  inputHash,
  hasAnalyzableContent,
  defaultConstraints,
  analyzableSectionContent,
  layoutPatchFromResult,
  validatePatch,
} = require("../api/_promo-section-design-contract");

const section = {
  sectionKey: "heroBanner",
  name: "Hero Banner",
  items: [
    { itemKey: "title", fieldKind: "text", isLocked: true, isVisibleInWizard: true },
    { itemKey: "description", fieldKind: "text", isLocked: false, isVisibleInWizard: true },
    { itemKey: "heroImage", fieldKind: "image", isLocked: false, isVisibleInWizard: true },
  ],
};

assert.equal(hasAnalyzableContent({ title: "Welcome" }), true);
assert.equal(hasAnalyzableContent({ title: "" }), false);
assert.equal(inputHash({ b: 2, a: 1 }), inputHash({ a: 1, b: 2 }));
assert.deepEqual(analyzableSectionContent(section, {
  title: "Welcome",
  description: "Bonus details",
  heroImage: { value: "/api/image", description: "internal prompt" },
}), { title: "Welcome", description: "Bonus details" });

const constraints = defaultConstraints(section, { sectionStyles: {} });
assert.deepEqual(constraints.contentLocks, ["title"]);
assert.deepEqual(constraints.imageTargetItemKeys, ["heroImage"]);
assert.deepEqual(constraints.imageTarget, { type: "item", sectionKey: "heroBanner", itemKey: "heroImage" });

const generated = layoutPatchFromResult(section, {
  layoutVariant: "split-right",
  minHeight: 520,
  imagePrompt: "Premium abstract promotional visual with left-side negative space, no text",
  rationale: "Copy remains readable next to the supporting visual.",
}, constraints);
assert.equal(generated.layoutPatch.sectionStyles.heroBanner.minHeight, 520);
assert.equal(generated.imageRequest.itemKey, "heroImage");
assert.equal(generated.imageRequest.target.type, "item");
assert.equal(validatePatch(section, generated, constraints).ok, true);

assert.throws(() => layoutPatchFromResult(section, {
  layoutVariant: "unsupported",
  minHeight: 400,
  imagePrompt: "test",
}, constraints), /not allowed/);

const lockedConstraints = { ...constraints, layoutLocks: ["minHeight"] };
const lockedGenerated = layoutPatchFromResult(section, {
  layoutVariant: "centered-hero",
  minHeight: 800,
  imagePrompt: "Centered visual, no text",
  rationale: "Centered composition.",
}, lockedConstraints);
assert.equal(Object.hasOwn(lockedGenerated.layoutPatch.sectionStyles.heroBanner, "minHeight"), false);
assert.equal(validatePatch(section, lockedGenerated, lockedConstraints).ok, true);

const textOnlySection = {
  sectionKey: "terms",
  name: "Terms",
  items: [{ itemKey: "content", fieldKind: "text", isLocked: false, isVisibleInWizard: true }],
};
const backgroundConstraints = defaultConstraints(textOnlySection, { sectionStyles: {} });
assert.deepEqual(backgroundConstraints.imageTargetItemKeys, []);
assert.deepEqual(backgroundConstraints.imageTarget, { type: "section-background", sectionKey: "terms" });
const backgroundGenerated = layoutPatchFromResult(textOnlySection, {
  layoutVariant: "centered-hero",
  minHeight: 420,
  imagePrompt: "Subtle responsible gaming background without text",
  rationale: "Background supports the copy.",
}, backgroundConstraints);
assert.equal(backgroundGenerated.imageRequest.target.type, "section-background");
assert.equal(backgroundGenerated.imageRequest.itemKey, null);
assert.equal(validatePatch(textOnlySection, backgroundGenerated, backgroundConstraints).ok, true);

console.log("Section AI design contract tests passed.");
