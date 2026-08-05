const assert = require("node:assert/strict");
const {
  validateCompositionOperations,
  applyCompositionOperations,
} = require("../api/_promo-page-composition-operations");
const {
  prepareRegistryStructuralOperations,
} = require("../api/_promo-registry-composition-operations");

function sectionCandidate(id, key) {
  return {
    sectionVersionId: id,
    sectionKey: key,
    sectionRole: "content",
    version: 1,
    name: key,
    resolvedRequired: false,
    sortOrder: 10,
    compositionPolicy: {},
    aiDesign: { enabled: false },
    layoutPresets: [{
      layoutKey: "default",
      isDefault: true,
      layoutSnapshot: {
        contractVersion: 1,
        layoutMode: "free",
        sectionStyle: {},
        content: {},
        viewports: {
          desktop: { items: { text: { xPct: 10, yPx: 20, widthPct: 80, heightPx: 60, zIndex: 1 } } },
          mobile: { items: { text: { xPct: 5, yPx: 20, widthPct: 90, heightPx: 60, zIndex: 1 } } },
        },
      },
    }],
    components: [{
      componentInstanceId: `${id}-text-instance`,
      componentVersionId: `${id}-text-version`,
      componentKey: "text",
      itemKey: "text",
      name: "Text",
      fieldKind: "text",
      textType: "multi",
      defaultValue: `${key} default`,
      isRequired: true,
      isLocked: false,
      fields: [{
        fieldKey: "text", name: "Text", fieldKind: "text", textType: "multi",
        defaultValue: `${key} default`, isRequired: true, isLocked: false,
      }],
      collection: { enabled: false, minItems: 1, maxItems: 1, desktopColumns: 1, mobileColumns: 1 },
    }],
    resourceReferences: [],
  };
}

const candidates = {
  shell: { shellVersionId: "shell-v1", shellKey: "default", version: 1 },
  criteria: { locale: "ko-KR", capabilities: [] },
  candidateFingerprint: "candidate-v1",
  policyFingerprint: "policy-v1",
  resourceFingerprint: "resource-v1",
  tokenSets: [{ tokenSetVersionId: "tokens-v1", runtimeValues: {
    "--app-bg": "#000000", "--app-surface": "#222222", "--app-ink": "#ffffff", "--app-muted": "#999999",
    "--app-accent": "#ff3300", "--app-radius": "12px",
    "--app-shadow": "0 4px 16px #00000022", "--app-font-body": "Test Sans",
  } }],
  motionPresets: [],
  resources: [],
  sections: [sectionCandidate("section-a", "benefits"), sectionCandidate("section-b", "details")],
};
const snapshot = {
  contractVersion: 3,
  documentRevision: 3,
  layoutRevision: 0,
  compositionMeta: {
    shellVersionId: "shell-v1",
    candidateFingerprint: "candidate-v1",
    policyFingerprint: "policy-v1",
    resourceFingerprint: "resource-v1",
  },
  appearance: { designTokenSetVersionId: "tokens-v1" },
  content: {
    formTemplate: { designTokens: { values: { "--app-ink": "#111111" } } },
    sectionSnapshot: [], sectionInputs: {}, sectionOrder: [], resourceReferences: [],
  },
  designSpec: {
    contractVersion: 1, theme: {}, responsive: {}, itemStyles: {}, sectionStyles: {},
    visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: {}, visibility: { items: {} } } },
  },
  motionSpec: { sections: {}, items: {} },
  provenance: {},
  assets: { contractVersion: 1, items: {}, requests: [] },
};

function operation(type, sourceVersionId, targetInstanceId = "") {
  return {
    operationId: `${type}-${sourceVersionId}`,
    type,
    targetInstanceId,
    fieldKey: "",
    valueText: "",
    visible: true,
    position: 0,
    layoutVariant: "default",
    tokenKey: "",
    motionPresetVersionId: "",
    sourceVersionId,
    reason: `${type} test`,
  };
}

(async () => {
  const add = validateCompositionOperations({
    operations: [operation("add-section", "section-a")], summary: "add", warnings: [],
  }, snapshot, [], candidates);
  const preparedAdd = await prepareRegistryStructuralOperations({
    sql: null, snapshot, candidates, operations: add.operations, documentId: "document-v3",
  });
  const added = applyCompositionOperations(snapshot, preparedAdd);
  assert.equal(added.content.sectionSnapshot.length, 1);
  assert.equal(added.content.sectionSnapshot[0].sourceSectionId, "section-a");
  assert.equal(added.content.sectionOrder.length, 1);
  assert.equal(added.layoutRevision, 1);
  const addedKey = added.content.sectionOrder[0];
  assert.ok(added.designSpec.itemStyles[`${addedKey}.${added.content.sectionSnapshot[0].items[0].id}`]);

  const replace = validateCompositionOperations({
    operations: [operation("replace-section", "section-b", addedKey)], summary: "replace", warnings: [],
  }, added, [], candidates);
  const preparedReplace = await prepareRegistryStructuralOperations({
    sql: null, snapshot: added, candidates, operations: replace.operations, documentId: "document-v3",
  });
  const replaced = applyCompositionOperations(added, preparedReplace);
  assert.equal(replaced.content.sectionSnapshot.length, 1);
  assert.equal(replaced.content.sectionSnapshot[0].sourceSectionId, "section-b");
  assert.equal(replaced.content.sectionInputs[addedKey], undefined);
  assert.equal(replaced.layoutRevision, 2);

  const replacedKey = replaced.content.sectionOrder[0];
  const remove = validateCompositionOperations({
    operations: [operation("remove-section", "", replacedKey)], summary: "remove", warnings: [],
  }, replaced, [], candidates);
  const removed = applyCompositionOperations(replaced, remove.operations);
  assert.equal(removed.content.sectionSnapshot.length, 0);
  assert.equal(removed.content.sectionOrder.length, 0);
  assert.equal(removed.layoutRevision, 3);
  console.log("Promo Registry composition structural operation tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
