(function registerWizardStorage(global) {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadWizardContent({
    storage,
    storageKey,
    backupKey,
    schemaVersion,
    createDefault,
    migrateSectionInputs,
    objectKeys = [],
  }) {
    try {
      const saved = JSON.parse(storage.getItem(storageKey) || "null");
      const fallback = createDefault();
      const needsMigration = saved && Number(saved.sectionInputSchemaVersion || 1) < schemaVersion;
      if (needsMigration && backupKey && !storage.getItem(backupKey)) {
        storage.setItem(backupKey, JSON.stringify(saved));
      }
      const result = {
        ...fallback,
        sectionInputSchemaVersion: schemaVersion,
        promo: { ...fallback.promo, ...(saved?.promo || {}) },
        simpleBrief: { ...fallback.simpleBrief, ...(saved?.simpleBrief || {}) },
        designTokenSetVersionId: String(saved?.designTokenSetVersionId || ""),
        formTemplate: saved?.formTemplate || null,
        sectionInputs: needsMigration
          ? migrateSectionInputs(saved.sectionInputs || {})
          : ((saved && typeof saved.sectionInputs === "object" && saved.sectionInputs) || {}),
      };
      objectKeys.forEach((key) => {
        result[key] = (saved && typeof saved[key] === "object" && saved[key]) || fallback[key] || {};
      });
      return result;
    } catch {
      return createDefault();
    }
  }

  function persistWizardContent(storage, storageKey, content) {
    storage.setItem(storageKey, JSON.stringify(content));
  }

  function createLayoutSnapshot({
    layoutRevision,
    layoutIdentity,
    formTemplate,
    sections,
    sectionInputs,
    sectionDesignRuns,
    designSpec,
  }) {
    const content = {
      contractVersion: 1,
      formTemplate: { ...(formTemplate || {}) },
      sectionSnapshot: (sections || []).map((section) => ({
        ...section,
        items: (section.items || []).map((item) => ({ ...item })),
      })),
      sectionInputs: clone(sectionInputs || {}),
      sectionOrder: (sections || []).map((section) => section.sectionKey),
    };
    if (sectionDesignRuns !== undefined) content.sectionDesignRuns = clone(sectionDesignRuns || {});
    return {
      layoutRevision,
      ...(layoutIdentity ? { layoutIdentity: clone(layoutIdentity) } : {}),
      content,
      designSpec: clone(designSpec || {}),
      assets: { contractVersion: 1, items: {} },
    };
  }

  function createCompositionSnapshot({
    documentId = "",
    documentRevision = 0,
    bridgeRevision = 0,
    compositionMeta = {},
    appearance = {},
    provenance = {},
    motionSpec = {},
    validation = {},
    ...layout
  }) {
    const snapshot = createLayoutSnapshot(layout);
    const contract = global.PromoEditorSnapshotContract;
    if (!contract?.upgradeToCompositionContractV2) {
      throw new Error("PromoEditorSnapshotContract v2 is required");
    }
    return contract.upgradeToCompositionContractV2(snapshot, {
      documentId,
      documentRevision,
      bridgeRevision,
      compositionMeta: {
        compositionId: "",
        documentId,
        mode: "ai-base-preset",
        overviewFingerprint: "",
        candidateFingerprint: "",
        proposalId: "",
        sourceTemplateId: String(layout.formTemplate?.id || ""),
        sourceTemplateVersion: Number(layout.formTemplate?.version || 1),
        promptTemplateVersionId: "",
        model: "",
        reasoningSummary: "",
        ...compositionMeta,
      },
      appearance: {
        designTokenSetVersionId: String(
          layout.formTemplate?.designTokenSetVersionId || "",
        ),
        motionEnabled: false,
        ...appearance,
      },
      provenance,
      motionSpec: {
        sections: {},
        items: {},
        ...motionSpec,
      },
      validation: {
        ok: true,
        errors: [],
        warnings: [],
        ...validation,
      },
    });
  }

  global.PromoWizardStorage = Object.freeze({
    loadWizardContent,
    persistWizardContent,
    createLayoutSnapshot,
    createCompositionSnapshot,
  });
})(globalThis);
