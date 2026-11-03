const { requireBuilderFlag } = require("../../_promo-builder-flags");
const { requirePromoServiceV3 } = require("../../_promo-service-v3-auth");
const { getSql, dispatchDomainOutboxV3 } = require("../../_promo-service-v3-store");

function createHandler(dependencies = {}) {
  const deps = {
    requireFlag: () => requireBuilderFlag("serviceContractV3"),
    authenticate: requirePromoServiceV3,
    getSql,
    dispatch: dispatchDomainOutboxV3,
    ...dependencies,
  };
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      deps.authenticate(req);
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      const result = await deps.dispatch(deps.getSql(), { limit: req.body?.limit || req.query?.limit });
      return res.status(result.failed ? 207 : 200).json({ ok: result.failed === 0, contractVersion: 3, ...result });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || "OUTBOX_DISPATCH_V3_FAILED" });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
