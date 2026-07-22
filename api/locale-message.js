const { getSql, parseBody, saveDraft } = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const message = await saveDraft(getSql(), parseBody(req.body));
    return res.status(200).json({ ok: true, message });
  } catch (error) {
    const status = error.code === "23505" ? 409 : error.statusCode || 500;
    return res.status(status).json({ error: "Locale message draft save failed", message: error.message });
  }
};
