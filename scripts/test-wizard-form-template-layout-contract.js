const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const migration = read("db/migrations/023_wizard_form_template_layouts.sql");
const defaultContentMigration = read("db/migrations/042_template_default_content.sql");
const store = read("api/_wizard-form-template-layout-store.js");
const api = read("api/wizard-form-template-layout.js");
const publicApi = read("api/wizard-form-template-public.js");
const templatesApi = read("api/wizard-form-templates.js");
const activationApi = read("api/wizard-form-template-activate.js");
const usageApi = read("api/wizard-layout-usage-events.js");
const sectionsApi = read("api/wizard-form-template-sections.js");
const wizard = read("prototype/promo-wizard.js");
const admin = read("prototype/index.html");
const adminLayoutManager = read("admin-app/src/components/TemplateLayoutManager.vue");
const adminStyles = read("prototype/styles.css");
const editor = read("visual-editor/src/App.vue");
const promoBuilderAdapter = read("visual-editor/src/platform/adapters/promo-builder-adapter.mjs");
const layoutStore = require("../api/_wizard-form-template-layout-store");

assert.match(migration, /create table if not exists wizard_form_template_layouts/);
assert.match(defaultContentMigration, /add column if not exists default_content jsonb/);
assert.match(store, /normalizeDefaultContent/);
assert.match(api, /default_content =/);
assert.match(publicApi, /defaultContent:\s*layout\.defaultContent/);
assert.match(migration, /wizard_form_template_layout_histories/);
assert.match(migration, /wizard_layout_usage_events/);
assert.match(store, /validateLayoutSpec/);
assert.equal(
  layoutStore.validateLayoutSpec({
    itemStyles: { "hero.title": { fontSize: 1, widthPct: 0.1, heightPx: 1 } },
  }, [{
    sectionKey: "hero",
    items: [{ itemKey: "title", fieldKind: "text" }, { itemKey: "image", fieldKind: "image" }],
  }]).errors.length,
  0,
);
assert.equal(
  layoutStore.validateLayoutSpec({
    itemStyles: { "hero.image": { widthPct: 0.1, heightPx: 1 } },
  }, [{
    sectionKey: "hero",
    items: [{ itemKey: "title", fieldKind: "text" }, { itemKey: "image", fieldKind: "image" }],
  }]).errors.length,
  0,
  "small image geometry accepted by the editor must also activate successfully",
);
assert.equal(
  layoutStore.validateLayoutSpec({
    responsiveLayouts: {
      mobile: {
        itemStyles: {
          "hero.title": { positionMode: "free", xPct: 90, yPx: 10, widthPct: 20, heightPx: 40 },
        },
        visibility: { items: { "hero.title": true } },
      },
    },
  }).ok,
  false,
);
assert.equal(
  layoutStore.validateLayoutSpec({
    itemStyles: {
      "hero.title": {
        positionMode: "anchored",
        horizontalAnchor: "center",
        verticalAnchor: "middle",
        widthMode: "fit-content",
        heightMode: "auto",
        fontFamilyToken: "--promo-font-family-body",
      },
    },
    responsiveLayouts: {
      mobile: {
        itemStyles: {
          "hero.title": {
            positionMode: "anchored",
            horizontalAnchor: "center",
            verticalAnchor: "top",
            offsetY: 24,
          },
        },
      },
    },
  }, [{
    sectionKey: "hero",
    items: [{ itemKey: "title", fieldKind: "text" }],
  }]).ok,
  true,
  "section-anchored text styles must persist for desktop and mobile",
);
assert.equal(layoutStore.validateLayoutSpec({ responsiveLayouts: "mobile" }).ok, false);
assert.match(store, /cloneLayout/);
assert.match(api, /Only draft form template layouts can be edited/);
assert.match(api, /Layout revision conflict/);
assert.doesNotMatch(api, /fetchTokenVersion/);
assert.doesNotMatch(api, /designTokens:/);
assert.match(publicApi, /defaultLayout/);
assert.match(publicApi, /layoutRevision/);
assert.match(publicApi, /layoutIdentity:\s*createLayoutIdentity/);
assert.match(store, /function createLayoutIdentity/);
assert.match(activationApi, /layoutIdentity:\s*createLayoutIdentity/);
assert.match(usageApi, /admin_layout_update_detected/);
assert.match(usageApi, /admin_layout_update_applied/);
assert.match(usageApi, /legacy_layout_cache_invalidated/);
assert.match(usageApi, /legacy_section_order_cache_invalidated/);
assert.match(usageApi, /admin_layout_reset_with_section_order/);
assert.match(templatesApi, /cloneLayout/);
assert.match(activationApi, /Form template layout validation failed/);
assert.match(store, /remapLayoutSectionKey/);
assert.doesNotMatch(sectionsApi, /remapLayoutSectionKey/);
assert.match(sectionsApi, /Section definitions cannot be changed from Template Management/);
assert.match(admin, /<template-layout-manager/);
assert.match(admin, /:translate="t"/);
assert.match(adminLayoutManager, /admin\.templateLayout\.title/);
assert.match(adminLayoutManager, /requestRevision/);
assert.match(admin, /id="template-component-manager-target"/);
assert.match(admin, /<teleport to="#template-component-manager-target"/);
assert.match(adminStyles, /\.form-template-editor-panels\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/);
assert.match(adminStyles, /\.form-template-editor-panels\s*\{[\s\S]*?padding:\s*10px;[\s\S]*?border:\s*1px solid var\(--line\);[\s\S]*?border-radius:\s*var\(--radius\);/);
assert.match(editor, /admin-layout/);
assert.match(promoBuilderAdapter, /wizard-layout/);
assert.match(wizard, /promo-wizard-layout-change/);
assert.match(wizard, /layoutSnapshot/);
assert.match(wizard, /관리자 기본 레이아웃으로 초기화/);

console.log("Wizard form template layout contract test passed");
