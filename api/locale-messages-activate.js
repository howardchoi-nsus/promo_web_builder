const { getSql, parseBody, activateDrafts } = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const messages = await activateDrafts(getSql(), body.ids, body);
    return res.status(200).json({ ok: true, messages });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale message batch activation failed", message: error.message });
  }
};
