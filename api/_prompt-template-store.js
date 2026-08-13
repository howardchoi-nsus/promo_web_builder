const { createHash } = require("node:crypto");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

// This catalog is an execution contract only. Prompt prose and model defaults
// belong to versioned Admin settings and must never be bootstrapped from code.
const PROMPT_TYPES = {
  integrated_brief: {
    name: "Integrated Brief Generation",
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
    requiredVariables: ["integratedDesignBriefMarkdown"],
    optionalVariables: ["requiredVisibleCopy", "sectionContentMapping"],
  },
  lofi_draft: {
    name: "LO-FI Draft Prompt",
    requiredVariables: ["integratedDesignBriefMarkdown"],
    optionalVariables: ["sectionContentMapping"],
  },
  final_design: {
    name: "Final Design Generation",
    requiredVariables: ["integratedDesignBriefMarkdown", "confirmedDraftImageProxyUrl"],
    optionalVariables: ["confirmedDraftPrompt", "sectionContentMapping", "layoutFidelityPolicy"],
  },
  section_layout_planner: {
    name: "Section Layout Planner",
    requiredVariables: ["sectionJson", "contentJson", "constraintsJson", "tokenSetJson"],
    optionalVariables: [],
  },
  multi_component_layout_planner: {
    name: "Multi-component Layout Planner",
    requiredVariables: [
      "sectionJson", "selectionJson", "geometryJson", "contentJson",
      "allowedOperationsJson", "gapTokensJson",
    ],
    optionalVariables: [],
  },
  section_composition_planner: {
    name: "Natural-language Section Composition Planner",
    requiredVariables: ["instruction", "sectionJson", "contentJson", "constraintsJson", "tokenSetJson"],
    optionalVariables: ["generateBackgroundImage", "imageGuidance"],
  },
  promo_overview_parser: {
    name: "Promotion Overview Parser",
    requiredVariables: ["naturalLanguage", "allowedValuesJson"],
    optionalVariables: ["generationMode", "currentOverviewJson"],
  },
  promo_template_recommender: {
    name: "Promotion Template Recommender",
    requiredVariables: ["overviewJson", "candidatesJson"],
    optionalVariables: [],
  },
  promo_template_composer: {
    name: "Promotion Template Composition Planner",
    requiredVariables: ["overviewJson", "candidateStructuresJson", "allowedContentPathsJson"],
    optionalVariables: [],
  },
  promo_page_composer: {
    name: "AI Promotion Page Composer",
    requiredVariables: ["overviewJson", "candidateSnapshotJson", "constraintsJson"],
    optionalVariables: [],
  },
  promo_composition_editor: {
    name: "AI Promotion Composition Editor",
    requiredVariables: ["instruction", "currentSnapshotJson", "allowedOperationsJson"],
    optionalVariables: [],
  },
  section_background_image: {
    name: "Section Key Visual",
    requiredVariables: ["sectionName", "contentJson", "backgroundColor"],
    optionalVariables: ["fadeMode", "adminGuidance", "brandPalette", "aspectRatio"],
  },
  component_image: {
    name: "Component Field Image",
    requiredVariables: ["sectionName", "componentName", "fieldName", "contentJson"],
    optionalVariables: ["adminGuidance"],
  },
  admin_prompt_translation: {
    name: "Admin Prompt Translation",
    requiredVariables: ["sourcePrompt"],
    optionalVariables: [],
  },
  promo_page_generation: {
    name: "Promo Page Generation",
    requiredVariables: [
      "brand", "slug", "designConceptSummary", "designPromptContext", "designConceptJson",
      "categories", "colors", "fonts", "promoJson", "designJson", "styleSource",
      "styleSourceLabel", "companyPreset", "hasOverride",
    ],
    optionalVariables: [],
  },
};

const CONTROLLED_PROMPT_TYPES = new Set([
  "section_layout_planner",
  "multi_component_layout_planner",
  "section_composition_planner",
  "promo_overview_parser",
  "promo_template_recommender",
  "promo_template_composer",
  "promo_page_composer",
  "promo_composition_editor",
  "section_background_image",
  "component_image",
]);

const DEFAULT_IMAGE_HARNESS_CONFIG = Object.freeze({
  version: 1,
  safeAreaInstructions: {},
  creativeIntentRules: [],
  sectionBackgroundRules: [],
  componentImageRules: [],
  negativeRules: [],
  keyVisualTextInstructions: {},
  subjectScaleInstruction: "",
});

function defaultPromptControlPlane(type) {
  void type;
  return {};
}

function normalizePromptControlPlaneOptions(type, value, { includeDefaults = false } = {}) {
  const source = normalizeModelOptions(value);
  if (!CONTROLLED_PROMPT_TYPES.has(type)) return { ...source };
  const defaults = includeDefaults ? defaultPromptControlPlane(type) : {};
  const objectValue = (key) => {
    const candidate = source[key];
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) return candidate;
    return defaults[key] || {};
  };
  const version = Number(source.executionSnapshotVersion ?? defaults.executionSnapshotVersion);
  return {
    ...source,
    ...(Number.isInteger(version) && version > 0 ? { executionSnapshotVersion: version } : {}),
    harnessConfig: objectValue("harnessConfig"),
    runtimeConfig: objectValue("runtimeConfig"),
    modelCapabilitySnapshot: objectValue("modelCapabilitySnapshot"),
    safetyContract: objectValue("safetyContract"),
    ...(Number(version) >= 3 && isImagePromptType(type) ? {
      policySchemaVersion: Number(source.policySchemaVersion ?? defaults.policySchemaVersion ?? 1),
      generationPolicy: objectValue("generationPolicy"),
      renderPolicy: objectValue("renderPolicy"),
      validationPolicy: objectValue("validationPolicy"),
    } : {}),
  };
}

