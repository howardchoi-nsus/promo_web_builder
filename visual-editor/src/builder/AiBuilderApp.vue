<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
import NaturalLanguageEditor from "./NaturalLanguageEditor.vue";
import { createAiBuilderStore, clearBuilderError, setBuilderError } from "./state/ai-builder-store.mjs";
import {
  analyzeOverviewWithRetry,
  applyCompositionProposal,
  createBuilderDocument,
  createPromoRequestV3,
  createCompositionProposal,
  ensureBuilderSession,
  loadCompositionProposal,
  loadBuilderDocument,
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
const attachments = ref([]);
const chatInput = ref("");
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
let assetPollingCancelled = false;
let localeUnsubscribe = null;
const streamTimers = new Map();
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
  chatSubmitting.value || busy.value || attachmentBusy.value || requirementsSaving.value || wireframeSaving.value
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
  if (attachmentBusy.value) return { label: "참고 이미지 분석", state: "진행 중" };
  if (busy.value) return { label: progressMessage.value, state: "진행 중" };
  if (chatSubmitting.value) return { label: "요청을 전송하고 있습니다.", state: "진행 중" };
  if (pendingChatActionKey.value) {
    return { label: `${pendingChatActionLabel.value || "요청"} 처리 중`, state: "진행 중" };
  }
  if (hasStreamingMessage.value) return { label: "답변을 작성하고 있습니다.", state: "진행 중" };
  if (requirementsEditing.value) return { label: "요구사항 수정 중", state: "확인 필요" };
  if (wireframeEditing.value) return { label: "페이지 구성 수정 중", state: "확인 필요" };
  if (store.stage === "failed") return { label: store.error?.message || "처리 실패", state: "실패" };
  if (store.snapshot && store.stage === "render_ready") return { label: "최종 디자인 생성 완료", state: "완료" };
  if (wireframeSnapshot.value) return { label: "페이지 구성 미리보기 준비 완료", state: "확인 필요" };
  if (store.overviewDraft) return { label: "요구사항 분석 완료", state: "확인 필요" };
  return { label: "요구사항을 입력해 주세요", state: "대기" };
});
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
  message.isStreaming = false;
  streamingMessageIds.value = streamingMessageIds.value.filter((id) => id !== message.id);
  if (chatFollowOutput.value) nextTick(() => scrollChatMessageIntoView(message.id));
  else showLatestMessageButton.value = true;
}

