const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const app = read("visual-editor/src/App.vue");
const context = read("visual-editor/src/editor-context.mjs");
const adapter = read("visual-editor/src/platform/adapters/ai-document-adapter.mjs");
const builder = read("visual-editor/src/builder/AiBuilderApp.vue");
const documentsApi = read("api/promo-builder-documents.js");
const renderer = read("visual-editor/src/PromoPageRenderer.vue");
const composition = read("api/_promo-page-composition-contract.js");
const { normalizeSectionSnapshot } = require("../api/promo-builder-documents");

assert.match(context, /mode === "ai-document"/);
assert.match(context, /canSaveAiDocument: isAiDocument/);
assert.match(context, /canEditDesignTokens: isAdminLayout \|\| isAiDocument/);
assert.match(context, /canComposeStructure: isBuilderWorkspace/);
assert.match(builder, /searchParams\.set\("mode", "ai-document"\)/);
assert.match(builder, /window\.location\.assign\(url\)/);
assert.doesNotMatch(builder, /refreshAssetsUntilSettled/);
assert.match(adapter, /method: "PATCH"/);
assert.match(app, /async function loadAiDocument/);
assert.match(app, /async function saveAiDocument/);
assert.match(app, /builderDocumentId/);
assert.match(app, /mode", "output"/);
assert.match(documentsApi, /if \(req\.method === "PATCH"\)/);
assert.match(documentsApi, /createDocumentRevision/);
assert.match(documentsApi, /source: "manual"/);
assert.match(documentsApi, /assets: currentSnapshot\.assets/);
assert.match(documentsApi, /motionSpec: currentSnapshot\.motionSpec/);
assert.match(documentsApi, /sectionSnapshot: sections/);
assert.deepEqual(normalizeSectionSnapshot([
  { sectionKey: "sec_demo", items: [{ itemKey: "title" }] },
]), [{ sectionKey: "sec_demo", items: [{ itemKey: "title", fields: [] }] }]);
assert.throws(
  () => normalizeSectionSnapshot([
    { sectionKey: "duplicate", items: [] },
    { sectionKey: "duplicate", items: [] },
  ]),
  (error) => error.code === "INVALID_SECTION_SNAPSHOT",
);
assert.match(composition, /buildDefaultItemStyles/);
assert.match(composition, /--promo-font-size-main-title/);
assert.match(renderer, /style\.fontWeightToken \? `var\(\$\{style\.fontWeightToken\}\)`/);

console.log("AI document Visual Editor contract passed");
