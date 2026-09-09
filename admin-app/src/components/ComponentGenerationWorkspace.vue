<script>
const SUPPORTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

export default {
  name: "ComponentGenerationWorkspace",
  emits: ["notify"],
  data() {
    return {
      sourceUrl: "",
      sourceName: "",
      sourceSize: 0,
      sourceError: "",
      componentIntent: "",
      selectedRoles: [],
    };
  },
  beforeUnmount() {
    this.releaseSourceUrl();
  },
  methods: {
    releaseSourceUrl() {
      if (this.sourceUrl) URL.revokeObjectURL(this.sourceUrl);
      this.sourceUrl = "";
    },
    selectSource(event) {
      const file = event.target.files?.[0] || null;
      this.sourceError = "";
      if (!file) return;
      if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
        this.clearSource();
        this.sourceError = "PNG, JPEG 또는 WebP 이미지를 선택해 주세요.";
        return;
      }
      if (file.size > MAX_SOURCE_BYTES) {
        this.clearSource();
        this.sourceError = "이미지 크기는 10MB 이하여야 합니다.";
        return;
      }
      this.releaseSourceUrl();
      this.sourceUrl = URL.createObjectURL(file);
      this.sourceName = file.name;
      this.sourceSize = file.size;
      this.$emit("notify", "컴포넌트 분석용 이미지를 선택했습니다.");
    },
    clearSource() {
      this.releaseSourceUrl();
      this.sourceName = "";
      this.sourceSize = 0;
      if (this.$refs.sourceInput) this.$refs.sourceInput.value = "";
    },
    formatBytes(value) {
      if (!value) return "";
      if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))}KB`;
      return `${(value / (1024 * 1024)).toFixed(1)}MB`;
    },
    notifyPendingAnalysis() {
      this.$emit("notify", "이미지 분석 API는 다음 개발 단계에서 연결됩니다.");
    },
  },
};
</script>

<template>
  <section class="component-generation-workspace" aria-labelledby="component-generation-title">
    <header class="component-generation-header">
      <div>
        <p class="component-generation-eyebrow">Component Generation</p>
        <h2 id="component-generation-title">이미지 컴포넌트 생성</h2>
        <p>웹 화면이나 디자인 이미지에서 영역을 선택하고, DOM 구조와 디자인 토큰을 가진 컴포넌트 초안을 생성합니다.</p>
      </div>
      <span class="component-generation-status">기능 구성 중</span>
    </header>

    <ol class="component-generation-steps" aria-label="이미지 컴포넌트 생성 단계">
      <li aria-current="step"><strong>1</strong><span>이미지 선택</span></li>
      <li><strong>2</strong><span>영역 선택</span></li>
      <li><strong>3</strong><span>AI 분석</span></li>
      <li><strong>4</strong><span>Live Preview</span></li>
      <li><strong>5</strong><span>초안 생성</span></li>
    </ol>

    <div class="component-generation-grid">
      <section class="component-generation-card" aria-labelledby="component-source-title">
        <div class="component-generation-card__title">
          <div>
            <span>Step 1</span>
            <h3 id="component-source-title">분석할 이미지</h3>
          </div>
          <button v-if="sourceUrl" class="tiny-button" type="button" @click="clearSource">다시 선택</button>
        </div>

        <label class="component-generation-dropzone" :class="{ 'has-source': sourceUrl }">
          <input
            ref="sourceInput"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            @change="selectSource"
          />
          <template v-if="sourceUrl">
            <img :src="sourceUrl" alt="선택한 컴포넌트 분석 이미지 미리보기" />
            <span>{{ sourceName }} · {{ formatBytes(sourceSize) }}</span>
          </template>
          <template v-else>
            <strong>디자인 이미지 선택</strong>
            <span>PNG, JPEG, WebP · 최대 10MB</span>
            <small>전체 화면보다 생성할 컴포넌트가 선명하게 보이는 이미지를 권장합니다.</small>
          </template>
        </label>
        <p v-if="sourceError" class="component-generation-error" role="alert">{{ sourceError }}</p>

        <div class="component-generation-form">
          <label class="field">
            <span>생성 목적</span>
            <textarea
              v-model="componentIntent"
              rows="3"
              placeholder="예: 이미지, 제목, 설명, CTA가 포함된 프로모션 카드"
            ></textarea>
          </label>
          <fieldset>
            <legend>사용할 섹션 역할</legend>
            <div class="component-generation-role-list">
              <label v-for="role in ['header', 'hero', 'benefit', 'content', 'cta', 'notice', 'terms', 'legal', 'footer']" :key="role">
                <input v-model="selectedRoles" type="checkbox" :value="role" />
                <span>{{ role }}</span>
              </label>
            </div>
          </fieldset>
        </div>
      </section>

      <aside class="component-generation-card component-generation-readiness" aria-labelledby="generation-readiness-title">
        <div class="component-generation-card__title">
          <div>
            <span>생성 결과</span>
            <h3 id="generation-readiness-title">DOM RenderSpec 초안</h3>
          </div>
        </div>
        <div class="component-generation-empty">
          <strong>이미지 분석 연결 준비 중</strong>
          <p>분석이 연결되면 DOM 구조, 콘텐츠 필드, 토큰 바인딩과 Desktop·Tablet·Mobile 미리보기가 이 영역에 표시됩니다.</p>
        </div>
        <ul class="component-generation-checklist">
          <li><span>DOM 구조</span><em>대기</em></li>
          <li><span>텍스트·이미지·CTA 필드</span><em>대기</em></li>
          <li><span>디자인 토큰 바인딩</span><em>대기</em></li>
          <li><span>반응형 규칙</span><em>대기</em></li>
          <li><span>보안·접근성 검증</span><em>대기</em></li>
        </ul>
        <button
          class="tiny-button primary component-generation-analyze"
          type="button"
          :disabled="!sourceUrl || !componentIntent.trim()"
          @click="notifyPendingAnalysis"
        >분석 시작</button>
        <small>현재 단계에서는 탭과 입력 Workflow를 제공합니다. 분석·Crop·Draft 저장은 계획서의 후속 Workstream에서 연결합니다.</small>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.component-generation-workspace { display: grid; gap: 20px; }
.component-generation-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
.component-generation-header > div { display: grid; gap: 6px; }
.component-generation-header p { margin: 0; color: var(--sub); line-height: 1.55; }
.component-generation-eyebrow { color: var(--accent) !important; font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
.component-generation-status { flex: 0 0 auto; padding: 7px 10px; border: 1px solid var(--line); background: var(--surface-2); color: var(--sub); font-size: 12px; font-weight: 800; }
.component-generation-steps { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.component-generation-steps li { display: flex; align-items: center; gap: 9px; min-height: 44px; padding: 8px 10px; border: 1px solid var(--line); background: var(--surface-2); color: var(--sub); }
.component-generation-steps li[aria-current="step"] { border-color: var(--accent); background: var(--accent-soft); color: var(--ink); }
.component-generation-steps strong { display: grid; place-items: center; width: 24px; height: 24px; border: 1px solid currentColor; font-size: 11px; }
.component-generation-steps span { font-size: 12px; font-weight: 850; }
.component-generation-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr); gap: 16px; align-items: start; }
.component-generation-card { display: grid; gap: 16px; min-width: 0; padding: 18px; border: 1px solid var(--line); background: var(--panel); }
.component-generation-card__title { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.component-generation-card__title > div { display: grid; gap: 4px; }
.component-generation-card__title span { color: var(--accent); font-size: 11px; font-weight: 900; text-transform: uppercase; }
.component-generation-dropzone { position: relative; display: grid; place-items: center; gap: 8px; min-height: 280px; padding: 18px; overflow: hidden; border: 1px dashed var(--line-strong); background: var(--surface-2); color: var(--sub); text-align: center; cursor: pointer; }
.component-generation-dropzone:hover { border-color: var(--accent); background: var(--accent-soft); }
.component-generation-dropzone input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.component-generation-dropzone img { width: 100%; max-height: 360px; object-fit: contain; }
.component-generation-dropzone.has-source { align-content: center; }
.component-generation-dropzone strong { color: var(--ink); }
.component-generation-dropzone small { max-width: 420px; line-height: 1.5; }
.component-generation-error { margin: -8px 0 0; color: var(--danger); font-size: 12px; font-weight: 750; }
.component-generation-form { display: grid; gap: 14px; }
.component-generation-form fieldset { margin: 0; padding: 12px; border: 1px solid var(--line); }
.component-generation-form legend { padding: 0 6px; color: var(--sub); font-size: 12px; font-weight: 800; }
.component-generation-role-list { display: flex; flex-wrap: wrap; gap: 8px; }
.component-generation-role-list label { display: inline-flex; align-items: center; gap: 6px; min-height: 34px; padding: 0 9px; border: 1px solid var(--line); background: var(--surface-2); cursor: pointer; }
.component-generation-role-list span { font-size: 12px; font-weight: 750; }
.component-generation-readiness { position: sticky; top: 16px; }
.component-generation-empty { padding: 20px; border: 1px dashed var(--line); background: var(--surface-2); text-align: center; }
.component-generation-empty p { margin: 8px 0 0; color: var(--sub); font-size: 12px; line-height: 1.6; }
.component-generation-checklist { display: grid; gap: 0; margin: 0; padding: 0; border: 1px solid var(--line); list-style: none; }
.component-generation-checklist li { display: flex; justify-content: space-between; gap: 12px; padding: 10px 12px; border-bottom: 1px solid var(--line); }
.component-generation-checklist li:last-child { border-bottom: 0; }
.component-generation-checklist span { font-size: 12px; font-weight: 750; }
.component-generation-checklist em { color: var(--sub); font-size: 11px; font-style: normal; }
.component-generation-analyze { width: 100%; min-height: 42px; }
.component-generation-readiness > small { color: var(--sub); line-height: 1.55; }
@media (max-width: 980px) {
  .component-generation-steps { grid-template-columns: 1fr; }
  .component-generation-grid { grid-template-columns: 1fr; }
  .component-generation-readiness { position: static; }
}
@media (max-width: 640px) {
  .component-generation-header { display: grid; }
  .component-generation-dropzone { min-height: 220px; }
}
</style>
