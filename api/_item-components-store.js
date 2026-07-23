const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");

const FIELD_KINDS = ["text", "image", "cta"];
const TEXT_TYPES = ["title", "remark", "multi"];
const VERSION_STATUSES = ["draft", "active", "inactive", "archived"];

function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    const error = new Error("DATABASE_URL is not configured");
    error.statusCode = 500;
    throw error;
  }
  return neon(databaseUrl);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return typeof body === "object" && !Array.isArray(body) ? body : {};
}

function asObject(value, fallback = {}) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function validateDefinition(body) {
  const fieldKind = String(body.fieldKind || "").trim();
  if (!FIELD_KINDS.includes(fieldKind)) {
    const error = new Error(`fieldKind must be one of: ${FIELD_KINDS.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
  const textType = fieldKind === "text" ? String(body.textType || "").trim() : null;
  if (fieldKind === "text" && !TEXT_TYPES.includes(textType)) {
    const error = new Error(`textType must be one of: ${TEXT_TYPES.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
  const editorSchema = asObject(body.editorSchema);
  const capabilities = asObject(body.capabilities);
  const imagePolicy = fieldKind === "image" ? asObject(body.imagePolicy) : {};
  const ctaPolicy = fieldKind === "cta" ? asObject(body.ctaPolicy) : {};
  const styleSlots = asArray(body.styleSlots);
  for (const slot of styleSlots) {
    if (!slot || typeof slot !== "object" || !String(slot.slotKey || "").trim()) {
      const error = new Error("Every style slot requires slotKey");
      error.statusCode = 400;
      throw error;
    }
  }
  return {
    fieldKind, textType, editorSchema, capabilities, imagePolicy, ctaPolicy, styleSlots,
    defaultValue: body.defaultValue ?? null,
  };
}

function toComponent(row) {
  return {
    id: row.id,
    componentKey: row.component_key,
    systemSeedCode: row.system_seed_code || null,
    name: row.name,
    description: row.description || "",
    status: row.component_status,
    versionId: row.version_id || null,
    version: row.version == null ? null : Number(row.version),
    versionStatus: row.version_status || null,
    fieldKind: row.field_kind || null,
    textType: row.text_type || null,
    editorSchema: row.editor_schema || {},
    defaultValue: row.default_value ?? null,
    capabilities: row.capabilities || {},
    imagePolicy: row.image_policy || {},
    ctaPolicy: row.cta_policy || {},
    styleSlots: row.style_slots || [],
    changeNote: row.change_note || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function fetchComponents(sql, { includeArchived = false } = {}) {
  const selectRows = () => includeArchived ? sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.change_note, component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by case candidate.status when 'draft' then 0 when 'active' then 1 else 2 end,
        candidate.version desc
      limit 1
    ) version on true
    order by component.name asc, component.created_at asc
  ` : sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.change_note, component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by case candidate.status when 'draft' then 0 when 'active' then 1 else 2 end,
        candidate.version desc
      limit 1
    ) version on true
    where component.status <> 'archived'
    order by component.name asc, component.created_at asc
  `;
  const rows = await selectRows();
  return rows.map(toComponent);
}

async function fetchComponent(sql, componentId, versionId = "") {
  const rows = versionId ? await sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.change_note, component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join wizard_item_component_versions version on version.id = ${versionId}::uuid
    where component.id = ${componentId}::uuid and version.component_id = component.id
    limit 1
  ` : await sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.change_note, component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by case candidate.status when 'draft' then 0 when 'active' then 1 else 2 end,
        candidate.version desc limit 1
    ) version on true
    where component.id = ${componentId}::uuid limit 1
  `;
  return rows[0] ? toComponent(rows[0]) : null;
}

async function fetchComponentVersions(sql, componentId) {
  const rows = await sql`
    select id::text, component_id::text, version, status, field_kind, text_type,
      editor_schema, default_value, capabilities, image_policy, cta_policy, style_slots,
      change_note, created_at, updated_at
    from wizard_item_component_versions
    where component_id = ${componentId}::uuid
    order by version desc
  `;
  return rows.map((row) => ({
    id: row.id, componentId: row.component_id, version: Number(row.version), status: row.status,
    fieldKind: row.field_kind, textType: row.text_type || null, editorSchema: row.editor_schema || {},
    defaultValue: row.default_value ?? null, capabilities: row.capabilities || {},
    imagePolicy: row.image_policy || {}, ctaPolicy: row.cta_policy || {}, styleSlots: row.style_slots || [],
    changeNote: row.change_note || "", createdAt: row.created_at, updatedAt: row.updated_at,
  }));
}

module.exports = {
  FIELD_KINDS, TEXT_TYPES, VERSION_STATUSES, getSql, parseBody, validateDefinition,
  toComponent, fetchComponents, fetchComponent, fetchComponentVersions,
};
