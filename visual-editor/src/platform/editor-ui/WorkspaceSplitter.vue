<script setup>
import { onBeforeUnmount } from "vue";
import {
  WORKSPACE_SPLIT_DEFAULT,
  WORKSPACE_SPLIT_MAX,
  WORKSPACE_SPLIT_MIN,
  clampWorkspaceSplitWidth,
} from "./workspace-split.mjs";

const props = defineProps({
  modelValue: { type: Number, default: WORKSPACE_SPLIT_DEFAULT },
  minimum: { type: Number, default: WORKSPACE_SPLIT_MIN },
  maximum: { type: Number, default: WORKSPACE_SPLIT_MAX },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "resize-end"]);
let drag = null;

function nextWidth(value) {
  return clampWorkspaceSplitWidth(value, {
    minimum: props.minimum,
    maximum: props.maximum,
    fallback: WORKSPACE_SPLIT_DEFAULT,
  });
}

function update(value) {
  emit("update:modelValue", nextWidth(value));
}

function finishDrag() {
  if (!drag) return;
  globalThis.removeEventListener("pointermove", handlePointerMove);
  globalThis.removeEventListener("pointerup", finishDrag);
  globalThis.removeEventListener("pointercancel", finishDrag);
  drag = null;
  emit("resize-end");
}

function handlePointerMove(event) {
  if (!drag) return;
  update(drag.width + event.clientX - drag.clientX);
}

function startDrag(event) {
  if (props.disabled || event.button !== 0) return;
  event.preventDefault();
  drag = { clientX: event.clientX, width: props.modelValue };
  globalThis.addEventListener("pointermove", handlePointerMove);
  globalThis.addEventListener("pointerup", finishDrag, { once: true });
  globalThis.addEventListener("pointercancel", finishDrag, { once: true });
}

function handleKeydown(event) {
  if (props.disabled) return;
  const step = event.shiftKey ? 48 : 16;
  const next = {
    ArrowLeft: props.modelValue - step,
    ArrowRight: props.modelValue + step,
    Home: props.minimum,
    End: props.maximum,
  }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  update(next);
  emit("resize-end");
}

function reset() {
  if (props.disabled) return;
  update(WORKSPACE_SPLIT_DEFAULT);
  emit("resize-end");
}

onBeforeUnmount(finishDrag);
</script>

<template>
  <button
    type="button"
    class="workspace-splitter"
    role="separator"
    aria-orientation="vertical"
    :aria-valuemin="minimum"
    :aria-valuemax="maximum"
    :aria-valuenow="modelValue"
    aria-label="STRUCTURE와 LIVE PREVIEW 너비 조절"
    title="드래그하여 패널 너비 조절 · 더블클릭으로 초기화"
    :disabled="disabled"
    @pointerdown="startDrag"
    @keydown="handleKeydown"
    @dblclick="reset"
  ><span aria-hidden="true"></span></button>
</template>
