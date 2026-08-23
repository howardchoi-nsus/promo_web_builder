<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  inspectLayoutSnapshot,
  layoutJsonEnvelope,
  safeJsonFileName,
} from "../services/layout-json-inspector.mjs";
import JsonTreeView from "./JsonTreeView.vue";

const props = defineProps({
  layout: { type: Object, required: true },
  section: { type: Object, required: true },
  items: { type: Array, default: () => [] },
  aiSelectable: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);
const dialog = ref(null);
const activeTab = ref("snapshot");
const query = ref("");
const copyStatus = ref("");
const viewMode = ref("tree");
const expandRevision = ref(0);
const collapseRevision = ref(0);
let previousFocus = null;
let copyTimer = null;

const tabs = Object.freeze([
  { key: "snapshot", label: "Layout Snapshot" },
  { key: "metadata", label: "AI 선택 기준" },
  { key: "full", label: "전체 보기" },
]);
const envelope = computed(() => layoutJsonEnvelope(props.layout, props.section, props.aiSelectable));
const displayedValue = computed(() => ({
  snapshot: props.layout.layoutSnapshot || {},
  metadata: props.layout.selectionMetadata || {},
  full: envelope.value,
}[activeTab.value]));
const jsonText = computed(() => JSON.stringify(displayedValue.value, null, 2));
const jsonLines = computed(() => jsonText.value.split("\n"));
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase());
const matchingLines = computed(() => normalizedQuery.value
  ? jsonLines.value.filter((line) => line.toLocaleLowerCase().includes(normalizedQuery.value)).length
  : 0);
const issues = computed(() => inspectLayoutSnapshot(
  props.layout.layoutSnapshot,
  props.items.map((item) => item.itemKey),
));
const errors = computed(() => issues.value.filter((entry) => entry.level === "error"));
const warnings = computed(() => issues.value.filter((entry) => entry.level === "warning"));

function requestClose() {
  if (dialog.value?.open) dialog.value.close();
  else emit("close");
}

function handleDialogClose() {
  emit("close");
  nextTick(() => previousFocus?.focus?.());
}

function handleBackdropClick(event) {
  if (event.target === dialog.value) requestClose();
}

async function copyJson() {
  try {
    await globalThis.navigator.clipboard.writeText(jsonText.value);
    copyStatus.value = "JSON을 복사했습니다.";
  } catch {
    copyStatus.value = "JSON을 복사하지 못했습니다.";
  }
  globalThis.clearTimeout(copyTimer);
  copyTimer = globalThis.setTimeout(() => { copyStatus.value = ""; }, 2400);
}

async function copyPath(path) {
  try {
    await globalThis.navigator.clipboard.writeText(path);
    copyStatus.value = `${path} 경로를 복사했습니다.`;
  } catch {
    copyStatus.value = "경로를 복사하지 못했습니다.";
  }
  globalThis.clearTimeout(copyTimer);
  copyTimer = globalThis.setTimeout(() => { copyStatus.value = ""; }, 2400);
}

