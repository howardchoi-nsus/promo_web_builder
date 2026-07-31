const { parseBody } = require("./_promo-section-design-store");
const { createStructurePlan, normalizeCandidates, stableFingerprint } = require("./_promo-section-structure-contract");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const purpose = String(body.sectionPurpose || "").trim();
    if (purpose.length < 3 || purpose.length > 1200) {
      return res.status(422).json({ error: "Section purpose must be between 3 and 1200 characters" });
    }
    const candidates = normalizeCandidates(body.candidates);
    const proposal = createStructurePlan({ purpose, candidates });
    return res.status(200).json({
      ok: true,
      proposal,
      candidateFingerprint: stableFingerprint(candidates),
      baseDocumentRevision: Number(body.baseDocumentRevision || 0),
      idempotencyKey: String(body.idempotencyKey || ""),
    });
  } catch (error) {
    return res.status(error.statusCode || 422).json({ error: "Section structure planning failed", message: error.message, code: error.code || null });
  }
};
