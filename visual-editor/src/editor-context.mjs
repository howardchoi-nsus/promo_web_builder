export function createEditorContext(mode = "editor", source = "") {
  const isAdminLayout = mode === "admin-layout";
  const isSectionPreset = mode === "section-preset";
  const isWizardLayout = mode === "wizard-layout";
  const isAiDocument = mode === "ai-document";
  const isCreatePromo = isWizardLayout && source === "create-promo";
  const isBuilderWorkspace = isAdminLayout || isSectionPreset || isCreatePromo || isAiDocument;

  return Object.freeze({
    engineKey: "promo-live-preview",
    mode,
    source,
    surface: isAdminLayout ? "template-default"
      : isSectionPreset ? "section-preset"
      : isAiDocument ? "ai-document"
        : isCreatePromo ? "promo-instance" : "standalone",
    isAdminLayout,
    isSectionPreset,
    isWizardLayout,
    isAiDocument,
    isCreatePromo,
    isBuilderWorkspace,
    capabilities: Object.freeze({
      canEditTemplateDefaults: isAdminLayout,
      canEditPromoContent: isSectionPreset || isCreatePromo || isAiDocument,
      canEditDesignTokens: isAdminLayout || isAiDocument,
      canAutoRegister: isCreatePromo,
      canRunSectionAi: isCreatePromo || isAiDocument,
      canRunSectionLayoutAi: isCreatePromo,
      canRunComponentImageAi: isCreatePromo || isAiDocument,
      canRunMultiLayoutAi: isBuilderWorkspace,
      canComposeStructure: isBuilderWorkspace && !isSectionPreset,
      canCreateSections: isBuilderWorkspace && !isSectionPreset,
      canManageComponents: isBuilderWorkspace && !isSectionPreset,
      canSaveTemplateLayout: isAdminLayout,
      canSaveSectionPreset: isSectionPreset,
      canSavePromoOverrides: isCreatePromo,
      canSaveAiDocument: isAiDocument,
      canOpenWebOutput: true,
      showsTemplateStatus: isBuilderWorkspace,
      isEmbedded: isAdminLayout || isSectionPreset || isCreatePromo || isWizardLayout,
    }),
  });
}
