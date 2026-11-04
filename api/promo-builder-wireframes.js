const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag,
    saveWireframeRevision: store.saveWireframeRevision, ...deps,
  };
  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    try {
      use.requireBuilderFlag("chatWorkspaceV1");
      res.setHeader("Cache-Control", "no-store");
      const owner = use.resolveBuilderOwner(req, res);
      const body = use.parseBody(req.body);
      const required = ["sessionId", "documentId", "proposalId"].every((key) => String(body[key] || "").trim());
      if (!required || !body.snapshot) return res.status(400).json({ error: "sessionId, documentId, proposalId and snapshot are required" });
      const wireframe = await use.saveWireframeRevision(use.getSql(), {
        sessionId: body.sessionId,
        ownerSubject: owner.ownerSubject,
        documentId: body.documentId,
        proposalId: body.proposalId,
        baseDocumentRevision: Number(body.baseDocumentRevision || 0),
        snapshot: body.snapshot,
      });
      if (!wireframe) return res.status(409).json({ error: "Wireframe could not be saved", code: "WIREFRAME_CONTEXT_STALE" });
      return res.status(201).json({ ok: true, wireframe });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
