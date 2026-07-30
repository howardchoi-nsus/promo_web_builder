const { randomUUID } = require("node:crypto");
const { parseBody } = require("./_wizard-form-templates-store");
const { normalizeOverview, overviewFingerprint } = require("./_promo-overview-contract");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { fetchPageCompositionCandidates } = require("./_promo-page-composition-candidates");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  fetchDocument,
  fetchProposal,
  createProposal,
  cancelProposal,
} = require("./_promo-builder-document-store");
const { processCompositionProposal } = require("./_promo-page-composition-service");
const { requireBuilderFlag } = require("./_promo-builder-flags");

function schedule(work) {
  try {
    requireBuilderFlag("proposal");
    // Available in the Vercel runtime. The optional import keeps local contract
    // tests independent from the deployment package.
    const { waitUntil } = require("@vercel/functions");
    waitUntil(work);
  } catch {
    work.catch(() => {});
  }
}

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const sql = getSql();
    if (req.method === "GET") {
      const proposalId = String(req.query.proposalId || "").trim();
      if (!proposalId) return res.status(400).json({ error: "proposalId is required" });
      const proposal = await fetchProposal(sql, proposalId, owner.ownerSubject, { includeSnapshots: true });
      if (!proposal) return res.status(404).json({ error: "Composition proposal not found" });
      return res.status(200).json({ ok: true, proposal });
    }
    if (req.method === "DELETE") {
      const proposalId = String(req.query.proposalId || "").trim();
      if (!proposalId) return res.status(400).json({ error: "proposalId is required" });
      const proposal = await cancelProposal(sql, proposalId, owner.ownerSubject);
      if (!proposal) return res.status(404).json({ error: "Composition proposal not found" });
      return res.status(200).json({ ok: true, proposal });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST, DELETE");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const body = parseBody(req.body);
    const documentId = String(body.documentId || "").trim();
    const idempotencyKey = String(body.idempotencyKey || "").trim();
    if (!documentId || !idempotencyKey) {
      return res.status(400).json({ error: "documentId and idempotencyKey are required" });
    }
    const document = await fetchDocument(sql, documentId, owner.ownerSubject, { includeSnapshot: false });
    if (!document) return res.status(404).json({ error: "Builder document not found" });
    const baseDocumentRevision = Number(body.baseDocumentRevision || 0);
    if (baseDocumentRevision !== document.document.currentDocumentRevision) {
      return res.status(409).json({
        error: "Builder document revision changed",
        code: "DOCUMENT_REVISION_MISMATCH",
        currentDocumentRevision: document.document.currentDocumentRevision,
      });
    }
    const overview = normalizeOverview(body.overview || {});
    const fingerprint = overviewFingerprint(overview);
    if (String(body.overviewFingerprint || "") !== fingerprint) {
      return res.status(409).json({
        error: "Overview changed before composition planning",
        code: "OVERVIEW_FINGERPRINT_MISMATCH",
        overviewFingerprint: fingerprint,
      });
    }
    const candidates = await fetchPageCompositionCandidates(sql, {
      overview,
      selectedOptionalSectionIds: Array.isArray(body.selectedOptionalSectionIds)
        ? body.selectedOptionalSectionIds
        : [],
    });
    if (!candidates.templates.length) {
      return res.status(422).json({
        error: "No active composition candidates are available",
        code: "COMPOSITION_CANDIDATES_EMPTY",
      });
    }
    const promptExecutionSnapshot = await createPromptExecutionSnapshot(sql, "promo_page_composer", {
      overviewJson: JSON.stringify(overview),
      candidateSnapshotJson: JSON.stringify(candidates),
      constraintsJson: JSON.stringify({
        allowHtml: false,
        allowCss: false,
        allowDuplicateSections: false,
        requirePolicyValidation: true,
      }),
    });
    const requestId = String(body.requestId || "").trim() || randomUUID();
    const proposal = await createProposal(sql, {
      documentId,
      ownerSubject: owner.ownerSubject,
      requestId,
      baseDocumentRevision,
      overviewFingerprint: fingerprint,
      candidateFingerprint: candidates.candidateFingerprint,
      sourceTemplateId: candidates.templates[0]?.templateId || null,
      sourceTemplateVersion: candidates.templates[0]?.templateVersion || null,
      requestSnapshot: {
        overview,
        confirmedFieldPaths: Array.isArray(body.confirmedFieldPaths) ? body.confirmedFieldPaths : [],
        selectedOptionalSectionIds: Array.isArray(body.selectedOptionalSectionIds)
          ? body.selectedOptionalSectionIds
          : [],
        promptExecutionSnapshot,
      },
      candidateSnapshot: candidates,
      promptTemplateId: promptExecutionSnapshot.promptConfig.promptId,
      idempotencyKey,
    });
    schedule(processCompositionProposal(proposal.id, { sql }));
    return res.status(202).json({ ok: true, proposal });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict/i.test(error.message) ? 409
        : error.statusCode || 500;
    return res.status(status).json({
      error: "Composition proposal API failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
