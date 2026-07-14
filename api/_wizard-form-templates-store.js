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
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function toTemplateSection(row) {
  return {
    id: row.id,
    formTemplateId: row.form_template_id,
    sectionKey: row.section_key,
    sectionName: row.section_name || "",
    sectionVersion: row.section_version ? Number(row.section_version) : null,
    sortOrder: Number(row.sort_order || 0),
    isRequired: Boolean(row.is_required),
    isVisible: Boolean(row.is_visible),
    orderChangeAllowed: Boolean(row.order_change_allowed),
    fixedPosition: row.fixed_position || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function fetchTemplateRow(sql, id) {
  const rows = await sql`
    select id::text, template_key, name, description, status, version,
      is_default, change_note, archived_at, created_at, updated_at
    from wizard_form_templates where id = ${id}::uuid limit 1
  `;
  return rows[0] || null;
}

async function fetchTemplates(sql, { includeArchived = false, activeOnly = false } = {}) {
  const rows = activeOnly
    ? await sql`
      select id::text, template_key, name, description, status, version,
        is_default, change_note, archived_at, created_at, updated_at
      from wizard_form_templates where status = 'active'
      order by is_default desc, name asc, version desc
    `
    : includeArchived
      ? await sql`
        select id::text, template_key, name, description, status, version,
          is_default, change_note, archived_at, created_at, updated_at
        from wizard_form_templates
        order by is_default desc, name asc, version desc
      `
      : await sql`
        select id::text, template_key, name, description, status, version,
          is_default, change_note, archived_at, created_at, updated_at
        from wizard_form_templates where status <> 'archived'
        order by is_default desc, name asc, version desc
      `;
  return rows.map(toFormTemplate);
}

async function fetchTemplateSections(sql, templateId) {
  const rows = await sql`
    select ts.id::text, ts.form_template_id::text, ts.section_key,
      active_section.name as section_name, active_section.version as section_version,
      ts.sort_order, ts.is_required, ts.is_visible, ts.order_change_allowed,
      ts.fixed_position, ts.created_at, ts.updated_at
    from wizard_form_template_sections ts
    left join lateral (
      select s.name, s.version
      from wizard_content_sections s
      where s.section_key = ts.section_key and s.status = 'active'
      limit 1
    ) active_section on true
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
  sections.forEach((section) => {
    if (!section.sectionVersion) {
      errors.push({ code: "ACTIVE_SECTION_REQUIRED", path: section.sectionKey, message: "The section needs an active version." });
    }
  });
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
