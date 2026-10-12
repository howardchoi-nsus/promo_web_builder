<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { llmModelRegistryService } from "../services/llm-model-registry-service.mjs";

const emit = defineEmits(["status"]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const models = ref([]);
const histories = ref([]);
const selectedId = ref("");
const search = ref("");
const providerFilter = ref("");
const statusFilter = ref("");
const temperatureGuideOpen = ref(false);
const temperatureGuideRoot = ref(null);

const emptyEditor = () => ({
  provider: "openai",
  modelId: "",
  displayName: "",
  description: "",
  modality: "text",
  status: "draft",
  isRecommended: false,
  isLegacy: false,
  defaultTemperature: "",
  defaultMaxTokens: "",
  defaultResponseFormat: "json_object",
  supportedImageSizesText: "",
  modelOptionsText: "{}",
  changeNote: "",
});
const editor = reactive(emptyEditor());

const selected = computed(() => models.value.find((item) => item.id === selectedId.value) || null);
const selectedHistories = computed(() => {
  if (!selected.value) return [];
  return histories.value.filter((history) => (
    history.llmModelId === selected.value.id
      || (history.provider === selected.value.provider && history.modelId === selected.value.modelId)
  ));
});
const filteredModels = computed(() => {
  const query = search.value.trim().toLowerCase();
  return models.value.filter((item) => {
    if (providerFilter.value && item.provider !== providerFilter.value) return false;
    if (statusFilter.value && item.status !== statusFilter.value) return false;
    return !query || [item.displayName, item.modelId, item.description]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });
});
const counts = computed(() => ({
  total: models.value.length,
  active: models.value.filter((item) => item.status === "active").length,
  used: models.value.filter((item) => item.usage?.total > 0).length,
}));

function statusLabel(status) {
  return { draft: "초안", active: "활성", inactive: "사용 중지" }[status] || status;
}

function modalityLabel(modality) {
  return modality === "image" ? "이미지 생성·편집" : "텍스트·JSON";
}

function historyActionLabel(history) {
  if (!history.previousStatus) return "모델 등록";
  if (history.previousStatus !== history.newStatus) {
    return `${statusLabel(history.previousStatus)} → ${statusLabel(history.newStatus)}`;
  }
  return "설정 수정";
}

function formatHistoryDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function closeTemperatureGuide(event) {
  if (event?.type === "keydown" && event.key !== "Escape") return;
  if (event?.type === "click" && temperatureGuideRoot.value?.contains(event.target)) return;
  temperatureGuideOpen.value = false;
}

function resetEditor() {
  selectedId.value = "";
  Object.assign(editor, emptyEditor());
  error.value = "";
}

function selectModel(model) {
  selectedId.value = model.id;
  Object.assign(editor, {
    provider: model.provider,
    modelId: model.modelId,
    displayName: model.displayName,
    description: model.description || "",
    modality: model.modality,
    status: model.status,
    isRecommended: Boolean(model.isRecommended),
    isLegacy: Boolean(model.isLegacy),
    defaultTemperature: model.defaultTemperature ?? "",
    defaultMaxTokens: model.defaultMaxTokens ?? "",
    defaultResponseFormat: model.defaultResponseFormat || (model.modality === "image" ? "image" : "text"),
    supportedImageSizesText: (model.supportedImageSizes || []).join(", "),
    modelOptionsText: JSON.stringify(model.modelOptions || {}, null, 2),
    changeNote: "",
  });
  error.value = "";
}

function onModalityChange() {
  editor.defaultResponseFormat = editor.modality === "image" ? "image" : "json_object";
  if (editor.modality !== "image") editor.supportedImageSizesText = "";
}

function payload() {
  let modelOptions;
  try {
    modelOptions = JSON.parse(editor.modelOptionsText || "{}");
  } catch {
    throw new Error("Provider 기본 옵션을 올바른 JSON 객체로 입력해 주세요.");
  }
  if (!modelOptions || typeof modelOptions !== "object" || Array.isArray(modelOptions)) {
    throw new Error("Provider 기본 옵션은 JSON 객체여야 합니다.");
  }
  return {
    provider: editor.provider,
    modelId: editor.modelId.trim(),
    displayName: editor.displayName.trim(),
    description: editor.description.trim(),
    modality: editor.modality,
    status: editor.status,
    isRecommended: editor.isRecommended,
    isLegacy: editor.isLegacy,
    defaultTemperature: editor.defaultTemperature,
    defaultMaxTokens: editor.defaultMaxTokens,
    defaultResponseFormat: editor.defaultResponseFormat,
    supportedImageSizes: editor.supportedImageSizesText.split(",").map((item) => item.trim()).filter(Boolean),
    modelOptions,
    changeNote: editor.changeNote.trim(),
  };
}

async function reload(preferredId = selectedId.value) {
  loading.value = true;
  error.value = "";
  try {
    const result = await llmModelRegistryService.list();
    models.value = result.models || [];
    histories.value = result.histories || [];
    const next = models.value.find((item) => item.id === preferredId);
    if (next) selectModel(next);
    else if (models.value.length && !selectedId.value) selectModel(models.value[0]);
    else if (!models.value.length) resetEditor();
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  error.value = "";
  try {
    const value = payload();
    if (!value.modelId || !value.displayName) throw new Error("모델 ID와 표시 이름을 입력해 주세요.");
    const isNew = !selected.value;
    const result = !isNew
      ? await llmModelRegistryService.update(selected.value.id, value)
      : await llmModelRegistryService.create({ ...value, status: "draft" });
    await reload(result.model.id);
    emit("status", isNew ? "LLM 모델 초안을 등록했습니다." : "LLM 모델 설정을 저장했습니다.");
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    saving.value = false;
  }
}

async function changeStatus(status) {
  if (!selected.value) return;
  saving.value = true;
  error.value = "";
  try {
    const result = await llmModelRegistryService.update(selected.value.id, {
      status,
      changeNote: editor.changeNote.trim() || `${status} 상태로 변경`,
    });
    await reload(result.model.id);
    emit("status", status === "active" ? "LLM 모델을 활성화했습니다." : "LLM 모델을 사용 중지했습니다.");
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  reload();
  document.addEventListener("click", closeTemperatureGuide);
  document.addEventListener("keydown", closeTemperatureGuide);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", closeTemperatureGuide);
  document.removeEventListener("keydown", closeTemperatureGuide);
});
</script>

<template>
  <section class="llm-registry" aria-labelledby="llm-registry-title">
    <header class="llm-registry__header">
      <div>
        <span class="llm-registry__eyebrow">LLM Registry</span>
        <h2 id="llm-registry-title">LLM 모델 관리</h2>
        <p>프로모션 생성기에서 사용할 모델과 기본 실행값을 중앙에서 등록하고 관리합니다. API Key는 이 화면에 저장하지 않습니다.</p>
      </div>
      <div class="llm-registry__header-actions">
        <button class="tiny-button" type="button" :disabled="loading" @click="reload()">새로고침</button>
        <button class="tiny-button primary" type="button" @click="resetEditor">신규 모델 등록</button>
      </div>
    </header>

    <div class="llm-registry__summary" aria-label="LLM 모델 현황">
      <div><strong>{{ counts.total }}</strong><span>전체 모델</span></div>
      <div><strong>{{ counts.active }}</strong><span>활성 모델</span></div>
      <div><strong>{{ counts.used }}</strong><span>프롬프트 연결</span></div>
    </div>

    <div v-if="error" class="outline-item danger-state" role="alert"><strong>LLM 모델 관리 오류</strong><span>{{ error }}</span></div>

    <div class="llm-registry__workspace">
      <aside class="llm-registry__list">
        <div class="llm-registry__filters">
          <input v-model="search" type="search" aria-label="LLM 모델 검색" placeholder="모델 이름 또는 ID 검색" />
          <select v-model="providerFilter" aria-label="LLM Provider 필터">
            <option value="">전체 Provider</option><option value="openai">OpenAI</option><option value="google">Google</option>
          </select>
          <select v-model="statusFilter" aria-label="LLM 상태 필터">
            <option value="">전체 상태</option><option value="active">활성</option><option value="draft">초안</option><option value="inactive">사용 중지</option>
          </select>
        </div>
        <div class="llm-registry__rows" aria-live="polite">
          <button
            v-for="model in filteredModels"
            :key="model.id"
            type="button"
            class="llm-registry__row"
            :class="{ selected: model.id === selectedId }"
            @click="selectModel(model)"
          >
            <span class="llm-registry__row-main">
              <strong>{{ model.displayName }}</strong>
              <small>{{ model.modelId }}</small>
              <span class="llm-registry__row-details">
                <small><b>모델 용도</b>{{ modalityLabel(model.modality) }}</small>
                <small><b>연결 프롬프트</b>{{ model.usage?.total || 0 }}개</small>
              </span>
            </span>
            <span class="llm-registry__row-meta"><em :class="`is-${model.status}`">{{ statusLabel(model.status) }}</em><small>{{ model.provider }}</small></span>
          </button>
          <p v-if="!loading && !filteredModels.length" class="llm-registry__empty">조건에 맞는 모델이 없습니다.</p>
        </div>
      </aside>

      <form class="llm-registry__editor" @submit.prevent="save">
        <div class="llm-registry__editor-heading">
          <div><strong>{{ selected ? selected.displayName : '신규 LLM 모델' }}</strong><span v-if="selected">프롬프트 {{ selected.usage?.total || 0 }}개 연결 · 운영 상태 {{ selected.usage?.active || 0 }}개</span></div>
          <span v-if="selected" class="llm-registry__status" :class="`is-${selected.status}`">{{ statusLabel(selected.status) }}</span>
        </div>

        <fieldset :disabled="saving" class="llm-registry__fields">
          <div class="llm-registry__grid">
            <label><span>Provider</span><select v-model="editor.provider" :disabled="Boolean(selected)"><option value="openai">OpenAI</option><option value="google">Google</option></select></label>
            <label><span>모델 ID</span><input v-model="editor.modelId" :disabled="Boolean(selected)" type="text" autocomplete="off" placeholder="gpt-... / gemini-..." /></label>
            <label><span>표시 이름</span><input v-model="editor.displayName" type="text" autocomplete="off" /></label>
            <label><span>모델 용도</span><select v-model="editor.modality" @change="onModalityChange"><option value="text">텍스트·JSON</option><option value="image">이미지 생성·편집</option></select></label>
            <label>
              <span class="llm-registry__field-title">
                기본 Temperature
                <span ref="temperatureGuideRoot" class="llm-registry__guide-anchor">
                  <button
                    class="llm-registry__guide-button"
                    type="button"
                    aria-label="기본 Temperature 가이드"
                    aria-controls="temperature-guide-popover"
                    :aria-expanded="String(temperatureGuideOpen)"
                    @click.stop="temperatureGuideOpen = !temperatureGuideOpen"
                  >i</button>
                  <span
                    v-if="temperatureGuideOpen"
                    id="temperature-guide-popover"
                    class="llm-registry__guide-popover"
                    role="dialog"
                    aria-label="Temperature 설정 가이드"
                    @click.stop
                  >
                    <strong>Temperature 설정 가이드</strong>
                    <span><b>0~0.2</b> 구조화 JSON·레이아웃처럼 일관성이 중요한 작업</span>
                    <span><b>0.3~0.7</b> 프로모션 카피와 아이디어처럼 적당한 다양성이 필요한 작업</span>
                    <span><b>미설정</b> 모델 기본값 사용. GPT-6 Reasoning·이미지 모델에 권장</span>
                    <button type="button" @click="temperatureGuideOpen = false">닫기</button>
                  </span>
                </span>
              </span>
              <input v-model="editor.defaultTemperature" type="number" min="0" max="2" step="0.1" placeholder="미설정" />
            </label>
            <label><span>기본 Max Tokens</span><input v-model="editor.defaultMaxTokens" type="number" min="1" step="1" placeholder="미설정" /></label>
            <label><span>기본 응답 형식</span><select v-model="editor.defaultResponseFormat"><option value="text">text</option><option value="json_object">json_object</option><option value="image">image</option></select></label>
            <label v-if="editor.modality === 'image'"><span>지원 이미지 크기</span><input v-model="editor.supportedImageSizesText" type="text" placeholder="1K, 2K, 4K" /><small>쉼표로 구분합니다.</small></label>
          </div>
          <label class="llm-registry__wide"><span>설명</span><textarea v-model="editor.description" rows="3"></textarea></label>
          <div class="llm-registry__checks">
            <label><input v-model="editor.isRecommended" type="checkbox" /> 권장 모델</label>
            <label><input v-model="editor.isLegacy" type="checkbox" /> 레거시 모델</label>
          </div>
          <label class="llm-registry__wide"><span>Provider 기본 옵션(JSON)</span><textarea v-model="editor.modelOptionsText" rows="7" spellcheck="false"></textarea></label>
          <label class="llm-registry__wide"><span>변경 사유</span><input v-model="editor.changeNote" type="text" autocomplete="off" placeholder="등록 또는 변경 이유" /></label>
        </fieldset>

        <div class="llm-registry__actions">
          <button class="tiny-button primary" type="submit" :disabled="saving || !editor.modelId || !editor.displayName">{{ selected ? '설정 저장' : '초안 등록' }}</button>
          <button v-if="selected?.status !== 'active'" class="tiny-button" type="button" :disabled="saving" @click="changeStatus('active')">활성화</button>
          <button v-if="selected?.status === 'active'" class="tiny-button danger" type="button" :disabled="saving" @click="changeStatus('inactive')">사용 중지</button>
        </div>
        <p class="llm-registry__guard">Provider와 모델 ID는 등록 후 변경할 수 없습니다. 사용 중인 프롬프트가 있으면 모델을 중지할 수 없습니다.</p>

        <details v-if="selected" class="llm-registry__history" open>
          <summary>
            <span><strong>LLM 업데이트 내역</strong><small>등록·설정 수정·상태 변경 {{ selectedHistories.length }}건</small></span>
          </summary>
          <div class="llm-registry__history-list">
            <article v-for="history in selectedHistories" :key="history.id" class="llm-registry__history-item">
              <div>
                <strong>{{ historyActionLabel(history) }}</strong>
                <time :datetime="history.changedAt">{{ formatHistoryDate(history.changedAt) }}</time>
              </div>
              <p>{{ history.changeNote || '변경 사유 없음' }}</p>
              <span>
                {{ history.changedBy || 'system' }}
                · {{ history.snapshot?.defaultResponseFormat || '-' }}
                · Max {{ history.snapshot?.defaultMaxTokens || '-' }}
              </span>
            </article>
            <p v-if="!selectedHistories.length" class="llm-registry__empty">기록된 업데이트 내역이 없습니다.</p>
          </div>
        </details>
      </form>
    </div>
  </section>
</template>

<style scoped>
.llm-registry { display: grid; gap: 16px; }
.llm-registry__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.llm-registry__header h2 { margin: 4px 0 6px; }
.llm-registry__header p { max-width: 760px; margin: 0; color: var(--app-sub); }
.llm-registry__eyebrow { color: var(--app-accent); font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.llm-registry__header-actions, .llm-registry__actions, .llm-registry__checks { display: flex; flex-wrap: wrap; gap: 8px; }
.llm-registry__summary { display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap: 10px; }
.llm-registry__summary div { display: grid; gap: 2px; padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; background: var(--app-panel-subtle, #f7f7f7); }
.llm-registry__summary strong { font-size: 22px; }
.llm-registry__summary span { color: var(--app-sub); font-size: 12px; }
.llm-registry__workspace { display: grid; grid-template-columns: minmax(280px, 34%) minmax(0, 1fr); gap: 14px; min-height: 600px; }
.llm-registry__list, .llm-registry__editor { min-width: 0; padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; }
.llm-registry__filters { display: grid; grid-template-columns: 1fr 120px 110px; gap: 6px; margin-bottom: 10px; }
.llm-registry__filters input, .llm-registry__filters select, .llm-registry__fields input, .llm-registry__fields select, .llm-registry__fields textarea { width: 100%; border: 1px solid var(--app-line); border-radius: 7px; background: var(--app-surface); color: var(--app-ink); font: inherit; }
.llm-registry__filters input, .llm-registry__filters select, .llm-registry__fields input, .llm-registry__fields select { min-height: 38px; padding: 7px 9px; }
.llm-registry__rows { display: grid; gap: 6px; max-height: 670px; overflow: auto; }
.llm-registry__row { display: flex; justify-content: space-between; gap: 10px; padding: 12px; border: 1px solid var(--app-line); border-radius: 8px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.llm-registry__row:hover, .llm-registry__row.selected { border-color: var(--app-accent); background: color-mix(in srgb, var(--app-accent) 7%, transparent); }
.llm-registry__row-main, .llm-registry__row-meta { display: grid; gap: 3px; min-width: 0; }
.llm-registry__row-main small { overflow: hidden; color: var(--app-sub); text-overflow: ellipsis; white-space: nowrap; }
.llm-registry__row-details { display: flex; flex-wrap: wrap; gap: 5px 10px; margin-top: 5px; }
.llm-registry__row-details small { display: inline-flex; gap: 4px; align-items: center; font-size: 11px; white-space: normal; }
.llm-registry__row-details b { color: var(--app-ink); font-weight: 700; }
.llm-registry__row-meta { justify-items: end; flex: 0 0 auto; }
.llm-registry__row-meta em, .llm-registry__status { padding: 3px 7px; border-radius: 999px; background: #f1f3f5; color: #5f6368; font-size: 11px; font-style: normal; font-weight: 700; }
.llm-registry__row-meta em.is-active, .llm-registry__status.is-active { background: #e5f6eb; color: #14753b; }
.llm-registry__row-meta em.is-draft, .llm-registry__status.is-draft { background: #fff3d6; color: #8a5a00; }
.llm-registry__editor { display: grid; align-content: start; gap: 14px; }
.llm-registry__editor-heading { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--app-line); }
.llm-registry__editor-heading div { display: grid; gap: 3px; }
.llm-registry__editor-heading span { color: var(--app-sub); font-size: 12px; }
.llm-registry__fields { display: grid; gap: 13px; min-width: 0; padding: 0; border: 0; }
.llm-registry__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
.llm-registry__grid label, .llm-registry__wide { display: grid; gap: 5px; color: var(--app-sub); font-size: 12px; font-weight: 700; }
.llm-registry__field-title { display: inline-flex; align-items: center; gap: 5px; }
.llm-registry__guide-anchor { position: relative; display: inline-flex; }
.llm-registry__guide-button { display: inline-flex; width: 17px; height: 17px; align-items: center; justify-content: center; padding: 0; border: 1px solid var(--app-line); border-radius: 50%; background: var(--app-panel-subtle, #f4f5f6); color: var(--app-sub); font: 800 11px/1 sans-serif; cursor: pointer; }
.llm-registry__guide-button:hover, .llm-registry__guide-button:focus-visible { border-color: var(--app-accent); color: var(--app-accent); outline: none; }
.llm-registry__guide-popover { position: absolute; z-index: 20; top: 24px; left: -8px; display: grid; width: min(320px, 72vw); gap: 8px; padding: 12px; border: 1px solid var(--app-line); border-radius: 9px; background: var(--app-surface); box-shadow: 0 12px 30px rgba(0, 0, 0, .16); color: var(--app-ink); font-size: 11px; font-weight: 500; line-height: 1.45; }
.llm-registry__guide-popover strong { font-size: 12px; }
.llm-registry__guide-popover > span { display: block; }
.llm-registry__guide-popover button { justify-self: end; padding: 4px 8px; border: 1px solid var(--app-line); border-radius: 6px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
.llm-registry__fields textarea { padding: 9px; resize: vertical; }
.llm-registry__checks label { display: flex; align-items: center; gap: 6px; color: var(--app-ink); font-size: 13px; }
.llm-registry__checks input { width: auto; min-height: auto; }
.llm-registry__guard, .llm-registry__empty { margin: 0; color: var(--app-sub); font-size: 12px; }
.llm-registry__empty { padding: 18px 8px; text-align: center; }
.llm-registry__history { overflow: hidden; border: 1px solid var(--app-line); border-radius: 9px; }
.llm-registry__history > summary { display: flex; justify-content: space-between; padding: 11px 12px; cursor: pointer; list-style: none; }
.llm-registry__history > summary::-webkit-details-marker { display: none; }
.llm-registry__history > summary span { display: grid; gap: 2px; }
.llm-registry__history > summary small { color: var(--app-sub); font-size: 11px; }
.llm-registry__history-list { display: grid; gap: 0; border-top: 1px solid var(--app-line); }
.llm-registry__history-item { display: grid; gap: 5px; padding: 11px 12px; border-bottom: 1px solid var(--app-line); }
.llm-registry__history-item:last-child { border-bottom: 0; }
.llm-registry__history-item div { display: flex; justify-content: space-between; gap: 10px; }
.llm-registry__history-item time, .llm-registry__history-item span { color: var(--app-sub); font-size: 11px; }
.llm-registry__history-item p { margin: 0; font-size: 12px; }
@media (max-width: 980px) { .llm-registry__workspace { grid-template-columns: 1fr; } .llm-registry__rows { max-height: 320px; } }
@media (max-width: 680px) { .llm-registry__header { flex-direction: column; } .llm-registry__summary, .llm-registry__grid { grid-template-columns: 1fr; } .llm-registry__filters { grid-template-columns: 1fr; } }
</style>
