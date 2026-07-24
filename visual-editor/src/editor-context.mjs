export function createEditorContext(mode = "editor", source = "") {
  const isAdminLayout = mode === "admin-layout";
  const isWizardLayout = mode === "wizard-layout";
  const isCreatePromo = isWizardLayout && source === "create-promo";
  const isBuilderWorkspace = isAdminLayout || isCreatePromo;

  return Object.freeze({
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
      canRunMultiLayoutAi: isCreatePromo,
      canSaveTemplateLayout: isAdminLayout,
      canSavePromoOverrides: isCreatePromo,
      canOpenWebOutput: !isAdminLayout,
      showsTemplateStatus: isBuilderWorkspace,
      isEmbedded: isCreatePromo,
    }),
  });
}
