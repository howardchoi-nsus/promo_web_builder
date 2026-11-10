const assert = require("node:assert/strict");
const { createHandler: createRequestHandler } = require("../api/v3/promo-requests");
const { createHandler: createJobHandler } = require("../api/internal/v3/generation-jobs");
const { createHandler: createContextHandler } = require("../api/internal/v3/generation-context");
const { createHandler: createOutboxHandler } = require("../api/internal/v3/outbox-dispatch");
const {
  createRegenerateHandler,
  createReviewHandler,
  createPublicationHandler,
} = require("../api/_promo-service-v3-actions");

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[String(name).toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { this.ended = true; return this; },
  };
}

const contractLoader = () => import("../packages/promo-contracts/src/service-v3.mjs");

async function testRequestHandler() {
  const handler = createRequestHandler({
    requireFlag() {},
    resolveBuilderOwner: () => ({ ownerSubject: "owner-1" }),
    getSql: () => "sql",
    loadContracts: contractLoader,
    createPromoRequest: async () => ({
      created: true,
      request: { contractVersion: 3, requestId: "request-1", status: "requested", documentId: null },
    }),
    createDocument: async () => ({ id: "document-1" }),
    attachDocument: async (_sql, input) => ({
      contractVersion: 3,
      requestId: input.requestId,
      status: "requested",
      documentId: input.documentId,
    }),
    dispatchOutbox: async () => ({ processed: 1, failed: 0 }),
  });
  const res = response();
  await handler({
    method: "POST",
    headers: { "idempotency-key": "idem-1" },
    body: { contractVersion: 3, channel: "nuxt-portal", brief: { requestText: "프로모션 생성", locale: "ko-KR" } },
  }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.request.documentId, "document-1");
  assert.equal(res.body.contractVersion, 3);
}

