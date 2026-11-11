<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PageSchemaWireframe from "./PageSchemaWireframe.vue";
import RequirementTable from "./RequirementTable.vue";
import {pendingContentConfirmations} from "../../../shared/page-schema/content-confirmation.mjs";
import BuilderModeSelector from "./BuilderModeSelector.vue";
import CompositionReview from "./CompositionReview.vue";
import { visualEditorEntry } from "../platform/visual-editor-entry.mjs";
import { evaluateAssetReadiness } from "../shared/composition/asset-readiness.mjs";
import { resolveCompositionLocale } from "../shared/composition/composition-locale.mjs";
import {
  composeOverviewInstruction,
  referenceItemCharacterBudget,
  summarizeReferenceProposal,
} from "./services/reference-overview-summary.mjs";
import OperationProposalReview from "./OperationProposalReview.vue";
import { createAiBuilderStore, clearBuilderError, setBuilderError } from "./state/ai-builder-store.mjs";
import {
  updatePageSchemaMedia,
  generatePageSchema,
  savePageSchema,
  analyzeOverviewWithRetry,
  applyCompositionProposal,
  createBuilderDocument,
  createPromoRequestV3,
  createCompositionProposal,
  ensureBuilderSession,
  loadCompositionProposal,
  loadBuilderDocument,
  saveBuilderDocument,
  loadBuilderCapabilities,
  loadCompositionShells,
  loadPromptExecutionDisplay,
  recordBuilderEvent,
  retryBuilderAssets,
  rollbackComposition,
  submitCompositionOperation,
  uploadReferenceImage,
  analyzeReferenceImage,
  deleteReferenceImage,
  createChatWorkspace,
  loadChatWorkspace,
  listChatWorkspaces,
  saveChatMessage,
  saveRequirementsRevision,
  executeChatAction,
  saveWireframeRevision,
  updateWireframeDraft,
  confirmWireframeRevision,
} from "./services/composition-client.mjs";
import { buildWireframeSections } from "./services/wireframe-display.mjs";
import { createAiBuilderState } from "../shared/composition/composition-state.mjs";

const props = defineProps({
  initialMode: { type: String, default: "" },
});
const store = createAiBuilderStore();
const selectedMode = ref(props.initialMode);
const operationOpen = ref(false);
const pageSchemaEditorOpen = ref(false);
const pageSchemaSaving = ref(false);
const pageGenerationRequest=ref(null);
const pageSummaryOutdated=computed(()=>Boolean(capabilities.value.chatWorkspaceV1&&store.snapshot?.generationMeta?.sourceRequirements&&requirementsRevision.value>store.snapshot.generationMeta.sourceRequirements.revision));
const pageStructurePending=computed(()=>store.snapshot?.content?.pageSchema&&store.snapshot.generationMeta?.review?.state==='pending');
async function changeDynamicMedia(operation){
 pageSchemaSaving.value=true;
 try{const saved=await updatePageSchemaMedia({...operation,documentId:store.documentId,baseDocumentRevision:store.documentRevision});store.documentRevision=Number(saved.revision);store.snapshot=saved.snapshot;transientQualityGate.value=null;}catch(error){setBuilderError(store,error);}finally{pageSchemaSaving.value=false;}
}
async function saveDynamicPage(page){
 pageSchemaSaving.value=true;
 try{const saved=await savePageSchema({documentId:store.documentId,baseDocumentRevision:store.documentRevision,page});store.documentRevision=Number(saved.revision);store.snapshot=saved.snapshot;transientQualityGate.value=null;pageSchemaEditorOpen.value=false;store.stage="review_required";activeResultTab.value="wireframe";}catch(error){setBuilderError(store,error);}finally{pageSchemaSaving.value=false;}
}
const assetRetrying = ref(false);
const capabilities = ref({ aiMode: true });
const activeShell = ref(null);
const designReferenceId = new URLSearchParams(window.location.search).get("designReferenceId") || "";
const layoutReferenceId = new URLSearchParams(window.location.search).get("layoutReferenceId") || "";
const pendingOperations = ref(null);
const operationConflict = ref(null);
const overviewRetry = ref(null);
const ACTIVE_CHAT_STORAGE_KEY = "promoAiBuilder.activeChat.v2";
const LEGACY_CHAT_STORAGE_KEY = "promoAiBuilder.chatWorkspace.v1";
const messages = ref([]);
const visibleMessages = computed(() => messages.value.filter((message) => message.type !== "internal"));
const attachments = ref([]);
const chatInput = ref("");
const chatInputElement = ref(null);
const chatSubmitting = ref(false);
const attachmentBusy = ref(false);
const wireframeSnapshot = ref(null);
const chatSessionId = ref("");
const requirementsRevision = ref(0);
const wireframeRevision = ref(0);
const wireframeFingerprint = ref("");
const wireframeViewport = ref("desktop");
const activeResultTab = ref("requirements");
const splitPercent = ref(42);
const draggingSplit = ref(false);
const chatList = ref(null);
const activeChatTurnMessageId = ref("");
const streamingMessageIds = ref([]);
const chatFollowOutput = ref(true);
const showLatestMessageButton = ref(false);
const pendingClarificationQuestions = ref([]);
const pendingClarificationItems = ref([]);
const clarificationAskedFields = ref([]);
const clarificationAnsweredFields = ref([]);
const pendingChatActionKey = ref("");
const pendingChatActionLabel = ref("");
const fileInput = ref(null);
const chatMenuOpen = ref(false);
const chatSessions = ref([]);
const chatSessionsLoading = ref(false);
const chatSessionsError = ref("");
const chatSessionSwitching = ref(false);
const legacyWorkspace = ref(null);
const requirementsEditing = ref(false);
const requirementsEditDraft = ref(null);
const requirementsEditBaseline = ref(null);
const requirementsSaving = ref(false);
const wireframeEditing = ref(false);
const wireframeEditDraft = ref({ content: {}, alignment: {} });
const wireframeEditBaseline = ref({ content: {}, alignment: {} });
const wireframeSaving = ref(false);
const wireframeRevealState = ref("complete");
const wireframeRevealedCount = ref(Number.MAX_SAFE_INTEGER);
const compositionReviewRef = ref(null);
const finalQualityChecking = ref(false);
const transientQualityGate = ref(null);
const failedTask = ref(null);
const failedTaskRetrying = ref(false);
let assetPollingCancelled = false;
let localeUnsubscribe = null;
const streamTimers = new Map();
const wireframeRevealTimers = new Set();
let chatScrollProgrammatic = false;
let chatScrollReleaseTimer = 0;
const localeRevision = ref(0);
function translate(key, fallback) {
  localeRevision.value;
  const translated = window.PromoI18n?.t?.(key);
  return translated && translated !== key ? translated : fallback;
}
const busy = computed(() => [
  "analyzing_overview", "resolving_policy", "queued", "processing", "applying",
  "generating_assets", "preview_ready", "navigating_preview",
].includes(store.stage));
const hasStreamingMessage = computed(() => streamingMessageIds.value.length > 0);
const interactionLocked = computed(() => (
  chatSessionSwitching.value || chatSubmitting.value || busy.value || attachmentBusy.value || requirementsSaving.value || wireframeSaving.value
  || finalQualityChecking.value || failedTaskRetrying.value
  || Boolean(pendingChatActionKey.value) || hasStreamingMessage.value
));
const chatComposerLocked = computed(() => (
  interactionLocked.value || requirementsEditing.value || wireframeEditing.value
));
const requirementsEditDirty = computed(() => (
  requirementsEditing.value
  && JSON.stringify(requirementsEditDraft.value) !== JSON.stringify(requirementsEditBaseline.value)
));
const wireframeEditDirty = computed(() => (
  wireframeEditing.value
  && JSON.stringify(wireframeEditDraft.value) !== JSON.stringify(wireframeEditBaseline.value)
));
const currentStatus = computed(() => {
  if(pageStructurePending.value)return {label:"페이지 구성 확인 및 승인 대기",state:"확인 필요"};
  if (finalQualityChecking.value) return { label: "Desktop · Mobile 디자인 품질 검사 중", state: "진행 중" };
  if (attachmentBusy.value) return { label: "참고 이미지 분석", state: "진행 중" };
  if (busy.value) return { label: progressMessage.value, state: "진행 중" };
  if (chatSubmitting.value) return { label: "요청을 전송하고 있습니다.", state: "진행 중" };
  if (pendingChatActionKey.value) {
    return { label: `${pendingChatActionLabel.value || "요청"} 처리 중`, state: "진행 중" };
  }
  if (hasStreamingMessage.value) return { label: "답변을 작성하고 있습니다.", state: "진행 중" };
  if (requirementsEditing.value) return { label: "요청 내용 수정 중", state: "확인 필요" };
  if (wireframeEditing.value) return { label: "페이지 내용 수정 중", state: "확인 필요" };
  if (store.stage === "failed") return { label: store.error?.message || "처리 실패", state: "실패" };
  if (store.snapshot && store.stage === "render_ready") {
    return finalQualityPassed.value
      ? { label: "디자인 미리보기 및 품질 검사 완료", state: "완료" }
      : { label: "디자인 품질 확인 필요", state: "확인 필요" };
  }
  if (wireframeSnapshot.value) return { label: "페이지 구성 확인 및 수정 가능", state: "확인 필요" };
  if (store.overviewDraft) return { label: "요청 정리 완료 · 페이지 미리보기 생성 가능", state: "확인 필요" };
  return { label: "만들고 싶은 프로모션을 입력해 주세요", state: "대기" };
});
const finalQualityGate = computed(() => transientQualityGate.value || store.snapshot?.qualityGate || null);
const finalQualityPassed = computed(() => (
  finalQualityGate.value?.state === "passed"
  && Number(finalQualityGate.value?.documentRevision || 0) === Number(store.documentRevision || 0)
  && Number(finalQualityGate.value?.blockingCount || 0) === 0
));
const wireframeDisplaySnapshot = computed(() => wireframeSnapshot.value || store.proposal?.snapshot || null);
const wireframeSections = computed(() => buildWireframeSections(wireframeDisplaySnapshot.value, {
  overview: store.overviewDraft || {},
  viewport: wireframeViewport.value,
}));
const wireframeComponentCount = computed(() => wireframeSections.value.reduce(
  (total, section) => total + section.components.length,
  0,
));
const fullScreenProgress = computed(() => [
  "analyzing_overview", "resolving_policy", "queued", "processing", "applying",
  "generating_assets", "preview_ready", "navigating_preview",
].includes(store.stage));
const progressMessage = computed(() => {
  if (store.stage === "analyzing_overview") {
    if (overviewRetry.value) {
      return translate(
        "builder.progress.retryingOverview",
        "AI 응답 오류로 재시도하고 있습니다. ({attempt}/{maxAttempts})"
      )
        .replace("{attempt}", String(overviewRetry.value.attempt))
        .replace("{maxAttempts}", String(overviewRetry.value.maxAttempts));
    }
    return translate("builder.progress.analyzingOverview", "프로모션 개요를 분석하고 있습니다.");
  }
  if (["resolving_policy", "queued", "processing"].includes(store.stage)) {
    return translate("builder.progress.composingStructure", "프로모션 구조를 구성하고 있습니다.");
  }
  if (store.stage === "generating_assets") {
    return translate("builder.progress.generatingAssets", "AI 이미지를 생성하고 있습니다.");
  }
  if (["preview_ready", "navigating_preview"].includes(store.stage)) {
    return translate("builder.progress.preparingPreview", "Live Preview를 준비하고 있습니다.");
  }
  return translate("builder.progress.generatingStructure", "프로모션 구조를 생성하고 있습니다.");
});
const retryableAssetError = computed(() => Boolean(store.snapshot && [
  "ASSET_GENERATION_FAILED", "ASSET_GENERATION_TIMEOUT", "ASSET_ENQUEUE_FAILED",
  "PROVIDER_BILLING_REQUIRED",
].includes(store.error?.code)));
const failedTaskCanRetry = computed(() => Boolean(
  failedTask.value && failedTask.value.retryable !== false,
));

function recoveryStage() {
  if (store.snapshot) return "render_ready";
  if (wireframeSnapshot.value) return "review_required";
  if (store.overviewDraft) return "reviewing_overview";
  return "idle";
}

function rememberFailedTask(task, error) {
  failedTask.value = {
    kind: String(task?.kind || "unknown"),
    operationId: String(task?.operationId || ""),
    label: String(task?.label || "작업"),
    input: String(task?.input || ""),
    editableInput: String(task?.editableInput || ""),
    messagePersisted: task?.messagePersisted === true,
    action: task?.action && typeof task.action === "object"
      ? JSON.parse(JSON.stringify(task.action))
      : null,
    retryable: error?.retryable !== false,
    error: {
      code: String(error?.code || "BUILDER_REQUEST_FAILED"),
      message: String(error?.message || error || "요청을 처리하지 못했습니다."),
    },
    failedAt: new Date().toISOString(),
  };
}

function clearFailedTask({ clearError = false } = {}) {
  failedTask.value = null;
  if (clearError) clearBuilderError(store);
}

function isFailedTaskMessage(message) {
  return Boolean(
    message?.status === "failed"
    && failedTask.value?.operationId
    && failedTask.value.operationId === message.operationId,
  );
}

function editFailedTask() {
  const task = failedTask.value;
  if (!task || failedTaskRetrying.value) return;
  const fallbackInput = [...messages.value].reverse().find(
    (message) => message.role === "user" && message.type === "user" && String(message.text || "").trim(),
  )?.text || "";
  chatInput.value = task.editableInput || fallbackInput;
  store.stage = recoveryStage();
  clearBuilderError(store);
  nextTick(() => chatInputElement.value?.focus());
}

async function retryFailedTask() {
  const task = failedTask.value;
  if (!task || task.retryable === false || failedTaskRetrying.value) return;
  failedTaskRetrying.value = true;
  failedTask.value = null;
  clearBuilderError(store);
  try {
    if (task.kind === "overview") {
      await analyze(task.input, { editableInput: task.editableInput });
    } else if (task.kind === "wireframe") {
      await prepareWireframe("", task.action || null);
    } else if (task.kind === "final-design") {
      await approveWireframe(task.action || {});
    } else if (task.kind === "page-layout-edit") {
      await editNaturalLanguage(task.input);
    } else if (task.kind === "chat-action" && task.action) {
      failedTaskRetrying.value = false;
      await handleChatAction(task.action);
    } else if (task.kind === "submit") {
      if (!task.messagePersisted) {
        chatInput.value = task.editableInput || task.input;
        failedTaskRetrying.value = false;
        await submitChat();
      } else {
        const referenceSummary = await analyzeAttachments();
        const combined = composeOverviewInstruction(
          conversationInstruction(task.editableInput || task.input),
          referenceSummary,
        );
        store.naturalLanguage = combined;
        await analyze(combined, { editableInput: task.editableInput });
      }
    }
  } catch (error) {
    rememberFailedTask(task, error);
    setBuilderError(store, error);
  } finally {
    failedTaskRetrying.value = false;
  }
}

function selectMode(mode) {
  recordBuilderEvent({ eventName: "builder_mode_selected", metadata: { mode } });
  if (mode === "wireframe") {
    window.location.assign("/prototype/create-promo.html?mode=wireframe");
    return;
  }
  if (mode === "template") {
    window.location.assign("/prototype/create-promo.html?mode=template");
    return;
  }
  selectedMode.value = "ai";
  const url = new URL(window.location.href);
  url.searchParams.set("mode", "ai");
  window.history.replaceState({}, "", url);
}

function refreshOverviewFingerprint(overview = store.overviewDraft) {
  const fingerprint = window.PromoPromotionOverview?.fingerprint;
  if (typeof fingerprint !== "function") {
    throw Object.assign(new Error("프로모션 개요 검증 모듈을 불러오지 못했습니다."), {
      code: "OVERVIEW_FINGERPRINT_UNAVAILABLE",
    });
  }
  const nextFingerprint = fingerprint(overview || {});
  store.overviewFingerprint = nextFingerprint;
  return nextFingerprint;
}

function updateOverviewDraft(overview) {
  store.overviewDraft = overview && typeof overview === "object" ? overview : {};
  try {
    refreshOverviewFingerprint(store.overviewDraft);
    clearBuilderError(store);
  } catch (error) {
    setBuilderError(store, error);
  }
}

