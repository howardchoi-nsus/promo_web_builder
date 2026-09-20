<script setup>
import { computed, ref, watch } from "vue";
import PromoReadonlyRenderer from "../../../visual-editor/src/runtime/PromoReadonlyRenderer.vue";
import { sectionLayoutPresetService } from "../services/section-layout-preset-service.mjs";
import {
  createSectionLayoutPreviewSnapshot,
  normalizeSectionLayoutSnapshot,
  sectionLayoutTree,
  updateSectionLayoutGeometry,
  updateSectionLayoutVisibility,
} from "../services/section-layout-workbench.mjs";
import DomStructureTree from "./DomStructureTree.vue";
import LivePreviewHost from "./LivePreviewHost.vue";

const props = defineProps({
  section: { type: Object, required: true },
  layout: { type: Object, required: true },
  items: { type: Array, default: () => [] },
});
const emit = defineEmits(["saved", "close"]);
const viewport = ref("desktop");
const selectedPath = ref("root");
const snapshot = ref(normalizeSectionLayoutSnapshot(props.layout.layoutSnapshot, props.items));
const saving = ref(false);
const error = ref("");
const editable = computed(() => props.section.status === "draft");
const nodes = computed(() => sectionLayoutTree(props.section, props.items));
const selectedNode = computed(() => nodes.value.find((node) => node.path === selectedPath.value) || nodes.value[0]);
const selectedItem = computed(() => selectedNode.value?.itemKey
  ? props.items.find((item) => item.itemKey === selectedNode.value.itemKey) || null
  : null);
const activeViewport = computed(() => viewport.value === "mobile" ? "mobile" : "desktop");
const selectedGeometry = computed(() => selectedItem.value
  ? snapshot.value.viewports[activeViewport.value].items[selectedItem.value.itemKey]
  : null);
const selectedVisible = computed(() => selectedItem.value
  ? snapshot.value.viewports[activeViewport.value].visibility.items[selectedItem.value.itemKey] !== false
  : true);
const previewSnapshot = computed(() => createSectionLayoutPreviewSnapshot(props.section, props.items, snapshot.value));
const selectedNodeKey = computed(() => selectedItem.value?.itemKey || props.section.sectionKey);

watch(() => [props.layout.id, props.items], () => {
  snapshot.value = normalizeSectionLayoutSnapshot(props.layout.layoutSnapshot, props.items);
  selectedPath.value = "root";
}, { deep: true });

function numberValue(value, fallback = 0) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
}

function updateSectionStyle(property, value) {
  snapshot.value = {
    ...snapshot.value,
    sectionStyle: { ...snapshot.value.sectionStyle, [property]: value },
  };
}

function updateGeometry(property, value) {
  if (!selectedItem.value) return;
  snapshot.value = updateSectionLayoutGeometry(snapshot.value, activeViewport.value, selectedItem.value.itemKey, {
    [property]: numberValue(value, selectedGeometry.value?.[property] || 0),
  });
}

function updateVisibility(visible) {
  if (!selectedItem.value) return;
  snapshot.value = updateSectionLayoutVisibility(snapshot.value, activeViewport.value, selectedItem.value.itemKey, visible);
}

function selectPreviewNode(payload) {
  if (!payload.itemKey) return;
  const node = nodes.value.find((entry) => entry.itemKey === payload.itemKey);
  if (node) selectedPath.value = node.path;
}

