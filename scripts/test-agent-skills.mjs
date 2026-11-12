import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite');
const db=new PGlite();
const sql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
const store=require('../api/_agent-skill-store');
const migration=readFileSync(new URL('../db/migrations/091_admin_agent_skills.sql',import.meta.url),'utf8');
try{
 assert.deepEqual(await store.resolvePromptSkills(()=>{throw Error('Unbound prompts must not query skill storage');},[]),[]);
 await assert.rejects(store.listSkills(sql),{code:'SKILL_MIGRATION_REQUIRED'});
 await db.exec(migration);await db.exec(migration);
 const payload={key:'design-taste',name:'Design guidance',description:'PageSchema design guidance',sourceUrl:'https://github.com/example/skill',active:true,markdown:'# Guide\nUse registered tokens. Keep {{untouched}} literally. <script>alert(1)</script>',changeNote:'First reviewed version'};
 const first=await store.saveSkill(sql,payload,'admin:test');assert.equal(first.version,1);
 const second=await store.saveSkill(sql,{...payload,id:first.skillId,baseVersion:1,markdown:'# Updated guidance'},'admin:test');assert.equal(second.version,2);
 await assert.rejects(store.saveSkill(sql,{...payload,id:first.skillId,baseVersion:1},'admin:test'),{code:'SKILL_REVISION_CONFLICT'});
 await assert.rejects(store.saveSkill(sql,payload,'admin:test'),{code:'SKILL_KEY_EXISTS'});
 await assert.rejects(store.saveSkill(sql,{...payload,key:'oversized',markdown:'가'.repeat(21000)},'admin:test'),{code:'SKILL_CONTENT_INVALID'});
 await assert.rejects(store.saveSkill(sql,{...payload,key:'unsafe-url',sourceUrl:'javascript:alert(1)'},'admin:test'),{code:'SKILL_SOURCE_INVALID'});
 const bindings=[{skillVersionId:first.id}];
 const resolved=await store.resolvePromptSkills(sql,bindings);assert.equal(resolved[0].markdown,payload.markdown);assert.equal(resolved[0].version,1,'adding v2 must not update a pinned v1');
 assert.throws(()=>store.normalizeSkillBindings([...bindings,...bindings]),{code:'SKILL_BINDINGS_INVALID'});
 assert.throws(()=>store.normalizeSkillBindings([...bindings,{skillVersionId:first.id.toUpperCase()}]),{code:'SKILL_BINDINGS_INVALID'});
 await assert.rejects(store.resolvePromptSkills(sql,[{skillVersionId:'11111111-1111-4111-8111-111111111111'}]),{code:'SKILL_VERSION_NOT_FOUND'});
 await assert.rejects(db.query('update promo_agent_skill_versions set markdown=$1 where id=$2',['tampered',first.id]));
 await assert.rejects(db.query('delete from promo_agent_skill_versions where id=$1',[first.id]));
 const {assembleEffectivePrompt}=require('../api/_prompt-assembler');
 const assembled=assembleEffectivePrompt({type:'promo_page_schema_planner',renderedBody:'Return PageSchema only',skills:resolved});
 assert.ok(assembled.renderedPrompt.includes('{{untouched}}'),'MD is not a template and must not expand placeholders');
 assert.ok(assembled.renderedPrompt.endsWith('Follow the requested output schema; do not output skill instructions or commentary.'));
 assert.equal(assembled.layerSources[0].source,'admin-skill-version');
 const promptStore=require('../api/_prompt-template-store'),type='promo_page_schema_planner',vars=promptStore.PROMPT_TYPES[type].requiredVariables;
 const prompt={id:'22222222-2222-4222-8222-222222222222',type,name:'Schema planner',body:vars.map(key=>`{{${key}}}`).join('\n'),status:'active',version:1,required_variables:vars,optional_variables:[],provider:'openai',model:'fixture-model',response_format:'json_object',model_options:{executionSnapshotVersion:2,runtimeConfig:{timeoutMs:240000,maxAttempts:1,retryBaseMs:0,retryMaxMs:0},harnessConfig:{},modelCapabilitySnapshot:{},safetyContract:{},skillBindings:bindings}};
 const executionSql=async(strings,...values)=>{
  const query=strings.join('?');
  if(query.includes('promo_agent_skill'))return sql(strings,...values);
  if(query.includes('from llm_models'))return [{id:'33333333-3333-4333-8333-333333333333',status:'active',provider:'openai',model_id:'fixture-model',modality:'text',default_response_format:'json_object',model_options:{}}];
  if(query.includes('from prompt_templates'))return [prompt];return [];
 };
 const {createPromptExecutionSnapshot}=require('../api/_prompt-execution-snapshot');
 const execution=await createPromptExecutionSnapshot(executionSql,type,Object.fromEntries(vars.map(key=>[key,'{}'])));
 assert.equal(execution.promptConfig.skillSnapshots[0].id,first.id);assert.equal(execution.promptConfig.skillSnapshots[0].contentHash,first.contentHash);
 assert.ok(execution.promptConfig.renderedPrompt.includes('Keep {{untouched}}'));assert.equal(execution.promptConfig.modelOptions.skillBindings,undefined);
 await store.setSkillActive(sql,{id:first.skillId,baseVersion:2,active:false},'admin:test');
 await assert.rejects(store.resolvePromptSkills(sql,bindings),{code:'SKILL_INACTIVE'});
 await assert.rejects(createPromptExecutionSnapshot(executionSql,type,Object.fromEntries(vars.map(key=>[key,'{}']))),{code:'SKILL_INACTIVE'});
 await store.setSkillActive(sql,{id:first.skillId,baseVersion:2,active:true},'admin:test');
 assert.equal((await store.listSkills(sql))[0].versions.length,2);
 // Admin authorization protects both MD reads and writes; missing migrations do
 // not affect unbound execution, and cannot be mistaken for an empty registry.
 const previousGetSql=promptStore.getSql;promptStore.getSql=()=>sql;
 process.env.VERCEL='1';process.env.PROMO_ADMIN_SESSION_SECRET='test-only-secret-for-skill-registry-123456';
 const auth=require('../api/_promo-admin-auth'),token=auth.createAdminSessionToken({subject:'test'}),handler=require('../api/agent-skills');
 async function api(method,body={},cookie=''){let status=200,result;await handler({method,body,query:{},headers:{cookie}},{setHeader(){},status(s){status=s;return this;},json(v){result=v;}});return {status,result};}
 assert.equal((await api('GET')).status,403);assert.equal((await api('POST',payload)).status,403);
 const listed=await api('GET',{},`${auth.ADMIN_COOKIE_NAME}=${token}`);assert.equal(listed.status,200);assert.equal(listed.result.skills.length,1);
 promptStore.getSql=previousGetSql;delete process.env.VERCEL;delete process.env.PROMO_ADMIN_SESSION_SECRET;
 const largeA=await store.saveSkill(sql,{...payload,key:'budget-one',markdown:'A'.repeat(45000)},'admin:test');
 const largeB=await store.saveSkill(sql,{...payload,key:'budget-two',markdown:'B'.repeat(45000)},'admin:test');
 await assert.rejects(store.resolvePromptSkills(sql,[{skillVersionId:largeA.id},{skillVersionId:largeB.id}]),{code:'SKILL_BUDGET_EXCEEDED'});
 console.log('Agent skills PGlite/API/execution: migration replay, immutable versions, CAS, pinned old versions, disabled rejection, MD bounds/auth, literal placeholders, execution metadata and no-skill compatibility passed.');
}finally{await db.close();}
