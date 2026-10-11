import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migration = await readFile(new URL("../db/migrations/071_directus_migration_control_plane.sql", import.meta.url), "utf8");
assert.match(migration, /validated_by text/);
assert.match(migration, /activated_by = p_actor_subject/);
assert.match(migration, /promo_directus_migration_batches/);
assert.match(migration, /source_environment = target_environment/);
assert.match(migration, /promo_directus_migration_journal/);
assert.match(migration, /promo_directus_shadow_diffs/);
assert.match(migration, /promo_directus_cutover_snapshots/);
assert.match(migration, /where status = 'active'/);

console.log("Directus migration control-plane schema tests passed.");
