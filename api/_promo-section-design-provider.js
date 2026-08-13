const { CTA_LABEL_MAX_CHARACTERS } = require("./_promo-content-policy");
const {
  buildImageHarnessPrompt,
  imageMetadata,
  normalizeControlPlanePromptConfig,
  resolveOpenAiImageSize,
  validateControlPlaneConfig,
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
                ctaLabel: { type: ["string", "null"], maxLength: CTA_LABEL_MAX_CHARACTERS },
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

function promptPlaceholders(value) {
  return [...String(value || "").matchAll(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g)]
    .map((match) => match[1])
    .sort();
}

async function generatePromptKoreanTranslation({ text, promptConfig, signal }) {
  const source = String(text || "").trim();
  if (!source) return { translation: "", provider: null, usage: {} };
  const model = String(promptConfig?.model || "").trim();
  const instruction = String(promptConfig?.renderedPrompt || "").trim();
  if (!model || !instruction) {
    throw Object.assign(new Error("Active admin_prompt_translation settings are required"), {
      code: "PROMPT_CONFIGURATION_REQUIRED",
      statusCode: 409,
    });
  }
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: instruction,
    ...(promptConfig.temperature === null ? {} : { temperature: promptConfig.temperature }),
    ...(promptConfig.maxTokens === null ? {} : { max_output_tokens: promptConfig.maxTokens }),
  }, openAiHeaders(), signal, promptConfig.runtimeConfig?.timeoutMs);
  const translation = responseOutputText(payload).trim();
  if (!translation) {
    throw Object.assign(new Error("Prompt translation returned no output"), { code: "EMPTY_PROMPT_TRANSLATION" });
  }
  if (JSON.stringify(promptPlaceholders(source)) !== JSON.stringify(promptPlaceholders(translation))) {
    throw Object.assign(new Error("Prompt translation changed the variable placeholders"), {
      code: "PROMPT_TRANSLATION_PLACEHOLDER_MISMATCH",
    });
  }
  return {
    translation,
    provider: {
      provider: "openai",
      model,
      requestId,
      latencyMs: Date.now() - startedAt,
    },
    usage: payload.usage || {},
  };
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
  return ["1K", "2K", "4K"].includes(imageSize) ? imageSize : "";
}

