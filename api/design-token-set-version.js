const crypto = require("node:crypto");
const {
  getSql, parseBody, fetchTokenDefinitions, fetchTokenVersion, normalizeTokenEntries,
  isDarkOnlyTokenSet, normalizeDarkOnlyTokenEntries,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const versionId = String(body.versionId || "").trim();
    if (!versionId || !Array.isArray(body.tokens)) {
      return res.status(400).json({ error: "versionId and tokens are required" });
    }
    const sql = getSql();
    const setRows = await sql`
      select token_set.set_key, token_set.name, token_set.status
      from promo_design_token_set_versions version
      join promo_design_token_sets token_set on token_set.id = version.token_set_id
      where version.id = ${versionId}::uuid
      limit 1
    `;
    if (!setRows.length || setRows[0].status !== "active") {
      return res.status(409).json({ error: "Only active design token sets can be edited" });
    }
    const definitions = await fetchTokenDefinitions(sql);
    const inputTokens = isDarkOnlyTokenSet(setRows[0])
      ? normalizeDarkOnlyTokenEntries(body.tokens)
      : body.tokens;
    const { normalized, errors } = normalizeTokenEntries(inputTokens, definitions);
    if (errors.length) return res.status(422).json({ error: "Design token validation failed", errors });
    const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    await sql`
      select replace_promo_design_token_draft_values(
        ${versionId}::uuid,
        ${JSON.stringify(normalized)}::jsonb,
        ${String(body.sourceName || "")},
        ${hash},
        ${String(body.changeNote || "Design token draft updated.")},
        'draft_updated'
      )
    `;
    return res.status(200).json({ ok: true, tokenSet: await fetchTokenVersion(sql, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token draft update failed", message: error.message });
  }
};
