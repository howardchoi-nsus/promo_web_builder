const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { applyWireframeEdits } = require("../api/_promo-builder-wireframe-edits");

const proposal = {
  snapshot: {
    contractVersion: 3,
    snapshotType: "registry-composition-proposal",
    compositionSpec: {
      sections: [{
        sectionKey: "hero",
        components: [{
          itemKey: "cta",
          contentBindings: [{ fieldKey: "label", sourceOverviewPath: "ctaLabel" }],
          contentItems: [],
        }],
      }],
    },
  },
  requestSnapshot: { overview: { ctaLabel: "Join now" } },
};

const edited = applyWireframeEdits(proposal, [{
  type: "update-content",
  sectionKey: "hero",
  componentKey: "cta",
  componentIndex: 0,
  fieldKey: "label",
  valueText: "Start playing",
}, {
  type: "set-horizontal-alignment",
  sectionKey: "hero",
  componentKey: "cta",
  viewport: "both",
  alignment: "center",
}]);

assert.equal(proposal.requestSnapshot.overview.ctaLabel, "Join now", "source proposal must remain immutable");
assert.equal(edited.requestSnapshot.overview.ctaLabel, "Join now");
assert.deepEqual(
  edited.snapshot.compositionSpec.sections[0].components[0].contentItems,
  [{ repeatIndex: 0, fields: [{ fieldKey: "label", value: "Start playing" }] }],
);
assert.equal(
  edited.snapshot.compositionSpec.sections[0].components[0].layoutOverrides.desktop.horizontalAlignments[0],
  "center",
);
assert.equal(
  edited.snapshot.compositionSpec.sections[0].components[0].layoutOverrides.mobile.horizontalAlignments[0],
  "center",
);
assert.throws(
  () => applyWireframeEdits(proposal, [{ type: "set-horizontal-alignment", sectionKey: "hero", componentKey: "cta", alignment: "middle" }]),
  (error) => error.code === "WIREFRAME_EDIT_ALIGNMENT_INVALID",
);
assert.throws(
  () => applyWireframeEdits(proposal, [{ type: "update-content", sectionKey: "hero", componentKey: "cta", fieldKey: "unknown", valueText: "No" }]),
  (error) => error.code === "WIREFRAME_EDIT_FIELD_UNAVAILABLE",
);
assert.throws(
  () => applyWireframeEdits(proposal, [{ type: "update-content", sectionKey: "hero", componentKey: "cta", fieldKey: "label", valueText: "x".repeat(3001) }]),
  (error) => error.code === "WIREFRAME_EDIT_CONTENT_TOO_LONG" && error.statusCode === 413,
);
assert.throws(
  () => applyWireframeEdits(proposal, [{ type: "set-horizontal-alignment", sectionKey: "hero", componentKey: "cta", componentIndex: 2, alignment: "center" }]),
  (error) => error.code === "WIREFRAME_EDIT_INDEX_INVALID",
);

const root = path.resolve(__dirname, "..");
const compiler = fs.readFileSync(path.join(root, "api", "_promo-registry-composition-compiler.js"), "utf8");
const client = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "services", "composition-client.mjs"), "utf8");
const app = fs.readFileSync(path.join(root, "visual-editor", "src", "builder", "AiBuilderApp.vue"), "utf8");
assert.match(compiler, /selected\.layoutOverrides\?\.desktop\?\.horizontalAlignments/);
assert.match(client, /\/api\/promo-builder-wireframe-edits/);
assert.match(app, /내용·배치 수정/);
assert.match(app, /saveWireframeEdits/);
assert.match(app, /structureFingerprint: wireframeFingerprint\.value/);

console.log("Wireframe inline edit contract passed");
