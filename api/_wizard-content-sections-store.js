const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");

// Wizard Content Sections define what Promo Wizard Step 2 (Content Input)
// renders. Rows are versioned the same way as prompt_templates: editing a
// section clones the active version into a new draft, and "activate" swaps
// which version is live. See db/migrations/016_wizard_content_sections.sql.
//
// Column lists are spelled out per query (not built dynamically) to match the
// rest of the api/ folder's style (see prompt-template.js, prompt-templates.js).

const FIELD_KINDS = ["text", "image", "cta"];
const TEXT_TYPES = ["title", "remark", "multi"];
const IMAGE_SOURCES = ["url", "file", "ai"];
const SECTION_STATUSES = ["draft", "active", "inactive", "archived"];
const AI_LAYOUT_VARIANTS = ["split-left", "split-right", "centered-hero"];
const AI_IMAGE_TARGETS = ["section-background", "item"];
const DEFAULT_AI_DESIGN = Object.freeze({
  enabled: true,
  allowedLayoutVariants: AI_LAYOUT_VARIANTS,
  allowSectionBackground: true,
  imageTarget: "section-background",
  imageTargetItemKeys: [],
  imageAspectRatio: "16:9",
});

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
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return body;
  return {};
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeImageSources(value) {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item) => String(item || "").trim().toLowerCase())
    .filter((item) => IMAGE_SOURCES.includes(item));
}

function normalizeAiDesign(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const allowedLayoutVariants = [...new Set(
    (Array.isArray(source.allowedLayoutVariants) ? source.allowedLayoutVariants : DEFAULT_AI_DESIGN.allowedLayoutVariants)
      .map((item) => String(item || "").trim())
      .filter((item) => AI_LAYOUT_VARIANTS.includes(item))
  )];
  const imageTarget = AI_IMAGE_TARGETS.includes(source.imageTarget) ? source.imageTarget : DEFAULT_AI_DESIGN.imageTarget;
  const imageTargetItemKeys = [...new Set(
    (Array.isArray(source.imageTargetItemKeys) ? source.imageTargetItemKeys : [])
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  )];
  return {
    enabled: normalizeBoolean(source.enabled, DEFAULT_AI_DESIGN.enabled),
    allowedLayoutVariants,
    allowSectionBackground: normalizeBoolean(source.allowSectionBackground, DEFAULT_AI_DESIGN.allowSectionBackground),
    imageTarget,
    imageTargetItemKeys,
    imageAspectRatio: String(source.imageAspectRatio || DEFAULT_AI_DESIGN.imageAspectRatio).trim() || DEFAULT_AI_DESIGN.imageAspectRatio,
  };
}

function normalizeUtm(body = {}) {
  return {
    source: String(body.source || body.utmSource || "").trim(),
    medium: String(body.medium || body.utmMedium || "").trim(),
    campaign: String(body.campaign || body.utmCampaign || "").trim(),
    content: String(body.content || body.utmContent || "").trim(),
    term: String(body.term || body.utmTerm || "").trim(),
  };
}

