const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

async function getPrivateBlob(urlOrPathname, options) {
  const { get } = await import("@vercel/blob");
  return get(urlOrPathname, options);
}

const defaultDependencies = {
  getDatabaseUrl,
  createSql: neon,
  getPrivateBlob,
};

function createHandler(overrides = {}) {
  const dependencies = { ...defaultDependencies, ...overrides };
  return async function handler(req, res) {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).send("Method not allowed");
    }

    try {
      const runKey = String(req.query.id || req.query.runKey || "").trim();
      if (!runKey) return res.status(400).send("Missing id");

      const databaseUrl = dependencies.getDatabaseUrl();
      if (!databaseUrl) return res.status(500).send("DATABASE_URL is not configured");

      const sql = dependencies.createSql(databaseUrl);
      const rows = await sql`
        select a.asset_url, a.mime_type, a.storage_key, a.metadata
        from promo_design_runs r
        join promo_design_assets a on a.run_id = r.id and a.asset_type = 'generated_image'
        where r.run_key = ${runKey}
        order by a.is_primary desc, a.created_at desc
        limit 1
      `;

      const row = rows[0] || {};
      const blobLocations = uniqueValues([
        row.storage_key,
        row.asset_url,
        row.metadata?.downloadUrl,
        row.metadata?.download_url,
        row.metadata?.url,
      ]);
      if (!blobLocations.length) return res.status(404).send("Image not found");

      let blob;
      try {
        blob = await getFirstReadablePrivateBlob(blobLocations, dependencies.getPrivateBlob);
      } catch {
        return res.status(502).send("Failed to read generated image");
      }
      if (!blob) return res.status(404).send("Image not found");
      if (blob.statusCode !== 200 || !blob.stream) {
        return res.status(502).send("Failed to read generated image");
      }

      const buffer = Buffer.from(await new Response(blob.stream).arrayBuffer());
      const detectedMimeType = detectImageMimeType(buffer);
      if (!detectedMimeType) {
        return res.status(422).send([
          "Invalid stored image: blob content is not a valid PNG, JPEG, or WebP",
          `bytes: ${buffer.length}`,
        ].join("\n"));
      }

      res.setHeader("Content-Type", detectedMimeType);
      res.setHeader("Cache-Control", "private, max-age=300");
      return res.status(200).send(buffer);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
}

async function getFirstReadablePrivateBlob(locations, getBlob) {
  const options = {
    access: "private",
    ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}),
  };
  let lastError = null;
  for (const location of locations) {
    try {
      const blob = await getBlob(location, options);
      if (blob) return blob;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

const handler = createHandler();
handler.createHandler = createHandler;
module.exports = handler;

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
