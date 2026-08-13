const { getSql } = require("../_prompt-template-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rows = await getSql()`
      select id::text, type, body, status, version, provider, model, model_options
      from prompt_templates
      where type = 'image_execution'
        and status = 'active'
      limit 1
    `;
    if (!rows.length) {
      return res.status(409).json({
        error: "Active image_execution prompt is required",
        code: "PROMPT_CONFIGURATION_REQUIRED",
      });
    }
    const prompt = rows[0];
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-ui-design-image-generation",
      version: `managed-v${prompt.version}`,
      prompt: prompt.body,
      promptTemplateId: prompt.id,
      promptTemplateType: prompt.type,
      promptTemplateStatus: prompt.status,
      provider: prompt.provider || "",
      model: prompt.model || "",
      modelOptions: prompt.model_options || {},
    });
  } catch (error) {
    return res.status(error.statusCode || 503).json({
      error: "Managed prompt could not be loaded",
      message: error.message,
      code: error.code || "PROMPT_STORE_UNAVAILABLE",
    });
  }
};
