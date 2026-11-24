import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),{PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite'),db=new PGlite();
const rawSql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
let conflict=false;const sql=async(strings,...values)=>{if(conflict&&/with (updated|deactivated) as/.test(strings.join(''))){const interval=conflict==='microseconds'?'1 microsecond':'1 second';conflict=false;await db.query("update prompt_templates set updated_at=updated_at+$1::interval,name='Concurrent edit' where id=$2",[interval,draft]);}return rawSql(strings,...values);};
const store=require('../api/_prompt-template-store');store.getSql=()=>sql;store.ensureDefaultPromptTemplates=async()=>{};require('../api/_llm-model-registry-store').requireActiveRegisteredModel=async()=>({});require('../api/_promo-admin-auth').resolveAdminOwner=()=>({ownerSubject:'admin:test'});
const update=require('../api/prompt-template'),validate=require('../api/prompt-template-validate'),activate=require('../api/prompt-template-activate');
const active='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',draft='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
async function call(handler,method,body){let status=200,payload;await handler({method,body,query:{id:body?.id}},{setHeader(){},status(n){status=n;return this;},json(p){payload=p;return this;}});return {status,payload};}
async function read(id=draft){return (await db.query('select * from prompt_templates where id=$1',[id])).rows[0];}
try{
 await db.exec(`create table prompt_templates(id uuid primary key default gen_random_uuid(),type text,name text,body text,status text,version integer,lineage_id uuid,source_prompt_template_id uuid,validated_at timestamptz,required_variables jsonb,optional_variables jsonb,provider text,model text,temperature numeric,max_tokens integer,response_format text,model_options jsonb,change_note text,archived_at timestamptz,created_at timestamptz default now(),updated_at timestamptz default now());`);
 // Match the audit insert contracts exercised by all three real handlers.
 const fields=new Set();for(const file of ['prompt-template.js','prompt-template-validate.js','prompt-template-activate.js']){const source=readFileSync(new URL('../api/'+file,import.meta.url),'utf8');for(const match of source.matchAll(/insert into prompt_template_histories\s*\(([\s\S]*?)\)\s*(?:select|values)/g))for(const field of match[1].split(','))fields.add(field.trim());}
 const columnType=name=>name==='prompt_template_id'?'uuid':name.endsWith('_version')?'integer':name.endsWith('_options')?'jsonb':'text';
 await db.exec(`create table prompt_template_histories(id uuid default gen_random_uuid(),${[...fields].map(name=>name+' '+columnType(name)).join(',')},changed_at timestamptz default now())`);
 await db.exec(readFileSync(new URL('../db/migrations/091_admin_agent_skills.sql',import.meta.url),'utf8'));
 const options={executionSnapshotVersion:2,runtimeConfig:{timeoutMs:240000,maxAttempts:1,retryBaseMs:0,retryMaxMs:0},harnessConfig:{},modelCapabilitySnapshot:{},safetyContract:{key:'page-schema-v1',version:1}},vars=store.PROMPT_TYPES.promo_page_schema_planner.requiredVariables,body=vars.map(v=>'{{'+v+'}}').join('\n');
 for(const [id,status,version] of [[active,'active',1],[draft,'draft',2]])await db.query('insert into prompt_templates(id,type,name,body,status,version,lineage_id,required_variables,optional_variables,provider,model,response_format,model_options) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[id,'promo_page_schema_planner','Planner',body,status,version,active,JSON.stringify(vars),'[]','openai','registered-model','json_object',JSON.stringify(options)]);
 // PostgreSQL preserves microseconds; the default JS timestamp parser does not.
 // Unchanged rows must remain editable when exact timestamps came from SQL Editor.
 await db.query("update prompt_templates set updated_at='2026-11-24 00:00:00.123456+00' where id=$1",[draft]);
 const preciseRead=await call(update,'GET',{id:draft});assert.equal(preciseRead.status,200);
 const preciseSave=await call(update,'PATCH',{id:draft,editToken:preciseRead.payload.prompt.editToken,name:'Precision save'});
 assert.equal(preciseSave.status,200,JSON.stringify(preciseSave));
 await db.query("update prompt_templates set updated_at='2026-11-24 00:00:00.123456+00' where id=$1",[draft]);
 const preciseValidate=await call(validate,'POST',{id:draft,editToken:store.promptEditToken(await read())});
 assert.equal(preciseValidate.status,200,JSON.stringify(preciseValidate));
 await db.query("update prompt_templates set updated_at='2026-11-24 00:00:00.123456+00' where id=$1",[draft]);
 const preciseActivate=await call(activate,'POST',{id:draft,editToken:store.promptEditToken(await read())});
 assert.equal(preciseActivate.status,200,JSON.stringify(preciseActivate));
 // Restore fixture roles, then prove exact microsecond CAS still rejects races.
 await db.query("update prompt_templates set status='draft',validated_at=null where id=$1",[draft]);
 await db.query("update prompt_templates set status='active' where id=$1",[active]);
 for(const [handler,method,status] of [[update,'PATCH','draft'],[validate,'POST','draft'],[activate,'POST','validated']]){
  await db.query("update prompt_templates set status=$1,updated_at='2026-11-24 00:00:00.123456+00' where id=$2",[status,draft]);
  const before=await read(),count=(await db.query('select count(*)::int as n from prompt_template_histories')).rows[0].n;
  conflict='microseconds';const race=await call(handler,method,{id:draft,editToken:store.promptEditToken(before),name:'Do not overwrite'});
  assert.equal(race.status,409,JSON.stringify(race));assert.equal(race.payload.code,'PROMPT_EDIT_CONFLICT');
  assert.equal((await read()).status,status);assert.equal((await read()).name,'Concurrent edit');
  assert.equal((await read()).body,before.body);assert.equal((await read(active)).status,'active');
  assert.equal((await db.query('select count(*)::int as n from prompt_template_histories')).rows[0].n,count);
 }
 await db.query("update prompt_templates set status='draft',validated_at=null where id=$1",[draft]);
 let token=store.promptEditToken(await read());
 let result=await call(update,'PATCH',{id:draft,editToken:'stale',name:'Overwrite'});assert.equal(result.payload.code,'PROMPT_EDIT_CONFLICT');
 result=await call(update,'PATCH',{id:draft,editToken:token,modelOptions:{...options,promptLayers:{additionalInstructions:['Use {{missing_variable}}']}}});assert.equal(result.status,200,JSON.stringify(result));
 result=await call(validate,'POST',{id:draft,editToken:result.payload.prompt.editToken});assert.equal(result.payload.code,'PROMPT_VARIABLES_UNRESOLVED');assert.equal((await read()).status,'draft');
 result=await call(update,'PATCH',{id:draft,editToken:store.promptEditToken(await read()),modelOptions:options});assert.equal(result.status,200,JSON.stringify(result));
 conflict=true;result=await call(validate,'POST',{id:draft,editToken:result.payload.prompt.editToken});assert.equal(result.status,409);assert.equal((await read()).name,'Concurrent edit');assert.equal((await read()).status,'draft');
 result=await call(validate,'POST',{id:draft,editToken:store.promptEditToken(await read())});assert.equal(result.status,200,JSON.stringify(result));assert.equal(result.payload.assembledPreview.mode,'synthetic-input-contract-only');assert.ok(result.payload.assembledPreview.renderedPrompt.includes('[sample:overviewJson]'));
 assert.equal((await call(activate,'POST',{id:draft,editToken:'stale'})).payload.code,'PROMPT_EDIT_CONFLICT');assert.equal((await read(active)).status,'active');
 result=await call(activate,'POST',{id:draft,editToken:result.payload.prompt.editToken});assert.equal(result.status,200,JSON.stringify(result));assert.equal((await read()).status,'active');assert.equal((await read(active)).status,'inactive');
 const skills=require('../api/_agent-skill-store');await assert.rejects(skills.saveSkill(sql,{key:'scoped',name:'Scoped',active:true,markdown:'Only manifest',allowedPromptTypes:['promo_page_manifest_planner']},'test'),{code:'SKILL_SCOPE_MIGRATION_REQUIRED'});
 const migration=readFileSync(new URL('../db/migrations/097_skill_prompt_scopes.sql',import.meta.url),'utf8');await db.exec(migration);await db.exec(migration);
 const skill=await skills.saveSkill(sql,{key:'scoped',name:'Scoped',active:true,markdown:'Only manifest',allowedPromptTypes:['promo_page_manifest_planner']},'test');
 await skills.resolvePromptSkills(sql,[{skillVersionId:skill.id}],'promo_page_manifest_planner');await assert.rejects(skills.resolvePromptSkills(sql,[{skillVersionId:skill.id}],'promo_page_region_builder'),{code:'SKILL_PROMPT_SCOPE_MISMATCH'});
 await db.query("update prompt_templates set model_options=model_options||jsonb_build_object('skillBindings',jsonb_build_array(jsonb_build_object('skillVersionId',$1::text))) where id=$2",[skill.id,draft]);
 await assert.rejects(skills.setSkillActive(sql,{id:skill.skillId,baseVersion:1,active:false},'test'),e=>e.code==='SKILL_IN_USE'&&e.dependents.length===1);
 // Remove unrelated scoped binding before checking new scoped Draft creation.
 await db.query("update prompt_templates set model_options=model_options||'{\"skillBindings\":[]}'::jsonb where id=$1",[draft]);
 const pack=readFileSync(new URL('../db/migrations/098_automatic_design_pack.sql',import.meta.url),'utf8');await db.exec(pack);await db.exec(pack);
 const drafts=await sql`select * from prompt_templates where change_note='Migration 098: scoped automatic design Draft; validate separately'`;assert.equal(drafts.length,1);assert.equal(drafts[0].status,'draft');assert.equal(drafts[0].model,'registered-model');assert.equal(drafts[0].model_options.runtimeConfig.timeoutMs,240000);
 assert.equal((await sql`select id from promo_agent_skills where skill_key like 'auto-%' and active=false`).length,6);assert.equal((await read()).status,'active');
 console.log('Admin safety: microsecond GET/save/validate/activate and exact 1us race rejection preserve active/audit state; stale/in-flight edits, assembled variables, scoped immutable skills, dependent disable rejection, 097/098 idempotence and registered config preservation passed.');
}finally{await db.close();}