function prefersReducedMotion() {
  return Boolean(globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

function clearWireframeRevealTimers() {
  wireframeRevealTimers.forEach((timer) => globalThis.clearTimeout(timer));
  wireframeRevealTimers.clear();
}

function completeWireframeReveal() {
  clearWireframeRevealTimers();
  wireframeRevealedCount.value = Number.MAX_SAFE_INTEGER;
  wireframeRevealState.value = "complete";
}

async function startWireframeReveal() {
  clearWireframeRevealTimers();
  const sectionCount = wireframeSections.value.length;
  if (
    capabilities.value.progressivePreviewReveal === false
    || prefersReducedMotion()
    || sectionCount < 1
  ) {
    completeWireframeReveal();
    return;
  }
  wireframeRevealedCount.value = 0;
  wireframeRevealState.value = "prepared";
  await nextTick();
  wireframeRevealState.value = "revealing";
  const sequenceCount = Math.min(sectionCount, 8);
  for (let index = 0; index < sequenceCount; index += 1) {
    const timer = globalThis.setTimeout(() => {
      wireframeRevealTimers.delete(timer);
      wireframeRevealedCount.value = index + 1;
      if (index + 1 === sequenceCount) completeWireframeReveal();
    }, index * 110);
    wireframeRevealTimers.add(timer);
  }
}

function setProgrammaticChatScroll(callback) {
  chatScrollProgrammatic = true;
  clearTimeout(chatScrollReleaseTimer);
  callback();
  chatScrollReleaseTimer = globalThis.setTimeout(() => {
    chatScrollProgrammatic = false;
  }, prefersReducedMotion() ? 0 : 500);
}

function scrollChatMessageIntoView(messageId, behavior = "auto") {
  const container = chatList.value;
  const target = container?.querySelector(`[data-message-id="${messageId}"]`);
  if (!container || !target || !chatFollowOutput.value) return;
  const targetTop = container.scrollTop
    + target.getBoundingClientRect().top
    - container.getBoundingClientRect().top;
  const targetBottom = targetTop + target.offsetHeight;
  const visibleBottom = container.scrollTop + container.clientHeight - 28;
  if (targetBottom <= visibleBottom && targetTop >= container.scrollTop + 8) return;
  setProgrammaticChatScroll(() => {
    container.scrollTo({
      top: Math.max(0, targetBottom - container.clientHeight + 32),
      behavior: prefersReducedMotion() ? "auto" : behavior,
    });
  });
}

function pauseChatFollow() {
  if (!chatScrollProgrammatic && (interactionLocked.value || hasStreamingMessage.value)) {
    chatFollowOutput.value = false;
    showLatestMessageButton.value = true;
  }
}

function handleChatScroll() {
  if (chatScrollProgrammatic) return;
  const container = chatList.value;
  if (!container || activeChatTurnMessageId.value) return;
  const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 48;
  if (nearBottom) {
    chatFollowOutput.value = true;
    showLatestMessageButton.value = false;
  }
}

function jumpToLatestMessage() {
  const container = chatList.value;
  if (!container) return;
  chatFollowOutput.value = true;
  showLatestMessageButton.value = false;
  const latest = [...messages.value].reverse().find((message) => message.text);
  if (latest) {
    nextTick(() => scrollChatMessageIntoView(latest.id, "smooth"));
    return;
  }
  setProgrammaticChatScroll(() => {
    container.scrollTo({ top: container.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

function finishAssistantStream(message) {
  const timer = streamTimers.get(message.id);
  if (timer) clearTimeout(timer);
  streamTimers.delete(message.id);
  message.displayText = message.text;
  message.displaySegments = [];
  message.isStreaming = false;
  streamingMessageIds.value = streamingMessageIds.value.filter((id) => id !== message.id);
  if (chatFollowOutput.value) nextTick(() => scrollChatMessageIntoView(message.id));
  else showLatestMessageButton.value = true;
}

function assistantStreamSegments(text, maxCharacters = 52) {
  const sourceLines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const segments = [];
  sourceLines.forEach((sourceLine, sourceIndex) => {
    const line = sourceLine.trim();
    if (!line) {
      if (sourceIndex > 0 && segments.at(-1) !== "") segments.push("");
      return;
    }
    const words = line.split(/\s+/).filter(Boolean);
    let current = "";
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (current && next.length > maxCharacters) {
        segments.push(current);
        current = word;
        return;
      }
      current = next;
    });
    if (current) segments.push(current);
  });
  return segments.length ? segments : [String(text || "")];
}

function streamAssistantMessage(message) {
  if (message.role !== "assistant" || !["assistant", "clarification"].includes(message.type) || !message.text) return;
  if (prefersReducedMotion()) {
    message.displayText = message.text;
    message.displaySegments = [];
    message.isStreaming = false;
    return;
  }
  const segments = assistantStreamSegments(message.text);
  message.displayText = "";
  message.displaySegments = [];
  message.isStreaming = true;
  streamingMessageIds.value = [...streamingMessageIds.value, message.id];
  let index = 0;
  const reveal = () => {
    index = Math.min(segments.length, index + 1);
    message.displaySegments = segments.slice(0, index);
    message.displayText = message.displaySegments.join("\n");
    if (chatFollowOutput.value) nextTick(() => scrollChatMessageIntoView(message.id));
    else showLatestMessageButton.value = true;
    if (index >= segments.length) {
      streamTimers.set(message.id, globalThis.setTimeout(() => finishAssistantStream(message), 220));
      return;
    }
    const delay = segments.length > 30 ? 55 : segments.length > 15 ? 70 : 90;
    streamTimers.set(message.id, globalThis.setTimeout(reveal, delay));
  };
  reveal();
}

function messageDisplayText(message) {
  return message.isStreaming ? message.displayText : message.text;
}

const DUPLICATE_MESSAGE_WINDOW_MS = 10_000;

function messageCreatedAtMs(message) {
  const timestamp = Date.parse(message?.createdAt || message?.updatedAt || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function duplicateMessageKey(message) {
  if (!message || message.role !== "assistant") return "";
  const text = String(message.text || "").replace(/\s+/g, " ").trim();
  return text ? `${message.role}:${message.type || "message"}:${text}` : "";
}

function mergeDuplicateMessage(target, source) {
  if ((!Array.isArray(target.actions) || !target.actions.length) && Array.isArray(source.actions)) {
    target.actions = source.actions;
  }
  if ((!Array.isArray(target.questions) || !target.questions.length) && Array.isArray(source.questions)) {
    target.questions = source.questions;
  }
  return target;
}

function findRecentDuplicateMessage(candidate) {
  const key = duplicateMessageKey(candidate);
  if (!key) return null;
  const candidateTime = messageCreatedAtMs(candidate) || Date.now();
  const turnStart=messages.value.findLastIndex(message=>message.role==='user');
  return messages.value.slice(turnStart+1).reverse().find((message) => {
    if (duplicateMessageKey(message) !== key) return false;
    const existingTime = messageCreatedAtMs(message);
    return !existingTime || Math.abs(candidateTime - existingTime) <= DUPLICATE_MESSAGE_WINDOW_MS;
  }) || null;
}

function appendMessage(role, text, extra = {}) {
  const normalizedText = String(text || "");
  const candidate = {
    role,
    text: normalizedText,
    createdAt: extra.createdAt || new Date().toISOString(),
    ...extra,
  };
  const duplicate = findRecentDuplicateMessage(candidate);
  if (duplicate) return mergeDuplicateMessage(duplicate, candidate);
  const message = {
    id: crypto.randomUUID(),
    ...candidate,
  };
  messages.value.push(message);
  if (role === "user") {
    activeChatTurnMessageId.value = message.id;
    chatFollowOutput.value = true;
    showLatestMessageButton.value = false;
  }
  streamAssistantMessage(message);
  nextTick(() => {
    const container = chatList.value;
    if (!container) return;
    if (role === "user") {
      const target = [...container.querySelectorAll("[data-message-id]")]
        .find((element) => element.dataset.messageId === message.id);
      if (!target) return;
      const alignUserTurn = () => {
        const top = container.scrollTop
          + target.getBoundingClientRect().top
          - container.getBoundingClientRect().top
          - 12;
        setProgrammaticChatScroll(() => {
          container.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? "auto" : "smooth" });
        });
      };
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(alignUserTurn);
      } else {
        alignUserTurn();
      }
      return;
    }
    if (chatFollowOutput.value) scrollChatMessageIntoView(message.id);
    else showLatestMessageButton.value = true;
  });
  return message;
}

async function persistMessage(message) {
  if (!capabilities.value.chatWorkspaceV1 || !chatSessionId.value) return message;
  const response = await saveChatMessage(chatSessionId.value, message);
  const index = messages.value.findIndex((item) => item.id === message.id);
  if (index >= 0) {
    const current = messages.value[index];
    const transient = {
      displayText: current.displayText,
      displaySegments: current.displaySegments,
      isStreaming: current.isStreaming,
    };
    Object.assign(current, response.message, transient);
  }
  return response.message;
}

async function appendPersistedMessage(role, text, extra = {}) {
  const message = appendMessage(role, text, extra);
  return persistMessage(message);
}

function updateStatusMessage(operationId, text, status = "in_progress") {
  const existing = messages.value.find((message) => message.operationId === operationId);
  if (existing) {
    existing.text = text;
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }
  return appendMessage("system", text, { type: "status", operationId, status });
}

function normalizeRestoredMessages(value) {
  const normalized = [];
  const seenIds = new Set();
  const recentByKey = new Map();
  for (const valueMessage of Array.isArray(value) ? value : []) {
    const { displayText, displaySegments, isStreaming, ...message } = valueMessage || {};
    if (!message.id || seenIds.has(message.id)) continue;
    seenIds.add(message.id);
    if(message.role==='user')recentByKey.clear();
    const key = duplicateMessageKey(message);
    const timestamp = messageCreatedAtMs(message);
    const previous = key ? recentByKey.get(key) : null;
    if (previous && (!timestamp || !previous.timestamp || Math.abs(timestamp - previous.timestamp) <= DUPLICATE_MESSAGE_WINDOW_MS)) {
      mergeDuplicateMessage(previous.message, message);
      continue;
    }
    normalized.push(message);
    if (key) recentByKey.set(key, { message, timestamp });
  }
  return normalized;
}

function restorePendingClarificationsFromMessages() {
  const askedFields = new Set(clarificationAskedFields.value);
  messages.value.filter((message) => message.type === "clarification").forEach((message) => {
    const items = Array.isArray(message.clarificationItems)
      ? message.clarificationItems
      : Array.isArray(message.metadata?.clarificationItems) ? message.metadata.clarificationItems : [];
    items.forEach((item) => {
      const field = String(item?.field || "").trim();
      if (field) askedFields.add(field);
    });
  });
  clarificationAskedFields.value = [...askedFields];
  const latest = [...messages.value].reverse().find((message) => message.type === "clarification");
  const latestUserIndex = messages.value.findLastIndex((message) => message.role === "user");
  const clarificationIndex = latest ? messages.value.findIndex((message) => message.id === latest.id) : -1;
  const items = Array.isArray(latest?.clarificationItems)
    ? latest.clarificationItems
    : Array.isArray(latest?.metadata?.clarificationItems) ? latest.metadata.clarificationItems : [];
  pendingClarificationItems.value = clarificationIndex > latestUserIndex ? items.slice(0, 3) : [];
  pendingClarificationQuestions.value = pendingClarificationItems.value.map((item) => item.question);
}

function resetAssistantStreams() {
  streamTimers.forEach((timer) => clearTimeout(timer));
  streamTimers.clear();
  streamingMessageIds.value = [];
  chatFollowOutput.value = true;
  showLatestMessageButton.value = false;
}

function persistWorkspace() {
  try {
    sessionStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, JSON.stringify({
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      requestId: store.requestId,
      chatSessionId: chatSessionId.value,
      requirementsRevision: requirementsRevision.value,
      wireframeRevision: wireframeRevision.value,
      wireframeFingerprint: wireframeFingerprint.value,
      wireframeViewport: wireframeViewport.value,
      stage: store.stage,
      naturalLanguage: store.naturalLanguage,
      inputLocale: store.inputLocale,
      overviewDraft: store.overviewDraft,
      overviewFingerprint: store.overviewFingerprint,
      pendingClarificationQuestions: pendingClarificationQuestions.value,
      overviewDirty:overviewDirty.value,
      overviewBackup:overviewBackup.value,
      pageGenerationRequest:pageGenerationRequest.value,
      pendingClarificationItems: pendingClarificationItems.value,
      clarificationAskedFields: clarificationAskedFields.value,
      clarificationAnsweredFields: clarificationAnsweredFields.value,
      messages: messages.value.slice(-200).map(({ displayText, displaySegments, isStreaming, ...message }) => message),
      attachments: attachments.value.map(({ dataUrl, ...attachment }) => attachment),
      wireframeSnapshot: wireframeSnapshot.value,
      activeResultTab: activeResultTab.value,
      splitPercent: splitPercent.value,
      requirementsEditing: requirementsEditing.value,
      requirementsEditDraft: requirementsEditing.value ? requirementsEditDraft.value : null,
      requirementsEditBaseline: requirementsEditing.value ? requirementsEditBaseline.value : null,
      failedTask: failedTask.value,
    }));
  } catch {
    // Browser storage is a convenience cache; Builder Document remains canonical.
  }
}

function restoreWorkspaceCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(ACTIVE_CHAT_STORAGE_KEY) || "null");
    if (!cached || typeof cached !== "object") return null;
    messages.value = normalizeRestoredMessages(cached.messages);
    attachments.value = Array.isArray(cached.attachments) ? cached.attachments : [];
    wireframeSnapshot.value = cached.wireframeSnapshot || null;
    activeResultTab.value = ["requirements", "wireframe", "final"].includes(cached.activeResultTab)
      ? cached.activeResultTab
      : "requirements";
    splitPercent.value = Math.min(65, Math.max(28, Number(cached.splitPercent || 42)));
    store.documentId = cached.documentId || "";
    store.documentRevision = Number(cached.documentRevision || 0);
    store.requestId = cached.requestId || "";
    chatSessionId.value = cached.chatSessionId || "";
    requirementsRevision.value = Number(cached.requirementsRevision || 0);
    wireframeRevision.value = Number(cached.wireframeRevision || 0);
    wireframeFingerprint.value = cached.wireframeFingerprint || "";
    wireframeViewport.value = cached.wireframeViewport === "mobile" ? "mobile" : "desktop";
    store.naturalLanguage = cached.naturalLanguage || "";
    store.inputLocale = cached.inputLocale || "";
    store.overviewDraft = cached.overviewDraft || null;
    overviewDirty.value=Boolean(cached.overviewDirty);
    overviewBackup.value=cached.overviewBackup||null;
    if(overviewDirty.value)overviewSaveMessage.value='저장하지 않은 요청 요약 변경이 있습니다. 저장을 다시 시도해 주세요.';
    pageGenerationRequest.value=cached.pageGenerationRequest||null;
    store.overviewFingerprint = cached.overviewFingerprint || "";
    pendingClarificationQuestions.value = Array.isArray(cached.pendingClarificationQuestions)
      ? cached.pendingClarificationQuestions.slice(0, 3)
      : [];
    pendingClarificationItems.value = Array.isArray(cached.pendingClarificationItems)
      ? cached.pendingClarificationItems.slice(0, 3)
      : [];
    clarificationAskedFields.value = Array.isArray(cached.clarificationAskedFields)
      ? [...new Set(cached.clarificationAskedFields.map(String).filter(Boolean))]
      : [];
    clarificationAnsweredFields.value = Array.isArray(cached.clarificationAnsweredFields)
      ? [...new Set(cached.clarificationAnsweredFields.map(String).filter(Boolean))]
      : [];
    requirementsEditing.value = Boolean(cached.requirementsEditing && cached.requirementsEditDraft);
    requirementsEditDraft.value = requirementsEditing.value ? cached.requirementsEditDraft : null;
    requirementsEditBaseline.value = requirementsEditing.value
      ? (cached.requirementsEditBaseline || cloneRequirements(store.overviewDraft))
      : null;
    failedTask.value = cached.failedTask && typeof cached.failedTask === "object"
      ? cached.failedTask
      : null;
    if (failedTask.value?.error) {
      store.error = {
        ...failedTask.value.error,
        details: [],
        retryable: failedTask.value.retryable !== false,
      };
    }
    return cached;
  } catch {
    return null;
  }
}

function loadLegacyWorkspaceCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(LEGACY_CHAT_STORAGE_KEY) || "null");
    if (!cached || typeof cached !== "object") return null;
    const hasHistory = Array.isArray(cached.messages) && cached.messages.length > 0
      || cached.overviewDraft
      || cached.wireframeSnapshot;
    return hasHistory ? cached : null;
  } catch {
    return null;
  }
}

function legacyWorkspaceSummary(cached = legacyWorkspace.value) {
  if (!cached) return null;
  const history = Array.isArray(cached.messages) ? cached.messages : [];
  const firstUserMessage = history.find((message) => message.role === "user" && message.text);
  const lastMessage = [...history].reverse().find((message) => message.text);
  return {
    id: `legacy:${cached.chatSessionId || cached.documentId || "browser"}`,
    documentId: cached.documentId || "",
    requestId: cached.requestId || "",
    title: String(firstUserMessage?.text || "이전 프로모션 대화").replace(/\s+/g, " ").slice(0, 80),
    preview: String(lastMessage?.text || "").replace(/\s+/g, " ").slice(0, 140),
    stage: cached.stage || (cached.wireframeSnapshot ? "wireframe_review" : "idle"),
    updatedAt: lastMessage?.updatedAt || lastMessage?.createdAt || "",
    isLocal: true,
  };
}

function resetWorkspaceState() {
  overviewDirty.value=false;overviewSaveMessage.value='';overviewBackup.value=null;pageGenerationRequest.value=null;clearTimeout(overviewSaveTimer);
  const executionDisplays = store.executionDisplays;
  resetAssistantStreams();
  Object.assign(store, createAiBuilderState({ executionDisplays }));
  messages.value = [];
  attachments.value = [];
  chatInput.value = "";
  wireframeSnapshot.value = null;
  transientQualityGate.value = null;
  finalQualityChecking.value = false;
  failedTask.value = null;
  failedTaskRetrying.value = false;
  activeChatTurnMessageId.value = "";
  chatSessionId.value = "";
  requirementsRevision.value = 0;
  wireframeRevision.value = 0;
  wireframeFingerprint.value = "";
  wireframeViewport.value = "desktop";
  activeResultTab.value = "requirements";
  pendingOperations.value = null;
  operationConflict.value = null;
  overviewRetry.value = null;
  requirementsEditing.value = false;
  requirementsEditDraft.value = null;
  requirementsEditBaseline.value = null;
  requirementsSaving.value = false;
  pendingClarificationQuestions.value = [];
  pendingClarificationItems.value = [];
  clarificationAskedFields.value = [];
  clarificationAnsweredFields.value = [];
  wireframeEditing.value = false;
  wireframeEditDraft.value = { content: {}, alignment: {} };
  wireframeEditBaseline.value = { content: {}, alignment: {} };
  wireframeSaving.value = false;
  completeWireframeReveal();
}

function appendWelcomeMessage() {
  if (messages.value.length) return;
  appendMessage(
    "assistant",
    "한두 문장으로 시작해도 됩니다. 만들고 싶은 프로모션과 핵심 혜택만 알려주세요. 핵심 내용은 확인하고, 미정인 선택 정보는 제외하여 AI가 구성하도록 할 수 있습니다.\n\n예: 신규 회원에게 1만원 쿠폰과 무료 배송을 제공하는 고급스러운 겨울 이벤트를 만들어줘.",
    { type: "assistant" },
  );
}

function chatStageLabel(stage) {
  return ({
    idle: "작성 대기",
    requirements_review: "요구사항 검토",
    wireframe_review: "페이지 구성 검토",
    finalizing: "최종 생성 중",
    completed: "완료",
  })[stage] || "작성 중";
}

function formatChatUpdatedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function refreshChatSessions() {
  if (!capabilities.value.chatWorkspaceV1 || chatSessionsLoading.value) return;
  chatSessionsLoading.value = true;
  chatSessionsError.value = "";
  try {
    const response = await listChatWorkspaces(30);
    const remoteSessions = Array.isArray(response.sessions) ? response.sessions : [];
    const localSummary = legacyWorkspaceSummary();
    const duplicateLocalSession = localSummary?.id && remoteSessions.some(
      (session) => session.id === legacyWorkspace.value?.chatSessionId,
    );
    chatSessions.value = localSummary && !duplicateLocalSession
      ? [localSummary, ...remoteSessions]
      : remoteSessions;
  } catch (error) {
    chatSessionsError.value = error.message || "대화 목록을 불러오지 못했습니다.";
  } finally {
    chatSessionsLoading.value = false;
  }
}

async function toggleChatMenu() {
  chatMenuOpen.value = !chatMenuOpen.value;
  if (chatMenuOpen.value) await refreshChatSessions();
}

async function startNewConversation() {
  if (interactionLocked.value || chatSessionSwitching.value) return;
  chatSessionSwitching.value=true;
  try{await flushOverviewChanges();}catch(error){chatSessionSwitching.value=false;setBuilderError(store,error);return;}
  sessionStorage.removeItem(ACTIVE_CHAT_STORAGE_KEY);
  const url = new URL(window.location.href);
  url.searchParams.set("mode", "ai");
  window.location.assign(url.toString());
}

