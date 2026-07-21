const assert = require("node:assert/strict");
const {
  inputHash,
  hasAnalyzableContent,
  defaultConstraints,
  analyzableSectionContent,
  layoutPatchFromResult,
  normalizeBackgroundColor,
  safeAreaForVariant,
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
assert.equal(normalizeBackgroundColor("#ABCDEF"), "#abcdef");
assert.equal(normalizeBackgroundColor("not-a-color", "#123456"), "#123456");
assert.deepEqual(analyzableSectionContent(section, {
  title: "Welcome",
  description: "Bonus details",
  heroImage: { value: "/api/image", description: "internal prompt" },
}), { title: "Welcome", description: "Bonus details" });

const constraints = defaultConstraints(section, { sectionStyles: {} });
assert.deepEqual(constraints.contentLocks, ["title"]);
assert.deepEqual(constraints.imageTargetItemKeys, []);
assert.deepEqual(constraints.imageTarget, { type: "section-background", sectionKey: "heroBanner" });

const managedConstraints = defaultConstraints({
  ...section,
  aiDesign: {
    enabled: true,
    allowedLayoutVariants: ["split-left"],
    imageTarget: "item",
    imageTargetItemKeys: ["heroImage", "missingImage"],
    imageAspectRatio: "4:3",
  },
}, { sectionStyles: {} });
assert.deepEqual(managedConstraints.allowedLayoutVariants, ["split-left"]);
assert.deepEqual(managedConstraints.imageTargetItemKeys, ["heroImage"]);
assert.deepEqual(managedConstraints.imageTarget, { type: "item", sectionKey: "heroBanner", itemKey: "heroImage" });
assert.equal(managedConstraints.imageAspectRatio, "4:3");

const disabledConstraints = defaultConstraints({ ...section, aiDesign: { enabled: false } }, { sectionStyles: {} });
assert.equal(disabledConstraints.enabled, false);

const generated = layoutPatchFromResult(section, {
  layoutVariant: "split-right",
  minHeight: 520,
  imagePrompt: "Premium abstract promotional visual with left-side negative space, no text",
  rationale: "Copy remains readable next to the supporting visual.",
}, constraints);
assert.equal(generated.layoutPatch.sectionStyles.heroBanner.minHeight, 520);
assert.equal(generated.imageRequest.itemKey, null);
assert.equal(generated.imageRequest.target.type, "section-background");
assert.equal(generated.imageRequest.safeArea, "left-copy");
assert.equal(validatePatch(section, generated, constraints).ok, true);
assert.equal(safeAreaForVariant("split-left"), "right-copy");
assert.equal(safeAreaForVariant("split-right"), "left-copy");
assert.equal(safeAreaForVariant("centered-hero"), "center-copy");

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
assert.equal(backgroundGenerated.imageRequest.safeArea, "center-copy");
assert.equal(validatePatch(textOnlySection, backgroundGenerated, backgroundConstraints).ok, true);

console.log("Section AI design contract tests passed.");
