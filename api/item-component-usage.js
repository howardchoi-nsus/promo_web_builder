const { getSql } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const componentId = String(req.query.componentId || "").trim();
    if (!componentId) return res.status(400).json({ error: "componentId is required" });
    const sql = getSql();
    const rows = await sql`
      select section.id::text, section.section_key, section.name, section.version, section.status,
        instance.item_key, version.id::text as version_id, version.version as component_version
      from wizard_content_section_component_instances instance
      join wizard_item_component_versions version on version.id = instance.component_version_id
      join wizard_content_sections section on section.id = instance.section_id
      where version.component_id = ${componentId}::uuid and section.status in ('draft', 'active')
      order by section.name, section.version desc, instance.sort_order
    `;
    return res.status(200).json({ ok: true, componentId, usageCount: rows.length, sections: rows.map((row) => ({
      id: row.id, sectionKey: row.section_key, name: row.name, sectionVersion: Number(row.version),
      status: row.status, itemKey: row.item_key, componentVersionId: row.version_id,
      componentVersion: Number(row.component_version),
    })) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Component usage lookup failed", message: error.message });
  }
};
