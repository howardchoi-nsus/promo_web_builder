import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const editor = read("admin-app/src/components/RenderSpecEditor.vue");
const tree = read("admin-app/src/components/DomStructureTree.vue");
const inspector = read("admin-app/src/components/RenderSpecNodeInspector.vue");

assert.match(editor, /import DomStructureTree/);
assert.match(editor, /import RenderSpecNodeInspector/);
assert.match(editor, /<DomStructureTree/);
assert.match(editor, /<RenderSpecNodeInspector/);
assert.match(tree, /data-dom-path/);
assert.match(tree, /aria-current/);
assert.match(tree, /emit\('select'|emit\("select"/);
assert.match(inspector, /선택 노드 속성/);
assert.match(inspector, /set-node-property/);
assert.match(inspector, /set-field-key/);
assert.match(inspector, /set-nested/);
assert.doesNotMatch(inspector, /<textarea|Raw JSON/);

console.log("Admin DOM workbench component contract test passed");
