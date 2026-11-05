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
const pendingOperations = ref(null);
const operationConflict = ref(null);
const overviewRetry = ref(null);
const ACTIVE_CHAT_STORAGE_KEY = "promoAiBuilder.activeChat.v2";
const LEGACY_CHAT_STORAGE_KEY = "promoAiBuilder.chatWorkspace.v1";
const messages = ref([]);
const attachments = ref([]);
const chatInput = ref("");
const attachmentBusy = ref(false);
const wireframeSnapshot = ref(null);
const chatSessionId = ref("");
const requirementsRevision = ref(0);
const wireframeRevision = ref(0);
const wireframeFingerprint = ref("");
const activeResultTab = ref("requirements");
const splitPercent = ref(38);
const draggingSplit = ref(false);
const chatList = ref(null);
const fileInput = ref(null);
const chatMenuOpen = ref(false);
const chatSessions = ref([]);
const chatSessionsLoading = ref(false);
const chatSessionsError = ref("");
const chatSessionSwitching = ref(false);
const legacyWorkspace = ref(null);
let assetPollingCancelled = false;
let localeUnsubscribe = null;
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
const interactionLocked = computed(() => busy.value || attachmentBusy.value);
const currentStatus = computed(() => {
  if (attachmentBusy.value) return { label: "참고 이미지 분석", state: "진행 중" };
  if (busy.value) return { label: progressMessage.value, state: "진행 중" };
  if (store.stage === "failed") return { label: store.error?.message || "처리 실패", state: "실패" };
  if (store.snapshot && store.stage === "render_ready") return { label: "최종 디자인 생성 완료", state: "완료" };
  if (wireframeSnapshot.value) return { label: "B/W Wireframe 생성 완료", state: "확인 필요" };
  if (store.overviewDraft) return { label: "요구사항 분석 완료", state: "확인 필요" };
  return { label: "요구사항을 입력해 주세요", state: "대기" };
});
const wireframeDisplaySnapshot = computed(() => wireframeSnapshot.value || store.proposal?.snapshot || null);
const wireframeSections = computed(() => buildWireframeSections(wireframeDisplaySnapshot.value));
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

function appendMessage(role, text, extra = {}) {
  const message = {
    id: crypto.randomUUID(),
    role,
    text: String(text || ""),
    createdAt: new Date().toISOString(),
    ...extra,
  };
  messages.value.push(message);
  nextTick(() => {
    if (chatList.value) chatList.value.scrollTop = chatList.value.scrollHeight;
  });
  return message;
}

async function persistMessage(message) {
  if (!capabilities.value.chatWorkspaceV1 || !chatSessionId.value) return message;
  const response = await saveChatMessage(chatSessionId.value, message);
  const index = messages.value.findIndex((item) => item.id === message.id);
  if (index >= 0) messages.value[index] = response.message;
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
      stage: store.stage,
      naturalLanguage: store.naturalLanguage,
      inputLocale: store.inputLocale,
      overviewDraft: store.overviewDraft,
      overviewFingerprint: store.overviewFingerprint,
      messages: messages.value.slice(-200),
      attachments: attachments.value.map(({ dataUrl, ...attachment }) => attachment),
      wireframeSnapshot: wireframeSnapshot.value,
      activeResultTab: activeResultTab.value,
      splitPercent: splitPercent.value,
    }));
  } catch {
    // Browser storage is a convenience cache; Builder Document remains canonical.
  }
}

function restoreWorkspaceCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(ACTIVE_CHAT_STORAGE_KEY) || "null");
    if (!cached || typeof cached !== "object") return null;
    messages.value = Array.isArray(cached.messages) ? cached.messages : [];
    attachments.value = Array.isArray(cached.attachments) ? cached.attachments : [];
    wireframeSnapshot.value = cached.wireframeSnapshot || null;
    activeResultTab.value = cached.activeResultTab || (wireframeSnapshot.value ? "wireframe" : "requirements");
    splitPercent.value = Math.min(65, Math.max(28, Number(cached.splitPercent || 38)));
    store.documentId = cached.documentId || "";
    store.documentRevision = Number(cached.documentRevision || 0);
    store.requestId = cached.requestId || "";
    chatSessionId.value = cached.chatSessionId || "";
    requirementsRevision.value = Number(cached.requirementsRevision || 0);
    wireframeRevision.value = Number(cached.wireframeRevision || 0);
    wireframeFingerprint.value = cached.wireframeFingerprint || "";
    store.naturalLanguage = cached.naturalLanguage || "";
    store.inputLocale = cached.inputLocale || "";
    store.overviewDraft = cached.overviewDraft || null;
    store.overviewFingerprint = cached.overviewFingerprint || "";
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
  Object.assign(store, createAiBuilderState({ executionDisplays }));
  messages.value = [];
  attachments.value = [];
  chatInput.value = "";
  wireframeSnapshot.value = null;
  chatSessionId.value = "";
  requirementsRevision.value = 0;
  wireframeRevision.value = 0;
  wireframeFingerprint.value = "";
  activeResultTab.value = "requirements";
  pendingOperations.value = null;
  operationConflict.value = null;
  overviewRetry.value = null;
}

