const {
  getSql,
  parseBody,
  resolveRun,
  sha256,
} = require("./_promo-generation-run-store");
const {
  buildDesignPromptMarkdown,
  buildPromoInputMarkdown,
} = require("./_promo-markdown-builders");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const runId = String(body.runId || body.run_id || body.id || body.runKey || body.run_key || "").trim();
    if (!runId) return res.status(400).json({ error: "runId or runKey is required" });

    const sql = getSql();
    const run = await resolveRun(sql, runId);
    if (!run) return res.status(404).json({ error: "Generation run not found" });

    const payload = run.input_snapshot && typeof run.input_snapshot === "object" ? run.input_snapshot : {};
    if (!Object.keys(payload).length) {
      return res.status(409).json({
        error: "Generation run inputSnapshot is empty",
        runId: run.id,
        runKey: run.run_key,
      });
    }

    const promo = payload.promo || {};
    const md = payload.md || {};
    const template = payload.template || {};
    const generatedAt = resolveGeneratedAt(run, body);
    const promptGroupId = resolvePromptGroupId(run, body);
    const designPromptMarkdown = buildDesignPromptMarkdown({
      runKey: run.run_key,
      promptGroupId,
      generatedAt,
      payload,
    });
    const sectionInputLogMarkdown = buildPromoInputMarkdown({
      runKey: run.run_key,
      promptGroupId,
      generatedAt,
      payload,
      promo,
      md,
      template,
    });

    const variables = {
      runId: run.id,
      runKey: run.run_key,
      promptGroupId,
      promoTitle: promo.title || run.promo_title || "",
      selectedMd: md.brand || md.name || run.selected_md_name || "",
      selectedMdSlug: md.slug || md.id || run.selected_md_id || "",
      templateName: template.name || template.title || template.id || "",
      canvasSize: resolveCanvasSize(payload),
      pageWidth: String(payload.pageWidth || payload.page_width || template.pageWidth || template.page_width || ""),
      designPromptMarkdown,
      sectionInputLogMarkdown,
    };

    return res.status(200).json({
      ok: true,
      runId: run.id,
      runKey: run.run_key,
      inputHash: run.input_hash || "",
      generatedAt: generatedAt.toISOString(),
      promptRenderRequest: {
        type: body.promptType || body.prompt_type || "integrated_brief",
        variables,
      },
      variables,
      hashes: {
        designPromptMarkdown: sha256(designPromptMarkdown),
        sectionInputLogMarkdown: sha256(sectionInputLogMarkdown),
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Generation prepare API failed",
      message: error.message,
    });
  }
};

function resolveGeneratedAt(run, body) {
  const explicit = body.generatedAt || body.generated_at;
  const fallback = run.created_at || run.updated_at || Date.now();
  const date = new Date(explicit || fallback);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function resolvePromptGroupId(run, body) {
  const metadata = run.metadata && typeof run.metadata === "object" ? run.metadata : {};
  return String(
    body.promptGroupId ||
    body.prompt_group_id ||
    metadata.promptGroupId ||
    metadata.prompt_group_id ||
    run.run_key ||
    run.id
  ).trim();
}

function resolveCanvasSize(payload) {
  const explicit = payload.canvasSize || payload.canvas_size;
  if (explicit) return String(explicit);

  const canvas = payload.canvas || payload.design?.canvas || {};
  const width = canvas.width || payload.width || payload.design?.width;
  const height = canvas.height || payload.height || payload.design?.height;
  if (width && height) return `${width}x${height}`;

  return "";
}
