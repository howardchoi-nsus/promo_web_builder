const {
  getSql, normalizeBoolean, canonicalizeLocale, validateMessageKey, fetchMessages,
} = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const locale = canonicalizeLocale(req.query.locale || "ko");
    const namespace = String(req.query.namespace || "").trim();
    if (namespace) validateMessageKey(`${namespace}.value`);
    const messages = await fetchMessages(getSql(), locale, {
      namespace,
      includeArchived: normalizeBoolean(req.query.includeArchived, false),
    });
    return res.status(200).json({ ok: true, locale, messages });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale message list failed", message: error.message });
  }
};
