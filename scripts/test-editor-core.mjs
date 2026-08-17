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

result = store.execute(editorCommand(EditorCommandType.RESPONSIVE_ITEM_STYLE_PATCH, {
  viewport: "mobile",
  styleKey: "hero.title",
  patch: {
    positionMode: "anchored",
    horizontalAnchor: "center",
    verticalAnchor: "top",
    heightMode: "auto",
  },
}));
assert.equal(result.ok, true);
assert.deepEqual(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.title"], {
  positionMode: "anchored",
  horizontalAnchor: "center",
  verticalAnchor: "top",
  heightMode: "auto",
});
result = store.execute(editorCommand(EditorCommandType.RESPONSIVE_ITEM_STYLE_REMOVE, {
  viewport: "mobile",
  styleKey: "hero.title",
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.title"], undefined);
result = store.undo();
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.title"].positionMode, "anchored");

result = store.execute(editorCommand(EditorCommandType.LAYOUT_COLLISION_REFLOW, {
  viewport: "mobile",
  itemPatches: {
    "hero.title": { positionMode: "free", xPct: 5, yPx: 180, heightMode: "auto", heightPx: undefined },
    "hero.description": { positionMode: "free", xPct: 5, yPx: 260, heightMode: "auto" },
  },
  sectionPatches: { hero: { minHeight: 520 } },
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.title"].yPx, 180);
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.title"].heightPx, undefined);
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.description"].yPx, 260);
assert.equal(result.state.document.layout.sectionStyles.hero.minHeight, 520);
result = store.undo();
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.description"], undefined);

result = store.execute(editorCommand(EditorCommandType.COMPONENT_FIELD_LAYOUT_REORDER, {
  stylePatches: {
    "hero.card.image": { order: 10 },
    "hero.card.title": { order: 0 },
  },
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.layout.itemStyles["hero.card.image"].order, 10);
assert.equal(result.state.document.layout.itemStyles["hero.card.title"].order, 0);
result = store.undo();
assert.equal(result.state.document.layout.itemStyles["hero.card.image"], undefined);
assert.equal(result.state.document.layout.itemStyles["hero.card.title"], undefined);

result = store.execute(editorCommand(EditorCommandType.COMPONENT_FIELD_LAYOUT_REORDER, {
  viewport: "mobile",
  stylePatches: {
    "hero.card.image": { order: 0 },
    "hero.card.title": { order: 10 },
  },
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.layout.responsiveLayouts.mobile.itemStyles["hero.card.title"].order, 10);

store.replaceDocument({
  layout: { itemStyles: { "hero.title": { fontSize: 30 } } },
  content: { hero: { title: "Reloaded" } },
});
assert.equal(store.getHistoryState().canUndo, false);
assert.equal(store.getState().dirty, false);
assert.equal(store.getState().document.content.hero.title, "Reloaded");

store.setReadOnly(true);
result = store.execute(editorCommand(EditorCommandType.CONTENT_VALUE_SET, {
  sectionKey: "hero",
  itemKey: "title",
  value: "Must not change",
}));
assert.equal(result.ok, false);
assert.equal(result.code, "EDITOR_READ_ONLY");
assert.equal(store.getState().document.content.hero.title, "Reloaded");
assert.equal(store.undo().code, "EDITOR_READ_ONLY");
store.setReadOnly(false);
assert.equal(store.execute(editorCommand(EditorCommandType.CONTENT_VALUE_SET, {
  sectionKey: "hero",
  itemKey: "title",
  value: "Editable again",
})).ok, true);

console.log("Editor core command and history tests passed.");
