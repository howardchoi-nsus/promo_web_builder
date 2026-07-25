import assert from "node:assert/strict";
import { createEditorStore } from "../visual-editor/src/platform/editor-core/create-editor-store.mjs";
import { EditorCommandType, editorCommand } from "../visual-editor/src/platform/editor-core/editor-commands.mjs";

const store = createEditorStore({
  layout: { itemStyles: {}, sectionStyles: {} },
  content: { hero: { title: "Before" } },
});

let result = store.execute(editorCommand(EditorCommandType.ITEM_STYLE_PATCH, {
  styleKey: "hero.title",
  patch: { widthPct: 40, fontSize: 24 },
}));
assert.equal(result.ok, true);
assert.deepEqual(result.state.document.layout.itemStyles["hero.title"], { widthPct: 40, fontSize: 24 });
assert.equal(result.history.canUndo, true);

result = store.execute(editorCommand(EditorCommandType.CONTENT_VALUE_SET, {
  sectionKey: "hero",
  itemKey: "title",
  value: "After",
}));
assert.equal(result.state.document.content.hero.title, "After");
assert.equal(result.history.undoCount, 2);

result = store.execute(editorCommand(EditorCommandType.SECTION_STYLE_PATCH, {
  sectionKey: "hero",
  patch: { minHeight: 520 },
}));
assert.equal(result.state.document.layout.sectionStyles.hero.minHeight, 520);

result = store.undo();
assert.equal(result.ok, true);
assert.equal(result.state.document.layout.sectionStyles.hero, undefined);
assert.equal(result.state.document.content.hero.title, "After");

result = store.undo();
assert.equal(result.state.document.content.hero.title, "Before");
assert.equal(result.history.canRedo, true);

result = store.redo();
assert.equal(result.state.document.content.hero.title, "After");

result = store.execute(editorCommand(EditorCommandType.DOCUMENT_PATCH, {
  layout: { itemStyles: { "hero.title": { color: "#ff0000" } }, sectionStyles: {} },
  content: { hero: { title: "AI composed" } },
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.content.hero.title, "AI composed");
assert.equal(result.state.document.layout.itemStyles["hero.title"].color, "#ff0000");
result = store.undo();
assert.equal(result.state.document.content.hero.title, "After");
assert.equal(result.state.document.layout.itemStyles["hero.title"].color, undefined);

store.replaceDocument({
  layout: { itemStyles: { "hero.title": { fontSize: 30 } } },
  content: { hero: { title: "Reloaded" } },
});
assert.equal(store.getHistoryState().canUndo, false);
assert.equal(store.getState().dirty, false);
assert.equal(store.getState().document.content.hero.title, "Reloaded");

console.log("Editor core command and history tests passed.");
