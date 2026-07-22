const { getSql, parseBody, rollbackVersion } = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const id = String(body.id || "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });
    return res.status(201).json({ ok: true, message: await rollbackVersion(getSql(), id, body) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale message rollback failed", message: error.message });
  }
};
