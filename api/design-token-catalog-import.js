const {
  getSql, parseBody, parseCsvRows, VALUE_TYPES, SAFE_CSS_PROPERTIES, fetchTokenDefinitions,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const definitions = await fetchTokenDefinitions(getSql());
      return res.status(200).json({
        ok: true,
        definitions: definitions.map((definition) => ({
          tokenKey: definition.token_key,
          category: definition.category,
          valueType: definition.value_type,
          semanticRole: definition.semantic_role,
          cssProperty: definition.css_property,
          allowedValues: definition.allowed_values || [],
          required: Boolean(definition.required),
          aiSelectable: Boolean(definition.ai_selectable),
          editable: Boolean(definition.editable),
        })),
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: "Design token catalog API failed", message: error.message });
    }
  }
  if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const body = parseBody(req.body);
    const rows = Array.isArray(body.definitions) ? body.definitions : parseCsvRows(body.csvText);
    if (!rows.length) return res.status(400).json({ error: "definitions or csvText is required" });
    const errors = [];
    const normalized = rows.map((row, index) => {
      const tokenKey = String(row.tokenKey || row.token || row.token_key || "").trim();
      const valueType = String(row.valueType || row.type || "").trim();
      const cssProperty = String(row.cssProperty || row.css_properties || "").split(";")[0].trim();
      if (!/^--promo-[a-z0-9-]+$/.test(tokenKey)) errors.push({ index, tokenKey, message: "Only the --promo-* namespace is allowed" });
      if (!VALUE_TYPES.includes(valueType)) errors.push({ index, tokenKey, message: "Unsupported value type" });
      if (!SAFE_CSS_PROPERTIES.has(cssProperty)) errors.push({ index, tokenKey, message: "CSS property is not allowed" });
      return {
        tokenKey, category: String(row.category || "general"), valueType,
        semanticRole: String(row.semanticRole || row.semantic_role || row.category || "general"), cssProperty,
        allowedValues: Array.isArray(row.allowedValues) ? row.allowedValues : [],
        required: row.required === true || row.required === "true",
        aiSelectable: row.aiSelectable === true || row.ai_selectable === "true",
        editable: row.editable !== false && row.editable !== "false",
      };
    });
    if (errors.length || body.dryRun === true) return res.status(errors.length ? 422 : 200).json({ ok: !errors.length, dryRun: true, definitionCount: normalized.length, errors });
    const sql = getSql();
    for (const definition of normalized) {
      await sql`
        insert into promo_design_token_definitions (
          token_key, category, value_type, semantic_role, css_property, allowed_values,
          required, ai_selectable, editable
        ) values (
          ${definition.tokenKey}, ${definition.category}, ${definition.valueType}, ${definition.semanticRole},
          ${definition.cssProperty}, ${JSON.stringify(definition.allowedValues)}::jsonb, ${definition.required},
          ${definition.aiSelectable}, ${definition.editable}
        ) on conflict (token_key) do update set category = excluded.category, value_type = excluded.value_type,
          semantic_role = excluded.semantic_role, css_property = excluded.css_property,
          allowed_values = excluded.allowed_values, required = excluded.required,
          ai_selectable = excluded.ai_selectable, editable = excluded.editable
      `;
    }
    return res.status(200).json({ ok: true, definitionCount: normalized.length });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token catalog import failed", message: error.message });
  }
};
