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
    error.details = payload.details || payload.validation || null;
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
