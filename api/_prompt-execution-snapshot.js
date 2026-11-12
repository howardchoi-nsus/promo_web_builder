const {
  ensureDefaultPromptTemplates,
  renderPrompt,
  sha256,
  toPromptTemplate,
  validatePromptExecutionVariables,
  validatePromptLayers,
  validatePromptTemplateContract,
} = require("./_prompt-template-store");
const { fitFinalDesignPromptVariables, FINAL_DESIGN_PROMPT_MAX_LENGTH } = require("./_final-design-prompt-budget");
const { assembleEffectivePrompt } = require("./_prompt-assembler");
const { normalizeExecutionModelOptions } = require("./_worker-execution-contract");
const {
  normalizeControlPlanePromptConfig,
  validateControlPlaneConfig,
} = require("./_section-ai-control-plane");
const { requireActiveRegisteredModel } = require("./_llm-model-registry-store");

const APPROVED_GOOGLE_IMAGE_MODELS = new Set([
  "gemini-nano-banana-2.1",
  "gemini-3.1-flash-lite-image",
  "gemini-3.1-flash-image",
  "gemini-3-pro-image",
  "gemini-2.5-flash-image",
]);

function isApprovedGoogleImageModel(model) {
  return APPROVED_GOOGLE_IMAGE_MODELS.has(String(model || "").trim().toLowerCase());
}

function completeDeclaredPromptVariables(prompt, variables = {}) {
  const completed = { ...variables };
  for (const key of prompt?.optionalVariables || []) {
    if (!Object.prototype.hasOwnProperty.call(completed, key)) completed[key] = "";
  }
  return completed;
}

async function createPromptExecutionSnapshot(sql, type, variables = {}) {
  await ensureDefaultPromptTemplates(sql);
  const rows = await sql`
    select
      id::text,
      type,
      name,
      body,
      status,
      version,
      required_variables,
      optional_variables,
      provider,
      model,
      temperature,
      max_tokens,
      response_format,
      model_options,
      change_note,
      archived_at,
      created_at,
      updated_at
    from prompt_templates
    where type = ${type}
      and status = 'active'
    limit 1
  `;
  if (!rows.length) {
    const error = new Error(`Active ${type} prompt template not found`);
    error.statusCode = 409;
    throw error;
  }

  return buildPromptExecutionSnapshot(sql, toPromptTemplate(rows[0]), variables);
}

async function createValidatedPromptExecutionSnapshot(sql, promptId, variables = {}, { expectedType = "" } = {}) {
  const id = String(promptId || "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    const error = new Error("A valid prompt template id is required");
    error.statusCode = 400;
    error.code = "PROMPT_ID_INVALID";
    throw error;
  }

  await ensureDefaultPromptTemplates(sql);
  const rows = await sql`
    select
      id::text,
      type,
      name,
      body,
      status,
      version,
      lineage_id::text,
      source_prompt_template_id::text,
      validated_at,
      required_variables,
      optional_variables,
      provider,
      model,
      temperature,
      max_tokens,
      response_format,
      model_options,
      change_note,
      archived_at,
      created_at,
      updated_at
    from prompt_templates
    where id = ${id}::uuid
    limit 1
  `;
  if (!rows.length) {
    const error = new Error("Prompt template not found");
    error.statusCode = 404;
    error.code = "PROMPT_TEMPLATE_NOT_FOUND";
    throw error;
  }

  const prompt = toPromptTemplate(rows[0]);
  if (prompt.status !== "validated" || !prompt.validatedAt) {
    const error = new Error("Only a validated prompt candidate can be evaluated");
    error.statusCode = 409;
    error.code = "PROMPT_VALIDATION_REQUIRED";
    throw error;
  }
  const normalizedExpectedType = String(expectedType || "").trim();
  if (normalizedExpectedType && prompt.type !== normalizedExpectedType) {
    const error = new Error(`Prompt type mismatch: expected ${normalizedExpectedType}, received ${prompt.type}`);
    error.statusCode = 409;
    error.code = "PROMPT_TYPE_MISMATCH";
    throw error;
  }

  const snapshot = await buildPromptExecutionSnapshot(sql, prompt, variables);
  return {
    ...snapshot,
    promptSelection: {
      mode: "validated-candidate",
      status: prompt.status,
      id: prompt.id,
      type: prompt.type,
      version: prompt.version,
      lineageId: prompt.lineageId,
      sourcePromptTemplateId: prompt.sourcePromptTemplateId,
      validatedAt: prompt.validatedAt,
    },
  };
}

