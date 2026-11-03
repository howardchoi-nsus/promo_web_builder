const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHandler: createQualityHandler } = require("../api/promo-page-quality-test");
const { createHandler: createGenerationHandler } = require("../api/generate-promo-page");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[String(name).toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

const index = read("index.html");
const html = read("output-quality-test.html");
const client = read("output-quality-test.js");
const proxy = read("api/_promo-page-generation-proxy.js");
const vercel = JSON.parse(read("vercel.json"));

assert.match(index, /href="\/output-quality-test"/);
assert.match(index, /웹 출력 품질 테스트/);
assert.match(html, /data-test-mode="sample"/);
assert.match(html, /data-test-mode="live"/);
assert.match(html, /Desktop <span>1440<\/span>/);
assert.match(html, /Mobile <span>390<\/span>/);
assert.match(html, /<iframe[^>]+sandbox[^>]+referrerpolicy="no-referrer"/);
assert.doesNotMatch(html, /type="file"|이미지 등록|image upload/i);
assert.match(client, /x-promo-quality-test-token/);
assert.doesNotMatch(client, /N8N_PROMO_WEBHOOK_URL|PROMPT_RUNTIME_SERVICE_TOKEN|PROMO_PAGE_GENERATION_WEBHOOK_TOKEN/);
assert.doesNotMatch(proxy, /x-n8n-webhook-url/);
assert.equal(vercel.functions["api/promo-page-quality-test.js"].maxDuration, 300);

(async () => {
  const fixtureHandler = createQualityHandler({ env: {} });
  let res = response();
  await fixtureHandler({ method: "GET", headers: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.state, "fixture_only");
  assert.equal(res.body.sampleAvailable, true);
  assert.equal(res.body.liveConfigured, false);

  res = response();
  await fixtureHandler({ method: "POST", headers: {}, body: { mode: "sample" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.overallState, "partial");
  assert.equal(res.body.checks[0].state, "passed");
  assert.equal(res.body.checks[1].state, "not_run");
  assert.match(res.body.previewDocument, /<main class="promo-generated-page">/);
  assert.doesNotMatch(res.body.previewDocument, /<img\b|<script\b/i);

  res = response();
  await fixtureHandler({ method: "POST", headers: {}, body: { mode: "live" } }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, "QUALITY_TEST_ACCESS_NOT_CONFIGURED");

  const env = {
    VERCEL: "1",
    N8N_PROMO_WEBHOOK_URL: "https://n8n.internal.example/webhook/promo-ai-page-generate",
    PROMO_PAGE_GENERATION_WEBHOOK_TOKEN: "generation-token-that-is-at-least-32-characters",
    PROMO_PAGE_TEST_CONSOLE_TOKEN: "console-token-that-is-at-least-32-characters",
  };
  let captured;
  const liveHandler = createQualityHandler({
    env,
    now: () => 1_800_000_000_000,
    randomId: () => "abcd-1234",
    fetchImpl: async (url, options) => {
      captured = { url, options, payload: JSON.parse(options.body) };
      return {
        ok: true,
        status: 200,
        headers: { get: () => "application/json" },
        async json() {
          return {
            ok: true,
            id: "quality-1800000000000-abcd1234",
            pagePath: "/api/promo-page-generation-artifact?id=quality-1800000000000-abcd1234&token=signed-token",
            contentHash: "abc123",
            expiresAt: "2027-01-15T08:00:00.000Z",
            promptMeta: { id: "prompt-1", type: "promo_page_generation", name: "Page quality", version: 4, secret: "drop-me" },
            browserQualityGate: {
              contractVersion: 1,
              state: "passed",
              blockingCount: 0,
              results: {
                desktop: { width: 1440, height: 1000, state: "passed", blockingCount: 0, diagnostics: [] },
                mobile: { width: 390, height: 844, state: "passed", blockingCount: 0, diagnostics: [] },
              },
            },
          };
        },
      };
    },
  });
  const liveRequest = {
    method: "POST",
    headers: {
      host: "promo-web-builder.vercel.app",
      origin: "https://promo-web-builder.vercel.app",
      "x-forwarded-proto": "https",
      "x-promo-quality-test-token": env.PROMO_PAGE_TEST_CONSOLE_TOKEN,
      "x-n8n-webhook-url": "https://attacker.example/collect",
    },
    body: { mode: "live" },
  };
  res = response();
  await liveHandler(liveRequest, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.overallState, "passed");
  assert.equal(res.body.pagePath.startsWith("/api/promo-page-generation-artifact?"), true);
  assert.equal(res.body.promptMeta.secret, undefined);
  assert.equal(captured.url, env.N8N_PROMO_WEBHOOK_URL);
  assert.equal(captured.options.headers["x-promo-generation-token"], env.PROMO_PAGE_GENERATION_WEBHOOK_TOKEN);
  assert.equal(captured.payload.design.imagePolicy, "excluded");
  assert.equal(captured.payload.promo.title.length > 0, true);

  const incompleteGateHandler = createQualityHandler({
    env,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      async json() {
        return {
          ok: true,
          id: "quality-incomplete",
          pagePath: "/api/promo-page-generation-artifact?id=quality-incomplete&token=signed-token",
          browserQualityGate: {
            contractVersion: 1,
            state: "passed",
            blockingCount: 0,
            results: {
              desktop: { width: 1440, height: 1000, state: "passed", blockingCount: 0, diagnostics: [] },
            },
          },
        };
      },
    }),
  });
  res = response();
  await incompleteGateHandler(liveRequest, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, "BROWSER_GATE_VIEWPORT_RESULT_INVALID");

  const generationHandler = createGenerationHandler({ env });
  res = response();
  await generationHandler({ method: "POST", headers: { "x-n8n-webhook-url": "https://attacker.example" }, body: {} }, res);
  assert.equal(res.statusCode, 410);
  assert.equal(res.body.code, "GENERATION_FACADE_RETIRED");

  console.log("Output quality test console contract passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
