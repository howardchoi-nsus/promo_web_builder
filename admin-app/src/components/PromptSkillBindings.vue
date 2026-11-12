<script setup>
import {computed,onBeforeUnmount,onMounted,ref} from 'vue';
import {agentSkillService} from '../services/agent-skill-service.mjs';
const props=defineProps({modelValue:{type:Array,default:()=>[]}}),emit=defineEmits(['update:modelValue']);
const skills=ref([]),error=ref(''),selected=ref(''),preview=ref(null),loading=ref(false);
const versions=computed(()=>skills.value.flatMap(skill=>(skill.versions||[]).map(version=>({...version,skillName:skill.name,key:skill.key,active:skill.active}))));
async function load(){loading.value=true;error.value='';try{const result=await agentSkillService.list();skills.value=Array.isArray(result.skills)?result.skills:[];}catch(e){error.value=e.message;}finally{loading.value=false;}}
function add(){if(!selected.value||props.modelValue.length>=4||props.modelValue.some(b=>b.skillVersionId===selected.value))return;emit('update:modelValue',[...props.modelValue,{skillVersionId:selected.value}]);selected.value='';}
function remove(index){emit('update:modelValue',props.modelValue.filter((_,i)=>i!==index));}
function move(index,offset){const list=[...props.modelValue],next=index+offset;if(next<0||next>=list.length)return;[list[index],list[next]]=[list[next],list[index]];emit('update:modelValue',list);}
function label(id){const v=versions.value.find(v=>v.id===id);return v?`${v.skillName} · v${v.version}${v.active?'':' · 비활성'}`:id;}
async function inspect(id){error.value='';try{preview.value=(await agentSkillService.read(id)).version;}catch(e){error.value=e.message;}}
onMounted(()=>{load();window.addEventListener('promo-agent-skills-changed',load);});onBeforeUnmount(()=>window.removeEventListener('promo-agent-skills-changed',load));
</script>
<template>
 <section class="prompt-skill-bindings" aria-label="연결된 스킬">
  <p>스킬 관리에서 등록한 버전을 선택하세요. 새 스킬 버전을 저장해도 이 연결은 자동으로 바뀌지 않습니다. 프롬프트의 기존 저장·검증·활성화 절차로 반영됩니다.</p>
  <p v-if="error" role="alert">{{ error }}</p><p v-if="loading" role="status">스킬 목록을 불러오는 중…</p>
  <label>추가할 스킬 버전<select v-model="selected" aria-label="추가할 스킬 버전"><option value="">선택</option><option v-for="version in versions" :key="version.id" :value="version.id" :disabled="!version.active||modelValue.some(b=>b.skillVersionId===version.id)">{{ version.skillName }} · v{{ version.version }}{{ version.active?'':' · 비활성' }}</option></select></label>
  <button type="button" :disabled="!selected||modelValue.length>=4" @click="add">스킬 연결</button><button type="button" @click="load">스킬 목록 새로고침</button>
  <ol><li v-for="(binding,index) in modelValue" :key="binding.skillVersionId"><span>{{ label(binding.skillVersionId) }}</span> <button type="button" @click="inspect(binding.skillVersionId)">내용 보기</button><button type="button" :disabled="index===0" @click="move(index,-1)">위로</button><button type="button" :disabled="index===modelValue.length-1" @click="move(index,1)">아래로</button><button type="button" @click="remove(index)">연결 해제</button></li></ol>
  <p v-if="!modelValue.length">연결된 스킬 없음 · 기존 프롬프트만 사용합니다.</p>
  <details v-if="preview" open><summary>{{ preview.name }} · v{{ preview.version }} · 저장된 MD</summary><pre>{{ preview.markdown }}</pre><p>SHA-256 {{ preview.contentHash }}</p></details>
 </section>
</template>
<style scoped>.prompt-skill-bindings{display:grid;gap:10px;min-width:0}.prompt-skill-bindings p{margin:0;overflow-wrap:anywhere}.prompt-skill-bindings li{margin-bottom:8px;overflow-wrap:anywhere}.prompt-skill-bindings pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:360px;overflow:auto}.prompt-skill-bindings button{margin:3px}.prompt-skill-bindings label{display:grid;gap:6px}</style>
