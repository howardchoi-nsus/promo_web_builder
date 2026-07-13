const FINAL_DESIGN_PROMPT_MAX_LENGTH = 30000;

function fitFinalDesignPromptVariables(template, variables, renderPrompt) {
  const source = variables && typeof variables === "object" ? variables : {};
  const fitted = { ...source };
  const originalPrompt = renderPrompt(template, fitted);
  const originalLength = originalPrompt.length;
  const compactedFields = [];

  while (renderPrompt(template, fitted).length > FINAL_DESIGN_PROMPT_MAX_LENGTH) {
    const candidates = Object.entries(fitted)
      .filter(([, value]) => typeof value === "string" && value.length > 256)
      .sort((left, right) => right[1].length - left[1].length);
    if (!candidates.length) break;

    const [key, value] = candidates[0];
    const currentLength = renderPrompt(template, fitted).length;
    const overflow = currentLength - FINAL_DESIGN_PROMPT_MAX_LENGTH;
    const nextLength = Math.max(256, value.length - overflow - 96);
    fitted[key] = preservePromptEdges(value, nextLength, key);
    if (!compactedFields.includes(key)) compactedFields.push(key);
  }

  const renderedPrompt = renderPrompt(template, fitted);
  if (renderedPrompt.length > FINAL_DESIGN_PROMPT_MAX_LENGTH) {
    const error = new Error(
      `Final design prompt cannot be reduced below ${FINAL_DESIGN_PROMPT_MAX_LENGTH} characters (${renderedPrompt.length})`
    );
    error.statusCode = 422;
    throw error;
  }

  return {
    variables: fitted,
    renderedPrompt,
    lengthGuard: {
      maxLength: FINAL_DESIGN_PROMPT_MAX_LENGTH,
      originalLength,
      renderedLength: renderedPrompt.length,
      compacted: compactedFields.length > 0,
      compactedFields,
    },
  };
}

function preservePromptEdges(value, maxLength, fieldName) {
  const text = String(value || "");
  if (text.length <= maxLength) return text;

  const marker = `\n\n[${fieldName} compacted to fit the image API prompt limit]\n\n`;
  const contentBudget = Math.max(0, maxLength - marker.length);
  const headLength = Math.ceil(contentBudget * 0.72);
  const tailLength = Math.max(0, contentBudget - headLength);
  return `${text.slice(0, headLength)}${marker}${tailLength ? text.slice(-tailLength) : ""}`;
}

module.exports = {
  FINAL_DESIGN_PROMPT_MAX_LENGTH,
  fitFinalDesignPromptVariables,
  preservePromptEdges,
};
