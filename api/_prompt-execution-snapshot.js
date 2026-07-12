const {
  ensureDefaultPromptTemplates,
  renderPrompt,
  sha256,
  toPromptTemplate,
  unresolvedVariables,
} = require("./_prompt-template-store");
const { fitFinalDesignPromptVariables } = require("./_final-design-prompt-budget");
const { normalizeExecutionModelOptions } = require("./_worker-execution-contract");

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
  validateStageModelConfig(type, prompt);
  const missingRequired = prompt.requiredVariables.filter((key) => !hasPromptValue(variables[key]));
  if (missingRequired.length) {
    const error = new Error(`Required ${type} prompt variables are missing: ${missingRequired.join(", ")}`);
    error.statusCode = 409;
    throw error;
  }

  const fitted = type === "final_design"
    ? fitFinalDesignPromptVariables(prompt.body, variables, renderPrompt)
    : { variables, renderedPrompt: renderPrompt(prompt.body, variables), lengthGuard: null };
  const renderedPrompt = fitted.renderedPrompt;
  const unresolved = unresolvedVariables(renderedPrompt);
  if (unresolved.length) {
    const error = new Error(`Rendered ${type} prompt contains unresolved variables: ${unresolved.join(", ")}`);
    error.statusCode = 409;
    throw error;
  }

  const modelOptions = normalizeExecutionModelOptions({
    ...(prompt.modelOptions || {}),
    temperature: prompt.temperature,
    maxTokens: prompt.maxTokens,
    responseFormat: prompt.responseFormat,
  });
  return {
    promptConfig: {
      promptId: prompt.id,
      promptType: prompt.type,
      promptName: prompt.name,
      promptVersion: prompt.version,
      provider: prompt.provider,
      model: prompt.model,
      modelOptions,
      renderedPrompt,
      renderedPromptHash: sha256(renderedPrompt),
      variableHash: sha256(JSON.stringify(fitted.variables)),
      ...(fitted.lengthGuard ? { lengthGuard: fitted.lengthGuard } : {}),
    },
  };
}

function validateStageModelConfig(type, prompt) {
  const provider = String(prompt?.provider || "").trim().toLowerCase();
  const model = String(prompt?.model || "").trim();
  const responseFormat = String(prompt?.responseFormat || "").trim().toLowerCase();
  const fail = (message) => {
    const error = new Error(message);
    error.statusCode = 409;
    throw error;
  };

  if (!provider || !model) fail(`${type} provider and model are required`);
  if (type === "integrated_brief") {
    if (provider !== "openai") fail("integrated_brief currently supports the openai provider only");
    if (responseFormat !== "json_object") fail("integrated_brief responseFormat must be json_object");
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
  createPromptExecutionSnapshot,
  validateStageModelConfig,
};
