const IMAGE_PROMPT_TYPES = new Set([
  "image_execution",
  "lofi_draft",
  "final_design",
  "final_design_v2",
  "section_background_image",
  "component_image",
]);

const JSON_PROMPT_TYPES = new Set([
  "integrated_brief",
  "integrated_brief_v2",
  "section_layout_planner",
  "multi_component_layout_planner",
  "section_composition_planner",
  "promo_overview_parser",
  "promo_template_recommender",
  "promo_template_composer",
  "promo_page_composer",
  "promo_composition_editor",
  "component_visual_analyzer",
  "promo_page_generation",
]);

const MODEL_CATALOG = Object.freeze([
  {
    provider: "openai",
    model: "gpt-6.1-sol",
    label: "GPT-6.1 Sol · 권장",
    description: "복잡한 브리프와 구조화 작업의 품질·비용 균형 모델",
    modality: "text",
    recommended: true,
    temperature: null,
    maxTokens: 24000,
    options: { reasoning: { effort: "medium" } },
  },
  {
    provider: "openai",
    model: "gpt-6-astra",
    label: "GPT-6 Astra · 최고 품질",
    description: "가장 복잡한 추론과 정밀한 지시 이행을 위한 상위 모델",
    modality: "text",
    temperature: null,
    maxTokens: 32000,
    options: { reasoning: { effort: "high" } },
  },
  {
    provider: "openai",
    model: "gpt-6-luna",
    label: "GPT-6 Luna · 빠른 처리",
    description: "반복적이고 대량인 구조화 작업을 위한 비용 우선 모델",
    modality: "text",
    temperature: null,
    maxTokens: 12000,
    options: { reasoning: { effort: "low" } },
  },
  {
    provider: "openai",
    model: "gpt-4.1-mini",
    label: "GPT-4.1 Mini · 기존 호환",
    description: "기존 Prompt Version과의 호환성을 위한 레거시 선택지",
    modality: "text",
    temperature: 0.1,
    maxTokens: 12000,
    legacy: true,
    options: {},
  },
  {
    provider: "openai",
    model: "gpt-4o-mini",
    label: "GPT-4o Mini · 기존 호환",
    description: "기존 통합 브리프 설정을 유지할 때 사용하는 레거시 모델",
    modality: "text",
    temperature: 0.1,
    maxTokens: 12000,
    legacy: true,
    options: {},
  },
  {
    provider: "openai",
    model: "gpt-image-2.5-sunburst",
    label: "GPT Image 2.5 Sunburst · 품질 권장",
    description: "고품질 프로모션 이미지 생성과 정밀 편집에 적합",
    modality: "image",
    recommended: true,
    options: { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" },
  },
  {
    provider: "openai",
    model: "gpt-image-2.5-flare",
    label: "GPT Image 2.5 Flare · 속도 권장",
    description: "빠른 고품질 이미지 생성과 대량 시안 제작에 적합",
    modality: "image",
    options: { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" },
  },
  {
    provider: "openai",
    model: "gpt-image-2",
    label: "GPT Image 2",
    description: "기존 이미지 생성 작업과의 호환 선택지",
    modality: "image",
    options: { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" },
  },
  {
    provider: "openai",
    model: "gpt-image-1.5",
    label: "GPT Image 1.5 · 기존 호환",
    description: "이전 세대 GPT Image 작업을 유지할 때 사용",
    modality: "image",
    legacy: true,
    options: { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" },
  },
  {
    provider: "openai",
    model: "gpt-image-1",
    label: "GPT Image 1 · 기존 호환",
    description: "기존 V1 이미지 생성 설정을 유지할 때 사용",
    modality: "image",
    legacy: true,
    options: { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" },
  },
  {
    provider: "google",
    model: "gemini-nano-banana-2.1",
    label: "Nano Banana 2.1 · 권장",
    description: "고품질 이미지 생성·편집과 텍스트 표현을 위한 기본 권장 모델",
    modality: "image",
    recommended: true,
    imageSize: "2K",
    supportedImageSizes: ["1K", "2K", "4K"],
    options: { imageSize: "2K" },
  },
  {
    provider: "google",
    model: "gemini-3.1-flash-lite-image",
    label: "Nano Banana 2 Lite · 속도·비용",
    description: "대량 이미지 생성에서 속도와 비용을 우선할 때 사용",
    modality: "image",
    imageSize: "1K",
    supportedImageSizes: ["1K"],
    options: { imageSize: "1K" },
  },
  {
    provider: "google",
    model: "gemini-3.1-flash-image",
    label: "Nano Banana 2 · 기존 호환",
    description: "현재 운영 중인 이전 세대 Gemini 이미지 모델",
    modality: "image",
    legacy: true,
    imageSize: "2K",
    supportedImageSizes: ["1K", "2K", "4K"],
    options: { imageSize: "2K" },
  },
  {
    provider: "google",
    model: "gemini-3-pro-image",
    label: "Nano Banana Pro · 최고 품질",
    description: "브랜드 일관성과 정밀 제어가 중요한 고난도 이미지 작업용",
    modality: "image",
    imageSize: "2K",
    supportedImageSizes: ["1K", "2K", "4K"],
    options: { imageSize: "2K" },
  },
  {
    provider: "google",
    model: "gemini-2.5-flash-image",
    label: "Gemini 2.5 Flash Image · 레거시",
    description: "이전 Gemini 이미지 실행 호환을 위한 레거시 모델",
    modality: "image",
    legacy: true,
    imageSize: "1K",
    supportedImageSizes: ["1K"],
    options: { imageSize: "1K" },
  },
]);

function promptModality(type) {
  return IMAGE_PROMPT_TYPES.has(String(type || "")) ? "image" : "text";
}

function responseFormatForPrompt(type) {
  if (IMAGE_PROMPT_TYPES.has(String(type || ""))) return "image";
  return JSON_PROMPT_TYPES.has(String(type || "")) ? "json_object" : "text";
}

function listModels({ provider, type } = {}) {
  const modality = promptModality(type);
  return MODEL_CATALOG.filter((entry) => entry.provider === provider && entry.modality === modality);
}

function findModel(provider, model) {
  return MODEL_CATALOG.find((entry) => entry.provider === provider && entry.model === model) || null;
}

function recommendedModel({ provider, type } = {}) {
  const models = listModels({ provider, type });
  return models.find((entry) => entry.recommended) || models[0] || null;
}

function presetFor({ provider, model, type } = {}) {
  const entry = findModel(provider, model);
  if (!entry) return null;
  const responseFormat = responseFormatForPrompt(type);
  const modelOptions = {
    provider,
    model,
    responseFormat,
    ...entry.options,
  };
  return {
    ...entry,
    responseFormat,
    imageSize: entry.imageSize || "2K",
    modelOptions,
    capabilitySnapshot: {
      provider,
      model,
      modality: entry.modality,
      legacy: Boolean(entry.legacy),
      supportsStructuredOutput: entry.modality === "text",
      supportsImageGeneration: entry.modality === "image",
      ...(provider === "google" && entry.modality === "image"
        ? { supportedImageSizes: entry.supportedImageSizes || ["1K", "2K", "4K"] }
        : {}),
    },
  };
}

export const llmModelCatalogService = Object.freeze({
  findModel,
  listModels,
  presetFor,
  promptModality,
  recommendedModel,
  responseFormatForPrompt,
});
