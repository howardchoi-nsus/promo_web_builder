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
      select a.asset_url, a.mime_type, a.storage_key, a.metadata
      from promo_design_runs r
      join promo_design_assets a on a.run_id = r.id and a.asset_type = 'generated_image'
      where r.run_key = ${runKey}
      order by a.is_primary desc, a.created_at desc
      limit 1
    `;

    const row = rows[0] || {};
    const assetUrl = row.asset_url;
    if (!assetUrl) return res.status(404).send("Image not found");

    const candidateUrls = uniqueValues([
      assetUrl,
      row.metadata?.downloadUrl,
      row.metadata?.download_url,
      row.metadata?.url,
    ]);
    const response = await fetchFirstReadableImage(candidateUrls);
    if (!response.ok) {
      return res.status(response.status).send([
        `Failed to read blob image: ${response.status}`,
        `storageKey: ${row.storage_key || ""}`,
        `assetUrl: ${assetUrl}`,
      ].join("\n"));
    }

    const contentType = response.headers.get("content-type") || row.mime_type || "image/png";
    const cacheControl = response.headers.get("cache-control") || "public, max-age=31536000, immutable";
    const buffer = Buffer.from(await response.arrayBuffer());
    const detectedMimeType = detectImageMimeType(buffer);
    if (!detectedMimeType) {
      return res.status(422).send([
        "Invalid stored image: blob content is not a valid PNG, JPEG, or WebP",
        `bytes: ${buffer.length}`,
        `storageKey: ${row.storage_key || ""}`,
        `assetUrl: ${assetUrl}`,
      ].join("\n"));
    }

    res.setHeader("Content-Type", detectedMimeType || contentType);
    res.setHeader("Cache-Control", cacheControl);
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

async function fetchFirstReadableImage(urls) {
  let lastResponse = null;
  for (const url of urls) {
    const authHeaders = {};
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      authHeaders.Authorization = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
    }

    const attempts = process.env.BLOB_READ_WRITE_TOKEN
      ? [{ headers: authHeaders }, {}]
      : [{}];

    for (const options of attempts) {
      const response = await fetch(url, options);
      lastResponse = response;
      if (response.ok) return response;
    }
  }
  return lastResponse || { ok: false, status: 404, headers: new Map(), arrayBuffer: async () => new ArrayBuffer(0) };
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));
}

function detectImageMimeType(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 16) return "";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return "";
}
