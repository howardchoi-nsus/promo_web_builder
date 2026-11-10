<script setup>
import {computed,onMounted,onBeforeUnmount,ref,watch} from 'vue';
import {designTokenService} from '../services/design-token-service.mjs';
import {TOKEN_USAGE_RULES,tokenAllowedForRule,validateTokenUsagePolicy} from '../../../shared/token-usage-policy.mjs';
const props=defineProps({tokenVersionId:{default:null},blocked:{type:Boolean,default:false}});
const policy=ref(null),catalog=ref([]),versions=ref([]),headId=ref(null),activeId=ref(null),selectedId=ref(null),libraryId=ref(null);
const busy=ref(false),error=ref(''),message=ref(''),baseline=ref('');
const dirty=computed(()=>policy.value && JSON.stringify(policy.value)!==baseline.value);
const validation=computed(()=>policy.value?validateTokenUsagePolicy(policy.value,catalog.value,{activation:true}):{errors:[],missing:[]});
async function load(versionId='') {
 if(dirty.value&&!globalThis.confirm('저장하지 않은 정책 변경사항을 버릴까요?'))return;
 busy.value=true;error.value='';
 try{const result=await designTokenService.usagePolicy(versionId);policy.value=result.policy;catalog.value=result.catalog;versions.value=result.versions;headId.value=result.headId;activeId.value=result.activeId;selectedId.value=result.selectedId;libraryId.value=result.tokenVersionId;baseline.value=JSON.stringify(policy.value);}
 catch(e){error.value=e.message;}finally{busy.value=false;}
}
async function save(activate=false){
 busy.value=true;error.value='';message.value='';
 try{await designTokenService.saveUsagePolicy({policy:policy.value,tokenVersionId:libraryId.value,expectedHeadId:headId.value,activate});baseline.value=JSON.stringify(policy.value);await load();message.value=activate?'정책을 활성화했습니다. 새 생성부터 적용됩니다.':'정책 Draft를 저장했습니다.';}
 catch(e){error.value=e.details?.errors?.map(x=>x.message).join('\n')||e.message;}finally{busy.value=false;}
}
const options=rule=>catalog.value.filter(token=>tokenAllowedForRule(token,rule,catalog.value));
function beforeLeave(event){if(dirty.value){event.preventDefault();event.returnValue='';}}
onMounted(()=>{load();globalThis.addEventListener('beforeunload',beforeLeave);});
onBeforeUnmount(()=>globalThis.removeEventListener('beforeunload',beforeLeave));
watch(()=>props.tokenVersionId,()=>{if(!dirty.value)load();});
</script>
<template>
 <details class="token-usage-policy">
  <summary>토큰 사용 정책</summary>
  <p>용도별 토큰을 한곳에서 연결합니다. 미연결 필수 항목은 다른 용도의 토큰으로 대체하지 않습니다.</p>
  <p v-if="error" role="alert" class="policy-error">{{error}}</p>
  <p v-if="message" role="status">{{message}}</p>
  <button v-if="!policy" type="button" :disabled="busy" @click="load()">정책 불러오기</button>
  <template v-if="policy">
   <div class="policy-toolbar">
    <span>{{activeId?'활성 정책 있음':'활성 정책 없음'}} · 필수 미연결 {{validation.missing.length}}개</span>
    <label>정책 이력 <select :value="selectedId||''" :disabled="busy" @change="load($event.target.value)">
      <option v-if="!versions.length" value="">초기 Draft</option>
      <option v-for="version in versions" :key="version.id" :value="version.id">v{{version.version}} · {{version.status}}</option>
    </select></label>
    <button type="button" :disabled="busy||blocked" @click="save(false)">Draft 저장</button>
    <button type="button" :disabled="busy||blocked||!!validation.errors.length" @click="save(true)">검증 후 활성화</button>
    <button type="button" :disabled="busy" @click="load()">새로고침</button>
   </div>
   <p v-if="blocked">토큰 변경사항을 먼저 저장한 후 정책을 저장하세요.</p>
   <p v-if="dirty" role="status">저장하지 않은 정책 변경사항이 있습니다.</p>
   <ul v-if="validation.errors.length" class="policy-error"><li v-for="(item,index) in validation.errors" :key="index">{{item.message}}</li></ul>
   <div class="policy-table"><table>
    <thead><tr><th>용도</th><th>대상</th><th>속성</th><th>상태</th><th>등록 토큰</th><th>누락 처리</th></tr></thead>
    <tbody><tr v-for="rule in TOKEN_USAGE_RULES" :key="rule.key">
      <th scope="row">{{rule.label}}</th><td>{{rule.target}}</td><td>{{rule.property}}</td><td>{{rule.state}}</td>
      <td><select v-model="policy.bindings[rule.key]" :aria-label="`${rule.label} 토큰`" :disabled="busy||blocked">
       <option value="">미연결</option>
       <option v-if="policy.bindings[rule.key]&&!options(rule).some(token=>token.tokenKey===policy.bindings[rule.key])" :value="policy.bindings[rule.key]">{{policy.bindings[rule.key]}} · 사용 불가</option>
       <option v-for="token in options(rule)" :key="token.tokenKey" :value="token.tokenKey">{{token.tokenKey}} · {{token.value}}</option>
      </select></td><td>{{rule.required?'필수 · 생성 차단':'선택 · 생략'}}</td>
    </tr></tbody>
   </table></div>
  </template>
 </details>
</template>
<style scoped>
.token-usage-policy {border:1px solid var(--app-line,#d4dbe7);padding:16px;border-radius:6px;min-width:0;}
summary{font-weight:750;cursor:pointer;}.policy-toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.policy-table{overflow:auto;max-height:600px;margin-top:16px;}table{border-collapse:collapse;width:100%;font-size:12px;}th,td{padding:9px;text-align:left;border-bottom:1px solid var(--app-line,#d4dbe7);}select{max-width:100%;min-width:180px;} .policy-error{color:var(--app-danger,#a3293e);white-space:pre-wrap;}
button,select{padding:8px;border:1px solid var(--app-line,#d4dbe7);background:var(--app-panel,#fff);color:inherit;border-radius:4px;}button:disabled{opacity:.5;}
</style>
