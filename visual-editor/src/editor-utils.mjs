const SAFE_ABSOLUTE_PROTOCOLS = new Set(["http:", "https:"]);

export function normalizeCtaUrl(value) {
  const candidate = String(value || "").trim();
  if (!candidate) return "#";

  if (
    candidate.startsWith("#")
    || candidate.startsWith("./")
    || candidate.startsWith("../")
    || /^\/(?!\/)/.test(candidate)
  ) {
    return candidate;
  }

  try {
    const parsed = new URL(candidate);
    return SAFE_ABSOLUTE_PROTOCOLS.has(parsed.protocol.toLowerCase()) ? candidate : "#";
  } catch {
    return "#";
  }
}

export function withoutFreePosition(style = {}) {
  const nextStyle = { ...style };
  delete nextStyle.positionMode;
  delete nextStyle.xPct;
  delete nextStyle.yPx;
  delete nextStyle.yPct;
  return nextStyle;
}

export function persistSnapshot(storage, key, snapshot) {
  try {
    storage.setItem(key, JSON.stringify(snapshot));
    return { ok: true, code: "saved", message: "" };
  } catch (error) {
    const isQuotaError = error?.name === "QuotaExceededError"
      || error?.name === "NS_ERROR_DOM_QUOTA_REACHED"
      || error?.code === 22
      || error?.code === 1014;
    return {
      ok: false,
      code: isQuotaError ? "quota-exceeded" : "storage-failed",
      message: isQuotaError
        ? "브라우저 저장 공간이 부족합니다. 배경 이미지 용량을 줄이거나 제거한 뒤 다시 시도해주세요."
        : "Web Output Snapshot을 저장하지 못했습니다. 다시 시도해주세요.",
    };
  }
}
