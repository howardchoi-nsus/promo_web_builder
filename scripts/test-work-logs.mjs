import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),{PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite');const db=new PGlite();
const sql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
require('../api/_prompt-template-store').getSql=()=>sql;
const {withWorkLog,withModelLog,logEvent,scrub,safeMeta,writeLog}=require('../api/_work-log');
const migration=readFileSync(new URL('../db/migrations/099_admin_work_logs.sql',import.meta.url),'utf8');await db.exec(migration);await db.exec(migration);
const task='11111111-1111-4111-8111-111111111111',documentId='22222222-2222-4222-8222-222222222222';
function response(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.statusCode=c;return this;},json(p){this.payload=p;return this;}};}
const model=withModelLog(async()=>{throw Object.assign(Error('secret=super-secret https://private.example/?token=bad user@example.com'),{code:'PROVIDER_TIMEOUT',requestId:'provider-42'});});
const handler=withWorkLog('test-generation',async(req,res)=>{try{await model({type:'promo_page_region_builder',promptConfig:{promptId:'registered',promptVersion:2,model:'registered-model',provider:'openai',renderedPrompt:'DO NOT SAVE',skillSnapshots:[{id:'skill',version:3}]}});}catch(e){await logEvent({event:'checkpoint',status:'running',metadata:{attempt:1,token:'NOPE',prompt:'NOPE',timings:{modelMs:120,private:'NOPE'}}});return res.status(502).json({error:e.message,code:e.code,retryable:true,errors:[{path:'root.children[0]',message:'api_key=hidden'}]});}});
const res=response();await handler({method:'POST',headers:{'x-builder-task-id':task},body:{documentId,operation:'advance-draft',naturalLanguage:'PRIVATE USER CONTENT'}},res);
const rows=(await db.query('select * from promo_work_logs order by sequence')).rows;
assert.deepEqual(rows.map(r=>r.event),['request_started','model_started','model_finished','checkpoint','request_finished']);assert.equal(rows[2].status,'failed');assert.equal(rows[4].http_status,502);assert.equal(rows[4].error_code,'PROVIDER_TIMEOUT');assert.ok(rows.every(r=>r.task_id===task));assert.equal(new Set(rows.map(r=>r.request_id)).size,1);assert.equal(res.headers['X-Work-Task-Id'],task);assert.equal(rows[2].metadata.model,'registered-model');assert.equal(rows[2].metadata.providerRequestId,'provider-42');
const dump=JSON.stringify(rows);for(const privateText of ['super-secret','private.example','user@example.com','DO NOT SAVE','PRIVATE USER CONTENT','NOPE','api_key=hidden'])assert.equal(dump.includes(privateText),false,privateText);
assert.equal(scrub(JSON.stringify({apiKey:'sensitive-secret',password:'password-value'})).includes('sensitive-secret'),false);
assert.equal(scrub('Bearer secret-value').includes('secret-value'),false);assert.deepEqual(safeMeta({authorization:'secret',raw:'secret'}),{});
const thrown=withWorkLog('throws',async()=>{throw Object.assign(Error('safe failure'),{code:'UNCAUGHT_TEST',statusCode:503});});await assert.rejects(thrown({method:'POST',headers:{},body:{}},response()),{code:'UNCAUGHT_TEST'});
assert.equal((await db.query("select status from promo_work_logs where stage='throws' and event='request_finished'")).rows[0].status,'failed');
// Admin ownership gate and bounded, keyset-paginated reads use the real SQL store.
const auth=require('../api/_promo-admin-auth');const originalAuth=auth.resolveAdminOwner;auth.resolveAdminOwner=req=>{if(req.headers?.authorization!=='test-admin')throw Object.assign(Error('Unauthorized'),{statusCode:401});return {ownerSubject:'admin'};};delete require.cache[require.resolve('../api/admin-work-logs')];const admin=require('../api/admin-work-logs');
async function read(query={},allowed=true){const res=response();await admin({method:'GET',query,headers:allowed?{authorization:'test-admin'}:{}},res);return res;}
assert.equal((await read({},false)).statusCode,401);assert.equal((await read({search:'not-uuid'})).statusCode,400);assert.equal((await read({limit:101})).statusCode,400);assert.equal((await read({cursor:'bad'})).statusCode,400);
const failures=await read({search:task,status:'failed'});assert.equal(failures.payload.logs.length,2);assert.ok(failures.payload.logs.every(l=>l.taskId===task));
assert.equal((await read({reference:'provider-42'})).payload.logs.length,1);
const first=await read({search:task,limit:2});assert.equal(first.payload.logs.length,2);assert.ok(first.payload.nextCursor);const next=await read({search:task,limit:2,cursor:first.payload.nextCursor});assert.equal(new Set([...first.payload.logs,...next.payload.logs].map(r=>r.id)).size,4);
// A successful model and a pending API are distinct lifecycle events.
const success=withWorkLog('pending-operation',async(req,res)=>{const value=await withModelLog(async()=>({usage:{input_tokens:5,output_tokens:8}}))({promptConfig:{model:'model'}});return res.status(202).json({pending:true,usage:value.usage});});await success({method:'POST',headers:{'x-builder-task-id':task},body:{documentId}},response());
assert.equal((await db.query("select status from promo_work_logs where stage='pending-operation' and event='request_finished'")).rows[0].status,'pending');
const openResult=await read({openOnly:'true'});assert.equal(openResult.payload.logs.length,0);
await writeLog(sql,{taskId:task,requestId:'99999999-9999-4999-8999-999999999999',stage:'interrupted',operation:'POST',event:'request_started',status:'running'});
assert.equal((await read({openOnly:'true'})).payload.logs.length,1);
const concurrent=withWorkLog('concurrent',async(req,res)=>{await logEvent({event:'checkpoint',status:'running',metadata:{runId:req.headers['x-builder-task-id']}});return res.json({ok:true});});
await Promise.all([task,'88888888-8888-4888-8888-888888888888'].map(id=>concurrent({method:'POST',headers:{'x-builder-task-id':id},body:{}},response())));
const concurrentLogs=(await db.query("select task_id,metadata from promo_work_logs where stage='concurrent' and event='checkpoint'")).rows;assert.equal(concurrentLogs.length,2);for(const row of concurrentLogs)assert.equal(row.metadata.runId,row.task_id);
await db.exec('drop table promo_work_logs');assert.equal((await read()).payload.code,'WORK_LOG_MIGRATION_REQUIRED');
const originalWarn=console.warn;console.warn=()=>{};const untouched=withWorkLog('no-table',async(req,res)=>res.json({ok:true}));const noTable=response();await untouched({method:'POST',headers:{},body:{}},noTable);console.warn=originalWarn;assert.equal(noTable.payload.ok,true);
auth.resolveAdminOwner=originalAuth;await db.close();console.log('Work logs: real SQL idempotence, request/model/checkpoint/failure/pending lifecycles, correlation, redaction, auth/filters/pagination, migration diagnostics and logging-failure isolation passed.');
