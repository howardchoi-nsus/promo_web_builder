<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue';
const logs=ref([]),loading=ref(false),error=ref(''),cursor=ref(null),selected=ref(null),live=ref(false),limitations=ref([]);
const openOnly=ref(false),reference=ref('');
const search=ref(''),status=ref(''),event=ref(''),stage=ref(''),errorCode=ref('');let timer=null,serial=0;
async function load(more=false){const run=++serial;loading.value=true;error.value='';try{const q=new URLSearchParams({search:search.value.trim(),status:status.value,event:event.value,stage:stage.value.trim(),errorCode:errorCode.value.trim(),limit:'50',reference:reference.value.trim(),openOnly:String(openOnly.value)});if(more&&cursor.value)q.set('cursor',cursor.value);const res=await fetch('/api/admin-work-logs?'+q,{credentials:'same-origin',cache:'no-store'}),body=await res.json();if(!res.ok)throw Error(body.error||'로그 조회 실패');if(run!==serial)return;logs.value=more?[...logs.value,...body.logs]:body.logs;cursor.value=body.nextCursor;limitations.value=body.limitations||[];if(!more)selected.value=null;}catch(e){if(run===serial)error.value=e.message;}finally{if(run===serial)loading.value=false;}}
function follow(id){search.value=id;reference.value='';openOnly.value=false;status.value='';event.value='';stage.value='';errorCode.value='';load();}
function polling(){clearInterval(timer);if(live.value)timer=setInterval(()=>{if(!loading.value&&!selected.value)load();},10000);}
function date(value){return new Date(value).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12:false});}
const labels={request_started:'요청 시작',request_finished:'요청 종료',model_started:'AI 호출 시작',model_finished:'AI 호출 종료',checkpoint:'진행 기록',client_error:'브라우저 오류'};
const states={running:'시작 기록',succeeded:'성공',failed:'실패',pending:'대기',cancelled:'취소'};
onMounted(()=>load());onBeforeUnmount(()=>{serial++;clearInterval(timer);});
</script>
<template>
<section class="work-log-manager" aria-labelledby="work-log-title">
 <header><h2 id="work-log-title">작업 로그</h2><button type="button" :disabled="loading" @click="load()">새로고침</button><label><input type="checkbox" v-model="live" @change="polling">10초마다 갱신</label></header>
 <p>요청 요약·페이지 구성·디자인·이미지·품질검사·출력의 서버 요청과 AI 호출을 추적합니다. 작업 ID로 생성 여정, 요청 ID로 개별 호출을 조회하세요. 시간은 한국 표준시입니다.</p>
 <form @submit.prevent="load()" class="log-filters">
  <label>작업·요청·문서·세션 ID<input v-model="search" placeholder="UUID 전체 입력"></label>
  <label><input type="checkbox" v-model="openOnly">종료 기록 없는 요청만</label>
  <label>상태<select aria-label="상태" v-model="status"><option value="">전체</option><option value="failed">실패</option><option value="running">시작 기록</option><option value="succeeded">성공</option><option value="pending">대기</option></select></label>
  <label>이벤트<select aria-label="이벤트" v-model="event"><option value="">전체</option><option v-for="(label,key) in labels" :key="key" :value="key">{{label}}</option></select></label>
  <label>외부 요청 ID<input v-model="reference" placeholder="Vercel / Provider 요청 ID"></label>
  <label>단계/API<input v-model="stage" placeholder="promo-page-schema"></label><label>오류 코드<input v-model="errorCode" placeholder="PAGE_DRAFT_INVALID"></label><button :disabled="loading">조회</button>
 </form>
 <p v-if="error" role="alert">{{error}}</p><p v-if="loading" role="status">로그를 불러오고 있습니다.</p><p v-if="!loading&&!logs.length&&!error">조회 조건에 맞는 로그가 없습니다. 기록은 migration 099와 코드 적용 이후부터 수집됩니다.</p>
 <div class="log-table"><table><thead><tr><th>시간(KST)</th><th>단계 / 작업</th><th>이벤트·상태</th><th>시간</th><th>오류</th><th>추적</th></tr></thead><tbody>
  <tr v-for="row in logs" :key="row.id" :class="{failed:row.status==='failed'}"><td>{{date(row.createdAt)}}</td><td>{{row.stage}}<br>{{row.operation}}</td><td>{{labels[row.event]||row.event}} · {{states[row.status]||row.status}}</td><td>{{row.durationMs==null?'—':`${(row.durationMs/1000).toFixed(2)}초`}}</td><td>{{row.errorCode||'—'}}<br>{{row.message}}</td><td><button type="button" @click="selected=row">상세</button><button type="button" @click="follow(row.taskId)">작업 전체</button></td></tr>
 </tbody></table></div>
 <button v-if="cursor" type="button" :disabled="loading" @click="load(true)">이전 로그 더 보기</button>
 <section v-if="selected" class="log-detail" aria-label="로그 상세"><button type="button" @click="selected=null">상세 닫기</button><h3>요청 상세</h3><dl><dt>작업 ID</dt><dd>{{selected.taskId}}</dd><dt>요청 ID</dt><dd>{{selected.requestId}}</dd><dt>문서 ID</dt><dd>{{selected.documentId||'문서 생성 전'}}</dd><dt>HTTP 상태</dt><dd>{{selected.httpStatus||'—'}}</dd></dl><pre>{{JSON.stringify(selected,null,2)}}</pre></section>
 <ul class="log-limitations"><li v-for="item in limitations" :key="item">{{item}}</li><li>원문 프롬프트·입력/응답 본문·쿠키·API 키·이미지 바이너리는 저장하지 않습니다. 오류 메시지도 민감 값을 제거합니다.</li></ul>
</section>
</template>
<style scoped>
.work-log-manager{padding:20px;min-width:0}.work-log-manager header,.log-filters{display:flex;gap:12px;align-items:end;flex-wrap:wrap}.work-log-manager h2{margin-right:auto}.log-filters label{display:grid;gap:5px;min-width:130px;max-width:100%}.log-filters label:first-child{flex:1;min-width:220px}.log-filters input,.log-filters select{padding:8px;max-width:100%}.work-log-manager button{padding:7px 10px;cursor:pointer}.log-table{overflow:auto;margin:18px 0}table{border-collapse:collapse;width:100%;min-width:750px}th,td{padding:10px;border-bottom:1px solid #d8dce3;text-align:left;vertical-align:top;overflow-wrap:anywhere}td:nth-child(5){max-width:320px}.failed{background:#fff0f0;color:#8e2020}.log-detail{padding:16px;background:#f4f6fa;border:1px solid #d8dce3;overflow-wrap:anywhere}.log-detail pre{white-space:pre-wrap;overflow-wrap:anywhere}.log-detail dd{margin-left:0}.log-limitations{font-size:12px;color:#596473;padding-left:20px}p{overflow-wrap:anywhere}
</style>
