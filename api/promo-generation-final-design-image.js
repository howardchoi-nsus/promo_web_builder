const { getSql } = require("./_promo-generation-run-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  try {
    const finalDesignId = String(req.query.finalDesignId || req.query.final_design_id || req.query.id || "").trim();
    if (!finalDesignId) return res.status(400).send("finalDesignId is required");

    const sql = getSql();
    const rows = await sql`
      select
        id::text,
        run_id::text,
        status,
        final_image_url,
        updated_at
      from promo_generation_final_designs
      where id = ${finalDesignId}::uuid
      limit 1
    `;
    const finalDesign = rows[0] || {};
    if (!finalDesign.id) return res.status(404).send("Final design not found");
    if (!finalDesign.final_image_url) return res.status(404).send("Final design image not found");

    const response = await fetchReadableBlobImage(finalDesign.final_image_url);
    if (!response.ok) {
      return res.status(response.status).send([
        `Failed to read final design image: ${response.status}`,
        `finalDesignId: ${finalDesign.id}`,
        `runId: ${finalDesign.run_id || ""}`,
        `finalImageUrl: ${finalDesign.final_image_url}`,
      ].join("\n"));
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const detectedMimeType = detectImageMimeType(buffer);
    if (!detectedMimeType) {
      return res.status(422).send([
        "Invalid stored final design image: blob content is not a valid PNG, JPEG, or WebP",
        `bytes: ${buffer.length}`,
        `finalDesignId: ${finalDesign.id}`,
        `finalImageUrl: ${finalDesign.final_image_url}`,
      ].join("\n"));
    }

    res.setHeader("Content-Type", detectedMimeType);
    res.setHeader("Cache-Control", "private, max-age=60, stale-while-revalidate=300");
    res.setHeader("X-Promo-Final-Design-Id", finalDesign.id);
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
