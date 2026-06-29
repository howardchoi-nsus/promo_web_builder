const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  try {
    const runKey = String(req.query.id || req.query.runKey || "").trim();
    if (!runKey) return res.status(400).send("Missing id");

    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) return res.status(500).send("DATABASE_URL is not configured");

    const sql = neon(databaseUrl);
    const rows = await sql`
      select a.asset_url, a.mime_type
      from promo_design_runs r
      join promo_design_assets a on a.run_id = r.id and a.is_primary = true
      where r.run_key = ${runKey}
      limit 1
    `;

    const assetUrl = rows[0]?.asset_url;
    if (!assetUrl) return res.status(404).send("Image not found");

    const headers = {};
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      headers.Authorization = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
    }

    const response = await fetch(assetUrl, { headers });
    if (!response.ok) {
      return res.status(response.status).send(`Failed to read blob image: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || rows[0].mime_type || "image/png";
    const cacheControl = response.headers.get("cache-control") || "public, max-age=31536000, immutable";
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", cacheControl);
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
