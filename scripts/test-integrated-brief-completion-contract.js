const assert = require("node:assert/strict");
const {
  _test: { materializeRequiredMarkdownSections },
} = require("../api/promo-generation-integrated-brief-complete");

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

console.log("Integrated brief completion contract test passed");
