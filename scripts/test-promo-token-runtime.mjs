import assert from "node:assert/strict";
import {
  createPromoTokenRuntimeStyle,
  normalizePromoTokenValues,
} from "../shared/promo-token-runtime.mjs";

const normalized = normalizePromoTokenValues([
  { tokenKey: "--promo-surface", value: "#111111" },
  { tokenKey: "--promo-text", value: "#eeeeee" },
  { tokenKey: "--unsafe-token", value: "red" },
]);

assert.deepEqual(normalized, {
  "--promo-surface": "#111111",
  "--promo-text": "#eeeeee",
});

const style = createPromoTokenRuntimeStyle({
  "--promo-surface": "#111111",
  "--promo-text": "#eeeeee",
  "--promo-muted": "#999999",
  "--promo-accent": "#dd0000",
  "--promo-radius": "18px",
  "--promo-shadow": "0 4px 18px #00000033",
  "--promo-title-size": "80px",
});

assert.equal(style["--promo-bg"], "var(--promo-surface, #f5f7fb)");
assert.equal(style["--promo-ink"], "var(--promo-text, #172033)");
assert.equal(style["--promo-muted-ink"], "var(--promo-muted, #64748b)");
assert.equal(style["--promo-cta"], "var(--promo-accent, #2563eb)");
assert.equal(style["--promo-cta-radius"], "var(--promo-radius, 2px)");
assert.equal(style["--promo-image-radius"], "var(--promo-radius, 2px)");
assert.equal(style["--promo-component-shadow"], "var(--promo-shadow, 0 10px 32px rgba(33, 43, 61, .12))");
assert.equal(style["--promo-title-size"], "80px");
assert.equal(style["--promo-accent"], "#dd0000");

console.log("Promo token runtime tests passed.");
