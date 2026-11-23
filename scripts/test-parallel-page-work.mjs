import assert from 'node:assert/strict';import {createUnitHarness} from './fixtures/page-draft-units-harness.mjs';import {randomUUID} from 'node:crypto';
process.env.PAGE_PARALLEL_WORK_ENABLED='true';process.env.PAGE_SCHEMA_AUTO_FLOW_ENABLED='true';
const h=await createUnitHarness({parallel:true});try{
 const requestId=randomUUID(),invoke=body=>h.invoke({requestId,overview:h.overview,...body});let result=await invoke({operation:'start-draft',sequence:0});assert.equal(result.parallel,true);assert.equal(result.nextGroups.length,2);h.holdFirst();
 const first=invoke({operation:'advance-unit',unitId:result.nextGroups[0].unitId});while(!h.waiting)await new Promise(r=>setTimeout(r,5));
 const second=await invoke({operation:'advance-unit',unitId:result.nextGroups[1].unitId});assert.equal(second.completedRegions,1);assert.ok(second.page.root.children[1].children.length>0);assert.equal(second.page.root.children[0].children.length,0);
 const calls=h.modelCalls.length;const pending=await invoke({operation:'advance-unit',unitId:result.nextGroups[0].unitId});assert.equal(pending.workPending,true);assert.equal(h.modelCalls.length,calls);h.release();result=await first;assert.equal(result.completedRegions,2);
 result=await invoke({operation:'advance-draft',sequence:result.sequence});assert.equal(result.complete,true);assert.equal(result.snapshot.generationMeta.review.state,'ready');assert.equal((await h.sql`select count(*)::integer as n from promo_page_work_units where state='completed'`)[0].n,2);assert.equal(h.modelCalls.length,3);
 console.log('Parallel draft SQL: real concurrent units, reverse completion visibility before first release, no duplicate paid calls, namespaced IDs, final assembly/automatic validation passed.');
}finally{h.release();await h.close();delete process.env.PAGE_PARALLEL_WORK_ENABLED;}
