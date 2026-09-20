<script setup>
defineProps({
  nodes: { type: Array, default: () => [] },
  selectedPath: { type: String, default: "" },
  ariaLabel: { type: String, default: "DOM 구조" },
  emptyMessage: { type: String, default: "표시할 구조가 없습니다." },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <nav class="dom-structure-tree" :aria-label="ariaLabel">
    <button
      v-for="item in nodes"
      :key="item.path"
      type="button"
      :class="{ active: item.path === selectedPath }"
      :style="{ paddingLeft: `${10 + Number(item.depth || 0) * 16}px` }"
      :aria-current="item.path === selectedPath ? 'true' : undefined"
      :data-dom-path="item.path"
      @click="emit('select', item.path)"
    >
      <small>{{ item.tag || item.node?.tag || item.kind || 'node' }}</small>
      <span>{{ item.label || item.path }}</span>
    </button>
    <p v-if="!nodes.length">{{ emptyMessage }}</p>
  </nav>
</template>

<style scoped>
.dom-structure-tree{display:flex;min-width:0;flex-direction:column;overflow:auto;border:1px solid var(--line);background:var(--panel)}
.dom-structure-tree button{display:grid;gap:2px;padding-top:9px;padding-right:9px;padding-bottom:9px;border:0;border-bottom:1px solid var(--line);background:none;color:var(--ink);text-align:left;cursor:pointer}
.dom-structure-tree button.active{background:var(--accent-soft);color:var(--accent)}
.dom-structure-tree small{color:var(--sub)}
.dom-structure-tree span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dom-structure-tree p{margin:0;padding:16px;color:var(--sub);font-size:12px}
</style>
