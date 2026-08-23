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
assert.match(store, /'generating_assets', 'validating_assets', 'applying'/);
assert.doesNotMatch(
  store,
  /count\(\*\) filter[\s\S]*?'ready'[\s\S]*?\)::integer as active/,
);
assert.match(store, /count\(\*\) filter \(where run\.status in/);
assert.doesNotMatch(store, /count\(\*\) filter \(where status in/);
assert.match(store, /isDarkOnlyTokenSet/);
assert.match(store, /normalizeDarkOnlyTokenEntries/);

const {
  isDarkOnlyTokenSet,
  normalizeTokenEntries,
  normalizeDarkOnlyTokenEntries,
  resolveRequiredTokenAliases,
  validateTokenValue,
} = require("../api/_design-token-store");
assert.equal(isDarkOnlyTokenSet({ setKey: "ggpoker-web", name: "GGPoker Web" }), true);
assert.equal(isDarkOnlyTokenSet({ setKey: "generic", name: "Generic" }), false);
assert.deepEqual(normalizeDarkOnlyTokenEntries([{
  tokenKey: "--app-space-4",
  value: "12px",
  valueLight: "16px",
  valueDark: "",
  activeTheme: "light",
}])[0], {
  tokenKey: "--app-space-4",
  value: "16px",
  valueLight: "",
  valueDark: "16px",
  activeTheme: "dark",
});
const tokenDefinition = (tokenKey, required, valueType, cssProperty) => ({
  token_key: tokenKey,
  required,
  value_type: valueType,
  css_property: cssProperty,
  css_properties: [cssProperty],
});
const aliasCases = [
  ["--promo-surface", "--app-surface", "#111111", "color", "background-color"],
  ["--promo-text", "--app-ink", "#eeeeee", "color", "color"],
  ["--promo-muted", "--app-muted", "#999999", "color", "color"],
  ["--promo-accent", "--app-accent", "#123456", "color", "background-color"],
  ["--promo-radius", "--app-radius", "18px", "length", "border-radius"],
  ["--promo-shadow", "--app-shadow", "0 4px 18px #00000033", "shadow", "box-shadow"],
];
const aliasDefinitions = [
  tokenDefinition("--promo-title-size", true, "length", "font-size"),
  ...aliasCases.flatMap(([requiredKey, aliasKey, , valueType, cssProperty]) => [
    tokenDefinition(requiredKey, true, valueType, cssProperty),
    tokenDefinition(aliasKey, false, valueType, cssProperty),
  ]),
];
const aliasEntries = [
  { tokenKey: "--promo-title-size", value: "48px" },
  ...aliasCases.map(([, aliasKey, value]) => ({ tokenKey: aliasKey, value, valueDark: value })),
];
const resolvedAliases = resolveRequiredTokenAliases(aliasEntries, aliasDefinitions);
aliasCases.forEach(([requiredKey, aliasKey, value]) => {
  const resolved = resolvedAliases.find((entry) => entry.tokenKey === requiredKey);
  assert.equal(resolved?.value, value);
  assert.equal(resolved?.metadata.canonicalAliasSource, aliasKey);
});
const normalizedAliases = normalizeTokenEntries(aliasEntries, aliasDefinitions);
assert.deepEqual(normalizedAliases.errors, []);
assert.equal(normalizedAliases.normalized.filter((entry) => entry.metadata.canonicalAliasSource).length, 6);
const missingAlias = normalizeTokenEntries([
  { tokenKey: "--promo-title-size", value: "48px" },
], aliasDefinitions);
aliasCases.forEach(([requiredKey]) => {
  assert.equal(
    missingAlias.errors.some((error) => error.tokenKey === requiredKey && error.message === "required token is missing"),
    true,
  );
});
const explicitCanonical = normalizeTokenEntries([
  ...aliasEntries,
  { tokenKey: "--promo-accent", value: "#abcdef" },
], aliasDefinitions);
assert.equal(explicitCanonical.normalized.find((entry) => entry.tokenKey === "--promo-accent")?.value, "#abcdef");
assert.equal(explicitCanonical.normalized.filter((entry) => entry.tokenKey === "--promo-accent").length, 1);

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

const lifecycleMigration = read("db/migrations/045_design_token_set_lifecycle_and_ggpoker_dark.sql");
assert.match(lifecycleMigration, /status in \('active', 'inactive', 'archived'\)/);
assert.match(lifecycleMigration, /value_dark = coalesce/);
assert.match(lifecycleMigration, /value_light = ''/);
assert.match(lifecycleMigration, /active_theme = 'dark'/);
assert.match(lifecycleMigration, /lower\(token_set\.set_key\) like '%ggpoker%'/);

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
  ["--promo-font-size-body", "1rem"],
  ["--promo-font-size-caption", "0.875rem"],
  ["--promo-font-size-micro", "0.625rem"],
].forEach(([tokenKey, value]) => {
  assert.match(tokenCatalog, new RegExp(`${tokenKey}[^\\n]*font-size,${value},${value}`));
});
[
  "--promo-font-size-main-title",
  "--promo-font-size-lead-title",
  "--promo-font-size-subtitle",
  "--promo-font-size-eyebrow",
  "--promo-font-size-button",
].forEach((tokenKey) => {
  assert.match(tokenCatalog, new RegExp(`${tokenKey}[^\\n]*font-size,"clamp\\(`));
});
const promoTypographyMigration = read("db/migrations/041_promo_typography_size_tokens.sql");
assert.match(promoTypographyMigration, /--promo-font-size-main-title/);
assert.match(promoTypographyMigration, /--promo-font-size-lead-title/);
assert.match(promoTypographyMigration, /--promo-font-size-subtitle/);
const typographyModernizationMigration = read("db/migrations/064_typography_role_scale_modernization.sql");
assert.match(typographyModernizationMigration, /--promo-font-size-eyebrow/);
assert.match(typographyModernizationMigration, /--promo-font-size-body/);
assert.match(typographyModernizationMigration, /clamp\(2\.5rem, calc\(2rem \+ 3vw\), 4\.25rem\)/);

[
  "api/design-token-set-metadata.js",
  "api/design-token-set-draft.js",
  "api/design-token-set-version.js",
  "api/design-token-set-validate.js",
  "api/design-token-set-usage.js",
  "api/design-token-set-archive.js",
  "api/design-token-set-status.js",
  "api/design-token-set-clone.js",
].forEach((file) => {
  assert.equal(fs.existsSync(path.join(root, file)), true, `${file} must exist`);
  assert.match(read(file), /Method not allowed/);
});
const archiveApi = read("api/design-token-set-archive.js");
assert.match(read("api/design-token-set-delete.js"), /design-token-set-archive/);
assert.match(archiveApi, /if \(usage\.templates\.length\)/);
assert.doesNotMatch(archiveApi, /usage\.templates\.length \|\| usage\.aiRuns\.active/);
assert.match(archiveApi, /preservedUsage: usage/);

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
assert.match(component, /usage: \{ templates: \[\], aiRuns:/);
assert.match(component, /histories/);
assert.match(component, /design-token-table/);
assert.match(component, /design-token-actual-preview/);
assert.match(component, /tokenVisualStyle/);
assert.match(component, /isFixedFontSize/);
assert.match(component, /convertFontSize/);
assert.match(component, /유동형 clamp/);
assert.match(component, /\+ 토큰 추가/);
assert.match(component, /pendingDefinitions/);
assert.match(component, /mergeRequiredTokenDefinitions/);
assert.match(component, /canonicalAliasSource/);
assert.match(service, /registerDefinitions/);
assert.match(service, /\/api\/design-token-catalog-import/);
assert.match(component, /type="file"/);
assert.match(component, /exportCsv/);
assert.doesNotMatch(component, /saveAndApply/);
assert.doesNotMatch(component, /selectedTemplateIds/);
assert.match(component, /beforeunload/);
assert.match(service, /\/api\/design-token-set-clone/);
assert.doesNotMatch(service, /\/api\/wizard-form-template/);
assert.match(service, /\/api\/design-token-set-publish/);
assert.match(service, /\/api\/design-token-set-status/);
assert.match(service, /\/api\/design-token-set-delete/);
assert.match(component, /updateSetStatus\('deactivate'\)/);
assert.match(component, /selectedSet\.status === 'inactive'/);
assert.doesNotMatch(component, /:disabled="saving \|\| usage\.templates\.length \|\| usage\.aiRuns\.active"/);
assert.match(component, /isDarkOnlySet/);
assert.match(component, /v-if="!isDarkOnlySet">Light/);
assert.doesNotMatch(read("api/design-token-sets.js"), /wizard_form_templates/);
assert.match(read("prototype/create-promo.js"), /designTokens: wizardDesignTokens/);
assert.match(read("visual-editor/src/PromoPageRenderer.vue"), /managedTokenStyle/);
assert.doesNotMatch(read("api/wizard-form-template-layout.js"), /designTokens:/);
assert.match(read("visual-editor/src/promo-renderer.css"), /rendered-text--title/);
assert.equal(ko["admin.designToken.title"], "디자인 토큰 관리");
assert.equal(typeof en["admin.designToken.title"], "string");
assert.equal(ko["admin.designToken.setDeactivated"], "디자인 토큰 세트를 비활성화했습니다.");
assert.equal(typeof en["admin.designToken.deleteConfirm"], "string");
assert.equal(validateTokenValue({ value_type: "length" }, "clamp(1rem, calc(0.5rem + 1vw), 2rem)"), "");

console.log("admin design token management contract passed");
