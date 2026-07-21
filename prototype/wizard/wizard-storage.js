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

  global.PromoWizardStorage = Object.freeze({
    loadWizardContent,
    persistWizardContent,
    createLayoutSnapshot,
  });
})(globalThis);
