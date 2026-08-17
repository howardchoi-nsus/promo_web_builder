export const ACTIVE_ASSET_STATUSES = Object.freeze(["pending", "queued", "processing"]);

export function evaluateAssetReadiness(requests = []) {
  const source = Array.isArray(requests) ? requests : [];
  if (!source.length) {
    return { state: "ready", total: 0, ready: 0, active: 0, failed: 0, failedRequests: [] };
  }

  const normalized = source.map((request) => ({
    ...request,
    status: String(request?.status || "pending").trim().toLowerCase(),
  }));
  const failedRequests = normalized.filter((request) => request.status === "failed");
  const ready = normalized.filter((request) => request.status === "ready").length;
  const active = normalized.filter((request) => ACTIVE_ASSET_STATUSES.includes(request.status)).length;

  if (failedRequests.length) {
    return {
      state: "failed",
      total: normalized.length,
      ready,
      active,
      failed: failedRequests.length,
      failedRequests,
    };
  }
  if (ready === normalized.length) {
    return { state: "ready", total: normalized.length, ready, active: 0, failed: 0, failedRequests: [] };
  }
  return {
    state: "waiting",
    total: normalized.length,
    ready,
    active: normalized.length - ready,
    failed: 0,
    failedRequests: [],
  };
}
