export const PROMO_SERVICE_CONTRACT_VERSION = 3;

export const PROMO_REQUEST_STATUSES_V3 = Object.freeze([
  "requested", "validating", "analyzing", "queued", "generating",
  "review_required", "approved", "rejected", "publishing", "published",
  "failed", "cancelled",
]);

export const GENERATION_JOB_STATUSES_V3 = Object.freeze([
  "accepted", "queued", "running", "quality_checking", "ready", "failed", "cancelled",
]);

export const DOMAIN_EVENT_TYPES_V3 = Object.freeze([
  "PromoRequestCreated", "PromoRequestFeedbackAdded", "PromoRequestCancelled",
  "GenerationStarted", "GenerationProgressed", "DraftReady",
  "PromotionApproved", "PromotionRejected", "PublicationRequested",
  "PublicationCompleted", "PublicationFailed",
]);

const CHANNELS = new Set(["nuxt-portal", "slack", "ai-builder", "api"]);
const PIPELINES = new Set(["composition", "final-design", "text-first"]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function text(value, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function validationError(errors) {
  const error = new Error("Promo service V3 contract validation failed");
  error.code = "PROMO_SERVICE_V3_CONTRACT_INVALID";
  error.statusCode = 422;
  error.validation = { ok: false, errors };
  return error;
}

function assertVersion(candidate, errors) {
  if (Number(candidate) !== PROMO_SERVICE_CONTRACT_VERSION) {
    errors.push({
      code: "UNSUPPORTED_CONTRACT_VERSION",
      path: "contractVersion",
      message: "contractVersion must be 3",
    });
  }
}

export function normalizePromoRequestV3(candidate = {}) {
  const source = object(candidate);
  const brief = object(source.brief);
  return {
    contractVersion: PROMO_SERVICE_CONTRACT_VERSION,
    requestId: text(source.requestId, 128),
    channel: text(source.channel || "api", 32).toLowerCase(),
    requestedBy: text(source.requestedBy, 256),
    status: text(source.status || "requested", 32).toLowerCase(),
    brief: {
      title: text(brief.title, 200),
      purpose: text(brief.purpose, 100),
      market: text(brief.market, 20).toUpperCase(),
      locale: text(brief.locale || "ko-KR", 20),
      requestText: text(brief.requestText, 10000),
    },
    references: object(source.references),
  };
}

export function validatePromoRequestV3(candidate = {}) {
  const normalized = normalizePromoRequestV3(candidate);
  const errors = [];
  assertVersion(candidate.contractVersion, errors);
  if (!CHANNELS.has(normalized.channel)) errors.push({ code: "CHANNEL_INVALID", path: "channel", message: "Unsupported request channel" });
  if (!normalized.requestedBy) errors.push({ code: "REQUESTED_BY_REQUIRED", path: "requestedBy", message: "requestedBy is required" });
  if (!PROMO_REQUEST_STATUSES_V3.includes(normalized.status)) errors.push({ code: "STATUS_INVALID", path: "status", message: "Unsupported request status" });
  if (!normalized.brief.requestText) errors.push({ code: "REQUEST_TEXT_REQUIRED", path: "brief.requestText", message: "brief.requestText is required" });
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(normalized.brief.locale)) errors.push({ code: "LOCALE_INVALID", path: "brief.locale", message: "brief.locale is invalid" });
  return { ok: errors.length === 0, value: normalized, errors };
}

export function assertPromoRequestV3(candidate = {}) {
  const result = validatePromoRequestV3(candidate);
  if (!result.ok) throw validationError(result.errors);
  return result.value;
}

export function normalizeGenerationJobV3(candidate = {}) {
  const source = object(candidate);
  return {
    contractVersion: PROMO_SERVICE_CONTRACT_VERSION,
    jobId: text(source.jobId, 128),
    requestId: text(source.requestId, 128),
    pipeline: text(source.pipeline || "composition", 50).toLowerCase(),
    status: text(source.status || "accepted", 32).toLowerCase(),
    attempt: Math.max(0, Math.trunc(Number(source.attempt) || 0)),
    inputSnapshot: object(source.inputSnapshot),
    inputSnapshotId: text(source.inputSnapshotId, 128),
    resultReference: source.resultReference == null ? null : object(source.resultReference),
  };
}

export function validateGenerationJobV3(candidate = {}) {
  const normalized = normalizeGenerationJobV3(candidate);
  const errors = [];
  assertVersion(candidate.contractVersion, errors);
  if (!normalized.requestId) errors.push({ code: "REQUEST_ID_REQUIRED", path: "requestId", message: "requestId is required" });
  if (!PIPELINES.has(normalized.pipeline)) errors.push({ code: "PIPELINE_INVALID", path: "pipeline", message: "Unsupported generation pipeline" });
  if (!GENERATION_JOB_STATUSES_V3.includes(normalized.status)) errors.push({ code: "STATUS_INVALID", path: "status", message: "Unsupported generation status" });
  return { ok: errors.length === 0, value: normalized, errors };
}

export function assertGenerationJobV3(candidate = {}) {
  const result = validateGenerationJobV3(candidate);
  if (!result.ok) throw validationError(result.errors);
  return result.value;
}

export function normalizeGenerationContextV3(candidate = {}) {
  const source = object(candidate);
  return {
    contractVersion: PROMO_SERVICE_CONTRACT_VERSION,
    contextVersion: text(source.contextVersion, 128),
    components: Array.isArray(source.components) ? source.components : [],
    designTokens: object(source.designTokens),
    contentResources: Array.isArray(source.contentResources) ? source.contentResources : [],
    assets: Array.isArray(source.assets) ? source.assets : [],
    policies: object(source.policies),
  };
}

export function assertGenerationContextV3(candidate = {}) {
  const normalized = normalizeGenerationContextV3(candidate);
  const errors = [];
  assertVersion(candidate.contractVersion, errors);
  if (!normalized.contextVersion) errors.push({ code: "CONTEXT_VERSION_REQUIRED", path: "contextVersion", message: "contextVersion is required" });
  if (errors.length) throw validationError(errors);
  return normalized;
}

export function normalizePromotionApprovalV3(candidate = {}) {
  const source = object(candidate);
  return {
    contractVersion: PROMO_SERVICE_CONTRACT_VERSION,
    approvalId: text(source.approvalId, 128),
    requestId: text(source.requestId, 128),
    promotionId: text(source.promotionId || source.requestId, 128),
    documentId: text(source.documentId, 128),
    documentRevision: Math.max(0, Math.trunc(Number(source.documentRevision) || 0)),
    decision: text(source.decision, 20).toLowerCase(),
    decidedBy: text(source.decidedBy, 256),
    decidedAt: text(source.decidedAt, 50),
    comment: text(source.comment, 2000),
    snapshotHash: text(source.snapshotHash, 128),
  };
}

export function assertPromotionApprovalV3(candidate = {}) {
  const normalized = normalizePromotionApprovalV3(candidate);
  const errors = [];
  assertVersion(candidate.contractVersion, errors);
  if (!normalized.requestId) errors.push({ code: "REQUEST_ID_REQUIRED", path: "requestId", message: "requestId is required" });
  if (!normalized.documentId) errors.push({ code: "DOCUMENT_ID_REQUIRED", path: "documentId", message: "documentId is required" });
  if (normalized.documentRevision < 1) errors.push({ code: "DOCUMENT_REVISION_REQUIRED", path: "documentRevision", message: "documentRevision must be positive" });
  if (!["approved", "rejected"].includes(normalized.decision)) errors.push({ code: "DECISION_INVALID", path: "decision", message: "decision must be approved or rejected" });
  if (!normalized.decidedBy) errors.push({ code: "DECIDED_BY_REQUIRED", path: "decidedBy", message: "decidedBy is required" });
  if (errors.length) throw validationError(errors);
  return normalized;
}

export function normalizePublicationCommandV3(candidate = {}) {
  const source = object(candidate);
  return {
    contractVersion: PROMO_SERVICE_CONTRACT_VERSION,
    requestId: text(source.requestId, 128),
    approvalId: text(source.approvalId, 128),
    slug: text(source.slug, 200).toLowerCase(),
    locale: text(source.locale || "ko-KR", 20),
    seo: object(source.seo),
    manifest: object(source.manifest),
    revalidateSeconds: Math.min(86400, Math.max(0, Math.trunc(Number(source.revalidateSeconds) || 300))),
  };
}

export function assertPublicationCommandV3(candidate = {}) {
  const normalized = normalizePublicationCommandV3(candidate);
  const errors = [];
  assertVersion(candidate.contractVersion, errors);
  if (!normalized.requestId) errors.push({ code: "REQUEST_ID_REQUIRED", path: "requestId", message: "requestId is required" });
  if (!normalized.approvalId) errors.push({ code: "APPROVAL_ID_REQUIRED", path: "approvalId", message: "approvalId is required" });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized.slug)) errors.push({ code: "SLUG_INVALID", path: "slug", message: "slug is invalid" });
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(normalized.locale)) errors.push({ code: "LOCALE_INVALID", path: "locale", message: "locale is invalid" });
  if (errors.length) throw validationError(errors);
  return normalized;
}

