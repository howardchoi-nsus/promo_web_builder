const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");
const { normalizeStyleSlot } = require("./_promo-style-slot-contract");

const FIELD_KINDS = ["text", "image", "cta"];
const TEXT_TYPES = ["title", "remark", "multi"];
const VERSION_STATUSES = ["draft", "active", "inactive", "archived"];
const LIBRARY_CATEGORIES = ["layout", "text", "media", "action", "promo"];
const COMPONENT_ICON_KEYS = [
  "component-generic", "heading", "text", "image", "button",
  "logo", "badge", "divider", "spacer", "layout",
];
const SECTION_ROLES = ["header", "hero", "benefit", "content", "cta", "notice", "terms", "legal", "footer"];

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

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}

function validateLibraryPresentation(value) {
  const source = asObject(value);
  const category = String(source.category || "").trim();
  const iconKey = String(source.iconKey || "").trim();
  if (category && !LIBRARY_CATEGORIES.includes(category)) {
    badRequest(`libraryPresentation.category must be one of: ${LIBRARY_CATEGORIES.join(", ")}`);
  }
  if (iconKey && !COMPONENT_ICON_KEYS.includes(iconKey)) {
    badRequest(`libraryPresentation.iconKey must be one of: ${COMPONENT_ICON_KEYS.join(", ")}`);
  }
  const keywords = [...new Set(asArray(source.keywords)
    .map((keyword) => String(keyword || "").trim().toLowerCase())
    .filter(Boolean))];
  if (keywords.length > 20 || keywords.some((keyword) => keyword.length > 40)) {
    badRequest("libraryPresentation.keywords supports up to 20 values of 40 characters");
  }
  const displayOrder = source.displayOrder == null || source.displayOrder === ""
    ? 100
    : Number(source.displayOrder);
  if (!Number.isInteger(displayOrder) || displayOrder < 0 || displayOrder > 9999) {
    badRequest("libraryPresentation.displayOrder must be an integer between 0 and 9999");
  }
  return { category, iconKey, keywords, displayOrder, isFeatured: source.isFeatured === true };
}

function validateGeometry(value, viewport) {
  const source = asObject(value);
  if (!Object.keys(source).length) return {};
  const widthPct = Number(source.widthPct);
  const heightPx = Number(source.heightPx);
  if (!Number.isFinite(widthPct) || widthPct <= 0 || widthPct > 100) {
    badRequest(`placementPolicy.defaultGeometry.${viewport}.widthPct must be greater than 0 and at most 100`);
  }
  if (!Number.isFinite(heightPx) || heightPx < 1 || heightPx > 2000) {
    badRequest(`placementPolicy.defaultGeometry.${viewport}.heightPx must be between 1 and 2000`);
  }
  return { widthPct, heightPx };
}

function validatePlacementPolicy(value) {
  const source = asObject(value);
  const normalizeRoles = (roles, key) => [...new Set(asArray(roles).map((role) => String(role || "").trim()).filter(Boolean))]
    .map((role) => {
      if (!SECTION_ROLES.includes(role)) badRequest(`placementPolicy.${key} contains unsupported role: ${role}`);
      return role;
    });
  const allowedSectionRoles = normalizeRoles(source.allowedSectionRoles, "allowedSectionRoles");
  const deniedSectionRoles = normalizeRoles(source.deniedSectionRoles, "deniedSectionRoles");
  if (allowedSectionRoles.some((role) => deniedSectionRoles.includes(role))) {
    badRequest("placementPolicy cannot allow and deny the same Section role");
  }
  const maxInstancesPerSection = source.maxInstancesPerSection == null || source.maxInstancesPerSection === ""
    ? null
    : Number(source.maxInstancesPerSection);
  if (maxInstancesPerSection != null && (!Number.isInteger(maxInstancesPerSection) || maxInstancesPerSection < 1 || maxInstancesPerSection > 100)) {
    badRequest("placementPolicy.maxInstancesPerSection must be an integer between 1 and 100");
  }
  return {
    allowedSectionRoles,
    deniedSectionRoles,
    maxInstancesPerSection,
    requiresParentCapabilities: [...new Set(asArray(source.requiresParentCapabilities)
      .map((capability) => String(capability || "").trim()).filter(Boolean))],
    defaultGeometry: {
      desktop: validateGeometry(source.defaultGeometry?.desktop, "desktop"),
      mobile: validateGeometry(source.defaultGeometry?.mobile, "mobile"),
    },
  };
}

