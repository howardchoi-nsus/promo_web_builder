const assert = require("assert");
const fs = require("fs");
const path = require("path");

const store = require("../api/_wizard-form-templates-store");

assert.strictEqual(store.normalizeBoolean(true, false), true);
assert.strictEqual(store.normalizeBoolean("false", true), false);
assert.strictEqual(store.normalizeNumber("21.8"), 21);
assert.deepStrictEqual(store.toFormTemplate({
  id: "template-id", template_key: "aaa", name: "AAA", status: "draft", version: 2, is_default: false,
}), {
  id: "template-id", templateKey: "aaa", name: "AAA", description: "", status: "draft",
  version: 2, isDefault: false, changeNote: "", archivedAt: null, createdAt: null, updatedAt: null,
});

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const migration17 = read("db", "migrations", "017_wizard_form_templates.sql");
const migration18 = read("db", "migrations", "018_template_owned_sections_and_reorder.sql");
const activateApi = read("api", "wizard-form-template-activate.js");
const sectionsApi = read("api", "wizard-form-template-sections.js");
const orderApi = read("api", "wizard-form-template-sections-order.js");
const itemOrderApi = read("api", "wizard-content-section-items-order.js");
const adminSource = read("prototype", "app.js");
const adminHtml = read("prototype", "index.html");

assert.match(migration17, /create table if not exists wizard_form_templates/);
assert.match(migration17, /clone_wizard_form_template_draft/);
assert.match(migration17, /activate_wizard_form_template/);
assert.match(migration17, /duplicate_wizard_form_template/);
assert.match(migration18, /owner_form_template_id/);
assert.match(migration18, /user_reorder_allowed/);
assert.match(migration18, /activate_wizard_form_template_owned_sections/);
assert.match(activateApi, /validateTemplateDraft/);
assert.match(activateApi, /activate_wizard_form_template_owned_sections/);
assert.match(sectionsApi, /body\.createNew === true/);
assert.match(sectionsApi, /owner_form_template_id/);
assert.match(sectionsApi, /userReorderAllowed/);
assert.match(sectionsApi, /Template-owned draft created for editing/);
assert.match(sectionsApi, /from wizard_content_section_items where section_id/);
assert.match(orderApi, /Section order is stale/);
assert.doesNotMatch(orderApi, /order_change_allowed = true/);
assert.match(orderApi, /ts\.fixed_position is null/);
assert.match(itemOrderApi, /Only draft section items can be reordered/);
assert.match(adminSource, /addWizardFormTemplateSection/);
assert.match(adminSource, /dropWizardFormTemplateSection/);
assert.match(adminSource, /const previousSections = \[\.\.\.this\.wizardFormTemplateDetail\.sections\]/);
assert.match(adminSource, /this\.wizardFormTemplateDetail\.sections = previousSections/);
assert.match(adminSource, /openNewWizardFormTemplateItemEditor/);
assert.match(adminSource, /saveWizardFormTemplateItem/);
assert.match(adminHtml, /template-section-composer/);
assert.match(adminHtml, /transition-group name="template-section-order"/);
assert.match(adminHtml, /template-section-items-panel/);
assert.match(adminHtml, /\+ 템플릿 추가/);
assert.match(adminHtml, /공통 Section 원본 관리/);
assert.match(adminHtml, /Wizard 사용자 순서 변경 허용/);

console.log("Wizard form templates contract test passed");
