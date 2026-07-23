const { getSql, isSupportedBlobLocation } = require("./_promo-generation-run-store");

async function getPrivateBlob(urlOrPathname, options) {
  const { get } = await import("@vercel/blob");
  return get(urlOrPathname, options);
}

const defaultDependencies = {
  getSql,
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
      const draftId = String(req.query.draftId || req.query.draft_id || req.query.id || "").trim();
      if (!draftId) return res.status(400).send("draftId is required");

      const sql = dependencies.getSql();
      const rows = await sql`
        select
          id::text,
          run_id::text,
          draft_attempt,
          status,
          draft_image_url,
          updated_at
        from promo_generation_lofi_drafts
        where id = ${draftId}::uuid
        limit 1
      `;
      const draft = rows[0] || {};
      if (!draft.id) return res.status(404).send("LO-FI draft not found");
      if (!draft.draft_image_url) return res.status(404).send("LO-FI draft image not found");
      if (!isSupportedBlobLocation(draft.draft_image_url)) {
        return res.status(422).send("Unsupported LO-FI draft image location");
      }

      const blob = await dependencies.getPrivateBlob(draft.draft_image_url, {
        access: "private",
        ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}),
      });
      if (!blob) return res.status(404).send("LO-FI draft image not found");
      if (blob.statusCode !== 200 || !blob.stream) {
        return res.status(502).send("Failed to read LO-FI draft image");
      }

      const buffer = Buffer.from(await new Response(blob.stream).arrayBuffer());
      const detectedMimeType = detectImageMimeType(buffer);
      if (!detectedMimeType) {
        return res.status(422).send([
          "Invalid stored LO-FI draft image: blob content is not a valid PNG, JPEG, or WebP",
          `bytes: ${buffer.length}`,
          `draftId: ${draft.id}`,
        ].join("\n"));
      }

      res.setHeader("Content-Type", detectedMimeType);
      res.setHeader("Cache-Control", "private, max-age=60, stale-while-revalidate=300");
      res.setHeader("X-Promo-Draft-Id", draft.id);
      res.setHeader("X-Promo-Draft-Attempt", String(draft.draft_attempt || ""));
      return res.status(200).send(buffer);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  };
}

const handler = createHandler();
handler.createHandler = createHandler;
module.exports = handler;

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
