const { getSql } = require("./_promo-section-design-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).send("Method not allowed"); }
  try {
    const jobId = String(req.query.jobId || "").trim();
    if (!jobId) return res.status(400).send("jobId is required");
    const rows = await getSql()`select result_snapshot from promo_section_design_asset_jobs where id = ${jobId}::uuid and status = 'ready' limit 1`;
    const result = rows[0]?.result_snapshot;
    const location = result?.storageKey || result?.assetUrl;
    if (!location) return res.status(404).send("Section design asset not found");
    const { get } = await import("@vercel/blob");
    const blob = await get(location, { access: "private", ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}) });
    if (!blob || blob.statusCode !== 200 || !blob.stream) return res.status(502).send("Failed to read section design asset");
    const bytes = Buffer.from(await new Response(blob.stream).arrayBuffer());
    res.setHeader("Content-Type", blob.blob?.contentType || result.mimeType || "image/webp");
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).send(bytes);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
};
