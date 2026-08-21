const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const renderer = fs.readFileSync(
  path.resolve(__dirname, "../visual-editor/src/PromoPageRenderer.vue"),
  "utf8",
);

assert.match(renderer, /function inspectLayoutQuality\(\)/);
assert.match(renderer, /\.rendered-item\[data-style-key\]/);
assert.match(renderer, /REQUIRED_ASSET_PLACEHOLDER/);
assert.match(renderer, /ITEM_COLLISION/);
assert.match(renderer, /ITEM_CLIPPED/);
assert.match(renderer, /ITEM_CONTENT_OVERFLOW/);
assert.match(renderer, /SECTION_DEAD_SPACE_EXCESS/);
assert.match(renderer, /defineExpose\(\{ inspectLayoutCollisions, inspectLayoutQuality \}\)/);

console.log("Promo render quality contract tests passed.");
