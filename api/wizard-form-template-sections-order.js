const {
  getSql, parseBody, fetchTemplateRow, fetchTemplateSections,
} = require("./_wizard-form-templates-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const templateId = String(body.templateId || "").trim();
    const componentIds = Array.isArray(body.componentIds)
      ? body.componentIds.map((id) => String(id || "").trim()).filter(Boolean)
      : [];
    if (!templateId) return res.status(400).json({ error: "templateId is required" });
    if (!componentIds.length) return res.status(400).json({ error: "componentIds is required" });
    if (new Set(componentIds).size !== componentIds.length) {
      return res.status(400).json({ error: "componentIds must not contain duplicates" });
    }
    const sql = getSql();
    const template = await fetchTemplateRow(sql, templateId);
    if (!template) return res.status(404).json({ error: "Form template not found" });
    if (template.status !== "draft") return res.status(409).json({ error: "Only draft form templates can change section order" });
    const current = await fetchTemplateSections(sql, templateId);
    const currentComponentIds = current
      .filter((section) => !section.fixedPosition)
      .map((section) => section.componentId);
    if (currentComponentIds.some((id) => !id)) {
      return res.status(409).json({ error: "Legacy component references must be migrated before reordering" });
    }
    if (currentComponentIds.length !== componentIds.length
      || currentComponentIds.some((id) => !componentIds.includes(id))) {
      return res.status(409).json({ error: "Section order is stale. Refresh and try again." });
    }

    const rows = await sql`
      with requested as (
        select (value #>> '{}')::uuid as component_id, (ordinality - 1)::integer * 10 as sort_order
        from jsonb_array_elements(${JSON.stringify(componentIds)}::jsonb) with ordinality
      )
      update wizard_form_template_sections ts
      set sort_order = requested.sort_order, updated_at = now()
      from requested
      where ts.form_template_id = ${templateId}::uuid
        and ts.component_id = requested.component_id
        and ts.fixed_position is null
      returning ts.component_id::text
    `;
    if (new Set(rows.map((row) => row.component_id)).size !== componentIds.length) {
      return res.status(409).json({ error: "Section order changed while saving. Refresh and try again." });
    }
    return res.status(200).json({ ok: true, sections: await fetchTemplateSections(sql, templateId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template section order update failed", message: error.message });
  }
};
