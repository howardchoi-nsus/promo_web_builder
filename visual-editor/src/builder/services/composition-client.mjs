async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || `Request failed (${response.status})`);
    error.code = payload.code || `HTTP_${response.status}`;
    error.status = response.status;
    error.details = payload.details || payload.validation || payload.errors || null;
    error.retryable = payload.retryable === true;
    error.retryPolicy = payload.retryPolicy || null;
    error.requestId = payload.requestId || "";
    error.providerErrorType = payload.providerErrorType || "";
    error.executionDisplay = payload.executionDisplay || null;
    throw error;
  }
  return payload;
}

export function ensureBuilderSession() {
  return request("/api/promo-builder-session", { method: "POST", body: "{}" });
}

export function loadBuilderCapabilities() {
  return request("/api/promo-builder-capabilities");
}

export function loadCompositionShells() {
  return request("/api/promo-composition-shells?scope=public");
}

export function loadPromptExecutionDisplay(type) {
  return request(`/api/prompt-execution-display?type=${encodeURIComponent(type)}`);
}

export function recordBuilderEvent(payload) {
  return request("/api/promo-builder-events", {
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => null);
}

export function createBuilderDocument(idempotencyKey = crypto.randomUUID()) {
  return request("/api/promo-builder-documents", {
    method: "POST",
    body: JSON.stringify({ mode: "ai", idempotencyKey }),
  });
}

export function loadBuilderDocument(documentId) {
  return request(`/api/promo-builder-documents?documentId=${encodeURIComponent(documentId)}`);
}

export function analyzeOverview(naturalLanguage) {
  return request("/api/promo-overview-parse", {
    method: "POST",
    body: JSON.stringify({ mode: "natural-language", naturalLanguage }),
  });
}

function normalizedRetryPolicy(value = {}) {
  const maxAttempts = Math.min(5, Math.max(1, Math.round(Number(value.maxAttempts) || 1)));
  const retryBaseMs = Math.max(0, Math.round(Number(value.retryBaseMs) || 0));
  const retryMaxMs = Math.max(0, Math.round(Number(value.retryMaxMs) || 0));
  return { maxAttempts, retryBaseMs, retryMaxMs };
}

function retryDelayMs(policy, completedAttempts) {
  const exponentialDelay = policy.retryBaseMs * (2 ** Math.max(0, completedAttempts - 1));
  return policy.retryMaxMs > 0
    ? Math.min(policy.retryMaxMs, exponentialDelay)
    : exponentialDelay;
}

export async function analyzeOverviewWithRetry(naturalLanguage, options = {}) {
  const wait = options.wait || ((delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs)));
  let attempt = 1;
  while (true) {
    try {
      return await analyzeOverview(naturalLanguage);
    } catch (error) {
      const policy = normalizedRetryPolicy(error.retryPolicy || {});
      if (!error.retryable || attempt >= policy.maxAttempts) throw error;
      const delayMs = retryDelayMs(policy, attempt);
      attempt += 1;
      options.onRetry?.({
        attempt,
        maxAttempts: policy.maxAttempts,
        delayMs,
        requestId: error.requestId,
        providerErrorType: error.providerErrorType,
        executionDisplay: error.executionDisplay,
      });
      await wait(delayMs);
    }
  }
}

export function createCompositionProposal(payload) {
  return request("/api/promo-page-composition-proposals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loadCompositionProposal(proposalId) {
  return request(`/api/promo-page-composition-proposals?proposalId=${encodeURIComponent(proposalId)}`);
}

export function applyCompositionProposal(payload) {
  return request("/api/promo-page-composition-apply", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function rollbackComposition(payload) {
  return request("/api/promo-page-composition-rollback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitCompositionOperation(payload) {
  return request("/api/promo-page-composition-operations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function retryBuilderAssets(payload) {
  return request("/api/promo-builder-assets-retry", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
