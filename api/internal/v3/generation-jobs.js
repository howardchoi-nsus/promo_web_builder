const { randomUUID } = require("node:crypto");
const { parseBody } = require("../../_wizard-form-templates-store");
const { requireBuilderFlag } = require("../../_promo-builder-flags");
const { requirePromoServiceV3 } = require("../../_promo-service-v3-auth");
const store = require("../../_promo-service-v3-store");
const { startGenerationJobV3 } = require("../../_promo-generation-v3-adapter");

async function serviceContracts() {
  return import("../../../packages/promo-contracts/src/service-v3.mjs");
}

function createHandler(dependencies = {}) {
  const deps = {
    parseBody,
    requireFlag: () => requireBuilderFlag("serviceContractV3"),
    authenticate: requirePromoServiceV3,
    getSql: store.getSql,
    createGenerationJob: store.createGenerationJobV3,
    findGenerationJob: store.findGenerationJobV3,
    startGeneration: startGenerationJobV3,
    dispatchOutbox: store.dispatchDomainOutboxV3,
    loadContracts: serviceContracts,
    ...dependencies,
  };
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      deps.authenticate(req);
      res.setHeader("Cache-Control", "no-store");
      const sql = deps.getSql();
      if (req.method === "POST") {
        const body = deps.parseBody(req.body);
        const { assertGenerationJobV3 } = await deps.loadContracts();
        const contract = assertGenerationJobV3({ ...body, status: "accepted", attempt: 0 });
        const idempotencyKey = String(
          req.headers?.["idempotency-key"] || body.idempotencyKey || randomUUID(),
        ).trim().slice(0, 200);
        const result = await deps.createGenerationJob(sql, {
          requestId: contract.requestId,
          pipeline: contract.pipeline,
          inputSnapshot: contract.inputSnapshot,
          idempotencyKey,
        });
        if (!result.job) {
          return res.status(404).json({
            error: "Promo request not found",
            code: "PROMO_REQUEST_NOT_FOUND",
          });
        }
        let execution = null;
        if (result.created && body.start !== false) {
          execution = await deps.startGeneration(sql, {
            job: result.job,
            inputSnapshot: contract.inputSnapshot,
            req,
          });
          if (!execution.ok) {
            return res.status(execution.statusCode || 502).json({
              error: execution.error,
              code: "WORKER_TRIGGER_FAILED",
              contractVersion: 3,
              job: { ...result.job, status: "failed", legacyRunId: execution.legacyRunId },
            });
          }
          result.job.status = "queued";
          result.job.legacyRunId = execution.legacyRunId;
        }
        await deps.dispatchOutbox(sql, { limit: 50 }).catch(() => null);
        return res.status(result.created ? 202 : 200).json({
          ok: true,
          contractVersion: 3,
          idempotentReplay: !result.created,
          job: result.job,
          execution,
        });
      }
      if (req.method === "GET") {
        const jobId = String(req.query?.id || req.query?.jobId || "").trim();
        if (!jobId) return res.status(400).json({ error: "jobId is required", code: "JOB_ID_REQUIRED" });
        const job = await deps.findGenerationJob(sql, jobId);
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