async function openChatSession(summary) {
  if (!summary?.id || interactionLocked.value || chatSessionSwitching.value) return;
  if (summary.id === chatSessionId.value) {
    chatMenuOpen.value = false;
    return;
  }
  chatSessionSwitching.value = true;
  chatSessionsError.value = "";
  try {
    await flushOverviewChanges();
    if (summary.isLocal) {
      const cached = legacyWorkspace.value;
      if (!cached) throw new Error("이전 로컬 대화 정보를 찾지 못했습니다.");
      resetWorkspaceState();
      messages.value = normalizeRestoredMessages(cached.messages);
      attachments.value = Array.isArray(cached.attachments) ? cached.attachments : [];
      wireframeSnapshot.value = cached.wireframeSnapshot || null;
      activeResultTab.value = ["requirements", "wireframe", "final"].includes(cached.activeResultTab)
        ? cached.activeResultTab
        : "requirements";
      store.documentId = cached.documentId || "";
      store.documentRevision = Number(cached.documentRevision || 0);
      store.requestId = cached.requestId || "";
      chatSessionId.value = cached.chatSessionId || "";
      requirementsRevision.value = Number(cached.requirementsRevision || 0);
      wireframeRevision.value = Number(cached.wireframeRevision || 0);
      wireframeFingerprint.value = cached.wireframeFingerprint || "";
      wireframeViewport.value = cached.wireframeViewport === "mobile" ? "mobile" : "desktop";
      store.naturalLanguage = cached.naturalLanguage || "";
      store.inputLocale = cached.inputLocale || "";
      store.overviewDraft = cached.overviewDraft || null;
      store.overviewFingerprint = cached.overviewFingerprint || "";
      pendingClarificationQuestions.value = Array.isArray(cached.pendingClarificationQuestions)
        ? cached.pendingClarificationQuestions.slice(0, 3)
        : [];
      pendingClarificationItems.value = Array.isArray(cached.pendingClarificationItems)
        ? cached.pendingClarificationItems.slice(0, 3)
        : [];
      clarificationAskedFields.value = Array.isArray(cached.clarificationAskedFields)
        ? [...new Set(cached.clarificationAskedFields.map(String).filter(Boolean))]
        : [];
      clarificationAnsweredFields.value = Array.isArray(cached.clarificationAnsweredFields)
        ? [...new Set(cached.clarificationAnsweredFields.map(String).filter(Boolean))]
        : [];
      restorePendingClarificationsFromMessages();
      if (store.documentId) {
        const loaded = await loadBuilderDocument(store.documentId).catch(() => null);
        if (loaded) {
          store.documentRevision = Number(loaded.document?.currentDocumentRevision || store.documentRevision);
          store.snapshot = loaded.snapshot || null;
          if(store.snapshot?.generationMeta?.requestId===pageGenerationRequest.value?.requestId)pageGenerationRequest.value=null;
        }
      }
      if (store.snapshot) store.stage = "render_ready";
      else if (wireframeSnapshot.value) store.stage = "review_required";
      else if (store.overviewDraft) store.stage = "reviewing_overview";
      else store.stage = "idle";
      appendWelcomeMessage();
      persistWorkspace();
      chatMenuOpen.value = false;
      return;
    }
    const [workspace, loaded] = await Promise.all([
      loadChatWorkspace(summary.id),
      loadBuilderDocument(summary.documentId),
    ]);
    resetWorkspaceState();
    store.documentId = summary.documentId;
    store.requestId = summary.requestId || "";
    store.documentRevision = Number(loaded.document?.currentDocumentRevision || 0);
    store.snapshot = loaded.snapshot || null;
    hydrateChatWorkspace(workspace);
    if (workspace.wireframe?.proposalId) {
      const proposal = await loadCompositionProposal(workspace.wireframe.proposalId);
      store.proposal = proposal.proposal;
    }
    if (store.snapshot) store.stage = "render_ready";
    else if (wireframeSnapshot.value) store.stage = "review_required";
    else if (store.overviewDraft) store.stage = "reviewing_overview";
    else store.stage = "idle";
    appendWelcomeMessage();
    persistWorkspace();
    chatMenuOpen.value = false;
  } catch (error) {
    chatSessionsError.value = error.message || "기존 대화를 열지 못했습니다.";
  } finally {
    chatSessionSwitching.value = false;
  }
}

function fileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("이미지를 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

function imageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("이미지 크기를 확인하지 못했습니다."));
    image.src = dataUrl;
  });
}

async function addImageFiles(files) {
  const accepted = [...files].filter((file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type));
  if (!accepted.length) return;
  if (attachments.value.length + accepted.length > 10) {
    appendMessage("system", "참고 이미지는 한 대화에서 최대 10장까지 첨부할 수 있습니다.", { type: "error" });
    return;
  }
  for (const file of accepted) {
    if (file.size > 10 * 1024 * 1024) {
      appendMessage("system", `${file.name}은 10MB를 초과해 첨부하지 않았습니다.`, { type: "error" });
      continue;
    }
    const dataUrl = await fileAsDataUrl(file);
    const dimensions = await imageDimensions(dataUrl);
    attachments.value.push({
      id: crypto.randomUUID(),
      name: file.name || "clipboard-image.png",
      mimeType: file.type,
      byteSize: file.size,
      width: dimensions.width,
      height: dimensions.height,
      viewport: dimensions.width <= 760 ? "mobile" : "desktop",
      status: "ready",
      dataUrl,
    });
  }
}

