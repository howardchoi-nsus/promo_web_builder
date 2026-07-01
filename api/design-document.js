const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");
const { extractDesignMdData, persistDesignMdData, markExtractionFailed } = require("./_design-md-data");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isoMinute(value) {
  return value ? new Date(value).toISOString().slice(0, 16).replace("T", " ") : "";
}

module.exports = async function handler(req, res) {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    res.status(500).json({ error: "DATABASE_URL is not configured" });
    return;
  }

  const id = String(req.query.id || req.query.documentId || "").trim();
  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const sql = neon(databaseUrl);

  try {
    if (req.method === "GET") {
      const document = await loadDocument(sql, id);
      if (!document) return res.status(404).json({ error: "Design document not found" });
      return res.status(200).json({ document });
    }

    if (req.method === "PATCH") {
      const body = req.body || {};
      const markdown = String(body.rawMarkdown || body.markdown || "").trim();
      const brandName = String(body.brandName || "").trim();
      const cleanSlug = slugify(body.slug || brandName);
      const sourceName = String(body.sourceName || "").trim();

      if (!markdown) return res.status(400).json({ error: "rawMarkdown is required" });

      const currentRows = await sql`
        select d.id::text as id, d.brand_id::text as brand_id, b.name as brand_name, b.slug
        from design_documents d
        join brands b on b.id = d.brand_id
        where d.id = ${id}::uuid
        limit 1
      `;
      const current = currentRows[0];
      if (!current) return res.status(404).json({ error: "Design document not found" });

      if (brandName || cleanSlug) {
        await sql`
          update brands
          set name = ${brandName || current.brand_name},
              slug = ${cleanSlug || current.slug},
              updated_at = now()
          where id = ${current.brand_id}::uuid
        `;
      }

      await sql`
        update design_documents
        set raw_markdown = ${markdown},
            original_filename = coalesce(nullif(${sourceName}, ''), original_filename),
            status = 'extracting',
            extraction_status = 'extracting',
            extraction_error = null,
            archived_at = null,
            updated_at = now()
        where id = ${id}::uuid
      `;

      try {
        const extracted = extractDesignMdData({ markdown, brandName: brandName || current.brand_name, sourceName });
        await persistDesignMdData(sql, id, extracted);
      } catch (error) {
        await markExtractionFailed(sql, id, error);
        throw error;
      }

      const document = await loadDocument(sql, id);
      return res.status(200).json({ ok: true, document });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const action = String(body.action || "extract").trim();
      if (action !== "extract") return res.status(400).json({ error: "Unsupported action" });

      const document = await loadDocument(sql, id);
      if (!document) return res.status(404).json({ error: "Design document not found" });
      if (!document.markdown) return res.status(400).json({ error: "rawMarkdown is empty" });

      await sql`
        update design_documents
        set status = 'extracting',
            extraction_status = 'extracting',
            extraction_error = null,
            updated_at = now()
        where id = ${id}::uuid
      `;

      try {
        const extracted = extractDesignMdData({
          markdown: document.markdown,
          brandName: document.brandName,
          sourceName: document.sourceName,
        });
        await persistDesignMdData(sql, id, extracted);
      } catch (error) {
        await markExtractionFailed(sql, id, error);
        throw error;
      }

      const updated = await loadDocument(sql, id);
      return res.status(200).json({ ok: true, document: updated });
    }

    if (req.method === "DELETE") {
      await sql`
        update design_documents
        set status = 'archived',
            extraction_status = 'archived',
            archived_at = now(),
            updated_at = now()
        where id = ${id}::uuid
      `;
      return res.status(200).json({ ok: true, id, status: "archived" });
    }

    res.setHeader("Allow", "GET, PATCH, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Design document request failed" });
  }
};

