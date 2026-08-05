const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const v2Sql = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/044_ai_promo_builder_composition_engine.sql"),
  "utf8",
);
const v3Sql = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/049_registry_composition_v3_foundation.sql"),
  "utf8",
);
const operationV3Sql = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/053_builder_operations_contract_v3.sql"),
  "utf8",
);
const storeSource = fs.readFileSync(
  path.resolve(__dirname, "../api/_promo-builder-document-store.js"),
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
].forEach((needle) => assert.match(v2Sql, new RegExp(needle)));

assert.match(v2Sql, /where status in \('queued', 'processing'\)/);
assert.match(v2Sql, /composition_scope/);
assert.match(v2Sql, /section_role/);
assert.match(v2Sql, /composition_policy/);
assert.match(v2Sql, /create_promo_builder_composition_proposal[\s\S]*?\n\s*2, p_request_snapshot/);
assert.match(v2Sql, /apply_promo_builder_composition_proposal[\s\S]*?v_revision, 2,/);

[
  "promo_composition_shells",
  "promo_composition_shell_versions",
  "shell_version_id",
  "policy_fingerprint",
  "resource_fingerprint",
  "create_promo_builder_composition_proposal_v3",
  "apply_promo_builder_composition_proposal_v3",
].forEach((needle) => assert.match(v3Sql, new RegExp(needle)));

assert.match(v3Sql, /stage in \('planning', 'validating', 'repairing', 'applying'\)/);
assert.match(v3Sql, /contract_version <> 3 or/);
assert.match(v3Sql, /v_document\.mode <> 'ai'/);
assert.match(v3Sql, /shell_version\.status = 'active'/);
assert.match(v3Sql, /shell\.status = 'active'/);
assert.match(v3Sql, /jsonb_typeof\(p_request_snapshot\) <> 'object'/);
assert.match(v3Sql, /Composition proposal idempotency conflict/);
assert.match(v3Sql, /v_proposal\.overview_fingerprint <> p_overview_fingerprint/);
assert.match(v3Sql, /v_proposal\.candidate_fingerprint <> p_candidate_fingerprint/);
assert.match(v3Sql, /v_proposal\.policy_fingerprint <> p_policy_fingerprint/);
assert.match(v3Sql, /v_proposal\.resource_fingerprint <> p_resource_fingerprint/);
assert.match(v3Sql, /v_proposal\.shell_version_id is distinct from p_shell_version_id/);
assert.match(v3Sql, /v_revision, 3,/);

assert.match(operationV3Sql, /create or replace function apply_promo_builder_operations/);
assert.match(operationV3Sql, /p_snapshot_json->>'contractVersion'/);
assert.match(operationV3Sql, /v_contract_version not in \(2, 3\)/);
assert.match(operationV3Sql, /v_revision, v_contract_version/);
assert.match(operationV3Sql, /current_document_revision <> p_base_document_revision/);

assert.match(storeSource, /Number\(input\.contractVersion \|\| 2\) === 3/);
assert.match(storeSource, /create_promo_builder_composition_proposal_v3/);
assert.match(storeSource, /create_promo_builder_composition_proposal\(/);
assert.match(storeSource, /Number\(contractVersion\) === 3/);
assert.match(storeSource, /apply_promo_builder_composition_proposal_v3/);
assert.match(storeSource, /apply_promo_builder_composition_proposal\(/);
assert.match(storeSource, /contractVersion: Number\(row\.contract_version \|\| 2\)/);
assert.match(storeSource, /stage: row\.stage \|\| null/);
assert.match(storeSource, /stage = case when contract_version = 3 then 'planning' else null end/);

console.log("Promo Builder v2/v3 migration contract test passed");
