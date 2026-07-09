const {
  getSql,
  loadRunState,
  parseBody,
  payloadFromBody,
  runSummary,
  runKeyFromPayload,
  sha256,
  stableJson,
} = require("./_promo-generation-run-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") return await createRun(req, res);
    if (req.method === "GET") return await getRun(req, res);

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Generation run API failed",
      message: error.message,
    });
  }
};

async function createRun(req, res) {
  const body = parseBody(req.body);
  const payload = payloadFromBody(body);
  const runKey = runKeyFromPayload(body);
  const promo = payload.promo || body.promo || {};
  const md = payload.md || body.md || {};
  const inputSnapshot = payload;
  const inputHash = sha256(stableJson(inputSnapshot));
  const sql = getSql();

  const rows = await sql`
    insert into promo_generation_runs (
      run_key,
      promo_title,
      selected_md_id,
      selected_md_name,
      status,
      stage,
      input_hash,
      input_snapshot,
      metadata,
      updated_at
    )
    values (
      ${runKey},
      ${promo.title || body.promoTitle || ""},
      ${md.id || body.selectedMdId || ""},
      ${md.brand || md.name || body.selectedMdName || ""},
      'accepted',
      'created',
      ${inputHash},
      ${JSON.stringify(inputSnapshot)}::jsonb,
      ${JSON.stringify({ acceptedAt: new Date().toISOString() })}::jsonb,
      now()
    )
    on conflict (run_key) do update set
      promo_title = excluded.promo_title,
      selected_md_id = excluded.selected_md_id,
      selected_md_name = excluded.selected_md_name,
      status = 'accepted',
      stage = 'created',
      input_hash = excluded.input_hash,
      input_snapshot = excluded.input_snapshot,
      metadata = promo_generation_runs.metadata || excluded.metadata,
      error_message = '',
      updated_at = now()
    returning id::text
  `;

  const state = await loadRunState(sql, rows[0].id);
  return res.status(202).json({
    ok: true,
    accepted: true,
    runId: state.run.runId,
    runKey: state.run.runKey,
    status: state.run.status,
    stage: state.run.stage,
    inputHash,
    state,
  });
}

async function getRun(req, res) {
  const runId = String(req.query.runId || req.query.id || req.query.runKey || "").trim();
  const sql = getSql();
  if (!runId) return await listRuns(req, res, sql);

  const state = await loadRunState(sql, runId);
  if (!state) return res.status(404).json({ error: "Generation run not found" });

  return res.status(200).json({
    ok: true,
    ...state,
  });
}

async function listRuns(req, res, sql) {
  const limit = Math.max(1, Math.min(Number(req.query.limit || 50) || 50, 100));
  const rows = await sql`
    select
      id::text,
      run_key,
      promo_title,
      selected_md_id,
      selected_md_name,
      status,
      stage,
      input_hash,
      input_snapshot,
      error_message,
      metadata,
      created_at,
      updated_at
    from promo_generation_runs
    order by updated_at desc
    limit ${limit}
  `;

  const states = await Promise.all(rows.map((row) => loadRunState(sql, row.id)));
  return res.status(200).json({
    ok: true,
    runs: states.filter(Boolean),
    summaries: rows.map(runSummary),
  });
}
