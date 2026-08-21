import assert from "node:assert/strict";
import { evaluateAssetReadiness } from "../visual-editor/src/shared/composition/asset-readiness.mjs";

assert.deepEqual(evaluateAssetReadiness([]), {
  state: "ready",
  total: 0,
  ready: 0,
  active: 0,
  failed: 0,
  failedRequests: [],
});

assert.equal(evaluateAssetReadiness([
  { assetRequestId: "a", status: "pending" },
  { assetRequestId: "b", status: "ready" },
]).state, "waiting");
assert.equal(evaluateAssetReadiness([
  { assetRequestId: "a", status: "queued" },
  { assetRequestId: "b", status: "processing" },
]).active, 2);
assert.equal(evaluateAssetReadiness([
  { assetRequestId: "a", status: "ready" },
  { assetRequestId: "b", status: "ready" },
]).state, "ready");

const failed = evaluateAssetReadiness([
  { assetRequestId: "hero", status: "failed", errorCode: "IMAGE_PROVIDER_FAILED" },
  { assetRequestId: "card", status: "ready" },
]);
assert.equal(failed.state, "failed");
assert.equal(failed.failed, 1);
assert.equal(failed.failedRequests[0].assetRequestId, "hero");

const missingCoverage = evaluateAssetReadiness([
  { assetRequestId: "card-1", targetType: "component-field-image", status: "ready" },
], [
  { assetRequestId: "card-1", targetType: "component-field-image", required: true },
  { assetRequestId: "card-2", targetType: "component-field-image", required: true },
]);
assert.equal(missingCoverage.state, "failed");
assert.equal(missingCoverage.coverage, 0.5);
assert.equal(missingCoverage.failedRequests[0].errorCode, "ASSET_REQUEST_COVERAGE_MISMATCH");

const completeCoverage = evaluateAssetReadiness([
  { assetRequestId: "card-1", status: "ready" },
  { assetRequestId: "card-2", status: "ready" },
], [
  { assetRequestId: "card-1", required: true },
  { assetRequestId: "card-2", required: true },
]);
assert.equal(completeCoverage.state, "ready");
assert.equal(completeCoverage.coverage, 1);

console.log("AI Builder asset readiness tests passed.");
