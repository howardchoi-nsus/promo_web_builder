const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const finalImageModule = require("../api/promo-generation-final-design-image");
const draftImageModule = require("../api/promo-generation-lofi-draft-image");
const {
  draftSummary,
  finalDesignSummary,
  isSupportedBlobLocation,
} = require("../api/_promo-generation-run-store");

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    send(body) { this.body = body; return this; },
  };
}

function sqlReturning(rows) {
  return async () => rows;
}

function pngBytes() {
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  ]);
}

async function execute(handler, query) {
  const res = responseRecorder();
  await handler({ method: "GET", query }, res);
  return res;
}

async function verifyFinalDesignImage() {
  const privateUrl = "https://store.private.blob.vercel-storage.com/final.png";
  let requestedLocation = "";
  let requestedOptions = null;
  const handler = finalImageModule.createHandler({
    getSql: () => sqlReturning([{
      id: "final-id",
      run_id: "run-id",
      final_image_url: privateUrl,
    }]),
    getPrivateBlob: async (location, options) => {
      requestedLocation = location;
      requestedOptions = options;
      return {
        statusCode: 200,
        stream: new Blob([pngBytes()]).stream(),
      };
    },
  });

  let res = await execute(handler, { finalDesignId: "final-id" });
  assert.equal(res.statusCode, 200);
  assert.equal(requestedLocation, privateUrl);
  assert.equal(requestedOptions.access, "private");
  assert.equal(res.headers["Content-Type"], "image/png");
  assert.deepEqual(res.body, pngBytes());

  res = await execute(finalImageModule.createHandler({
    getSql: () => sqlReturning([{
      id: "final-id",
      run_id: "run-id",
      final_image_url: privateUrl,
    }]),
    getPrivateBlob: async () => ({ statusCode: 403, stream: null }),
  }), { finalDesignId: "final-id" });
  assert.equal(res.statusCode, 502);
  assert.equal(res.body, "Failed to read final design image");
  assert.equal(String(res.body).includes(privateUrl), false);

  let externalFetchAttempted = false;
  res = await execute(finalImageModule.createHandler({
    getSql: () => sqlReturning([{
      id: "legacy-fixture-id",
      run_id: "run-id",
      final_image_url: "https://example.com/test-final-design.png",
    }]),
    getPrivateBlob: async () => {
      externalFetchAttempted = true;
      return null;
    },
  }), { finalDesignId: "legacy-fixture-id" });
  assert.equal(res.statusCode, 422);
  assert.equal(res.body, "Unsupported final design image location");
  assert.equal(externalFetchAttempted, false);
  assert.equal(isSupportedBlobLocation(privateUrl), true);
  assert.equal(isSupportedBlobLocation("promo-generation/final-designs/final-id/image.png"), true);
  assert.equal(isSupportedBlobLocation("https://example.com/test-final-design.png"), false);
  assert.equal(isSupportedBlobLocation("data:image/png;base64,AAAA"), false);
  assert.equal(isSupportedBlobLocation("javascript:alert(1)"), false);
  assert.equal(isSupportedBlobLocation("//example.com/test-final-design.png"), false);
  assert.equal(isSupportedBlobLocation("promo-generation/../private/image.png"), false);
  assert.equal(isSupportedBlobLocation("promo-generation/%2e%2e/private/image.png"), false);
  assert.equal(isSupportedBlobLocation("promo-generation\\final-designs\\image.png"), false);
  assert.equal(finalDesignSummary({
    id: "legacy-fixture-id",
    run_id: "run-id",
    status: "ready",
    final_image_url: "https://example.com/test-final-design.png",
  }).imageProxyAvailable, false);
}

async function verifyLofiDraftImage() {
  const privateUrl = "https://store.private.blob.vercel-storage.com/draft.png";
  let requestedLocation = "";
  let requestedOptions = null;
  const handler = draftImageModule.createHandler({
    getSql: () => sqlReturning([{
      id: "draft-id",
      run_id: "run-id",
      draft_attempt: 2,
      draft_image_url: privateUrl,
    }]),
    getPrivateBlob: async (location, options) => {
      requestedLocation = location;
      requestedOptions = options;
      return {
        statusCode: 200,
        stream: new Blob([pngBytes()]).stream(),
      };
    },
  });

  let res = await execute(handler, { draftId: "draft-id" });
  assert.equal(res.statusCode, 200);
  assert.equal(requestedLocation, privateUrl);
  assert.equal(requestedOptions.access, "private");
  assert.equal(res.headers["Content-Type"], "image/png");
  assert.equal(res.headers["X-Promo-Draft-Attempt"], "2");
  assert.deepEqual(res.body, pngBytes());

  res = await execute(draftImageModule.createHandler({
    getSql: () => sqlReturning([{
      id: "draft-id",
      run_id: "run-id",
      draft_attempt: 2,
      draft_image_url: privateUrl,
    }]),
    getPrivateBlob: async () => null,
  }), { draftId: "draft-id" });
  assert.equal(res.statusCode, 404);
  assert.equal(res.body, "LO-FI draft image not found");
  assert.equal(String(res.body).includes(privateUrl), false);

  let externalFetchAttempted = false;
  res = await execute(draftImageModule.createHandler({
    getSql: () => sqlReturning([{
      id: "legacy-draft-id",
      run_id: "run-id",
      draft_attempt: 1,
      draft_image_url: "https://example.com/test-lofi-draft.png",
    }]),
    getPrivateBlob: async () => {
      externalFetchAttempted = true;
      return null;
    },
  }), { draftId: "legacy-draft-id" });
  assert.equal(res.statusCode, 422);
  assert.equal(res.body, "Unsupported LO-FI draft image location");
  assert.equal(externalFetchAttempted, false);
  assert.equal(draftSummary({
    id: "legacy-draft-id",
    run_id: "run-id",
    status: "ready",
    draft_image_url: "https://example.com/test-lofi-draft.png",
  }).imageProxyAvailable, false);
}

(async () => {
  const adminApp = fs.readFileSync(path.resolve(__dirname, "../prototype/app.js"), "utf8");
  const promoWizard = fs.readFileSync(path.resolve(__dirname, "../prototype/promo-wizard.js"), "utf8");
  assert.match(adminApp, /currentFinalDesign\?\.imageProxyAvailable !== false/);
  assert.match(adminApp, /finalDesign\.imageProxyAvailable !== false/);
  assert.match(adminApp, /draft\.imageProxyAvailable !== false/);
  assert.match(promoWizard, /draftImageProxyAvailable\(draft\)/);
  await verifyFinalDesignImage();
  await verifyLofiDraftImage();
  console.log("Promo generation image handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