async function buildPromptExecutionSnapshot(sql, prompt, variables = {}) {
  const type = prompt.type;
  await requireActiveRegisteredModel(sql, {
    provider: prompt.provider,
    model: prompt.model,
    promptType: prompt.type,
  });
  validatePromptTemplateContract(prompt.type, prompt);
  const completedVariables = completeDeclaredPromptVariables(prompt, variables);
  validatePromptExecutionVariables(type, completedVariables);
  validateStageModelConfig(type, prompt);
  const missingRequired = prompt.requiredVariables.filter((key) => !hasPromptValue(completedVariables[key]));
  if (missingRequired.length) {
    const error = new Error(`Required ${type} prompt variables are missing: ${missingRequired.join(", ")}`);
    error.statusCode = 409;
    throw error;
  }

  const fitted = type === "final_design" || type === "final_design_v2"
    ? fitFinalDesignPromptVariables(prompt.body, completedVariables, renderPrompt)
    : {
        variables: completedVariables,
        renderedPrompt: renderPrompt(prompt.body, completedVariables),
        lengthGuard: null,
      };
  const snapshotModelOptions = prompt.controlPlaneReady
    ? prompt.modelOptions
    : { ...(prompt.modelOptions || {}), executionSnapshotVersion: 1 };
  const controlPlane = normalizeControlPlanePromptConfig(type, {
    temperature: prompt.temperature,
    maxTokens: prompt.maxTokens,
    responseFormat: prompt.responseFormat,
    modelOptions: snapshotModelOptions,
  });
  const promptLayers = snapshotModelOptions.promptLayers
    && typeof snapshotModelOptions.promptLayers === "object"
    && !Array.isArray(snapshotModelOptions.promptLayers)
    ? snapshotModelOptions.promptLayers
    : {};
  const skills=await require('./_agent-skill-store').resolvePromptSkills(sql,snapshotModelOptions.skillBindings);
  const assembled = assembleEffectivePrompt({
    type,
    renderedBody: fitted.renderedPrompt,
    variables: fitted.variables,
    promptLayers,
    harnessConfig: controlPlane.harnessConfig,
    skills,
  });
  if(skills.length&&((['final_design','final_design_v2'].includes(type)&&assembled.renderedPrompt.length>FINAL_DESIGN_PROMPT_MAX_LENGTH)||Buffer.byteLength(assembled.renderedPrompt)>250000))throw Object.assign(new Error('스킬을 포함한 최종 프롬프트가 길이 예산을 초과했습니다. 연결 지침을 줄여 주세요.'),{code:'SKILL_PROMPT_BUDGET_EXCEEDED',statusCode:422});
  const modelOptions = normalizeExecutionModelOptions({
    ...snapshotModelOptions,
    temperature: prompt.temperature,
    maxTokens: prompt.maxTokens,
    responseFormat: prompt.responseFormat,
  });
  delete modelOptions.skillBindings;
  return {
    snapshotVersion: controlPlane.snapshotVersion,
    promptConfig: {
      snapshotVersion: controlPlane.snapshotVersion,
      promptId: prompt.id,
      promptType: prompt.type,
      promptName: prompt.name,
      promptVersion: prompt.version,
      provider: prompt.provider,
      model: prompt.model,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      responseFormat: prompt.responseFormat,
      modelOptions,
      runtimeConfig: controlPlane.runtimeConfig,
      harnessConfig: controlPlane.harnessConfig,
      promptLayers,
      modelCapabilitySnapshot: controlPlane.modelCapabilitySnapshot,
      safetyContract: controlPlane.safetyContract,
      ...(controlPlane.snapshotVersion >= 3 ? {
        policySchemaVersion: controlPlane.policySchemaVersion,
        generationPolicy: controlPlane.generationPolicy,
        renderPolicy: controlPlane.renderPolicy,
        validationPolicy: controlPlane.validationPolicy,
      } : {}),
      controlPlaneReady: prompt.controlPlaneReady,
      renderedPrompt: assembled.renderedPrompt,
      renderedPromptHash: assembled.renderedPromptHash,
      promptLayerSources: assembled.layerSources,
      skillSnapshots:skills.map(({id,skillId,key,name,version,contentHash,sourceUrl})=>({id,skillId,key,name,version,contentHash,sourceUrl})),
      variableHash: sha256(JSON.stringify(fitted.variables)),
      ...(fitted.lengthGuard ? { lengthGuard: fitted.lengthGuard } : {}),
    },
  };
}

