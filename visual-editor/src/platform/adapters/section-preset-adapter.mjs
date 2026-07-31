async function requestJson(url, options = {}, fetchImpl = globalThis.fetch) {
  const response = await fetchImpl(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || result.error || `Request failed (${response.status})`);
    error.validationErrors = result.errors || [];
    throw error;
  }
  return result;
}

export const sectionPresetAdapter = Object.freeze({
  async load(sectionId, fetchImpl) {
    const query = `sectionId=${encodeURIComponent(sectionId)}`;
    const [detail, layouts] = await Promise.all([
      requestJson(`/api/wizard-content-section?id=${encodeURIComponent(sectionId)}`, {}, fetchImpl),
      requestJson(`/api/wizard-content-section-layouts?${query}`, {}, fetchImpl),
    ]);
    return {
      section: detail.section,
      items: detail.items || [],
      layouts: layouts.layouts || [],
    };
  },
  update(layoutId, sectionId, payload, fetchImpl) {
    return requestJson("/api/wizard-content-section-layout", {
      method: "PATCH",
      body: JSON.stringify({ id: layoutId, sectionId, ...payload }),
    }, fetchImpl);
  },
});

