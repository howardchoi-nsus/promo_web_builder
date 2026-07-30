const { createHash, randomUUID } = require("node:crypto");
const { getSql } = require("./_wizard-form-templates-store");

function snapshotHash(snapshot) {
  return createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
}

function toDocument(row) {
  if (!row) return null;
  return {
    id: row.id,
    documentKey: row.document_key,
    mode: row.mode,
    status: row.status,
    currentDocumentRevision: Number(row.current_document_revision || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProposal(row, { includeSnapshots = false } = {}) {
  if (!row) return null;
  return {
    id: row.id,
    documentId: row.document_id,
    requestId: row.request_id,
    baseDocumentRevision: Number(row.base_document_revision || 0),
    overviewFingerprint: row.overview_fingerprint,
    candidateFingerprint: row.candidate_fingerprint,
    status: row.status,
    autoApplicable: Boolean(row.validation_json?.autoApplicable),
    validation: row.validation_json || {},
    errorCode: row.error_code || "",
    errorMessage: row.error_message || "",
    currentAttempt: Number(row.current_attempt || 0),
    maxAttempts: Number(row.max_attempts || 3),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pollAfterMs: ["queued", "processing"].includes(row.status) ? 1500 : 0,
    ...(includeSnapshots ? {
      requestSnapshot: row.request_snapshot,
      candidateSnapshot: row.candidate_snapshot,
      snapshot: row.proposal_snapshot,
    } : {}),
  };
}

async function createDocument(sql, { ownerSubject, mode, idempotencyKey }) {
  const documentKey = `doc_${createHash("sha256")
    .update(`${ownerSubject}:${idempotencyKey}`)
    .digest("hex")
    .slice(0, 40)}`;
  const rows = await sql`
    insert into promo_builder_documents (
      document_key, mode, status, owner_subject
    ) values (
      ${documentKey}, ${mode}, 'draft', ${ownerSubject}
    )
    on conflict (document_key) do update set updated_at = promo_builder_documents.updated_at
    returning *
  `;
  return toDocument(rows[0]);
}

async function fetchDocument(sql, documentId, ownerSubject, { includeSnapshot = true } = {}) {
  const rows = await sql`
    select * from promo_builder_documents
    where id = ${documentId}::uuid and owner_subject = ${ownerSubject}
    limit 1
  `;
  if (!rows.length) return null;
  const document = toDocument(rows[0]);
  if (!includeSnapshot || document.currentDocumentRevision === 0) {
    return { document, version: null, snapshot: null };
  }
  const versions = await sql`
    select id::text, revision, contract_version, snapshot_json, snapshot_hash,
      change_note, source, applied_at, created_at
    from promo_builder_document_versions
    where document_id = ${documentId}::uuid
      and revision = ${document.currentDocumentRevision}
    limit 1
  `;
  let snapshot = versions[0]?.snapshot_json || null;
  if (snapshot?.assets?.requests?.length) {
    const { hydrateBuilderAssetResults } = require("./_promo-builder-assets");
    snapshot = await hydrateBuilderAssetResults(sql, documentId, snapshot);
  }
  return {
    document,
    version: versions[0] || null,
    snapshot,
  };
}

async function fetchProposal(sql, proposalId, ownerSubject, { includeSnapshots = false } = {}) {
  const rows = await sql`
    select proposal.*
    from promo_builder_composition_proposals proposal
    join promo_builder_documents document on document.id = proposal.document_id
    where proposal.id = ${proposalId}::uuid
      and document.owner_subject = ${ownerSubject}
    limit 1
  `;
  return toProposal(rows[0], { includeSnapshots });
}

async function createProposal(sql, input) {
  const rows = await sql`
    select create_promo_builder_composition_proposal(
      ${input.documentId}::uuid,
      ${input.ownerSubject},
      ${input.requestId},
      ${input.baseDocumentRevision},
      ${input.overviewFingerprint},
      ${input.candidateFingerprint},
      ${input.sourceTemplateId || null}::uuid,
      ${input.sourceTemplateVersion || null},
      ${JSON.stringify(input.requestSnapshot)}::jsonb,
      ${JSON.stringify(input.candidateSnapshot)}::jsonb,
      ${input.promptTemplateId || null}::uuid,
      ${input.idempotencyKey}
    )::text as id
  `;
  return fetchProposal(sql, rows[0].id, input.ownerSubject, { includeSnapshots: true });
}

async function cancelProposal(sql, proposalId, ownerSubject) {
  const rows = await sql`
    update promo_builder_composition_proposals proposal
    set status = case
          when proposal.status in ('queued', 'processing', 'ready') then 'cancelled'
          else proposal.status
        end,
        lease_token = case when proposal.status in ('queued', 'processing', 'ready') then null else lease_token end,
        lease_expires_at = case when proposal.status in ('queued', 'processing', 'ready') then null else lease_expires_at end,
        updated_at = now()
    from promo_builder_documents document
    where proposal.id = ${proposalId}::uuid
      and document.id = proposal.document_id
      and document.owner_subject = ${ownerSubject}
    returning proposal.*
  `;
  return toProposal(rows[0]);
}

async function acquireProposalLease(sql, proposalId) {
  const leaseToken = randomUUID();
  const rows = await sql`
    update promo_builder_composition_proposals
    set status = 'processing',
      current_attempt = current_attempt + 1,
      lease_token = ${leaseToken},
      lease_expires_at = now() + interval '2 minutes',
      updated_at = now()
    where id = ${proposalId}::uuid
      and status in ('queued', 'failed')
      and current_attempt < max_attempts
      and (next_retry_at is null or next_retry_at <= now())
      and (lease_expires_at is null or lease_expires_at < now())
    returning *
  `;
  return rows[0] ? { row: rows[0], leaseToken } : null;
}

async function completeProposal(sql, {
  proposalId,
  leaseToken,
  snapshot,
  validation,
}) {
  const rows = await sql`
    update promo_builder_composition_proposals
    set status = 'ready',
      proposal_snapshot = ${JSON.stringify(snapshot)}::jsonb,
      validation_json = ${JSON.stringify(validation)}::jsonb,
      lease_token = null,
      lease_expires_at = null,
      error_code = '',
      error_message = '',
      updated_at = now()
    where id = ${proposalId}::uuid
      and status = 'processing'
      and lease_token = ${leaseToken}
    returning *
  `;
  return rows[0] || null;
}

async function failProposal(sql, {
  proposalId,
  leaseToken,
  errorCode,
  errorMessage,
  retryable = false,
}) {
  const rows = await sql`
    update promo_builder_composition_proposals
    set status = 'failed',
      lease_token = null,
      lease_expires_at = null,
      next_retry_at = case
        when ${retryable} and current_attempt < max_attempts
          then now() + make_interval(secs => least(300, power(2, current_attempt)::integer))
        else null
      end,
      error_code = ${String(errorCode || "COMPOSITION_PROCESS_FAILED")},
      error_message = ${String(errorMessage || "").slice(0, 2000)},
      updated_at = now()
    where id = ${proposalId}::uuid
      and status = 'processing'
      and lease_token = ${leaseToken}
    returning *
  `;
  return rows[0] || null;
}

async function applyProposal(sql, {
  documentId,
  proposalId,
  ownerSubject,
  baseDocumentRevision,
  snapshot,
  changeNote,
}) {
  const nextSnapshot = { ...snapshot, documentRevision: Number(baseDocumentRevision) + 1 };
  const rows = await sql`
    select apply_promo_builder_composition_proposal(
      ${documentId}::uuid,
      ${proposalId}::uuid,
      ${ownerSubject},
      ${baseDocumentRevision},
      ${JSON.stringify(nextSnapshot)}::jsonb,
      ${snapshotHash(nextSnapshot)},
      ${changeNote || "AI composition applied."}
    ) as revision
  `;
  return { revision: Number(rows[0].revision), snapshot: nextSnapshot };
}

async function createDocumentRevision(sql, {
  documentId,
  ownerSubject,
  baseDocumentRevision,
  snapshot,
  source,
  changeNote,
}) {
  const nextSnapshot = { ...snapshot, documentRevision: Number(baseDocumentRevision) + 1 };
  const rows = await sql`
    select create_promo_builder_document_revision(
      ${documentId}::uuid,
      ${ownerSubject},
      ${baseDocumentRevision},
      ${JSON.stringify(nextSnapshot)}::jsonb,
      ${snapshotHash(nextSnapshot)},
      ${source},
      ${changeNote || ""}
    ) as revision
  `;
  return { revision: Number(rows[0].revision), snapshot: nextSnapshot };
}

async function applyOperations(sql, {
  documentId,
  ownerSubject,
  baseDocumentRevision,
  snapshot,
  operations,
  changeNote,
}) {
  const nextSnapshot = { ...snapshot, documentRevision: Number(baseDocumentRevision) + 1 };
  const rows = await sql`
    select apply_promo_builder_operations(
      ${documentId}::uuid,
      ${ownerSubject},
      ${baseDocumentRevision},
      ${JSON.stringify(nextSnapshot)}::jsonb,
      ${snapshotHash(nextSnapshot)},
      ${JSON.stringify(operations)}::jsonb,
      ${changeNote || "Composition operations applied."}
    ) as revision
  `;
  return { revision: Number(rows[0].revision), snapshot: nextSnapshot };
}

module.exports = {
  getSql,
  snapshotHash,
  toDocument,
  toProposal,
  createDocument,
  fetchDocument,
  fetchProposal,
  createProposal,
  cancelProposal,
  acquireProposalLease,
  completeProposal,
  failProposal,
  applyProposal,
  createDocumentRevision,
  applyOperations,
};
