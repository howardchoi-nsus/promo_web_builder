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

assert.equal(validateLayoutSpec(resolved).ok, true);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { xPct: 101 } } }).ok, false);
assert.equal(validateLayoutSpec({ sectionStyles: { bad: { minHeight: 49 } } }).ok, false);
assert.equal(validateLayoutSpec({ itemStyles: { bad: { fontSize: 81 } } }).ok, false);

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
