<script setup>
import { computed, onMounted, ref } from "vue";
import PromoPageRenderer from "./PromoPageRenderer.vue";
import { persistSnapshot, withoutFreePosition } from "./editor-utils.mjs";
import {
  DESIGN_COLOR_TOKENS,
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
const designSpec = ref(JSON.parse(JSON.stringify(DEFAULT_DESIGN_SPEC)));
const selectedSectionKey = ref("");
const selectedItemKey = ref("");
const expandedSectionKey = ref("");
const viewport = ref("desktop");
const guidesVisible = ref(true);
const backgroundImageError = ref("");
const outputSaveError = ref("");
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
  designSpec: designSpec.value,
}) : null);
const rendererSnapshot = computed(() => props.mode === "output" ? outputSnapshot.value : editorSnapshot.value);

function selectItem(section, item) {
  if (!section) return;
  selectedSectionKey.value = section.sectionKey;
  selectedItemKey.value = item?.itemKey || "";
}

function toggleSection(section) {
  if (!section) return;
  if (expandedSectionKey.value === section.sectionKey) {
    expandedSectionKey.value = "";
    return;
  }
  expandedSectionKey.value = section.sectionKey;
  selectItem(section, section.items?.[0]);
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

function updateRendererContent(section, item, value) {
  selectItem(section, item);
  if (item.fieldKind !== "text" || item.isLocked) return;
  updateSelectedValue(value);
}

function updateBackgroundToken(token) {
  designSpec.value = {
    ...designSpec.value,
    theme: {
      ...designSpec.value.theme,
      backgroundColor: token.value,
      backgroundToken: token.key,
      textColor: token.textColor,
    },
  };
}

function attachBackgroundImage(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  backgroundImageError.value = "";
  if (!file.type.startsWith("image/")) {
    backgroundImageError.value = "이미지 파일만 첨부할 수 있습니다.";
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    backgroundImageError.value = "배경 이미지는 3MB 이하 파일을 사용해주세요.";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    outputSaveError.value = "";
    designSpec.value = {
      ...designSpec.value,
      theme: {
        ...designSpec.value.theme,
        backgroundImage: String(reader.result || ""),
        backgroundImageName: file.name,
      },
    };
  };
  reader.onerror = () => {
    backgroundImageError.value = "배경 이미지를 불러오지 못했습니다.";
  };
  reader.readAsDataURL(file);
}

function removeBackgroundImage() {
  designSpec.value = {
    ...designSpec.value,
    theme: {
      ...designSpec.value.theme,
      backgroundImage: "",
      backgroundImageName: "",
    },
  };
  backgroundImageError.value = "";
  outputSaveError.value = "";
}

const selectedStyleKey = computed(() => (
  selectedSection.value && selectedItem.value
    ? `${selectedSection.value.sectionKey}.${selectedItem.value.itemKey}`
    : ""
));
const selectedItemStyle = computed(() => designSpec.value.itemStyles?.[selectedStyleKey.value] || {});
const selectedSectionStyle = computed(() => (
  selectedSection.value
    ? designSpec.value.sectionStyles?.[selectedSection.value.sectionKey] || {}
    : {}
));

function updateItemStyle(patch) {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  designSpec.value = {
    ...designSpec.value,
    itemStyles: {
      ...(designSpec.value.itemStyles || {}),
      [selectedStyleKey.value]: {
        ...selectedItemStyle.value,
        ...patch,
      },
    },
  };
}

function updateRendererItemStyle(section, item, patch) {
  if (!section || !item) return;
  const key = `${section.sectionKey}.${item.itemKey}`;
  designSpec.value = {
    ...designSpec.value,
    itemStyles: {
      ...(designSpec.value.itemStyles || {}),
      [key]: {
        ...(designSpec.value.itemStyles?.[key] || {}),
        ...patch,
      },
    },
  };
}

function resetItemStyle() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const nextStyles = { ...(designSpec.value.itemStyles || {}) };
  delete nextStyles[selectedStyleKey.value];
  designSpec.value = { ...designSpec.value, itemStyles: nextStyles };
}

function restoreAutomaticPosition() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const nextStyles = { ...(designSpec.value.itemStyles || {}) };
  const nextStyle = withoutFreePosition(nextStyles[selectedStyleKey.value]);
  if (Object.keys(nextStyle).length) nextStyles[selectedStyleKey.value] = nextStyle;
  else delete nextStyles[selectedStyleKey.value];
  designSpec.value = { ...designSpec.value, itemStyles: nextStyles };
}

