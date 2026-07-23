const { getSql, parseBody, fetchTokenVersion } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const body = parseBody(req.body);
    const versionId = String(body.versionId || "").trim();
    if (!versionId) return res.status(400).json({ error: "versionId is required" });
    const sql = getSql();
    const rows = await sql`select token_set_id::text, status from promo_design_token_set_versions where id = ${versionId}::uuid limit 1`;
    if (!rows.length) return res.status(404).json({ error: "Token set version not found" });
    const required = await sql`
      select definition.token_key from promo_design_token_definitions definition
      where definition.required = true and not exists (
        select 1 from promo_design_token_values value where value.token_set_version_id = ${versionId}::uuid and value.token_key = definition.token_key
      )
    `;
    if (required.length) return res.status(422).json({ error: "Required tokens are missing", tokenKeys: required.map((row) => row.token_key) });
    await sql`update promo_design_token_set_versions set status = 'inactive', updated_at = now() where token_set_id = ${rows[0].token_set_id}::uuid and status = 'active'`;
    await sql`update promo_design_token_set_versions set status = 'active', updated_at = now() where id = ${versionId}::uuid`;
    return res.status(200).json({ ok: true, tokenSet: await fetchTokenVersion(sql, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token activation failed", message: error.message });
  }
};
