const {
  buildImageHarnessPrompt,
  imageMetadata,
  normalizeControlPlanePromptConfig,
  validateRequestedImageResolution,
} = require("./_section-ai-control-plane");

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

const SECTION_COMPOSITION_PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "sectionIntent", "componentSelections", "itemPlacements", "tokenBindings",
    "backgroundImage", "missingInputs", "adjustments", "rationale",
  ],
  properties: {
    sectionIntent: { type: "string", minLength: 1, maxLength: 600 },
    componentSelections: {
      type: "array",
      maxItems: 30,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["itemKey", "role", "fields"],
        properties: {
          itemKey: { type: "string" },
          role: {
            type: "string",
            enum: ["eyebrow", "primary-title", "supporting-copy", "primary-action", "visual", "supporting"],
          },
          fields: {
            type: "array",
            maxItems: 30,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["fieldKey", "textValue", "ctaLabel", "ctaUrl"],
              properties: {
                fieldKey: { type: ["string", "null"] },
                textValue: { type: ["string", "null"] },
                ctaLabel: { type: ["string", "null"] },
                ctaUrl: { type: ["string", "null"] },
              },
            },
          },
        },
      },
    },
    itemPlacements: {
      type: "array",
      maxItems: 30,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["itemKey", "region", "order"],
        properties: {
          itemKey: { type: "string" },
          region: { type: "string", enum: ["left", "center", "right"] },
          order: { type: "integer", minimum: 0, maximum: 100 },
        },
      },
    },
    tokenBindings: {
      type: "array",
      maxItems: 60,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["itemKey", "fieldKey", "slotKey", "tokenKey"],
        properties: {
          itemKey: { type: "string" },
          fieldKey: { type: ["string", "null"] },
          slotKey: { type: "string" },
          tokenKey: { type: "string" },
        },
      },
    },
    backgroundImage: {
      type: "object",
      additionalProperties: false,
      required: ["requested", "concept", "safeArea", "fadeMode"],
      properties: {
        requested: { type: "boolean" },
        concept: { type: "string", maxLength: 1200 },
        safeArea: { type: "string", enum: ["left-copy", "right-copy", "center-copy", "none"] },
        fadeMode: { type: "string", enum: ["none", "left", "right", "both"] },
      },
    },
    missingInputs: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "reason"],
        properties: {
          field: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    adjustments: { type: "array", maxItems: 30, items: { type: "string" } },
    rationale: { type: "string", minLength: 1, maxLength: 1200 },
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

function imagePromptForSafeArea(
  prompt,
  safeArea,
  backgroundColor = "#f5f7fb",
  targetType = "section-background",
  aspectRatio = "16:9"
) {
  return buildImageHarnessPrompt({
    prompt,
    safeArea,
    backgroundColor,
    targetType,
    aspectRatio: normalizedImageAspectRatio(aspectRatio),
  });
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

function normalizedGeminiImageSize(value) {
  const imageSize = String(value || "").trim().toUpperCase();
  return ["1K", "2K", "4K"].includes(imageSize) ? imageSize : "2K";
}

function plannerRequestConfig(type, promptConfig = {}) {
  const config = normalizeControlPlanePromptConfig(type, promptConfig);
  return {
    config,
    timeoutMs: config.runtimeConfig.timeoutMs,
    requestFields: {
      ...(config.temperature === null ? {} : { temperature: config.temperature }),
      ...(config.maxTokens === null ? {} : { max_output_tokens: config.maxTokens }),
    },
  };
}

async function generateSectionDesignPlan({ section, sectionInputs, constraints, tokenSet, requestMode = "full", promptConfig, signal }) {
  const execution = plannerRequestConfig("section_layout_planner", promptConfig);
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
    model, store: false, input: prompt, ...execution.requestFields,
    text: { format: { type: "json_schema", name: "section_design_plan", strict: true, schema: DESIGN_PLAN_SCHEMA } },
  }, openAiHeaders(), signal, execution.timeoutMs);
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error("Planner returned no structured output"), { code: "EMPTY_DESIGN_PLAN" });
  return {
    result: JSON.parse(output),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt }, usage: payload.usage || {},
  };
}