function onPaste(event) {
  const files = [...(event.clipboardData?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  event.preventDefault();
  addImageFiles(files).catch((error) => appendMessage("system", error.message, { type: "error" }));
}

async function removeAttachment(attachment) {
  attachments.value = attachments.value.filter((item) => item.id !== attachment.id);
  if (attachment.sourceId) deleteReferenceImage(attachment.sourceId).catch(() => null);
}

async function analyzeAttachments() {
  const pending = attachments.value.filter((attachment) => attachment.dataUrl && !attachment.analysis);
  if (!pending.length) return "";
  attachmentBusy.value = true;
  const operationId = `reference-${Date.now()}`;
  updateStatusMessage(operationId, `참고 이미지 ${pending.length}장을 업로드하고 있습니다.`, "in_progress");
  const summaries = [];
  const summaryItemBudget = referenceItemCharacterBudget(pending.length);
  try {
    for (const [index, attachment] of pending.entries()) {
      attachment.status = "uploading";
      const uploaded = await uploadReferenceImage({
        imageDataUrl: attachment.dataUrl,
        fileName: attachment.name,
        cropSpec: { x: 0, y: 0, width: 1, height: 1 },
      });
      attachment.sourceId = uploaded.source.id;
      attachment.imageUrl = uploaded.source.imageUrl;
      attachment.status = "analyzing";
      updateStatusMessage(operationId, `참고 이미지 ${index + 1}/${pending.length}의 텍스트와 화면 구조를 분석하고 있습니다.`, "in_progress");
      const analyzed = await analyzeReferenceImage({
        sourceId: attachment.sourceId,
        componentIntent: "프로모션 페이지 스크린샷에서 제목, 혜택, 기간, CTA, 섹션 구조, 이미지 역할과 확인이 필요한 조건을 분석",
        allowedSectionRoles: ["hero", "content", "benefit", "steps", "faq", "legal"],
        idempotencyKey: crypto.randomUUID(),
      });
      const proposal = analyzed.run?.proposal || analyzed.run?.proposals?.[0] || null;
      attachment.analysis = proposal;
      attachment.status = "analyzed";
      attachment.dataUrl = "";
      if (proposal) {
        summaries.push(summarizeReferenceProposal({
          imageName: attachment.name,
          viewport: attachment.viewport,
          proposal,
          maxCharacters: summaryItemBudget,
        }));
      }
    }
    updateStatusMessage(operationId, "참고 이미지 분석을 완료했습니다.", "completed");
    return summaries.join("\n");
  } catch (error) {
    updateStatusMessage(operationId, `참고 이미지 분석에 실패했습니다. ${error.message}`, "failed");
    throw error;
  } finally {
    attachmentBusy.value = false;
  }
}

async function ensureDocument() {
  if (store.documentId) return;
  await ensureBuilderSession();
  if (capabilities.value.serviceContractV3) {
    const response = await createPromoRequestV3({
      brief: {
        title: "AI 프로모션 요청",
        purpose: "promotion",
        market: "",
        locale: navigator.language || "ko-KR",
        requestText: store.naturalLanguage,
      },
    });
    store.requestId = response.request.requestId;
    store.documentId = response.request.documentId;
    store.documentRevision = 0;
    return;
  }
  const response = await createBuilderDocument();
  store.documentId = response.document.id;
  store.documentRevision = response.document.currentDocumentRevision;
}

function hydrateChatWorkspace(workspace) {
  if (!workspace?.session) return;
  chatSessionId.value = workspace.session.id;
  if(!overviewDirty.value)requirementsRevision.value = Number(workspace.requirements?.revision || 0);
  wireframeRevision.value = Number(workspace.wireframe?.revision || 0);
  wireframeFingerprint.value = workspace.wireframe?.structureFingerprint || "";
  if (Array.isArray(workspace.messages) && workspace.messages.length) {
    resetAssistantStreams();
    messages.value = normalizeRestoredMessages(workspace.messages);
    restorePendingClarificationsFromMessages();
  }
  if (workspace.requirements?.value && !overviewDirty.value) {
    store.overviewDraft = workspace.requirements.value;
    store.overviewFingerprint = workspace.requirements.fingerprint || store.overviewFingerprint;
  }
  if (workspace.wireframe?.snapshot) {
    wireframeSnapshot.value = workspace.wireframe.snapshot;
    activeResultTab.value = workspace.session.stage === 'completed' ? 'final' : 'wireframe';
  }
  if(workspace.session.stage==='completed' && store.snapshot){
    store.stage='render_ready';activeResultTab.value='final';
    const failed=failedTask.value;
    const recoverableApproval=(workspace.messages||[]).flatMap(message=>message.actions||[]).some(action=>action.id===failed?.action?.id&&action.key==='approve_wireframe'&&['executed','proposed','expired'].includes(action.status));
    if(failed?.kind==='final-design'&&failed.error?.code==='CHAT_ACTION_NOT_ALLOWED'&&recoverableApproval)failed.retryable=true;
    for(const message of messages.value)for(const action of message.actions||[])if(action.status==='proposed'&&['approve_wireframe','revise_wireframe','confirm_requirements','revise_requirements'].includes(action.key))action.status='expired';
  }
}

async function ensureChatWorkspace({restore = false} = {}) {
  if (!capabilities.value.chatWorkspaceV1 || !store.documentId) return null;
  const workspace = chatSessionId.value
    ? await loadChatWorkspace(chatSessionId.value).catch((error) => {
      if (error.status === 404) return null;
      throw error;
    })
    : null;
  const resolved = workspace || await createChatWorkspace(store.documentId, store.requestId);
  if(!workspace)requirementsRevision.value=Number(resolved.requirements?.revision||0);
  if(restore)hydrateChatWorkspace(resolved);
  else chatSessionId.value=resolved.session.id;
  if (resolved.wireframe?.proposalId) {
    const proposal = await loadCompositionProposal(resolved.wireframe.proposalId);
    store.proposal = proposal.proposal;
  }
  return resolved;
}

const criticalInputRows=computed(()=>(Array.isArray(store.overviewDraft?._review?.missingCriticalInputs)?store.overviewDraft._review.missingCriticalInputs:[]).filter(path=>['title','mainOffer','promotionPurpose','promotionPurposeOther','audience','market','ctaLabel'].includes(path)&&(path!=='promotionPurposeOther'||store.overviewDraft.promotionPurpose==='기타')).map(path=>({path})).map(item=>({path:item.path,key:item.path,label:({title:'제목',mainOffer:'핵심 혜택',promotionPurpose:'프로모션 목적',promotionPurposeOther:'구체적인 목적',audience:'대상',market:'운영 지역',ctaLabel:'버튼 문구'})[item.path],value:store.overviewDraft[item.path]||'',rawValue:store.overviewDraft[item.path]||'',inputKind:OVERVIEW_TREE_SELECT_OPTIONS[item.path]?'select':'text',options:OVERVIEW_TREE_SELECT_OPTIONS[item.path]||[]})));
function updateCriticalField(path,value){
 if(!criticalInputRows.value.some(row=>row.path===path))return;
 store.overviewDraft[path]=value;refreshOverviewFingerprint();markOverviewDirty();persistWorkspace();
}
const contentConfirmations=computed(()=>pendingContentConfirmations(store.overviewDraft));
const overviewDirty=ref(false),overviewPersisting=ref(false),overviewSaveMessage=ref(''),overviewBackup=ref(null);
let overviewSaveTimer=null,overviewSavePromise=null,overviewEditSerial=0;
function markOverviewDirty(){
 overviewEditSerial++;overviewDirty.value=true;overviewSaveMessage.value='변경 내용을 저장하고 있습니다.';
 clearTimeout(overviewSaveTimer);overviewSaveTimer=setTimeout(()=>flushOverviewChanges().catch(error=>{overviewSaveMessage.value=error.message;setBuilderError(store,error);}),600);
}
async function flushOverviewChanges(){
 clearTimeout(overviewSaveTimer);
 if(overviewSavePromise){await overviewSavePromise;if(overviewDirty.value)return flushOverviewChanges();return;}
 if(!overviewDirty.value)return;
 overviewPersisting.value=true;
 overviewSavePromise=(async()=>{
  while(overviewDirty.value){
   const serial=overviewEditSerial,value=cloneRequirements();
   if(capabilities.value.chatWorkspaceV1){
    await ensureChatWorkspace();
    const saved=await saveRequirementsRevision({sessionId:chatSessionId.value,documentRevision:store.documentRevision,requirements:value,expectedRequirementsRevision:requirementsRevision.value});
    requirementsRevision.value=Number(saved.requirements.revision);store.overviewFingerprint=saved.requirements.fingerprint;
   }
   if(serial===overviewEditSerial)overviewDirty.value=false;
  }
  overviewSaveMessage.value='요청 요약을 저장했습니다.';persistWorkspace();
 })();
 try{await overviewSavePromise;}catch(error){overviewSaveMessage.value=error.message;persistWorkspace();throw error;}
 finally{overviewSavePromise=null;overviewPersisting.value=false;}
}
async function loadLatestPage(){
 try{
  const latest=await loadBuilderDocument(store.documentId);store.snapshot=latest.snapshot;store.documentRevision=Number(latest.document.currentDocumentRevision);pageGenerationRequest.value=null;clearFailedTask();clearBuilderError(store);
  store.stage=pageStructurePending.value?'review_required':'render_ready';activeResultTab.value=pageStructurePending.value?'wireframe':'final';persistWorkspace();
 }catch(error){setBuilderError(store,error);}
}
async function loadLatestRequirements(){
 requirementsSaving.value=true;
 const previousDirty=overviewDirty.value;
 try{
  overviewBackup.value={documentId:store.documentId,value:cloneRequirements()};
  clearTimeout(overviewSaveTimer);if(overviewSavePromise)await overviewSavePromise.catch(()=>{});
  overviewDirty.value=false;await ensureChatWorkspace({restore:true});
  clearBuilderError(store);clearFailedTask();overviewSaveMessage.value='서버의 최신 요약을 불러왔습니다. 이전 입력은 보관했습니다.';persistWorkspace();
 }catch(error){overviewDirty.value=previousDirty;setBuilderError(store,error);}
 finally{requirementsSaving.value=false;}
}
function restoreOverviewBackup(){
 if(interactionLocked.value)return;
 if(overviewBackup.value?.documentId!==store.documentId)return;
 store.overviewDraft=cloneRequirements(overviewBackup.value.value);overviewBackup.value=null;refreshOverviewFingerprint();markOverviewDirty();persistWorkspace();
}
async function retryOverviewSave(){try{await flushOverviewChanges();clearBuilderError(store);}catch(error){setBuilderError(store,error);}}
function updateConfirmationField(path,key,value){
 const item=contentConfirmations.value.find(item=>item.path===path);
 if(!item?.editableFields.some(field=>field.key===key)||requirementsEditing.value)return;
 const target=requirementValueAt(store.overviewDraft,path);
 if(!target)return;
 target[key]=String(value).slice(0,2000);
 refreshOverviewFingerprint();markOverviewDirty();clearBuilderError(store);persistWorkspace();
}
async function confirmContentItem(path){
 const entry=contentConfirmations.value.find(item=>item.path===path);
 if(!entry?.canConfirm||requirementsEditing.value)return;
 const target=requirementValueAt(store.overviewDraft,path);
 if(!target)return;
 target.confirmationRequired=false;
 refreshOverviewFingerprint();markOverviewDirty();clearBuilderError(store);persistWorkspace();
 try{await flushOverviewChanges();}catch(error){setBuilderError(store,error);}
}

const CLARIFICATION_QUESTION_BY_FIELD = Object.freeze({
  promotionPurpose: "이번 프로모션의 가장 중요한 목적은 할인, 경품, 이벤트 중 무엇인가요?",
  promotionPurposeOther: "프로모션의 구체적인 목적을 한 문장으로 알려주세요.",
  mainOffer: "고객에게 제공할 핵심 혜택은 무엇인가요? 금액이나 조건이 정해졌다면 함께 알려주세요.",
  audience: "주요 대상은 신규 고객, 기존 고객, 일반 고객 중 누구인가요?",
  market: "프로모션을 운영할 국가 또는 지역은 어디인가요?",
});

function clarificationItems(response = {}) {
  const items = [];
  const excludedFields = new Set([
    ...clarificationAnsweredFields.value.filter(field => !response.missingCriticalInputs?.includes(field)),
  ]);
  const add = (field, question) => {
    const normalizedField = String(field || "").trim();
    const normalized = String(question || "").trim();
    if (!normalizedField || excludedFields.has(normalizedField) || !normalized) return;
    if (items.some((item) => item.field === normalizedField || item.question === normalized)) return;
    items.push({ field: normalizedField, question: normalized });
  };
  const missing = new Set(Array.isArray(response.missingCriticalInputs)
    ? response.missingCriticalInputs
    : []);
  ["mainOffer", "promotionPurpose", "promotionPurposeOther", "audience", "market"]
    .filter((field) => missing.has(field))
    .forEach((field) => add(field, CLARIFICATION_QUESTION_BY_FIELD[field]));

  const overview = response.overview || {};
  (overview.additionalInformation || []).forEach((item) => {
    if (items.length >= 3 || item?.confirmationRequired !== true) return;
    const label = String(item.label || "추가 정보").trim();
    const field = `additionalInformation:${label.toLocaleLowerCase()}`;
    if (/기간|일정|날짜|date|period/i.test(label)) {
      add(field, "프로모션 진행 기간은 언제부터 언제까지인가요?");
      return;
    }
    if (isConfirmationPlaceholder(item.value) || !String(item.value || "").trim()) {
      add(field, `${label}에 대해 확정된 내용을 알려주세요.`);
    }
  });
  (overview.notices || []).forEach((item) => {
    if (items.length >= 3 || item?.confirmationRequired !== true) return;
    if (isConfirmationPlaceholder(item.body) || !String(item.body || "").trim()) {
      const title = String(item.title || "필수 안내").trim();
      add(`notices:${title.toLocaleLowerCase()}`, `${title}에 포함할 확정 문구가 있나요?`);
    }
  });
  (overview.legalInformation || []).forEach((item) => {
    if (items.length >= 3 || item?.confirmationRequired !== true) return;
    if (isConfirmationPlaceholder(item.body) || !String(item.body || "").trim()) {
      const title = String(item.title || "필수 안내").trim();
      add(`legalInformation:${title.toLocaleLowerCase()}`, `${title}에 포함할 확정 문구가 있나요?`);
    }
  });
  return items.slice(0, 3);
}

function markClarificationsAsked(items = []) {
  clarificationAskedFields.value = [...new Set([
    ...clarificationAskedFields.value,
    ...items.map((item) => String(item?.field || "").trim()).filter(Boolean),
  ])];
}

function markPendingClarificationsAnswered() {
  if (!pendingClarificationItems.value.length) return;
  clarificationAnsweredFields.value = [...new Set([
    ...clarificationAnsweredFields.value,
    ...pendingClarificationItems.value.map((item) => item.field).filter(field => !field.includes(':') && Boolean(store.overviewDraft?.[field])),
  ])];
  pendingClarificationItems.value = [];
  pendingClarificationQuestions.value = [];
}

function expireRequirementActionMessages() {
  messages.value.forEach((message) => {
    if (!Array.isArray(message.actions)) return;
    message.actions = message.actions.map((action) => (
      ["confirm_requirements", "revise_requirements"].includes(action.key)
        && (!action.status || action.status === "proposed")
        ? { ...action, status: "expired" }
        : action
    ));
  });
}

function clarificationMessage(questions) {
  return [
    "요구사항을 정리했습니다. 아래 내용은 선택 사항이며, 입력하지 않아도 AI가 문구와 구성을 보완해 생성합니다.",
    "",
    ...questions.map((question, index) => `${index + 1}. ${question}`),
    "",
    "추가 정보가 있다면 편하게 알려주세요. 미정인 날짜·금액·조건은 임의로 만들지 않습니다.",
  ].join("\n");
}

function conversationInstruction(input) {
  const followUp = String(input || "").trim();
  const turns = messages.value
    .filter((message) => message.role === "user" && message.type === "user" && String(message.text || "").trim())
    .map((message) => String(message.text).trim())
    .slice(-12);
  if (!turns.length) return followUp;
  if (turns.length === 1) return turns[0];
  return [
    "[최초 프로모션 요청]",
    turns[0],
    "",
    "[사용자의 추가 답변 및 수정 요청]",
    ...turns.slice(1).map((turn, index) => `${index + 1}. ${turn}`),
  ].join("\n");
}

async function analyze(instruction = store.naturalLanguage, recovery = {}) {
  clearBuilderError(store);
  overviewRetry.value = null;
  store.stage = "analyzing_overview";
  const operationId = `overview-${Date.now()}`;
  updateStatusMessage(operationId, "요구사항을 분석하고 있습니다.", "in_progress");
  const startedAt = performance.now();
  recordBuilderEvent({
    eventName: "ai_overview_requested",
    documentId: store.documentId || undefined,
  });
  try {
    const response = await analyzeOverviewWithRetry(instruction, {
      context: {
        locale: navigator.language || "",
        market: "",
        productCatalog: [],
        currentOverview: store.overviewDraft || {},
      },
      onRetry(retry) {
        overviewRetry.value = retry;
        if (retry.executionDisplay) store.executionDisplays.promo_overview_parser = retry.executionDisplay;
        recordBuilderEvent({
          eventName: "ai_overview_retrying",
          documentId: store.documentId || undefined,
          metadata: {
            attempt: retry.attempt,
            maxAttempts: retry.maxAttempts,
            delayMs: retry.delayMs,
            requestId: retry.requestId || undefined,
            providerErrorType: retry.providerErrorType || undefined,
          },
        });
      },
    });
    overviewRetry.value = null;
    if (response.executionDisplay) store.executionDisplays.promo_overview_parser = response.executionDisplay;
    const parsedOverview=JSON.parse(JSON.stringify(response.overview));
    parsedOverview._review={missingCriticalInputs:response.missingCriticalInputs||[]};
    store.overviewDraft = parsedOverview;
    store.inputLocale = response.inputLocale || "";
    store.overviewFingerprint = response.overviewFingerprint;
    store.stage = "reviewing_overview";
    activeResultTab.value = "requirements";
    if (capabilities.value.chatWorkspaceV1) {
      await ensureChatWorkspace();
      const savedRequirements = await saveRequirementsRevision({
        sessionId: chatSessionId.value,
        documentRevision: store.documentRevision,
        requirements: parsedOverview,
        expectedRequirementsRevision:requirementsRevision.value,
        replaceActions:true,
        fingerprint: store.overviewFingerprint,
      });
      requirementsRevision.value = Number(savedRequirements.requirements.revision);
      store.overviewFingerprint=savedRequirements.requirements.fingerprint;
      overviewDirty.value=false;
    }
    updateStatusMessage(operationId, "요구사항 분석을 완료했습니다.", "completed");
    const items = clarificationItems(response);
    const questions = items.map((item) => item.question);
    markClarificationsAsked(items);
    pendingClarificationItems.value = items;
    pendingClarificationQuestions.value = questions;
    if (items.length) {
      await appendPersistedMessage("assistant", clarificationMessage(questions), {
        type: "clarification",
        metadata: { questions, clarificationItems: items },
        actions: [
          { key: "confirm_requirements", label: "AI가 구성하고 미리보기 생성" },
          { key: "revise_requirements", label: "채팅으로 추가 요청" },
        ],
      });
    } else {
      await appendPersistedMessage(
        "assistant",
        "요청 내용을 정리했습니다. 수정할 내용은 채팅으로 편하게 말씀해 주세요. 이대로 진행하면 먼저 페이지 구성 미리보기를 만들어 드립니다.",
        {
          type: "assistant",
          actions: [
            { key: "confirm_requirements", label: "페이지 미리보기 생성" },
            { key: "revise_requirements", label: "채팅으로 추가 요청" },
          ],
        },
      );
    }
    recordBuilderEvent({
      eventName: "ai_overview_reviewed",
      documentId: store.documentId || undefined,
      durationMs: performance.now() - startedAt,
    });
  } catch (error) {
    overviewRetry.value = null;
    updateStatusMessage(operationId, `요구사항 분석에 실패했습니다. ${error.message}`, "failed");
    rememberFailedTask({
      kind: "overview",
      operationId,
      label: "요구사항 분석",
      input: instruction,
      editableInput: recovery.editableInput || "",
    }, error);
    setBuilderError(store, error);
  }
}

async function submitChat() {
  const input = chatInput.value.trim();
  const hasPendingAttachment = attachments.value.some((item) => item.dataUrl && !item.analysis);
  if (chatSubmitting.value || interactionLocked.value || (!input && !hasPendingAttachment)) return;
  clearFailedTask();
  chatSubmitting.value = true;
  chatInput.value = "";
  let messagePersisted = false;
  try {
    await ensureDocument();
    await flushOverviewChanges();
    await ensureChatWorkspace();
    await appendPersistedMessage("user", input || "첨부한 프로모션 이미지를 분석해 주세요.", {
      type: "user",
      attachmentIds: attachments.value.map((item) => item.id),
    });
    messagePersisted = true;
    markPendingClarificationsAnswered();
    expireRequirementActionMessages();
    const referenceSummary = await analyzeAttachments();
    const combined = composeOverviewInstruction(conversationInstruction(input), referenceSummary);
    store.naturalLanguage = combined;
    await analyze(combined, { editableInput: input });
  } catch (error) {
    if (!messagePersisted && input && !chatInput.value) chatInput.value = input;
    if (!failedTask.value) {
      rememberFailedTask({
        kind: "submit",
        label: "채팅 요청",
        input,
        editableInput: input,
        messagePersisted,
      }, error);
    }
    setBuilderError(store, error);
  } finally {
    chatSubmitting.value = false;
  }
}

function cloneRequirements(value = store.overviewDraft) {
  return JSON.parse(JSON.stringify(value || {}));
}

function markChatActionGroupHandled(action, status = "executed") {
  const matches = (candidate) => (
    action.id ? candidate.id === action.id : candidate.key === action.key
  );
  const message = messages.value.find((item) => (
    Array.isArray(item.actions) && item.actions.some(matches)
  ));
  if (!message) return;
  message.actions = message.actions.map((candidate) => ({
    ...candidate,
    status: matches(candidate) ? status : "expired",
  }));
}

function beginRequirementsEdit() {
  requirementsEditBaseline.value = cloneRequirements();
  requirementsEditDraft.value = cloneRequirements();
  requirementsEditing.value = true;
  activeResultTab.value = "requirements";
}

function clearRequirementsEdit() {
  requirementsEditing.value = false;
  requirementsEditDraft.value = null;
  requirementsEditBaseline.value = null;
}

function wireframeContentKey(section, component, line) {
  return `${section.sectionKey || section.key}::${component.componentKey || component.key}::${component.componentIndex || 0}::${line.key}`;
}

function wireframeAlignmentKey(section, component) {
  return `${section.sectionKey || section.key}::${component.componentKey || component.key}::${component.componentIndex || 0}`;
}

function beginWireframeEdit() {
  completeWireframeReveal();
  const content = {};
  const alignment = {};
  wireframeSections.value.forEach((section) => {
    section.components.forEach((component) => {
      alignment[wireframeAlignmentKey(section, component)] = component.horizontalAlignment || "";
      component.contentLines.filter((line) => line.editable !== false).forEach((line) => {
        content[wireframeContentKey(section, component, line)] = line.fullText || line.text || "";
      });
    });
  });
  wireframeEditBaseline.value = { content: { ...content }, alignment: { ...alignment } };
  wireframeEditDraft.value = { content: { ...content }, alignment: { ...alignment } };
  wireframeEditing.value = true;
  activeResultTab.value = "wireframe";
}

function cancelWireframeEdit() {
  wireframeEditing.value = false;
  wireframeEditDraft.value = { content: {}, alignment: {} };
  wireframeEditBaseline.value = { content: {}, alignment: {} };
}

function setWireframeContent(section, component, line, value) {
  const key = wireframeContentKey(section, component, line);
  wireframeEditDraft.value.content = { ...wireframeEditDraft.value.content, [key]: value };
}

function setWireframeAlignment(section, component, value) {
  const key = wireframeAlignmentKey(section, component);
  wireframeEditDraft.value.alignment = { ...wireframeEditDraft.value.alignment, [key]: value };
}

async function saveWireframeEdits() {
  if (!wireframeEditing.value || !wireframeEditDirty.value || !store.proposal?.id) return;
  const edits = [];
  wireframeSections.value.forEach((section) => {
    section.components.forEach((component) => {
      component.contentLines.filter((line) => line.editable !== false).forEach((line) => {
        const key = wireframeContentKey(section, component, line);
        const nextValue = wireframeEditDraft.value.content[key] ?? "";
        if (nextValue !== wireframeEditBaseline.value.content[key]) {
          edits.push({
            type: "update-content",
            sectionKey: section.sectionKey || section.key,
            componentKey: component.componentKey || component.key,
            componentIndex: component.componentIndex || 0,
            fieldKey: line.key,
            valueText: nextValue,
          });
        }
      });
      const alignmentKey = wireframeAlignmentKey(section, component);
      const nextAlignment = wireframeEditDraft.value.alignment[alignmentKey] || "";
      if (nextAlignment && nextAlignment !== wireframeEditBaseline.value.alignment[alignmentKey]) {
        edits.push({
          type: "set-horizontal-alignment",
          sectionKey: section.sectionKey || section.key,
          componentKey: component.componentKey || component.key,
          componentIndex: component.componentIndex || 0,
          viewport: wireframeViewport.value,
          alignment: nextAlignment,
        });
      }
    });
  });
  if (!edits.length) return;
  wireframeSaving.value = true;
  clearBuilderError(store);
  try {
    const response = await updateWireframeDraft({
      sessionId: chatSessionId.value,
      documentId: store.documentId,
      proposalId: store.proposal.id,
      baseDocumentRevision: store.documentRevision,
      wireframeRevision: wireframeRevision.value,
      structureFingerprint: wireframeFingerprint.value,
      edits,
    });
    store.proposal = response.proposal;
    wireframeSnapshot.value = response.proposal.snapshot;
    wireframeRevision.value = Number(response.wireframe.revision || wireframeRevision.value);
    requirementsRevision.value = Number(response.wireframe.requirementsRevision || requirementsRevision.value);
    wireframeFingerprint.value = response.wireframe.structureFingerprint;
    if (response.overview && typeof response.overview === "object") updateOverviewDraft(response.overview);
    cancelWireframeEdit();
    messages.value.forEach((message) => {
      if (!Array.isArray(message.actions)) return;
      message.actions = message.actions.map((action) => (
        ["approve_wireframe", "revise_wireframe"].includes(action.key)
          && (!action.status || action.status === "proposed")
          ? { ...action, status: "expired" }
          : action
      ));
    });
    await appendPersistedMessage("assistant", "페이지 구성의 문구와 배치 수정을 저장했습니다. 다른 내용은 유지되었습니다.", {
      type: "assistant",
      actions: [
        { key: "approve_wireframe", label: "페이지 구성 승인" },
        { key: "revise_wireframe", label: "추가 수정" },
      ],
    });
  } catch (error) {
    setBuilderError(store, error);
  } finally {
    wireframeSaving.value = false;
  }
}

async function executeRequirementsEditAction(action) {
  if (!capabilities.value.chatWorkspaceV1) return null;
  return executeChatAction({
    sessionId: chatSessionId.value,
    actionId: action.id,
    actionKey: action.key,
    idempotencyKey: crypto.randomUUID(),
  });
}

async function completeRequirementsEdit(action) {
  if (!requirementsEditing.value || !requirementsEditDirty.value) return;
  requirementsSaving.value = true;
  clearBuilderError(store);
  try {
    const normalize = window.PromoPromotionOverview?.normalize;
    if (typeof normalize !== "function") {
      throw Object.assign(new Error("프로모션 요구사항 검증 모듈을 불러오지 못했습니다."), {
        code: "OVERVIEW_NORMALIZER_UNAVAILABLE",
      });
    }
    const normalized = normalize(requirementsEditDraft.value || {});
    if(store.overviewDraft?._review)normalized._review=store.overviewDraft._review;
    const fingerprint = window.PromoPromotionOverview?.fingerprint;
    if (typeof fingerprint !== "function") {
      throw Object.assign(new Error("프로모션 요구사항 검증 모듈을 불러오지 못했습니다."), {
        code: "OVERVIEW_FINGERPRINT_UNAVAILABLE",
      });
    }
    const nextFingerprint = fingerprint(normalized);
    if(!capabilities.value.pageSchemaV1)await executeRequirementsEditAction(action);
    if (capabilities.value.chatWorkspaceV1) {
      const savedRequirements = await saveRequirementsRevision({
        sessionId: chatSessionId.value,
        documentRevision: store.documentRevision,
        requirements: normalized,
        expectedRequirementsRevision:requirementsRevision.value,replaceActions:true,
        fingerprint: nextFingerprint,
      });
      requirementsRevision.value = Number(savedRequirements.requirements.revision);
    }
    updateOverviewDraft(normalized);
    markChatActionGroupHandled(action);
    clearRequirementsEdit();
    await appendPersistedMessage("user", action.label, { type: "action" });
    await appendPersistedMessage(
      "assistant",
      "수정한 요청 내용을 저장했습니다. 이대로 페이지 미리보기를 만들거나 추가 내용을 채팅으로 알려주세요.",
      {
        type: "assistant",
        actions: [
          { key: "confirm_requirements", label: "페이지 미리보기 생성" },
          { key: "revise_requirements", label: "추가 수정" },
        ],
      },
    );
  } catch (error) {
    setBuilderError(store, error);
    throw error;
  } finally {
    requirementsSaving.value = false;
  }
}

async function cancelRequirementsEdit(action) {
  if (!requirementsEditing.value) return;
  requirementsSaving.value = true;
  clearBuilderError(store);
  try {
    await executeRequirementsEditAction(action);
    markChatActionGroupHandled(action);
    clearRequirementsEdit();
    activeResultTab.value = "requirements";
    await appendPersistedMessage("user", action.label, { type: "action" });
    await appendPersistedMessage(
      "assistant",
      "요청 내용 수정을 취소했습니다. 기존 내용으로 페이지 미리보기를 만들거나 채팅으로 수정할 수 있습니다.",
      {
        type: "assistant",
        actions: [
          { key: "confirm_requirements", label: "페이지 미리보기 생성" },
          { key: "revise_requirements", label: "다시 수정" },
        ],
      },
    );
  } catch (error) {
    setBuilderError(store, error);
    throw error;
  } finally {
    requirementsSaving.value = false;
  }
}

function isChatActionDisabled(action) {
  if (interactionLocked.value || (action.status && action.status !== "proposed")) return true;
  if (action.key === "complete_requirements_edit") {
    return !requirementsEditing.value || !requirementsEditDirty.value;
  }
  if (action.key === "cancel_requirements_edit") return !requirementsEditing.value;
  return requirementsEditing.value || wireframeEditing.value;
}

function visibleMessageActions(message) {
  if (message?.isStreaming) return [];
  const messageIndex = messages.value.findIndex((candidate) => candidate.id === message?.id);
  const latestUserIndex = messages.value.findLastIndex((candidate) => candidate.role === "user");
  return (message?.actions || []).filter((action) => {
    if (["complete_requirements_edit", "cancel_requirements_edit"].includes(action.key)) return false;
    if (action.status && action.status !== "proposed") return false;
    if (
      ["confirm_requirements", "revise_requirements"].includes(action.key)
      && messageIndex >= 0
      && messageIndex < latestUserIndex
    ) return false;
    return true;
  });
}

function chatActionIdentity(action) {
  return String(action?.id || action?.key || "");
}

function chatActionButtonLabel(action) {
  return pendingChatActionKey.value === chatActionIdentity(action)
    ? `${action.label} 처리 중…`
    : action.label;
}

function appendActionMessage(action) {
  const message = appendMessage("user", action.label, { type: "action" });
  return persistMessage(message);
}

function actionProgressMessage(action) {
  return ({
    confirm_requirements: "페이지 구성 미리보기를 만들고 있습니다.",
    approve_wireframe: "최종 디자인 생성을 준비하고 있습니다.",
    revise_requirements: "요구사항 수정 모드를 준비하고 있습니다.",
    revise_wireframe: "페이지 구성 수정 모드를 준비하고 있습니다.",
    complete_requirements_edit: "수정한 요구사항을 저장하고 있습니다.",
    cancel_requirements_edit: "요구사항 수정을 취소하고 있습니다.",
    open_output: "Web Output을 열고 있습니다.",
  })[action.key] || `${action.label} 요청을 처리하고 있습니다.`;
}

async function handleChatAction(action) {
  if (interactionLocked.value) return;
  clearFailedTask();
  const actionKey = chatActionIdentity(action);
  const operationId = `chat-action-${action.key}-${Date.now()}`;
  pendingChatActionKey.value = actionKey;
  pendingChatActionLabel.value = action.label;
  try {
    if (action.key === "complete_requirements_edit") {
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      await completeRequirementsEdit(action);
      updateStatusMessage(operationId, "수정한 요구사항을 저장했습니다.", "completed");
      return;
    }
    if (action.key === "cancel_requirements_edit") {
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      await cancelRequirementsEdit(action);
      updateStatusMessage(operationId, "요구사항 수정을 취소했습니다.", "completed");
      return;
    }
    if (action.key === "confirm_requirements") {
      await flushOverviewChanges();
      markPendingClarificationsAnswered();
      const messageRequest = appendActionMessage(action);
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      const actionRequest = capabilities.value.chatWorkspaceV1 && !capabilities.value.pageSchemaV1
        ? executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        })
        : Promise.resolve();
      await Promise.all([actionRequest, messageRequest]);
      if(!capabilities.value.pageSchemaV1)markChatActionGroupHandled(action);
      const generated=await prepareWireframe(operationId, action);
      if(generated&&capabilities.value.pageSchemaV1)markChatActionGroupHandled(action);
      return;
    }
    if (action.key === "approve_wireframe") {
      const messageRequest = appendActionMessage(action);
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      await messageRequest;
      await approveWireframe(action, operationId);
      updateStatusMessage(operationId,store.error?'페이지 구성 승인 결과를 확인해 주세요.':'페이지 구성을 승인했습니다. 디자인 미리보기를 표시합니다.',store.error?'failed':'completed');
      return;
    }
    if (action.key === "revise_requirements" || action.key === "revise_wireframe") {
      await appendActionMessage(action);
      markChatActionGroupHandled(action);
      await requestChatRevision();
      updateStatusMessage(operationId,'채팅에서 추가 요청을 기다리고 있습니다.','completed');
      return;
    }
    if (action.key === "open_output") {
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      openOutput();
      if (capabilities.value.chatWorkspaceV1 && action.id) {
        await executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        });
      }
      updateStatusMessage(operationId, "Web Output을 열었습니다.", "completed");
    }
  } catch (error) {
    updateStatusMessage(operationId, `${action.label} 처리에 실패했습니다. ${error.message}`, "failed");
    if (!failedTask.value) {
      rememberFailedTask({
        kind: "chat-action",
        operationId,
        label: action.label,
        action,
      }, error);
    }
    setBuilderError(store, error);
  } finally {
    pendingChatActionKey.value = "";
    pendingChatActionLabel.value = "";
  }
}

