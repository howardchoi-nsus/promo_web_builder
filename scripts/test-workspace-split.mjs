import assert from "node:assert/strict";
import {
  WORKSPACE_SPLIT_DEFAULT,
  clampWorkspaceSplitWidth,
  loadWorkspaceSplitWidth,
  saveWorkspaceSplitWidth,
  workspaceSplitStorageKey,
} from "../visual-editor/src/platform/editor-ui/workspace-split.mjs";

assert.equal(clampWorkspaceSplitWidth(100), 240);
assert.equal(clampWorkspaceSplitWidth(900), 520);
assert.equal(clampWorkspaceSplitWidth("360"), 360);
assert.equal(clampWorkspaceSplitWidth("bad"), WORKSPACE_SPLIT_DEFAULT);
assert.equal(workspaceSplitStorageKey("ai-document"), "promo-visual-editor:workspace-split:ai-document");

const values = new Map();
const storage = {
  getItem: (key) => values.get(key) || null,
  setItem: (key, value) => values.set(key, value),
};
assert.equal(loadWorkspaceSplitWidth(storage, "missing"), WORKSPACE_SPLIT_DEFAULT);
assert.equal(saveWorkspaceSplitWidth(storage, "editor", 410), true);
assert.equal(loadWorkspaceSplitWidth(storage, "editor"), 410);
values.set("broken", "{");
assert.equal(loadWorkspaceSplitWidth(storage, "broken"), WORKSPACE_SPLIT_DEFAULT);

console.log("Workspace split tests passed.");
