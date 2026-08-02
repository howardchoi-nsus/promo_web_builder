const {
  getSql, parseBody, fetchSectionRow,
} = require("./_wizard-content-sections-store");

module.exports = async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const id = String(body.id || req.query?.id || "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    const current = await fetchSectionRow(sql, id);
    if (!current) return res.status(404).json({ error: "Section Preset not found" });

    const usageRows = await sql`
      select distinct template.id::text, template.template_key, template.name,
        template.version, template.status
      from wizard_form_template_sections membership
      join wizard_form_templates template on template.id = membership.form_template_id
      where (
          membership.section_key = ${current.section_key}
          or membership.section_id in (
            select section.id
            from wizard_content_sections section
            where section.section_key = ${current.section_key}
          )
        )
        and template.status in ('active', 'draft')
      order by template.name, template.version desc
    `;
    if (usageRows.length) {
      return res.status(409).json({
        error: "Section Preset is used by active or draft templates",
        message: "활성 또는 초안 템플릿에서 사용 중인 Section Preset은 삭제할 수 없습니다. 먼저 템플릿에서 제거해 주세요.",
        usage: usageRows.map((row) => ({
          id: row.id,
          templateKey: row.template_key,
          name: row.name,
          version: Number(row.version || 1),
          status: row.status,
        })),
      });
    }

    const updatedAssetJobs = await sql`
      update promo_section_design_asset_jobs job
      set status = case when status in ('queued', 'processing') then 'cancelled' else status end,
        component_instance_id = null,
        error_code = case when status in ('queued', 'processing') then 'SECTION_PRESET_DELETED' else error_code end,
        error_message = case when status in ('queued', 'processing') then 'The source Section Preset was deleted.' else error_message end,
        completed_at = case when status in ('queued', 'processing') then coalesce(completed_at, now()) else completed_at end,
        updated_at = now()
      where job.run_id in (
          select run.id from promo_section_design_runs run
          where run.section_key = ${current.section_key}
        )
        or job.component_instance_id in (
          select instance.id
          from wizard_content_section_component_instances instance
          join wizard_content_sections section on section.id = instance.section_id
          where section.section_key = ${current.section_key}
        )
      returning job.id::text
    `;

    const cancelledDesignRuns = await sql`
      update promo_section_design_runs run
      set status = 'cancelled',
        error_code = 'SECTION_PRESET_DELETED',
        error_message = 'The source Section Preset was deleted.',
        completed_at = coalesce(completed_at, now()),
        updated_at = now()
      where run.section_key = ${current.section_key}
        and run.status in (
          'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
          'generating_assets', 'validating_assets', 'ready', 'applying'
        )
      returning run.id::text
    `;

    const deletedMemberships = await sql`
      delete from wizard_form_template_sections membership
      where membership.section_key = ${current.section_key}
        or membership.section_id in (
          select section.id
          from wizard_content_sections section
          where section.section_key = ${current.section_key}
        )
      returning membership.id::text
    `;

    const deletedSections = await sql`
      delete from wizard_content_sections section
      where section.section_key = ${current.section_key}
      returning section.id::text, section.version
    `;
    if (!deletedSections.length) {
      return res.status(409).json({ error: "Section Preset deletion was blocked" });
    }

    return res.status(200).json({
      ok: true,
      sectionKey: current.section_key,
      deletedVersionCount: deletedSections.length,
      deletedMembershipCount: deletedMemberships.length,
      cancelledDesignRunCount: cancelledDesignRuns.length,
      updatedAssetJobCount: updatedAssetJobs.length,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard content section delete failed",
      message: error.message,
    });
  }
};
