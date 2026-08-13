const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  _test: {
    materializeRequiredMarkdownSections,
    normalizeIntegratedBrief,
  },
} = require("../api/promo-generation-integrated-brief-complete");

const promptMigration = fs.readFileSync(
  path.join(__dirname, "..", "db", "migrations", "056_prompt_layers_and_runtime_prompt_governance.sql"),
  "utf8"
);
for (const [index, line] of promptMigration.split("\n").entries()) {
  if (!line.includes(";")) continue;
  assert.match(
    line,
    /;\s*$/,
    `Migration line ${index + 1} contains a semicolon inside SQL text; naive deployment runners may split it`,
  );
}

assert.doesNotMatch(
  promptMigration,
  /"negativePrompt"\s*:\s*""/,
  "Integrated Brief prompt must not demonstrate an empty negativePrompt"
);
assert.match(promptMigration, /fallbackOutputValues/);
assert.match(promptMigration, /completionGuard/);
assert.doesNotMatch(promptMigration, /update\s+prompt_templates\s+set/i);
assert.match(promptMigration, /source_prompt_template_id/);
assert.match(promptMigration, /'draft'/);
assert.match(promptMigration, /prompt_template_histories/);

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
const configuredNegativePrompt = "Configured negative prompt fixture.";
const normalizedFallback = normalizeIntegratedBrief(
  { negativePrompt: "" },
  emptyNegativeMarkdown,
  { fallbackNegativePrompt: configuredNegativePrompt }
);
assert.equal(normalizedFallback.negativePrompt, configuredNegativePrompt);

const materializedFallback = materializeRequiredMarkdownSections(emptyNegativeMarkdown, normalizedFallback);
assert.match(materializedFallback, new RegExp(configuredNegativePrompt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.equal((materializedFallback.match(/^## Negative Prompt$/gm) || []).length, 1);
assert.ok(
  materializedFallback.indexOf("## Negative Prompt") < materializedFallback.indexOf("## Visual QA Checklist"),
  "Fallback Negative Prompt must precede Visual QA Checklist"
);

console.log("Integrated brief completion contract test passed");
