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
const { validateStageModelConfig } = require("../api/_prompt-execution-snapshot");

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
  assert.equal(config.body, undefined, `${type} must not contain repository prompt prose`);
}

assert.deepEqual(PROMPT_TYPES.promo_overview_parser.requiredVariables, [
  "naturalLanguage",
  "allowedValuesJson",
]);
assert.deepEqual(PROMPT_TYPES.promo_overview_parser.optionalVariables, [
  "generationMode",
  "currentOverviewJson",
]);
assert.deepEqual(PROMPT_TYPES.admin_prompt_translation.requiredVariables, ["sourcePrompt"]);

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
assert.doesNotThrow(() => validateStageModelConfig("section_background_image", {
  provider: "google",
  model: "gemini-3.1-flash-image",
  responseFormat: "image",
  modelOptions: {
    imageSize: "2K",
    executionSnapshotVersion: 2,
    runtimeConfig: { timeoutMs: 120000, maxAttempts: 1, retryBaseMs: 0, retryMaxMs: 0, outputMimeType: "image/jpeg" },
    modelCapabilitySnapshot: {},
    safetyContract: {},
    harnessConfig: {
      creativeIntentRules: ["creative"],
      keyVisualTextInstructions: { none: "none", explicit: "explicit" },
      subjectScaleInstruction: "scale",
    },
  },
}));
assert.throws(() => validateStageModelConfig("section_background_image", {
  provider: "google",
  model: "gemini-3.1-flash-image",
  responseFormat: "image",
  modelOptions: {
    imageSize: "1920px",
    executionSnapshotVersion: 2,
    runtimeConfig: { timeoutMs: 120000, maxAttempts: 1, retryBaseMs: 0, retryMaxMs: 0, outputMimeType: "image/jpeg" },
    modelCapabilitySnapshot: {},
    safetyContract: {},
    harnessConfig: {
      creativeIntentRules: ["creative"],
      keyVisualTextInstructions: { none: "none", explicit: "explicit" },
      subjectScaleInstruction: "scale",
    },
  },
}), /imageSize must be one of/);

const root = path.resolve(__dirname, "..");
const updateRoute = fs.readFileSync(path.join(root, "api", "prompt-template.js"), "utf8");
const activationRoute = fs.readFileSync(path.join(root, "api", "prompt-template-activate.js"), "utf8");
const archiveRoute = fs.readFileSync(path.join(root, "api", "prompt-template-archive.js"), "utf8");
const draftRoute = fs.readFileSync(path.join(root, "api", "prompt-template-draft.js"), "utf8");
const validateRoute = fs.readFileSync(path.join(root, "api", "prompt-template-validate.js"), "utf8");
const governanceMigration = fs.readFileSync(
  path.join(root, "db", "migrations", "056_prompt_layers_and_runtime_prompt_governance.sql"),
  "utf8",
);
assert.doesNotMatch(
  governanceMigration,
  /every \{\{placeholder\}\}/,
  "Admin translation instructions must not declare a literal placeholder as a runtime variable",
);
const rollbackRoute = fs.readFileSync(path.join(root, "api", "prompt-template-rollback.js"), "utf8");
const lifecycleMigration = fs.readFileSync(
  path.join(root, "db", "migrations", "033_prompt_template_version_lifecycle.sql"),
  "utf8"
);
const executionSnapshot = fs.readFileSync(path.join(root, "api", "_prompt-execution-snapshot.js"), "utf8");
assert.match(updateRoute, /validatePromptTemplateContract\(current\.type/);
assert.match(updateRoute, /current\.status !== "draft"/);
assert.doesNotMatch(updateRoute, /nextVersion/);
assert.match(updateRoute, /with updated as \(/);
assert.match(updateRoute, /and status = 'draft'/);
assert.match(draftRoute, /source_prompt_template_id/);
assert.match(draftRoute, /coalesce\(max\(version\), 0\) \+ 1/);
assert.match(validateRoute, /status = 'validated'/);
assert.match(validateRoute, /validateStageModelConfig\(current\.type/);
assert.match(activationRoute, /validatePromptTemplateContract\(target\.type/);
assert.match(activationRoute, /target\.status !== "validated"/);
assert.match(activationRoute, /with deactivated as \(/);
assert.match(activationRoute, /and status = 'validated'/);
assert.match(archiveRoute, /with updated as \(/);
assert.match(archiveRoute, /and status = \$\{current\.status\}/);
assert.match(rollbackRoute, /\["inactive", "archived"\]\.includes\(target\.status\)/);
assert.match(rollbackRoute, /with deactivated as \(/);
assert.match(rollbackRoute, /and status = \$\{target\.status\}/);
assert.match(lifecycleMigration, /prompt_templates_lineage_version_uidx/);
assert.match(lifecycleMigration, /status in \('draft', 'validated'\)/);
assert.match(executionSnapshot, /completeDeclaredPromptVariables\(prompt, variables\)/);
assert.match(executionSnapshot, /validatePromptExecutionVariables\(type, completedVariables\)/);

console.log("Prompt variable governance tests passed");
