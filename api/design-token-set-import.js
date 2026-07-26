const crypto = require("node:crypto");
const {
  getSql, parseBody, parseCsvRows, normalizeTokenEntries,
  fetchTokenDefinitions, fetchTokenVersion,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    const tokens = Array.isArray(body.tokens) ? body.tokens : parseCsvRows(body.csvText).map((row) => ({
      tokenKey: row.token || row.token_key,
      value: row.value || row.value_light,
      metadata: { category: row.category || "", label: row.label || "" },
    }));
    if (!tokenSetId || !tokens.length) return res.status(400).json({ error: "tokenSetId and tokens are required" });
    const sql = getSql();
    const definitions = await fetchTokenDefinitions(sql);
    const { normalized, errors } = normalizeTokenEntries(tokens, definitions);
    if (errors.length || body.dryRun === true) return res.status(errors.length ? 422 : 200).json({
      ok: errors.length === 0,
      dryRun: true,
      tokenCount: normalized.length,
      tokens: normalized,
      errors,
    });
    const setRows = await sql`select id::text from promo_design_token_sets where id = ${tokenSetId}::uuid and status = 'active' limit 1`;
    if (!setRows.length) return res.status(404).json({ error: "Active token set not found" });
    const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    const existingDraft = await sql`
      select id::text from promo_design_token_set_versions
      where token_set_id = ${tokenSetId}::uuid and status = 'draft'
      order by version desc limit 1
    `;
    const changeNote = String(body.changeNote || "Token CSV imported.");
    const versionRows = existingDraft.length ? await sql`
      select replace_promo_design_token_draft_values(
        ${existingDraft[0].id}::uuid,
        ${JSON.stringify(normalized)}::jsonb,
        ${String(body.sourceName || "")},
        ${hash},
        ${changeNote},
        'imported'
      )::text as id
    ` : await sql`
      select create_promo_design_token_draft(
        ${tokenSetId}::uuid,
        null,
        ${JSON.stringify(normalized)}::jsonb,
        ${String(body.sourceName || "")},
        ${hash},
        ${changeNote},
        'imported'
      )::text as id
    `;
    const versionId = versionRows[0].id;
    return res.status(201).json({ ok: true, tokenSet: await fetchTokenVersion(sql, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token import failed", message: error.message });
  }
};
