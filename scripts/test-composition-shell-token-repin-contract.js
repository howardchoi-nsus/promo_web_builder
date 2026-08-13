const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const migration = fs.readFileSync(path.resolve(
  __dirname,
  "../db/migrations/057_repin_composition_shell_design_tokens.sql",
), "utf8");
const compiler = fs.readFileSync(path.resolve(
  __dirname,
  "../api/_promo-registry-composition-compiler.js",
), "utf8");

assert.match(migration, /repin_active_composition_shells_to_design_token_version/);
assert.match(migration, /promo_design_token_version_repin_shells_trg/);
assert.match(migration, /allowedTokenSetVersionIds/);
assert.match(migration, /defaultTokenSetVersionId/);
assert.match(migration, /Cannot re-pin Composition Shell while a draft version exists/);
assert.match(migration, /status = 'inactive'/);
assert.match(migration, /status = 'active'/);
assert.match(compiler, /spec\.designTokenSetVersionId && !tokenSet/);

console.log("Composition Shell Design Token re-pin contract test passed");
