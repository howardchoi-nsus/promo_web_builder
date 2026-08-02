<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { sectionLayoutPresetService } from "../services/section-layout-preset-service.mjs";

const props = defineProps({
  section: { type: Object, required: true },
  items: { type: Array, default: () => [] },
  layout: { type: Object, required: true },
  createMode: { type: Boolean, default: false },
  aiAllowed: { type: Boolean, default: false },
});
const emit = defineEmits(["saved", "created", "close", "set-default", "toggle-ai", "delete"]);

const saving = ref(false);
const error = ref("");
const savedMessage = ref("");
const viewport = ref("desktop");
const selectedItemKey = ref("");
const editor = ref(null);
const undoStack = ref([]);
const redoStack = ref([]);
const canvas = ref(null);
const makeDefault = ref(false);
const allowAi = ref(false);
let pointerOperation = null;

const readOnly = computed(() => props.section?.status !== "draft");
const currentViewport = computed(() => (
  editor.value?.layoutSnapshot?.viewports?.[viewport.value] || { items: {}, visibility: { items: {} } }
));
const selectedGeometry = computed(() => currentViewport.value.items?.[selectedItemKey.value] || null);
const canvasHeight = computed(() => Math.max(160, Number(editor.value?.layoutSnapshot?.sectionStyle?.minHeight || 160)));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hydrateMissingItems(snapshot, sectionItems) {
  ["desktop", "mobile"].forEach((targetViewport) => {
    snapshot.viewports ||= {};
    snapshot.viewports[targetViewport] ||= { items: {}, visibility: { items: {} } };
    const target = snapshot.viewports[targetViewport];
    target.items ||= {};
    target.visibility ||= { items: {} };
    target.visibility.items ||= {};
    sectionItems.forEach((item, index) => {
      if (target.items[item.itemKey]) return;
      const mobile = targetViewport === "mobile";
      target.items[item.itemKey] = {
        positionMode: "free",
        xPct: mobile ? 5 : 4 + ((index % 2) * 48),
        yPx: 16 + (Math.floor(index / (mobile ? 1 : 2)) * 72),
        widthPct: mobile ? 90 : 44,
        heightPx: 52,
        zIndex: 1,
      };
    });
  });
  return snapshot;
}

function resetEditor() {
  if (!props.layout) return;
  editor.value = {
    name: props.layout.name,
    description: props.layout.description || "",
    changeNote: "",
    layoutSnapshot: hydrateMissingItems(clone(props.layout.layoutSnapshot), props.items),
  };
  makeDefault.value = props.layout.isDefault === true;
  allowAi.value = props.createMode ? props.section?.aiDesign?.enabled !== false : props.aiAllowed;
  selectedItemKey.value = props.items.find((item) => (
    editor.value.layoutSnapshot.viewports.desktop.items[item.itemKey]
  ))?.itemKey || "";
  undoStack.value = [];
  redoStack.value = [];
  error.value = "";
  savedMessage.value = "";
}

watch(() => [props.layout?.id, props.items.map((item) => item.itemKey).join("|")], resetEditor, { immediate: true });

function snapshotState() {
  return editor.value ? clone(editor.value) : null;
}

function checkpoint() {
  if (!editor.value || readOnly.value) return;
  undoStack.value.push(snapshotState());
  if (undoStack.value.length > 60) undoStack.value.shift();
  redoStack.value = [];
  savedMessage.value = "";
}

function undo() {
  if (!undoStack.value.length || !editor.value) return;
  redoStack.value.push(snapshotState());
  editor.value = undoStack.value.pop();
}

function redo() {
  if (!redoStack.value.length || !editor.value) return;
  undoStack.value.push(snapshotState());
  editor.value = redoStack.value.pop();
}

function visible(itemKey) {
  return currentViewport.value.visibility?.items?.[itemKey] !== false;
}

function setVisibility(itemKey, value) {
  checkpoint();
  currentViewport.value.visibility.items[itemKey] = value;
}

function geometryStyle(itemKey) {
  const geometry = currentViewport.value.items?.[itemKey];
  if (!geometry) return { display: "none" };
  return {
    left: `${geometry.xPct}%`,
    top: `${geometry.yPx}px`,
    width: `${geometry.widthPct}%`,
    height: `${geometry.heightPx}px`,
    zIndex: geometry.zIndex ?? 1,
    opacity: visible(itemKey) ? 1 : 0.28,
  };
}

function endPointer() {
  pointerOperation = null;
  globalThis.removeEventListener("pointermove", movePointer);
  globalThis.removeEventListener("pointerup", endPointer);
  globalThis.removeEventListener("pointercancel", endPointer);
}