function validateStageModelConfig(type, prompt) {
  const provider = String(prompt?.provider || "").trim().toLowerCase();
  const model = String(prompt?.model || "").trim();
  const responseFormat = String(prompt?.responseFormat || "").trim().toLowerCase();
  const imageSize = String(prompt?.modelOptions?.imageSize || "").trim().toUpperCase();
  const fail = (message) => {
    const error = new Error(message);
    error.statusCode = 409;
    throw error;
  };

  if (!provider || !model) fail(`${type} provider and model are required`);
  validatePromptLayers(type, prompt.modelOptions || {});
  validateControlPlaneConfig(type, prompt);
  if (type === "integrated_brief" || type === "integrated_brief_v2") {
    if (provider !== "openai") fail(`${type} currently supports the openai provider only`);
    if (responseFormat !== "json_object") fail(`${type} responseFormat must be json_object`);
    return true;
  }
  if (type === "admin_prompt_translation") {
    if (provider !== "openai") fail("admin_prompt_translation currently supports the openai provider only");
    if (responseFormat !== "text") fail("admin_prompt_translation responseFormat must be text");
    return true;
  }
  if (type === "promo_page_generation") {
    if (provider !== "openai") fail("promo_page_generation currently supports the openai provider only");
    if (responseFormat !== "json_object") fail("promo_page_generation responseFormat must be json_object");
    return true;
  }
  if (type === "lofi_draft") {
    if (provider !== "openai") fail("lofi_draft currently supports the openai provider only");
    if (!/^gpt-image-/i.test(model)) fail("lofi_draft requires a GPT Image model");
    if (responseFormat !== "image") fail("lofi_draft responseFormat must be image");
    return true;
  }
  if (type === "final_design") {
    const openAiImageEdit = provider === "openai" && /^gpt-image-/i.test(model);
    const geminiImageEdit = provider === "google" && isApprovedGoogleImageModel(model);
    if (!openAiImageEdit && !geminiImageEdit) {
      fail("final_design requires an approved OpenAI GPT Image or Google Gemini image-edit model");
    }
    if (responseFormat !== "image") fail("final_design responseFormat must be image");
    if (provider === "google" && imageSize && !["1K", "2K", "4K"].includes(imageSize)) {
      fail("final_design imageSize must be one of: 1K, 2K, 4K");
    }
    return true;
  }
  if (type === "final_design_v2") {
    if (provider !== "openai") fail("final_design_v2 currently supports the openai provider only");
    if (!/^gpt-image-/i.test(model)) fail("final_design_v2 requires a GPT Image model");
    if (responseFormat !== "image") fail("final_design_v2 responseFormat must be image");
    return true;
  }
  if (type === "image_execution") {
    const openAiImage = provider === "openai" && /^gpt-image-/i.test(model);
    const geminiImage = provider === "google" && isApprovedGoogleImageModel(model);
    if (!openAiImage && !geminiImage) fail("image_execution requires an approved OpenAI GPT Image or Google Gemini image model");
    if (responseFormat !== "image") fail("image_execution responseFormat must be image");
    if (provider === "google" && imageSize && !["1K", "2K", "4K"].includes(imageSize)) {
      fail("image_execution imageSize must be one of: 1K, 2K, 4K");
    }
    return true;
  }
  if (type === "section_layout_planner"
    || type === "multi_component_layout_planner"
    || type === "section_composition_planner"
    || type === "promo_overview_parser"
    || type === "promo_template_recommender"
    || type === "promo_template_composer"
    || type === "promo_page_quality_reviewer"
    || type === "promo_page_schema_planner"
    || type === "promo_page_composer"
    || type === "promo_composition_editor"
    || type === "component_visual_analyzer"
    || type === "layout_reference_analyzer") {
    if (provider !== "openai") fail(`${type} currently supports the openai provider only`);
    if (responseFormat !== "json_object") fail(`${type} responseFormat must be json_object`);
    return true;
  }
  if (type === "section_background_image" || type === "component_image") {
    const openAiImage = provider === "openai" && /^gpt-image-/i.test(model);
    const geminiImage = provider === "google" && isApprovedGoogleImageModel(model);
    if (!openAiImage && !geminiImage) {
      fail(`${type} requires an approved OpenAI GPT Image or Google Gemini image model`);
    }
    if (responseFormat !== "image") fail(`${type} responseFormat must be image`);
    if (provider === "google" && imageSize && !["1K", "2K", "4K"].includes(imageSize)) {
      fail(`${type} imageSize must be one of: 1K, 2K, 4K`);
    }
    return true;
  }
  fail(`Unsupported prompt execution stage: ${type}`);
}

function hasPromptValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

module.exports = {
  APPROVED_GOOGLE_IMAGE_MODELS,
  completeDeclaredPromptVariables,
  createPromptExecutionSnapshot,
  createValidatedPromptExecutionSnapshot,
  isApprovedGoogleImageModel,
  validateStageModelConfig,
};
