const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { validateTokenValue, parseCsvRows, SAFE_CSS_PROPERTIES } = require("../api/_design-token-store");
const { validateDesignPlan } = require("../api/_promo-section-design-contract");

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "db/migrations/029_item_components_design_tokens_and_planner.sql"), "utf8");
const repairMigration = fs.readFileSync(path.join(root, "db/migrations/030_promo_section_design_run_snapshot_repair.sql"), "utf8");
const resetScript = fs.readFileSync(path.join(root, "db/seeds/reset_legacy_template_configuration.sql"), "utf8");
assert.match(migration, /promo_design_token_definitions/);
assert.match(migration, /promo_design_token_sets/);
assert.match(migration, /promo_design_token_set_versions/);
assert.match(migration, /promo_section_design_asset_jobs/);
assert.match(migration, /add column if not exists template_key_snapshot text/);
assert.match(migration, /alter column form_template_id drop not null/);
assert.match(migration, /foreign key \(form_template_id\) references wizard_form_templates\(id\) on delete set null/);
assert.match(migration, /create trigger wizard_template_active_section_run_delete_guard/);
assert.match(migration, /request_mode text not null default 'full'/);
assert.ok(
  migration.indexOf("add column if not exists template_key_snapshot text")
    < migration.indexOf("request_mode text not null default 'full'"),
  "The 028-independent run snapshot contract must be established before planner metadata",
);
assert.match(repairMigration, /add column if not exists template_key_snapshot text/);
assert.match(repairMigration, /alter column form_template_id drop not null/);
assert.match(repairMigration, /foreign key \(form_template_id\) references wizard_form_templates\(id\) on delete set null/);
assert.match(repairMigration, /create trigger wizard_template_active_section_run_delete_guard/);

const resetRunIndex = resetScript.indexOf("delete from promo_section_design_runs;");
const resetMembershipIndex = resetScript.indexOf("delete from wizard_form_template_sections;");
const resetItemIndex = resetScript.indexOf("delete from wizard_content_section_items;");
const resetSectionIndex = resetScript.indexOf("delete from wizard_content_sections;");
const resetTemplateIndex = resetScript.indexOf("delete from wizard_form_templates;");
assert.ok(resetRunIndex >= 0, "Reset script must remove legacy section AI runs");
assert.ok(
  resetRunIndex < resetMembershipIndex
    && resetMembershipIndex < resetItemIndex
    && resetItemIndex < resetSectionIndex
    && resetSectionIndex < resetTemplateIndex,
  "Audited child rows must be removed before their Section and Template parents",
);
assert.match(resetScript, /begin;[\s\S]*commit;/);
assert.doesNotMatch(resetScript, /delete from promo_generation_runs/);
assert.doesNotMatch(resetScript, /delete from promo_generation_final_designs/);
assert.doesNotMatch(resetScript, /delete from locale_messages/);
assert.equal(SAFE_CSS_PROPERTIES.has("background-color"), true);
assert.equal(SAFE_CSS_PROPERTIES.has("background-image"), false);
assert.equal(validateTokenValue({ value_type: "color" }, "#AABBCC"), "");
assert.match(validateTokenValue({ value_type: "color" }, "red"), /hex/);
assert.match(validateTokenValue({ value_type: "length" }, "10;display:none"), /unit|unsafe/);
assert.deepEqual(parseCsvRows('token,value\n--promo-accent,"#AABBCC"\n'), [{ token: "--promo-accent", value: "#AABBCC" }]);

const section = {
  items: [
    { itemKey: "title", fieldKind: "text", isVisibleInWizard: true, capabilities: { layoutRegions: ["copy-primary"] }, styleSlots: [{ slotKey: "titleColor", semanticRole: "accent-color", aiSelectable: true }] },
    { itemKey: "visual", fieldKind: "image", isVisibleInWizard: true, capabilities: { layoutRegions: ["media-primary"], aiImage: true }, styleSlots: [] },
  ],
};
const tokenSet = { values: [{ tokenKey: "--promo-accent", semanticRole: "accent-color", aiSelectable: true }] };
const valid = validateDesignPlan(section, {
  layoutVariant: "split-right",
  itemPlacements: [{ itemKey: "title", region: "copy-primary", order: 0 }, { itemKey: "visual", region: "media-primary", order: 1 }],
  slotSelections: [{ itemKey: "title", slotKey: "titleColor", tokenKey: "--promo-accent" }],
  assetRequests: [{ targetType: "item", itemKey: "visual", prompt: "visual", safeArea: "none" }],
}, { allowedLayoutVariants: ["split-right"], imageTarget: { type: "item", itemKey: "visual" }, imageTargetItemKeys: ["visual"] }, tokenSet);
assert.equal(valid.ok, true, valid.errors.join("; "));

const invalid = validateDesignPlan(section, {
  layoutVariant: "split-right", itemPlacements: [{ itemKey: "title", region: "media-primary", order: 0 }],
  slotSelections: [{ itemKey: "title", slotKey: "titleColor", tokenKey: "--promo-unknown" }], assetRequests: [],
}, { allowedLayoutVariants: ["split-right"] }, tokenSet);
assert.equal(invalid.ok, false);
assert.match(invalid.errors.join("; "), /does not allow region|not AI-selectable|not placed/);

console.log("Item component, design token and planner contract tests passed");
