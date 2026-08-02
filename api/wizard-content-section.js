const {
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  normalizeAiDesign,
  normalizeAiDesignForItems,
  normalizeCompositionPolicy,
  SECTION_ROLES,
  toSection,
  fetchSectionRow,
  fetchItemsForSection,
} = require("./_wizard-content-sections-store");

// GET   ?id=      -> section detail + its items + recent history.
// PATCH { id, ... } -> update section-level fields. Only allowed while status = 'draft';
//                      active/inactive/archived versions are read-only (create a new draft first).
module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getSection(req, res);
    if (req.method === "PATCH") return await updateSection(req, res);

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section API failed",
      message: error.message,
    });
  }
};

async function getSection(req, res) {
  const id = String(req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });

  const sql = getSql();
  const row = await fetchSectionRow(sql, id);
  if (!row) return res.status(404).json({ error: "Section not found" });

  const items = await fetchItemsForSection(sql, id);
  const historyRows = await sql`
    select
      id::text, previous_version, new_version, previous_status, new_status,
      change_note, previous_state, new_state, changed_at
    from wizard_content_section_histories
    where section_key = ${row.section_key}
    order by changed_at desc
    limit 20
  `;

  return res.status(200).json({
    ok: true,
    section: toSection(row),
    items,
    histories: historyRows.map((history) => ({
      id: history.id,
      previousVersion: Number(history.previous_version || 0),
      newVersion: Number(history.new_version || 0),
      previousStatus: history.previous_status || "",
      newStatus: history.new_status || "",
      changeNote: history.change_note || "",
      changedAt: history.changed_at || null,
    })),
  });
}

async function updateSection(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });

  const sql = getSql();
  const current = await fetchSectionRow(sql, id);
  if (!current) return res.status(404).json({ error: "Section not found" });
  if (current.status !== "draft") {
    return res.status(409).json({
      error: `Only draft sections can be edited directly (current status: ${current.status}). Create a new draft first.`,
    });
  }

  const hasName = Object.prototype.hasOwnProperty.call(body, "name");
  const hasDescription = Object.prototype.hasOwnProperty.call(body, "description");
  const hasRequired = Object.prototype.hasOwnProperty.call(body, "isRequired");
  const hasOrderChangeAllowed = Object.prototype.hasOwnProperty.call(body, "orderChangeAllowed");
  const hasFixedPosition = Object.prototype.hasOwnProperty.call(body, "fixedPosition");
  const hasSortOrder = Object.prototype.hasOwnProperty.call(body, "sortOrder");
  const hasVisible = Object.prototype.hasOwnProperty.call(body, "isVisibleInWizard");
  const hasAiDesign = Object.prototype.hasOwnProperty.call(body, "aiDesign");
  const hasCompositionScope = Object.prototype.hasOwnProperty.call(body, "compositionScope");
  const hasSectionRole = Object.prototype.hasOwnProperty.call(body, "sectionRole");
  const hasCompositionPolicy = Object.prototype.hasOwnProperty.call(body, "compositionPolicy");
  const changeNote = String(body.changeNote || "Section draft updated.").trim();

  const name = hasName ? String(body.name || "").trim() : current.name;
  if (!name) return res.status(400).json({ error: "name is required" });

  const fixedPosition = hasFixedPosition
    ? (body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null)
    : current.fixed_position;
  const compositionScope = hasCompositionScope && body.compositionScope === "shared"
    ? "shared"
    : hasCompositionScope ? "template" : current.composition_scope || "template";
  const sectionRole = hasSectionRole && SECTION_ROLES.includes(body.sectionRole)
    ? body.sectionRole
    : current.section_role || "content";
  const compositionPolicy = normalizeCompositionPolicy(
    hasCompositionPolicy ? body.compositionPolicy : current.composition_policy,
    { fixedPosition },
  );
  const aiDesign = hasAiDesign
    ? normalizeAiDesignForItems(body.aiDesign, await fetchItemsForSection(sql, id))
    : normalizeAiDesign(current.ai_design);

  const rows = await sql`
    update wizard_content_sections
    set
      name = ${name},
      description = ${hasDescription ? String(body.description || "") : current.description || ""},
      is_required = ${hasRequired ? normalizeBoolean(body.isRequired, current.is_required) : current.is_required},
      order_change_allowed = ${hasOrderChangeAllowed ? normalizeBoolean(body.orderChangeAllowed, current.order_change_allowed) : current.order_change_allowed},
      fixed_position = ${fixedPosition},
      sort_order = ${hasSortOrder ? (normalizeNumber(body.sortOrder) ?? current.sort_order) : current.sort_order},
      is_visible_in_wizard = ${hasVisible ? normalizeBoolean(body.isVisibleInWizard, current.is_visible_in_wizard) : current.is_visible_in_wizard},
      ai_design = ${JSON.stringify(aiDesign)}::jsonb,
      composition_scope = ${compositionScope},
      section_role = ${sectionRole},
      composition_policy = ${JSON.stringify(compositionPolicy)}::jsonb,
      change_note = ${changeNote},
      updated_at = now()
    where id = ${id}::uuid
    returning
      id::text, section_key, name, description, is_required, order_change_allowed,
      fixed_position, sort_order, is_visible_in_wizard, status, version,
      change_note, ai_design, composition_scope, section_role, composition_policy,
      archived_at, created_at, updated_at
  `;

  return res.status(200).json({ ok: true, section: toSection(rows[0]) });
}
