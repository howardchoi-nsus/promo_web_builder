const { createHash } = require("node:crypto");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

// Prompt templates are DB-managed after first boot, but repository defaults remain
// the recovery baseline for new environments and accidental table resets.
const PROMPT_TYPES = {
  integrated_brief: {
    name: "Integrated Brief Generation",
    filename: "promo-integrated-design-brief-generation.md",
    requiredVariables: [
      "runKey",
      "designPromptMarkdown",
      "sectionInputLogMarkdown",
    ],
    optionalVariables: [
      "promptGroupId",
      "promoTitle",
      "selectedMd",
      "selectedMdSlug",
      "templateName",
      "canvasSize",
      "pageWidth",
    ],
  },
  image_execution: {
    name: "Image Execution Prompt",
    body: [
      "Execute the Integrated Design Brief exactly.",
      "Do not summarize, reinterpret, infer, omit, or add promotional content.",
      "Render only the specified promotional web UI.",
      "",
      "Mandatory execution rules:",
      "- Use the Integrated Design Brief as the only source of truth.",
      "- Render all visible sections in the specified order.",
      "- Render all Required Exact Visible Copy.",
      "- Preserve CTA labels, legal text, footer text, and step content.",
      "- Apply the design token and style rules as constraints.",
      "- Do not create new copy.",
      "- Do not replace copy with generic marketing text.",
      "- Do not render internal labels, annotations, section labels, or checklist text.",
      "",
      "Integrated Design Brief:",
      "{{integratedDesignBriefMarkdown}}",
      "",
      "Required Exact Visible Copy:",
      "{{requiredVisibleCopy}}",
      "",
      "Required Section Content Mapping:",
      "{{sectionContentMapping}}",
    ].join("\n"),
    requiredVariables: ["integratedDesignBriefMarkdown"],
    optionalVariables: ["requiredVisibleCopy", "sectionContentMapping"],
  },
  lofi_draft: {
    name: "LO-FI Draft Prompt",
    body: [
      "Create a low-fidelity wireframe draft for the promotional web page.",
      "Use the Integrated Design Brief as the only source of truth.",
      "Prioritize structure, content placement, section order, and visible copy.",
      "Use simple grayscale blocks, wireframe-level shapes, and minimal decoration.",
      "Do not create a polished final design.",
      "Do not add new promotional copy.",
      "Do not omit legal, CTA, step, footer, or required visible copy.",
      "",
      "Integrated Design Brief:",
      "{{integratedDesignBriefMarkdown}}",
      "",
      "Required Section Content Mapping:",
      "{{sectionContentMapping}}",
    ].join("\n"),
    requiredVariables: ["integratedDesignBriefMarkdown"],
    optionalVariables: ["sectionContentMapping"],
  },
  final_design: {
    name: "Final Design Generation",
    body: [
      "Polish the confirmed LO-FI draft into a production-quality promotional web UI.",
      "The confirmed LO-FI image is the structural source of truth.",
      "Preserve section order, relative placement, content grouping, CTA position, and visual hierarchy.",
      "Apply the Integrated Design Brief for copy, design tokens, brand styling, and compliance constraints.",
      "Do not invent a new layout, add promotional copy, omit required content, or crop the footer/legal area.",
      "Only move a major block when necessary to prevent clipping or overlap.",
      "Return a polished webpage design, not a poster, presentation slide, annotated wireframe, or editor canvas.",
      "",
      "Integrated Design Brief:",
      "{{integratedDesignBriefMarkdown}}",
      "",
      "Confirmed LO-FI Draft Prompt:",
      "{{confirmedDraftPrompt}}",
      "",
      "Confirmed LO-FI Reference Image:",
      "{{confirmedDraftImageProxyUrl}}",
      "",
      "Required Section Content Mapping:",
      "{{sectionContentMapping}}",
      "",
      "Layout Fidelity Policy:",
      "{{layoutFidelityPolicy}}",
    ].join("\n"),
    requiredVariables: ["integratedDesignBriefMarkdown", "confirmedDraftImageProxyUrl"],
    optionalVariables: ["confirmedDraftPrompt", "sectionContentMapping", "layoutFidelityPolicy"],
  },
  section_layout_planner: {
    name: "Section Layout Planner",
    body: [
      "Plan one promotional web section using only the supplied component instances, layout regions, style slots and promo tokens.",
      "Never invent item keys, regions, slots, tokens, CSS, selectors, HTML, or text rendered inside images.",
      "Section: {{sectionJson}}",
      "Content: {{contentJson}}",
      "Constraints: {{constraintsJson}}",
      "Token set: {{tokenSetJson}}",
    ].join("\n"),
    requiredVariables: ["sectionJson", "contentJson", "constraintsJson", "tokenSetJson"],
    optionalVariables: [],
  },
  multi_component_layout_planner: {
    name: "Multi-component Layout Planner",
    body: [
      "Choose one safe layout operation for the selected component instances.",
      "Return only an allowlisted operation, the supplied target item keys, an approved gap token or null, and a concise rationale.",
      "Never return CSS, HTML, selectors, raw coordinates, widths, heights, transforms, or invented item keys.",
      "Section: {{sectionJson}}",
      "Selected components: {{selectionJson}}",
      "Current geometry: {{geometryJson}}",
      "Registered content: {{contentJson}}",
      "Allowed operations: {{allowedOperationsJson}}",
      "Approved gap tokens: {{gapTokensJson}}",
    ].join("\n"),
    requiredVariables: [
      "sectionJson", "selectionJson", "geometryJson", "contentJson",
      "allowedOperationsJson", "gapTokensJson",
    ],
    optionalVariables: [],
  },
  section_background_image: {
    name: "Section Background Image",
    body: [
      "Create a polished supporting background image for the promotional web section.",
      "Base the visual concept only on the registered section content.",
      "The main visual subject should occupy approximately 60 to 70 percent of the canvas.",
      "Section: {{sectionName}}",
      "Registered content: {{contentJson}}",
      "Section background color: {{backgroundColor}}",
      "Fade mode: {{fadeMode}}",
      "Administrator guidance: {{adminGuidance}}",
    ].join("\n"),
    requiredVariables: ["sectionName", "contentJson", "backgroundColor"],
    optionalVariables: ["fadeMode", "adminGuidance", "brandPalette", "aspectRatio"],
  },
  component_image: {
    name: "Component Field Image",
    body: [
      "Create a polished promotional image for one component field.",
      "Base the visual concept only on the registered section content and component-field purpose.",
      "Use the full canvas unless the administrator guidance requests another composition.",
      "Section: {{sectionName}}",
      "Component: {{componentName}}",
      "Field: {{fieldName}}",
      "Registered content: {{contentJson}}",
      "Administrator guidance: {{adminGuidance}}",
    ].join("\n"),
    requiredVariables: ["sectionName", "componentName", "fieldName", "contentJson"],
    optionalVariables: ["adminGuidance"],
  },
};

