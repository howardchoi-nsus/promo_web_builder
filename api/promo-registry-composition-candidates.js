const { parseBody } = require("./_wizard-form-templates-store");
const { normalizeOverview } = require("./_promo-overview-contract");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const {
  fetchRegistryCompositionCandidates,
} = require("./_promo-registry-composition-candidates");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    requireBuilderFlag("compositionV3");
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const shellVersionId = String(body.shellVersionId || "").trim();
    if (!shellVersionId) return res.status(400).json({ error: "shellVersionId is required" });
    const requestedLimit = Number(body.sectionLimit || 40);
    const overview = {
      ...normalizeOverview(body.overview || {}),
      locale: String(body.overview?.locale || body.locale || "").trim(),
    };
    const candidates = await fetchRegistryCompositionCandidates(getSql(), {
      shellVersionId,
      overview,
      capabilities: Array.isArray(body.capabilities) ? body.capabilities : [],
      sectionLimit: Math.max(1, Math.min(100, Number.isFinite(requestedLimit) ? requestedLimit : 40)),
    });
    if (!candidates.sections.length) {
      return res.status(422).json({
        error: "No active Registry composition candidates are available",
        code: "COMPOSITION_CANDIDATES_EMPTY",
        candidateFingerprint: candidates.candidateFingerprint,
        excluded: candidates.excluded,
      });
    }
    if (candidates.resourceIssues.some((issue) => issue.required !== false)) {
      return res.status(422).json({
        error: "Required content resources could not be resolved",
        code: "RESOURCE_POLICY_UNRESOLVED",
        candidateFingerprint: candidates.candidateFingerprint,
        resourceFingerprint: candidates.resourceFingerprint,
        issues: candidates.resourceIssues,
      });
    }
    return res.status(200).json({ ok: true, candidates });
  } catch (error) {
    const status = error.code === "22P02" ? 400 : error.statusCode || 500;
    return res.status(status).json({
      error: "Registry composition candidates API failed",
      code: error.code || null,
      message: error.message,
      sectionKey: error.sectionKey || null,
      sectionVersionId: error.sectionVersionId || null,
      reasonCodes: error.reasonCodes || [],
    });
  }
};
