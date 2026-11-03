import assert from "node:assert/strict";
import {
  PROMO_SERVICE_CONTRACT_VERSION,
  assertDomainEventV3,
  assertGenerationContextV3,
  assertGenerationJobV3,
  assertPromoRequestV3,
  assertPromotionApprovalV3,
  assertPublicationCommandV3,
} from "../packages/promo-contracts/src/service-v3.mjs";

assert.equal(PROMO_SERVICE_CONTRACT_VERSION, 3);

const request = assertPromoRequestV3({
  contractVersion: 3,
  channel: "nuxt-portal",
  requestedBy: "user-1",
  brief: { requestText: "신규 가입 프로모션", locale: "ko-KR", market: "kr" },
});
assert.equal(request.status, "requested");
assert.equal(request.brief.market, "KR");
assert.throws(() => assertPromoRequestV3({
  contractVersion: 2,
  channel: "api",
  brief: { requestText: "legacy" },
}), (error) => error.code === "PROMO_SERVICE_V3_CONTRACT_INVALID"
  && error.validation.errors.some((item) => item.code === "UNSUPPORTED_CONTRACT_VERSION"));

const job = assertGenerationJobV3({
  contractVersion: 3,
  requestId: "request-1",
  pipeline: "composition",
  inputSnapshot: { brief: "snapshot" },
});
assert.equal(job.status, "accepted");
assert.throws(() => assertGenerationJobV3({ contractVersion: 3, requestId: "request-1", pipeline: "unknown" }), /validation failed/);

const context = assertGenerationContextV3({
  contractVersion: 3,
  contextVersion: "hash-1",
  components: [],
  designTokens: {},
});
assert.equal(context.contextVersion, "hash-1");

const event = assertDomainEventV3({
  eventVersion: 3,
  eventId: "event-1",
  eventType: "PromotionApproved",
  occurredAt: "2026-11-03T00:00:00.000Z",
  producer: "cms-domain",
  correlationId: "request-1",
  aggregate: { type: "Promotion", id: "promotion-1", version: 12 },
  data: { snapshotId: "snapshot-1" },
});
assert.equal(event.aggregate.version, 12);

assert.equal(assertPromotionApprovalV3({
  contractVersion: 3,
  requestId: "request-1",
  documentId: "document-1",
  documentRevision: 3,
  decision: "approved",
  decidedBy: "owner-1",
}).decision, "approved");

assert.equal(assertPublicationCommandV3({
  contractVersion: 3,
  requestId: "request-1",
  approvalId: "approval-1",
  slug: "welcome-promo",
  locale: "ko-KR",
}).slug, "welcome-promo");

console.log("Promo service V3 contracts passed");
