export const COMPOSITION_CONTRACT_VERSION = 2;

export function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function normalizeRevision(value) {
  const revision = Number(value || 0);
  return Number.isFinite(revision) && revision > 0 ? Math.floor(revision) : 0;
}

export function isCompositionContractV2(snapshot) {
  return Number(snapshot?.contractVersion || 0) === COMPOSITION_CONTRACT_VERSION
    && Number.isInteger(Number(snapshot?.documentRevision))
    && Number.isInteger(Number(snapshot?.layoutRevision))
    && Boolean(snapshot?.content && snapshot?.designSpec && snapshot?.assets);
}

export function normalizeCompositionContractV2(snapshot) {
  if (!isCompositionContractV2(snapshot)) {
    throw new TypeError("Composition Contract v2 snapshot is required");
  }
  const result = cloneJson(snapshot);
  result.documentRevision = normalizeRevision(result.documentRevision);
  result.layoutRevision = normalizeRevision(result.layoutRevision);
  if (result.bridgeRevision !== undefined) {
    result.bridgeRevision = normalizeRevision(result.bridgeRevision);
  }
  result.content.sectionSnapshot = Array.isArray(result.content.sectionSnapshot)
    ? result.content.sectionSnapshot
    : [];
  result.content.sectionOrder = Array.isArray(result.content.sectionOrder)
    ? result.content.sectionOrder
    : result.content.sectionSnapshot.map((section) => section.sectionKey);
  result.content.sectionInputs = result.content.sectionInputs || {};
  result.provenance = result.provenance || {};
  result.motionSpec = result.motionSpec || { sections: {}, items: {} };
  result.assets = {
    contractVersion: 1,
    items: {},
    requests: [],
    ...result.assets,
  };
  result.validation = {
    ok: true,
    errors: [],
    warnings: [],
    ...result.validation,
  };
  return result;
}

export function upgradeLegacySnapshot(snapshot, options = {}) {
  if (isCompositionContractV2(snapshot)) return normalizeCompositionContractV2(snapshot);
  if (!snapshot?.content || !snapshot?.designSpec) {
    throw new TypeError("Legacy layout snapshot is required");
  }
  const template = snapshot.content.formTemplate || {};
  const layoutRevision = normalizeRevision(
    snapshot.layoutRevision || snapshot.layoutIdentity?.layoutRevision,
  );
  return normalizeCompositionContractV2({
    contractVersion: COMPOSITION_CONTRACT_VERSION,
    documentRevision: normalizeRevision(options.documentRevision),
    layoutRevision,
    layoutIdentity: cloneJson(snapshot.layoutIdentity || {
      contractVersion: 1,
      templateId: String(template.id || ""),
      templateKey: String(template.templateKey || ""),
      templateVersion: Number(template.version || 1),
      layoutId: "",
      layoutRevision,
      configRevision: String(template.configRevision || ""),
      rendererKey: "default-promo-renderer",
      rendererVersion: 1,
    }),
    compositionMeta: cloneJson(options.compositionMeta || {
      compositionId: "",
      documentId: String(options.documentId || ""),
      mode: "template",
      overviewFingerprint: "",
      candidateFingerprint: "",
      proposalId: "",
      sourceTemplateId: String(template.id || ""),
      sourceTemplateVersion: Number(template.version || 1),
      promptTemplateVersionId: "",
      model: "",
      reasoningSummary: "",
    }),
    appearance: cloneJson(options.appearance || {
      designTokenSetVersionId: String(template.designTokenSetVersionId || ""),
      motionEnabled: false,
    }),
    content: cloneJson(snapshot.content),
    provenance: cloneJson(options.provenance || {}),
    designSpec: cloneJson(snapshot.designSpec),
    motionSpec: cloneJson(options.motionSpec || { sections: {}, items: {} }),
    assets: cloneJson(snapshot.assets || { contractVersion: 1, items: {}, requests: [] }),
    validation: cloneJson(options.validation || { ok: true, errors: [], warnings: [] }),
  });
}
