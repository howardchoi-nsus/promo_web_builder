const {
  acquireProposalLease,
  completeProposal,
  failProposal,
  getSql,
  setProposalStage,
} = require("./_promo-builder-document-store");
const {
  pageCompositionSchema,
  validatePageCompositionProposal,
  normalizePageComposition,
} = require("./_promo-page-composition-contract");
const {
  registryCompositionSchema,
  validateRegistryCompositionProposal,
  normalizeRegistryCompositionProposal,
} = require("./_promo-registry-composition-contract");
const { generateStructuredPlannerResult } = require("./_promo-section-design-provider");
const { sha256 } = require("./_prompt-template-store");
const { applyLayoutFitRecommendations } = require("./_promo-layout-fit");

const CANDIDATE_SCOPE_RETRY_CODES = new Set([
  "SECTION_NOT_IN_TEMPLATE",
  "COMPONENT_NOT_IN_SECTION",
]);

function retryPromptConfig(promptConfig, template) {
  const repairPrompt = renderRepairPrompt(promptConfig, "candidateScope", {
    templateId: template.templateId,
  });
  const renderedPrompt = `${String(promptConfig?.renderedPrompt || "").trim()}\n${repairPrompt}`;
  return {
    ...promptConfig,
    renderedPrompt,
    renderedPromptHash: sha256(renderedPrompt),
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

function registryRetryPromptConfig(promptConfig, candidates, error) {
  const repairPrompt = renderRepairPrompt(promptConfig, "contractV3", {
    errorCode: error.code || "INVALID_COMPOSITION",
    errorMessage: error.message,
    shellVersionId: candidates.shell?.shellVersionId || "",
    sectionVersionIds: (candidates.sections || []).map((item) => item.sectionVersionId).join(", "),
  });
  const renderedPrompt = `${String(promptConfig?.renderedPrompt || "").trim()}\n${repairPrompt}`;
  return {
    ...promptConfig,
    renderedPrompt,
    renderedPromptHash: sha256(renderedPrompt),
  };
}

function renderRepairPrompt(promptConfig, key, variables) {
  const template = String(promptConfig?.promptLayers?.repairPrompts?.[key] || "").trim();
  if (!template) {
    throw Object.assign(new Error(`Active prompt is missing repair prompt: ${key}`), {
      code: "PROMPT_LAYER_REQUIRED",
      statusCode: 409,
    });
  }
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, variable) => (
    Object.prototype.hasOwnProperty.call(variables, variable) ? String(variables[variable] ?? "") : match
  ));
}

async function generateValidatedRegistryComposition({
  candidates,
  promptConfig,
  generate = generateStructuredPlannerResult,
  onStage = async () => {},
}) {
  let currentPrompt = promptConfig;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await onStage(attempt === 0 ? "validating" : "repairing");
    const generation = await generate({
      type: "promo_page_composer",
      schemaName: "promo_registry_composition_v3",
      schema: registryCompositionSchema(candidates),
      promptConfig: currentPrompt,
    });
    try {
      const layoutFit = applyLayoutFitRecommendations(generation.result, candidates);
      return {
        generation: { ...generation, result: layoutFit.result },
        validated: validateRegistryCompositionProposal(layoutFit.result, candidates),
        repaired: attempt > 0 || layoutFit.repairs.length > 0,
        layoutFitRepairs: layoutFit.repairs,
      };
    } catch (error) {
      if (attempt > 0 || error.retryable === false) throw error;
      currentPrompt = registryRetryPromptConfig(promptConfig, candidates, error);
    }
  }
  throw Object.assign(new Error("Registry composition repair was exhausted"), {
    code: "COMPOSITION_REPAIR_EXHAUSTED",
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
    const isRegistryV3 = Number(row.contract_version || 2) === 3;
    const generation = isRegistryV3
      ? await generateValidatedRegistryComposition({
        candidates,
        promptConfig,
        generate: dependencies.generateStructuredPlannerResult || generateStructuredPlannerResult,
        onStage: (stage) => setProposalStage(sql, {
          proposalId: row.id,
          leaseToken,
          stage,
        }),
      })
      : await generateValidatedComposition({
        candidates,
        promptConfig,
        generate: dependencies.generateStructuredPlannerResult || generateStructuredPlannerResult,
      });
    const snapshot = isRegistryV3
      ? normalizeRegistryCompositionProposal({
        validated: generation.validated,
        documentId: row.document_id,
        documentRevision: Number(row.base_document_revision || 0),
        proposalId: row.id,
        overviewFingerprint: row.overview_fingerprint,
        candidateFingerprint: row.candidate_fingerprint,
        policyFingerprint: row.policy_fingerprint,
        resourceFingerprint: row.resource_fingerprint,
        promptExecutionSnapshot: promptConfig,
      })
      : normalizePageComposition({
        validated: generation.validated,
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
      autoApplicable: isRegistryV3 || warnings.length === 0,
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
  generateValidatedRegistryComposition,
  processCompositionProposal,
};
