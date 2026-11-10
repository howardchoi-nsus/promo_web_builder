const { createHash } = require("node:crypto");
const { getSql } = require("./_promo-builder-document-store");

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = stableValue(value[key]);
    return result;
  }, {});
}

function stableJson(value) {
  return JSON.stringify(stableValue(value || {}));
}

function sha256(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function requestFromRow(row) {
  if (!row) return null;
  return {
    contractVersion: 3,
    requestId: row.id,
    channel: row.channel,
    requestedBy: row.owner_subject,
    status: row.status,
    brief: row.brief_json || {},
    references: row.references_json || {},
    documentId: row.document_id || null,
    generationJobId: row.generation_job_id || null,
    publicationId: row.publication_id || null,
    lastEventId: row.last_event_id || null,
    lastEventAt: row.last_event_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    approval: row.approval_id ? {
      approvalId: row.approval_id,
      decision: row.approval_decision,
      documentRevision: Number(row.approval_revision || 0),
    } : null,
  };
}

function jobFromRow(row) {
  if (!row) return null;
  return {
    contractVersion: 3,
    jobId: row.id,
    requestId: row.request_id,
    pipeline: row.pipeline,
    status: row.status,
    attempt: Number(row.attempt || 0),
    inputSnapshotId: row.input_hash,
    inputSnapshot: row.input_snapshot || {},
    resultReference: row.result_reference || null,
    error: row.error_json || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function createPromoRequestV3(sql, input) {
  const rows = await sql`
    with created as (
      insert into user_service.promo_requests (
        owner_subject, idempotency_key, channel, status, brief_json, references_json
      ) values (
        ${input.ownerSubject}, ${input.idempotencyKey}, ${input.channel}, 'requested',
        ${JSON.stringify(input.brief)}::jsonb, ${JSON.stringify(input.references || {})}::jsonb
      )
      on conflict (owner_subject, idempotency_key) do nothing
      returning *
    ), recorded as (
      insert into user_service.domain_outbox (
        event_type, producer, correlation_id, aggregate_type, aggregate_id, aggregate_version, payload
      )
      select 'PromoRequestCreated', 'user-service', created.id::text,
        'PromoRequest', created.id::text, 1,
        jsonb_build_object('channel', created.channel, 'brief', created.brief_json)
      from created
      returning event_id
    )
    select created.*, true as was_created from created
    union all
    select existing.*, false as was_created
    from user_service.promo_requests existing
    where existing.owner_subject = ${input.ownerSubject}
      and existing.idempotency_key = ${input.idempotencyKey}
      and not exists (select 1 from created)
    limit 1
  `;
  return { created: Boolean(rows[0]?.was_created), request: requestFromRow(rows[0]) };
}

async function attachDocumentToRequestV3(sql, { requestId, ownerSubject, documentId }) {
  const rows = await sql`
    update user_service.promo_requests
    set document_id = coalesce(document_id, ${documentId}::uuid), updated_at = now()
    where id = ${requestId}::uuid and owner_subject = ${ownerSubject}
    returning *
  `;
  return requestFromRow(rows[0]);
}

async function findPromoRequestV3(sql, { requestId, ownerSubject }) {
  const rows = await sql`
    select request.*, approval.id::text as approval_id,
      approval.decision as approval_decision, approval.document_revision as approval_revision
    from user_service.promo_requests request
    left join lateral (
      select * from cms.promotion_approvals candidate
      where candidate.request_id = request.id
      order by candidate.decided_at desc limit 1
    ) approval on true
    where request.id = ${requestId}::uuid and request.owner_subject = ${ownerSubject}
    limit 1
  `;
  return requestFromRow(rows[0]);
}

async function listPromoRequestsV3(sql, { ownerSubject, limit = 50 }) {
  const rows = await sql`
    select request.*, approval.id::text as approval_id,
      approval.decision as approval_decision, approval.document_revision as approval_revision
    from user_service.promo_requests request
    left join lateral (
      select * from cms.promotion_approvals candidate
      where candidate.request_id = request.id
      order by candidate.decided_at desc limit 1
    ) approval on true
    where request.owner_subject = ${ownerSubject}
    order by request.updated_at desc
    limit ${Math.max(1, Math.min(Number(limit) || 50, 100))}
  `;
  return rows.map(requestFromRow);
}

async function findGenerationJobV3(sql, jobId) {
  const rows = await sql`
    select job.*
    from llm_runtime.generation_jobs job
    where job.id = ${jobId}::uuid limit 1
  `;
  return jobFromRow(rows[0]);
}

async function savePromoRequestFeedbackV3(sql, input) {
  const rows = await sql`
    with request as (
      select * from user_service.promo_requests
      where id = ${input.requestId}::uuid and owner_subject = ${input.ownerSubject}
    ), created as (
      insert into user_service.promo_request_feedback (
        request_id, submitted_by, feedback_text, base_document_revision
      )
      select id, ${input.ownerSubject}, ${input.feedbackText}, ${input.baseDocumentRevision || null}
      from request
      returning *
    ), recorded as (
      insert into user_service.domain_outbox (
        event_type, producer, correlation_id, aggregate_type, aggregate_id, aggregate_version, payload
      )
      select 'PromoRequestFeedbackAdded', 'user-service', created.request_id::text,
        'PromoRequest', created.request_id::text, 1,
        jsonb_build_object('feedbackId', created.id::text, 'feedbackText', created.feedback_text,
          'baseDocumentRevision', created.base_document_revision)
      from created
    ), updated as (
      update user_service.promo_requests target
      set status = 'analyzing', updated_at = now()
      from created where target.id = created.request_id
      returning target.*
    )
    select created.id::text as feedback_id, created.feedback_text,
      created.base_document_revision, created.created_at, updated.id::text as request_id
    from created join updated on updated.id = created.request_id
  `;
  if (!rows[0]) return null;
  return {
    feedbackId: rows[0].feedback_id,
    requestId: rows[0].request_id,
    feedbackText: rows[0].feedback_text,
    baseDocumentRevision: rows[0].base_document_revision,
    createdAt: rows[0].created_at,
  };
}

async function cancelPromoRequestV3(sql, input) {
  const rows = await sql`
    with updated as (
      update user_service.promo_requests
      set status = 'cancelled', updated_at = now()
      where id = ${input.requestId}::uuid and owner_subject = ${input.ownerSubject}
        and status not in ('published', 'cancelled')
      returning *
    ), cancelled_jobs as (
      update llm_runtime.generation_jobs job
      set status = 'cancelled', updated_at = now()
      from updated where job.request_id = updated.id
        and job.status not in ('ready', 'failed', 'cancelled')
    ), recorded as (
      insert into user_service.domain_outbox (
        event_type, producer, correlation_id, aggregate_type, aggregate_id, aggregate_version, payload
      )
      select 'PromoRequestCancelled', 'user-service', id::text,
        'PromoRequest', id::text, 1, jsonb_build_object('reason', ${input.reason || ""})
      from updated
    )
    select * from updated
  `;
  return requestFromRow(rows[0]);
}

function approvalFromRow(row) {
  if (!row) return null;
  return {
    contractVersion: 3,
    approvalId: row.id,
    requestId: row.request_id,
    promotionId: row.promotion_id,
    documentId: row.document_id,
    documentRevision: Number(row.document_revision),
    decision: row.decision,
    decidedBy: row.decided_by,
    decidedAt: row.decided_at,
    comment: row.comment || "",
    snapshotHash: row.snapshot_hash || "",
  };
}

async function savePromotionApprovalV3(sql, input) {
  const eventType = input.decision === "approved" ? "PromotionApproved" : "PromotionRejected";
  const rows = await sql`
    with owned_request as (
      select * from user_service.promo_requests
      where id = ${input.requestId}::uuid and owner_subject = ${input.ownerSubject}
        and document_id = ${input.documentId}::uuid
    ), created as (
      insert into cms.promotion_approvals (
        request_id, promotion_id, document_id, document_revision, decision,
        decided_by, comment, snapshot_hash
      )
      select id, id, document_id, ${input.documentRevision}, ${input.decision},
        ${input.ownerSubject}, ${input.comment || ""}, ${input.snapshotHash || ""}
      from owned_request
      returning *
    ), recorded as (
      insert into cms.domain_outbox (
        event_type, producer, correlation_id, aggregate_type, aggregate_id, aggregate_version, payload
      )
      select ${eventType}, 'cms-domain', request_id::text,
        'Promotion', promotion_id::text, document_revision,
        jsonb_build_object('approvalId', id::text, 'documentId', document_id::text,
          'documentRevision', document_revision, 'snapshotHash', snapshot_hash)
      from created
    ), updated as (
      update user_service.promo_requests target
      set status = ${input.decision === "approved" ? "approved" : "rejected"}, updated_at = now()
      from created where target.id = created.request_id
    )
    select * from created
  `;
  return approvalFromRow(rows[0]);
}

async function findPromotionApprovalV3(sql, { approvalId, requestId, ownerSubject }) {
  const rows = await sql`
    select approval.* from cms.promotion_approvals approval
    join user_service.promo_requests request on request.id = approval.request_id
    where approval.id = ${approvalId}::uuid
      and approval.request_id = ${requestId}::uuid
      and request.owner_subject = ${ownerSubject}
      and approval.decision = 'approved'
    limit 1
  `;
  return approvalFromRow(rows[0]);
}

async function savePublicationSnapshotV3(sql, input) {
  const rows = await sql`
    with created as (
      insert into web_output.publication_snapshots (
        approval_id, promotion_id, document_id, document_revision, locale, slug,
        status, snapshot_json, snapshot_hash, production_url, published_at
      ) values (
        ${input.approvalId}::uuid, ${input.promotionId}::uuid, ${input.documentId}::uuid,
        ${input.documentRevision}, ${input.locale}, ${input.slug}, 'published',
        ${JSON.stringify(input.snapshot)}::jsonb, ${input.snapshotHash}, ${input.productionUrl || null}, now()
      )
      on conflict (locale, slug, snapshot_hash) do update set
        status = 'published', production_url = excluded.production_url,
        published_at = coalesce(web_output.publication_snapshots.published_at, now()), updated_at = now()
      returning *
    ), recorded as (
      insert into web_output.domain_outbox (
        event_type, producer, correlation_id, aggregate_type, aggregate_id, aggregate_version, payload
      )
      select 'PublicationCompleted', 'web-output', ${input.requestId},
        'Publication', id::text, document_revision,
        jsonb_build_object('publicationId', id::text, 'slug', slug, 'locale', locale,
          'productionUrl', production_url)
      from created
    ), updated as (
      update user_service.promo_requests target
      set publication_id = created.id, status = 'published', updated_at = now()
      from created where target.id = ${input.requestId}::uuid
    )
    select * from created
  `;
  if (!rows[0]) return null;
  return {
    contractVersion: 3,
    publicationId: rows[0].id,
    requestId: input.requestId,
    approvalId: rows[0].approval_id,
    slug: rows[0].slug,
    locale: rows[0].locale,
    status: rows[0].status,
    productionUrl: rows[0].production_url || "",
    snapshotHash: rows[0].snapshot_hash,
    publishedAt: rows[0].published_at,
  };
}

const EVENT_REQUEST_STATUS = Object.freeze({
  PromoRequestCreated: "requested",
  PromoRequestFeedbackAdded: "analyzing",
  PromoRequestCancelled: "cancelled",
  GenerationStarted: "generating",
  GenerationProgressed: "generating",
  DraftReady: "review_required",
  PromotionApproved: "approved",
  PromotionRejected: "rejected",
  PublicationRequested: "publishing",
  PublicationCompleted: "published",
  PublicationFailed: "failed",
});

async function pendingDomainEventsV3(sql, limit = 100) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 500));
  return sql`
    select * from (
      select 'user_service' as source_schema, event_id::text, event_version, event_type,
        producer, correlation_id, aggregate_type, aggregate_id, aggregate_version,
        payload, occurred_at, attempts
      from user_service.domain_outbox where published_at is null
      union all
      select 'llm_runtime', event_id::text, event_version, event_type,
        producer, correlation_id, aggregate_type, aggregate_id, aggregate_version,
        payload, occurred_at, attempts
      from llm_runtime.domain_outbox where published_at is null
      union all
      select 'cms', event_id::text, event_version, event_type,
        producer, correlation_id, aggregate_type, aggregate_id, aggregate_version,
        payload, occurred_at, attempts
      from cms.domain_outbox where published_at is null
      union all
      select 'web_output', event_id::text, event_version, event_type,
        producer, correlation_id, aggregate_type, aggregate_id, aggregate_version,
        payload, occurred_at, attempts
      from web_output.domain_outbox where published_at is null
    ) events
    order by occurred_at asc
    limit ${safeLimit}
  `;
}