async function pollProposal(proposalId) {
  for (let count = 0; count < 120; count += 1) {
    const response = await loadCompositionProposal(proposalId);
    store.proposal = response.proposal;
    if (response.proposal.status === "ready") return response.proposal;
    // `ready` is an internal queue state. Keep the visible stage stable until
    // the caller selects Wireframe review.
    if (["queued", "processing"].includes(response.proposal.status)) {
      store.stage = response.proposal.status;
    }
    if (["failed", "cancelled", "superseded"].includes(response.proposal.status)) {
      throw Object.assign(new Error(response.proposal.errorMessage || "구성 생성에 실패했습니다."), {
        code: response.proposal.errorCode || "COMPOSITION_FAILED",
      });
    }
    await new Promise((resolve) => setTimeout(resolve, response.proposal.pollAfterMs || 1500));
  }
  throw Object.assign(new Error("구성 생성 대기 시간이 초과되었습니다."), { code: "POLL_TIMEOUT" });
}

async function requestChatRevision() {
  requirementsEditing.value=false;
  wireframeEditing.value=false;
  operationOpen.value=false;
  pageSchemaEditorOpen.value=false;
  await appendPersistedMessage('assistant','바꾸고 싶은 내용이나 추가 정보를 아래 채팅에 편하게 알려주세요. 기존 요청과 페이지를 바탕으로 반영하겠습니다.',{type:'assistant'});
  await nextTick();
  chatInputElement.value?.focus();
}
function openVisualEditor() { return requestChatRevision(); }

function builderAssetFailure(readiness) {
  const failed = readiness.failedRequests[0] || {};
  const billingFailures = readiness.failedRequests.filter((request) => (
    String(request.errorCode || "").toUpperCase() === "PROVIDER_BILLING_REQUIRED"
    || /prepayment credits? (?:are )?depleted|credits? (?:are )?depleted/i.test(
      String(request.errorMessage || "")
    )
  ));
  if (billingFailures.length) {
    return Object.assign(new Error(
      `AI 이미지 모델 사용 크레딧이 소진되었거나 결제 설정이 필요합니다. 관리자에게 문의해 주세요. (실패 이미지 ${billingFailures.length}개)`,
    ), {
      code: "PROVIDER_BILLING_REQUIRED",
      details: [],
    });
  }
  return Object.assign(new Error(
    failed.errorMessage || "하나 이상의 AI 이미지 생성에 실패했습니다. 실패한 이미지를 다시 생성해 주세요.",
  ), {
    code: failed.errorCode || "ASSET_GENERATION_FAILED",
    details: readiness.failedRequests.map((request) => ({
      code: request.errorCode || "ASSET_GENERATION_FAILED",
      path: request.assetRequestId || request.pageSectionInstanceId || "assets",
      message: request.errorMessage || "AI 이미지 생성에 실패했습니다.",
    })),
  });
}

