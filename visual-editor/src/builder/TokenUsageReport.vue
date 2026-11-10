<script setup>
import {computed} from 'vue';
import {layoutTokenPolicy} from '../../../shared/layout-token-policy.mjs';
import {nodes} from '../../../shared/page-schema/runtime.mjs';
import {TOKEN_USAGE_RULES,usageToken} from '../../../shared/token-usage-policy.mjs';
const props=defineProps({snapshot:{type:Object,required:true}});
const library=computed(()=>props.snapshot.content?.runtimeTheme?.designTokens);
const roleRows=computed(()=>TOKEN_USAGE_RULES.map(rule=>{const token=usageToken(library.value?.usagePolicy,rule.key,library.value?.values||{});return {...rule,token,value:token?library.value.values[token]:'',status:token?'연결됨':rule.required?'필수 미연결':'미연결 · 생략'};}));
const rows=computed(()=>{
 const values=library.value?.values||{},catalog=library.value?.catalog||[],policy=layoutTokenPolicy({tokenValues:values,tokenCatalog:catalog});
 const gridRows=Object.entries(policy.profiles).flatMap(([view,bindings])=>Object.entries(bindings).map(([property,token])=>({key:`grid.${view}.${property}`,label:`그리드 · ${view} · ${property}`,token,value:values[token]||'',status:values[token]?'등록 기준':'필수 미연결'})));
 const breakpointRows=Object.entries(policy.breakpoints).map(([view,token])=>({key:`breakpoint.${view}`,label:`반응형 · ${view}`,token,value:values[token]||'',status:values[token]?'등록 기준':'필수 미연결'}));
 const selected=new Set();for(const node of nodes(props.snapshot.content?.pageSchema))for(const view of Object.values(node.styles.spacing||{}))for(const token of Object.values(view||{}))if(token)selected.add(token);
 const spacingRows=[...selected].map(token=>({key:token,label:'PageSchema 간격 선택',token,value:values[token]||'',status:policy.spacing.includes(token)?'명시 선택':'미등록'}));
 return [...roleRows.value,...gridRows,...breakpointRows,...spacingRows];
});
</script>
<template>
 <details v-if="library?.usagePolicy" class="token-usage-report">
  <summary>디자인 토큰 적용 내역 · 정책 v{{library.usagePolicy.version}}</summary>
  <p>이 결과에 고정된 정책과 토큰 값입니다. 연결된 스타일도 해당 요소·상태가 있을 때 사용됩니다.</p>
  <div><table><thead><tr><th>용도</th><th>등록 토큰</th><th>값</th><th>연결 상태</th></tr></thead><tbody>
   <tr v-for="row in rows" :key="row.key"><th scope="row">{{row.label}}</th><td><code>{{row.token||'—'}}</code></td><td>{{row.value||'—'}}</td><td>{{row.status}}</td></tr>
  </tbody></table></div>
 </details>
</template>
<style scoped>
.token-usage-report{margin:12px 0;border-top:1px solid #dde5df;padding-top:12px;font-size:12px;}summary{cursor:pointer;font-weight:700;}.token-usage-report>div{max-height:400px;overflow:auto;}table{border-collapse:collapse;width:100%;}th,td{padding:8px;text-align:left;border-bottom:1px solid #e4e9e6;overflow-wrap:anywhere;}
</style>
