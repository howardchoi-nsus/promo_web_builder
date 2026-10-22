const { PROMPT_TYPES } = require("./_prompt-template-store");

function buildPromptVariableCatalog(promptTypes = PROMPT_TYPES) {
  const variablesByKey = new Map();
  const contracts = Object.entries(promptTypes).map(([promptType, config]) => {
    const requiredVariables = Array.from(new Set(config.requiredVariables || []));
    const optionalVariables = Array.from(new Set(config.optionalVariables || []));
    for (const [requirement, variables] of [["required", requiredVariables], ["optional", optionalVariables]]) {
      for (const key of variables) {
        if (!variablesByKey.has(key)) {
          variablesByKey.set(key, { key, requiredCount: 0, optionalCount: 0, usages: [] });
        }
        const variable = variablesByKey.get(key);
        if (requirement === "required") variable.requiredCount += 1;
        else variable.optionalCount += 1;
        variable.usages.push({
          promptType,
          promptName: config.name || promptType,
          requirement,
        });
      }
    }
    return {
      promptType,
      promptName: config.name || promptType,
      requiredVariables,
      optionalVariables,
    };
  });
  const variables = Array.from(variablesByKey.values())
    .map((variable) => ({
      ...variable,
      promptTypeCount: new Set(variable.usages.map((usage) => usage.promptType)).size,
      usages: variable.usages.sort((left, right) => (
        left.promptType.localeCompare(right.promptType, "en", { sensitivity: "base" })
      )),
    }))
    .sort((left, right) => (
      right.promptTypeCount - left.promptTypeCount
      || left.key.localeCompare(right.key, "en", { sensitivity: "base", numeric: true })
    ));
  return {
    variables,
    contracts,
    summary: {
      variableCount: variables.length,
      promptTypeCount: contracts.length,
      requiredUsageCount: variables.reduce((sum, variable) => sum + variable.requiredCount, 0),
      optionalUsageCount: variables.reduce((sum, variable) => sum + variable.optionalCount, 0),
    },
  };
}

module.exports = { buildPromptVariableCatalog };
