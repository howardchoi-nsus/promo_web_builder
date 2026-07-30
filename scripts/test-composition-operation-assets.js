const assert = require("node:assert/strict");
const {
  validateCompositionOperations,
  applyCompositionOperations,
} = require("../api/_promo-page-composition-operations");

const snapshot = {
  content: {
    sectionOrder: ["hero"],
    sectionSnapshot: [{
      sectionKey: "hero",
      name: "Hero",
      items: [{
        itemKey: "visual",
        name: "Visual",
        fieldKind: "image",
        fields: [{
          fieldKey: "image",
          name: "Image",
          fieldKind: "image",
          isLocked: false,
        }],
      }],
    }],
    sectionInputs: {
      hero: {
        visual: { source: "ai", value: "/old.png", description: "", alt: "" },
      },
    },
    formTemplate: { designTokens: { values: {} } },
  },
  designSpec: {
    sectionStyles: { hero: { backgroundImage: "/hero.png" } },
    itemStyles: {},
    visibility: { items: {}, fields: {} },
  },
  motionSpec: { sections: {}, items: {} },
  assets: {
    items: {},
    requests: [{
      assetRequestId: "old-hero",
      targetType: "section-key-visual",
      pageSectionInstanceId: "hero",
      status: "ready",
    }],
  },
};

const remove = validateCompositionOperations({
  operations: [{
    operationId: "remove-hero",
    type: "remove-asset",
    targetInstanceId: "hero",
    fieldKey: "",
    reason: "Remove",
  }],
}, snapshot);
const removed = applyCompositionOperations(snapshot, remove.operations);
assert.equal(removed.designSpec.sectionStyles.hero.backgroundImage, undefined);
assert.equal(removed.assets.requests.length, 0);
assert.equal(snapshot.designSpec.sectionStyles.hero.backgroundImage, "/hero.png");

const regenerate = validateCompositionOperations({
  operations: [{
    operationId: "regenerate-visual",
    type: "request-asset-regeneration",
    targetInstanceId: "visual",
    fieldKey: "image",
    valueText: "Use a quiet right-aligned subject.",
    reason: "Regenerate",
  }],
}, snapshot);
const requested = applyCompositionOperations(snapshot, regenerate.operations);
assert.equal(requested.assets.requests.at(-1).targetType, "component-field-image");
assert.equal(requested.assets.requests.at(-1).fieldKey, "image");
assert.equal(requested.assets.requests.at(-1).guidance, "Use a quiet right-aligned subject.");

console.log("Composition operation asset tests passed.");
