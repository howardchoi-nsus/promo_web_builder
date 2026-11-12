const {randomUUID,createHash}=require('node:crypto');
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const hash=text=>createHash('sha256').update(text).digest('hex');
const fail=(code,message,statusCode=422)=>Object.assign(new Error(message),{code,statusCode});
function normalizeSkillBindings(bindings=[]){
 if(!Array.isArray(bindings)||bindings.length>4)throw fail('SKILL_BINDINGS_INVALID','프롬프트에는 최대 4개의 스킬 버전을 연결할 수 있습니다.');
 const ids=bindings.map(binding=>typeof binding?.skillVersionId==='string'?binding.skillVersionId.toLowerCase():undefined);
 if(ids.some(id=>typeof id!=='string'||!uuid.test(id))||new Set(ids).size!==ids.length)throw fail('SKILL_BINDINGS_INVALID','중복 없이 유효한 스킬 버전 ID를 선택해 주세요.');
 return ids.map(skillVersionId=>({skillVersionId}));
}
async function assertSkillStorage(sql){
 const rows=await sql`select to_regclass('public.promo_agent_skills') is not null and to_regclass('public.promo_agent_skill_versions') is not null as ready`;
 if(!rows[0]?.ready)throw fail('SKILL_MIGRATION_REQUIRED','스킬 관리를 사용하려면 DB migration 091을 적용해 주세요.',503);
}
function skillPayload(body){
 const key=String(body.key||'').trim(),name=String(body.name||'').trim(),description=String(body.description||'').trim(),markdown=String(body.markdown||'').replace(/^\uFEFF/,'');
 const sourceUrl=String(body.sourceUrl||'').trim(),changeNote=String(body.changeNote||'').trim();
 if(!/^[a-z][a-z0-9-]{1,79}$/.test(key)||!name||name.length>160||description.length>2000||!markdown.trim()||Buffer.byteLength(markdown)>60000||markdown.includes('\0')||changeNote.length>2000)throw fail('SKILL_CONTENT_INVALID','스킬 키·이름·MD 내용을 확인해 주세요. MD 파일은 UTF-8 기준 60KB 이하여야 합니다.');
 if(typeof body.active!=='boolean')throw fail('SKILL_CONTENT_INVALID','스킬 활성 여부를 지정해 주세요.');
 if(sourceUrl){let u;try{u=new URL(sourceUrl);}catch{}if(!u||u.protocol!=='https:'||u.username||u.password||sourceUrl.length>2000)throw fail('SKILL_SOURCE_INVALID','출처는 HTTPS URL로 입력해 주세요. URL의 내용은 자동으로 가져오지 않습니다.');}
 return {key,name,description,markdown,sourceUrl,changeNote,active:body.active};
}
async function listSkills(sql){
 await assertSkillStorage(sql);
 return sql`select s.id::text,s.skill_key as key,s.name,s.description,s.active,s.latest_version as "latestVersion",s.updated_at as "updatedAt",
  coalesce((select jsonb_agg(jsonb_build_object('id',v.id::text,'version',v.version,'name',v.name,'sourceUrl',v.source_url,'contentHash',v.content_hash,'createdAt',v.created_at,'changeNote',v.change_note) order by v.version desc) from promo_agent_skill_versions v where v.skill_id=s.id),'[]'::jsonb) as versions
  from promo_agent_skills s order by s.name,s.id`;
}
async function readSkillVersion(sql,id){
 if(!uuid.test(String(id||'')))throw fail('SKILL_VERSION_INVALID','유효한 스킬 버전 ID가 필요합니다.');
 await assertSkillStorage(sql);
 const rows=await sql`select v.id::text,v.skill_id::text as "skillId",v.version,v.name,v.markdown,v.content_hash as "contentHash",v.source_url as "sourceUrl",v.change_note as "changeNote",s.skill_key as key,s.description,s.active,s.latest_version as "latestVersion"
  from promo_agent_skill_versions v join promo_agent_skills s on s.id=v.skill_id where v.id=${id}::uuid`;
 if(!rows.length)throw fail('SKILL_VERSION_NOT_FOUND','스킬 버전을 찾을 수 없습니다.',404);
 return rows[0];
}
async function saveSkill(sql,body,actor){
 const p=skillPayload(body);await assertSkillStorage(sql);
 const versionId=randomUUID(),contentHash=hash(p.markdown);let rows;
 if(body.id){
  if(!uuid.test(body.id)||!Number.isInteger(body.baseVersion)||body.baseVersion<1)throw fail('SKILL_VERSION_INVALID','현재 스킬 버전을 확인해 주세요.');
  rows=await sql`with head as (
   update promo_agent_skills set name=${p.name},description=${p.description},active=${p.active},latest_version=latest_version+1,updated_by=${actor},updated_at=now()
   where id=${body.id}::uuid and skill_key=${p.key} and latest_version=${body.baseVersion} returning id,latest_version
  ) insert into promo_agent_skill_versions(id,skill_id,version,name,source_url,markdown,content_hash,change_note,created_by)
   select ${versionId}::uuid,id,latest_version,${p.name},${p.sourceUrl},${p.markdown},${contentHash},${p.changeNote},${actor} from head returning id::text,version`;
  if(!rows.length)throw fail('SKILL_REVISION_CONFLICT','다른 변경이 저장됐습니다. 최신 스킬을 다시 불러와 주세요.',409);
 }else{
  const skillId=randomUUID();
  try{rows=await sql`with head as (
   insert into promo_agent_skills(id,skill_key,name,description,active,updated_by) values(${skillId}::uuid,${p.key},${p.name},${p.description},${p.active},${actor}) returning id
  ) insert into promo_agent_skill_versions(id,skill_id,version,name,source_url,markdown,content_hash,change_note,created_by)
   select ${versionId}::uuid,id,1,${p.name},${p.sourceUrl},${p.markdown},${contentHash},${p.changeNote},${actor} from head returning id::text,version`;
  }catch(e){if(e.code==='23505')throw fail('SKILL_KEY_EXISTS','이미 등록된 스킬 키입니다.',409);throw e;}
 }
 return readSkillVersion(sql,rows[0].id);
}
async function setSkillActive(sql,{id,baseVersion,active},actor){
 if(!uuid.test(String(id||''))||!Number.isInteger(baseVersion)||typeof active!=='boolean')throw fail('SKILL_CONTENT_INVALID','스킬과 버전·활성 여부를 확인해 주세요.');
 await assertSkillStorage(sql);
 const rows=await sql`update promo_agent_skills set active=${active},updated_by=${actor},updated_at=now() where id=${id}::uuid and latest_version=${baseVersion} returning id::text`;
 if(!rows.length)throw fail('SKILL_REVISION_CONFLICT','스킬이 변경됐습니다. 최신 상태를 불러와 주세요.',409);
 return {id,active};
}
async function resolvePromptSkills(sql,bindings){
 const normalized=normalizeSkillBindings(bindings);if(!normalized.length)return [];
 await assertSkillStorage(sql);
 const ids=normalized.map(binding=>binding.skillVersionId);
 const rows=await sql`select v.id::text,v.skill_id::text as "skillId",v.version,v.name,v.markdown,v.content_hash as "contentHash",v.source_url as "sourceUrl",s.skill_key as key,s.active
  from promo_agent_skill_versions v join promo_agent_skills s on s.id=v.skill_id where v.id=any(${ids}::uuid[])`;
 const ordered=ids.map(id=>rows.find(row=>row.id===id));
 if(ordered.some(row=>!row))throw fail('SKILL_VERSION_NOT_FOUND','연결된 스킬 버전을 찾을 수 없습니다. 프롬프트의 스킬 연결을 확인해 주세요.',409);
 if(ordered.some(row=>!row.active))throw fail('SKILL_INACTIVE','연결된 스킬이 비활성 상태입니다. Admin에서 확인하거나 프롬프트에서 연결을 해제해 주세요.',409);
 if(ordered.some(row=>hash(row.markdown)!==row.contentHash))throw fail('SKILL_INTEGRITY_INVALID','스킬 버전의 내용과 해시가 일치하지 않습니다.',409);
 if(ordered.reduce((size,row)=>size+Buffer.byteLength(row.markdown),0)>80000)throw fail('SKILL_BUDGET_EXCEEDED','연결된 스킬 MD의 합계는 80KB 이하여야 합니다. 지침을 필요한 내용으로 줄여 주세요.');
 return ordered;
}
module.exports={normalizeSkillBindings,assertSkillStorage,listSkills,readSkillVersion,saveSkill,setSkillActive,resolvePromptSkills};
