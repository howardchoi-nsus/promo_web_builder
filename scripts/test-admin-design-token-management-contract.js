const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const migration = read("db/migrations/034_promo_design_token_management.sql");
assert.match(migration, /create table if not exists promo_design_token_histories/);
assert.match(migration, /create_promo_design_token_draft/);
assert.match(migration, /replace_promo_design_token_draft_values/);
assert.match(migration, /activate_promo_design_token_version/);
assert.match(migration, /clone_promo_design_token_set/);
assert.match(migration, /pg_advisory_xact_lock/);
assert.match(migration, /where token_set_id = v_target\.token_set_id\s+and status = 'active'/);

const store = read("api/_design-token-store.js");
assert.match(store, /createTokenSetKey/);
assert.match(store, /normalizeTokenEntries/);
assert.match(store, /SAFE_CSS_PROPERTIES/);
assert.match(store, /fetchManagedTokenSets/);
assert.match(store, /fetchTokenSetUsage/);
assert.match(store, /count\(\*\) filter \(where run\.status in/);
assert.doesNotMatch(store, /count\(\*\) filter \(where status in/);

const importHandler = read("api/design-token-set-import.js");
assert.match(importHandler, /normalizeTokenEntries/);
assert.match(importHandler, /replace_promo_design_token_draft_values/);
assert.match(importHandler, /create_promo_design_token_draft/);
assert.doesNotMatch(importHandler, /for\s*\(const token of normalized\)/);

const activateHandler = read("api/design-token-set-activate.js");
assert.match(activateHandler, /normalizeTokenEntries/);
assert.match(activateHandler, /activate_promo_design_token_version/);
assert.match(activateHandler, /status\(422\)/);

const publishMigration = read("db/migrations/037_design_token_simple_publish.sql");
const publishHandler = read("api/design-token-set-publish.js");
assert.match(publishMigration, /publish_promo_design_token_version/);
assert.match(publishMigration, /clone_wizard_form_template_draft/);
assert.match(publishMigration, /activate_wizard_form_template/);
assert.match(publishMigration, /wizard_form_template_layouts/);
assert.match(publishMigration, /select version into v_draft_version/);
assert.match(publishHandler, /normalizeTokenEntries/);
assert.match(publishHandler, /publish_promo_design_token_version/);
assert.match(publishHandler, /validation \? 422/);

const aliasActivationMigration = read("db/migrations/039_design_token_app_alias_activation.sql");
assert.match(aliasActivationMigration, /when '--promo-surface' then '--app-surface'/);
assert.match(aliasActivationMigration, /when '--promo-text' then '--app-ink'/);
assert.match(aliasActivationMigration, /when '--promo-muted' then '--app-muted'/);
assert.match(aliasActivationMigration, /when '--promo-accent' then '--app-accent'/);
assert.match(aliasActivationMigration, /when '--promo-radius' then '--app-radius'/);
assert.match(aliasActivationMigration, /when '--promo-shadow' then '--app-shadow'/);
assert.match(aliasActivationMigration, /token_key = '--promo-title-size'/);

const setHandler = read("api/design-token-sets.js");
assert.match(setHandler, /createTokenSetKey\(name\)/);
assert.match(setHandler, /tokenSets\.find\(\(tokenSet\) => tokenSet\.isDefault\)/);
assert.match(setHandler, /isDefault:\s*tokenSet\.versionId === defaultVersionId/);
assert.doesNotMatch(setHandler, /body\.setKey/);

const tokenCatalog = read("docs/claude/design-tokens.csv");
[
  ["--app-font-weight-label", "700"],
  ["--app-font-weight-strong", "800"],
  ["--app-font-weight-heading", "900"],
  ["--app-font-weight-title", "950"],
].forEach(([tokenKey, value]) => {
  assert.match(tokenCatalog, new RegExp(`${tokenKey}[^\\n]*font-weight,${value},`));
});

[
  "api/design-token-set-metadata.js",
  "api/design-token-set-draft.js",
  "api/design-token-set-version.js",
  "api/design-token-set-validate.js",
  "api/design-token-set-usage.js",
  "api/design-token-set-archive.js",
  "api/design-token-set-clone.js",
].forEach((file) => {
  assert.equal(fs.existsSync(path.join(root, file)), true, `${file} must exist`);
  assert.match(read(file), /Method not allowed/);
});

const main = read("admin-app/src/main.js");
const component = read("admin-app/src/components/DesignTokenManager.vue");
const service = read("admin-app/src/services/design-token-service.mjs");
const app = read("prototype/app.js");
const html = read("prototype/index.html");
const ko = JSON.parse(read("locales/ko.json"));
const en = JSON.parse(read("locales/en.json"));

assert.match(main, /PromoAdminDesignTokens/);
assert.match(app, /adminApp\.component\("design-token-manager"/);
assert.match(app, /"design-tokens"/);
assert.match(html, /<design-token-manager/);
assert.match(html, /adminTab === 'design-tokens'/);
assert.match(service, /\/api\/design-token-set-version/);
assert.match(service, /\/api\/design-token-set-activate/);
assert.match(service, /\/api\/design-token-set-import/);
assert.match(component, /--promo-/);
assert.match(component, /previewStyle/);
assert.match(component, /usage\.templates/);
assert.match(component, /histories/);
assert.match(component, /design-token-table/);
assert.match(component, /type="file"/);
assert.match(component, /exportCsv/);
assert.doesNotMatch(component, /saveAndApply/);
assert.doesNotMatch(component, /selectedTemplateIds/);
assert.match(component, /beforeunload/);
assert.match(service, /\/api\/design-token-set-clone/);
assert.doesNotMatch(service, /\/api\/wizard-form-template/);
assert.match(service, /\/api\/design-token-set-publish/);
assert.doesNotMatch(read("api/design-token-sets.js"), /wizard_form_templates/);
assert.match(read("prototype/create-promo.js"), /designTokens: wizardDesignTokens/);
assert.match(read("visual-editor/src/PromoPageRenderer.vue"), /managedTokenStyle/);
assert.doesNotMatch(read("api/wizard-form-template-layout.js"), /designTokens:/);
assert.match(read("visual-editor/src/promo-renderer.css"), /rendered-text--title/);
assert.equal(ko["admin.designToken.title"], "디자인 토큰 관리");
assert.equal(typeof en["admin.designToken.title"], "string");

console.log("admin design token management contract passed");