async function save() {
  if (!editable.value || saving.value) return;
  saving.value = true;
  error.value = "";
  try {
    const result = await sectionLayoutPresetService.update(props.layout.id, props.section.id, {
      layoutSnapshot: snapshot.value,
      changeNote: "관리자 DOM 구성 Workbench에서 레이아웃 프리셋 변경.",
    });
    emit("saved", result);
  } catch (caught) {
    error.value = caught.validationErrors?.[0]?.message || caught.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <section class="section-layout-dom-workbench" aria-label="섹션 DOM 구성 Workbench">
    <header>
      <div><strong>{{ layout.name }} · DOM 구성</strong><small>{{ layout.layoutKey }} · 저장 대상: 선택한 레이아웃 프리셋</small></div>
      <div class="action-row">
        <button class="tiny-button" type="button" @click="emit('close')">닫기</button>
        <button class="tiny-button primary" type="button" :disabled="!editable || saving" @click="save">{{ saving ? '저장 중…' : '프리셋 저장' }}</button>
      </div>
    </header>
    <p v-if="error" class="field-error">{{ error }}</p>
    <p v-if="!editable" class="empty-state compact">활성·비활성 섹션은 읽기 전용입니다.</p>
    <div class="section-layout-dom-workbench__grid">
      <DomStructureTree :nodes="nodes" :selected-path="selectedPath" aria-label="섹션 구성 구조" @select="selectedPath = $event" />
      <section class="section-layout-dom-workbench__inspector" aria-label="선택 구성 속성">
        <template v-if="!selectedItem">
          <strong>Section</strong>
          <label>최소 높이<input type="number" min="50" max="2400" :value="snapshot.sectionStyle.minHeight" :disabled="!editable" @input="updateSectionStyle('minHeight', numberValue($event.target.value, 320))" /></label>
          <label>배경색<input type="color" :value="snapshot.sectionStyle.backgroundColor || '#ffffff'" :disabled="!editable" @input="updateSectionStyle('backgroundColor', $event.target.value)" /></label>
        </template>
        <template v-else>
          <strong>{{ selectedItem.name || selectedItem.itemKey }}</strong>
          <small>{{ activeViewport }} Geometry</small>
          <label>X (%)<input type="number" min="0" max="100" step="0.5" :value="selectedGeometry.xPct" :disabled="!editable" @input="updateGeometry('xPct', $event.target.value)" /></label>
          <label>Y (px)<input type="number" min="0" max="2400" :value="selectedGeometry.yPx" :disabled="!editable" @input="updateGeometry('yPx', $event.target.value)" /></label>
          <label>너비 (%)<input type="number" min="1" max="100" step="0.5" :value="selectedGeometry.widthPct" :disabled="!editable" @input="updateGeometry('widthPct', $event.target.value)" /></label>
          <label>높이 (px)<input type="number" min="20" max="2400" :value="selectedGeometry.heightPx" :disabled="!editable" @input="updateGeometry('heightPx', $event.target.value)" /></label>
          <label>Z-index<input type="number" min="0" max="100" :value="selectedGeometry.zIndex" :disabled="!editable" @input="updateGeometry('zIndex', $event.target.value)" /></label>
          <label class="inline-check"><input type="checkbox" :checked="selectedVisible" :disabled="!editable || selectedItem.isRequired || selectedItem.isLocked" @change="updateVisibility($event.target.checked)" /><span>이 화면에서 표시</span></label>
        </template>
      </section>
      <LivePreviewHost v-model="viewport" mode="section" :selected-node-key="selectedNodeKey" title="Section Live Preview" @select-node="selectPreviewNode">
        <PromoReadonlyRenderer :snapshot="previewSnapshot" :viewport-override="activeViewport" />
      </LivePreviewHost>
    </div>
  </section>
</template>

<style scoped>
.section-layout-dom-workbench{display:grid;gap:12px;margin-top:12px;padding:14px;border:1px solid var(--app-line);border-radius:10px;background:var(--app-panel)}
.section-layout-dom-workbench>header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.section-layout-dom-workbench>header>div:first-child{display:grid;gap:3px}.section-layout-dom-workbench>header small{color:var(--app-sub)}
.section-layout-dom-workbench__grid{display:grid;grid-template-columns:190px 220px minmax(0,1fr);gap:10px;min-height:420px}
.section-layout-dom-workbench__inspector{display:grid;align-content:start;gap:9px;padding:10px;border:1px solid var(--app-line);background:var(--app-panel)}
.section-layout-dom-workbench__inspector label{display:grid;gap:4px;color:var(--app-sub);font-size:11px;font-weight:800}.section-layout-dom-workbench__inspector label.inline-check{grid-template-columns:auto 1fr;align-items:center}
@media(max-width:1100px){.section-layout-dom-workbench__grid{grid-template-columns:180px 1fr}.section-layout-dom-workbench__grid>:last-child{grid-column:1/-1}}
@media(max-width:700px){.section-layout-dom-workbench__grid{grid-template-columns:1fr}.section-layout-dom-workbench__grid>:last-child{grid-column:auto}}
</style>
