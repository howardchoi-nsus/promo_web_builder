const fs = require("fs");
const path = require("path");

const workflowPath = path.join(__dirname, "..", "n8n", "Promo Lo-Fi Draft Worker.admin-driven.json");
const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
const byName = new Map(workflow.nodes.map((node) => [node.name, node]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const normalize = byName.get("Normalize Draft Payload");
const generate = byName.get("Generate LO-FI Draft Image");
const check = byName.get("Check Image Base64");
const save = byName.get("Save LO-FI Draft Result");

assert(workflow.active === false, "Repository workflow fixture must stay inactive");
assert(normalize && generate && check && save, "LO-FI worker nodes are incomplete");
assert(!byName.has("Render LO-FI Draft Prompt"), "LO-FI worker must not re-render the active prompt");

const normalizeFields = new Set(normalize.parameters.assignments.assignments.map((item) => item.name));
for (const field of ["provider", "model", "modelOptions", "renderedPrompt", "promptVersion", "renderedPromptHash"]) {
  assert(normalizeFields.has(field), `Normalize node is missing ${field}`);
}

const bodyFields = Object.fromEntries(generate.parameters.bodyParameters.parameters.map((field) => [field.name, field.value]));
assert(String(bodyFields.model).includes("Normalize Draft Payload"), "Admin model snapshot is not used");
assert(String(bodyFields.prompt).includes("renderedPrompt"), "Immutable renderedPrompt is not used");
assert(String(bodyFields.size).includes("modelOptions.size"), "Admin size option is not used");
assert(String(bodyFields.quality).includes("modelOptions.quality"), "Admin quality option is not used");
assert(generate.retryOnFail && generate.maxTries === 2, "LO-FI generation must retry once");
assert(generate.onError === "continueRegularOutput", "LO-FI generation error must reach callback");

const checkFields = new Set(check.parameters.assignments.assignments.map((field) => field.name));
assert(checkFields.has("generationError"), "LO-FI generation error extraction is missing");
const saveFields = Object.fromEntries(save.parameters.bodyParameters.parameters.map((field) => [field.name, field.value]));
assert(String(saveFields.status).includes("failed"), "LO-FI failed status callback is missing");
assert(saveFields.errorMessage, "LO-FI error message callback is missing");

const authHeader = generate.parameters.headerParameters.parameters.find((header) => header.name === "Authorization");
assert(authHeader?.value === "Bearer __RETAIN_EXISTING_N8N_KEY__", "Repository fixture must not contain a live API key");

console.log("LO-FI worker contract test passed");
