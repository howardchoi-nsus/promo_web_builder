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
assert.match(rendererSource, /function effectiveSectionFadeColor\(style, backgroundColor\)/);
assert.match(
  rendererSource,
  /backgroundFadeGradient\(normalizedFadeMode\(style\), fadeColor, style\.backgroundFadeStrength\)/
);

console.log("Section AI background color preservation contract tests passed.");
