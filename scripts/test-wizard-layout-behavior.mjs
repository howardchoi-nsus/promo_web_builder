import assert from "node:assert/strict";
import {
  createLayoutSnapshot,
  mergeLayoutSpec,
  normalizeLayoutSpec,
  validateLayoutSpec,
} from "../visual-editor/src/layout-utils.mjs";

const base = normalizeLayoutSpec({
  theme: { backgroundColor: "#ffffff" },
  sectionStyles: { hero: { minHeight: 400 } },
  itemStyles: { "hero.title": { fontSize: 44, xPct: 4, yPx: 80 } },
});
const resolved = mergeLayoutSpec(base, {
  sectionStyles: { hero: { minHeight: 560 } },
  itemStyles: { "hero.title": { xPct: 12 } },
});
assert.equal(resolved.theme.backgroundColor, "#ffffff");
assert.equal(resolved.sectionStyles.hero.minHeight, 560);
assert.equal(resolved.itemStyles["hero.title"].fontSize, 44);
assert.equal(resolved.itemStyles["hero.title"].xPct, 12);
assert.equal(resolved.itemStyles["hero.title"].yPx, 80);
assert.equal(
  normalizeLayoutSpec({ itemStyles: { "hero.title": { textAlign: "center" } } }).itemStyles["hero.title"].textAlign,
  "center",
);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { textAlign: "diagonal" } } }).ok, false);

assert.equal(validateLayoutSpec(resolved).ok, true);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { xPct: 101 } } }).ok, false);
assert.equal(validateLayoutSpec({ sectionStyles: { bad: { minHeight: 49 } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { fontSize: 81 } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { tiny: { fontSize: 1 } } }).ok, true);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { fontSize: -1 } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { tiny: { widthPct: 0.1, heightPx: 1 } } }).ok, true);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { widthPct: 0, heightPx: 0 } } }).ok, false);
assert.equal(validateLayoutSpec({
  sectionStyles: {
    hero: {
      backgroundSize: "contain",
      backgroundPosition: "center center",
      backgroundFadeMode: "both",
      backgroundFadeStrength: "medium",
    },
  },
  itemStyles: {
    "hero.image": {
      widthPct: 48,
      heightPx: 360,
      aspectRatio: "4/3",
      imageFit: "cover",
      imagePosition: "right center",
      shape: "rounded",
      accessibleLabel: "Promotional product",
    },
  },
}).ok, true);
assert.equal(validateLayoutSpec({ sectionStyles: { hero: { backgroundSize: "cover" } } }).ok, true);
assert.equal(validateLayoutSpec({ sectionStyles: { hero: { backgroundSize: "stretch" } } }).ok, false);
assert.equal(validateLayoutSpec({ sectionStyles: { hero: { backgroundFadeMode: "diagonal" } } }).ok, false);
assert.equal(validateLayoutSpec({ sectionStyles: { hero: { backgroundFadeColor: "red" } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { "hero.image": { widthPct: 101 } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { "hero.image": { imageFit: "fill" } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { "hero.image": { shape: "triangle" } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { "hero.image": { decorative: "yes" } } }).ok, false);
assert.equal(validateLayoutSpec({
  responsiveLayouts: {
    mobile: {
      itemStyles: {
        "hero.title": { positionMode: "free", xPct: 90, yPx: 10, widthPct: 20, heightPx: 40 },
      },
      visibility: { items: { "hero.title": true } },
    },
  },
}).ok, false);
assert.equal(validateLayoutSpec({
  responsiveLayouts: {
    mobile: {
      itemStyles: {
        "hero.title": { positionMode: "free", xPct: 10, yPx: 10, widthPct: 80, heightPx: 40 },
      },
      visibility: { items: { "hero.title": "yes" } },
    },
  },
}).ok, false);
assert.equal(validateLayoutSpec({ responsiveLayouts: "mobile" }).ok, false);

const snapshot = createLayoutSnapshot({
  baseLayout: base,
  userLayout: { itemStyles: { "hero.title": { fontWeight: 700 } } },
  layoutRevision: 3,
  renderer: { key: "default-promo-renderer", version: 1 },
});
assert.equal(snapshot.layoutRevision, 3);
assert.equal(snapshot.resolvedLayout.itemStyles["hero.title"].fontSize, 44);
assert.equal(snapshot.resolvedLayout.itemStyles["hero.title"].fontWeight, 700);

console.log("Wizard layout behavior test passed");
