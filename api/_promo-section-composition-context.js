const { fetchTemplateWithItems } = require("./_wizard-form-template-layout-store");
const { toFormTemplate } = require("./_wizard-form-templates-store");
const { fetchTokenVersion } = require("./_design-token-store");
const {
  publicSectionContract,
  selectableTokens,
  compositionFingerprint,
  normalizeCompositionSection,
} = require("./_promo-section-composition-contract");

async function loadCompositionContext(sql, formTemplateId, sectionKey, designTokenSetVersionId, currentSection) {
  const templateData = await fetchTemplateWithItems(sql, formTemplateId);
  if (!templateData || !["active", "draft"].includes(templateData.template.status)) {
    const error = new Error("Form template not found");
    error.statusCode = 404;
    throw error;
  }
  const template = toFormTemplate(templateData.template);
  const storedSection = templateData.sections.find((candidate) => (
    candidate.sectionKey === sectionKey && candidate.isVisible !== false
  ));
  const section = currentSection
    ? normalizeCompositionSection(currentSection, sectionKey)
    : storedSection;
  if (!section) {
    const error = new Error("Template section not found");
    error.statusCode = 404;
    throw error;
  }
  const selectedTokenVersionId = String(designTokenSetVersionId || "").trim();
  if (!selectedTokenVersionId) {
    const error = new Error("Select a design token before AI section composition");
    error.statusCode = 422;
    throw error;
  }
  const tokenSet = await fetchTokenVersion(sql, selectedTokenVersionId);
  if (!tokenSet || tokenSet.status !== "active") {
    const error = new Error("Active design token set version was not found");
    error.statusCode = 422;
    throw error;
  }
  return {
    template,
    section,
    tokenSet,
    sectionContract: publicSectionContract(section),
    tokens: selectableTokens(tokenSet),
    fingerprint: compositionFingerprint({ template, section, tokenSet }),
  };
}

module.exports = { loadCompositionContext };
