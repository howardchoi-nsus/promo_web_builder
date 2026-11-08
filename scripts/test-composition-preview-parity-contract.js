const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const builder = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "AiBuilderApp.vue"), "utf8");
const review = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "CompositionReview.vue"), "utf8");
const previewCanvas = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "CompositionPreviewCanvas.vue"), "utf8");
const output = fs.readFileSync(path.join(root, "visual-editor", "src", "App.vue"), "utf8");

assert.match(builder, /class="ai-wireframe-stage"/);
assert.match(builder, /class="ai-wireframe-canvas"/);
assert.match(builder, /색상과 실제 이미지는 최종 디자인에서 적용됩니다/);
assert.doesNotMatch(builder, /wireframeRenderSnapshot/);
assert.doesNotMatch(builder, /promo-page-composition-preview/);
assert.match(builder, /v-model:viewport="wireframeViewport"/);
assert.match(review, /CompositionPreviewCanvas/);
assert.match(review, /"update:viewport"/);
assert.match(previewCanvas, /PromoPageRenderer/);
assert.match(output, /PromoPageRenderer/);

console.log("Preview renderer boundary contract passed");
