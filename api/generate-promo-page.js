const {
  generationReadiness,
} = require("./_promo-page-generation-proxy");

function createHandler({ env = process.env } = {}) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store");
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, ...generationReadiness(env) });
    }
    if (req.method === "POST") {
      return res.status(410).json({
        ok: false,
        error: "This generation facade has been retired",
        code: "GENERATION_FACADE_RETIRED",
        message: "Use the validated output quality test endpoint.",
      });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  };
}

const handler = createHandler();
module.exports = handler;
module.exports.createHandler = createHandler;
