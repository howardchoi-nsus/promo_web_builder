const { fetchTemplateRow, fetchTemplateSections } = require("./_wizard-form-templates-store");
const { fetchItemsForSection } = require("./_wizard-content-sections-store");

const DEFAULT_LAYOUT_SPEC = Object.freeze({
  contractVersion: 1,
  specKey: "admin-default",
  theme: {
    backgroundColor: "#f5f7fb",
    textColor: "#172033",
    accentColor: "#156b5b",
    fontFamily: "Inter, Pretendard, sans-serif",
  },
  responsive: {
    contentMaxWidth: 1440,
    contentMinWidth: 1140,
    mobileBreakpoint: 720,
  },
  itemStyles: {},
  sectionStyles: {},
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeLayoutSpec(value) {
  const candidate = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    ...clone(DEFAULT_LAYOUT_SPEC),
    ...candidate,
    contractVersion: Number(candidate.contractVersion || 1),
    specKey: String(candidate.specKey || "admin-default"),
    theme: { ...DEFAULT_LAYOUT_SPEC.theme, ...(candidate.theme || {}) },
    responsive: { ...DEFAULT_LAYOUT_SPEC.responsive, ...(candidate.responsive || {}) },
    itemStyles: candidate.itemStyles && typeof candidate.itemStyles === "object" ? candidate.itemStyles : {},
    sectionStyles: candidate.sectionStyles && typeof candidate.sectionStyles === "object" ? candidate.sectionStyles : {},
  };
}

function validateLayoutSpec(value, sections = []) {
  const spec = normalizeLayoutSpec(value);
  const errors = [];
  const warnings = [];
  if (spec.contractVersion !== 1) errors.push({ code: "UNSUPPORTED_LAYOUT_CONTRACT", path: "contractVersion" });
  const sectionKeys = new Set(sections.map((section) => section.sectionKey));
  const itemKeys = new Set(sections.flatMap((section) => (
    (section.items || []).map((item) => `${section.sectionKey}.${item.itemKey}`)
  )));
  Object.entries(spec.sectionStyles).forEach(([key, style]) => {
    if (sections.length && !sectionKeys.has(key)) warnings.push({ code: "UNKNOWN_LAYOUT_SECTION", path: key });
    const height = Number(style?.minHeight);
    if (style?.minHeight !== undefined && (!Number.isFinite(height) || height < 50 || height > 1200)) {
      errors.push({ code: "INVALID_SECTION_HEIGHT", path: `sectionStyles.${key}.minHeight` });
    }
  });
  Object.entries(spec.itemStyles).forEach(([key, style]) => {
    if (sections.length && !itemKeys.has(key)) warnings.push({ code: "UNKNOWN_LAYOUT_ITEM", path: key });
    if (style?.xPct !== undefined && (!Number.isFinite(Number(style.xPct)) || Number(style.xPct) < 0 || Number(style.xPct) > 100)) {
      errors.push({ code: "INVALID_ITEM_X", path: `itemStyles.${key}.xPct` });
    }
    if (style?.yPx !== undefined && (!Number.isFinite(Number(style.yPx)) || Number(style.yPx) < 0 || Number(style.yPx) > 1200)) {
      errors.push({ code: "INVALID_ITEM_Y", path: `itemStyles.${key}.yPx` });
    }
    if (style?.fontSize !== undefined && (!Number.isFinite(Number(style.fontSize)) || Number(style.fontSize) < 10 || Number(style.fontSize) > 80)) {
      errors.push({ code: "INVALID_FONT_SIZE", path: `itemStyles.${key}.fontSize` });
    }
  });
  return { ok: errors.length === 0, errors, warnings, spec };
}

async function fetchLayoutRow(sql, templateId) {
  const rows = await sql`
    select id::text, form_template_id::text, renderer_key, renderer_version,
      contract_version, layout_revision, layout_spec, validation_result,
      change_note, created_at, updated_at
    from wizard_form_template_layouts
    where form_template_id = ${templateId}::uuid
    limit 1
  `;
  return rows[0] || null;
}

function toLayout(row) {
  if (!row) return {
    id: null,
    rendererKey: "default-promo-renderer",
    rendererVersion: 1,
    contractVersion: 1,
    layoutRevision: 1,
    layoutSpec: clone(DEFAULT_LAYOUT_SPEC),
    validationResult: { ok: true, errors: [], warnings: [] },
    changeNote: "",
    createdAt: null,
    updatedAt: null,
  };
  return {
    id: row.id,
    formTemplateId: row.form_template_id,
    rendererKey: row.renderer_key,
    rendererVersion: Number(row.renderer_version || 1),
    contractVersion: Number(row.contract_version || 1),
    layoutRevision: Number(row.layout_revision || 1),
    layoutSpec: normalizeLayoutSpec(row.layout_spec),
    validationResult: row.validation_result || {},
    changeNote: row.change_note || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function createLayoutIdentity(template = {}, layout = {}, configRevision = "") {
  return {
    contractVersion: 2,
    templateId: String(template.id || layout.formTemplateId || ""),
    templateKey: String(template.templateKey || template.template_key || ""),
    templateVersion: Number(template.version || 1),
    layoutId: String(layout.id || ""),
    layoutRevision: Number(layout.layoutRevision || 1),
    configRevision: String(configRevision || ""),
    rendererKey: String(layout.rendererKey || "default-promo-renderer"),
    rendererVersion: Number(layout.rendererVersion || 1),
  };
}

async function fetchTemplateWithItems(sql, templateId) {
  const template = await fetchTemplateRow(sql, templateId);
  if (!template) return null;
  const memberships = await fetchTemplateSections(sql, templateId);
  const sections = [];
  for (const membership of memberships) {
    sections.push({
      ...membership,
      name: membership.sectionName,
      description: membership.sectionDescription,
      items: membership.sectionId ? await fetchItemsForSection(sql, membership.sectionId) : [],
    });
  }
  return { template, sections };
}

async function ensureLayout(sql, templateId) {
  const existing = await fetchLayoutRow(sql, templateId);
  if (existing) return existing;
  const rows = await sql`
    insert into wizard_form_template_layouts (
      form_template_id, renderer_key, renderer_version, contract_version,
      layout_revision, layout_spec, validation_result, change_note
    ) values (
      ${templateId}::uuid, 'default-promo-renderer', 1, 1, 1,
      ${JSON.stringify(DEFAULT_LAYOUT_SPEC)}::jsonb,
      '{"ok":true,"errors":[],"warnings":[]}'::jsonb,
      'Default layout initialized.'
    )
    on conflict (form_template_id) do update set form_template_id = excluded.form_template_id
    returning id::text, form_template_id::text, renderer_key, renderer_version,
      contract_version, layout_revision, layout_spec, validation_result,
      change_note, created_at, updated_at
  `;
  return rows[0];
}

async function cloneLayout(sql, sourceTemplateId, targetTemplateId) {
  const source = toLayout(await fetchLayoutRow(sql, sourceTemplateId));
  const rows = await sql`
    insert into wizard_form_template_layouts (
      form_template_id, renderer_key, renderer_version, contract_version,
      layout_revision, layout_spec, validation_result, change_note
    ) values (
      ${targetTemplateId}::uuid, ${source.rendererKey}, ${source.rendererVersion},
      ${source.contractVersion}, 1, ${JSON.stringify(source.layoutSpec)}::jsonb,
      ${JSON.stringify(source.validationResult)}::jsonb, 'Layout cloned with form template.'
    )
    on conflict (form_template_id) do update set
      renderer_key = excluded.renderer_key,
      renderer_version = excluded.renderer_version,
      contract_version = excluded.contract_version,
      layout_spec = excluded.layout_spec,
      validation_result = excluded.validation_result,
      change_note = excluded.change_note,
      updated_at = now()
    returning id::text
  `;
  return rows[0] || null;
}

async function remapLayoutSectionKey(sql, templateId, previousKey, nextKey) {
  if (!previousKey || !nextKey || previousKey === nextKey) return null;
  const row = await fetchLayoutRow(sql, templateId);
  if (!row) return null;
  const layout = toLayout(row);
  const spec = clone(layout.layoutSpec);
  if (Object.prototype.hasOwnProperty.call(spec.sectionStyles || {}, previousKey)) {
    spec.sectionStyles[nextKey] = spec.sectionStyles[previousKey];
    delete spec.sectionStyles[previousKey];
  }
  Object.keys(spec.itemStyles || {}).forEach((key) => {
    if (!key.startsWith(`${previousKey}.`)) return;
    spec.itemStyles[`${nextKey}.${key.slice(previousKey.length + 1)}`] = spec.itemStyles[key];
    delete spec.itemStyles[key];
  });
  const rows = await sql`
    update wizard_form_template_layouts set
      layout_revision = layout_revision + 1,
      layout_spec = ${JSON.stringify(spec)}::jsonb,
      change_note = ${`Layout keys remapped from ${previousKey} to ${nextKey}.`},
      updated_at = now()
    where form_template_id = ${templateId}::uuid
    returning id::text
  `;
  return rows[0] || null;
}

module.exports = {
  DEFAULT_LAYOUT_SPEC,
  normalizeLayoutSpec,
  validateLayoutSpec,
  fetchLayoutRow,
  toLayout,
  createLayoutIdentity,
  fetchTemplateWithItems,
  ensureLayout,
  cloneLayout,
  remapLayoutSectionKey,
};
