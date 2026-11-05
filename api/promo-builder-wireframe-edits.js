const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { fetchProposal } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { applyWireframeEdits } = require("./_promo-builder-wireframe-edits");
const {
  computeStructureFingerprint,
  projectWireframeStructure,
} = require("./_promo-builder-chat-workspace-contract");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, fetchProposal, requireBuilderFlag,
    applyWireframeEdits, updateWireframeDraft: store.updateWireframeDraft, ...deps,
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
      const sessionId = String(body.sessionId || "").trim();
      const documentId = String(body.documentId || "").trim();
      const proposalId = String(body.proposalId || "").trim();
      const baseDocumentRevision = Number(body.baseDocumentRevision);
      const wireframeRevision = Number(body.wireframeRevision);
      const expectedStructureFingerprint = String(body.structureFingerprint || "").trim();
      if (!sessionId || !documentId || !proposalId || !Array.isArray(body.edits)
        || !Number.isInteger(baseDocumentRevision) || baseDocumentRevision < 0
        || !Number.isInteger(wireframeRevision) || wireframeRevision < 1
        || !expectedStructureFingerprint) {
        return res.status(400).json({
          error: "sessionId, documentId, proposalId, revisions, structureFingerprint and edits are required",
        });
      }
      const sql = use.getSql();
      const proposal = await use.fetchProposal(sql, proposalId, owner.ownerSubject, { includeSnapshots: true });
      if (!proposal || proposal.documentId !== documentId) {
        return res.status(404).json({ error: "Wireframe proposal not found" });
      }
      if (proposal.status !== "ready" || proposal.baseDocumentRevision !== baseDocumentRevision) {
        return res.status(409).json({ error: "Wireframe proposal is stale", code: "WIREFRAME_CONTEXT_STALE" });
      }
      const edited = use.applyWireframeEdits(proposal, body.edits);
      const structure = projectWireframeStructure(edited.snapshot);
      const structureFingerprint = computeStructureFingerprint(edited.snapshot);
      const wireframe = await use.updateWireframeDraft(sql, {
        sessionId, ownerSubject: owner.ownerSubject, documentId, proposalId,
        baseDocumentRevision, wireframeRevision, expectedStructureFingerprint,
        snapshot: edited.snapshot, requestSnapshot: edited.requestSnapshot,
        structure, structureFingerprint,
      });
      if (!wireframe) {
        return res.status(409).json({ error: "Wireframe draft could not be updated", code: "WIREFRAME_CONTEXT_STALE" });
      }
      return res.status(200).json({
        ok: true,
        proposal: { ...proposal, snapshot: edited.snapshot, requestSnapshot: edited.requestSnapshot },
        wireframe,
        overview: edited.requestSnapshot.overview || {},
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || null,
        details: error.details,
      });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
