const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "prototype", "wizard", "wizard-content.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const content = context.globalThis.PromoWizardContent;

const defaults = content.createDefaultWizardContent({ includeSectionDesignRuns: true });
assert.equal(defaults.sectionInputSchemaVersion, 4);
assert.equal(defaults.designTokenSetVersionId, "");
assert.deepEqual(JSON.parse(JSON.stringify(defaults.sectionDesignRuns)), {});
assert.deepEqual(JSON.parse(JSON.stringify(defaults.templateDefaultContents)), {});

const definitions = [{
  sectionKey: "hero",
  items: [
    { itemKey: "title", fieldKind: "text", isLocked: false },
    { itemKey: "subtitle", fieldKind: "text", isLocked: false, defaultValue: "Component default" },
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

const withTemplateDefaults = content.mergeSectionInputs(
  { hero: { title: "User copy" } },
  definitions,
  {
    hero: {
      title: "Template title",
      subtitle: "Template subtitle",
      fixed: "Template override",
      image: { source: "url", value: "https://example.com/logo.png", description: "", alt: "Logo" },
    },
  },
);
assert.equal(withTemplateDefaults.hero.title, "User copy");
assert.equal(withTemplateDefaults.hero.subtitle, "Template subtitle");
assert.equal(withTemplateDefaults.hero.fixed, "Admin copy");
assert.equal(withTemplateDefaults.hero.image.value, "https://example.com/logo.png");

const legacyFallbackRebased = content.mergeSectionInputs(
  { hero: { title: "", image: { source: "ai", value: "", description: "", alt: "" } } },
  definitions,
  {
    hero: {
      title: "New template title",
      image: { source: "url", value: "https://example.com/new-logo.png", description: "", alt: "Logo" },
    },
  },
);
assert.equal(legacyFallbackRebased.hero.title, "New template title");
assert.equal(legacyFallbackRebased.hero.image.value, "https://example.com/new-logo.png");

const updatedDefaultRebased = content.mergeSectionInputs(
  { hero: { title: "Old template title" } },
  definitions,
  { hero: { title: "New template title" } },
  { hero: { title: "Old template title" } },
);
assert.equal(updatedDefaultRebased.hero.title, "New template title");

const userOverridePreserved = content.mergeSectionInputs(
  { hero: { title: "User override" } },
  definitions,
  { hero: { title: "New template title" } },
  { hero: { title: "Old template title" } },
);
assert.equal(userOverridePreserved.hero.title, "User override");

const migrated = content.migrateLegacySectionInputs({
  heroBanner: { leaderText: "Lead", cta: { label: "Join" } },
});
assert.equal(migrated.heroBanner.leadText, "Lead");
assert.equal(migrated.heroBanner.button.label, "Join");

console.log("Wizard content module tests passed.");