async function waitForBuilderAssets({ maxPolls = 200, pollIntervalMs = 2000 } = {}) {
  let readiness = evaluateAssetReadiness(
    store.snapshot?.assets?.requests,
    store.snapshot?.assets?.expected,
  );
  if (readiness.state === "ready") {
    store.stage = "preview_ready";
    return true;
  }
  store.stage = "generating_assets";
  for (let count = 0; count < maxPolls && !assetPollingCancelled; count += 1) {
    if (count > 0 || readiness.state === "waiting") {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
    if (assetPollingCancelled) return false;
    const loaded = await loadBuilderDocument(store.documentId);
    if (!loaded.snapshot) {
      throw Object.assign(new Error("AI 프로모션 자산 상태를 확인하지 못했습니다."), {
        code: "BUILDER_SNAPSHOT_NOT_READY",
      });
    }
    store.documentRevision = Number(
      loaded.document?.currentDocumentRevision || loaded.snapshot.documentRevision || store.documentRevision,
    );
    store.snapshot = loaded.snapshot;
    store.assetJobs = Object.fromEntries((loaded.snapshot.assets?.requests || []).map((request) => [
      request.assetRequestId,
      request,
    ]));
    readiness = evaluateAssetReadiness(
      loaded.snapshot.assets?.requests,
      loaded.snapshot.assets?.expected,
    );
    if (readiness.state === "failed") throw builderAssetFailure(readiness);
    if (readiness.state === "ready") {
      store.stage = "preview_ready";
      return true;
    }
  }
  if (assetPollingCancelled) return false;
  throw Object.assign(new Error("AI 이미지 생성 대기 시간이 초과되었습니다. 다시 확인해 주세요."), {
    code: "ASSET_GENERATION_TIMEOUT",
  });
}

async function retryAssets() {
  if (!store.documentId || !store.documentRevision || assetRetrying.value) return;
  assetRetrying.value = true;
  clearBuilderError(store);
  try {
    const response = await retryBuilderAssets({
      documentId: store.documentId,
      documentRevision: store.documentRevision,
    });
    store.assetJobs = Object.fromEntries((response.assetJobs || []).map((job) => [job.id, job]));
    store.warning = null;
    if (await waitForBuilderAssets()) {
      store.stage = "navigating_preview";
      openVisualEditor();
    }
  } catch (error) {
    setBuilderError(store, error);
  } finally {
    assetRetrying.value = false;
  }
}

function pageRequestPayload(instruction=''){
 if(!instruction&&store.snapshot?.content?.pageSchema)instruction='Apply the latest user request and updated overview to the current page. Infer the requested changes from the conversation. Preserve unrelated structure, IDs, media and actions.';
 const key=JSON.stringify({documentId:store.documentId,overview:store.overviewDraft,requirementsRevision:requirementsRevision.value,instruction,generationRequest:store.naturalLanguage});
 if(pageGenerationRequest.value?.key!==key)pageGenerationRequest.value={key,requestId:crypto.randomUUID(),baseDocumentRevision:store.documentRevision};
 persistWorkspace();
 return {documentId:store.documentId,baseDocumentRevision:pageGenerationRequest.value.baseDocumentRevision,overview:store.overviewDraft,requirementsRevision:requirementsRevision.value,generationRequest:store.naturalLanguage,requestId:pageGenerationRequest.value.requestId,...(instruction?{instruction}:{})};
}
async function prepareWireframe(existingOperationId = "", sourceAction = null) {
  clearBuilderError(store);
  store.warning = null;
  store.stage = "resolving_policy";
  const operationId = existingOperationId || `wireframe-${Date.now()}`;
  updateStatusMessage(operationId, "콘텐츠와 레이아웃을 구성하고 있습니다.", "in_progress");
  try {
    const currentFingerprint = refreshOverviewFingerprint();
    await ensureDocument();
    if(capabilities.value.pageSchemaV1){
      store.stage="processing";
      const saved=await generatePageSchema({...pageRequestPayload(),actionId:sourceAction?.id});
      if(sourceAction)markChatActionGroupHandled(sourceAction);
      pageGenerationRequest.value=null;store.documentRevision=Number(saved.revision);store.snapshot=saved.snapshot;store.stage="review_required";activeResultTab.value="wireframe";transientQualityGate.value=null;
      store.warning=saved.warnings?.length?{code:saved.warnings[0].code||'DESIGN_REVIEW',message:saved.warnings.map(item=>item.message).join(' ')}:null;
      updateStatusMessage(operationId,"페이지 구성 미리보기를 생성했습니다. 구성을 확인하고 승인해 주세요.","completed");
      await appendPersistedMessage("assistant","콘텐츠에 맞춰 페이지 구조를 설계했습니다. 페이지 구성 미리보기를 확인하고 승인하면 디자인 미리보기로 진행합니다.",{type:"assistant"});
      return true;
    }
    const useRegistryComposition = Boolean(capabilities.value.compositionV3);
    if (useRegistryComposition && !activeShell.value?.id) {
      throw Object.assign(new Error(
        "활성 Composition Shell이 없습니다. 관리자에서 기본 Shell을 활성화한 후 다시 시도해 주세요.",
      ), { code: "COMPOSITION_SHELL_REQUIRED" });
    }
    const allowedLocales = activeShell.value?.config?.allowedLocales || [];
    const locale = resolveCompositionLocale(store.inputLocale, allowedLocales, navigator.language);
    const queued = await createCompositionProposal({
      documentId: store.documentId,
      baseDocumentRevision: store.documentRevision,
      overview: store.overviewDraft,
      overviewFingerprint: currentFingerprint,
      selectedOptionalSectionIds: store.selectedOptionalSectionIds,
      confirmedFieldPaths: store.confirmedFieldPaths,
      ...(useRegistryComposition ? {
        mode: "ai-composition",
        contractVersion: 3,
        shellVersionId: activeShell.value.id,
        locale,
        capabilities: [],
        designReferenceId,
        layoutReferenceId,
      } : {}),
      idempotencyKey: crypto.randomUUID(),
    });
    if (queued.executionDisplay) store.executionDisplays.promo_page_composer = queued.executionDisplay;
    recordBuilderEvent({
      eventName: "composition_requested",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
    });
    const proposal = await pollProposal(queued.proposal.id);
    store.proposal = proposal;
    wireframeSnapshot.value = proposal.snapshot || null;
    if (capabilities.value.chatWorkspaceV1) {
      const savedWireframe = await saveWireframeRevision({
        sessionId: chatSessionId.value,
        documentId: store.documentId,
        proposalId: proposal.id,
        baseDocumentRevision: store.documentRevision,
        snapshot: proposal.snapshot,
      });
      wireframeRevision.value = Number(savedWireframe.wireframe.revision);
      wireframeFingerprint.value = savedWireframe.wireframe.structureFingerprint;
    }
    store.stage = "review_required";
    activeResultTab.value = "wireframe";
    await startWireframeReveal();
    updateStatusMessage(operationId, "페이지 구성 미리보기 생성을 완료했습니다.", "completed");
    await appendPersistedMessage("assistant", "페이지의 배치와 실제 문구를 확인할 수 있는 구성 미리보기를 만들었습니다. 오른쪽 결과를 확인해 주세요.", {
      type: "assistant",
      actions: [
        { key: "approve_wireframe", label: "페이지 구성 승인" },
        { key: "revise_wireframe", label: "수정 요청" },
      ],
    });
  } catch (error) {
    updateStatusMessage(operationId, `페이지 구성 미리보기 생성에 실패했습니다. ${error.message}`, "failed");
    rememberFailedTask({
      kind: "wireframe",
      operationId,
      label: "페이지 구성 미리보기 생성",
      action: sourceAction,
    }, error);
    setBuilderError(store, error);
  }
}

async function compose() {
  await prepareWireframe();
}

const reconnectingTokens=ref(false);
const tokenConnectionProblem=computed(()=>[store.error?.code,...(store.error?.details||[]).map(d=>d.code),...(finalQualityGate.value?.diagnostics||[]).map(d=>d.code)].some(code=>/^(LAYOUT_TOKEN|LAYOUT_BREAKPOINT|TOKEN_|OUTPUT_TOKEN|UNREGISTERED_|REGISTERED_TOKEN|STYLE_TOKEN)/.test(code||'')));
async function reconnectRegisteredTokens(){
 if(!store.documentId||!store.snapshot||reconnectingTokens.value)return;
 reconnectingTokens.value=true;clearBuilderError(store);
 try{
  const saved=await saveBuilderDocument({operation:'refresh-token-library',documentId:store.documentId,baseDocumentRevision:store.documentRevision,changeNote:'명시적으로 활성 등록 토큰 라이브러리 다시 연결'});
  store.snapshot=saved.snapshot;store.documentRevision=Number(saved.revision);store.stage=pageStructurePending.value?'review_required':'render_ready';activeResultTab.value=pageStructurePending.value?'wireframe':'final';transientQualityGate.value=null;clearFailedTask();
  await nextTick();if(!pageStructurePending.value)await checkFinalQuality();
 }catch(error){setBuilderError(store,error);}finally{reconnectingTokens.value=false;}
}

function qualityGateMessage(result) {
  const diagnostics=result.diagnostics||[];
  if(diagnostics.some(item=>/^(LAYOUT_TOKEN|LAYOUT_BREAKPOINT|TOKEN_|OUTPUT_TOKEN|UNREGISTERED_|REGISTERED_TOKEN|STYLE_TOKEN)/.test(item.code||'')))return '문서에 연결된 그리드·디자인 토큰을 확인해야 합니다. 활성 등록 토큰을 다시 연결하거나 관리자에서 누락 항목을 등록해 주세요.';
  const desktop = result.results?.desktop || {};
  const mobile = result.results?.mobile || {};
  if (Number(result.blockingCount || 0) > 0) {
    return [
      `Desktop ${Number(desktop.blockingCount || 0)}건`,
      `Mobile ${Number(mobile.blockingCount || 0)}건`,
      "겹침·잘림·빈 섹션·미완성 콘텐츠를 수정해야 합니다.",
    ].join(" · ");
  }
  if (Number(result.warningCount || 0) > 0) {
    return `품질 검사 통과 · 대비 또는 여백 경고 ${Number(result.warningCount || 0)}건`;
  }
  return "Desktop과 Mobile 디자인 품질 검사를 통과했습니다.";
}

function designTokenSetVersionId(snapshot = store.snapshot) {
  return snapshot?.content?.runtimeTheme?.designTokenSetVersionId
    || snapshot?.content?.formTemplate?.designTokenSetVersionId
    || "";
}

async function runFinalQualityGate({ autoRepair = true, force = false } = {}) {
  if (!store.snapshot || !store.documentId || !store.documentRevision || finalQualityChecking.value) return false;
  if (!force && finalQualityPassed.value) return true;
  finalQualityChecking.value = true;
  transientQualityGate.value = {
    contractVersion: 1,
    state: "checking",
    documentRevision: store.documentRevision,
    blockingCount: 0,
    warningCount: 0,
    message: "실제 폰트와 이미지를 반영해 Desktop과 Mobile을 검사합니다.",
  };
  await nextTick();
  let lastResult = null;
  try {
    for (let attempt = 0; attempt <= 2; attempt += 1) {
      const result = await compositionReviewRef.value?.inspectQualityAcrossViewports?.();
      if (!result) {
        throw Object.assign(new Error("디자인 Preview Renderer가 준비되지 않았습니다."), {
          code: "PREVIEW_QUALITY_CHECK_UNAVAILABLE",
        });
      }
      lastResult = result;
      if (Number(result.blockingCount || 0) === 0) {
        const qualityGate = {
          contractVersion: 1,
          state: "passed",
          documentRevision: store.documentRevision,
          checkedAt: new Date().toISOString(),
          blockingCount: 0,
          warningCount: Number(result.warningCount || 0),
          results: result.results,
          message: qualityGateMessage(result),
        };
        const saved = await saveBuilderDocument({
          documentId: store.documentId,
          baseDocumentRevision: store.documentRevision,
          snapshot: { ...store.snapshot, qualityGate },
          designTokenSetVersionId: designTokenSetVersionId(),
          changeNote: attempt > 0
            ? `AI Builder 품질 검사 통과 및 자동 레이아웃 보정 ${attempt}회 적용.`
            : "AI Builder Desktop/Mobile 품질 검사 통과.",
        });
        store.documentRevision = Number(saved.revision);
        store.snapshot = saved.snapshot;
        transientQualityGate.value = null;
        recordBuilderEvent({
          eventName: "builder_quality_gate_passed",
          documentId: store.documentId,
          documentRevision: store.documentRevision,
          metadata: { attempt, warningCount: Number(result.warningCount || 0) },
        });
        return true;
      }
      if (!autoRepair || attempt >= 2) break;
      const repaired = await compositionReviewRef.value?.buildAutoRepairSnapshot?.(store.snapshot, result);
      if (!repaired?.changed) break;
      const repairedSave = await saveBuilderDocument({
        documentId:store.documentId,baseDocumentRevision:store.documentRevision,
        snapshot:{...repaired.snapshot,qualityGate:{state:'pending'}},
        designTokenSetVersionId:designTokenSetVersionId(),changeNote:'자동 품질 보정 저장 후 재검사',
      });
      store.snapshot = repairedSave.snapshot;
      store.documentRevision = Number(repairedSave.revision);
      transientQualityGate.value = {
        ...transientQualityGate.value,
        message: `품질 문제를 자동 보정하고 있습니다. (${attempt + 1}/2)`,
      };
      await nextTick();
    }
    // Keep the latest persisted repair revision; never restore stale content locally.
    transientQualityGate.value = {
      contractVersion: 1,
      state: "failed",
      documentRevision: store.documentRevision,
      blockingCount: Number(lastResult?.blockingCount || 1),
      warningCount: Number(lastResult?.warningCount || 0),
      results: lastResult?.results || {},
      diagnostics: lastResult?.diagnostics || [],
      message: qualityGateMessage(lastResult || { blockingCount: 1, results: {} }),
    };
    recordBuilderEvent({
      eventName: "builder_quality_gate_blocked",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      metadata: { blockingCount: transientQualityGate.value.blockingCount },
    });
    return false;
  } finally {
    automaticQualityKey = `${store.documentId}:${store.documentRevision}`;
    finalQualityChecking.value = false;
  }
}

async function checkFinalQuality() {
  clearBuilderError(store);
  try {
    const passed = await runFinalQualityGate({ autoRepair: true, force: true });
    if (!passed) {
      throw Object.assign(new Error(transientQualityGate.value?.message || "디자인 품질 검사를 통과하지 못했습니다."), {
        code: "PREVIEW_QUALITY_BLOCKED",
        details: transientQualityGate.value?.diagnostics || [],
      });
    }
  } catch (error) {
    setBuilderError(store, error);
  }
}

async function approveDynamicStructure(){
 if(!store.snapshot?.content?.pageSchema||pageSchemaSaving.value)return;
 if(pageSummaryOutdated.value){store.warning={code:'REQUIREMENTS_CHANGED',message:'요청 요약이 변경되었습니다. 최신 내용으로 페이지 구성을 다시 생성해 주세요.'};activeResultTab.value='requirements';return;}
 if(!pageStructurePending.value){store.stage='render_ready';activeResultTab.value='final';return;}
 pageSchemaSaving.value=true;clearBuilderError(store);
 try{
  const saved=await generatePageSchema({operation:'approve-structure',documentId:store.documentId,baseDocumentRevision:store.documentRevision,structureFingerprint:store.snapshot.generationMeta?.structureFingerprint});
  store.documentRevision=Number(saved.revision);store.snapshot=saved.snapshot;store.stage='render_ready';activeResultTab.value='final';transientQualityGate.value=null;
 }catch(error){setBuilderError(store,error);}finally{pageSchemaSaving.value=false;}
}
async function approveWireframe(action = {}, existingOperationId = "") {
  if(pageStructurePending.value)return approveDynamicStructure();
  if (!store.proposal?.id) return;
  const operationId = existingOperationId || `final-${Date.now()}`;
  updateStatusMessage(operationId, "최종 디자인과 이미지를 생성하고 있습니다.", "in_progress");
  try {
    let completedApproval = false;
    if (capabilities.value.chatWorkspaceV1) {
      const confirmed = await confirmWireframeRevision({
        sessionId: chatSessionId.value,
        revision: wireframeRevision.value,
        structureFingerprint: wireframeFingerprint.value,
      });
      wireframeFingerprint.value = confirmed.wireframe.structureFingerprint;
      const approval = await executeChatAction({
        sessionId: chatSessionId.value,
        actionId: action.id,
        actionKey: "approve_wireframe",
        idempotencyKey: crypto.randomUUID(),
      });
      markChatActionGroupHandled(action,approval.resumeOnly?'expired':'executed');
      if(approval.replayed&&approval.stage==='completed')updateStatusMessage(operationId,'저장된 디자인을 불러와 품질 상태를 확인하고 있습니다.','in_progress');
      completedApproval = approval.replayed === true && approval.stage === 'completed';
      if(approval.replayed && !['completed','finalizing'].includes(approval.stage))throw Object.assign(new Error('대화 단계가 변경되었습니다. 최신 대화를 다시 불러와 주세요.'),{code:'CHAT_ACTION_STALE'});
    }
    let applied;
    if(completedApproval){
      const latest = await loadBuilderDocument(store.documentId);
      if(!latest.snapshot)throw Object.assign(new Error('완료된 디자인 문서를 불러오지 못했습니다.'),{code:'FINAL_DESIGN_NOT_READY'});
      store.snapshot=latest.snapshot;store.documentRevision=Number(latest.document.currentDocumentRevision);
      store.stage='generating_assets';
      applied=await waitForBuilderAssets();
      if(applied)store.stage='render_ready';
    }else applied = await applyReadyProposal(store.proposal, { navigate: false });
    if (!applied) throw Object.assign(new Error("최종 디자인 Snapshot을 준비하지 못했습니다."), {
      code: "FINAL_DESIGN_NOT_READY",
    });
    activeResultTab.value = "final";
    transientQualityGate.value = null;
    await nextTick();
    const qualityPassed = await runFinalQualityGate({ autoRepair: true, force: true });
    if (!qualityPassed) {
      throw Object.assign(new Error(transientQualityGate.value?.message || "디자인 품질 검사를 통과하지 못했습니다."), {
        code: "PREVIEW_QUALITY_BLOCKED",
        details: transientQualityGate.value?.diagnostics || [],
      });
    }
    updateStatusMessage(operationId, "디자인 미리보기를 완성했습니다.", "completed");
    await appendPersistedMessage("assistant", "요청 내용을 기준으로 실제 웹페이지 디자인을 완성했습니다. 오른쪽에서 데스크톱과 모바일 화면을 확인하고, 수정할 내용은 채팅으로 말씀해 주세요.", {
      type: "assistant",
      actions: [{ key: "open_output", label: "새 창에서 확인" }],
    });
  } catch (error) {
    updateStatusMessage(operationId, `최종 디자인 생성에 실패했습니다. ${error.message}`, "failed");
    rememberFailedTask({
      kind: "final-design",
      operationId,
      label: "최종 디자인 생성",
      action,
    }, error);
    setBuilderError(store, error);
  }
}

async function applyReadyProposal(proposal = store.proposal, { navigate = true } = {}) {
  if (!proposal?.id || store.stage === "applying") return false;
  if (proposal.validation?.ok !== true || proposal.autoApplicable !== true) {
    setBuilderError(store, Object.assign(new Error(
      "구성 검증 결과가 자동 적용 조건을 충족하지 않았습니다. 다시 생성해 주세요.",
    ), { code: "COMPOSITION_AUTO_APPLY_NOT_ALLOWED" }));
    return false;
  }
  clearBuilderError(store);
  store.stage = "applying";
  const startedAt = performance.now();
  try {
    const applied = await applyCompositionProposal({
      documentId: store.documentId,
      proposalId: proposal.id,
      baseDocumentRevision: store.documentRevision,
      idempotencyKey: crypto.randomUUID(),
      ...(capabilities.value.chatWorkspaceV1 ? {
        chatSessionId: chatSessionId.value,
        confirmedWireframeRevision: wireframeRevision.value,
        structureFingerprint: wireframeFingerprint.value,
      } : {}),
    });
    store.documentRevision = applied.revision;
    store.snapshot = applied.snapshot;
    store.assetJobs = Object.fromEntries((applied.assetJobs || []).map((job) => [job.id, job]));
    const blockingAssetWarning = applied.assetWarning
      || applied.warnings?.find((warning) => warning?.code === "ASSET_ENQUEUE_FAILED")
      || null;
    store.warning = blockingAssetWarning || store.warning || null;
    recordBuilderEvent({
      eventName: "composition_applied",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      durationMs: performance.now() - startedAt,
      metadata: { assetJobCount: Object.keys(store.assetJobs).length },
    });
    if (!blockingAssetWarning && await waitForBuilderAssets()) {
      if (navigate) {
        store.stage = "navigating_preview";
        openVisualEditor();
      } else {
        store.stage = "render_ready";
      }
      return true;
    }
    return false;
  } catch (error) {
    setBuilderError(store, error);
    throw error;
  }
}

async function rollback() {
  if (store.documentRevision < 2) return;
  try {
    const response = await rollbackComposition({
      documentId: store.documentId,
      targetRevision: store.documentRevision - 1,
      baseDocumentRevision: store.documentRevision,
      idempotencyKey: crypto.randomUUID(),
    });
    store.documentRevision = response.revision;
    store.snapshot = response.snapshot;
    store.stage = "render_ready";
    transientQualityGate.value = null;
    activeResultTab.value = "final";
    await nextTick();
    await runFinalQualityGate({ autoRepair: true, force: true });
  } catch (error) {
    setBuilderError(store, error);
  }
}

async function editNaturalLanguage(input) {
  const instruction=typeof input==='string'?input:String(input?.instruction||'');
  store.warning = null;
  if(store.snapshot?.content?.pageSchema && input?.scope==='content'){
    try{await flushOverviewChanges();operationOpen.value=false;await ensureChatWorkspace();await appendPersistedMessage('user',instruction,{type:'user'});const request=conversationInstruction(instruction);store.naturalLanguage=request;await analyze(request,{editableInput:instruction});}catch(error){setBuilderError(store,error);}return;
  }
  try {
    if(store.snapshot?.content?.pageSchema){
      await flushOverviewChanges();
      store.stage="processing";operationOpen.value=false;
      const saved=await generatePageSchema(pageRequestPayload(instruction));
      pageGenerationRequest.value=null;store.documentRevision=Number(saved.revision);store.snapshot=saved.snapshot;transientQualityGate.value=null;store.stage="review_required";activeResultTab.value="wireframe";return;
    }
    const response = await submitCompositionOperation({
      action: "propose",
      documentId: store.documentId,
      baseDocumentRevision: store.documentRevision,
      instruction,
      idempotencyKey: crypto.randomUUID(),
    });
    operationOpen.value = false;
    pendingOperations.value = response;
    recordBuilderEvent({
      eventName: "composition_operation_proposed",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      metadata: { operationCount: response.operations?.length || 0 },
    });
    if (response.autoApplicable && response.operations?.length && store.snapshot?.contractVersion !== 3) {
      await applyOperationProposal();
    }
  } catch (error) {
    rememberFailedTask({kind:"page-layout-edit",label:"페이지 구성 수정",input:instruction},error);
    setBuilderError(store, error);
  }
}

async function applyOperationProposal() {
  if (!pendingOperations.value?.operations?.length || busy.value) return;
  clearBuilderError(store);
  store.stage = "applying";
  try {
    const applied = await submitCompositionOperation({
        action: "apply",
        documentId: store.documentId,
        baseDocumentRevision: store.documentRevision,
        operations: pendingOperations.value.operations,
        summary: pendingOperations.value.summary || "",
        idempotencyKey: crypto.randomUUID(),
      });
    store.documentRevision = applied.revision;
    store.snapshot = applied.snapshot;
    store.assetJobs = Object.fromEntries((applied.assetJobs || []).map((job) => [job.id, job]));
    store.warning = applied.assetWarning || applied.warnings?.[0] || null;
    store.stage = "render_ready";
    transientQualityGate.value = null;
    pendingOperations.value = null;
    operationConflict.value = null;
    recordBuilderEvent({
      eventName: "composition_operation_applied",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      metadata: { operationCount: applied.operations?.length || 0 },
    });
    activeResultTab.value = "final";
    await nextTick();
    const qualityPassed = await runFinalQualityGate({ autoRepair: true, force: true });
    if (!qualityPassed) {
      throw Object.assign(new Error(transientQualityGate.value?.message || "수정된 디자인이 품질 검사를 통과하지 못했습니다."), {
        code: "PREVIEW_QUALITY_BLOCKED",
        details: transientQualityGate.value?.diagnostics || [],
      });
    }
  } catch (error) {
    if (error.code === "DOCUMENT_REVISION_MISMATCH") {
      operationConflict.value = { message: "다른 작업에서 문서가 먼저 변경되었습니다. 최신본을 불러온 후 수정 요청을 다시 확인해 주세요." };
      store.stage = "render_ready";
      return;
    }
    setBuilderError(store, error);
  }
}

async function reloadLatestForOperation() {
  if (!store.documentId) return;
  try {
    const loaded = await loadBuilderDocument(store.documentId);
    if (!loaded.snapshot) throw new Error("최신 Builder 문서를 불러오지 못했습니다.");
    store.documentRevision = Number(loaded.document.currentDocumentRevision || loaded.snapshot.documentRevision || 0);
    store.snapshot = loaded.snapshot;
    store.stage = "render_ready";
    pendingOperations.value = null;
    operationConflict.value = null;
    await requestChatRevision();
  } catch (error) {
    setBuilderError(store, error);
  }
}

function openOutput() {
  if (!finalQualityPassed.value) {
    activeResultTab.value = "final";
    setBuilderError(store, Object.assign(new Error(
      "Desktop과 Mobile 품질 검사를 통과한 뒤 웹 출력을 확인할 수 있습니다.",
    ), { code: "QUALITY_GATE_REQUIRED" }));
    return;
  }
  const url = visualEditorEntry.output(store.documentId, store.documentRevision, window.location.href);
  window.open(url, "_blank", "noopener,noreferrer");
  recordBuilderEvent({
    eventName: "web_output_opened",
    documentId: store.documentId,
    documentRevision: store.documentRevision,
  });
}

function exportDocument() {
  if (!store.documentId || !store.documentRevision) return;
  if (!finalQualityPassed.value) {
    setBuilderError(store, Object.assign(new Error(
      "Desktop과 Mobile 품질 검사를 통과한 뒤 HTML을 다운로드할 수 있습니다.",
    ), { code: "QUALITY_GATE_REQUIRED" }));
    return;
  }
  const url = new URL("/api/promo-builder-export", window.location.origin);
  url.searchParams.set("documentId", store.documentId);
  url.searchParams.set("revision", String(store.documentRevision));
  url.searchParams.set("format", "html");
  url.searchParams.set("download", "1");
  window.open(url, "_blank", "noopener,noreferrer");
  recordBuilderEvent({
    eventName: "builder_document_exported",
    documentId: store.documentId,
    documentRevision: store.documentRevision,
    metadata: { format: "html" },
  });
}

function beginSplitDrag(event) {
  if (window.innerWidth <= 900) return;
  draggingSplit.value = true;
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function moveSplitDrag(event) {
  if (!draggingSplit.value) return;
  const shell = event.currentTarget.parentElement;
  const rect = shell.getBoundingClientRect();
  const percent = ((event.clientX - rect.left) / rect.width) * 100;
  splitPercent.value = Math.min(65, Math.max(28, Number(percent.toFixed(2))));
}

function endSplitDrag() {
  draggingSplit.value = false;
}

function adjustSplit(event) {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const step = event.shiftKey ? 5 : 1;
  splitPercent.value = Math.min(65, Math.max(28, splitPercent.value + (event.key === 'ArrowRight' ? step : -step)));
}

const HIDDEN_OVERVIEW_TREE_FIELDS = new Set([
  "schemaVersion",
  "inputMode",
  "rawNaturalLanguage",
  "sectionKey",
  "itemKey",
  "confirmationRequired",
  "_review",
]);

const OVERVIEW_TREE_LABELS = Object.freeze({
  title: "제목",
  leadText: "리드 문구",
  ctaLabel: "CTA 문구",
  ctaUrl: "CTA URL",
  promotionPurpose: "프로모션 목적",
  promotionPurposeOther: "기타 목적",
  market: "마켓 / 지역",
  audience: "대상 고객",
  campaignTone: "캠페인 톤",
  mainOffer: "핵심 혜택",
  contentSections: "콘텐츠 구성",
  sectionType: "섹션 유형",
  description: "설명",
  presentationHint: "표시 방식",
  items: "콘텐츠 항목",
  eyebrow: "보조 문구",
  badge: "배지",
  value: "값 / 강조 수치",
  imageIntent: "이미지 구성 의도",
  cta: "CTA",
  label: "항목명",
  url: "이동 URL",
  media: "이미지 / 미디어",
  role: "이미지 역할",
  altText: "대체 텍스트",
  mobileImageRequired: "모바일 전용 이미지 필요",
  required: "필수 섹션",
  additionalInformation: "추가 정보",
  notices: "유의사항",
  legalInformation: "법적 고지",
  body: "내용",
});

const OVERVIEW_TREE_SELECT_OPTIONS = Object.freeze({
  promotionPurpose: ["할인쿠폰", "경품", "이벤트", "기타"],
  audience: ["신규", "기존고객", "일반고객"],
  campaignTone: ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"],
  sectionType: ["hero", "benefits", "cards", "steps", "feature", "story", "stats", "faq", "notice", "legal", "footer", "custom"],
  presentationHint: ["hero", "cards", "steps", "split-content", "story", "stats", "list", "legal", "footer"],
});

const OVERVIEW_TREE_MULTILINE_FIELDS = new Set([
  "leadText",
  "mainOffer",
  "description",
  "imageIntent",
  "altText",
  "body",
]);

function overviewTreeLabel(key, value, index = -1) {
  if (index >= 0) {
    if (value?.title) return String(value.title);
    if (value?.label) return String(value.label);
    return `항목 ${index + 1}`;
  }
  return OVERVIEW_TREE_LABELS[key] || key;
}

function overviewTreeDisplay(value) {
  if (typeof value === "boolean") return value ? "예" : "아니오";
  return String(value ?? "");
}

function isConfirmationPlaceholder(value) {
  return /^(?:(?:사용자|상세\s*조건)\s*)?확인(?:이)?\s*필요(?:합니다)?[.!]?$/i
    .test(String(value ?? "").replace(/\s+/g, " ").trim());
}

function overviewTreeInputKind(key, value) {
  if (typeof value === "boolean") return "checkbox";
  if (OVERVIEW_TREE_SELECT_OPTIONS[key]) return "select";
  if (OVERVIEW_TREE_MULTILINE_FIELDS.has(key)) return "textarea";
  if (/url$/i.test(key)) return "url";
  return "text";
}

function requirementPathSegments(path) {
  return String(path || "").split(".").filter(Boolean).map((segment) => (
    /^\d+$/.test(segment) ? Number(segment) : segment
  ));
}

function requirementValueAt(value, path) {
  return requirementPathSegments(path).reduce((current, segment) => current?.[segment], value);
}

function setRequirementValue(path, value) {
  if (!requirementsEditing.value || !requirementsEditDraft.value) return;
  const segments = requirementPathSegments(path);
  const key = segments.pop();
  const target = segments.reduce((current, segment) => current?.[segment], requirementsEditDraft.value);
  if (!target || key === undefined) return;
  target[key] = value;
}

function requirementEntryChanged(entry) {
  if (!requirementsEditing.value || entry.kind === "group") return false;
  return JSON.stringify(requirementValueAt(requirementsEditBaseline.value, entry.path))
    !== JSON.stringify(entry.rawValue);
}

function overviewEntries(
  value = requirementsEditing.value ? requirementsEditDraft.value : store.overviewDraft,
  prefix = "",
  depth = 0,
) {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => {
    if (HIDDEN_OVERVIEW_TREE_FIELDS.has(key)) return [];
    const path = prefix ? `${prefix}.${key}` : key;
    const label = overviewTreeLabel(key, item);
    if (Array.isArray(item)) {
      if (!item.length) return [];
      const children = item.flatMap((child, index) => {
        const childPath = `${path}.${index}`;
        if (child && typeof child === "object") {
          return [
            {
              path: childPath,
              label: overviewTreeLabel(key, child, index),
              value: "",
              depth: depth + 1,
              kind: "group",
              requiresConfirmation: child.confirmationRequired === true,
            },
            ...overviewEntries(child, childPath, depth + 2),
          ];
        }
        const display = overviewTreeDisplay(child);
        return (display || requirementsEditing.value || item === "") ? [{
          path: childPath,
          key: String(index),
          label: `항목 ${index + 1}`,
          value: display,
          rawValue: child,
          inputKind: overviewTreeInputKind(key, child),
          options: OVERVIEW_TREE_SELECT_OPTIONS[key] || [],
          depth: depth + 1,
          kind: "value",
        }] : [];
      });
      return children.length
        ? [{ path, label, value: "", depth, kind: "group" }, ...children]
        : [];
    }
    if (item && typeof item === "object") {
      const children = overviewEntries(item, path, depth + 1);
      return children.length
        ? [{
          path,
          label,
          value: "",
          depth,
          kind: "group",
          requiresConfirmation: item.confirmationRequired === true,
        }, ...children]
        : [];
    }
    const confirmationPlaceholder = value.confirmationRequired === true && isConfirmationPlaceholder(item);
    const display = confirmationPlaceholder ? "미입력" : overviewTreeDisplay(item);
    return (display || requirementsEditing.value || item === "") ? [{
      path,
      key,
      label,
      value: display,
      rawValue: item,
      editValue: confirmationPlaceholder ? "" : item,
      inputKind: overviewTreeInputKind(key, item),
      options: OVERVIEW_TREE_SELECT_OPTIONS[key] || [],
      depth,
      kind: "value",
    }] : [];
  });
}

const REQUIREMENT_USAGE = Object.freeze({
  title: ["대표 제목", "히어로·주요 제목"],
  leadText: ["대표 설명", "히어로·소개 설명"],
  ctaLabel: ["대표 CTA", "주요 행동 버튼"],
  ctaUrl: ["CTA URL", "주요 버튼 이동 주소"],
  mainOffer: ["핵심 혜택", "혜택·강조 영역"],
  promotionPurpose: ["프로모션 목적", "구성·콘텐츠 선택 기준"],
  promotionPurposeOther: ["기타 목적", "구성·콘텐츠 선택 기준"],
  audience: ["대상 고객", "콘텐츠·표현 방향"],
  campaignTone: ["캠페인 톤", "문구·디자인 분위기"],
  market: ["마켓 / 지역", "대상 시장·정책 조건"],
});

const requirementTables = computed(() => {
  const overview = requirementsEditing.value ? requirementsEditDraft.value : store.overviewDraft;
  if (!overview) return [];
  const makeRows = (value, prefix = "") => {
    const entries = overviewEntries(value, prefix);
    const groups = entries.filter(entry => entry.kind === "group");
    return entries.filter(entry => entry.kind !== "group").map(entry => {
      const parents = groups.filter(group => entry.path.startsWith(`${group.path}.`));
      return { ...entry, group: parents.at(-1)?.label || "", groupKey: parents.at(-1)?.path || "section",
        label: entry.path.endsWith('.cta.label') ? '버튼 문구' : entry.label,
        changed: requirementEntryChanged(entry),
        requiresConfirmation: entry.requiresConfirmation || parents.some(group => group.requiresConfirmation) };
    });
  };
  const basicSource = { ...Object.fromEntries(Object.keys(REQUIREMENT_USAGE)
    .filter(key => key !== 'ctaUrl' && (key !== 'promotionPurposeOther' || overview.promotionPurpose === '기타'))
    .map(key => [key, ''])), ...overview };
  const rows = makeRows(basicSource).filter(entry => !entry.path.includes("."))
    .map(entry => ({ ...entry,
      label: REQUIREMENT_USAGE[entry.key]?.[0] || entry.label,
      usage: REQUIREMENT_USAGE[entry.key]?.[1] || "기획 참고 정보",
    }));
  const result = [{ key: "basic", title: "프로모션 기본 정보", rows, showGroup: false }];
  (overview.contentSections || []).forEach((section, index) => {
    result.push({ key: `section-${index}`, title: `콘텐츠 ${index + 1} · ${section.title || '제목 미입력'}`,
      rows: makeRows(section, `contentSections.${index}`), showGroup: true });
  });
  for (const key of ["additionalInformation", "notices", "legalInformation"]) {
    if (overview[key]?.length) result.push({ key, title: OVERVIEW_TREE_LABELS[key],
      rows: makeRows({ [key]: overview[key] }), showGroup: true });
  }
  return result.filter(table => table.rows.length);
});

function readableRequirement(value) {
  if (Array.isArray(value)) {
    return value.map(readableRequirement).filter(Boolean).join(", ");
  }
  if (value && typeof value === "object") {
    return readableRequirement(value.value || value.label || value.title || value.description || "");
  }
  return String(value ?? "").trim();
}

const requirementSummaryItems = computed(() => {
  const overview = store.overviewDraft || {};
  return [
    { key: "purpose", label: "목적", value: readableRequirement(overview.promotionPurposeOther || overview.promotionPurpose) },
    { key: "audience", label: "대상", value: readableRequirement(overview.audience) },
    { key: "offer", label: "핵심 혜택", value: readableRequirement(overview.mainOffer) },
    { key: "tone", label: "분위기", value: readableRequirement(overview.campaignTone) },
  ].filter((item) => item.value);
});

const requirementSectionLabels = computed(() => {
  const sections = Array.isArray(store.overviewDraft?.contentSections)
    ? store.overviewDraft.contentSections
    : [];
  return sections.map((section, index) => (
    readableRequirement(section?.title || section?.label || section?.sectionType) || `콘텐츠 ${index + 1}`
  )).filter(Boolean);
});

watch([
  messages,
  attachments,
  wireframeSnapshot,
  activeResultTab,
  splitPercent,
  wireframeViewport,
  requirementsEditing,
  requirementsEditDraft,
  requirementsEditBaseline,
  pendingClarificationQuestions,
  pendingClarificationItems,
  clarificationAskedFields,
  clarificationAnsweredFields,
  failedTask,
], persistWorkspace, { deep: true });
watch(() => [store.documentId, store.documentRevision, store.stage, store.overviewDraft, store.snapshot], persistWorkspace, { deep: true });
watch(interactionLocked, (locked, wasLocked) => {
  if (!activeChatTurnMessageId.value) return;
  if (locked && !wasLocked) {
    nextTick(() => {
      const container = chatList.value;
      const target = container?.querySelector(`[data-message-id="${activeChatTurnMessageId.value}"]`);
      if (!container || !target) return;
      const top = container.scrollTop
        + target.getBoundingClientRect().top
        - container.getBoundingClientRect().top
        - 12;
      setProgrammaticChatScroll(() => {
        container.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? "auto" : "smooth" });
      });
    });
    return;
  }
  if (locked || !wasLocked) return;
  activeChatTurnMessageId.value = "";
  nextTick(() => {
    const container = chatList.value;
    if (!container || !chatFollowOutput.value) {
      showLatestMessageButton.value = true;
      return;
    }
    const latest = [...messages.value].reverse().find((message) => message.text);
    if (latest) scrollChatMessageIntoView(latest.id, "smooth");
  });
});
// Each saved revision is checked once when its final preview becomes available.
let automaticQualityKey = '';
watch(pageStructurePending,pending=>{if(pending){store.stage='review_required';activeResultTab.value='wireframe';}});
watch(() => [store.documentId,store.documentRevision,store.stage,activeResultTab.value,finalQualityChecking.value], async () => {
  if (failedTask.value || !store.snapshot || Number(store.snapshot.contractVersion)!==3 || store.stage!=='render_ready' || activeResultTab.value!=='final' || finalQualityChecking.value || finalQualityPassed.value) return;
  const key = `${store.documentId}:${store.documentRevision}`;
  if (automaticQualityKey===key) return;
  automaticQualityKey=key;
  await nextTick();
  if (!finalQualityChecking.value) await checkFinalQuality();
}, {flush:'post'});

