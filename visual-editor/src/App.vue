<script setup>
import { computed, onMounted, ref } from "vue";
import PromoPageRenderer from "./PromoPageRenderer.vue";
import {
  DEFAULT_DESIGN_SPEC,
  SNAPSHOT_STORAGE_KEY,
  createSectionInputs,
  createSnapshot,
} from "./contracts";

const props = defineProps({
  mode: { type: String, default: "editor" },
});

const loading = ref(props.mode === "editor");
const error = ref("");
const templates = ref([]);
const template = ref(null);
const configRevision = ref("");
const sections = ref([]);
const sectionInputs = ref({});
const selectedSectionKey = ref("");
const selectedItemKey = ref("");
const viewport = ref("desktop");
const outputSnapshot = ref(null);

const selectedSection = computed(() => sections.value.find((section) => section.sectionKey === selectedSectionKey.value) || sections.value[0]);
const selectedItem = computed(() => selectedSection.value?.items?.find((item) => item.itemKey === selectedItemKey.value) || selectedSection.value?.items?.[0]);
const selectedValue = computed({
  get: () => sectionInputs.value?.[selectedSection.value?.sectionKey]?.[selectedItem.value?.itemKey],
  set: (value) => updateSelectedValue(value),
});
const editorSnapshot = computed(() => template.value ? createSnapshot({
  template: template.value,
  configRevision: configRevision.value,
  sections: sections.value,
  sectionInputs: sectionInputs.value,
}) : null);
const rendererSnapshot = computed(() => props.mode === "output" ? outputSnapshot.value : editorSnapshot.value);

function selectItem(section, item) {
  selectedSectionKey.value = section.sectionKey;
  selectedItemKey.value = item.itemKey;
}

function updateSelectedValue(value) {
  if (!selectedSection.value || !selectedItem.value) return;
  sectionInputs.value = {
    ...sectionInputs.value,
    [selectedSection.value.sectionKey]: {
      ...sectionInputs.value[selectedSection.value.sectionKey],
      [selectedItem.value.itemKey]: value,
    },
  };
}

function updateObjectField(key, value) {
  updateSelectedValue({ ...(selectedValue.value || {}), [key]: value });
}

