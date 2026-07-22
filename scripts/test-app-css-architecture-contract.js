const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const components = read("prototype", "app-components.css");
const editor = read("visual-editor", "src", "styles.css");
const output = read("visual-editor", "src", "visual-output.css");
const renderer = read("visual-editor", "src", "promo-renderer.css");
const editorHtml = read("prototype", "visual-editor.html");
const outputHtml = read("prototype", "visual-output.html");
const viteConfig = read("visual-editor", "vite.config.js");

assert.match(components, /\.app-workspace/);
assert.match(components, /\.app-panel/);
assert.match(components, /\.app-field/);
assert.match(components, /\.app-button/);
assert.doesNotMatch(components, /--promo-|--item-|\.promo-renderer|\.editor-|\.admin-|\.builder-/);

assert.doesNotMatch(editor, /\.app-(?:workspace|panel|field|button)\s*\{/);
assert.doesNotMatch(editor, /^\.promo-renderer\s*\{|--promo-(?:bg|ink|accent|cta|font)|--item-/m);
assert.doesNotMatch(output, /\.promo-renderer\s*\{|\.rendered-|--promo-|--item-/);
assert.doesNotMatch(renderer, /--app-|--shell-|\.shell-|\.editor-|\.preview-/);
assert.match(renderer, /^\.promo-renderer\s*\{/m);
assert.doesNotMatch(renderer, /^\.rendered-/m);

const order = [
  editorHtml.indexOf("design-tokens.css"),
  editorHtml.indexOf("app-shell.css"),
  editorHtml.indexOf("app-components.css"),
  editorHtml.indexOf("visual-editor.css"),
  editorHtml.indexOf("promo-renderer.css"),
];
assert(order.every((value) => value >= 0));
assert.deepEqual([...order].sort((a, b) => a - b), order);

assert.match(outputHtml, /visual-output\.css/);
assert.match(outputHtml, /promo-renderer\.css/);
assert.doesNotMatch(outputHtml, /visual-editor\.css/);
assert.match(viteConfig, /emitStandaloneCssAssets/);
assert.match(viteConfig, /fileName,\s*source:/);

console.log("App CSS architecture contract test passed");
