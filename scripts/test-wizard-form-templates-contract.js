const assert = require("assert");
const fs = require("fs");
const path = require("path");

const store = require("../api/_wizard-form-templates-store");

assert.strictEqual(store.normalizeBoolean(true, false), true);
assert.strictEqual(store.normalizeBoolean("false", true), false);
assert.strictEqual(store.normalizeNumber("21.8"), 21);
assert.strictEqual(store.normalizeNumber("invalid", 10), 10);
assert.deepStrictEqual(store.toFormTemplate({
  id: "template-id", template_key: "aaa", name: "AAA", status: "draft",
  version: 2, is_default: false,
}), {
  id: "template-id", templateKey: "aaa", name: "AAA", description: "",
  status: "draft", version: 2, isDefault: false, changeNote: "",
  archivedAt: null, createdAt: null, updatedAt: null,
});

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "db", "migrations", "017_wizard_form_templates.sql"), "utf8");
const templatesApi = fs.readFileSync(path.join(root, "api", "wizard-form-templates.js"), "utf8");
const activateApi = fs.readFileSync(path.join(root, "api", "wizard-form-template-activate.js"), "utf8");
const sectionsApi = fs.readFileSync(path.join(root, "api", "wizard-form-template-sections.js"), "utf8");
const orderApi = fs.readFileSync(path.join(root, "api", "wizard-form-template-sections-order.js"), "utf8");
const adminSource = fs.readFileSync(path.join(root, "prototype", "app.js"), "utf8");
const adminHtml = fs.readFileSync(path.join(root, "prototype", "index.html"), "utf8");

assert.match(migration, /create table if not exists wizard_form_templates/);
assert.match(migration, /create table if not exists wizard_form_template_sections/);
assert.match(migration, /clone_wizard_form_template_draft/);
assert.match(migration, /activate_wizard_form_template/);
assert.match(migration, /wizard_form_template:active_default/);
assert.match(migration, /duplicate_wizard_form_template/);
assert.match(migration, /'default', 'Default Template'/);
assert.match(migration, /from wizard_content_sections[\s\S]*where status = 'active'/);
assert.match(migration, /v_default_id is null and not exists/);
assert.match(templatesApi, /templateKey already exists/);
assert.match(templatesApi, /duplicateKeyRows/);
assert.match(templatesApi, /duplicateSourceId/);
assert.match(templatesApi, /Source form template not found/);
assert.match(activateApi, /validateTemplateDraft/);
assert.match(activateApi, /Another active default form template is required/);
assert.match(sectionsApi, /Only draft form templates can change section membership/);
assert.match(sectionsApi, /Section is already included in this form template/);
assert.match(orderApi, /Section order is stale/);
assert.match(orderApi, /jsonb_array_elements/);
assert.match(orderApi, /section\.orderChangeAllowed && !section\.fixedPosition/);
assert.match(orderApi, /ts\.fixed_position is null/);
assert.match(adminSource, /loadWizardFormTemplates/);
assert.match(adminSource, /duplicateWizardFormTemplate/);
assert.match(adminSource, /duplicateWizardFormTemplateError/);
assert.match(adminSource, /duplicateWizardFormTemplateKeyExists/);
assert.match(adminSource, /newWizardFormTemplateKeyExists/);
assert.match(adminSource, /activateWizardFormTemplate/);
assert.match(adminSource, /addWizardFormTemplateSection/);
assert.match(adminSource, /saveWizardFormTemplateSection/);
assert.match(adminSource, /dropWizardFormTemplateSection/);
assert.match(adminSource, /this\.showDuplicateWizardFormTemplateForm = false;[\s\S]*this\.wizardFormTemplateDetail = null;/);
assert.match(adminHtml, /template-section-composer/);
assert.match(adminHtml, /template-section-items-panel/);
assert.match(adminHtml, /template-basic-settings/);
assert.match(adminHtml, /section-library-manager/);
assert.match(adminHtml, /폼 템플릿/);
assert.match(adminHtml, /섹션 라이브러리/);

console.log("Wizard form templates contract test passed");
