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
const runs = read("api", "promo-section-design-runs.js");
const { PROMPT_TYPES, renderPrompt, unresolvedVariables } = require("../api/_prompt-template-store");
const { validateStageModelConfig } = require("../api/_prompt-execution-snapshot");

assert.match(sectionStore, /backgroundPromptText:\s*String\(source\.backgroundPromptText/);
assert.match(templateStore, /source_section\.status as section_status,\s*source_section\.ai_design/);
assert.doesNotMatch(templateStore, /coalesce\(ts\.ai_design,\s*source_section\.ai_design\)/);
assert.match(templateSections, /ai_design\s*=\s*\$\{JSON\.stringify/);
assert.match(admin, /backgroundPromptText:\s*section\.aiDesign\?\.backgroundPromptText/);
assert.match(admin, /body:\s*JSON\.stringify\(\{\s*id:\s*section\.id,\s*\.\.\.this\.wizardSectionFieldsEditor\s*\}\)/);
assert.match(html, /섹션 배경 이미지 관리자 지침/);
assert.match(promptUpdate, /if \(current\.status === "active"\)/);
assert.match(promptActivate, /validateStageModelConfig\(target\.type/);
assert.deepEqual(PROMPT_TYPES.section_background_image.optionalVariables, [
  "fadeMode", "adminGuidance", "brandPalette", "aspectRatio",
]);
assert.match(runs, /brandPalette:\s*promptVariable\(body\.brandPalette\)/);
assert.match(runs, /aspectRatio:\s*String\(constraints\.imageAspectRatio \|\| "16:9"\)/);
assert.deepEqual(unresolvedVariables(renderPrompt(
  "{{sectionName}} {{contentJson}} {{backgroundColor}} {{fadeMode}} {{adminGuidance}} {{brandPalette}} {{aspectRatio}}",
  {
    sectionName: "Hero",
    contentJson: "{}",
    backgroundColor: "#000000",
    fadeMode: "left",
    adminGuidance: "",
    brandPalette: "",
    aspectRatio: "16:9",
  }
)), []);
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
