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

const CANDIDATE_SCOPE_RETRY_CODES = new Set([
  "SECTION_NOT_IN_TEMPLATE",
  "COMPONENT_NOT_IN_SECTION",
]);

function retryPromptConfig(promptConfig, template) {
  return {
    ...promptConfig,
    renderedPrompt: [
      String(promptConfig?.renderedPrompt || "").trim(),
      "",
      "Correction required:",
      `Use only templateId ${template.templateId}.`,
      "Every sectionId must belong to that template.",
      "Every componentInstanceId must belong to its containing section.",
      "Return each section and component at most once.",
    ].join("\n"),
  };
}

async function generateValidatedComposition({
  candidates,
  promptConfig,
  generate = generateStructuredPlannerResult,
}) {
  let scopedCandidates = candidates;
  let scopedPromptConfig = promptConfig;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const generation = await generate({
      type: "promo_page_composer",
      schemaName: "promo_page_composition",
      schema: pageCompositionSchema(scopedCandidates),
      promptConfig: scopedPromptConfig,
    });
    try {
      return {
        generation,
        validated: validatePageCompositionProposal(generation.result, scopedCandidates),
      };
    } catch (error) {
      if (attempt > 0 || !CANDIDATE_SCOPE_RETRY_CODES.has(error.code)) throw error;
      const selectedTemplate = (candidates.templates || []).find(
        (template) => template.templateId === generation.result?.templateId,
      );
      if (!selectedTemplate) throw error;
      scopedCandidates = {
        ...candidates,
        templates: [selectedTemplate],
      };
      scopedPromptConfig = retryPromptConfig(promptConfig, selectedTemplate);
    }
  }
  throw Object.assign(new Error("Composition planner retry was exhausted"), {
    code: "COMPOSITION_RETRY_EXHAUSTED",
  });
}

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
    const { validated } = await generateValidatedComposition({
      candidates,
      promptConfig,
      generate: dependencies.generateStructuredPlannerResult || generateStructuredPlannerResult,
    });
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

module.exports = {
  generateValidatedComposition,
  processCompositionProposal,
};
