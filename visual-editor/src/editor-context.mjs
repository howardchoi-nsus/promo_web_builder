const MODE_PRESENTATION = Object.freeze({
  "section-preset": {
    surface: "section-preset",
    presentation: "modal",
    title: "레이아웃 프리셋 편집기",
    saveTarget: "section-layout-preset",
    saveTargetLabel: "선택한 레이아웃 프리셋",
  },
  "admin-layout": {
    surface: "template-default",
    presentation: "modal",
    title: "템플릿 기본 레이아웃 편집기",
    saveTarget: "template-default-layout",
    saveTargetLabel: "템플릿 기본 레이아웃",
  },
  "create-promo": {
    surface: "promo-instance",
    presentation: "inline",
    title: "프로모션 레이아웃 편집기",
    saveTarget: "promo-instance",
    saveTargetLabel: "현재 프로모션",
  },
  "ai-document": {
    surface: "ai-document",
    presentation: "full-page",
    title: "AI 프로모션 편집기",
    saveTarget: "ai-document-revision",
    saveTargetLabel: "AI 프로모션 문서 Revision",
  },
  standalone: {
    surface: "standalone",
    presentation: "full-page",
    title: "Visual Editor",
    saveTarget: "local-preview",
    saveTargetLabel: "현재 미리보기",
  },
});

export function createEditorContext(mode = "editor", source = "", runtimeState = {}) {
  const isAdminLayout = mode === "admin-layout";
  const isSectionPreset = mode === "section-preset";
  const isWizardLayout = mode === "wizard-layout";
  const isAiDocument = mode === "ai-document";
  const isCreatePromo = isWizardLayout && source === "create-promo";
  const isBuilderWorkspace = isAdminLayout || isSectionPreset || isCreatePromo || isAiDocument;
  const manifestKey = isAdminLayout ? "admin-layout"
    : isSectionPreset ? "section-preset"
      : isAiDocument ? "ai-document"
        : isCreatePromo ? "create-promo" : "standalone";
  const presentation = MODE_PRESENTATION[manifestKey];
  const entityStatus = String(runtimeState.entityStatus || "").trim().toLowerCase();
  const versionOwned = isAdminLayout || isSectionPreset;
  const readOnly = Boolean(runtimeState.readOnly === true
    || (versionOwned && entityStatus && entityStatus !== "draft"));
  const canMutate = !readOnly;

  return Object.freeze({
    engineKey: "promo-live-preview",
    mode,
    source,
    ...presentation,
    canvasTitle: "Live Preview",
    entityStatus: entityStatus || null,
    readOnly,
    embedded: isAdminLayout || isSectionPreset || isCreatePromo || isWizardLayout,
    isAdminLayout,
    isSectionPreset,
    isWizardLayout,
    isAiDocument,
    isCreatePromo,
    isBuilderWorkspace,
    capabilities: Object.freeze({
      canMutate,
      canEditTemplateDefaults: isAdminLayout && canMutate,
      canEditPromoContent: (isSectionPreset || isCreatePromo || isAiDocument) && canMutate,
      canEditContent: (isSectionPreset || isCreatePromo || isAiDocument) && canMutate,
      canEditStructure: isBuilderWorkspace && !isSectionPreset && canMutate,
      canEditDesignTokens: (isAdminLayout || isAiDocument) && canMutate,
      canAutoRegister: isCreatePromo && canMutate,
      canRunSectionAi: (isCreatePromo || isAiDocument) && canMutate,
      canRunSectionLayoutAi: isCreatePromo && canMutate,
      canRunComponentImageAi: (isCreatePromo || isAiDocument) && canMutate,
      canRunMultiLayoutAi: isBuilderWorkspace && canMutate,
      canComposeStructure: isBuilderWorkspace && !isSectionPreset && canMutate,
      canCreateSections: isBuilderWorkspace && !isSectionPreset && canMutate,
      canManageComponents: isBuilderWorkspace && !isSectionPreset && canMutate,
      canSave: isBuilderWorkspace && canMutate,
      canSaveTemplateLayout: isAdminLayout && canMutate,
      canSaveSectionPreset: isSectionPreset && canMutate,
      canSavePromoOverrides: isCreatePromo && canMutate,
      canSyncPromoOverrides: isCreatePromo && canMutate,
      canSaveAiDocument: isAiDocument && canMutate,
      canOpenWebOutput: true,
      showsTemplateStatus: isBuilderWorkspace,
      isEmbedded: isAdminLayout || isSectionPreset || isCreatePromo || isWizardLayout,
    }),
  });
}

export { MODE_PRESENTATION };
