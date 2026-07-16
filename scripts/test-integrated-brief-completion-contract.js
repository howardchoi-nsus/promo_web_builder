const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  _test: {
    DEFAULT_NEGATIVE_PROMPT,
    materializeRequiredMarkdownSections,
    normalizeIntegratedBrief,
  },
} = require("../api/promo-generation-integrated-brief-complete");

const integratedBriefPrompt = fs.readFileSync(
  path.join(__dirname, "..", "api", "prompts", "promo-integrated-design-brief-generation.js"),
  "utf8"
);

assert.doesNotMatch(
  integratedBriefPrompt,
  /"negativePrompt"\s*:\s*""/,
  "Integrated Brief prompt must not demonstrate an empty negativePrompt"
);
assert.match(integratedBriefPrompt, /negativePrompt is required and must be a non-empty, substantive string/);
assert.match(integratedBriefPrompt, /The ## Negative Prompt markdown section must contain the same substantive restrictions/);

const markdown = [
  "---",
  "type: integrated_design_brief",
  "sourceDocuments:",
  "  - design_prompt",
  "  - section_input_log",
  "---",
  "# Integrated Design Brief MD",
  "## Final Image Prompt Inputs",
  "Required image direction.",
].join("\n");
const brief = {
  negativePrompt: "No poster composition or cropped footer.",
  visualQaChecklist: Array.from({ length: 10 }, (_, index) => `Check item ${index + 1}`),
};

const result = materializeRequiredMarkdownSections(markdown, brief);
const negativeIndex = result.indexOf("## Negative Prompt");
const checklistIndex = result.indexOf("## Visual QA Checklist");

assert.ok(negativeIndex >= 0, "Negative Prompt heading must be restored");
assert.ok(checklistIndex >= 0, "Visual QA Checklist heading must be restored");
assert.ok(negativeIndex < checklistIndex, "Negative Prompt must precede Visual QA Checklist");
assert.match(result, /```text\nNo poster composition or cropped footer\.\n```/);
assert.equal((result.match(/^- \[ \] Check item \d+$/gm) || []).length, 10);

const unchanged = materializeRequiredMarkdownSections(result, brief);
assert.equal(unchanged, result, "Section restoration must be idempotent");

const emptyNegativeMarkdown = [
  markdown,
  "## Negative Prompt",
  "",
  "## Visual QA Checklist",
].join("\n");
const normalizedFallback = normalizeIntegratedBrief({ negativePrompt: "" }, emptyNegativeMarkdown);
assert.equal(normalizedFallback.negativePrompt, DEFAULT_NEGATIVE_PROMPT);

const materializedFallback = materializeRequiredMarkdownSections(emptyNegativeMarkdown, normalizedFallback);
assert.match(materializedFallback, new RegExp(DEFAULT_NEGATIVE_PROMPT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.equal((materializedFallback.match(/^## Negative Prompt$/gm) || []).length, 1);
assert.ok(
  materializedFallback.indexOf("## Negative Prompt") < materializedFallback.indexOf("## Visual QA Checklist"),
  "Fallback Negative Prompt must precede Visual QA Checklist"
);

console.log("Integrated brief completion contract test passed");
