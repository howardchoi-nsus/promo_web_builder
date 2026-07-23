const { getSql, fetchTokenVersion } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const versionId = String(req.query.versionId || "").trim();
    if (!versionId) return res.status(400).json({ error: "versionId is required" });
    const tokenSet = await fetchTokenVersion(getSql(), versionId);
    if (!tokenSet) return res.status(404).json({ error: "Token set version not found" });
    return res.status(200).json({ ok: true, tokenSet });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token set API failed", message: error.message });
  }
};
