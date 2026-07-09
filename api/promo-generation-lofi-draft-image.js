const { getSql } = require("./_promo-generation-run-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  try {
    const draftId = String(req.query.draftId || req.query.draft_id || req.query.id || "").trim();
    if (!draftId) return res.status(400).send("draftId is required");

    const sql = getSql();
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

    const response = await fetchReadableBlobImage(draft.draft_image_url);
    if (!response.ok) {
      return res.status(response.status).send([
        `Failed to read LO-FI draft image: ${response.status}`,
        `draftId: ${draft.id}`,
        `runId: ${draft.run_id || ""}`,
        `draftImageUrl: ${draft.draft_image_url}`,
      ].join("\n"));
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const detectedMimeType = detectImageMimeType(buffer);
    if (!detectedMimeType) {
      return res.status(422).send([
        "Invalid stored LO-FI draft image: blob content is not a valid PNG, JPEG, or WebP",
        `bytes: ${buffer.length}`,
        `draftId: ${draft.id}`,
        `draftImageUrl: ${draft.draft_image_url}`,
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

async function fetchReadableBlobImage(url) {
  const trimmedUrl = String(url || "").trim();
  if (!trimmedUrl) return emptyImageResponse(404);

  const attempts = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    attempts.push({
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
  }
  attempts.push({});

  let lastResponse = null;
  for (const options of attempts) {
    const response = await fetch(trimmedUrl, options);
    lastResponse = response;
    if (response.ok) return response;
  }

  return lastResponse || emptyImageResponse(404);
}

function emptyImageResponse(status) {
  return {
    ok: false,
    status,
    headers: new Map(),
    arrayBuffer: async () => new ArrayBuffer(0),
  };
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
