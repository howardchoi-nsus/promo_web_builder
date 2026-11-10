const { createHash } = require("node:crypto");

function instanceId(sectionId, componentId) {
  const hash = createHash("sha256").update(`library:${sectionId}:${componentId}`).digest("hex");
  return `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
}

function compatible(version, section, parentCapabilities = new Set()) {
  const policy = version.placementPolicy || {};
  const role = section.sectionRole;
  return (!(policy.allowedSectionRoles || []).length || policy.allowedSectionRoles.includes(role))
    && !(policy.deniedSectionRoles || []).includes(role)
    && (policy.requiresParentCapabilities || []).every((value) => parentCapabilities.has(value));
}

function materialize(component, existing, section) {
  const version = component.activeVersion;
  return {
    ...existing,
    id: existing?.id || instanceId(section.id, component.id),
    sectionId: section.id,
    componentId: component.id,
    componentKey: component.componentKey,
    componentVersionId: version.id,
    componentVersion: version.version,
    componentVersionStatus: version.status,
    itemKey: existing?.itemKey || `library-${component.componentKey}`,
    name: existing?.name || component.name,
    description: component.description || "",
    libraryPresentation: component.libraryPresentation || {},
    fieldKind: version.fieldKind,
    textType: version.textType,
    defaultValue: version.defaultValue,
    editorSchema: version.editorSchema || {},
    capabilities: version.capabilities || {},
    styleSlots: version.styleSlots || [],
    renderSpec: version.renderSpec || null,
    renderValidation: version.renderValidation || null,
    renderContractVersion: version.renderContractVersion || version.renderSpec?.contractVersion || null,
    renderSpecHash: version.renderSpecHash || (version.renderValidation?.hash ? `sha256:${version.renderValidation.hash}` : null),
    fields: version.fields || [],
    image: version.fieldKind === "image" ? {
      allowedSources: version.imagePolicy?.allowedSources || [],
      promptText: version.imagePolicy?.promptText || "",
      descriptionEnabled: version.imagePolicy?.descriptionEnabled === true,
      requiresDescription: version.imagePolicy?.requiresDescription === true,
    } : null,
    ctaUtm: version.ctaPolicy || {},
    isVisibleInWizard: existing?.isVisibleInWizard ?? true,
    isRequired: existing?.isRequired ?? false,
    isLocked: existing?.isLocked ?? false,
    instanceConfig: existing?.instanceConfig || {},
    candidateSource: existing ? "section-instance" : "component-library",
    versionPolicy: "latest-active",
  };
}

// Materialize request-local instances. Never mutate authored sections or saved documents.
function resolveLibraryComponentCandidates({ section, instances = [], library = [], overview = {} }) {
  const available = library.filter((component) => component.status === "active"
    && component.activeVersion?.status === "active");
  const byId = new Map(available.map((component) => [component.id, component]));
  const parentCapabilities = new Set(instances.flatMap((item) => Object.entries(item.capabilities || {})
    .filter(([, enabled]) => enabled === true).map(([name]) => name)));
  const locked = section.compositionPolicy?.contentLocked || section.compositionPolicy?.aiEditable === false;
  const resolved = instances.filter((item) => item.isVisibleInWizard !== false).map((item) => {
    const component = byId.get(item.componentId);
    if (item.componentId && !component) return null;
    if (locked || item.isLocked || item.instanceConfig?.versionPolicy === "pinned") return item;
    if (!component || !compatible(component.activeVersion, section, parentCapabilities)) return item;
    return materialize(component, item, section);
  }).filter((item) => item && item.componentVersionStatus === "active");
  if (locked || section.layoutSelectionLocked) return resolved;
  const connectedIds = new Set(instances.map((item) => item.componentId));
  const text = JSON.stringify([overview, section.sectionRole, section.name]).toLowerCase();
  const additions = available.filter((component) => !connectedIds.has(component.id)
    && component.activeVersion.renderSpec?.root
    && component.activeVersion.renderValidation?.ok !== false
    && compatible(component.activeVersion, section, parentCapabilities));
  const score = (component) => [component.componentKey, component.name, ...(component.activeVersion.placementPolicy?.allowedSectionRoles || [])]
    .filter(Boolean).reduce((sum, term) => sum + (text.includes(String(term).toLowerCase()) ? 1 : 0), 0);
  additions.sort((a,b) => score(b)-score(a) || a.componentKey.localeCompare(b.componentKey));
  const usedKeys = new Set(resolved.map((item) => item.itemKey));
  for (const component of additions) {
    if (resolved.length >= 60) break;
    const item = materialize(component, null, section);
    if (usedKeys.has(item.itemKey)) item.itemKey += `-${component.id}`;
    usedKeys.add(item.itemKey);
    resolved.push(item);
  }
  return resolved;
}

module.exports = { resolveLibraryComponentCandidates };
