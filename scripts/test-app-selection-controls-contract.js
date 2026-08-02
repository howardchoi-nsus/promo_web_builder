const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const componentsCss = read("prototype/app-components.css");
const adminMarkup = read("prototype/index.html");
const adminCss = read("prototype/styles.css");
const editorMarkup = read("visual-editor/src/App.vue");
const editorCss = read("visual-editor/src/styles.css");
const previewControls = read("visual-editor/src/platform/editor-ui/EditorPreviewControls.vue");
const compositionControls = read("visual-editor/src/platform/editor-ui/SectionCompositionControls.vue");
const designTokenManager = read("admin-app/src/components/DesignTokenManager.vue");

for (const selector of [
  ".app-switch",
  ".app-switch__input",
  ".app-switch__track",
  ".app-checkbox",
  ".app-segmented-control",
]) {
  assert.match(componentsCss, new RegExp(selector.replace(".", "\\.")), `${selector} must be defined in the shared component layer`);
}

assert.match(adminMarkup, /class="app-switch"/, "Admin must use the shared switch contract");
assert.match(adminMarkup, /class="app-checkbox switch-control"/, "Legacy Admin checkbox locations must opt into the shared checkbox contract");
assert.match(editorMarkup, /class="app-switch app-switch--small component-visibility-toggle"/, "Editor visibility controls must use the shared switch");
assert.match(previewControls, /class="guide-mode-control"/, "Preview guide mode must use an explicit segmented mode control");
assert.match(previewControls, /role="group"/, "Preview guide mode must expose grouped-control semantics");
assert.match(previewControls, /:aria-pressed="guideMode === mode\.key"/, "Preview guide mode buttons must expose their selected state");
assert.match(compositionControls, />AI 도우미</, "Section composition must be presented as the AI helper");
assert.match(compositionControls, />AI 키비주얼 만들기</, "The AI helper must expose the key-visual accordion");
assert.doesNotMatch(compositionControls, /class="app-checkbox toggle-field"/, "The key-visual-only helper must not expose layout scope toggles");
assert.match(designTokenManager, /class="app-checkbox design-token-check"/, "Design token filters must use the shared checkbox");

for (const source of [adminMarkup, editorMarkup]) {
  assert.match(source, /role="switch"/, "Binary switches must expose switch semantics");
}

assert.doesNotMatch(adminMarkup, /template-active-switch/, "The page-specific template switch markup must be removed");
assert.doesNotMatch(adminCss, /\.template-active-switch/, "The page-specific template switch CSS must be removed");
assert.doesNotMatch(editorCss, /\.component-visibility-toggle\s*>\s*i/, "Editor switch track styling must live in the shared component layer");
assert.doesNotMatch(editorCss, /\.guide-toggle\s+input/, "The retired binary guide switch must not retain page-specific styling");
assert.doesNotMatch(adminMarkup, /class="switch-control"/, "Legacy checkbox markup must include the shared app-checkbox class");
assert.match(
  editorCss,
  /\.component-visibility-toggle\s*\{[\s\S]*?display:\s*inline-flex;[\s\S]*?flex:\s*0 0 auto;/,
  "Editor visibility switches must remain one-line flex controls inside grid-based property forms."
);

console.log("Shared selection control contract test passed");
