const { getSql, parseBody, fetchRun, transitionRun } = require("./_promo-section-design-store");
const { generateSectionImage } = require("./_promo-section-design-provider");

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
    if (!run) return res.status(404).json({ error: "Section design run not found" });
    if (run.status === "ready" || run.status === "applied") return res.status(200).json({ ok: true, run });
    const request = run.layoutResult?.imageRequest;
    if (!request) return res.status(409).json({ error: "Section design run has no generated image request", run });
    if (run.status === "failed") {
      run = await transitionRun(sql, id, ["failed"], "generating_assets", { incrementAttempt: true, clearCompletedAt: true });
      if (!run) return res.status(409).json({ error: "Image retry was claimed by another request" });
    } else if (run.status !== "generating_assets") {
      return res.status(409).json({ error: "Section design image stage is not ready", run });
    }
    run = await transitionRun(sql, id, ["generating_assets"], "validating_assets");
    if (!run) return res.status(409).json({ error: "Section design image stage was claimed by another request" });

    const snapshot = run.inputSnapshot || {};
    const section = snapshot.section || {};
    const promptConfig = run.promptSnapshot?.promptConfig || {};
    const image = await generateSectionImage({
      prompt: request.prompt,
      safeArea: request.safeArea,
      backgroundColor: snapshot.design?.backgroundColor,
      aspectRatio: request.aspectRatio || run.constraintsSnapshot?.imageAspectRatio,
      targetType: request.target?.type || "section-background",
      keyVisualTextPolicy: request.keyVisualTextPolicy
        || snapshot.design?.keyVisualTextPolicy,
      provider: promptConfig.provider,
      model: promptConfig.model,
      modelOptions: promptConfig.modelOptions,
      promptConfig,
    });
    if (image.bytes.length < 1024) throw Object.assign(new Error("Generated image is too small"), { code: "IMAGE_VALIDATION_FAILED" });
    const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType === "image/webp" ? "webp" : "png";
    const target = request.target || { type: "item", sectionKey: section.sectionKey, itemKey: request.itemKey };
    const targetKey = target.type === "item" ? target.itemKey : `${target.sectionKey}-background`;
    const storageKey = `section-ai/${id}/${targetKey}-${Date.now()}.${extension}`;
    const { put } = await import("@vercel/blob");
    const blob = await put(storageKey, image.bytes, { access: "private", contentType: image.mimeType });
    const imageResult = {
      target,
      itemKey: target.type === "item" ? target.itemKey : null,
      storageKey,
      assetUrl: blob.url,
      proxyUrl: `/api/promo-section-design-image?runId=${encodeURIComponent(id)}`,
      mimeType: image.mimeType,
      width: image.width,
      height: image.height,
      safeArea: request.safeArea,
      backgroundColor: snapshot.design?.backgroundColor,
    };
    run = await transitionRun(sql, id, ["validating_assets"], "ready", {
      imageResult,
      providerSnapshot: { ...run.providerSnapshot, image: image.provider },
      usageSnapshot: { ...run.usageSnapshot, image: image.usage },
    });
    return res.status(200).json({ ok: true, run });
  } catch (error) {
    console.error("[section-design-image] processing failed", { runId: id, code: error.code || "SECTION_IMAGE_FAILED", message: error.message, stack: error.stack });
    if (sql) {
      run = await fetchRun(sql, id).catch(() => run);
      if (run && ["generating_assets", "validating_assets"].includes(run.status)) {
        run = await transitionRun(sql, id, [run.status], "failed", {
          errorCode: error.code || "SECTION_IMAGE_FAILED",
          errorMessage: error.message,
        }) || run;
      }
    }
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Section image generation failed",
      message: error.message,
      run,
    });
  }
};
