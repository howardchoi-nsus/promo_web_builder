const { createHash } = require("node:crypto");

const SESSION_STAGES = Object.freeze([
  "idle",
  "requirements_review",
  "wireframe_review",
  "finalizing",
  "completed",
]);

const ACTION_TRANSITIONS = Object.freeze({
  confirm_requirements: { from: "requirements_review", to: "wireframe_review" },
  revise_requirements: { from: "requirements_review", to: "requirements_review" },
  approve_wireframe: { from: "wireframe_review", to: "finalizing" },
  revise_wireframe: { from: "wireframe_review", to: "requirements_review" },
  open_output: { from: "completed", to: "completed" },
});

function contractError(message, code, statusCode = 422, details = undefined) {
  return Object.assign(new Error(message), { code, statusCode, ...(details ? { details } : {}) });
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function hashValue(value) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function projectWireframeStructure(snapshot = {}) {
  const plannedSections = Array.isArray(snapshot?.compositionSpec?.sections)
    ? snapshot.compositionSpec.sections
    : null;
  if (plannedSections) {
    return {
      contractVersion: Number(snapshot.contractVersion || 0),
      structureVersion: 1,
      sections: plannedSections.flatMap((section) => Array.from(
        { length: Math.max(1, Number(section?.repeat || 1)) },
        (_, sectionIndex) => ({
          sectionRef: String(section?.sectionVersionId || section?.sectionKey || ""),
          sectionIndex,
          layoutKey: String(section?.layoutKey || ""),
          visible: section?.visible !== false,
          components: (Array.isArray(section?.components) ? section.components : []).flatMap(
            (component) => Array.from(
              { length: Math.max(1, Number(component?.repeat || 1)) },
              (_, componentIndex) => ({
                componentRef: String(component?.componentInstanceId || component?.itemKey || ""),
                componentIndex,
                visible: component?.visible !== false,
              }),
            ),
          ),
        }),
      )),
    };
  }
  const sections = Array.isArray(snapshot?.content?.sectionSnapshot)
    ? snapshot.content.sectionSnapshot
    : [];
  const sectionOrder = Array.isArray(snapshot?.content?.sectionOrder)
    ? snapshot.content.sectionOrder.map(String)
    : sections.map((section) => String(section?.sectionKey || ""));
  const byKey = new Map(sections.map((section) => [String(section?.sectionKey || ""), section]));
  const orderedSections = sectionOrder.map((key) => byKey.get(key)).filter(Boolean);
  const sectionIndexes = new Map();
  return {
    contractVersion: Number(snapshot.contractVersion || 0),
    structureVersion: 1,
    sections: orderedSections.map((section) => {
      const sectionRef = String(
        section?.sourceSectionId || section?.sourceSectionVersionId || section?.sectionKey || "",
      );
      const sectionIndex = sectionIndexes.get(sectionRef) || 0;
      sectionIndexes.set(sectionRef, sectionIndex + 1);
      return {
        sectionRef,
        sectionIndex,
        layoutKey: String(section?.selectedLayoutKey || ""),
        visible: section?.isVisibleInWizard !== false,
        components: (Array.isArray(section?.items) ? section.items : []).map((item) => ({
          componentRef: String(
            item?.sourceDefinitionInstanceId
              || item?.componentVersionId
              || item?.sourceItemKey
              || item?.itemKey
              || "",
          ),
          componentIndex: Number(item?.collection?.index || 0),
          visible: item?.isVisibleInWizard !== false,
        })),
      };
    }),
  };
}

function computeStructureFingerprint(snapshot) {
  const structure = projectWireframeStructure(snapshot);
  if (!structure.sections.length) {
    throw contractError("Wireframe does not contain any sections", "EMPTY_WIREFRAME_STRUCTURE");
  }
  if (structure.sections.some((section) => !section.sectionRef)) {
    throw contractError("Wireframe section references are required", "INVALID_WIREFRAME_STRUCTURE");
  }
  return hashValue(structure);
}

function normalizeActions(actions, stage) {
  if (!Array.isArray(actions)) return [];
  return actions.slice(0, 10).map((action) => {
    const actionKey = String(action?.key || action?.actionKey || "").trim();
    const transition = ACTION_TRANSITIONS[actionKey];
    if (!transition || transition.from !== stage) {
      throw contractError(
        `Action ${actionKey || "(empty)"} is not allowed during ${stage}`,
        "CHAT_ACTION_NOT_ALLOWED",
        409,
      );
    }
    return {
      actionKey,
      label: String(action?.label || actionKey).trim().slice(0, 120),
      payload: action?.payload && typeof action.payload === "object" ? action.payload : {},
    };
  });
}

function assertActionTransition(actionKey, stage) {
  const transition = ACTION_TRANSITIONS[String(actionKey || "")];
  if (!transition || (transition.from !== stage && transition.to !== stage)) {
    throw contractError(
      `Action ${actionKey || "(empty)"} is not allowed during ${stage}`,
      "CHAT_ACTION_NOT_ALLOWED",
      409,
    );
  }
  return transition;
}

function assertWireframeProof({ confirmed, documentId, proposalId, baseDocumentRevision, fingerprint }) {
  if (!confirmed) {
    throw contractError("A confirmed Wireframe revision is required", "WIREFRAME_CONFIRMATION_REQUIRED", 409);
  }
  const mismatches = [];
  if (String(confirmed.documentId) !== String(documentId)) mismatches.push("documentId");
  if (String(confirmed.proposalId) !== String(proposalId)) mismatches.push("proposalId");
  if (Number(confirmed.baseDocumentRevision) !== Number(baseDocumentRevision)) mismatches.push("baseDocumentRevision");
  if (String(confirmed.structureFingerprint) !== String(fingerprint)) mismatches.push("structureFingerprint");
  if (mismatches.length) {
    throw contractError(
      "Confirmed Wireframe no longer matches the composition proposal",
      "WIREFRAME_PROOF_MISMATCH",
      409,
      { mismatches },
    );
  }
  return true;
}

module.exports = {
  SESSION_STAGES,
  ACTION_TRANSITIONS,
  stableStringify,
  projectWireframeStructure,
  computeStructureFingerprint,
  normalizeActions,
  assertActionTransition,
  assertWireframeProof,
};
