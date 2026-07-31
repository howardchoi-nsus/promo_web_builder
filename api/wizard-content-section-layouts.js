const { randomUUID } = require("crypto");
const {
  getSql,
  parseBody,
  fetchSectionRow,
  fetchItemsForSection,
} = require("./_wizard-content-sections-store");
const {
  normalizeLayoutSnapshot,
  toLayout,
  fetchLayoutsForSection,
  fetchLayoutRow,
  recordLayoutHistory,
} = require("./_wizard-content-section-layouts-store");

function createLayoutKey() {
  return `layout_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

async function requireDraftSection(sql, sectionId) {
  const section = await fetchSectionRow(sql, sectionId);
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
  return section;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await listLayouts(req, res);
    if (req.method === "POST") return await createLayout(req, res);
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section layouts API failed",
      message: error.message,
      errors: error.validationErrors || undefined,
    });
  }
};

async function listLayouts(req, res) {
  const sectionId = String(req.query.sectionId || "").trim();
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });
  const sql = getSql();
  if (!await fetchSectionRow(sql, sectionId)) return res.status(404).json({ error: "Section not found" });
  return res.status(200).json({ ok: true, layouts: await fetchLayoutsForSection(sql, sectionId) });
}

async function createLayout(req, res) {
  const body = parseBody(req.body);
  const sectionId = String(body.sectionId || "").trim();
  if (!sectionId) return res.status(400).json({ error: "sectionId is required" });
  const name = String(body.name || "").trim();
  if (!name) return res.status(400).json({ error: "name is required" });
  const layoutKey = String(body.layoutKey || "").trim() || createLayoutKey();
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(layoutKey)) {
    return res.status(400).json({ error: "layoutKey is invalid" });
  }

  const sql = getSql();
  await requireDraftSection(sql, sectionId);
  const items = await fetchItemsForSection(sql, sectionId);
  const normalized = normalizeLayoutSnapshot(body.layoutSnapshot, items.map((item) => item.itemKey));
  if (normalized.errors.length) {
    return res.status(422).json({ error: "Layout snapshot validation failed", errors: normalized.errors });
  }
  const existingLayouts = await fetchLayoutsForSection(sql, sectionId, { includeSnapshot: false });
  const wantsDefault = body.isDefault === true || existingLayouts.length === 0;
  const changeNote = String(body.changeNote || "Section layout preset created.").trim();
  const rows = await sql`
    insert into wizard_content_section_layouts (
      section_id, layout_key, name, description, is_default,
      layout_snapshot, change_note
    ) values (
      ${sectionId}::uuid, ${layoutKey}, ${name}, ${String(body.description || "")},
      false, ${JSON.stringify(normalized.snapshot)}::jsonb, ${changeNote}
    )
    returning id::text
  `;
  if (wantsDefault) {
    await sql`select set_wizard_content_section_default_layout(${sectionId}::uuid, ${rows[0].id}::uuid)`;
  }
  const row = await fetchLayoutRow(sql, rows[0].id, sectionId);
  await recordLayoutHistory(sql, {
    layoutId: row.id,
    sectionId,
    layoutKey,
    action: "create",
    changeNote,
    newSnapshot: row.layout_snapshot,
  });
  return res.status(201).json({ ok: true, layout: toLayout(row) });
}

