const { getSql, parseBody } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const componentId = String(body.componentId || req.query?.componentId || "").trim();
    if (!componentId) return res.status(400).json({ error: "componentId is required" });

    const sql = getSql();
    const componentRows = await sql`
      select id::text, component_key, system_seed_code, name, status
      from wizard_item_components
      where id = ${componentId}::uuid
      limit 1
    `;
    const component = componentRows[0];
    if (!component) return res.status(404).json({ error: "Component not found" });
    if (component.system_seed_code) {
      return res.status(409).json({
        error: "System components cannot be deleted",
        message: "시스템 기본 컴포넌트는 삭제할 수 없습니다.",
      });
    }

    const usageRows = await sql`
      select section.id::text, section.section_key, section.name, section.version, section.status,
        instance.item_key
      from wizard_content_section_component_instances instance
      join wizard_item_component_versions version on version.id = instance.component_version_id
      join wizard_content_sections section on section.id = instance.section_id
      where version.component_id = ${componentId}::uuid
        and section.status in ('draft', 'active')
      order by section.name, section.version desc, instance.sort_order
    `;
    if (usageRows.length) {
      return res.status(409).json({
        error: "Component is used by an active or draft section",
        message: "활성 또는 초안 Section Preset에서 사용 중인 컴포넌트는 삭제할 수 없습니다. 먼저 해당 섹션에서 제거해 주세요.",
        usageCount: usageRows.length,
        usage: usageRows.map((row) => ({
          id: row.id,
          sectionKey: row.section_key,
          name: row.name,
          version: Number(row.version || 1),
          status: row.status,
          itemKey: row.item_key,
        })),
      });
    }

    const updatedAssetJobs = await sql`
      update promo_section_design_asset_jobs job
      set status = case when status in ('queued', 'processing') then 'cancelled' else status end,
        component_instance_id = null,
        error_code = case when status in ('queued', 'processing') then 'COMPONENT_DELETED' else error_code end,
        error_message = case when status in ('queued', 'processing') then 'The source item component was deleted.' else error_message end,
        completed_at = case when status in ('queued', 'processing') then coalesce(completed_at, now()) else completed_at end,
        updated_at = now()
      where job.component_instance_id in (
        select instance.id
        from wizard_content_section_component_instances instance
        join wizard_item_component_versions version on version.id = instance.component_version_id
        where version.component_id = ${componentId}::uuid
      )
      returning job.id::text
    `;

    const cancelledDesignRuns = await sql`
      update promo_section_design_runs run
      set status = 'cancelled',
        error_code = 'COMPONENT_DELETED',
        error_message = 'A source item component was deleted.',
        completed_at = coalesce(completed_at, now()),
        updated_at = now()
      where run.section_key in (
        select distinct section.section_key
        from wizard_content_section_component_instances instance
        join wizard_item_component_versions version on version.id = instance.component_version_id
        join wizard_content_sections section on section.id = instance.section_id
        where version.component_id = ${componentId}::uuid
      )
        and run.status in (
          'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
          'generating_assets', 'validating_assets', 'ready', 'applying'
        )
      returning run.id::text
    `;

    const deletedInstances = await sql`
      delete from wizard_content_section_component_instances instance
      where instance.component_version_id in (
        select version.id
        from wizard_item_component_versions version
        where version.component_id = ${componentId}::uuid
      )
      returning instance.id::text
    `;
    const deletedVersions = await sql`
      delete from wizard_item_component_versions version
      where version.component_id = ${componentId}::uuid
      returning version.id::text
    `;
    const deletedComponents = await sql`
      delete from wizard_item_components component
      where component.id = ${componentId}::uuid
        and component.system_seed_code is null
      returning component.id::text, component.component_key
    `;
    if (!deletedComponents.length) {
      return res.status(409).json({ error: "Component deletion was blocked" });
    }

    return res.status(200).json({
      ok: true,
      componentId,
      componentKey: component.component_key,
      deletedVersionCount: deletedVersions.length,
      deletedInstanceCount: deletedInstances.length,
      cancelledDesignRunCount: cancelledDesignRuns.length,
      updatedAssetJobCount: updatedAssetJobs.length,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Item component delete failed",
      message: error.message,
    });
  }
};
