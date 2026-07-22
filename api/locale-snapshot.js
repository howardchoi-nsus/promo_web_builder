const { createHash } = require("node:crypto");
const { getSql, canonicalizeLocale, fetchSnapshot } = require("./_locale-message-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const locale = canonicalizeLocale(req.query.locale || "ko");
    const snapshot = await fetchSnapshot(getSql(), locale);
    const etag = `"${createHash("sha256").update(`${locale}:${snapshot.revision}:${snapshot.defaultLocale}:${snapshot.defaultRevision}`).digest("base64url")}"`;
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "no-cache");
    if (req.headers["if-none-match"] === etag) return res.status(304).end();
    return res.status(200).json({ ok: true, ...snapshot });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Locale snapshot failed", message: error.message });
  }
};
