const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/054_repair_item_component_seed_identity_unique_index.sql"),
  "utf8",
);
const seed = fs.readFileSync(
  path.resolve(__dirname, "../db/seeds/004_seed_item_components_design_tokens_and_default_template.sql"),
  "utf8",
);

assert.match(migration, /group by system_seed_code\s+having count\(\*\) > 1/);
assert.match(migration, /errcode = '23505'/);
assert.match(migration, /create unique index if not exists\s+wizard_item_components_system_seed_code_seed_uidx/);
assert.match(migration, /on public\.wizard_item_components \(system_seed_code\)/);
assert.match(seed, /on conflict \(system_seed_code\) do update/);

console.log("Item component seed identity migration contract passed");
