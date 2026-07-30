import assert from "node:assert/strict";
import {
  createPromoTokenRuntimeStyle,
  normalizePromoTokenValues,
} from "../shared/promo-token-runtime.mjs";

const normalized = normalizePromoTokenValues([
  { tokenKey: "--promo-surface", value: "#111111" },
  { tokenKey: "--promo-text", value: "#eeeeee" },
  { tokenKey: "--app-hero-bg-image", valueIndex: 1, value: "radial-gradient(circle, #0000, #000)" },
  { tokenKey: "--app-hero-bg-image", valueIndex: 0, value: "linear-gradient(#111, #222)" },
  { tokenKey: "--unsafe-token", value: "red" },
]);

assert.deepEqual(normalized, {
  "--promo-surface": "#111111",
  "--promo-text": "#eeeeee",
  "--app-hero-bg-image": "linear-gradient(#111, #222), radial-gradient(circle, #0000, #000)",
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

assert.equal(style["--promo-bg"], "#111111");
assert.equal(style["--promo-ink"], "#eeeeee");
assert.equal(style["--promo-muted-ink"], "#999999");
assert.equal(style["--promo-cta"], "var(--promo-accent, #2563eb)");
assert.equal(style["--promo-cta-radius"], "18px");
assert.equal(style["--promo-image-radius"], "18px");
assert.equal(style["--promo-component-shadow"], "0 4px 18px #00000033");
assert.equal(style["--promo-title-size"], "80px");
assert.equal(style["--promo-accent"], "#dd0000");

const appStyle = createPromoTokenRuntimeStyle([
  { tokenKey: "--app-bg", value: "#000000" },
  { tokenKey: "--app-surface", value: "#262626" },
  { tokenKey: "--app-ink", value: "#ffffff" },
  { tokenKey: "--app-muted", value: "#737373" },
  { tokenKey: "--app-accent", value: "#ff2f2f" },
  { tokenKey: "--app-radius", value: "10px" },
  { tokenKey: "--app-transition-duration-normal", value: "200ms" },
  { tokenKey: "--app-ease", value: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
]);
assert.equal(appStyle["--promo-bg"], "#000000");
assert.equal(appStyle["--promo-ink"], "#ffffff");
assert.equal(appStyle["--promo-accent"], "#ff2f2f");
assert.equal(appStyle["--promo-cta-radius"], "10px");
assert.equal(appStyle["--promo-transition-duration"], "200ms");
assert.equal(appStyle["--promo-title-size"], "clamp(28px, 5vw, 72px)");

const ggpokerStyle = createPromoTokenRuntimeStyle({
  "--app-font-body": "Inter, Pretendard, sans-serif",
  "--promo-font-size-main-title": "68px",
});
assert.equal(ggpokerStyle["--promo-font"], "Inter, Pretendard, sans-serif");
assert.equal(ggpokerStyle["--promo-title-size"], "68px");

console.log("Promo token runtime tests passed.");
