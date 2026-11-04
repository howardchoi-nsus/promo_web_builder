const assert = require("node:assert/strict");
const { createHandler: createSessionHandler } = require("../api/promo-builder-chat-sessions");
const { createHandler: createMessageHandler } = require("../api/promo-builder-chat-messages");
const { createHandler: createActionHandler } = require("../api/promo-builder-chat-actions");
const { createHandler: createWireframeHandler } = require("../api/promo-builder-wireframes");
const { createHandler: createConfirmHandler } = require("../api/promo-builder-wireframes-confirm");

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[String(name).toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

const common = {
  requireBuilderFlag() {},
  resolveBuilderOwner: () => ({ ownerSubject: "owner-1" }),
  getSql: () => "sql",
};

async function testSession() {
  const handler = createSessionHandler({
    ...common,
    createOrLoadSession: async () => ({ id: "session-1", stage: "idle" }),
    fetchSession: async () => ({ session: { id: "session-1", stage: "idle" }, messages: [], requirements: null, wireframe: null }),
  });
  const res = response();
  await handler({ method: "POST", body: { documentId: "document-1" }, query: {} }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.session.id, "session-1");
}

async function testMessageActions() {
  let savedActions = null;
  const handler = createMessageHandler({
    ...common,
    fetchSession: async () => ({ session: { id: "session-1", stage: "requirements_review" } }),
    saveMessage: async (_sql, input) => {
      savedActions = input.actions;
      return { ...input.message, actions: input.actions.map((action) => ({ id: "action-1", key: action.actionKey })) };
    },
  });
  const res = response();
  await handler({ method: "POST", body: {
    sessionId: "session-1",
    message: {
      id: "00000000-0000-4000-8000-000000000001",
      role: "assistant",
      text: "확인해 주세요",
      actions: [{ key: "confirm_requirements", label: "확정" }],
    },
  } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(savedActions[0].actionKey, "confirm_requirements");

  const invalid = response();
  await handler({ method: "POST", body: {
    sessionId: "session-1",
    message: {
      id: "00000000-0000-4000-8000-000000000002",
      role: "assistant",
      text: "잘못된 승인",
      actions: [{ key: "approve_wireframe", label: "승인" }],
    },
  } }, invalid);
  assert.equal(invalid.statusCode, 409);
  assert.equal(invalid.body.code, "CHAT_ACTION_NOT_ALLOWED");
}

async function testApprovalActionRequiresConfirmation() {
  let executed = false;
  const handler = createActionHandler({
    ...common,
    fetchSession: async () => ({ session: {
      id: "session-1", stage: "wireframe_review", confirmedWireframeRevision: null,
    } }),
    fetchConfirmedWireframe: async () => null,
    executeAction: async () => { executed = true; },
  });
  const res = response();
  await handler({ method: "POST", body: {
    sessionId: "session-1",
    actionId: "action-1",
    actionKey: "approve_wireframe",
    idempotencyKey: "idem-1",
  } }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "WIREFRAME_CONFIRMATION_REQUIRED");
  assert.equal(executed, false);
}

async function testWireframeSaveAndConfirm() {
  const wireframe = {
    revision: 1,
    structureFingerprint: "a".repeat(64),
    status: "draft",
  };
  const save = createWireframeHandler({ ...common, saveWireframeRevision: async () => wireframe });
  const saveRes = response();
  await save({ method: "POST", body: {
    sessionId: "session-1", documentId: "document-1", proposalId: "proposal-1",
    baseDocumentRevision: 0, snapshot: { content: { sectionSnapshot: [{ sectionKey: "hero" }] } },
  } }, saveRes);
  assert.equal(saveRes.statusCode, 201);

  const confirm = createConfirmHandler({
    ...common,
    confirmWireframeRevision: async () => ({ ...wireframe, status: "confirmed" }),
  });
  const confirmRes = response();
  await confirm({ method: "POST", body: {
    sessionId: "session-1", revision: 1, structureFingerprint: "a".repeat(64),
  } }, confirmRes);
  assert.equal(confirmRes.statusCode, 200);
  assert.equal(confirmRes.body.wireframe.status, "confirmed");
}

Promise.resolve()
  .then(testSession)
  .then(testMessageActions)
  .then(testApprovalActionRequiresConfirmation)
  .then(testWireframeSaveAndConfirm)
  .then(() => console.log("AI Builder chat workspace handlers passed"))
  .catch((error) => { console.error(error); process.exitCode = 1; });
