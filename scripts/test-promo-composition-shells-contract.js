const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { normalizeConfig, toShellVersion } = require("../api/_promo-composition-shells-store");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/050_registry_scope_and_composition_shell_management.sql"),
  "utf8",
);
const apiSource = fs.readFileSync(
  path.resolve(__dirname, "../api/promo-composition-shells.js"),
  "utf8",
);
const sectionStoreSource = fs.readFileSync(
  path.resolve(__dirname, "../api/_wizard-content-sections-store.js"),
  "utf8",
);
const sectionApiSource = fs.readFileSync(
  path.resolve(__dirname, "../api/wizard-content-section.js"),
  "utf8",
);

assert.match(migration, /composition_scope in \('shared', 'template', 'registry'\)/);
assert.match(migration, /composition_scope <> 'registry' or owner_form_template_id is null/);
assert.match(migration, /create_promo_composition_shell/);
assert.match(migration, /clone_promo_composition_shell_version/);
assert.match(migration, /activate_promo_composition_shell_version/);
assert.match(migration, /template\.status = 'active'/);
assert.match(migration, /set status = 'inactive'/);
assert.match(apiSource, /req\.method === "GET"/);
assert.match(apiSource, /req\.method === "POST"/);
assert.match(apiSource, /req\.method === "PATCH"/);
assert.match(apiSource, /body\.action === "activate"/);
assert.match(sectionStoreSource, /\["shared", "registry"\]\.includes\(row\.composition_scope\)/);
assert.match(sectionStoreSource, /composition_scope <> 'registry'/);
assert.match(sectionApiSource, /\["shared", "registry"\]\.includes\(body\.compositionScope\)/);

assert.deepEqual(normalizeConfig(null), {});
assert.deepEqual(normalizeConfig([]), {});
assert.deepEqual(normalizeConfig({ requiredSectionRoles: ["header"] }), {
  requiredSectionRoles: ["header"],
});

assert.deepEqual(toShellVersion({
  id: "version-1",
  shell_id: "shell-1",
  shell_key: "promo-default-shell",
  shell_name: "Default Shell",
  shell_status: "active",
  version: "2",
  status: "active",
  config_json: { requiredSectionRoles: ["header", "footer"] },
  fallback_template_id: null,
  fallback_template_version: null,
}), {
  id: "version-1",
  shellId: "shell-1",
  shellKey: "promo-default-shell",
  shellName: "Default Shell",
  shellStatus: "active",
  version: 2,
  status: "active",
  config: { requiredSectionRoles: ["header", "footer"] },
  fallbackTemplateId: null,
  fallbackTemplateVersion: null,
  changeNote: "",
  createdAt: null,
  updatedAt: null,
});

console.log("Promo composition shell and Registry scope contract tests passed");