function validateFieldDefinition(body, index = 0) {
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
  const fieldKey = String(body.fieldKey || "").trim();
  if (fieldKey && !/^fld_[a-f0-9]{32}$/.test(fieldKey)) {
    const error = new Error("fieldKey is generated by the server and must use the immutable fld_<uuid> format");
    error.statusCode = 400;
    throw error;
  }
  const editorSchema = asObject(body.editorSchema);
  const description = String(body.description ?? editorSchema.description ?? "").trim();
  const normalizedEditorSchema = { ...editorSchema };
  if (description) normalizedEditorSchema.description = description;
  else delete normalizedEditorSchema.description;
  const capabilities = asObject(body.capabilities);
  const imagePolicy = fieldKind === "image" ? asObject(body.imagePolicy) : {};
  const ctaPolicy = fieldKind === "cta" ? asObject(body.ctaPolicy) : {};
  const styleSlots = asArray(body.styleSlots).map((slot) => normalizeStyleSlot(slot));
  for (const slot of styleSlots) {
    if (!slot || typeof slot !== "object" || !String(slot.slotKey || "").trim()) {
      const error = new Error("Every style slot requires slotKey");
      error.statusCode = 400;
      throw error;
    }
  }
  return {
    id: String(body.id || "").trim() || null,
    fieldKey: fieldKey || null,
    name: String(body.name || "").trim() || `Field ${index + 1}`,
    description,
    fieldKind, textType, editorSchema: normalizedEditorSchema, capabilities, imagePolicy, ctaPolicy, styleSlots,
    defaultValue: body.defaultValue ?? null,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : index * 10,
    isRequired: body.isRequired === true,
    isLocked: body.isLocked === true,
  };
}

function validateDefinition(body) {
  const sourceFields = asArray(body.fields);
  const fields = (sourceFields.length ? sourceFields : [{
    name: body.fieldName || body.name || "Component field",
    description: body.fieldDescription || body.description || "",
    fieldKind: body.fieldKind,
    textType: body.textType,
    editorSchema: body.editorSchema,
    defaultValue: body.defaultValue,
    capabilities: body.capabilities,
    imagePolicy: body.imagePolicy,
    ctaPolicy: body.ctaPolicy,
    styleSlots: body.styleSlots,
    isRequired: body.isRequired,
    isLocked: body.isLocked,
  }]).map(validateFieldDefinition);
  if (!fields.length) {
    const error = new Error("A component version requires at least one field");
    error.statusCode = 400;
    throw error;
  }
  const suppliedKeys = fields.map((field) => field.fieldKey).filter(Boolean);
  if (new Set(suppliedKeys).size !== suppliedKeys.length) {
    const error = new Error("fieldKey values must be unique within a component version");
    error.statusCode = 400;
    throw error;
  }
  return { ...fields[0], fields };
}

function toComponentField(row) {
  return {
    id: row.id,
    componentVersionId: row.component_version_id,
    fieldKey: row.field_key,
    name: row.name,
    description: String(row.editor_schema?.description || "").trim(),
    fieldKind: row.field_kind,
    textType: row.text_type || null,
    sortOrder: Number(row.sort_order || 0),
    isRequired: Boolean(row.is_required),
    isLocked: Boolean(row.is_locked),
    defaultValue: row.default_value ?? null,
    editorSchema: row.editor_schema || {},
    capabilities: row.capabilities || {},
    imagePolicy: row.image_policy || {},
    ctaPolicy: row.cta_policy || {},
    styleSlots: row.style_slots || [],
  };
}

