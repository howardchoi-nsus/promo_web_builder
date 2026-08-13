const {
  ensureDefaultPromptTemplates,
  renderPrompt,
  sha256,
  toPromptTemplate,
  validatePromptExecutionVariables,
  validatePromptLayers,
  validatePromptTemplateContract,
} = require("./_prompt-template-store");
const { fitFinalDesignPromptVariables } = require("./_final-design-prompt-budget");
const { assembleEffectivePrompt } = require("./_prompt-assembler");
const { normalizeExecutionModelOptions } = require("./_worker-execution-contract");
const {
  normalizeControlPlanePromptConfig,
  validateControlPlaneConfig,
} = require("./_section-ai-control-plane");

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

  const prompt = toPromptTemplate(rows[0]);
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

  const fitted = type === "final_design"
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
  const assembled = assembleEffectivePrompt({
    type,
    renderedBody: fitted.renderedPrompt,
    variables: fitted.variables,
    promptLayers,
    harnessConfig: controlPlane.harnessConfig,
  });
  const modelOptions = normalizeExecutionModelOptions({
    ...snapshotModelOptions,
    temperature: prompt.temperature,
    maxTokens: prompt.maxTokens,
    responseFormat: prompt.responseFormat,
  });
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
  if (type === "integrated_brief") {
    if (provider !== "openai") fail("integrated_brief currently supports the openai provider only");
    if (responseFormat !== "json_object") fail("integrated_brief responseFormat must be json_object");
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
    const geminiImageEdit = provider === "google" && /^gemini-(?:2\.5-flash-image|3(?:\.1)?-(?:flash|pro)-image)$/i.test(model);
    if (!openAiImageEdit && !geminiImageEdit) {
      fail("final_design requires an approved OpenAI GPT Image or Google Gemini image-edit model");
    }
    if (responseFormat !== "image") fail("final_design responseFormat must be image");
    if (provider === "google" && imageSize && !["1K", "2K", "4K"].includes(imageSize)) {
      fail("final_design imageSize must be one of: 1K, 2K, 4K");
    }
    return true;
  }
  if (type === "image_execution") {
    const openAiImage = provider === "openai" && /^gpt-image-/i.test(model);
    const geminiImage = provider === "google" && /^gemini-(?:2\.5-flash-image|3(?:\.1)?-(?:flash|pro)-image)$/i.test(model);
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
    || type === "promo_page_composer"
    || type === "promo_composition_editor") {
    if (provider !== "openai") fail(`${type} currently supports the openai provider only`);
    if (responseFormat !== "json_object") fail(`${type} responseFormat must be json_object`);
    return true;
  }
  if (type === "section_background_image" || type === "component_image") {
    const openAiImage = provider === "openai" && /^gpt-image-/i.test(model);
    const geminiImage = provider === "google" && /^gemini-(?:2\.5-flash-image|3(?:\.1)?-(?:flash|pro)-image)$/i.test(model);
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
  completeDeclaredPromptVariables,
  createPromptExecutionSnapshot,
  validateStageModelConfig,
};
