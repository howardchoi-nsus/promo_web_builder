import assert from "node:assert/strict";
import { createEditorStore } from "../visual-editor/src/platform/editor-core/create-editor-store.mjs";
import { EditorCommandType, editorCommand } from "../visual-editor/src/platform/editor-core/editor-commands.mjs";
import {
  createBlankSectionInstance,
  createComponentInstanceFromDefinition,
  createSectionInstanceFromPreset,
} from "../visual-editor/src/platform/editor-core/composition-structure.mjs";

const header = {
  sectionKey: "header",
  name: "Header",
  fixedPosition: "top",
  items: [{ itemKey: "logo", name: "Logo", fieldKind: "image", isLocked: false }],
};
const hero = {
  sectionKey: "hero",
  name: "Hero",
  items: [{ itemKey: "title", name: "Title", fieldKind: "text", isLocked: false }],
};
const store = createEditorStore({
  sections: [header, hero],
  content: {
    header: { logo: { source: "url", value: "logo.png" } },
    hero: { title: "Promotion" },
  },
  layout: {
    itemStyles: {
      "hero.title": { widthPct: 40 },
    },
    sectionStyles: {},
    visibility: { items: {}, fields: {} },
  },
});

const blankSection = createBlankSectionInstance({ name: "Blank" });
assert.match(blankSection.sectionKey, /^sec_[a-f0-9]+$/);
assert.equal(blankSection.items.length, 0);

const presetSection = createSectionInstanceFromPreset(hero);
assert.notEqual(presetSection.sectionKey, hero.sectionKey);
assert.equal(presetSection.sourceSectionKey, hero.sectionKey);

const componentInstance = createComponentInstanceFromDefinition({
  id: "component-id",
  componentKey: "titleBlock",
  name: "Title block",
  activeVersion: {
    id: "component-version-id",
    version: 2,
    status: "active",
    fieldKind: "text",
    textType: "title",
    fields: [{
      id: "field-id",
      fieldKey: "fld_1234567890abcdef1234567890abcdef",
      name: "Title",
      fieldKind: "text",
      textType: "title",
    }],
  },
});
assert.match(componentInstance.itemKey, /^titleBlock_[a-f0-9]{8}$/);
assert.equal(componentInstance.componentVersionId, "component-version-id");
assert.equal(componentInstance.fields.length, 1);

let result = store.execute(editorCommand(EditorCommandType.SECTION_INSTANCE_CREATE, {
  section: { sectionKey: "benefits", name: "Benefits", items: [] },
  index: 1,
}));
assert.equal(result.ok, true);
assert.deepEqual(result.state.document.sections.map((section) => section.sectionKey), [
  "header", "benefits", "hero",
]);

result = store.execute(editorCommand(EditorCommandType.COMPONENT_INSTANCE_CREATE, {
  sectionKey: "benefits",
  item: { itemKey: "description", name: "Description", fieldKind: "text" },
  value: "Benefit copy",
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.content.benefits.description, "Benefit copy");

result = store.execute(editorCommand(EditorCommandType.COMPONENT_INSTANCE_MOVE_SECTION, {
  sourceSectionKey: "benefits",
  targetSectionKey: "hero",
  itemKey: "description",
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.sections[1].items.length, 0);
assert.equal(result.state.document.sections[2].items.at(-1).itemKey, "description");
assert.equal(result.state.document.content.hero.description, "Benefit copy");

result = store.execute(editorCommand(EditorCommandType.SECTION_INSTANCE_REORDER, {
  sectionKeys: ["hero", "benefits", "header"],
}));
assert.equal(result.ok, true);
assert.deepEqual(result.state.document.sections.map((section) => section.sectionKey), [
  "header", "hero", "benefits",
]);

result = store.execute(editorCommand(EditorCommandType.COMPONENT_INSTANCE_REMOVE, {
  sectionKey: "hero",
  itemKey: "title",
}));
assert.equal(result.ok, true);
assert.equal(result.state.document.content.hero.title, undefined);
assert.equal(result.state.document.layout.itemStyles["hero.title"], undefined);

result = store.undo();
assert.equal(result.ok, true);
assert.equal(result.state.document.sections[1].items[0].itemKey, "title");
assert.equal(result.state.document.content.hero.title, "Promotion");

result = store.execute(editorCommand(EditorCommandType.SECTION_INSTANCE_REMOVE, {
  sectionKey: "header",
}));
assert.equal(result.ok, false);
assert.match(result.error, /cannot be removed/i);

console.log("Editor structure command tests passed.");