function plannerRequestConfig(type, promptConfig = {}) {
  validateControlPlaneConfig(type, promptConfig);
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
  const model = promptConfig?.model;
  const prompt = promptConfig?.renderedPrompt;
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
  const model = promptConfig?.model;
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
  const model = promptConfig?.model;
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

async function generateStructuredPlannerResult({
  type,
  schemaName,
  schema,
  promptConfig,
  signal,
}) {
  const execution = plannerRequestConfig(type, promptConfig);
  const model = promptConfig?.model;
  const prompt = String(promptConfig?.renderedPrompt || "").trim();
  if (!prompt) throw Object.assign(new Error(`${type} prompt is required`), { code: "PLANNER_PROMPT_REQUIRED" });
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: prompt,
    ...execution.requestFields,
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        strict: true,
        schema,
      },
    },
  }, openAiHeaders(), signal, execution.timeoutMs);
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error(`${type} returned no structured output`), { code: "EMPTY_PLANNER_RESULT" });
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
  const model = String(requestedModel || "").trim();
  const outputMimeType = execution.generationPolicy?.outputMimeType
    || execution.runtimeConfig.outputMimeType;
  const size = resolveOpenAiImageSize({
    aspectRatio: execution.effectiveAspectRatio || aspectRatio,
    configuredSize: execution.modelOptions?.size,
    capabilities: execution.modelCapabilitySnapshot,
  });
  const quality = String(execution.generationPolicy?.quality || execution.modelOptions?.quality || "").trim();
  if (!model || !outputMimeType || !size || !quality) {
    throw Object.assign(new Error("OpenAI image model, size, quality, and output MIME type must come from active prompt settings"), {
      code: "PROMPT_CONFIGURATION_REQUIRED",
    });
  }
  const outputFormat = outputMimeType === "image/jpeg" ? "jpeg"
    : outputMimeType === "image/png" ? "png" : "webp";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/images/generations", {
    model,
    prompt,
    size,
    quality,
    output_format: outputFormat,
  }, openAiHeaders(), signal, execution.runtimeConfig.timeoutMs);
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw Object.assign(new Error("Image model returned no image data"), { code: "EMPTY_IMAGE_RESULT" });
  const bytes = Buffer.from(base64, "base64");
  const metadata = imageMetadata(bytes, outputMimeType);
  if ((!metadata?.width || !metadata?.height) && execution.validationPolicy?.rejectUnreadableMetadata !== false) {
    throw Object.assign(new Error("OpenAI returned image data with unreadable dimensions"), { code: "IMAGE_METADATA_INVALID" });
  }
  if (metadata?.mimeType !== outputMimeType && execution.validationPolicy?.rejectMimeMismatch !== false) {
    throw Object.assign(new Error(`OpenAI image MIME mismatch: expected ${outputMimeType}, received ${metadata.mimeType}`), {
      code: "IMAGE_MIME_MISMATCH",
    });
  }
  validateRequestedImageResolution(metadata, { ...execution, providerRequestSize: size });
  return {
    bytes,
    mimeType: metadata?.mimeType || outputMimeType,
    width: metadata?.width || 0,
    height: metadata?.height || 0,
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateGeminiSectionImage({ prompt, aspectRatio, model: requestedModel, modelOptions, promptConfig, signal }) {
  const execution = normalizeControlPlanePromptConfig(
    promptConfig?.promptType || "component_image",
    { ...promptConfig, modelOptions }
  );
  const model = String(requestedModel || "").trim();
  const imageSize = normalizedGeminiImageSize(
    execution.generationPolicy?.requestedTier
    || execution.modelOptions?.imageSize
  );
  const outputMimeType = execution.generationPolicy?.outputMimeType
    || execution.runtimeConfig.outputMimeType;
  if (!model || !imageSize || !outputMimeType) {
    throw Object.assign(new Error("Gemini image model, size, and output MIME type must come from active prompt settings"), {
      code: "PROMPT_CONFIGURATION_REQUIRED",
    });
  }
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
  if (mimeType !== outputMimeType && execution.validationPolicy?.rejectMimeMismatch !== false) {
    throw Object.assign(new Error(`Gemini image MIME mismatch: requested ${outputMimeType}, declared ${mimeType}`), {
      code: "IMAGE_MIME_MISMATCH",
    });
  }
  const metadata = imageMetadata(bytes, mimeType);
  if ((!metadata?.width || !metadata?.height) && execution.validationPolicy?.rejectUnreadableMetadata !== false) {
    throw Object.assign(new Error("Gemini returned image data with unreadable dimensions"), { code: "IMAGE_METADATA_INVALID" });
  }
  if (metadata?.mimeType !== mimeType && execution.validationPolicy?.rejectMimeMismatch !== false) {
    throw Object.assign(new Error(`Gemini image MIME mismatch: declared ${mimeType}, received ${metadata.mimeType}`), {
      code: "IMAGE_MIME_MISMATCH",
    });
  }
  validateRequestedImageResolution(metadata, execution);
  return {
    bytes,
    mimeType: metadata?.mimeType || mimeType,
    width: metadata?.width || 0,
    height: metadata?.height || 0,
    provider: { provider: "gemini", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usageMetadata || payload.usage || {},
  };
}

async function generateSectionImage(input) {
  const promptType = (input.targetType || "section-background") === "section-background"
    ? "section_background_image"
    : "component_image";
  validateControlPlaneConfig(promptType, input.promptConfig || {});
  const promptConfig = normalizeControlPlanePromptConfig(promptType, {
    ...(input.promptConfig || {}),
    modelOptions: input.modelOptions || input.promptConfig?.modelOptions,
  });
  promptConfig.effectiveAspectRatio = normalizedImageAspectRatio(
    input.effectiveAspectRatio || input.aspectRatio
  );
  const configuredProvider = input.provider || promptConfig.provider;
  const provider = String(configuredProvider).trim().toLowerCase() === "google"
    ? "gemini"
    : String(configuredProvider).trim().toLowerCase();
  const subjectScale = promptConfig.generationPolicy?.subjectScale;
  const generatedPrompt = buildImageHarnessPrompt({
    prompt: input.prompt,
    harnessConfig: promptConfig.harnessConfig,
    safeArea: input.safeArea,
    backgroundColor: input.backgroundColor,
    targetType: input.targetType || "section-background",
    aspectRatio: normalizedImageAspectRatio(input.aspectRatio),
    keyVisualTextPolicy: input.keyVisualTextPolicy,
    subjectScale,
  });
  const request = {
    ...input,
    model: input.model || promptConfig.model,
    promptConfig,
    modelOptions: promptConfig.modelOptions,
    prompt: generatedPrompt,
  };
  if (provider === "gemini") return generateGeminiSectionImage(request);
  if (provider === "openai") return generateOpenAiSectionImage(request);
  throw Object.assign(new Error(`Unsupported section image provider: ${provider}`), { code: "UNSUPPORTED_IMAGE_PROVIDER" });
}

module.exports = {
  generatePromptKoreanTranslation,
  generateSectionDesignPlan,
  generateMultiComponentLayoutPlan,
  generateSectionCompositionPlan,
  generateStructuredPlannerResult,
  generateSectionImage,
  generateOpenAiSectionImage,
  generateGeminiSectionImage,
  normalizedImageAspectRatio,
  geminiImageDimensions,
};
