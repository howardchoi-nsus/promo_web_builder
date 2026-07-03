const fs = require("fs");

const promptFiles = [
  "prompts/promo-integrated-design-brief-generation.md",
  "prompts/promo-ui-design-image-generation.md",
  "api/prompts/promo-integrated-design-brief-generation.js",
  "api/prompts/promo-ui-design-image-generation.js",
];

const workflowFiles = [
  "n8n/promo-ui-design-image-generator.workflow.json",
  "n8n/Promo UI Design Image Generator_test (2).gemini-fixed.json",
  "n8n/Promo UI Design Image Generator_testing.gemini-http.json",
];

const oldRiskyPhrases = [
  "All seven Template 4 sections visible",
  "All seven Template 4 sections must be visible",
  "Every Template 4 section must be visible",
  "Preserve all 7 Template 4 sections in order",
  "it must explicitly include all 7 Template 4 sections",
  "Follow Template 4 order exactly",
];

const requiredPromptPhrases = [
  "Template section names",
  "visible UI text",
  "side labels",
  "wireframe labels",
  "diagram legends",
];

const requiredWorkflowPhrases = [
  "Template section names are internal structure labels only",
  "Avoid: visible template section labels",
  "Preserve the content and layout role",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function checkOldPhrasesAbsent(files) {
  const failures = [];
  for (const file of files) {
    const source = read(file);
    for (const phrase of oldRiskyPhrases) {
      if (source.includes(phrase)) {
        failures.push(`${file}: "${phrase}"`);
      }
    }
  }
  assert(!failures.length, `Old risky phrases remain:\n${failures.join("\n")}`);
}

function checkRequiredPhrases(files, phrases) {
  const failures = [];
  for (const file of files) {
    const source = read(file);
    for (const phrase of phrases) {
      if (!source.includes(phrase)) {
        failures.push(`${file}: missing "${phrase}"`);
      }
    }
  }
  assert(!failures.length, `Required guard phrases missing:\n${failures.join("\n")}`);
}

function checkWorkflows() {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  for (const file of workflowFiles) {
    const workflow = JSON.parse(read(file));
    for (const node of workflow.nodes || []) {
      const code = node.parameters && node.parameters.jsCode;
      if (code) {
        new AsyncFunction(code);
      }
    }
  }
}

function main() {
  const allFiles = [...promptFiles, ...workflowFiles];
  checkOldPhrasesAbsent(allFiles);
  checkRequiredPhrases(promptFiles, requiredPromptPhrases);
  checkRequiredPhrases(workflowFiles, requiredWorkflowPhrases);
  checkWorkflows();
  console.log("QA label guard passed");
}

main();
