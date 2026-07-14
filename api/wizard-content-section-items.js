const {
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
  toSectionItem,
  fetchSectionRow,
  fetchItemsForSection,
} = require("./_wizard-content-sections-store");

// GET    ?sectionId=          -> list items for a section.
// POST   { sectionId, ... }   -> create a new item (no id) or update an existing one (id present).
// DELETE ?id=&sectionId=      -> remove an item.
// Writes are only allowed while the parent section is in 'draft' status, so a
// live Wizard configuration can never change mid-edit.
module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await listItems(req, res);
    if (req.method === "POST") return await upsertItem(req, res);
    if (req.method === "DELETE") return await deleteItem(req, res);

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section items API failed",
      message: error.message,
    });
  }
};

async function requireDraftSection(sql, sectionId) {
  const section = await fetchSectionRow(sql, sectionId);
  if (!section) {
    const error = new Error("Section not found");
    error.statusCode = 404;
    throw error;
  }
  if (section.status !== "draft") {
    const error = new Error(`Items can only be edited while the section is in draft status (current status: ${section.status}). Create a new draft first.`);
    error.statusCode = 409;
    throw error;
  }
  return section;
}

async function listItems(req, res) {
  const sectionId = String(req.query.sectionId || "").trim();
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });

  const sql = getSql();
  const items = await fetchItemsForSection(sql, sectionId);
  return res.status(200).json({ ok: true, items });
}