async function testJobHandler() {
  const noSideEffects = () => { throw new Error("retired generation must not access SQL or dispatch work"); };
  const deps = {
    requireFlag() {},
    authenticate() {},
    resolveBuilderOwner: () => ({ ownerSubject: "owner-1" }),
    getSql: noSideEffects,
    createGenerationJob: noSideEffects,
    startGeneration: noSideEffects,
    saveFeedback: noSideEffects,
    dispatchOutbox: noSideEffects,
  };
  for (const body of [{}, { start: false }, { pipeline: "composition" }, { pipeline: "final_design_v2" }]) {
    const res = response();
    await createJobHandler(deps)({ method: "POST", body, headers: {} }, res);
    assert.equal(res.statusCode, 410);
    assert.equal(res.body.code, "V3_GENERATION_RETIRED");
    assert.equal(res.headers["cache-control"], "no-store");
  }
  const regeneration = response();
  await createRegenerateHandler(deps)({ method: "POST", headers: {}, body: { feedbackText: "retry" } }, regeneration);
  assert.equal(regeneration.statusCode, 410);
  assert.equal(regeneration.body.code, "V3_GENERATION_RETIRED");

  const historical = { jobId: "job-1", status: "ready", resultReference: "saved-result" };
  const read = createJobHandler({ ...deps, getSql: () => "sql", findGenerationJob: async () => historical });
  const res = response();
  await read({ method: "GET", query: { id: "job-1" }, headers: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.job, historical);

  const forbidden = createJobHandler({ ...deps, authenticate() { throw Object.assign(new Error("Unauthorized"), { statusCode: 401 }); } });
  const denied = response();
  await forbidden({ method: "POST", headers: {} }, denied);
  assert.equal(denied.statusCode, 401);

  const { findGenerationJobV3 } = require("../api/_promo-service-v3-store");
  let jobQuery = "";
  const job = await findGenerationJobV3(async (parts) => {
    jobQuery = parts.join("?");
    return [{ id: "job-1", status: "ready", legacy_status: "failed", legacy_run_id: "old-run" }];
  }, "job-1");
  assert.doesNotMatch(jobQuery, /promo_generation_runs|legacy_run_id|join/i);
  assert.equal(job.status, "ready");
  assert.equal(Object.hasOwn(job, "legacyRunId"), false);
}

async function testContextHandler() {
  const handler = createContextHandler({
    requireFlag() {},
    authenticate() {},
    getSql: () => "sql",
    loadContracts: contractLoader,
    loadGenerationContext: async () => ({
      contractVersion: 3,
      contextVersion: "context-hash",
      components: [],
      designTokens: {},
      contentResources: [],
      assets: [],
      policies: {},
    }),
  });
  const res = response();
  await handler({ method: "GET", headers: {}, query: { locale: "ko-KR" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers.etag, '"context-hash"');
  assert.equal(res.body.context.contractVersion, 3);
}

async function testReviewAndPublicationHandlers() {
  const review = createReviewHandler({
    requireFlag() {},
    resolveBuilderOwner: () => ({ ownerSubject: "owner-1" }),
    getSql: () => "sql",
    loadContracts: contractLoader,
    findRequest: async () => ({ requestId: "request-1", documentId: "document-1" }),
    fetchDocument: async () => ({
      document: { currentDocumentRevision: 2 },
      version: { snapshot_hash: "snapshot-hash" },
      snapshot: { contractVersion: 3, qualityGate: { state: "passed", documentRevision: 2, blockingCount: 0 } },
    }),
    assertQualityGate() {},
    saveApproval: async (_sql, input) => ({
      contractVersion: 3,
      approvalId: "approval-1",
      requestId: input.requestId,
      promotionId: input.requestId,
      documentId: input.documentId,
      documentRevision: input.documentRevision,
      decision: input.decision,
      snapshotHash: input.snapshotHash,
    }),
    dispatchOutbox: async () => ({ processed: 1, failed: 0 }),
  });
  const reviewRes = response();
  await review({ method: "POST", headers: {}, query: { id: "request-1" }, body: {
    contractVersion: 3, decision: "approved", documentRevision: 2,
  } }, reviewRes);
  assert.equal(reviewRes.statusCode, 201);
  assert.equal(reviewRes.body.approval.approvalId, "approval-1");

  const publish = createPublicationHandler({
    requireFlag() {},
    resolveBuilderOwner: () => ({ ownerSubject: "owner-1" }),
    getSql: () => "sql",
    loadContracts: contractLoader,
    findRequest: async () => ({ requestId: "request-1", documentId: "document-1" }),
    findApproval: async () => ({
      approvalId: "approval-1", requestId: "request-1", promotionId: "request-1",
      documentId: "document-1", documentRevision: 2, snapshotHash: "snapshot-hash",
    }),
    findRevision: async () => ({ snapshot_json: { contractVersion: 3 }, snapshot_hash: "snapshot-hash" }),
    assertQualityGate() {},
    saveLegacyPublication: async () => ({ publication: { id: "legacy-publication-1" } }),
    saveSnapshot: async (_sql, input) => ({ contractVersion: 3, publicationId: "publication-1", ...input }),
    invalidateCache: async () => ({ status: "completed" }),
    runtimeConfig: () => ({ configured: true, publicUrl: "https://promo.example.com" }),
    dispatchOutbox: async () => ({ processed: 1, failed: 0 }),
  });
  const publishRes = response();
  await publish({ method: "POST", headers: {}, query: {}, body: {
    contractVersion: 3, requestId: "request-1", approvalId: "approval-1",
    slug: "welcome-promo", locale: "ko-KR",
  } }, publishRes);
  assert.equal(publishRes.statusCode, 201);
  assert.equal(publishRes.body.publication.publicationId, "publication-1");
  assert.equal(publishRes.body.publication.productionUrl, "https://promo.example.com/promotions/welcome-promo?locale=ko-KR");
}

async function testOutboxHandler() {
  const handler = createOutboxHandler({
    requireFlag() {}, authenticate() {}, getSql: () => "sql",
    dispatch: async () => ({ processed: 2, published: 2, failed: 0, results: [] }),
  });
  const res = response();
  await handler({ method: "POST", body: {}, headers: {}, query: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.published, 2);
}

Promise.resolve()
  .then(testRequestHandler)
  .then(testJobHandler)
  .then(testContextHandler)
  .then(testReviewAndPublicationHandlers)
  .then(testOutboxHandler)
  .then(() => console.log("Promo service V3 handlers passed"))
  .catch((error) => { console.error(error); process.exitCode = 1; });
