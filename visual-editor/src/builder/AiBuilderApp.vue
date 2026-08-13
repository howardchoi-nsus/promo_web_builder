<script setup>
import { computed, onMounted, ref } from "vue";
import BuilderModeSelector from "./BuilderModeSelector.vue";
import AiBriefPanel from "./AiBriefPanel.vue";
import OverviewReviewForm from "./OverviewReviewForm.vue";
import CompositionProgress from "./CompositionProgress.vue";
import CompositionReview from "./CompositionReview.vue";
import RegistryProposalReview from "./RegistryProposalReview.vue";
import OperationProposalReview from "./OperationProposalReview.vue";
import NaturalLanguageEditor from "./NaturalLanguageEditor.vue";
import { createAiBuilderStore, clearBuilderError, setBuilderError } from "./state/ai-builder-store.mjs";
import {
  analyzeOverview,
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
const busy = computed(() => [
  "analyzing_overview", "resolving_policy", "queued", "processing", "applying",
].includes(store.stage));
const overviewExecution = computed(() => store.executionDisplays.promo_overview_parser || null);
const compositionExecution = computed(() => store.executionDisplays.promo_page_composer || null);

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
  store.stage = "analyzing_overview";
  const startedAt = performance.now();
  recordBuilderEvent({
    eventName: "ai_overview_requested",
    documentId: store.documentId || undefined,
  });
  try {
    const response = await analyzeOverview(store.naturalLanguage);
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
  const url = new URL("/prototype/visual-editor.html", window.location.origin);
  url.searchParams.set("mode", "ai-document");
  url.searchParams.set("builderDocumentId", store.documentId);
  url.searchParams.set("revision", String(store.documentRevision));
  window.location.assign(url);
}

async function retryAssets() {
  if (!store.documentId || !store.documentRevision || assetRetrying.value) return;
  assetRetrying.value = true;
  try {
    const response = await retryBuilderAssets({
      documentId: store.documentId,
      documentRevision: store.documentRevision,
    });
    store.assetJobs = Object.fromEntries((response.assetJobs || []).map((job) => [job.id, job]));
    store.warning = null;
    openVisualEditor();
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
    if (proposal.contractVersion === 3) {
      store.stage = "review_required";
      return;
    }
    store.stage = proposal.autoApplicable ? "applying" : "review_required";
    await applyReadyProposal(proposal);
  } catch (error) {
    setBuilderError(store, error);
  }
}

async function applyReadyProposal(proposal = store.proposal) {
  if (!proposal?.id || busy.value && store.stage !== "review_required") return;
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
    store.warning = applied.assetWarning || applied.warnings?.[0] || store.warning || null;
    store.stage = "render_ready";
    recordBuilderEvent({
      eventName: "composition_applied",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      durationMs: performance.now() - startedAt,
      metadata: { assetJobCount: Object.keys(store.assetJobs).length },
    });
    if (!store.warning) openVisualEditor();
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
  const url = new URL("/prototype/visual-editor.html", window.location.origin);
  url.searchParams.set("mode", "output");
  url.searchParams.set("builderDocumentId", store.documentId);
  url.searchParams.set("revision", String(store.documentRevision));
  url.searchParams.set("returnUrl", window.location.href);
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
    const executionLookups = Promise.allSettled([
      loadPromptExecutionDisplay("promo_overview_parser"),
      loadPromptExecutionDisplay("promo_page_composer"),
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
</script>

<template>
  <main class="ai-builder-shell">
    <BuilderModeSelector v-if="selectedMode !== 'ai'" :ai-enabled="capabilities.aiMode" @select="selectMode" />
    <template v-else>
      <div v-if="store.error" class="ai-builder-error" role="alert" aria-live="assertive">
        <strong>{{ store.error.code }}</strong>
        <span>{{ store.error.message }}</span>
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
      <AiBriefPanel
        v-if="store.stage === 'idle' || store.stage === 'analyzing_overview' || store.stage === 'failed' && !store.overviewDraft"
        v-model="store.naturalLanguage"
        :busy="busy"
        :execution="overviewExecution"
        @analyze="analyze"
      />
      <OverviewReviewForm
        v-else-if="store.stage === 'reviewing_overview' || store.stage === 'failed'"
        v-model="store.overviewDraft"
        :busy="busy"
        @back="store.stage = 'idle'"
        @confirm="compose"
      />
      <CompositionProgress
        v-else-if="!store.snapshot && store.stage !== 'review_required'"
        :stage="store.stage"
        message="프로모션 구조를 생성하고 있습니다."
        :execution="compositionExecution"
      />
      <RegistryProposalReview
        v-else-if="store.stage === 'review_required' && store.proposal?.contractVersion === 3"
        :proposal="store.proposal"
        :busy="busy"
        @back="store.stage = 'reviewing_overview'"
        @apply="applyReadyProposal()"
      />
      <OperationProposalReview
        v-else-if="pendingOperations"
        :proposal="pendingOperations"
        :busy="busy"
        @cancel="pendingOperations = null"
        @apply="applyOperationProposal"
      />
      <CompositionReview
        v-else
        :snapshot="store.snapshot"
        :document-revision="store.documentRevision"
        :busy="busy"
        :export-enabled="Boolean(capabilities.export)"
        @edit-natural-language="operationOpen = true"
        @rollback="rollback"
        @open-output="openOutput"
        @export-document="exportDocument"
      />
      <NaturalLanguageEditor
        v-if="operationOpen"
        :busy="busy"
        @cancel="operationOpen = false"
        @submit="editNaturalLanguage"
      />
    </template>
  </main>
</template>
