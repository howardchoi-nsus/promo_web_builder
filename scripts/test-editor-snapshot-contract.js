const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "prototype", "wizard", "editor-snapshot-contract.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const contract = context.globalThis.PromoEditorSnapshotContract;

assert.ok(contract);
assert.equal(contract.normalizeRevision("3.9"), 3);
assert.equal(contract.normalizeRevision(-1), 0);
assert.equal(contract.shouldAcceptRevision(2, 3), false);
assert.equal(contract.shouldAcceptRevision(3, 3), true);
assert.equal(contract.shouldAcceptRevision(0, 3), true);

const sourceSnapshot = { content: { sectionInputs: { hero: { title: "A" } } } };
const snapshot = contract.createBridgeSnapshot(sourceSnapshot, 4);
snapshot.content.sectionInputs.hero.title = "B";
assert.equal(sourceSnapshot.content.sectionInputs.hero.title, "A");
assert.equal(snapshot.snapshotRevision, 4);

const change = contract.normalizeEditorChange({
  snapshotRevision: "5",
  designSpec: { theme: { backgroundColor: "#fff" } },
  sectionInputs: { hero: { title: "Title" } },
});
assert.equal(change.snapshotRevision, 5);
assert.notEqual(change.designSpec, sourceSnapshot);
assert.equal(contract.normalizeEditorChange({}), null);

console.log("Editor snapshot contract tests passed");
