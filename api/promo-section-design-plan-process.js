const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { fetchTokenVersion } = require("./_design-token-store");
const { validateDesignPlan, layoutPatchFromDesignPlan } = require("./_promo-section-design-contract");
const { generateSectionDesignPlan } = require("./_promo-section-design-provider");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  const body = parseBody(req.body);
  const runId = String(body.runId || "").trim();
  if (!runId) return res.status(400).json({ error: "runId is required" });
  const sql = getSql();
  let run = await fetchRun(sql, runId);
  if (!run) return res.status(404).json({ error: "Section design run not found" });
  if (!["queued", "failed"].includes(run.status)) return res.status(409).json({ error: "Run is not available for plan processing", run });
  try {
    run = await transitionRun(sql, runId, [run.status], "analyzing_content", { incrementAttempt: true, clearCompletedAt: true });
    if (!run) return res.status(409).json({ error: "Run was claimed by another request" });
    await transitionRun(sql, runId, ["analyzing_content"], "generating_layout");
    const tokenSet = await fetchTokenVersion(sql, run.tokenSetVersionId);
    if (!tokenSet) throw Object.assign(new Error("Pinned design token set version was not found"), { code: "TOKEN_SET_NOT_FOUND" });
    const section = run.inputSnapshot.section;
    const generation = await generateSectionDesignPlan({
      section, sectionInputs: section.aiContent || section.sectionInputs,
      constraints: run.constraintsSnapshot, tokenSet, requestMode: run.requestMode,
      promptConfig: run.promptSnapshot?.promptConfig,
    });
    await transitionRun(sql, runId, ["generating_layout"], "validating_layout");
    const validation = validateDesignPlan(section, generation.result, run.constraintsSnapshot, tokenSet);
    if (run.requestMode === "layout-style" && generation.result.assetRequests.length) {
      validation.ok = false;
      validation.errors.push("layout-style mode must not create asset requests");
    }
    if (!validation.ok) throw Object.assign(new Error(validation.errors.join("; ")), { code: "DESIGN_PLAN_VALIDATION_FAILED" });
    const effectivePatch = {
      contractVersion: 1, layoutVariant: generation.result.layoutVariant,
      itemPlacements: generation.result.itemPlacements, slotSelections: generation.result.slotSelections,
      assetRequests: generation.result.assetRequests,
    };
    const layoutResult = layoutPatchFromDesignPlan(section, generation.result, tokenSet);
    await sql`delete from promo_section_design_asset_jobs where run_id = ${runId}::uuid and status <> 'ready'`;
    for (const asset of effectivePatch.assetRequests) {
      await sql`
        insert into promo_section_design_asset_jobs (run_id, target_type, target_item_key, request_snapshot)
        values (${runId}::uuid, ${asset.targetType}, ${asset.itemKey || null}, ${JSON.stringify(asset)}::jsonb)
        on conflict do nothing
      `;
    }
    const nextStatus = effectivePatch.assetRequests.length ? "generating_assets" : "ready";
    run = await transitionRun(sql, runId, ["validating_layout"], nextStatus, {
      designPlan: generation.result, effectivePatch,
      layoutResult,
      providerSnapshot: { planner: generation.provider }, usageSnapshot: { planner: generation.usage },
    });
    return res.status(nextStatus === "ready" ? 200 : 202).json({ ok: true, nextStage: effectivePatch.assetRequests.length ? "assets" : null, run });
  } catch (error) {
    const current = await fetchRun(sql, runId);
    const failed = current && !["ready", "applied", "cancelled"].includes(current.status)
      ? await transitionRun(sql, runId, [current.status], "failed", { errorCode: error.code || "DESIGN_PLAN_FAILED", errorMessage: error.message })
      : current;
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({ error: "Section design planning failed", message: error.message, run: failed });
  }
};
