const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { PROMPT_TYPES } = require("../api/_prompt-template-store");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

for (const [type, contract] of Object.entries(PROMPT_TYPES)) {
  assert.equal(contract.body, undefined, `${type} contains a repository Prompt Body`);
  assert.equal(contract.filename, undefined, `${type} contains a runtime Prompt file fallback`);
}

const provider = read("api", "_promo-section-design-provider.js");
assert.doesNotMatch(provider, /process\.env\.(?:SECTION_LAYOUT_MODEL|SECTION_IMAGE_MODEL|ADMIN_PROMPT_TRANSLATION_MODEL)/);
assert.doesNotMatch(provider, /Correction required|CREATIVE INTENT|KEY VISUAL TEXT CONTRACT/);
assert.doesNotMatch(provider, /promptConfig\?\.renderedPrompt\s*\|\|\s*\[/);

const snapshot = read("api", "_prompt-execution-snapshot.js");
assert.doesNotMatch(snapshot, /INTEGRATED_BRIEF_OUTPUT_GUARD|Mandatory completion guard/);
assert.match(snapshot, /assembleEffectivePrompt/);

const assembler = read("api", "_prompt-assembler.js");
assert.match(assembler, /promptLayers\.completionGuard/);
assert.match(assembler, /promptLayers\.sourceDataPolicy/);

const composition = read("api", "_promo-page-composition-service.js");
assert.doesNotMatch(composition, /Correction required for Contract|Every sectionId must belong/);
assert.match(composition, /promptLayers\?\.repairPrompts/);

const keyVisual = read("api", "_section-key-visual-contract.js");
assert.doesNotMatch(keyVisual, /KEY VISUAL TEXT CONTRACT|Render no visible text/);

for (const file of [
  "promo-integrated-design-brief-generation.js",
  "promo-ui-design-image-generation.js",
  "promo-page-generation.js",
]) {
  const route = read("api", "prompts", file);
  assert.doesNotMatch(route, /FALLBACK_PROMPT|readFile|prompts\//, `${file} contains a Runtime Prompt fallback`);
  assert.match(route, /PROMPT_CONFIGURATION_REQUIRED/);
}

const markdownBuilder = read("api", "_promo-markdown-builders.js");
assert.doesNotMatch(markdownBuilder, /source of truth|Rendering rule: Do not render|must not be forced/);

console.log("No hardcoded Runtime Prompt contract tests passed.");
