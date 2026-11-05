const { getSql, parseBody } = require("./_item-components-store");
const { parseDataUrl, parseImageBytes, normalizeCropSpec, ComponentSourceError } = require("./_component-design-source-contract");
const { createHash } = require("node:crypto");

const UPLOAD_PREFIX = "component-source-uploads/";

module.exports = async function handler(req, res) {
  let temporaryUploadPath = "";
  let temporaryUploadPersisted = false;
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
    const uploadedImage = body.imageBlob ? await readUploadedImage(body.imageBlob) : null;
    if (uploadedImage) temporaryUploadPath = uploadedImage.pathname;
    const image = uploadedImage?.image || parseDataUrl(body.imageDataUrl);
    const analysisImage = body.analysisImageDataUrl ? parseDataUrl(body.analysisImageDataUrl) : image;
    const cropSpec = normalizeCropSpec(body.cropSpec);
    const sourceFingerprint = createHash("sha256").update(`${image.contentHash}:${JSON.stringify(cropSpec)}`).digest("hex");
    const existing = await sql`select id::text, mime_type, byte_size, width, height, crop_spec, metadata, status, created_at, expires_at from component_design_sources where content_hash = ${sourceFingerprint} and status = 'ready' and deleted_at is null and (expires_at is null or expires_at > now()) order by created_at desc limit 1`;
    if (existing[0]) {
      if (temporaryUploadPath) {
        await deleteUploadedBlob(temporaryUploadPath);
        temporaryUploadPath = "";
      }
      return res.status(200).json({ ok: true, deduplicated: true, source: toSource(existing[0]) });
    }
    const { put } = await import("@vercel/blob");
    const storageKey = uploadedImage?.pathname || `component-sources/${sourceFingerprint}.${image.extension}`;
    if (!uploadedImage) await put(storageKey, image.bytes, { access: "private", addRandomSuffix: false, contentType: image.mimeType });
    const analysisStorageKey = body.analysisImageDataUrl
      ? `component-sources/${sourceFingerprint}-analysis.${analysisImage.extension}`
      : storageKey;
    if (analysisStorageKey !== storageKey) await put(analysisStorageKey, analysisImage.bytes, { access: "private", addRandomSuffix: false, contentType: analysisImage.mimeType });
    const metadata = { originalName: String(body.fileName || "").slice(0, 180), originalContentHash: image.contentHash, analysisVariant: body.analysisImageDataUrl ? "cropped-downscaled" : "original", analysisStorageKey, analysisMimeType: analysisImage.mimeType, analysisWidth: analysisImage.width, analysisHeight: analysisImage.height, retentionDays: 7 };
    const rows = await sql`
      insert into component_design_sources (storage_key, mime_type, byte_size, width, height, content_hash, crop_spec, metadata, status, expires_at)
      values (${storageKey}, ${image.mimeType}, ${image.bytes.length}, ${image.width}, ${image.height}, ${sourceFingerprint}, ${JSON.stringify(cropSpec)}::jsonb, ${JSON.stringify(metadata)}::jsonb, 'ready', now() + interval '7 days')
      returning id::text, mime_type, byte_size, width, height, crop_spec, metadata, status, created_at, expires_at
    `;
    temporaryUploadPersisted = Boolean(uploadedImage);
    return res.status(201).json({ ok: true, source: toSource(rows[0]) });
  } catch (error) {
    if (temporaryUploadPath && !temporaryUploadPersisted) await deleteUploadedBlob(temporaryUploadPath).catch(() => null);
    const known = error instanceof ComponentSourceError;
    return res.status(known ? error.statusCode : (error.statusCode || 500)).json({ error: known ? error.code : "Component source API failed", message: error.message });
  }
};

async function readUploadedImage(descriptor) {
  const pathname = String(descriptor?.pathname || "").trim();
  if (!pathname.startsWith(UPLOAD_PREFIX)) {
    throw new ComponentSourceError("INVALID_UPLOAD_PATH", "이미지 업로드 경로가 올바르지 않습니다.");
  }
  const { get } = await import("@vercel/blob");
  const result = await get(pathname, {
    access: "private",
    ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}),
  });
  if (!result?.stream || result.statusCode !== 200) {
    throw new ComponentSourceError("UPLOADED_IMAGE_NOT_FOUND", "업로드한 이미지 파일을 찾을 수 없습니다.", 404);
  }
  const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
  return {
    pathname,
    image: parseImageBytes(bytes, result.blob?.contentType || descriptor?.contentType),
  };
}

async function deleteUploadedBlob(pathname) {
  if (!String(pathname || "").startsWith(UPLOAD_PREFIX)) return;
  const { del } = await import("@vercel/blob");
  await del(pathname, process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : undefined);
}

function toSource(row) {
  return { id: row.id, mimeType: row.mime_type, byteSize: Number(row.byte_size), width: Number(row.width), height: Number(row.height), cropSpec: row.crop_spec || {}, metadata: row.metadata || {}, status: row.status, createdAt: row.created_at, expiresAt: row.expires_at, imageUrl: `/api/component-design-source-image?id=${encodeURIComponent(row.id)}` };
}

module.exports.toSource = toSource;
