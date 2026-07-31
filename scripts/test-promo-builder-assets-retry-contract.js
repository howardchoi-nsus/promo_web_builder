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
      { assetRequestId: "ready-1", status: "ready" },
    ],
  },
};

assert.deepEqual(
  selectRetryAssetRequests(snapshot).assets.requests.map((request) => request.assetRequestId),
  ["pending-1", "failed-1"],
);
assert.deepEqual(selectRetryAssetRequests(snapshot, ["failed-1"]).assets.requests, [
  { assetRequestId: "failed-1", status: "pending" },
]);
assert.deepEqual(selectRetryAssetRequests(snapshot, ["ready-1"]).assets.requests, []);
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
assert.match(builder, /if \(!store\.warning\) openVisualEditor\(\)/);
assert.match(builder, /이미지 생성 다시 시도/);
assert.match(editor, /if \(result\.assetWarning\)/);
assert.match(editor, /AI 이미지 생성 작업을 시작하지 못했습니다/);

console.log("Promo Builder asset retry contract tests passed");
