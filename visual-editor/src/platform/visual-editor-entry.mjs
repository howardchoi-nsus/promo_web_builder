const ENTRY_PATH = "/prototype/visual-editor.html";

export function createVisualEditorUrl(mode, params = {}, origin = globalThis.location?.origin) {
  if (!origin) throw new Error("Visual Editor origin is required");
  const normalizedMode = String(mode || "").trim();
  if (!normalizedMode) throw new Error("Visual Editor mode is required");
  const url = new URL(ENTRY_PATH, origin);
  url.searchParams.set("mode", normalizedMode);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export const visualEditorEntry = Object.freeze({
  sectionPreset(sectionId, layoutKey, origin) {
    return createVisualEditorUrl("section-preset", { sectionId, layoutKey }, origin);
  },
  adminLayout(templateId, origin) {
    return createVisualEditorUrl("admin-layout", { templateId }, origin);
  },
  aiDocument(documentId, revision, origin) {
    return createVisualEditorUrl("ai-document", { builderDocumentId: documentId, revision }, origin);
  },
  output(documentId, revision, returnUrl, origin) {
    return createVisualEditorUrl("output", { builderDocumentId: documentId, revision, returnUrl }, origin);
  },
});
