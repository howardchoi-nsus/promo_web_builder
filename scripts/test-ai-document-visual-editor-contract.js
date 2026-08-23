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
const previewPanel = read("visual-editor/src/platform/editor-ui/PreviewPanel.vue");
const composition = read("api/_promo-page-composition-contract.js");
const { normalizeSectionSnapshot } = require("../api/promo-builder-documents");

assert.match(context, /mode === "ai-document"/);
assert.match(context, /canSaveAiDocument: isAiDocument && canMutate/);
assert.match(context, /canEditDesignTokens: \(isAdminLayout \|\| isAiDocument\) && canMutate/);
assert.match(context, /canComposeStructure: isBuilderWorkspace && !isSectionPreset && canMutate/);
assert.match(builder, /visualEditorEntry\.aiDocument/);
assert.match(builder, /window\.location\.assign\(visualEditorEntry\.aiDocument/);
assert.doesNotMatch(builder, /refreshAssetsUntilSettled/);
assert.match(adapter, /method: "PATCH"/);
assert.match(adapter, /error\.currentDocumentRevision/);
assert.match(app, /async function loadAiDocument/);
assert.match(app, /await refreshAiDocumentAssetsUntilSettled\(\);/);
assert.match(app, /evaluateAssetReadiness\(requests, aiDocumentSnapshot\.value\?\.assets\?\.expected\)/);
assert.match(app, /ASSET_GENERATION_TIMEOUT/);
assert.match(app, /async function runAiDocumentQualityGate/);
assert.match(app, /inspectQualityAcrossViewports/);
assert.match(app, /Preview 품질 검사를 통과하지 못해 저장하지 않았습니다/);
assert.match(app, /async function saveAiDocument/);
assert.match(app, /DOCUMENT_REVISION_MISMATCH/);
assert.match(app, /rebaseAiDocumentChanges/);
assert.match(app, /현재 변경을 최신본에 재적용/);
assert.match(app, /builderDocumentId/);
assert.match(app, /mode", "output"/);
assert.match(app, /:layout-fit-repairs="aiDocumentSnapshot\?\.compositionMeta\?\.layoutFitRepairs \|\| \[\]"/);
assert.match(previewPanel, /layoutFitRepairs: \{ type: Array/);
assert.match(previewPanel, /const selectedLayoutFitRepair = computed/);
assert.match(previewPanel, /String\(repair\?\.toLayoutKey \|\| ""\) === selectedLayoutKey/);
assert.match(previewPanel, /data-testid="layout-selection-status"/);
assert.match(previewPanel, /선택 Layout/);
assert.match(previewPanel, /자동 보정/);
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
assert.match(renderer, /blockingCount: collisionCount \+ placeholderAssetCount \+ clippedItemCount \+ overflowItemCount/);

console.log("AI document Visual Editor contract passed");
