<script>
import { designTokenService } from '../services/design-token-service.mjs';
import { TOKEN_TYPES, TOKEN_CATEGORIES, analyzeTokenLibrary, parseTokenCsv, exportTokenCsv } from '../../../shared/design-token-library.mjs';

export default {
  name: 'DesignTokenManager',
  props: { translate: { type: Function, required: true } },
  emits: ['status', 'token-sets-changed'],
  data() {
    return {
      tokens: [], versionId: null, activeVersionId: null, versions: [], initial: false,
      busy: false, loaded: false, error: '', message: '', selectedCategory: '', search: '',
      types: TOKEN_TYPES, extraCategories: [], showAdd: false, categoryName: '',
      form: { category: 'Color', type: 'color', name: '', value: '', reference: '' },
      importPreview: null, baseline: '', selectedHistory: '',
    };
  },
  computed: {
    categories() { return [...new Set([...TOKEN_CATEGORIES, ...this.extraCategories, ...this.tokens.map(t => t.category)])]; },
    filteredTokens() { const q = this.search.trim().toLowerCase(); return this.tokens.filter(t => (!this.selectedCategory || t.category === this.selectedCategory) && (!q || [t.name, t.type, t.value, t.reference].some(v => String(v).toLowerCase().includes(q)))); },
    analysis() { return analyzeTokenLibrary(this.tokens); },
    states() { return Object.fromEntries(this.analysis.tokens.map(t => [t.name, t.state])); },
    dirty() { return this.loaded && exportTokenCsv(this.tokens) !== this.baseline; },
    activeCount() { return this.analysis.tokens.filter(t => t.state === 'active').length; },
  },
  mounted() { globalThis.addEventListener('beforeunload', this.beforeLeave); this.load(); },
  beforeUnmount() { globalThis.removeEventListener('beforeunload', this.beforeLeave); },
  methods: {
    beforeLeave(e) { if (this.dirty) { e.preventDefault(); e.returnValue = ''; } },
    async run(action) { this.busy = true; this.error = ''; this.message = ''; try { return await action(); } catch (e) { this.error = e.message; return null; } finally { this.busy = false; } },
    async load(versionId = '') {
      if (this.dirty && !globalThis.confirm('저장하지 않은 변경사항을 버릴까요?')) return;
      await this.run(async () => {
        const r = await designTokenService.library(versionId);
        this.tokens = r.tokens; this.versionId = r.versionId; this.activeVersionId = r.activeVersionId;
        this.versions = r.versions; this.initial = r.initial; this.loaded = true;
        this.baseline = exportTokenCsv(this.tokens); this.selectedHistory = r.versionId || '';
      });
    },
    async save() {
      if (this.analysis.errors.length) { this.error = '아래 오류를 수정한 후 저장하세요.'; return; }
      await this.run(async () => {
        const r = await designTokenService.saveLibrary({ tokens: this.tokens, expectedVersionId: this.activeVersionId });
        this.baseline = exportTokenCsv(this.tokens);
        const data = await designTokenService.library();
        this.tokens = data.tokens; this.versionId = data.versionId; this.activeVersionId = data.activeVersionId;
        this.versions = data.versions; this.selectedHistory = data.versionId; this.initial = false;
        this.baseline = exportTokenCsv(this.tokens);
        this.message = `공통 디자인 토큰을 저장했습니다. 미완성 ${r.warnings.length}개는 실제 적용에서 제외됩니다.`;
        this.$emit('token-sets-changed'); this.$emit('status', this.message);
      });
    },
    categoryCount(category) { return this.tokens.filter(t => t.category === category).length; },
    onTabKey(event) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...event.currentTarget.querySelectorAll('[role="tab"]')];
      const index = tabs.indexOf(event.target); if (index < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].click(); tabs[next].focus();
    },
    addCategory() {
      const name = this.categoryName.trim(); if (!name || name.length > 80) return;
      if (!this.categories.includes(name)) this.extraCategories.push(name);
      this.selectedCategory = name; this.categoryName = ''; this.openAdd();
    },
    openAdd() {
      const category = this.selectedCategory || 'Color';
      const type = ({ Color: 'color', Typography: 'typography', Shadow: 'shadow', Grid: 'number' })[category] || 'dimension';
      this.form = { category, type, name: '', value: '', reference: '' }; this.showAdd = true; this.error = '';
    },
    addToken() {
      const candidate = { ...this.form };
      const result = analyzeTokenLibrary([...this.tokens, candidate]);
      if (result.errors.length) { this.error = result.errors.map(e => `${e.token}: ${e.message}`).join('\n'); return; }
      this.tokens.push(candidate); this.selectedCategory = candidate.category; this.showAdd = false;
    },
    removeToken(token) {
      const users = this.tokens.filter(t => t.reference === token.name);
      if (users.length) { this.error = `참조 중인 토큰이 있습니다: ${users.map(t => t.name).join(', ')}`; return; }
      if (!globalThis.confirm(`${token.name}을 목록에서 제거할까요? 저장 전까지 실제 반영되지 않습니다.`)) return;
      this.tokens = this.tokens.filter(t => t !== token);
    },
    downloadCsv() {
      // Export every category, even when a tab or search is active.
      const url = URL.createObjectURL(new Blob([exportTokenCsv(this.tokens)], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'design-tokens-dark.csv'; a.click(); URL.revokeObjectURL(url);
    },
    async uploadCsv(event) {
      const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
      if (file.size > 2 * 1024 * 1024) { this.error = 'CSV 파일은 2MB 이하여야 합니다.'; return; }
      await this.run(async () => {
        const tokens = parseTokenCsv(await file.text()); const result = analyzeTokenLibrary(tokens);
        if (result.errors.length) throw new Error(result.errors.slice(0, 20).map(e => `${e.row || ''}행 ${e.token || ''}: ${e.message}`).join('\n'));
        this.importPreview = { ...result, fileName: file.name };
      });
    },
    applyImport() { this.tokens = this.importPreview.tokens; this.message = 'CSV를 편집 목록에 반영했습니다. 저장 버튼을 눌러야 실제 적용됩니다.'; this.importPreview = null; this.selectedCategory = ''; },
  },
};
</script>

