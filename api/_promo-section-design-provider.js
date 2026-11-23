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

const PROVIDER_BILLING_MESSAGE = "AI 모델 사용 크레딧이 소진되었거나 결제 설정이 필요합니다. 관리자에게 문의해 주세요.";

function isProviderBillingError(error) {
  const code = String(error?.code || "").trim().toLowerCase();
  const type = String(error?.providerErrorType || "").trim().toLowerCase();
  const message = String(error?.providerMessage || error?.message || "").trim().toLowerCase();
  return [
    "provider_billing_required",
    "insufficient_quota",
    "billing_hard_limit_reached",
    "payment_required",
  ].includes(code)
    || ["insufficient_quota", "billing_error", "payment_required"].includes(type)
    || /prepayment credits? (?:are )?depleted/.test(message)
    || /credits? (?:are )?depleted/.test(message)
    || /billing (?:account|setup|configuration) (?:is )?(?:required|inactive|disabled)/.test(message);
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
      const providerMessage = payload.error?.message || `Model provider failed with ${response.status}`;
      const error = new Error(providerMessage);
      error.code = payload.error?.code || `PROVIDER_${response.status}`;
      error.statusCode = response.status;
      error.providerErrorType = payload.error?.type || "";
      error.requestId = response.headers.get("x-request-id") || response.headers.get("x-goog-request-id") || "";
      error.providerMessage = providerMessage;
      if (isProviderBillingError(error)) {
        error.code = "PROVIDER_BILLING_REQUIRED";
        error.message = PROVIDER_BILLING_MESSAGE;
      }
      throw error;
    }
    return { payload, requestId: response.headers.get("x-request-id") || response.headers.get("x-goog-request-id") || "" };
  } catch (error) {
    if (error.name === "AbortError") {
      throw Object.assign(new Error(`Model provider timed out after ${timeoutMs}ms`), { code: "PROVIDER_TIMEOUT", statusCode: 504 });
    }
    if (error instanceof TypeError && !error.statusCode) {
      throw Object.assign(new Error(`Model provider network request failed: ${error.message}`), {
        code: "PROVIDER_NETWORK_ERROR",
        statusCode: 503,
      });
    }
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function isRetryableProviderError(error) {
  if (isProviderBillingError(error)) return false;
  const statusCode = Number(error?.statusCode || 0);
  const code = String(error?.code || "").trim().toLowerCase();
  const type = String(error?.providerErrorType || "").trim().toLowerCase();
  return statusCode === 408
    || statusCode === 429
    || statusCode >= 500
    || ["api_error", "server_error", "rate_limit_exceeded", "provider_timeout"].includes(code)
    || ["api_error", "server_error"].includes(type);
}

function responseOutputText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  return (payload.output || []).flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

function assertStructuredSchemaReferences(schema,type){
 const visit=(value,path)=>{if(!value||typeof value!=='object')return;
  if(typeof value.$ref==='string'&&Object.keys(value).length!==1)throw Object.assign(new Error(`${type}: 응답 스키마 참조에 허용되지 않는 추가 속성이 있습니다. (${path})`),{code:'PLANNER_RESPONSE_SCHEMA_INVALID',statusCode:500,retryable:false,errors:[{path,code:'REF_SIBLINGS_NOT_SUPPORTED',message:'$ref must be the only keyword in its schema object'}]});
  for(const [key,child] of Object.entries(value))if(!['const','enum','default','examples'].includes(key))visit(child,`${path}.${key}`);
 };visit(schema,'schema');
}
function structuredResponseDiagnostics(payload,{requestId='',maxTokens=null}={}) {
  return {requestId,status:typeof payload.status==='string'?payload.status:'unknown',reason:String(payload.incomplete_details?.reason||payload.error?.code||'').slice(0,100),outputCharacters:responseOutputText(payload).length,outputTokens:Number.isFinite(Number(payload.usage?.output_tokens))?Number(payload.usage.output_tokens):null,reasoningTokens:Number.isFinite(Number(payload.usage?.output_tokens_details?.reasoning_tokens))?Number(payload.usage.output_tokens_details.reasoning_tokens):null,maxOutputTokens:Number.isFinite(Number(maxTokens))&&maxTokens!==null?Number(maxTokens):null};
}
function assertStructuredResponseComplete(payload,type,options={}) {
  const diagnostics=structuredResponseDiagnostics(payload,options);
  const incomplete=payload.status==='incomplete'||Boolean(payload.incomplete_details)||payload.output?.some(item=>item.status==='incomplete');
  const refusal=diagnostics.reason==='content_filter'||payload.output?.some(item=>item.content?.some(part=>part.type==='refusal'));
  if(!incomplete&&!refusal&&!['failed','cancelled'].includes(payload.status))return diagnostics;
  const limited=incomplete&&diagnostics.reason==='max_output_tokens';
  const code=limited?'PLANNER_OUTPUT_LIMIT_REACHED':refusal?'PLANNER_OUTPUT_REFUSED':'PLANNER_OUTPUT_INCOMPLETE';
  const message=limited?`${type}: AI 응답이 출력 한도에 도달해 중단됐습니다. 불완전한 내용은 적용하지 않았습니다.`:refusal?`${type}: AI가 구조화 응답을 제공하지 않았습니다.`:`${type}: AI 응답이 완료되지 않았습니다. 저장된 결과는 유지합니다.`;
  throw Object.assign(new Error(message),{code,statusCode:502,retryable:!limited&&!refusal,providerDiagnostics:diagnostics});
}
function parseStructuredOutput(output, type, diagnostics) {
  try {
    return JSON.parse(output);
  } catch (cause) {
    throw Object.assign(
      new Error(`${type} returned invalid structured JSON: ${cause.message}`, { cause }),
      { code: "PLANNER_OUTPUT_JSON_INVALID", statusCode:502,retryable: true, ...(diagnostics?{providerDiagnostics:diagnostics}:{}) },
    );
  }
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
  const reasoning=config.modelOptions?.reasoning;
  if(reasoning!==undefined&&(!reasoning||typeof reasoning!=='object'||Array.isArray(reasoning)))throw Object.assign(new Error(`${type} reasoning must be an administrator-configured JSON object`),{code:'CONTROL_PLANE_CONFIG_INVALID',statusCode:422});
  return {
    config,
    timeoutMs: config.runtimeConfig.timeoutMs,
    requestFields: {
      ...(config.temperature === null ? {} : { temperature: config.temperature }),
      ...(config.maxTokens === null ? {} : { max_output_tokens: config.maxTokens }),
      ...(reasoning===undefined?{}:{reasoning:structuredClone(reasoning)}),
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
    result: parseStructuredOutput(output, "section_layout_planner"),
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
    result: parseStructuredOutput(output, "multi_component_layout_planner"),
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
    result: parseStructuredOutput(output, "section_composition_planner"),
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
  assertStructuredSchemaReferences(schema,type);
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
  const diagnostics=assertStructuredResponseComplete(payload,type,{requestId,maxTokens:execution.requestFields.max_output_tokens});
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error(`${type} returned no structured output`), { code: "EMPTY_PLANNER_RESULT" });
  return {
    result: parseStructuredOutput(output, type,diagnostics),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateStructuredVisionResult({
  type,
  schemaName,
  schema,
  imageUrl,
  promptConfig,
  signal,
}) {
  assertStructuredSchemaReferences(schema,type);
  const execution = plannerRequestConfig(type, promptConfig);
  const model = promptConfig?.model;
  const prompt = String(promptConfig?.renderedPrompt || "").trim();
  const normalizedImageUrl = String(imageUrl || "").trim();
  if (!prompt) throw Object.assign(new Error(`${type} prompt is required`), { code: "PLANNER_PROMPT_REQUIRED" });
  if (!normalizedImageUrl) throw Object.assign(new Error(`${type} image is required`), { code: "VISION_IMAGE_REQUIRED", statusCode: 422 });
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: [{
      role: "user",
      content: [
        { type: "input_text", text: prompt },
        { type: "input_image", image_url: normalizedImageUrl },
      ],
    }],
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
  const diagnostics=assertStructuredResponseComplete(payload,type,{requestId,maxTokens:execution.requestFields.max_output_tokens});
  const output = responseOutputText(payload);
  if (!output) throw Object.assign(new Error(`${type} returned no structured output`), { code: "EMPTY_PLANNER_RESULT" });
  return {
    result: parseStructuredOutput(output, type,diagnostics),
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
  generateStructuredVisionResult,
  responseOutputText,
  assertStructuredSchemaReferences,
  parseStructuredOutput,
  isRetryableProviderError,
  isProviderBillingError,
  generateSectionImage,
  generateOpenAiSectionImage,
  generateGeminiSectionImage,
  normalizedImageAspectRatio,
  geminiImageDimensions,
};

for(const name of ['generateStructuredPlannerResult','generateStructuredVisionResult','generateSectionImage','generateSectionDesignPlan','generateMultiComponentLayoutPlan','generateSectionCompositionPlan'])if(typeof module.exports[name]==='function')module.exports[name]=require('./_work-log').withModelLog(module.exports[name]);
