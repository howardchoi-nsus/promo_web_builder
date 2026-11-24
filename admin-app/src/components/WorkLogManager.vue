<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue';
const performance=ref(null),diagnosis=ref(null);
const diagnosisLabels={no_records:"작업 기록 없음",completion_verified:"현재 Revision 완료 확인",attention_required:"실패·만료 기록 확인 필요",lease_active:"유효한 작업 리스 있음",completion_unconfirmed:"전체 완료 미확인"};
const logs=ref([]),loading=ref(false),error=ref(''),cursor=ref(null),selected=ref(null),live=ref(true),limitations=ref([]);
const openOnly=ref(false),reference=ref('');
const search=ref(''),status=ref(''),event=ref(''),stage=ref(''),errorCode=ref('');let timer=null,serial=0;
const lastUpdated=ref(null),refreshError=ref(''),performanceLoading=ref(false);
let appliedQuery=null,performanceSerial=0;
function filters(){return new URLSearchParams({search:search.value.trim(),status:status.value,event:event.value,stage:stage.value.trim(),errorCode:errorCode.value.trim(),limit:'50',reference:reference.value.trim(),openOnly:String(openOnly.value)});}
async function load(more=false,refresh=false){
 if(refresh&&loading.value)return;
 const run=++serial;loading.value=true;
 if(!refresh){error.value='';refreshError.value='';}
 const q=new URLSearchParams((more||refresh)&&appliedQuery?appliedQuery:filters());
 if(!more&&!refresh){appliedQuery=q.toString();performanceSerial++;selected.value=null;performance.value=null;diagnosis.value=null;performanceLoading.value=false;}
 if(more&&cursor.value)q.set('cursor',cursor.value);
 const incremental=refresh&&logs.value.length&&q.get('openOnly')!=='true';
 if(incremental&&/^[1-9][0-9]*$/.test(String(logs.value[0]?.sequence)))q.set('after',logs.value[0].sequence);
 try{
  const res=await fetch('/api/admin-work-logs?'+q,{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000)}),body=await res.json();
  if(!res.ok)throw Error(body.error||'로그 조회 실패');if(run!==serial)return;
  const merged=incremental?[...body.logs,...logs.value]:more?[...logs.value,...body.logs]:body.logs;
  logs.value=[...new Map(merged.map(row=>[row.id,row])).values()].sort((a,b)=>a.sequence&&b.sequence?(BigInt(a.sequence)>BigInt(b.sequence)?-1:BigInt(a.sequence)<BigInt(b.sequence)?1:0):0);
  if(!incremental)cursor.value=body.nextCursor;limitations.value=body.limitations||[];
  lastUpdated.value=new Date().toISOString();error.value='';refreshError.value='';
 }catch(e){if(run===serial){if(refresh)refreshError.value='자동 갱신에 실패했습니다. 이전 조회 결과를 표시하고 있습니다.';else error.value=e.message;}}
 finally{if(run===serial)loading.value=false;}
}
async function inspectPerformance(id){const run=++performanceSerial;performanceLoading.value=true;selected.value=null;performance.value=null;diagnosis.value=null;error.value='';try{const q=new URLSearchParams({mode:'performance',search:id});const res=await fetch('/api/admin-work-logs?'+q,{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000)}),body=await res.json();if(!res.ok)throw Error(body.error||'성능 조회 실패');if(run!==performanceSerial)return;performance.value=body.performance;}catch(e){if(run===performanceSerial)error.value=e.message;}finally{if(run===performanceSerial)performanceLoading.value=false;}}
async function inspectDiagnosis(id,refresh=false){
 const run=++performanceSerial;if(!refresh){performanceLoading.value=true;selected.value=null;performance.value=null;diagnosis.value=null;}error.value='';
 try{const res=await fetch('/api/admin-work-logs?'+new URLSearchParams({mode:'diagnosis',search:id}),{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000)}),body=await res.json();if(!res.ok)throw Error(body.error||'작업 진단 실패');if(run===performanceSerial)diagnosis.value=body.diagnosis;}
 catch(e){if(run===performanceSerial)error.value=e.message;}finally{if(run===performanceSerial)performanceLoading.value=false;}
}
function inspectRow(row){performanceSerial++;performanceLoading.value=false;performance.value=null;diagnosis.value=null;selected.value=row;}
function follow(id){search.value=id;reference.value='';openOnly.value=false;status.value='';event.value='';stage.value='';errorCode.value='';load();}
function polling(){clearInterval(timer);if(live.value)timer=setInterval(()=>{if(!loading.value){const id=diagnosis.value?.taskId;load(false,true).then(()=>{if(id&&diagnosis.value?.taskId===id&&!performanceLoading.value)inspectDiagnosis(id,true);});}},10000);}
function date(value){return new Date(value).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12:false});}
const labels={request_started:'요청 시작',request_finished:'요청 종료',model_started:'AI 호출 시작',model_finished:'AI 호출 종료',checkpoint:'진행 기록',client_error:'브라우저 오류'};
const states={running:'시작 기록',succeeded:'성공',failed:'실패',pending:'대기',cancelled:'취소'};
onMounted(()=>{load();polling();});onBeforeUnmount(()=>{serial++;performanceSerial++;clearInterval(timer);});
</script>
<template>
<section class="work-log-manager" aria-labelledby="work-log-title">
 <header><h2 id="work-log-title">작업 로그</h2><button type="button" :disabled="loading" @click="load(false,true)">새로고침</button><label><input type="checkbox" v-model="live" @change="polling">10초마다 갱신</label></header>
 <p class="log-refresh-state" role="status">마지막 조회: {{lastUpdated?date(lastUpdated):'아직 없음'}} · {{live?'자동 갱신 중 · 10초 간격':'자동 갱신 꺼짐'}}</p>
 <p v-if="refreshError" role="alert">{{refreshError}}</p>
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
 <div class="log-workspace">
 <div class="log-list" aria-label="로그 내역">
 <div class="log-table"><table><thead><tr><th>시간(KST)</th><th>단계 / 작업</th><th>이벤트·상태</th><th>시간</th><th>오류</th><th>추적</th></tr></thead><tbody>
  <tr v-for="row in logs" :key="row.id" :class="{failed:row.status==='failed',selected:selected?.id===row.id}"><td>{{date(row.createdAt)}}</td><td>{{row.stage}}<br>{{row.operation}}</td><td>{{labels[row.event]||row.event}} · {{states[row.status]||row.status}}</td><td>{{row.durationMs==null?'—':`${(row.durationMs/1000).toFixed(2)}초`}}</td><td>{{row.errorCode||'—'}}<br>{{row.message}}</td><td><button type="button"  :aria-pressed="selected?.id===row.id" @click="inspectRow(row)">상세</button><button type="button" @click="inspectDiagnosis(row.taskId)">중단 진단</button><button type="button" @click="follow(row.taskId)">작업 전체</button><button type="button" @click="inspectPerformance(row.taskId)">성능 요약</button></td></tr>
 </tbody></table></div>
 <button v-if="cursor" type="button" :disabled="loading" @click="load(true)">이전 로그 더 보기</button>
 </div>
 <aside class="log-inspector" aria-label="로그 상세 패널" aria-live="polite">
 <p v-if="performanceLoading" role="status">진단·성능 정보를 불러오고 있습니다.</p>
 <p v-if="!selected&&!performance&&!diagnosis&&!performanceLoading" class="log-detail-empty">왼쪽 로그에서 상세 또는 성능 요약을 선택해 주세요.</p>
 <section v-if="diagnosis" class="log-detail" aria-label="작업 중단 진단">
 <button type="button" @click="performanceSerial++;diagnosis=null">진단 닫기</button><h3>작업 중단 진단</h3>
 <p><strong>{{diagnosisLabels[diagnosis.state]||diagnosis.state}}</strong></p><p>작업 ID: {{diagnosis.taskId}}</p><p>작업 기록 {{diagnosis.total}}개 · 마지막 기록 {{diagnosis.lastObservedAt?date(diagnosis.lastObservedAt):'없음'}}</p>
 <h4>다음 조치</h4><p>{{diagnosis.recovery}}</p>
 <h4>최근 실패 이력 · 최신 50개 제한과 무관</h4><p v-if="!diagnosis.failures.length">저장된 실패 기록이 없습니다. 오류가 없었다는 뜻은 아닙니다. 아래 종료 미확인 요청과 저장 상태를 확인하세요.</p>
 <article v-for="failure in diagnosis.failures" :key="failure.requestId+failure.event+failure.createdAt"><h5>{{failure.code}} · {{labels[failure.event]||failure.event}} · {{date(failure.createdAt)}}</h5><p>{{failure.stage}} / {{failure.operation}} · 요청 {{failure.requestId}}</p><p>{{failure.message}}</p><pre>{{JSON.stringify(failure.metadata,null,2)}}</pre><p>{{failure.recovery}}</p></article>
 <h4>종료 미확인 요청·AI 호출</h4><p v-if="!diagnosis.openRequests.length">저장된 시작/종료 기록 기준 미확인 항목 없음</p><p v-for="item in diagnosis.openRequests" :key="item.requestId+item.event">{{item.stage}} / {{item.operation}} · {{item.event}} · {{date(item.createdAt)}} · {{item.requestId}}</p>
 <h4>연결 문서의 저장 작업 상태</h4><p v-if="!diagnosis.persisted.length">연결된 저장 작업이 없습니다.</p><article v-for="item in diagnosis.persisted" :key="item.kind+item.runId+item.unitId"><p>{{item.kind}} · {{item.state}} · {{item.code||'오류 코드 없음'}} · {{item.expired?'리스 만료':item.active?'리스 유효':'활성 리스 없음'}}</p><p>문서 {{item.documentId}} · 실행 {{item.runId}} · 단위 {{item.unitId||'—'}}</p><p v-if="item.leaseExpiresAt">리스 기한 {{date(item.leaseExpiresAt)}}</p></article>
 <p v-if="diagnosis.unavailable.length">조회할 저장 테이블 없음: {{diagnosis.unavailable.join(', ')}}</p><ul><li v-for="text in diagnosis.limitations" :key="text">{{text}}</li></ul>
 </section>
 <section v-if="performance" class="log-detail" aria-label="작업 성능 요약"><button type="button" @click="performance=null">성능 닫기</button><h3>작업 성능 요약</h3><p>{{performance.taskId}}</p><p>AI 호출 {{performance.summary.modelCalls}}회 · AI 실패 {{performance.summary.modelFailures}}회 · 요청 실패 {{performance.summary.failedRequests}}회 · 자동 재시도 {{performance.summary.automaticRetries}}회 · 종료 미확인 {{performance.summary.requestsWithoutEnd}}회 · 계획 캐시 재사용 {{performance.summary.planningCacheHits}}회</p><div class="log-table"><table><thead><tr><th>단계</th><th>구분</th><th>표본</th><th>평균</th><th>p50</th><th>p95</th><th>최대</th></tr></thead><tbody><tr v-for="item in performance.stages" :key="item.stage+item.event"><td>{{item.stage}}</td><td>{{item.event==='model_finished'?'AI 호출':'서버 요청'}}</td><td>{{item.samples}}</td><td>{{item.averageMs}}ms</td><td>{{item.p50Ms}}ms</td><td>{{item.p95Ms}}ms</td><td>{{item.maxMs}}ms</td></tr></tbody></table></div><ul><li v-for="item in performance.limitations" :key="item">{{item}}</li></ul></section>
 <p v-if="selected&&!logs.some(row=>row.id===selected.id)">선택 상세는 이전 조회에서 보존된 기록입니다. 현재 목록 범위에는 포함되지 않습니다.</p>
 <section v-if="selected" class="log-detail" aria-label="로그 상세"><button type="button" @click="selected=null">상세 닫기</button><h3>요청 상세</h3><dl><dt>작업 ID</dt><dd>{{selected.taskId}}</dd><dt>요청 ID</dt><dd>{{selected.requestId}}</dd><dt>문서 ID</dt><dd>{{selected.documentId||'문서 생성 전'}}</dd><dt>HTTP 상태</dt><dd>{{selected.httpStatus||'—'}}</dd></dl><pre>{{JSON.stringify(selected,null,2)}}</pre></section>
 </aside>
 </div>
 <ul class="log-limitations"><li v-for="item in limitations" :key="item">{{item}}</li><li>원문 프롬프트·입력/응답 본문·쿠키·API 키·이미지 바이너리는 저장하지 않습니다. 오류 메시지도 민감 값을 제거합니다.</li></ul>