<template>
  <section class="token-library" aria-labelledby="token-library-title">
    <header class="token-library-header">
      <div><h2 id="token-library-title">디자인 토큰</h2><p>하나의 공통 라이브러리를 카테고리별로 관리합니다. Dark 전용입니다.</p></div>
      <div class="token-library-actions">
        <button type="button" :disabled="busy || !loaded" @click="downloadCsv">전체 CSV 다운로드</button>
        <label class="token-library-upload">전체 CSV 업로드<input aria-label="전체 CSV 업로드" type="file" accept=".csv,text/csv" :disabled="busy || !loaded" @change="uploadCsv"></label>
        <button type="button" class="primary" :disabled="busy || !loaded || !!analysis.errors.length || (!dirty && !initial && versionId === activeVersionId)" @click="save">{{ busy ? '처리 중…' : versionId !== activeVersionId ? '이 버전을 새 버전으로 복원' : '변경사항 저장' }}</button>
      </div>
    </header>
    <p v-if="!loaded && busy" role="status">디자인 토큰을 불러오고 있습니다.</p>
    <p v-if="initial && loaded" class="token-library-notice">공통 라이브러리의 초기 값입니다. 저장하면 새로운 페이지 생성에 적용됩니다. 이전 결과물은 유지됩니다.</p>
    <p v-if="dirty" role="status">저장하지 않은 변경사항이 있습니다.</p>
    <p v-if="error" class="token-library-error" role="alert">{{ error }}</p>
    <p v-if="message" role="status">{{ message }}</p>
    <div v-if="loaded" class="token-library-meta">
      <span>전체 {{ tokens.length }}개 · 적용 가능 {{ activeCount }}개 · 미완성 {{ analysis.warnings.length }}개</span>
      <label>버전 이력 <select :value="selectedHistory" :disabled="busy" @change="load($event.target.value)"><option v-if="!versions.length" value="">초기 토큰</option><option v-for="v in versions" :key="v.id" :value="v.id">v{{ v.version }}{{ v.id === activeVersionId ? ' · 현재' : '' }}</option></select></label>
      <button type="button" :disabled="busy" @click="load()">새로고침</button>
    </div>
    <template v-if="loaded">
      <div class="token-library-tabs" role="tablist" aria-label="디자인 토큰 카테고리" @keydown="onTabKey">
        <button type="button" role="tab" id="token-tab-all" :aria-selected="!selectedCategory" :tabindex="!selectedCategory ? 0 : -1" aria-controls="token-panel" :disabled="busy" @click="selectedCategory = ''">전체 ({{ tokens.length }})</button>
        <button v-for="(category, i) in categories" :id="`token-tab-${i}`" :key="category" type="button" role="tab" :aria-selected="selectedCategory === category" :tabindex="selectedCategory === category ? 0 : -1" aria-controls="token-panel" :disabled="busy" @click="selectedCategory = category">{{ category }} ({{ categoryCount(category) }})</button>
      </div>
      <div class="token-library-toolbar">
        <input v-model="search" aria-label="토큰 검색" placeholder="토큰명·유형·값 검색" :disabled="busy">
        <button type="button" :disabled="busy" @click="openAdd">{{ selectedCategory || '카테고리' }} 토큰 추가</button>
        <form @submit.prevent="addCategory"><input v-model="categoryName" aria-label="새 카테고리 이름" maxlength="80" placeholder="새 카테고리"><button :disabled="busy || !categoryName.trim()">카테고리 추가</button></form>
      </div>
      <form v-if="showAdd" class="token-library-add" aria-label="토큰 추가" @submit.prevent="addToken">
        <label>카테고리<select v-model="form.category"><option v-for="c in categories" :key="c">{{ c }}</option></select></label>
        <label>토큰 유형<select v-model="form.type"><option v-for="t in types" :key="t">{{ t }}</option></select></label>
        <label>토큰명<input v-model.trim="form.name" required placeholder="--spacing-20"></label>
        <label>값<textarea v-model="form.value" placeholder="직접 값 또는 Typography JSON"></textarea></label>
        <label>참조 토큰<input v-model.trim="form.reference" placeholder="--unit-20"></label>
        <button :disabled="busy">목록에 추가</button><button type="button" @click="showAdd = false">취소</button>
      </form>
      <div v-if="importPreview" class="token-library-import" role="region" aria-label="CSV 가져오기 미리보기">
        <h3>CSV 가져오기 확인</h3><p>{{ importPreview.fileName }} · {{ importPreview.tokens.length }}개 · 미완성 {{ importPreview.warnings.length }}개</p>
        <p>적용하면 현재 편집 목록 전체를 교체합니다. 미완성 항목은 보관되지만 실제 적용에서 제외됩니다.</p>
        <button type="button" @click="applyImport">편집 목록에 반영</button><button type="button" @click="importPreview = null">취소</button>
      </div>
      <div v-if="analysis.errors.length" class="token-library-error" role="alert"><strong>검증 오류 {{ analysis.errors.length }}개</strong><p v-for="(e, i) in analysis.errors.slice(0, 20)" :key="i">{{ e.token }}: {{ e.message }}</p></div>
      <div id="token-panel" role="tabpanel" :aria-labelledby="selectedCategory ? `token-tab-${categories.indexOf(selectedCategory)}` : 'token-tab-all'" class="token-library-table">
        <table><thead><tr><th>카테고리</th><th>토큰 유형</th><th>토큰명</th><th>값</th><th>참조 토큰</th><th>적용</th><th><span class="token-library-sr">작업</span></th></tr></thead>
          <tbody><tr v-for="(token, index) in filteredTokens" :key="tokens.indexOf(token)">
            <td>{{ token.category }}</td><td><select v-model="token.type" :aria-label="`${token.name} 유형`" :disabled="busy"><option v-for="t in types" :key="t">{{ t }}</option></select></td>
            <td><code>{{ token.name }}</code></td>
            <td><textarea v-model="token.value" :aria-label="`${token.name} 값`" :disabled="busy" rows="2" placeholder="직접 값"></textarea></td>
            <td><input v-model.trim="token.reference" :aria-label="`${token.name} 참조`" :disabled="busy" placeholder="참조 토큰명"></td>
            <td>{{ states[token.name] === 'active' ? '가능' : '미완성' }}</td><td><button type="button" :aria-label="`${token.name} 제거`" :disabled="busy" @click="removeToken(token)">제거</button></td>
          </tr><tr v-if="!filteredTokens.length"><td colspan="7">이 카테고리에 토큰을 추가하세요.</td></tr></tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