async function markOutboxEventV3(sql, event, { error = "" } = {}) {
  const mark = async (schema) => {
    if (schema === "user_service") return sql`
      update user_service.domain_outbox set published_at = ${error ? null : new Date().toISOString()}::timestamptz,
        attempts = attempts + 1, last_error = ${error} where event_id = ${event.event_id}::uuid
    `;
    if (schema === "llm_runtime") return sql`
      update llm_runtime.domain_outbox set published_at = ${error ? null : new Date().toISOString()}::timestamptz,
        attempts = attempts + 1, last_error = ${error} where event_id = ${event.event_id}::uuid
    `;
    if (schema === "cms") return sql`
      update cms.domain_outbox set published_at = ${error ? null : new Date().toISOString()}::timestamptz,
        attempts = attempts + 1, last_error = ${error} where event_id = ${event.event_id}::uuid
    `;
    if (schema === "web_output") return sql`
      update web_output.domain_outbox set published_at = ${error ? null : new Date().toISOString()}::timestamptz,
        attempts = attempts + 1, last_error = ${error} where event_id = ${event.event_id}::uuid
    `;
    throw new Error(`Unsupported outbox schema: ${schema}`);
  };
  return mark(event.source_schema);
}

async function projectDomainEventV3(sql, event) {
  const status = EVENT_REQUEST_STATUS[event.event_type];
  if (!status) return false;
  const payload = event.payload || {};
  await sql`
    update user_service.promo_requests
    set status = ${status},
      publication_id = case
        when ${event.event_type} = 'PublicationCompleted' and ${payload.publicationId || null}::text is not null
          then ${payload.publicationId || null}::uuid
        else publication_id
      end,
      last_event_id = ${event.event_id}::uuid,
      last_event_at = ${event.occurred_at}::timestamptz,
      updated_at = now()
    where id::text = ${event.correlation_id}
      and (last_event_at is null or last_event_at <= ${event.occurred_at}::timestamptz)
  `;
  return true;
}

