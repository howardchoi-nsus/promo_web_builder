const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  normalizeLayoutSnapshot,
  validateHeaderLayoutPolicy,
} = require("../api/_wizard-content-section-layouts-store");

const snapshot = {
  contractVersion: 1,
  layoutMode: "free",
  sectionStyle: { minHeight: 88, backgroundColor: "#0B0D12" },
  viewports: {
    desktop: {
      items: { logo: { positionMode: "free", xPct: 3, yPx: 18, widthPct: 22, heightPx: 44 } },
      visibility: { items: {} },
    },
    mobile: {
      items: { logo: { positionMode: "free", xPct: 5, yPx: 14, widthPct: 42, heightPx: 36 } },
      visibility: { items: {} },
    },
  },
};

assert.deepStrictEqual(validateHeaderLayoutPolicy(
  { section_key: "header", section_role: "header", fixed_position: "top" },
  [{ itemKey: "logo", isVisibleInWizard: true }],
  [{ layout_key: "standard_header", is_default: true, layout_snapshot: snapshot }],
), []);

assert.deepStrictEqual(validateHeaderLayoutPolicy(
  { section_key: "header", section_role: "header", fixed_position: "top" },
  [{
    itemKey: "item_m37_random",
    componentKey: "cmp_generated",
    name: "Brand mark",
    isVisibleInWizard: true,
    libraryPresentation: { iconKey: "logo" },
  }],
  [{
    layout_key: "standard_header",
    is_default: true,
    layout_snapshot: {
      ...snapshot,
      viewports: {
        desktop: { items: { item_m37_random: snapshot.viewports.desktop.items.logo }, visibility: { items: {} } },
        mobile: { items: { item_m37_random: snapshot.viewports.mobile.items.logo }, visibility: { items: {} } },
      },
    },
  }],
), []);

const contentSnapshot = JSON.parse(JSON.stringify(snapshot));
contentSnapshot.content = {
  logo: { source: "url", value: "https://cdn.example.com/logo.svg", alt: "Brand logo" },
};
const normalizedContent = normalizeLayoutSnapshot(contentSnapshot, ["logo"]);
assert.deepStrictEqual(normalizedContent.errors, []);
assert.equal(normalizedContent.snapshot.content.logo.value, "https://cdn.example.com/logo.svg");
const invalidContent = normalizeLayoutSnapshot({
  ...contentSnapshot,
  content: { unknown: "not allowed" },
}, ["logo"]);
assert(invalidContent.errors.some((error) => error.code === "UNKNOWN_ITEM_KEY"));

const missingMobileLogo = JSON.parse(JSON.stringify(snapshot));
delete missingMobileLogo.viewports.mobile.items.logo;
assert(validateHeaderLayoutPolicy(
  { section_key: "header", section_role: "header", fixed_position: "top" },
  [{ itemKey: "logo", isVisibleInWizard: true }],
  [{ layout_key: "standard_header", is_default: true, layout_snapshot: missingMobileLogo }],
).some((error) => error.code === "HEADER_LOGO_GEOMETRY_REQUIRED"));

assert(validateHeaderLayoutPolicy(
  { section_key: "header", section_role: "header", fixed_position: null },
  [],
  [],
).some((error) => error.code === "HEADER_TOP_POSITION_REQUIRED"));

const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/047_wizard_content_section_layout_presets.sql"),
  "utf8",
);
assert.match(migration, /standard_header/);
assert.match(migration, /Migration 047 default Header layout/);
assert.match(migration, /section\.section_role = 'header'/);

const sectionApi = fs.readFileSync(path.resolve(__dirname, "../api/wizard-content-section.js"), "utf8");
const activateApi = fs.readFileSync(path.resolve(__dirname, "../api/wizard-content-section-activate.js"), "utf8");
const sectionStore = fs.readFileSync(path.resolve(__dirname, "../api/_wizard-content-sections-store.js"), "utf8");
assert.match(sectionApi, /sectionRole === "header" \? "top"/);
assert.match(activateApi, /Header fixed-position policy normalized/);
assert.match(sectionStore, /component\.library_presentation/);

console.log("Header section layout policy tests passed.");
