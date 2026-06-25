const { neon } = require("@neondatabase/serverless");

function groupTokens(tokens) {
  const byDocument = new Map();
  for (const token of tokens) {
    const key = token.document_id;
    if (!byDocument.has(key)) byDocument.set(key, { colors: [], fonts: [], tokenCount: 0 });
    const bucket = byDocument.get(key);
    bucket.tokenCount += 1;
    if (token.token_type === "color" && bucket.colors.length < 8) bucket.colors.push(token.token_value);
    if (token.token_type === "typography" && bucket.fonts.length < 4) bucket.fonts.push(token.token_value);
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

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  if (!databaseUrl) {
    res.status(500).json({ error: "DATABASE_URL is not configured" });
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const documents = await sql`
      select
        d.id::text as id,
        d.brand_id::text as brand_id,
        b.name as brand_name,
        b.slug as slug,
        d.original_filename,
        d.raw_markdown,
        d.status,
        d.updated_at
      from design_documents d
      join brands b on b.id = d.brand_id
      where d.source_type = 'markdown_seed'
      order by b.name asc
    `;

    const documentIds = documents.map((doc) => doc.id);
    if (!documentIds.length) {
      res.status(200).json({ documents: [] });
      return;
    }

    const tokens = await sql`
      select
        document_id::text as document_id,
        token_type,
        token_value
      from design_tokens
      where document_id::text = any(${documentIds})
      order by created_at asc
    `;

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
    const sectionsByDocument = groupSections(sections);

    res.status(200).json({
      documents: documents.map((doc) => {
        const tokenSummary = tokensByDocument.get(doc.id) || { colors: [], fonts: [], tokenCount: 0 };
        const headings = sectionsByDocument.get(doc.id) || [];
        return {
          id: doc.id,
          brandId: doc.brand_id,
          brandName: doc.brand_name,
          slug: doc.slug,
          sourceName: doc.original_filename,
          status: doc.status,
          updatedAt: doc.updated_at ? new Date(doc.updated_at).toISOString().slice(0, 16).replace("T", " ") : "",
          markdown: doc.raw_markdown || "",
          summary: {
            headings,
            colors: tokenSummary.colors,
            fonts: tokenSummary.fonts.length ? tokenSummary.fonts : ["Pretendard, Arial, sans-serif"],
            categories: Array.from(new Set(headings.map((item) => item.category))).filter(Boolean),
            sectionCount: headings.length,
            tokenCount: tokenSummary.tokenCount,
          },
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to load design documents" });
  }
};
