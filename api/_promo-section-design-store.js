const { getSql, parseBody } = require("./_wizard-form-templates-store");

function toRun(row) {
  if (!row) return null;
  return {
    id: row.id,
    promoRunId: row.promo_run_id || null,
    formTemplateId: row.form_template_id,
    templateVersion: Number(row.template_version || 1),
    layoutRevision: Number(row.layout_revision || 1),
    sectionKey: row.section_key,
    status: row.status,
    inputSnapshot: row.input_snapshot || {},
    inputHash: row.input_hash,
    constraintsSnapshot: row.constraints_snapshot || {},
    layoutResult: row.layout_result || null,
    imageResult: row.image_result || null,
    providerSnapshot: row.provider_snapshot || {},
    usageSnapshot: row.usage_snapshot || {},
    currentAttempt: Number(row.current_attempt || 0),
    errorCode: row.error_code || "",
    errorMessage: row.error_message || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    completedAt: row.completed_at || null,
    appliedAt: row.applied_at || null,
  };
}

async function fetchRun(sql, id) {
  const rows = await sql`
    select id::text, promo_run_id::text, form_template_id::text, template_version,
      layout_revision, section_key, status, input_snapshot, input_hash, constraints_snapshot,
      layout_result, image_result, provider_snapshot, usage_snapshot, current_attempt,
      error_code, error_message, created_at, updated_at, completed_at, applied_at
    from promo_section_design_runs where id = ${id}::uuid limit 1
  `;
  return toRun(rows[0]);
}

async function createRun(sql, input) {
  const existing = await sql`
    select id::text from promo_section_design_runs
    where form_template_id = ${input.formTemplateId}::uuid
      and section_key = ${input.sectionKey}
      and input_hash = ${input.inputHash}
      and template_version = ${input.templateVersion}
      and layout_revision = ${input.layoutRevision}
      and status in ('queued', 'analyzing_content', 'generating_layout', 'validating_layout',
        'generating_assets', 'validating_assets', 'ready')
    order by created_at desc limit 1
  `;
  if (existing[0]) return { run: await fetchRun(sql, existing[0].id), reused: true };
  const rows = await sql`
    insert into promo_section_design_runs (
      promo_run_id, form_template_id, template_version, layout_revision, section_key,
      input_snapshot, input_hash, constraints_snapshot
    ) values (
      ${input.promoRunId || null}::uuid, ${input.formTemplateId}::uuid, ${input.templateVersion},
      ${input.layoutRevision}, ${input.sectionKey}, ${JSON.stringify(input.inputSnapshot)}::jsonb,
      ${input.inputHash}, ${JSON.stringify(input.constraintsSnapshot)}::jsonb
    ) returning id::text
  `;
  return { run: await fetchRun(sql, rows[0].id), reused: false };
}

async function transitionRun(sql, id, fromStatuses, status, patch = {}) {
  const rows = await sql`
    update promo_section_design_runs set
      status = ${status},
      current_attempt = current_attempt + ${patch.incrementAttempt ? 1 : 0},
      layout_result = coalesce(${patch.layoutResult ? JSON.stringify(patch.layoutResult) : null}::jsonb, layout_result),
      image_result = coalesce(${patch.imageResult ? JSON.stringify(patch.imageResult) : null}::jsonb, image_result),
      provider_snapshot = coalesce(${patch.providerSnapshot ? JSON.stringify(patch.providerSnapshot) : null}::jsonb, provider_snapshot),
      usage_snapshot = coalesce(${patch.usageSnapshot ? JSON.stringify(patch.usageSnapshot) : null}::jsonb, usage_snapshot),
      error_code = ${patch.errorCode || null},
      error_message = ${patch.errorMessage || null},
      completed_at = case
        when ${patch.clearCompletedAt ? true : false} then null
        when ${status} in ('ready', 'failed', 'cancelled') then now()
        else completed_at
      end,
      applied_at = case when ${status} = 'applied' then now() else applied_at end,
      updated_at = now()
    where id = ${id}::uuid and status = any(${fromStatuses}::text[])
    returning id::text
  `;
  return rows[0] ? fetchRun(sql, id) : null;
}

module.exports = { getSql, parseBody, fetchRun, createRun, transitionRun };
