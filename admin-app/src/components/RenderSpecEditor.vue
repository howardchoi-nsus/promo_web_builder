<script setup>
import { computed, onMounted, ref, watch } from "vue";
import RenderSpecTree from "../../../visual-editor/src/platform/render-spec/RenderSpecTree.vue";

const props = defineProps({
  modelValue: { type: Object, default: null },
  fields: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  sourceImageUrl: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);
const selectedPath = ref("root");
const viewport = ref("desktop");
const validation = ref(null);
const validating = ref(false);
const rawText = ref("");
const rawError = ref("");
const tokenKeys = ref([]);

const spec = computed(() => props.modelValue || null);
const nodes = computed(() => {
  const result = [];
  const visit = (node, path, depth) => {
    if (!node) return;
    result.push({ node, path, depth, label: node.fieldKey || node.semanticRole || node.tag });
    (node.children || []).forEach((child, index) => visit(child, `${path}.children.${index}`, depth + 1));
  };
  visit(spec.value?.root, "root", 0);
  return result;
});
const selected = computed(() => nodes.value.find((item) => item.path === selectedPath.value) || nodes.value[0] || null);
const previewValue = computed(() => ({ fields: Object.fromEntries(props.fields.map((field) => {
  if (field.fieldKind === "image") return [field.fieldKey, { value: props.sourceImageUrl, alt: field.name || "미리보기 이미지" }];
  if (field.fieldKind === "cta") return [field.fieldKey, { label: field.defaultValue || field.name || "자세히 보기", link: "#" }];
  return [field.fieldKey, field.defaultValue || (field.textType === "title" ? "프로모션 제목 미리보기" : `${field.name || "텍스트"} 내용 미리보기`)];
})) }));
const previewWidth = computed(() => ({ desktop: "100%", tablet: "760px", mobile: "390px" }[viewport.value]));

watch(() => props.modelValue, (value) => { rawText.value = value ? JSON.stringify(value, null, 2) : ""; }, { immediate: true, deep: true });

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function defaultTag(field) { return field.fieldKind === "image" ? "img" : field.fieldKind === "cta" ? "a" : field.textType === "title" ? "h2" : "p"; }
function createDefaultSpec() {
  if (!props.fields.length || props.fields.some((field) => !field.fieldKey)) return;
  update({ contractVersion: 1, root: { nodeType: "element", tag: "article", semanticRole: "component", layout: { display: "grid", columns: 1, overflow: "hidden" }, children: props.fields.map((field) => ({ nodeType: "field", tag: defaultTag(field), fieldKey: field.fieldKey })) }, responsive: { mobile: { "root.layout.columns": 1 } }, accessibility: {} });
  selectedPath.value = "root";
}
function update(value) { emit("update:modelValue", value); validation.value = null; }
function mutate(callback) { const next = clone(spec.value); callback(next); update(next); }
function resolve(root, path) { return path.split(".children.").slice(1).reduce((node, index) => node?.children?.[Number(index)], root); }
function mutateSelected(callback) { mutate((next) => callback(resolve(next.root, selectedPath.value))); }
function addNode(type) {
  if (!selected.value) return;
  const field = props.fields.find((item) => item.fieldKey) || null;
  mutateSelected((node) => {
    node.children ||= [];
    node.children.push(type === "field" && field ? { nodeType: "field", tag: defaultTag(field), fieldKey: field.fieldKey } : { nodeType: "element", tag: "div", semanticRole: "group", layout: { display: "block" }, children: [] });
  });
}
function removeSelected() {
  if (selectedPath.value === "root") return;
  const parts = selectedPath.value.split(".children."); const index = Number(parts.pop()); const parentPath = parts.join(".children.");
  mutate((next) => resolve(next.root, parentPath).children.splice(index, 1)); selectedPath.value = parentPath;
}
function moveSelected(direction) {
  if (selectedPath.value === "root") return;
  const parts = selectedPath.value.split(".children."); const index = Number(parts.pop()); const parentPath = parts.join(".children.");
  mutate((next) => { const list = resolve(next.root, parentPath).children; const target = index + direction; if (target < 0 || target >= list.length) return; [list[index], list[target]] = [list[target], list[index]]; });
  selectedPath.value = `${parentPath}.children.${Math.max(0, index + direction)}`;
}
function selectField(event) { const found = nodes.value.find((item) => item.node.fieldKey === event.fieldKey); if (found) selectedPath.value = found.path; }
function setFieldKey(value) { const field = props.fields.find((item) => item.fieldKey === value); mutateSelected((node) => { node.fieldKey = value; node.tag = defaultTag(field); }); }
function setNested(group, property, value) { mutateSelected((node) => { node[group] ||= {}; if (value === "" || value == null) delete node[group][property]; else node[group][property] = value; }); }
async function validate() {
  if (!spec.value) return; validating.value = true;
  try { const response = await fetch("/api/item-component-render-spec-validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ renderSpec: spec.value, fields: props.fields }) }); validation.value = (await response.json()).validation || null; }
  catch (error) { validation.value = { ok: false, errors: [{ path: "request", message: error.message }] }; }
  finally { validating.value = false; }
}
function applyRaw() { try { update(JSON.parse(rawText.value)); rawError.value = ""; } catch (error) { rawError.value = error.message; } }
onMounted(async () => { try { const result = await fetch("/api/design-token-sets?scope=public").then((response) => response.json()); tokenKeys.value = [...new Set((result.tokenSets || []).flatMap((set) => Object.keys(set.values || {})))].sort(); } catch {} });
</script>

<template>
  <section class="rs-editor">
    <div class="rs-toolbar">
      <strong>DOM RenderSpec</strong>
      <button v-if="!spec" class="tiny-button primary" type="button" :disabled="disabled || fields.some((field) => !field.fieldKey)" @click="createDefaultSpec">기본 DOM 생성</button>
      <template v-else>
        <button class="tiny-button" type="button" :disabled="disabled || selected?.node?.tag === 'img'" @click="addNode('element')">+ 그룹</button>
        <button class="tiny-button" type="button" :disabled="disabled || !fields.length || selected?.node?.tag === 'img'" @click="addNode('field')">+ 필드</button>
        <button class="tiny-button" type="button" :disabled="disabled || selectedPath === 'root'" @click="moveSelected(-1)">위</button>
        <button class="tiny-button" type="button" :disabled="disabled || selectedPath === 'root'" @click="moveSelected(1)">아래</button>
        <button class="tiny-button danger" type="button" :disabled="disabled || selectedPath === 'root'" @click="removeSelected">삭제</button>
        <button class="tiny-button primary" type="button" :disabled="validating" @click="validate">{{ validating ? '검증 중' : '검증' }}</button>
      </template>
    </div>
    <p v-if="!spec" class="rs-empty">서버가 생성한 필드 키가 있는 초안에서 DOM 구조를 만들 수 있습니다.</p>
    <div v-else class="rs-grid">
      <aside class="rs-outline">
        <button v-for="item in nodes" :key="item.path" type="button" :class="{ active: item.path === selectedPath }" :style="{ paddingLeft: `${10 + item.depth * 16}px` }" @click="selectedPath = item.path"><small>{{ item.node.tag }}</small>{{ item.label }}</button>
      </aside>
      <div v-if="selected" class="rs-controls">
        <label>노드 유형<select :value="selected.node.nodeType" :disabled="disabled || selectedPath === 'root'" @change="mutateSelected((node) => node.nodeType = $event.target.value)"><option value="element">그룹</option><option value="field">필드</option></select></label>
        <label>태그<select :value="selected.node.tag" :disabled="disabled" @change="mutateSelected((node) => node.tag = $event.target.value)"><option v-for="tag in ['div','section','article','header','footer','h1','h2','h3','p','span','strong','small','img','picture','a','button','ul','ol','li']" :key="tag">{{ tag }}</option></select></label>
        <label v-if="selected.node.nodeType === 'field'">연결 필드<select :value="selected.node.fieldKey" :disabled="disabled" @change="setFieldKey($event.target.value)"><option v-for="field in fields" :key="field.fieldKey" :value="field.fieldKey">{{ field.name }} · {{ field.fieldKey }}</option></select></label>
        <label v-else>의미 역할<input :value="selected.node.semanticRole || ''" :disabled="disabled" @input="mutateSelected((node) => node.semanticRole = $event.target.value)" /></label>
        <label>배치<select :value="selected.node.layout?.display || ''" :disabled="disabled" @change="setNested('layout','display',$event.target.value)"><option value="">기본</option><option value="block">Block</option><option value="flex">Flex</option><option value="grid">Grid</option></select></label>
        <label>열 수<input type="number" min="1" max="12" :value="selected.node.layout?.columns || ''" :disabled="disabled" @input="setNested('layout','columns',Number($event.target.value) || '')" /></label>
        <label>글자색 토큰<input list="rs-token-keys" :value="selected.node.tokenBindings?.color || ''" :disabled="disabled" @change="setNested('tokenBindings','color',$event.target.value)" /></label>
        <label>배경색 토큰<input list="rs-token-keys" :value="selected.node.tokenBindings?.backgroundColor || ''" :disabled="disabled" @change="setNested('tokenBindings','backgroundColor',$event.target.value)" /></label>
        <datalist id="rs-token-keys"><option v-for="key in tokenKeys" :key="key" :value="key" /></datalist>
      </div>
      <section class="rs-preview-panel">
        <div class="rs-viewport"><button v-for="name in ['desktop','tablet','mobile']" :key="name" type="button" :class="{ active: viewport === name }" @click="viewport = name">{{ name }}</button></div>
        <div class="rs-preview" :style="{ width: previewWidth }"><RenderSpecTree :render-spec="spec" :fields="fields" :value="previewValue" :viewport="viewport" editable @select-field="selectField" /></div>
      </section>
    </div>
    <div v-if="validation" class="rs-validation" :class="{ ok: validation.ok }"><strong>{{ validation.ok ? '검증 통과' : `오류 ${validation.errors?.length || 0}건` }}</strong><ul v-if="!validation.ok"><li v-for="error in validation.errors" :key="`${error.path}:${error.code}`">{{ error.path }} · {{ error.message }}</li></ul></div>
    <details v-if="spec" class="rs-debug"><summary>고급: Raw JSON</summary><textarea v-model="rawText" rows="14" :disabled="disabled"></textarea><p v-if="rawError">{{ rawError }}</p><button class="tiny-button" type="button" :disabled="disabled" @click="applyRaw">JSON 적용</button></details>
  </section>
</template>

<style scoped>
.rs-editor{display:grid;gap:12px;padding:14px;border:1px solid var(--line);background:var(--surface-2)}.rs-toolbar,.rs-viewport{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.rs-toolbar strong{margin-right:auto}.rs-empty{margin:0;color:var(--sub);font-size:12px}.rs-grid{display:grid;grid-template-columns:190px 230px minmax(0,1fr);gap:10px;min-height:340px}.rs-outline,.rs-controls,.rs-preview-panel{min-width:0;border:1px solid var(--line);background:var(--panel)}.rs-outline{display:flex;flex-direction:column;overflow:auto}.rs-outline button{display:grid;gap:2px;padding:9px;border:0;border-bottom:1px solid var(--line);background:none;color:var(--ink);text-align:left}.rs-outline button.active,.rs-viewport button.active{background:var(--accent-soft);color:var(--accent)}.rs-outline small{color:var(--sub)}.rs-controls{display:grid;align-content:start;gap:9px;padding:10px}.rs-controls label{display:grid;gap:4px;color:var(--sub);font-size:11px;font-weight:800}.rs-controls input,.rs-controls select{min-width:0}.rs-preview-panel{display:grid;align-content:start;gap:10px;padding:10px;overflow:auto}.rs-viewport button{padding:5px 8px;border:1px solid var(--line);background:var(--surface-2)}.rs-preview{max-width:100%;margin:auto;padding:16px;border:1px dashed var(--line);background:#fff;color:#111;transition:width .2s}.rs-preview :deep(img){max-width:100%;height:auto}.rs-preview :deep(a),.rs-preview :deep(button){display:inline-flex;padding:10px 14px;background:#222;color:#fff}.rs-validation{padding:10px;border:1px solid var(--danger);color:var(--danger);font-size:12px}.rs-validation.ok{border-color:#19965b;color:#137a49}.rs-validation ul{margin:8px 0 0;padding-left:18px}.rs-debug textarea{width:100%;font-family:monospace;font-size:11px}.rs-debug p{color:var(--danger)}@media(max-width:1100px){.rs-grid{grid-template-columns:180px 1fr}.rs-preview-panel{grid-column:1/-1}}@media(max-width:700px){.rs-grid{grid-template-columns:1fr}.rs-preview-panel{grid-column:auto}}
</style>
