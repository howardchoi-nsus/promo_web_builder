const { parseBody } = require("./_promo-section-design-store");
const { normalizeCandidates, stableFingerprint, validateStructurePlan } = require("./_promo-section-structure-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const candidates = normalizeCandidates(body.candidates);
    if (stableFingerprint(candidates) !== String(body.candidateFingerprint || "")) {
      return res.status(409).json({ error: "Component library changed. Generate a new proposal.", code: "STRUCTURE_CANDIDATES_CHANGED" });
    }
    if (Number(body.baseDocumentRevision || 0) !== Number(body.currentDocumentRevision || 0)) {
      return res.status(409).json({ error: "Builder document revision changed", code: "DOCUMENT_REVISION_MISMATCH" });
    }
    const proposal = validateStructurePlan({ plan: body.proposal, candidates });
    return res.status(200).json({ ok: true, proposal });
  } catch (error) {
    return res.status(error.statusCode || 422).json({ error: "Section structure validation failed", message: error.message, code: error.code || null });
  }
};