function appendWelcomeMessage() {
  if (messages.value.length) return;
  appendMessage(
    "assistant",
    "만들고 싶은 프로모션을 설명하거나 참고 화면을 붙여넣어 주세요. 이미지와 자연어를 함께 입력할 수 있습니다.",
    { type: "assistant" },
  );
}

function chatStageLabel(stage) {
  return ({
    idle: "작성 대기",
    requirements_review: "요구사항 검토",
    wireframe_review: "Wireframe 검토",
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
      messages.value = Array.isArray(cached.messages) ? cached.messages : [];
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
      store.naturalLanguage = cached.naturalLanguage || "";
      store.inputLocale = cached.inputLocale || "";
      store.overviewDraft = cached.overviewDraft || null;
      store.overviewFingerprint = cached.overviewFingerprint || "";
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
  if (Array.isArray(workspace.messages) && workspace.messages.length) messages.value = workspace.messages;
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
    await appendPersistedMessage(
      "assistant",
      "요구사항을 정리했습니다. 오른쪽 요구사항 Tree에 반영했으며 Wireframe을 자동으로 생성합니다.",
      { type: "assistant" },
    );
    recordBuilderEvent({
      eventName: "ai_overview_reviewed",
      documentId: store.documentId || undefined,
      durationMs: performance.now() - startedAt,
    });
    await prepareWireframe();
  } catch (error) {
    overviewRetry.value = null;
    updateStatusMessage(operationId, `요구사항 분석에 실패했습니다. ${error.message}`, "failed");
    setBuilderError(store, error);
  }
}

async function submitChat() {
  const input = chatInput.value.trim();
  if (interactionLocked.value || (!input && !attachments.value.some((item) => item.dataUrl && !item.analysis))) return;
  await ensureDocument();
  await ensureChatWorkspace();
  await appendPersistedMessage("user", input || "첨부한 프로모션 이미지를 분석해 주세요.", {
    type: "user",
    attachmentIds: attachments.value.map((item) => item.id),
  });
  chatInput.value = "";
  try {
    const referenceSummary = await analyzeAttachments();
    const combined = composeOverviewInstruction(input, referenceSummary);
    store.naturalLanguage = combined;
    await analyze(combined);
  } catch (error) {
    setBuilderError(store, error);
  }
}

async function handleChatAction(action) {
  if (interactionLocked.value) return;
  try {
    if (action.key === "confirm_requirements") {
      if (capabilities.value.chatWorkspaceV1) {
        await executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        });
      }
      await appendPersistedMessage("user", action.label, { type: "action" });
      await prepareWireframe();
      return;
    }
    if (action.key === "approve_wireframe") {
      await appendPersistedMessage("user", action.label, { type: "action" });
      await approveWireframe(action);
      return;
    }
    if (action.key === "revise_requirements" || action.key === "revise_wireframe") {
      if (capabilities.value.chatWorkspaceV1) {
        await executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        });
      }
      await appendPersistedMessage("assistant", "수정할 내용을 채팅으로 입력해 주세요.", { type: "assistant" });
      return;
    }
    if (action.key === "open_output") {
      if (capabilities.value.chatWorkspaceV1 && action.id) {
        await executeChatAction({
          sessionId: chatSessionId.value,
          actionId: action.id,
          actionKey: action.key,
          idempotencyKey: crypto.randomUUID(),
        });
      }
      openOutput();
    }
  } catch (error) {
    setBuilderError(store, error);
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

async function prepareWireframe() {
  clearBuilderError(store);
  store.warning = null;
  store.stage = "resolving_policy";
  const operationId = `wireframe-${Date.now()}`;
  updateStatusMessage(operationId, "B/W Wireframe 구조를 생성하고 있습니다.", "in_progress");
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
    updateStatusMessage(operationId, "B/W Wireframe 생성을 완료했습니다.", "completed");
    await appendPersistedMessage("assistant", "색상과 실제 이미지를 제외한 Wireframe을 생성했습니다. 오른쪽 결과를 확인해 주세요.", {
      type: "assistant",
      actions: [
        { key: "approve_wireframe", label: "Wireframe 승인" },
        { key: "revise_wireframe", label: "수정 요청" },
      ],
    });
  } catch (error) {
    updateStatusMessage(operationId, `Wireframe 생성에 실패했습니다. ${error.message}`, "failed");
    setBuilderError(store, error);
  }
}