async function generateMultiComponentLayoutPlan({ promptConfig, signal }) {
  const execution = plannerRequestConfig("multi_component_layout_planner", promptConfig);
  const model = promptConfig?.model || process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini";
  const prompt = String(promptConfig?.renderedPrompt || "").trim();
  if (!prompt) throw Object.assign(new Error("Multi-component layout prompt is required"), { code: "LAYOUT_PROMPT_REQUIRED" });
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: prompt,
    ...execution.requestFields,
    text: {
      format: {
        type: "json_schema",
        name: "multi_component_layout_plan",
        strict: true,
        schema: MULTI_COMPONENT_LAYOUT_PLAN_SCHEMA,
      },
    },
  }, openAiHeaders(), signal, execution.timeoutMs);
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error("Multi-component planner returned no structured output"), { code: "EMPTY_MULTI_LAYOUT_PLAN" });
  return {
    result: JSON.parse(output),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateSectionCompositionPlan({ promptConfig, signal }) {
  const execution = plannerRequestConfig("section_composition_planner", promptConfig);
  const model = promptConfig?.model || process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini";
  const prompt = String(promptConfig?.renderedPrompt || "").trim();
  if (!prompt) throw Object.assign(new Error("Section composition prompt is required"), { code: "COMPOSITION_PROMPT_REQUIRED" });
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: prompt,
    ...execution.requestFields,
    text: {
      format: {
        type: "json_schema",
        name: "section_composition_plan",
        strict: true,
        schema: SECTION_COMPOSITION_PLAN_SCHEMA,
      },
    },
  }, openAiHeaders(), signal, execution.timeoutMs);
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error("Section composition planner returned no structured output"), { code: "EMPTY_COMPOSITION_PLAN" });
  return {
    result: JSON.parse(output),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateOpenAiSectionImage({ prompt, aspectRatio, model: requestedModel, modelOptions, promptConfig, signal }) {
  const execution = normalizeControlPlanePromptConfig(
    promptConfig?.promptType || "component_image",
    { ...promptConfig, modelOptions }
  );
  const model = requestedModel || process.env.SECTION_IMAGE_MODEL || "gpt-image-1";
  const outputMimeType = execution.runtimeConfig.outputMimeType || "image/webp";
  const outputFormat = outputMimeType === "image/jpeg" ? "jpeg"
    : outputMimeType === "image/png" ? "png" : "webp";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/images/generations", {
    model,
    prompt,
    size: execution.modelOptions?.size || openAiImageSize(aspectRatio),
    quality: execution.modelOptions?.quality || process.env.SECTION_IMAGE_QUALITY || "medium",
    output_format: outputFormat,
  }, openAiHeaders(), signal, execution.runtimeConfig.timeoutMs);
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw Object.assign(new Error("Image model returned no image data"), { code: "EMPTY_IMAGE_RESULT" });
  const bytes = Buffer.from(base64, "base64");
  const metadata = imageMetadata(bytes, outputMimeType);
  if (!metadata?.width || !metadata?.height) {
    throw Object.assign(new Error("OpenAI returned image data with unreadable dimensions"), { code: "IMAGE_METADATA_INVALID" });
  }
  if (metadata.mimeType !== outputMimeType) {
    throw Object.assign(new Error(`OpenAI image MIME mismatch: expected ${outputMimeType}, received ${metadata.mimeType}`), {
      code: "IMAGE_MIME_MISMATCH",
    });
  }
  validateRequestedImageResolution(metadata, execution);
  return {
    bytes,
    mimeType: metadata.mimeType || outputMimeType,
    width: metadata.width,
    height: metadata.height,
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateGeminiSectionImage({ prompt, aspectRatio, model: requestedModel, modelOptions, promptConfig, signal }) {
  const execution = normalizeControlPlanePromptConfig(
    promptConfig?.promptType || "component_image",
    { ...promptConfig, modelOptions }
  );
  const model = requestedModel || process.env.SECTION_IMAGE_MODEL || "gemini-3.1-flash-image";
  const imageSize = normalizedGeminiImageSize(execution.modelOptions?.imageSize || process.env.SECTION_IMAGE_SIZE);
  const outputMimeType = execution.runtimeConfig.outputMimeType || "image/jpeg";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      model,
      input: [{ type: "text", text: prompt }],
      response_format: {
        type: "image",
        mime_type: outputMimeType,
        aspect_ratio: normalizedImageAspectRatio(aspectRatio),
        image_size: imageSize,
      },
    },
    geminiHeaders(),
    signal,
    execution.runtimeConfig.timeoutMs
  );
  const stepImages = (payload.steps || []).flatMap((step) => step.content || [])
    .filter((content) => content.type === "image" && content.data);
  const outputImage = payload.output_image || stepImages.at(-1);
  if (!outputImage?.data) throw Object.assign(new Error("Gemini image model returned no inline image data"), { code: "EMPTY_IMAGE_RESULT" });
  const bytes = Buffer.from(outputImage.data, "base64");
  const mimeType = outputImage.mime_type || outputImage.mimeType || outputMimeType;
  if (mimeType !== outputMimeType) {
    throw Object.assign(new Error(`Gemini image MIME mismatch: requested ${outputMimeType}, declared ${mimeType}`), {
      code: "IMAGE_MIME_MISMATCH",
    });
  }
  const metadata = imageMetadata(bytes, mimeType);
  if (!metadata?.width || !metadata?.height) {
    throw Object.assign(new Error("Gemini returned image data with unreadable dimensions"), { code: "IMAGE_METADATA_INVALID" });
  }
  if (metadata.mimeType !== mimeType) {
    throw Object.assign(new Error(`Gemini image MIME mismatch: declared ${mimeType}, received ${metadata.mimeType}`), {
      code: "IMAGE_MIME_MISMATCH",
    });
  }
  validateRequestedImageResolution(metadata, execution);
  return {
    bytes,
    mimeType: metadata.mimeType || mimeType,
    width: metadata.width,
    height: metadata.height,
    provider: { provider: "gemini", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usageMetadata || payload.usage || {},
  };
}

