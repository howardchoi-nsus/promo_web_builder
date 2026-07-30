async function readJson(response, fallback) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || fallback);
    error.status = response.status;
    error.code = payload.code || `HTTP_${response.status}`;
    throw error;
  }
  return payload;
}

export function createEditorLibraryAdapter({ fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");
  return Object.freeze({
    async loadComponents() {
      const response = await fetchImpl("/api/item-components", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await readJson(response, "컴포넌트 라이브러리를 불러오지 못했습니다.");
      return payload.components || [];
    },

    async loadSectionPresets() {
      const response = await fetchImpl("/api/wizard-content-sections?scope=public", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await readJson(response, "섹션 Preset을 불러오지 못했습니다.");
      return payload.sections || [];
    },

    async load() {
      const [components, sectionPresets] = await Promise.all([
        this.loadComponents(),
        this.loadSectionPresets(),
      ]);
      return { components, sectionPresets };
    },
  });
}
