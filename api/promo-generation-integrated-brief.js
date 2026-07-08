const {
  getSql,
  integratedBriefSummary,
  loadRunState,
  parseBody,
  resolveRun,
} = require("./_promo-generation-run-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") return await queueIntegratedBrief(req, res);
    if (req.method === "PATCH") return await updateIntegratedBrief(req, res);

    res.setHeader("Allow", "POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Integrated brief stage API failed",
      message: error.message,
    });
  }
};

async function queueIntegratedBrief(req, res) {
  const body = parseBody(req.body);
  const runId = String(body.runId || body.run_id || body.id || "").trim();
  if (!runId) return res.status(400).json({ error: "runId is required" });

  const sql = getSql();
  const run = await resolveRun(sql, runId);
  if (!run) return res.status(404).json({ error: "Generation run not found" });

  const rows = await sql`
    insert into promo_generation_integrated_briefs (
      run_id,
      status,
      prompt_meta,
      model_meta,
      updated_at
    )
    values (
      ${run.id}::uuid,
      'queued',
      ${JSON.stringify(body.promptMeta || {})}::jsonb,
      ${JSON.stringify(body.modelMeta || {})}::jsonb,
      now()
    )
    on conflict (run_id) do update set
      status = 'queued',
      error_message = '',
      prompt_meta = coalesce(nullif(${JSON.stringify(body.promptMeta || {})}::jsonb, '{}'::jsonb), promo_generation_integrated_briefs.prompt_meta),
      model_meta = coalesce(nullif(${JSON.stringify(body.modelMeta || {})}::jsonb, '{}'::jsonb), promo_generation_integrated_briefs.model_meta),
      updated_at = now()
    returning
      id::text,
      run_id::text,
      status,
      integrated_brief_markdown,
      integrated_brief_json,
      prompt_meta,
      model_meta,
      error_message,
      created_at,
      updated_at
  `;

  await sql`
    update promo_generation_runs
    set status = 'integrated_brief_queued', stage = 'integrated_brief', error_message = '', updated_at = now()
    where id = ${run.id}::uuid
  `;

  return res.status(202).json({
    ok: true,
    accepted: true,
    integratedBrief: integratedBriefSummary(rows[0]),
  });
}

async function updateIntegratedBrief(req, res) {
  const body = parseBody(req.body);
  const runId = String(body.runId || body.run_id || body.id || "").trim();
  const status = String(body.status || (body.errorMessage ? "failed" : "ready")).trim();
  if (!runId) return res.status(400).json({ error: "runId is required" });

  const sql = getSql();
  const run = await resolveRun(sql, runId);
  if (!run) return res.status(404).json({ error: "Generation run not found" });

  const rows = await sql`
    insert into promo_generation_integrated_briefs (
      run_id,
      status,
      integrated_brief_markdown,
      integrated_brief_json,
      prompt_meta,
      model_meta,
      error_message,
      updated_at
    )
    values (
      ${run.id}::uuid,
      ${status},
      ${body.integratedBriefMarkdown || body.integrated_brief_markdown || ""},
      ${JSON.stringify(body.integratedBrief || body.integratedBriefJson || body.integrated_brief_json || {})}::jsonb,
      ${JSON.stringify(body.promptMeta || {})}::jsonb,
      ${JSON.stringify(body.modelMeta || {})}::jsonb,
      ${body.errorMessage || body.error_message || ""},
      now()
    )
    on conflict (run_id) do update set
      status = excluded.status,
      integrated_brief_markdown = excluded.integrated_brief_markdown,
      integrated_brief_json = excluded.integrated_brief_json,
      prompt_meta = coalesce(nullif(excluded.prompt_meta, '{}'::jsonb), promo_generation_integrated_briefs.prompt_meta),
      model_meta = coalesce(nullif(excluded.model_meta, '{}'::jsonb), promo_generation_integrated_briefs.model_meta),
      error_message = excluded.error_message,
      updated_at = now()
    returning
      id::text,
      run_id::text,
      status,
      integrated_brief_markdown,
      integrated_brief_json,
      prompt_meta,
      model_meta,
      error_message,
      created_at,
      updated_at
  `;

  await sql`
    update promo_generation_runs
    set
      status = ${status === "ready" || status === "completed" ? "integrated_brief_ready" : "integrated_brief_failed"},
      stage = 'integrated_brief',
      error_message = ${body.errorMessage || body.error_message || ""},
      updated_at = now()
    where id = ${run.id}::uuid
  `;

  const state = await loadRunState(sql, run.id);
  return res.status(200).json({
    ok: true,
    integratedBrief: integratedBriefSummary(rows[0]),
    state,
  });
}
