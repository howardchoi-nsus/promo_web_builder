import assert from "node:assert/strict";
import { analyzeOverviewWithRetry } from "../visual-editor/src/builder/services/composition-client.mjs";

const previousFetch = global.fetch;

try {
  let calls = 0;
  const retries = [];
  const requestBodies = [];
  global.fetch = async (_url, options = {}) => {
    calls += 1;
    requestBodies.push(JSON.parse(options.body));
    if (calls === 1) {
      return new Response(JSON.stringify({
        message: "Internal error encountered.",
        code: "api_error",
        retryable: true,
        retryPolicy: { maxAttempts: 3, retryBaseMs: 1000, retryMaxMs: 5000 },
        requestId: "provider-request-1",
        providerErrorType: "api_error",
        executionDisplay: { providerLabel: "OpenAI", modelLabel: "gpt-4.1-mini" },
      }), { status: 502, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ ok: true, overview: { title: "Summer Bonus" } }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  const result = await analyzeOverviewWithRetry("Create a summer bonus promotion", {
    context: {
      locale: "en-CA",
      market: "CA",
      productCatalog: [{ productKey: "casino" }],
    },
    onRetry: (retry) => retries.push(retry),
    wait: async (delayMs) => assert.equal(delayMs, 1000),
  });
  assert.equal(calls, 2);
  assert.equal(result.overview.title, "Summer Bonus");
  assert.equal(requestBodies.length, 2);
  requestBodies.forEach((body) => assert.deepEqual(body, {
    mode: "natural-language",
    naturalLanguage: "Create a summer bonus promotion",
    locale: "en-CA",
    market: "CA",
    productCatalog: [{ productKey: "casino" }],
  }));
  assert.deepEqual(retries.map(({ attempt, maxAttempts, requestId }) => ({ attempt, maxAttempts, requestId })), [{
    attempt: 2,
    maxAttempts: 3,
    requestId: "provider-request-1",
  }]);

  calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({
      message: "Invalid request.",
      code: "invalid_request_error",
      retryable: false,
      retryPolicy: { maxAttempts: 3, retryBaseMs: 1000, retryMaxMs: 5000 },
    }), { status: 400, headers: { "content-type": "application/json" } });
  };
  await assert.rejects(
    analyzeOverviewWithRetry("Create a summer bonus promotion", { wait: async () => {} }),
    (error) => error.code === "invalid_request_error"
  );
  assert.equal(calls, 1);

  console.log("AI overview retry tests passed.");
} finally {
  global.fetch = previousFetch;
}
