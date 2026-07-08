const {
  draftSummary,
  getSql,
  loadRunState,
  parseBody,
  resolveRun,
} = require("./_promo-generation-run-store");
const {
  buildWorkerPayload,
  shouldTriggerWorker,
  triggerWorker,
} = require("./_promo-generation-worker-trigger");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") return await queueDraft(req, res);
    if (req.method === "PATCH") return await updateDraft(req, res);

    res.setHeader("Allow", "POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "LO-FI draft stage API failed",
      message: error.message,
    });
  }
};

async function queueDraft(req, res) {
  const body = parseBody(req.body);
  const runId = String(body.runId || body.run_id || body.id || "").trim();
  if (!runId) return res.status(400).json({ error: "runId is required" });

  const sql = getSql();
  const run = await resolveRun(sql, runId);
  if (!run) return res.status(404).json({ error: "Generation run not found" });

  const briefRows = await sql`
    select status
    from promo_generation_integrated_briefs
    where run_id = ${run.id}::uuid
    limit 1
  `;
  const briefReady = ["ready", "completed"].includes(String(briefRows[0]?.status || ""));
  if (!briefReady && !body.force) {
    return res.status(409).json({
      error: "Integrated brief is not ready",
      message: "Generate and validate the integrated brief before requesting a LO-FI draft.",
    });
  }

  const attemptRows = await sql`
    select coalesce(max(draft_attempt), 0) + 1 as next_attempt
    from promo_generation_lofi_drafts
    where run_id = ${run.id}::uuid
  `;
  const nextAttempt = Number(attemptRows[0]?.next_attempt || 1);

  const rows = await sql`
    insert into promo_generation_lofi_drafts (
      run_id,
      draft_attempt,
      status,
      draft_prompt,
      prompt_meta,
      model_meta,
      updated_at
    )
    values (
      ${run.id}::uuid,
      ${nextAttempt},
      'queued',
      ${body.draftPrompt || body.prompt || ""},
      ${JSON.stringify(body.promptMeta || {})}::jsonb,
      ${JSON.stringify(body.modelMeta || {})}::jsonb,
      now()
    )
    returning
      id::text,
      run_id::text,
      draft_attempt,
      status,
      draft_image_url,
      draft_prompt,
      prompt_meta,
      model_meta,
      error_message,
      confirmed_at,
      created_at,
      updated_at
  `;

  await sql`
    update promo_generation_runs
    set status = 'lofi_draft_queued', stage = 'lofi_draft', error_message = '', updated_at = now()
    where id = ${run.id}::uuid
  `;

  const draft = draftSummary(rows[0]);
  const workerPayload = buildWorkerPayload({
    run,
    stage: "lofi_draft",
    taskId: draft.draftId,
    extra: {
      draftId: draft.draftId,
      draftAttempt: draft.draftAttempt,
    },
  });
  const workerTriggerRequested = shouldTriggerWorker(body);
  const workerTrigger = workerTriggerRequested
    ? await triggerWorker({
      stage: "lofi_draft",
      payload: workerPayload,
      workerUrl: body.workerUrl || body.worker_url,
      timeoutMs: body.triggerTimeoutMs || body.trigger_timeout_ms,
    })
    : null;
  if (workerTriggerRequested) {
    const triggerMeta = {
      workerPayload,
      workerTrigger,
      triggeredAt: new Date().toISOString(),
    };
    await sql`
      update promo_generation_lofi_drafts
      set
        prompt_meta = coalesce(prompt_meta, '{}'::jsonb) || ${JSON.stringify({ workerTrigger: triggerMeta })}::jsonb,
        updated_at = now()
      where id = ${draft.draftId}::uuid
    `;
  }
  if (workerTrigger && !workerTrigger.ok) {
    await sql`
      update promo_generation_lofi_drafts
      set status = 'trigger_failed', error_message = ${workerTrigger.error || "Worker trigger failed"}, updated_at = now()
      where id = ${draft.draftId}::uuid
    `;
    await sql`
      update promo_generation_runs
      set status = 'lofi_draft_trigger_failed', stage = 'lofi_draft', error_message = ${workerTrigger.error || "Worker trigger failed"}, updated_at = now()
      where id = ${run.id}::uuid
    `;
    draft.status = "trigger_failed";
    draft.errorMessage = workerTrigger.error || "Worker trigger failed";
  }

  const workerTriggerFailed = Boolean(workerTriggerRequested && workerTrigger && !workerTrigger.ok);
  return res.status(workerTriggerFailed ? 502 : 202).json({
    ok: !workerTriggerFailed,
    accepted: !workerTriggerFailed,
    workerPayload,
    workerTrigger,
    draft,
  });
}

async function updateDraft(req, res) {
  const body = parseBody(req.body);
  const draftId = String(body.draftId || body.draft_id || body.id || "").trim();
  const status = String(body.status || (body.errorMessage ? "failed" : "ready")).trim();
  if (!draftId) return res.status(400).json({ error: "draftId is required" });

  const sql = getSql();
  const rows = await sql`
    update promo_generation_lofi_drafts
    set
      status = ${status},
      draft_image_url = ${body.draftImageUrl || body.draft_image_url || ""},
      draft_prompt = ${body.draftPrompt || body.draft_prompt || body.prompt || ""},
      prompt_meta = coalesce(nullif(${JSON.stringify(body.promptMeta || {})}::jsonb, '{}'::jsonb), prompt_meta),
      model_meta = coalesce(nullif(${JSON.stringify(body.modelMeta || {})}::jsonb, '{}'::jsonb), model_meta),
      error_message = ${body.errorMessage || body.error_message || ""},
      updated_at = now()
    where id = ${draftId}::uuid
    returning
      id::text,
      run_id::text,
      draft_attempt,
      status,
      draft_image_url,
      draft_prompt,
      prompt_meta,
      model_meta,
      error_message,
      confirmed_at,
      created_at,
      updated_at
  `;
  if (!rows.length) return res.status(404).json({ error: "LO-FI draft not found" });

  await sql`
    update promo_generation_runs
    set
      status = ${status === "ready" || status === "completed" ? "lofi_draft_ready" : "lofi_draft_failed"},
      stage = 'lofi_draft',
      error_message = ${body.errorMessage || body.error_message || ""},
      updated_at = now()
    where id = ${rows[0].run_id}::uuid
  `;

  const state = await loadRunState(sql, rows[0].run_id);
  return res.status(200).json({
    ok: true,
    draft: draftSummary(rows[0]),
    state,
  });
}
