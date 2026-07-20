const assert = require("node:assert/strict");
const {
  inputHash,
  hasAnalyzableContent,
  defaultConstraints,
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

const constraints = defaultConstraints(section, { sectionStyles: {} });
assert.deepEqual(constraints.contentLocks, ["title"]);
assert.deepEqual(constraints.imageTargetItemKeys, ["heroImage"]);

const generated = layoutPatchFromResult(section, {
  layoutVariant: "split-right",
  minHeight: 520,
  imagePrompt: "Premium abstract promotional visual with left-side negative space, no text",
  rationale: "Copy remains readable next to the supporting visual.",
}, constraints);
assert.equal(generated.layoutPatch.sectionStyles.heroBanner.minHeight, 520);
assert.equal(generated.imageRequest.itemKey, "heroImage");
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

console.log("Section AI design contract tests passed.");
