const { getSql, parseBody, activateDraft } = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const id = String(body.id || "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });
    const message = await activateDraft(getSql(), id, body);
    return res.status(200).json({ ok: true, message });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale message activation failed", message: error.message });
  }
};
