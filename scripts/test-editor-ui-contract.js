const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const app = read("visual-editor", "src", "App.vue");
const controls = read("visual-editor", "src", "platform", "editor-ui", "EditorPreviewControls.vue");

assert.match(app, /import EditorPreviewControls/);
assert.match(app, /<EditorPreviewControls/);
assert.match(app, /v-model:guides-visible="guidesVisible"/);
assert.match(app, /v-model:viewport="viewport"/);
assert.match(app, /#tokens/);
assert.match(app, /#host-actions/);
assert.match(controls, /class="editor-history-actions"/);
assert.match(controls, /emit\('undo'\)/);
assert.match(controls, /emit\('redo'\)/);
assert.match(controls, /update:guidesVisible/);
assert.match(controls, /update:viewport/);
assert.match(controls, /class="viewport-control"/);

console.log("Editor UI component contract test passed");
