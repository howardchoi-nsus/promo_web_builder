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
  const url = new URL("/prototype/visual-editor.html", origin);
  url.searchParams.set("mode", "admin-layout");
  url.searchParams.set("templateId", id);
  return url.toString();
}

export const templateLayoutService = Object.freeze({
  requestLayout: requestTemplateLayout,
  editorUrl: createTemplateLayoutEditorUrl,
});
