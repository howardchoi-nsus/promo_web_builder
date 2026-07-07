const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

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

  const id = String(req.query.id || "").trim();
  const slug = String(req.query.slug || "").trim();
  if (!id && !slug) {
    res.status(400).json({ error: "Missing id or slug" });
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const rows = id
      ? await sql`
          select
            d.id::text as id,
            coalesce(nullif(d.design_style_name, ''), b.name) as design_style_name,
            b.slug,
            d.original_filename,
            d.raw_markdown,
            d.design_token_filename,
            d.design_token_json,
            d.updated_at
          from design_documents d
          join brands b on b.id = d.brand_id
          where d.id = ${id}::uuid
            and coalesce(d.status, '') <> 'archived'
            and d.archived_at is null
          limit 1
        `
      : await sql`
          select
            d.id::text as id,
            coalesce(nullif(d.design_style_name, ''), b.name) as design_style_name,
            b.slug,
            d.original_filename,
            d.raw_markdown,
            d.design_token_filename,
            d.design_token_json,
            d.updated_at
          from design_documents d
          join brands b on b.id = d.brand_id
          where b.slug = ${slug}
            and coalesce(d.status, '') <> 'archived'
            and d.archived_at is null
          order by d.updated_at desc
          limit 1
        `;

    const doc = rows[0];
    if (!doc) return res.status(404).json({ error: "Design style not found" });

    res.status(200).json({
      designStyleId: doc.id,
      designStyleName: doc.design_style_name,
      slug: doc.slug,
      designMdFileName: doc.original_filename || "",
      designMdMarkdown: doc.raw_markdown || "",
      selectedTokenFileName: doc.design_token_filename || "",
      selectedTokens: doc.design_token_json || {},
      defaultTokens: {},
      sourcePriority: [
        "selected design token",
        "default token fallback",
        "Design MD pattern and rule reference",
        "company default",
      ],
      updatedAt: doc.updated_at ? new Date(doc.updated_at).toISOString() : "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to load design style brief source" });
  }
};