function downloadJson() {
  const blob = new Blob([`${jsonText.value}\n`], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = globalThis.document.createElement("a");
  anchor.href = url;
  anchor.download = safeJsonFileName(props.layout);
  anchor.click();
  URL.revokeObjectURL(url);
}

watch(activeTab, () => { query.value = ""; });

onMounted(async () => {
  previousFocus = globalThis.document.activeElement;
  await nextTick();
  if (dialog.value && !dialog.value.open) dialog.value.showModal();
});

onBeforeUnmount(() => {
  globalThis.clearTimeout(copyTimer);
  if (dialog.value?.open) dialog.value.close();
});
</script>

<template>
  <dialog
    ref="dialog"
    class="json-snapshot-dialog"
    aria-labelledby="json-snapshot-dialog-title"
    @click="handleBackdropClick"
    @cancel.prevent="requestClose"
    @close="handleDialogClose"
  >
    <section class="json-snapshot-dialog__surface">
      <header>
        <div>
          <strong id="json-snapshot-dialog-title">Layout Preset 저장 JSON</strong>
          <small>{{ layout.name }} · {{ layout.layoutKey }}</small>
        </div>
        <button class="tiny-button" type="button" aria-label="저장 JSON 모달 닫기" @click="requestClose">닫기</button>
      </header>
      <div class="json-snapshot-dialog__summary">
        <span>{{ section.status }}</span>
        <span v-if="layout.isDefault">기본</span>
        <span v-if="aiSelectable">AI 선택 후보</span>
        <small>마지막 저장: {{ layout.updatedAt || '기록 없음' }}</small>
      </div>
      <nav class="json-snapshot-dialog__tabs" aria-label="저장 JSON 종류">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="{ active: activeTab === tab.key }"
          :aria-pressed="activeTab === tab.key"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </nav>
      <div class="json-snapshot-dialog__toolbar">
        <label>
          <span class="sr-only">JSON 경로 또는 값 검색</span>
          <input v-model="query" type="search" placeholder="경로 또는 값 검색" />
        </label>
        <small v-if="normalizedQuery">일치하는 줄 {{ matchingLines }}개</small>
        <div>
          <button class="tiny-button" type="button" :aria-pressed="viewMode === 'tree'" @click="viewMode = 'tree'">트리 보기</button>
          <button class="tiny-button" type="button" :aria-pressed="viewMode === 'code'" @click="viewMode = 'code'">코드 보기</button>
          <button v-if="viewMode === 'tree'" class="tiny-button" type="button" @click="expandRevision += 1">모두 펼치기</button>
          <button v-if="viewMode === 'tree'" class="tiny-button" type="button" @click="collapseRevision += 1">모두 접기</button>
          <button class="tiny-button" type="button" @click="copyJson">JSON 복사</button>
          <button class="tiny-button" type="button" @click="downloadJson">JSON 다운로드</button>
        </div>
      </div>
      <ul v-if="viewMode === 'tree'" class="json-snapshot-dialog__tree" role="tree" aria-label="저장 JSON 트리">
        <JsonTreeView
          :value="displayedValue"
          :query="normalizedQuery"
          :expand-revision="expandRevision"
          :collapse-revision="collapseRevision"
          @copy-path="copyPath"
        />
      </ul>
      <pre v-else class="json-snapshot-dialog__code" tabindex="0"><code><span
        v-for="(line, index) in jsonLines"
        :key="index"
        :class="{ 'is-match': normalizedQuery && line.toLocaleLowerCase().includes(normalizedQuery) }"
      >{{ line }}{{ index < jsonLines.length - 1 ? '\n' : '' }}</span></code></pre>
      <section class="json-snapshot-dialog__validation" aria-live="polite">
        <strong v-if="!issues.length">검증 결과: 정상</strong>
        <strong v-else>검증 결과: 오류 {{ errors.length }}건 · 경고 {{ warnings.length }}건</strong>
        <ul v-if="issues.length">
          <li v-for="entry in issues" :key="`${entry.code}:${entry.path}`" :class="`is-${entry.level}`">
            <code>{{ entry.path }}</code>
            <span>{{ entry.code }} · {{ entry.message }}</span>
          </li>
        </ul>
        <small v-if="copyStatus" role="status">{{ copyStatus }}</small>
        <small v-if="activeTab === 'full'">aiSelectable은 Section의 허용 Layout Key를 기준으로 계산한 표시용 값입니다.</small>
      </section>
    </section>
  </dialog>
</template>

<style scoped>
.json-snapshot-dialog { width: min(92vw, 980px); height: min(88vh, 900px); max-width: none; max-height: none; margin: auto; padding: 0; overflow: hidden; border: 1px solid var(--app-line); border-radius: 12px; background: var(--app-panel); color: var(--app-ink); box-shadow: var(--app-shadow); }
.json-snapshot-dialog::backdrop { background: rgb(8 12 20 / 72%); backdrop-filter: blur(3px); }
.json-snapshot-dialog__surface { display: grid; grid-template-rows: auto auto auto auto minmax(0, 1fr) auto; height: 100%; min-height: 0; }
.json-snapshot-dialog header, .json-snapshot-dialog__summary, .json-snapshot-dialog__toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.json-snapshot-dialog header { padding: 14px 16px; border-bottom: 1px solid var(--app-line); }
.json-snapshot-dialog header > div { display: grid; gap: 3px; }
.json-snapshot-dialog header small, .json-snapshot-dialog__summary small, .json-snapshot-dialog__toolbar small { color: var(--app-sub); }
.json-snapshot-dialog__summary { justify-content: flex-start; padding: 8px 16px; }
.json-snapshot-dialog__summary span { padding: 2px 7px; border: 1px solid var(--app-line); border-radius: 999px; font-size: var(--app-font-size-small); }
.json-snapshot-dialog__summary small { margin-left: auto; }
.json-snapshot-dialog__tabs { display: flex; gap: 4px; padding: 0 16px; border-bottom: 1px solid var(--app-line); }
.json-snapshot-dialog__tabs button { padding: 9px 12px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--app-sub); cursor: pointer; }
.json-snapshot-dialog__tabs button.active { border-color: var(--app-accent); color: var(--app-ink); font-weight: 800; }
.json-snapshot-dialog__toolbar { padding: 10px 16px; }
.json-snapshot-dialog__toolbar label { flex: 1; }
.json-snapshot-dialog__toolbar input { width: 100%; min-height: 34px; border: 1px solid var(--app-line); border-radius: 6px; background: var(--app-surface); color: var(--app-ink); }
.json-snapshot-dialog__toolbar > div { display: flex; gap: 6px; }
.json-snapshot-dialog__code, .json-snapshot-dialog__tree { min-height: 0; margin: 0 16px; padding: 14px; overflow: auto; border: 1px solid var(--app-line); border-radius: 8px; background: #0b0f17; color: #d7e1f1; font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; tab-size: 2; }
.json-snapshot-dialog__tree { list-style: none; }
.json-snapshot-dialog__code span { display: inline; }
.json-snapshot-dialog__code span.is-match { background: rgb(250 204 21 / 24%); color: #fff4ae; }
.json-snapshot-dialog__validation { display: grid; gap: 6px; max-height: 180px; padding: 12px 16px; overflow: auto; }
.json-snapshot-dialog__validation ul { display: grid; gap: 5px; margin: 0; padding: 0; list-style: none; }
.json-snapshot-dialog__validation li { display: grid; grid-template-columns: minmax(180px, .7fr) 1fr; gap: 8px; font-size: var(--app-font-size-small); }
.json-snapshot-dialog__validation li.is-error { color: var(--app-danger); }
.json-snapshot-dialog__validation li.is-warning { color: var(--app-warning, #d69e2e); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 700px) {
  .json-snapshot-dialog { width: 100vw; height: 100dvh; border: 0; border-radius: 0; }
  .json-snapshot-dialog__toolbar { align-items: stretch; flex-direction: column; }
  .json-snapshot-dialog__toolbar > div { flex-wrap: wrap; }
  .json-snapshot-dialog__validation li { grid-template-columns: 1fr; }
}
</style>
