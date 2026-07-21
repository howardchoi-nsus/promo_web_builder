const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "prototype", "wizard", "wizard-storage.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const wizardStorage = context.globalThis.PromoWizardStorage;

const values = new Map();
const storage = {
  getItem(key) { return values.get(key) || null; },
  setItem(key, value) { values.set(key, value); },
};
values.set("wizard", JSON.stringify({
  sectionInputSchemaVersion: 1,
  promo: { title: "Saved" },
  sectionInputs: { hero: { title: "Legacy" } },
  templateInputs: { default: {} },
}));
const loaded = wizardStorage.loadWizardContent({
  storage,
  storageKey: "wizard",
  backupKey: "backup",
  schemaVersion: 2,
  createDefault: () => ({ promo: { title: "", market: "" }, simpleBrief: {}, templateInputs: {}, sectionInputs: {} }),
  migrateSectionInputs: (inputs) => ({ ...inputs, migrated: true }),
  objectKeys: ["templateInputs"],
});
assert.equal(loaded.promo.title, "Saved");
assert.equal(loaded.sectionInputs.migrated, true);
assert.equal(JSON.parse(values.get("backup")).sectionInputSchemaVersion, 1);

const snapshot = wizardStorage.createLayoutSnapshot({
  layoutRevision: 3,
  layoutIdentity: { templateId: "template-id" },
  formTemplate: { id: "template-id" },
  sections: [{ sectionKey: "hero", items: [{ itemKey: "title" }] }],
  sectionInputs: { hero: { title: "Promo" } },
  sectionDesignRuns: { hero: { runId: "run-id" } },
  designSpec: { sectionStyles: {} },
});
assert.equal(snapshot.layoutRevision, 3);
assert.equal(snapshot.content.sectionOrder[0], "hero");
assert.equal(snapshot.content.sectionDesignRuns.hero.runId, "run-id");

wizardStorage.persistWizardContent(storage, "saved", { ok: true });
assert.deepEqual(JSON.parse(values.get("saved")), { ok: true });

console.log("Wizard storage module tests passed.");
