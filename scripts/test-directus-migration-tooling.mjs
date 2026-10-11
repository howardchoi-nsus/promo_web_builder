import assert from "node:assert/strict";
import {
  buildInventory, buildRollbackPlan, createBatchMetadata, planMigration, reconcileSnapshots,
} from "../packages/directus-migration/src/index.mjs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { readDomain, sourcePolicy } = require("../api/_directus-domain-source-router.js");
const source = { domains: {
  components: [{ id: "component-a", revision: 2, data: { name: "Hero" } }],
  designTokens: [{ id: "token-a", revision: 1, data: { value: "#fff" } }],
} };
const target = { domains: {
  components: [
    { id: "component-a", revision: 1, data: { name: "Old Hero" } },
    { id: "component-deleted", revision: 1, data: { name: "Deleted" } },
  ],
  designTokens: [{ id: "token-a", revision: 1, data: { value: "#fff" } }],
} };

assert.equal(buildInventory(source).components.count, 1);
const plan = planMigration(source, target);
assert.equal(plan.components.upserts[0].action, "update");
assert.equal(plan.components.deletions[0].id, "component-deleted");
assert.equal(plan.designTokens.skips.length, 1);
assert.equal(reconcileSnapshots(source, target).components.ok, false);
assert.equal(buildRollbackPlan(plan, "batch-1").steps.some((step) => step.action === "restore_before"), true);
assert.throws(() => createBatchMetadata({
  sourceCommit: "abc", sourceEnvironment: "preview", targetEnvironment: "production", schemaVersion: "v1",
}), (error) => error.code === "DIRECTUS_MIGRATION_ENVIRONMENT_MISMATCH");

assert.equal(sourcePolicy("components", {
  DIRECTUS_INTEGRATION_ENABLED: "true", DIRECTUS_RUNTIME_READ_ENABLED: "true", DIRECTUS_RUNTIME_READ_DOMAINS: "components",
}).primary, "directus");
const routed = await readDomain({
  domain: "components",
  query: { id: "component-a" },
  internalAdapter: { find: async () => "internal" },
  directusAdapter: { find: async () => { throw Object.assign(new Error("down"), { code: "DIRECTUS_DOWN" }); } },
  env: { DIRECTUS_INTEGRATION_ENABLED: "true", DIRECTUS_RUNTIME_READ_ENABLED: "true", DIRECTUS_RUNTIME_READ_DOMAINS: "components" },
});
assert.equal(routed.value, "internal");
assert.equal(routed.fallback, true);

console.log("Directus migration, reconciliation, rollback, and source router tests passed.");
