const {
  getSql, parseBody, fetchTokenDefinitions, fetchTokenVersion, normalizeTokenEntries,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const body = parseBody(req.body);
    const versionId = String(body.versionId || "").trim();
    if (!versionId) return res.status(400).json({ error: "versionId is required" });
    const sql = getSql();
    const rows = await sql`select token_set_id::text, status from promo_design_token_set_versions where id = ${versionId}::uuid limit 1`;
    if (!rows.length) return res.status(404).json({ error: "Token set version not found" });
    if (rows[0].status === "active") {
      return res.status(200).json({ ok: true, tokenSet: await fetchTokenVersion(sql, versionId) });
    }
    if (rows[0].status !== "draft") return res.status(409).json({ error: "Only draft token set versions can be activated" });
    const version = await fetchTokenVersion(sql, versionId);
    const definitions = await fetchTokenDefinitions(sql);
    const { errors } = normalizeTokenEntries(version.values, definitions);
    if (errors.length) {
      return res.status(422).json({
        error: "Design token validation failed",
        errors,
      });
    }
    await sql`
      select activate_promo_design_token_version(
        ${versionId}::uuid,
        ${String(body.changeNote || "Design token version activated.")}
      )
    `;
    return res.status(200).json({ ok: true, tokenSet: await fetchTokenVersion(sql, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token activation failed", message: error.message });
  }
};
