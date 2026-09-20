import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createSectionLayoutPreviewSnapshot,
  normalizeSectionLayoutSnapshot,
  sectionLayoutTree,
  updateSectionLayoutGeometry,
  updateSectionLayoutVisibility,
} from "../admin-app/src/services/section-layout-workbench.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const items = [
  { itemKey: "title", name: "Title", fieldKind: "text", textType: "title", isRequired: true },
  { itemKey: "cta", name: "CTA", fieldKind: "cta" },
];
const section = { id: "section-id", sectionKey: "hero", name: "Hero", status: "draft" };
const normalized = normalizeSectionLayoutSnapshot({}, items);
assert.equal(normalized.viewports.desktop.items.title.widthPct, 44);
assert.equal(normalized.viewports.mobile.items.title.widthPct, 90);
assert.equal(sectionLayoutTree(section, items).length, 3);

const moved = updateSectionLayoutGeometry(normalized, "desktop", "title", { xPct: 12, yPx: 48 });
assert.equal(moved.viewports.desktop.items.title.xPct, 12);
assert.equal(normalized.viewports.desktop.items.title.xPct, 4, "Geometry updates must be immutable");
const hidden = updateSectionLayoutVisibility(moved, "mobile", "cta", false);
assert.equal(hidden.viewports.mobile.visibility.items.cta, false);

const preview = createSectionLayoutPreviewSnapshot(section, items, hidden);
assert.equal(preview.contractVersion, 3);
assert.equal(preview.content.sectionSnapshot[0].sectionKey, "hero");
assert.equal(preview.designSpec.itemStyles["hero.title"].xPct, 12);
assert.equal(preview.designSpec.responsiveLayouts.mobile.visibility.items["hero.cta"], false);

const host = read("admin-app/src/components/LivePreviewHost.vue");
const componentEditor = read("admin-app/src/components/RenderSpecEditor.vue");
const sectionWorkbench = read("admin-app/src/components/SectionLayoutDomWorkbench.vue");
assert.match(host, /data-preview-mode/);
assert.match(host, /is-live-preview-selected/);
assert.match(host, /desktop','tablet','mobile/);
assert.match(componentEditor, /<LivePreviewHost/);
assert.match(sectionWorkbench, /<LivePreviewHost/);
assert.match(sectionWorkbench, /<PromoReadonlyRenderer/);
assert.match(sectionWorkbench, /sectionLayoutPresetService\.update/);
assert.doesNotMatch(sectionWorkbench, /iframe|VisualEditorDialogHost/);

console.log("Admin single Live Preview and Section DOM workbench tests passed");
