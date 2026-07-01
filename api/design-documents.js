const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

function groupTokens(tokens) {
  const byDocument = new Map();
  for (const token of tokens) {
    const key = token.document_id;
    if (!byDocument.has(key)) byDocument.set(key, { colors: [], fonts: [], tokenCount: 0 });
    const bucket = byDocument.get(key);
    bucket.tokenCount += 1;
    const value = normalizeTokenValue(token.token_value);
    if (token.token_type === "color" && bucket.colors.length < 8) bucket.colors.push(value);
    if ((token.token_type === "fontFamily" || token.token_type === "typography") && bucket.fonts.length < 4) bucket.fonts.push(value);
  }
  return byDocument;
}

function groupMetadata(items) {
  const byDocument = new Map();
  for (const item of items) {
    const key = item.document_id;
    if (!byDocument.has(key)) byDocument.set(key, []);
    byDocument.get(key).push({
      category: item.category,
      key: item.key,
      value: item.value,
      confidence: item.confidence === null || item.confidence === undefined ? null : Number(item.confidence),
    });
  }
  return byDocument;
}

function groupCounts(items, field = "document_id") {
  const byDocument = new Map();
  for (const item of items) {
    const key = item[field];
    byDocument.set(key, Number(item.count || 0));
  }
  return byDocument;
}

function groupTokenSets(items) {
  const byDocument = new Map();
  for (const item of items) {
    byDocument.set(item.document_id, {
      id: item.id,
      version: item.version,
      normalizedSchema: item.normalized_schema_json || {},
    });
  }
  return byDocument;
}

