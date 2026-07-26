const assert = require("node:assert/strict");
const {
  generateSectionDesignPlan,
  generateSectionImage,
  imagePromptForSafeArea,
} = require("../api/_promo-section-design-provider");

function fakeWebp(width, height, size = 4096) {
  const bytes = Buffer.alloc(Math.max(size, 30), 0);
  bytes.write("RIFF", 0, "ascii");
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write("WEBP", 8, "ascii");
  bytes.write("VP8X", 12, "ascii");
  bytes.writeUIntLE(width - 1, 24, 3);
  bytes.writeUIntLE(height - 1, 27, 3);
  return bytes;
}

function fakeJpeg(width, height, size = 4096) {
  const bytes = Buffer.alloc(Math.max(size, 32), 0);
  bytes[0] = 0xff;
  bytes[1] = 0xd8;
  bytes[2] = 0xff;
  bytes[3] = 0xc0;
  bytes.writeUInt16BE(17, 4);
  bytes[6] = 8;
  bytes.writeUInt16BE(height, 7);
  bytes.writeUInt16BE(width, 9);
  bytes[23] = 0xff;
  bytes[24] = 0xd9;
  return bytes;
}

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
      const requestedSize = body.response_format.image_size;
      const dimension = requestedSize === "4K" ? 4096 : 2048;
      const generatedWidth = body.response_format.aspect_ratio === "16:9" ? dimension : dimension;
      const generatedHeight = body.response_format.aspect_ratio === "16:9"
        ? Math.round(dimension * 9 / 16)
        : dimension;
      return new Response(JSON.stringify({
        status: "completed",
        steps: [
          { type: "model_output", content: [{ type: "image", mime_type: "image/jpeg", data: fakeJpeg(1024, 1024).toString("base64") }] },
          { type: "model_output", content: [{ type: "image", mime_type: "image/jpeg", data: fakeJpeg(generatedWidth, generatedHeight).toString("base64") }] },
        ],
        usage: { total_tokens: 80 },
      }), { status: 200, headers: { "content-type": "application/json", "x-goog-request-id": "gemini-image-request" } });
    }
    const generatedBytes = body.output_format === "jpeg"
      ? fakeJpeg(1536, 1024)
      : fakeWebp(1536, 1024);
    return new Response(JSON.stringify({
      data: [{ b64_json: generatedBytes.toString("base64") }],
      usage: { total_tokens: 50 },
    }), { status: 200, headers: { "content-type": "application/json", "x-request-id": "image-request" } });
  };

  const layout = await generateSectionDesignPlan({
    section: { sectionKey: "heroBanner", name: "Hero", items: [] },
    sectionInputs: { title: "Welcome" },
    constraints: { allowedLayoutVariants: ["split-right"], contentLocks: [] },
    tokenSet: {},
    promptConfig: {
      renderedPrompt: "Initial managed planner prompt",
      model: "gpt-4.1-mini",
      temperature: 0.2,
      maxTokens: 6000,
      modelOptions: {
        executionSnapshotVersion: 2,
        harnessConfig: { version: 1, additionalInstructions: [] },
        runtimeConfig: { timeoutMs: 90000, maxAttempts: 1 },
        modelCapabilitySnapshot: {},
        safetyContract: {},
      },
    },
  });
  assert.equal(layout.result.layoutVariant, "split-right");
  assert.equal(layout.provider.requestId, "layout-request");
  assert.equal(requests[0].body.store, false);
  assert.equal(requests[0].body.text.format.type, "json_schema");
  assert.equal(requests[0].body.text.format.strict, true);
  assert(requests[0].signal instanceof AbortSignal);

  await generateSectionDesignPlan({
    section: { sectionKey: "heroBanner" },
    sectionInputs: { title: "Welcome" },
    constraints: {},
    tokenSet: {},
    promptConfig: {
      renderedPrompt: "Managed planner prompt",
      model: "gpt-4.1-mini",
      temperature: 0.35,
      maxTokens: 3210,
      modelOptions: {
        executionSnapshotVersion: 2,
        harnessConfig: { version: 1, additionalInstructions: [] },
        runtimeConfig: { timeoutMs: 45000, maxAttempts: 1 },
        modelCapabilitySnapshot: {},
        safetyContract: {},
      },
    },
  });
  assert.equal(requests[1].body.temperature, 0.35);
  assert.equal(requests[1].body.max_output_tokens, 3210);
  assert.equal(requests[1].body.input, "Managed planner prompt");

  const image = await generateSectionImage({
    prompt: "Premium visual, no text",
    safeArea: "right-copy",
    backgroundColor: "#123e36",
    promptConfig: {
      promptType: "section_background_image",
      snapshotVersion: 2,
      modelOptions: {
        executionSnapshotVersion: 2,
        runtimeConfig: { timeoutMs: 240000, maxAttempts: 3, outputMimeType: "image/jpeg" },
      },
    },
  });
  assert.equal(image.bytes.length, 4096);
  assert.equal(image.mimeType, "image/jpeg");
  assert.equal(image.width, 1536);
  assert.equal(image.height, 1024);
  assert.equal(requests[2].body.output_format, "jpeg");
  assert.equal(requests[2].body.size, "1536x1024");
  assert.match(requests[2].body.prompt, /right half as clean negative space/);
  assert.match(requests[2].body.prompt, /main visual subject on the left/);
  assert.match(requests[2].body.prompt, /compatible with the solid section background color #123e36/);
  assert.match(requests[2].body.prompt, /Do not bake a fade, gradient, vignette, transparency/);
  assert.match(requests[2].body.prompt, /web renderer applies the requested fade with CSS/);
  assert.match(requests[2].body.prompt, /FULL-BLEED WEB SECTION BACKGROUND/);
  assert.match(requests[2].body.prompt, /cover every pixel from edge to edge/);
  assert.match(requests[2].body.prompt, /Do not place the scene inside a card, panel, poster/);
  assert.match(requests[2].body.prompt, /Do not add any outer margin, padding, matte, whitespace/);
  assert.match(requests[2].body.prompt, /Never draw it as a surrounding frame or margin/);

  process.env.SECTION_IMAGE_PROVIDER = "gemini";
  process.env.SECTION_IMAGE_MODEL = "gemini-3.1-flash-image";
  const geminiImage = await generateSectionImage({
    prompt: "Premium visual",
    safeArea: "left-copy",
    aspectRatio: "1/1",
  });
  assert.equal(geminiImage.bytes.length, 4096);
  assert.equal(geminiImage.mimeType, "image/jpeg");
  assert.equal(geminiImage.width, 2048);
  assert.equal(geminiImage.height, 2048);
  assert.equal(geminiImage.provider.provider, "gemini");
  assert.equal(geminiImage.provider.requestId, "gemini-image-request");
  assert.match(requests[3].url, /\/v1beta\/interactions$/);
  assert.equal(requests[3].body.model, "gemini-3.1-flash-image");
  assert.equal(requests[3].body.input[0].type, "text");
  assert.equal(requests[3].body.response_format.type, "image");
  assert.equal(requests[3].body.response_format.aspect_ratio, "1:1");
  assert.equal(requests[3].body.response_format.image_size, "2K");
  assert.match(requests[3].body.input[0].text, /left half as clean negative space/);
  assert.match(requests[3].body.input[0].text, /main visual subject on the right/);
  assert.match(imagePromptForSafeArea("Centered visual", "center-copy"), /center as clean negative space/);
  assert.doesNotMatch(
    imagePromptForSafeArea("Component visual", "none", "#ffffff", "item", "1:1"),
    /FULL-BLEED WEB SECTION BACKGROUND/
  );

  const gemini4kImage = await generateSectionImage({
    prompt: "Wide premium visual",
    safeArea: "none",
    aspectRatio: "16:9",
    promptConfig: {
      promptType: "section_background_image",
      snapshotVersion: 3,
      modelOptions: {
        executionSnapshotVersion: 3,
        generationPolicy: { requestedTier: "4K", outputMimeType: "image/jpeg" },
      },
    },
  });
  assert.equal(gemini4kImage.width, 4096);
  assert.equal(gemini4kImage.height, 2304);
  assert.equal(requests[4].body.response_format.image_size, "4K");

  await generateSectionImage({
    prompt: "Managed component visual",
    safeArea: "none",
    targetType: "item",
    provider: "openai",
    promptConfig: {
      promptType: "component_image",
      snapshotVersion: 2,
      modelOptions: { executionSnapshotVersion: 2 },
      runtimeConfig: { timeoutMs: 30000, maxAttempts: 2, outputMimeType: "image/webp" },
      harnessConfig: {
        version: 1,
        safeAreaInstructions: { none: "CUSTOM SAFE AREA" },
        sectionBackgroundRules: [],
        componentImageRules: ["CUSTOM COMPONENT RULE"],
        negativeRules: ["CUSTOM NEGATIVE RULE"],
      },
      modelCapabilitySnapshot: {},
      safetyContract: {},
    },
  });
  assert.match(requests[5].body.prompt, /CUSTOM SAFE AREA/);
  assert.match(requests[5].body.prompt, /CUSTOM COMPONENT RULE/);
  assert.match(requests[5].body.prompt, /CUSTOM NEGATIVE RULE/);
  assert.doesNotMatch(requests[5].body.prompt, /FULL-BLEED WEB SECTION BACKGROUND/);

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
