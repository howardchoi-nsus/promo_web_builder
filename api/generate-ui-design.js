export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = String(process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_URL || req.headers["x-n8n-webhook-url"] || "").trim();
  if (!webhookUrl) {
    return res.status(400).json({
      error: "Missing n8n UI design webhook URL",
      message: "Set N8N_PROMO_UI_DESIGN_WEBHOOK_URL in Vercel or pass x-n8n-webhook-url.",
    });
  }

  try {
    const requestBody = parseRequestBody(req.body);
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const promptUrl = String(requestBody.promptUrl || "").trim();
    const isPublicPromptUrl = /^https?:\/\//i.test(promptUrl)
      && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(promptUrl);

    if ((!promptUrl || !isPublicPromptUrl) && host) {
      requestBody.promptUrl = `${proto}://${host}/api/prompts/promo-ui-design-image-generation`;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json") ? await response.json() : { text: await response.text() };
    return res.status(response.status).json(responseBody);
  } catch (error) {
    return res.status(502).json({
      error: "n8n UI design request failed",
      message: error.message,
    });
  }
}

function parseRequestBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return { ...body };
  return {};
}
