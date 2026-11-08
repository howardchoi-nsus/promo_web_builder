const { fetchRegistryCompositionCandidates } = require("./_promo-registry-composition-candidates");
const { compileRegistryComposition } = require("./_promo-registry-composition-compiler");

function conflict(message, code) {
  return Object.assign(new Error(message), { code, statusCode: 409 });
}

async function compileCurrentRegistryProposal({
  sql,
  proposal,
  documentId,
  documentRevision,
}) {
  const currentCandidates = await fetchRegistryCompositionCandidates(sql, {
    shellVersionId: proposal.shellVersionId,
    overview: proposal.requestSnapshot.overview,
    capabilities: proposal.requestSnapshot.capabilities || [],
    designReferenceId: proposal.requestSnapshot.designReferenceId || "",
    layoutReferenceId: proposal.requestSnapshot.layoutReferenceId || "",
    recentLayoutSelections: proposal.requestSnapshot.recentLayoutSelections || {},
  });
  if (currentCandidates.candidateFingerprint !== proposal.candidateFingerprint) {
    throw conflict("Registry candidates changed", "CANDIDATE_FINGERPRINT_MISMATCH");
  }
  if (currentCandidates.policyFingerprint !== proposal.policyFingerprint) {
    throw conflict("Registry composition policy changed", "POLICY_FINGERPRINT_MISMATCH");
  }
  if (currentCandidates.resourceFingerprint !== proposal.resourceFingerprint) {
    throw conflict("Pinned content resources changed", "RESOURCE_FINGERPRINT_MISMATCH");
  }
  return compileRegistryComposition({
    sql,
    proposalSnapshot: proposal.snapshot,
    candidates: currentCandidates,
    overview: proposal.requestSnapshot.overview,
    documentId,
    proposalId: proposal.id,
    documentRevision,
  });
}

module.exports = {
  compileCurrentRegistryProposal,
};
