const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const templateMembershipHandler = require("../api/wizard-form-template-sections");
const contentStoreModule = require("../api/_wizard-content-sections-store");
const templateStoreModule = require("../api/_wizard-form-templates-store");

const migration = read("db", "migrations", "028_section_component_registry.sql");
const componentStore = read("api", "_wizard-content-sections-store.js");
const templateStore = read("api", "_wizard-form-templates-store.js");
const templateMembershipApi = read("api", "wizard-form-template-sections.js");
const componentUsageApi = read("api", "section-component-usage.js");
const runStore = read("api", "_promo-section-design-store.js");
const adminHtml = read("prototype", "index.html");
const adminApp = read("prototype", "app.js");
const seed = read("db", "seeds", "003_seed_section_components_and_default_template.sql");
const cutoverInspection = read("scripts", "inspect-section-component-cutover.js");

assert.deepEqual(templateMembershipHandler.COMPONENT_DEFINITION_FIELDS, [
  "name", "description", "aiDesign", "items", "sectionKey", "componentId",
]);
assert.equal(contentStoreModule.toSection({
  id: "version-id", component_id: "component-id", section_key: "heroBanner",
  name: "Hero", status: "active", version: 2,
}).componentId, "component-id");
assert.equal(templateStoreModule.toTemplateSection({
  id: "membership-id", form_template_id: "template-id", component_id: "component-id",
  section_key: "heroBanner",
}).componentId, "component-id");

assert.match(migration, /wizard_section_components/);
assert.match(migration, /wizard_section_component_usage/);
assert.match(migration, /wizard_content_sections_one_active_per_component_uidx/);
assert.match(migration, /wizard_form_template_sections_template_component_uidx/);
assert.match(migration, /alter column form_template_id drop not null/);
assert.match(migration, /foreign key \(form_template_id\).*on delete set null/s);
assert.match(migration, /prevent_wizard_template_delete_with_active_section_runs/);
assert.match(migration, /v_source\.component_id/);
assert.match(migration, /v_new_id, component_id, null, section_key/);

assert.match(componentStore, /componentId: row\.component_id \|\| null/);
assert.match(componentStore, /fetchComponentUsage/);
assert.match(templateStore, /s\.component_id = ts\.component_id/);
assert.match(templateStore, /s\.status = 'active'/);
assert.match(templateStore, /ts\.component_id is null/);

assert.match(templateMembershipApi, /componentId is required/);
assert.match(templateMembershipApi, /Component definitions cannot be changed from Template Management/);
assert.doesNotMatch(templateMembershipApi, /owner_form_template_id/);
assert.doesNotMatch(templateMembershipApi, /remapLayoutSectionKey/);
assert.doesNotMatch(templateMembershipApi, /insert into wizard_content_section_items/);
assert.match(componentUsageApi, /fetchComponentUsage/);

assert.match(runStore, /templateKey: row\.template_key_snapshot/);
assert.match(runStore, /template_key_snapshot/);
assert.match(adminHtml, /t\('entity\.component\.manage'\)/);
assert.doesNotMatch(adminHtml, /section-library-manager-body" v-if="false"/);
assert.doesNotMatch(adminHtml, /newWizardFormTemplateSectionForm\.(?:isRequired|isVisible|userReorderAllowed|fixedPosition)/);
assert.match(adminApp, /newWizardFormTemplateSectionForm: \{ componentId: "" \}/);
assert.doesNotMatch(adminApp, /templateId: template\.id, \.\.\.this\.newWizardFormTemplateSectionForm/);
assert.match(seed, /Wizard configuration is not empty/);
assert.match(seed, /wizard_section_components/);
assert.match(seed, /'default-v2'/);
assert.match(seed, /imageTargetItemKeys/);
assert.match(seed, /"component_key":"header"[^\n]+"fixed_position":"top"/);
assert.match(seed, /"component_key":"footer"[^\n]+"fixed_position":"bottom"/);
assert.match(seed, /seed\.is_required, seed\.order_change_allowed, seed\.fixed_position, seed\.sort_order/);
assert.match(cutoverInspection, /readOnly: true/);
assert.match(cutoverInspection, /noActiveSectionDesignRuns/);
assert.match(cutoverInspection, /sectionDesignRunTemplateFkPreservesRows/);

async function verifyTemplateBoundaryHandler() {
  const response = { statusCode: 200, payload: null };
  const res = {
    setHeader() {},
    status(code) { response.statusCode = code; return this; },
    json(payload) { response.payload = payload; return payload; },
  };
  await templateMembershipHandler({
    method: "PATCH",
    query: {},
    body: { id: "membership-id", name: "Must not be changed here" },
  }, res);
  assert.equal(response.statusCode, 400);
  assert.match(response.payload.error, /Component definitions cannot be changed/);
  assert.deepEqual(response.payload.fields, ["name"]);
}

verifyTemplateBoundaryHandler()
  .then(() => console.log("Section component separation contract test passed"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