function startPointer(event, itemKey, operation) {
  if (readOnly.value) return;
  const geometry = currentViewport.value.items?.[itemKey];
  const rect = canvas.value?.getBoundingClientRect();
  if (!geometry || !rect) return;
  event.preventDefault();
  checkpoint();
  selectedItemKey.value = itemKey;
  pointerOperation = {
    operation,
    itemKey,
    startX: event.clientX,
    startY: event.clientY,
    rect,
    geometry: clone(geometry),
  };
  globalThis.addEventListener("pointermove", movePointer);
  globalThis.addEventListener("pointerup", endPointer, { once: true });
  globalThis.addEventListener("pointercancel", endPointer, { once: true });
}

function movePointer(event) {
  if (!pointerOperation) return;
  const geometry = currentViewport.value.items[pointerOperation.itemKey];
  const deltaXPct = ((event.clientX - pointerOperation.startX) / pointerOperation.rect.width) * 100;
  const deltaY = event.clientY - pointerOperation.startY;
  if (pointerOperation.operation === "move") {
    geometry.xPct = Math.max(0, Math.min(
      100 - geometry.widthPct,
      Number((pointerOperation.geometry.xPct + deltaXPct).toFixed(2)),
    ));
    geometry.yPx = Math.max(0, Math.min(
      1200 - geometry.heightPx,
      Math.round(pointerOperation.geometry.yPx + deltaY),
    ));
    return;
  }
  geometry.widthPct = Math.max(1, Math.min(
    100 - geometry.xPct,
    Number((pointerOperation.geometry.widthPct + deltaXPct).toFixed(2)),
  ));
  geometry.heightPx = Math.max(1, Math.min(900, Math.round(pointerOperation.geometry.heightPx + deltaY)));
}

async function save() {
  if (readOnly.value || saving.value || !editor.value) return;
  saving.value = true;
  error.value = "";
  savedMessage.value = "";
  try {
    if (!String(editor.value.name || "").trim()) {
      error.value = "Layout Preset 이름을 입력해 주세요.";
      return;
    }
    const payload = {
      name: editor.value.name,
      description: editor.value.description,
      changeNote: editor.value.changeNote || (props.createMode
        ? "Live Preview에서 Layout Preset 생성."
        : "Section Preset Live Preview에서 Layout 수정."),
      layoutSnapshot: editor.value.layoutSnapshot,
    };
    const result = props.createMode
      ? await sectionLayoutPresetService.create({
        sectionId: props.section.id,
        ...payload,
        isDefault: makeDefault.value,
      })
      : await sectionLayoutPresetService.update(props.layout.id, props.section.id, payload);
    editor.value = {
      ...editor.value,
      name: result.layout.name,
      description: result.layout.description || "",
      changeNote: "",
      layoutSnapshot: clone(result.layout.layoutSnapshot),
    };
    undoStack.value = [];
    redoStack.value = [];
    savedMessage.value = props.createMode ? "현재 Layout을 Preset으로 저장했습니다." : "Layout Preset을 저장했습니다.";
    if (props.createMode) emit("created", { layout: result.layout, allowAi: allowAi.value });
    else emit("saved", result.layout);
  } catch (saveError) {
    error.value = saveError.validationErrors?.[0]?.message || saveError.message;
  } finally {
    saving.value = false;
  }
}

onBeforeUnmount(endPointer);
</script>

