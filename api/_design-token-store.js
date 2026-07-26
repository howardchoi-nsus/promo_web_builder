const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");
const { randomUUID } = require("node:crypto");

const VALUE_TYPES = [
  "color", "length", "number", "font", "fontFamily", "shadow", "gradient",
  "duration", "easing", "enum",
];
const SAFE_CSS_PROPERTIES = new Set([
  "color", "background-color", "border-color", "border-radius", "border-width",
  "box-shadow", "font-family", "font-size", "font-weight", "line-height",
  "letter-spacing", "padding", "gap", "margin", "width", "height", "max-width",
  "min-width", "min-height", "outline-color", "background-image", "z-index",
  "transition-duration", "transition-delay", "transition-timing-function",
]);
const TOKEN_KEY_PATTERN = /^--(?:promo|app)-[a-z0-9-]+$/;

function getSql() {
  const url = getDatabaseUrl();
  if (!url) { const error = new Error("DATABASE_URL is not configured"); error.statusCode = 500; throw error; }
  return neon(url);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") { try { return JSON.parse(body); } catch { return {}; } }
  return typeof body === "object" && !Array.isArray(body) ? body : {};
}

function createTokenSetKey(name) {
  const base = String(name || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "token-set";
  return `${base}-${randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

function validateTokenValue(definition, value) {
  const text = String(value ?? "").trim();
  if (!text) return "token value is required";
  if (definition.value_type === "color"
    && !/^(?:#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?|rgba?\(\s*(?:\d+|\d*\.\d+)(?:\s*,\s*(?:\d+|\d*\.\d+)){2}(?:\s*,\s*(?:\d+|\d*\.\d+))?\s*\))$/.test(text)) {
    return "color must be a hex, rgb, or rgba value";
  }
  if (definition.value_type === "length" && !/^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw)$/.test(text)) return "length requires an allowed CSS unit";
  if (definition.value_type === "duration" && !/^(?:\d+|\d*\.\d+)(?:ms|s)$/.test(text)) return "duration requires ms or s";
  if (definition.value_type === "number" && !Number.isFinite(Number(text))) return "number is invalid";
  if (definition.value_type === "easing"
    && !/^(?:linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\(\s*-?(?:\d+|\d*\.\d+)\s*,\s*-?(?:\d+|\d*\.\d+)\s*,\s*-?(?:\d+|\d*\.\d+)\s*,\s*-?(?:\d+|\d*\.\d+)\s*\))$/.test(text)) {
    return "easing value is invalid";
  }
  if (definition.value_type === "gradient"
    && !/^(?:linear|radial|conic)-gradient\(.+\)$/i.test(text)) return "gradient value is invalid";
  if (definition.value_type === "enum" && Array.isArray(definition.allowed_values)
    && definition.allowed_values.length && !definition.allowed_values.includes(text)) return "enum value is not allowed";
  if (/url\s*\(|expression\s*\(|[;{}]/i.test(text)) return "unsafe CSS token value";
  return "";
}

function parseCsvRows(csvText) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  const text = String(csvText || "").replace(/^\uFEFF/, "");
  for (let index = 0; index <= text.length; index += 1) {
    const char = text[index] || "\n";
    if (quoted && char === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === ',') { row.push(cell); cell = ""; }
    else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell); cell = "";
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
    } else cell += char;
  }
  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, String(values[index] || "").trim()])));
}

function normalizeTokenEntries(entries, definitions) {
  const byKey = new Map((definitions || []).map((definition) => [definition.token_key, definition]));
  const normalized = [];
  const errors = [];
  const seen = new Set();
  (Array.isArray(entries) ? entries : []).forEach((entry, index) => {
    const tokenKey = String(entry?.tokenKey || entry?.token_key || "").trim();
    const valueIndex = Math.max(0, Number.parseInt(entry?.valueIndex ?? entry?.value_index ?? 0, 10) || 0);
    const identity = `${tokenKey}:${valueIndex}`;
    const definition = byKey.get(tokenKey);
    if (!tokenKey) errors.push({ index, tokenKey, message: "token key is required" });
    else if (!TOKEN_KEY_PATTERN.test(tokenKey)) errors.push({ index, tokenKey, message: "token key namespace is not allowed" });
    else if (seen.has(identity)) errors.push({ index, tokenKey, valueIndex, message: "duplicate token key and value index" });
    else if (!definition) errors.push({ index, tokenKey, message: "token is not registered in the promo catalog" });
    else if (!(Array.isArray(definition.css_properties) && definition.css_properties.length
      ? definition.css_properties
      : [definition.css_property]).every((property) => SAFE_CSS_PROPERTIES.has(property))) {
      errors.push({ index, tokenKey, message: "CSS property is not allowed" });
    }
    else {
      const message = validateTokenValue(definition, entry?.value);
      if (message) errors.push({ index, tokenKey, message });
    }
    seen.add(identity);
    normalized.push({
      tokenKey,
      valueIndex,
      value: String(entry?.value ?? "").trim(),
      valueLight: String(entry?.valueLight ?? entry?.value_light ?? entry?.value ?? "").trim(),
      valueDark: String(entry?.valueDark ?? entry?.value_dark ?? "").trim(),
      activeTheme: String(entry?.activeTheme || entry?.active_theme || "dark").trim() === "light" ? "light" : "dark",
      metadata: entry?.metadata && typeof entry.metadata === "object" && !Array.isArray(entry.metadata)
        ? entry.metadata
        : {},
    });
  });
  const namespacesPresent = new Set(normalized.map((entry) => entry.tokenKey.split("-")[2]).filter(Boolean));
  (definitions || []).filter((definition) => definition.required).forEach((definition) => {
    const namespace = String(definition.token_key || "").split("-")[2];
    if (!namespacesPresent.has(namespace)) return;
    if (![...seen].some((identity) => identity.startsWith(`${definition.token_key}:`))) {
      errors.push({ tokenKey: definition.token_key, message: "required token is missing" });
    }
  });
  return { normalized, errors };
}

async function fetchTokenDefinitions(sql) {
  return sql`select * from promo_design_token_definitions order by category, token_key`;
}

async function fetchTokenSets(sql, { activeOnly = false } = {}) {
  const rows = activeOnly ? await sql`
    select token_set.id::text, token_set.set_key, token_set.name, token_set.description, token_set.status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.source_name, version.source_hash, version.change_note, version.updated_at
    from promo_design_token_sets token_set
    join promo_design_token_set_versions version on version.token_set_id = token_set.id and version.status = 'active'
    where token_set.status = 'active' order by token_set.name
  ` : await sql`
    select token_set.id::text, token_set.set_key, token_set.name, token_set.description, token_set.status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.source_name, version.source_hash, version.change_note, version.updated_at
    from promo_design_token_sets token_set
    left join lateral (
      select * from promo_design_token_set_versions candidate where candidate.token_set_id = token_set.id
      order by case candidate.status when 'active' then 0 when 'draft' then 1 else 2 end, candidate.version desc limit 1
    ) version on true where token_set.status <> 'archived' order by token_set.name
  `;
  return rows.map((row) => ({
    id: row.id, setKey: row.set_key, name: row.name, description: row.description || "", status: row.status,
    versionId: row.version_id || null, version: row.version == null ? null : Number(row.version),
    versionStatus: row.version_status || null, sourceName: row.source_name || "", sourceHash: row.source_hash || "",
    changeNote: row.change_note || "", updatedAt: row.updated_at || null,
  }));
}

async function fetchTokenVersion(sql, versionId) {
  const rows = await sql`
    select version.id::text, version.token_set_id::text, version.version, version.status,
      token_set.set_key, token_set.name, token_set.description, version.source_name,
      version.source_hash, version.change_note, version.created_at, version.updated_at
    from promo_design_token_set_versions version
    join promo_design_token_sets token_set on token_set.id = version.token_set_id
    where version.id = ${versionId}::uuid limit 1
  `;
  if (!rows.length) return null;
  const values = await sql`
    select value.token_key, value.value_index, value.token_value, value.value_light,
      value.value_dark, value.active_theme, value.metadata, definition.category,
      definition.value_type, definition.semantic_role, definition.css_property,
      definition.css_properties, definition.category_label, definition.label,
      definition.unit, definition.themeable, definition.cardinality,
      definition.source_metadata, definition.required, definition.ai_selectable, definition.editable
    from promo_design_token_values value
    join promo_design_token_definitions definition on definition.token_key = value.token_key
    where value.token_set_version_id = ${versionId}::uuid
    order by definition.category, value.token_key, value.value_index
  `;
  const row = rows[0];
  return {
    id: row.id, tokenSetId: row.token_set_id, setKey: row.set_key, name: row.name,
    description: row.description || "", version: Number(row.version), status: row.status,
    sourceName: row.source_name || "", sourceHash: row.source_hash || "", changeNote: row.change_note || "",
    values: values.map((value) => ({
      tokenKey: value.token_key, valueIndex: Number(value.value_index || 0),
      value: value.token_value, valueLight: value.value_light || "",
      valueDark: value.value_dark || "", activeTheme: value.active_theme || "dark",
      metadata: value.metadata || {}, category: value.category,
      categoryLabel: value.category_label || "", label: value.label || "",
      unit: value.unit || "", themeable: Boolean(value.themeable),
      cardinality: value.cardinality || "single",
      valueType: value.value_type, semanticRole: value.semantic_role,
      cssProperty: value.css_property,
      cssProperties: Array.isArray(value.css_properties) ? value.css_properties : [value.css_property].filter(Boolean),
      sourceMetadata: value.source_metadata || {},
      required: Boolean(value.required), aiSelectable: Boolean(value.ai_selectable), editable: Boolean(value.editable),
    })), createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

async function fetchManagedTokenSets(sql, { includeArchived = false } = {}) {
  const sets = includeArchived ? await sql`
    select id::text, set_key, name, description, status, created_at, updated_at
    from promo_design_token_sets order by name, created_at
  ` : await sql`
    select id::text, set_key, name, description, status, created_at, updated_at
    from promo_design_token_sets where status <> 'archived' order by name, created_at
  `;
  if (!sets.length) return [];
  const ids = sets.map((set) => set.id);
  const versions = await sql`
    select id::text, token_set_id::text, version, status, source_name, source_hash,
      change_note, created_at, updated_at
    from promo_design_token_set_versions
    where token_set_id = any(${ids}::uuid[])
    order by token_set_id, version desc
  `;
  const usageRows = await sql`
    select version.token_set_id::text,
      count(distinct template.id)::integer as template_count,
      count(distinct template.id) filter (where template.status = 'active')::integer as active_template_count
    from promo_design_token_set_versions version
    left join wizard_form_templates template on template.design_token_set_version_id = version.id
    where version.token_set_id = any(${ids}::uuid[])
    group by version.token_set_id
  `;
  const usageBySet = new Map(usageRows.map((row) => [row.token_set_id, {
    templateCount: Number(row.template_count || 0),
    activeTemplateCount: Number(row.active_template_count || 0),
  }]));
  return sets.map((set) => {
    const setVersions = versions.filter((version) => version.token_set_id === set.id).map((version) => ({
      id: version.id,
      version: Number(version.version),
      status: version.status,
      sourceName: version.source_name || "",
      sourceHash: version.source_hash || "",
      changeNote: version.change_note || "",
      createdAt: version.created_at || null,
      updatedAt: version.updated_at || null,
    }));
    const activeVersion = setVersions.find((version) => version.status === "active") || null;
    const draftVersion = setVersions.find((version) => version.status === "draft") || null;
    const representative = activeVersion || draftVersion || setVersions[0] || null;
    return {
      id: set.id,
      setKey: set.set_key,
      name: set.name,
      description: set.description || "",
      status: set.status,
      versionId: representative?.id || null,
      version: representative?.version ?? null,
      versionStatus: representative?.status || null,
      activeVersion,
      draftVersion,
      versions: setVersions,
      usage: usageBySet.get(set.id) || { templateCount: 0, activeTemplateCount: 0 },
      createdAt: set.created_at || null,
      updatedAt: set.updated_at || null,
    };
  });
}

async function fetchTokenSetUsage(sql, tokenSetId) {
  const templates = await sql`
    select template.id::text, template.template_key, template.name, template.version,
      template.status, version.id::text as token_version_id, version.version as token_version
    from wizard_form_templates template
    join promo_design_token_set_versions version on version.id = template.design_token_set_version_id
    where version.token_set_id = ${tokenSetId}::uuid
    order by template.status, template.name, template.version desc
  `;
  const runs = await sql`
    select
      count(*)::integer as total,
      count(*) filter (where run.status in (
        'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
        'generating_assets', 'validating_assets', 'ready', 'applying'
      ))::integer as active
    from promo_section_design_runs run
    join promo_design_token_set_versions version on version.id = run.token_set_version_id
    where version.token_set_id = ${tokenSetId}::uuid
  `;
  return {
    templates: templates.map((template) => ({
      id: template.id,
      templateKey: template.template_key,
      name: template.name,
      version: Number(template.version),
      status: template.status,
      tokenVersionId: template.token_version_id,
      tokenVersion: Number(template.token_version),
    })),
    aiRuns: { total: Number(runs[0]?.total || 0), active: Number(runs[0]?.active || 0) },
  };
}

function toRuntimeTokenMap(values) {
  const grouped = new Map();
  (Array.isArray(values) ? values : []).forEach((entry) => {
    const key = String(entry?.tokenKey || entry?.token_key || "").trim();
    const value = String(entry?.value ?? entry?.tokenValue ?? entry?.token_value ?? "").trim();
    if (!TOKEN_KEY_PATTERN.test(key) || !value) return;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push({
      value,
      valueIndex: Math.max(0, Number.parseInt(entry?.valueIndex ?? entry?.value_index ?? 0, 10) || 0),
    });
  });
  return Object.fromEntries([...grouped.entries()].map(([key, entries]) => [
    key,
    entries.sort((left, right) => left.valueIndex - right.valueIndex)
      .map((entry) => entry.value).join(", "),
  ]));
}

module.exports = {
  VALUE_TYPES,
  SAFE_CSS_PROPERTIES,
  TOKEN_KEY_PATTERN,
  getSql,
  parseBody,
  createTokenSetKey,
  validateTokenValue,
  parseCsvRows,
  normalizeTokenEntries,
  fetchTokenDefinitions,
  fetchTokenSets,
  fetchTokenVersion,
  fetchManagedTokenSets,
  fetchTokenSetUsage,
  toRuntimeTokenMap,
};
