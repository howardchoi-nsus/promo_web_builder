<script setup>
import {computed,ref,onMounted,onBeforeUnmount,toRaw,nextTick} from 'vue';
import CompositionPreviewCanvas from './CompositionPreviewCanvas.vue';
import {layoutTokenPolicy} from '../../../shared/layout-token-policy.mjs';
import {nodes,effectiveLayout,nodeTargets} from '../../../shared/page-schema/runtime.mjs';
import {pageGenerationStyleRoles,pageStyleRoles} from '../../../shared/token-usage-policy.mjs';
import {findNode,moveSibling,editNode,nodeLabel,createEditorHistory,removeNode,addSection,mergeEditorChanges} from './services/page-editor-commands.mjs';
import {editorHtmlSource,applyEditorHtmlSource} from './services/page-editor-html.mjs';
const props=defineProps({snapshot:{type:Object,required:true},documentId:{type:String,required:true},revision:{type:Number,required:true}});
const current=ref(structuredClone(toRaw(props.snapshot))),revision=ref(props.revision),page=ref(structuredClone(toRaw(props.snapshot.content.pageSchema))),selected=ref(page.value.root.id),viewport=ref('desktop'),error=ref(''),busy=ref(false),dirty=ref(false),request=ref(''),preview=ref(null),undoable=ref(false),redoable=ref(false);
const conflicted=ref(false),storedDraft=ref(null);
const editorMode=ref('visual'),htmlSource=ref('');
const backupKey='promoPageEditorDraft:'+props.documentId;
try{storedDraft.value=JSON.parse(sessionStorage.getItem(backupKey)||'null');}catch{}
function stash(){try{if(dirty.value)sessionStorage.setItem(backupKey,JSON.stringify({baseline:toRaw(current.value.content.pageSchema),page:toRaw(page.value),revision:revision.value}));else sessionStorage.removeItem(backupKey);}catch{}}
async function mergeLatest(){busy.value=true;try{const response=await fetch('/api/promo-builder-documents?documentId='+encodeURIComponent(props.documentId),{credentials:'same-origin',cache:'no-store'});const latest=await response.json();if(!response.ok||!latest.snapshot?.content?.pageSchema)throw Error('최신 문서를 불러오지 못했습니다. 수정본은 보관했습니다.');const originalDraft={baseline:toRaw(current.value.content.pageSchema),page:toRaw(page.value),revision:revision.value};try{sessionStorage.setItem(backupKey+':conflict',JSON.stringify(originalDraft));}catch{}const result=mergeEditorChanges(originalDraft.baseline,originalDraft.page,latest.snapshot.content.pageSchema);accept({snapshot:latest.snapshot,revision:latest.document.currentDocumentRevision});apply(result.page);conflicted.value=false;error.value=result.conflicts.length?`동시에 변경된 ${result.conflicts.length}개 항목은 최신 값을 유지했습니다. 나머지 수정은 합쳤습니다.`:'최신 문서에 수정 내용을 합쳤습니다. 확인 후 저장해 주세요.';}catch(e){error.value=e.message;}finally{busy.value=false;}}
function restoreDraft(){const saved=storedDraft.value;if(!saved?.page)return;const result=mergeEditorChanges(saved.baseline,saved.page,toRaw(current.value.content.pageSchema));apply(result.page);storedDraft.value=null;if(result.conflicts.length)error.value='동시에 변경된 항목은 최신 값을 유지했습니다.';}
let history=createEditorHistory(toRaw(page.value)),doc=null,timer;
const context=computed(()=>current.value.content.pageContext),list=computed(()=>nodes(page.value)),node=computed(()=>findNode(page.value,selected.value)),display=computed(()=>({...current.value,content:{...current.value.content,pageSchema:page.value}})),roles=computed(()=>pageGenerationStyleRoles(context.value).filter(r=>(node.value?nodeTargets(node.value):[]).includes(r.target)));
const viewLayout=computed(()=>node.value?effectiveLayout(node.value,viewport.value):{}),spacingTokens=computed(()=>layoutTokenPolicy(context.value).spacing||[]);
function changeLayout(property,value){change(n=>{n.layout[viewport.value]={...effectiveLayout(n,viewport.value),[property]:value};});}
function changeSpacing(property,value){change(n=>{const view=viewport.value==='desktop'?'base':viewport.value;n.styles.spacing||={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};n.styles.spacing[view]={...(n.styles.spacing[view]||{gap:null,padding:null,margin:null}),[property]:value||null};});}
function insertSection(){apply(addSection(toRaw(page.value),'section_'+crypto.randomUUID().replaceAll('-','').slice(0,12)));}
function flags(){undoable.value=history.canUndo;redoable.value=history.canRedo;dirty.value=JSON.stringify(page.value)!==JSON.stringify(current.value.content.pageSchema);stash();}
function apply(next){page.value=history.push(next);flags();}
function openHtmlEditor(){htmlSource.value=editorHtmlSource(toRaw(page.value),context.value);editorMode.value='html';error.value='';}
function applyHtml(){try{error.value='';apply(applyEditorHtmlSource(toRaw(page.value),context.value,htmlSource.value));htmlSource.value=editorHtmlSource(toRaw(page.value),context.value);editorMode.value='visual';}catch(e){error.value=e.message;}}
function change(fn){try{error.value='';apply(editNode(toRaw(page.value),selected.value,fn));}catch(e){error.value=e.message;}}
function chooseRole(key){const role=roles.value.find(r=>r.key===key);if(!role)return;change(n=>{const conflicts=new Set(pageStyleRoles(context.value).filter(r=>r.property===role.property&&r.state===role.state).map(r=>r.key));const view=viewport.value==='desktop'?'base':viewport.value;n.styles[view]=[...(n.styles[view]||n.styles.base).filter(k=>!conflicts.has(k)),key];});}
function returnToBuilder(){if(dirty.value&&!confirm('저장하지 않은 변경이 있습니다. 저장하지 않고 나가시겠습니까?'))return;location.assign('/prototype/create-promo?mode=ai&builderDocumentId='+encodeURIComponent(props.documentId));}
async function api(method,body){const response=await fetch('/api/promo-page-schema',{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({documentId:props.documentId,baseDocumentRevision:revision.value,...body})});const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.error||'저장 실패'),{code:data.code});return data;}
function accept(saved){current.value=saved.snapshot;revision.value=Number(saved.revision);page.value=structuredClone(saved.snapshot.content.pageSchema);history=createEditorHistory(toRaw(page.value));flags();}
async function save(){busy.value=true;error.value='';try{const saved=await api('PUT',{page:toRaw(page.value)});accept(saved);returnToBuilder();}catch(e){conflicted.value=e.code==='DOCUMENT_REVISION_MISMATCH';stash();error.value=e.code==='DOCUMENT_REVISION_MISMATCH'?'다른 화면에서 문서가 변경되었습니다. 편집 내용은 유지했습니다. 최신 문서를 확인한 뒤 변경을 해결해 주세요.':e.message;}finally{busy.value=false;}}
async function aiEdit(){if(!request.value.trim())return;if(dirty.value){error.value='먼저 현재 직접 편집 내용을 저장해 주세요.';return;}busy.value=true;error.value='';try{const overview=current.value.generationMeta?.sourceRequirements?.revision;const saved=await api('POST',{instruction:request.value,selectionNodeId:selected.value,generationRequest:current.value.generationMeta?.design?.requestText||'',requestId:crypto.randomUUID(),requirementsRevision:overview});accept(saved);request.value='';returnToBuilder();}catch(e){error.value=e.message;}finally{busy.value=false;}}
function click(e){const id=e.target.closest('[data-ps-node]')?.dataset.psNode;if(id){e.preventDefault();selected.value=id;}}
function bind(){const next=preview.value?.getOutputDocument?.();if(next!==doc){doc?.removeEventListener('click',click,true);doc=next;doc?.addEventListener('click',click,true);}}
function unload(e){if(dirty.value){e.preventDefault();e.returnValue='';}}
onMounted(()=>{timer=setInterval(bind,250);window.addEventListener('beforeunload',unload);});onBeforeUnmount(()=>{clearInterval(timer);doc?.removeEventListener('click',click,true);window.removeEventListener('beforeunload',unload);});
</script>
<template>
<main class="schema-document-editor">
 <header><strong>웹빌더 에디터 · Revision {{revision}}</strong><button @click="returnToBuilder">페이지 제작으로</button><button :aria-pressed="editorMode==='visual'" @click="editorMode='visual'">화면 수정</button><button :aria-pressed="editorMode==='html'" @click="openHtmlEditor">HTML 수정</button><button :disabled="busy||!undoable" @click="page=history.undo();flags()">되돌리기</button><button :disabled="busy||!redoable" @click="page=history.redo();flags()">다시 적용</button><button :disabled="busy||!dirty" @click="save">저장 후 자동 검사</button></header>
