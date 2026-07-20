const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { inputHash } = require("./_promo-section-design-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const id = String(body.runId || body.id || "").trim();
    if (!id) return res.status(400).json({ error: "runId is required" });
    const sql = getSql();
    const run = await fetchRun(sql, id);
    if (!run) return res.status(404).json({ error: "Section design run not found" });
    if (run.status === "applied") return res.status(200).json({ ok: true, run });
    if (run.status !== "ready") return res.status(409).json({ error: "Only a ready run can be applied", run });
    const currentSectionInputs = body.sectionInputs && typeof body.sectionInputs === "object" ? body.sectionInputs : null;
    if (!currentSectionInputs) return res.status(400).json({ error: "sectionInputs is required" });
    if (inputHash(currentSectionInputs) !== inputHash(run.inputSnapshot?.section?.sectionInputs || {})) {
      return res.status(409).json({ error: "Section content changed; regenerate the design", code: "INPUT_HASH_MISMATCH" });
    }
    const applied = await transitionRun(sql, id, ["ready"], "applied");
    return res.status(200).json({ ok: true, run: applied });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section design apply failed", message: error.message });
  }
};
