const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const createPromoSource = fs.readFileSync(path.join(root, "prototype", "create-promo.js"), "utf8");
const rendererSource = fs.readFileSync(
  path.join(root, "visual-editor", "src", "PromoPageRenderer.vue"),
  "utf8"
);

assert.match(
  createPromoSource,
  /backgroundColor:\s*resolvedSectionBackgroundColor\(sectionKey\)/
);
assert.match(
  createPromoSource,
  /backgroundColor:\s*resolvedSectionBackgroundColor\(section\.sectionKey\)/
);
assert.match(createPromoSource, /delete safePatch\.backgroundColor/);
assert.match(
  createPromoSource,
  /backgroundFadeColor:\s*resolvedSectionBackgroundColor\(section\.sectionKey\)/
);

const backgroundColorFunction = rendererSource.match(
  /function effectiveSectionBackgroundColor\(style\) \{[\s\S]*?\n\}/
)?.[0] || "";
assert.doesNotMatch(backgroundColorFunction, /backgroundFadeColor/);
assert.match(backgroundColorFunction, /managedTokens\.value\["--app-bg"\]/);
assert.match(backgroundColorFunction, /managedTokens\.value\["--app-surface"\]/);
assert.match(
  rendererSource,
  /backgroundFadeGradient\([\s\S]*?normalizedFadeMode\(style\),[\s\S]*?backgroundColor,[\s\S]*?style\.backgroundFadeStrength,[\s\S]*?style\.backgroundFadeStops/
);
assert.doesNotMatch(rendererSource, /function effectiveSectionFadeColor/);

console.log("Section AI background color preservation contract tests passed.");