function streamAssistantMessage(message) {
  if (message.role !== "assistant" || !["assistant", "clarification"].includes(message.type) || !message.text) return;
  if (prefersReducedMotion()) {
    message.displayText = message.text;
    message.isStreaming = false;
    return;
  }
  const chunks = message.text.match(/\S+\s*/g) || [message.text];
  message.displayText = "";
  message.isStreaming = true;
  streamingMessageIds.value = [...streamingMessageIds.value, message.id];
  let index = 0;
  const chunksPerTick = chunks.length > 24 ? 3 : chunks.length > 12 ? 2 : 1;
  const reveal = () => {
    index = Math.min(chunks.length, index + chunksPerTick);
    message.displayText = chunks.slice(0, index).join("");
    if (chatFollowOutput.value) nextTick(() => scrollChatMessageIntoView(message.id));
    else showLatestMessageButton.value = true;
    if (index >= chunks.length) {
      finishAssistantStream(message);
      return;
    }
    streamTimers.set(message.id, globalThis.setTimeout(reveal, 28));
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
  if (!message || !["user", "assistant"].includes(message.role)) return "";
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
  return [...messages.value].reverse().find((message) => {
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
    const transient = { displayText: current.displayText, isStreaming: current.isStreaming };
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
    const { displayText, isStreaming, ...message } = valueMessage || {};
    if (!message.id || seenIds.has(message.id)) continue;
    seenIds.add(message.id);
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
  const latest = [...messages.value].reverse().find((message) => message.type === "clarification");
  const latestUserIndex = messages.value.findLastIndex((message) => message.role === "user");
  const clarificationIndex = latest ? messages.value.findIndex((message) => message.id === latest.id) : -1;
  pendingClarificationQuestions.value = clarificationIndex > latestUserIndex && Array.isArray(latest?.questions)
    ? latest.questions.slice(0, 3)
    : [];
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
      messages: messages.value.slice(-200).map(({ displayText, isStreaming, ...message }) => message),
      attachments: attachments.value.map(({ dataUrl, ...attachment }) => attachment),
      wireframeSnapshot: wireframeSnapshot.value,
      activeResultTab: activeResultTab.value,
      splitPercent: splitPercent.value,
      requirementsEditing: requirementsEditing.value,
      requirementsEditDraft: requirementsEditing.value ? requirementsEditDraft.value : null,
      requirementsEditBaseline: requirementsEditing.value ? requirementsEditBaseline.value : null,
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
    activeResultTab.value = cached.activeResultTab || (wireframeSnapshot.value ? "wireframe" : "requirements");
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
    store.overviewFingerprint = cached.overviewFingerprint || "";
    pendingClarificationQuestions.value = Array.isArray(cached.pendingClarificationQuestions)
      ? cached.pendingClarificationQuestions.slice(0, 3)
      : [];
    requirementsEditing.value = Boolean(cached.requirementsEditing && cached.requirementsEditDraft);
    requirementsEditDraft.value = requirementsEditing.value ? cached.requirementsEditDraft : null;
    requirementsEditBaseline.value = requirementsEditing.value
      ? (cached.requirementsEditBaseline || cloneRequirements(store.overviewDraft))
      : null;
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
  const executionDisplays = store.executionDisplays;
  resetAssistantStreams();
  Object.assign(store, createAiBuilderState({ executionDisplays }));
  messages.value = [];
  attachments.value = [];
  chatInput.value = "";
  wireframeSnapshot.value = null;
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
  wireframeEditing.value = false;
  wireframeEditDraft.value = { content: {}, alignment: {} };
  wireframeEditBaseline.value = { content: {}, alignment: {} };
  wireframeSaving.value = false;
}

function appendWelcomeMessage() {
  if (messages.value.length) return;
  appendMessage(
    "assistant",
    "한두 문장으로 시작해도 됩니다. 만들고 싶은 프로모션과 알고 있는 혜택만 적어 주세요. 필요한 내용은 제가 한 번에 최대 3개씩 질문하고, 답변을 요구사항으로 정리해 드립니다.\n\n예: 신규 회원에게 1만원 쿠폰과 무료 배송을 제공하는 겨울 이벤트를 만들어줘.",
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

function startNewConversation() {
  if (interactionLocked.value || chatSessionSwitching.value) return;
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
    if (summary.isLocal) {
      const cached = legacyWorkspace.value;
      if (!cached) throw new Error("이전 로컬 대화 정보를 찾지 못했습니다.");
      resetWorkspaceState();
      messages.value = normalizeRestoredMessages(cached.messages);
      attachments.value = Array.isArray(cached.attachments) ? cached.attachments : [];
      wireframeSnapshot.value = cached.wireframeSnapshot || null;
      activeResultTab.value = cached.activeResultTab || (wireframeSnapshot.value ? "wireframe" : "requirements");
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
      if (store.documentId) {
        const loaded = await loadBuilderDocument(store.documentId).catch(() => null);
        if (loaded) {
          store.documentRevision = Number(loaded.document?.currentDocumentRevision || store.documentRevision);
          store.snapshot = loaded.snapshot || null;
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
  requirementsRevision.value = Number(workspace.requirements?.revision || 0);
  wireframeRevision.value = Number(workspace.wireframe?.revision || 0);
  wireframeFingerprint.value = workspace.wireframe?.structureFingerprint || "";
  if (Array.isArray(workspace.messages) && workspace.messages.length) {
    resetAssistantStreams();
    messages.value = normalizeRestoredMessages(workspace.messages);
    restorePendingClarificationsFromMessages();
  }
  if (workspace.requirements?.value) {
    store.overviewDraft = workspace.requirements.value;
    store.overviewFingerprint = workspace.requirements.fingerprint || store.overviewFingerprint;
  }
  if (workspace.wireframe?.snapshot) {
    wireframeSnapshot.value = workspace.wireframe.snapshot;
    activeResultTab.value = "wireframe";
  }
}

async function ensureChatWorkspace() {
  if (!capabilities.value.chatWorkspaceV1 || !store.documentId) return null;
  const workspace = chatSessionId.value
    ? await loadChatWorkspace(chatSessionId.value).catch((error) => {
      if (error.status === 404) return null;
      throw error;
    })
    : null;
  const resolved = workspace || await createChatWorkspace(store.documentId, store.requestId);
  hydrateChatWorkspace(resolved);
  if (resolved.wireframe?.proposalId) {
    const proposal = await loadCompositionProposal(resolved.wireframe.proposalId);
    store.proposal = proposal.proposal;
  }
  return resolved;
}

const CLARIFICATION_QUESTION_BY_FIELD = Object.freeze({
  promotionPurpose: "이번 프로모션의 가장 중요한 목적은 할인, 경품, 이벤트 중 무엇인가요?",
  promotionPurposeOther: "프로모션의 구체적인 목적을 한 문장으로 알려주세요.",
  mainOffer: "고객에게 제공할 핵심 혜택은 무엇인가요? 금액이나 조건이 정해졌다면 함께 알려주세요.",
  audience: "주요 대상은 신규 고객, 기존 고객, 일반 고객 중 누구인가요?",
  market: "프로모션을 운영할 국가 또는 지역은 어디인가요?",
});

function clarificationQuestions(response = {}) {
  const questions = [];
  const add = (question) => {
    const normalized = String(question || "").trim();
    if (normalized && !questions.includes(normalized)) questions.push(normalized);
  };
  const missing = new Set(Array.isArray(response.missingCriticalInputs)
    ? response.missingCriticalInputs
    : []);
  ["mainOffer", "promotionPurpose", "promotionPurposeOther", "audience", "market"]
    .filter((field) => missing.has(field))
    .forEach((field) => add(CLARIFICATION_QUESTION_BY_FIELD[field]));

  const overview = response.overview || {};
  (overview.additionalInformation || []).forEach((item) => {
    if (questions.length >= 3 || item?.confirmationRequired !== true) return;
    const label = String(item.label || "추가 정보").trim();
    if (/기간|일정|날짜|date|period/i.test(label)) {
      add("프로모션 진행 기간은 언제부터 언제까지인가요?");
      return;
    }
    if (isConfirmationPlaceholder(item.value) || !String(item.value || "").trim()) {
      add(`${label}에 대해 확정된 내용을 알려주세요.`);
    }
  });
  [...(overview.notices || []), ...(overview.legalInformation || [])].forEach((item) => {
    if (questions.length >= 3 || item?.confirmationRequired !== true) return;
    if (isConfirmationPlaceholder(item.body) || !String(item.body || "").trim()) {
      add(`${String(item.title || "필수 안내").trim()}에 포함할 확정 문구가 있나요?`);
    }
  });
  return questions.slice(0, 3);
}

function clarificationMessage(questions) {
  return [
    "요구사항을 먼저 정리했습니다. 더 정확한 페이지를 만들기 위해 아래 내용만 알려주세요.",
    "",
    ...questions.map((question, index) => `${index + 1}. ${question}`),
    "",
    "번호를 구분하지 않고 편하게 한 문장으로 답해도 됩니다.",
  ].join("\n");
}

function conversationInstruction(input) {
  const current = String(store.naturalLanguage || "").trim();
  const followUp = String(input || "").trim();
  const continueDraft = Boolean(
    current
    && followUp
    && !wireframeSnapshot.value
    && (pendingClarificationQuestions.value.length || store.overviewDraft),
  );
  if (!continueDraft) return followUp;
  return `[사용자의 추가 답변]\n${followUp}\n\n[기존 프로모션 요청]\n${current}`;
}

async function analyze(instruction = store.naturalLanguage) {
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
    store.overviewDraft = response.overview;
    store.inputLocale = response.inputLocale || "";
    store.overviewFingerprint = response.overviewFingerprint;
    store.stage = "reviewing_overview";
    activeResultTab.value = "requirements";
    if (capabilities.value.chatWorkspaceV1) {
      await ensureChatWorkspace();
      const savedRequirements = await saveRequirementsRevision({
        sessionId: chatSessionId.value,
        documentRevision: store.documentRevision,
        requirements: store.overviewDraft,
        fingerprint: store.overviewFingerprint,
      });
      requirementsRevision.value = Number(savedRequirements.requirements.revision);
    }
    updateStatusMessage(operationId, "요구사항 분석을 완료했습니다.", "completed");
    const questions = clarificationQuestions(response);
    pendingClarificationQuestions.value = questions;
    if (questions.length) {
      await appendPersistedMessage("assistant", clarificationMessage(questions), {
        type: "clarification",
        metadata: { questions },
      });
    } else {
      await appendPersistedMessage(
        "assistant",
        "요구사항을 정리했습니다. 오른쪽 ‘요청 내용’에서 확인할 수 있습니다. 수정할 내용은 채팅으로 편하게 말해 주세요. 이대로 진행하려면 페이지 구성 만들기를 눌러주세요.",
        {
          type: "assistant",
          actions: [
            { key: "confirm_requirements", label: "페이지 구성 만들기" },
            { key: "revise_requirements", label: "직접 수정" },
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
    setBuilderError(store, error);
  }
}

async function submitChat() {
  const input = chatInput.value.trim();
  const hasPendingAttachment = attachments.value.some((item) => item.dataUrl && !item.analysis);
  if (chatSubmitting.value || interactionLocked.value || (!input && !hasPendingAttachment)) return;
  chatSubmitting.value = true;
  chatInput.value = "";
  let messagePersisted = false;
  try {
    await ensureDocument();
    await ensureChatWorkspace();
    await appendPersistedMessage("user", input || "첨부한 프로모션 이미지를 분석해 주세요.", {
      type: "user",
      attachmentIds: attachments.value.map((item) => item.id),
    });
    messagePersisted = true;
    const referenceSummary = await analyzeAttachments();
    const combined = composeOverviewInstruction(conversationInstruction(input), referenceSummary);
    store.naturalLanguage = combined;
    await analyze(combined);
  } catch (error) {
    if (!messagePersisted && input && !chatInput.value) chatInput.value = input;
    setBuilderError(store, error);
  } finally {
    chatSubmitting.value = false;
  }
}

function cloneRequirements(value = store.overviewDraft) {
  return JSON.parse(JSON.stringify(value || {}));
}

function markChatActionGroupHandled(action) {
  const matches = (candidate) => (
    action.id ? candidate.id === action.id : candidate.key === action.key
  );
  const message = messages.value.find((item) => (
    Array.isArray(item.actions) && item.actions.some(matches)
  ));
  if (!message) return;
  message.actions = message.actions.map((candidate) => ({
    ...candidate,
    status: matches(candidate) ? "executed" : "expired",
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
    const fingerprint = window.PromoPromotionOverview?.fingerprint;
    if (typeof fingerprint !== "function") {
      throw Object.assign(new Error("프로모션 요구사항 검증 모듈을 불러오지 못했습니다."), {
        code: "OVERVIEW_FINGERPRINT_UNAVAILABLE",
      });
    }
    const nextFingerprint = fingerprint(normalized);
    await executeRequirementsEditAction(action);
    if (capabilities.value.chatWorkspaceV1) {
      const savedRequirements = await saveRequirementsRevision({
        sessionId: chatSessionId.value,
        documentRevision: store.documentRevision,
        requirements: normalized,
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
      "수정된 요구사항을 저장했습니다. 오른쪽 요구사항 Tree를 확인한 뒤 승인해 주세요.",
      {
        type: "assistant",
        actions: [
          { key: "confirm_requirements", label: "요구사항 승인" },
          { key: "revise_requirements", label: "수정 요청" },
        ],
      },
    );
  } catch (error) {
    setBuilderError(store, error);
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
      "요구사항 수정을 취소했습니다. 기존 요구사항을 확인한 뒤 승인하거나 다시 수정해 주세요.",
      {
        type: "assistant",
        actions: [
          { key: "confirm_requirements", label: "요구사항 승인" },
          { key: "revise_requirements", label: "수정 요청" },
        ],
      },
    );
  } catch (error) {
    setBuilderError(store, error);
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
  return (message?.actions || []).filter((action) => !action.status || action.status === "proposed");
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
    confirm_requirements: "페이지 구성 미리보기를 준비하고 있습니다.",
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
      const messageRequest = appendActionMessage(action);
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      const actionRequest = capabilities.value.chatWorkspaceV1
        ? executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        })
        : Promise.resolve();
      await Promise.all([actionRequest, messageRequest]);
      await prepareWireframe(operationId);
      return;
    }
    if (action.key === "approve_wireframe") {
      const messageRequest = appendActionMessage(action);
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      await messageRequest;
      await approveWireframe(action, operationId);
      return;
    }
    if (action.key === "revise_requirements" || action.key === "revise_wireframe") {
      const messageRequest = appendActionMessage(action);
      updateStatusMessage(operationId, actionProgressMessage(action), "in_progress");
      const actionRequest = capabilities.value.chatWorkspaceV1
        ? executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        })
        : Promise.resolve();
      await Promise.all([actionRequest, messageRequest]);
      if (action.key === "revise_requirements") {
        markChatActionGroupHandled(action);
        beginRequirementsEdit();
        await appendPersistedMessage(
          "assistant",
          "수정이 필요한 항목을 오른쪽 요구사항 Tree에서 수정해 주세요. 수정이 끝나면 ‘수정 완료’를 눌러 주세요.",
          {
            type: "assistant",
            actions: [
              { key: "complete_requirements_edit", label: "수정 완료" },
              { key: "cancel_requirements_edit", label: "수정 취소" },
            ],
          },
        );
        updateStatusMessage(operationId, "요구사항 수정 모드를 열었습니다.", "completed");
        return;
      }
      markChatActionGroupHandled(action);
      beginWireframeEdit();
      await appendPersistedMessage(
        "assistant",
        "오른쪽 페이지 구성 미리보기에서 문구와 가로 배치를 수정한 뒤 ‘수정 저장’을 눌러 주세요.",
        { type: "assistant" },
      );
      updateStatusMessage(operationId, "페이지 구성 수정 모드를 열었습니다.", "completed");
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

function openVisualEditor() {
  window.location.assign(visualEditorEntry.aiDocument(store.documentId, store.documentRevision));
}

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

async function prepareWireframe(existingOperationId = "") {
  clearBuilderError(store);
  store.warning = null;
  store.stage = "resolving_policy";
  const operationId = existingOperationId || `wireframe-${Date.now()}`;
  updateStatusMessage(operationId, "페이지 구성 미리보기를 생성하고 있습니다.", "in_progress");
  try {
    const currentFingerprint = refreshOverviewFingerprint();
    await ensureDocument();
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
    store.proposal = proposal;
    store.stage = "review_required";
    activeResultTab.value = "wireframe";
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
    setBuilderError(store, error);
  }
}

async function compose() {
  await prepareWireframe();
}

async function approveWireframe(action = {}, existingOperationId = "") {
  if (!store.proposal?.id) return;
  const operationId = existingOperationId || `final-${Date.now()}`;
  updateStatusMessage(operationId, "최종 디자인과 이미지를 생성하고 있습니다.", "in_progress");
  try {
    if (capabilities.value.chatWorkspaceV1) {
      const confirmed = await confirmWireframeRevision({
        sessionId: chatSessionId.value,
        revision: wireframeRevision.value,
        structureFingerprint: wireframeFingerprint.value,
      });
      wireframeFingerprint.value = confirmed.wireframe.structureFingerprint;
      await executeChatAction({
        sessionId: chatSessionId.value,
        actionId: action.id,
        actionKey: "approve_wireframe",
        idempotencyKey: crypto.randomUUID(),
      });
    }
    await applyReadyProposal(store.proposal, { navigate: false });
    activeResultTab.value = "final";
    updateStatusMessage(operationId, "최종 디자인 생성을 완료했습니다.", "completed");
    await appendPersistedMessage("assistant", "승인한 페이지 구성을 기준으로 최종 디자인을 완성했습니다.", {
      type: "assistant",
      actions: [{ key: "open_output", label: "Web Output 열기" }],
    });
  } catch (error) {
    updateStatusMessage(operationId, `최종 디자인 생성에 실패했습니다. ${error.message}`, "failed");
    setBuilderError(store, error);
  }
}

async function applyReadyProposal(proposal = store.proposal, { navigate = true } = {}) {
  if (!proposal?.id || store.stage === "applying") return;
  if (proposal.validation?.ok !== true || proposal.autoApplicable !== true) {
    setBuilderError(store, Object.assign(new Error(
      "구성 검증 결과가 자동 적용 조건을 충족하지 않았습니다. 다시 생성해 주세요.",
    ), { code: "COMPOSITION_AUTO_APPLY_NOT_ALLOWED" }));
    return;
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
    }
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
  } catch (error) {
    setBuilderError(store, error);
  }
}

async function editNaturalLanguage(instruction) {
  store.warning = null;
  try {
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
    pendingOperations.value = null;
    operationConflict.value = null;
    recordBuilderEvent({
      eventName: "composition_operation_applied",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      metadata: { operationCount: applied.operations?.length || 0 },
    });
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
    operationOpen.value = true;
  } catch (error) {
    setBuilderError(store, error);
  }
}

function openOutput() {
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
        return (display || requirementsEditing.value) ? [{
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
    return (display || requirementsEditing.value) ? [{
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

const requirementsChangedCount = computed(() => (
  requirementsEditing.value
    ? overviewEntries(requirementsEditDraft.value).filter(requirementEntryChanged).length
    : 0
));

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
    if (capabilities.value.compositionV3) {
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
          if (store.snapshot && cached.stage === "render_ready") store.stage = "render_ready";
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
      await ensureChatWorkspace();
      appendWelcomeMessage();
    }
    await executionLookups;
  } catch (error) {
    setBuilderError(store, error);
  }
});

onBeforeUnmount(() => {
  assetPollingCancelled = true;
  resetAssistantStreams();
  clearTimeout(chatScrollReleaseTimer);
  localeUnsubscribe?.();
  localeUnsubscribe = null;
});
</script>

<template>
  <main class="ai-builder-shell" :class="{ 'ai-builder-shell--processing': fullScreenProgress }">
    <BuilderModeSelector v-if="selectedMode !== 'ai'" :ai-enabled="capabilities.aiMode" @select="selectMode" />
    <template v-else>
      <div v-if="store.error" class="ai-builder-error" role="alert" aria-live="assertive">
        <strong>{{ store.error.code }}</strong>
        <span>{{ store.error.message }}</span>
        <small v-for="detail in store.error.details || []" :key="`${detail.code}:${detail.path}`">
          {{ detail.code }} · {{ detail.path }}{{ detail.message ? ` · ${detail.message}` : "" }}
        </small>
        <button
          v-if="retryableAssetError"
          type="button"
          :disabled="assetRetrying"
          @click="retryAssets"
        >{{ assetRetrying ? "이미지 생성 재시도 중…" : "이미지 생성 다시 시도" }}</button>
        <button type="button" @click="clearBuilderError(store)">닫기</button>
      </div>
      <div v-if="store.warning" class="ai-builder-warning" role="status">
        <strong>{{ store.warning.code }}</strong>
        <span>{{ store.warning.message }}</span>
        <button
          v-if="store.snapshot"
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
              :class="{ 'has-active-turn': Boolean(activeChatTurnMessageId) && interactionLocked }"
              aria-live="polite"
              :aria-busy="interactionLocked ? 'true' : 'false'"
              @scroll.passive="handleChatScroll"
              @wheel.passive="pauseChatFollow"
              @touchmove.passive="pauseChatFollow"
            >
              <article
                v-for="message in messages"
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
                <p>{{ messageDisplayText(message) }}<span v-if="message.isStreaming" class="ai-chat-stream-caret" aria-hidden="true"></span></p>
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
          <header class="ai-result-header">
            <div>
              <strong>진행 상황 및 결과</strong>
              <small>{{ currentStatus.label }}</small>
            </div>
            <span class="ai-chat-status" :data-state="currentStatus.state">{{ currentStatus.state }}</span>
          </header>

          <ol class="ai-process-steps" aria-label="결과 보기">
            <li :class="{ selected: activeResultTab === 'requirements', complete: store.overviewDraft }">
              <button type="button" aria-label="요청 내용" :aria-current="activeResultTab === 'requirements' ? 'page' : undefined" @click="activeResultTab = 'requirements'">
                <span>1</span>요구사항
              </button>
            </li>
            <li :class="{ selected: activeResultTab === 'wireframe', complete: wireframeDisplaySnapshot }">
              <button type="button" aria-label="페이지 구성 미리보기" :disabled="!wireframeDisplaySnapshot" :aria-current="activeResultTab === 'wireframe' ? 'page' : undefined" @click="activeResultTab = 'wireframe'">
                <span>2</span>페이지 구성
              </button>
            </li>
            <li :class="{ selected: activeResultTab === 'final', complete: store.snapshot && store.stage === 'render_ready' }">
              <button type="button" aria-label="최종 디자인" :disabled="!store.snapshot" :aria-current="activeResultTab === 'final' ? 'page' : undefined" @click="activeResultTab = 'final'">
                <span>3</span>최종 디자인
              </button>
            </li>
          </ol>

          <div class="ai-result-content">
            <section v-if="activeResultTab === 'requirements'" class="ai-requirements-tree">
              <header>
                <strong>요청 내용</strong>
                <small v-if="requirementsEditing" class="is-editing">
                  편집 중 · 변경 {{ requirementsChangedCount }}개 · 완료/취소는 왼쪽 채팅에서 진행합니다.
                </small>
                <small v-else>생성 기준으로 내부 저장되며, 실제 문구와 배치는 페이지 구성에서 수정합니다.</small>
              </header>
              <ul v-if="store.overviewDraft" role="tree" :class="{ 'is-editing': requirementsEditing }">
                <li
                  v-for="entry in overviewEntries()"
                  :key="entry.path"
                  role="treeitem"
                  :class="{ 'is-group': entry.kind === 'group', 'is-changed': requirementEntryChanged(entry) }"
                  :style="{ '--tree-depth': entry.depth }"
                >
                  <span class="ai-requirements-tree__label">
                    {{ entry.label }}
                    <em v-if="entry.requiresConfirmation" class="ai-confirmation-badge">확인 필요</em>
                  </span>
                  <template v-if="entry.kind !== 'group'">
                    <strong v-if="!requirementsEditing">{{ entry.value }}</strong>
                    <label v-else-if="entry.inputKind === 'checkbox'" class="ai-requirements-tree__boolean">
                      <input
                        type="checkbox"
                        :checked="entry.rawValue"
                        :aria-label="`${entry.label} 수정`"
                        @change="setRequirementValue(entry.path, $event.target.checked)"
                      />
                      <span>{{ entry.rawValue ? '예' : '아니오' }}</span>
                    </label>
                    <select
                      v-else-if="entry.inputKind === 'select'"
                      :value="entry.editValue ?? entry.rawValue"
                      :aria-label="`${entry.label} 수정`"
                      @change="setRequirementValue(entry.path, $event.target.value)"
                    >
                      <option value="">선택해 주세요</option>
                      <option v-for="option in entry.options" :key="option" :value="option">{{ option }}</option>
                    </select>
                    <textarea
                      v-else-if="entry.inputKind === 'textarea'"
                      :value="entry.editValue ?? entry.rawValue"
                      rows="3"
                      maxlength="2000"
                      :aria-label="`${entry.label} 수정`"
                      @input="setRequirementValue(entry.path, $event.target.value)"
                    ></textarea>
                    <input
                      v-else
                      :type="entry.inputKind"
                      :value="entry.editValue ?? entry.rawValue"
                      :maxlength="entry.key === 'ctaLabel' || (entry.key === 'label' && entry.path.endsWith('.cta.label')) ? 20 : 2000"
                      :aria-label="`${entry.label} 수정`"
                      @input="setRequirementValue(entry.path, $event.target.value)"
                    />
                  </template>
                </li>
              </ul>
              <div v-else class="ai-result-empty">채팅으로 요구사항을 입력하면 분석 결과가 여기에 표시됩니다.</div>
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
                  <template v-if="wireframeEditing">
                    <button type="button" class="ai-wireframe-edit-action is-secondary" :disabled="wireframeSaving" @click="cancelWireframeEdit">취소</button>
                    <button type="button" class="ai-wireframe-edit-action" :disabled="wireframeSaving || !wireframeEditDirty" @click="saveWireframeEdits">
                      {{ wireframeSaving ? '저장 중…' : '수정 저장' }}
                    </button>
                  </template>
                  <button v-else type="button" class="ai-wireframe-edit-action" @click="beginWireframeEdit">내용·배치 수정</button>
                </div>
              </header>
              <p class="ai-page-preview-notice">
                현재 화면에서 문구와 가로 배치를 수정할 수 있습니다. 색상과 실제 이미지는 최종 디자인에서 적용됩니다.
              </p>
              <div class="ai-wireframe-stage" :data-viewport="wireframeViewport">
                <div class="ai-wireframe-canvas">
                <article
                  v-for="section in wireframeSections"
                  :key="section.key"
                  class="ai-wireframe-section"
                  :class="`is-${section.kind}`"
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
                :snapshot="store.snapshot"
                :document-revision="store.documentRevision"
                :busy="busy"
                :export-enabled="Boolean(capabilities.export)"
                @edit-natural-language="operationOpen = true"
                @rollback="rollback"
                @open-editor="openVisualEditor"
                @open-output="openOutput"
                @export-document="exportDocument"
              />
            </section>
          </div>
        </section>
      </section>
      <NaturalLanguageEditor v-if="operationOpen" :busy="busy" @cancel="operationOpen = false" @submit="editNaturalLanguage" />
    </template>
  </main>
</template>
