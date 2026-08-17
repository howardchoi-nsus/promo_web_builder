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

console.log("AI Builder asset readiness tests passed.");
