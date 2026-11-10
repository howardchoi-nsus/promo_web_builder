const { requireBuilderFlag } = require("../../_promo-builder-flags");
const { requirePromoServiceV3 } = require("../../_promo-service-v3-auth");
const store = require("../../_promo-service-v3-store");

function createHandler(dependencies = {}) {
  const deps = {
    requireFlag: () => requireBuilderFlag("serviceContractV3"),
    authenticate: requirePromoServiceV3,
    getSql: store.getSql,
    findGenerationJob: store.findGenerationJobV3,
    ...dependencies,
  };
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      deps.authenticate(req);
      res.setHeader("Cache-Control", "no-store");
      if (req.method === "POST") {
        return res.status(410).json({
          ok: false,
          contractVersion: 3,
          code: "V3_GENERATION_RETIRED",
          error: "V3 generation bridge has been removed. Use the AI builder composition flow.",
        });
      }
      if (req.method === "GET") {
        const jobId = String(req.query?.id || req.query?.jobId || "").trim();
        if (!jobId) return res.status(400).json({ error: "jobId is required", code: "JOB_ID_REQUIRED" });
        const job = await deps.findGenerationJob(deps.getSql(), jobId);
        if (!job) return res.status(404).json({ error: "Generation job not found", code: "GENERATION_JOB_NOT_FOUND" });
        return res.status(200).json({ ok: true, contractVersion: 3, job });
      }
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || "Generation Job V3 API failed",
        code: error.code || "GENERATION_JOB_V3_FAILED",
        ...(error.validation ? { validation: error.validation } : {}),
      });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
