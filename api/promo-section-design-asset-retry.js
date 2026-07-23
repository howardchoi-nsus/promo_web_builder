const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const jobId = String(body.jobId || "").trim();
    if (!jobId) return res.status(400).json({ error: "jobId is required" });
    const sql = getSql();
    const rows = await sql`
      update promo_section_design_asset_jobs set
        status = 'queued', next_retry_at = now(),
        lease_token = null, lease_expires_at = null,
        error_code = null, error_message = null, failure_stage = null,
        completed_at = null, updated_at = now()
      where id = ${jobId}::uuid
        and current_attempt < max_attempts
        and (
          status = 'failed'
          or (status = 'processing' and lease_expires_at < now())
        )
      returning id::text, run_id::text, status, current_attempt, max_attempts, next_retry_at
    `;
    if (!rows.length) {
      const current = await sql`
        select id::text, run_id::text, status, current_attempt, max_attempts, lease_expires_at
        from promo_section_design_asset_jobs where id = ${jobId}::uuid limit 1
      `;
      if (!current.length) return res.status(404).json({ error: "Asset job not found" });
      return res.status(409).json({
        error: Number(current[0].current_attempt) >= Number(current[0].max_attempts)
          ? "Asset retry limit reached"
          : "Asset job is not retryable yet",
        asset: current[0],
      });
    }
    let run = await fetchRun(sql, rows[0].run_id);
    if (run?.status === "failed") {
      run = await transitionRun(sql, run.id, ["failed"], "generating_assets", {
        clearCompletedAt: true,
      }) || run;
    }
    return res.status(202).json({ ok: true, asset: rows[0], run });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Section design asset retry failed",
      message: error.message,
    });
  }
};
