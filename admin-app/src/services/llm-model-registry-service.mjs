async function request(options = {}) {
  const response = await fetch("/api/llm-models", {
    cache: "no-store",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || `LLM 모델 요청 오류(${response.status})`);
    error.code = result.code || "LLM_MODEL_REQUEST_FAILED";
    throw error;
  }
  return result;
}

export const llmModelRegistryService = Object.freeze({
  async list() {
    return request();
  },
  async create(payload) {
    return request({ method: "POST", body: JSON.stringify(payload) });
  },
  async update(id, payload) {
    return request({ method: "PATCH", body: JSON.stringify({ id, ...payload }) });
  },
});
