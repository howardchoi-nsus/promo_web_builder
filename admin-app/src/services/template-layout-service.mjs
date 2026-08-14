import { visualEditorEntry } from "../../../visual-editor/src/platform/visual-editor-entry.mjs";

export async function requestTemplateLayout(templateId, { fetchImpl = globalThis.fetch } = {}) {
  const id = String(templateId || "").trim();
  if (!id) throw new Error("Template id is required");
  const response = await fetchImpl(
    `/api/wizard-form-template-layout?templateId=${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || `Layout request failed (${response.status})`);
  }
  return result;
}

export function createTemplateLayoutEditorUrl(templateId, origin = globalThis.location?.origin) {
  const id = String(templateId || "").trim();
  if (!id) throw new Error("Template id is required");
  return visualEditorEntry.adminLayout(id, origin);
}

export const templateLayoutService = Object.freeze({
  requestLayout: requestTemplateLayout,
  editorUrl: createTemplateLayoutEditorUrl,
});
