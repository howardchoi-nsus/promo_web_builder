<script setup>
import { computed } from "vue";
import { sectionLayoutPresetService } from "../services/section-layout-preset-service.mjs";
import VisualEditorDialogHost from "./VisualEditorDialogHost.vue";

const props = defineProps({
  section: { type: Object, required: true },
  layout: { type: Object, required: true },
});
const emit = defineEmits(["saved", "close"]);

const editorUrl = computed(() => {
  const url = new URL(sectionLayoutPresetService.editorUrl(props.section.id, props.layout.layoutKey));
  url.searchParams.set("embedded", "1");
  return url.toString();
});

function handleEditorMessage(message) {
  if (message.type !== "promo-section-layout-saved") return;
  if (message.sectionId !== props.section.id || message.layoutId !== props.layout.id) return;
  emit("saved", message);
}
</script>

<template>
  <visual-editor-dialog-host
    :title="`${layout.name} · 레이아웃 프리셋 편집기`"
    :description="`${layout.layoutKey} · 실제 텍스트·이미지·CTA 렌더링 기준`"
    :editor-url="editorUrl"
    :iframe-title="`${section.name} ${layout.name} 레이아웃 프리셋 편집기`"
    save-target-label="선택한 레이아웃 프리셋"
    :read-only="section.status !== 'draft'"
    read-only-message="활성·비활성 섹션은 읽기 전용입니다. 초안을 만든 후 레이아웃을 편집하세요."
    @editor-message="handleEditorMessage"
    @close="emit('close')"
  />
</template>
