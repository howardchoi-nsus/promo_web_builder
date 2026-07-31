<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { sectionPresetAdapter } from "./platform/adapters/section-preset-adapter.mjs";

const params = new URLSearchParams(globalThis.location?.search || "");
const sectionId = params.get("sectionId") || "";
const requestedLayoutKey = params.get("layoutKey") || "";

const loading = ref(true);
const saving = ref(false);
const error = ref("");
const savedMessage = ref("");
const section = ref(null);
const items = ref([]);
const layouts = ref([]);
const layout = ref(null);
const editor = ref(null);
const viewport = ref("desktop");
const selectedItemKey = ref("");
const undoStack = ref([]);
const redoStack = ref([]);
const canvas = ref(null);
let pointerOperation = null;

const readOnly = computed(() => section.value?.status !== "draft");
const currentViewport = computed(() => editor.value?.layoutSnapshot?.viewports?.[viewport.value] || { items: {}, visibility: { items: {} } });
const selectedItem = computed(() => items.value.find((item) => item.itemKey === selectedItemKey.value) || null);
const selectedGeometry = computed(() => currentViewport.value.items?.[selectedItemKey.value] || null);
const canvasHeight = computed(() => Math.max(160, Number(editor.value?.layoutSnapshot?.sectionStyle?.minHeight || 160)));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hydrateMissingItems(snapshot, sectionItems) {
  ["desktop", "mobile"].forEach((targetViewport) => {
    const target = snapshot.viewports[targetViewport];
    sectionItems.forEach((item, index) => {
      if (target.items[item.itemKey]) return;
      const isMobile = targetViewport === "mobile";
      target.items[item.itemKey] = {
        positionMode: "free",
        xPct: isMobile ? 5 : 4 + ((index % 2) * 48),
        yPx: 16 + (Math.floor(index / (isMobile ? 1 : 2)) * 72),
        widthPct: isMobile ? 90 : 44,
        heightPx: 52,
        zIndex: 1,
      };
    });
  });
  return snapshot;
}

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

function beginNumericEdit() {
  checkpoint();
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
  } else {
    geometry.widthPct = Math.max(1, Math.min(
      100 - geometry.xPct,
      Number((pointerOperation.geometry.widthPct + deltaXPct).toFixed(2)),
    ));
    geometry.heightPx = Math.max(1, Math.min(900, Math.round(pointerOperation.geometry.heightPx + deltaY)));
  }
}

function endPointer() {
  pointerOperation = null;
  globalThis.removeEventListener("pointermove", movePointer);
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    if (!sectionId || !requestedLayoutKey) throw new Error("sectionId와 layoutKey가 필요합니다.");
    const result = await sectionPresetAdapter.load(sectionId);
    const selected = result.layouts.find((entry) => entry.layoutKey === requestedLayoutKey);
    if (!selected) throw new Error("요청한 Layout Preset을 찾을 수 없습니다.");
    section.value = result.section;
    items.value = result.items;
    layouts.value = result.layouts;
    layout.value = selected;
    editor.value = {
      name: selected.name,
      description: selected.description || "",
      changeNote: "",
      layoutSnapshot: hydrateMissingItems(clone(selected.layoutSnapshot), result.items),
    };
    selectedItemKey.value = result.items.find((item) => editor.value.layoutSnapshot.viewports.desktop.items[item.itemKey])?.itemKey || "";
    undoStack.value = [];
    redoStack.value = [];
    await nextTick();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (readOnly.value || saving.value || !editor.value) return;
  saving.value = true;
  error.value = "";
  savedMessage.value = "";
  try {
    const result = await sectionPresetAdapter.update(layout.value.id, sectionId, {
      name: editor.value.name,
      description: editor.value.description,
      changeNote: editor.value.changeNote || "Section Preset Editor에서 Layout 수정.",
      layoutSnapshot: editor.value.layoutSnapshot,
    });
    layout.value = result.layout;
    editor.value = {
      ...editor.value,
      name: result.layout.name,
      description: result.layout.description,
      layoutSnapshot: clone(result.layout.layoutSnapshot),
      changeNote: "",
    };
    undoStack.value = [];
    redoStack.value = [];
    savedMessage.value = "Layout Preset을 저장했습니다.";
  } catch (saveError) {
    error.value = saveError.validationErrors?.[0]?.message || saveError.message;
  } finally {
    saving.value = false;
  }
}

