import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createInitialSectionLayout,
  sectionLayoutEditorUrl,
  sectionLayoutPresetService,
} from "../admin-app/src/services/section-layout-preset-service.mjs";

const snapshot = createInitialSectionLayout([
  { itemKey: "logo", isVisibleInWizard: true },
  { itemKey: "badges", isVisibleInWizard: true },
]);
assert.equal(snapshot.contractVersion, 1);
assert.equal(snapshot.layoutMode, "free");
assert(snapshot.viewports.desktop.items.logo);
assert(snapshot.viewports.mobile.items.badges);
assert(snapshot.sectionStyle.minHeight >= 160);

const editorUrl = sectionLayoutEditorUrl(
  "section-id",
  "standard-header",
  "https://example.com",
);
assert.equal(
  editorUrl,
  "https://example.com/prototype/visual-editor.html?mode=section-preset&sectionId=section-id&layoutKey=standard-header",
);

let request = null;
const mockFetch = async (url, options) => {
  request = { url, options };
  return {
    ok: true,
    json: async () => ({ ok: true, layouts: [] }),
  };
};
await sectionLayoutPresetService.list("section id", mockFetch);
assert.equal(request.url, "/api/wizard-content-section-layouts?sectionId=section%20id");

const root = path.resolve(import.meta.dirname, "..");
const manager = fs.readFileSync(path.join(root, "admin-app/src/components/SectionLayoutPresetManager.vue"), "utf8");
const editor = fs.readFileSync(path.join(root, "visual-editor/src/SectionPresetEditor.vue"), "utf8");
const main = fs.readFileSync(path.join(root, "visual-editor/src/main.js"), "utf8");
const adminMain = fs.readFileSync(path.join(root, "admin-app/src/main.js"), "utf8");
const adminHtml = fs.readFileSync(path.join(root, "prototype/index.html"), "utf8");

assert.match(manager, /Layout Preset/);
assert.match(manager, /toggleAiLayout/);
assert.match(editor, /viewport === 'desktop'/);
assert.match(editor, /startPointer/);
assert.match(editor, /undoStack/);
assert.match(editor, /sectionPresetAdapter\.update/);
assert.match(main, /queryMode === "section-preset"/);
assert.match(adminMain, /PromoAdminSectionLayouts/);
assert.match(adminHtml, /section-layout-preset-manager/);

console.log("Section layout preset editor contract test passed.");