<template>
  <section v-if="editor" class="section-layout-live-editor">
    <header class="live-editor-header">
      <div>
        <strong>{{ createMode ? '새 Layout Preset' : 'Live Preview' }}</strong>
        <span>{{ layout.layoutKey }} · {{ viewport }}</span>
      </div>
      <div class="live-editor-actions">
        <button class="tiny-button" type="button" :disabled="!undoStack.length || readOnly" @click="undo">실행 취소</button>
        <button class="tiny-button" type="button" :disabled="!redoStack.length || readOnly" @click="redo">다시 실행</button>
        <button v-if="!createMode" class="tiny-button" type="button" :disabled="readOnly || layout.isDefault" @click="emit('set-default')">기본 Preset으로 지정</button>
        <button v-if="!createMode" class="tiny-button" type="button" :disabled="readOnly" @click="emit('toggle-ai')">{{ aiAllowed ? 'AI 허용 해제' : 'AI 사용 허용' }}</button>
        <button v-if="!createMode" class="tiny-button danger" type="button" :disabled="readOnly || aiAllowed" @click="emit('delete')">Preset 삭제</button>
        <button class="tiny-button" type="button" @click="emit('close')">닫기</button>
        <button class="tiny-button primary" type="button" :disabled="readOnly || saving" @click="save">{{ saving ? '저장 중…' : (createMode ? '현재 Layout을 Preset으로 저장' : '변경사항 저장') }}</button>
      </div>
    </header>

    <div class="live-editor-meta">
      <label><span>이름</span><input v-model="editor.name" :disabled="readOnly" @focus="checkpoint" /></label>
      <label><span>설명</span><input v-model="editor.description" :disabled="readOnly" @focus="checkpoint" /></label>
      <label><span>변경 사유</span><input v-model="editor.changeNote" :disabled="readOnly" placeholder="저장 이력에 기록" /></label>
      <div class="live-viewport-switch" role="group" aria-label="미리보기 화면 크기">
        <button type="button" :class="{ active: viewport === 'desktop' }" @click="viewport = 'desktop'">Desktop</button>
        <button type="button" :class="{ active: viewport === 'mobile' }" @click="viewport = 'mobile'">Mobile</button>
      </div>
    </div>

    <div v-if="createMode" class="live-preset-options" aria-label="새 Preset 적용 정책">
      <label><input v-model="makeDefault" type="checkbox" :disabled="readOnly || layout.isDefault" /><span>기본 Preset으로 지정</span></label>
      <label><input v-model="allowAi" type="checkbox" :disabled="readOnly || section.aiDesign?.enabled === false" /><span>AI 사용 허용</span></label>
      <small>배치를 확인한 뒤 저장하면 그때 Preset이 생성됩니다.</small>
    </div>

    <div class="live-editor-body">
      <section class="live-preview-stage">
        <div
          ref="canvas"
          class="live-preview-canvas"
          :class="`viewport-${viewport}`"
          :style="{ height: `${canvasHeight}px`, backgroundColor: editor.layoutSnapshot.sectionStyle.backgroundColor }"
        >
          <article
            v-for="item in items"
            :key="item.itemKey"
            class="live-preview-item"
            :class="[{ selected: selectedItemKey === item.itemKey }, `kind-${item.fieldKind || 'text'}`]"
            :style="geometryStyle(item.itemKey)"
            @pointerdown="startPointer($event, item.itemKey, 'move')"
            @click="selectedItemKey = item.itemKey"
          >
            <strong>{{ item.name }}</strong>
            <small>{{ item.fieldKind === 'image' ? 'Image' : item.fieldKind === 'cta' ? 'CTA Button' : item.itemKey }}</small>
            <button class="live-resize-handle" type="button" aria-label="크기 변경" @pointerdown.stop="startPointer($event, item.itemKey, 'resize')"></button>
          </article>
        </div>
      </section>

      <aside class="live-editor-inspector">
        <div class="live-section-controls">
          <label><span>Section 높이</span><input v-model.number="editor.layoutSnapshot.sectionStyle.minHeight" type="number" min="1" max="1200" :disabled="readOnly" @focus="checkpoint" /></label>
          <label><span>배경색</span><input v-model="editor.layoutSnapshot.sectionStyle.backgroundColor" type="color" :disabled="readOnly" @focus="checkpoint" /></label>
        </div>
        <div class="live-item-list">
          <button v-for="item in items" :key="item.itemKey" type="button" :class="{ active: selectedItemKey === item.itemKey }" @click="selectedItemKey = item.itemKey">{{ item.name }}</button>
        </div>
        <template v-if="selectedGeometry">
          <label class="live-visibility"><input :checked="visible(selectedItemKey)" type="checkbox" :disabled="readOnly" @change="setVisibility(selectedItemKey, $event.target.checked)" /><span>{{ viewport }}에서 표시</span></label>
          <div class="live-geometry-grid">
            <label><span>X (%)</span><input v-model.number="selectedGeometry.xPct" type="number" min="0" max="100" :disabled="readOnly" @focus="checkpoint" /></label>
            <label><span>Y (px)</span><input v-model.number="selectedGeometry.yPx" type="number" min="0" max="1200" :disabled="readOnly" @focus="checkpoint" /></label>
            <label><span>너비 (%)</span><input v-model.number="selectedGeometry.widthPct" type="number" min="1" max="100" :disabled="readOnly" @focus="checkpoint" /></label>
            <label><span>높이 (px)</span><input v-model.number="selectedGeometry.heightPx" type="number" min="1" max="900" :disabled="readOnly" @focus="checkpoint" /></label>
            <label><span>Z-index</span><input v-model.number="selectedGeometry.zIndex" type="number" min="0" max="100" :disabled="readOnly" @focus="checkpoint" /></label>
          </div>
        </template>
        <p v-if="readOnly" class="live-notice">읽기 전용 버전입니다. Section 초안을 만든 후 수정할 수 있습니다.</p>
        <p v-if="error" class="live-error">{{ error }}</p>
        <p v-if="savedMessage" class="live-success">{{ savedMessage }}</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.section-layout-live-editor { display: grid; gap: 12px; margin-top: 14px; padding: 14px; border: 1px solid var(--app-line); border-radius: 8px; background: var(--app-panel); }
