const { getSql, parseBody, fetchRenderTokenCatalog } = require("./_item-components-store");
const { validateRenderSpec } = require("./_component-render-spec-contract");
const { normalizeProposal, findSimilarComponents, collectTokenBindings } = require("./_component-generation-service");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "PATCH") {
      res.setHeader("Allow", "PATCH");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const id = String(req.query.id || "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });
    const sql = getSql();
    const current = await sql`select component_definition, render_spec, confidence, review_notes from component_generation_proposals where id = ${id}::uuid and applied_at is null limit 1`;
    if (!current[0]) return res.status(404).json({ error: "Editable proposal not found" });
    const body = parseBody(req.body);
    const proposal = normalizeProposal({
      ...current[0].component_definition,
      ...body.componentDefinition,
      fields: body.componentDefinition?.fields || current[0].component_definition?.fields,
      renderSpec: body.renderSpec || current[0].render_spec,
      confidence: current[0].confidence,
      reviewNotes: current[0].review_notes,
    });
    const validation = validateRenderSpec(proposal.renderSpec, { fields: proposal.fields, tokenCatalog: await fetchRenderTokenCatalog(sql) });
    const similar = await findSimilarComponents(sql, proposal);
    const requestedMode = body.componentDefinition?.creationMode === "new-version" ? "new-version" : "new-component";
    const requestedTarget = requestedMode === "new-version" ? String(body.componentDefinition?.targetComponentId || "").trim() || null : null;
    const definition = { ...current[0].component_definition, name: proposal.name, description: proposal.description, fields: proposal.fields, reviewRequired: !validation.ok || proposal.confidence < 0.8 || (similar[0]?.score || 0) >= 0.75, creationMode: requestedMode, targetComponentId: requestedTarget };
    const rows = await sql`
      update component_generation_proposals set component_definition = ${JSON.stringify(definition)}::jsonb,
        render_spec = ${JSON.stringify(validation.normalizedSpec || proposal.renderSpec)}::jsonb,
        responsive_spec = ${JSON.stringify(proposal.renderSpec?.responsive || {})}::jsonb,
        accessibility = ${JSON.stringify(proposal.renderSpec?.accessibility || {})}::jsonb,
        token_bindings = ${JSON.stringify(collectTokenBindings(proposal.renderSpec?.root))}::jsonb,
        similar_components = ${JSON.stringify(similar)}::jsonb,
        validation_result = ${JSON.stringify(validation)}::jsonb, updated_at = now()
      where id = ${id}::uuid returning id::text, component_definition, render_spec, similar_components, validation_result
    `;
    return res.status(validation.ok ? 200 : 422).json({ ok: validation.ok, proposal: { id: rows[0].id, componentDefinition: rows[0].component_definition, renderSpec: rows[0].render_spec, similarComponents: rows[0].similar_components, validationResult: rows[0].validation_result } });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.code || "Proposal update failed", message: error.message });
  }
};
