<script setup>
import { ref } from "vue";

const props=defineProps({
  busy: { type: Boolean, default: false },
  pageSchemaMode:{type:Boolean,default:false},
});
const emit = defineEmits(["submit", "cancel"]);
const value = ref("");
const scope=ref("layout");
</script>

<template>
  <form class="ai-builder-card ai-operation-form" @submit.prevent="emit('submit', props.pageSchemaMode?{instruction:value,scope}:value)">
    <p class="ai-builder-eyebrow">Natural-language Edit</p>
    <h2>어떤 부분을 수정할까요?</h2>
    <label v-if="pageSchemaMode">수정할 내용
      <select v-model="scope"><option value="layout">배치·스타일 수정</option><option value="content">문구·혜택 수정</option></select>
    </label>
    <p v-if="pageSchemaMode">{{scope==='content'?'문구·혜택 변경은 요청 요약에서 다시 확인한 후 반영합니다.':'확정된 문구와 연결 정보는 유지하고 배치를 수정합니다.'}}</p>
    <textarea v-model="value" rows="4" maxlength="3000" :placeholder="pageSchemaMode && scope==='layout'?'예: 혜택 섹션을 위로 이동하고 모바일은 한 열로 배치해줘.':'예: 제목과 혜택 문구를 변경해줘.'" />
    <div class="ai-builder-actions">
      <button type="button" class="ai-builder-secondary" @click="emit('cancel')">취소</button>
      <button type="submit" class="ai-builder-primary" :disabled="busy || !value.trim()">수정 제안</button>
    </div>
  </form>
</template>