function updateSectionStyle(sectionKey, patch) {
  if (!sectionKey) return;
  designSpec.value = {
    ...designSpec.value,
    sectionStyles: {
      ...(designSpec.value.sectionStyles || {}),
      [sectionKey]: {
        ...(designSpec.value.sectionStyles?.[sectionKey] || {}),
        ...patch,
      },
    },
  };
}

function resetSectionHeight() {
  if (!selectedSection.value) return;
  const nextStyles = { ...(designSpec.value.sectionStyles || {}) };
  const nextSectionStyle = { ...(nextStyles[selectedSection.value.sectionKey] || {}) };
  delete nextSectionStyle.minHeight;
  if (Object.keys(nextSectionStyle).length) nextStyles[selectedSection.value.sectionKey] = nextSectionStyle;
  else delete nextStyles[selectedSection.value.sectionKey];
  designSpec.value = { ...designSpec.value, sectionStyles: nextStyles };
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
    expandedSectionKey.value = sections.value[0]?.sectionKey || "";
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function openOutput() {
  if (!editorSnapshot.value) return;
  outputSaveError.value = "";
  const result = persistSnapshot(localStorage, SNAPSHOT_STORAGE_KEY, editorSnapshot.value);
  if (!result.ok) {
    outputSaveError.value = result.message;
    return;
  }
  window.open("/prototype/visual-output.html", "_blank", "noopener");
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
      <a href="/prototype/visual-editor.html">Visual Editor로 돌아가기</a>
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
      <div class="editor-global-actions">
        <fieldset class="global-token-menu">
          <legend>페이지 배경</legend>
          <div class="global-token-swatches">
            <button
              v-for="token in DESIGN_COLOR_TOKENS"
              :key="token.key"
              type="button"
              :class="{ active: designSpec.theme.backgroundColor === token.value }"
              :title="`${token.name} ${token.value}`"
              :aria-label="`${token.name} ${token.value}`"
              @click="updateBackgroundToken(token)"
            >
              <i :style="{ backgroundColor: token.value }"></i>
            </button>
          </div>
        </fieldset>
        <div class="background-image-control">
          <label class="background-image-button">
            <input type="file" accept="image/*" @change="attachBackgroundImage" />
            <span>{{ designSpec.theme.backgroundImage ? "배경 이미지 교체" : "배경 이미지 첨부" }}</span>
          </label>
          <span v-if="designSpec.theme.backgroundImageName" class="background-image-name">{{ designSpec.theme.backgroundImageName }}</span>
          <button v-if="designSpec.theme.backgroundImage" type="button" class="background-image-remove" @click="removeBackgroundImage">제거</button>
          <small v-if="backgroundImageError" class="background-image-error">{{ backgroundImageError }}</small>
        </div>
        <nav aria-label="Visual Editor navigation">
          <a href="/prototype/index.html">Promo Builder</a>
          <a href="/promo-wizard.html">Promo Wizard</a>
          <button type="button" :disabled="!editorSnapshot" @click="openOutput">Web Output 열기</button>
        </nav>
      </div>
    </header>

    <div v-if="loading" class="system-message">기본 Form Template을 불러오는 중입니다.</div>
    <div v-else-if="error" class="system-message system-message--error">{{ error }}</div>
    <div v-if="outputSaveError" class="system-message system-message--error" role="alert">{{ outputSaveError }}</div>

    <section v-if="!loading && !error" class="editor-workspace">
      <aside class="section-rail" aria-label="콘텐츠 섹션">
        <div class="panel-heading">
          <span>SECTIONS</span>
          <strong>{{ sections.length }}</strong>
        </div>
        <div class="section-list">
          <div
            v-for="section in sections"
            :key="section.sectionKey"
            class="section-accordion"
            :class="{ open: section.sectionKey === expandedSectionKey }"
          >
            <button
              type="button"
              class="section-trigger"
              :class="{ active: section.sectionKey === selectedSection?.sectionKey }"
              :aria-expanded="section.sectionKey === expandedSectionKey"
              @click="toggleSection(section)"
            >
              <span>{{ section.name }}</span>
              <small>{{ section.items?.length || 0 }} items</small>
              <i aria-hidden="true"></i>
            </button>
            <div class="section-accordion__body">
              <div class="section-accordion__items">
                <button
                  v-for="item in section.items || []"
                  :key="item.itemKey"
                  type="button"
                  :class="{ active: section.sectionKey === selectedSection?.sectionKey && item.itemKey === selectedItem?.itemKey }"
                  @click="selectItem(section, item)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!section.items?.length">등록된 아이템 없음</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section class="preview-panel">
        <div class="preview-toolbar">
          <div>
            <strong>Live Preview</strong>
            <small>{{ template.templateKey }} · v{{ template.version }}</small>
          </div>
          <div class="preview-controls">
            <label class="guide-toggle">
              <input v-model="guidesVisible" type="checkbox" />
              <span>Guides</span>
              <strong>{{ guidesVisible ? "ON" : "OFF" }}</strong>
            </label>
            <div class="viewport-control" aria-label="Preview viewport">
              <button type="button" :class="{ active: viewport === 'desktop' }" @click="viewport = 'desktop'">Desktop</button>
              <button type="button" :class="{ active: viewport === 'mobile' }" @click="viewport = 'mobile'">Mobile</button>
            </div>
          </div>
        </div>
        <div class="preview-stage" :class="`preview-stage--${viewport}`">
          <PromoPageRenderer
            v-if="rendererSnapshot"
            :content="rendererSnapshot.content"
            :design-spec="rendererSnapshot.designSpec"
            :assets="rendererSnapshot.assets"
            editable
            :show-guides="guidesVisible"
            :selected-item-key="selectedStyleKey"
            @select-item="selectItem"
            @update-item-style="updateItemStyle"
            @update-renderer-item-style="updateRendererItemStyle"
            @update-item-content="updateRendererContent"
            @update-section-style="updateSectionStyle"
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

          <section class="design-controls">
            <div class="design-controls__heading">
              <strong>DESIGN</strong>
              <button type="button" :disabled="selectedItem.isLocked" @click="resetItemStyle">초기화</button>
            </div>
            <label>
              <span>글자 색상</span>
              <input
                type="color"
                :disabled="selectedItem.isLocked"
                :value="selectedItemStyle.color || '#172033'"
                @input="updateItemStyle({ color: $event.target.value })"
              />
            </label>
            <label>
              <span>폰트 크기</span>
              <div class="range-field">
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.fontSize || 18"
                  @input="updateItemStyle({ fontSize: Number($event.target.value) })"
                />
                <output>{{ selectedItemStyle.fontSize || 18 }}px</output>
              </div>
            </label>
            <label>
              <span>폰트 굵기</span>
              <select
                :disabled="selectedItem.isLocked"
                :value="selectedItemStyle.fontWeight || 400"
                @change="updateItemStyle({ fontWeight: Number($event.target.value) })"
              >
                <option :value="400">Regular</option>
                <option :value="500">Medium</option>
                <option :value="700">Bold</option>
                <option :value="800">Extra Bold</option>
              </select>
            </label>
            <label>
              <span>정렬</span>
              <select
                :disabled="selectedItem.isLocked"
                :value="selectedItemStyle.textAlign || 'left'"
                @change="updateItemStyle({ textAlign: $event.target.value })"
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </label>
            <div class="position-status">
              <span>위치</span>
              <strong v-if="selectedItemStyle.positionMode === 'free'">
                X {{ Math.round(selectedItemStyle.xPct || 0) }}% · Y {{ Math.round(selectedItemStyle.yPx || 0) }}px
              </strong>
              <strong v-else>자동 배치</strong>
            </div>
            <button
              v-if="selectedItemStyle.positionMode === 'free'"
              class="secondary-control"
              type="button"
              :disabled="selectedItem.isLocked"
              @click="restoreAutomaticPosition"
            >
              자동 배치로 복원
            </button>
            <div class="section-size-control">
              <div>
                <span>섹션 높이</span>
                <strong>{{ selectedSectionStyle.minHeight ? `${Math.round(selectedSectionStyle.minHeight)}px` : "자동" }}</strong>
              </div>
              <button
                type="button"
                :disabled="!selectedSectionStyle.minHeight"
                @click="resetSectionHeight"
              >
                높이 초기화
              </button>
            </div>
          </section>
        </div>
      </aside>
    </section>
  </main>
</template>
