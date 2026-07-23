const crypto = require("node:crypto");
const { getSql, parseBody, SAFE_CSS_PROPERTIES, validateTokenValue, parseCsvRows, fetchTokenVersion } = require("./_design-token-store");

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
    const definitions = await sql`select * from promo_design_token_definitions order by token_key`;
    const byKey = new Map(definitions.map((definition) => [definition.token_key, definition]));
    const errors = [];
    const normalized = tokens.map((entry, index) => {
      const tokenKey = String(entry.tokenKey || entry.token_key || "").trim();
      const definition = byKey.get(tokenKey);
      if (!definition) errors.push({ index, tokenKey, message: "token is not registered in the promo catalog" });
      else if (!SAFE_CSS_PROPERTIES.has(definition.css_property)) errors.push({ index, tokenKey, message: "CSS property is not allowed" });
      else {
        const message = validateTokenValue(definition, entry.value);
        if (message) errors.push({ index, tokenKey, message });
      }
      return { tokenKey, value: String(entry.value ?? "").trim(), metadata: entry.metadata || {} };
    });
    for (const definition of definitions.filter((item) => item.required)) {
      if (!normalized.some((item) => item.tokenKey === definition.token_key)) errors.push({ tokenKey: definition.token_key, message: "required token is missing" });
    }
    if (errors.length || body.dryRun === true) return res.status(errors.length ? 422 : 200).json({ ok: errors.length === 0, dryRun: true, tokenCount: normalized.length, errors });
    const setRows = await sql`select id::text from promo_design_token_sets where id = ${tokenSetId}::uuid and status = 'active' limit 1`;
    if (!setRows.length) return res.status(404).json({ error: "Active token set not found" });
    const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    const versionRows = await sql`
      insert into promo_design_token_set_versions (token_set_id, version, status, source_name, source_hash, change_note)
      select ${tokenSetId}::uuid, coalesce(max(version), 0) + 1, 'draft', ${String(body.sourceName || "")}, ${hash}, ${String(body.changeNote || "Token CSV imported.")}
      from promo_design_token_set_versions where token_set_id = ${tokenSetId}::uuid returning id::text
    `;
    const versionId = versionRows[0].id;
    for (const token of normalized) {
      await sql`insert into promo_design_token_values (token_set_version_id, token_key, token_value, metadata) values (${versionId}::uuid, ${token.tokenKey}, ${token.value}, ${JSON.stringify(token.metadata)}::jsonb)`;
    }
    return res.status(201).json({ ok: true, tokenSet: await fetchTokenVersion(sql, versionId) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token import failed", message: error.message });
  }
};
