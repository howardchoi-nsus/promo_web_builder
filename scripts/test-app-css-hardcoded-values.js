const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = [
  "prototype/app-shell.css",
  "prototype/app-components.css",
  "visual-editor/src/styles.css",
  "visual-editor/src/visual-output.css",
];

function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

files.forEach((file) => {
  const css = withoutComments(fs.readFileSync(path.join(root, file), "utf8"));
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, `${file} must use design tokens instead of hex colors`);
  assert.doesNotMatch(css, /rgba?\s*\(/i, `${file} must use design tokens instead of rgb colors`);
});

console.log("App CSS hardcoded value contract test passed");