export function normalizeDomainEventV3(candidate = {}) {
  const source = object(candidate);
  const aggregate = object(source.aggregate);
  return {
    eventVersion: PROMO_SERVICE_CONTRACT_VERSION,
    eventId: text(source.eventId, 128),
    eventType: text(source.eventType, 80),
    occurredAt: text(source.occurredAt, 50),
    producer: text(source.producer, 80),
    correlationId: text(source.correlationId, 128),
    aggregate: {
      type: text(aggregate.type, 80),
      id: text(aggregate.id, 128),
      version: Math.max(0, Math.trunc(Number(aggregate.version) || 0)),
    },
    data: object(source.data),
  };
}

export function assertDomainEventV3(candidate = {}) {
  const normalized = normalizeDomainEventV3(candidate);
  const errors = [];
  if (Number(candidate.eventVersion) !== PROMO_SERVICE_CONTRACT_VERSION) errors.push({ code: "UNSUPPORTED_EVENT_VERSION", path: "eventVersion", message: "eventVersion must be 3" });
  if (!normalized.eventId) errors.push({ code: "EVENT_ID_REQUIRED", path: "eventId", message: "eventId is required" });
  if (!DOMAIN_EVENT_TYPES_V3.includes(normalized.eventType)) errors.push({ code: "EVENT_TYPE_INVALID", path: "eventType", message: "Unsupported event type" });
  if (!normalized.occurredAt || Number.isNaN(Date.parse(normalized.occurredAt))) errors.push({ code: "OCCURRED_AT_INVALID", path: "occurredAt", message: "occurredAt must be an ISO timestamp" });
  if (!normalized.producer) errors.push({ code: "PRODUCER_REQUIRED", path: "producer", message: "producer is required" });
  if (!normalized.correlationId) errors.push({ code: "CORRELATION_ID_REQUIRED", path: "correlationId", message: "correlationId is required" });
  if (!normalized.aggregate.type || !normalized.aggregate.id) errors.push({ code: "AGGREGATE_REQUIRED", path: "aggregate", message: "aggregate.type and aggregate.id are required" });
  if (errors.length) throw validationError(errors);
  return normalized;
}
