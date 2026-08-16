<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  value: { type: null, required: true },
  path: { type: String, default: "$" },
  query: { type: String, default: "" },
  expandRevision: { type: Number, default: 0 },
  collapseRevision: { type: Number, default: 0 },
});
const emit = defineEmits(["copy-path"]);
const expanded = ref(true);
const isContainer = computed(() => props.value !== null && typeof props.value === "object");
const entries = computed(() => isContainer.value ? Object.entries(props.value) : []);
const preview = computed(() => Array.isArray(props.value)
  ? `Array(${props.value.length})`
  : `{${entries.value.length}}`);
const primitiveText = computed(() => typeof props.value === "string"
  ? JSON.stringify(props.value)
  : String(props.value));
const matches = computed(() => {
  const needle = props.query.trim().toLocaleLowerCase();
  if (!needle) return false;
  return `${props.path} ${isContainer.value ? preview.value : primitiveText.value}`.toLocaleLowerCase().includes(needle);
});

function childPath(key) {
  if (Array.isArray(props.value)) return `${props.path}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${props.path}.${key}` : `${props.path}[${JSON.stringify(key)}]`;
}

watch(() => props.expandRevision, () => { expanded.value = true; });
watch(() => props.collapseRevision, () => { expanded.value = false; });
</script>

<template>
  <li class="json-tree__node" :class="{ 'is-match': matches }">
    <div class="json-tree__row">
      <button
        v-if="isContainer"
        class="json-tree__toggle"
        type="button"
        :aria-label="`${path} ${expanded ? '접기' : '펼치기'}`"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >{{ expanded ? '−' : '+' }}</button>
      <span v-else class="json-tree__spacer" aria-hidden="true"></span>
      <button class="json-tree__path" type="button" :title="`${path} 경로 복사`" @click="emit('copy-path', path)">{{ path }}</button>
      <span v-if="isContainer" class="json-tree__preview">{{ preview }}</span>
      <code v-else>{{ primitiveText }}</code>
    </div>
    <ul v-if="isContainer && expanded" class="json-tree__children">
      <JsonTreeView
        v-for="([key, child]) in entries"
        :key="childPath(key)"
        :value="child"
        :path="childPath(key)"
        :query="query"
        :expand-revision="expandRevision"
        :collapse-revision="collapseRevision"
        @copy-path="emit('copy-path', $event)"
      />
    </ul>
  </li>
</template>

<style scoped>
.json-tree__node, .json-tree__children { margin: 0; padding: 0; list-style: none; }
.json-tree__children { padding-left: 20px; }
.json-tree__row { display: flex; align-items: baseline; gap: 7px; min-height: 24px; padding: 2px 5px; border-radius: 4px; }
.json-tree__node.is-match > .json-tree__row { background: rgb(250 204 21 / 24%); color: #fff4ae; }
.json-tree__toggle, .json-tree__path { border: 0; background: transparent; color: inherit; cursor: pointer; }
.json-tree__toggle { width: 18px; padding: 0; color: #88a9d5; font-weight: 900; }
.json-tree__spacer { width: 18px; }
.json-tree__path { padding: 0; color: #8dc6ff; font: inherit; text-align: left; }
.json-tree__path:hover, .json-tree__path:focus-visible { text-decoration: underline; }
.json-tree__preview { color: #91a0b8; }
.json-tree__row code { color: #d7e1f1; font: inherit; }
</style>
