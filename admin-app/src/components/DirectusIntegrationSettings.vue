<script setup>
import { computed, onMounted, reactive, ref } from "vue";

const props = defineProps({ capabilities: { type: Object, default: () => ({}) } });
const emit = defineEmits(["notify"]);
const loading = ref(false);
const saving = ref(false);
const configs = ref([]);
const selectedId = ref("");
const error = ref("");
const testResult = ref(null);
const checks = ref([]);
const editor = reactive({
  environment: "development",
  baseUrl: "",
  secretRef: "env:DIRECTUS_SECRET_CONNECTION",
  timeoutMs: 5000,
  retryCount: 0,
  verifyAuthentication: true,
});

const selected = computed(() => configs.value.find((item) => item.id === selectedId.value) || null);
const tunnelEnabled = computed(() => props.capabilities.directusIntegration === true && props.capabilities.directusConnectionTunnel === true);
const grouped = computed(() => ["development", "preview", "production"].map((environment) => ({
  environment,
  rows: configs.value.filter((item) => item.environment === environment),
})).filter((group) => group.rows.length));
const selectedLastCheck = computed(() => checks.value.find((check) => check.configId === selectedId.value) || null);

async function api(url, options = {}) {
  const response = await fetch(url, { cache: "no-store", ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiError = new Error(result.error || `요청 오류(${response.status})`);
    apiError.result = result;
    throw apiError;
  }
  return result;
}

function select(config) {
  selectedId.value = config.id;
  Object.assign(editor, { environment: config.environment, ...config.config });
  testResult.value = null;
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const result = await api("/api/directus-integration-config");
    configs.value = result.configs || [];
    checks.value = result.checks || [];
    if (selectedId.value) selectedId.value = configs.value.some((item) => item.id === selectedId.value) ? selectedId.value : "";
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

async function saveDraft() {
  saving.value = true;
  error.value = "";
  try {
    const result = await api("/api/directus-integration-config", {
      method: "POST",
      body: JSON.stringify({
        environment: editor.environment,
        config: {
          baseUrl: editor.baseUrl,
          secretRef: editor.secretRef,
          timeoutMs: Number(editor.timeoutMs),
          retryCount: Number(editor.retryCount),
          verifyAuthentication: editor.verifyAuthentication,
        },
      }),
    });
    await load();
    select(configs.value.find((item) => item.id === result.config.id) || result.config);
    emit("notify", "Directus 연결 설정 초안을 저장했습니다.");
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    saving.value = false;
  }
}

async function runAction(action) {
  if (!selected.value) return;
  saving.value = true;
  error.value = "";
  try {
    const result = await api("/api/directus-integration-config", {
      method: "PATCH",
      body: JSON.stringify({ id: selected.value.id, action }),
    });
    await load();
    select(configs.value.find((item) => item.id === result.config.id) || result.config);
    emit("notify", action === "activate" ? "Directus 연결 설정을 활성화했습니다." : action === "suspend" ? "Directus 연결 설정을 중지했습니다." : "Directus 연결 설정 검증을 완료했습니다.");
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    saving.value = false;
  }
}

async function testConnection() {
  if (!selected.value) return;
  saving.value = true;
  error.value = "";
  testResult.value = null;
  try {
    const result = await api("/api/directus-connection-test", { method: "POST", body: JSON.stringify({ id: selected.value.id }) });
    testResult.value = result.result;
    await load();
    emit("notify", "Directus 연결 테스트를 통과했습니다.");
  } catch (requestError) {
    error.value = requestError.message;
    testResult.value = requestError.result?.result || null;
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="directus-settings">
    <header class="directus-settings__header">
      <div>
        <span class="eyebrow">Integration Config</span>
        <h2>Directus 연결 터널</h2>
        <p>현재 단계에서는 URL·비밀키 참조·연결 검증만 관리합니다. 컬렉션 매핑, 데이터 마이그레이션, 런타임 읽기·쓰기는 포함하지 않습니다.</p>
      </div>
      <button class="tiny-button" type="button" :disabled="loading" @click="load">새로고침</button>
    </header>

    <div class="directus-settings__flags">
      <span :class="{ on: capabilities.directusConfigManagement }">Config 관리 {{ capabilities.directusConfigManagement ? 'ON' : 'OFF' }}</span>
      <span :class="{ on: capabilities.directusIntegration }">Directus 연동 {{ capabilities.directusIntegration ? 'ON' : 'OFF' }}</span>
      <span :class="{ on: capabilities.directusConnectionTunnel }">연결 터널 {{ capabilities.directusConnectionTunnel ? 'ON' : 'OFF' }}</span>
    </div>

    <div v-if="!tunnelEnabled" class="directus-settings__notice">
      설정 초안은 준비할 수 있습니다. 실제 연결 테스트는 <code>DIRECTUS_INTEGRATION_ENABLED=true</code>와 <code>DIRECTUS_CONNECTION_TUNNEL_ENABLED=true</code>일 때만 실행됩니다.
    </div>
    <div v-if="error" class="outline-item danger-state"><strong>Directus 설정 오류</strong><span>{{ error }}</span></div>

    <div class="directus-settings__grid">
      <aside class="directus-settings__history">
        <h3>설정 버전</h3>
        <template v-for="group in grouped" :key="group.environment">
          <strong class="directus-settings__environment">{{ group.environment }}</strong>
          <button v-for="config in group.rows" :key="config.id" type="button" :class="{ selected: selectedId === config.id }" @click="select(config)">
            <span>v{{ config.version }}</span><em>{{ config.status }}</em>
          </button>
        </template>
        <p v-if="!loading && !configs.length">저장된 설정이 없습니다.</p>
      </aside>

      <section class="directus-settings__editor">
        <div class="app-form-grid">
          <label class="app-field"><span>환경</span><select v-model="editor.environment"><option value="development">development</option><option value="preview">preview</option><option value="production">production</option></select></label>
          <label class="app-field"><span>Directus Base URL</span><input v-model.trim="editor.baseUrl" type="url" placeholder="https://directus.example.com" /></label>
          <label class="app-field"><span>비밀키 참조</span><input v-model.trim="editor.secretRef" type="text" placeholder="env:DIRECTUS_SECRET_CONNECTION" /><small>토큰 값이 아니라 서버 환경변수 이름만 저장합니다.</small></label>
          <label class="app-field"><span>Timeout (ms)</span><input v-model.number="editor.timeoutMs" type="number" min="1000" max="15000" step="500" /></label>
          <label class="app-field"><span>Retry</span><input v-model.number="editor.retryCount" type="number" min="0" max="2" /></label>
          <label class="app-checkbox"><input v-model="editor.verifyAuthentication" type="checkbox" /><span><code>/users/me</code> 인증 확인</span></label>
        </div>
        <div class="app-actions app-actions--end">
          <button class="tiny-button primary" type="button" :disabled="saving || !editor.baseUrl" @click="saveDraft">새 초안 저장</button>
          <button class="tiny-button" type="button" :disabled="saving || selected?.status !== 'draft'" @click="runAction('validate')">구성 검증</button>
          <button class="tiny-button" type="button" :disabled="saving || selected?.status !== 'draft' || selected?.validation?.ok !== true || selectedLastCheck?.status !== 'passed'" @click="runAction('activate')">활성화</button>
          <button class="tiny-button" type="button" :disabled="saving || selected?.status !== 'active'" @click="runAction('suspend')">중지</button>
          <button class="tiny-button" type="button" :disabled="saving || !selected || !tunnelEnabled" @click="testConnection">연결 테스트</button>
        </div>
        <div v-if="selected?.validation?.errors?.length" class="directus-settings__validation">
          <strong>검증 오류</strong><ul><li v-for="item in selected.validation.errors" :key="item.code">{{ item.message }}</li></ul>
        </div>
        <div v-if="testResult" class="directus-settings__result" :class="testResult.status">
          <strong>{{ testResult.status === 'passed' ? '연결 성공' : '연결 실패' }}</strong>
          <span>Health: {{ testResult.healthStatus || '-' }} · Auth: {{ testResult.authVerified ? '확인' : '미확인' }} · {{ testResult.durationMs }}ms</span>
        </div>
        <div class="directus-settings__checks">
          <strong>최근 연결 검사</strong>
          <div v-for="check in checks.slice(0, 10)" :key="check.id" class="directus-settings__check">
            <span>{{ check.environment }} v{{ check.version }} · {{ check.status }}</span>
            <em>{{ check.healthStatus || check.errorCode || '-' }} · {{ check.durationMs }}ms</em>
          </div>
          <small v-if="!checks.length">연결 검사 이력이 없습니다.</small>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.directus-settings { display: grid; gap: 16px; }
.directus-settings__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.directus-settings__header h2 { margin: 3px 0 6px; }
.directus-settings__header p { margin: 0; color: var(--app-sub); }
.eyebrow { color: var(--app-accent); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.directus-settings__flags { display: flex; flex-wrap: wrap; gap: 8px; }
.directus-settings__flags span { padding: 5px 9px; border-radius: 999px; background: var(--app-panel-subtle, #f1f3f5); color: var(--app-sub); font-size: 12px; }
.directus-settings__flags span.on { background: color-mix(in srgb, var(--app-accent) 14%, white); color: var(--app-accent); }
.directus-settings__notice { padding: 12px; border: 1px solid var(--app-line); border-radius: 8px; background: var(--app-panel-subtle, #f7f7f7); }
.directus-settings__grid { display: grid; grid-template-columns: minmax(180px, 250px) 1fr; gap: 16px; }
.directus-settings__history, .directus-settings__editor { padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; }
.directus-settings__history { display: flex; flex-direction: column; gap: 6px; }
.directus-settings__history h3 { margin: 0 0 8px; }
.directus-settings__environment { margin-top: 8px; color: var(--app-sub); font-size: 11px; text-transform: uppercase; }
.directus-settings__history button { display: flex; justify-content: space-between; padding: 9px; border: 1px solid var(--app-line); border-radius: 7px; background: transparent; color: inherit; }
.directus-settings__history button.selected { border-color: var(--app-accent); }
.directus-settings__history em { color: var(--app-sub); font-style: normal; }
.directus-settings__editor { display: grid; gap: 14px; }
.directus-settings__validation, .directus-settings__result { padding: 12px; border-radius: 8px; background: #fff3f2; }
.directus-settings__result { display: flex; justify-content: space-between; background: #f5f5f5; }
.directus-settings__result.passed { background: #e8f7ee; }
.directus-settings__checks { display: grid; gap: 6px; padding-top: 12px; border-top: 1px solid var(--app-line); }
.directus-settings__check { display: flex; justify-content: space-between; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--app-line); }
.directus-settings__check em { color: var(--app-sub); font-style: normal; }
@media (max-width: 800px) { .directus-settings__grid { grid-template-columns: 1fr; } }
</style>
