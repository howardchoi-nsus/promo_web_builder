const {
  getSql, parseBody, parseCsvRows, VALUE_TYPES, SAFE_CSS_PROPERTIES,
  TOKEN_KEY_PATTERN, fetchTokenDefinitions,
} = require("./_design-token-store");

function truthy(value) {
  return value === true || /^true$/i.test(String(value || "").trim());
}

function normalizeDefinitions(rows) {
  const errors = [];
  const byKey = new Map();
  rows.forEach((row, index) => {
    const tokenKey = String(row.tokenKey || row.token || row.token_key || "").trim();
    const valueType = String(row.valueType || row.type || "").trim();
    const cssProperties = String(row.cssProperties || row.css_properties || row.cssProperty || "")
      .split(";").map((item) => item.trim()).filter(Boolean);
    const cardinality = String(row.cardinality || "single").trim() === "list" ? "list" : "single";
    if (!TOKEN_KEY_PATTERN.test(tokenKey)) errors.push({ index, tokenKey, message: "Only --promo-* and --app-* namespaces are allowed" });
    if (!VALUE_TYPES.includes(valueType)) errors.push({ index, tokenKey, message: "Unsupported value type" });
    if (!cssProperties.length || cssProperties.some((property) => !SAFE_CSS_PROPERTIES.has(property))) {
      errors.push({ index, tokenKey, message: "CSS property is not allowed" });
    }
    const normalized = {
      tokenKey,
      category: String(row.category || "general").trim() || "general",
      categoryLabel: String(row.categoryLabel || row.category_label || "").trim(),
      label: String(row.label || row.semanticRole || row.semantic_role || row.category || "general").trim(),
      valueType,
      semanticRole: String(row.semanticRole || row.semantic_role || row.label || row.category || "general").trim(),
      cssProperty: cssProperties[0] || "",
      cssProperties,
      unit: String(row.unit || "").trim(),
      themeable: truthy(row.themeable),
      cardinality,
      allowedValues: Array.isArray(row.allowedValues) ? row.allowedValues : [],
      required: truthy(row.required),
      aiSelectable: truthy(row.aiSelectable ?? row.ai_selectable),
      editable: row.editable !== false && String(row.editable || "").toLowerCase() !== "false",
      sourceMetadata: {
        categoryLabel: String(row.category_label || row.categoryLabel || "").trim(),
        label: String(row.label || "").trim(),
        unit: String(row.unit || "").trim(),
        themeable: truthy(row.themeable),
        cardinality,
      },
    };
    const existing = byKey.get(tokenKey);
    if (existing && (existing.valueType !== normalized.valueType
      || existing.cardinality !== normalized.cardinality
      || JSON.stringify(existing.cssProperties) !== JSON.stringify(normalized.cssProperties))) {
      errors.push({ index, tokenKey, message: "Repeated token definitions must use the same type, cardinality, and CSS properties" });
    } else if (!existing) {
      byKey.set(tokenKey, normalized);
    }
  });
  return { definitions: [...byKey.values()], errors };
}

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
          cssProperties: Array.isArray(definition.css_properties) && definition.css_properties.length
            ? definition.css_properties
            : [definition.css_property].filter(Boolean),
          categoryLabel: definition.category_label || "",
          label: definition.label || "",
          unit: definition.unit || "",
          themeable: Boolean(definition.themeable),
          cardinality: definition.cardinality || "single",
          sourceMetadata: definition.source_metadata || {},
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
    const { definitions: normalized, errors } = normalizeDefinitions(rows);
    if (errors.length || body.dryRun === true) return res.status(errors.length ? 422 : 200).json({ ok: !errors.length, dryRun: true, definitionCount: normalized.length, errors });
    const sql = getSql();
    for (const definition of normalized) {
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
        ) on conflict (token_key) do update set category = excluded.category, value_type = excluded.value_type,
          category_label = excluded.category_label, label = excluded.label,
          semantic_role = excluded.semantic_role, css_property = excluded.css_property,
          css_properties = excluded.css_properties, unit = excluded.unit,
          themeable = excluded.themeable, cardinality = excluded.cardinality,
          source_metadata = excluded.source_metadata,
          allowed_values = excluded.allowed_values, required = excluded.required,
          ai_selectable = excluded.ai_selectable, editable = excluded.editable
      `;
    }
    return res.status(200).json({ ok: true, definitionCount: normalized.length });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token catalog import failed", message: error.message });
  }
};

module.exports.normalizeDefinitions = normalizeDefinitions;
