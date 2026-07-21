(function initializeTemplateLayoutManager(global) {
  async function requestLayout(templateId) {
    const response = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(templateId)}`, { cache: "no-store" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `Layout request failed (${response.status})`);
    return result;
  }

  function editorUrl(templateId) {
    const url = new URL("/prototype/visual-editor.html", global.location.origin);
    url.searchParams.set("mode", "admin-layout");
    url.searchParams.set("templateId", templateId);
    return url.toString();
  }

  const service = Object.freeze({ requestLayout, editorUrl });
  const component = {
    name: "TemplateLayoutManager",
    props: {
      template: { type: Object, required: true },
      statusLabel: { type: Function, required: true },
    },
    data() {
      return { layoutRevision: null, loading: false, error: "" };
    },
    watch: {
      "template.id": { immediate: true, handler() { this.loadLayout(); } },
    },
    methods: {
      async loadLayout() {
        if (!this.template?.id) return;
        this.loading = true;
        this.error = "";
        try {
          const result = await service.requestLayout(this.template.id);
          this.layoutRevision = Number(result.layout?.layoutRevision || 1);
        } catch (error) {
          this.error = error.message;
        } finally {
          this.loading = false;
        }
      },
      openEditor() {
        if (!this.template?.id || this.template.status !== "draft") return;
        global.open(service.editorUrl(this.template.id), "_blank", "noopener");
      },
    },
    template: `
      <section class="template-layout-settings" aria-labelledby="template-layout-manager-title">
        <div class="template-layout-settings-copy">
          <span class="template-layout-settings-eyebrow">WIZARD STEP 2 DEFAULT</span>
          <h3 id="template-layout-manager-title">템플릿 기본 레이아웃</h3>
          <p>Wizard의 배경, 섹션 높이, Item 위치와 글자 스타일을 설정합니다. 사용자 작업별 변경은 관리자 템플릿에 역반영되지 않습니다.</p>
          <span class="template-layout-settings-state" :class="'status-' + template.status">
            v{{ template.version }} · {{ statusLabel(template.status) }}<template v-if="layoutRevision"> · Layout r{{ layoutRevision }}</template>
          </span>
          <small v-if="loading">Layout 정보를 확인하는 중입니다.</small>
          <small class="field-error" v-else-if="error">{{ error }}</small>
        </div>
        <div class="template-layout-settings-actions">
          <button class="tiny-button primary template-layout-settings-button" type="button" :disabled="template.status !== 'draft'" @click="openEditor">레이아웃 편집 열기</button>
          <small v-if="template.status !== 'draft'">활성 버전은 읽기 전용입니다. 먼저 새 초안을 만들어 주세요.</small>
          <small v-else>편집 내용은 Draft에만 반영되며 템플릿 활성화 후 Create Promo에서 사용됩니다.</small>
        </div>
      </section>
    `,
  };

  global.PromoAdminTemplateLayout = { service, component };
})(window);
