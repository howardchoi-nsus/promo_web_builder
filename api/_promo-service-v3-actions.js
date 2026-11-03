const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { fetchDocument } = require("./_promo-builder-document-store");
const { assertPassedQualityGate } = require("./_promo-quality-gate");
const { invalidatePublicationCache } = require("./_promo-publication-cache");
const { runtimePublicConfig } = require("./_promo-runtime-public-config");
const publicationStore = require("./_promo-publication-store");
const serviceStore = require("./_promo-service-v3-store");
const { startGenerationJobV3 } = require("./_promo-generation-v3-adapter");

async function contracts() {
  return import("../packages/promo-contracts/src/service-v3.mjs");
}

function requestId(req, body = {}) {
  return String(req.query?.id || req.query?.requestId || body.requestId || "").trim();
}

function errorResponse(res, error, fallbackCode) {
  return res.status(error.statusCode || 500).json({
    error: error.message || "Promo service V3 action failed",
    code: error.code || fallbackCode,
    ...(error.validation ? { validation: error.validation } : {}),
  });
}

function common(dependencies = {}) {
  return {
    parseBody,
    resolveBuilderOwner,
    requireFlag: () => requireBuilderFlag("serviceContractV3"),
    getSql: serviceStore.getSql,
    loadContracts: contracts,
    dispatchOutbox: serviceStore.dispatchDomainOutboxV3,
    ...dependencies,
  };
}

function createFeedbackHandler(dependencies = {}) {
  const deps = common({ saveFeedback: serviceStore.savePromoRequestFeedbackV3, ...dependencies });
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      const owner = deps.resolveBuilderOwner(req, res);
      const body = deps.parseBody(req.body);
      const id = requestId(req, body);
      const feedbackText = String(body.feedbackText || body.feedback || "").trim().slice(0, 10000);
      if (!id || !feedbackText) return res.status(400).json({ error: "requestId and feedbackText are required", code: "FEEDBACK_REQUIRED" });
      const feedback = await deps.saveFeedback(deps.getSql(), {
        requestId: id,
        ownerSubject: owner.ownerSubject,
        feedbackText,
        baseDocumentRevision: Number(body.baseDocumentRevision || 0) || null,
      });
      if (!feedback) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
      await deps.dispatchOutbox(deps.getSql(), { limit: 50 }).catch(() => null);
      return res.status(201).json({ ok: true, contractVersion: 3, feedback });
    } catch (error) { return errorResponse(res, error, "PROMO_FEEDBACK_V3_FAILED"); }
  };
}

function createCancelHandler(dependencies = {}) {
  const deps = common({ cancelRequest: serviceStore.cancelPromoRequestV3, ...dependencies });
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      const owner = deps.resolveBuilderOwner(req, res);
      const body = deps.parseBody(req.body);
      const id = requestId(req, body);
      if (!id) return res.status(400).json({ error: "requestId is required", code: "REQUEST_ID_REQUIRED" });
      const request = await deps.cancelRequest(deps.getSql(), {
        requestId: id,
        ownerSubject: owner.ownerSubject,
        reason: String(body.reason || "").slice(0, 500),
      });
      if (!request) return res.status(409).json({ error: "Promo request cannot be cancelled", code: "PROMO_REQUEST_NOT_CANCELLABLE" });
      await deps.dispatchOutbox(deps.getSql(), { limit: 50 }).catch(() => null);
      return res.status(200).json({ ok: true, contractVersion: 3, request });
    } catch (error) { return errorResponse(res, error, "PROMO_CANCEL_V3_FAILED"); }
  };
}

function createRegenerateHandler(dependencies = {}) {
  const deps = common({
    saveFeedback: serviceStore.savePromoRequestFeedbackV3,
    createGenerationJob: serviceStore.createGenerationJobV3,
    startGeneration: startGenerationJobV3,
    ...dependencies,
  });
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      const owner = deps.resolveBuilderOwner(req, res);
      const body = deps.parseBody(req.body);
      const id = requestId(req, body);
      const feedbackText = String(body.feedbackText || body.feedback || "").trim().slice(0, 10000);
      if (!id || !feedbackText) return res.status(400).json({ error: "requestId and feedbackText are required", code: "FEEDBACK_REQUIRED" });
      const sql = deps.getSql();
      const feedback = await deps.saveFeedback(sql, {
        requestId: id,
        ownerSubject: owner.ownerSubject,
        feedbackText,
        baseDocumentRevision: Number(body.baseDocumentRevision || 0) || null,
      });
      if (!feedback) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
      const { assertGenerationJobV3 } = await deps.loadContracts();
      const contract = assertGenerationJobV3({
        contractVersion: 3,
        requestId: id,
        pipeline: body.pipeline || "composition",
        inputSnapshot: { ...(body.inputSnapshot || {}), feedback: { feedbackText, feedbackId: feedback.feedbackId } },
      });
      const result = await deps.createGenerationJob(sql, {
        requestId: id,
        pipeline: contract.pipeline,
        inputSnapshot: contract.inputSnapshot,
        idempotencyKey: String(req.headers?.["idempotency-key"] || body.idempotencyKey || feedback.feedbackId),
      });
      if (!result.job) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
      let execution = null;
      if (result.created) execution = await deps.startGeneration(sql, { job: result.job, inputSnapshot: contract.inputSnapshot, req });
      if (execution && !execution.ok) return res.status(execution.statusCode || 502).json({ error: execution.error, code: "WORKER_TRIGGER_FAILED", job: result.job });
      await deps.dispatchOutbox(sql, { limit: 50 }).catch(() => null);
      return res.status(result.created ? 202 : 200).json({
        ok: true, contractVersion: 3, feedback,
        job: { ...result.job, ...(execution?.legacyRunId ? { legacyRunId: execution.legacyRunId, status: "queued" } : {}) },
        execution,
      });
    } catch (error) { return errorResponse(res, error, "PROMO_REGENERATE_V3_FAILED"); }
  };
}

