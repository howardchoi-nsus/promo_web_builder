export function createEditorContext(mode = "editor", source = "") {
  const isAdminLayout = mode === "admin-layout";
  const isWizardLayout = mode === "wizard-layout";
  const isAiDocument = mode === "ai-document";
  const isCreatePromo = isWizardLayout && source === "create-promo";
  const isBuilderWorkspace = isAdminLayout || isCreatePromo || isAiDocument;

  return Object.freeze({
    engineKey: "promo-live-preview",
    mode,
    source,
    surface: isAdminLayout ? "template-default"
      : isAiDocument ? "ai-document"
        : isCreatePromo ? "promo-instance" : "standalone",
    isAdminLayout,
    isWizardLayout,
    isAiDocument,
    isCreatePromo,
    isBuilderWorkspace,
    capabilities: Object.freeze({
      canEditTemplateDefaults: isAdminLayout,
      canEditPromoContent: isCreatePromo || isAiDocument,
      canEditDesignTokens: isAdminLayout || isAiDocument,
      canAutoRegister: isCreatePromo,
      canRunSectionAi: isCreatePromo || isAiDocument,
      canRunSectionLayoutAi: isCreatePromo,
      canRunComponentImageAi: isCreatePromo || isAiDocument,
      canRunMultiLayoutAi: isBuilderWorkspace,
      canComposeStructure: isBuilderWorkspace,
      canCreateSections: isBuilderWorkspace,
      canManageComponents: isBuilderWorkspace,
      canSaveTemplateLayout: isAdminLayout,
      canSavePromoOverrides: isCreatePromo,
      canSaveAiDocument: isAiDocument,
      canOpenWebOutput: true,
      showsTemplateStatus: isBuilderWorkspace,
      isEmbedded: isAdminLayout || isCreatePromo || isWizardLayout,
    }),
  });
}
