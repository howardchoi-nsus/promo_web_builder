import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url),{PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite'),db=new PGlite();
const sql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
const doc='abababab-abab-4aba-8aba-abababababab',run='cccccccc-cccc-4ccc-8ccc-cccccccccccc',owner='owner';
const {walk}=require('../shared/page-schema/contract.cjs');
try{
 await db.exec(`create table promo_builder_documents(id uuid primary key,owner_subject text,current_document_revision integer default 0,status text,updated_at timestamptz default now());
 create table promo_builder_document_versions(document_id uuid,revision integer,contract_version integer,snapshot_json jsonb,snapshot_hash text,change_note text,source text,created_at timestamptz default now());
 create table prompt_templates(id uuid default gen_random_uuid(),type text,name text,body text,status text,version integer,lineage_id uuid,source_prompt_template_id uuid,required_variables jsonb,optional_variables jsonb,provider text,model text,temperature numeric,max_tokens integer,response_format text,model_options jsonb,change_note text,archived_at timestamptz,created_at timestamptz default now(),updated_at timestamptz default now());
 insert into promo_builder_documents(id,owner_subject) values('${doc}','${owner}');`);
 const migration=fs.readFileSync(new URL('../db/migrations/086_dynamic_page_schema_prompt.sql',import.meta.url),'utf8');await db.exec(migration.slice(migration.indexOf('create or replace function create_promo_builder_document_revision'),migration.lastIndexOf('commit;')));
 await db.exec(`insert into prompt_templates(type,name,body,status,version,lineage_id,model_options) values('promo_page_schema_planner','planner','body','active',1,gen_random_uuid(),'{}');`);
 await db.exec(fs.readFileSync(new URL('../db/migrations/088_page_schema_generation_jobs.sql',import.meta.url),'utf8'));
 const draftMigration=fs.readFileSync(new URL('../db/migrations/095_progressive_page_drafts.sql',import.meta.url),'utf8');await db.exec(draftMigration);await db.exec(draftMigration);assert.equal((await sql`select id from prompt_templates where type in ('promo_page_outline_planner','promo_page_fragment_writer')`).length,2);
 await db.exec(fs.readFileSync(new URL('../db/migrations/091_admin_agent_skills.sql',import.meta.url),'utf8'));const directionMigration=fs.readFileSync(new URL('../db/migrations/094_design_direction_pack.sql',import.meta.url),'utf8');await db.exec(directionMigration);await db.exec(directionMigration);assert.equal((await sql`select id from promo_agent_skill_versions`).length,4);
 const read=async()=>{const rows=await sql`select d.current_document_revision,v.snapshot_json from promo_builder_documents d left join promo_builder_document_versions v on v.document_id=d.id and v.revision=d.current_document_revision where d.id=${doc}::uuid`;return {document:{id:doc,currentDocumentRevision:rows[0].current_document_revision},snapshot:rows[0].snapshot_json};};
 const overview={title:context.contentSources.source_title.text,leadText:context.contentSources.source_lead.text,contentSections:[{title:context.contentSources.source_benefit.text,description:context.contentSources.source_process.text}]};
 process.env.PROMO_BUILDER_CHAT_WORKSPACE_V1_ENABLED='true';
 await db.exec(`create table promo_builder_chat_sessions(id uuid primary key,document_id uuid,owner_subject text,latest_requirements_revision integer,stage text,updated_at timestamptz default now());create table promo_builder_requirements_revisions(session_id uuid,revision integer,requirements_json jsonb,requirements_fingerprint text);create table promo_builder_chat_actions(id uuid primary key,session_id uuid,action_key text,status text,created_at timestamptz default now(),executed_at timestamptz);insert into promo_builder_chat_sessions values('11111111-1111-4111-8111-111111111111','${doc}','${owner}',1,'requirements_review',now());insert into promo_builder_chat_actions(id,session_id,action_key,status) values('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','confirm_requirements','proposed');`);
 const canonical=require('../api/_promo-overview-contract').normalizeOverview(overview);await sql`insert into promo_builder_requirements_revisions values('11111111-1111-4111-8111-111111111111',1,${JSON.stringify(canonical)}::jsonb,'fingerprint')`;
 let calls=0,failOnce=true,response;
 const deps={loadPageSchemaLibrary:async()=>context,fetchDocument:read,createPromptExecutionSnapshot:async(_,type,variables)=>({promptConfig:{promptId:'fixture',model:'registered-model',type,variables}}),generate:async args=>{
  calls++;const cfg=args.promptConfig,candidates=JSON.parse(cfg.variables.candidateSnapshotJson),constraints=JSON.parse(cfg.variables.constraintsJson);
  if(cfg.type==='promo_page_outline_planner'){
   const page=fixture('example-editorial'),sourceAssignments=[];
   walk(page.root,({node})=>{node.styles.spacing={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};if(node.type==='container')node.overlayRole=null;if(node.type==='image')node.presentation='content';if(node.type==='button'){node.actionId=null;node.sourceIds=[];}if(node.type==='text'){const text=node.contentMode==='source'?context.contentSources[node.sourceIds[0]].text:null;if(text){const match=Object.entries(candidates.contentSources).find(([,s])=>s.text===text);if(match)sourceAssignments.push({nodeId:node.id,sourceId:match[0]});}node.contentMode='editorial';node.sourceIds=[];node.text='';}});
   for(const r of page.mediaRequests)r.regenerate=false;return {result:{page,sourceAssignments}};
  }
  if(failOnce){failOnce=false;throw Error('provider test failure');}
  return {result:{texts:constraints.group.nodeIds.map(nodeId=>({nodeId,text:'새로운 경험을 만나보세요'}))}};
 }};
 const res={status(code){this.statusCode=code;return this;},json(data){response=data;return this;}};
 let draftService=require('../api/_page-draft-legacy-service');
 const invoke=async body=>draftService.processPageDraft({sql,owner:{ownerSubject:owner},found:await read(),body:{documentId:doc,requestId:run,baseDocumentRevision:0,requirementsRevision:1,...body},res},deps);
 await invoke({operation:'start-draft',overview,generationRequest:'좌측 카피 프리미엄'});assert.equal(response.draft,true);assert.equal((await read()).document.currentDocumentRevision,0);assert.ok(response.page.root);const sequence=response.sequence;draftService=require('../api/_page-draft-service');
 await assert.rejects(invoke({operation:'advance-draft',sequence}),/provider test failure/);const [failed]=await sql`select sequence,lease_token from promo_page_drafts`;assert.equal(failed.sequence,sequence);assert.equal(failed.lease_token,null);
 for(let n=0;n<20&&!response.complete;n++)await invoke({operation:'advance-draft',sequence:response.sequence});assert.equal(response.complete,true);assert.equal(response.revision,1);
 const saved=await read();assert.equal(saved.snapshot.generationMeta.draftRunId,run);assert.equal(saved.snapshot.generationMeta.review.state,'pending');assert.equal((await sql`select stage from promo_builder_chat_sessions`)[0].stage,'wireframe_review');assert.equal((await sql`select status from promo_builder_chat_actions`)[0].status,'executed');assert.equal(saved.snapshot.content.pageContext.designBrief.briefVersion,2);
 const before=calls;await invoke({operation:'start-draft'});assert.equal(response.complete,true);assert.equal(calls,before);
 await sql`update promo_page_drafts set status='working',final_revision=null`;await invoke({operation:'advance-draft'});assert.equal(response.complete,true);assert.equal((await sql`select status from promo_page_drafts`)[0].status,'complete');
 const {applyFragment}=require('../api/_page-draft-contract');assert.throws(()=>applyFragment(saved.snapshot.content.pageSchema,saved.snapshot.content.pageContext,{nodeIds:['nope']},{texts:[{nodeId:'nope',text:'$999'}]}));
 console.log('Legacy page drafts PostgreSQL: 094/095 idempotent migrations, real partial SQL saves and atomic chat/action/job transition, failure lease cleanup/resume, final PageSchema save, approval pending, replay and post-save crash recovery passed.');
}finally{await db.close();}
