import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolveSectionPresetLayoutPatch } from "../visual-editor/src/platform/layout-engine/section-preset-resolver.mjs";

const require = createRequire(import.meta.url);
const { resolveSectionLayoutPreset } = require("../api/_section-layout-preset-resolver");
const {
  plannerCandidateSnapshot,
} = require("../api/_promo-page-composition-candidates");

const preset = {
  layoutKey: "standard-header",
  name: "Standard Header",
  description: "Logo and badges",
  isDefault: true,
  layoutSnapshot: {
    contractVersion: 1,
    layoutMode: "free",
    sectionStyle: { minHeight: 88, backgroundColor: "#0B0D12" },
    viewports: {
      desktop: {
        items: {
          logo: { positionMode: "free", xPct: 0, yPx: 10, widthPct: 18, heightPx: 44, zIndex: 2 },
          badges: { positionMode: "free", xPct: 86, yPx: 16, widthPct: 12, heightPx: 32, zIndex: 2 },
        },
        visibility: { items: { badges: true } },
      },
      mobile: {
        items: {
          logo: { positionMode: "free", xPct: 0, yPx: 8, widthPct: 34, heightPx: 36, zIndex: 2 },
          badges: { positionMode: "free", xPct: 74, yPx: 12, widthPct: 24, heightPx: 28, zIndex: 2 },
        },
        visibility: { items: { badges: false } },
      },
    },
  },
};

const backend = resolveSectionLayoutPreset("sec_instance", [
  { id: "cmp_logo", itemKey: "cmp_logo", sourceItemKey: "logo", isRequired: true },
  { id: "cmp_badges", itemKey: "cmp_badges", sourceItemKey: "badges", isRequired: false },
], preset);
assert.equal(backend.sectionStyle.layoutVariant, "standard-header");
assert.equal(backend.itemStyles["sec_instance.cmp_logo"].xPct, 0);
assert.equal(backend.responsiveLayouts.mobile.itemStyles["sec_instance.cmp_badges"].widthPct, 24);
assert.equal(backend.responsiveLayouts.mobile.visibility.items["sec_instance.cmp_badges"], false);

const frontend = resolveSectionPresetLayoutPatch({
  sectionKey: "sec_instance",
  items: [
    { itemKey: "cmp_logo", sourceItemKey: "logo", isRequired: true },
    { itemKey: "cmp_badges", sourceItemKey: "badges", isRequired: false },
  ],
}, preset);
assert.deepEqual(frontend.itemStyles, backend.itemStyles);
assert.deepEqual(frontend.responsiveLayouts, backend.responsiveLayouts);

const planner = plannerCandidateSnapshot({
  templates: [{ templateId: "t", sections: [{ sectionId: "s", layoutPresets: [preset] }] }],
  tokenSets: [],
  motionPresets: [],
});
assert.equal(planner.templates[0].sections[0].layoutPresets[0].layoutKey, "standard-header");
assert.equal("layoutSnapshot" in planner.templates[0].sections[0].layoutPresets[0], false);

console.log("Section layout preset runtime tests passed.");

