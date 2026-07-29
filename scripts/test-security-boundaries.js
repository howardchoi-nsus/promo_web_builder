const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  MAX_SIGNATURE_AGE_MS,
  createAssetWriteAuth,
  stripAssetWriteAuth,
  verifyAssetWriteRequest,
} = require("../api/_promo-design-asset-auth");
const {
  RemoteImageError,
  fetchRemoteImage,
  isPublicIpAddress,
  validateRemoteImageUrl,
} = require("../api/_safe-remote-image");
const {
  resolveWorkerUrl,
  triggerWorker,
} = require("../api/_promo-generation-worker-trigger");

async function main() {
  await testAssetWriteAuthentication();
  await testRemoteImageBoundary();
  await testWorkerBoundary();
  testRetiredSectionDesignRoute();
  console.log("Security boundary tests passed.");
}

async function testAssetWriteAuthentication() {
  const previous = process.env.PROMO_DESIGN_ASSET_WRITE_TOKEN;
  process.env.PROMO_DESIGN_ASSET_WRITE_TOKEN = "test-secret-with-sufficient-entropy";
  try {
    const now = 1_800_000_000_000;
    const auth = createAssetWriteAuth("run-1", now);
    assert.equal(
      verifyAssetWriteRequest(
        { headers: {} },
        { runKey: "run-1", payload: { sectionConfig: { assetWriteAuth: auth } } },
        now,
      ).ok,
      true,
    );
    assert.equal(
      verifyAssetWriteRequest(
        { headers: { authorization: "Bearer test-secret-with-sufficient-entropy" } },
        { runKey: "run-2" },
        now,
      ).ok,
      true,
    );
    assert.equal(
      verifyAssetWriteRequest(
        { headers: {} },
        { runKey: "run-1", payload: { sectionConfig: { assetWriteAuth: auth } } },
        now + MAX_SIGNATURE_AGE_MS + 1,
      ).code,
      "ASSET_WRITE_AUTH_REQUIRED",
    );
    assert.deepEqual(
      stripAssetWriteAuth({
        id: "run-1",
        assetWriteAuth: auth,
        sectionConfig: { layout: "hero", assetWriteAuth: auth },
      }),
      { id: "run-1", sectionConfig: { layout: "hero" } },
    );
  } finally {
    setOrDeleteEnv("PROMO_DESIGN_ASSET_WRITE_TOKEN", previous);
  }
}

async function testRemoteImageBoundary() {
  assert.equal(isPublicIpAddress("8.8.8.8"), true);
  assert.equal(isPublicIpAddress("127.0.0.1"), false);
  assert.equal(isPublicIpAddress("169.254.169.254"), false);
  assert.equal(isPublicIpAddress("10.0.0.1"), false);
  assert.equal(isPublicIpAddress("::1"), false);
  assert.equal(isPublicIpAddress("::ffff:7f00:1"), false);
  assert.equal(isPublicIpAddress("::ffff:8.8.8.8"), true);
  assert.equal(isPublicIpAddress("2001:db8::1"), false);

  const publicLookup = async () => [{ address: "8.8.8.8", family: 4 }];
  const privateLookup = async () => [{ address: "127.0.0.1", family: 4 }];
  await assert.rejects(
    validateRemoteImageUrl("https://images.example.com/a.png", {
      allowedHosts: [],
      lookup: publicLookup,
    }),
    (error) => error instanceof RemoteImageError && error.code === "REMOTE_IMAGE_HOST_NOT_ALLOWED",
  );
  await assert.rejects(
    validateRemoteImageUrl("https://images.example.com/a.png", {
      allowedHosts: ["images.example.com"],
      lookup: privateLookup,
    }),
    (error) => error instanceof RemoteImageError && error.code === "REMOTE_IMAGE_PRIVATE_ADDRESS",
  );
  await assert.rejects(
    validateRemoteImageUrl("http://images.example.com/a.png", {
      allowedHosts: ["images.example.com"],
      lookup: publicLookup,
    }),
    /must use HTTPS/,
  );

  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  ]);
  const calls = [];
  const result = await fetchRemoteImage("https://images.example.com/start", {
    allowedHosts: ["images.example.com", "cdn.example.com"],
    lookup: publicLookup,
    maxBytes: 1024,
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (url.includes("/start")) {
        return new Response(null, {
          status: 302,
          headers: { location: "https://cdn.example.com/final.png" },
        });
      }
      return new Response(png, {
        status: 200,
        headers: { "content-type": "image/png", "content-length": String(png.length) },
      });
    },
  });
  assert.equal(result.sourceUrl, "https://cdn.example.com/final.png");
  assert.deepEqual(result.bytes, png);
  assert.equal(calls.length, 2);
  assert.ok(calls.every((call) => call.options.redirect === "manual"));

  await assert.rejects(
    fetchRemoteImage("https://images.example.com/large.png", {
      allowedHosts: ["images.example.com"],
      lookup: publicLookup,
      maxBytes: 8,
      fetchImpl: async () => new Response(png, {
        status: 200,
        headers: { "content-type": "image/png" },
      }),
    }),
    (error) => error.code === "REMOTE_IMAGE_TOO_LARGE",
  );
}

