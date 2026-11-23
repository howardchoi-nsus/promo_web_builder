import assert from 'node:assert/strict';import fs from 'node:fs';import {randomUUID} from 'node:crypto';import {createRequire} from 'node:module';import {createUnitHarness} from './fixtures/page-draft-units-harness.mjs';
const require=createRequire(import.meta.url),units=require('../api/_page-work-unit-store');process.env.PAGE_PARALLEL_WORK_ENABLED='true';const h=await createUnitHarness({parallel:true,chat:false});try{
 await h.db.exec(fs.readFileSync(new URL('../db/migrations/100_parallel_page_work.sql',import.meta.url),'utf8'));
 const runId=randomUUID(),config={promptId:'pinned',provider:'openai',model:'registered-model',modelOptions:{}},claim=(key,extra={})=>units.claimUnit(h.sql,{id:units.workId(runId,'region',key),documentId:h.doc,owner:h.owner,runId,key,kind:'region',hash:key,config,input:{index:0},...extra});
 const a=await claim('a'),b=await claim('b');assert.equal(a.state,'running');assert.equal(b.state,'running');const queued=await claim('c');assert.equal(queued.pending,true);const queuedRow=await units.readUnit(h.sql,units.workId(runId,'region','c'),h.owner);assert.equal(queuedRow.state,'pending');assert.equal(queuedRow.attempts,0);
 await assert.rejects(require('../api/_page-schema-generation-jobs').acquireGeneration(h.sql,{documentId:h.doc,ownerSubject:h.owner,requestId:randomUUID(),hash:'exclusive'}),{code:'GENERATION_IN_PROGRESS'});
 const prepared=await units.prepareUnit(h.sql,a,{result:{valid:'saved'}});assert.equal((await claim('a')).state,'prepared');assert.equal((await claim('c')).state,'running');assert.equal((await claim('b')).pending,true);
 await assert.rejects(claim('a',{hash:'different'}),{code:'WORK_INPUT_CHANGED'});await assert.rejects(claim('new',{config:{...config,model:'changed'}}),{code:'WORK_CONFIG_CHANGED'});
 await h.sql`update promo_page_work_units set state='completed' where state in('running','prepared')`;
 process.env.PAGE_PARALLEL_WORK_ENABLED='false';assert.equal((await claim('d')).state,'running');assert.equal((await claim('e')).pending,true);
 await h.sql`update promo_page_work_units set state='failed',lease_expires_at=now()-interval '1 hour',attempts=3 where unit_key='d'`;
 await assert.rejects(claim('d'),{code:'WORK_RETRY_LIMIT_REACHED'});
 console.log('Work capacity SQL: idempotent 100, global/document locks, queued records, max two / rollback one, durable prepared reuse, legacy exclusion, config/input guards and bounded retries passed.');
}finally{await h.close();delete process.env.PAGE_PARALLEL_WORK_ENABLED;}
