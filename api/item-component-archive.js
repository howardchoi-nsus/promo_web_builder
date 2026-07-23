const { getSql, parseBody } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const componentId = String(body.componentId || "").trim();
    if (!componentId) return res.status(400).json({ error: "componentId is required" });
    const sql = getSql();
    const usage = await sql`
      select count(*)::integer as count
      from wizard_content_section_component_instances instance
      join wizard_item_component_versions version on version.id = instance.component_version_id
      join wizard_content_sections section on section.id = instance.section_id
      where version.component_id = ${componentId}::uuid and section.status in ('draft', 'active')
    `;
    if (Number(usage[0]?.count || 0) > 0) {
      return res.status(409).json({ error: "Component is used by an active or draft section", usageCount: Number(usage[0].count) });
    }
    const rows = await sql`
      update wizard_item_components set status = 'archived', updated_at = now()
      where id = ${componentId}::uuid and status <> 'archived' returning id::text
    `;
    if (!rows.length) return res.status(404).json({ error: "Component not found or already archived" });
    await sql`update wizard_item_component_versions set status = 'archived', updated_at = now() where component_id = ${componentId}::uuid`;
    return res.status(200).json({ ok: true, componentId });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Component archive failed", message: error.message });
  }
};
