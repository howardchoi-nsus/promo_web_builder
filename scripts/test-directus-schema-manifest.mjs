import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../directus/schema/promo-reference-v1.json", import.meta.url), "utf8"));
assert.deepEqual(manifest.selectedDomains, ["components", "designTokens"]);
assert.equal(manifest.sourceOfTruth, "postgresql");
assert.equal(manifest.directusMode, "read-only-mirror");
const collections = new Set(manifest.collections.map((collection) => collection.collection));
for (const required of [
  "promo_components", "promo_component_versions", "promo_design_token_definitions",
  "promo_design_token_sets", "promo_design_token_versions", "promo_design_token_values",
]) assert.equal(collections.has(required), true, `${required} mapping is required`);
for (const collection of manifest.collections) {
  assert.ok(collection.primaryKey);
  assert.ok(collection.fields.length > 0);
  assert.deepEqual(collection.migrationFields, ["migration_batch_id", "content_hash"]);
}
assert.equal(manifest.deletePolicy.components.includes("source-missing"), true);

console.log("Directus Component and Design Token schema manifest tests passed.");
