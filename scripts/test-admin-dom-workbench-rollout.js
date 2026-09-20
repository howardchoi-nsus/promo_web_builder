const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { builderFlags } = require("../api/_promo-builder-flags");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const manager = read("admin-app/src/components/SectionLayoutPresetManager.vue");
const adminHtml = read("prototype/index.html");
const adminApp = read("prototype/app.js");

assert.equal(builderFlags({}).adminDomConfigWorkbench, true);
assert.equal(builderFlags({}).adminLegacyVisualConfigEditor, false);
assert.match(manager, /SectionLayoutDomWorkbench/);
assert.match(manager, /selectedLayout && domWorkbenchEnabled/);
assert.match(manager, /selectedLayout && legacyVisualEditorEnabled/);
assert.match(manager, /DOM 구성 편집/);
assert.match(manager, /프리셋 만들고 DOM 구성 열기/);
assert.match(adminHtml, /:dom-workbench-enabled="builderCapabilities\.adminDomConfigWorkbench !== false"/);
assert.match(adminHtml, /:legacy-visual-editor-enabled="builderCapabilities\.adminLegacyVisualConfigEditor === true"/);
assert.match(adminApp, /adminDomConfigWorkbench:\s*true/);
assert.match(adminApp, /adminLegacyVisualConfigEditor:\s*false/);

console.log("Admin DOM workbench rollout contract tests passed");
