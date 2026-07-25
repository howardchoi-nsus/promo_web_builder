const {
  getSql, parseBody, fetchTokenDefinitions, fetchTokenVersion, normalizeTokenEntries,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const versionId = String(body.versionId || "").trim();
    if (!versionId) return res.status(400).json({ error: "versionId is required" });
    const sql = getSql();
    const version = await fetchTokenVersion(sql, versionId);
    if (!version) return res.status(404).json({ error: "Token set version not found" });
    const definitions = await fetchTokenDefinitions(sql);
    const { errors } = normalizeTokenEntries(version.values, definitions);
    await sql`
      insert into promo_design_token_histories (
        token_set_id, token_set_version_id, action, previous_status, new_status, change_note, snapshot
      ) values (
        ${version.tokenSetId}::uuid, ${versionId}::uuid, 'validated',
        ${version.status}, ${version.status}, ${String(body.changeNote || "Design token version validated.")},
        ${JSON.stringify({ valid: errors.length === 0, errors })}::jsonb
      )
    `;
    return res.status(errors.length ? 422 : 200).json({ ok: errors.length === 0, errors });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token validation failed", message: error.message });
  }
};
