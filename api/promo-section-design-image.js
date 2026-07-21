const { getSql, fetchRun } = require("./_promo-section-design-store");

async function getPrivateBlob(urlOrPathname, options) {
  const { get } = await import("@vercel/blob");
  return get(urlOrPathname, options);
}

const defaultDependencies = {
  getSql,
  fetchRun,
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
      const id = String(req.query.runId || req.query.id || "").trim();
      if (!id) return res.status(400).send("runId is required");
      const run = await dependencies.fetchRun(dependencies.getSql(), id);
      const imageResult = run?.imageResult;
      const blobLocation = imageResult?.storageKey || imageResult?.assetUrl;
      if (!blobLocation) return res.status(404).send("Section design image not found");

      const blob = await dependencies.getPrivateBlob(blobLocation, {
        access: "private",
        ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}),
      });
      if (!blob) return res.status(404).send("Section design image not found");
      if (blob.statusCode !== 200 || !blob.stream) {
        return res.status(502).send("Failed to read section design image");
      }

      const bytes = Buffer.from(await new Response(blob.stream).arrayBuffer());
      res.setHeader("Content-Type", blob.blob?.contentType || imageResult.mimeType || "image/webp");
      res.setHeader("Cache-Control", "private, max-age=300");
      return res.status(200).send(bytes);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  };
}

const handler = createHandler();
handler.createHandler = createHandler;
module.exports = handler;
