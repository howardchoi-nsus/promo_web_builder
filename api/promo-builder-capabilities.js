const { builderFlags } = require("./_promo-builder-flags");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    ok: true,
    capabilities: {
      ...builderFlags(),
      contractVersion: 2,
      outputMode: "preview",
    },
  });
};