watch(activeResultTab, (tab) => {
  if (tab !== "wireframe" && wireframeRevealState.value !== "complete") completeWireframeReveal();
});

onMounted(async () => {
  try {
    legacyWorkspace.value = loadLegacyWorkspaceCache();
    const cached = restoreWorkspaceCache();
    appendWelcomeMessage();
    localeUnsubscribe = window.PromoI18n?.subscribe?.(() => {
      localeRevision.value += 1;
    }) || null;
    const executionLookups = Promise.allSettled([
      loadPromptExecutionDisplay("promo_overview_parser"),
      loadPromptExecutionDisplay("promo_page_composer"),
      loadPromptExecutionDisplay("promo_page_schema_planner"),
      loadPromptExecutionDisplay("section_background_image"),
      loadPromptExecutionDisplay("component_image"),
    ]).then((results) => {
      for (const result of results) {
        if (result.status === "fulfilled" && result.value?.type && result.value.executionDisplay) {
          store.executionDisplays[result.value.type] = result.value.executionDisplay;
        }
      }
    });
    const result = await loadBuilderCapabilities();
    capabilities.value = result.capabilities || capabilities.value;
    if (capabilities.value.compositionV3 && !capabilities.value.pageSchemaV1) {
      const shells = await loadCompositionShells();
      activeShell.value = shells.versions?.find((shell) => shell.config?.isDefault) || shells.versions?.[0] || null;
      if (!activeShell.value?.id) {
        throw Object.assign(new Error(
          "AI 고품질 생성에 필요한 Composition Shell이 없습니다. 관리자에서 기본 Shell을 활성화해 주세요.",
        ), { code: "COMPOSITION_SHELL_REQUIRED" });
      }
    }
    if (selectedMode.value === "ai" && !capabilities.value.aiMode) {
      selectedMode.value = "";
      return;
    }
    if (selectedMode.value === "ai") {
      if (cached?.documentId) {
        try {
          const loaded = await loadBuilderDocument(cached.documentId);
          store.documentRevision = Number(loaded.document?.currentDocumentRevision || cached.documentRevision || 0);
          store.snapshot = loaded.snapshot || null;
          if (cached.stage === "failed" && failedTask.value) store.stage = "failed";
          else if (store.snapshot && cached.stage === "render_ready") store.stage = "render_ready";
          else if (wireframeSnapshot.value) store.stage = "review_required";
          else if (store.overviewDraft) store.stage = "reviewing_overview";
          else store.stage = "idle";
        } catch {
          store.documentId = "";
          store.documentRevision = 0;
          await ensureDocument();
        }
      } else {
        await ensureDocument();
      }
      await ensureChatWorkspace({restore:true});
      if(pageStructurePending.value){store.stage="review_required";activeResultTab.value="wireframe";}
      appendWelcomeMessage();
    }
    await executionLookups;
  } catch (error) {
    setBuilderError(store, error);
  }
});

onBeforeUnmount(() => {
  clearTimeout(overviewSaveTimer);
  assetPollingCancelled = true;
  resetAssistantStreams();
  clearWireframeRevealTimers();
  clearTimeout(chatScrollReleaseTimer);
  localeUnsubscribe?.();
  localeUnsubscribe = null;
});
</script>