function validateFieldKind(value) {
  const fieldKind = String(value || "").trim();
  if (!FIELD_KINDS.includes(fieldKind)) {
    const error = new Error(`fieldKind must be one of: ${FIELD_KINDS.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
  return fieldKind;
}

function validateTextType(fieldKind, value) {
  if (fieldKind !== "text") return null;
  const textType = String(value || "").trim();
  if (!TEXT_TYPES.includes(textType)) {
    const error = new Error(`textType must be one of: ${TEXT_TYPES.join(", ")} when fieldKind is "text"`);
    error.statusCode = 400;
    throw error;
  }
  return textType;
}

function hasLockedValue(value) {
  return value !== null && value !== undefined;
}

function validateLockedValue(fieldKind, value) {
  if (!hasLockedValue(value)) return "lockedValue is required when isLocked is true";
  if (fieldKind === "text" && (typeof value !== "string" || !value.trim())) {
    return "locked text value must be a non-empty string";
  }
  if (fieldKind === "cta" && (
    typeof value !== "object"
    || !String(value.label || "").trim()
    || !String(value.link || "").trim()
  )) return "locked CTA value requires label and link";
  if (fieldKind === "image" && (
    typeof value !== "object"
    || !IMAGE_SOURCES.includes(String(value.source || "").trim())
    || !String(value.value || "").trim()
  )) return "locked image value requires an allowed source and value";
  return "";
}

function toSection(row) {
  return {
    id: row.id,
    sectionKey: row.section_key,
    name: row.name,
    description: row.description || "",
    isRequired: Boolean(row.is_required),
    orderChangeAllowed: Boolean(row.order_change_allowed),
    fixedPosition: row.fixed_position || null,
    sortOrder: Number(row.sort_order || 0),
    isVisibleInWizard: Boolean(row.is_visible_in_wizard),
    status: row.status,
    version: Number(row.version || 1),
    changeNote: row.change_note || "",
    aiDesign: normalizeAiDesign(row.ai_design),
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function toSectionItem(row) {
  const imagePolicy = row.image_policy && typeof row.image_policy === "object" ? row.image_policy : {};
  const ctaPolicy = row.cta_policy && typeof row.cta_policy === "object" ? row.cta_policy : {};
  const instanceConfig = row.instance_config && typeof row.instance_config === "object" ? row.instance_config : {};
  return {
    id: row.id,
    sectionId: row.section_id,
    componentId: row.item_component_id || null,
    componentKey: row.component_key || null,
    componentVersionId: row.component_version_id || null,
    componentVersion: row.component_version == null ? null : Number(row.component_version),
    itemKey: row.item_key,
    name: row.name,
    isVisibleInWizard: Boolean(row.is_visible_in_wizard),
    isRequired: Boolean(row.is_required),
    userReorderAllowed: row.user_reorder_allowed === undefined ? true : Boolean(row.user_reorder_allowed),
    sortOrder: Number(row.sort_order || 0),
    fieldKind: row.field_kind,
    textType: row.text_type || null,
    image: row.field_kind === "image" ? {
      allowedSources: Array.isArray(imagePolicy.allowedSources) ? imagePolicy.allowedSources : [],
      promptText: imagePolicy.promptText || "",
      descriptionEnabled: Boolean(imagePolicy.descriptionEnabled),
      altTextRequired: Boolean(imagePolicy.altTextRequired),
      aspectRatio: imagePolicy.aspectRatio || "",
      maxSizeKb: imagePolicy.maxSizeKb == null ? null : Number(imagePolicy.maxSizeKb),
    } : null,
    ctaUtm: row.field_kind === "cta" ? {
      source: ctaPolicy.source || "",
      medium: ctaPolicy.medium || "",
      campaign: ctaPolicy.campaign || "",
      content: ctaPolicy.content || "",
      term: ctaPolicy.term || "",
    } : null,
    editorSchema: row.editor_schema || {},
    defaultValue: row.default_value ?? null,
    capabilities: row.capabilities || {},
    styleSlots: row.style_slots || [],
    instanceConfig,
    isLocked: Boolean(row.is_locked),
    lockedValue: row.locked_value ?? null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function fetchSectionRow(sql, id) {
  const rows = await sql`
    select
      id::text, section_key, name, description, is_required, order_change_allowed,
      fixed_position, sort_order, is_visible_in_wizard, status, version,
      change_note, ai_design, archived_at, created_at, updated_at
    from wizard_content_sections
    where id = ${id}::uuid
    limit 1
  `;
  return rows[0] || null;
}

async function fetchItemRows(sql, sectionId) {
  return sql`
    select
      instance.id::text, instance.section_id::text, instance.item_key,
      coalesce(nullif(instance.display_name, ''), component.name) as name,
      instance.is_visible_in_wizard, instance.is_required, instance.user_reorder_allowed,
      instance.sort_order, instance.is_locked, instance.locked_value, instance.instance_config,
      instance.created_at, instance.updated_at,
      component.id::text as item_component_id, component.component_key,
      version.id::text as component_version_id, version.version as component_version,
      version.field_kind, version.text_type, version.editor_schema, version.default_value,
      version.capabilities, version.image_policy, version.cta_policy, version.style_slots
    from wizard_content_section_component_instances instance
    join wizard_item_component_versions version on version.id = instance.component_version_id
    join wizard_item_components component on component.id = version.component_id
    where instance.section_id = ${sectionId}::uuid
    order by instance.sort_order asc, instance.created_at asc
  `;
}

async function fetchItemsForSection(sql, sectionId) {
  const rows = await fetchItemRows(sql, sectionId);
  return rows.map(toSectionItem);
}

async function validateSectionDraft(sql, sectionId) {
  const sectionRow = await fetchSectionRow(sql, sectionId);
  if (!sectionRow) {
    const error = new Error("Section not found");
    error.statusCode = 404;
    throw error;
  }
  const items = await fetchItemsForSection(sql, sectionId);
  const visibleItems = items.filter((item) => item.isVisibleInWizard);
  const errors = [];
  const aiDesign = normalizeAiDesign(sectionRow.ai_design);

  if (aiDesign.enabled && !aiDesign.allowedLayoutVariants.length) {
    errors.push({ path: `${sectionRow.section_key}.aiDesign.allowedLayoutVariants`, code: "AI_LAYOUT_VARIANT_REQUIRED", message: "An AI-enabled section needs at least one allowed layout variant." });
  }
  if (aiDesign.enabled && aiDesign.imageTarget === "item") {
    const visibleImageKeys = new Set(visibleItems
      .filter((item) => item.fieldKind === "image" && item.image?.allowedSources?.includes("ai"))
      .map((item) => item.itemKey));
    if (!aiDesign.imageTargetItemKeys.some((key) => visibleImageKeys.has(key))) {
      errors.push({ path: `${sectionRow.section_key}.aiDesign.imageTargetItemKeys`, code: "AI_IMAGE_TARGET_REQUIRED", message: "Select at least one visible image item that allows the AI source." });
    }
  }

  if (sectionRow.is_required && !visibleItems.some((item) => item.isRequired)) {
    errors.push({ path: sectionRow.section_key, code: "REQUIRED_SECTION_ITEM", message: "A required section needs at least one visible required item." });
  }
  visibleItems.forEach((item) => {
    if (item.isLocked) {
      const message = validateLockedValue(item.fieldKind, item.lockedValue);
      if (message) errors.push({ path: `${sectionRow.section_key}.${item.itemKey}`, code: "INVALID_LOCKED_VALUE", message });
    }
    if (item.fieldKind === "image") {
      const sources = item.image?.allowedSources || [];
      if (!sources.length) errors.push({ path: `${sectionRow.section_key}.${item.itemKey}`, code: "IMAGE_SOURCE_REQUIRED", message: "Image items need at least one supported source." });
      if (sources.includes("ai") && !String(item.image?.promptText || "").trim()) {
        errors.push({ path: `${sectionRow.section_key}.${item.itemKey}`, code: "IMAGE_PROMPT_REQUIRED", message: "AI image sources require prompt text." });
      }
      if (item.image?.maxSizeKb !== null && Number(item.image.maxSizeKb) <= 0) {
        errors.push({ path: `${sectionRow.section_key}.${item.itemKey}`, code: "INVALID_IMAGE_SIZE", message: "Image max size must be greater than zero." });
      }
    }
  });
  return { section: toSection(sectionRow), items, errors };
}

async function fetchAllSections(sql, { includeArchived = false } = {}) {
  const rows = includeArchived
    ? await sql`
      select
        id::text, section_key, name, description, is_required, order_change_allowed,
        fixed_position, sort_order, is_visible_in_wizard, status, version,
        change_note, ai_design, archived_at, created_at, updated_at
      from wizard_content_sections
      order by sort_order asc, section_key asc, version desc
    `
    : await sql`
      select
        id::text, section_key, name, description, is_required, order_change_allowed,
        fixed_position, sort_order, is_visible_in_wizard, status, version,
        change_note, ai_design, archived_at, created_at, updated_at
      from wizard_content_sections
      where status <> 'archived'
      order by sort_order asc, section_key asc, version desc
    `;
  return rows.map(toSection);
}

// Wizard-facing view: only the currently-active, wizard-visible sections and
// items, ordered the same way promo-wizard.js expects (fixed header/footer at
// the ends, everything else by sort_order).
async function fetchPublicSectionsWithItems(sql) {
  const sectionRows = await sql`
    select
      id::text, section_key, name, description, is_required, order_change_allowed,
      fixed_position, sort_order, is_visible_in_wizard, status, version,
      change_note, ai_design, archived_at, created_at, updated_at
    from wizard_content_sections
    where status = 'active' and is_visible_in_wizard = true
    order by
      case fixed_position when 'top' then 0 when 'bottom' then 2 else 1 end,
      sort_order asc
  `;
  const sections = [];
  for (const row of sectionRows) {
    const section = toSection(row);
    const items = (await fetchItemsForSection(sql, row.id)).filter((item) => item.isVisibleInWizard);
    sections.push({ ...section, items });
  }
  return sections;
}

// Clones a section (fields + all items) into a new draft version so edits
// never mutate a live/active row directly. Mirrors the "increment version on
// every save" rule used by prompt_templates.
async function cloneSectionAsDraft(sql, sourceId, changeNote = "Draft created from existing version.") {
  const rows = await sql`
    select clone_wizard_content_section_draft(${sourceId}::uuid, ${changeNote})::text as id
  `;
  const draft = await fetchSectionRow(sql, rows[0]?.id);
  if (!draft) {
    const error = new Error("Draft creation did not return a section");
    error.statusCode = 500;
    throw error;
  }
  return toSection(draft);
}

async function recordHistory(sql, {
  sectionKey,
  sectionId,
  previousVersion,
  newVersion,
  previousStatus,
  newStatus,
  changeNote,
  previousState,
  newState,
}) {
  await sql`
    insert into wizard_content_section_histories (
      section_key, section_id, previous_version, new_version,
      previous_status, new_status, change_note, previous_state, new_state
    )
    values (
      ${sectionKey}, ${sectionId}::uuid, ${previousVersion || 0}, ${newVersion || 1},
      ${previousStatus || ""}, ${newStatus || ""}, ${changeNote || ""},
      ${previousState ? JSON.stringify(previousState) : null}::jsonb,
      ${newState ? JSON.stringify(newState) : null}::jsonb
    )
  `;
}

module.exports = {
  FIELD_KINDS,
  TEXT_TYPES,
  IMAGE_SOURCES,
  SECTION_STATUSES,
  AI_LAYOUT_VARIANTS,
  AI_IMAGE_TARGETS,
  DEFAULT_AI_DESIGN,
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  normalizeImageSources,
  normalizeAiDesign,
  normalizeUtm,
  validateFieldKind,
  validateTextType,
  hasLockedValue,
  validateLockedValue,
  toSection,
  toSectionItem,
  fetchSectionRow,
  fetchItemsForSection,
  validateSectionDraft,
  fetchAllSections,
  fetchPublicSectionsWithItems,
  cloneSectionAsDraft,
  recordHistory,
};
