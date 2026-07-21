const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { layoutPatchFromResult, validatePatch } = require("./_promo-section-design-contract");
const { generateSectionLayout } = require("./_promo-section-design-provider");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const body = parseBody(req.body);
  const id = String(body.runId || body.id || "").trim();
  if (!id) return res.status(400).json({ error: "runId is required" });
  let sql;
  let run;
  try {
    sql = getSql();
    run = await fetchRun(sql, id);
  } catch (error) {
    console.error("[section-design] initialization failed", { runId: id, message: error.message, stack: error.stack });
    return res.status(error.statusCode || 500).json({
      error: "Section design initialization failed",
      message: error.message,
    });
  }
  if (!run) return res.status(404).json({ error: "Section design run not found" });
  if (run.status === "ready" || run.status === "applied") return res.status(200).json({ ok: true, run });
  if (run.status !== "queued" && run.status !== "failed") return res.status(409).json({ error: "Section design run is already processing", run });
  try {
    console.log("[section-design] processing started", { runId: id, status: run.status, attempt: run.currentAttempt + 1 });
    run = await transitionRun(sql, id, [run.status], "analyzing_content", { incrementAttempt: true });
    if (!run) return res.status(409).json({ error: "Section design run was claimed by another request" });
    await transitionRun(sql, id, ["analyzing_content"], "generating_layout");
    const snapshot = run.inputSnapshot;
    const section = snapshot.section;
    const layoutGeneration = await generateSectionLayout({
      section,
      sectionInputs: section.aiContent || section.sectionInputs,
      constraints: run.constraintsSnapshot,
    });
    console.log("[section-design] layout generated", { runId: id, model: layoutGeneration.provider.model, latencyMs: layoutGeneration.provider.latencyMs });
    await transitionRun(sql, id, ["generating_layout"], "validating_layout");
    const generated = layoutPatchFromResult(section, layoutGeneration.result, run.constraintsSnapshot);
    const validation = validatePatch(section, generated, run.constraintsSnapshot);
    if (!validation.ok) throw Object.assign(new Error(validation.errors.join("; ")), { code: "LAYOUT_SCHEMA_FAILED" });
    if (generated.imageRequest) {
      run = await transitionRun(sql, id, ["validating_layout"], "generating_assets", {
        layoutResult: generated,
        providerSnapshot: { layout: layoutGeneration.provider },
        usageSnapshot: { layout: layoutGeneration.usage },
      });
      console.log("[section-design] layout processing completed; image stage queued", { runId: id, status: run?.status });
      return res.status(202).json({ ok: true, nextStage: "image", run });
    }
    run = await transitionRun(sql, id, ["validating_layout"], "ready", {
      layoutResult: generated,
      providerSnapshot: { layout: layoutGeneration.provider },
      usageSnapshot: { layout: layoutGeneration.usage },
    });
    console.log("[section-design] processing completed", { runId: id, status: run?.status, hasImage: false });
    return res.status(200).json({ ok: true, run });
  } catch (error) {
    console.error("[section-design] processing failed", { runId: id, code: error.code || "SECTION_DESIGN_FAILED", message: error.message, stack: error.stack });
    run = await fetchRun(sql, id);
    const failed = await transitionRun(sql, id, [run.status], "failed", {
      errorCode: error.code || "SECTION_DESIGN_FAILED",
      errorMessage: error.message,
    });
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Section design generation failed",
      message: error.message,
      run: failed || run,
    });
  }
};
