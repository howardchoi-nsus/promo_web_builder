const {
  finalDesignSummary,
  getSql,
  loadRunState,
  parseBody,
  resolveRun,
} = require("./_promo-generation-run-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") return await queueFinalDesign(req, res);
    if (req.method === "PATCH") return await updateFinalDesign(req, res);

    res.setHeader("Allow", "POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Final design stage API failed",
      message: error.message,
    });
  }
};

async function queueFinalDesign(req, res) {
  const body = parseBody(req.body);
  const runId = String(body.runId || body.run_id || body.id || "").trim();
  if (!runId) return res.status(400).json({ error: "runId is required" });

  const sql = getSql();
  const run = await resolveRun(sql, runId);
  if (!run) return res.status(404).json({ error: "Generation run not found" });

  const draftRows = await sql`
    select id::text
    from promo_generation_lofi_drafts
    where run_id = ${run.id}::uuid
      and confirmed_at is not null
    order by confirmed_at desc
    limit 1
  `;
  if (!draftRows.length && !body.force) {
    return res.status(409).json({
      error: "Confirmed LO-FI draft is required",
      message: "Confirm one LO-FI draft before starting final design generation.",
    });
  }
  const confirmedDraftId = String(body.confirmedDraftId || body.confirmed_draft_id || draftRows[0]?.id || "").trim();

  const rows = await sql`
    insert into promo_generation_final_designs (
      run_id,
      confirmed_draft_id,
      status,
      final_prompt,
      prompt_meta,
      model_meta,
      updated_at
    )
    values (
      ${run.id}::uuid,
      ${confirmedDraftId || null}::uuid,
      'queued',
      ${body.finalPrompt || body.prompt || ""},
      ${JSON.stringify(body.promptMeta || {})}::jsonb,
      ${JSON.stringify(body.modelMeta || {})}::jsonb,
      now()
    )
    returning
      id::text,
      run_id::text,
      confirmed_draft_id::text,
      status,
      final_image_url,
      final_prompt,
      prompt_meta,
      model_meta,
      error_message,
      created_at,
      updated_at
  `;

  await sql`
    update promo_generation_runs
    set status = 'final_design_queued', stage = 'final_design', error_message = '', updated_at = now()
    where id = ${run.id}::uuid
  `;

  return res.status(202).json({
    ok: true,
    accepted: true,
    finalDesign: finalDesignSummary(rows[0]),
  });
}

async function updateFinalDesign(req, res) {
  const body = parseBody(req.body);
  const finalDesignId = String(body.finalDesignId || body.final_design_id || body.id || "").trim();
  const status = String(body.status || (body.errorMessage ? "failed" : "ready")).trim();
  if (!finalDesignId) return res.status(400).json({ error: "finalDesignId is required" });

  const sql = getSql();
  const rows = await sql`
    update promo_generation_final_designs
    set
      status = ${status},
      final_image_url = ${body.finalImageUrl || body.final_image_url || ""},
      final_prompt = ${body.finalPrompt || body.final_prompt || body.prompt || ""},
      prompt_meta = coalesce(nullif(${JSON.stringify(body.promptMeta || {})}::jsonb, '{}'::jsonb), prompt_meta),
      model_meta = coalesce(nullif(${JSON.stringify(body.modelMeta || {})}::jsonb, '{}'::jsonb), model_meta),
      error_message = ${body.errorMessage || body.error_message || ""},
      updated_at = now()
    where id = ${finalDesignId}::uuid
    returning
      id::text,
      run_id::text,
      confirmed_draft_id::text,
      status,
      final_image_url,
      final_prompt,
      prompt_meta,
      model_meta,
      error_message,
      created_at,
      updated_at
  `;
  if (!rows.length) return res.status(404).json({ error: "Final design not found" });

  await sql`
    update promo_generation_runs
    set
      status = ${status === "ready" || status === "completed" ? "final_design_ready" : "final_design_failed"},
      stage = 'final_design',
      error_message = ${body.errorMessage || body.error_message || ""},
      updated_at = now()
    where id = ${rows[0].run_id}::uuid
  `;

  const state = await loadRunState(sql, rows[0].run_id);
  return res.status(200).json({
    ok: true,
    finalDesign: finalDesignSummary(rows[0]),
    state,
  });
}
