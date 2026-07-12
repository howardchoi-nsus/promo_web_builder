const fs = require("fs");
const path = require("path");

const workflowPath = path.join(__dirname, "..", "n8n", "Promo Final Design Worker.image-edit.json");
const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
const byName = new Map(workflow.nodes.map((node) => [node.name, node]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const normalize = byName.get("Normalize Final Design Payload");
const download = byName.get("Download Confirmed LO-FI Image");
const generate = byName.get("Generate Final Design Image");
const save = byName.get("Save Final Design Result");

assert(workflow.active === false, "Repository workflow fixture must stay inactive");
assert(normalize && download && generate && save, "Final worker nodes are incomplete");

const normalizeFields = new Set(normalize.parameters.assignments.assignments.map((item) => item.name));
for (const field of ["confirmedDraftImageProxyUrl", "layoutFidelityPolicy", "provider", "model", "modelOptions", "renderedPrompt", "promptVersion", "renderedPromptHash"]) {
  assert(normalizeFields.has(field), `Normalize node is missing ${field}`);
}

assert(String(download.parameters.url).includes("confirmedDraftImageProxyUrl"), "LO-FI proxy URL is not used");
assert(download.parameters.options?.response?.response?.responseFormat === "file", "LO-FI response must be binary");
assert(download.retryOnFail && download.maxTries === 2, "LO-FI download must retry once");

assert(generate.parameters.url === "https://api.openai.com/v1/images/edits", "Final worker must use image edits");
assert(generate.parameters.contentType === "multipart-form-data", "Image edit request must be multipart");
const bodyFields = generate.parameters.bodyParameters.parameters;
assert(bodyFields.some((field) => field.name === "image" && field.parameterType === "formBinaryData"), "Binary image field is missing");
assert(bodyFields.some((field) => field.name === "input_fidelity" && String(field.value).includes("high")), "High input fidelity is missing");
assert(bodyFields.some((field) => field.name === "input_fidelity" && String(field.value).includes("inputFidelity")), "Canonical inputFidelity is not mapped");
assert(bodyFields.some((field) => field.name === "prompt" && String(field.value).includes("Normalize Final Design Payload")), "Immutable renderedPrompt is not used");
assert(!byName.has("Render Final Design Prompt"), "Final worker must not re-render the active prompt");
assert(generate.retryOnFail && generate.maxTries === 2, "Image edit must retry once");
assert(generate.onError === "continueRegularOutput", "Image edit errors must reach the failure callback");

const saveFields = Object.fromEntries(save.parameters.bodyParameters.parameters.map((field) => [field.name, field.value]));
assert(String(saveFields.status).includes("failed"), "Failure status callback is missing");
assert(saveFields.errorMessage, "Failure error message callback is missing");
assert(String(saveFields.modelMeta).includes("image_edit"), "Image edit metadata is missing");

const authHeader = generate.parameters.headerParameters.parameters.find((header) => header.name === "Authorization");
assert(authHeader && authHeader.value === "Bearer __RETAIN_EXISTING_N8N_KEY__", "Repository fixture must not contain a live API key");

console.log("Final worker contract test passed");