async function loadEditor() {
  try {
    const listResponse = await fetch("/api/wizard-form-templates-public");
    const listResult = await listResponse.json();
    if (!listResponse.ok) throw new Error(listResult.message || listResult.error || "템플릿 목록을 불러오지 못했습니다.");
    templates.value = listResult.templates || [];
    const defaultTemplate = templates.value.find((candidate) => candidate.isDefault);
    if (!defaultTemplate) throw new Error("활성화된 기본 Form Template이 없습니다.");

    const detailResponse = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(defaultTemplate.id)}`);
    const detailResult = await detailResponse.json();
    if (!detailResponse.ok) throw new Error(detailResult.message || detailResult.error || "템플릿 구성을 불러오지 못했습니다.");
    template.value = detailResult.template;
    configRevision.value = detailResult.configRevision || "";
    sections.value = detailResult.sections || [];
    sectionInputs.value = createSectionInputs(sections.value);
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function openOutput() {
  if (!editorSnapshot.value) return;
  localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(editorSnapshot.value));
  window.open("/visual-output.html", "_blank", "noopener");
}

function loadOutput() {
  try {
    const stored = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!stored) throw new Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
    outputSnapshot.value = JSON.parse(stored);
  } catch (loadError) {
    error.value = loadError.message;
  }
}

onMounted(() => {
  if (props.mode === "output") loadOutput();
  else loadEditor();
});
</script>

<template>
  <div v-if="mode === 'output'" class="output-shell">
    <header class="output-toolbar">
      <div>
        <span>WEB OUTPUT</span>
        <strong>{{ rendererSnapshot?.content?.formTemplate?.name || "Visual Editor" }}</strong>
      </div>
      <a href="/visual-editor.html">Visual Editor로 돌아가기</a>
    </header>
    <div v-if="error" class="system-message system-message--error">{{ error }}</div>
    <PromoPageRenderer
      v-else-if="rendererSnapshot"
      :content="rendererSnapshot.content"
      :design-spec="rendererSnapshot.designSpec"
      :assets="rendererSnapshot.assets"
    />
  </div>

  <main v-else class="editor-shell">
    <header class="editor-header">
      <div>
        <span>VISUAL EDITOR</span>
        <h1>{{ template?.name || "Default Renderer" }}</h1>
      </div>
      <nav aria-label="Visual Editor navigation">
        <a href="/">Promo Builder</a>
        <a href="/promo-wizard.html">Promo Wizard</a>
        <button type="button" :disabled="!editorSnapshot" @click="openOutput">Web Output 열기</button>
      </nav>
    </header>

    <div v-if="loading" class="system-message">기본 Form Template을 불러오는 중입니다.</div>
    <div v-else-if="error" class="system-message system-message--error">{{ error }}</div>

    <section v-else class="editor-workspace">
      <aside class="section-rail" aria-label="콘텐츠 섹션">
        <div class="panel-heading">
          <span>SECTIONS</span>
          <strong>{{ sections.length }}</strong>
        </div>
        <div class="section-list">
          <button
            v-for="section in sections"
            :key="section.sectionKey"
            type="button"
            :class="{ active: section.sectionKey === selectedSection?.sectionKey }"
            @click="selectItem(section, section.items[0])"
          >
            <span>{{ section.name }}</span>
            <small>{{ section.items.length }} items</small>
          </button>
        </div>
        <div v-if="selectedSection" class="item-list">
          <span>ITEMS</span>
          <button
            v-for="item in selectedSection.items"
            :key="item.itemKey"
            type="button"
            :class="{ active: item.itemKey === selectedItem?.itemKey }"
            @click="selectItem(selectedSection, item)"
          >
            {{ item.name }}
          </button>
        </div>
      </aside>

      <section class="preview-panel">
        <div class="preview-toolbar">
          <div>
            <strong>Live Preview</strong>
            <small>{{ template.templateKey }} · v{{ template.version }}</small>
          </div>
          <div class="viewport-control" aria-label="Preview viewport">
            <button type="button" :class="{ active: viewport === 'desktop' }" @click="viewport = 'desktop'">Desktop</button>
            <button type="button" :class="{ active: viewport === 'mobile' }" @click="viewport = 'mobile'">Mobile</button>
          </div>
        </div>
        <div class="preview-stage" :class="`preview-stage--${viewport}`">
          <PromoPageRenderer
            v-if="rendererSnapshot"
            :content="rendererSnapshot.content"
            :design-spec="rendererSnapshot.designSpec"
            :assets="rendererSnapshot.assets"
          />
        </div>
      </section>

      <aside class="property-panel">
        <div class="panel-heading">
          <span>CONTENT</span>
          <strong>{{ selectedItem?.name || "항목 선택" }}</strong>
        </div>

        <div v-if="selectedItem" class="property-form">
          <label v-if="selectedItem.fieldKind === 'cta'">
            <span>버튼 텍스트</span>
            <input :disabled="selectedItem.isLocked" :value="selectedValue?.label" @input="updateObjectField('label', $event.target.value)" />
          </label>
          <label v-if="selectedItem.fieldKind === 'cta'">
            <span>버튼 URL</span>
            <input :disabled="selectedItem.isLocked" type="url" :value="selectedValue?.link" @input="updateObjectField('link', $event.target.value)" />
          </label>

          <template v-else-if="selectedItem.fieldKind === 'image'">
            <label>
              <span>이미지 입력 방식</span>
              <select :disabled="selectedItem.isLocked" :value="selectedValue?.source" @change="updateObjectField('source', $event.target.value)">
                <option v-for="source in selectedItem.image?.allowedSources || ['url']" :key="source" :value="source">{{ source }}</option>
              </select>
            </label>
            <label>
              <span>URL 또는 이미지 설명</span>
              <textarea :disabled="selectedItem.isLocked" rows="4" :value="selectedValue?.value" @input="updateObjectField('value', $event.target.value)"></textarea>
            </label>
            <label v-if="selectedItem.image?.descriptionEnabled">
              <span>설명</span>
              <textarea :disabled="selectedItem.isLocked" rows="3" :value="selectedValue?.description" @input="updateObjectField('description', $event.target.value)"></textarea>
            </label>
            <label v-if="selectedItem.image?.altTextRequired">
              <span>대체 텍스트</span>
              <input :disabled="selectedItem.isLocked" :value="selectedValue?.alt" @input="updateObjectField('alt', $event.target.value)" />
            </label>
          </template>

          <label v-else>
            <span>{{ selectedItem.textType === 'multi' ? '설명 텍스트' : '텍스트' }}</span>
            <textarea v-if="selectedItem.textType === 'multi'" v-model="selectedValue" :disabled="selectedItem.isLocked" rows="8"></textarea>
            <input v-else v-model="selectedValue" :disabled="selectedItem.isLocked" />
          </label>

          <dl class="item-meta">
            <div><dt>Item key</dt><dd>{{ selectedItem.itemKey }}</dd></div>
            <div><dt>필수</dt><dd>{{ selectedItem.isRequired ? "Y" : "N" }}</dd></div>
            <div><dt>고정</dt><dd>{{ selectedItem.isLocked ? "Y" : "N" }}</dd></div>
          </dl>
        </div>
      </aside>
    </section>
  </main>
</template>
