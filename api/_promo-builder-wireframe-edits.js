const ALLOWED_ALIGNMENTS = new Set(["left", "center", "right"]);
const ALLOWED_VIEWPORTS = new Set(["desktop", "mobile", "both"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function editError(message, code, statusCode = 422) {
  return Object.assign(new Error(message), { code, statusCode });
}

function targetFor(snapshot, edit) {
  const section = (snapshot?.compositionSpec?.sections || []).find(
    (candidate) => candidate.sectionKey === edit.sectionKey,
  );
  const component = (section?.components || []).find(
    (candidate) => candidate.itemKey === edit.componentKey,
  );
  if (!section || !component) {
    throw editError("Wireframe edit target is unavailable", "WIREFRAME_EDIT_TARGET_UNAVAILABLE");
  }
  return { section, component };
}

function componentIndexFor(component, edit) {
  const componentIndex = Number(edit.componentIndex ?? 0);
  const repeat = Math.max(1, Number(component.repeat || 1));
  if (!Number.isInteger(componentIndex) || componentIndex < 0 || componentIndex >= repeat) {
    throw editError("Wireframe component index is invalid", "WIREFRAME_EDIT_INDEX_INVALID");
  }
  return componentIndex;
}

function updateContent(snapshot, edit) {
  const { component } = targetFor(snapshot, edit);
  const fieldKey = String(edit.fieldKey || "").trim();
  if (!fieldKey) throw editError("fieldKey is required", "WIREFRAME_EDIT_FIELD_REQUIRED", 400);
  const editableFieldKeys = new Set([
    ...(component.contentBindings || []).map((binding) => binding.fieldKey),
    ...(component.contentItems || []).flatMap((item) => (
      (item.fields || []).map((field) => field.fieldKey)
    )),
  ].map((key) => String(key || "").trim()).filter(Boolean));
  if (!editableFieldKeys.has(fieldKey)) {
    throw editError("Wireframe content field is unavailable", "WIREFRAME_EDIT_FIELD_UNAVAILABLE");
  }
  const valueText = String(edit.valueText ?? "");
  if (valueText.length > 3000) {
    throw editError("Wireframe content must be 3000 characters or fewer", "WIREFRAME_EDIT_CONTENT_TOO_LONG", 413);
  }
  const repeatIndex = componentIndexFor(component, edit);
  component.contentItems ||= [];
  let authored = component.contentItems.find((item) => Number(item.repeatIndex || 0) === repeatIndex);
  if (!authored) {
    authored = { repeatIndex, fields: [] };
    component.contentItems.push(authored);
  }
  authored.fields ||= [];
  const existing = authored.fields.find((field) => field.fieldKey === fieldKey);
  if (existing) existing.value = valueText;
  else authored.fields.push({ fieldKey, value: valueText });
}

function updateAlignment(snapshot, edit) {
  const { component } = targetFor(snapshot, edit);
  const alignment = String(edit.alignment || "");
  const viewport = String(edit.viewport || "both");
  const componentIndex = componentIndexFor(component, edit);
  if (!ALLOWED_ALIGNMENTS.has(alignment) || !ALLOWED_VIEWPORTS.has(viewport)) {
    throw editError("Unsupported Wireframe alignment", "WIREFRAME_EDIT_ALIGNMENT_INVALID");
  }
  component.layoutOverrides ||= {};
  if (viewport === "desktop" || viewport === "both") {
    component.layoutOverrides.desktop = {
      ...(component.layoutOverrides.desktop || {}),
      horizontalAlignments: {
        ...(component.layoutOverrides.desktop?.horizontalAlignments || {}),
        [componentIndex]: alignment,
      },
    };
  }
  if (viewport === "mobile" || viewport === "both") {
    component.layoutOverrides.mobile = {
      ...(component.layoutOverrides.mobile || {}),
      horizontalAlignments: {
        ...(component.layoutOverrides.mobile?.horizontalAlignments || {}),
        [componentIndex]: alignment,
      },
    };
  }
}

function applyWireframeEdits(proposal, edits) {
  if (Number(proposal?.snapshot?.contractVersion) !== 3
    || proposal?.snapshot?.snapshotType !== "registry-composition-proposal") {
    throw editError("Wireframe inline editing requires Contract v3", "WIREFRAME_EDIT_V3_REQUIRED", 409);
  }
  const snapshot = clone(proposal.snapshot);
  const requestSnapshot = clone(proposal.requestSnapshot || {});
  const normalized = Array.isArray(edits) ? edits.slice(0, 100) : [];
  if (!normalized.length) throw editError("At least one Wireframe edit is required", "WIREFRAME_EDIT_REQUIRED", 400);
  normalized.forEach((edit) => {
    if (edit?.type === "update-content") updateContent(snapshot, edit);
    else if (edit?.type === "set-horizontal-alignment") updateAlignment(snapshot, edit);
    else throw editError("Unsupported Wireframe edit", "WIREFRAME_EDIT_TYPE_INVALID");
  });
  return { snapshot, requestSnapshot };
}

module.exports = { applyWireframeEdits, ALLOWED_ALIGNMENTS, ALLOWED_VIEWPORTS };
