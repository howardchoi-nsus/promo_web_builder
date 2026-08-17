const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { builderFlags, enabled } = require("../api/_promo-builder-flags");
const { EVENT_NAMES, safeMetadata } = require("../api/promo-builder-events");

assert.equal(enabled("false"), false);
assert.equal(enabled("1"), true);
assert.equal(builderFlags({}).aiMode, true);
assert.equal(builderFlags({}).compositionV3, false);
assert.equal(builderFlags({ AI_COMPOSITION_MODE_V3: "true" }).compositionV3, true);
assert.equal(builderFlags({ PROMO_BUILDER_AI_MODE_ENABLED: "0" }).aiMode, false);
assert.equal(EVENT_NAMES.has("composition_applied"), true);
assert.deepEqual(safeMetadata({ long: "x".repeat(500), nested: { secret: true } }), {
  long: "x".repeat(300),
  nested: null,
});

const rendererCss = fs.readFileSync(
  path.resolve(__dirname, "../visual-editor/src/promo-renderer.css"),
  "utf8",
);
assert.match(rendererCss, /prefers-reduced-motion:\s*reduce/);
assert.match(rendererCss, /motion-fade-up/);

const outputApp = fs.readFileSync(
  path.resolve(__dirname, "../visual-editor/src/App.vue"),
  "utf8",
);
assert.match(outputApp, /builderDocumentId/);
assert.match(outputApp, /promo-builder-documents/);

const aiBuilderApp = fs.readFileSync(
  path.resolve(__dirname, "../visual-editor/src/builder/AiBuilderApp.vue"),
  "utf8",
);
const registryReview = fs.readFileSync(
  path.resolve(__dirname, "../visual-editor/src/builder/RegistryProposalReview.vue"),
  "utf8",
);
const operationReview = fs.readFileSync(
  path.resolve(__dirname, "../visual-editor/src/builder/OperationProposalReview.vue"),
  "utf8",
);
const capabilitiesApi = fs.readFileSync(
  path.resolve(__dirname, "../api/promo-builder-capabilities.js"),
  "utf8",
);
assert.match(aiBuilderApp, /loadCompositionShells/);
assert.match(aiBuilderApp, /mode:\s*"ai-composition"/);
assert.match(aiBuilderApp, /const proposal = await pollProposal/);
assert.match(aiBuilderApp, /applyReadyProposal/);
assert.doesNotMatch(aiBuilderApp, /<RegistryProposalReview/);
assert.match(aiBuilderApp, /applyOperationProposal/);
assert.match(aiBuilderApp, /reloadLatestForOperation/);
assert.match(aiBuilderApp, /DOCUMENT_REVISION_MISMATCH/);
assert.match(registryReview, /Composition Review/);
assert.match(registryReview, /이 구성 적용/);
assert.match(registryReview, /registry-proposal-list/);
assert.match(registryReview, /항상 포함/);
assert.match(registryReview, /componentRepeats/);
assert.match(operationReview, /Natural Language Change Review/);
assert.match(operationReview, /변경 적용/);
assert.match(capabilitiesApi, /supportedContractVersions/);

console.log("Promo Builder platform contract tests passed");
