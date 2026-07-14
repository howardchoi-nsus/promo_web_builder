const {
  getSql,
  parseBody,
  toSection,
  fetchSectionRow,
  validateSectionDraft,
} = require("./_wizard-content-sections-store");

// POST { id } -> makes this draft/inactive version the active (Wizard-visible) one
// for its section_key, and demotes any previously active version for the same key.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const id = String(body.id || req.query.id || "").trim();
    const changeNote = String(body.changeNote || "Section activated from Admin Page.").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    const target = await fetchSectionRow(sql, id);
    if (!target) return res.status(404).json({ error: "Section not found" });
    if (target.status === "archived") {
      return res.status(409).json({ error: "Archived sections cannot be activated. Create a new draft first." });
    }
    if (target.status === "active") {
      return res.status(409).json({ error: "This section version is already active" });
    }
    const validation = await validateSectionDraft(sql, id);
    if (validation.errors.length) {
      return res.status(422).json({ error: "Section draft validation failed", errors: validation.errors });
    }

    await sql`select activate_wizard_content_section(${id}::uuid, ${changeNote})`;
    const updated = await fetchSectionRow(sql, id);
    return res.status(200).json({ ok: true, section: toSection(updated) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section activation failed",
      message: error.message,
    });
  }
};