function groupSections(sections) {
  const byDocument = new Map();
  for (const section of sections) {
    const key = section.document_id;
    if (!byDocument.has(key)) byDocument.set(key, []);
    byDocument.get(key).push({
      level: 2,
      title: section.original_title || section.normalized_title || section.category,
      category: section.category,
      excerpt: (section.content_markdown || "").replace(/^#+\s+.+\n?/, "").trim().slice(0, 180),
    });
  }
  return byDocument;
}

function normalizeStyleClassification(value) {
  if (!value || typeof value !== "object") return null;
  const primaryGroup = value.primaryGroup || value.primary_group || null;
  const styleTags = Array.isArray(value.styleTags) ? value.styleTags : Array.isArray(value.style_tags) ? value.style_tags : [];
  return {
    ...value,
    primaryGroup,
    styleTags,
  };
}

function normalizeTokenValue(value) {
  if (value && typeof value === "object") {
    if (typeof value.value !== "undefined" && value.unit) return `${value.value}${value.unit}`;
    return JSON.stringify(value);
  }
  return String(value || "");
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    res.status(500).json({ error: "DATABASE_URL is not configured" });
    return;
  }

  try {
    const sql = neon(databaseUrl);
    let documents;
    try {
      documents = await sql`
        select
          d.id::text as id,
          d.brand_id::text as brand_id,
          b.name as brand_name,
          b.slug as slug,
          d.original_filename,
          d.design_concept_summary,
          d.design_concept_json,
          d.design_prompt_context,
          d.style_classification_json,
          d.analyzed_at,
          d.analysis_model,
          d.status,
          coalesce(d.extraction_status, d.status) as extraction_status,
          d.extraction_error,
          d.source_hash,
          d.updated_at
        from design_documents d
        join brands b on b.id = d.brand_id
        where d.source_type in ('markdown_seed', 'markdown_upload')
          and coalesce(d.status, '') <> 'archived'
          and d.archived_at is null
        order by b.name asc
      `;
    } catch (error) {
      if (!/style_classification_json/i.test(error.message || "")) throw error;
      documents = await sql`
        select
          d.id::text as id,
          d.brand_id::text as brand_id,
          b.name as brand_name,
          b.slug as slug,
          d.original_filename,
          d.design_concept_summary,
          d.design_concept_json,
          d.design_prompt_context,
          null::jsonb as style_classification_json,
          d.analyzed_at,
          d.analysis_model,
          d.status,
          coalesce(d.extraction_status, d.status) as extraction_status,
          d.extraction_error,
          d.source_hash,
          d.updated_at
        from design_documents d
        join brands b on b.id = d.brand_id
        where d.source_type in ('markdown_seed', 'markdown_upload')
          and coalesce(d.status, '') <> 'archived'
          and d.archived_at is null
        order by b.name asc
      `;
    }

    const documentIds = documents.map((doc) => doc.id);
    if (!documentIds.length) {
      res.status(200).json({ documents: [] });
      return;
    }

    let tokens = [];
    let latestTokenSets = [];
    try {
      latestTokenSets = await sql`
        select distinct on (document_id)
          id::text as id,
          document_id::text as document_id,
          version,
          normalized_schema_json
        from design_token_sets
        where document_id::text = any(${documentIds})
          and status = 'ready'
        order by document_id, version desc
      `;
      tokens = await sql`
        with latest as (
          select distinct on (document_id) id, document_id
          from design_token_sets
          where document_id::text = any(${documentIds})
            and status = 'ready'
          order by document_id, version desc
        )
        select
          i.document_id::text as document_id,
          i.token_type,
          i.token_value
        from design_token_items i
        join latest l on l.id = i.token_set_id
        order by i.created_at asc
      `;
    } catch (error) {
      latestTokenSets = [];
      tokens = [];
    }

    if (!tokens.length) {
      tokens = await sql`
        select
          document_id::text as document_id,
          token_type,
          token_value
        from design_tokens
        where document_id::text = any(${documentIds})
        order by created_at asc
      `;
    }

    let metadata = [];
    try {
      metadata = await sql`
        with latest as (
          select distinct on (document_id) id, document_id
          from design_token_sets
          where document_id::text = any(${documentIds})
            and status = 'ready'
          order by document_id, version desc
        )
        select
          m.document_id::text as document_id,
          m.category,
          m.key,
          m.value,
          m.confidence
        from design_metadata_items m
        join latest l on l.id = m.token_set_id
        order by m.created_at asc
      `;
    } catch (error) {
      metadata = [];
    }

    const sections = await sql`
      select
        document_id::text as document_id,
        category,
        original_title,
        normalized_title,
        content_markdown,
        sort_order
      from design_sections
      where document_id::text = any(${documentIds})
      order by sort_order asc
    `;

    const tokensByDocument = groupTokens(tokens);
    const tokenSetsByDocument = groupTokenSets(latestTokenSets);
    const sectionsByDocument = groupSections(sections);
    const metadataByDocument = groupMetadata(metadata);
    let componentCounts = new Map();
    let layoutCounts = new Map();
    let guidelineCounts = new Map();
    try {
      const componentRows = await sql`
        select document_id::text as document_id, count(*)::int as count
        from design_component_patterns
        where document_id::text = any(${documentIds})
        group by document_id
      `;
      const layoutRows = await sql`
        select document_id::text as document_id, count(*)::int as count
        from design_layout_patterns
        where document_id::text = any(${documentIds})
        group by document_id
      `;
      const guidelineRows = await sql`
        select document_id::text as document_id, count(*)::int as count
        from design_guideline_items
        where document_id::text = any(${documentIds})
        group by document_id
      `;
      componentCounts = groupCounts(componentRows);
      layoutCounts = groupCounts(layoutRows);
      guidelineCounts = groupCounts(guidelineRows);
    } catch (error) {
      componentCounts = new Map();
      layoutCounts = new Map();
      guidelineCounts = new Map();
    }

    res.status(200).json({
      documents: documents.map((doc) => {
        const tokenSummary = tokensByDocument.get(doc.id) || { colors: [], fonts: [], tokenCount: 0 };
        const latestTokenSet = tokenSetsByDocument.get(doc.id) || null;
        const headings = sectionsByDocument.get(doc.id) || [];
        return {
          id: doc.id,
          brandId: doc.brand_id,
          brandName: doc.brand_name,
          slug: doc.slug,
          sourceName: doc.original_filename,
          status: doc.status,
          extractionStatus: doc.extraction_status || doc.status,
          extractionError: doc.extraction_error || "",
          sourceHash: doc.source_hash || "",
          updatedAt: doc.updated_at ? new Date(doc.updated_at).toISOString().slice(0, 16).replace("T", " ") : "",
          designConcept: {
            summary: doc.design_concept_summary || "",
            json: doc.design_concept_json || null,
            promptContext: doc.design_prompt_context || "",
            analyzedAt: doc.analyzed_at ? new Date(doc.analyzed_at).toISOString().slice(0, 16).replace("T", " ") : "",
            analysisModel: doc.analysis_model || "",
          },
          styleClassification: normalizeStyleClassification(doc.style_classification_json),
          summary: {
            headings,
            colors: tokenSummary.colors,
            fonts: tokenSummary.fonts.length ? tokenSummary.fonts : ["Pretendard, Arial, sans-serif"],
            categories: Array.from(new Set(headings.map((item) => item.category))).filter(Boolean),
            sectionCount: headings.length,
            tokenCount: tokenSummary.tokenCount,
            metadataCount: (metadataByDocument.get(doc.id) || []).length,
            componentPatternCount: componentCounts.get(doc.id) || 0,
            layoutPatternCount: layoutCounts.get(doc.id) || 0,
            guidelineCount: guidelineCounts.get(doc.id) || 0,
          },
          normalizedSchema: latestTokenSet?.normalizedSchema || null,
          metadata: (metadataByDocument.get(doc.id) || []).slice(0, 12),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to load design documents" });
  }
};
