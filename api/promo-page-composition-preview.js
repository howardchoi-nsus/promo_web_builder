const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  fetchDocument,
  fetchProposal,
} = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { compileCurrentRegistryProposal } = require("./_promo-registry-composition-runtime");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    requireBuilderFlag("compositionV3");
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const body = parseBody(req.body);
    const documentId = String(body.documentId || "").trim();
    const proposalId = String(body.proposalId || "").trim();
    const baseDocumentRevision = Number(body.baseDocumentRevision || 0);
    if (!documentId || !proposalId) {
      return res.status(400).json({ error: "documentId and proposalId are required" });
    }
    const sql = getSql();
    const [document, proposal] = await Promise.all([
      fetchDocument(sql, documentId, owner.ownerSubject, { includeSnapshot: false }),
      fetchProposal(sql, proposalId, owner.ownerSubject, { includeSnapshots: true }),
    ]);
    if (!document || !proposal) {
      return res.status(404).json({ error: "Builder document or proposal not found" });
    }
    if (proposal.contractVersion !== 3 || proposal.status !== "ready") {
      return res.status(409).json({
        error: "Contract v3 composition proposal is not ready",
        code: "PROPOSAL_NOT_READY",
      });
    }
    if (document.document.currentDocumentRevision !== baseDocumentRevision
      || proposal.baseDocumentRevision !== baseDocumentRevision) {
      return res.status(409).json({
        error: "Builder document revision changed",
        code: "DOCUMENT_REVISION_MISMATCH",
      });
    }
    const compiled = await compileCurrentRegistryProposal({
      sql,
      proposal,
      documentId,
      documentRevision: baseDocumentRevision,
    });
    return res.status(200).json({
      ok: true,
      documentId,
      proposalId,
      documentRevision: baseDocumentRevision,
      snapshot: compiled.snapshot,
      renderFingerprint: compiled.renderFingerprint,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Composition preview failed",
      code: error.code || null,
      message: error.message,
      ...(Array.isArray(error.errors) ? { errors: error.errors } : {}),
    });
  }
};
