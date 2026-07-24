function responseError(result, fallback, status) {
  return new Error(result?.message || result?.error || `${fallback}${status ? `(${status})` : ""}`);
}

async function readJson(response) {
  return response.json().catch(() => ({}));
}

export function createAdminTemplateAdapter({ fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");

  return Object.freeze({
    async loadLayout(templateId) {
      if (!templateId) throw new Error("templateId가 필요합니다.");
      const response = await fetchImpl(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(templateId)}`);
      const result = await readJson(response);
      if (!response.ok) throw responseError(result, "기본 레이아웃을 불러오지 못했습니다.", response.status);
      return result;
    },

    async saveLayout(payload) {
      const response = await fetchImpl("/api/wizard-form-template-layout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readJson(response);
      if (!response.ok) throw responseError(result, "레이아웃 저장 오류", response.status);
      return result;
    },

    async activateTemplate(payload) {
      const response = await fetchImpl("/api/wizard-form-template-activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readJson(response);
      if (!response.ok) throw responseError(result, "템플릿 활성화 오류", response.status);
      return result;
    },
  });
}
