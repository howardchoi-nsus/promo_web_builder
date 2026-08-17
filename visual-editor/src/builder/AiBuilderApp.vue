<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import BuilderModeSelector from "./BuilderModeSelector.vue";
import AiBriefPanel from "./AiBriefPanel.vue";
import OverviewReviewForm from "./OverviewReviewForm.vue";
import CompositionProgress from "./CompositionProgress.vue";
import CompositionReview from "./CompositionReview.vue";
import { visualEditorEntry } from "../platform/visual-editor-entry.mjs";
import { evaluateAssetReadiness } from "../shared/composition/asset-readiness.mjs";
import OperationProposalReview from "./OperationProposalReview.vue";
import NaturalLanguageEditor from "./NaturalLanguageEditor.vue";
import { createAiBuilderStore, clearBuilderError, setBuilderError } from "./state/ai-builder-store.mjs";
import {
  analyzeOverviewWithRetry,
  applyCompositionProposal,
  createBuilderDocument,
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
} from "./services/composition-client.mjs";

const props = defineProps({
  initialMode: { type: String, default: "" },
});
const store = createAiBuilderStore();
const selectedMode = ref(props.initialMode);
const operationOpen = ref(false);
const assetRetrying = ref(false);
const capabilities = ref({ aiMode: true });
const activeShell = ref(null);
const pendingOperations = ref(null);
const operationConflict = ref(null);
const overviewRetry = ref(null);
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
  if (["preview_ready", "navigating_preview"].includes(store.stage)) {
    return translate("builder.progress.preparingPreview", "Live Preview를 준비하고 있습니다.");
  }
  return translate("builder.progress.generatingStructure", "프로모션 구조를 생성하고 있습니다.");
});
const overviewExecution = computed(() => store.executionDisplays.promo_overview_parser || null);
const compositionExecution = computed(() => store.executionDisplays.promo_page_composer || null);
const assetExecution = computed(() => store.executionDisplays.section_background_image
  || store.executionDisplays.component_image
  || compositionExecution.value);
const progressExecution = computed(() => (
  store.stage === "analyzing_overview"
    ? overviewExecution.value
    : ["generating_assets", "preview_ready", "navigating_preview"].includes(store.stage)
      ? assetExecution.value
      : compositionExecution.value
));
const retryableAssetError = computed(() => Boolean(store.snapshot && [
  "ASSET_GENERATION_FAILED", "ASSET_GENERATION_TIMEOUT", "ASSET_ENQUEUE_FAILED",
].includes(store.error?.code)));

function selectMode(mode) {
  recordBuilderEvent({ eventName: "builder_mode_selected", metadata: { mode } });
  if (mode === "template") {
    window.location.assign("/prototype/create-promo?mode=template");
    return;
  }
  selectedMode.value = "ai";
  const url = new URL(window.location.href);
  url.searchParams.set("mode", "ai");
  window.history.replaceState({}, "", url);
}

async function ensureDocument() {
  if (store.documentId) return;
  await ensureBuilderSession();
  const response = await createBuilderDocument();
  store.documentId = response.document.id;
  store.documentRevision = response.document.currentDocumentRevision;
}

