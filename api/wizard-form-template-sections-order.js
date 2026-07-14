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
    const sectionKeys = Array.isArray(body.sectionKeys)
      ? body.sectionKeys.map((key) => String(key || "").trim()).filter(Boolean)
      : [];
    if (!templateId) return res.status(400).json({ error: "templateId is required" });
    if (!sectionKeys.length) return res.status(400).json({ error: "sectionKeys is required" });
    if (new Set(sectionKeys).size !== sectionKeys.length) {
      return res.status(400).json({ error: "sectionKeys must not contain duplicates" });
    }
    const sql = getSql();
    const template = await fetchTemplateRow(sql, templateId);
    if (!template) return res.status(404).json({ error: "Form template not found" });
    if (template.status !== "draft") return res.status(409).json({ error: "Only draft form templates can change section order" });
    const current = await fetchTemplateSections(sql, templateId);
    const currentKeys = current
      .filter((section) => section.orderChangeAllowed && !section.fixedPosition)
      .map((section) => section.sectionKey);
    if (currentKeys.length !== sectionKeys.length || currentKeys.some((key) => !sectionKeys.includes(key))) {
      return res.status(409).json({ error: "Section order is stale. Refresh and try again." });
    }

    const rows = await sql`
      with requested as (
        select value #>> '{}' as section_key, (ordinality - 1)::integer * 10 as sort_order
        from jsonb_array_elements(${JSON.stringify(sectionKeys)}::jsonb) with ordinality
      )
      update wizard_form_template_sections ts
      set sort_order = requested.sort_order, updated_at = now()
      from requested
      where ts.form_template_id = ${templateId}::uuid
        and ts.section_key = requested.section_key
        and ts.order_change_allowed = true
        and ts.fixed_position is null
      returning ts.section_key
    `;
    if (new Set(rows.map((row) => row.section_key)).size !== sectionKeys.length) {
      return res.status(409).json({ error: "Section order changed while saving. Refresh and try again." });
    }
    return res.status(200).json({ ok: true, sections: await fetchTemplateSections(sql, templateId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard form template section order update failed", message: error.message });
  }
};
