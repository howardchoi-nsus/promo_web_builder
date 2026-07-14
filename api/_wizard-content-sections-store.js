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
// File uploads are not accepted until the Blob upload flow is implemented.
const IMAGE_SOURCES = ["url", "ai"];
const SECTION_STATUSES = ["draft", "active", "inactive", "archived"];

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
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function toSectionItem(row) {
  return {
    id: row.id,
    sectionId: row.section_id,
    itemKey: row.item_key,
    name: row.name,
    isVisibleInWizard: Boolean(row.is_visible_in_wizard),
    isRequired: Boolean(row.is_required),
    sortOrder: Number(row.sort_order || 0),
    fieldKind: row.field_kind,
    textType: row.text_type || null,
    image: row.field_kind === "image" ? {
      allowedSources: Array.isArray(row.image_allowed_sources) ? row.image_allowed_sources : [],
      promptText: row.image_prompt_text || "",
      altTextRequired: Boolean(row.image_alt_text_required),
      aspectRatio: row.image_aspect_ratio || "",
      maxSizeKb: row.image_max_size_kb === null || row.image_max_size_kb === undefined ? null : Number(row.image_max_size_kb),
    } : null,
    ctaUtm: row.field_kind === "cta" ? {
      source: row.cta_utm_source || "",
      medium: row.cta_utm_medium || "",
      campaign: row.cta_utm_campaign || "",
      content: row.cta_utm_content || "",
      term: row.cta_utm_term || "",
    } : null,
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
      change_note, archived_at, created_at, updated_at
    from wizard_content_sections
    where id = ${id}::uuid
    limit 1
  `;
  return rows[0] || null;
}

async function fetchItemRows(sql, sectionId) {
  return sql`
    select
      id::text, section_id::text, item_key, name, is_visible_in_wizard, is_required, sort_order,
      field_kind, text_type, image_allowed_sources, image_prompt_text, image_alt_text_required,
      image_aspect_ratio, image_max_size_kb, cta_utm_source, cta_utm_medium, cta_utm_campaign,
      cta_utm_content, cta_utm_term, is_locked, locked_value, created_at, updated_at
    from wizard_content_section_items
    where section_id = ${sectionId}::uuid
    order by sort_order asc, created_at asc
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
        change_note, archived_at, created_at, updated_at
      from wizard_content_sections
      order by sort_order asc, section_key asc, version desc
    `
    : await sql`
      select
        id::text, section_key, name, description, is_required, order_change_allowed,
        fixed_position, sort_order, is_visible_in_wizard, status, version,
        change_note, archived_at, created_at, updated_at
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
      change_note, archived_at, created_at, updated_at
    from wizard_content_sections
    where status = 'active' and is_visible_in_wizard = true
    order by
      case fixed_position when 'top' then 0 when 'bottom' then 2 else 1 end,
      sort_order asc
  `;
  const sections = [];
  for (const row of sectionRows) {
    const section = toSection(row);
    const itemRows = await sql`
      select
        id::text, section_id::text, item_key, name, is_visible_in_wizard, is_required, sort_order,
        field_kind, text_type, image_allowed_sources, image_prompt_text, image_alt_text_required,
        image_aspect_ratio, image_max_size_kb, cta_utm_source, cta_utm_medium, cta_utm_campaign,
        cta_utm_content, cta_utm_term, is_locked, locked_value, created_at, updated_at
      from wizard_content_section_items
      where section_id = ${row.id}::uuid and is_visible_in_wizard = true
      order by sort_order asc, created_at asc
    `;
    sections.push({ ...section, items: itemRows.map(toSectionItem) });
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
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  normalizeImageSources,
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