async function analyze() {
  clearBuilderError(store);
  overviewRetry.value = null;
  store.stage = "analyzing_overview";
  const startedAt = performance.now();
  recordBuilderEvent({
    eventName: "ai_overview_requested",
    documentId: store.documentId || undefined,
  });
  try {
    const response = await analyzeOverviewWithRetry(store.naturalLanguage, {
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
    store.overviewFingerprint = response.overviewFingerprint;
    store.stage = "reviewing_overview";
    recordBuilderEvent({
      eventName: "ai_overview_reviewed",
      documentId: store.documentId || undefined,
      durationMs: performance.now() - startedAt,
    });
  } catch (error) {
    overviewRetry.value = null;
    setBuilderError(store, error);
  }
}

async function pollProposal(proposalId) {
  for (let count = 0; count < 120; count += 1) {
    const response = await loadCompositionProposal(proposalId);
    store.proposal = response.proposal;
    if (response.proposal.status === "ready") return response.proposal;
    // `ready` is an internal queue state. Rendering it as a UI stage briefly
    // remounts CompositionProgress before the caller selects review/apply.
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
  let readiness = evaluateAssetReadiness(store.snapshot?.assets?.requests);
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
    readiness = evaluateAssetReadiness(loaded.snapshot.assets?.requests);
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

async function compose() {
  clearBuilderError(store);
  store.warning = null;
  store.stage = "resolving_policy";
  try {
    await ensureDocument();
    const registryRequested = Boolean(capabilities.value.compositionV3);
    const useRegistryComposition = registryRequested && Boolean(activeShell.value?.id);
    if (registryRequested && !useRegistryComposition) {
      store.warning = {
        code: "REGISTRY_SHELL_FALLBACK",
        message: "활성 Composition Shell을 찾지 못해 기존 Template 구성 방식으로 안전하게 전환했습니다.",
      };
      recordBuilderEvent({
        eventName: "builder_template_fallback_activated",
        documentId: store.documentId,
        documentRevision: store.documentRevision,
        metadata: { reason: "active_shell_unavailable" },
      });
    }
    const allowedLocales = activeShell.value?.config?.allowedLocales || [];
    const locale = allowedLocales[0] || navigator.language || "ko-KR";
    const queued = await createCompositionProposal({
      documentId: store.documentId,
      baseDocumentRevision: store.documentRevision,
      overview: store.overviewDraft,
      overviewFingerprint: store.overviewFingerprint,
      selectedOptionalSectionIds: store.selectedOptionalSectionIds,
      confirmedFieldPaths: store.confirmedFieldPaths,
      ...(useRegistryComposition ? {
        mode: "ai-composition",
        contractVersion: 3,
        shellVersionId: activeShell.value.id,
        locale,
        capabilities: [],
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
    await applyReadyProposal(proposal);
  } catch (error) {
    setBuilderError(store, error);
  }
}

async function applyReadyProposal(proposal = store.proposal) {
  if (!proposal?.id || store.stage === "applying") return;
  clearBuilderError(store);
  store.stage = "applying";
  const startedAt = performance.now();
  try {
    const applied = await applyCompositionProposal({
      documentId: store.documentId,
      proposalId: proposal.id,
      baseDocumentRevision: store.documentRevision,
      idempotencyKey: crypto.randomUUID(),
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
      store.stage = "navigating_preview";
      openVisualEditor();
    }
  } catch (error) {
    setBuilderError(store, error);
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

onMounted(async () => {
  try {
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
    }
    if (selectedMode.value === "ai" && !capabilities.value.aiMode) {
      selectedMode.value = "";
      return;
    }
    if (selectedMode.value === "ai") await ensureDocument();
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
        <button
          v-if="store.snapshot"
          type="button"
          @click="openVisualEditor"
        >이미지 없이 편집 계속</button>
        <button type="button" @click="store.warning = null">닫기</button>
      </div>
      <div v-if="operationConflict" class="ai-builder-warning" role="alert">
        <strong>DOCUMENT_REVISION_MISMATCH</strong>
        <span>{{ operationConflict.message }}</span>
        <button type="button" @click="reloadLatestForOperation">최신본 불러오기</button>
        <button type="button" @click="operationConflict = null; pendingOperations = null">취소</button>
      </div>
      <CompositionProgress
        v-if="fullScreenProgress"
        :stage="store.stage"
        :message="progressMessage"
        :execution="progressExecution"
      />
      <AiBriefPanel
        v-else-if="store.stage === 'idle' || store.stage === 'failed' && !store.overviewDraft"
        v-model="store.naturalLanguage"
        :busy="busy"
        @analyze="analyze"
      />
      <OverviewReviewForm
        v-else-if="store.stage === 'reviewing_overview' || store.stage === 'failed' && !store.snapshot"
        v-model="store.overviewDraft"
        :busy="busy"
        @back="store.stage = 'idle'"
        @confirm="compose"
      />
      <OperationProposalReview
        v-else-if="pendingOperations"
        :proposal="pendingOperations"
        :busy="busy"
        @cancel="pendingOperations = null"
        @apply="applyOperationProposal"
      />
      <CompositionReview
        v-else-if="store.snapshot && store.stage === 'render_ready'"
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
      <section v-else-if="store.stage === 'failed'" class="ai-builder-card">
        <p class="ai-builder-eyebrow">AI Generation</p>
        <h1>AI 생성을 완료하지 못했습니다.</h1>
        <p>상단 오류 내용을 확인한 후 다시 시도해 주세요.</p>
      </section>
      <NaturalLanguageEditor
        v-if="operationOpen"
        :busy="busy"
        @cancel="operationOpen = false"
        @submit="editNaturalLanguage"
      />
    </template>
  </main>
</template>
