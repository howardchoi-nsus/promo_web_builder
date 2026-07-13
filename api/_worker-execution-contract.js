const SNAPSHOT_VERSION = 2;

function normalizeExecutionModelOptions(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const normalized = { ...source };
  const alias = (canonical, ...keys) => {
    const found = keys.find((key) => source[key] !== undefined && source[key] !== null && source[key] !== "");
    if (found) normalized[canonical] = source[found];
  };

  alias("inputFidelity", "inputFidelity", "input_fidelity");
  alias("outputFormat", "outputFormat", "output_format");
  alias("background", "background");
  alias("quality", "quality");
  alias("size", "size");
  alias("aspectRatio", "aspectRatio", "aspect_ratio");
  alias("imageSize", "imageSize", "image_size");
  alias("temperature", "temperature");
  alias("maxTokens", "maxTokens", "max_tokens");
  alias("responseFormat", "responseFormat", "response_format");

  delete normalized.input_fidelity;
  delete normalized.output_format;
  delete normalized.max_tokens;
  delete normalized.response_format;
  delete normalized.aspect_ratio;
  delete normalized.image_size;
  delete normalized.provider;
  delete normalized.model;
  return normalized;
}

function workerExecutionSummary(snapshot) {
  const config = snapshot?.promptConfig || {};
  return {
    snapshotVersion: SNAPSHOT_VERSION,
    promptId: config.promptId || "",
    promptType: config.promptType || "",
    promptVersion: config.promptVersion || null,
    provider: config.provider || "",
    model: config.model || "",
    responseFormat: config.modelOptions?.responseFormat || "",
    modelOptions: normalizeExecutionModelOptions(config.modelOptions),
    renderedPrompt: config.renderedPrompt || "",
    renderedPromptHash: config.renderedPromptHash || "",
    variableHash: config.variableHash || "",
    lengthGuard: config.lengthGuard || null,
  };
}

function executionModelMeta(snapshot) {
  const execution = workerExecutionSummary(snapshot);
  return {
    provider: execution.provider,
    model: execution.model,
    responseFormat: execution.responseFormat,
    modelOptions: execution.modelOptions,
    promptVersion: execution.promptVersion,
    snapshotVersion: execution.snapshotVersion,
  };
}

module.exports = {
  SNAPSHOT_VERSION,
  executionModelMeta,
  normalizeExecutionModelOptions,
  workerExecutionSummary,
};
