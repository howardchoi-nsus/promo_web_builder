import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {context} from './page-schema.mjs';import {unitFixture} from './page-draft-units.mjs';
const require=createRequire(import.meta.url);
export async function createUnitHarness({chat=true}={}){
 const {PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite'),db=new PGlite();
 const sql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
 const doc='abababab-abab-4aba-8aba-abababababab',owner='owner';
 try{
 await db.exec(`create table promo_builder_documents(id uuid primary key,owner_subject text,current_document_revision integer default 0,status text,updated_at timestamptz default now());
 create table promo_builder_document_versions(document_id uuid,revision integer,contract_version integer,snapshot_json jsonb,snapshot_hash text,change_note text,source text,created_at timestamptz default now());
 create table prompt_templates(id uuid default gen_random_uuid(),type text,name text,body text,status text,version integer,lineage_id uuid,source_prompt_template_id uuid,required_variables jsonb,optional_variables jsonb,provider text,model text,temperature numeric,max_tokens integer,response_format text,model_options jsonb,change_note text,archived_at timestamptz,created_at timestamptz default now(),updated_at timestamptz default now());
 insert into promo_builder_documents(id,owner_subject) values('${doc}','${owner}');`);
 const migration=fs.readFileSync(new URL('../../db/migrations/086_dynamic_page_schema_prompt.sql',import.meta.url),'utf8');await db.exec(migration.slice(migration.indexOf('create or replace function create_promo_builder_document_revision'),migration.lastIndexOf('commit;')));
 await db.exec(`insert into prompt_templates(type,name,body,status,version,lineage_id,model_options) values('promo_page_schema_planner','planner','body','active',1,gen_random_uuid(),'{}');`);
 await db.exec(fs.readFileSync(new URL('../../db/migrations/088_page_schema_generation_jobs.sql',import.meta.url),'utf8'));
 const draftMigration=fs.readFileSync(new URL('../../db/migrations/095_progressive_page_drafts.sql',import.meta.url),'utf8');await db.exec(draftMigration);await db.exec(draftMigration);assert.equal((await sql`select id from prompt_templates where type in ('promo_page_outline_planner','promo_page_fragment_writer')`).length,2);
 await db.exec(fs.readFileSync(new URL('../../db/migrations/091_admin_agent_skills.sql',import.meta.url),'utf8'));const directionMigration=fs.readFileSync(new URL('../../db/migrations/094_design_direction_pack.sql',import.meta.url),'utf8');await db.exec(directionMigration);await db.exec(directionMigration);assert.equal((await sql`select id from promo_agent_skill_versions`).length,4);
 const read=async()=>{const rows=await sql`select d.current_document_revision,v.snapshot_json from promo_builder_documents d left join promo_builder_document_versions v on v.document_id=d.id and v.revision=d.current_document_revision where d.id=${doc}::uuid`;return {document:{id:doc,currentDocumentRevision:rows[0].current_document_revision},snapshot:rows[0].snapshot_json};};
 const overview={title:context.contentSources.source_title.text,leadText:context.contentSources.source_lead.text,contentSections:[{title:context.contentSources.source_benefit.text,description:context.contentSources.source_process.text}]};
 process.env.PROMO_BUILDER_CHAT_WORKSPACE_V1_ENABLED=chat?'true':'false';
 await db.exec(`create table promo_builder_chat_sessions(id uuid primary key,document_id uuid,owner_subject text,latest_requirements_revision integer,stage text,updated_at timestamptz default now());create table promo_builder_requirements_revisions(session_id uuid,revision integer,requirements_json jsonb,requirements_fingerprint text);create table promo_builder_chat_actions(id uuid primary key,session_id uuid,action_key text,status text,created_at timestamptz default now(),executed_at timestamptz);insert into promo_builder_chat_sessions values('11111111-1111-4111-8111-111111111111','${doc}','${owner}',1,'requirements_review',now());insert into promo_builder_chat_actions(id,session_id,action_key,status) values('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','confirm_requirements','proposed');`);
 const canonical=require('../../api/_promo-overview-contract').normalizeOverview(overview);await sql`insert into promo_builder_requirements_revisions values('11111111-1111-4111-8111-111111111111',1,${JSON.stringify(canonical)}::jsonb,'fingerprint')`;

 await sql`update prompt_templates set provider='openai',model='registered-model',model_options='{"executionSnapshotVersion":2,"skillBindings":[]}'::jsonb where type in('promo_page_outline_planner','promo_page_fragment_writer')`;
 const unitMigration=fs.readFileSync(new URL('../../db/migrations/096_page_draft_units_v2.sql',import.meta.url),'utf8');await db.exec(unitMigration);await db.exec(unitMigration);
 const v2=await sql`select * from prompt_templates where model_options->>'pageDraftContractVersion'='2'`;assert.equal(v2.length,2);for(const row of v2){assert.equal(row.status,'draft');assert.equal(row.provider,'openai');assert.equal(row.model,'registered-model');assert.deepEqual(row.model_options.skillBindings,[]);}
 assert.equal((await sql`select id from prompt_templates where type in('promo_page_outline_planner','promo_page_fragment_writer') and status='draft'`).length,2);
 let release,held=false,heldIndex=1,failNext=false,contractVersion=2,staged,modelCalls=[];const events=[];
 const deps={loadPageSchemaLibrary:async()=>context,fetchDocument:read,createPromptExecutionSnapshot:async(_,type,variables)=>({promptConfig:{promptId:'fixture',model:'registered-model',type,variables,modelOptions:{pageDraftContractVersion:contractVersion}}}),generate:async args=>{
  const cfg=args.promptConfig,candidates=JSON.parse(cfg.variables.candidateSnapshotJson),constraints=JSON.parse(cfg.variables.constraintsJson);modelCalls.push({type:cfg.type,region:constraints.region?.shell.id});
  if(failNext){failNext=false;throw Error('unit provider test failure');}
  if(constraints.phase==='plan'){staged=unitFixture(candidates.contentSources);return {result:staged.plan};}
  if(held&&constraints.region.shell.id===staged.plan.regions[heldIndex].shell.id)await new Promise(resolve=>release=resolve);
  if(failNext){failNext=false;throw Error('unit provider test failure');}
  const index=staged.plan.regions.findIndex(r=>r.shell.id===constraints.region.shell.id);return {result:staged.results[index]};
 }};
 return {db,sql,doc,owner,overview,read,modelCalls,events,
  setContractVersion(v){contractVersion=v;},failNext(){failNext=true;},holdFirst(){held=true;heldIndex=0;},holdSecond(){held=true;heldIndex=1;},get waiting(){return Boolean(release);},release(){held=false;release?.();release=null;},
  async invoke(body){let response,status;const res={status(code){status=code;return this;},json(data){response=data;return this;}};
   await require('../../api/_page-draft-service').processPageDraft({sql,owner:{ownerSubject:owner},found:await read(),body:{documentId:doc,baseDocumentRevision:0,requirementsRevision:1,...body},res},deps);
   events.push({sequence:response.sequence,complete:response.complete,completed:response.completedRegions});return {...response,httpStatus:status};
  },async close(){held=false;release?.();await db.close();}};
 }catch(e){await db.close();throw e;}
}
