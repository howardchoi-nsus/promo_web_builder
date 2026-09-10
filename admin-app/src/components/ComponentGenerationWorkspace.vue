<script>
import RenderSpecEditor from "./RenderSpecEditor.vue";

const TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;
const RUN_STORAGE_KEY = "promo-component-generation-active-run";

export default {
  name: "ComponentGenerationWorkspace",
  components: { RenderSpecEditor },
  emits: ["notify"],
  data: () => ({
    file: null, sourceUrl: "", imageDataUrl: "", sourceName: "", sourceSize: 0, sourceDimensions: null,
    crop: { x: 0, y: 0, width: 1, height: 1 }, sourceId: "", sourceImageUrl: "", sourceError: "",
    componentIntent: "", selectedRoles: [], tokenSets: [], targetTokenVersionId: "",
    run: null, proposal: null, busy: false, saving: false, error: "", viewport: "desktop", mobileReviewed: false, pollTimer: null,
  }),
  computed: {
    currentStep() { if (this.proposal) return 4; if (this.busy || this.run) return 3; if (this.sourceUrl) return 2; return 1; },
    statusLabel() { if (this.busy) return "AI 분석 중"; if (this.run?.status === "failed") return "분석 실패"; if (this.proposal) return "검토 가능"; return "이미지 선택 대기"; },
    canAnalyze() { return Boolean((this.sourceId || this.imageDataUrl) && this.componentIntent.trim() && !this.busy); },
    cropStyle() { return { left: `${this.crop.x * 100}%`, top: `${this.crop.y * 100}%`, width: `${this.crop.width * 100}%`, height: `${this.crop.height * 100}%` }; },
    fields() { return this.proposal?.componentDefinition?.fields || []; },
    validation() { return this.proposal?.validationResult || {}; },
  },
  async mounted() {
    this.loadTokenSets();
    const runId = localStorage.getItem(RUN_STORAGE_KEY);
    if (runId) await this.restoreRun(runId);
  },
  beforeUnmount() { this.releaseUrl(); if (this.pollTimer) clearTimeout(this.pollTimer); },
  methods: {
    releaseUrl() { if (this.sourceUrl?.startsWith("blob:")) URL.revokeObjectURL(this.sourceUrl); this.sourceUrl = ""; },
    async selectSource(event) {
      const file = event.target.files?.[0]; this.sourceError = ""; this.error = "";
      if (!file) return;
      if (!TYPES.has(file.type)) return this.rejectSource("PNG, JPEG 또는 WebP 이미지를 선택해 주세요.");
      if (file.size > MAX_BYTES) return this.rejectSource("이미지 크기는 10MB 이하여야 합니다.");
      this.releaseUrl(); this.file = file; this.sourceUrl = URL.createObjectURL(file); this.sourceName = file.name; this.sourceSize = file.size;
      this.imageDataUrl = await this.readDataUrl(file); this.sourceDimensions = await this.readDimensions(this.sourceUrl);
      this.sourceId = ""; this.sourceImageUrl = ""; this.run = null; this.proposal = null; this.crop = { x: 0, y: 0, width: 1, height: 1 };
      localStorage.removeItem(RUN_STORAGE_KEY); this.$emit("notify", "분석할 이미지를 선택했습니다. 영역을 조정해 주세요.");
    },
    rejectSource(message) { this.clearSource(); this.sourceError = message; },
    clearSource() { this.releaseUrl(); this.file = null; this.imageDataUrl = ""; this.sourceName = ""; this.sourceSize = 0; this.sourceDimensions = null; this.sourceId = ""; this.sourceImageUrl = ""; this.run = null; this.proposal = null; if (this.$refs.sourceInput) this.$refs.sourceInput.value = ""; localStorage.removeItem(RUN_STORAGE_KEY); },
    readDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); },
    readDimensions(url) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight }); image.onerror = reject; image.src = url; }); },
    createAnalysisDataUrl() { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => { const sx = Math.round(image.naturalWidth * this.crop.x); const sy = Math.round(image.naturalHeight * this.crop.y); const sw = Math.max(1, Math.round(image.naturalWidth * this.crop.width)); const sh = Math.max(1, Math.round(image.naturalHeight * this.crop.height)); const scale = Math.min(1, 2048 / Math.max(sw, sh)); const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(sw * scale)); canvas.height = Math.max(1, Math.round(sh * scale)); canvas.getContext("2d").drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL(this.file?.type === "image/jpeg" ? "image/jpeg" : "image/png", .9)); }; image.onerror = reject; image.src = this.sourceUrl; }); },
    formatBytes(value) { return value < 1024 * 1024 ? `${Math.max(1, Math.round(value / 1024))}KB` : `${(value / 1024 / 1024).toFixed(1)}MB`; },
    clampCrop() { this.crop.x = Math.min(.98, Math.max(0, Number(this.crop.x))); this.crop.y = Math.min(.98, Math.max(0, Number(this.crop.y))); this.crop.width = Math.min(1 - this.crop.x, Math.max(.02, Number(this.crop.width))); this.crop.height = Math.min(1 - this.crop.y, Math.max(.02, Number(this.crop.height))); },
    async loadTokenSets() { try { const result = await fetch("/api/design-token-sets?scope=public").then((response) => response.json()); this.tokenSets = result.tokenSets || []; this.targetTokenVersionId = this.tokenSets.find((set) => set.isDefault)?.versionId || this.tokenSets[0]?.versionId || ""; } catch {} },
    async uploadSource() {
      if (this.sourceId) return this.sourceId;
      const response = await fetch("/api/component-design-sources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl: this.imageDataUrl, analysisImageDataUrl: await this.createAnalysisDataUrl(), fileName: this.sourceName, cropSpec: this.crop }) });
      const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.message || result.error || `이미지 업로드 오류(${response.status})`);
      this.sourceId = result.source.id; this.sourceImageUrl = result.source.imageUrl; return this.sourceId;
    },
    async analyze() {
      if (!this.canAnalyze) return; this.busy = true; this.error = ""; this.proposal = null;
      try {
        const sourceId = await this.uploadSource();
        const response = await fetch("/api/component-generation-runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sourceId, componentIntent: this.componentIntent, allowedSectionRoles: this.selectedRoles, targetDesignTokenSetVersionId: this.targetTokenVersionId }) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) { if (result.runId) { localStorage.setItem(RUN_STORAGE_KEY, result.runId); await this.restoreRun(result.runId); } throw new Error(result.message || result.error || `이미지 분석 오류(${response.status})`); }
        this.setRun(result.run); this.$emit("notify", "이미지 분석과 RenderSpec 검증이 완료되었습니다.");
      } catch (error) { this.error = error.message; this.$emit("notify", `컴포넌트 분석 실패: ${error.message}`); }
      finally { this.busy = false; }
    },
    setRun(run) { this.run = run; this.proposal = run?.proposal || null; if (run?.id) localStorage.setItem(RUN_STORAGE_KEY, run.id); if (run?.source?.imageUrl) { this.sourceImageUrl = run.source.imageUrl; if (!this.sourceUrl) this.sourceUrl = run.source.imageUrl; } if (run?.componentIntent) this.componentIntent = run.componentIntent; if (run?.allowedSectionRoles) this.selectedRoles = run.allowedSectionRoles; if (run?.source?.cropSpec) this.crop = run.source.cropSpec; if (["queued", "analyzing", "validating"].includes(run?.status)) this.schedulePoll(run.id); },
    schedulePoll(id) { if (this.pollTimer) clearTimeout(this.pollTimer); this.pollTimer = setTimeout(() => this.restoreRun(id), 2000); },
    async restoreRun(id) { try { const response = await fetch(`/api/component-generation-runs?id=${encodeURIComponent(id)}`); const result = await response.json(); if (!response.ok) throw new Error(); this.setRun(result.run); } catch { localStorage.removeItem(RUN_STORAGE_KEY); } },
    async saveReview() {
      if (!this.proposal?.id) return; this.saving = true; this.error = "";
      try { const response = await fetch(`/api/component-generation-proposals?id=${encodeURIComponent(this.proposal.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ componentDefinition: this.proposal.componentDefinition, renderSpec: this.proposal.renderSpec }) }); const result = await response.json(); if (!response.ok && !result.proposal) throw new Error(result.message || "검증 저장에 실패했습니다."); this.proposal = { ...this.proposal, ...(result.proposal || {}) }; this.$emit("notify", this.proposal.validationResult?.ok ? "검토 내용과 검증 결과를 저장했습니다." : "검증 오류가 남아 있습니다."); }
      catch (error) { this.error = error.message; } finally { this.saving = false; }
    },
    resetForNew() { this.clearSource(); this.componentIntent = ""; this.selectedRoles = []; this.error = ""; },
  },
};
</script>

<template>
  <section class="generation" aria-labelledby="generation-title">
    <header class="generation-header"><div><p class="eyebrow">Component Generation · CDR-09</p><h2 id="generation-title">이미지에서 DOM 컴포넌트 생성</h2><p>이미지 영역을 분석해 필드, 안전한 DOM RenderSpec과 디자인 토큰 연결을 제안합니다.</p></div><span class="status" :class="run?.status">{{ statusLabel }}</span></header>
    <ol class="steps"><li v-for="(label,index) in ['이미지 선택','영역 선택','AI 분석','결과 검토','Draft 준비']" :key="label" :class="{ active: currentStep === index + 1, done: currentStep > index + 1 }"><strong>{{ index + 1 }}</strong><span>{{ label }}</span></li></ol>
    <div v-if="!proposal" class="work-grid">
      <section class="card">
        <div class="card-title"><div><span>Step 1–2</span><h3>분석 이미지와 영역</h3></div><button v-if="sourceUrl" class="tiny-button" type="button" @click="clearSource">다시 선택</button></div>
        <label v-if="!sourceUrl" class="dropzone"><input ref="sourceInput" type="file" accept="image/png,image/jpeg,image/webp" @change="selectSource"><strong>디자인 이미지 선택</strong><span>PNG, JPEG, WebP · 최대 10MB</span><small>생성할 컴포넌트가 선명하게 보이는 이미지를 권장합니다.</small></label>
        <div v-else class="crop-stage"><img :src="sourceUrl" alt="분석 원본"><div class="crop-box" :style="cropStyle"><span>분석 영역</span></div></div>
        <p v-if="sourceUrl" class="file-info">{{ sourceName || '기존 업로드 이미지' }}<template v-if="sourceSize"> · {{ formatBytes(sourceSize) }}</template><template v-if="sourceDimensions"> · {{ sourceDimensions.width }}×{{ sourceDimensions.height }}</template></p>
        <p v-if="sourceError" class="error">{{ sourceError }}</p>
        <fieldset v-if="sourceUrl" class="crop-controls"><legend>영역 좌표 (이미지 비율)</legend><label v-for="key in ['x','y','width','height']" :key="key"><span>{{ key }}</span><input v-model.number="crop[key]" type="range" min="0" max="1" step="0.01" @input="clampCrop"><em>{{ Math.round(crop[key] * 100) }}%</em></label></fieldset>
        <label class="field"><span>생성 목적</span><textarea v-model="componentIntent" rows="3" placeholder="예: 이미지, 제목, 설명, CTA가 포함된 프로모션 카드"></textarea></label>
        <fieldset><legend>사용할 섹션 역할</legend><div class="roles"><label v-for="role in ['header','hero','benefit','content','cta','notice','terms','legal','footer']" :key="role"><input v-model="selectedRoles" type="checkbox" :value="role"><span>{{ role }}</span></label></div></fieldset>
        <label v-if="tokenSets.length" class="field"><span>대상 디자인 토큰</span><select v-model="targetTokenVersionId"><option v-for="set in tokenSets" :key="set.versionId" :value="set.versionId">{{ set.name }}<template v-if="set.isDefault"> · 기본</template></option></select></label>
      </section>
      <aside class="card readiness"><div class="card-title"><div><span>Step 3</span><h3>AI 이미지 분석</h3></div></div><ul class="checklist"><li><span>실제 파일 형식·크기 검증</span><em>{{ sourceUrl ? '준비' : '대기' }}</em></li><li><span>정규화 Crop 영역</span><em>{{ sourceUrl ? '준비' : '대기' }}</em></li><li><span>DOM·필드·토큰 분석</span><em>{{ busy ? '진행 중' : '대기' }}</em></li><li><span>보안·접근성 검증</span><em>자동</em></li><li><span>기존 컴포넌트 유사도</span><em>자동</em></li></ul><p v-if="error" class="error">{{ error }}</p><button class="tiny-button primary analyze" type="button" :disabled="!canAnalyze" @click="analyze">{{ busy ? '이미지를 분석하고 있습니다…' : run?.status === 'failed' ? '원본 업로드 없이 다시 분석' : '분석 시작' }}</button><small v-if="busy">프롬프트 설정과 모델에 따라 최대 3분이 걸릴 수 있습니다.</small><small v-else>관리자에서 활성화한 컴포넌트 이미지 분석 프롬프트와 모델 설정을 사용합니다.</small></aside>
    </div>
    <div v-else class="result-stack">
      <section class="card"><div class="card-title"><div><span>Step 4</span><h3>{{ proposal.componentDefinition.name }}</h3><p>{{ proposal.componentDefinition.description }}</p></div><div class="confidence"><strong>{{ Math.round((proposal.confidence || 0) * 100) }}%</strong><span>분석 신뢰도</span></div></div><div class="badges"><span :class="{ good: validation.ok }">{{ validation.ok ? 'RenderSpec 검증 통과' : `검증 오류 ${validation.errors?.length || 0}건` }}</span><span v-if="proposal.componentDefinition.reviewRequired">관리자 검토 필요</span><span>{{ fields.length }}개 필드</span></div><label class="field"><span>컴포넌트 이름</span><input v-model="proposal.componentDefinition.name"></label><label class="field"><span>설명</span><input v-model="proposal.componentDefinition.description"></label></section>
      <section class="comparison"><article class="card"><div class="card-title"><div><span>Original</span><h3>선택한 이미지 영역</h3></div></div><div class="crop-stage"><img :src="sourceImageUrl || sourceUrl" alt="분석 원본"><div class="crop-box" :style="cropStyle"></div></div></article><article class="card"><div class="card-title"><div><span>Validation</span><h3>분석 품질 확인</h3></div></div><p v-if="validation.metrics" class="file-info">노드 {{ validation.metrics.nodeCount }} · 필드 노드 {{ validation.metrics.fieldNodeCount }} · 깊이 {{ validation.metrics.maxDepth }}</p><div v-if="validation.errors?.length" class="validation-errors"><strong>수정할 항목</strong><p v-for="item in validation.errors" :key="`${item.path}:${item.code}`">{{ item.path }} · {{ item.message }}</p></div><p v-else class="empty">보안·접근성·필드 참조 검증을 통과했습니다.</p></article></section>
      <RenderSpecEditor v-model="proposal.renderSpec" :fields="fields" :source-image-url="sourceImageUrl || sourceUrl" />
      <section class="comparison"><article class="card"><div class="card-title"><div><span>Detected fields</span><h3>콘텐츠 필드</h3></div></div><ul class="field-list"><li v-for="field in fields" :key="field.fieldKey"><strong>{{ field.name }}</strong><span>{{ field.fieldKind }} · {{ field.fieldKey }}</span></li></ul></article><article class="card"><div class="card-title"><div><span>Similarity</span><h3>유사 컴포넌트와 생성 방식</h3></div></div><ul v-if="proposal.similarComponents?.length" class="field-list"><li v-for="item in proposal.similarComponents" :key="item.componentId"><strong>{{ item.name }}</strong><span>유사도 {{ Math.round(item.score * 100) }}% · {{ item.score >= .75 ? '새 버전 후보' : '참고' }}</span></li></ul><p v-else class="empty">유사한 기존 컴포넌트가 없습니다.</p><div class="roles"><label><input v-model="proposal.componentDefinition.creationMode" type="radio" value="new-component"><span>새 컴포넌트</span></label><label v-if="proposal.similarComponents?.length"><input v-model="proposal.componentDefinition.creationMode" type="radio" value="new-version"><span>기존 컴포넌트의 새 버전</span></label></div><label v-if="proposal.componentDefinition.creationMode === 'new-version'" class="field"><span>대상 컴포넌트</span><select v-model="proposal.componentDefinition.targetComponentId"><option v-for="item in proposal.similarComponents" :key="item.componentId" :value="item.componentId">{{ item.name }} · {{ Math.round(item.score * 100) }}%</option></select></label></article></section>
      <section v-if="proposal.reviewNotes?.length" class="card"><div class="card-title"><div><span>Review notes</span><h3>검토 메모</h3></div></div><ul><li v-for="note in proposal.reviewNotes" :key="note">{{ note }}</li></ul></section>
      <p v-if="error" class="error">{{ error }}</p><div class="result-actions"><button class="tiny-button" type="button" @click="analyze">같은 이미지로 다시 분석</button><button class="tiny-button" type="button" @click="resetForNew">새 이미지 분석</button><button class="tiny-button primary" type="button" :disabled="saving" @click="saveReview">{{ saving ? '저장 중' : '수정 내용 재검증·저장' }}</button><button class="tiny-button" type="button" disabled>컴포넌트 Draft 생성 · CDR-10</button></div><label class="mobile-check"><input v-model="mobileReviewed" type="checkbox"><span>Mobile 미리보기와 오버플로를 확인했습니다.</span></label><p class="next-note">CDR-09 범위는 분석 결과 검토·수정·재검증까지입니다. 실제 컴포넌트 Draft 반영은 다음 단계에서 수행합니다.</p>
    </div>
  </section>
</template>

<style scoped>
.generation{display:grid;gap:20px}.generation-header,.card-title{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.generation-header>div,.card-title>div{display:grid;gap:5px}.generation-header p,.card-title p{margin:0;color:var(--sub);line-height:1.5}.eyebrow,.card-title>div>span{color:var(--accent)!important;font-size:11px;font-weight:900;text-transform:uppercase}.status{padding:7px 10px;border:1px solid var(--line);background:var(--surface-2);font-size:12px;font-weight:800}.status.ready{border-color:#19965b;color:#137a49}.status.failed{border-color:var(--danger);color:var(--danger)}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:0;padding:0;list-style:none}.steps li{display:flex;align-items:center;gap:8px;padding:9px;border:1px solid var(--line);color:var(--sub)}.steps strong{display:grid;place-items:center;width:24px;height:24px;border:1px solid currentColor}.steps .active{border-color:var(--accent);background:var(--accent-soft);color:var(--ink)}.steps .done{color:#137a49}.work-grid,.comparison{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(320px,.7fr);gap:16px;align-items:start}.card{display:grid;gap:14px;padding:18px;border:1px solid var(--line);background:var(--panel)}.dropzone{position:relative;display:grid;place-items:center;gap:8px;min-height:300px;border:1px dashed var(--line-strong);background:var(--surface-2);cursor:pointer}.dropzone input{position:absolute;opacity:0}.crop-stage{position:relative;display:grid;place-items:center;min-height:260px;overflow:hidden;background:#161616}.crop-stage img{display:block;max-width:100%;max-height:500px}.crop-box{position:absolute;border:2px solid #57d1ff;box-shadow:0 0 0 9999px rgb(0 0 0/.42);pointer-events:none}.crop-box span{position:absolute;top:0;left:0;padding:4px;background:#57d1ff;color:#00131b;font-size:10px;font-weight:900}.file-info,.empty,.next-note{margin:0;color:var(--sub);font-size:12px}.crop-controls{display:grid;gap:8px}.crop-controls label{display:grid;grid-template-columns:48px 1fr 44px;align-items:center;gap:8px}.crop-controls em{font-style:normal;font-size:11px}.roles,.badges,.result-actions{display:flex;flex-wrap:wrap;gap:7px}.roles label{display:flex;gap:5px;padding:7px;border:1px solid var(--line)}.readiness{position:sticky;top:16px}.checklist,.field-list{display:grid;margin:0;padding:0;border:1px solid var(--line);list-style:none}.checklist li,.field-list li{display:flex;justify-content:space-between;gap:10px;padding:10px;border-bottom:1px solid var(--line)}.checklist em,.field-list span{color:var(--sub);font-size:11px;font-style:normal}.analyze{width:100%;min-height:44px}.error,.validation-errors{padding:10px;border:1px solid var(--danger);color:var(--danger);font-size:12px}.result-stack{display:grid;gap:16px}.confidence{display:grid;text-align:right}.confidence strong{font-size:28px}.confidence span{color:var(--sub);font-size:11px}.badges span{padding:5px 8px;border:1px solid #d88b32;color:#9a5c12;font-size:11px}.badges span.good{border-color:#19965b;color:#137a49}.mobile-check{display:flex;gap:7px}.next-note{padding:10px;border-left:3px solid var(--accent);background:var(--surface-2)}@media(max-width:980px){.steps,.work-grid,.comparison{grid-template-columns:1fr}.readiness{position:static}}
</style>