<template>
  <main class="ai-builder-shell" :class="{ 'ai-builder-shell--processing': fullScreenProgress }">
    <BuilderModeSelector v-if="selectedMode !== 'ai'" :ai-enabled="capabilities.aiMode" @select="selectMode" />
    <template v-else>
      <section
        class="ai-chat-workspace"
        :class="{ 'is-dragging': draggingSplit }"
        :style="{ '--chat-pane': `${splitPercent}%` }"
      >
        <div
          v-if="chatMenuOpen"
          class="ai-chat-history-overlay"
          role="presentation"
          tabindex="-1"
          @click.self="chatMenuOpen = false"
          @keydown.esc="chatMenuOpen = false"
        >
          <aside class="ai-chat-history" role="dialog" aria-modal="true" aria-label="기존 대화 목록">
            <header>
              <div>
                <p class="ai-builder-eyebrow">AI Builder</p>
                <strong>기존 대화</strong>
              </div>
              <button type="button" aria-label="대화 목록 닫기" @click="chatMenuOpen = false"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </header>
            <button
              type="button"
              class="ai-chat-history__new"
              :disabled="interactionLocked || chatSessionSwitching"
              @click="startNewConversation"
            ><i class="fa-solid fa-plus" aria-hidden="true"></i> 새 대화</button>
            <div class="ai-chat-history__list" aria-live="polite">
              <p v-if="chatSessionsLoading" class="ai-chat-history__state">대화 목록을 불러오는 중입니다.</p>
              <p v-else-if="chatSessionsError" class="ai-chat-history__state is-error">{{ chatSessionsError }}</p>
              <p v-else-if="!chatSessions.length" class="ai-chat-history__state">저장된 대화가 없습니다.</p>
              <template v-else>
                <button
                  v-for="session in chatSessions"
                  :key="session.id"
                  type="button"
                  class="ai-chat-history__item"
                  :class="{ 'is-current': session.id === chatSessionId }"
                  :disabled="interactionLocked || chatSessionSwitching"
                  @click="openChatSession(session)"
                >
                  <strong>{{ session.title }}</strong>
                  <span>
                    {{ session.isLocal ? "이전 로컬 대화" : chatStageLabel(session.stage) }}
                    <template v-if="formatChatUpdatedAt(session.updatedAt)"> · {{ formatChatUpdatedAt(session.updatedAt) }}</template>
                  </span>
                  <small v-if="session.preview">{{ session.preview }}</small>
                </button>
              </template>
            </div>
          </aside>
        </div>
        <aside class="ai-chat-pane" aria-label="AI Builder 채팅">
          <header class="ai-chat-header">
            <div class="ai-chat-header__identity">
              <button
                type="button"
                class="ai-chat-menu-button"
                aria-label="기존 대화 목록 열기"
                :aria-expanded="chatMenuOpen"
                @click="toggleChatMenu"
              ><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
              <div>
                <p class="ai-builder-eyebrow">V3 AI Builder</p>
                <strong>프로모션 제작</strong>
              </div>
            </div>
            <span class="ai-chat-status" :data-state="currentStatus.state">{{ currentStatus.state }}</span>
          </header>

          <div class="ai-chat-message-region">
            <div
              ref="chatList"
              class="ai-chat-messages"
              :class="{
                'has-active-turn': Boolean(activeChatTurnMessageId) && interactionLocked && !hasStreamingMessage,
              }"
              aria-live="polite"
              :aria-busy="interactionLocked ? 'true' : 'false'"
              @scroll.passive="handleChatScroll"
              @wheel.passive="pauseChatFollow"
              @touchmove.passive="pauseChatFollow"
            >
              <article
                v-for="message in visibleMessages"
                :key="message.id"
                class="ai-chat-message"
                :class="[
                  `is-${message.role}`,
                  `is-${message.type || 'text'}`,
                  { 'is-turn-anchor': message.id === activeChatTurnMessageId, 'is-streaming': message.isStreaming },
                ]"
                :data-message-id="message.id"
                :role="message.type === 'status' ? 'status' : undefined"
                :aria-busy="message.status === 'in_progress' || message.isStreaming ? 'true' : undefined"
              >
                <div class="ai-chat-message__meta">
                  <strong>{{ message.role === 'user' ? '나' : message.role === 'system' ? '진행 상태' : 'AI Builder' }}</strong>
                  <span v-if="message.status" class="ai-chat-message__status" :data-status="message.status">
                    <span v-if="message.status === 'in_progress'" class="ai-chat-thinking" aria-hidden="true">
                      <i></i><i></i><i></i>
                    </span>
                    {{ message.status === 'in_progress' ? '진행 중' : message.status === 'completed' ? '완료' : '실패' }}
                  </span>
                </div>
                <p v-if="message.isStreaming" class="ai-chat-streaming-copy" :aria-label="message.text">
                  <span class="ai-chat-stream-lines" aria-hidden="true">
                    <span
                      v-for="(segment, segmentIndex) in message.displaySegments || []"
                      :key="`${message.id}:line:${segmentIndex}`"
                      class="ai-chat-stream-line"
                      :class="{ 'is-blank': !segment }"
                    >
                      <template v-if="segment">{{ segment }}</template>
                      <span v-else>&nbsp;</span>
                      <span v-if="segmentIndex === message.displaySegments.length - 1" class="ai-chat-stream-caret" aria-hidden="true"></span>
                    </span>
                  </span>
                </p>
                <p v-else>{{ messageDisplayText(message) }}</p>
                <div v-if="isFailedTaskMessage(message)" class="ai-chat-recovery" role="group" aria-label="실패한 작업 복구">
                  <p>입력한 내용과 이전 결과는 그대로 보존되어 있습니다.</p>
                  <div>
                    <button
                      v-if="failedTaskCanRetry"
                      type="button"
                      :disabled="failedTaskRetrying"
                      @click="retryFailedTask"
                    >{{ failedTaskRetrying ? "다시 시도 중…" : "실패한 단계부터 다시 시도" }}</button>
                    <button type="button" :disabled="failedTaskRetrying" @click="editFailedTask">내용 수정 후 다시 시도</button>
                  </div>
                </div>
                <div v-if="visibleMessageActions(message).length" class="ai-chat-actions">
                  <button
                    v-for="action in visibleMessageActions(message)"
                    :key="action.key"
                    type="button"
                    :disabled="isChatActionDisabled(action)"
                    @click="handleChatAction(action)"
                  >{{ chatActionButtonLabel(action) }}</button>
                </div>
              </article>
      <div v-if="store.error" class="ai-builder-error" role="alert" aria-live="assertive">
        <strong>{{ store.error.code }}</strong>
        <span>{{ store.error.message }}</span>
        <small v-if="store.error.requestId">요청 ID: {{ store.error.requestId }}</small>
        <details v-if="store.error.details?.length" class="ai-builder-error__details" :open="store.error.details.length <= 5">
          <summary>확인 필요 항목 {{store.error.details.length}}개</summary>
          <ul><li v-for="detail in store.error.details" :key="`${detail.code}:${detail.path}`"><code>{{detail.path}}</code> · {{detail.message||detail.code}}</li></ul>
        </details>
        <button
          v-if="retryableAssetError"
          type="button"
          :disabled="assetRetrying"
          @click="retryAssets"
        >{{ assetRetrying ? "이미지 생성 재시도 중…" : "이미지 생성 다시 시도" }}</button>
        <div class="ai-builder-error__actions">
          <button v-if="tokenConnectionProblem && store.snapshot" type="button" :disabled="reconnectingTokens" @click="reconnectRegisteredTokens">{{reconnectingTokens?'토큰 확인 중…':'활성 등록 토큰 다시 연결'}}</button>
          <button
            v-if="failedTaskCanRetry && !retryableAssetError"
            type="button"
            :disabled="failedTaskRetrying"
            @click="retryFailedTask"
          >{{ failedTaskRetrying ? "다시 시도 중…" : "다시 시도" }}</button>
          <button
            v-if="failedTask && !retryableAssetError"
            type="button"
            :disabled="failedTaskRetrying"
            @click="editFailedTask"
          >내용 수정 후 다시 시도</button>
          <button type="button" @click="clearBuilderError(store)">닫기</button>
        </div>
      </div>
      <button v-if="['DOCUMENT_REVISION_MISMATCH','GENERATION_RESULT_SUPERSEDED','GENERATION_LEASE_CHANGED'].includes(store.error?.code)" type="button" @click="loadLatestPage">최신 페이지 불러오기</button>
      <button v-if="store.error?.code?.startsWith('REQUIREMENTS_')" type="button" :disabled="overviewPersisting" @click="loadLatestRequirements">서버 최신 요약으로 복구</button>
      <button v-if="overviewBackup?.documentId===store.documentId" type="button" :disabled="overviewPersisting || interactionLocked" @click="restoreOverviewBackup">보관한 입력으로 다시 수정</button>
      <div v-if="pageGenerationRequest && !busy" role="status" class="ai-builder-warning"><span>진행한 페이지 생성 요청이 있습니다.</span><button type="button" @click="compose">생성 상태 다시 확인</button></div>
      <div v-if="overviewDirty || overviewPersisting || overviewSaveMessage" role="status" class="ai-builder-warning"><span>{{overviewSaveMessage}}</span><button v-if="overviewDirty && !overviewPersisting" type="button" @click="retryOverviewSave">요청 요약 저장 재시도</button></div>
      <div v-if="store.warning" class="ai-builder-warning" role="status">
        <strong>{{ store.warning.code }}</strong>
        <span>{{ store.warning.message }}</span>
        <button
          v-if="store.snapshot && /ASSET|IMAGE/.test(store.warning.code||'')"
          type="button"
          :disabled="assetRetrying"
          @click="retryAssets"
        >{{ assetRetrying ? "이미지 생성 재시도 중…" : "이미지 생성 다시 시도" }}</button>
        <button type="button" @click="store.warning = null">닫기</button>
      </div>
      <div v-if="operationConflict" class="ai-builder-warning" role="alert">
        <strong>DOCUMENT_REVISION_MISMATCH</strong>
        <span>{{ operationConflict.message }}</span>
        <button type="button" @click="reloadLatestForOperation">최신본 불러오기</button>
        <button type="button" @click="operationConflict = null; pendingOperations = null">취소</button>
      </div>
          <div id="ai-chat-design-actions"></div>
          <button v-if="activeResultTab==='final' && tokenConnectionProblem" type="button" :disabled="reconnectingTokens" @click="reconnectRegisteredTokens">{{reconnectingTokens?'토큰 확인 중…':'활성 등록 토큰 다시 연결'}}</button>
          <section v-if="store.snapshot?.content?.pageSchema && activeResultTab!=='final'" class="ai-chat-actions" aria-label="채팅 페이지 작업">
            <button v-if="pageStructurePending" type="button" :disabled="interactionLocked||pageSchemaSaving" @click="handleChatAction({key:'approve_wireframe',label:'페이지 구성 승인'})">페이지 구성 승인</button>
            <button type="button" :disabled="interactionLocked||pageSchemaSaving" @click="requestChatRevision">구성 수정 요청</button>
          </section>
            </div>
            <button
              v-if="showLatestMessageButton"
              type="button"
              class="ai-chat-latest-button"
              @click="jumpToLatestMessage"
            ><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> 최신 메시지</button>
          </div>

          <div v-if="attachments.length" class="ai-reference-tray" aria-label="첨부 이미지">
            <article v-for="(attachment, index) in attachments" :key="attachment.id" class="ai-reference-card">
              <img v-if="attachment.dataUrl || attachment.imageUrl" :src="attachment.dataUrl || attachment.imageUrl" :alt="`${attachment.name} 미리보기`" />
              <div>
                <strong>{{ index + 1 }}. {{ attachment.name }}</strong>
                <small>{{ attachment.viewport === 'mobile' ? 'Mobile' : 'Desktop' }} · {{ attachment.status === 'analyzed' ? '분석 완료' : attachment.status === 'analyzing' ? '분석 중' : '첨부됨' }}</small>
              </div>
              <button type="button" :disabled="interactionLocked" :aria-label="`${attachment.name} 삭제`" @click="removeAttachment(attachment)"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </article>
          </div>


          <form class="ai-chat-composer" @submit.prevent="submitChat">
            <div class="ai-chat-composer__surface">
              <textarea
                ref="chatInputElement"
                v-model="chatInput"
                rows="1"
                maxlength="4000"
                placeholder="무엇을 만들고 싶으신가요?"
                :disabled="chatComposerLocked"
                @paste="onPaste"
                @keydown.enter.exact.prevent="submitChat"
              ></textarea>
              <div class="ai-chat-composer__actions">
                <input
                  ref="fileInput"
                  class="visually-hidden"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  @change="addImageFiles($event.target.files); $event.target.value = ''"
                />
                <button type="button" class="ai-chat-attach-button" aria-label="이미지 첨부" :disabled="chatComposerLocked" @click="fileInput?.click()"><i class="fa-solid fa-plus" aria-hidden="true"></i><span>이미지</span></button>
                <button type="submit" class="ai-chat-send-button" aria-label="전송" :disabled="chatComposerLocked || (!chatInput.trim() && !attachments.some((item) => item.dataUrl && !item.analysis))">
                  <i :class="interactionLocked ? 'fa-solid fa-ellipsis' : 'fa-solid fa-arrow-up'" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <small>한두 문장으로 시작해도 됩니다 · Enter로 전송 · Shift+Enter로 줄바꿈</small>
          </form>
        </aside>

        <div
          class="ai-split-handle"
          role="separator"
          tabindex="0"
          aria-label="채팅과 결과 영역 너비 조절"
          aria-orientation="vertical"
          :aria-valuenow="Math.round(splitPercent)"
          aria-valuemin="28"
          aria-valuemax="65"
          @pointerdown="beginSplitDrag"
          @pointermove="moveSplitDrag"
          @pointerup="endSplitDrag"
          @pointercancel="endSplitDrag"
          @keydown="adjustSplit"
        ></div>

        <section class="ai-result-pane" aria-label="AI Builder 결과">
          <header class="ai-result-progress">
            <ol class="ai-process-steps" aria-label="제작 단계">
              <li :class="{ selected: activeResultTab === 'requirements', complete: store.overviewDraft }">
                <button type="button" aria-label="요청 요약" :aria-current="activeResultTab === 'requirements' ? 'step' : undefined" @click="activeResultTab = 'requirements'">
                  <span>1</span>요청 요약
                </button>
              </li>
              <li :class="{ selected: activeResultTab === 'wireframe', complete: wireframeDisplaySnapshot || store.snapshot?.content?.pageSchema }">
                <button type="button" aria-label="페이지 구성 미리보기" :disabled="!wireframeDisplaySnapshot && !store.snapshot?.content?.pageSchema" :aria-current="activeResultTab === 'wireframe' ? 'step' : undefined" @click="activeResultTab = 'wireframe'">
                  <span>2</span>페이지 미리보기
                </button>
              </li>
              <li :class="{ selected: activeResultTab === 'final', complete: store.snapshot && store.stage === 'render_ready' }">
                <button type="button" aria-label="디자인 미리보기" :disabled="!store.snapshot || pageStructurePending" :aria-current="activeResultTab === 'final' ? 'step' : undefined" @click="activeResultTab = 'final'">
                  <span>3</span>디자인 미리보기
                </button>
              </li>
            </ol>
            <div class="ai-process-status" role="status" aria-live="polite">
              <small>{{ currentStatus.label }}</small>
              <span class="ai-chat-status" :data-state="currentStatus.state">{{ currentStatus.state }}</span>
            </div>
          </header>

          <div class="ai-result-content">
            <aside v-if="pageSummaryOutdated" role="status"><strong>요청 요약이 변경되었습니다.</strong><p>현재 미리보기는 이전 요약의 결과입니다. 최신 내용으로 다시 생성해 주세요.</p><span>왼쪽 채팅에서 페이지 구성을 다시 생성해 주세요.</span></aside>
            <aside v-if="activeResultTab !== 'requirements' && store.snapshot?.generationMeta?.designReview?.designWarnings?.length" aria-label="디자인 검토 안내">
              <strong>디자인 검토 안내</strong><ul><li v-for="warning in store.snapshot.generationMeta.designReview.designWarnings" :key="warning.code">{{warning.message}}</li></ul>
            </aside>
            <section v-if="activeResultTab === 'requirements'" class="ai-requirements-tree">
              <template v-if="store.overviewDraft">
                <div class="ai-requirement-summary">
                  <div class="ai-requirement-summary__title">
                    <span>프로모션</span>
                    <strong>{{ store.overviewDraft.title || store.overviewDraft.leadText || '새 프로모션' }}</strong>
                    <p v-if="store.overviewDraft.leadText && store.overviewDraft.leadText !== store.overviewDraft.title">{{ store.overviewDraft.leadText }}</p>
                  </div>
                  <dl v-if="requirementSummaryItems.length" class="ai-requirement-summary__facts">
                    <div v-for="item in requirementSummaryItems" :key="item.key">
                      <dt>{{ item.label }}</dt>
                      <dd>{{ item.value }}</dd>
                    </div>
                  </dl>
                  <div v-if="requirementSectionLabels.length" class="ai-requirement-summary__sections">
                    <strong>예정 콘텐츠</strong>
                    <div>
                      <span v-for="(label, index) in requirementSectionLabels" :key="`${label}:${index}`">{{ index + 1 }}. {{ label }}</span>
                    </div>
                  </div>
                  <p class="ai-requirement-summary__hint">
                    내용이 맞으면 왼쪽 채팅의 <strong>페이지 미리보기 생성</strong>을 눌러주세요. 바꾸고 싶은 부분은 “혜택을 3개로 줄여줘”처럼 입력하면 됩니다.
                  </p>
                </div>
                <details class="ai-requirements-details" :open="requirementsEditing">
                  <summary>{{ requirementsEditing ? '세부 내용 편집 중' : '세부 내용 보기' }}</summary>
                  <RequirementTable
                    v-for="table in requirementTables" :key="table.key"
                    :title="table.title" :rows="table.rows" :editing="false"
                    :show-usage="table.key === 'basic'" :show-group="table.showGroup"
                    @change="setRequirementValue"
                  />
                </details>
              </template>
              <div v-else class="ai-result-empty">채팅으로 요구사항을 입력하면 분석 결과가 여기에 표시됩니다.</div>
            </section>

            <section v-else-if="activeResultTab === 'wireframe' && store.snapshot?.content?.pageSchema" class="ai-wireframe-review">
              <header class="ai-page-preview-header">
                <strong>페이지 구성 미리보기</strong>
                <div role="group" aria-label="구성 미리보기 화면 크기">
                  <button v-for="view in ['desktop','tablet','mobile']" :key="view" type="button" :aria-pressed="wireframeViewport===view" @click="wireframeViewport=view">{{{desktop:'데스크톱',tablet:'태블릿',mobile:'모바일'}[view]}}</button>
                </div>
              </header>
              <p>섹션 순서·배치·문구를 확인해 주세요. 수정 요청과 승인은 왼쪽 채팅에서 진행합니다.</p>
              <PageSchemaWireframe :page="store.snapshot.content.pageSchema" :context="store.snapshot.content.pageContext" :viewport="wireframeViewport" />
            </section>
            <section v-else-if="activeResultTab === 'wireframe' && wireframeDisplaySnapshot" class="ai-wireframe-review">
              <header class="ai-page-preview-header">
                <div>
                  <strong>페이지 구성 미리보기</strong>
                  <small>{{ wireframeSections.length }}개 섹션 · {{ wireframeComponentCount }}개 콘텐츠 영역</small>
                </div>
                <div class="ai-page-preview-actions">
                  <div class="ai-page-preview-viewport" role="group" aria-label="미리보기 화면 크기">
                    <button
                      type="button"
                      :disabled="wireframeEditing"
                      :aria-pressed="wireframeViewport === 'desktop'"
                      @click="wireframeViewport = 'desktop'"
                    >데스크톱</button>
                    <button
                      type="button"
                      :disabled="wireframeEditing"
                      :aria-pressed="wireframeViewport === 'mobile'"
                      @click="wireframeViewport = 'mobile'"
                    >모바일</button>
                  </div>
                </div>
              </header>
              <p class="ai-page-preview-notice">
                문구와 배치 수정은 왼쪽 채팅에서 요청해 주세요. 색상과 실제 이미지는 디자인 미리보기에서 적용됩니다.
              </p>
              <div
                class="ai-wireframe-stage"
                :data-viewport="wireframeViewport"
                :data-reveal-state="wireframeRevealState"
                :aria-busy="wireframeRevealState !== 'complete'"
              >
                <div class="ai-wireframe-canvas" :class="{ 'is-revealing': wireframeRevealState !== 'complete' }">
                <article
                  v-for="(section, sectionIndex) in wireframeSections"
                  :key="section.key"
                  class="ai-wireframe-section"
                  :class="[
                    `is-${section.kind}`,
                    {
                      'is-reveal-pending': wireframeRevealState !== 'complete' && sectionIndex >= wireframeRevealedCount,
                      'is-reveal-visible': wireframeRevealState === 'complete' || sectionIndex < wireframeRevealedCount,
                    },
                  ]"
                >
                  <header>
                    <div class="ai-wireframe-section-name">
                      <span>{{ String(section.order).padStart(2, "0") }}</span>
                      <strong>{{ section.label }}</strong>
                    </div>
                    <small>{{ section.components.length }}개 콘텐츠 영역</small>
                  </header>
                  <div class="ai-wireframe-components">
                    <div
                      v-for="component in section.components"
                      :key="component.key"
                      class="ai-wireframe-component"
                      :data-align="wireframeEditing
                        ? (wireframeEditDraft.alignment[wireframeAlignmentKey(section, component)] || component.horizontalAlignment || '')
                        : component.horizontalAlignment"
                      :class="{
                        'ai-wireframe-component--image': component.isImage,
                        'ai-wireframe-component--title': component.isTitle,
                        'ai-wireframe-component--action': component.isAction,
                      }"
                    >
                      <header>
                        <div>
                          <strong>{{ component.label }}</strong>
                        </div>
                        <em v-if="component.requiresConfirmation" class="ai-confirmation-badge">확인 필요</em>
                      </header>
                      <div v-if="component.contentLines.length" class="ai-wireframe-copy">
                        <p v-for="line in component.contentLines" :key="line.key">
                          <span v-if="line.label">{{ line.label }}</span>
                          <textarea
                            v-if="wireframeEditing && line.editable !== false"
                            :value="wireframeEditDraft.content[wireframeContentKey(section, component, line)] ?? line.fullText"
                            :aria-label="`${component.label} ${line.label || '내용'} 수정`"
                            rows="2"
                            maxlength="3000"
                            @input="setWireframeContent(section, component, line, $event.target.value)"
                          ></textarea>
                          <strong v-else :title="line.fullText">{{ line.text }}</strong>
                        </p>
                      </div>
                      <div v-else class="ai-wireframe-placeholder">
                        <i :class="component.isImage ? 'fa-solid fa-image' : 'fa-solid fa-ellipsis'" aria-hidden="true"></i>
                        {{ component.isImage
                          ? `${component.label} 자리`
                          : component.requiresConfirmation
                            ? "확정할 내용을 입력해 주세요"
                            : "표시할 내용이 아직 없습니다" }}
                      </div>
                      <div v-if="wireframeEditing" class="ai-wireframe-alignment" role="group" :aria-label="`${component.label} 가로 배치`">
                        <span>가로 배치</span>
                        <button
                          v-for="alignment in ['left', 'center', 'right']"
                          :key="alignment"
                          type="button"
                          :aria-pressed="wireframeEditDraft.alignment[wireframeAlignmentKey(section, component)] === alignment"
                          @click="setWireframeAlignment(section, component, alignment)"
                        >{{ { left: '왼쪽', center: '가운데', right: '오른쪽' }[alignment] }}</button>
                      </div>
                    </div>
                  </div>
                  <details class="ai-wireframe-technical">
                    <summary>기술 정보 보기</summary>
                    <dl>
                      <div><dt>구성 방식</dt><dd>{{ section.layoutLabel }}</dd></div>
                      <div v-for="component in section.components" :key="`technical:${component.key}`">
                        <dt>{{ component.label }}</dt>
                        <dd>{{ component.typeLabel }}</dd>
                      </div>
                    </dl>
                  </details>
                </article>
                </div>
              </div>
            </section>

            <section v-else-if="activeResultTab === 'final' && store.snapshot" class="ai-final-review">
              <CompositionReview
                ref="compositionReviewRef"
                controls-target="#ai-chat-design-actions"
                v-model:viewport="wireframeViewport"
                :snapshot="store.snapshot"
                :document-revision="store.documentRevision"
                :busy="busy || finalQualityChecking"
                :quality-gate="finalQualityGate"
                :export-enabled="Boolean(capabilities.export)"
                @edit-natural-language="requestChatRevision"
                @rollback="rollback"
                @open-editor="openVisualEditor"
                @open-output="openOutput"
                @check-quality="checkFinalQuality"
                @export-document="exportDocument"
              />
            </section>
          </div>
        </section>
      </section>
    </template>
  </main>
</template>
