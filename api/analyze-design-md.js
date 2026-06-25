module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const webhookUrl = process.env.N8N_DESIGN_MD_ANALYZE_WEBHOOK_URL || req.headers["x-n8n-analyze-webhook-url"];
  if (!webhookUrl) {
    res.status(400).json({
      error: "Missing n8n analyze webhook URL",
      message: "Set N8N_DESIGN_MD_ANALYZE_WEBHOOK_URL in Vercel or pass x-n8n-analyze-webhook-url.",
    });
    return;
  }

  const { documentId, brandName, sourceName, rawMarkdown, model } = req.body || {};
  if (!documentId || !rawMarkdown) {
    res.status(400).json({
      error: "Missing required fields",
      required: ["documentId", "rawMarkdown"],
    });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        brandName,
        sourceName,
        rawMarkdown,
        model,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : { text: await response.text() };
    res.status(response.status).json(body);
  } catch (error) {
    res.status(502).json({
      error: "n8n analyze request failed",
      message: error.message,
    });
  }
};
