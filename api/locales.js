const {
  getSql, parseBody, normalizeBoolean, fetchLocales, createLocale, updateLocale,
} = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  try {
    const sql = getSql();
    if (req.method === "GET") {
      const includeDisabled = normalizeBoolean(req.query.includeDisabled, false);
      return res.status(200).json({ ok: true, locales: await fetchLocales(sql, { includeDisabled }) });
    }
    if (req.method === "POST") {
      return res.status(201).json({ ok: true, locale: await createLocale(sql, parseBody(req.body)) });
    }
    if (req.method === "PATCH") {
      return res.status(200).json({ ok: true, locale: await updateLocale(sql, parseBody(req.body)) });
    }
    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale API failed", message: error.message });
  }
};
