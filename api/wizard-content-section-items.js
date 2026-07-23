const {
  getSql, parseBody, normalizeBoolean, normalizeNumber, hasLockedValue,
  validateLockedValue, fetchSectionRow, fetchItemsForSection,
} = require("./_wizard-content-sections-store");
const { randomUUID } = require("crypto");

function createItemKey() {
  return `item_${Date.now().toString(36)}_${randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

async function requireDraftSection(sql, sectionId) {
  const section = await fetchSectionRow(sql, sectionId);
  if (!section) { const error = new Error("Section not found"); error.statusCode = 404; throw error; }
  if (section.status !== "draft") {
    const error = new Error(`Component instances can only be edited in a section draft (current status: ${section.status}).`);
    error.statusCode = 409;
    throw error;
  }
  return section;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await listItems(req, res);
    if (req.method === "POST") return await upsertInstance(req, res);
    if (req.method === "DELETE") return await deleteInstance(req, res);
    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section component instances API failed", message: error.message });
  }
};

async function listItems(req, res) {
  const sectionId = String(req.query.sectionId || "").trim();
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });
  return res.status(200).json({ ok: true, items: await fetchItemsForSection(getSql(), sectionId) });
}

async function upsertInstance(req, res) {
  const body = parseBody(req.body);
  const sectionId = String(body.sectionId || "").trim();
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });
  const sql = getSql();
  await requireDraftSection(sql, sectionId);
  const id = String(body.id || "").trim();
  const itemKey = String(body.itemKey || "").trim() || createItemKey();
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(itemKey)) return res.status(400).json({ error: "itemKey is invalid" });
  const isLocked = normalizeBoolean(body.isLocked, false);
  const lockedValue = isLocked ? (body.lockedValue ?? null) : null;

  if (id) {
    const existing = await sql`
      select instance.id::text, version.field_kind
      from wizard_content_section_component_instances instance
      join wizard_item_component_versions version on version.id = instance.component_version_id
      where instance.id = ${id}::uuid and instance.section_id = ${sectionId}::uuid limit 1
    `;
    if (!existing.length) return res.status(404).json({ error: "Component instance not found" });
    if (isLocked) {
      const message = validateLockedValue(existing[0].field_kind, lockedValue);
      if (message) return res.status(400).json({ error: message });
    }
    const componentVersionId = String(body.componentVersionId || "").trim();
    if (componentVersionId) {
      const allowed = await sql`select id::text from wizard_item_component_versions where id = ${componentVersionId}::uuid and status in ('active', 'draft') limit 1`;
      if (!allowed.length) return res.status(422).json({ error: "componentVersionId is not selectable" });
    }
    await sql`
      update wizard_content_section_component_instances set
        component_version_id = coalesce(${componentVersionId || null}::uuid, component_version_id),
        item_key = ${itemKey}, display_name = ${String(body.name || body.displayName || "").trim() || null},
        is_visible_in_wizard = ${normalizeBoolean(body.isVisibleInWizard, true)},
        is_required = ${normalizeBoolean(body.isRequired, false)},
        user_reorder_allowed = ${normalizeBoolean(body.userReorderAllowed, true)},
        sort_order = ${normalizeNumber(body.sortOrder) ?? 0}, is_locked = ${isLocked},
        locked_value = ${hasLockedValue(lockedValue) ? JSON.stringify(lockedValue) : null}::jsonb,
        instance_config = ${JSON.stringify(body.instanceConfig || {})}::jsonb, updated_at = now()
      where id = ${id}::uuid and section_id = ${sectionId}::uuid
    `;
    const items = await fetchItemsForSection(sql, sectionId);
    return res.status(200).json({ ok: true, item: items.find((item) => item.id === id) });
  }

  const componentVersionId = String(body.componentVersionId || "").trim();
  if (!componentVersionId) return res.status(400).json({ error: "componentVersionId is required" });
  if (Object.prototype.hasOwnProperty.call(body, "fieldKind") || Object.prototype.hasOwnProperty.call(body, "textType")) {
    return res.status(400).json({ error: "Component definitions cannot be created from a section" });
  }
  const versions = await sql`
    select id::text, field_kind from wizard_item_component_versions
    where id = ${componentVersionId}::uuid and status = 'active' limit 1
  `;
  if (!versions.length) return res.status(422).json({ error: "componentVersionId must reference an active component version" });
  if (isLocked) {
    const message = validateLockedValue(versions[0].field_kind, lockedValue);
    if (message) return res.status(400).json({ error: message });
  }
  const rows = await sql`
    insert into wizard_content_section_component_instances (
      section_id, component_version_id, item_key, display_name, is_visible_in_wizard,
      is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
    ) values (
      ${sectionId}::uuid, ${componentVersionId}::uuid, ${itemKey}, ${String(body.name || body.displayName || "").trim() || null},
      ${normalizeBoolean(body.isVisibleInWizard, true)}, ${normalizeBoolean(body.isRequired, false)},
      ${normalizeBoolean(body.userReorderAllowed, true)}, ${normalizeNumber(body.sortOrder) ?? 0}, ${isLocked},
      ${hasLockedValue(lockedValue) ? JSON.stringify(lockedValue) : null}::jsonb,
      ${JSON.stringify(body.instanceConfig || {})}::jsonb
    ) returning id::text
  `;
  const items = await fetchItemsForSection(sql, sectionId);
  return res.status(201).json({ ok: true, item: items.find((item) => item.id === rows[0].id) });
}

async function deleteInstance(req, res) {
  const id = String(req.query.id || "").trim();
  const sectionId = String(req.query.sectionId || "").trim();
  if (!id || !sectionId) return res.status(400).json({ error: "id and sectionId are required" });
  const sql = getSql();
  await requireDraftSection(sql, sectionId);
  const rows = await sql`delete from wizard_content_section_component_instances where id = ${id}::uuid and section_id = ${sectionId}::uuid returning id::text`;
  if (!rows.length) return res.status(404).json({ error: "Component instance not found" });
  return res.status(200).json({ ok: true, id });
}
