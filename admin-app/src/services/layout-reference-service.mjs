async function request(options = {}) {
  const { endpoint = "/api/layout-references", ...requestOptions } = options;
  const response = await fetch(endpoint, {
    cache: "no-store",
    credentials: "same-origin",
    ...requestOptions,
    headers: { "Content-Type": "application/json", ...(requestOptions.headers || {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || result.error || `레이아웃 레퍼런스 요청 오류(${response.status})`);
    error.code = result.code || "LAYOUT_REFERENCE_REQUEST_FAILED";
    throw error;
  }
  return result;
}

export const layoutReferenceService = Object.freeze({
  list() { return request(); },
  create(payload) { return request({ method: "POST", body: JSON.stringify(payload) }); },
  update(id, payload) { return request({ method: "PATCH", body: JSON.stringify({ id, ...payload }) }); },
  analyze(payload) {
    return request({
      method: "POST",
      body: JSON.stringify(payload),
      // The analysis endpoint is separate so ordinary CRUD remains deterministic.
      endpoint: "/api/layout-reference-analyze",
    });
  },
});
