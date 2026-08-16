const assert = require("node:assert/strict");
const { resolveSectionLayoutPreset } = require("../api/_section-layout-preset-resolver");

const components = [
  { id: "runtime-title", itemKey: "runtime-title", sourceItemKey: "title" },
  { id: "runtime-card", itemKey: "runtime-card", sourceItemKey: "card" },
  { id: "runtime-card-2", itemKey: "runtime-card-2", sourceItemKey: "card#2" },
];
const preset = {
  layoutKey: "hero-left",
  layoutSnapshot: {
    contractVersion: 1,
    layoutMode: "free",
    viewports: {
      desktop: { items: { title: { widthPct: 72 } } },
      mobile: { items: { title: { widthPct: 90 }, card: { widthPct: 90 } } },
    },
  },
};
const resolved = resolveSectionLayoutPreset("section-runtime", components, preset);
assert.equal(resolved.itemStyles["section-runtime.runtime-title"].widthPct, 72);
assert.equal(resolved.responsiveLayouts.mobile.itemStyles["section-runtime.runtime-card"].widthPct, 90);
assert(resolved.diagnostics.some((entry) => entry.path.endsWith("desktop.items.card")));
assert(!resolved.diagnostics.some((entry) => entry.path.includes("card#2")));

console.log("Section Layout Preset resolver tests passed.");
