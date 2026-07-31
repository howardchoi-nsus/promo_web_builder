const {
  getSql,
  parseBody,
  fetchSectionRow,
  fetchItemsForSection,
} = require("./_wizard-content-sections-store");
const {
  normalizeLayoutSnapshot,
  toLayout,
  fetchLayoutRow,
  fetchLayoutRows,
  recordLayoutHistory,
} = require("./_wizard-content-section-layouts-store");

async function requireEditableLayout(sql, id, sectionId = "") {
  const row = await fetchLayoutRow(sql, id, sectionId);
  if (!row) {
    const error = new Error("Section layout not found");
    error.statusCode = 404;
    throw error;
  }
  const section = await fetchSectionRow(sql, row.section_id);
  if (!section) {
    const error = new Error("Section not found");
    error.statusCode = 404;
    throw error;
  }
  if (section.status !== "draft") {
    const error = new Error(`Layouts can only be edited in a section draft (current status: ${section.status}).`);
    error.statusCode = 409;
    throw error;
  }
  return row;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getLayout(req, res);
    if (req.method === "PATCH") return await updateLayout(req, res);
    if (req.method === "DELETE") return await deleteLayout(req, res);
    res.setHeader("Allow", "GET, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section layout API failed",
      message: error.message,
      errors: error.validationErrors || undefined,
    });
  }
};

async function getLayout(req, res) {
  const id = String(req.query.id || "").trim();
  const sectionId = String(req.query.sectionId || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const row = await fetchLayoutRow(getSql(), id, sectionId);
  if (!row) return res.status(404).json({ error: "Section layout not found" });
  return res.status(200).json({ ok: true, layout: toLayout(row) });
}

async function updateLayout(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  const sectionId = String(body.sectionId || req.query.sectionId || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const current = await requireEditableLayout(sql, id, sectionId);
  const hasName = Object.prototype.hasOwnProperty.call(body, "name");
  const hasDescription = Object.prototype.hasOwnProperty.call(body, "description");
  const hasSnapshot = Object.prototype.hasOwnProperty.call(body, "layoutSnapshot");
  const name = hasName ? String(body.name || "").trim() : current.name;
  if (!name) return res.status(400).json({ error: "name is required" });

  let snapshot = current.layout_snapshot;
  if (hasSnapshot) {
    const items = await fetchItemsForSection(sql, current.section_id);
    const normalized = normalizeLayoutSnapshot(body.layoutSnapshot, items.map((item) => item.itemKey));
    if (normalized.errors.length) {
      return res.status(422).json({ error: "Layout snapshot validation failed", errors: normalized.errors });
    }
    snapshot = normalized.snapshot;
  }
  const changeNote = String(body.changeNote || "Section layout preset updated.").trim();
  const rows = await sql`
    update wizard_content_section_layouts
    set
      name = ${name},
      description = ${hasDescription ? String(body.description || "") : current.description || ""},
      layout_snapshot = ${JSON.stringify(snapshot)}::jsonb,
      change_note = ${changeNote},
      updated_at = now()
    where id = ${id}::uuid and section_id = ${current.section_id}::uuid
    returning id::text, section_id::text, layout_key, name, description, is_default,
      layout_snapshot, change_note, created_at, updated_at
  `;
  await recordLayoutHistory(sql, {
    layoutId: id,
    sectionId: current.section_id,
    layoutKey: current.layout_key,
    action: "update",
    changeNote,
    previousSnapshot: current.layout_snapshot,
    newSnapshot: snapshot,
  });
  return res.status(200).json({ ok: true, layout: toLayout(rows[0]) });
}

async function deleteLayout(req, res) {
  const id = String(req.query.id || "").trim();
  const sectionId = String(req.query.sectionId || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });
  const sql = getSql();
  const current = await requireEditableLayout(sql, id, sectionId);
  await sql`
    delete from wizard_content_section_layouts
    where id = ${id}::uuid and section_id = ${current.section_id}::uuid
  `;
  await recordLayoutHistory(sql, {
    layoutId: null,
    sectionId: current.section_id,
    layoutKey: current.layout_key,
    action: "delete",
    changeNote: String(req.query.changeNote || "Section layout preset deleted."),
    previousSnapshot: current.layout_snapshot,
  });
  if (current.is_default) {
    const remaining = await fetchLayoutRows(sql, current.section_id);
    if (remaining.length) {
      await sql`select set_wizard_content_section_default_layout(${current.section_id}::uuid, ${remaining[0].id}::uuid)`;
    }
  }
  return res.status(200).json({ ok: true, id });
}

