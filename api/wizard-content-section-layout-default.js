const {
  getSql,
  parseBody,
  fetchSectionRow,
} = require("./_wizard-content-sections-store");
const {
  toLayout,
  fetchLayoutRow,
  recordLayoutHistory,
} = require("./_wizard-content-section-layouts-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const id = String(body.id || body.layoutId || "").trim();
    const sectionId = String(body.sectionId || "").trim();
    if (!id || !sectionId) return res.status(400).json({ error: "id and sectionId are required" });
    const sql = getSql();
    const section = await fetchSectionRow(sql, sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });
    if (section.status !== "draft") {
      return res.status(409).json({ error: `Layouts can only be edited in a section draft (current status: ${section.status}).` });
    }
    const current = await fetchLayoutRow(sql, id, sectionId);
    if (!current) return res.status(404).json({ error: "Section layout not found" });
    await sql`select set_wizard_content_section_default_layout(${sectionId}::uuid, ${id}::uuid)`;
    const updated = await fetchLayoutRow(sql, id, sectionId);
    await recordLayoutHistory(sql, {
      layoutId: id,
      sectionId,
      layoutKey: current.layout_key,
      action: "set-default",
      changeNote: String(body.changeNote || "Default section layout changed."),
      previousSnapshot: current.layout_snapshot,
      newSnapshot: updated.layout_snapshot,
    });
    return res.status(200).json({ ok: true, layout: toLayout(updated) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section default layout API failed",
      message: error.message,
    });
  }
};

