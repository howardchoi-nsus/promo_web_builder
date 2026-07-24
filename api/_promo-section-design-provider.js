const LAYOUT_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["layoutVariant", "minHeight", "imagePrompt", "rationale"],
  properties: {
    layoutVariant: { type: "string", enum: ["split-left", "split-right", "centered-hero"] },
    minHeight: { type: "integer", minimum: 240, maximum: 900 },
    imagePrompt: { type: "string" },
    rationale: { type: "string" },
  },
};

const DESIGN_PLAN_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["layoutVariant", "itemPlacements", "slotSelections", "assetRequests", "rationale"],
  properties: {
    layoutVariant: { type: "string", enum: ["split-left", "split-right", "centered-hero"] },
    itemPlacements: { type: "array", items: { type: "object", additionalProperties: false, required: ["itemKey", "region", "order"], properties: {
      itemKey: { type: "string" }, region: { type: "string" }, order: { type: "integer", minimum: 0, maximum: 100 },
    } } },
    slotSelections: { type: "array", items: { type: "object", additionalProperties: false, required: ["itemKey", "slotKey", "tokenKey"], properties: {
      itemKey: { type: "string" }, slotKey: { type: "string" }, tokenKey: { type: "string" },
    } } },
    assetRequests: { type: "array", items: { type: "object", additionalProperties: false, required: ["targetType", "itemKey", "prompt", "safeArea"], properties: {
      targetType: { type: "string", enum: ["section-background", "item"] }, itemKey: { type: ["string", "null"] },
      prompt: { type: "string" }, safeArea: { type: "string", enum: ["left-copy", "right-copy", "center-copy", "none"] },
    } } },
    rationale: { type: "string" },
  },
};

const MULTI_COMPONENT_LAYOUT_PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["operation", "targetItemKeys", "axis", "gapToken", "rationale"],
  properties: {
    operation: {
      type: "string",
      enum: [
        "align-left", "align-center", "align-right",
        "align-top", "align-middle", "align-bottom",
        "distribute-horizontal", "distribute-vertical",
        "equal-width", "equal-height", "set-gap",
        "group-stack-horizontal", "group-stack-vertical",
      ],
    },
    targetItemKeys: {
      type: "array",
      minItems: 2,
      maxItems: 12,
      items: { type: "string" },
    },
    axis: {
      type: ["string", "null"],
      enum: [null, "horizontal", "vertical"],
    },
    gapToken: {
      type: ["string", "null"],
      enum: [null, "space-2", "space-3", "space-4", "space-6", "space-8"],
    },
    rationale: { type: "string", minLength: 1, maxLength: 600 },
  },
};

function openAiHeaders() {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.code = "PROVIDER_NOT_CONFIGURED";
    throw error;
  }
  return { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}

function geminiHeaders() {
  const apiKey = String(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.code = "PROVIDER_NOT_CONFIGURED";
    throw error;
  }
  return { "x-goog-api-key": apiKey, "Content-Type": "application/json" };
}

async function requestJson(url, body, headers, signal, timeoutMs) {
  const controller = signal ? null : new AbortController();
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: signal || controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error?.message || `Model provider failed with ${response.status}`);
      error.code = payload.error?.code || `PROVIDER_${response.status}`;
      error.statusCode = response.status;
      throw error;
    }
    return { payload, requestId: response.headers.get("x-request-id") || response.headers.get("x-goog-request-id") || "" };
  } catch (error) {
    if (error.name === "AbortError") {
      throw Object.assign(new Error(`Model provider timed out after ${timeoutMs}ms`), { code: "PROVIDER_TIMEOUT", statusCode: 504 });
    }
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function responseOutputText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  return (payload.output || []).flatMap((item) => item.content || [])
    .find((part) => part.type === "output_text")?.text || "";
}

function imagePromptForSafeArea(prompt, safeArea, backgroundColor = "#f5f7fb") {
  const composition = safeArea === "right-copy"
    ? "Keep the right half as clean negative space for DOM copy and place the main visual subject on the left."
    : safeArea === "left-copy"
      ? "Keep the left half as clean negative space for DOM copy and place the main visual subject on the right."
      : safeArea === "center-copy"
        ? "Keep the center as clean negative space for centered DOM copy and place supporting visual detail around the outer edges."
        : "Use the full canvas for the visual subject; do not reserve artificial copy-safe negative space.";
  return [
    String(prompt || "").trim(),
    composition,
    `Use edge colors that are visually compatible with the solid section background color ${backgroundColor}.`,
    "Do not bake a fade, gradient, vignette, transparency, border, or masking effect into the image; the web renderer applies the requested fade with CSS.",
    "Do not render text, buttons, logos, badges, or legal copy inside the image.",
  ].filter(Boolean).join("\n");
}

