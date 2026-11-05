const { createHash, randomUUID } = require("node:crypto");
const {
  computeStructureFingerprint,
  projectWireframeStructure,
  stableStringify,
} = require("./_promo-builder-chat-workspace-contract");

function toAction(row) {
  return {
    id: row.id,
    key: row.action_key,
    label: row.label,
    payload: row.payload || {},
    issuedStage: row.issued_stage,
    status: row.status,
    executedAt: row.executed_at || null,
  };
}

function toMessage(row, actions = []) {
  return {
    ...(row.metadata || {}),
    id: row.id,
    role: row.role,
    type: row.message_type,
    text: row.text_content,
    operationId: row.operation_id || "",
    status: row.status || "",
    actions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toWireframe(row) {
  if (!row) return null;
  return {
    id: row.id,
    sessionId: row.session_id,
    documentId: row.document_id,
    proposalId: row.proposal_id,
    revision: Number(row.revision),
    requirementsRevision: Number(row.requirements_revision),
    baseDocumentRevision: Number(row.base_document_revision),
    structure: row.structure_json,
    structureFingerprint: row.structure_fingerprint,
    snapshot: row.snapshot_json,
    status: row.status,
    confirmedAt: row.confirmed_at || null,
    createdAt: row.created_at,
  };
}

function toSession(row) {
  if (!row) return null;
  return {
    id: row.id,
    documentId: row.document_id,
    requestId: row.request_id || "",
    stage: row.stage,
    latestRequirementsRevision: Number(row.latest_requirements_revision || 0),
    latestWireframeRevision: Number(row.latest_wireframe_revision || 0),
    confirmedWireframeRevision: row.confirmed_wireframe_revision == null
      ? null
      : Number(row.confirmed_wireframe_revision),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSessionSummary(row) {
  const title = String(row?.title || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  const preview = String(row?.preview || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
  return {
    ...toSession(row),
    title: title || "새 프로모션 대화",
    preview,
    messageCount: Number(row?.message_count || 0),
  };
}

async function createOrLoadSession(sql, { documentId, requestId = "", ownerSubject }) {
  const rows = await sql`
    insert into promo_builder_chat_sessions (document_id, request_id, owner_subject)
    select document.id, ${requestId}, ${ownerSubject}
    from promo_builder_documents document
    where document.id = ${documentId}::uuid and document.owner_subject = ${ownerSubject}
    on conflict (document_id, owner_subject) do update
      set request_id = case
        when excluded.request_id <> '' then excluded.request_id
        else promo_builder_chat_sessions.request_id
      end,
      updated_at = now()
    returning *
  `;
  return toSession(rows[0]);
}

async function fetchSession(sql, { sessionId, ownerSubject }) {
  const rows = await sql`
    select * from promo_builder_chat_sessions
    where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
    limit 1
  `;
  if (!rows[0]) return null;
  const [messageRows, actionRows, requirementRows, wireframeRows] = await Promise.all([
    sql`select * from promo_builder_chat_messages where session_id = ${sessionId}::uuid order by created_at, id limit 500`,
    sql`select * from promo_builder_chat_actions where session_id = ${sessionId}::uuid order by created_at, id`,
    sql`select * from promo_builder_requirements_revisions where session_id = ${sessionId}::uuid order by revision desc limit 1`,
    sql`select * from promo_builder_wireframe_revisions where session_id = ${sessionId}::uuid order by revision desc limit 1`,
  ]);
  const actionsByMessage = new Map();
  actionRows.forEach((row) => {
    const actions = actionsByMessage.get(row.message_id) || [];
    actions.push(toAction(row));
    actionsByMessage.set(row.message_id, actions);
  });
  return {
    session: toSession(rows[0]),
    messages: messageRows.map((row) => toMessage(row, actionsByMessage.get(row.id) || [])),
    requirements: requirementRows[0] ? {
      revision: Number(requirementRows[0].revision),
      documentRevision: Number(requirementRows[0].document_revision),
      value: requirementRows[0].requirements_json,
      fingerprint: requirementRows[0].requirements_fingerprint,
      createdAt: requirementRows[0].created_at,
    } : null,
    wireframe: toWireframe(wireframeRows[0]),
  };
}

async function listSessions(sql, { ownerSubject, limit = 30 }) {
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 30));
  const rows = await sql`
    select session.*,
      coalesce((
        select message.text_content
        from promo_builder_chat_messages message
        where message.session_id = session.id and message.role = 'user'
        order by message.created_at, message.id
        limit 1
      ), '') as title,
      coalesce((
        select message.text_content
        from promo_builder_chat_messages message
        where message.session_id = session.id
        order by message.created_at desc, message.id desc
        limit 1
      ), '') as preview,
      (select count(*) from promo_builder_chat_messages message where message.session_id = session.id) as message_count
    from promo_builder_chat_sessions session
    where session.owner_subject = ${ownerSubject}
      and (
        session.latest_requirements_revision > 0
        or session.latest_wireframe_revision > 0
        or exists (
          select 1 from promo_builder_chat_messages message
          where message.session_id = session.id and message.role = 'user'
        )
      )
    order by session.updated_at desc, session.id desc
    limit ${safeLimit}
  `;
  return rows.map(toSessionSummary);
}

async function saveMessage(sql, { sessionId, ownerSubject, message, actions }) {
  const messageId = String(message.id || randomUUID());
  const metadata = { ...(message.metadata || {}) };
  ["attachmentIds"].forEach((key) => {
    if (message[key] !== undefined) metadata[key] = message[key];
  });
  const rows = await sql`
    insert into promo_builder_chat_messages (
      id, session_id, role, message_type, text_content, operation_id, status, metadata, created_at
    )
    select ${messageId}::uuid, session.id, ${message.role}, ${message.type || "message"},
      ${String(message.text || "").slice(0, 20000)}, ${message.operationId || ""},
      ${message.status || ""}, ${JSON.stringify(metadata)}::jsonb,
      ${message.createdAt || new Date().toISOString()}::timestamptz
    from promo_builder_chat_sessions session
    where session.id = ${sessionId}::uuid and session.owner_subject = ${ownerSubject}
    on conflict (id) do update set
      text_content = excluded.text_content,
      status = excluded.status,
      metadata = excluded.metadata,
      updated_at = now()
    returning *
  `;
  if (!rows[0]) return null;
  await sql`
    update promo_builder_chat_sessions
    set updated_at = now()
    where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
  `;
  const savedActions = [];
  for (const action of actions) {
    const actionRows = await sql`
      insert into promo_builder_chat_actions (
        session_id, message_id, action_key, label, payload, issued_stage
      ) values (
        ${sessionId}::uuid, ${messageId}::uuid, ${action.actionKey}, ${action.label},
        ${JSON.stringify(action.payload)}::jsonb,
        (select stage from promo_builder_chat_sessions where id = ${sessionId}::uuid)
      )
      on conflict (message_id, action_key) do update set label = excluded.label, payload = excluded.payload
      returning *
    `;
    savedActions.push(toAction(actionRows[0]));
  }
  return toMessage(rows[0], savedActions);
}

async function saveRequirementsRevision(sql, {
  sessionId, ownerSubject, documentRevision, requirements,
}) {
  const serverFingerprint = createHash("sha256")
    .update(stableStringify(requirements))
    .digest("hex");
  const rows = await sql`
    with target as (
      select * from promo_builder_chat_sessions
      where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
    ), next_revision as (
      update promo_builder_chat_sessions session
      set latest_requirements_revision = session.latest_requirements_revision + 1,
        stage = 'requirements_review', updated_at = now()
      from target
      where session.id = target.id
      returning session.latest_requirements_revision as revision
    )
    insert into promo_builder_requirements_revisions (
      session_id, revision, document_revision, requirements_json, requirements_fingerprint
    )
    select ${sessionId}::uuid, revision, ${documentRevision}, ${JSON.stringify(requirements)}::jsonb,
      ${serverFingerprint}
    from next_revision
    returning *
  `;
  return rows[0] ? {
    revision: Number(rows[0].revision),
    documentRevision: Number(rows[0].document_revision),
    value: rows[0].requirements_json,
    fingerprint: rows[0].requirements_fingerprint,
    createdAt: rows[0].created_at,
  } : null;
}

async function executeAction(sql, {
  sessionId, actionId, actionKey, ownerSubject, idempotencyKey, nextStage,
}) {
  const rows = await sql`
    update promo_builder_chat_actions action
    set status = 'executed', idempotency_key = ${idempotencyKey}, executed_at = now()
    from promo_builder_chat_sessions session
    where action.id = ${actionId}::uuid
      and action.session_id = ${sessionId}::uuid
      and action.action_key = ${actionKey}
      and action.status = 'proposed'
      and action.issued_stage = session.stage
      and session.id = action.session_id
      and session.owner_subject = ${ownerSubject}
    returning action.*
  `;
  if (!rows[0]) {
    const replay = await sql`
      select action.* from promo_builder_chat_actions action
      join promo_builder_chat_sessions session on session.id = action.session_id
      where action.session_id = ${sessionId}::uuid
        and action.id = ${actionId}::uuid
        and action.action_key = ${actionKey}
        and action.status = 'executed'
        and session.owner_subject = ${ownerSubject}
      limit 1
    `;
    if (!replay[0]) return null;
    await sql`
      update promo_builder_chat_sessions
      set stage = ${nextStage}, updated_at = now()
      where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
    `;
    return { action: toAction(replay[0]), replayed: true };
  }
  await sql`
    update promo_builder_chat_sessions
    set stage = ${nextStage}, updated_at = now()
    where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
  `;
  return { action: toAction(rows[0]), replayed: false };
}

async function saveWireframeRevision(sql, {
  sessionId, ownerSubject, documentId, proposalId, baseDocumentRevision, snapshot,
}) {
  const structure = projectWireframeStructure(snapshot);
  const structureFingerprint = computeStructureFingerprint(snapshot);
  const existing = await sql`
    select wireframe.* from promo_builder_wireframe_revisions wireframe
    join promo_builder_chat_sessions session on session.id = wireframe.session_id
    where wireframe.session_id = ${sessionId}::uuid
      and wireframe.proposal_id = ${proposalId}::uuid
      and session.owner_subject = ${ownerSubject}
    limit 1
  `;
  if (existing[0]) {
    if (existing[0].structure_fingerprint !== structureFingerprint) {
      const error = new Error("The proposal was already saved with a different Wireframe structure");
      error.statusCode = 409;
      error.code = "WIREFRAME_PROPOSAL_CHANGED";
      throw error;
    }
    return toWireframe(existing[0]);
  }
  const rows = await sql`
    with target as (
      select session.* from promo_builder_chat_sessions session
      join promo_builder_documents document on document.id = session.document_id
      join promo_builder_composition_proposals proposal
        on proposal.id = ${proposalId}::uuid and proposal.document_id = document.id
      where session.id = ${sessionId}::uuid
        and session.document_id = ${documentId}::uuid
        and session.owner_subject = ${ownerSubject}
        and session.latest_requirements_revision > 0
        and proposal.base_document_revision = ${baseDocumentRevision}
    ), next_revision as (
      update promo_builder_chat_sessions session
      set latest_wireframe_revision = session.latest_wireframe_revision + 1,
        stage = 'wireframe_review', confirmed_wireframe_revision = null, updated_at = now()
      from target where session.id = target.id
      returning session.latest_wireframe_revision as revision,
        session.latest_requirements_revision as requirements_revision
    )
    insert into promo_builder_wireframe_revisions (
      session_id, document_id, proposal_id, revision, requirements_revision,
      base_document_revision, structure_json, structure_fingerprint, snapshot_json
    )
    select ${sessionId}::uuid, ${documentId}::uuid, ${proposalId}::uuid,
      revision, requirements_revision, ${baseDocumentRevision},
      ${JSON.stringify(structure)}::jsonb, ${structureFingerprint}, ${JSON.stringify(snapshot)}::jsonb
    from next_revision
    returning *
  `;
  return toWireframe(rows[0]);
}

async function confirmWireframeRevision(sql, {
  sessionId, ownerSubject, revision, structureFingerprint,
}) {
  const rows = await sql`
    update promo_builder_wireframe_revisions wireframe
    set status = 'confirmed', confirmed_at = now()
    from promo_builder_chat_sessions session
    where wireframe.session_id = ${sessionId}::uuid
      and wireframe.revision = ${revision}
      and wireframe.structure_fingerprint = ${structureFingerprint}
      and wireframe.status = 'draft'
      and session.id = wireframe.session_id
      and session.owner_subject = ${ownerSubject}
      and session.stage = 'wireframe_review'
    returning wireframe.*
  `;
  if (!rows[0]) {
    return fetchConfirmedWireframe(sql, { sessionId, ownerSubject, revision })
      .then((confirmed) => (
        confirmed?.structureFingerprint === structureFingerprint ? confirmed : null
      ));
  }
  await sql`
    update promo_builder_chat_sessions
    set confirmed_wireframe_revision = ${revision}, updated_at = now()
    where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
  `;
  return toWireframe(rows[0]);
}

async function fetchConfirmedWireframe(sql, { sessionId, ownerSubject, revision }) {
  const rows = await sql`
    select wireframe.* from promo_builder_wireframe_revisions wireframe
    join promo_builder_chat_sessions session on session.id = wireframe.session_id
    where wireframe.session_id = ${sessionId}::uuid
      and wireframe.revision = ${revision}
      and wireframe.status = 'confirmed'
      and session.confirmed_wireframe_revision = wireframe.revision
      and session.owner_subject = ${ownerSubject}
    limit 1
  `;
  return toWireframe(rows[0]);
}

async function completeSession(sql, { sessionId, ownerSubject }) {
  await sql`
    update promo_builder_chat_sessions set stage = 'completed', updated_at = now()
    where id = ${sessionId}::uuid and owner_subject = ${ownerSubject}
  `;
}

module.exports = {
  createOrLoadSession,
  fetchSession,
  listSessions,
  saveMessage,
  saveRequirementsRevision,
  executeAction,
  saveWireframeRevision,
  confirmWireframeRevision,
  fetchConfirmedWireframe,
  completeSession,
};
