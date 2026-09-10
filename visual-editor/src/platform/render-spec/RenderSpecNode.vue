<script setup>
import { computed } from "vue";

defineOptions({ name: "RenderSpecNode" });

const props = defineProps({
  node: { type: Object, required: true },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(["select-field"]);

const editorAttributes = computed(() => (props.editable ? {
  "data-render-path": props.node.path,
  ...(props.node.fieldKey ? { "data-field-key": props.node.fieldKey } : {}),
} : {}));

function selectField(event) {
  if (!props.editable || !props.node.fieldKey) return;
  event.preventDefault();
  event.stopPropagation();
  emit("select-field", { fieldKey: props.node.fieldKey, field: props.node.field });
}
</script>

<template>
  <component
    :is="node.tag"
    v-bind="{ ...node.attributes, ...editorAttributes }"
    class="render-spec-node"
    :class="[
      `render-spec-node--${node.nodeType}`,
      node.fieldKind ? `render-spec-node--${node.fieldKind}` : '',
    ]"
    :style="node.style"
    @click="selectField"
  >
    <img
      v-if="node.nodeType === 'field' && node.tag === 'picture' && node.imageSrc"
      class="render-spec-picture-image"
      :src="node.imageSrc"
      :alt="node.imageAlt"
    />
    <template v-else-if="node.nodeType === 'field' && node.tag !== 'img'">{{ node.text }}</template>
    <RenderSpecNode
      v-for="child in node.tag === 'img' ? [] : node.children"
      :key="child.path"
      :node="child"
      :editable="editable"
      @select-field="emit('select-field', $event)"
    />
  </component>
</template>
