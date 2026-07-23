const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { generateSectionImage } = require("./_promo-section-design-provider");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  const body = parseBody(req.body);
  const jobId = String(body.jobId || "").trim();
  if (!jobId) return res.status(400).json({ error: "jobId is required" });
  const sql = getSql();
  let job;
  try {
    const rows = await sql`
      update promo_section_design_asset_jobs set status = 'processing', current_attempt = current_attempt + 1,
        error_code = null, error_message = null, updated_at = now()
      where id = ${jobId}::uuid and status in ('queued', 'failed') returning *
    `;
    if (!rows.length) {
      const current = await sql`select id::text, status, result_snapshot from promo_section_design_asset_jobs where id = ${jobId}::uuid limit 1`;
      if (!current.length) return res.status(404).json({ error: "Asset job not found" });
      return res.status(current[0].status === "ready" ? 200 : 409).json({ ok: current[0].status === "ready", asset: current[0] });
    }
    job = rows[0];
    const run = await fetchRun(sql, job.run_id);
    if (!run || !["generating_assets", "validating_assets"].includes(run.status)) throw Object.assign(new Error("Parent design run is not in the asset stage"), { code: "RUN_STAGE_CONFLICT", statusCode: 409 });
    const request = job.request_snapshot || {};
    const image = await generateSectionImage({
      prompt: request.prompt, safeArea: request.safeArea || "none",
      backgroundColor: run.inputSnapshot?.design?.backgroundColor,
    });
    if (image.bytes.length < 1024) throw Object.assign(new Error("Generated image is too small"), { code: "IMAGE_VALIDATION_FAILED" });
    const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType === "image/webp" ? "webp" : "png";
    const targetKey = job.target_type === "item" ? job.target_item_key : `${run.sectionKey}-background`;
    const storageKey = `section-ai/${run.id}/${targetKey}-${Date.now()}.${extension}`;
    const { put } = await import("@vercel/blob");
    const blob = await put(storageKey, image.bytes, { access: "private", contentType: image.mimeType });
    const result = {
      target: { type: job.target_type, sectionKey: run.sectionKey, itemKey: job.target_item_key || null },
      storageKey, assetUrl: blob.url, proxyUrl: `/api/promo-section-design-asset-image?jobId=${encodeURIComponent(jobId)}`,
      mimeType: image.mimeType, width: image.width, height: image.height,
      safeArea: request.safeArea || "none", backgroundColor: run.inputSnapshot?.design?.backgroundColor,
      provider: image.provider, usage: image.usage,
    };
    await sql`
      update promo_section_design_asset_jobs set status = 'ready', result_snapshot = ${JSON.stringify(result)}::jsonb,
        completed_at = now(), updated_at = now() where id = ${jobId}::uuid and status = 'processing'
    `;
    const pending = await sql`
      select count(*) filter (where status <> 'ready')::integer as pending,
        jsonb_agg(result_snapshot order by created_at) filter (where status = 'ready') as results
      from promo_section_design_asset_jobs where run_id = ${run.id}::uuid
    `;
    let updatedRun = run;
    if (Number(pending[0]?.pending || 0) === 0) {
      updatedRun = await transitionRun(sql, run.id, [run.status], "ready", {
        imageResult: { assets: pending[0].results || [] },
        providerSnapshot: { ...run.providerSnapshot, assets: "per-job" },
      }) || run;
    }
    return res.status(200).json({ ok: true, asset: result, run: updatedRun });
  } catch (error) {
    if (job) await sql`
      update promo_section_design_asset_jobs set status = 'failed', error_code = ${error.code || "SECTION_ASSET_FAILED"},
        error_message = ${error.message}, completed_at = now(), updated_at = now()
      where id = ${jobId}::uuid and status = 'processing'
    `.catch(() => null);
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({ error: "Section design asset generation failed", message: error.message });
  }
};
