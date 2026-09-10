<script setup>
import { computed } from "vue";
import RenderSpecNode from "./RenderSpecNode.vue";
import {
  createResolvedRenderSpecTree,
  resolveRenderSpecBreakpoint,
} from "./render-spec-runtime.mjs";

const props = defineProps({
  renderSpec: { type: Object, required: true },
  fields: { type: Array, default: () => [] },
  value: { default: null },
  viewport: { type: String, default: "" },
  viewportWidth: { type: Number, default: 1280 },
  mobileBreakpoint: { type: Number, default: 720 },
  tabletBreakpoint: { type: Number, default: 1024 },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(["select-field"]);

const breakpoint = computed(() => resolveRenderSpecBreakpoint({
  viewport: props.viewport,
  viewportWidth: props.viewportWidth,
  mobileBreakpoint: props.mobileBreakpoint,
  tabletBreakpoint: props.tabletBreakpoint,
}));

const tree = computed(() => createResolvedRenderSpecTree({
  renderSpec: props.renderSpec,
  fields: props.fields,
  componentValue: props.value,
  breakpoint: breakpoint.value,
}));
</script>

<template>
  <RenderSpecNode
    v-if="tree"
    :node="tree"
    :editable="editable"
    @select-field="emit('select-field', $event)"
  />
</template>
