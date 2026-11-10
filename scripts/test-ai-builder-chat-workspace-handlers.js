const assert = require("node:assert/strict");
const { createHandler: createSessionHandler } = require("../api/promo-builder-chat-sessions");
const { createHandler: createMessageHandler } = require("../api/promo-builder-chat-messages");
const { createHandler: createActionHandler } = require("../api/promo-builder-chat-actions");
const { createHandler: createWireframeHandler } = require("../api/promo-builder-wireframes");
const { createHandler: createWireframeEditHandler } = require("../api/promo-builder-wireframe-edits");
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
  fetchAction: async () => ({id:"action-1",key:"approve_wireframe",status:"proposed"}),
  fetchCompletedDocument:async()=>null,
};

async function testSession() {
  const handler = createSessionHandler({
    ...common,
    createOrLoadSession: async () => ({ id: "session-1", stage: "idle" }),
    fetchSession: async () => ({ session: { id: "session-1", stage: "idle" }, messages: [], requirements: null, wireframe: null }),
    listSessions: async () => [{ id: "session-history", title: "겨울 프로모션", stage: "completed" }],
  });
  const res = response();
  await handler({ method: "POST", body: { documentId: "document-1" }, query: {} }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.session.id, "session-1");

  const listRes = response();
  await handler({ method: "GET", body: null, query: { limit: "20" } }, listRes);
  assert.equal(listRes.statusCode, 200);
  assert.equal(listRes.body.sessions[0].title, "겨울 프로모션");
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

async function testCompletedApprovalReplay() {
  let mutations=0;
  const replay=createActionHandler({...common,
    fetchSession:async()=>({session:{id:'session-1',stage:'completed'}}),
    fetchAction:async()=>({id:'action-1',key:'approve_wireframe',status:'executed'}),
    fetchConfirmedWireframe:async()=>{throw Error('Do not reconfirm an executed action');},
    executeAction:async()=>{mutations++;throw Error('Do not execute again');},
  });
  const body={sessionId:'session-1',actionId:'action-1',actionKey:'approve_wireframe',idempotencyKey:'retry'};
  const res=response();await replay({method:'POST',body},res);
  assert.equal(res.statusCode,200);assert.equal(res.body.replayed,true);assert.equal(res.body.stage,'completed');assert.equal(mutations,0);
  const pending=createActionHandler({...common,fetchSession:async()=>({session:{stage:'completed'}}),fetchAction:async()=>({status:'proposed'}),executeAction:async()=>{mutations++;}});
  const blocked=response();await pending({method:'POST',body},blocked);assert.equal(blocked.statusCode,409);assert.equal(blocked.body.code,'COMPLETED_DOCUMENT_NOT_FOUND');assert.equal(mutations,0);
  const foreign=createActionHandler({...common,fetchSession:async()=>null,fetchAction:async()=>{throw Error('Must not read foreign actions');}});
  const denied=response();await foreign({method:'POST',body},denied);assert.equal(denied.statusCode,404);
}

async function testCompletedPendingApprovalRecovery(){
 const body={sessionId:'session-1',actionId:'action-1',actionKey:'approve_wireframe',idempotencyKey:'retry'};
 for(const status of ['proposed','expired']){
  let mutations=0;
  const handler=createActionHandler({...common,fetchSession:async()=>({session:{stage:'completed'}}),
   fetchAction:async()=>({id:'action-1',key:'approve_wireframe',status}),
   fetchCompletedDocument:async()=>({documentId:'document-1',documentRevision:4}),
   executeAction:async()=>{mutations++;},fetchConfirmedWireframe:async()=>{throw Error('No new approval');}});
  const res=response();await handler({method:'POST',body},res);
  assert.equal(res.statusCode,200);assert.equal(res.body.resumeOnly,true);assert.equal(res.body.stage,'completed');
  assert.equal(res.body.action.status,status);assert.equal(res.body.documentRevision,4);assert.equal(mutations,0);
  assert.equal(res.headers['x-promo-chat-actions-version'],'completed-resume-v2');
 }
 const missing=createActionHandler({...common,fetchSession:async()=>({session:{stage:'completed'}}),fetchAction:async()=>({status:'expired'}),fetchCompletedDocument:async()=>null});
 const res=response();await missing({method:'POST',body},res);assert.equal(res.statusCode,409);assert.equal(res.body.code,'COMPLETED_DOCUMENT_NOT_FOUND');
 const unknown=createActionHandler({...common,fetchSession:async()=>({session:{stage:'completed'}}),fetchAction:async()=>null,fetchCompletedDocument:async()=>{throw Error('Unknown action must not recover');}});
 const denied=response();await unknown({method:'POST',body},denied);assert.equal(denied.statusCode,409);
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

async function testWireframeEditUsesOptimisticContext() {
  let updateInput = null;
  const snapshot = {
    contractVersion: 3,
    snapshotType: "registry-composition-proposal",
    compositionSpec: {
      sections: [{
        sectionKey: "hero",
        sectionVersionId: "section-version-1",
        layoutKey: "centered",
        components: [{ itemKey: "cta", repeat: 1, contentBindings: [{ fieldKey: "label" }] }],
      }],
    },
  };
  const handler = createWireframeEditHandler({
    ...common,
    fetchProposal: async () => ({
      id: "proposal-1", documentId: "document-1", status: "ready", baseDocumentRevision: 2,
      snapshot, requestSnapshot: { overview: {} },
    }),
    applyWireframeEdits: () => ({ snapshot, requestSnapshot: { overview: {} } }),
    updateWireframeDraft: async (_sql, input) => {
      updateInput = input;
      return { revision: 4, structureFingerprint: "b".repeat(64), status: "draft" };
    },
  });
  const res = response();
  await handler({ method: "POST", body: {
    sessionId: "session-1", documentId: "document-1", proposalId: "proposal-1",
    baseDocumentRevision: 2, wireframeRevision: 4, structureFingerprint: "a".repeat(64),
    edits: [{ type: "set-horizontal-alignment" }],
  } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(updateInput.wireframeRevision, 4);
  assert.equal(updateInput.expectedStructureFingerprint, "a".repeat(64));

  const invalid = response();
  await handler({ method: "POST", body: {
    sessionId: "session-1", documentId: "document-1", proposalId: "proposal-1",
    baseDocumentRevision: 2, wireframeRevision: 4, edits: [],
  } }, invalid);
  assert.equal(invalid.statusCode, 400);
}

Promise.resolve()
  .then(testSession)
  .then(testMessageActions)
  .then(testApprovalActionRequiresConfirmation)
  .then(testCompletedApprovalReplay)
  .then(testCompletedPendingApprovalRecovery)
  .then(testWireframeSaveAndConfirm)
  .then(testWireframeEditUsesOptimisticContext)
  .then(() => console.log("AI Builder chat workspace handlers passed"))
  .catch((error) => { console.error(error); process.exitCode = 1; });
