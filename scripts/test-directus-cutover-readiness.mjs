import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { evaluateCutoverReadiness } = require("../api/_directus-cutover-readiness.js");
const ready = evaluateCutoverReadiness({
  activeConfigId: "config-1",
  connectionCheckStatus: "passed",
  migrationBatchStatus: "passed",
  schemaVersion: "promo-reference-v1",
  batchSchemaVersion: "promo-reference-v1",
  blockingDiffCount: 0,
  fallbackVerified: true,
  cacheVerified: true,
  approvedBy: "infra@example.com",
});
assert.equal(ready.ready, true);
assert.equal(evaluateCutoverReadiness({ ...ready, blockingDiffCount: 1 }).ready, false);
const empty = evaluateCutoverReadiness({});
assert.equal(empty.ready, false);
assert.equal(empty.gates.find((gate) => gate.key === "active_config").passed, false);

console.log("Directus cutover readiness gate tests passed.");
