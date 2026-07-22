const { getSql, parseBody, setDefaultLocale } = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const locale = await setDefaultLocale(getSql(), body.code || body.locale);
    return res.status(200).json({ ok: true, locale });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Default locale update failed", message: error.message });
  }
};
