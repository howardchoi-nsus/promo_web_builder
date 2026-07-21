const assert = require("node:assert/strict");
const imageModule = require("../api/promo-design-image");

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

function pngBytes() {
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  ]);
}

function handlerFor(row, getPrivateBlob) {
  return imageModule.createHandler({
    getDatabaseUrl: () => "postgresql://test",
    createSql: () => async () => row ? [row] : [],
    getPrivateBlob,
  });
}

async function execute(handler, query = { id: "legacy-run" }) {
  const res = responseRecorder();
  await handler({ method: "GET", query }, res);
  return res;
}

(async () => {
  const privateUrl = "https://store.private.blob.vercel-storage.com/legacy.png";
  const storageKey = "promo-designs/legacy-run/image.png";
  const requestedLocations = [];
  let requestedOptions = null;
  let res = await execute(handlerFor({
    storage_key: storageKey,
    asset_url: privateUrl,
    mime_type: "image/png",
    metadata: { access: "private", downloadUrl: `${privateUrl}?download=1` },
  }, async (location, options) => {
    requestedLocations.push(location);
    requestedOptions = options;
    return {
      statusCode: 200,
      stream: new Blob([pngBytes()]).stream(),
      headers: new Headers({ "cache-control": "private, max-age=60" }),
    };
  }));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(requestedLocations, [storageKey]);
  assert.equal(requestedOptions.access, "private");
  assert.equal(res.headers["Content-Type"], "image/png");
  assert.deepEqual(res.body, pngBytes());

  const fallbackLocations = [];
  res = await execute(handlerFor({
    storage_key: "",
    asset_url: privateUrl,
    mime_type: "image/png",
    metadata: {},
  }, async (location) => {
    fallbackLocations.push(location);
    return { statusCode: 200, stream: new Blob([pngBytes()]).stream(), headers: new Headers() };
  }));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(fallbackLocations, [privateUrl]);

  res = await execute(handlerFor({
    storage_key: storageKey,
    asset_url: privateUrl,
    metadata: {},
  }, async () => { throw new Error(`access denied: ${privateUrl}`); }));
  assert.equal(res.statusCode, 502);
  assert.equal(res.body, "Failed to read generated image");
  assert.equal(String(res.body).includes(privateUrl), false);

  res = await execute(handlerFor({
    storage_key: storageKey,
    asset_url: privateUrl,
    metadata: {},
  }, async () => null));
  assert.equal(res.statusCode, 404);
  assert.equal(res.body, "Image not found");

  console.log("Promo design image handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