async function fetchVersionFields(sql, versionIds) {
  const ids = [...new Set((versionIds || []).filter(Boolean))];
  if (!ids.length) return new Map();
  let rows;
  try {
    rows = await sql`
      select id::text, component_version_id::text, field_key, name, field_kind, text_type,
        sort_order, is_required, is_locked, default_value, editor_schema, capabilities,
        image_policy, cta_policy, style_slots
      from wizard_item_component_version_fields
      where component_version_id = any(${ids}::uuid[])
      order by component_version_id, sort_order, created_at
    `;
  } catch (error) {
    if (/wizard_item_component_version_fields|relation .* does not exist/i.test(String(error?.message || ""))) {
      return new Map();
    }
    throw error;
  }
  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.component_version_id)) grouped.set(row.component_version_id, []);
    grouped.get(row.component_version_id).push(toComponentField(row));
  });
  return grouped;
}

async function attachComponentFields(sql, components) {
  const versionIds = components.flatMap((component) => [
    component.versionId,
    component.activeVersion?.id,
  ]).filter(Boolean);
  const fieldsByVersion = await fetchVersionFields(sql, versionIds);
  components.forEach((component) => {
    component.fields = fieldsByVersion.get(component.versionId) || [];
    if (component.activeVersion) {
      component.activeVersion.fields = fieldsByVersion.get(component.activeVersion.id) || [];
    }
  });
  return components;
}

async function replaceVersionFields(sql, versionId, fields) {
  const existingRows = await sql`
    select field_key from wizard_item_component_version_fields
    where component_version_id = ${versionId}::uuid
  `;
  const existingKeys = new Set(existingRows.map((row) => row.field_key));
  const invalidKey = fields.find((field) => field.fieldKey && !existingKeys.has(field.fieldKey));
  if (invalidKey) {
    const error = new Error(`Unknown immutable fieldKey: ${invalidKey.fieldKey}`);
    error.statusCode = 409;
    throw error;
  }
  await sql`
    with removed as (
      delete from wizard_item_component_version_fields
      where component_version_id = ${versionId}::uuid
    )
    insert into wizard_item_component_version_fields (
      component_version_id, field_key, name, field_kind, text_type, sort_order,
      is_required, is_locked, default_value, editor_schema, capabilities,
      image_policy, cta_policy, style_slots
    )
    select
      ${versionId}::uuid,
      coalesce(nullif(field->>'fieldKey', ''), 'fld_' || replace(gen_random_uuid()::text, '-', '')),
      field->>'name',
      field->>'fieldKind',
      nullif(field->>'textType', ''),
      coalesce((field->>'sortOrder')::integer, 0),
      coalesce((field->>'isRequired')::boolean, false),
      coalesce((field->>'isLocked')::boolean, false),
      field->'defaultValue',
      coalesce(field->'editorSchema', '{}'::jsonb),
      coalesce(field->'capabilities', '{}'::jsonb),
      coalesce(field->'imagePolicy', '{}'::jsonb),
      coalesce(field->'ctaPolicy', '{}'::jsonb),
      coalesce(field->'styleSlots', '[]'::jsonb)
    from jsonb_array_elements(${JSON.stringify(fields)}::jsonb) field
  `;
}

