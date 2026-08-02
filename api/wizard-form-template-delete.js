const {
  getSql, parseBody, fetchTemplateRow,
} = require("./_wizard-form-templates-store");

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
    const current = await fetchTemplateRow(sql, id);
    if (!current) return res.status(404).json({ error: "Form template not found" });

    const protectedRows = await sql`
      select id::text, status, is_default
      from wizard_form_templates
      where template_key = ${current.template_key}
        and (status = 'active' or is_default = true)
      limit 1
    `;
    if (protectedRows.length) {
      return res.status(409).json({
        error: "Active or default form templates cannot be deleted",
        message: "활성 또는 기본 템플릿은 삭제할 수 없습니다. 먼저 다른 템플릿을 활성화하고 기본 템플릿을 변경해 주세요.",
      });
    }

    const updatedAssetJobs = await sql`
      update promo_section_design_asset_jobs job
      set status = case when status in ('queued', 'processing') then 'cancelled' else status end,
        component_instance_id = null,
        error_code = case when status in ('queued', 'processing') then 'TEMPLATE_DELETED' else error_code end,
        error_message = case when status in ('queued', 'processing') then 'The source form template was deleted.' else error_message end,
        completed_at = case when status in ('queued', 'processing') then coalesce(completed_at, now()) else completed_at end,
        updated_at = now()
      where job.run_id in (
        select run.id
        from promo_section_design_runs run
        join wizard_form_templates template on template.id = run.form_template_id
        where template.template_key = ${current.template_key}
      )
        and (job.status in ('queued', 'processing') or job.component_instance_id is not null)
      returning job.id::text
    `;

    const cancelledDesignRuns = await sql`
      update promo_section_design_runs run
      set status = 'cancelled',
        form_template_id = null,
        error_code = 'TEMPLATE_DELETED',
        error_message = 'The source form template was deleted.',
        completed_at = coalesce(completed_at, now()),
        updated_at = now()
      where run.form_template_id in (
        select template.id
        from wizard_form_templates template
        where template.template_key = ${current.template_key}
      )
        and run.status in (
          'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
          'generating_assets', 'validating_assets', 'ready', 'applying'
        )
      returning run.id::text
    `;

    const deletedRows = await sql`
      delete from wizard_form_templates target
      where target.template_key = ${current.template_key}
        and not exists (
          select 1
          from wizard_form_templates protected
          where protected.template_key = target.template_key
            and (protected.status = 'active' or protected.is_default = true)
        )
      returning id::text, version
    `;
    if (!deletedRows.length) {
      return res.status(409).json({ error: "Form template deletion was blocked" });
    }

    return res.status(200).json({
      ok: true,
      templateKey: current.template_key,
      deletedVersionCount: deletedRows.length,
      cancelledDesignRunCount: cancelledDesignRuns.length,
      updatedAssetJobCount: updatedAssetJobs.length,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Wizard form template delete failed",
      message: error.message,
    });
  }
};
