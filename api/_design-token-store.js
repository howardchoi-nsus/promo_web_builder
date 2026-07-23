const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");

const VALUE_TYPES = ["color", "length", "number", "font", "shadow", "enum"];
const SAFE_CSS_PROPERTIES = new Set([
  "color", "background-color", "border-color", "border-radius", "border-width",
  "box-shadow", "font-family", "font-size", "font-weight", "line-height",
  "letter-spacing", "padding", "gap", "max-width", "min-height",
]);

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

function validateTokenValue(definition, value) {
  const text = String(value ?? "").trim();
  if (!text) return "token value is required";
  if (definition.value_type === "color" && !/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(text)) return "color must be a 6 or 8 digit hex value";
  if (definition.value_type === "length" && !/^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw)$/.test(text)) return "length requires an allowed CSS unit";
  if (definition.value_type === "number" && !Number.isFinite(Number(text))) return "number is invalid";
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
    select value.token_key, value.token_value, value.metadata, definition.category,
      definition.value_type, definition.semantic_role, definition.css_property,
      definition.required, definition.ai_selectable, definition.editable
    from promo_design_token_values value
    join promo_design_token_definitions definition on definition.token_key = value.token_key
    where value.token_set_version_id = ${versionId}::uuid order by definition.category, value.token_key
  `;
  const row = rows[0];
  return {
    id: row.id, tokenSetId: row.token_set_id, setKey: row.set_key, name: row.name,
    description: row.description || "", version: Number(row.version), status: row.status,
    sourceName: row.source_name || "", sourceHash: row.source_hash || "", changeNote: row.change_note || "",
    values: values.map((value) => ({
      tokenKey: value.token_key, value: value.token_value, metadata: value.metadata || {}, category: value.category,
      valueType: value.value_type, semanticRole: value.semantic_role, cssProperty: value.css_property,
      required: Boolean(value.required), aiSelectable: Boolean(value.ai_selectable), editable: Boolean(value.editable),
    })), createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

module.exports = { VALUE_TYPES, SAFE_CSS_PROPERTIES, getSql, parseBody, validateTokenValue, parseCsvRows, fetchTokenSets, fetchTokenVersion };