async function dispatchDomainOutboxV3(sql, { limit = 100 } = {}) {
  const events = await pendingDomainEventsV3(sql, limit);
  const results = [];
  for (const event of events) {
    try {
      const projected = await projectDomainEventV3(sql, event);
      await markOutboxEventV3(sql, event);
      results.push({ eventId: event.event_id, eventType: event.event_type, status: "published", projected });
    } catch (error) {
      await markOutboxEventV3(sql, event, { error: String(error.message || error).slice(0, 2000) });
      results.push({ eventId: event.event_id, eventType: event.event_type, status: "failed", error: error.message });
    }
  }
  return {
    processed: results.length,
    published: results.filter((result) => result.status === "published").length,
    failed: results.filter((result) => result.status === "failed").length,
    results,
  };
}

module.exports = {
  getSql,
  stableJson,
  sha256,
  requestFromRow,
  jobFromRow,
  createPromoRequestV3,
  attachDocumentToRequestV3,
  findPromoRequestV3,
  listPromoRequestsV3,
  findGenerationJobV3,
  savePromoRequestFeedbackV3,
  cancelPromoRequestV3,
  approvalFromRow,
  savePromotionApprovalV3,
  findPromotionApprovalV3,
  savePublicationSnapshotV3,
  pendingDomainEventsV3,
  markOutboxEventV3,
  projectDomainEventV3,
  dispatchDomainOutboxV3,
};
