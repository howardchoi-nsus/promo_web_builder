const assert = require("node:assert/strict");
const finalImageModule = require("../api/promo-generation-final-design-image");
const draftImageModule = require("../api/promo-generation-lofi-draft-image");

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
}

(async () => {
  await verifyFinalDesignImage();
  await verifyLofiDraftImage();
  console.log("Promo generation image handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
