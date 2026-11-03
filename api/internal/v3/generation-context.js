const { requireBuilderFlag } = require("../../_promo-builder-flags");
const { requirePromoServiceV3 } = require("../../_promo-service-v3-auth");
const { getSql } = require("../../_promo-service-v3-store");
const { loadGenerationContextV3 } = require("../../_promo-generation-context-v3");

async function serviceContracts() {
  return import("../../../packages/promo-contracts/src/service-v3.mjs");
}

function createHandler(dependencies = {}) {
  const deps = {
    requireFlag: () => requireBuilderFlag("serviceContractV3"),
    authenticate: requirePromoServiceV3,
    getSql,
    loadGenerationContext: loadGenerationContextV3,
    loadContracts: serviceContracts,
    ...dependencies,
  };
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      deps.authenticate(req);
      if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      }
      const context = await deps.loadGenerationContext(deps.getSql(), {
        locale: req.query?.locale,
        market: req.query?.market,
        purpose: req.query?.purpose,
      });
      const { assertGenerationContextV3 } = await deps.loadContracts();
      const value = assertGenerationContextV3(context);
      res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
      res.setHeader("ETag", `\"${value.contextVersion}\"`);
      if (String(req.headers?.["if-none-match"] || "") === `\"${value.contextVersion}\"`) return res.status(304).end();
      return res.status(200).json({ ok: true, contractVersion: 3, context: value });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || "Generation Context V3 API failed",
        code: error.code || "GENERATION_CONTEXT_V3_FAILED",
        ...(error.validation ? { validation: error.validation } : {}),
      });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