onMounted(load);
onBeforeUnmount(endPointer);
</script>

<template>
  <main class="preset-editor-shell">
    <header class="preset-editor-header">
      <div>
        <small>SECTION LAYOUT PRESET</small>
        <h1>{{ section?.name || "Layout Preset Editor" }}</h1>
        <span v-if="layout">{{ layout.layoutKey }} · {{ viewport }}</span>
      </div>
      <div class="preset-actions">
        <button type="button" :disabled="!undoStack.length || readOnly" @click="undo">실행 취소</button>
        <button type="button" :disabled="!redoStack.length || readOnly" @click="redo">다시 실행</button>
        <button class="primary" type="button" :disabled="readOnly || saving" @click="save">{{ saving ? "저장 중..." : "저장" }}</button>
      </div>
    </header>

    <div v-if="loading" class="preset-state">Layout Preset을 불러오는 중...</div>
    <div v-else-if="error && !editor" class="preset-state error">{{ error }}</div>
    <div v-else-if="editor" class="preset-editor-grid">
      <aside class="preset-panel">
        <h2>Preset</h2>
        <label><span>이름</span><input v-model="editor.name" :disabled="readOnly" @focus="beginNumericEdit" /></label>
        <label><span>설명</span><textarea v-model="editor.description" rows="3" :disabled="readOnly" @focus="beginNumericEdit"></textarea></label>
        <label><span>변경 사유</span><input v-model="editor.changeNote" :disabled="readOnly" placeholder="저장 이력에 기록" /></label>
        <div class="viewport-switch">
          <button type="button" :class="{ active: viewport === 'desktop' }" @click="viewport = 'desktop'">Desktop</button>
          <button type="button" :class="{ active: viewport === 'mobile' }" @click="viewport = 'mobile'">Mobile</button>
        </div>
        <label><span>Section 높이</span><input v-model.number="editor.layoutSnapshot.sectionStyle.minHeight" type="number" min="1" max="1200" :disabled="readOnly" @focus="beginNumericEdit" /></label>
        <label><span>배경색</span><input v-model="editor.layoutSnapshot.sectionStyle.backgroundColor" type="color" :disabled="readOnly" @focus="beginNumericEdit" /></label>
        <p v-if="readOnly" class="notice">읽기 전용 버전입니다. Section 초안을 만든 후 수정할 수 있습니다.</p>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="savedMessage" class="success">{{ savedMessage }}</p>
      </aside>

      <section class="preset-workspace">
        <div
          ref="canvas"
          class="preset-canvas"
          :class="`viewport-${viewport}`"
          :style="{ height: `${canvasHeight}px`, backgroundColor: editor.layoutSnapshot.sectionStyle.backgroundColor }"
        >
          <article
            v-for="item in items"
            :key="item.itemKey"
            class="preset-item"
            :class="{ selected: selectedItemKey === item.itemKey }"
            :style="geometryStyle(item.itemKey)"
            @pointerdown="startPointer($event, item.itemKey, 'move')"
            @click="selectedItemKey = item.itemKey"
          >
            <strong>{{ item.name }}</strong>
            <small>{{ item.itemKey }}</small>
            <button
              class="resize-handle"
              type="button"
              aria-label="크기 변경"
              @pointerdown.stop="startPointer($event, item.itemKey, 'resize')"
            ></button>
          </article>
        </div>
      </section>

      <aside class="preset-panel">
        <h2>Component</h2>
        <div class="item-list">
          <button
            v-for="item in items"
            :key="item.itemKey"
            type="button"
            :class="{ active: selectedItemKey === item.itemKey }"
            @click="selectedItemKey = item.itemKey"
          >{{ item.name }}</button>
        </div>
        <template v-if="selectedGeometry">
          <label class="visibility-row">
            <input :checked="visible(selectedItemKey)" type="checkbox" :disabled="readOnly" @change="setVisibility(selectedItemKey, $event.target.checked)" />
            <span>{{ viewport }}에서 표시</span>
          </label>
          <div class="geometry-grid">
            <label><span>X (%)</span><input v-model.number="selectedGeometry.xPct" type="number" min="0" max="100" :disabled="readOnly" @focus="beginNumericEdit" /></label>
            <label><span>Y (px)</span><input v-model.number="selectedGeometry.yPx" type="number" min="0" max="1200" :disabled="readOnly" @focus="beginNumericEdit" /></label>
            <label><span>너비 (%)</span><input v-model.number="selectedGeometry.widthPct" type="number" min="0.01" max="100" :disabled="readOnly" @focus="beginNumericEdit" /></label>
            <label><span>높이 (px)</span><input v-model.number="selectedGeometry.heightPx" type="number" min="1" max="900" :disabled="readOnly" @focus="beginNumericEdit" /></label>
            <label><span>Z-index</span><input v-model.number="selectedGeometry.zIndex" type="number" min="0" max="100" :disabled="readOnly" @focus="beginNumericEdit" /></label>
          </div>
        </template>
        <p v-else class="notice">Canvas 또는 목록에서 Component를 선택하세요.</p>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.preset-editor-shell { min-height: 100vh; color: #eef2f7; background: #0b0e13; font-family: Inter, Pretendard, sans-serif; }
.preset-editor-header { min-height: 72px; padding: 14px 22px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid #29313d; background: #11161e; }
.preset-editor-header h1 { margin: 2px 0; font-size: 19px; }
.preset-editor-header small, .preset-editor-header span { color: #8995a5; }
.preset-actions, .viewport-switch { display: flex; gap: 8px; }
button { border: 1px solid #354151; border-radius: 7px; padding: 8px 11px; color: #dce4ee; background: #171e28; cursor: pointer; }
button:hover:not(:disabled), button.active { border-color: #6d8cff; background: #24304a; }
button.primary { border-color: #5778ff; background: #4567ef; color: white; }
button:disabled { opacity: .45; cursor: not-allowed; }
.preset-editor-grid { display: grid; grid-template-columns: 260px minmax(420px, 1fr) 260px; min-height: calc(100vh - 101px); }
.preset-panel { padding: 18px; border-right: 1px solid #29313d; background: #11161e; }
.preset-panel:last-child { border: 0; border-left: 1px solid #29313d; }
.preset-panel h2 { margin: 0 0 14px; font-size: 15px; }
.preset-panel label { display: grid; gap: 6px; margin-bottom: 12px; color: #aab4c2; font-size: 12px; }
.preset-panel input, .preset-panel textarea { box-sizing: border-box; width: 100%; border: 1px solid #344052; border-radius: 6px; padding: 8px; color: #eef2f7; background: #0d1219; }
.viewport-switch { margin: 16px 0; }
.viewport-switch button { flex: 1; }
.preset-workspace { overflow: auto; padding: 36px; background: radial-gradient(circle at center, #222a35 0, #141a22 75%); }
.preset-canvas { position: relative; box-sizing: border-box; margin: 0 auto; overflow: hidden; border: 1px solid #465266; box-shadow: 0 20px 60px #0008; transition: width .2s; }
.preset-canvas.viewport-desktop { width: min(100%, 960px); }
.preset-canvas.viewport-mobile { width: min(100%, 390px); }
.preset-item { position: absolute; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; min-width: 16px; min-height: 16px; padding: 7px 10px; overflow: hidden; border: 1px solid #7f96bd; border-radius: 5px; color: #f4f7fb; background: #24344ddb; cursor: move; user-select: none; touch-action: none; }
.preset-item.selected { outline: 2px solid #6d8cff; outline-offset: 2px; }
.preset-item strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.preset-item small { color: #b5c5dc; font-size: 10px; }
.resize-handle { position: absolute; right: -1px; bottom: -1px; width: 14px; height: 14px; padding: 0; border: 0; border-radius: 3px 0 0; background: #8aa0ff; cursor: nwse-resize; }
.item-list { display: grid; gap: 6px; margin-bottom: 18px; }
.item-list button { text-align: left; }
.geometry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.visibility-row { display: flex !important; grid-template-columns: auto 1fr; align-items: center; }
.visibility-row input { width: auto; }
.preset-state { padding: 60px; text-align: center; }
.notice { color: #97a3b3; font-size: 12px; line-height: 1.5; }
.error { color: #ff8791; }
.success { color: #74d69a; }
@media (max-width: 1000px) {
  .preset-editor-grid { grid-template-columns: 220px minmax(360px, 1fr); }
  .preset-panel:last-child { grid-column: 1 / -1; border-top: 1px solid #29313d; border-left: 0; }
}
</style>
