const assert = require("node:assert/strict");
const { generateSectionLayout, generateSectionImage, imagePromptForSafeArea } = require("../api/_promo-section-design-provider");

const previousKey = process.env.OPENAI_API_KEY;
const previousGeminiKey = process.env.GEMINI_API_KEY;
const previousImageProvider = process.env.SECTION_IMAGE_PROVIDER;
const previousImageModel = process.env.SECTION_IMAGE_MODEL;
const previousFetch = global.fetch;
process.env.OPENAI_API_KEY = "test-key";
process.env.GEMINI_API_KEY = "gemini-test-key";
process.env.SECTION_IMAGE_PROVIDER = "openai";

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
    if (url.includes("generativelanguage.googleapis.com")) {
      return new Response(JSON.stringify({
        status: "completed",
        steps: [{ type: "model_output", content: [{ type: "image", mime_type: "image/jpeg", data: Buffer.alloc(3072, 2).toString("base64") }] }],
        usage: { total_tokens: 80 },
      }), { status: 200, headers: { "content-type": "application/json", "x-goog-request-id": "gemini-image-request" } });
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

  const image = await generateSectionImage({ prompt: "Premium visual, no text", safeArea: "right-copy" });
  assert.equal(image.bytes.length, 2048);
  assert.equal(image.mimeType, "image/webp");
  assert.equal(requests[1].body.output_format, "webp");
  assert.equal(requests[1].body.size, "1536x1024");
  assert.match(requests[1].body.prompt, /right half as clean negative space/);
  assert.match(requests[1].body.prompt, /main visual subject on the left/);

  process.env.SECTION_IMAGE_PROVIDER = "gemini";
  process.env.SECTION_IMAGE_MODEL = "gemini-3.1-flash-image";
  const geminiImage = await generateSectionImage({ prompt: "Premium visual", safeArea: "left-copy" });
  assert.equal(geminiImage.bytes.length, 3072);
  assert.equal(geminiImage.mimeType, "image/jpeg");
  assert.equal(geminiImage.width, 2048);
  assert.equal(geminiImage.height, 1152);
  assert.equal(geminiImage.provider.provider, "gemini");
  assert.equal(geminiImage.provider.requestId, "gemini-image-request");
  assert.match(requests[2].url, /\/v1beta\/interactions$/);
  assert.equal(requests[2].body.model, "gemini-3.1-flash-image");
  assert.equal(requests[2].body.input[0].type, "text");
  assert.equal(requests[2].body.response_format.type, "image");
  assert.equal(requests[2].body.response_format.aspect_ratio, "16:9");
  assert.equal(requests[2].body.response_format.image_size, "2K");
  assert.match(requests[2].body.input[0].text, /left half as clean negative space/);
  assert.match(requests[2].body.input[0].text, /main visual subject on the right/);
  assert.match(imagePromptForSafeArea("Centered visual", "center-copy"), /center as clean negative space/);

  console.log("Section AI provider contract tests passed.");
})().finally(() => {
  global.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = previousKey;
  if (previousGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = previousGeminiKey;
  if (previousImageProvider === undefined) delete process.env.SECTION_IMAGE_PROVIDER;
  else process.env.SECTION_IMAGE_PROVIDER = previousImageProvider;
  if (previousImageModel === undefined) delete process.env.SECTION_IMAGE_MODEL;
  else process.env.SECTION_IMAGE_MODEL = previousImageModel;
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