function createReviewHandler(dependencies = {}) {
  const deps = common({
    findRequest: serviceStore.findPromoRequestV3,
    fetchDocument,
    assertQualityGate: assertPassedQualityGate,
    saveApproval: serviceStore.savePromotionApprovalV3,
    ...dependencies,
  });
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      const owner = deps.resolveBuilderOwner(req, res);
      const body = deps.parseBody(req.body);
      const id = requestId(req, body);
      const decision = String(body.decision || "").trim().toLowerCase();
      const documentRevision = Number(body.documentRevision || 0);
      const sql = deps.getSql();
      const request = await deps.findRequest(sql, { requestId: id, ownerSubject: owner.ownerSubject });
      if (!request) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
      const document = await deps.fetchDocument(sql, request.documentId, owner.ownerSubject);
      if (!document || document.document.currentDocumentRevision !== documentRevision) {
        return res.status(409).json({ error: "Current document revision does not match", code: "DOCUMENT_REVISION_MISMATCH" });
      }
      if (decision === "approved") deps.assertQualityGate(document.snapshot, documentRevision);
      const { assertPromotionApprovalV3 } = await deps.loadContracts();
      const contract = assertPromotionApprovalV3({
        contractVersion: 3,
        requestId: id,
        documentId: request.documentId,
        documentRevision,
        decision,
        decidedBy: owner.ownerSubject,
        comment: body.comment,
        snapshotHash: document.version?.snapshot_hash || "",
      });
      const approval = await deps.saveApproval(sql, { ...contract, ownerSubject: owner.ownerSubject });
      if (!approval) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
      await deps.dispatchOutbox(sql, { limit: 50 }).catch(() => null);
      return res.status(201).json({ ok: true, contractVersion: 3, approval });
    } catch (error) { return errorResponse(res, error, "PROMO_REVIEW_V3_FAILED"); }
  };
}

function createPublicationHandler(dependencies = {}) {
  const deps = common({
    findRequest: serviceStore.findPromoRequestV3,
    findApproval: serviceStore.findPromotionApprovalV3,
    findRevision: publicationStore.findOwnedDocumentRevision,
    saveLegacyPublication: publicationStore.savePublication,
    saveSnapshot: serviceStore.savePublicationSnapshotV3,
    assertQualityGate: assertPassedQualityGate,
    invalidateCache: invalidatePublicationCache,
    runtimeConfig: runtimePublicConfig,
    ...dependencies,
  });
  return async function handler(req, res) {
    try {
      deps.requireFlag();
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
      const owner = deps.resolveBuilderOwner(req, res);
      const body = deps.parseBody(req.body);
      const { assertPublicationCommandV3 } = await deps.loadContracts();
      const command = assertPublicationCommandV3({ ...body, contractVersion: body.contractVersion });
      const sql = deps.getSql();
      const request = await deps.findRequest(sql, { requestId: command.requestId, ownerSubject: owner.ownerSubject });
      if (!request) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
      const approval = await deps.findApproval(sql, {
        approvalId: command.approvalId,
        requestId: command.requestId,
        ownerSubject: owner.ownerSubject,
      });
      if (!approval) return res.status(409).json({ error: "Approved revision is required", code: "APPROVAL_REQUIRED" });
      const revision = await deps.findRevision(sql, {
        documentId: approval.documentId,
        documentRevision: approval.documentRevision,
        ownerSubject: owner.ownerSubject,
      });
      if (!revision || revision.snapshot_hash !== approval.snapshotHash) {
        return res.status(409).json({ error: "Approved snapshot no longer matches", code: "APPROVED_SNAPSHOT_MISMATCH" });
      }
      deps.assertQualityGate(revision.snapshot_json, approval.documentRevision);
      const legacy = await deps.saveLegacyPublication(sql, {
        documentId: approval.documentId,
        documentRevision: approval.documentRevision,
        slug: command.slug,
        locale: command.locale,
        status: "published",
        seo: command.seo,
        manifest: command.manifest,
        revalidateSeconds: command.revalidateSeconds,
        ownerSubject: owner.ownerSubject,
      });
      if (!legacy) return res.status(404).json({ error: "Builder document revision not found", code: "DOCUMENT_NOT_FOUND" });
      const runtime = deps.runtimeConfig();
      const productionUrl = runtime.configured
        ? new URL(`/promotions/${command.slug}?locale=${encodeURIComponent(command.locale)}`, runtime.publicUrl).href
        : "";
      const publication = await deps.saveSnapshot(sql, {
        requestId: command.requestId,
        approvalId: approval.approvalId,
        promotionId: approval.promotionId,
        documentId: approval.documentId,
        documentRevision: approval.documentRevision,
        slug: command.slug,
        locale: command.locale,
        snapshot: revision.snapshot_json,
        snapshotHash: revision.snapshot_hash,
        productionUrl,
      });
      const cacheInvalidation = await deps.invalidateCache({
        slug: command.slug,
        locale: command.locale,
        reason: "publication_v3_published",
      });
      await deps.dispatchOutbox(sql, { limit: 50 }).catch(() => null);
      return res.status(cacheInvalidation.status === "failed" ? 202 : 201).json({
        ok: true,
        contractVersion: 3,
        publication,
        legacyPublication: legacy,
        cacheInvalidation,
      });
    } catch (error) { return errorResponse(res, error, "PUBLICATION_V3_FAILED"); }
  };
}

module.exports = {
  createFeedbackHandler,
  createCancelHandler,
  createRegenerateHandler,
  createReviewHandler,
  createPublicationHandler,
};
