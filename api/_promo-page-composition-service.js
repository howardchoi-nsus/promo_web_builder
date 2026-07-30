const {
  acquireProposalLease,
  completeProposal,
  failProposal,
  getSql,
} = require("./_promo-builder-document-store");
const {
  pageCompositionSchema,
  validatePageCompositionProposal,
  normalizePageComposition,
} = require("./_promo-page-composition-contract");
const { generateStructuredPlannerResult } = require("./_promo-section-design-provider");

async function processCompositionProposal(proposalId, dependencies = {}) {
  const sql = dependencies.sql || getSql();
  const acquired = await acquireProposalLease(sql, proposalId);
  if (!acquired) return { ok: false, skipped: true };
  const { row, leaseToken } = acquired;
  try {
    const request = row.request_snapshot || {};
    const candidates = row.candidate_snapshot || {};
    const promptConfig = request.promptExecutionSnapshot?.promptConfig;
    if (!promptConfig) throw Object.assign(new Error("Pinned prompt snapshot is missing"), { code: "PROMPT_SNAPSHOT_MISSING" });
    const generation = await (dependencies.generateStructuredPlannerResult || generateStructuredPlannerResult)({
      type: "promo_page_composer",
      schemaName: "promo_page_composition",
      schema: pageCompositionSchema(candidates),
      promptConfig,
    });
    const validated = validatePageCompositionProposal(generation.result, candidates);
    const snapshot = normalizePageComposition({
      validated,
      overview: request.overview,
      documentId: row.document_id,
      documentRevision: Number(row.base_document_revision || 0),
      proposalId: row.id,
      overviewFingerprint: row.overview_fingerprint,
      candidateFingerprint: row.candidate_fingerprint,
      promptExecutionSnapshot: promptConfig,
    });
    const warnings = snapshot.validation.warnings || [];
    const validation = {
      ok: true,
      autoApplicable: warnings.length === 0,
      errors: [],
      warnings,
    };
    const completed = await completeProposal(sql, {
      proposalId: row.id,
      leaseToken,
      snapshot,
      validation,
    });
    return { ok: Boolean(completed), proposalId: row.id, status: completed ? "ready" : "cancelled" };
  } catch (error) {
    await failProposal(sql, {
      proposalId: row.id,
      leaseToken,
      errorCode: error.code || "COMPOSITION_PROCESS_FAILED",
      errorMessage: error.message,
      retryable: Boolean(error.retryable),
    });
    return { ok: false, proposalId: row.id, error: error.message, code: error.code || null };
  }
}

module.exports = { processCompositionProposal };