<p v-if="error" role="alert">{{error}}</p><button v-if="conflicted" :disabled="busy" @click="mergeLatest">최신 문서에 안전하게 합치기</button><button v-if="storedDraft" :disabled="busy" @click="restoreDraft">보관한 수정 불러오기</button><p>등록된 디자인 토큰과 동일한 페이지 원본을 편집합니다. 저장 후 페이지 제작에서 자동 검사하며, 구조 변경은 구성 재승인으로 이어집니다.</p>
 <section v-if="editorMode==='html'" class="schema-html-editor" aria-label="HTML 소스 수정">
  <div><strong>HTML 소스 수정</strong><p>일반 문구와 이미지 alt만 수정할 수 있습니다. 구조, data-page-node-* 속성, 스타일과 스크립트는 안전을 위해 변경할 수 없습니다.</p></div>
  <textarea v-model="htmlSource" :disabled="busy" spellcheck="false" aria-label="페이지 HTML 소스"/>
  <div class="schema-html-editor__actions"><button :disabled="busy" @click="openHtmlEditor">현재 내용으로 초기화</button><button :disabled="busy||!htmlSource.trim()" @click="applyHtml">HTML 변경 적용</button></div>
 </section>
 <div v-else class="schema-editor-workspace"><aside>
  <label>선택 요소<select v-model="selected"><option v-for="item in list" :key="item.id" :value="item.id">{{nodeLabel(item,context)}}</option></select></label>
  <template v-if="node">
   <label v-if="node.type==='text'&&node.contentMode==='editorial'">문구<textarea :value="node.text" :disabled="busy" @change="change(n=>n.text=$event.target.value)"/></label>
   <p v-if="node.type==='text'&&node.contentMode==='source'">승인된 원문 참조입니다. 사실·혜택·법적 문구 변경은 페이지 제작 채팅에서 요청해 주세요.</p>
   <label>정렬<select :value="viewLayout.align" @change="changeLayout('align',$event.target.value)"><option v-for="v in ['start','center','end','stretch']" :key="v">{{v}}</option></select></label>
   <label>내부 배치<select :value="viewLayout.justify" @change="changeLayout('justify',$event.target.value)"><option v-for="v in ['start','center','end','space-between']" :key="v">{{v}}</option></select></label>
   <label v-if="node.children">방향<select :value="viewLayout.direction" @change="changeLayout('direction',$event.target.value)"><option>column</option><option>row</option></select></label>
   <label v-if="node.type==='image'">등록/완료 이미지<select :value="node.assetId||''" @change="change(n=>{n.assetId=$event.target.value;n.requestId=null})"><option disabled value="">선택</option><option v-for="(asset,id) in Object.fromEntries(Object.entries(context.assets||{}).filter(([,a])=>a.kind==='image'))" :key="id" :value="id">{{asset.label||id}}</option></select></label>
   <label v-for="property in ['gap','padding','margin']" :key="property">{{viewport}} · {{property}}<select :value="node.styles.spacing?.[viewport==='desktop'?'base':viewport]?.[property]||''" @change="changeSpacing(property,$event.target.value)"><option value="">기본</option><option v-for="token in spacingTokens" :key="token">{{token}}</option></select></label>
   <label v-if="node.type==='grid'">{{viewport}} 컬럼 비율<input :value="viewLayout.columns.join(',')" @change="changeLayout('columns',$event.target.value.split(',').map(Number))" placeholder="1,1"/></label>
   <button :disabled="busy" @click="insertSection">섹션 추가</button><button :disabled="busy||selected===page.root.id" @click="apply(removeNode(toRaw(page),selected));selected=page.root.id">선택 요소 삭제</button>
   <label>등록 스타일<select @change="chooseRole($event.target.value)"><option value="">적용할 역할 선택</option><option v-for="role in roles" :key="role.key" :value="role.key">{{role.label||role.key}} · {{role.property}}</option></select></label>
   <button :disabled="busy" @click="apply(moveSibling(toRaw(page),selected,-1))">앞으로 이동</button><button :disabled="busy" @click="apply(moveSibling(toRaw(page),selected,1))">뒤로 이동</button>
   <label>선택 영역 AI 수정<textarea v-model="request" :disabled="busy" placeholder="선택한 영역을 어떻게 바꿀까요?"/></label><button :disabled="busy||!request.trim()" @click="aiEdit">선택 영역 수정 후 검사</button>
  </template>
 </aside><section><div><button v-for="view in ['desktop','tablet','mobile']" :key="view" :aria-pressed="viewport===view" @click="viewport=view">{{view}}</button></div><CompositionPreviewCanvas ref="preview" :snapshot="display" :viewport="viewport"/></section></div>
