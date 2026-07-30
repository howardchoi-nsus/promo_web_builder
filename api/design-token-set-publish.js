const crypto = require("node:crypto");
const {
  getSql, parseBody, fetchTokenDefinitions, fetchTokenVersion, normalizeTokenEntries,
  isDarkOnlyTokenSet, normalizeDarkOnlyTokenEntries,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    const sourceVersionId = String(body.sourceVersionId || "").trim();
    const workingVersionId = String(body.workingVersionId || "").trim();
    if (!tokenSetId || !Array.isArray(body.tokens)) {
      return res.status(400).json({ error: "tokenSetId and tokens are required" });
    }

    const sql = getSql();
    const setRows = await sql`
      select id::text, set_key, name, status
      from promo_design_token_sets
      where id = ${tokenSetId}::uuid
      limit 1
    `;
    if (!setRows.length || setRows[0].status !== "active") {
      return res.status(409).json({ error: "Only active design token sets can be published" });
    }
    const definitions = await fetchTokenDefinitions(sql);
    const inputTokens = isDarkOnlyTokenSet(setRows[0])
      ? normalizeDarkOnlyTokenEntries(body.tokens)
      : body.tokens;
    const { normalized, errors } = normalizeTokenEntries(inputTokens, definitions);
    if (errors.length) {
      return res.status(422).json({ error: "Design token validation failed", errors });
    }

    const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    const rows = await sql`
      select publish_promo_design_token_version(
        ${tokenSetId}::uuid,
        ${sourceVersionId || null}::uuid,
        ${workingVersionId || null}::uuid,
        ${JSON.stringify(normalized)}::jsonb,
        ${[]}::uuid[],
        ${String(body.sourceName || "")},
        ${hash},
        ${String(body.changeNote || "Design token values saved and activated.")}
      ) as result
    `;
    const result = rows[0]?.result || {};
    const versionId = String(result.tokenVersionId || result.token_version_id || "");
    return res.status(200).json({
      ok: true,
      tokenVersion: await fetchTokenVersion(sql, versionId),
      templates: Array.isArray(result.templates) ? result.templates : [],
    });
  } catch (error) {
    const validation = /Required design tokens are missing/i.test(error.message);
    const conflict = /changed|draft already exists|no longer available|not active/i.test(error.message);
    return res.status(error.statusCode || (validation ? 422 : conflict ? 409 : 500)).json({
      error: "Design token publish failed",
      message: error.message,
    });
  }
};
