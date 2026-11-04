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
const { compileRegistryComposition } = require("./_promo-registry-composition-compiler");
const {
  computeStructureFingerprint,
  assertWireframeProof,
} = require("./_promo-builder-chat-workspace-contract");
const {
  fetchConfirmedWireframe,
  completeSession,
} = require("./_promo-builder-chat-workspace-store");

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
    const chatSessionId = String(body.chatSessionId || "").trim();
    const confirmedWireframeRevision = Number(body.confirmedWireframeRevision || 0);
    let confirmedWireframe = null;
    if (chatSessionId || confirmedWireframeRevision || body.structureFingerprint) {
      requireBuilderFlag("chatWorkspaceV1");
      if (!chatSessionId || !confirmedWireframeRevision || !String(body.structureFingerprint || "").trim()) {
        return res.status(400).json({
          error: "chatSessionId, confirmedWireframeRevision and structureFingerprint are required together",
          code: "WIREFRAME_PROOF_INCOMPLETE",
        });
      }
      confirmedWireframe = await fetchConfirmedWireframe(sql, {
        sessionId: chatSessionId,
        ownerSubject: owner.ownerSubject,
        revision: confirmedWireframeRevision,
      });
      assertWireframeProof({
        confirmed: confirmedWireframe,
        documentId,
        proposalId,
        baseDocumentRevision,
        fingerprint: computeStructureFingerprint(proposal.snapshot),
      });
      if (confirmedWireframe.structureFingerprint !== String(body.structureFingerprint)) {
        return res.status(409).json({
          error: "Wireframe fingerprint changed",
          code: "WIREFRAME_FINGERPRINT_MISMATCH",
        });
      }
    }
    if (proposal.contractVersion === 3) {
      requireBuilderFlag("compositionV3");
      const currentCandidates = await fetchRegistryCompositionCandidates(sql, {
        shellVersionId: proposal.shellVersionId,
        overview: proposal.requestSnapshot.overview,
        capabilities: proposal.requestSnapshot.capabilities || [],
        designReferenceId: proposal.requestSnapshot.designReferenceId || "",
        recentLayoutSelections: proposal.requestSnapshot.recentLayoutSelections || {},
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
      const compiledSnapshot = await compileRegistryComposition({
        sql,
        proposalSnapshot: proposal.snapshot,
        candidates: currentCandidates,
        overview: proposal.requestSnapshot.overview,
        documentId,
        proposalId,
        documentRevision: baseDocumentRevision,
      });
      if (confirmedWireframe
        && computeStructureFingerprint(compiledSnapshot) !== confirmedWireframe.structureFingerprint) {
        return res.status(409).json({
          error: "Compiled design structure differs from the confirmed Wireframe",
          code: "FINAL_STRUCTURE_MISMATCH",
        });
      }
      const applied = await applyProposal(sql, {
        contractVersion: 3,
        documentId,
        proposalId,
        ownerSubject: owner.ownerSubject,
        baseDocumentRevision,
        overviewFingerprint: proposal.overviewFingerprint,
        candidateFingerprint: proposal.candidateFingerprint,
        policyFingerprint: proposal.policyFingerprint,
        resourceFingerprint: proposal.resourceFingerprint,
        shellVersionId: proposal.shellVersionId,
        snapshot: compiledSnapshot,
        changeNote: "AI Registry composition v3 applied.",
      });
      const { assetJobs, assetWarning } = await enqueueAndScheduleBuilderAssetJobs(sql, {
        documentId,
        documentRevision: applied.revision,
        snapshot: applied.snapshot,
      });
      let sessionWarning = null;
      if (chatSessionId) {
        try {
          await completeSession(sql, { sessionId: chatSessionId, ownerSubject: owner.ownerSubject });
        } catch (sessionError) {
          console.error("[promo-page-composition-apply] chat session completion failed", {
            chatSessionId,
            message: sessionError.message,
          });
          sessionWarning = {
            code: "CHAT_SESSION_COMPLETION_DELAYED",
            message: "The design was applied, but chat session completion will require reconciliation.",
          };
        }
      }
      return res.status(200).json({
        ok: true,
        documentId,
        revision: applied.revision,
        snapshot: applied.snapshot,
        assetJobs,
        assetWarning,
        warnings: [assetWarning, sessionWarning].filter(Boolean),
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
    let sessionWarning = null;
    if (chatSessionId) {
      try {
        await completeSession(sql, { sessionId: chatSessionId, ownerSubject: owner.ownerSubject });
      } catch (sessionError) {
        console.error("[promo-page-composition-apply] chat session completion failed", {
          chatSessionId,
          message: sessionError.message,
        });
        sessionWarning = {
          code: "CHAT_SESSION_COMPLETION_DELAYED",
          message: "The design was applied, but chat session completion will require reconciliation.",
        };
      }
    }
    return res.status(200).json({
      ok: true,
      documentId,
      revision: applied.revision,
      snapshot: applied.snapshot,
      assetJobs,
      assetWarning,
      warnings: [assetWarning, sessionWarning].filter(Boolean),
    });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict|not ready/i.test(error.message) ? 409
        : error.statusCode || 500;
    console.error("[promo-page-composition-apply] failed", {
      code: error.code || null,
      status,
      message: error.message,
      errors: Array.isArray(error.errors) ? error.errors.slice(0, 10) : [],
    });
    return res.status(status).json({
      error: "Composition apply failed",
      code: error.code || null,
      message: error.message,
      ...(Array.isArray(error.errors) ? { errors: error.errors } : {}),
    });
  }
};
