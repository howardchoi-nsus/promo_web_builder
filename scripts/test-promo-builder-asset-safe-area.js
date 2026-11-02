const assert = require("node:assert/strict");
const { sectionVisualSafeArea } = require("../api/_promo-builder-assets");

function section(selectionMetadata) {
  return {
    selectedLayoutKey: "hero-layout",
    layoutPresets: [{ layoutKey: "hero-layout", selectionMetadata }],
  };
}

assert.equal(sectionVisualSafeArea(section({ contentRegion: "center-left" })), "left-copy");
assert.equal(sectionVisualSafeArea(section({ contentRegion: "center-right" })), "right-copy");
assert.equal(sectionVisualSafeArea(section({ contentRegion: "center" })), "center-copy");
assert.equal(sectionVisualSafeArea(section({ contentRegion: "center-left", mediaSafeSide: "left" })), "left-copy");
assert.equal(sectionVisualSafeArea(section({ mediaSafeSide: "left" })), "right-copy");
assert.equal(sectionVisualSafeArea(section({ mediaSafeSide: "right" })), "left-copy");
assert.equal(sectionVisualSafeArea(section({ mediaSafeSide: "center" })), "none");
assert.equal(sectionVisualSafeArea(section({ mediaSafeSide: "either" })), "none");
assert.equal(sectionVisualSafeArea({}), "none");

console.log("Promo Builder asset safe-area tests passed");