.live-editor-header, .live-editor-header > div, .live-editor-actions, .live-viewport-switch, .live-visibility { display: flex; align-items: center; }
.live-editor-header { justify-content: space-between; gap: 12px; }
.live-editor-header > div:first-child { gap: 8px; }
.live-editor-header span { color: var(--app-sub); font-size: 12px; }
.live-editor-actions { flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.live-editor-meta { display: grid; grid-template-columns: minmax(140px, .7fr) minmax(180px, 1fr) minmax(180px, 1fr) auto; gap: 8px; align-items: end; }
.live-preset-options { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; padding: 10px 12px; border: 1px solid var(--app-line); border-radius: 6px; background: var(--app-surface); }
.live-preset-options label { display: inline-flex; align-items: center; gap: 6px; color: var(--app-ink); font-size: 12px; font-weight: 750; }
.live-preset-options small { color: var(--app-sub); }
.live-editor-meta label, .live-editor-inspector label { display: grid; gap: 5px; color: var(--app-sub); font-size: 11px; font-weight: 750; }
.live-editor-meta input, .live-editor-inspector input { width: 100%; min-height: 32px; border: 1px solid var(--app-line); border-radius: 5px; background: var(--app-surface); color: var(--app-ink); }
.live-viewport-switch { gap: 4px; }
.live-viewport-switch button, .live-item-list button { min-height: 32px; border: 1px solid var(--app-line); background: var(--app-surface); color: var(--app-sub); cursor: pointer; }
.live-viewport-switch button.active, .live-item-list button.active { border-color: var(--app-accent); background: var(--app-accent-soft); color: var(--app-accent); }
.live-editor-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(220px, 270px); gap: 12px; min-width: 0; }
.live-preview-stage { min-width: 0; padding: 16px; overflow: auto; border: 1px solid var(--app-line); background: var(--app-bg); }
.live-preview-canvas { position: relative; width: min(100%, 1100px); min-width: 520px; margin: 0 auto; overflow: hidden; border: 1px solid var(--app-line-strong); box-shadow: var(--app-shadow); touch-action: none; }
.live-preview-canvas.viewport-mobile { width: 390px; min-width: 390px; }
.live-preview-item { position: absolute; display: grid; place-content: center; min-width: 1px; min-height: 1px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--app-accent) 45%, var(--app-line)); border-radius: 6px; background: color-mix(in srgb, var(--app-panel) 88%, transparent); color: var(--app-ink); text-align: center; cursor: move; user-select: none; }
.live-preview-item.kind-image { background: color-mix(in srgb, var(--app-accent-soft) 65%, var(--app-panel)); }
.live-preview-item.kind-cta { border-radius: 999px; background: var(--app-accent); color: var(--app-on-accent); }
.live-preview-item.selected { outline: 2px solid var(--app-focus); outline-offset: 2px; }
.live-preview-item strong { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.live-preview-item small { opacity: .72; font-size: 10px; }
.live-resize-handle { position: absolute; right: 0; bottom: 0; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 0; background: var(--app-accent); cursor: nwse-resize; }
.live-editor-inspector { display: grid; gap: 12px; align-content: start; padding: 12px; border: 1px solid var(--app-line); background: var(--app-surface); }
.live-section-controls, .live-geometry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.live-section-controls input[type="color"] { padding: 3px; }
.live-item-list { display: grid; gap: 4px; }
.live-item-list button { padding: 0 8px; text-align: left; }
.live-visibility { grid-template-columns: auto 1fr; gap: 7px; }
.live-visibility input { width: auto; min-height: auto; }
.live-notice, .live-error, .live-success { margin: 0; font-size: 12px; }
.live-notice { color: var(--app-sub); }.live-error { color: var(--app-danger); }.live-success { color: var(--app-success); }
@media (max-width: 1000px) { .live-editor-meta, .live-editor-body { grid-template-columns: 1fr; } .live-editor-header { align-items: flex-start; flex-direction: column; } .live-editor-actions { justify-content: flex-start; } }
</style>