function normalizedImageAspectRatio(value) {
  const candidate = String(value || "").trim();
  if (["1:1", "4:3", "3:4", "16:9", "9:16"].includes(candidate)) return candidate;
  const match = candidate.match(/^(\d+(?:\.\d+)?)\s*[/]\s*(\d+(?:\.\d+)?)$/);
  if (!match) return "16:9";
  const ratio = Number(match[1]) / Number(match[2]);
  if (ratio > 1.55) return "16:9";
  if (ratio > 1.1) return "4:3";
  if (ratio < 0.65) return "9:16";
  if (ratio < 0.9) return "3:4";
  return "1:1";
}

function openAiImageSize(aspectRatio) {
  const ratio = normalizedImageAspectRatio(aspectRatio);
  if (ratio === "1:1") return "1024x1024";
  if (ratio === "3:4" || ratio === "9:16") return "1024x1536";
  return "1536x1024";
}

function geminiImageDimensions(imageSize, aspectRatio) {
  const longSide = imageSize === "4K" ? 4096 : imageSize === "2K" ? 2048 : 1024;
  const ratio = normalizedImageAspectRatio(aspectRatio);
  if (ratio === "1:1") return { width: longSide, height: longSide };
  if (ratio === "4:3") return { width: longSide, height: Math.round(longSide * 3 / 4) };
  if (ratio === "3:4") return { width: Math.round(longSide * 3 / 4), height: longSide };
  if (ratio === "9:16") return { width: Math.round(longSide * 9 / 16), height: longSide };
  return { width: longSide, height: Math.round(longSide * 9 / 16) };
}

async function generateSectionLayout({ section, sectionInputs, constraints, signal }) {
  const model = process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini";
  const prompt = [
    "Design one responsive promotional web section.",
    "Select only one allowed layout variant and describe one supporting image without embedding any text, CTA, logo, badge, or legal copy in the image.",
    "The image prompt must preserve negative space for DOM copy.",
    `Section: ${section.name || section.sectionKey} (${section.sectionKey})`,
    `Allowed variants: ${(constraints.allowedLayoutVariants || []).join(", ")}`,
    `Locked content keys: ${(constraints.contentLocks || []).join(", ") || "none"}`,
    `Content: ${JSON.stringify(sectionInputs)}`,
  ].join("\n");
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "section_layout_result",
        strict: true,
        schema: LAYOUT_RESULT_SCHEMA,
      },
    },
  }, openAiHeaders(), signal, Number(process.env.SECTION_LAYOUT_TIMEOUT_MS || 90000));
  const text = responseOutputText(payload);
  if (!text) throw Object.assign(new Error("Layout model returned no structured output"), { code: "EMPTY_LAYOUT_RESULT" });
  return {
    result: JSON.parse(text),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateSectionDesignPlan({ section, sectionInputs, constraints, tokenSet, requestMode = "full", promptConfig, signal }) {
  const model = promptConfig?.model || process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini";
  const prompt = promptConfig?.renderedPrompt || [
    "Plan one promotional web section using only the supplied component instances, layout regions, style slots and promo tokens.",
    "Never invent item keys, regions, slots, tokens, CSS, selectors, HTML, or text rendered inside images.",
    `Mode: ${requestMode}`,
    `Section: ${JSON.stringify(section)}`,
    `Content: ${JSON.stringify(sectionInputs)}`,
    `Constraints: ${JSON.stringify(constraints)}`,
    `Token set: ${JSON.stringify(tokenSet)}`,
  ].join("\n");
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model, store: false, input: prompt,
    text: { format: { type: "json_schema", name: "section_design_plan", strict: true, schema: DESIGN_PLAN_SCHEMA } },
  }, openAiHeaders(), signal, Number(process.env.SECTION_LAYOUT_TIMEOUT_MS || 90000));
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error("Planner returned no structured output"), { code: "EMPTY_DESIGN_PLAN" });
  return {
    result: JSON.parse(output),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt }, usage: payload.usage || {},
  };
}

