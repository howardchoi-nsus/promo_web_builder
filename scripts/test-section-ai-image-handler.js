const assert = require("node:assert/strict");
const imageModule = require("../api/promo-section-design-image");

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

async function execute(handler, query = { runId: "run-id" }) {
  const res = responseRecorder();
  await handler({ method: "GET", query }, res);
  return res;
}

(async () => {
  let requestedLocation = "";
  let requestedOptions = null;
  const handler = imageModule.createHandler({
    getSql: () => ({ test: true }),
    fetchRun: async () => ({
      imageResult: {
        storageKey: "section-ai/run-id/hero-background.png",
        assetUrl: "https://example.public.blob.vercel-storage.com/ignored.png",
        mimeType: "image/png",
      },
    }),
    getPrivateBlob: async (location, options) => {
      requestedLocation = location;
      requestedOptions = options;
      return {
        statusCode: 200,
        stream: new Blob([Buffer.from("image-bytes")]).stream(),
        blob: { contentType: "image/png" },
      };
    },
  });

  let res = await execute(handler);
  assert.equal(res.statusCode, 200);
  assert.equal(requestedLocation, "section-ai/run-id/hero-background.png");
  assert.equal(requestedOptions.access, "private");
  assert.equal(res.headers["Content-Type"], "image/png");
  assert.deepEqual(res.body, Buffer.from("image-bytes"));

  res = await execute(imageModule.createHandler({
    getSql: () => ({}),
    fetchRun: async () => ({ imageResult: { assetUrl: "https://store.private.blob.vercel-storage.com/legacy.png" } }),
    getPrivateBlob: async (location) => {
      assert.equal(location, "https://store.private.blob.vercel-storage.com/legacy.png");
      return null;
    },
  }));
  assert.equal(res.statusCode, 404);

  res = await execute(imageModule.createHandler({
    getSql: () => ({}),
    fetchRun: async () => null,
    getPrivateBlob: async () => { throw new Error("must not be called"); },
  }));
  assert.equal(res.statusCode, 404);

  console.log("Section AI image handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
