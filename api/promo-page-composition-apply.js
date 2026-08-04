const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  fetchDocument,
  fetchProposal,
  applyProposal,
} = require("./_promo-builder-document-store");
const { fetchPageCompositionCandidates } = require("./_promo-page-composition-candidates");
const { fetchRegistryCompositionCandidates } = require("./_promo-registry-composition-candidates");
const {
  enqueueAndScheduleBuilderAssetJobs,
} = require("./_promo-builder-assets");
const { requireBuilderFlag } = require("./_promo-builder-flags");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    requireBuilderFlag("apply");
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const body = parseBody(req.body);
    const documentId = String(body.documentId || "").trim();
    const proposalId = String(body.proposalId || "").trim();
    const baseDocumentRevision = Number(body.baseDocumentRevision || 0);
    if (!documentId || !proposalId || !String(body.idempotencyKey || "").trim()) {
      return res.status(400).json({ error: "documentId, proposalId and idempotencyKey are required" });
    }
    const sql = getSql();
    const [document, proposal] = await Promise.all([
      fetchDocument(sql, documentId, owner.ownerSubject, { includeSnapshot: false }),
      fetchProposal(sql, proposalId, owner.ownerSubject, { includeSnapshots: true }),
    ]);
    if (!document || !proposal) return res.status(404).json({ error: "Builder document or proposal not found" });
    if (proposal.status !== "ready") {
      return res.status(409).json({ error: "Composition proposal is not ready", code: "PROPOSAL_NOT_READY" });
    }
    if (document.document.currentDocumentRevision !== baseDocumentRevision
      || proposal.baseDocumentRevision !== baseDocumentRevision) {
      return res.status(409).json({ error: "Builder document revision changed", code: "DOCUMENT_REVISION_MISMATCH" });
    }
    if (proposal.contractVersion === 3) {
      requireBuilderFlag("compositionV3");
      const currentCandidates = await fetchRegistryCompositionCandidates(sql, {
        shellVersionId: proposal.shellVersionId,
        overview: proposal.requestSnapshot.overview,
        capabilities: proposal.requestSnapshot.capabilities || [],
      });
      if (currentCandidates.candidateFingerprint !== proposal.candidateFingerprint) {
        return res.status(409).json({
          error: "Registry candidates changed",
          code: "CANDIDATE_FINGERPRINT_MISMATCH",
        });
      }
      if (currentCandidates.policyFingerprint !== proposal.policyFingerprint) {
        return res.status(409).json({
          error: "Registry composition policy changed",
          code: "POLICY_FINGERPRINT_MISMATCH",
        });
      }
      if (currentCandidates.resourceFingerprint !== proposal.resourceFingerprint) {
        return res.status(409).json({
          error: "Pinned content resources changed",
          code: "RESOURCE_FINGERPRINT_MISMATCH",
        });
      }
      return res.status(409).json({
        error: "Contract v3 proposal preview is ready, but Builder compilation is not enabled yet",
        code: "V3_COMPOSITION_COMPILER_NOT_READY",
        proposalId: proposal.id,
        snapshot: proposal.snapshot,
      });
    }
    const currentCandidates = await fetchPageCompositionCandidates(sql, {
      overview: proposal.requestSnapshot.overview,
      selectedOptionalSectionIds: proposal.requestSnapshot.selectedOptionalSectionIds || [],
    });
    if (currentCandidates.candidateFingerprint !== proposal.candidateFingerprint) {
      return res.status(409).json({
        error: "Available templates, components or policies changed",
        code: "CANDIDATE_FINGERPRINT_MISMATCH",
      });
    }
    const applied = await applyProposal(sql, {
      documentId,
      proposalId,
      ownerSubject: owner.ownerSubject,
      baseDocumentRevision,
      snapshot: proposal.snapshot,
      changeNote: "AI page composition applied.",
    });
    const { assetJobs, assetWarning } = await enqueueAndScheduleBuilderAssetJobs(sql, {
      documentId,
      documentRevision: applied.revision,
      snapshot: applied.snapshot,
    });
    return res.status(200).json({
      ok: true,
      documentId,
      revision: applied.revision,
      snapshot: applied.snapshot,
      assetJobs,
      assetWarning,
      warnings: assetWarning ? [assetWarning] : [],
    });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict|not ready/i.test(error.message) ? 409
        : error.statusCode || 500;
    return res.status(status).json({
      error: "Composition apply failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
