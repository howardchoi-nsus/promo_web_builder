const {
  getSql,
  parseBody,
  fetchSectionRow,
  fetchItemsForSection,
} = require("./_wizard-content-sections-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const sectionId = String(body.sectionId || "").trim();
    const itemIds = Array.isArray(body.itemIds) ? body.itemIds.map(String) : [];
    if (!sectionId || !itemIds.length || new Set(itemIds).size !== itemIds.length) {
      return res.status(400).json({ error: "sectionId and unique itemIds are required" });
    }
    const sql = getSql();
    const section = await fetchSectionRow(sql, sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });
    if (section.status !== "draft") return res.status(409).json({ error: "Only draft section items can be reordered" });
    const current = await fetchItemsForSection(sql, sectionId);
    if (current.length !== itemIds.length || current.some((item) => !itemIds.includes(item.id))) {
      return res.status(409).json({ error: "Item order is stale. Refresh and try again." });
    }
    await sql`
      with requested as (
        select (value #>> '{}')::uuid as item_id, ordinal::integer
        from jsonb_array_elements(${JSON.stringify(itemIds)}::jsonb) with ordinality
      )
      update wizard_content_section_items item
      set sort_order = (requested.ordinal - 1) * 10, updated_at = now()
      from requested
      where item.section_id = ${sectionId}::uuid and item.id = requested.item_id
    `;
    return res.status(200).json({ ok: true, items: await fetchItemsForSection(sql, sectionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard content section item order API failed", message: error.message });
  }
};