async function generateSectionImage(input) {
  const promptType = (input.targetType || "section-background") === "section-background"
    ? "section_background_image"
    : "component_image";
  const promptConfig = normalizeControlPlanePromptConfig(promptType, {
    ...(input.promptConfig || {}),
    modelOptions: input.modelOptions || input.promptConfig?.modelOptions,
  });
  const configuredProvider = input.provider || promptConfig.provider || process.env.SECTION_IMAGE_PROVIDER || "openai";
  const provider = String(configuredProvider).trim().toLowerCase() === "google"
    ? "gemini"
    : String(configuredProvider).trim().toLowerCase();
  const request = {
    ...input,
    model: input.model || promptConfig.model,
    promptConfig,
    modelOptions: promptConfig.modelOptions,
    prompt: buildImageHarnessPrompt({
      prompt: input.prompt,
      harnessConfig: promptConfig.harnessConfig,
      safeArea: input.safeArea,
      backgroundColor: input.backgroundColor,
      targetType: input.targetType || "section-background",
      aspectRatio: normalizedImageAspectRatio(input.aspectRatio),
    }),
  };
  if (provider === "gemini") return generateGeminiSectionImage(request);
  if (provider === "openai") return generateOpenAiSectionImage(request);
  throw Object.assign(new Error(`Unsupported section image provider: ${provider}`), { code: "UNSUPPORTED_IMAGE_PROVIDER" });
}

module.exports = {
  generateSectionDesignPlan,
  generateMultiComponentLayoutPlan,
  generateSectionCompositionPlan,
  generateSectionImage,
  generateOpenAiSectionImage,
  generateGeminiSectionImage,
  imagePromptForSafeArea,
  normalizedImageAspectRatio,
  openAiImageSize,
  geminiImageDimensions,
};
