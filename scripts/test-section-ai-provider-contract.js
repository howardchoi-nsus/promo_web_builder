const assert = require("node:assert/strict");
const { generateSectionLayout, generateSectionImage } = require("../api/_promo-section-design-provider");

const previousKey = process.env.OPENAI_API_KEY;
const previousFetch = global.fetch;
process.env.OPENAI_API_KEY = "test-key";

(async () => {
  const requests = [];
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    requests.push({ url, body, signal: options.signal });
    if (url.endsWith("/responses")) {
      return new Response(JSON.stringify({
        output_text: JSON.stringify({
          layoutVariant: "split-right",
          minHeight: 520,
          imagePrompt: "A premium visual with left-side negative space and no text",
          rationale: "Keeps DOM copy readable.",
        }),
        usage: { input_tokens: 10, output_tokens: 12, total_tokens: 22 },
      }), { status: 200, headers: { "content-type": "application/json", "x-request-id": "layout-request" } });
    }
    return new Response(JSON.stringify({
      data: [{ b64_json: Buffer.alloc(2048, 1).toString("base64") }],
      usage: { total_tokens: 50 },
    }), { status: 200, headers: { "content-type": "application/json", "x-request-id": "image-request" } });
  };

  const layout = await generateSectionLayout({
    section: { sectionKey: "heroBanner", name: "Hero", items: [] },
    sectionInputs: { title: "Welcome" },
    constraints: { allowedLayoutVariants: ["split-right"], contentLocks: [] },
  });
  assert.equal(layout.result.layoutVariant, "split-right");
  assert.equal(layout.provider.requestId, "layout-request");
  assert.equal(requests[0].body.store, false);
  assert.equal(requests[0].body.text.format.type, "json_schema");
  assert.equal(requests[0].body.text.format.strict, true);
  assert(requests[0].signal instanceof AbortSignal);

  const image = await generateSectionImage({ prompt: "Premium visual, no text" });
  assert.equal(image.bytes.length, 2048);
  assert.equal(image.mimeType, "image/webp");
  assert.equal(requests[1].body.output_format, "webp");
  assert.equal(requests[1].body.size, "1536x1024");

  console.log("Section AI provider contract tests passed.");
})().finally(() => {
  global.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = previousKey;
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
