const {
  getSql, canonicalizeLocale, validateMessageKey, fetchHistory,
} = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const locale = canonicalizeLocale(req.query.locale || "ko");
    const messageKey = validateMessageKey(req.query.messageKey || req.query.key);
    const versions = await fetchHistory(getSql(), locale, messageKey);
    return res.status(200).json({ ok: true, locale, messageKey, versions });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale message history failed", message: error.message });
  }
};
