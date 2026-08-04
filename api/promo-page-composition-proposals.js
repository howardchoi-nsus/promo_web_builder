const { randomUUID } = require("node:crypto");
const { parseBody } = require("./_wizard-form-templates-store");
const { normalizeOverview, overviewFingerprint } = require("./_promo-overview-contract");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const {
  fetchPageCompositionCandidates,
  plannerCandidateSnapshot,
} = require("./_promo-page-composition-candidates");
const {
  fetchRegistryCompositionCandidates,
  plannerRegistryCandidateSnapshot,
} = require("./_promo-registry-composition-candidates");
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
    const registryModeRequested = body.mode === "ai-composition";
    const contractVersion = body.contractVersion == null
      ? (registryModeRequested ? 3 : 2)
      : Number(body.contractVersion);
    if (![2, 3].includes(contractVersion)) {
      return res.status(400).json({ error: "contractVersion must be 2 or 3" });
    }
    if (registryModeRequested && contractVersion !== 3) {
      return res.status(400).json({ error: "ai-composition mode requires contractVersion 3" });
    }
    const isRegistryV3 = contractVersion === 3;
    if (isRegistryV3) {
      requireBuilderFlag("compositionV3");
      if (document.document.mode !== "ai") {
        return res.status(422).json({
          error: "Contract v3 composition requires an AI Builder document",
          code: "V3_AI_DOCUMENT_REQUIRED",
        });
      }
      const shellVersionId = String(body.shellVersionId || "").trim();
      if (!shellVersionId) return res.status(400).json({ error: "shellVersionId is required for Contract v3" });
      const capabilities = Array.isArray(body.capabilities) ? body.capabilities : [];
      const registryOverview = {
        ...overview,
        locale: String(body.overview?.locale || body.locale || "").trim(),
      };
      const candidates = await fetchRegistryCompositionCandidates(sql, {
        shellVersionId,
        overview: registryOverview,
        capabilities,
      });
      if (!candidates.sections.length) {
        return res.status(422).json({
          error: "No active Registry composition candidates are available",
          code: "COMPOSITION_CANDIDATES_EMPTY",
          excluded: candidates.excluded,
        });
      }
      if (candidates.resourceIssues.some((issue) => issue.required !== false)) {
        return res.status(422).json({
          error: "Required content resources could not be resolved",
          code: "RESOURCE_POLICY_UNRESOLVED",
          issues: candidates.resourceIssues,
        });
      }
      const promptExecutionSnapshot = await createPromptExecutionSnapshot(sql, "promo_page_composer", {
        overviewJson: JSON.stringify(registryOverview),
        candidateSnapshotJson: JSON.stringify(plannerRegistryCandidateSnapshot(candidates)),
        constraintsJson: JSON.stringify({
          contractVersion: 3,
          allowTemplateSelection: false,
          allowHtml: false,
          allowCss: false,
          allowJavascript: false,
          allowRawCoordinates: false,
          allowResourceBodyGeneration: false,
          useRepeatForCollections: true,
          requirePolicyValidation: true,
        }),
      });
      const requestId = String(body.requestId || "").trim() || randomUUID();
      const proposal = await createProposal(sql, {
        contractVersion: 3,
        documentId,
        ownerSubject: owner.ownerSubject,
        requestId,
        baseDocumentRevision,
        overviewFingerprint: fingerprint,
        candidateFingerprint: candidates.candidateFingerprint,
        policyFingerprint: candidates.policyFingerprint,
        resourceFingerprint: candidates.resourceFingerprint,
        shellVersionId,
        sourceTemplateId: null,
        sourceTemplateVersion: null,
        requestSnapshot: {
          overview: registryOverview,
          capabilities,
          confirmedFieldPaths: Array.isArray(body.confirmedFieldPaths) ? body.confirmedFieldPaths : [],
          promptExecutionSnapshot,
        },
        candidateSnapshot: candidates,
        promptTemplateId: promptExecutionSnapshot.promptConfig.promptId,
        idempotencyKey,
      });
      schedule(processCompositionProposal(proposal.id, { sql }));
      return res.status(202).json({ ok: true, proposal });
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
      candidateSnapshotJson: JSON.stringify(plannerCandidateSnapshot(candidates)),
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
