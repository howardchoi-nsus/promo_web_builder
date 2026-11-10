<script setup>
import {ref,watch} from 'vue';
const props=defineProps({page:{type:Object,required:true},busy:Boolean});
const emit=defineEmits(['save','close']);
const draft=ref(''),error=ref('');
watch(()=>props.page,page=>draft.value=JSON.stringify(page,null,2),{immediate:true});
function save(){try{error.value='';emit('save',JSON.parse(draft.value));}catch{error.value='유효한 JSON을 입력해 주세요.';}}
</script>
<template>
 <section class="ai-builder-result" aria-label="페이지 구조 편집">
  <h2>페이지 구조 편집</h2>
  <p>PageSchema의 콘텐츠·중첩·배치·정책 역할을 수정할 수 있습니다. 저장 시 전체 구조를 검증하며, 확정된 원문과 허용된 ID만 사용합니다.</p>
  <label for="page-schema-json">PageSchema JSON</label>
  <textarea id="page-schema-json" v-model="draft" :disabled="busy" rows="24" spellcheck="false" style="width:100%;font-family:monospace" />
  <p v-if="error" role="alert">{{error}}</p>
  <button type="button" :disabled="busy" @click="save">검증 후 저장</button>
  <button type="button" :disabled="busy" @click="emit('close')">닫기</button>
 </section>
</template>
