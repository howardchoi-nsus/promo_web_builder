const { getSql, fetchRun } = require("./_promo-section-design-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }
  try {
    const id = String(req.query.runId || req.query.id || "").trim();
    if (!id) return res.status(400).send("runId is required");
    const run = await fetchRun(getSql(), id);
    const assetUrl = run?.imageResult?.assetUrl;
    if (!assetUrl) return res.status(404).send("Section design image not found");
    const headers = process.env.BLOB_READ_WRITE_TOKEN
      ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      : {};
    const response = await fetch(assetUrl, { headers });
    if (!response.ok) return res.status(response.status).send("Failed to read section design image");
    const bytes = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", run.imageResult.mimeType || "image/webp");
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).send(bytes);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
};
