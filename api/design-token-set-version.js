const crypto = require("node:crypto");
const {
  getSql, parseBody, fetchTokenDefinitions, fetchTokenVersion, normalizeTokenEntries,
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
    const definitions = await fetchTokenDefinitions(sql);
    const { normalized, errors } = normalizeTokenEntries(body.tokens, definitions);
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
