import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(new URL("../db/migrations/080_reference_pattern_component_drafts.sql", import.meta.url), "utf8");
const seedCodes = [
  "ref-pattern-offer-value-breakdown",
  "ref-pattern-promotion-steps",
  "ref-pattern-trust-proof-grid",
  "ref-pattern-metric-strip",
  "ref-pattern-feature-split",
  "ref-pattern-faq-accordion",
];

for (const seedCode of seedCodes) {
  assert.match(migration, new RegExp(seedCode, "g"), `${seedCode} must be present`);
}
assert.equal(new Set(seedCodes).size, 6);
assert.match(migration, /select component\.id, 1, 'draft'/, "Reference components must start as Drafts");
assert.doesNotMatch(migration, /select component\.id, 1, 'active'/, "Migration must not activate reference drafts");
assert.match(migration, /on conflict \(system_seed_code\) do update/, "Component seeding must be idempotent");
assert.match(migration, /on conflict \(component_version_id, field_key\) do nothing/, "Field seeding must be idempotent");
assert.match(migration, /RenderSpec before activation/g, "Draft review gate must be documented in persisted metadata");

const fieldKeys = [...migration.matchAll(/'(?<key>fld_[a-f0-9]{32})'/g)].map((match) => match.groups.key);
assert.equal(fieldKeys.length, 23, "The six patterns must define exactly 23 typed fields");
assert.equal(new Set(fieldKeys).size, fieldKeys.length, "All field keys must be immutable and unique");

const store = readFileSync(new URL("../api/_item-components-store.js", import.meta.url), "utf8");
for (const role of ["responsible-gaming", "offer", "trust"]) {
  assert.match(store, new RegExp(`"${role}"`), `API placement validation must support ${role}`);
}

console.log("Reference pattern component Draft migration contract tests passed.");
