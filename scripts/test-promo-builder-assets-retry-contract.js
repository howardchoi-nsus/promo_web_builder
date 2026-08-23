const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  selectRetryAssetRequests,
} = require("../api/promo-builder-assets-retry");

const snapshot = {
  assets: {
    contractVersion: 1,
    items: {},
    requests: [
      { assetRequestId: "pending-1", status: "pending" },
      { assetRequestId: "failed-1", status: "failed" },
      {
        assetRequestId: "billing-1",
        status: "failed",
        errorCode: "PROVIDER_BILLING_REQUIRED",
        errorMessage: "AI 모델 사용 크레딧이 소진되었습니다.",
      },
      {
        assetRequestId: "legacy-billing-1",
        status: "failed",
        errorCode: "too_many_requests",
        errorMessage: "Your prepayment credits are depleted.",
      },
      { assetRequestId: "ready-1", status: "ready" },
    ],
  },
};

assert.deepEqual(
  selectRetryAssetRequests(snapshot).assets.requests.map((request) => request.assetRequestId),
  ["pending-1", "failed-1", "billing-1", "legacy-billing-1"],
);
assert.deepEqual(selectRetryAssetRequests(snapshot, ["failed-1"]).assets.requests, [
  { assetRequestId: "failed-1", status: "pending" },
]);
assert.deepEqual(selectRetryAssetRequests(snapshot, ["ready-1"]).assets.requests, []);
assert.deepEqual(selectRetryAssetRequests(snapshot, ["billing-1"]).assets.requests, [{
  assetRequestId: "billing-1",
  status: "pending",
  errorCode: "PROVIDER_BILLING_REQUIRED",
  errorMessage: "AI 모델 사용 크레딧이 소진되었습니다.",
}]);
assert.equal(selectRetryAssetRequests(snapshot, ["legacy-billing-1"]).assets.requests[0].status, "pending");
assert.equal(snapshot.assets.requests[1].status, "failed");

const root = path.resolve(__dirname, "..");
const client = fs.readFileSync(
  path.join(root, "visual-editor/src/builder/services/composition-client.mjs"),
  "utf8",
);
const builder = fs.readFileSync(
  path.join(root, "visual-editor/src/builder/AiBuilderApp.vue"),
  "utf8",
);
const editor = fs.readFileSync(path.join(root, "visual-editor/src/App.vue"), "utf8");

assert.match(client, /\/api\/promo-builder-assets-retry/);
assert.match(builder, /waitForBuilderAssets/);
assert.match(builder, /ASSET_GENERATION_TIMEOUT/);
assert.match(builder, /if \(!blockingAssetWarning && await waitForBuilderAssets\(\)\) \{[\s\S]*?store\.stage = "navigating_preview";[\s\S]*?openVisualEditor\(\);/);
assert.match(builder, /clearBuilderError\(store\);[\s\S]*?retryBuilderAssets/);
assert.match(builder, /이미지 생성 다시 시도/);
assert.match(builder, /PROVIDER_BILLING_REQUIRED/);
assert.match(builder, /실패 이미지 \$\{billingFailures\.length\}개/);
assert.doesNotMatch(builder, /이미지 없이 편집 계속/);
assert.match(builder, /"PROVIDER_BILLING_REQUIRED",[\s\S]*?\.includes\(store\.error\?\.code\)/);
assert.match(editor, /if \(result\.assetWarning\)/);
assert.match(editor, /AI 이미지 생성 작업을 시작하지 못했습니다/);

console.log("Promo Builder asset retry contract tests passed");