async function upsertItem(req, res) {
  const body = parseBody(req.body);
  const sectionId = String(body.sectionId || "").trim();
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });

  const sql = getSql();
  await requireDraftSection(sql, sectionId);

  const fieldKind = validateFieldKind(body.fieldKind);
  const textType = validateTextType(fieldKind, body.textType);
  const image = fieldKind === "image" ? (body.image || {}) : {};
  const ctaUtm = fieldKind === "cta" ? normalizeUtm(body.ctaUtm || {}) : { source: "", medium: "", campaign: "", content: "", term: "" };
  const isLocked = normalizeBoolean(body.isLocked, false);
  const lockedValue = isLocked ? (body.lockedValue ?? null) : null;

  const id = String(body.id || "").trim();
  const name = String(body.name || "").trim();
  const itemKey = String(body.itemKey || "").trim();
  if (!name) return res.status(400).json({ error: "name is required" });
  const allowedSources = normalizeImageSources(image.allowedSources);
  if (fieldKind === "image" && !allowedSources.length) {
    return res.status(400).json({ error: "image.allowedSources must include url or ai" });
  }
  if (fieldKind === "image" && allowedSources.includes("ai") && !String(image.promptText || "").trim()) {
    return res.status(400).json({ error: "image.promptText is required when AI generation is allowed" });
  }
  const maxSizeKb = normalizeNumber(image.maxSizeKb);
  if (fieldKind === "image" && maxSizeKb !== null && maxSizeKb <= 0) {
    return res.status(400).json({ error: "image.maxSizeKb must be greater than zero" });
  }
  if (isLocked) {
    const lockedValueError = validateLockedValue(fieldKind, lockedValue);
    if (lockedValueError) return res.status(400).json({ error: lockedValueError });
  }

  if (id) {
    const rows = await sql`
      update wizard_content_section_items
      set
        name = ${name},
        is_visible_in_wizard = ${normalizeBoolean(body.isVisibleInWizard, true)},
        is_required = ${normalizeBoolean(body.isRequired, false)},
        user_reorder_allowed = ${normalizeBoolean(body.userReorderAllowed, true)},
        sort_order = ${normalizeNumber(body.sortOrder) ?? 0},
        field_kind = ${fieldKind},
        text_type = ${textType},
        image_allowed_sources = ${JSON.stringify(allowedSources)}::jsonb,
        image_prompt_text = ${String(image.promptText || "")},
        image_alt_text_required = ${normalizeBoolean(image.altTextRequired, false)},
        image_aspect_ratio = ${image.aspectRatio ? String(image.aspectRatio) : null},
        image_max_size_kb = ${maxSizeKb},
        cta_utm_source = ${ctaUtm.source || null},
        cta_utm_medium = ${ctaUtm.medium || null},
        cta_utm_campaign = ${ctaUtm.campaign || null},
        cta_utm_content = ${ctaUtm.content || null},
        cta_utm_term = ${ctaUtm.term || null},
        is_locked = ${isLocked},
        locked_value = ${hasLockedValue(lockedValue) ? JSON.stringify(lockedValue) : null}::jsonb,
        updated_at = now()
      where id = ${id}::uuid and section_id = ${sectionId}::uuid
      returning
        id::text, section_id::text, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed, sort_order,
        field_kind, text_type, image_allowed_sources, image_prompt_text, image_alt_text_required,
        image_aspect_ratio, image_max_size_kb, cta_utm_source, cta_utm_medium, cta_utm_campaign,
        cta_utm_content, cta_utm_term, is_locked, locked_value, created_at, updated_at
    `;
    if (!rows.length) return res.status(404).json({ error: "Item not found in this section" });
    return res.status(200).json({ ok: true, item: toSectionItem(rows[0]) });
  }

  if (!itemKey) return res.status(400).json({ error: "itemKey is required for new items" });
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(itemKey)) {
    return res.status(400).json({ error: "itemKey must start with a letter and contain only letters, numbers, and underscores" });
  }

  const existing = await sql`
    select id::text from wizard_content_section_items
    where section_id = ${sectionId}::uuid and item_key = ${itemKey}
    limit 1
  `;
  if (existing.length) return res.status(409).json({ error: "itemKey already exists in this section" });

  const rows = await sql`
    insert into wizard_content_section_items (
      section_id, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed, sort_order,
      field_kind, text_type, image_allowed_sources, image_prompt_text,
      image_alt_text_required, image_aspect_ratio, image_max_size_kb,
      cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
      is_locked, locked_value
    )
    values (
      ${sectionId}::uuid, ${itemKey}, ${name}, ${normalizeBoolean(body.isVisibleInWizard, true)},
      ${normalizeBoolean(body.isRequired, false)}, ${normalizeBoolean(body.userReorderAllowed, true)}, ${normalizeNumber(body.sortOrder) ?? 0},
      ${fieldKind}, ${textType}, ${JSON.stringify(allowedSources)}::jsonb,
      ${String(image.promptText || "")}, ${normalizeBoolean(image.altTextRequired, false)},
      ${image.aspectRatio ? String(image.aspectRatio) : null}, ${maxSizeKb},
      ${ctaUtm.source || null}, ${ctaUtm.medium || null}, ${ctaUtm.campaign || null},
      ${ctaUtm.content || null}, ${ctaUtm.term || null},
      ${isLocked}, ${hasLockedValue(lockedValue) ? JSON.stringify(lockedValue) : null}::jsonb
    )
    returning
      id::text, section_id::text, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed, sort_order,
      field_kind, text_type, image_allowed_sources, image_prompt_text, image_alt_text_required,
      image_aspect_ratio, image_max_size_kb, cta_utm_source, cta_utm_medium, cta_utm_campaign,
      cta_utm_content, cta_utm_term, is_locked, locked_value, created_at, updated_at
  `;

  return res.status(201).json({ ok: true, item: toSectionItem(rows[0]) });
}

async function deleteItem(req, res) {
  const id = String(req.query.id || "").trim();
  const sectionId = String(req.query.sectionId || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });

  const sql = getSql();
  await requireDraftSection(sql, sectionId);

  const rows = await sql`
    delete from wizard_content_section_items
    where id = ${id}::uuid and section_id = ${sectionId}::uuid
    returning id::text
  `;
  if (!rows.length) return res.status(404).json({ error: "Item not found in this section" });

  return res.status(200).json({ ok: true, id: rows[0].id });
}
