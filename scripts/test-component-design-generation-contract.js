const assert = require("node:assert/strict");
const {
  parseDataUrl,
  normalizeCropSpec,
  ComponentSourceError,
} = require("../api/_component-design-source-contract");
const {
  normalizeProposal,
  collectTokenBindings,
  componentSimilarity,
} = require("../api/_component-generation-service");

const png = Buffer.alloc(33);
Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, 0);
png.writeUInt32BE(13, 8);
png.write("IHDR", 12, "ascii");
png.writeUInt32BE(320, 16);
png.writeUInt32BE(180, 20);
const parsed = parseDataUrl(`data:image/png;base64,${png.toString("base64")}`);
assert.equal(parsed.mimeType, "image/png");
assert.equal(parsed.width, 320);
assert.equal(parsed.height, 180);
assert.match(parsed.contentHash, /^[a-f0-9]{64}$/);

assert.throws(
  () => parseDataUrl(`data:image/jpeg;base64,${png.toString("base64")}`),
  (error) => error instanceof ComponentSourceError && error.code === "IMAGE_SIGNATURE_MISMATCH",
);
assert.deepEqual(normalizeCropSpec({ x: .8, y: .7, width: .8, height: .8 }), { x: .8, y: .7, width: .2, height: .3 });

const proposal = normalizeProposal({
  name: "Promotion Card",
  confidence: .76,
  fields: [
    { fieldKey: "Title", name: "Title", fieldKind: "text", textType: "title" },
    { fieldKey: "Hero Image", name: "Hero", fieldKind: "image" },
    { fieldKey: "Title", name: "CTA", fieldKind: "cta" },
  ],
  renderSpec: {
    contractVersion: 1,
    root: { nodeType: "element", tag: "article", tokenBindings: { backgroundColor: "--promo-surface" }, children: [] },
    responsive: {}, accessibility: {},
  },
});
assert.deepEqual(proposal.fields.map((field) => field.fieldKey), ["title", "hero_image", "title_3"]);
assert.equal(proposal.confidence, .76);
assert.deepEqual(collectTokenBindings(proposal.renderSpec.root), { "article.backgroundColor": "--promo-surface" });
assert.equal(componentSimilarity(proposal, { fields: [{ fieldKind: "text" }, { fieldKind: "image" }, { fieldKind: "cta" }] }), 1);

const fs = require("node:fs");
const promptStore = fs.readFileSync("api/_prompt-template-store.js", "utf8");
const promptUi = fs.readFileSync("prototype/index.html", "utf8");
const workspace = fs.readFileSync("admin-app/src/components/ComponentGenerationWorkspace.vue", "utf8");
assert.match(promptStore, /component_visual_analyzer/);
assert.match(promptUi, /컴포넌트 이미지 분석/);
assert.match(workspace, /원본 업로드 없이 다시 분석/);
assert.match(workspace, /컴포넌트 Draft 생성 · CDR-10/);

console.log("component design generation contract tests passed");
