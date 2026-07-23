const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { validateTokenValue, parseCsvRows, SAFE_CSS_PROPERTIES } = require("../api/_design-token-store");
const { validateDesignPlan } = require("../api/_promo-section-design-contract");

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "db/migrations/029_item_components_design_tokens_and_planner.sql"), "utf8");
assert.match(migration, /promo_design_token_definitions/);
assert.match(migration, /promo_design_token_sets/);
assert.match(migration, /promo_design_token_set_versions/);
assert.match(migration, /promo_section_design_asset_jobs/);
assert.match(migration, /request_mode text not null default 'full'/);
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