function isImagePromptType(type) {
  return type === "section_background_image" || type === "component_image";
}

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
  // Kept as a compatibility hook for existing callers. Runtime initialization
  // is intentionally a no-op: prompts must be imported and activated through
  // the Admin lifecycle instead of being silently created from source code.
  void sql;
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

function validatePromptLayers(type, modelOptions = {}) {
  const layers = normalizeModelOptions(modelOptions).promptLayers || {};
  const harness = normalizeModelOptions(modelOptions).harnessConfig || {};
  const fail = (key) => {
    const error = new Error(`${type} requires Admin-managed prompt layer: ${key}`);
    error.statusCode = 422;
    error.code = "PROMPT_LAYER_REQUIRED";
    throw error;
  };
  const nonEmptyList = (value) => Array.isArray(value)
    && value.some((item) => String(item || "").trim());
  const nonEmptyString = (value) => Boolean(String(value || "").trim());
  if (type === "integrated_brief") {
    if (!nonEmptyList(layers.completionGuard)) fail("completionGuard");
    if (!nonEmptyList(layers.sourceDataPolicy)) fail("sourceDataPolicy");
    if (!nonEmptyString(layers.fallbackOutputValues?.negativePrompt)) {
      fail("fallbackOutputValues.negativePrompt");
    }
  }
  if (type === "promo_page_composer") {
    if (!nonEmptyString(layers.repairPrompts?.candidateScope)) fail("repairPrompts.candidateScope");
    if (!nonEmptyString(layers.repairPrompts?.contractV3)) fail("repairPrompts.contractV3");
  }
  if (type === "section_background_image") {
    if (!nonEmptyList(harness.creativeIntentRules)) fail("harnessConfig.creativeIntentRules");
    if (!nonEmptyString(harness.keyVisualTextInstructions?.none)) {
      fail("harnessConfig.keyVisualTextInstructions.none");
    }
    if (!nonEmptyString(harness.keyVisualTextInstructions?.explicit)) {
      fail("harnessConfig.keyVisualTextInstructions.explicit");
    }
    if (!nonEmptyString(harness.subjectScaleInstruction)) fail("harnessConfig.subjectScaleInstruction");
  }
  if (type === "component_image" && !nonEmptyString(harness.subjectScaleInstruction)) {
    fail("harnessConfig.subjectScaleInstruction");
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
  const modelOptions = normalizePromptControlPlaneOptions(row.type, row.model_options, {
    includeDefaults: false,
  });
  const storedOptions = normalizeModelOptions(row.model_options);
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    body: row.body || "",
    status: row.status,
    version: Number(row.version || 1),
    lineageId: row.lineage_id || null,
    sourcePromptTemplateId: row.source_prompt_template_id || null,
    validatedAt: row.validated_at || null,
    requiredVariables: Array.isArray(row.required_variables) ? row.required_variables : [],
    optionalVariables: Array.isArray(row.optional_variables) ? row.optional_variables : [],
    provider: row.provider || "",
    model: row.model || "",
    temperature: row.temperature === null || row.temperature === undefined ? null : Number(row.temperature),
    maxTokens: row.max_tokens === null || row.max_tokens === undefined ? null : Number(row.max_tokens),
    responseFormat: row.response_format || "",
    modelOptions,
    promptLayers: modelOptions.promptLayers && typeof modelOptions.promptLayers === "object"
      ? modelOptions.promptLayers
      : {},
    harnessConfig: modelOptions.harnessConfig || {},
    runtimeConfig: modelOptions.runtimeConfig || {},
    modelCapabilitySnapshot: modelOptions.modelCapabilitySnapshot || {},
    safetyContract: modelOptions.safetyContract || {},
    executionSnapshotVersion: Number(modelOptions.executionSnapshotVersion || 1),
    policySchemaVersion: Number(modelOptions.policySchemaVersion || 0),
    generationPolicy: modelOptions.generationPolicy || {},
    renderPolicy: modelOptions.renderPolicy || {},
    validationPolicy: modelOptions.validationPolicy || {},
    controlPlaneReady: !CONTROLLED_PROMPT_TYPES.has(row.type)
      || [
        "harnessConfig", "runtimeConfig", "modelCapabilitySnapshot", "safetyContract", "executionSnapshotVersion",
        ...(Number(storedOptions.executionSnapshotVersion || 1) >= 3 && isImagePromptType(row.type)
          ? ["policySchemaVersion", "generationPolicy", "renderPolicy", "validationPolicy"]
          : []),
      ]
        .every((key) => Object.prototype.hasOwnProperty.call(storedOptions, key)),
    changeNote: row.change_note || "",
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

module.exports = {
  CONTROLLED_PROMPT_TYPES,
  DEFAULT_IMAGE_HARNESS_CONFIG,
  PROMPT_TYPES,
  defaultPromptControlPlane,
  ensureDefaultPromptTemplates,
  extractPromptVariables,
  getSql,
  mergePromptTemplatePatch,
  normalizeModelOptions,
  normalizePromptControlPlaneOptions,
  normalizeNumber,
  normalizeVariables,
  parseBody,
  promptVariableContract,
  renderPrompt,
  sha256,
  toPromptTemplate,
  unresolvedVariables,
  validatePromptExecutionVariables,
  validatePromptLayers,
  validatePromptTemplateContract,
};
