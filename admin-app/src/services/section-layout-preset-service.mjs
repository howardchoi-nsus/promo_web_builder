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

export function createInitialSectionLayout(items = []) {
  const visibleItems = items.filter((item) => item.isVisibleInWizard !== false);
  const geometry = (viewport) => Object.fromEntries(visibleItems.map((item, index) => [
    item.itemKey,
    {
      positionMode: "free",
      xPct: viewport === "mobile" ? 5 : 4 + ((index % 2) * 48),
      yPx: 16 + (Math.floor(index / (viewport === "mobile" ? 1 : 2)) * 72),
      widthPct: viewport === "mobile" ? 90 : 44,
      heightPx: 52,
      zIndex: 1,
    },
  ]));
  const minHeight = Math.max(
    160,
    40 + (Math.ceil(visibleItems.length / 2) * 72),
    40 + (visibleItems.length * 72),
  );
  return {
    contractVersion: 1,
    layoutMode: "free",
    sectionStyle: { minHeight, backgroundColor: "#0B0D12" },
    viewports: {
      desktop: { items: geometry("desktop"), visibility: { items: {} } },
      mobile: { items: geometry("mobile"), visibility: { items: {} } },
    },
  };
}

export function sectionLayoutEditorUrl(sectionId, layoutKey, origin = globalThis.location?.origin) {
  const url = new URL("/prototype/visual-editor.html", origin);
  url.searchParams.set("mode", "section-preset");
  url.searchParams.set("sectionId", sectionId);
  url.searchParams.set("layoutKey", layoutKey);
  return url.toString();
}

export const sectionLayoutPresetService = Object.freeze({
  list(sectionId, fetchImpl) {
    return requestJson(`/api/wizard-content-section-layouts?sectionId=${encodeURIComponent(sectionId)}`, {}, fetchImpl);
  },
  create(payload, fetchImpl) {
    return requestJson("/api/wizard-content-section-layouts", {
      method: "POST",
      body: JSON.stringify(payload),
    }, fetchImpl);
  },
  update(id, sectionId, payload, fetchImpl) {
    return requestJson("/api/wizard-content-section-layout", {
      method: "PATCH",
      body: JSON.stringify({ id, sectionId, ...payload }),
    }, fetchImpl);
  },
  remove(id, sectionId, fetchImpl) {
    return requestJson(
      `/api/wizard-content-section-layout?id=${encodeURIComponent(id)}&sectionId=${encodeURIComponent(sectionId)}`,
      { method: "DELETE" },
      fetchImpl,
    );
  },
  setDefault(id, sectionId, fetchImpl) {
    return requestJson("/api/wizard-content-section-layout-default", {
      method: "POST",
      body: JSON.stringify({ id, sectionId }),
    }, fetchImpl);
  },
  updateAiLayoutVariants(section, allowedLayoutVariants, fetchImpl) {
    return requestJson("/api/wizard-content-section", {
      method: "PATCH",
      body: JSON.stringify({
        id: section.id,
        aiDesign: {
          ...(section.aiDesign || {}),
          allowedLayoutVariants,
        },
        changeNote: "Layout Preset의 AI 사용 정책 변경.",
      }),
    }, fetchImpl);
  },
  editorUrl: sectionLayoutEditorUrl,
});
