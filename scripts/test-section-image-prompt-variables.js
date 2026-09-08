const assert = require("node:assert/strict");
const {
  buildSectionImagePromptVariables,
} = require("../api/_section-image-prompt-variables");

const guidance = "Create a distinctive bounded Hero key visual with no interface text.";
const variables = buildSectionImagePromptVariables({
  promptType: "component_image",
  section: { sectionKey: "hero", name: "Hero" },
  component: { id: "visual-2", itemKey: "visual", name: "Key Visual", collection: { index: 1 } },
  field: {
    fieldKey: "image",
    name: "Image",
    image: { promptText: "No text or logos." },
  },
  sectionContent: {
    "visual-2": { fields: { description: "무료 배송 혜택" } },
    "visual-1": { fields: { description: "신규 고객 할인" } },
  },
  request: { assetRole: "hero-key-visual", guidance },
});

assert.equal(variables.sectionName, "Hero");
assert.equal(variables.componentName, "Key Visual");
assert.equal(variables.fieldName, "Image");
assert.match(variables.adminGuidance, /No text or logos/);
assert.match(variables.adminGuidance, /distinctive bounded Hero key visual/);
assert.match(variables.adminGuidance, /collection item 2/);
assert.match(variables.contentJson, /무료 배송 혜택/);
assert.doesNotMatch(variables.contentJson, /신규 고객 할인/);

console.log("Section image prompt variable tests passed");
