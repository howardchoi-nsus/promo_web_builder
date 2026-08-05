const { compileRegistryComposition } = require("./_promo-registry-composition-compiler");

function structuralOperation(type) {
  return type === "add-section" || type === "replace-section";
}

async function prepareRegistryStructuralOperations({
  sql,
  snapshot,
  candidates,
  operations,
  documentId,
}) {
  const sectionsById = new Map((candidates.sections || []).map((section) => [section.sectionVersionId, section]));
  const prepared = [];
  for (const operation of operations) {
    if (!structuralOperation(operation.type)) {
      prepared.push(operation);
      continue;
    }
    const source = sectionsById.get(operation.sourceVersionId);
    if (!source) {
      throw Object.assign(new Error("Registry Section version changed before operation apply"), {
        code: "INVALID_SOURCE_SECTION", statusCode: 409,
      });
    }
    const layout = (source.layoutPresets || []).find((item) => item.layoutKey === operation.layoutVariant)
      || (source.layoutPresets || []).find((item) => item.isDefault)
      || source.layoutPresets?.[0];
    if (!layout) {
      throw Object.assign(new Error("Registry Section has no active Layout Preset"), {
        code: "LAYOUT_VERSION_MISMATCH", statusCode: 409,
      });
    }
    const selectedComponents = (source.components || []).map((component) => ({
      componentInstanceId: component.componentInstanceId,
      componentVersionId: component.componentVersionId,
      itemKey: component.itemKey,
      visible: true,
      repeat: Number(component.collection?.minItems || 1),
      collection: component.collection,
      contentBindings: [],
    }));
    const proposalSnapshot = {
      contractVersion: 3,
      snapshotType: "registry-composition-proposal",
      compositionMeta: {
        ...(snapshot.compositionMeta || {}),
        proposalId: operation.operationId,
        reasoningSummary: operation.reason || "Natural-language Registry Section operation.",
      },
      compositionSpec: {
        shellVersionId: candidates.shell.shellVersionId,
        designTokenSetVersionId: snapshot.appearance?.designTokenSetVersionId || "",
        resourceReferences: source.resourceReferences || [],
        sections: [{
          sectionVersionId: source.sectionVersionId,
          sectionKey: source.sectionKey,
          sectionRole: source.sectionRole,
          visible: true,
          sortOrder: operation.position,
          layoutKey: layout.layoutKey,
          motionPresetVersionId: operation.motionPresetVersionId || "",
          repeat: 1,
          components: selectedComponents,
          resourceReferences: source.resourceReferences || [],
        }],
      },
      validation: { ok: true, errors: [], warnings: [] },
    };
    const compiled = await compileRegistryComposition({
      sql,
      proposalSnapshot,
      candidates,
      overview: {},
      documentId,
      proposalId: operation.operationId,
      documentRevision: snapshot.documentRevision,
    });
    const section = compiled.content.sectionSnapshot[0];
    const sectionKey = section.sectionKey;
    prepared.push({
      ...operation,
      sectionPayload: {
        section,
        content: compiled.content.sectionInputs[sectionKey] || {},
        sectionStyle: compiled.designSpec.sectionStyles[sectionKey] || {},
        itemStyles: Object.fromEntries(Object.entries(compiled.designSpec.itemStyles || {}).filter(
          ([key]) => key.startsWith(`${sectionKey}.`),
        )),
        visibilityItems: Object.fromEntries(Object.entries(compiled.designSpec.visibility?.items || {}).filter(
          ([key]) => key.startsWith(`${sectionKey}.`),
        )),
        visibilityFields: Object.fromEntries(Object.entries(compiled.designSpec.visibility?.fields || {}).filter(
          ([key]) => key.startsWith(`${sectionKey}.`),
        )),
        mobileItemStyles: Object.fromEntries(Object.entries(
          compiled.designSpec.responsiveLayouts?.mobile?.itemStyles || {},
        ).filter(([key]) => key.startsWith(`${sectionKey}.`))),
        mobileVisibilityItems: Object.fromEntries(Object.entries(
          compiled.designSpec.responsiveLayouts?.mobile?.visibility?.items || {},
        ).filter(([key]) => key.startsWith(`${sectionKey}.`))),
        motion: compiled.motionSpec.sections[sectionKey] || null,
        provenance: Object.fromEntries(Object.entries(compiled.provenance || {}).filter(
          ([key]) => key.startsWith(`${sectionKey}.`),
        )),
        assetRequests: (compiled.assets.requests || []).filter(
          (request) => request.pageSectionInstanceId === sectionKey,
        ),
      },
    });
  }
  return prepared;
}

module.exports = { prepareRegistryStructuralOperations };
