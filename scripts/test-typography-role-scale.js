const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildDefaultItemStyles } = require("../api/_promo-page-composition-contract");

const root = path.resolve(__dirname, "..");
const tokenValues = {
  "--app-accent": "#4768d8",
  "--app-ink": "#111827",
  "--app-ink-soft": "#334155",
  "--app-on-accent": "#ffffff",
  "--app-font-size-body": "14px",
  "--app-font-size-small": "12px",
  "--promo-font-size-main-title": "clamp(2.5rem, calc(2rem + 3vw), 4.25rem)",
  "--promo-font-size-lead-title": "clamp(1.75rem, calc(1.5rem + 1.5vw), 2.5rem)",
  "--promo-font-size-subtitle": "clamp(1.125rem, calc(1rem + 0.5vw), 1.4375rem)",
  "--promo-font-size-body": "1rem",
  "--promo-font-size-eyebrow": "clamp(0.75rem, calc(0.7rem + 0.2vw), 0.875rem)",
  "--promo-font-size-button": "clamp(0.875rem, calc(0.8rem + 0.2vw), 1rem)",
};
const item = (itemKey, fieldKind = "text", textType = itemKey) => ({
  itemKey,
  name: itemKey,
  fieldKind,
  textType,
});
const styles = buildDefaultItemStyles([{
  sectionKey: "hero",
  items: [
    item("headline"),
    item("eyebrow"),
    item("lead"),
    item("subtitle"),
    item("description"),
    item("primaryAction", "cta"),
  ],
}], tokenValues);

assert.equal(styles["hero.headline"].fontSizeToken, "--promo-font-size-main-title");
assert.equal(styles["hero.eyebrow"].fontSizeToken, "--promo-font-size-eyebrow");
assert.equal(styles["hero.lead"].fontSizeToken, "--promo-font-size-lead-title");
assert.equal(styles["hero.subtitle"].fontSizeToken, "--promo-font-size-subtitle");
assert.equal(styles["hero.description"].fontSizeToken, "--promo-font-size-body");
assert.equal(styles["hero.primaryAction"].fontSizeToken, "--promo-font-size-button");

const editorCss = fs.readFileSync(path.join(root, "visual-editor/src/styles.css"), "utf8");
assert.doesNotMatch(editorCss, /font-size:\s*(?:9|10|11)px/);
assert.match(editorCss, /font-size:\s*var\(--app-font-size-xs\)/);

console.log("Typography role scale tests passed");
