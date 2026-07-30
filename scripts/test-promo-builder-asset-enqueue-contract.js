const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  SECTION_DESIGN_ASSET_REQUEST_MODE,
  enqueueAndScheduleBuilderAssetJobs,
} = require("../api/_promo-builder-assets");

assert.equal(SECTION_DESIGN_ASSET_REQUEST_MODE, "assets");

const source = fs.readFileSync(
  path.resolve(__dirname, "../api/_promo-builder-assets.js"),
  "utf8",
);
assert.doesNotMatch(source, /image-only/);

(async () => {
  let scheduled = false;
  const success = await enqueueAndScheduleBuilderAssetJobs(null, {
    documentId: "document-success",
    documentRevision: 1,
  }, {
    enqueue: async () => [{ id: "job-1" }],
    schedule: (jobs) => { scheduled = jobs.length === 1; },
    reportError: () => {},
  });
  assert.equal(scheduled, true);
  assert.deepEqual(success, {
    assetJobs: [{ id: "job-1" }],
    assetWarning: null,
  });

  const failed = await enqueueAndScheduleBuilderAssetJobs(null, {
    documentId: "document-failed",
    documentRevision: 2,
  }, {
    enqueue: async () => {
      throw Object.assign(new Error("request mode constraint"), { code: "23514" });
    },
    schedule: () => {
      throw new Error("schedule must not run after enqueue failure");
    },
    reportError: () => {},
  });
  assert.equal(failed.assetJobs.length, 0);
  assert.equal(failed.assetWarning.code, "ASSET_ENQUEUE_FAILED");
  assert.equal(failed.assetWarning.detailCode, "23514");
  console.log("Promo Builder asset enqueue contract tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
