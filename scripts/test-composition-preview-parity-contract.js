const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  computeRenderFingerprint,
  renderProjection,
} = require("../api/_promo-registry-composition-runtime");

const snapshot = {
  contractVersion: 3,
  documentRevision: 2,
  content: { sectionOrder: ["hero"], sectionInputs: { hero: { title: "Offer" } } },
  designSpec: { sectionStyles: { hero: { minHeight: 520 } }, itemStyles: {} },
  motionSpec: { sections: {}, items: {} },
  assets: { items: {}, requests: [] },
  validation: { warnings: ["ignored by render parity"] },
};

assert.equal(
  computeRenderFingerprint(snapshot),
  computeRenderFingerprint({ ...snapshot, documentRevision: 99 }),
  "document metadata must not change render parity",
);
assert.notEqual(
  computeRenderFingerprint(snapshot),
  computeRenderFingerprint({
    ...snapshot,
    designSpec: { ...snapshot.designSpec, sectionStyles: { hero: { minHeight: 700 } } },
  }),
  "layout changes must invalidate the reviewed preview",
);
assert.deepEqual(Object.keys(renderProjection(snapshot)).sort(), [
  "assets", "content", "contractVersion", "designSpec", "motionSpec",
]);

const root = path.resolve(__dirname, "..");
const previewApi = fs.readFileSync(path.join(root, "api", "promo-page-composition-preview.js"), "utf8");
const applyApi = fs.readFileSync(path.join(root, "api", "promo-page-composition-apply.js"), "utf8");
const builder = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "AiBuilderApp.vue"), "utf8");
const review = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "CompositionReview.vue"), "utf8");

assert.match(previewApi, /compileCurrentRegistryProposal/);
assert.match(applyApi, /previewRenderFingerprint/);
assert.match(builder, /:snapshot="wireframeRenderSnapshot"/);
assert.match(builder, /previewRenderFingerprint: wireframeRenderFingerprint\.value/);
assert.match(builder, /v-if="wireframeEditing \|\| !renderedWireframeRequired"/);
assert.match(builder, /v-model:viewport="wireframeViewport"/);
assert.match(review, /CompositionPreviewCanvas/);
assert.match(review, /"update:viewport"/);

console.log("Composition preview parity contract passed");
