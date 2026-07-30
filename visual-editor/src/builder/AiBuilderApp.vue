<script setup>
import { computed, onMounted, ref } from "vue";
import BuilderModeSelector from "./BuilderModeSelector.vue";
import AiBriefPanel from "./AiBriefPanel.vue";
import OverviewReviewForm from "./OverviewReviewForm.vue";
import CompositionProgress from "./CompositionProgress.vue";
import CompositionReview from "./CompositionReview.vue";
import NaturalLanguageEditor from "./NaturalLanguageEditor.vue";
import { createAiBuilderStore, clearBuilderError, setBuilderError } from "./state/ai-builder-store.mjs";
import {
  analyzeOverview,
  applyCompositionProposal,
  createBuilderDocument,
  createCompositionProposal,
  ensureBuilderSession,
  loadCompositionProposal,
  loadBuilderCapabilities,
  recordBuilderEvent,
  rollbackComposition,
  submitCompositionOperation,
} from "./services/composition-client.mjs";

const props = defineProps({
  initialMode: { type: String, default: "" },
});
const store = createAiBuilderStore();
const selectedMode = ref(props.initialMode);
const operationOpen = ref(false);
const capabilities = ref({ aiMode: true });
const busy = computed(() => [
  "analyzing_overview", "resolving_policy", "queued", "processing", "applying",
].includes(store.stage));

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
    store.stage = response.proposal.status;
    if (response.proposal.status === "ready") return response.proposal;
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

async function compose() {
  clearBuilderError(store);
  store.warning = null;
  store.stage = "resolving_policy";
  const startedAt = performance.now();
  try {
    await ensureDocument();
    const queued = await createCompositionProposal({
      documentId: store.documentId,
      baseDocumentRevision: store.documentRevision,
      overview: store.overviewDraft,
      overviewFingerprint: store.overviewFingerprint,
      selectedOptionalSectionIds: store.selectedOptionalSectionIds,
      confirmedFieldPaths: store.confirmedFieldPaths,
      idempotencyKey: crypto.randomUUID(),
    });
    recordBuilderEvent({
      eventName: "composition_requested",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
    });
    const proposal = await pollProposal(queued.proposal.id);
    store.stage = proposal.autoApplicable ? "applying" : "review_required";
    const applied = await applyCompositionProposal({
      documentId: store.documentId,
      proposalId: proposal.id,
      baseDocumentRevision: store.documentRevision,
      idempotencyKey: crypto.randomUUID(),
    });
    store.documentRevision = applied.revision;
    store.snapshot = applied.snapshot;
    store.assetJobs = Object.fromEntries((applied.assetJobs || []).map((job) => [job.id, job]));
    store.warning = applied.assetWarning || applied.warnings?.[0] || null;
    store.stage = "render_ready";
    recordBuilderEvent({
      eventName: "composition_applied",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      durationMs: performance.now() - startedAt,
      metadata: { assetJobCount: Object.keys(store.assetJobs).length },
    });
    openVisualEditor();
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
    recordBuilderEvent({
      eventName: "composition_operation_proposed",
      documentId: store.documentId,
      documentRevision: store.documentRevision,
      metadata: { operationCount: response.operations?.length || 0 },
    });
    if (response.autoApplicable && response.operations?.length) {
      const applied = await submitCompositionOperation({
        action: "apply",
        documentId: store.documentId,
        baseDocumentRevision: store.documentRevision,
        operations: response.operations,
        idempotencyKey: crypto.randomUUID(),
      });
      store.documentRevision = applied.revision;
      store.snapshot = applied.snapshot;
      store.assetJobs = Object.fromEntries((applied.assetJobs || []).map((job) => [job.id, job]));
      store.warning = applied.assetWarning || applied.warnings?.[0] || null;
      recordBuilderEvent({
        eventName: "composition_operation_applied",
        documentId: store.documentId,
        documentRevision: store.documentRevision,
        metadata: { operationCount: applied.operations?.length || 0 },
      });
    }
  } catch (error) {
    setBuilderError(store, error);
  }
}

function openOutput() {
  const url = new URL("/prototype/visual-editor.html", window.location.origin);
  url.searchParams.set("mode", "output");
  url.searchParams.set("builderDocumentId", store.documentId);
  url.searchParams.set("revision", String(store.documentRevision));
  window.open(url, "_blank", "noopener,noreferrer");
  recordBuilderEvent({
    eventName: "web_output_opened",
    documentId: store.documentId,
    documentRevision: store.documentRevision,
  });
}

onMounted(async () => {
  try {
    const result = await loadBuilderCapabilities();
    capabilities.value = result.capabilities || capabilities.value;
    if (selectedMode.value === "ai" && !capabilities.value.aiMode) {
      selectedMode.value = "";
      return;
    }
    if (selectedMode.value === "ai") await ensureDocument();
  } catch (error) {
    setBuilderError(store, error);
  }
});
</script>

<template>
  <main class="ai-builder-shell">
    <BuilderModeSelector v-if="selectedMode !== 'ai'" :ai-enabled="capabilities.aiMode" @select="selectMode" />
    <template v-else>
      <div v-if="store.error" class="ai-builder-error" role="alert">
        <strong>{{ store.error.code }}</strong>
        <span>{{ store.error.message }}</span>
        <button type="button" @click="store.stage = store.overviewDraft ? 'reviewing_overview' : 'idle'; clearBuilderError(store)">닫기</button>
      </div>
      <div v-if="store.warning" class="ai-builder-warning" role="status">
        <strong>{{ store.warning.code }}</strong>
        <span>{{ store.warning.message }}</span>
        <button type="button" @click="store.warning = null">닫기</button>
      </div>
      <AiBriefPanel
        v-if="store.stage === 'idle' || store.stage === 'analyzing_overview' || store.stage === 'failed' && !store.overviewDraft"
        v-model="store.naturalLanguage"
        :busy="busy"
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
        v-else-if="!store.snapshot"
        :stage="store.stage"
        message="섹션 정책과 사용 가능한 컴포넌트를 검증하고 있습니다."
      />
      <CompositionReview
        v-else
        :snapshot="store.snapshot"
        :document-revision="store.documentRevision"
        :busy="busy"
        @edit-natural-language="operationOpen = true"
        @rollback="rollback"
        @open-output="openOutput"
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