async function loadDocument(sql, id) {
  const rows = await sql`
    select
      d.id::text as id,
      d.brand_id::text as brand_id,
      b.name as brand_name,
      b.slug as slug,
      d.original_filename,
      d.raw_markdown,
      d.design_concept_summary,
      d.design_concept_json,
      d.design_prompt_context,
      d.style_classification_json,
      d.analyzed_at,
      d.analysis_model,
      d.status,
      d.extraction_status,
      d.extraction_error,
      d.source_hash,
      d.updated_at
    from design_documents d
    join brands b on b.id = d.brand_id
    where d.id = ${id}::uuid
    limit 1
  `;
  const doc = rows[0];
  if (!doc) return null;

  const setRows = await sql`
    select id::text as id, version, format, dtcg_json, source_hash, extraction_model, status, error_message, extracted_at
    from design_token_sets
    where document_id = ${id}::uuid and status = 'ready'
    order by version desc
    limit 1
  `;
  const tokenSet = setRows[0] || null;
  const tokenItems = tokenSet
    ? await sql`
        select token_path, token_name, token_type, token_value, description, extensions, source_excerpt, confidence
        from design_token_items
        where token_set_id = ${tokenSet.id}::uuid
        order by token_path asc
      `
    : [];
  const metadataItems = tokenSet
    ? await sql`
        select category, key, value, source_excerpt, confidence
        from design_metadata_items
        where token_set_id = ${tokenSet.id}::uuid
        order by created_at asc
      `
    : [];
  const sections = await sql`
    select category, original_title, normalized_title, content_markdown, sort_order
    from design_sections
    where document_id = ${id}::uuid
    order by sort_order asc
  `;
  const colors = tokenItems
    .filter((item) => item.token_type === "color")
    .map((item) => normalizeTokenValue(item.token_value))
    .slice(0, 8);
  const fonts = tokenItems
    .filter((item) => item.token_type === "fontFamily" || item.token_type === "typography")
    .map((item) => normalizeTokenValue(item.token_value))
    .slice(0, 4);

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
    updatedAt: isoMinute(doc.updated_at),
    markdown: doc.raw_markdown || "",
    designConcept: {
      summary: doc.design_concept_summary || "",
      json: doc.design_concept_json || null,
      promptContext: doc.design_prompt_context || "",
      analyzedAt: isoMinute(doc.analyzed_at),
      analysisModel: doc.analysis_model || "",
    },
    styleClassification: normalizeStyleClassification(doc.style_classification_json),
    summary: {
      headings: sections.map((section) => ({
        level: 2,
        title: section.original_title || section.normalized_title || section.category,
        category: section.category,
        excerpt: (section.content_markdown || "").replace(/^#+\s+.+\n?/, "").trim().slice(0, 180),
      })),
      colors,
      fonts: fonts.length ? fonts : ["Pretendard, Arial, sans-serif"],
      categories: Array.from(new Set(sections.map((item) => item.category))).filter(Boolean),
      sectionCount: sections.length,
      tokenCount: tokenItems.length,
      metadataCount: metadataItems.length,
    },
    tokenSet: tokenSet
      ? {
          id: tokenSet.id,
          version: tokenSet.version,
          format: tokenSet.format,
          dtcgJson: tokenSet.dtcg_json || {},
          sourceHash: tokenSet.source_hash || "",
          extractionModel: tokenSet.extraction_model || "",
          status: tokenSet.status,
          extractedAt: isoMinute(tokenSet.extracted_at),
        }
      : null,
    tokenItems: tokenItems.map(normalizeTokenItem),
    metadataItems,
  };
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

function normalizeTokenItem(item) {
  return {
    tokenPath: item.token_path,
    tokenName: item.token_name,
    tokenType: item.token_type,
    tokenValue: item.token_value,
    description: item.description || "",
    extensions: item.extensions || {},
    sourceExcerpt: item.source_excerpt || "",
    confidence: item.confidence === null || item.confidence === undefined ? null : Number(item.confidence),
  };
}

function normalizeTokenValue(value) {
  if (value && typeof value === "object") {
    if (typeof value.value !== "undefined" && value.unit) return `${value.value}${value.unit}`;
    return JSON.stringify(value);
  }
  return String(value || "");
}
