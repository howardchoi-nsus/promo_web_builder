const {
  getSql, parseBody, validateDefinition, validateLibraryPresentation, validatePlacementPolicy,
  renderSpecFromVersionRow, prepareRenderSpecPersistence, fetchRenderTokenCatalog,
  validateVersionFieldKeys, buildReplaceVersionFieldsQuery, fetchComponent, fetchComponentVersions,
} = require("./_item-components-store");

module.exports = async function handler(req, res) {
  try {
    const componentId = String(req.query.componentId || req.query.id || "").trim();
    if (!componentId) return res.status(400).json({ error: "componentId is required" });
    const sql = getSql();
    if (req.method === "GET") {
      const component = await fetchComponent(sql, componentId);
      if (!component) return res.status(404).json({ error: "Component not found" });
      return res.status(200).json({ ok: true, component, versions: await fetchComponentVersions(sql, componentId) });
    }
    if (req.method !== "PATCH") {
      res.setHeader("Allow", "GET, PATCH");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const body = parseBody(req.body);
    if (Object.prototype.hasOwnProperty.call(body, "componentKey")) {
      return res.status(400).json({ error: "componentKey is immutable" });
    }
    const versionId = String(body.versionId || "").trim();
    if (!versionId) return res.status(400).json({ error: "versionId is required" });
    const currentRows = await sql`
      select * from wizard_item_component_versions
      where id = ${versionId}::uuid and component_id = ${componentId}::uuid limit 1
    `;
    if (!currentRows.length) return res.status(404).json({ error: "Component version not found" });
    if (currentRows[0].status !== "draft") return res.status(409).json({ error: "Only draft component versions can be edited" });
    const definition = validateDefinition(body);
    const libraryPresentation = validateLibraryPresentation(body.libraryPresentation);
    const placementPolicy = validatePlacementPolicy(body.placementPolicy);
    const requestedRenderSpec = Object.prototype.hasOwnProperty.call(body, "renderSpec")
      ? body.renderSpec
      : renderSpecFromVersionRow(currentRows[0]);
    const renderPersistence = requestedRenderSpec == null
      ? prepareRenderSpecPersistence(null)
      : prepareRenderSpecPersistence(requestedRenderSpec, {
        fields: definition.fields,
        tokenCatalog: await fetchRenderTokenCatalog(sql),
      });
    await validateVersionFieldKeys(sql, versionId, definition.fields);
    await sql.transaction([
      sql`
        update wizard_item_components set
          name = ${String(body.name || "").trim() || "Untitled component"},
          description = ${String(body.description || "")},
          library_presentation = ${JSON.stringify(libraryPresentation)}::jsonb, updated_at = now()
        where id = ${componentId}::uuid
      `,
      sql`
        update wizard_item_component_versions set
          field_kind = ${definition.fieldKind}, text_type = ${definition.textType},
          editor_schema = ${JSON.stringify(definition.editorSchema)}::jsonb,
          default_value = ${JSON.stringify(definition.defaultValue)}::jsonb,
          capabilities = ${JSON.stringify(definition.capabilities)}::jsonb,
          image_policy = ${JSON.stringify(definition.imagePolicy)}::jsonb,
          cta_policy = ${JSON.stringify(definition.ctaPolicy)}::jsonb,
          style_slots = ${JSON.stringify(definition.styleSlots)}::jsonb,
          placement_policy = ${JSON.stringify(placementPolicy)}::jsonb,
          render_contract_version = ${renderPersistence.contractVersion},
          render_tree = ${renderPersistence.tree == null ? null : JSON.stringify(renderPersistence.tree)}::jsonb,
          render_responsive = ${renderPersistence.responsive == null ? null : JSON.stringify(renderPersistence.responsive)}::jsonb,
          render_accessibility = ${renderPersistence.accessibility == null ? null : JSON.stringify(renderPersistence.accessibility)}::jsonb,
          render_validation = ${renderPersistence.validation == null ? null : JSON.stringify(renderPersistence.validation)}::jsonb,
          change_note = ${String(body.changeNote || "Draft updated.")}, updated_at = now()
        where id = ${versionId}::uuid
      `,
      buildReplaceVersionFieldsQuery(sql, versionId, definition.fields),
    ]);
    return res.status(200).json({ ok: true, component: await fetchComponent(sql, componentId, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Item component API failed",
      message: error.message,
      ...(error.validation ? { validation: error.validation } : {}),
    });
  }
};
