export const ACTIVE_ASSET_STATUSES = Object.freeze(["pending", "queued", "processing"]);

function assetTargetKey(request = {}) {
  return [
    request.targetType,
    request.pageSectionInstanceId,
    request.pageComponentInstanceId,
    request.fieldKey,
  ].map((value) => String(value || "")).join(":");
}

export function evaluateAssetReadiness(requests = [], expectedAssets) {
  const source = Array.isArray(requests) ? requests : [];
  const expected = Array.isArray(expectedAssets)
    ? expectedAssets.filter((asset) => asset?.required !== false)
    : null;
  if (expected) {
    const requestIds = new Set(source.map((request) => String(request?.assetRequestId || "")).filter(Boolean));
    const requestTargets = new Set(source.map(assetTargetKey));
    const missingExpected = expected.filter((asset) => {
      const assetRequestId = String(asset?.assetRequestId || "");
      return assetRequestId
        ? !requestIds.has(assetRequestId)
        : !requestTargets.has(assetTargetKey(asset));
    });
    if (missingExpected.length) {
      return {
        state: "failed",
        total: source.length,
        ready: 0,
        active: source.length,
        failed: missingExpected.length,
        failedRequests: missingExpected.map((asset) => ({
          ...asset,
          status: "failed",
          errorCode: "ASSET_REQUEST_COVERAGE_MISMATCH",
          errorMessage: "필수 이미지 생성 요청이 누락되었습니다.",
        })),
        expected: expected.length,
        coverage: expected.length ? (expected.length - missingExpected.length) / expected.length : 1,
        missingExpected,
      };
    }
  }
  if (!source.length) {
    const result = { state: "ready", total: 0, ready: 0, active: 0, failed: 0, failedRequests: [] };
    return expected ? { ...result, expected: expected.length, coverage: 1, missingExpected: [] } : result;
  }

  const normalized = source.map((request) => ({
    ...request,
    status: String(request?.status || "pending").trim().toLowerCase(),
  }));
  const failedRequests = normalized.filter((request) => request.status === "failed");
  const ready = normalized.filter((request) => request.status === "ready").length;
  const active = normalized.filter((request) => ACTIVE_ASSET_STATUSES.includes(request.status)).length;

  if (failedRequests.length) {
    const result = {
      state: "failed",
      total: normalized.length,
      ready,
      active,
      failed: failedRequests.length,
      failedRequests,
    };
    return expected ? { ...result, expected: expected.length, coverage: 1, missingExpected: [] } : result;
  }
  if (ready === normalized.length) {
    const result = { state: "ready", total: normalized.length, ready, active: 0, failed: 0, failedRequests: [] };
    return expected ? { ...result, expected: expected.length, coverage: 1, missingExpected: [] } : result;
  }
  const result = {
    state: "waiting",
    total: normalized.length,
    ready,
    active: normalized.length - ready,
    failed: 0,
    failedRequests: [],
  };
  return expected ? { ...result, expected: expected.length, coverage: 1, missingExpected: [] } : result;
}
