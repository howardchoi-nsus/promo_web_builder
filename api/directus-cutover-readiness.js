const { resolveAdminOwner } = require("./_promo-admin-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { getSql } = require("./_directus-connection-config-store");
const { loadCutoverReadiness } = require("./_directus-cutover-readiness");

module.exports = async function handler(req, res) {
  try {
    requireBuilderFlag("directusConfigManagement");
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    resolveAdminOwner(req, res);
    const environment = String(req.query?.environment || "development");
    const domain = String(req.query?.domain || "components");
    const readiness = await loadCutoverReadiness(getSql(), { environment, domain });
    return res.status(200).json({ ok: true, readiness });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to evaluate Directus cutover readiness",
      code: error.code || "DIRECTUS_CUTOVER_READINESS_FAILED",
    });
  }
};
