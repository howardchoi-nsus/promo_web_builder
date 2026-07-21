const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const tokens = fs.readFileSync(path.join(root, "prototype/design-tokens.css"), "utf8");
const builderCss = fs.readFileSync(path.join(root, "prototype/styles.css"), "utf8");
const shellCss = fs.readFileSync(path.join(root, "prototype/shared-shell-header.css"), "utf8");
const createPromoCss = fs.readFileSync(path.join(root, "prototype/create-promo.css"), "utf8");
const promoWizardCss = fs.readFileSync(path.join(root, "prototype/promo-wizard.css"), "utf8");
const htmlFiles = [
  "index.html",
  "create-promo.html",
  "promo-wizard.html",
  "visual-editor.html",
  "visual-output.html",
  "generated.html",
];

[
  "--app-bg",
  "--app-panel",
  "--app-surface",
  "--app-ink",
  "--app-sub",
  "--app-line",
  "--app-accent",
  "--app-success",
  "--app-danger",
  "--app-radius",
  "--app-shadow",
  "--app-font-body",
].forEach((token) => assert.match(tokens, new RegExp(`${token}:`)));

assert.match(tokens, /\[data-theme="dark"\]/);
assert.match(tokens, /--app-accent:\s*#4768d8/);
assert.match(tokens, /\[data-theme="dark"\][\s\S]*--app-accent:\s*#28c39d/);
assert.match(builderCss, /--bg:\s*var\(--app-bg\)/);
assert.match(builderCss, /--accent:\s*var\(--app-accent\)/);
assert.doesNotMatch(builderCss, /\[data-theme="dark"\]\s*\{[\s\S]*?--bg:/);
assert.match(shellCss, /--shell-bg:\s*var\(--app-panel\)/);
assert.match(shellCss, /--shell-accent:\s*var\(--app-accent\)/);
assert.doesNotMatch(shellCss, /\[data-theme="dark"\]\s*\{/);
[createPromoCss, promoWizardCss].forEach((css) => {
  assert.match(css, /--bg:\s*var\(--app-bg\)/);
  assert.match(css, /--accent:\s*var\(--app-accent\)/);
  assert.match(css, /font-family:\s*var\(--app-font-body\)/);
  assert.doesNotMatch(css, /\[data-theme="dark"\]\s*\{[\s\S]*?--bg:/);
});

htmlFiles.forEach((file) => {
  const html = fs.readFileSync(path.join(root, "prototype", file), "utf8");
  assert.match(html, /design-tokens\.css\?v=app-tokens-v1/);
  const tokenIndex = html.indexOf("design-tokens.css");
  const screenCssIndex = html.search(/(?:styles|create-promo|promo-wizard|shared-shell-header|visual-editor)\.css/);
  assert(tokenIndex >= 0 && screenCssIndex > tokenIndex, `${file} must load design tokens before screen CSS`);
});

console.log("App design token contract test passed");
