const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const migration = read("db/migrations/023_wizard_form_template_layouts.sql");
const store = read("api/_wizard-form-template-layout-store.js");
const api = read("api/wizard-form-template-layout.js");
const publicApi = read("api/wizard-form-template-public.js");
const templatesApi = read("api/wizard-form-templates.js");
const activationApi = read("api/wizard-form-template-activate.js");
const sectionsApi = read("api/wizard-form-template-sections.js");
const wizard = read("prototype/promo-wizard.js");
const admin = read("prototype/index.html");
const editor = read("visual-editor/src/App.vue");

assert.match(migration, /create table if not exists wizard_form_template_layouts/);
assert.match(migration, /wizard_form_template_layout_histories/);
assert.match(migration, /wizard_layout_usage_events/);
assert.match(store, /validateLayoutSpec/);
assert.match(store, /cloneLayout/);
assert.match(api, /Only draft form template layouts can be edited/);
assert.match(api, /Layout revision conflict/);
assert.match(publicApi, /defaultLayout/);
assert.match(publicApi, /layoutRevision/);
assert.match(templatesApi, /cloneLayout/);
assert.match(activationApi, /Form template layout validation failed/);
assert.match(store, /remapLayoutSectionKey/);
assert.match(sectionsApi, /remapLayoutSectionKey/);
assert.match(admin, /기본 레이아웃 설정/);
assert.match(editor, /admin-layout/);
assert.match(editor, /wizard-layout/);
assert.match(wizard, /promo-wizard-layout-change/);
assert.match(wizard, /layoutSnapshot/);
assert.match(wizard, /관리자 기본 레이아웃으로 초기화/);

console.log("Wizard form template layout contract test passed");