const DEFAULT_MODEL_SETTINGS = {
  integrated_brief: {
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 12000,
    responseFormat: "json_object",
  },
  image_execution: {
    provider: "google",
    model: "gemini-3.1-flash-image",
    temperature: 0.4,
    maxTokens: null,
    responseFormat: "image",
  },
  lofi_draft: {
    provider: "openai",
    model: "gpt-image-1",
    temperature: 0.4,
    maxTokens: null,
    responseFormat: "image",
  },
  final_design: {
    provider: "openai",
    model: "gpt-image-1",
    temperature: null,
    maxTokens: null,
    responseFormat: "image",
    quality: "high",
    size: "1024x1536",
    inputFidelity: "high",
  },
  section_layout_planner: {
    provider: "openai",
    model: process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini",
    temperature: 0.2,
    maxTokens: 6000,
    responseFormat: "json_object",
  },
  multi_component_layout_planner: {
    provider: "openai",
    model: process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini",
    temperature: 0.2,
    maxTokens: 2000,
    responseFormat: "json_object",
  },
  section_background_image: {
    provider: String(process.env.SECTION_IMAGE_PROVIDER || "gemini").toLowerCase() === "gemini" ? "google" : "openai",
    model: process.env.SECTION_IMAGE_MODEL || "gemini-3.1-flash-image",
    temperature: 0.4,
    maxTokens: null,
    responseFormat: "image",
  },
  component_image: {
    provider: String(process.env.SECTION_IMAGE_PROVIDER || "gemini").toLowerCase() === "gemini" ? "google" : "openai",
    model: process.env.SECTION_IMAGE_MODEL || "gemini-3.1-flash-image",
    temperature: 0.4,
    maxTokens: null,
    responseFormat: "image",
  },
};

