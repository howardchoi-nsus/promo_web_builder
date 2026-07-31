const {
  getSql, parseBody, validateDefinition, validateLibraryPresentation, validatePlacementPolicy,
  replaceVersionFields, fetchComponent, fetchComponentVersions,
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
    await sql`
      update wizard_item_components set
        name = ${String(body.name || "").trim() || "Untitled component"},
        description = ${String(body.description || "")},
        library_presentation = ${JSON.stringify(libraryPresentation)}::jsonb, updated_at = now()
      where id = ${componentId}::uuid
    `;
    await sql`
      update wizard_item_component_versions set
        field_kind = ${definition.fieldKind}, text_type = ${definition.textType},
        editor_schema = ${JSON.stringify(definition.editorSchema)}::jsonb,
        default_value = ${JSON.stringify(definition.defaultValue)}::jsonb,
        capabilities = ${JSON.stringify(definition.capabilities)}::jsonb,
        image_policy = ${JSON.stringify(definition.imagePolicy)}::jsonb,
        cta_policy = ${JSON.stringify(definition.ctaPolicy)}::jsonb,
        style_slots = ${JSON.stringify(definition.styleSlots)}::jsonb,
        placement_policy = ${JSON.stringify(placementPolicy)}::jsonb,
        change_note = ${String(body.changeNote || "Draft updated.")}, updated_at = now()
      where id = ${versionId}::uuid
    `;
    await replaceVersionFields(sql, versionId, definition.fields);
    return res.status(200).json({ ok: true, component: await fetchComponent(sql, componentId, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Item component API failed", message: error.message });
  }
};
