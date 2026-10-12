const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const workflowPath = path.join(root, "n8n", "Promo Final Design V2 Worker.direct-generation.json");
const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
const nodeByName = new Map(workflow.nodes.map((node) => [node.name, node]));

assert.equal(workflow.active, false, "imported V2 workflow must require explicit activation");
assert.ok(nodeByName.has("Generate Final Design V2 with OpenAI"));
assert.ok(!nodeByName.has("Download Confirmed LO-FI Image"), "V2 must not download a LO-FI image");
assert.ok(!nodeByName.has("Prepare Gemini Image Input"), "V2 must not prepare an image-edit reference");

const generator = nodeByName.get("Generate Final Design V2 with OpenAI");
assert.equal(generator.parameters.url, "https://api.openai.com/v1/images/generations");
assert.match(generator.parameters.jsonBody, /gpt-image-2\.5-sunburst/);
assert.doesNotMatch(generator.parameters.jsonBody, /input_fidelity|confirmedDraft/i);

const callback = nodeByName.get("Save Final Design Result");
assert.match(callback.parameters.url, /promo-generation-v2-final-designs$/);
const callbackFields = Object.fromEntries(
  callback.parameters.bodyParameters.parameters.map((entry) => [entry.name, entry.value])
);
assert.equal(callbackFields.pipelineVersion, "v2");
assert.match(callbackFields.modelMeta, /text_to_image/);

const apiSource = fs.readFileSync(path.join(root, "api", "promo-generation-final-designs.js"), "utf8");
assert.match(apiSource, /createPromptExecutionSnapshot\([\s\S]*"final_design_v2"/);
assert.match(apiSource, /confirmed_draft_id,[\s\S]*null,/);
assert.match(apiSource, /stage: "final_design_v2"/);

const wizardSource = fs.readFileSync(path.join(root, "prototype", "promo-wizard.js"), "utf8");
assert.match(wizardSource, /promo-generation-v2-final-designs/);
assert.match(wizardSource, /pipelineVersion: "v2"/);
assert.doesNotMatch(wizardSource.slice(0, 1800), /LO-FI 시안 생성 및 선택/);

console.log("Final Design V2 worker contract passed.");
