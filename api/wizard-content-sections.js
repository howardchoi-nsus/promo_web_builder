const {
  getSql,
  parseBody,
  normalizeBoolean,
  normalizeNumber,
  normalizeAiDesign,
  toSection,
  fetchAllSections,
  fetchPublicSectionsWithItems,
  cloneSectionAsDraft,
} = require("./_wizard-content-sections-store");

// GET  ?scope=public         -> Wizard-facing read: active + visible sections with items.
// GET  (default, admin)      -> all non-archived sections (draft/active/inactive), no items.
// GET  ?includeArchived=true -> admin view including archived sections.
// POST { sectionKey, ... }   -> create a brand-new section (version 1, draft).
// POST { id }                -> clone an existing section's active/inactive version into a new draft.
module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await listSections(req, res);
    if (req.method === "POST") return await createSection(req, res);

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content sections API failed",
      message: error.message,
    });
  }
};

async function listSections(req, res) {
  const sql = getSql();

  if (String(req.query.scope || "").toLowerCase() === "public") {
    const sections = await fetchPublicSectionsWithItems(sql);
    const configRevision = sections
      .map((section) => `${section.sectionKey}:v${section.version}:${section.updatedAt || ""}`)
      .join("|");
    return res.status(200).json({ ok: true, configRevision, sections });
  }

  const includeArchived = String(req.query.includeArchived || "").toLowerCase() === "true";
  const sections = await fetchAllSections(sql, { includeArchived });
  return res.status(200).json({ ok: true, sections });
}

async function createSection(req, res) {
  const body = parseBody(req.body);
  const sql = getSql();

  // Existing section -> create a new draft version from it.
  const sourceId = String(body.id || "").trim();
  if (sourceId) {
    const changeNote = String(body.changeNote || "Draft created from Admin Page.").trim();
    const draft = await cloneSectionAsDraft(sql, sourceId, changeNote);
    return res.status(201).json({ ok: true, section: draft });
  }

  // New section -> version 1, draft (admin must explicitly activate it).
  const sectionKey = String(body.sectionKey || "").trim();
  const name = String(body.name || "").trim();
  if (!sectionKey) return res.status(400).json({ error: "sectionKey is required" });
  if (!name) return res.status(400).json({ error: "name is required" });
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(sectionKey)) {
    return res.status(400).json({ error: "sectionKey must start with a letter and contain only letters, numbers, and underscores" });
  }

  const existing = await sql`select id::text from wizard_content_sections where section_key = ${sectionKey} limit 1`;
  if (existing.length) return res.status(409).json({ error: "sectionKey already exists" });

  const rows = await sql`
    insert into wizard_content_sections (
      section_key, name, description, is_required, order_change_allowed,
      fixed_position, sort_order, is_visible_in_wizard, status, version, change_note, ai_design
    )
    values (
      ${sectionKey}, ${name}, ${String(body.description || "")},
      ${normalizeBoolean(body.isRequired, false)}, ${normalizeBoolean(body.orderChangeAllowed, true)},
      ${body.fixedPosition === "top" || body.fixedPosition === "bottom" ? body.fixedPosition : null},
      ${normalizeNumber(body.sortOrder) ?? 0}, ${normalizeBoolean(body.isVisibleInWizard, true)},
      'draft', 1, ${String(body.changeNote || "Section created from Admin Page.")},
      ${JSON.stringify(normalizeAiDesign(body.aiDesign))}::jsonb
    )
    returning
      id::text, section_key, name, description, is_required, order_change_allowed,
      fixed_position, sort_order, is_visible_in_wizard, status, version,
      change_note, ai_design, archived_at, created_at, updated_at
  `;

  return res.status(201).json({ ok: true, section: toSection(rows[0]) });
}
