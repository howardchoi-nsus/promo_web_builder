const assert = require("assert");
const fs = require("fs");
const path = require("path");

const store = require("../api/_wizard-form-templates-store");

assert.strictEqual(store.normalizeBoolean(true, false), true);
assert.strictEqual(store.normalizeBoolean("false", true), false);
assert.strictEqual(store.normalizeNumber("21.8"), 21);
const generatedTemplateKey = store.createTemplateKey();
assert.match(generatedTemplateKey, /^tpl_[a-f0-9]{32}$/);
assert.notStrictEqual(generatedTemplateKey, store.createTemplateKey());
assert.deepStrictEqual(store.toFormTemplate({
  id: "template-id", template_key: "aaa", name: "AAA", status: "draft", version: 2, is_default: false,
}), {
  id: "template-id", templateKey: "aaa", name: "AAA", description: "", status: "draft",
  version: 2, isDefault: false, changeNote: "",
  recommendationProfile: {
    promotionTypes: [], markets: [], audiences: [], tones: [],
    supportedComponentRoles: [], requiredInputs: [], requiredNotices: [], tags: [],
  },
  designTokenSetVersionId: null, archivedAt: null, createdAt: null, updatedAt: null,
});

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const migration17 = read("db", "migrations", "017_wizard_form_templates.sql");
const migration18 = read("db", "migrations", "018_template_owned_sections_and_reorder.sql");
const migration21 = read("db", "migrations", "021_fix_form_template_section_clone_links.sql");
const migration29 = read("db", "migrations", "029_item_components_design_tokens_and_planner.sql");
const migration40 = read("db", "migrations", "040_decouple_template_design_tokens.sql");
const migration43 = read("db", "migrations", "043_promo_template_recommendation.sql");
const templatesApi = read("api", "wizard-form-templates.js");
const templateApi = read("api", "wizard-form-template.js");
const activateApi = read("api", "wizard-form-template-activate.js");
const deactivateApi = read("api", "wizard-form-template-deactivate.js");
const sectionsApi = read("api", "wizard-form-template-sections.js");
const sectionActivateApi = read("api", "wizard-content-section-activate.js");
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
assert.match(migration21, /form_template_id, section_id, section_key/);
assert.match(migration21, /user_reorder_allowed/);
assert.match(migration21, /where ts\.section_id is null/);
assert.match(activateApi, /validateTemplateDraft/);
assert.match(activateApi, /validateTemplateCompositionSnapshot/);
assert.doesNotMatch(activateApi, /activate_wizard_form_template_owned_sections/);
assert.match(templatesApi, /String\(body\.templateKey \|\| ""\)\.trim\(\) \|\| createTemplateKey\(\)/);
assert.doesNotMatch(templatesApi, /templateKey is required/);
assert.match(deactivateApi, /current\.status !== "active"/);
assert.match(deactivateApi, /current\.is_default/);
assert.match(deactivateApi, /At least one active form template must remain/);
assert.match(deactivateApi, /previous_status, new_status/);
assert.match(deactivateApi, /'active', 'inactive'/);
assert.match(migration29, /design_token_set_version_id/);
assert.match(migration40, /set design_token_set_version_id = null/);
assert.match(migration40, /add column if not exists is_default/);
assert.match(migration40, /promo_design_token_sets_default_uidx/);
assert.match(migration43, /recommendation_profile jsonb/);
assert.match(templateApi, /recommendationProfile/);
assert.match(adminHtml, /추천 메타데이터 \(JSON\)/);
assert.doesNotMatch(templatesApi, /body\.designTokenSetVersionId/);
assert.doesNotMatch(templateApi, /body\.designTokenSetVersionId/);
assert.doesNotMatch(store.validateTemplateDraft.toString(), /DESIGN_TOKEN_SET_REQUIRED/);
assert.deepStrictEqual(store.validateTemplateCompositionSnapshot([{
  sectionKey: "template-local",
  status: "draft",
  sectionId: null,
  isVisibleInWizard: true,
  items: [{ itemKey: "title", isVisibleInWizard: true }],
}]), [], "a saved Live Preview composition must not require an active Section Preset version");
assert.deepStrictEqual(store.validateTemplateCompositionSnapshot([{
  sectionKey: "empty-section",
  isVisibleInWizard: true,
  items: [],
}]), [{
  code: "SECTION_COMPONENT_REQUIRED",
  path: "empty-section",
  message: "The section needs at least one visible component instance.",
}]);
assert.deepStrictEqual(store.validateTemplateCompositionSnapshot([{
  sectionKey: "hidden-section",
  isVisibleInWizard: false,
  items: [],
}]), [{
  code: "VISIBLE_SECTION_REQUIRED",
  message: "At least one visible section is required.",
}]);
assert.match(migration29, /form_template_id, section_id, section_key/);
assert.match(sectionsApi, /status in \('draft', 'active'\)/);
assert.match(sectionsApi, /draft or active section version/);
assert.match(sectionActivateApi, /template\.status = 'draft'/);
assert.match(sectionActivateApi, /membership\.section_key = \$\{target\.section_key\}/);
assert.doesNotMatch(sectionsApi, /owner_form_template_id/);
assert.match(sectionsApi, /userReorderAllowed/);
assert.match(sectionsApi, /Section definitions cannot be changed from Template Management/);
assert.doesNotMatch(sectionsApi, /Template-owned draft created for editing/);
assert.doesNotMatch(sectionsApi, /from wizard_content_section_items where section_id/);
assert.match(orderApi, /Section order is stale/);
assert.doesNotMatch(orderApi, /order_change_allowed = true/);
assert.match(orderApi, /ts\.fixed_position is null/);
assert.match(itemOrderApi, /Only draft section items can be reordered/);
assert.match(itemOrderApi, /ordinality::integer as ordinal/);
assert.match(adminSource, /addWizardFormTemplateSection/);
assert.match(adminSource, /Section Preset 초안을 생성했습니다/);
assert.doesNotMatch(adminSource, /섹션을 생성하고 현재 템플릿 초안에 추가했습니다/);
assert.match(adminSource, /wizardSectionsForCurrentTemplate/);
assert.match(adminSource, /group\.versions\.find\(\(version\) => version\.id === membership\.sectionId\)/);
assert.match(adminSource, /const requestedSectionId = String\(options\.sectionId \|\| ""\)\.trim\(\)/);
assert.match(adminSource, /Form template validation failed.*sectionErrors\.join/s);
assert.match(adminSource, /dropWizardFormTemplateSection/);
assert.match(adminSource, /const previousSections = \[\.\.\.this\.wizardFormTemplateDetail\.sections\]/);
assert.match(adminSource, /this\.wizardFormTemplateDetail\.sections = previousSections/);
assert.match(adminSource, /openNewWizardFormTemplateItemEditor/);
assert.match(adminSource, /saveWizardFormTemplateItem/);
assert.match(adminSource, /prepareWizardFormTemplateSectionDraft/);
assert.match(adminSource, /matchingItem.*item\.itemKey === editor\.itemKey/);
assert.match(adminSource, /const isNewItem = this\.wizardFormTemplateItemEditorOpenId === "new"/);
assert.match(adminSource, /draftItem.*candidate\.itemKey === item\.itemKey/);
assert.match(adminSource, /draftByKey = new Map/);
assert.match(adminSource, /dropWizardFormTemplateItem/);
assert.match(adminSource, /const primary = draft\s+\|\| active\s+\|\| inactive/);
assert.match(adminSource, /editWizardFormTemplate\(group\)/);
assert.match(adminSource, /openDuplicateWizardFormTemplate\(group/);
assert.match(adminSource, /toggleWizardFormTemplateActive\(group, enabled\)/);
assert.match(adminSource, /fetch\("\/api\/wizard-form-template-deactivate"/);
assert.match(adminSource, /\.\.\.\(this\.wizardItemEditor\.id \? \{ itemKey: this\.wizardItemEditor\.itemKey \} : \{\}\)/);
assert.doesNotMatch(adminSource, /newWizardFormTemplateForm:\s*\{\s*templateKey:/);
assert.doesNotMatch(adminSource, /duplicateWizardFormTemplateForm:\s*\{\s*templateKey:/);
assert.doesNotMatch(adminHtml, /template-section-composer/);
assert.match(adminHtml, /class="template-list-card"/);
assert.match(adminHtml, /class="template-settings-toggle"/);
assert.match(adminHtml, /class="app-switch"[\s\S]*?role="switch"[\s\S]*?class="app-switch__track"/);
assert.match(adminHtml, /@click="editWizardFormTemplate\(group\)"/);
assert.match(adminHtml, /@click="openDuplicateWizardFormTemplate\(group\)"/);
assert.match(adminHtml, /@click="deleteWizardFormTemplate\(group\)"/);
assert.match(adminHtml, /t\('entity\.template\.key'\)/);
assert.doesNotMatch(adminHtml, /v-model="newWizardFormTemplateForm\.templateKey"/);
assert.doesNotMatch(adminHtml, /wizardFormTemplateEditor\.designTokenSetVersionId/);
assert.doesNotMatch(adminHtml, /newWizardFormTemplateForm\.designTokenSetVersionId/);
assert.doesNotMatch(adminHtml, /v-model="duplicateWizardFormTemplateForm\.templateKey"/);
assert.doesNotMatch(adminHtml, /v-model="wizardItemEditor\.itemKey"/);
assert.match(adminSource, /newWizardFormTemplateSectionForm:\s*\{ sectionId: "" \}/);
assert.match(adminHtml, /t\('entity\.component\.manage'\)/);
assert.doesNotMatch(adminHtml, /transition-group name="template-section-order"/);
assert.doesNotMatch(adminHtml, /class="template-section-add"/);
assert.match(adminHtml, /섹션 프리셋 관리/);
assert.match(adminHtml, /v-for="group in groupedWizardSections"/);
assert.match(adminHtml, /selectWizardSection\(group\.sectionKey, \{ sectionId: group\.primary\?\.id \}\)/);
assert.match(adminHtml, /class="tiny-button section-activate-button"[\s\S]*?\['draft', 'inactive'\]\.includes\(wizardSectionDetail\.section\.status\)/);
assert.match(adminHtml, /transition-group name="template-item-order"/);
assert.match(adminHtml, /<template-layout-manager/);
assert.match(adminHtml, /t\('entity\.template\.add'\)/);
assert.match(adminHtml, /adminTab === 'audit'/);
assert.match(adminHtml, /섹션 및 컴포넌트 변경 이력/);

console.log("Wizard form templates contract test passed");
