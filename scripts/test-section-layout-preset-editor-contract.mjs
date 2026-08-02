import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createInitialSectionLayout,
  sectionLayoutEditorUrl,
  sectionLayoutPresetService,
} from "../admin-app/src/services/section-layout-preset-service.mjs";
import { sectionPresetSnapshotFromDesignSpec } from "../visual-editor/src/platform/layout-engine/section-preset-snapshot.mjs";

const snapshot = createInitialSectionLayout([
  { itemKey: "logo", isVisibleInWizard: true },
  { itemKey: "badges", isVisibleInWizard: true },
]);
assert.equal(snapshot.contractVersion, 1);
assert.equal(snapshot.layoutMode, "free");
assert(snapshot.viewports.desktop.items.logo);
assert(snapshot.viewports.mobile.items.badges);
assert(snapshot.sectionStyle.minHeight >= 50);
assert.equal(createInitialSectionLayout([]).sectionStyle.minHeight, 50);

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
await sectionLayoutPresetService.update("layout-id", "section-id", { name: "Live" }, mockFetch);
assert.equal(request.url, "/api/wizard-content-section-layout");
assert.equal(request.options.method, "PATCH");
assert.deepEqual(JSON.parse(request.options.body), {
  id: "layout-id",
  sectionId: "section-id",
  name: "Live",
});

const root = path.resolve(import.meta.dirname, "..");
const manager = fs.readFileSync(path.join(root, "admin-app/src/components/SectionLayoutPresetManager.vue"), "utf8");
const frame = fs.readFileSync(path.join(root, "admin-app/src/components/SectionLayoutVisualEditorFrame.vue"), "utf8");
const editor = fs.readFileSync(path.join(root, "visual-editor/src/App.vue"), "utf8");
const main = fs.readFileSync(path.join(root, "visual-editor/src/main.js"), "utf8");
const adminMain = fs.readFileSync(path.join(root, "admin-app/src/main.js"), "utf8");
const adminHtml = fs.readFileSync(path.join(root, "prototype/index.html"), "utf8");

assert.match(manager, /Layout Preset/);
assert.match(manager, /toggleAiLayout/);
assert.match(manager, /SectionLayoutVisualEditorFrame/);
assert.match(manager, /Live Preview 편집/);
assert.match(manager, /새 Layout 만들기/);
assert.match(manager, /startNewPreset/);
assert.match(manager, /Preset 만들고 Visual Editor 열기/);
assert.match(frame, /promo-section-layout-saved/);
assert.match(frame, /sectionLayoutPresetService\.editorUrl/);
assert.match(editor, /loadSectionPresetLayout/);
assert.match(editor, /saveSectionPresetLayout/);
assert.match(editor, /PromoPageRenderer/);
assert.match(editor, /sectionPresetAdapter\.update/);
assert.doesNotMatch(main, /SectionPresetEditor/);
assert.match(adminMain, /PromoAdminSectionLayouts/);
assert.match(adminHtml, /section-layout-preset-manager/);
assert.match(adminHtml, /Section Preset 관리/);
assert.match(adminHtml, /id="section-preset-manager-target"[\s\S]*?<section class="section-library-manager">/);
assert.doesNotMatch(adminHtml, /<teleport to="#section-preset-manager-target"/);
assert.match(adminHtml, /재사용 가능한 Section을 만들고 Component 구성과 Desktop\/Mobile Layout Variant를 관리합니다/);
assert.match(adminHtml, /AI가 페이지를 만들 때 이 Section을 언제 포함하고/);
assert.match(adminHtml, /AI 디자인·이미지 생성 허용/);
assert.doesNotMatch(adminHtml, /v-for="variant in \['split-left', 'split-right', 'centered-hero'\]"/);

const converted = sectionPresetSnapshotFromDesignSpec({
  sectionKey: "hero",
  items: [{ itemKey: "title" }],
}, {
  sectionStyles: { hero: { minHeight: 240, backgroundColor: "#112233" } },
  itemStyles: { "hero.title": { positionMode: "free", xPct: 8, yPx: 20, widthPct: 60, heightPx: 48, fontSize: 24 } },
  visibility: { items: { "hero.title": true } },
  responsiveLayouts: { mobile: {
    itemStyles: { "hero.title": { positionMode: "free", xPct: 5, yPx: 12, widthPct: 90, heightPx: 56 } },
    visibility: { items: { "hero.title": false } },
  } },
}, snapshot);
assert.equal(converted.sectionStyle.minHeight, 240);
assert.equal(converted.viewports.desktop.items.title.fontSize, undefined);
assert.equal(converted.viewports.mobile.visibility.items.title, false);

console.log("Section layout preset editor contract test passed.");
