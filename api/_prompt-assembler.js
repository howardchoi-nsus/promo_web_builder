const { renderPrompt, sha256, unresolvedVariables } = require("./_prompt-template-store");

const HARNESS_PROMPT_TYPES = new Set([
  "section_layout_planner",
  "multi_component_layout_planner",
  "section_composition_planner",
  "promo_overview_parser",
  "promo_template_recommender",
  "promo_template_composer",
  "promo_page_composer",
  "promo_composition_editor",
]);

function instructionList(value) {
  const values = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  return values.map((item) => String(item || "").trim()).filter(Boolean);
}

function assembleEffectivePrompt({ type, renderedBody, variables = {}, promptLayers = {}, harnessConfig = {} }) {
  const layers = [];
  const append = (key, values, { validateVariables = true } = {}) => {
    if (validateVariables) {
      const missing = instructionList(values)
        .flatMap((value) => unresolvedVariables(value))
        .filter((variable, index, all) => !Object.prototype.hasOwnProperty.call(variables, variable) && all.indexOf(variable) === index);
      if (missing.length) {
        const error = new Error(`Rendered ${type} prompt contains unresolved variables: ${missing.join(", ")}`);
        error.statusCode = 409;
        error.code = "PROMPT_VARIABLES_UNRESOLVED";
        throw error;
      }
    }
    const rendered = instructionList(values).map((value) => renderPrompt(value, variables));
    if (rendered.length) layers.push({ key, source: "prompt-version", instructions: rendered });
  };
  append("preInstructions", promptLayers.preInstructions);
  // The body has already been contract-validated and rendered by the template store.
  // Do not reinterpret {{...}} sequences supplied inside variable values (for example,
  // placeholders intentionally preserved while translating an admin prompt).
  append("body", [renderedBody], { validateVariables: false });
  append("conditionalInstructions", promptLayers.conditionalInstructions);
  append("additionalInstructions", promptLayers.additionalInstructions);
  append("sourceDataPolicy", promptLayers.sourceDataPolicy);
  append("postInstructions", promptLayers.postInstructions);
  append("completionGuard", promptLayers.completionGuard);
  append("negativeInstructions", promptLayers.negativeInstructions);
  if (HARNESS_PROMPT_TYPES.has(type)) append("harness.additionalInstructions", harnessConfig.additionalInstructions);

  const renderedPrompt = layers.flatMap((layer) => layer.instructions).join("\n").trim();
  return {
    renderedPrompt,
    renderedPromptHash: sha256(renderedPrompt),
    layerSources: layers.map((layer) => ({
      key: layer.key,
      source: layer.source,
      renderedHash: sha256(layer.instructions.join("\n")),
    })),
  };
}

module.exports = { assembleEffectivePrompt };
