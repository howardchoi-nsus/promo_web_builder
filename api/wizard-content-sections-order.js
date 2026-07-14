const {
  getSql,
  parseBody,
  fetchAllSections,
} = require("./_wizard-content-sections-store");

// POST { sectionKeys: [...] } updates the order of all movable active sections
// in one SQL statement. Fixed top/bottom sections remain outside this list.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const sectionKeys = Array.isArray(body.sectionKeys)
      ? body.sectionKeys.map((value) => String(value || "").trim()).filter(Boolean)
      : [];
    if (!sectionKeys.length) return res.status(400).json({ error: "sectionKeys is required" });
    if (new Set(sectionKeys).size !== sectionKeys.length) {
      return res.status(400).json({ error: "sectionKeys must not contain duplicates" });
    }

    const sql = getSql();
    const sections = await fetchAllSections(sql);
    const movableKeys = sections
      .filter((section) => section.status === "active" && section.orderChangeAllowed && !section.fixedPosition)
      .map((section) => section.sectionKey);
    if (sectionKeys.length !== movableKeys.length || movableKeys.some((key) => !sectionKeys.includes(key))) {
      return res.status(409).json({
        error: "Section order is stale. Refresh the section list and try again.",
      });
    }

    const orderJson = JSON.stringify(sectionKeys);
    const historyRows = await sql`
      with requested as (
        select value #>> '{}' as section_key, (ordinality - 1)::integer * 10 as sort_order
        from jsonb_array_elements(${orderJson}::jsonb) with ordinality
      ), current_rows as materialized (
        select s.id, s.section_key, s.version, s.status, s.sort_order
        from wizard_content_sections s
        join requested r on r.section_key = s.section_key
        where s.status <> 'archived'
        for update
      ), updated as (
        update wizard_content_sections s
        set sort_order = r.sort_order, updated_at = now()
        from requested r
        where s.section_key = r.section_key
          and s.status <> 'archived'
        returning s.id, s.section_key, s.version, s.status, s.sort_order
      )
      insert into wizard_content_section_histories (
        section_key, section_id, previous_version, new_version,
        previous_status, new_status, change_note, previous_state, new_state
      )
      select
        u.section_key, u.id, u.version, u.version,
        u.status, u.status, 'Section order changed from Admin Page.',
        jsonb_build_object('sortOrder', c.sort_order),
        jsonb_build_object('sortOrder', u.sort_order)
      from updated u
      join current_rows c on c.id = u.id
      returning section_key
    `;

    const updatedKeys = new Set(historyRows.map((row) => row.section_key));
    if (updatedKeys.size !== sectionKeys.length || sectionKeys.some((key) => !updatedKeys.has(key))) {
      return res.status(409).json({ error: "Section order changed while saving. Refresh and try again." });
    }

    const updatedSections = await fetchAllSections(sql);
    return res.status(200).json({ ok: true, sections: updatedSections });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section order update failed",
      message: error.message,
    });
  }
};
