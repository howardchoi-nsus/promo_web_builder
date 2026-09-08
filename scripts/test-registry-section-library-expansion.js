const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { resolveSectionLayoutPreset } = require("../api/_section-layout-preset-resolver");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/065_registry_section_library_expansion.sql"),
  "utf8",
);

for (const sectionKey of ["registryOfferSpotlight", "registryBrandStory", "registrySocialProof"]) {
  assert.match(migration, new RegExp(sectionKey));
}
for (const layoutKey of ["offer_left", "story_media_left", "stats_grid", "card_grid_2", "card_grid_compact"]) {
  assert.match(migration, new RegExp(layoutKey));
}
assert.match(migration, /activate_promo_composition_shell_version/);

const resolved = resolveSectionLayoutPreset("section-1", [
  { id: "card-1", sourceItemKey: "cards" },
], {
  layoutKey: "card_grid_2",
  layoutSnapshot: {
    contractVersion: 1,
    layoutMode: "free",
    collectionLayouts: { cards: { desktopColumns: 2, mobileColumns: 1 } },
    viewports: { desktop: { items: { cards: {} } }, mobile: { items: { cards: {} } } },
  },
});
assert.equal(resolved.collectionLayouts.cards.desktopColumns, 2);

console.log("Registry section library expansion tests passed.");
