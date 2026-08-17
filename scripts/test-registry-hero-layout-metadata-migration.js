const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(path.resolve(
  __dirname,
  "../db/migrations/061_registry_hero_layout_selection_metadata.sql",
), "utf8");

assert.match(migration, /section\.section_key = 'registryHero'/);
assert.match(migration, /section\.status = 'active'/);
assert.match(migration, /'hero_centered' then 'hero_compact'/);
assert.match(migration, /normalized_name in \('heroright', 'herorightbalanced'\)/);
assert.match(migration, /normalized_name in \('herocenter', 'herocenterwide'\)/);
assert.match(migration, /"widthProfile":"compact"/);
assert.match(migration, /"widthProfile":"balanced"/);
assert.match(migration, /"widthProfile":"full"/);
assert.match(migration, /"contentRegion":"center-left"/);
assert.match(migration, /"contentRegion":"center-right"/);
assert.match(migration, /"contentRegion":"center"/);
assert.match(migration, /"purposeTags":\["hero","short-copy","offer","background-image"\]/);
assert.match(migration, /defaults\.selection_metadata \|\| coalesce\(layout\.selection_metadata/);
assert.match(migration, /choose this preset/i);
assert.match(migration, /Migration 061: Registry Hero Layout JSON selection description enriched\./);

console.log("Registry Hero Layout metadata migration contract passed.");
