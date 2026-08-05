const { builderFlags } = require("./_promo-builder-flags");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  const capabilities = builderFlags();
  return res.status(200).json({
    ok: true,
    capabilities: {
      ...capabilities,
      contractVersion: 2,
      supportedContractVersions: capabilities.compositionV3 ? [2, 3] : [2],
      outputMode: capabilities.export ? "preview-and-export" : "preview",
      exportFormats: capabilities.export ? ["html", "manifest", "snapshot", "vue", "react"] : [],
    },
  });
};
