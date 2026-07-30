(function registerEditorSnapshotContract(global) {
  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function normalizeRevision(value) {
    const revision = Number(value || 0);
    return Number.isFinite(revision) && revision > 0 ? Math.floor(revision) : 0;
  }

  function shouldAcceptRevision(incomingRevision, currentRevision) {
    const incoming = normalizeRevision(incomingRevision);
    const current = normalizeRevision(currentRevision);
    return !incoming || !current || incoming >= current;
  }

  function createBridgeSnapshot(snapshot, snapshotRevision = 0) {
    if (!snapshot || typeof snapshot !== "object") return null;
    const bridgeRevision = normalizeRevision(
      typeof snapshotRevision === "object"
        ? snapshotRevision.bridgeRevision
        : snapshotRevision,
    );
    return {
      ...clone(snapshot),
      bridgeRevision,
      // Keep the legacy field while the existing iframe host is on Contract v1.
      snapshotRevision: bridgeRevision,
    };
  }

  function normalizeEditorChange(message = {}) {
    if (!message?.designSpec || typeof message.designSpec !== "object") return null;
    return {
      documentRevision: normalizeRevision(message.baseDocumentRevision || message.documentRevision),
      bridgeRevision: normalizeRevision(
        message.baseBridgeRevision || message.bridgeRevision || message.snapshotRevision,
      ),
      snapshotRevision: normalizeRevision(
        message.baseBridgeRevision || message.bridgeRevision || message.snapshotRevision,
      ),
      designSpec: clone(message.designSpec),
      sectionInputs: message.sectionInputs && typeof message.sectionInputs === "object"
        ? clone(message.sectionInputs)
        : null,
      sectionSnapshot: Array.isArray(message.sectionSnapshot)
        ? clone(message.sectionSnapshot)
        : null,
      sectionOrder: Array.isArray(message.sectionOrder)
        ? message.sectionOrder.map((sectionKey) => String(sectionKey || "")).filter(Boolean)
        : null,
    };
  }

  function isCompositionContractV2(snapshot) {
    return Number(snapshot?.contractVersion || 0) === 2
      && Number.isInteger(Number(snapshot?.documentRevision))
      && Number.isInteger(Number(snapshot?.layoutRevision))
      && snapshot?.content
      && snapshot?.designSpec
      && snapshot?.assets;
  }

  function upgradeToCompositionContractV2(snapshot, options = {}) {
    if (!snapshot || typeof snapshot !== "object") return null;
    if (isCompositionContractV2(snapshot)) return clone(snapshot);
    const content = clone(snapshot.content || {});
    const layoutIdentity = clone(
      snapshot.layoutIdentity
      || options.layoutIdentity
      || {
        contractVersion: 1,
        templateId: String(content.formTemplate?.id || ""),
        templateKey: String(content.formTemplate?.templateKey || ""),
        templateVersion: Number(content.formTemplate?.version || 1),
        layoutId: "",
        layoutRevision: normalizeRevision(snapshot.layoutRevision),
        configRevision: String(content.formTemplate?.configRevision || ""),
        rendererKey: "default-promo-renderer",
        rendererVersion: 1,
      },
    );
    const layoutRevision = normalizeRevision(
      snapshot.layoutRevision || layoutIdentity.layoutRevision,
    );
    return {
      contractVersion: 2,
      documentRevision: normalizeRevision(options.documentRevision),
      layoutRevision,
      layoutIdentity: { ...layoutIdentity, layoutRevision },
      ...(options.bridgeRevision
        ? { bridgeRevision: normalizeRevision(options.bridgeRevision) }
        : {}),
      compositionMeta: clone(options.compositionMeta || {
        compositionId: "",
        documentId: String(options.documentId || ""),
        mode: "template",
        overviewFingerprint: "",
        candidateFingerprint: "",
        proposalId: "",
        sourceTemplateId: String(content.formTemplate?.id || ""),
        sourceTemplateVersion: Number(content.formTemplate?.version || 1),
        promptTemplateVersionId: "",
        model: "",
        reasoningSummary: "",
      }),
      appearance: clone(options.appearance || {
        designTokenSetVersionId: String(
          content.formTemplate?.designTokenSetVersionId || "",
        ),
        motionEnabled: false,
      }),
      content,
      provenance: clone(options.provenance || {}),
      designSpec: clone(snapshot.designSpec || {}),
      motionSpec: clone(options.motionSpec || { sections: {}, items: {} }),
      assets: clone(snapshot.assets || { contractVersion: 1, items: {}, requests: [] }),
      validation: clone(options.validation || { ok: true, errors: [], warnings: [] }),
    };
  }

  global.PromoEditorSnapshotContract = Object.freeze({
    clone,
    normalizeRevision,
    shouldAcceptRevision,
    createBridgeSnapshot,
    normalizeEditorChange,
    isCompositionContractV2,
    upgradeToCompositionContractV2,
  });
})(globalThis);
