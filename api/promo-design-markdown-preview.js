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
    const body = req.body || {};
    const payload = body.payload || body;
    const generatedAt = parseDate(body.generatedAt || payload.generatedAt) || new Date();
    const runKey = String(body.runKey || payload.id || "").trim();
    const promptGroupId = String(body.promptGroupId || payload.promptGroupId || "").trim();
    const promo = payload.promo || {};
    const md = payload.md || {};
    const template = payload.template || {};

    if (!runKey) return res.status(400).json({ error: "runKey is required" });
    if (!md.brand) return res.status(400).json({ error: "payload.md.brand is required" });

    const designPromptMarkdown = buildDesignPromptMarkdown({
      runKey,
      promptGroupId,
      generatedAt,
      payload,
    });
    const sectionInputLogMarkdown = buildPromoInputMarkdown({
      runKey,
      promptGroupId,
      generatedAt,
      payload,
      promo,
      md,
      template,
    });

    return res.status(200).json({
      ...payload,
      ok: true,
      runKey,
      promptGroupId,
      designPromptMarkdown,
      sectionInputLogMarkdown,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Promo design markdown preview failed",
      message: error.message,
    });
  }
};

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
