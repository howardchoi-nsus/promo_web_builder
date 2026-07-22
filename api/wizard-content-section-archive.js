const {
  getSql,
  parseBody,
  toSection,
  fetchSectionRow,
  fetchComponentUsage,
  recordHistory,
} = require("./_wizard-content-sections-store");

// POST { id } -> soft delete. Sets status = 'archived' and clears wizard visibility.
// Rows are kept (not hard-deleted) so runs that already reference this section
// structure can still be inspected. See PRD open question #1 (soft delete policy).
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const id = String(body.id || req.query.id || "").trim();
    const changeNote = String(body.changeNote || "Section archived from Admin Page.").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    const current = await fetchSectionRow(sql, id);
    if (!current) return res.status(404).json({ error: "Section not found" });
    if (current.status === "archived") {
      return res.status(409).json({ error: "Section is already archived" });
    }
    if (current.status === "active") {
      return res.status(409).json({
        error: "Active sections cannot be archived directly. Activate a replacement or publish a hidden draft first.",
      });
    }
    const usage = current.component_id
      ? await fetchComponentUsage(sql, current.component_id)
      : [];
    if (usage.length) {
      return res.status(409).json({
        error: "Components referenced by active or draft templates cannot be archived",
        usage,
      });
    }

    const updatedRows = await sql`
      update wizard_content_sections
      set
        status = 'archived',
        is_visible_in_wizard = false,
        archived_at = now(),
        change_note = ${changeNote},
        updated_at = now()
      where id = ${id}::uuid
      returning
        id::text, component_id::text, section_key, name, description, is_required, order_change_allowed,
        fixed_position, sort_order, is_visible_in_wizard, status, version,
        change_note, ai_design, archived_at, created_at, updated_at
    `;

    await recordHistory(sql, {
      sectionKey: current.section_key,
      sectionId: id,
      previousVersion: Number(current.version || 1),
      newVersion: Number(current.version || 1),
      previousStatus: current.status,
      newStatus: "archived",
      changeNote,
    });

    return res.status(200).json({ ok: true, section: toSection(updatedRows[0]) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section archive failed",
      message: error.message,
    });
  }
};
