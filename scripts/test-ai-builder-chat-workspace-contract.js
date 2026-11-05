const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  computeStructureFingerprint,
  projectWireframeStructure,
  normalizeActions,
  assertActionTransition,
  assertWireframeProof,
} = require("../api/_promo-builder-chat-workspace-contract");

const snapshot = {
  contractVersion: 3,
  content: {
    sectionOrder: ["hero", "benefit"],
    sectionSnapshot: [
      {
        sectionKey: "hero",
        sectionRole: "hero",
        selectedLayoutKey: "split-right",
        items: [
          { itemKey: "title", sourceItemKey: "title", componentVersionId: "component-title" },
          { itemKey: "cta", sourceItemKey: "primaryAction", componentVersionId: "component-cta" },
        ],
      },
      {
        sectionKey: "benefit",
        sectionRole: "benefit",
        items: [{ itemKey: "cards", sourceItemKey: "cards", componentVersionId: "component-cards" }],
      },
    ],
  },
  designSpec: { theme: { color: "red" } },
};

const fingerprint = computeStructureFingerprint(snapshot);
assert.match(fingerprint, /^[a-f0-9]{64}$/);
assert.equal(computeStructureFingerprint({ ...snapshot, designSpec: { theme: { color: "blue" } } }), fingerprint);
assert.notEqual(computeStructureFingerprint({
  ...snapshot,
  content: { ...snapshot.content, sectionOrder: ["benefit", "hero"] },
}), fingerprint);
assert.deepEqual(projectWireframeStructure(snapshot).sections.map((section) => section.sectionRef), ["hero", "benefit"]);

const proposalPlan = {
  contractVersion: 3,
  compositionSpec: {
    sections: [{
      sectionVersionId: "hero-version",
      layoutKey: "split-right",
      repeat: 2,
      components: [{ componentInstanceId: "hero-title", repeat: 2, visible: true }],
    }],
  },
};
const compiledPlan = {
  contractVersion: 3,
  content: {
    sectionOrder: ["hero-1", "hero-2"],
    sectionSnapshot: ["hero-1", "hero-2"].map((sectionKey) => ({
      sectionKey,
      sourceSectionId: "hero-version",
      selectedLayoutKey: "split-right",
      items: [0, 1].map((index) => ({
        itemKey: `${sectionKey}-title-${index}`,
        sourceDefinitionInstanceId: "hero-title",
        collection: { index },
      })),
    })),
  },
};
assert.equal(computeStructureFingerprint(proposalPlan), computeStructureFingerprint(compiledPlan));

const actions = normalizeActions([{ key: "confirm_requirements", label: "확정" }], "requirements_review");
assert.equal(actions[0].actionKey, "confirm_requirements");
const editActions = normalizeActions([
  { key: "complete_requirements_edit", label: "수정 완료" },
  { key: "cancel_requirements_edit", label: "수정 취소" },
], "requirements_review");
assert.deepEqual(editActions.map((action) => action.actionKey), [
  "complete_requirements_edit",
  "cancel_requirements_edit",
]);
assert.equal(assertActionTransition("approve_wireframe", "wireframe_review").to, "finalizing");
assert.equal(assertActionTransition("revise_wireframe", "wireframe_review").to, "wireframe_review");
assert.equal(assertActionTransition("approve_wireframe", "finalizing").to, "finalizing");
assert.throws(
  () => normalizeActions([{ key: "approve_wireframe", label: "승인" }], "requirements_review"),
  (error) => error.code === "CHAT_ACTION_NOT_ALLOWED" && error.statusCode === 409,
);

assert.equal(assertWireframeProof({
  confirmed: {
    documentId: "document-1",
    proposalId: "proposal-1",
    baseDocumentRevision: 2,
    structureFingerprint: fingerprint,
  },
  documentId: "document-1",
  proposalId: "proposal-1",
  baseDocumentRevision: 2,
  fingerprint,
}), true);
assert.throws(
  () => assertWireframeProof({
    confirmed: {
      documentId: "document-1",
      proposalId: "proposal-1",
      baseDocumentRevision: 2,
      structureFingerprint: fingerprint,
    },
    documentId: "document-1",
    proposalId: "proposal-2",
    baseDocumentRevision: 2,
    fingerprint,
  }),
  (error) => error.code === "WIREFRAME_PROOF_MISMATCH" && error.details.mismatches.includes("proposalId"),
);

const migration = fs.readFileSync(path.resolve(__dirname, "../db/migrations/077_ai_builder_chat_workspace.sql"), "utf8");
for (const table of [
  "promo_builder_chat_sessions",
  "promo_builder_chat_messages",
  "promo_builder_chat_actions",
  "promo_builder_requirements_revisions",
  "promo_builder_wireframe_revisions",
]) assert.match(migration, new RegExp(`create table if not exists ${table}`));
assert.match(migration, /unique\(session_id, proposal_id\)/);

const applyApi = fs.readFileSync(path.resolve(__dirname, "../api/promo-page-composition-apply.js"), "utf8");
assert.match(applyApi, /fetchConfirmedWireframe/);
assert.match(applyApi, /assertWireframeProof/);
assert.match(applyApi, /WIREFRAME_PROOF_INCOMPLETE/);
assert.match(applyApi, /FINAL_STRUCTURE_MISMATCH/);

const client = fs.readFileSync(path.resolve(__dirname, "../visual-editor/src/builder/services/composition-client.mjs"), "utf8");
for (const endpoint of [
  "/api/promo-builder-chat-sessions",
  "/api/promo-builder-chat-messages",
  "/api/promo-builder-requirements-revisions",
  "/api/promo-builder-chat-actions",
  "/api/promo-builder-wireframes",
  "/api/promo-builder-wireframes-confirm",
  "/api/promo-builder-wireframe-edits",
]) assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
assert.match(client, /listChatWorkspaces/);

const chatStore = fs.readFileSync(path.resolve(__dirname, "../api/_promo-builder-chat-workspace-store.js"), "utf8");
assert.match(chatStore, /async function listSessions/);
assert.match(chatStore, /order by session\.updated_at desc/);
assert.match(chatStore, /message\.role = 'user'/);

const builder = fs.readFileSync(path.resolve(__dirname, "../visual-editor/src/builder/AiBuilderApp.vue"), "utf8");
const builderCss = fs.readFileSync(path.resolve(__dirname, "../visual-editor/src/builder/ai-builder.css"), "utf8");
assert.match(builder, /'has-active-turn': Boolean\(activeChatTurnMessageId\) && interactionLocked/);
assert.match(builder, /watch\(interactionLocked,[\s\S]*?activeChatTurnMessageId\.value = ""/);
assert.match(builder, /class="ai-chat-thinking"/);
assert.match(builder, /:aria-busy="interactionLocked \? 'true' : 'false'"/);
assert.match(builderCss, /\.ai-chat-messages\.has-active-turn::after \{ min-height: 100%; flex: 0 0 100%/);
assert.match(builderCss, /\.ai-chat-message \{ width: 100%;[\s\S]*?border: 0;[\s\S]*?background: transparent/);
assert.match(builderCss, /\.ai-chat-message\.is-user \{ width: min\(84%, 620px\);[\s\S]*?background: #176b4d/);
assert.match(builderCss, /@keyframes ai-chat-thinking-dot/);
assert.match(builderCss, /prefers-reduced-motion:[\s\S]*?\.ai-chat-thinking i \{ animation: none/);

console.log("AI Builder chat workspace contract passed");
