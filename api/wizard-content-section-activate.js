const {
  getSql,
  parseBody,
  toSection,
  fetchSectionRow,
  validateSectionDraft,
  normalizeAiDesign,
  normalizeCompositionPolicy,
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
    if (target.section_role === "header" && target.fixed_position !== "top") {
      const compositionPolicy = normalizeCompositionPolicy(target.composition_policy, { fixedPosition: "top" });
      await sql`
        update wizard_content_sections
        set fixed_position = 'top', is_required = true, order_change_allowed = false,
          composition_policy = ${JSON.stringify(compositionPolicy)}::jsonb,
          change_note = ${`${changeNote} Header fixed-position policy normalized.`},
          updated_at = now()
        where id = ${id}::uuid
      `;
    }
    const validation = await validateSectionDraft(sql, id);
    if (validation.errors.length) {
      return res.status(422).json({ error: "Section draft validation failed", errors: validation.errors });
    }
    if (JSON.stringify(validation.aiDesign) !== JSON.stringify(normalizeAiDesign(target.ai_design))) {
      await sql`
        update wizard_content_sections
        set ai_design = ${JSON.stringify(validation.aiDesign)}::jsonb,
          change_note = ${`${changeNote} Legacy AI image target normalized.`},
          updated_at = now()
        where id = ${id}::uuid
      `;
    }

    await sql`select activate_wizard_content_section(${id}::uuid, ${changeNote})`;
    await sql`
      update wizard_form_template_sections membership
      set section_id = ${id}::uuid, updated_at = now()
      from wizard_form_templates template
      where membership.form_template_id = template.id
        and template.status = 'draft'
        and membership.section_key = ${target.section_key}
    `;
    const updated = await fetchSectionRow(sql, id);
    return res.status(200).json({ ok: true, section: toSection(updated) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section activation failed",
      message: error.message,
    });
  }
};
