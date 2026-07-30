async function responseJson(response, fallback) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || fallback);
    error.code = payload.code || `HTTP_${response.status}`;
    error.status = response.status;
    error.details = payload.validation || payload.details || null;
    throw error;
  }
  return payload;
}

export function createAiDocumentAdapter({ fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");
  return Object.freeze({
    async load(documentId) {
      const response = await fetchImpl(
        `/api/promo-builder-documents?documentId=${encodeURIComponent(documentId)}`,
        { credentials: "same-origin", cache: "no-store" },
      );
      return responseJson(response, "AI 프로모션 문서를 불러오지 못했습니다.");
    },

    async loadDesignTokenSets() {
      const response = await fetchImpl("/api/design-token-sets?scope=public", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await responseJson(response, "디자인 토큰 세트를 불러오지 못했습니다.");
      return payload.tokenSets || [];
    },

    async save({
      documentId,
      baseDocumentRevision,
      snapshot,
      designTokenSetVersionId,
      changeNote,
    }) {
      const response = await fetchImpl("/api/promo-builder-documents", {
        method: "PATCH",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          baseDocumentRevision,
          snapshot,
          designTokenSetVersionId,
          changeNote,
        }),
      });
      return responseJson(response, "AI 프로모션 문서를 저장하지 못했습니다.");
    },

    async applyOperations({
      documentId,
      baseDocumentRevision,
      operations,
      summary,
    }) {
      const response = await fetchImpl("/api/promo-page-composition-operations", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply",
          documentId,
          baseDocumentRevision,
          idempotencyKey: `visual-editor:${documentId}:${Date.now()}`,
          operations,
          summary,
        }),
      });
      return responseJson(response, "AI 문서 자산 요청을 처리하지 못했습니다.");
    },
  });
}
