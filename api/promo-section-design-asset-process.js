const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { generateSectionImage } = require("./_promo-section-design-provider");
const { randomUUID } = require("node:crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  const body = parseBody(req.body);
  const jobId = String(body.jobId || "").trim();
  if (!jobId) return res.status(400).json({ error: "jobId is required" });
  const sql = getSql();
  let job;
  const leaseToken = randomUUID();
  try {
    const rows = await sql`
      update promo_section_design_asset_jobs set status = 'processing', current_attempt = current_attempt + 1,
        lease_token = ${leaseToken}::uuid, lease_expires_at = now() + interval '7 minutes',
        heartbeat_at = now(), failure_stage = null,
        error_code = null, error_message = null, updated_at = now()
      where id = ${jobId}::uuid
        and current_attempt < max_attempts
        and (next_retry_at is null or next_retry_at <= now())
        and (
          status in ('queued', 'failed')
          or (status = 'processing' and lease_expires_at < now())
        )
      returning *
    `;
    if (!rows.length) {
      const current = await sql`
        select id::text, run_id::text, status, result_snapshot, current_attempt, max_attempts,
          lease_expires_at, next_retry_at, error_code, error_message
        from promo_section_design_asset_jobs where id = ${jobId}::uuid limit 1
      `;
      if (!current.length) return res.status(404).json({ error: "Asset job not found" });
      const asset = current[0];
      const run = await fetchRun(sql, asset.run_id);
      if (asset.status === "ready") {
        return res.status(200).json({ ok: true, asset, run });
      }
      if (asset.status === "processing") {
        const retryAfterMs = asset.lease_expires_at
          ? Math.max(1000, new Date(asset.lease_expires_at).getTime() - Date.now())
          : 2000;
        return res.status(202).json({
          ok: true,
          processing: true,
          retryAfterMs,
          asset,
          run,
        });
      }
      if (
        asset.status === "failed"
        && Number(asset.current_attempt) < Number(asset.max_attempts)
        && asset.next_retry_at
      ) {
        return res.status(202).json({
          ok: true,
          waitingRetry: true,
          retryAfterMs: Math.max(0, new Date(asset.next_retry_at).getTime() - Date.now()),
          asset,
          run,
        });
      }
      return res.status(409).json({
        error: "Asset job is not processable",
        code: "ASSET_JOB_CONFLICT",
        asset,
        run,
      });
    }
    job = rows[0];
    const run = await fetchRun(sql, job.run_id);
    if (!run || !["generating_assets", "validating_assets"].includes(run.status)) throw Object.assign(new Error("Parent design run is not in the asset stage"), { code: "RUN_STAGE_CONFLICT", statusCode: 409 });
    const request = job.request_snapshot || {};
    const image = await generateSectionImage({
      prompt: request.prompt, safeArea: request.safeArea || "none",
      backgroundColor: run.inputSnapshot?.design?.backgroundColor,
      aspectRatio: request.aspectRatio || run.constraintsSnapshot?.imageAspectRatio,
      effectiveAspectRatio: request.aspectRatio || run.constraintsSnapshot?.imageAspectRatio,
      targetType: job.target_type,
      keyVisualTextPolicy: request.keyVisualTextPolicy,
      provider: request.promptConfig?.provider,
      model: request.promptConfig?.model,
      modelOptions: request.promptConfig?.modelOptions,
      promptConfig: request.promptConfig,
    });
    const minimumByteLength = Number(request.promptConfig?.validationPolicy?.minimumByteLength || 1024);
    if (image.bytes.length < minimumByteLength) {
      throw Object.assign(new Error(`Generated image is below the minimum byte length ${minimumByteLength}`), {
        code: "IMAGE_VALIDATION_FAILED",
      });
    }
    const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType === "image/webp" ? "webp" : "png";
    const targetKey = job.target_type === "item" ? job.target_item_key : `${run.sectionKey}-background`;
    const storageKey = `section-ai/${run.id}/${targetKey}-${Date.now()}.${extension}`;
    const { put } = await import("@vercel/blob");
    const blob = await put(storageKey, image.bytes, { access: "private", contentType: image.mimeType });
    const result = {
      target: {
        type: job.target_type, sectionKey: run.sectionKey, itemKey: job.target_item_key || null,
        componentInstanceId: job.component_instance_id || null,
        fieldKey: job.target_field_key || null,
      },
      targetFieldKey: job.target_field_key || null,
      storageKey, assetUrl: blob.url, proxyUrl: `/api/promo-section-design-asset-image?jobId=${encodeURIComponent(jobId)}`,
      mimeType: image.mimeType, width: image.width, height: image.height,
      safeArea: request.safeArea || "none", backgroundColor: run.inputSnapshot?.design?.backgroundColor,
      renderPolicy: request.effectiveRenderPolicy || null,
      sourceGeometry: request.sourceGeometry || null,
      effectiveGeometry: request.effectiveGeometry || null,
      requested: {
        tier: request.promptConfig?.generationPolicy?.requestedTier
          || request.promptConfig?.modelOptions?.imageSize
          || null,
        aspectRatio: request.aspectRatio || null,
        mimeType: request.promptConfig?.generationPolicy?.outputMimeType
          || request.promptConfig?.runtimeConfig?.outputMimeType
          || null,
      },
      actual: {
        width: image.width,
        height: image.height,
        aspectRatio: Number((image.width / image.height).toFixed(4)),
        mimeType: image.mimeType,
        byteLength: image.bytes.length,
      },
      validation: { passed: true, warnings: [] },
      provider: image.provider, usage: image.usage,
    };
    await sql`
      update promo_section_design_asset_jobs set status = 'ready', result_snapshot = ${JSON.stringify(result)}::jsonb,
        provider_request_id = ${image.provider?.requestId || null}, storage_key = ${storageKey},
        lease_token = null, lease_expires_at = null, heartbeat_at = now(), next_retry_at = null,
        completed_at = now(), updated_at = now()
      where id = ${jobId}::uuid and status = 'processing' and lease_token = ${leaseToken}::uuid
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
    let retryDelayMs = 0;
    const providerStatus = Number(error.statusCode || 0);
    const retryableProviderError = (
      providerStatus === 0
      || providerStatus === 404
      || providerStatus === 408
      || providerStatus === 409
      || providerStatus === 425
      || providerStatus === 429
      || providerStatus >= 500
      || error.code === "PROVIDER_TIMEOUT"
    );
    const errorCode = providerStatus === 404
      ? "PROVIDER_ENTITY_NOT_FOUND"
      : error.code || "SECTION_ASSET_FAILED";
    if (job) {
      const runtime = job.request_snapshot?.promptConfig?.runtimeConfig || {};
      const retryBaseMs = Math.max(0, Number(runtime.retryBaseMs || 15000));
      const retryMaxMs = Math.max(retryBaseMs, Number(runtime.retryMaxMs || 75000));
      retryDelayMs = Math.min(retryMaxMs, retryBaseMs * Math.max(1, Number(job.current_attempt || 1)));
      await sql`
      update promo_section_design_asset_jobs set status = 'failed', error_code = ${errorCode},
        error_message = ${error.message}, failure_stage = 'provider',
        lease_token = null, lease_expires_at = null, heartbeat_at = now(),
        next_retry_at = case when current_attempt < max_attempts
          then now() + ${retryDelayMs} * interval '1 millisecond' else null end,
        completed_at = now(), updated_at = now()
      where id = ${jobId}::uuid and status = 'processing' and lease_token = ${leaseToken}::uuid
      `.catch(() => null);
    }
    const hasRetry = Boolean(job && Number(job.current_attempt || 0) < Number(job.max_attempts || 0));
    const retryable = retryableProviderError && hasRetry;
    const responseStatus = retryable
      ? 503
      : providerStatus >= 400 && providerStatus < 500
        ? providerStatus
        : 502;
    return res.status(responseStatus).json({
      error: "Section design asset generation failed",
      message: error.message,
      code: errorCode,
      retryable,
      retryAfterMs: retryable ? retryDelayMs : 0,
      provider: {
        name: job?.request_snapshot?.promptConfig?.provider || "",
        model: job?.request_snapshot?.promptConfig?.model || "",
      },
    });
  }
};