</main>
</template>
<style scoped>
.schema-document-editor{font:14px/1.6 sans-serif;background:#f6f7f9;min-height:100vh;padding:20px;color:#182028}.schema-document-editor header{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.schema-document-editor header strong{margin-right:auto}.schema-document-editor button{padding:8px 12px;cursor:pointer}.schema-document-editor button[aria-pressed="true"]{background:#182028;color:white}.schema-editor-workspace{display:grid;grid-template-columns:280px minmax(0,1fr);gap:20px}.schema-editor-workspace aside{background:white;padding:16px}.schema-editor-workspace label{display:block;margin-bottom:16px}.schema-editor-workspace select,.schema-editor-workspace textarea{width:100%;padding:8px;box-sizing:border-box}.schema-editor-workspace textarea{min-height:100px}.schema-editor-workspace section{min-width:0}.schema-html-editor{display:grid;gap:12px;background:white;padding:16px}.schema-html-editor textarea{width:100%;min-height:68vh;resize:vertical;padding:16px;box-sizing:border-box;background:#101318;color:#e9edf2;font:13px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2}.schema-html-editor__actions{display:flex;justify-content:flex-end;gap:8px}[role=alert]{color:#a11}@media(max-width:700px){.schema-editor-workspace{grid-template-columns:1fr}.schema-html-editor textarea{min-height:58vh}}
</style>
