const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(path.resolve(
  __dirname,
  "../db/migrations/063_registry_hero_layout_candidate_sync.sql",
), "utf8");

assert.match(migration, /^begin;/);
assert.match(migration, /commit;\s*$/);
assert.match(migration, /section\.section_key = 'registryHero'/);
assert.match(migration, /section\.status = 'active'/);
assert.doesNotMatch(migration, /section\.version\s*=\s*1/);
assert.match(migration, /'hero_left_balanced'/);
assert.match(migration, /'hero_center_wide'/);
assert.match(migration, /'hero_right_balanced'/);
assert.match(migration, /on conflict \(section_id, layout_key\) do update/);
assert.match(migration, /layout_snapshot = coalesce\(existing\.layout_snapshot, excluded\.layout_snapshot\)/);
assert.match(migration, /selection_metadata = excluded\.selection_metadata \|\| coalesce/);
assert.match(migration, /\{allowedLayoutVariants\}/);
assert.match(migration, /"mobileStrategy":"media-after-copy"/);

console.log("Registry Hero layout candidate synchronization migration test passed.");
