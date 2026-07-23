const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "prototype", "wizard", "wizard-content.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const content = context.globalThis.PromoWizardContent;

const defaults = content.createDefaultWizardContent({ includeSectionDesignRuns: true });
assert.equal(defaults.sectionInputSchemaVersion, 3);
assert.deepEqual(JSON.parse(JSON.stringify(defaults.sectionDesignRuns)), {});

const definitions = [{
  sectionKey: "hero",
  items: [
    { itemKey: "title", fieldKind: "text", isLocked: false },
    { itemKey: "fixed", fieldKind: "text", isLocked: true, lockedValue: "Admin copy" },
    { itemKey: "cta", fieldKind: "cta", isLocked: false },
    { itemKey: "image", fieldKind: "image", isLocked: false, image: { allowedSources: ["ai", "url"] } },
    {
      itemKey: "composite",
      fieldKind: "text",
      isLocked: false,
      fields: [
        { fieldKey: "fld_title", fieldKind: "text", isLocked: false },
        { fieldKey: "fld_visual", fieldKind: "image", isLocked: false, image: { allowedSources: ["ai"] } },
      ],
    },
  ],
}];
const merged = content.mergeSectionInputs({ hero: { title: "User copy", fixed: "Override" } }, definitions);
assert.equal(merged.hero.title, "User copy");
assert.equal(merged.hero.fixed, "Admin copy");
assert.deepEqual(JSON.parse(JSON.stringify(merged.hero.cta)), { label: "", link: "", target: "_blank" });
assert.equal(merged.hero.image.source, "ai");
assert.equal(merged.hero.composite.fields.fld_title, "");
assert.equal(merged.hero.composite.fields.fld_visual.source, "ai");

const migrated = content.migrateLegacySectionInputs({
  heroBanner: { leaderText: "Lead", cta: { label: "Join" } },
});
assert.equal(migrated.heroBanner.leadText, "Lead");
assert.equal(migrated.heroBanner.button.label, "Join");

console.log("Wizard content module tests passed.");
