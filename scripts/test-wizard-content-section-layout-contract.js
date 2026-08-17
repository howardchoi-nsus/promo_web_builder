const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  normalizeLayoutSnapshot,
  normalizeLayoutSelectionMetadata,
  LAYOUT_CONTRACT_VERSION,
  LAYOUT_MODE,
} = require("../api/_wizard-content-section-layouts-store");
const { normalizeAiDesign } = require("../api/_wizard-content-sections-store");

const validSnapshot = {
  contractVersion: 1,
  layoutMode: "free",
  sectionStyle: { minHeight: 88, backgroundColor: "#0b0d12" },
  viewports: {
    desktop: {
      items: {
        logo: { positionMode: "free", xPct: 0, yPx: 10, widthPct: 18, heightPx: 44, zIndex: 2 },
        badges: { positionMode: "free", xPct: 86, yPx: 16, widthPct: 12, heightPx: 32 },
      },
      visibility: { items: { badges: true } },
    },
    mobile: {
      items: {
        logo: { positionMode: "free", xPct: 0, yPx: 8, widthPct: 34, heightPx: 36 },
        badges: { positionMode: "free", xPct: 74, yPx: 12, widthPct: 24, heightPx: 28 },
      },
      visibility: { items: { badges: false } },
    },
  },
};

assert.strictEqual(LAYOUT_CONTRACT_VERSION, 1);
assert.strictEqual(LAYOUT_MODE, "free");
assert.deepStrictEqual(normalizeLayoutSelectionMetadata({
  alignment: "left",
  contentRegion: "top-left",
  visualBalance: "media-right",
  density: "compact",
  widthProfile: "balanced",
  purposeTags: ["Event", "event", "brand-intro"],
  selectionWeight: 1.5,
  avoidImmediateRepeat: true,
}), {
  metadata: {
    alignment: "left",
    contentRegion: "top-left",
    visualBalance: "media-right",
    density: "compact",
    widthProfile: "balanced",
    purposeTags: ["event", "brand-intro"],
    selectionWeight: 1.5,
    avoidImmediateRepeat: true,
  },
  errors: [],
});
assert(normalizeLayoutSelectionMetadata({ alignment: "diagonal" }).errors.length > 0);
assert.deepStrictEqual(
  normalizeAiDesign({ allowedLayoutVariants: ["standard-header", "compact_header", "bad key"] }).allowedLayoutVariants,
  ["standard-header", "compact_header"],
);

const valid = normalizeLayoutSnapshot(validSnapshot, ["logo", "badges"]);
assert.deepStrictEqual(valid.errors, []);
assert.strictEqual(valid.snapshot.sectionStyle.backgroundColor, "#0B0D12");
assert.strictEqual(valid.snapshot.viewports.mobile.visibility.items.badges, false);

const tokenBackground = normalizeLayoutSnapshot({
  ...validSnapshot,
  sectionStyle: { minHeight: 88, backgroundColorToken: "--app-surface" },
}, ["logo", "badges"]);
assert.deepStrictEqual(tokenBackground.errors, []);
assert.strictEqual(tokenBackground.snapshot.sectionStyle.backgroundColorToken, "--app-surface");
assert.strictEqual(tokenBackground.snapshot.sectionStyle.backgroundColor, undefined);

const invalidTokenBackground = normalizeLayoutSnapshot({
  ...validSnapshot,
  sectionStyle: { minHeight: 88, backgroundColorToken: "--unsafe-surface" },
}, ["logo", "badges"]);
assert(invalidTokenBackground.errors.some((error) => error.code === "INVALID_BACKGROUND_COLOR_TOKEN"));

const unknownKey = normalizeLayoutSnapshot({
  ...validSnapshot,
  viewports: {
    ...validSnapshot.viewports,
    desktop: {
      ...validSnapshot.viewports.desktop,
      items: {
        ...validSnapshot.viewports.desktop.items,
        navigation: { positionMode: "free", xPct: 10, yPx: 10, widthPct: 20, heightPx: 20 },
      },
    },
  },
}, ["logo", "badges"]);
assert(unknownKey.errors.some((error) => error.code === "UNKNOWN_ITEM_KEY"));

const overflow = normalizeLayoutSnapshot({
  ...validSnapshot,
  viewports: {
    ...validSnapshot.viewports,
    desktop: {
      ...validSnapshot.viewports.desktop,
      items: {
        ...validSnapshot.viewports.desktop.items,
        logo: { positionMode: "free", xPct: 90, yPx: 10, widthPct: 20, heightPx: 44 },
      },
    },
  },
}, ["logo", "badges"]);
assert(overflow.errors.some((error) => error.code === "GEOMETRY_OVERFLOW"));

const anchored = normalizeLayoutSnapshot({
  ...validSnapshot,
  viewports: {
    desktop: {
      items: {
        logo: {
          positionMode: "anchored",
          horizontalAnchor: "center",
          verticalAnchor: "middle",
          widthMode: "fit-content",
          heightMode: "auto",
        },
      },
      visibility: { items: {} },
    },
    mobile: {
      items: {
        logo: {
          positionMode: "anchored",
          horizontalAnchor: "center",
          verticalAnchor: "top",
          offsetY: 24,
          widthMode: "fit-content",
          heightMode: "auto",
        },
      },
      visibility: { items: {} },
    },
  },
}, ["logo"]);
assert.deepStrictEqual(anchored.errors, []);
assert.strictEqual(anchored.snapshot.viewports.mobile.items.logo.positionMode, "anchored");
assert.strictEqual(anchored.snapshot.viewports.mobile.items.logo.offsetY, 24);

const migration = fs.readFileSync(
  path.join(__dirname, "../db/migrations/047_wizard_content_section_layout_presets.sql"),
  "utf8",
);
const selectionMetadataMigration = fs.readFileSync(
  path.join(__dirname, "../db/migrations/058_layout_selection_metadata_and_style_slot_targets.sql"),
  "utf8",
);
const widthProfileMigration = fs.readFileSync(
  path.join(__dirname, "../db/migrations/059_registry_required_sections_and_hero_width_profiles.sql"),
  "utf8",
);
assert(migration.includes("create table if not exists wizard_content_section_layouts"));
assert(migration.includes("wizard_content_section_layouts_one_default_idx"));
assert(migration.includes("insert into wizard_content_section_layouts"));
assert(migration.includes("set_wizard_content_section_default_layout"));
assert(migration.includes("wizard_content_section_layout_histories"));
assert(selectionMetadataMigration.includes("add column if not exists selection_metadata jsonb"));
assert(selectionMetadataMigration.includes("jsonb_typeof(selection_metadata) = 'object'"));
assert(selectionMetadataMigration.includes("Migration 058 candidate: explicit Style Slot targetProperty."));
assert(selectionMetadataMigration.includes("select id into draft_id"));
assert(selectionMetadataMigration.includes("then slot || '{\"targetProperty\":\"colorToken\"}'::jsonb"));
assert(selectionMetadataMigration.includes("then slot || '{\"targetProperty\":\"backgroundColorToken\"}'::jsonb"));
assert(widthProfileMigration.includes("hero_left_balanced"));
assert(widthProfileMigration.includes("hero_center_wide"));
assert(widthProfileMigration.includes("hero_right_balanced"));
assert(widthProfileMigration.includes("Layout width-profile selection guidance"));

[
  "wizard-content-section-layouts.js",
  "wizard-content-section-layout.js",
  "wizard-content-section-layout-default.js",
].forEach((filename) => {
  assert(fs.existsSync(path.join(__dirname, `../api/${filename}`)), `${filename} must exist`);
});

console.log("Wizard content section layout contract tests passed.");
