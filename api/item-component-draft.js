const { getSql, parseBody, fetchComponent } = require("./_item-components-store");

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
    const rows = await sql`
      with source as (
        select * from wizard_item_component_versions
        where component_id = ${componentId}::uuid and status <> 'archived'
        order by case status when 'active' then 0 else 1 end, version desc limit 1
      ), guard as (
        select case when exists (
          select 1 from wizard_item_component_versions
          where component_id = ${componentId}::uuid and status = 'draft'
        ) then 1 / 0 else 1 end as ok
      )
      , inserted as (
      insert into wizard_item_component_versions (
        component_id, version, status, field_kind, text_type, editor_schema, default_value,
        capabilities, image_policy, cta_policy, style_slots, placement_policy, change_note
      ) select source.component_id,
        (select coalesce(max(v.version), 0) + 1 from wizard_item_component_versions v where v.component_id = source.component_id),
        'draft', source.field_kind, source.text_type, source.editor_schema, source.default_value,
        source.capabilities, source.image_policy, source.cta_policy, source.style_slots, source.placement_policy,
        ${String(body.changeNote || "Draft created.")}
      from source cross join guard returning id
      )
      select inserted.id::text, source.id::text as source_version_id
      from inserted cross join source
    `;
    if (!rows.length) return res.status(404).json({ error: "Component not found" });
    await sql`
      insert into wizard_item_component_version_fields (
        component_version_id, field_key, name, field_kind, text_type, sort_order,
        is_required, is_locked, default_value, editor_schema, capabilities,
        image_policy, cta_policy, style_slots
      )
      select ${rows[0].id}::uuid, field_key, name, field_kind, text_type, sort_order,
        is_required, is_locked, default_value, editor_schema, capabilities,
        image_policy, cta_policy, style_slots
      from wizard_item_component_version_fields
      where component_version_id = ${rows[0].source_version_id}::uuid
    `;
    return res.status(201).json({ ok: true, component: await fetchComponent(sql, componentId, rows[0].id) });
  } catch (error) {
    const conflict = /division by zero/i.test(error.message || "");
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({
      error: conflict ? "A draft already exists for this component" : "Component draft creation failed",
      message: error.message,
    });
  }
};
