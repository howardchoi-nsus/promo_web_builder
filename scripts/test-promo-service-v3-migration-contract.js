const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(path.join(
  __dirname,
  "../db/migrations/070_promo_service_contract_v3_foundation.sql",
), "utf8");

for (const schema of ["user_service", "llm_runtime", "cms", "web_output"]) {
  assert.match(migration, new RegExp(`create schema if not exists ${schema}`));
}
assert.match(migration, /create table if not exists user_service\.promo_requests/);
assert.match(migration, /create table if not exists llm_runtime\.generation_jobs/);
assert.match(migration, /create table if not exists user_service\.promo_request_feedback/);
assert.match(migration, /create table if not exists cms\.promotion_approvals/);
assert.match(migration, /create table if not exists web_output\.publication_snapshots/);
assert.match(migration, /event_version integer not null default 3 check \(event_version = 3\)/);
assert.match(migration, /unique \(owner_subject, idempotency_key\)/);
assert.match(migration, /unique \(request_id, idempotency_key\)/);

console.log("Promo service V3 migration contract passed");
