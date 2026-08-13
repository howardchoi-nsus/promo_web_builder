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
const {
  completeDeclaredPromptVariables,
  validateStageModelConfig,
} = require("../api/_prompt-execution-snapshot");
const {
  brandPaletteFromTokenValues,
  buildSectionImagePromptVariables,
} = require("../api/_section-image-prompt-variables");

assert.match(sectionStore, /backgroundPromptText:\s*String\(source\.backgroundPromptText/);
assert.match(templateStore, /source_section\.status as section_status,\s*source_section\.ai_design/);
assert.doesNotMatch(templateStore, /coalesce\(ts\.ai_design,\s*source_section\.ai_design\)/);
assert.match(templateSections, /ai_design\s*=\s*\$\{JSON\.stringify/);
assert.match(admin, /backgroundPromptText:\s*section\.aiDesign\?\.backgroundPromptText/);
assert.match(admin, /body:\s*JSON\.stringify\(\{\s*id:\s*section\.id,\s*\.\.\.this\.wizardSectionFieldsEditor\s*\}\)/);
assert.match(html, /섹션 키비주얼 관리자 지침/);
assert.match(promptUpdate, /if \(current\.status !== "draft"\)/);
assert.match(promptActivate, /validateStageModelConfig\(target\.type/);
assert.deepEqual(PROMPT_TYPES.section_background_image.optionalVariables, [
  "fadeMode", "adminGuidance", "brandPalette", "aspectRatio",
]);
assert.match(runs, /buildSectionImagePromptVariables/);
assert.match(runs, /brandPalette:\s*body\.brandPalette/);
assert.match(runs, /aspectRatio:\s*String\(constraints\.imageAspectRatio \|\| "16:9"\)/);
assert.deepEqual(completeDeclaredPromptVariables({
  optionalVariables: ["fadeMode", "adminGuidance", "brandPalette", "aspectRatio"],
}, {
  fadeMode: "left",
  aspectRatio: "16:9",
}), {
  fadeMode: "left",
  aspectRatio: "16:9",
  adminGuidance: "",
  brandPalette: "",
});
assert.equal(brandPaletteFromTokenValues({
  "--app-bg": "#0B0D12",
  "--app-accent": "#FFB800",
}), "Background #0B0D12\nAccent #FFB800");
const builderVariables = buildSectionImagePromptVariables({
  promptType: "section_background_image",
  section: { name: "Hero", aiDesign: { imageAspectRatio: "16:9" } },
  sectionContent: { title: "Summer" },
  designSpec: { theme: { backgroundColor: "#0B0D12" } },
  designTokenValues: { "--app-bg": "#0B0D12", "--app-accent": "#FFB800" },
});
assert.equal(builderVariables.brandPalette, "Background #0B0D12\nAccent #FFB800");
assert.deepEqual(unresolvedVariables(renderPrompt(
  "{{sectionName}} {{contentJson}} {{backgroundColor}} {{fadeMode}} {{adminGuidance}} {{brandPalette}} {{aspectRatio}}",
  builderVariables,
)), []);
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
  modelOptions: {
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
}), true);
assert.equal(validateStageModelConfig("multi_component_layout_planner", {
  provider: "openai", model: "gpt-4.1-mini", responseFormat: "json_object",
  modelOptions: {
    executionSnapshotVersion: 2,
    harnessConfig: { version: 1, additionalInstructions: [] },
    runtimeConfig: { timeoutMs: 90000, maxAttempts: 1, retryBaseMs: 0, retryMaxMs: 0 },
    modelCapabilitySnapshot: {},
    safetyContract: {},
  },
}), true);
assert.equal(validateStageModelConfig("image_execution", {
  provider: "google", model: "gemini-3.1-flash-image", responseFormat: "image",
}), true);
assert.throws(() => validateStageModelConfig("component_image", {
  provider: "google", model: "gpt-4.1-mini", responseFormat: "image",
  modelOptions: {
    executionSnapshotVersion: 2,
    harnessConfig: { subjectScaleInstruction: "scale" },
    runtimeConfig: { timeoutMs: 120000, maxAttempts: 1, retryBaseMs: 0, retryMaxMs: 0, outputMimeType: "image/jpeg" },
    modelCapabilitySnapshot: {},
    safetyContract: {},
  },
}), /approved/);

console.log("Section AI prompt admin contract tests passed");
