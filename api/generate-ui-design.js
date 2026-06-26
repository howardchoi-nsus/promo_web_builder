export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_URL || req.headers["x-n8n-webhook-url"];
  if (!webhookUrl) {
    return res.status(400).json({
      error: "Missing n8n UI design webhook URL",
      message: "Set N8N_PROMO_UI_DESIGN_WEBHOOK_URL in Vercel or pass x-n8n-webhook-url.",
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body || {}),
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : { text: await response.text() };
    return res.status(response.status).json(body);
  } catch (error) {
    return res.status(502).json({
      error: "n8n UI design request failed",
      message: error.message,
    });
  }
}
