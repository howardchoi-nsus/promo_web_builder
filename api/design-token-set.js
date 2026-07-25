const {
  getSql, fetchTokenVersion, fetchTokenSetUsage,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const versionId = String(req.query.versionId || "").trim();
    if (!versionId) return res.status(400).json({ error: "versionId is required" });
    const sql = getSql();
    const tokenSet = await fetchTokenVersion(sql, versionId);
    if (!tokenSet) return res.status(404).json({ error: "Token set version not found" });
    const histories = await sql`
      select id::text, token_set_version_id::text, action, previous_status, new_status,
        change_note, snapshot, created_at
      from promo_design_token_histories
      where token_set_id = ${tokenSet.tokenSetId}::uuid
      order by created_at desc limit 100
    `;
    return res.status(200).json({
      ok: true,
      tokenSet,
      usage: await fetchTokenSetUsage(sql, tokenSet.tokenSetId),
      histories: histories.map((history) => ({
        id: history.id,
        versionId: history.token_set_version_id || null,
        action: history.action,
        previousStatus: history.previous_status || null,
        newStatus: history.new_status || null,
        changeNote: history.change_note || "",
        snapshot: history.snapshot || {},
        createdAt: history.created_at,
      })),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token set API failed", message: error.message });
  }
};
