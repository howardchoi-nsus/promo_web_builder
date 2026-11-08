const {
  getSql, parseBody, fetchComponent, fetchVersionFields, fetchRenderTokenCatalog,
  renderSpecFromVersionRow, prepareRenderSpecPersistence,
} = require("./_item-components-store");
const { resolveAdminOwner } = require("./_promo-admin-auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "private, no-store");
    resolveAdminOwner(req, res);
    const body = parseBody(req.body);
    const componentId = String(body.componentId || "").trim();
    const versionId = String(body.versionId || "").trim();
    if (!componentId || !versionId) return res.status(400).json({ error: "componentId and versionId are required" });
    const sql = getSql();
    const rows = await sql`
      select version.id::text, version.status, version.capabilities,
        version.render_contract_version, version.render_tree,
        version.render_responsive, version.render_accessibility, version.render_validation,
        component.system_seed_code
      from wizard_item_component_versions version
      join wizard_item_components component on component.id = version.component_id
      where version.id = ${versionId}::uuid and version.component_id = ${componentId}::uuid limit 1
    `;
    if (!rows.length) return res.status(404).json({ error: "Component version not found" });
    if (rows[0].status !== "draft" && rows[0].status !== "inactive") {
      return res.status(409).json({ error: "Only draft or inactive versions can be activated" });
    }
    const storedRenderSpec = renderSpecFromVersionRow(rows[0]);
    const referenceDerived = String(rows[0].system_seed_code || "").startsWith("ref-pattern-")
      || rows[0].capabilities?.referenceDerived === true;
    if (referenceDerived && storedRenderSpec == null) {
      const error = new Error("Reference-derived components require a validated RenderSpec before activation");
      error.statusCode = 422;
      error.code = "REFERENCE_COMPONENT_RENDER_SPEC_REQUIRED";
      throw error;
    }
    const renderPersistence = storedRenderSpec == null
      ? prepareRenderSpecPersistence(null)
      : prepareRenderSpecPersistence(storedRenderSpec, {
        fields: (await fetchVersionFields(sql, [versionId])).get(versionId) || [],
        tokenCatalog: await fetchRenderTokenCatalog(sql),
      });
    await sql.transaction([
      sql`update wizard_item_component_versions set status = 'inactive', updated_at = now() where component_id = ${componentId}::uuid and status = 'active'`,
      sql`update wizard_item_component_versions set
        status = 'active',
        render_validation = ${renderPersistence.validation == null ? null : JSON.stringify(renderPersistence.validation)}::jsonb,
        change_note = ${String(body.changeNote || "Component activated.")}, updated_at = now()
        where id = ${versionId}::uuid`,
    ]);
    return res.status(200).json({ ok: true, component: await fetchComponent(sql, componentId, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Component activation failed",
      message: error.message,
      code: error.code || "COMPONENT_ACTIVATION_FAILED",
      ...(error.validation ? { validation: error.validation } : {}),
    });
  }
};
