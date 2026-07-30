const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const layoutStore = require("../api/_wizard-form-template-layout-store");

const migration = read("db/migrations/046_template_layout_composition_snapshot.sql");
const layoutApi = read("api/wizard-form-template-layout.js");
const publicApi = read("api/wizard-form-template-public.js");
const createPromo = read("prototype/create-promo.js");
const snapshotContract = read("prototype/wizard/editor-snapshot-contract.js");
const app = read("visual-editor/src/App.vue");

assert.match(migration, /composition_snapshot jsonb not null default '\[\]'/);
assert.match(layoutApi, /compositionSnapshot/);
assert.match(publicApi, /layout\.compositionSnapshot\.length/);
assert.match(createPromo, /templateSectionDefinitions/);
assert.match(createPromo, /change\.sectionSnapshot/);
assert.match(snapshotContract, /sectionSnapshot/);
assert.match(app, /compositionSnapshot: sections\.value/);

const normalized = layoutStore.normalizeCompositionSnapshot([
  {
    sectionKey: "sec_test",
    items: [
      { itemKey: "title", fields: [{ fieldKey: "text" }] },
    ],
  },
]);
assert.equal(normalized[0].items[0].itemKey, "title");
assert.throws(
  () => layoutStore.normalizeCompositionSnapshot([
    { sectionKey: "sec_test", items: [] },
    { sectionKey: "sec_test", items: [] },
  ]),
  (error) => error.code === "INVALID_COMPOSITION_SNAPSHOT",
);

console.log("Editor composition persistence contract passed.");
