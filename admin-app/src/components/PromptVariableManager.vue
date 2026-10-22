<script setup>
import { computed, onMounted, ref } from "vue";
import { promptVariableService } from "../services/prompt-variable-service.mjs";

const loading = ref(false);
const error = ref("");
const variables = ref([]);
const summary = ref({ variableCount: 0, promptTypeCount: 0, requiredUsageCount: 0, optionalUsageCount: 0 });
const selectedKey = ref("");
const search = ref("");
const requirementFilter = ref("");

const filteredVariables = computed(() => {
  const query = search.value.trim().toLowerCase();
  return variables.value.filter((variable) => {
    if (requirementFilter.value === "required" && !variable.requiredCount) return false;
    if (requirementFilter.value === "optional" && !variable.optionalCount) return false;
    return !query || variable.key.toLowerCase().includes(query)
      || variable.usages.some((usage) => `${usage.promptType} ${usage.promptName}`.toLowerCase().includes(query));
  });
});
const selected = computed(() => variables.value.find((variable) => variable.key === selectedKey.value) || null);

function requirementLabel(requirement) {
  return requirement === "required" ? "필수" : "선택";
}

async function reload() {
  loading.value = true;
  error.value = "";
  try {
    const result = await promptVariableService.list();
    variables.value = result.variables || [];
    summary.value = result.summary || summary.value;
    if (!variables.value.some((variable) => variable.key === selectedKey.value)) {
      selectedKey.value = variables.value[0]?.key || "";
    }
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

onMounted(reload);
</script>

<template>
  <section class="prompt-variable-manager" aria-labelledby="prompt-variable-title">
    <header class="prompt-variable-manager__header">
      <div>
        <span class="prompt-variable-manager__eyebrow">Prompt Contract Registry</span>
        <h2 id="prompt-variable-title">프롬프트 변수 관리</h2>
        <p>현재 실행 코드와 프롬프트 사이에 등록된 필수·선택 변수 계약을 조회합니다.</p>
      </div>
      <button class="tiny-button" type="button" :disabled="loading" @click="reload">새로고침</button>
    </header>

    <div class="prompt-variable-manager__notice">
      <strong>현재는 읽기 전용입니다.</strong>
      <span>신규 변수는 실행 코드가 값을 공급할 수 있도록 개발된 뒤 계약에 등록해야 합니다.</span>
    </div>

    <div class="prompt-variable-manager__summary" aria-label="프롬프트 변수 현황">
      <div><strong>{{ summary.variableCount }}</strong><span>고유 변수</span></div>
      <div><strong>{{ summary.promptTypeCount }}</strong><span>프롬프트 유형</span></div>
      <div><strong>{{ summary.requiredUsageCount }}</strong><span>필수 연결</span></div>
      <div><strong>{{ summary.optionalUsageCount }}</strong><span>선택 연결</span></div>
    </div>

    <div v-if="error" class="outline-item danger-state" role="alert"><strong>변수 목록 오류</strong><span>{{ error }}</span></div>

    <div class="prompt-variable-manager__workspace">
      <aside class="prompt-variable-manager__list">
        <div class="prompt-variable-manager__filters">
          <input v-model="search" type="search" aria-label="프롬프트 변수 검색" placeholder="변수명 또는 프롬프트 검색" />
          <select v-model="requirementFilter" aria-label="변수 구분 필터">
            <option value="">전체 구분</option><option value="required">필수 변수</option><option value="optional">선택 변수</option>
          </select>
        </div>
        <div class="prompt-variable-manager__rows" aria-live="polite">
          <button
            v-for="variable in filteredVariables"
            :key="variable.key"
            type="button"
            class="prompt-variable-manager__row"
            :class="{ selected: variable.key === selectedKey }"
            @click="selectedKey = variable.key"
          >
            <span><strong>{{ variable.key }}</strong><small>연결된 프롬프트 유형 {{ variable.promptTypeCount }}개</small></span>
            <span class="prompt-variable-manager__badges">
              <em v-if="variable.requiredCount" class="is-required">필수 {{ variable.requiredCount }}</em>
              <em v-if="variable.optionalCount" class="is-optional">선택 {{ variable.optionalCount }}</em>
            </span>
          </button>
          <p v-if="!loading && !filteredVariables.length" class="prompt-variable-manager__empty">조건에 맞는 변수가 없습니다.</p>
        </div>
      </aside>

      <section class="prompt-variable-manager__detail">
        <template v-if="selected">
          <div class="prompt-variable-manager__detail-heading">
            <div><small>변수 키</small><strong>{{ selected.key }}</strong></div>
            <span>총 {{ selected.promptTypeCount }}개 프롬프트 유형에서 사용</span>
          </div>
          <div class="prompt-variable-manager__usage-list">
            <article v-for="usage in selected.usages" :key="`${usage.promptType}-${usage.requirement}`">
              <div><strong>{{ usage.promptName }}</strong><code>{{ usage.promptType }}</code></div>
              <em :class="`is-${usage.requirement}`">{{ requirementLabel(usage.requirement) }}</em>
            </article>
          </div>
        </template>
        <p v-else class="prompt-variable-manager__empty">왼쪽에서 변수를 선택해 주세요.</p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.prompt-variable-manager { display: grid; gap: 16px; }
.prompt-variable-manager__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.prompt-variable-manager__header h2 { margin: 4px 0 6px; }
.prompt-variable-manager__header p { margin: 0; color: var(--app-sub); }
.prompt-variable-manager__eyebrow { color: var(--app-accent); font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.prompt-variable-manager__notice { display: flex; flex-wrap: wrap; gap: 6px 12px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--app-accent) 32%, var(--app-line)); border-radius: 10px; background: color-mix(in srgb, var(--app-accent) 6%, transparent); font-size: 12px; }
.prompt-variable-manager__notice span { color: var(--app-sub); }
.prompt-variable-manager__summary { display: grid; grid-template-columns: repeat(4, minmax(110px, 1fr)); gap: 10px; }
.prompt-variable-manager__summary div { display: grid; gap: 2px; padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; background: var(--app-panel-subtle, #f7f7f7); }
.prompt-variable-manager__summary strong { font-size: 22px; }
.prompt-variable-manager__summary span { color: var(--app-sub); font-size: 12px; }
.prompt-variable-manager__workspace { display: grid; grid-template-columns: minmax(320px, 40%) minmax(0, 1fr); gap: 14px; min-height: 560px; }
.prompt-variable-manager__list, .prompt-variable-manager__detail { min-width: 0; padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; }
.prompt-variable-manager__filters { display: grid; grid-template-columns: 1fr 120px; gap: 6px; margin-bottom: 10px; }
.prompt-variable-manager__filters input, .prompt-variable-manager__filters select { width: 100%; min-height: 38px; padding: 7px 9px; border: 1px solid var(--app-line); border-radius: 7px; background: var(--app-surface); color: var(--app-ink); font: inherit; }
.prompt-variable-manager__rows { display: grid; gap: 6px; max-height: 660px; overflow: auto; }
.prompt-variable-manager__row { display: flex; justify-content: space-between; gap: 10px; padding: 12px; border: 1px solid var(--app-line); border-radius: 8px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.prompt-variable-manager__row:hover, .prompt-variable-manager__row.selected { border-color: var(--app-accent); background: color-mix(in srgb, var(--app-accent) 7%, transparent); }
.prompt-variable-manager__row > span:first-child { display: grid; min-width: 0; gap: 3px; }
.prompt-variable-manager__row strong { overflow: hidden; text-overflow: ellipsis; }
.prompt-variable-manager__row small { color: var(--app-sub); }
.prompt-variable-manager__badges { display: flex; align-items: flex-start; gap: 4px; }
.prompt-variable-manager em { padding: 3px 7px; border-radius: 999px; font-size: 11px; font-style: normal; font-weight: 700; white-space: nowrap; }
.prompt-variable-manager em.is-required { background: #ffe8e8; color: #a12727; }
.prompt-variable-manager em.is-optional { background: #e7f0ff; color: #245ea8; }
.prompt-variable-manager__detail { align-content: start; display: grid; gap: 14px; }
.prompt-variable-manager__detail-heading { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--app-line); }
.prompt-variable-manager__detail-heading div { display: grid; gap: 3px; }
.prompt-variable-manager__detail-heading strong { font-size: 20px; }
.prompt-variable-manager__detail-heading small, .prompt-variable-manager__detail-heading > span { color: var(--app-sub); font-size: 12px; }
.prompt-variable-manager__usage-list { display: grid; gap: 7px; }
.prompt-variable-manager__usage-list article { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 11px 12px; border: 1px solid var(--app-line); border-radius: 8px; }
.prompt-variable-manager__usage-list article div { display: grid; gap: 4px; min-width: 0; }
.prompt-variable-manager__usage-list code { overflow: hidden; color: var(--app-sub); font-size: 11px; text-overflow: ellipsis; }
.prompt-variable-manager__empty { margin: 0; padding: 18px 8px; color: var(--app-sub); font-size: 12px; text-align: center; }
@media (max-width: 900px) { .prompt-variable-manager__workspace { grid-template-columns: 1fr; } .prompt-variable-manager__summary { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .prompt-variable-manager__header { flex-direction: column; } .prompt-variable-manager__filters, .prompt-variable-manager__summary { grid-template-columns: 1fr; } }
</style>
