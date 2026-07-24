export function createEditorContext(mode = "editor", source = "") {
  const isAdminLayout = mode === "admin-layout";
  const isWizardLayout = mode === "wizard-layout";
  const isCreatePromo = isWizardLayout && source === "create-promo";
  const isBuilderWorkspace = isAdminLayout || isCreatePromo;

  return Object.freeze({
    engineKey: "promo-live-preview",
    mode,
    source,
    surface: isAdminLayout ? "template-default" : isCreatePromo ? "promo-instance" : "standalone",
    isAdminLayout,
    isWizardLayout,
    isCreatePromo,
    isBuilderWorkspace,
    capabilities: Object.freeze({
      canEditTemplateDefaults: isAdminLayout,
      canEditPromoContent: isCreatePromo,
      canRunSectionAi: isCreatePromo,
      canRunComponentImageAi: isCreatePromo,
      canRunMultiLayoutAi: isBuilderWorkspace,
      canSaveTemplateLayout: isAdminLayout,
      canSavePromoOverrides: isCreatePromo,
      canOpenWebOutput: true,
      showsTemplateStatus: isBuilderWorkspace,
      isEmbedded: isBuilderWorkspace || isWizardLayout,
    }),
  });
}