async function testWorkerBoundary() {
  const previous = {
    allowlist: process.env.N8N_WORKER_WEBHOOK_ALLOWLIST,
    legacyAllowlist: process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST,
    stageUrl: process.env.N8N_LOFI_DRAFT_WORKER_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };
  process.env.N8N_WORKER_WEBHOOK_ALLOWLIST = "hooks.example.com";
  delete process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST;
  delete process.env.N8N_LOFI_DRAFT_WORKER_URL;
  process.env.NODE_ENV = "development";
  process.env.VERCEL_ENV = "preview";
  try {
    assert.equal(
      (await resolveWorkerUrl("lofi_draft", "https://attacker.invalid/hook")).ok,
      false,
    );
    assert.equal(
      (await resolveWorkerUrl("lofi_draft", "https://hooks.example.com/hook")).ok,
      true,
    );
    assert.equal(
      (await resolveWorkerUrl("lofi_draft", "http://hooks.example.com/hook")).ok,
      false,
    );

    const previousFetch = global.fetch;
    let redirectMode = "";
    global.fetch = async (_url, options) => {
      redirectMode = options.redirect;
      return new Response(JSON.stringify({ accepted: true }), {
        status: 202,
        headers: { "content-type": "application/json" },
      });
    };
    try {
      const result = await triggerWorker({
        stage: "lofi_draft",
        payload: { runId: "run-1" },
        workerUrl: "https://hooks.example.com/hook",
      });
      assert.equal(result.ok, true);
      assert.equal(redirectMode, "manual");
    } finally {
      global.fetch = previousFetch;
    }
  } finally {
    setOrDeleteEnv("N8N_WORKER_WEBHOOK_ALLOWLIST", previous.allowlist);
    setOrDeleteEnv("N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST", previous.legacyAllowlist);
    setOrDeleteEnv("N8N_LOFI_DRAFT_WORKER_URL", previous.stageUrl);
    setOrDeleteEnv("NODE_ENV", previous.nodeEnv);
    setOrDeleteEnv("VERCEL_ENV", previous.vercelEnv);
  }
}

function testRetiredSectionDesignRoute() {
  const root = path.resolve(__dirname, "..");
  const retiredHandler = fs.readFileSync(
    path.join(root, "api/promo-section-design-process.js"),
    "utf8",
  );
  const designProxy = fs.readFileSync(path.join(root, "api/generate-ui-design.js"), "utf8");
  const designAssets = fs.readFileSync(path.join(root, "api/promo-design-assets.js"), "utf8");
  const vercelConfig = fs.readFileSync(path.join(root, "vercel.json"), "utf8");
  assert.match(retiredHandler, /status\(410\)/);
  assert.match(retiredHandler, /SECTION_DESIGN_PROCESS_RETIRED/);
  assert.doesNotMatch(retiredHandler, /generateSectionLayout|transitionRun/);
  assert.doesNotMatch(vercelConfig, /"api\/promo-section-design-process\.js"/);
  assert.match(designProxy, /createAssetWriteAuth/);
  assert.match(designProxy, /sectionConfig[\s\S]*assetWriteAuth/);
  assert.match(designAssets, /verifyAssetWriteRequest/);
  assert.match(designAssets, /fetchRemoteImage/);
}

function setOrDeleteEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
