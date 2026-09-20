<script setup>
const props = defineProps({
  selected: { type: Object, default: null },
  fields: { type: Array, default: () => [] },
  tokenKeys: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  rootPath: { type: String, default: "root" },
});

const emit = defineEmits(["set-node-property", "set-field-key", "set-nested"]);

function nodeProperty(property, value) {
  emit("set-node-property", { property, value });
}

function nested(group, property, value) {
  emit("set-nested", { group, property, value });
}
</script>

<template>
  <section v-if="selected" class="render-spec-node-inspector" aria-label="선택 노드 속성">
    <label>
      노드 유형
      <select
        :value="selected.node.nodeType"
        :disabled="disabled || selected.path === rootPath"
        @change="nodeProperty('nodeType', $event.target.value)"
      >
        <option value="element">그룹</option>
        <option value="field">필드</option>
      </select>
    </label>
    <label>
      태그
      <select :value="selected.node.tag" :disabled="disabled" @change="nodeProperty('tag', $event.target.value)">
        <option v-for="tag in ['div','section','article','header','footer','h1','h2','h3','p','span','strong','small','img','picture','a','button','ul','ol','li']" :key="tag">{{ tag }}</option>
      </select>
    </label>
    <label v-if="selected.node.nodeType === 'field'">
      연결 필드
      <select :value="selected.node.fieldKey" :disabled="disabled" @change="emit('set-field-key', $event.target.value)">
        <option v-for="field in fields" :key="field.fieldKey" :value="field.fieldKey">{{ field.name }} · {{ field.fieldKey }}</option>
      </select>
    </label>
    <label v-else>
      의미 역할
      <input :value="selected.node.semanticRole || ''" :disabled="disabled" @input="nodeProperty('semanticRole', $event.target.value)" />
    </label>
    <label>
      배치
      <select :value="selected.node.layout?.display || ''" :disabled="disabled" @change="nested('layout','display',$event.target.value)">
        <option value="">기본</option>
        <option value="block">Block</option>
        <option value="flex">Flex</option>
        <option value="grid">Grid</option>
      </select>
    </label>
    <label>
      열 수
      <input type="number" min="1" max="12" :value="selected.node.layout?.columns || ''" :disabled="disabled" @input="nested('layout','columns',Number($event.target.value) || '')" />
    </label>
    <label>
      글자색 토큰
      <input list="render-spec-token-keys" :value="selected.node.tokenBindings?.color || ''" :disabled="disabled" @change="nested('tokenBindings','color',$event.target.value)" />
    </label>
    <label>
      배경색 토큰
      <input list="render-spec-token-keys" :value="selected.node.tokenBindings?.backgroundColor || ''" :disabled="disabled" @change="nested('tokenBindings','backgroundColor',$event.target.value)" />
    </label>
    <datalist id="render-spec-token-keys"><option v-for="key in tokenKeys" :key="key" :value="key" /></datalist>
  </section>
</template>

<style scoped>
.render-spec-node-inspector{display:grid;min-width:0;align-content:start;gap:9px;padding:10px;border:1px solid var(--line);background:var(--panel)}
.render-spec-node-inspector label{display:grid;gap:4px;color:var(--sub);font-size:11px;font-weight:800}
.render-spec-node-inspector input,.render-spec-node-inspector select{min-width:0}
</style>
