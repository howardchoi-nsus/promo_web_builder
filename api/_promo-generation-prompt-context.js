const {
  buildDesignPromptMarkdown,
  buildPromoInputMarkdown,
} = require("./_promo-markdown-builders");

function integratedBriefVariables(run) {
  const payload = objectValue(run?.input_snapshot);
  const promo = objectValue(payload.promo);
  const md = objectValue(payload.md);
  const template = objectValue(payload.template);
  const generatedAt = safeDate(run?.created_at || run?.updated_at);
  const promptGroupId = String(run?.metadata?.promptGroupId || run?.run_key || run?.id || "");
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

  return {
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
}

function imageStageVariables(run, integratedBriefMarkdown, extra = {}) {
  const payload = objectValue(run?.input_snapshot);
  const sectionContentMapping = payload.sectionInputs || payload.sectionConfig || payload.inputSnapshot?.sectionInputs || {};
  return {
    integratedDesignBriefMarkdown: String(integratedBriefMarkdown || ""),
    sectionContentMapping: JSON.stringify(sectionContentMapping, null, 2),
    ...extra,
  };
}

function requestOrigin(req) {
  const explicit = String(process.env.APP_BASE_URL || process.env.PUBLIC_APP_URL || "").trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelHost = String(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "").trim();
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  const proto = String(req?.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = String(req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim();
  return host && /^[a-z0-9.:[\]-]+$/i.test(host) ? `${proto === "http" ? "http" : "https"}://${host}` : "";
}

function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function safeDate(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function resolveCanvasSize(payload) {
  if (payload.canvasSize || payload.canvas_size) return String(payload.canvasSize || payload.canvas_size);
  const canvas = objectValue(payload.canvas || payload.design?.canvas);
  const width = canvas.width || payload.width || payload.design?.width;
  const height = canvas.height || payload.height || payload.design?.height;
  return width && height ? `${width}x${height}` : "";
}

module.exports = {
  imageStageVariables,
  integratedBriefVariables,
  requestOrigin,
};