</section>
</template>
<style scoped>
.work-log-manager{padding:20px;min-width:0}.work-log-manager header,.log-filters{display:flex;gap:12px;align-items:end;flex-wrap:wrap}.work-log-manager h2{margin-right:auto}.log-filters label{display:grid;gap:5px;min-width:130px;max-width:100%}.log-filters label:first-child{flex:1;min-width:220px}.log-filters input,.log-filters select{padding:8px;max-width:100%}.work-log-manager button{padding:7px 10px;cursor:pointer}.log-workspace{display:grid;grid-template-columns:minmax(0,3fr) minmax(320px,2fr);gap:20px;align-items:start}.log-list,.log-inspector{min-width:0}.log-inspector{position:sticky;top:16px;max-height:calc(100vh - 32px);overflow:auto}.log-detail-empty{padding:24px;border:1px dashed #d8dce3;border-radius:8px;color:#596473}.selected{outline:2px solid #4169c1;outline-offset:-2px}.log-table{overflow:auto;margin:18px 0}table{border-collapse:collapse;width:100%;min-width:750px}th,td{padding:10px;border-bottom:1px solid #d8dce3;text-align:left;vertical-align:top;overflow-wrap:anywhere}td:nth-child(5){max-width:320px}.failed{background:#fff0f0;color:#8e2020}.log-detail{padding:16px;background:#f4f6fa;border:1px solid #d8dce3;overflow-wrap:anywhere}.log-detail pre{white-space:pre-wrap;overflow-wrap:anywhere}.log-detail dd{margin-left:0}.log-limitations{font-size:12px;color:#596473;padding-left:20px}p{overflow-wrap:anywhere}
@media(max-width:900px){.log-workspace{grid-template-columns:minmax(0,1fr)}.log-inspector{position:static;max-height:none}}
</style>
