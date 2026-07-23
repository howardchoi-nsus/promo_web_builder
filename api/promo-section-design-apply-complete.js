const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const runId = String(body.runId || "").trim();
    if (!runId) return res.status(400).json({ error: "runId is required" });
    const sql = getSql();
    const run = await fetchRun(sql, runId);
    if (!run) return res.status(404).json({ error: "Section design run not found" });
    if (run.status === "applied") return res.status(200).json({ ok: true, run });
    if (run.status !== "applying") {
      return res.status(409).json({ error: "Run is not awaiting apply acknowledgement", run });
    }
    const success = body.success !== false;
    if (!success) {
      const ready = await transitionRun(sql, runId, ["applying"], "ready", {
        errorCode: "CLIENT_APPLY_FAILED",
        errorMessage: String(body.errorMessage || "Client could not persist the generated design."),
      });
      return res.status(200).json({ ok: false, canRetryApply: true, run: ready || run });
    }
    if (run.requestMode === "assets") {
      await sql`
        update promo_section_design_asset_jobs
        set applied_at = now(), updated_at = now()
        where run_id = ${runId}::uuid and status = 'ready'
      `;
    }
    const applied = await transitionRun(sql, runId, ["applying"], "applied");
    if (!applied) return res.status(409).json({ error: "Run changed before apply completion" });
    return res.status(200).json({ ok: true, run: applied });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Section design apply completion failed",
      message: error.message,
    });
  }
};
