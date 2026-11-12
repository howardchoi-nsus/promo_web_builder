<script setup>
import {onMounted,reactive,ref} from 'vue';
import {agentSkillService,announceSkillChange} from '../services/agent-skill-service.mjs';
const skills=ref([]),loading=ref(false),saving=ref(false),error=ref(''),notice=ref(''),openedVersion=ref(null);
const blank=()=>({id:'',baseVersion:0,key:'',name:'',description:'',sourceUrl:'',markdown:'',changeNote:'',active:true});
const editor=reactive(blank());
async function load(){loading.value=true;error.value='';try{const result=await agentSkillService.list();skills.value=Array.isArray(result.skills)?result.skills:[];}catch(e){error.value=e.message;}finally{loading.value=false;}}
function create(){Object.assign(editor,blank());openedVersion.value=null;notice.value='';error.value='';}
async function select(id){error.value='';loading.value=true;try{const {version}=await agentSkillService.read(id);openedVersion.value=version;Object.assign(editor,{...version,id:version.skillId,baseVersion:Number(version.latestVersion),changeNote:''});}catch(e){error.value=e.message;}finally{loading.value=false;}}
async function fileChanged(event){const file=event.target.files?.[0];if(!file)return;error.value='';try{if(!/\.md$/i.test(file.name)||file.size>60000)throw new Error('60KB 이하의 UTF-8 .md 파일을 선택해 주세요.');editor.markdown=await file.text();notice.value='MD 내용을 불러왔습니다. 검토 후 새 버전으로 저장해 주세요.';}catch(e){error.value=e.message;}finally{event.target.value='';}}
async function save(){saving.value=true;error.value='';notice.value='';try{const {version}=await agentSkillService.save({...editor});await load();await select(version.id);announceSkillChange();notice.value=`v${version.version}을 저장했습니다. 프롬프트에서 이 버전을 연결해야 적용됩니다.`;}catch(e){error.value=e.message;}finally{saving.value=false;}}
async function toggle(skill){saving.value=true;error.value='';try{await agentSkillService.setActive({id:skill.id,baseVersion:Number(skill.latestVersion),active:!skill.active});await load();if(editor.id===skill.id)editor.active=!skill.active;announceSkillChange();notice.value=skill.active?'스킬을 비활성화했습니다. 연결된 프롬프트의 새 실행은 연결 해제 또는 재활성화 전까지 차단됩니다.':'스킬을 활성화했습니다. 등록만으로 프롬프트에 자동 연결되지 않습니다.';}catch(e){error.value=e.message;}finally{saving.value=false;}}
function download(){if(!openedVersion.value)return;const blob=new Blob([openedVersion.value.markdown],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${openedVersion.value.key}-v${openedVersion.value.version}.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),0);}
onMounted(load);
</script>
<template>
 <section class="skill-manager" aria-labelledby="agent-skill-title">
  <header><div><h2 id="agent-skill-title">스킬 관리</h2><p>공통 MD 지침을 등록하고 프롬프트별로 버전을 연결합니다.</p></div><button type="button" :disabled="saving||loading" @click="create">새 스킬</button><button type="button" :disabled="saving||loading" @click="load">새로고침</button></header>
  <p>MD 텍스트만 LLM에 전달합니다. 스크립트·외부 링크·추가 참고 파일은 자동 실행하거나 가져오지 않습니다. 기본 정책·등록 토큰·출력 계약이 스킬보다 우선합니다.</p>
  <p v-if="error" role="alert">{{ error }}</p><p v-if="notice" role="status">{{ notice }}</p>
  <div class="skill-workspace">
   <aside aria-label="등록된 스킬 목록"><p v-if="loading" role="status">불러오는 중…</p><p v-if="!loading&&!skills.length">등록된 스킬이 없습니다.</p>
    <article v-for="skill in skills" :key="skill.id"><strong>{{ skill.name }}</strong> <span>{{ skill.active?'활성':'비활성' }} · v{{ skill.latestVersion }}</span><p>{{ skill.description }}</p>
     <button type="button" :disabled="saving||loading" @click="toggle(skill)">{{ skill.active?'비활성화':'활성화' }}</button>
     <button v-for="version in skill.versions" :key="version.id" type="button" :disabled="saving||loading" :aria-pressed="openedVersion?.id===version.id" @click="select(version.id)">v{{ version.version }} 열기</button>
    </article>
   </aside>
   <form @submit.prevent="save"><fieldset :disabled="saving||loading">
    <legend>{{ editor.id?'새 버전 저장':'스킬 등록' }}</legend>
    <label>스킬 키<input v-model="editor.key" required pattern="[a-z][a-z0-9-]{1,79}" maxlength="80" :readonly="Boolean(editor.id)" placeholder="design-taste"></label>
    <label>스킬 이름<input v-model="editor.name" required maxlength="160"></label>
    <label>설명<textarea v-model="editor.description" rows="2" maxlength="2000"></textarea></label>
    <label>출처 URL<input v-model="editor.sourceUrl" type="url" maxlength="2000" placeholder="https://github.com/..."></label>
    <label><input v-model="editor.active" type="checkbox">프롬프트에서 사용 가능</label>
    <label>MD 파일 불러오기<input type="file" accept=".md,text/markdown" @change="fileChanged"></label>
    <label>MD 지침<textarea v-model="editor.markdown" required rows="20" spellcheck="false"></textarea></label>
    <label>변경 기록<input v-model="editor.changeNote" maxlength="2000"></label>
    <p v-if="openedVersion">열어 본 버전: v{{ openedVersion.version }} · SHA-256 {{ openedVersion.contentHash }}. 수정 저장은 기존 버전을 덮어쓰지 않습니다.</p>
    <button type="submit">{{ saving?'저장 중…':editor.id?'새 버전 저장':'스킬 등록' }}</button><button v-if="openedVersion" type="button" @click="download">현재 저장 버전 MD 다운로드</button>
   </fieldset></form>
  </div>
 </section>
</template>
<style scoped>
.skill-manager{display:grid;gap:16px}.skill-manager header{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.skill-manager header>div{flex:1}.skill-manager h2,.skill-manager p{margin:0}.skill-workspace{display:grid;grid-template-columns:minmax(220px,1fr) minmax(0,2fr);gap:20px}.skill-workspace aside{display:grid;align-content:start;gap:12px}.skill-workspace article{padding:12px;border:1px solid var(--app-line);border-radius:8px;overflow-wrap:anywhere}.skill-workspace article button{margin:6px 6px 0 0}.skill-workspace fieldset{display:grid;gap:12px;min-width:0}.skill-workspace label{display:grid;gap:6px}.skill-workspace input:not([type=checkbox]),.skill-workspace textarea{width:100%;box-sizing:border-box}.skill-workspace textarea{font-family:monospace}.skill-workspace p{overflow-wrap:anywhere}.skill-manager [role=alert]{color:var(--app-danger,#b91c1c)}@media(max-width:850px){.skill-workspace{grid-template-columns:1fr}}
</style>
