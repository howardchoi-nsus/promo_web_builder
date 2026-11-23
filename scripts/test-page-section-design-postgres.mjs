// Preserve explicit legacy approval-path regression coverage. New automatic flow is tested separately.
process.env.PAGE_SCHEMA_AUTO_FLOW_ENABLED='false';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {designFixture} from './fixtures/design-preview-enhancements.mjs';
const require=createRequire(import.meta.url),{PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite'),db=new PGlite();
const sql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
const doc='abababab-abab-4aba-8aba-abababababab',owner='owner';
try{
 await db.exec(`create table promo_builder_documents(id uuid primary key,owner_subject text,current_document_revision integer default 0,status text,updated_at timestamptz default now());
 create table promo_builder_document_versions(document_id uuid,revision integer,contract_version integer,snapshot_json jsonb,snapshot_hash text,change_note text,source text,created_at timestamptz default now());
 create table prompt_templates(id uuid default gen_random_uuid(),type text,name text,body text,status text,version integer,lineage_id uuid,required_variables jsonb,optional_variables jsonb,provider text,model text,temperature numeric,max_tokens integer,response_format text,model_options jsonb,change_note text,archived_at timestamptz,created_at timestamptz default now(),updated_at timestamptz default now());
 insert into promo_builder_documents(id,owner_subject) values('${doc}','${owner}');`);
 const migration=fs.readFileSync(new URL('../db/migrations/086_dynamic_page_schema_prompt.sql',import.meta.url),'utf8');
 await db.exec(migration.slice(migration.indexOf('create or replace function create_promo_builder_document_revision'),migration.lastIndexOf('commit;')));
 await db.exec(fs.readFileSync(new URL('../db/migrations/088_page_schema_generation_jobs.sql',import.meta.url),'utf8'));
 await sql`insert into prompt_templates(type,name,status,version,provider,model,max_tokens,model_options) values('promo_page_schema_planner','Current planner','active',1,'openai','registered-planner-model',12000,${JSON.stringify({executionSnapshotVersion:2,runtimeConfig:{timeoutMs:240000,maxAttempts:1,retryBaseMs:0,retryMaxMs:0},harnessConfig:{},modelCapabilitySnapshot:{},safetyContract:{},skillBindings:[{skillVersionId:'should-not-be-copied'}]})}::jsonb)`;

 const migration093=fs.readFileSync(new URL('../db/migrations/093_page_section_design_prompt.sql',import.meta.url),'utf8');await db.exec(migration093);await db.exec(migration093);
 const [prompt]=await sql`select * from prompt_templates where type='promo_page_section_designer'`;
 assert.equal(prompt.status,'draft');assert.equal(prompt.model,'registered-planner-model');assert.equal(prompt.model_options.skillBindings,undefined);assert.equal(prompt.required_variables.length,4);
 assert.equal((await sql`select count(*)::integer as count from prompt_templates where type='promo_page_section_designer'`)[0].count,1);
 await sql`update prompt_templates set status='active' where type='promo_page_section_designer'`;
 const executionSql=async(strings,...values)=>strings.join('?').includes('from llm_models')?[{id:'registered',provider:'openai',model_id:'registered-planner-model',status:'active',modality:'text',model_options:{}}]:sql(strings,...values);
 const {createDocumentRevision}=require('../api/_promo-builder-document-store'),{snapshotForPage}=require('../api/_page-schema-service');
 const {newSectionDesign,processSectionDesign}=require('../api/_page-section-design');
 const fixture=designFixture({pending:false}),snapshot=snapshotForPage(fixture.page,fixture.context);snapshot.generationMeta.review={state:'approved'};snapshot.generationMeta.sectionDesign=newSectionDesign(fixture.page);
 await createDocumentRevision(sql,{documentId:doc,ownerSubject:owner,baseDocumentRevision:0,snapshot,source:'ai'});
 const read=async()=>{const [row]=await sql`select d.current_document_revision,v.snapshot_json from promo_builder_documents d join promo_builder_document_versions v on v.document_id=d.id and v.revision=d.current_document_revision where d.id=${doc}::uuid`;return {document:{id:doc,currentDocumentRevision:row.current_document_revision},snapshot:row.snapshot_json};};
 let payload,status=200,calls=0;const res={status(code){status=code;return this;},json(value){payload=value;return this;}};
 const deps={fetchDocument:read,generate:async args=>{calls++;assert.equal(args.promptConfig.model,'registered-planner-model');assert.ok(args.promptConfig.renderedPrompt.includes('Target section:'));return {result:{summary:'실제 디자인 저장',patches:[]},provider:{model:args.promptConfig.model}};}};
 const request=async(extra={})=>{const current=await read(),plan=current.snapshot.generationMeta.sectionDesign;await processSectionDesign({sql:executionSql,owner:{ownerSubject:owner},body:{documentId:doc,baseDocumentRevision:current.document.currentDocumentRevision,runId:plan.id,groupId:plan.groups.find(g=>!plan.completed.some(done=>done.id===g.id))?.id,...extra},res},deps);return payload;};
 await request();assert.equal(status,200);assert.equal(payload.revision,2);assert.equal(calls,1);
 let persisted=await read();const first=persisted.snapshot.generationMeta.sectionDesign.groups[0].id;
 assert.equal(persisted.snapshot.generationMeta.sectionDesign.completed[0].execution.promptId,prompt.id);
 const [job]=await sql`select status,result_revision from promo_page_schema_generation_jobs where document_id=${doc}::uuid`;
 assert.equal(job.status,'completed');assert.equal(job.result_revision,2);
 await request({groupId:first,baseDocumentRevision:1});assert.equal(payload.cached,true);assert.equal(calls,1);
 // A reload can read the old revision, then discover that the existing job completed.
 const beforeRace=await read(),racePlan=beforeRace.snapshot.generationMeta.sectionDesign;
 const raceBody={documentId:doc,baseDocumentRevision:beforeRace.document.currentDocumentRevision,runId:racePlan.id,groupId:racePlan.groups.find(g=>!racePlan.completed.some(done=>done.id===g.id)).id};
 let release,started;const barrier=new Promise(resolve=>release=resolve),began=new Promise(resolve=>started=resolve);
 const firstRace=processSectionDesign({sql:executionSql,owner:{ownerSubject:owner},body:raceBody,res:{status(){return this;},json(){return this;}}},{...deps,generate:async()=>{started();await barrier;return {result:{summary:'in-flight result',patches:[]}};}});
 await began;
 const createPrompt=require('../api/_prompt-execution-snapshot').createPromptExecutionSnapshot;
 await processSectionDesign({sql:executionSql,owner:{ownerSubject:owner},body:raceBody,res},{...deps,createPromptExecutionSnapshot:async(...args)=>{const result=await createPrompt(...args);release();await firstRace;return result;},generate:async()=>{throw new Error('reload must reuse completed job');}});
 assert.equal(payload.cached,true);assert.equal(payload.revision,3);
 // Invalid model output rolls back document/result while releasing the durable job for retry.
 deps.generate=async()=>({result:{summary:'bad',patches:[{nodeId:'invented',viewport:'desktop',kind:'styles',roles:[],spacing:null,overlayRole:null,reason:'bad'}]}});
 await assert.rejects(request(),{code:'SECTION_DESIGN_RESULT_INVALID'});assert.equal((await read()).document.currentDocumentRevision,3);
 assert.equal((await sql`select count(*)::integer as count from promo_page_schema_generation_jobs where status='running'`)[0].count,0);
 deps.generate=async()=>({result:{summary:'재시도 완료',patches:[]},provider:{}});
 while(require('../shared/page-schema/section-design.cjs').sectionDesignPending((await read()).snapshot))await request();
 persisted=await read();assert.equal(persisted.snapshot.generationMeta.sectionDesign.state,'complete');assert.equal(persisted.snapshot.generationMeta.sectionDesign.completed.length,persisted.snapshot.generationMeta.sectionDesign.groups.length);
 // Stale in-flight model result must not replace a newer revision.
 const next=structuredClone(persisted.snapshot);next.generationMeta.sectionDesign=newSectionDesign(next.content.pageSchema);await createDocumentRevision(sql,{documentId:doc,ownerSubject:owner,baseDocumentRevision:persisted.document.currentDocumentRevision,snapshot:next,source:'manual'});
 deps.generate=async()=>{const live=await read(),edited=structuredClone(live.snapshot);edited.content.pageSchema.summary+=' newer edit';await createDocumentRevision(sql,{documentId:doc,ownerSubject:owner,baseDocumentRevision:live.document.currentDocumentRevision,snapshot:edited,source:'manual'});return {result:{summary:'late',patches:[]}};};
 await assert.rejects(request(),{code:'DOCUMENT_REVISION_MISMATCH'});assert.ok((await read()).snapshot.content.pageSchema.summary.endsWith(' newer edit'));
 assert.equal((await sql`select count(*)::integer as count from promo_page_schema_generation_jobs where status='running'`)[0].count,0);
 console.log('Section design PostgreSQL: idempotent Draft migration/model inheritance, real prompt assembly, atomic design/job save, replay, invalid rollback/retry, resume and stale revision rejection passed');
}finally{await db.close();}
