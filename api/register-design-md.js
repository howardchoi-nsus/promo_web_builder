const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nameFromSource(sourceName, fallback = "Untitled Design Style") {
  const base = String(sourceName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/(?:-?design-?system|-?eng|-?kor)$/gi, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return base || fallback;
}

function parseJsonValue(value) {
  if (!value) return {};
  if (typeof value === "string") return JSON.parse(value);
  return value;
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

  const {
    brandName,
    designStyleName,
    slug,
    rawMarkdown,
    designMdMarkdown,
    sourceName,
    designMdFileName,
    designTokenFileName,
    designTokensJson,
    rawDesignTokensJson,
  } = req.body || {};
  const markdown = String(rawMarkdown || "").trim();
  const mdMarkdown = String(designMdMarkdown || markdown || "").trim();
  const filename = String(designMdFileName || sourceName || "").trim();
  const cleanStyleName = String(designStyleName || brandName || nameFromSource(filename)).trim();
  const cleanSlug = slugify(slug || cleanStyleName);
  const cleanFilename = String(filename || `${cleanSlug}-design.md`).trim();
  let tokenJson = {};

  try {
    tokenJson = parseJsonValue(designTokensJson ?? rawDesignTokensJson);
  } catch (error) {
    res.status(400).json({ error: "designTokensJson must be valid JSON" });
    return;
  }

  if (!mdMarkdown) {
    res.status(400).json({ error: "designMdMarkdown is required" });
    return;
  }
  if (!cleanSlug) {
    res.status(400).json({ error: "Valid design style slug is required" });
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`
      with b as (
        insert into brands (name, slug, category, website_url, updated_at)
        values (${cleanStyleName}, ${cleanSlug}, 'design-reference', null, now())
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
          design_style_name,
          design_token_filename,
          design_token_json,
          extraction_status,
          updated_at
        )
        select id, 'markdown_upload', ${cleanFilename}, null, 'ready', ${mdMarkdown}, ${cleanStyleName}, ${designTokenFileName || ""}, ${JSON.stringify(tokenJson)}::jsonb, 'ready', now()
        from b
        on conflict (brand_id, original_filename) do update
          set status = 'ready',
              raw_markdown = excluded.raw_markdown,
              design_style_name = excluded.design_style_name,
              design_token_filename = excluded.design_token_filename,
              design_token_json = excluded.design_token_json,
              extraction_status = 'ready',
              extraction_error = null,
              archived_at = null,
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
      extraction: null,
      document: {
        id: doc.id,
        brandId: doc.brand_id,
        brandName: doc.brand_name,
        designStyleName: doc.brand_name,
        slug: doc.slug,
        sourceName: doc.original_filename,
        status: "ready",
        extractionStatus: "ready",
        updatedAt: doc.updated_at ? new Date(doc.updated_at).toISOString().slice(0, 16).replace("T", " ") : "",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to register design markdown" });
  }
};
