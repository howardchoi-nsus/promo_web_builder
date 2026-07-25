const { getSql, fetchTokenSetUsage } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const tokenSetId = String(req.query.tokenSetId || "").trim();
    if (!tokenSetId) return res.status(400).json({ error: "tokenSetId is required" });
    return res.status(200).json({ ok: true, usage: await fetchTokenSetUsage(getSql(), tokenSetId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token usage API failed", message: error.message });
  }
};