async function generateMultiComponentLayoutPlan({ promptConfig, signal }) {
  const model = promptConfig?.model || process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini";
  const prompt = String(promptConfig?.renderedPrompt || "").trim();
  if (!prompt) throw Object.assign(new Error("Multi-component layout prompt is required"), { code: "LAYOUT_PROMPT_REQUIRED" });
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "multi_component_layout_plan",
        strict: true,
        schema: MULTI_COMPONENT_LAYOUT_PLAN_SCHEMA,
      },
    },
  }, openAiHeaders(), signal, Number(process.env.SECTION_LAYOUT_TIMEOUT_MS || 90000));
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error("Multi-component planner returned no structured output"), { code: "EMPTY_MULTI_LAYOUT_PLAN" });
  return {
    result: JSON.parse(output),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateOpenAiSectionImage({ prompt, aspectRatio, model: requestedModel, modelOptions, signal }) {
  const model = requestedModel || process.env.SECTION_IMAGE_MODEL || "gpt-image-1";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/images/generations", {
    model,
    prompt,
    size: openAiImageSize(aspectRatio),
    quality: modelOptions?.quality || process.env.SECTION_IMAGE_QUALITY || "medium",
    output_format: "webp",
  }, openAiHeaders(), signal, Number(process.env.SECTION_IMAGE_TIMEOUT_MS || 240000));
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw Object.assign(new Error("Image model returned no image data"), { code: "EMPTY_IMAGE_RESULT" });
  return {
    bytes: Buffer.from(base64, "base64"),
    mimeType: "image/webp",
    width: openAiImageSize(aspectRatio).split("x").map(Number)[0],
    height: openAiImageSize(aspectRatio).split("x").map(Number)[1],
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateGeminiSectionImage({ prompt, aspectRatio, model: requestedModel, modelOptions, signal }) {
  const model = requestedModel || process.env.SECTION_IMAGE_MODEL || "gemini-3.1-flash-image";
  const imageSize = modelOptions?.imageSize || process.env.SECTION_IMAGE_SIZE || "2K";
  const dimensions = geminiImageDimensions(imageSize, aspectRatio);
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      model,
      input: [{ type: "text", text: prompt }],
      response_format: {
        type: "image",
        mime_type: "image/jpeg",
        aspect_ratio: normalizedImageAspectRatio(aspectRatio),
        image_size: imageSize,
      },
    },
    geminiHeaders(),
    signal,
    Number(process.env.SECTION_IMAGE_TIMEOUT_MS || 240000)
  );
  const stepImage = (payload.steps || []).flatMap((step) => step.content || [])
    .find((content) => content.type === "image" && content.data);
  const outputImage = payload.output_image || stepImage;
  if (!outputImage?.data) throw Object.assign(new Error("Gemini image model returned no inline image data"), { code: "EMPTY_IMAGE_RESULT" });
  const mimeType = outputImage.mime_type || outputImage.mimeType || "image/jpeg";
  return {
    bytes: Buffer.from(outputImage.data, "base64"),
    mimeType,
    width: dimensions.width,
    height: dimensions.height,
    provider: { provider: "gemini", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usageMetadata || payload.usage || {},
  };
}

async function generateSectionImage(input) {
  const configuredProvider = input.provider || process.env.SECTION_IMAGE_PROVIDER || "openai";
  const provider = String(configuredProvider).trim().toLowerCase() === "google"
    ? "gemini"
    : String(configuredProvider).trim().toLowerCase();
  const request = {
    ...input,
    prompt: imagePromptForSafeArea(input.prompt, input.safeArea, input.backgroundColor),
  };
  if (provider === "gemini") return generateGeminiSectionImage(request);
  if (provider === "openai") return generateOpenAiSectionImage(request);
  throw Object.assign(new Error(`Unsupported section image provider: ${provider}`), { code: "UNSUPPORTED_IMAGE_PROVIDER" });
}

module.exports = {
  generateSectionLayout,
  generateSectionDesignPlan,
  generateMultiComponentLayoutPlan,
  generateSectionImage,
  generateOpenAiSectionImage,
  generateGeminiSectionImage,
  imagePromptForSafeArea,
  normalizedImageAspectRatio,
  openAiImageSize,
  geminiImageDimensions,
};
