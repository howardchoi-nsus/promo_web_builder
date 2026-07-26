const crypto = require("node:crypto");
const {
  getSql, parseBody, parseCsvRows, normalizeTokenEntries,
  fetchTokenDefinitions, fetchTokenVersion,
} = require("./_design-token-store");
const { normalizeDefinitions } = require("./design-token-catalog-import");

function sourceRowMetadata(row) {
  return {
    category: String(row.category || "").trim(),
    categoryLabel: String(row.category_label || row.categoryLabel || "").trim(),
    label: String(row.label || "").trim(),
    type: String(row.type || row.valueType || "").trim(),
    unit: String(row.unit || "").trim(),
    themeable: /^true$/i.test(String(row.themeable || "").trim()),
    cardinality: String(row.cardinality || "single").trim() || "single",
    cssProperties: String(row.css_properties || row.cssProperties || row.cssProperty || "")
      .split(";").map((item) => item.trim()).filter(Boolean),
  };
}

function tokenFromCsvRow(row, activeTheme) {
  const valueLight = String(row.value_light || row.valueLight || row.value || "").trim();
  const valueDark = String(row.value_dark || row.valueDark || "").trim();
  return {
    tokenKey: String(row.token || row.token_key || row.tokenKey || "").trim(),
    valueIndex: Math.max(0, Number.parseInt(row.value_index ?? row.valueIndex ?? 0, 10) || 0),
    value: activeTheme === "light" ? (valueLight || valueDark) : (valueDark || valueLight),
    valueLight,
    valueDark,
    activeTheme,
    metadata: sourceRowMetadata(row),
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    const csvRows = Array.isArray(body.tokens) ? [] : parseCsvRows(body.csvText);
    const activeTheme = String(body.activeTheme || "dark").trim() === "light" ? "light" : "dark";
    const tokens = Array.isArray(body.tokens)
      ? body.tokens
      : csvRows.map((row) => tokenFromCsvRow(row, activeTheme));
    if (!tokenSetId || !tokens.length) return res.status(400).json({ error: "tokenSetId and tokens are required" });
    const sql = getSql();
    const catalog = csvRows.length ? normalizeDefinitions(csvRows) : { definitions: [], errors: [] };
    if (catalog.errors.length) {
      return res.status(422).json({ error: "Design token catalog validation failed", errors: catalog.errors });
    }
    if (body.registerCatalog === true && body.dryRun !== true) {
      for (const definition of catalog.definitions) {
        await sql`
          insert into promo_design_token_definitions (
            token_key, category, category_label, label, value_type, semantic_role,
            css_property, css_properties, unit, themeable, cardinality, source_metadata,
            allowed_values, required, ai_selectable, editable
          ) values (
            ${definition.tokenKey}, ${definition.category}, ${definition.categoryLabel}, ${definition.label},
            ${definition.valueType}, ${definition.semanticRole}, ${definition.cssProperty},
            ${JSON.stringify(definition.cssProperties)}::jsonb, ${definition.unit},
            ${definition.themeable}, ${definition.cardinality},
            ${JSON.stringify(definition.sourceMetadata)}::jsonb,
            ${JSON.stringify(definition.allowedValues)}::jsonb, ${definition.required},
            ${definition.aiSelectable}, ${definition.editable}
          ) on conflict (token_key) do update set
            category = excluded.category, category_label = excluded.category_label,
            label = excluded.label, value_type = excluded.value_type,
            semantic_role = excluded.semantic_role, css_property = excluded.css_property,
            css_properties = excluded.css_properties, unit = excluded.unit,
            themeable = excluded.themeable, cardinality = excluded.cardinality,
            source_metadata = excluded.source_metadata, allowed_values = excluded.allowed_values,
            required = excluded.required, ai_selectable = excluded.ai_selectable,
            editable = excluded.editable
        `;
      }
    }
    const definitions = await fetchTokenDefinitions(sql);
    const previewDefinitions = body.dryRun === true
      ? [
        ...definitions,
        ...catalog.definitions.map((definition) => ({
          token_key: definition.tokenKey,
          value_type: definition.valueType,
          css_property: definition.cssProperty,
          css_properties: definition.cssProperties,
          allowed_values: definition.allowedValues,
          required: definition.required,
        })),
      ]
      : definitions;
    const { normalized, errors } = normalizeTokenEntries(tokens, previewDefinitions);
    if (errors.length || body.dryRun === true) return res.status(errors.length ? 422 : 200).json({
      ok: errors.length === 0,
      dryRun: true,
      tokenCount: normalized.length,
      activeTheme,
      definitionCount: catalog.definitions.length,
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

module.exports.sourceRowMetadata = sourceRowMetadata;
module.exports.tokenFromCsvRow = tokenFromCsvRow;
