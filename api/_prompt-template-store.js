const { createHash } = require("node:crypto");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

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
        change_note
      )
      values (
        ${type},
        ${config.name},
        ${body},
        ${initialStatus},
        1,
        ${JSON.stringify(config.requiredVariables || [])}::jsonb,
        ${JSON.stringify(config.optionalVariables || [])}::jsonb,
        'Initial prompt imported from repository default.'
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

function renderPrompt(body, variables = {}) {
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
    changeNote: row.change_note || "",
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

module.exports = {
  PROMPT_TYPES,
  ensureDefaultPromptTemplates,
  getSql,
  normalizeVariables,
  parseBody,
  renderPrompt,
  sha256,
  toPromptTemplate,
  unresolvedVariables,
};
