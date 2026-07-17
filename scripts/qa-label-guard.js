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

const requiredWorkflowGuards = [
  {
    label: "template section names remain internal labels",
    pattern: /Template section names are internal (?:structure|planning) labels only/,
  },
  {
    label: "visible template section labels are forbidden",
    pattern: /(?:Avoid:[^"\n]*visible template section labels|Never render section names as visible UI text)/,
  },
  {
    label: "section content and layout roles are preserved",
    pattern: /(?:Preserve the content and layout role|Do not add, remove, reinterpret, or prioritize content outside the integrated brief)/,
  },
];

const generatedBriefRequiredPhrases = [
  "Template section names",
  "visible UI text",
  "side labels",
  "annotation columns",
  "diagram legends",
];

const generatedBriefRiskyFinalPromptPhrases = [
  "Include all sections from Template 4",
  "Show all sections",
  "Render section names",
  "Visible section labels",
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

function checkRequiredPatterns(files, guards) {
  const failures = [];
  for (const file of files) {
    const source = read(file);
    for (const guard of guards) {
      if (!guard.pattern.test(source)) {
        failures.push(`${file}: missing guard for "${guard.label}"`);
      }
    }
  }
  assert(!failures.length, `Required workflow guards missing:\n${failures.join("\n")}`);
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

function extractFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? match[1] : "";
}

function extractSection(source, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escapedHeading}[\\s\\S]*?(?=\\n##\\s+|$)`, "i");
  const match = source.match(pattern);
  return match ? match[0] : "";
}

function checkGeneratedBrief(file) {
  const source = read(file);
  const lowerSource = source.toLowerCase();
  const frontmatter = extractFrontmatter(source);
  const lowerFrontmatter = frontmatter.toLowerCase();
  const finalPromptInputs = extractSection(source, "## Final Image Prompt Inputs");
  const failures = [];

  if (!/^\s*type:\s*integrated_design_brief\s*$/im.test(frontmatter)) {
    failures.push("frontmatter type must be integrated_design_brief");
  }

  if (
    !/sourceDocuments\s*:/i.test(frontmatter) ||
    !lowerFrontmatter.includes("design_prompt") ||
    !lowerFrontmatter.includes("section_input_log")
  ) {
    failures.push("sourceDocuments must include design_prompt and section_input_log");
  }

  const missingGuards = generatedBriefRequiredPhrases.filter(
    (phrase) => !lowerSource.includes(phrase.toLowerCase()),
  );
  if (missingGuards.length) {
    failures.push(`label guard missing: ${missingGuards.join(", ")}`);
  }

  const usedRiskyPhrases = generatedBriefRiskyFinalPromptPhrases.filter((phrase) =>
    finalPromptInputs.toLowerCase().includes(phrase.toLowerCase()),
  );
  if (usedRiskyPhrases.length) {
    failures.push(
      `Final Image Prompt Inputs contains risky section-label phrasing: ${usedRiskyPhrases.join(", ")}`,
    );
  }

  if (/###\s*Section Order/i.test(finalPromptInputs) && /\n\s*1\.\s*Header/i.test(finalPromptInputs)) {
    failures.push("Final Image Prompt Inputs must not expose numbered Template section names to the image model");
  }

  assert(!failures.length, `${file}: generated brief QA failed:\n- ${failures.join("\n- ")}`);
}

function main() {
  const generatedBriefFiles = process.argv.slice(2);
  const allFiles = [...promptFiles, ...workflowFiles];
  checkOldPhrasesAbsent(allFiles);
  checkRequiredPhrases(promptFiles, requiredPromptPhrases);
  checkRequiredPatterns(workflowFiles, requiredWorkflowGuards);
  checkWorkflows();
  for (const file of generatedBriefFiles) {
    checkGeneratedBrief(file);
  }
  console.log("QA label guard passed");
}

main();
