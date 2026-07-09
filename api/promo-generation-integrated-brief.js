const {
  getSql,
  integratedBriefSummary,
  loadRunState,
  parseBody,
  resolveRun,
} = require("./_promo-generation-run-store");
const {
  buildWorkerPayload,
  shouldTriggerWorker,
  triggerWorker,
} = require("./_promo-generation-worker-trigger");

// Integrated brief is the first generated artifact and becomes the contract for
// image stages. Queueing only creates/updates DB state; n8n owns the long-running
// generation and calls PATCH when the artifact is ready or failed.
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

  const integratedBrief = integratedBriefSummary(rows[0]);
  // The worker payload stays intentionally small. n8n can fetch prepared prompt
  // material by run/task id, which avoids duplicating large markdown in trigger logs.
  const workerPayload = buildWorkerPayload({
    run,
    stage: "integrated_brief",
    taskId: integratedBrief.integratedBriefId,
    extra: { integratedBriefId: integratedBrief.integratedBriefId },
  });
  const workerTriggerRequested = shouldTriggerWorker(body);
  const workerTrigger = workerTriggerRequested
    ? await triggerWorker({
      stage: "integrated_brief",
      payload: workerPayload,
      workerUrl: body.workerUrl || body.worker_url,
      timeoutMs: body.triggerTimeoutMs || body.trigger_timeout_ms,
      sql,
    })
    : null;
  if (workerTriggerRequested) {
    const triggerMeta = {
      workerPayload,
      workerTrigger,
      triggeredAt: new Date().toISOString(),
    };
    await sql`
      update promo_generation_integrated_briefs
      set
        prompt_meta = coalesce(prompt_meta, '{}'::jsonb) || ${JSON.stringify({ workerTrigger: triggerMeta })}::jsonb,
        updated_at = now()
      where id = ${integratedBrief.integratedBriefId}::uuid
    `;
  }
  if (workerTrigger && !workerTrigger.ok) {
    // Keep trigger failures explicit; without this state the UI would keep polling
    // a queued step even though n8n never acknowledged the job.
    await sql`
      update promo_generation_integrated_briefs
      set status = 'trigger_failed', error_message = ${workerTrigger.error || "Worker trigger failed"}, updated_at = now()
      where id = ${integratedBrief.integratedBriefId}::uuid
    `;
    await sql`
      update promo_generation_runs
      set status = 'integrated_brief_trigger_failed', stage = 'integrated_brief', error_message = ${workerTrigger.error || "Worker trigger failed"}, updated_at = now()
      where id = ${run.id}::uuid
    `;
    integratedBrief.status = "trigger_failed";
    integratedBrief.errorMessage = workerTrigger.error || "Worker trigger failed";
  }

  const workerTriggerFailed = Boolean(workerTriggerRequested && workerTrigger && !workerTrigger.ok);
  return res.status(workerTriggerFailed ? 502 : 202).json({
    ok: !workerTriggerFailed,
    accepted: !workerTriggerFailed,
    workerPayload,
    workerTrigger,
    integratedBrief,
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
