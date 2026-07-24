const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  PROMPT_TYPES,
  extractPromptVariables,
  mergePromptTemplatePatch,
  validatePromptExecutionVariables,
  validatePromptTemplateContract,
} = require("../api/_prompt-template-store");

assert.deepEqual(mergePromptTemplatePatch({
  name: "Current",
  body: "{{sectionName}}",
  required_variables: ["sectionName"],
  optional_variables: ["adminGuidance"],
}, {
  name: "Updated",
}), {
  name: "Updated",
  body: "{{sectionName}}",
  requiredVariables: ["sectionName"],
  optionalVariables: ["adminGuidance"],
});
assert.deepEqual(mergePromptTemplatePatch({
  name: "Current",
  body: "{{sectionName}}",
  required_variables: ["sectionName"],
  optional_variables: ["adminGuidance"],
}, {
  requiredVariables: [],
  optional_variables: [],
}), {
  name: "Current",
  body: "{{sectionName}}",
  requiredVariables: [],
  optionalVariables: [],
});

for (const [type, config] of Object.entries(PROMPT_TYPES)) {
  if (!config.body) continue;
  assert.doesNotThrow(() => validatePromptTemplateContract(type, {
    body: config.body,
    requiredVariables: config.requiredVariables,
    optionalVariables: config.optionalVariables,
  }));
}

assert.deepEqual(extractPromptVariables("{{sectionName}} {{ sectionName }} {{contentJson}}"), [
  "sectionName",
  "contentJson",
]);
assert.throws(() => validatePromptTemplateContract("section_background_image", {
  body: "{{sectionName}} {{contentJson}} {{backgroundColor}} {{inventedCss}}",
  requiredVariables: ["sectionName", "contentJson", "backgroundColor"],
  optionalVariables: ["inventedCss"],
}), /unsupported/);
assert.throws(() => validatePromptTemplateContract("component_image", {
  body: "{{sectionName}} {{componentName}} {{contentJson}}",
  requiredVariables: ["sectionName", "componentName", "contentJson"],
  optionalVariables: [],
}), /fieldName/);
assert.doesNotThrow(() => validatePromptExecutionVariables("section_background_image", {
  backgroundColor: "#112233",
  fadeMode: "both",
  aspectRatio: "16:9",
}));
assert.throws(() => validatePromptExecutionVariables("section_background_image", {
  backgroundColor: "#112233",
  fadeMode: "diagonal",
}), /fadeMode/);
assert.throws(() => validatePromptExecutionVariables("section_background_image", {
  backgroundColor: "transparent",
  fadeMode: "none",
}), /backgroundColor/);

const root = path.resolve(__dirname, "..");
const updateRoute = fs.readFileSync(path.join(root, "api", "prompt-template.js"), "utf8");
const activationRoute = fs.readFileSync(path.join(root, "api", "prompt-template-activate.js"), "utf8");
const archiveRoute = fs.readFileSync(path.join(root, "api", "prompt-template-archive.js"), "utf8");
const executionSnapshot = fs.readFileSync(path.join(root, "api", "_prompt-execution-snapshot.js"), "utf8");
assert.match(updateRoute, /validatePromptTemplateContract\(current\.type/);
assert.match(updateRoute, /sql\.transaction\(\[/);
assert.match(activationRoute, /validatePromptTemplateContract\(target\.type/);
assert.match(activationRoute, /sql\.transaction\(mutationQueries\)/);
assert.match(archiveRoute, /sql\.transaction\(\[/);
assert.match(executionSnapshot, /validatePromptExecutionVariables\(type, variables\)/);

console.log("Prompt variable governance tests passed");