function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    const error = new Error("DATABASE_URL is not configured");
    error.statusCode = 500;
    throw error;
  }
  return neon(databaseUrl);
}

async function ensureDefaultPromptTemplates(sql) {
  for (const [type, config] of Object.entries(PROMPT_TYPES)) {
    const body = config.body || await readPromptFile(config.filename);
    const activeRows = await sql`
      select id::text
      from prompt_templates
      where type = ${type}
        and status = 'active'
      limit 1
    `;
    // Keep exactly one active default per type on first install. Later repository
    // default changes should not overwrite admin-edited prompts during deployment.
    const initialStatus = activeRows.length ? "draft" : "active";
    await sql`
      insert into prompt_templates (
        type,
        name,
        body,
        status,
        version,
        required_variables,
        optional_variables,
        change_note,
        provider,
        model,
        temperature,
        max_tokens,
        response_format,
        model_options
      )
      values (
        ${type},
        ${config.name},
        ${body},
        ${initialStatus},
        1,
        ${JSON.stringify(config.requiredVariables || [])}::jsonb,
        ${JSON.stringify(config.optionalVariables || [])}::jsonb,
        'Initial prompt imported from repository default.',
        ${DEFAULT_MODEL_SETTINGS[type]?.provider || ""},
        ${DEFAULT_MODEL_SETTINGS[type]?.model || ""},
        ${DEFAULT_MODEL_SETTINGS[type]?.temperature ?? null},
        ${DEFAULT_MODEL_SETTINGS[type]?.maxTokens ?? null},
        ${DEFAULT_MODEL_SETTINGS[type]?.responseFormat || ""},
        ${JSON.stringify(DEFAULT_MODEL_SETTINGS[type] || {})}::jsonb
      )
      on conflict (type, name) do nothing
    `;
  }
}

