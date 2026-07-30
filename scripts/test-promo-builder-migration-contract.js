const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const sql = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/044_ai_promo_builder_composition_engine.sql"),
  "utf8",
);

[
  "promo_builder_documents",
  "promo_builder_composition_proposals",
  "promo_builder_document_versions",
  "promo_builder_document_operations",
  "promo_motion_presets",
  "current_document_revision",
  "base_document_revision",
  "builder_document_id",
  "create_promo_builder_composition_proposal",
  "apply_promo_builder_composition_proposal",
  "create_promo_builder_document_revision",
].forEach((needle) => assert.match(sql, new RegExp(needle)));

assert.match(sql, /where status in \('queued', 'processing'\)/);
assert.match(sql, /composition_scope/);
assert.match(sql, /section_role/);
assert.match(sql, /composition_policy/);

console.log("Promo Builder migration contract test passed");
