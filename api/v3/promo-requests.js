const { randomUUID } = require("node:crypto");
const { parseBody } = require("../_wizard-form-templates-store");
const { resolveBuilderOwner } = require("../_promo-builder-auth");
const { requireBuilderFlag } = require("../_promo-builder-flags");
const { createDocument } = require("../_promo-builder-document-store");
const store = require("../_promo-service-v3-store");

async function serviceContracts() {
  return import("../../packages/promo-contracts/src/service-v3.mjs");
}

function createHandler(dependencies = {}) {
  const deps = {
    parseBody,
    resolveBuilderOwner,
    requireFlag: () => requireBuilderFlag("serviceContractV3"),
    getSql: store.getSql,
    createPromoRequest: store.createPromoRequestV3,
    attachDocument: store.attachDocumentToRequestV3,
    findPromoRequest: store.findPromoRequestV3,
    listPromoRequests: store.listPromoRequestsV3,
    createDocument,
    dispatchOutbox: store.dispatchDomainOutboxV3,
    loadContracts: serviceContracts,
    ...dependencies,
  };

  return async function handler(req, res) {
    try {
      deps.requireFlag();
      res.setHeader("Cache-Control", "no-store");
      const owner = deps.resolveBuilderOwner(req, res);
      const sql = deps.getSql();
      if (req.method === "POST") {
        const body = deps.parseBody(req.body);
        const { assertPromoRequestV3 } = await deps.loadContracts();
        const contract = assertPromoRequestV3({
          ...body,
          requestedBy: owner.ownerSubject,
          status: "requested",
        });
        const idempotencyKey = String(
          req.headers?.["idempotency-key"] || body.idempotencyKey || randomUUID(),
        ).trim().slice(0, 200);
        const result = await deps.createPromoRequest(sql, {
          ownerSubject: owner.ownerSubject,
          idempotencyKey,
          channel: contract.channel,
          brief: contract.brief,
          references: contract.references,
        });
        let request = result.request;
        if (result.created && !request.documentId) {
          const document = await deps.createDocument(sql, {
            ownerSubject: owner.ownerSubject,
            mode: "ai",
            idempotencyKey: `service-v3:${request.requestId}`,
          });
          request = await deps.attachDocument(sql, {
            requestId: request.requestId,
            ownerSubject: owner.ownerSubject,
            documentId: document.id,
          });
        }
        await deps.dispatchOutbox(sql, { limit: 50 }).catch(() => null);
        return res.status(result.created ? 201 : 200).json({
          ok: true,
          contractVersion: 3,
          idempotentReplay: !result.created,
          request,
        });
      }
      if (req.method === "GET") {
        const requestId = String(req.query?.id || req.query?.requestId || "").trim();
        if (requestId) {
          const request = await deps.findPromoRequest(sql, { requestId, ownerSubject: owner.ownerSubject });
          if (!request) return res.status(404).json({ error: "Promo request not found", code: "PROMO_REQUEST_NOT_FOUND" });
          return res.status(200).json({ ok: true, contractVersion: 3, request });
        }
        const requests = await deps.listPromoRequests(sql, {
          ownerSubject: owner.ownerSubject,
          limit: req.query?.limit,
        });
        return res.status(200).json({ ok: true, contractVersion: 3, requests });
      }
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || "Promo request V3 API failed",
        code: error.code || "PROMO_REQUEST_V3_FAILED",
        ...(error.validation ? { validation: error.validation } : {}),
      });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
