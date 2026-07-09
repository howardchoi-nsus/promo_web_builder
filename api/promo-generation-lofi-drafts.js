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

const MAX_DRAFT_IMAGE_BYTES = 24 * 1024 * 1024;

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
      sql,
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
  let draftImageUrl = body.draftImageUrl || body.draft_image_url || "";
  try {
    const imageInput = resolveDraftImageInput(body);
    if (imageInput) {
      if (imageInput.bytes.length > MAX_DRAFT_IMAGE_BYTES) {
        return res.status(413).json({ error: "Draft image is too large", maxBytes: MAX_DRAFT_IMAGE_BYTES });
      }
      const { put } = await import("@vercel/blob");
      const storageKey = `promo-generation/lofi-drafts/${draftId}/${Date.now()}.${extensionForMime(imageInput.mimeType)}`;
      const blobAccess = String(process.env.BLOB_ACCESS || "private").toLowerCase() === "public" ? "public" : "private";
      const blob = await put(storageKey, imageInput.bytes, {
        access: blobAccess,
        contentType: imageInput.mimeType,
      });
      draftImageUrl = blob.url;
    }
  } catch (error) {
    if (error instanceof InvalidDraftImageInputError) {
      return res.status(400).json({
        error: "Invalid draft image data",
        message: error.message,
      });
    }
    throw error;
  }

  const rows = await sql`
    update promo_generation_lofi_drafts
    set
      status = ${status},
      draft_image_url = ${draftImageUrl},
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

function resolveDraftImageInput(body) {
  const imageDataUrl = String(body.draftImageDataUrl || body.draft_image_data_url || body.imageDataUrl || "").trim();
  if (imageDataUrl) {
    const match = /^data:([^;]+);base64,(.+)$/i.exec(imageDataUrl);
    if (!match) throw new InvalidDraftImageInputError("draftImageDataUrl must be a base64 data URL");
    const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
    return {
      bytes,
      mimeType: validateDraftImageBytes(bytes, match[1]),
    };
  }

  const rawBase64 = String(
    body.draftImageBase64 ||
    body.draft_image_base64 ||
    body.b64Json ||
    body.b64_json ||
    body.imageBase64 ||
    ""
  ).trim();
  if (!rawBase64) return null;

  const bytes = Buffer.from(rawBase64.replace(/\s/g, ""), "base64");
  return {
    bytes,
    mimeType: validateDraftImageBytes(bytes, body.mimeType || body.mime_type),
  };
}

class InvalidDraftImageInputError extends Error {}

function validateDraftImageBytes(bytes, declaredMimeType = "") {
  const mimeType = detectDraftImageMimeType(bytes);
  if (!mimeType) {
    const byteLength = Buffer.isBuffer(bytes) ? bytes.length : 0;
    throw new InvalidDraftImageInputError(
      `Draft image payload is not a valid PNG, JPEG, or WebP. bytes=${byteLength}`,
    );
  }

  const declared = String(declaredMimeType || "").split(";")[0].trim().toLowerCase();
  if (declared && declared.startsWith("image/") && !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(declared)) {
    throw new InvalidDraftImageInputError(`Unsupported draft image MIME type: ${declaredMimeType}`);
  }

  return mimeType;
}

function detectDraftImageMimeType(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 16) return "";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return "";
}

function extensionForMime(mimeType) {
  if (/jpe?g/i.test(mimeType)) return "jpg";
  if (/webp/i.test(mimeType)) return "webp";
  return "png";
}
