const { parseBody } = require("./_prompt-template-store");
const { requirePromptRuntimeService } = require("./_prompt-runtime-auth");
const { validatePromoPageGenerationResult } = require("./_promo-page-generation-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    requirePromptRuntimeService(req);
    const body = parseBody(req.body);
    const validated = validatePromoPageGenerationResult(body.generated, {
      requiredVisibleCopy: body.requiredVisibleCopy,
      ctaUrl: body.ctaUrl,
      allowedUrls: body.allowedUrls,
      locale: body.locale,
      market: body.market,
    });
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({ ok: true, ...validated });
  } catch (error) {
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(error.statusCode || 500).json({
      error: "Generated promo page validation failed",
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }
};
