const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const sectionStore = read("api", "_wizard-content-sections-store.js");
const templateStore = read("api", "_wizard-form-templates-store.js");
const templateSections = read("api", "wizard-form-template-sections.js");
const admin = read("prototype", "app.js");
const html = read("prototype", "index.html");
const promptUpdate = read("api", "prompt-template.js");
const promptActivate = read("api", "prompt-template-activate.js");
const { validateStageModelConfig } = require("../api/_prompt-execution-snapshot");

assert.match(sectionStore, /backgroundPromptText:\s*String\(source\.backgroundPromptText/);
assert.match(templateStore, /coalesce\(ts\.ai_design,\s*source_section\.ai_design\)/);
assert.match(templateSections, /ai_design\s*=\s*\$\{JSON\.stringify/);
assert.match(admin, /backgroundPromptText:\s*section\.aiDesign\?\.backgroundPromptText/);
assert.match(admin, /aiDesign:\s*this\.wizardFormTemplateSectionEditor\.aiDesign/);
assert.match(html, /섹션 배경 이미지 관리자 지침/);
assert.match(promptUpdate, /if \(current\.status === "active"\)/);
assert.match(promptActivate, /validateStageModelConfig\(target\.type/);
assert.equal(validateStageModelConfig("section_background_image", {
  provider: "google", model: "gemini-3.1-flash-image", responseFormat: "image",
}), true);
assert.equal(validateStageModelConfig("multi_component_layout_planner", {
  provider: "openai", model: "gpt-4.1-mini", responseFormat: "json_object",
}), true);
assert.equal(validateStageModelConfig("image_execution", {
  provider: "google", model: "gemini-3.1-flash-image", responseFormat: "image",
}), true);
assert.throws(() => validateStageModelConfig("component_image", {
  provider: "google", model: "gpt-4.1-mini", responseFormat: "image",
}), /approved/);

console.log("Section AI prompt admin contract tests passed");