async function readPromptFile(filename) {
  const candidates = [
    path.join(process.cwd(), "prompts", filename),
    path.join(__dirname, "..", "prompts", filename),
  ];
  let lastError;
  for (const promptPath of candidates) {
    try {
      return await readFile(promptPath, "utf8");
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return body;
  return {};
}

function normalizeVariables(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeModelOptions(value) {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function mergePromptTemplatePatch(current = {}, patch = {}) {
  const has = (camelKey, snakeKey = camelKey) => (
    Object.prototype.hasOwnProperty.call(patch, camelKey)
    || Object.prototype.hasOwnProperty.call(patch, snakeKey)
  );
  return {
    name: has("name") ? String(patch.name || "").trim() : String(current.name || "").trim(),
    body: has("body") ? String(patch.body || "") : String(current.body || ""),
    requiredVariables: has("requiredVariables", "required_variables")
      ? normalizeVariables(patch.requiredVariables ?? patch.required_variables)
      : normalizeVariables(current.required_variables ?? current.requiredVariables),
    optionalVariables: has("optionalVariables", "optional_variables")
      ? normalizeVariables(patch.optionalVariables ?? patch.optional_variables)
      : normalizeVariables(current.optional_variables ?? current.optionalVariables),
  };
}

function extractPromptVariables(body) {
  const matches = String(body || "").matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g);
  return Array.from(new Set(Array.from(matches, (match) => match[1])));
}

function promptVariableContract(type) {
  const config = PROMPT_TYPES[String(type || "").trim()];
  if (!config) {
    const error = new Error(`Unsupported prompt template type: ${type}`);
    error.statusCode = 422;
    throw error;
  }
  return {
    requiredVariables: normalizeVariables(config.requiredVariables),
    optionalVariables: normalizeVariables(config.optionalVariables),
  };
}

function validatePromptTemplateContract(type, template = {}) {
  const contract = promptVariableContract(type);
  const requiredVariables = normalizeVariables(template.requiredVariables);
  const optionalVariables = normalizeVariables(template.optionalVariables);
  const declared = new Set([...requiredVariables, ...optionalVariables]);
  const allowed = new Set([...contract.requiredVariables, ...contract.optionalVariables]);
  const placeholders = extractPromptVariables(template.body);
  const duplicateDeclarations = requiredVariables.filter((key) => optionalVariables.includes(key));
  const unknownDeclarations = Array.from(declared).filter((key) => !allowed.has(key));
  const unknownPlaceholders = placeholders.filter((key) => !allowed.has(key));
  const undeclaredPlaceholders = placeholders.filter((key) => !declared.has(key));
  const missingRequiredDeclarations = contract.requiredVariables.filter((key) => !requiredVariables.includes(key));
  const missingRequiredPlaceholders = contract.requiredVariables.filter((key) => !placeholders.includes(key));
  const problems = [
    duplicateDeclarations.length ? `variables declared as both required and optional: ${duplicateDeclarations.join(", ")}` : "",
    unknownDeclarations.length ? `unsupported declared variables: ${unknownDeclarations.join(", ")}` : "",
    unknownPlaceholders.length ? `unsupported placeholders: ${unknownPlaceholders.join(", ")}` : "",
    undeclaredPlaceholders.length ? `undeclared placeholders: ${undeclaredPlaceholders.join(", ")}` : "",
    missingRequiredDeclarations.length ? `required variable declarations are missing: ${missingRequiredDeclarations.join(", ")}` : "",
    missingRequiredPlaceholders.length ? `required placeholders are missing: ${missingRequiredPlaceholders.join(", ")}` : "",
  ].filter(Boolean);
  if (problems.length) {
    const error = new Error(`Invalid ${type} prompt variable contract: ${problems.join("; ")}`);
    error.statusCode = 422;
    error.code = "PROMPT_VARIABLE_CONTRACT_INVALID";
    throw error;
  }
  return {
    requiredVariables,
    optionalVariables,
    placeholders,
  };
}

function validatePromptExecutionVariables(type, variables = {}) {
  if (type !== "section_background_image") return true;
  const fadeMode = String(variables.fadeMode || "none").trim().toLowerCase();
  if (!["none", "left", "right", "both"].includes(fadeMode)) {
    const error = new Error("section_background_image fadeMode must be one of: none, left, right, both");
    error.statusCode = 422;
    error.code = "PROMPT_VARIABLE_VALUE_INVALID";
    throw error;
  }
  const backgroundColor = String(variables.backgroundColor || "").trim();
  if (!/^#[0-9a-f]{6}$/i.test(backgroundColor)) {
    const error = new Error("section_background_image backgroundColor must be a six-digit hex color");
    error.statusCode = 422;
    error.code = "PROMPT_VARIABLE_VALUE_INVALID";
    throw error;
  }
  const aspectRatio = String(variables.aspectRatio || "").trim();
  if (aspectRatio && !/^\d{1,2}:\d{1,2}$/.test(aspectRatio)) {
    const error = new Error("section_background_image aspectRatio must use W:H format");
    error.statusCode = 422;
    error.code = "PROMPT_VARIABLE_VALUE_INVALID";
    throw error;
  }
  return true;
}

function renderPrompt(body, variables = {}) {
  // Unknown placeholders are intentionally preserved so prompt QA can report
  // unresolved variables instead of silently sending incomplete instructions.
  return String(body || "").replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key] ?? "") : match
  ));
}

function unresolvedVariables(renderedPrompt) {
  const matches = String(renderedPrompt || "").match(/{{\s*[a-zA-Z0-9_]+\s*}}/g) || [];
  return Array.from(new Set(matches.map((match) => match.replace(/[{}\s]/g, ""))));
}

function sha256(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function toPromptTemplate(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    body: row.body || "",
    status: row.status,
    version: Number(row.version || 1),
    requiredVariables: Array.isArray(row.required_variables) ? row.required_variables : [],
    optionalVariables: Array.isArray(row.optional_variables) ? row.optional_variables : [],
    provider: row.provider || "",
    model: row.model || "",
    temperature: row.temperature === null || row.temperature === undefined ? null : Number(row.temperature),
    maxTokens: row.max_tokens === null || row.max_tokens === undefined ? null : Number(row.max_tokens),
    responseFormat: row.response_format || "",
    modelOptions: row.model_options && typeof row.model_options === "object" && !Array.isArray(row.model_options)
      ? row.model_options
      : {},
    changeNote: row.change_note || "",
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

module.exports = {
  PROMPT_TYPES,
  ensureDefaultPromptTemplates,
  extractPromptVariables,
  getSql,
  mergePromptTemplatePatch,
  normalizeModelOptions,
  normalizeNumber,
  normalizeVariables,
  parseBody,
  renderPrompt,
  sha256,
  toPromptTemplate,
  unresolvedVariables,
  validatePromptExecutionVariables,
  validatePromptTemplateContract,
};
