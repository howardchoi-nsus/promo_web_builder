const { getSql, parseBody, fetchComponent } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const componentId = String(body.componentId || "").trim();
    const versionId = String(body.versionId || "").trim();
    if (!componentId || !versionId) return res.status(400).json({ error: "componentId and versionId are required" });
    const sql = getSql();
    const rows = await sql`
      select id::text, status from wizard_item_component_versions
      where id = ${versionId}::uuid and component_id = ${componentId}::uuid limit 1
    `;
    if (!rows.length) return res.status(404).json({ error: "Component version not found" });
    if (rows[0].status !== "draft" && rows[0].status !== "inactive") {
      return res.status(409).json({ error: "Only draft or inactive versions can be activated" });
    }
    await sql`update wizard_item_component_versions set status = 'inactive', updated_at = now() where component_id = ${componentId}::uuid and status = 'active'`;
    await sql`update wizard_item_component_versions set status = 'active', change_note = ${String(body.changeNote || "Component activated.")}, updated_at = now() where id = ${versionId}::uuid`;
    return res.status(200).json({ ok: true, component: await fetchComponent(sql, componentId, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Component activation failed", message: error.message });
  }
};