async function compose() {
  await prepareWireframe();
}

async function approveWireframe(action = {}) {
  if (!store.proposal?.id) return;
  const operationId = `final-${Date.now()}`;
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
    await appendPersistedMessage("assistant", "승인한 Wireframe 구조를 기준으로 최종 디자인을 완성했습니다.", {
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

function overviewEntries(value = store.overviewDraft, prefix = "") {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (item && typeof item === "object" && !Array.isArray(item)) return overviewEntries(item, path);
    const display = Array.isArray(item) ? item.join(", ") : String(item ?? "");
    return display ? [{ path, label: key, value: display }] : [];
  });
}

watch([messages, attachments, wireframeSnapshot, activeResultTab, splitPercent], persistWorkspace, { deep: true });
watch(() => [store.documentId, store.documentRevision, store.stage, store.overviewDraft, store.snapshot], persistWorkspace, { deep: true });

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
              <button type="button" aria-label="대화 목록 닫기" @click="chatMenuOpen = false">×</button>
            </header>
            <button
              type="button"
              class="ai-chat-history__new"
              :disabled="interactionLocked || chatSessionSwitching"
              @click="startNewConversation"
            >+ 새 대화</button>
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
              ><span aria-hidden="true">☰</span></button>
              <div>
                <p class="ai-builder-eyebrow">V3 AI Builder</p>
                <strong>프로모션 제작 대화</strong>
              </div>
            </div>
            <span class="ai-chat-status" :data-state="currentStatus.state">{{ currentStatus.state }}</span>
          </header>

          <div ref="chatList" class="ai-chat-messages" aria-live="polite">
            <article
              v-for="message in messages"
              :key="message.id"
              class="ai-chat-message"
              :class="[`is-${message.role}`, `is-${message.type || 'text'}`]"
            >
              <div class="ai-chat-message__meta">
                <strong>{{ message.role === 'user' ? '나' : message.role === 'system' ? '진행 상태' : 'AI Builder' }}</strong>
                <span v-if="message.status">{{ message.status === 'in_progress' ? '진행 중' : message.status === 'completed' ? '완료' : '실패' }}</span>
              </div>
              <p>{{ message.text }}</p>
              <div v-if="message.actions?.length" class="ai-chat-actions">
                <button
                  v-for="action in message.actions"
                  :key="action.key"
                  type="button"
                  :disabled="interactionLocked"
                  @click="handleChatAction(action)"
                >{{ action.label }}</button>
              </div>
            </article>
          </div>

          <div v-if="attachments.length" class="ai-reference-tray" aria-label="첨부 이미지">
            <article v-for="(attachment, index) in attachments" :key="attachment.id" class="ai-reference-card">
              <img v-if="attachment.dataUrl || attachment.imageUrl" :src="attachment.dataUrl || attachment.imageUrl" :alt="`${attachment.name} 미리보기`" />
              <div>
                <strong>{{ index + 1 }}. {{ attachment.name }}</strong>
                <small>{{ attachment.viewport === 'mobile' ? 'Mobile' : 'Desktop' }} · {{ attachment.status === 'analyzed' ? '분석 완료' : attachment.status === 'analyzing' ? '분석 중' : '첨부됨' }}</small>
              </div>
              <button type="button" :disabled="interactionLocked" :aria-label="`${attachment.name} 삭제`" @click="removeAttachment(attachment)">×</button>
            </article>
          </div>

          <form class="ai-chat-composer" @submit.prevent="submitChat">
            <textarea
              v-model="chatInput"
              rows="3"
              maxlength="4000"
              placeholder="프로모션 요구사항을 입력하거나 화면 이미지를 붙여넣으세요."
              :disabled="interactionLocked"
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
              <button type="button" class="ai-builder-secondary" :disabled="interactionLocked" @click="fileInput?.click()">이미지 첨부</button>
              <button type="submit" class="ai-builder-primary" :disabled="interactionLocked || (!chatInput.trim() && !attachments.some((item) => item.dataUrl && !item.analysis))">
                {{ interactionLocked ? '처리 중…' : '전송' }}
              </button>
            </div>
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
              <p class="ai-builder-eyebrow">Progress & Result</p>
              <strong>{{ currentStatus.label }}</strong>
            </div>
            <span class="ai-chat-status" :data-state="currentStatus.state">{{ currentStatus.state }}</span>
          </header>

          <ol class="ai-process-steps" aria-label="프로모션 생성 단계">
            <li :class="{ active: !store.overviewDraft, complete: store.overviewDraft }"><span>1</span>요구사항</li>
            <li :class="{ active: store.overviewDraft && !wireframeDisplaySnapshot, complete: wireframeDisplaySnapshot }"><span>2</span>Wireframe</li>
            <li :class="{ active: wireframeDisplaySnapshot && !store.snapshot, complete: store.snapshot && store.stage === 'render_ready' }"><span>3</span>최종 디자인</li>
          </ol>

          <nav class="ai-result-tabs" aria-label="결과 보기">
            <button type="button" :aria-current="activeResultTab === 'requirements' ? 'page' : undefined" @click="activeResultTab = 'requirements'">요구사항</button>
            <button type="button" :disabled="!wireframeDisplaySnapshot" :aria-current="activeResultTab === 'wireframe' ? 'page' : undefined" @click="activeResultTab = 'wireframe'">B/W Wireframe</button>
            <button type="button" :disabled="!store.snapshot" :aria-current="activeResultTab === 'final' ? 'page' : undefined" @click="activeResultTab = 'final'">최종 디자인</button>
          </nav>

          <div class="ai-result-content">
            <section v-if="activeResultTab === 'requirements'" class="ai-requirements-tree">
              <header><strong>요구사항 Tree</strong><small>채팅에서 수정할 수 있습니다.</small></header>
              <ul v-if="store.overviewDraft" role="tree">
                <li v-for="entry in overviewEntries()" :key="entry.path" role="treeitem">
                  <span>{{ entry.label }}</span><strong>{{ entry.value }}</strong>
                </li>
              </ul>
              <div v-else class="ai-result-empty">채팅으로 요구사항을 입력하면 분석 결과가 여기에 표시됩니다.</div>
            </section>

            <section v-else-if="activeResultTab === 'wireframe' && wireframeDisplaySnapshot" class="ai-wireframe-review">
              <header><strong>B/W Wireframe</strong><small>실제 문구와 구조를 확인합니다. 색상·디자인 토큰·실제 이미지는 제외됩니다.</small></header>
              <div class="ai-wireframe-canvas">
                <article v-for="section in wireframeSections" :key="section.key" class="ai-wireframe-section">
                  <header>
                    <div class="ai-wireframe-section-name">
                      <span>{{ String(section.order).padStart(2, "0") }}</span>
                      <strong>{{ section.label }}</strong>
                    </div>
                    <small>구성 방식: {{ section.layoutLabel }}</small>
                  </header>
                  <div class="ai-wireframe-components">
                    <div
                      v-for="component in section.components"
                      :key="component.key"
                      class="ai-wireframe-component"
                      :class="{ 'ai-wireframe-component--image': component.isImage }"
                      :title="component.technicalLabel"
                    >
                      <header>
                        <span>{{ component.order }}</span>
                        <div>
                          <strong>{{ component.label }}</strong>
                          <small>{{ component.typeLabel }}</small>
                        </div>
                      </header>
                      <div v-if="component.contentLines.length" class="ai-wireframe-copy">
                        <p v-for="line in component.contentLines" :key="line.key">
                          <span v-if="line.label">{{ line.label }}</span>
                          <strong :title="line.fullText">{{ line.text }}</strong>
                        </p>
                      </div>
                      <div v-else class="ai-wireframe-placeholder">
                        {{ component.isImage ? "이미지 영역" : "내용 입력 영역" }}
                      </div>
                    </div>
                  </div>
                </article>
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
