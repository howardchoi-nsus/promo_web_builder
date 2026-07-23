const { getDatabaseUrl } = require("./_db");
const { neon } = require("@neondatabase/serverless");

const TEMPLATE_STATUSES = ["draft", "active", "inactive", "archived"];

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
  return rows[0] || null;
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
  return rows.map(toFormTemplate);
}

async function fetchTemplateSections(sql, templateId) {
  const rows = await sql`
    select ts.id::text, ts.form_template_id::text, source_section.id::text as section_id,
      ts.section_key,
      source_section.name as section_name, source_section.description as section_description, source_section.version as section_version,
      source_section.status as section_status, source_section.ai_design,
      ts.sort_order, ts.is_required, ts.is_visible, ts.order_change_allowed,
      ts.user_reorder_allowed, ts.fixed_position, ts.created_at, ts.updated_at
    from wizard_form_template_sections ts
    left join lateral (
      select s.id, s.name, s.description, s.version, s.status, s.ai_design
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
  if (!row.design_token_set_version_id) {
    errors.push({ code: "DESIGN_TOKEN_SET_REQUIRED", message: "An active design token set version is required." });
  } else {
    const tokenRows = await sql`
      select id::text from promo_design_token_set_versions
      where id = ${row.design_token_set_version_id}::uuid and status = 'active' limit 1
    `;
    if (!tokenRows.length) errors.push({ code: "ACTIVE_DESIGN_TOKEN_SET_REQUIRED", message: "The pinned design token set version must be active." });
  }
  if (!sections.some((section) => section.isVisible)) {
    errors.push({ code: "VISIBLE_SECTION_REQUIRED", message: "At least one visible section is required." });
  }
  for (const section of sections) {
    if (!section.sectionVersion) {
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
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  toFormTemplate,
  toTemplateSection,
  fetchTemplateRow,
  fetchTemplates,
  fetchTemplateSections,
  validateTemplateDraft,
};
