const assert = require("node:assert/strict");
const {
  inputHash,
  hasAnalyzableContent,
  defaultConstraints,
  analyzableSectionContent,
  layoutPatchFromResult,
  layoutPatchFromDesignPlan,
  normalizeBackgroundColor,
  resolveImageTarget,
  safeAreaForVariant,
  validatePatch,
} = require("../api/_promo-section-design-contract");

const section = {
  sectionKey: "heroBanner",
  name: "Hero Banner",
  items: [
    { itemKey: "title", fieldKind: "text", isLocked: true, isVisibleInWizard: true },
    { itemKey: "description", fieldKind: "text", isLocked: false, isVisibleInWizard: true },
    { itemKey: "heroImage", fieldKind: "image", isLocked: false, isVisibleInWizard: true, image: { allowedSources: ["ai", "file"] } },
    { itemKey: "secondaryImage", fieldKind: "image", isLocked: false, isVisibleInWizard: true, image: { allowedSources: ["ai"] } },
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
assert.equal(constraints.allowSectionBackground, true);

const managedConstraints = defaultConstraints({
  ...section,
  aiDesign: {
    enabled: true,
    allowedLayoutVariants: ["split-left"],
    imageTarget: "item",
    imageTargetItemKeys: ["heroImage", "secondaryImage", "missingImage"],
    imageAspectRatio: "4:3",
  },
}, { sectionStyles: {} });
assert.deepEqual(managedConstraints.allowedLayoutVariants, ["split-left"]);
assert.deepEqual(managedConstraints.imageTargetItemKeys, ["heroImage", "secondaryImage"]);
assert.deepEqual(managedConstraints.imageTarget, { type: "item", sectionKey: "heroBanner", itemKey: "heroImage" });
assert.equal(managedConstraints.imageAspectRatio, "4:3");
const selectedTarget = resolveImageTarget(managedConstraints, "heroBanner", "secondaryImage");
assert.equal(selectedTarget.ok, true);
assert.deepEqual(selectedTarget.constraints.imageTarget, { type: "item", sectionKey: "heroBanner", itemKey: "secondaryImage" });
assert.equal(resolveImageTarget(managedConstraints, "heroBanner", "missingImage").ok, false);
const selectedBackgroundTarget = resolveImageTarget(managedConstraints, "heroBanner", "", "section-background");
assert.equal(selectedBackgroundTarget.ok, true);
assert.deepEqual(selectedBackgroundTarget.constraints.imageTarget, { type: "section-background", sectionKey: "heroBanner" });
assert.equal(resolveImageTarget({ ...managedConstraints, allowSectionBackground: false }, "heroBanner", "", "section-background").ok, false);

const invalidItemConstraints = defaultConstraints({
  ...section,
  aiDesign: {
    ...section.aiDesign,
    imageTarget: "item",
    imageTargetItemKeys: ["missingImage"],
  },
}, { sectionStyles: {} });
assert.equal(invalidItemConstraints.imageTarget, null);

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
const tinyTextPatch = structuredClone(generated);
tinyTextPatch.layoutPatch.itemStyles["heroBanner.description"] = { widthPct: 0.1, heightPx: 1 };
assert.equal(validatePatch(section, tinyTextPatch, constraints).ok, true);
const tinyImagePatch = structuredClone(generated);
tinyImagePatch.layoutPatch.itemStyles["heroBanner.heroImage"] = { widthPct: 0.1, heightPx: 1 };
assert.equal(validatePatch(section, tinyImagePatch, constraints).ok, true);
const backgroundColorOverride = structuredClone(generated);
backgroundColorOverride.layoutPatch.sectionStyles.heroBanner.backgroundColor = "#ffffff";
assert.equal(validatePatch(section, backgroundColorOverride, constraints).ok, false);
assert.match(
  validatePatch(section, backgroundColorOverride, constraints).errors.join("; "),
  /Unsupported section style: backgroundColor/
);
const fadeColorOverride = structuredClone(generated);
fadeColorOverride.layoutPatch.sectionStyles.heroBanner.backgroundFadeColor = "#ffffff";
assert.equal(validatePatch(section, fadeColorOverride, constraints).ok, false);
assert.match(
  validatePatch(section, fadeColorOverride, constraints).errors.join("; "),
  /Unsupported section style: backgroundFadeColor/
);
const selectedTargetGenerated = layoutPatchFromResult(section, {
  layoutVariant: "split-left",
  minHeight: 520,
  imagePrompt: "Secondary supporting image",
  rationale: "Use the specifically requested image Item.",
}, selectedTarget.constraints);
assert.equal(selectedTargetGenerated.imageRequest.itemKey, "secondaryImage");
assert.equal(selectedTargetGenerated.imageRequest.target.itemKey, "secondaryImage");
assert.equal(safeAreaForVariant("split-left"), "right-copy");
assert.equal(safeAreaForVariant("split-right"), "left-copy");
assert.equal(safeAreaForVariant("centered-hero"), "center-copy");

assert.throws(() => layoutPatchFromResult(section, {
  layoutVariant: "unsupported",
  minHeight: 400,
  imagePrompt: "test",
}, constraints), /not allowed/);

const stackedTextSection = {
  sectionKey: "generatedHero",
  aiContent: {
    title: "Bright Summer Welcome Bonus for New Users",
    subtitle: "Kick off your summer with an exclusive bonus on your first deposit",
    description: "Join the community and enjoy extra value and fun throughout the promotion.",
  },
  items: [
    { itemKey: "title", fieldKind: "text", textType: "title" },
    { itemKey: "subtitle", fieldKind: "text", textType: "headline" },
    { itemKey: "description", fieldKind: "text", textType: "multi" },
  ],
};
const stackedTextPlan = {
  layoutVariant: "split-right",
  itemPlacements: stackedTextSection.items.map((item, order) => ({
    itemKey: item.itemKey,
    region: "copy-primary",
    order,
  })),
  slotSelections: [],
  assetRequests: [],
  rationale: "Stack copy safely.",
};
const stackedTextLayout = layoutPatchFromDesignPlan(stackedTextSection, stackedTextPlan, { values: [] });
const stackedTitle = stackedTextLayout.layoutPatch.itemStyles["generatedHero.title"];
const stackedSubtitle = stackedTextLayout.layoutPatch.itemStyles["generatedHero.subtitle"];
const stackedDescription = stackedTextLayout.layoutPatch.itemStyles["generatedHero.description"];
assert.equal(stackedTitle.heightMode, "auto");
assert.equal(stackedSubtitle.heightMode, "auto");
assert.equal(stackedDescription.heightMode, "auto");
assert.equal(Object.hasOwn(stackedTitle, "heightPx"), false);
assert.ok(stackedSubtitle.yPx > stackedTitle.yPx);
assert.ok(stackedDescription.yPx > stackedSubtitle.yPx);
assert.ok(stackedTextLayout.layoutPatch.sectionStyles.generatedHero.minHeight > 520);

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
