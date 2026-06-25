const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    res.status(500).json({ error: "DATABASE_URL is not configured" });
    return;
  }

  const { brandName, slug, rawMarkdown, sourceName } = req.body || {};
  const markdown = String(rawMarkdown || "").trim();
  const cleanBrandName = String(brandName || "Untitled Brand").trim();
  const cleanSlug = slugify(slug || cleanBrandName);
  const filename = String(sourceName || `${cleanSlug}-design.md`).trim();

  if (!markdown) {
    res.status(400).json({ error: "rawMarkdown is required" });
    return;
  }
  if (!cleanSlug) {
    res.status(400).json({ error: "Valid brand slug is required" });
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`
      with b as (
        insert into brands (name, slug, category, website_url, updated_at)
        values (${cleanBrandName}, ${cleanSlug}, 'design-reference', null, now())
        on conflict (slug) do update
          set name = excluded.name,
              category = excluded.category,
              updated_at = now()
        returning id, name, slug
      ),
      d as (
        insert into design_documents (
          brand_id,
          source_type,
          original_filename,
          original_blob_url,
          status,
          raw_markdown,
          updated_at
        )
        select id, 'markdown_upload', ${filename}, null, 'uploaded', ${markdown}, now()
        from b
        on conflict (brand_id, original_filename) do update
          set status = 'uploaded',
              raw_markdown = excluded.raw_markdown,
              updated_at = now()
        returning id, brand_id, original_filename, status, raw_markdown, updated_at
      )
      select
        d.id::text as id,
        d.brand_id::text as brand_id,
        b.name as brand_name,
        b.slug,
        d.original_filename,
        d.status,
        d.raw_markdown,
        d.updated_at
      from d
      join b on b.id = d.brand_id
    `;

    const doc = rows[0];
    res.status(200).json({
      ok: true,
      document: {
        id: doc.id,
        brandId: doc.brand_id,
        brandName: doc.brand_name,
        slug: doc.slug,
        sourceName: doc.original_filename,
        status: doc.status,
        markdown: doc.raw_markdown,
        updatedAt: doc.updated_at ? new Date(doc.updated_at).toISOString().slice(0, 16).replace("T", " ") : "",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to register design markdown" });
  }
};
