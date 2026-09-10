const { getSql, parseBody } = require("./_item-components-store");
const { parseDataUrl, normalizeCropSpec, ComponentSourceError } = require("./_component-design-source-contract");
const { createHash } = require("node:crypto");

module.exports = async function handler(req, res) {
  try {
    const sql = getSql();
    if (req.method === "GET") {
      const id = String(req.query.id || "").trim();
      if (!id) return res.status(400).json({ error: "id is required" });
      const rows = await sql`select id::text, mime_type, byte_size, width, height, crop_spec, metadata, status, created_at, expires_at from component_design_sources where id = ${id}::uuid and deleted_at is null limit 1`;
      if (!rows[0]) return res.status(404).json({ error: "Source image not found" });
      return res.status(200).json({ ok: true, source: toSource(rows[0]) });
    }
    if (req.method === "DELETE") {
      const id = String(req.query.id || "").trim();
      if (!id) return res.status(400).json({ error: "id is required" });
      await sql`update component_design_sources set status = 'deleted', deleted_at = now() where id = ${id}::uuid and deleted_at is null`;
      return res.status(200).json({ ok: true, recoverableUntilCleanup: true });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST, DELETE");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const body = parseBody(req.body);
    const image = parseDataUrl(body.imageDataUrl);
    const analysisImage = body.analysisImageDataUrl ? parseDataUrl(body.analysisImageDataUrl) : image;
    const cropSpec = normalizeCropSpec(body.cropSpec);
    const sourceFingerprint = createHash("sha256").update(`${image.contentHash}:${JSON.stringify(cropSpec)}`).digest("hex");
    const existing = await sql`select id::text, mime_type, byte_size, width, height, crop_spec, metadata, status, created_at, expires_at from component_design_sources where content_hash = ${sourceFingerprint} and status = 'ready' and deleted_at is null and (expires_at is null or expires_at > now()) order by created_at desc limit 1`;
    if (existing[0]) {
      return res.status(200).json({ ok: true, deduplicated: true, source: toSource(existing[0]) });
    }
    const { put } = await import("@vercel/blob");
    const storageKey = `component-sources/${sourceFingerprint}.${image.extension}`;
    await put(storageKey, image.bytes, { access: "private", addRandomSuffix: false, contentType: image.mimeType });
    const analysisStorageKey = `component-sources/${sourceFingerprint}-analysis.${analysisImage.extension}`;
    if (analysisStorageKey !== storageKey) await put(analysisStorageKey, analysisImage.bytes, { access: "private", addRandomSuffix: false, contentType: analysisImage.mimeType });
    const metadata = { originalName: String(body.fileName || "").slice(0, 180), originalContentHash: image.contentHash, analysisVariant: "cropped-downscaled", analysisStorageKey, analysisMimeType: analysisImage.mimeType, analysisWidth: analysisImage.width, analysisHeight: analysisImage.height, retentionDays: 7 };
    const rows = await sql`
      insert into component_design_sources (storage_key, mime_type, byte_size, width, height, content_hash, crop_spec, metadata, status, expires_at)
      values (${storageKey}, ${image.mimeType}, ${image.bytes.length}, ${image.width}, ${image.height}, ${sourceFingerprint}, ${JSON.stringify(cropSpec)}::jsonb, ${JSON.stringify(metadata)}::jsonb, 'ready', now() + interval '7 days')
      returning id::text, mime_type, byte_size, width, height, crop_spec, metadata, status, created_at, expires_at
    `;
    return res.status(201).json({ ok: true, source: toSource(rows[0]) });
  } catch (error) {
    const known = error instanceof ComponentSourceError;
    return res.status(known ? error.statusCode : (error.statusCode || 500)).json({ error: known ? error.code : "Component source API failed", message: error.message });
  }
};

function toSource(row) {
  return { id: row.id, mimeType: row.mime_type, byteSize: Number(row.byte_size), width: Number(row.width), height: Number(row.height), cropSpec: row.crop_spec || {}, metadata: row.metadata || {}, status: row.status, createdAt: row.created_at, expiresAt: row.expires_at, imageUrl: `/api/component-design-source-image?id=${encodeURIComponent(row.id)}` };
}

module.exports.toSource = toSource;
