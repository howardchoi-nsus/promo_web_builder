import { upload } from "@vercel/blob/client";

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

let builderSessionPromise = null;

export function ensureBuilderSession() {
  if (!builderSessionPromise) {
    builderSessionPromise = request("/api/promo-builder-session", { method: "POST", body: "{}" })
      .catch((error) => {
        builderSessionPromise = null;
        throw error;
      });
  }
  return builderSessionPromise;
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
  return ensureBuilderSession()
    .then(() => request("/api/promo-builder-events", {
      method: "POST",
      body: JSON.stringify(payload),
    }))
    .catch(() => null);
}

export function createBuilderDocument(idempotencyKey = crypto.randomUUID()) {
  return request("/api/promo-builder-documents", {
    method: "POST",
    body: JSON.stringify({ mode: "ai", idempotencyKey }),
  });
}

export function createPromoRequestV3(payload, idempotencyKey = crypto.randomUUID()) {
  return request("/api/v3/promo-requests", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ contractVersion: 3, channel: "ai-builder", ...payload }),
  });
}

export function submitPromoFeedbackV3(requestId, payload) {
  return request(`/api/v3/promo-requests/${encodeURIComponent(requestId)}/feedback`, {
    method: "POST",
    body: JSON.stringify({ contractVersion: 3, ...payload }),
  });
}

export function reviewPromoRequestV3(requestId, payload) {
  return request(`/api/v3/promo-requests/${encodeURIComponent(requestId)}/review`, {
    method: "POST",
    body: JSON.stringify({ contractVersion: 3, ...payload }),
  });
}

export function cancelPromoRequestV3(requestId, reason = "") {
  return request(`/api/v3/promo-requests/${encodeURIComponent(requestId)}/cancel`, {
    method: "POST",
    body: JSON.stringify({ contractVersion: 3, reason }),
  });
}

export function loadBuilderDocument(documentId) {
  return request(`/api/promo-builder-documents?documentId=${encodeURIComponent(documentId)}`);
}

export function createChatWorkspace(documentId, requestId = "") {
  return request("/api/promo-builder-chat-sessions", {
    method: "POST",
    body: JSON.stringify({ documentId, requestId }),
  });
}

export function loadChatWorkspace(sessionId) {
  return request(`/api/promo-builder-chat-sessions?sessionId=${encodeURIComponent(sessionId)}`);
}

export function listChatWorkspaces(limit = 30) {
  return request(`/api/promo-builder-chat-sessions?limit=${encodeURIComponent(limit)}`);
}

export function saveChatMessage(sessionId, message) {
  return request("/api/promo-builder-chat-messages", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}

export function saveRequirementsRevision(payload) {
  return request("/api/promo-builder-requirements-revisions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function executeChatAction(payload) {
  return request("/api/promo-builder-chat-actions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function saveWireframeRevision(payload) {
  return request("/api/promo-builder-wireframes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function confirmWireframeRevision(payload) {
  return request("/api/promo-builder-wireframes-confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function analyzeOverview(naturalLanguage, context = {}) {
  return request("/api/promo-overview-parse", {
    method: "POST",
    body: JSON.stringify({
      mode: "natural-language",
      generationMode: "new-draft",
      naturalLanguage,
      locale: context.locale || "",
      market: context.market || "",
      productCatalog: context.productCatalog || [],
      currentOverview: context.currentOverview || {},
    }),
  });
}

const COMPONENT_SOURCE_UPLOAD_PREFIX = "component-source-uploads/";
const COMPONENT_SOURCE_MAX_BYTES = 10 * 1024 * 1024;

export function imageDataUrlToBlob(value) {
  const match = /^data:([^;,]+);base64,([a-z0-9+/=\r\n]+)$/i.exec(String(value || ""));
  if (!match) throw new Error("붙여넣은 이미지 데이터가 올바르지 않습니다.");
  const binary = atob(match[2].replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  if (!bytes.length) throw new Error("빈 이미지는 업로드할 수 없습니다.");
  if (bytes.length > COMPONENT_SOURCE_MAX_BYTES) throw new Error("이미지는 10MB 이하여야 합니다.");
  return new Blob([bytes], { type: match[1].toLowerCase() });
}

function componentSourceExtension(mimeType) {
  return { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[mimeType] || "bin";
}

export async function uploadReferenceImage(payload) {
  await ensureBuilderSession();
  const image = imageDataUrlToBlob(payload.imageDataUrl);
  const pathname = `${COMPONENT_SOURCE_UPLOAD_PREFIX}${crypto.randomUUID()}.${componentSourceExtension(image.type)}`;
  const uploaded = await upload(pathname, image, {
    access: "private",
    handleUploadUrl: "/api/component-design-source-upload",
    contentType: image.type,
    multipart: image.size > 5 * 1024 * 1024,
    clientPayload: JSON.stringify({ fileName: String(payload.fileName || "").slice(0, 180) }),
  });
  return request("/api/component-design-sources", {
    method: "POST",
    body: JSON.stringify({
      fileName: payload.fileName,
      cropSpec: payload.cropSpec,
      imageBlob: {
        pathname: uploaded.pathname,
        contentType: uploaded.contentType || image.type,
        etag: uploaded.etag || "",
      },
    }),
  });
}

export function analyzeReferenceImage(payload) {
  return request("/api/component-generation-runs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteReferenceImage(sourceId) {
  return request(`/api/component-design-sources?id=${encodeURIComponent(sourceId)}`, {
    method: "DELETE",
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
      return await analyzeOverview(naturalLanguage, options.context || {});
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
