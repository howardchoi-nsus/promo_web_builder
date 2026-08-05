const assert = require("node:assert/strict");
const {
  buildSectionImagePromptVariables,
} = require("../api/_section-image-prompt-variables");

const guidance = "Create a distinctive bounded Hero key visual with no interface text.";
const variables = buildSectionImagePromptVariables({
  promptType: "component_image",
  section: { sectionKey: "hero", name: "Hero" },
  component: { itemKey: "visual", name: "Key Visual" },
  field: {
    fieldKey: "image",
    name: "Image",
    image: { promptText: "No text or logos." },
  },
  sectionContent: { title: "Summer Event" },
  request: { assetRole: "hero-key-visual", guidance },
});

assert.equal(variables.sectionName, "Hero");
assert.equal(variables.componentName, "Key Visual");
assert.equal(variables.fieldName, "Image");
assert.match(variables.adminGuidance, /No text or logos/);
assert.match(variables.adminGuidance, /distinctive bounded Hero key visual/);

console.log("Section image prompt variable tests passed");
