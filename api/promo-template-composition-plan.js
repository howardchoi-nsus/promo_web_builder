const { randomUUID } = require("node:crypto");
const {
  getSql, parseBody, fetchTemplates, fetchTemplateSections,
} = require("./_wizard-form-templates-store");
const { fetchItemsForSection } = require("./_wizard-content-sections-store");
const { normalizeOverview, overviewFingerprint } = require("./_promo-overview-contract");
const {
  ALLOWED_OVERVIEW_PATHS,
  compositionSchema,
  validateCompositionProposal,
} = require("./_promo-template-composition-contract");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateStructuredPlannerResult } = require("./_promo-section-design-provider");

async function buildCandidateStructures(sql, templates) {
  const structures = [];
  for (const template of templates) {
    const memberships = (await fetchTemplateSections(sql, template.id))
      .filter((section) => section.isVisible && section.sectionId && section.sectionStatus === "active");
    const sections = [];
    for (const membership of memberships) {
      const items = (await fetchItemsForSection(sql, membership.sectionId))
        .filter((item) => item.isVisibleInWizard && item.componentVersionId);
      if (!items.length) continue;
      sections.push({
        sectionId: membership.sectionId,
        sectionKey: membership.sectionKey,
        sectionName: membership.sectionName,
        fixedPosition: membership.fixedPosition,
        isRequired: membership.isRequired,
        componentVersionIds: Array.from(new Set(items.map((item) => item.componentVersionId))),
        items: items.map((item) => ({
          itemKey: item.itemKey,
          componentVersionId: item.componentVersionId,
          name: item.name,
          description: item.description,
          fieldKind: item.fieldKind,
          textType: item.textType,
          isRequired: item.isRequired,
          isLocked: item.isLocked,
        })),
      });
    }
    if (sections.length) {
      structures.push({
        templateId: template.id,
        templateKey: template.templateKey,
        templateVersion: template.version,
        templateName: template.name,
        sections,
      });
    }
  }
  return structures;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const overview = normalizeOverview(body.overview || {});
    const fingerprint = overviewFingerprint(overview);
    if (!body.overviewFingerprint || String(body.overviewFingerprint) !== fingerprint) {
      return res.status(409).json({
        error: "Overview changed before composition planning",
        code: "OVERVIEW_FINGERPRINT_MISMATCH",
        overviewFingerprint: fingerprint,
      });
    }
    const requestedIds = new Set(
      (Array.isArray(body.candidateTemplateIds) ? body.candidateTemplateIds : [])
        .map((id) => String(id || "").trim()).filter(Boolean).slice(0, 5)
    );
    const sql = getSql();
    const activeTemplates = await fetchTemplates(sql, { activeOnly: true });
    const candidates = requestedIds.size
      ? activeTemplates.filter((template) => requestedIds.has(template.id))
      : activeTemplates.slice(0, 5);
    const candidateStructures = await buildCandidateStructures(sql, candidates);
    if (!candidateStructures.length) {
      return res.status(422).json({
        error: "No active template structures are available for composition",
        code: "COMPOSITION_CANDIDATES_EMPTY",
      });
    }
    const requestId = String(body.requestId || "").trim() || randomUUID();
    const promptSnapshot = await createPromptExecutionSnapshot(sql, "promo_template_composer", {
      overviewJson: JSON.stringify(overview),
      candidateStructuresJson: JSON.stringify(candidateStructures),
      allowedContentPathsJson: JSON.stringify(ALLOWED_OVERVIEW_PATHS),
    });
    const generation = await generateStructuredPlannerResult({
      type: "promo_template_composer",
      schemaName: "promo_template_composition",
      schema: compositionSchema(candidateStructures),
      promptConfig: promptSnapshot.promptConfig,
    });
    const validated = validateCompositionProposal(generation.result, candidateStructures);
    return res.status(200).json({
      ok: true,
      proposal: {
        requestId,
        overviewFingerprint: fingerprint,
        source: "ai-composition",
        status: "ready",
        createdAt: new Date().toISOString(),
        ...validated,
        templateSnapshot: candidateStructures.map((template) => ({
          templateId: template.templateId,
          templateVersion: template.templateVersion,
          sectionIds: template.sections.map((section) => section.sectionId),
          componentVersionIds: template.sections.flatMap((section) => section.componentVersionIds),
        })),
        promptExecutionSnapshot: {
          promptId: promptSnapshot.promptConfig.promptId,
          promptVersion: promptSnapshot.promptConfig.promptVersion,
          renderedPromptHash: promptSnapshot.promptConfig.renderedPromptHash,
          provider: generation.provider,
          model: promptSnapshot.promptConfig.model,
        },
      },
    });
  } catch (error) {
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Promotion template composition planning failed",
      message: error.message,
      code: error.code || null,
    });
  }
};

module.exports.buildCandidateStructures = buildCandidateStructures;