function toComponent(row) {
  const activeVersion = row.active_version_id ? {
    id: row.active_version_id,
    version: Number(row.active_version),
    status: row.active_version_status,
    fieldKind: row.active_field_kind,
    textType: row.active_text_type || null,
    editorSchema: row.active_editor_schema || {},
    defaultValue: row.active_default_value ?? null,
    capabilities: row.active_capabilities || {},
    imagePolicy: row.active_image_policy || {},
    ctaPolicy: row.active_cta_policy || {},
    styleSlots: row.active_style_slots || [],
    placementPolicy: row.active_placement_policy || {},
    changeNote: row.active_change_note || "",
    fields: [],
  } : null;
  return {
    id: row.id,
    componentKey: row.component_key,
    systemSeedCode: row.system_seed_code || null,
    name: row.name,
    description: row.description || "",
    libraryPresentation: row.library_presentation || {},
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
    placementPolicy: row.placement_policy || {},
    changeNote: row.change_note || "",
    fields: [],
    activeVersion,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function fetchComponents(sql, { includeArchived = false } = {}) {
  const selectRows = () => includeArchived ? sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.library_presentation, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.placement_policy, version.change_note,
      active_version.id::text as active_version_id, active_version.version as active_version,
      active_version.status as active_version_status, active_version.field_kind as active_field_kind,
      active_version.text_type as active_text_type, active_version.editor_schema as active_editor_schema,
      active_version.default_value as active_default_value, active_version.capabilities as active_capabilities,
      active_version.image_policy as active_image_policy, active_version.cta_policy as active_cta_policy,
      active_version.style_slots as active_style_slots, active_version.placement_policy as active_placement_policy,
      active_version.change_note as active_change_note,
      component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by case candidate.status when 'draft' then 0 when 'active' then 1 else 2 end,
        candidate.version desc
      limit 1
    ) version on true
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id and candidate.status = 'active'
      order by candidate.version desc
      limit 1
    ) active_version on true
    order by component.name asc, component.created_at asc
  ` : sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.library_presentation, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.placement_policy, version.change_note,
      active_version.id::text as active_version_id, active_version.version as active_version,
      active_version.status as active_version_status, active_version.field_kind as active_field_kind,
      active_version.text_type as active_text_type, active_version.editor_schema as active_editor_schema,
      active_version.default_value as active_default_value, active_version.capabilities as active_capabilities,
      active_version.image_policy as active_image_policy, active_version.cta_policy as active_cta_policy,
      active_version.style_slots as active_style_slots, active_version.placement_policy as active_placement_policy,
      active_version.change_note as active_change_note,
      component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by case candidate.status when 'draft' then 0 when 'active' then 1 else 2 end,
        candidate.version desc
      limit 1
    ) version on true
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id and candidate.status = 'active'
      order by candidate.version desc
      limit 1
    ) active_version on true
    where component.status <> 'archived'
    order by component.name asc, component.created_at asc
  `;
  const rows = await selectRows();
  return attachComponentFields(sql, rows.map(toComponent));
}

async function fetchComponent(sql, componentId, versionId = "") {
  const rows = versionId ? await sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.library_presentation, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.placement_policy, version.change_note,
      component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join wizard_item_component_versions version on version.id = ${versionId}::uuid
    where component.id = ${componentId}::uuid and version.component_id = component.id
    limit 1
  ` : await sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.description, component.library_presentation, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots,
      version.placement_policy, version.change_note,
      component.created_at, greatest(component.updated_at, version.updated_at) as updated_at
    from wizard_item_components component
    left join lateral (
      select * from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by case candidate.status when 'draft' then 0 when 'active' then 1 else 2 end,
        candidate.version desc limit 1
    ) version on true
    where component.id = ${componentId}::uuid limit 1
  `;
  if (!rows[0]) return null;
  return (await attachComponentFields(sql, [toComponent(rows[0])]))[0];
}

async function fetchComponentVersions(sql, componentId) {
  const rows = await sql`
    select id::text, component_id::text, version, status, field_kind, text_type,
      editor_schema, default_value, capabilities, image_policy, cta_policy, style_slots, placement_policy,
      change_note, created_at, updated_at
    from wizard_item_component_versions
    where component_id = ${componentId}::uuid
    order by version desc
  `;
  const versions = rows.map((row) => ({
    id: row.id, componentId: row.component_id, version: Number(row.version), status: row.status,
    fieldKind: row.field_kind, textType: row.text_type || null, editorSchema: row.editor_schema || {},
    defaultValue: row.default_value ?? null, capabilities: row.capabilities || {},
    imagePolicy: row.image_policy || {}, ctaPolicy: row.cta_policy || {}, styleSlots: row.style_slots || [],
    placementPolicy: row.placement_policy || {},
    changeNote: row.change_note || "", createdAt: row.created_at, updatedAt: row.updated_at,
    fields: [],
  }));
  const fieldsByVersion = await fetchVersionFields(sql, versions.map((version) => version.id));
  versions.forEach((version) => { version.fields = fieldsByVersion.get(version.id) || []; });
  return versions;
}

module.exports = {
  FIELD_KINDS, TEXT_TYPES, VERSION_STATUSES, LIBRARY_CATEGORIES, COMPONENT_ICON_KEYS, SECTION_ROLES,
  getSql, parseBody, validateDefinition, validateLibraryPresentation, validatePlacementPolicy,
  toComponent, toComponentField, fetchVersionFields, replaceVersionFields,
  fetchComponents, fetchComponent, fetchComponentVersions,
};
