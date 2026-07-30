const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");
const { randomUUID } = require("crypto");

const TEMPLATE_STATUSES = ["draft", "active", "inactive", "archived"];

function createTemplateKey() {
  return `tpl_${randomUUID().replace(/-/g, "")}`;
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

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return typeof body === "object" && !Array.isArray(body) ? body : {};
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

const RECOMMENDATION_PROFILE_KEYS = [
  "promotionTypes", "markets", "audiences", "tones", "supportedComponentRoles",
  "requiredInputs", "requiredNotices", "tags",
];

function normalizeRecommendationProfile(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(RECOMMENDATION_PROFILE_KEYS.map((key) => [
    key,
    Array.from(new Set(
      (Array.isArray(source[key]) ? source[key] : [])
        .map((item) => String(item || "").trim())
        .filter((item) => item && (
          key !== "requiredInputs"
          || !["primaryAction.label", "primaryAction.url"].includes(item)
        ))
    )).slice(0, 100),
  ]));
}

async function recommendationProfileColumnAvailable(sql) {
  const rows = await sql`
    select exists (
      select 1 from information_schema.columns
      where table_schema = current_schema()
        and table_name = 'wizard_form_templates'
        and column_name = 'recommendation_profile'
    ) as available
  `;
  return Boolean(rows[0]?.available);
}

async function attachRecommendationProfiles(sql, rows) {
  if (!rows.length || !await recommendationProfileColumnAvailable(sql)) return rows;
  const ids = rows.map((row) => row.id);
  const profiles = await sql`
    select id::text, recommendation_profile
    from wizard_form_templates
    where id = any(${ids}::uuid[])
  `;
  const byId = new Map(profiles.map((row) => [row.id, row.recommendation_profile]));
  return rows.map((row) => ({ ...row, recommendation_profile: byId.get(row.id) || {} }));
}

function toFormTemplate(row) {
  return {
    id: row.id,
    templateKey: row.template_key,
    name: row.name,
    description: row.description || "",
    status: row.status,
    version: Number(row.version || 1),
    isDefault: Boolean(row.is_default),
    changeNote: row.change_note || "",
    recommendationProfile: normalizeRecommendationProfile(row.recommendation_profile),
    designTokenSetVersionId: row.design_token_set_version_id || null,
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function toTemplateSection(row) {
  return {
    id: row.id,
    formTemplateId: row.form_template_id,
    sectionId: row.section_id || null,
    sectionKey: row.section_key,
    sectionName: row.section_name || "",
    sectionDescription: row.section_description || "",
    sectionVersion: row.section_version ? Number(row.section_version) : null,
    sectionStatus: row.section_status || null,
    aiDesign: row.ai_design || null,
    sortOrder: Number(row.sort_order || 0),
    isRequired: Boolean(row.is_required),
    isVisible: Boolean(row.is_visible),
    orderChangeAllowed: Boolean(row.order_change_allowed),
    userReorderAllowed: row.user_reorder_allowed === undefined ? Boolean(row.order_change_allowed) : Boolean(row.user_reorder_allowed),
    fixedPosition: row.fixed_position || null,
    compositionScope: row.composition_scope === "shared" ? "shared" : "template",
    sectionRole: row.section_role || "content",
    compositionPolicy: row.composition_policy || {},
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function fetchTemplateRow(sql, id) {
  const rows = await sql`
    select id::text, template_key, name, description, status, version,
      is_default, change_note, design_token_set_version_id::text,
      archived_at, created_at, updated_at
    from wizard_form_templates where id = ${id}::uuid limit 1
  `;
  return (await attachRecommendationProfiles(sql, rows))[0] || null;
}

async function fetchTemplates(sql, { includeArchived = false, activeOnly = false } = {}) {
  const rows = activeOnly
    ? await sql`
      select id::text, template_key, name, description, status, version,
        is_default, change_note, design_token_set_version_id::text, archived_at, created_at, updated_at
      from wizard_form_templates where status = 'active'
      order by is_default desc, name asc, version desc
    `
    : includeArchived
      ? await sql`
        select id::text, template_key, name, description, status, version,
          is_default, change_note, design_token_set_version_id::text, archived_at, created_at, updated_at
        from wizard_form_templates
        order by is_default desc, name asc, version desc
      `
      : await sql`
        select id::text, template_key, name, description, status, version,
          is_default, change_note, design_token_set_version_id::text, archived_at, created_at, updated_at
        from wizard_form_templates where status <> 'archived'
        order by is_default desc, name asc, version desc
      `;
  return (await attachRecommendationProfiles(sql, rows)).map(toFormTemplate);
}

async function fetchTemplateSections(sql, templateId) {
  const rows = await sql`
    select ts.id::text, ts.form_template_id::text, source_section.id::text as section_id,
      ts.section_key,
      source_section.name as section_name, source_section.description as section_description, source_section.version as section_version,
      source_section.status as section_status, source_section.ai_design,
      source_section.composition_scope, source_section.section_role, source_section.composition_policy,
      ts.sort_order, source_section.is_required,
      source_section.is_visible_in_wizard as is_visible,
      source_section.order_change_allowed,
      case when source_section.fixed_position is not null then false else source_section.order_change_allowed end as user_reorder_allowed,
      source_section.fixed_position, ts.created_at, ts.updated_at
    from wizard_form_template_sections ts
    left join lateral (
      select s.id, s.name, s.description, s.version, s.status, s.ai_design,
        s.composition_scope, s.section_role, s.composition_policy,
        s.is_required, s.is_visible_in_wizard, s.order_change_allowed, s.fixed_position
      from wizard_content_sections s
      where (ts.section_id is not null and s.id = ts.section_id)
        or (ts.section_id is null and s.section_key = ts.section_key and s.status = 'active')
      order by
        case when s.id = ts.section_id then 0 else 1 end,
        s.version desc
      limit 1
    ) source_section on true
    where ts.form_template_id = ${templateId}::uuid
    order by
      case ts.fixed_position when 'top' then 0 when 'bottom' then 2 else 1 end,
      ts.sort_order asc, ts.created_at asc
  `;
  return rows.map(toTemplateSection);
}

async function validateTemplateDraft(sql, templateId) {
  const row = await fetchTemplateRow(sql, templateId);
  if (!row) return [{ code: "TEMPLATE_NOT_FOUND", message: "Form template not found." }];
  const sections = await fetchTemplateSections(sql, templateId);
  const errors = [];
  if (!sections.some((section) => section.isVisible)) {
    errors.push({ code: "VISIBLE_SECTION_REQUIRED", message: "At least one visible section is required." });
  }
  for (const section of sections) {
    if (!section.sectionVersion || section.sectionStatus !== "active") {
      errors.push({ code: "ACTIVE_SECTION_REQUIRED", path: section.sectionKey, message: "The section needs an active version." });
    }
    if (section.sectionId) {
      const itemRows = await sql`
        select count(*)::integer as count
        from wizard_content_section_component_instances instance
        join wizard_item_component_versions version on version.id = instance.component_version_id
        where instance.section_id = ${section.sectionId}::uuid and instance.is_visible_in_wizard = true
          and version.status in ('active', 'inactive')
      `;
      if (!Number(itemRows[0]?.count || 0)) errors.push({ code: "SECTION_COMPONENT_REQUIRED", path: section.sectionKey, message: "The section needs at least one visible component instance." });
    }
  }
  return errors;
}

module.exports = {
  TEMPLATE_STATUSES,
  createTemplateKey,
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  normalizeRecommendationProfile,
  recommendationProfileColumnAvailable,
  toFormTemplate,
  toTemplateSection,
  fetchTemplateRow,
  fetchTemplates,
  fetchTemplateSections,
  validateTemplateDraft,
};