.token-library { display: grid; gap: 16px; min-width: 0; color: var(--app-ink, #182033); }
.token-library-header,.token-library-meta,.token-library-actions,.token-library-toolbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.token-library-header { justify-content:space-between; }
.token-library-header h2 { margin:0; }.token-library-header p { color:var(--app-muted,#596579); }
.token-library button,.token-library-upload { border:1px solid var(--app-line,#d4dbe7); background:var(--app-panel,#fff); color:inherit; border-radius:6px; padding:9px 12px; cursor:pointer; }
.token-library button:disabled { opacity:.5;cursor:default; }.token-library .primary { background:var(--app-accent,#365cdd);color:white; }
.token-library input,.token-library select,.token-library textarea { box-sizing:border-box; max-width:100%; border:1px solid var(--app-line,#d4dbe7); border-radius:5px; background:var(--app-panel,#fff); color:inherit;padding:8px; }
.token-library textarea { width:100%; min-width:220px; resize:vertical; font:12px/1.5 monospace; }
.token-library-upload input { display:block;max-width:220px; margin-top:4px; }
.token-library-tabs { display:flex;gap:6px;overflow:auto;padding-bottom:6px; }.token-library-tabs button { flex-shrink:0; }
.token-library-tabs [aria-selected=true] { background:var(--app-accent,#365cdd);color:white; }
.token-library-toolbar form { display:flex; gap:8px; }.token-library-add { display:flex;flex-wrap:wrap;gap:12px;padding:16px;border:1px solid var(--app-line,#d4dbe7); }.token-library-add label { display:grid;gap:5px; }
.token-library-table { overflow:auto; max-height:65vh; }.token-library-table table { width:100%;border-collapse:collapse; }.token-library th,.token-library td { border-bottom:1px solid var(--app-line,#d4dbe7);padding:10px;text-align:left;vertical-align:top; }.token-library th { position:sticky;top:0;background:var(--app-panel,#fff); }.token-library code { font-size:12px;word-break:break-all;min-width:220px;display:block; }
.token-library-error { white-space:pre-wrap;background:#fff0f0;color:#9f2020;padding:12px; }.token-library-notice,.token-library-import { padding:14px;border:1px solid var(--app-line,#d4dbe7);background:var(--app-bg,#f5f7fc); }.token-library-sr { position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%); }
</style>
