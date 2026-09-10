const { getSql } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const id = String(req.query.id || "").trim();
    const rows = await getSql()`select storage_key, mime_type from component_design_sources where id = ${id}::uuid and status = 'ready' and deleted_at is null and (expires_at is null or expires_at > now()) limit 1`;
    if (!rows[0]) return res.status(404).json({ error: "Source image not found" });
    const { get } = await import("@vercel/blob");
    const result = await get(rows[0].storage_key, { access: "private", ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}) });
    if (!result?.stream || result.statusCode !== 200) return res.status(404).json({ error: "Source image binary not found" });
    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
    res.setHeader("Content-Type", result.blob?.contentType || rows[0].mime_type);
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).send(bytes);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Source image proxy failed", message: error.message });
  }
};
