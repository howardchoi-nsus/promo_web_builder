import assert from 'node:assert/strict';import {createUnitHarness} from './fixtures/page-draft-units-harness.mjs';
const h=await createUnitHarness(),requestId='cccccccc-cccc-4ccc-8ccc-cccccccccccc';let result;
const invoke=body=>h.invoke({requestId,...body});
try{
 h.setContractVersion(1);await assert.rejects(invoke({operation:'start-draft',overview:h.overview}),{code:'PAGE_DRAFT_PROMPT_V2_REQUIRED'});assert.equal(h.modelCalls.length,0);h.setContractVersion(2);
 result=await invoke({operation:'start-draft',overview:h.overview});assert.equal(result.completedRegions,0);assert.equal(result.previewMode,'skeleton-first');assert.equal(result.pendingNodeIds.length,2);assert.equal(result.workTiming.kind,'plan');assert.ok(Number.isFinite(result.workTiming.modelMs));assert.equal(result.page.root.children.length,2);assert.deepEqual(result.page.root.children[0].children,[]);
 for(const [key,value] of Object.entries(result.workTiming))if(key.endsWith('Ms'))assert.ok(Number.isFinite(value)&&value>=0);
 const count=h.modelCalls.length;const replay=await invoke({operation:'start-draft',overview:h.overview});assert.equal(replay.sequence,result.sequence);assert.equal(h.modelCalls.length,count);
 h.failNext();await assert.rejects(invoke({operation:'advance-draft',sequence:result.sequence}),/unit provider test failure/);assert.equal((await h.sql`select lease_token from promo_page_drafts`)[0].lease_token,null);assert.equal((await h.sql`select state from promo_page_drafts`)[0].state.lastFailure.failed,true);
 result=await invoke({operation:'advance-draft',sequence:result.sequence});assert.equal(result.completedRegions,1);assert.ok(result.page.root.children[0].children.length);assert.deepEqual(result.page.root.children[1].children,[]);assert.equal((await h.read()).document.currentDocumentRevision,0);
 const callsBeforeRead=h.modelCalls.length;const restored=await invoke({operation:'read-draft'});assert.equal(restored.completedRegions,1);assert.deepEqual(restored.page,result.page);assert.equal(h.modelCalls.length,callsBeforeRead);
 h.holdSecond();const pending=invoke({operation:'advance-draft',sequence:result.sequence});while(!h.waiting)await new Promise(r=>setTimeout(r,5));
 const saved=(await h.sql`select state from promo_page_drafts`)[0].state;assert.equal(saved.cursor,1);assert.deepEqual(saved.page,result.page);
 const contended=await invoke({operation:'advance-draft',sequence:result.sequence});assert.equal(contended.pending,true);assert.equal(contended.httpStatus,202);
 h.release();result=await pending;assert.equal(result.completedRegions,2);assert.equal(result.complete,undefined);assert.equal(result.phase,'assembly');assert.equal((await h.read()).document.currentDocumentRevision,0);
 const before=h.modelCalls.length;result=await invoke({operation:'advance-draft',sequence:result.sequence});assert.equal(result.complete,true);assert.equal(h.modelCalls.length,before);assert.equal(result.revision,1);
 assert.equal((await h.sql`select stage from promo_builder_chat_sessions`)[0].stage,'wireframe_review');assert.equal((await h.sql`select status from promo_builder_chat_actions`)[0].status,'executed');
 assert.equal((await h.read()).snapshot.generationMeta.review.state,'pending');assert.equal((await h.read()).snapshot.generationMeta.draftTimings.length,4);assert.equal((await invoke({operation:'start-draft'})).complete,true);
 await h.sql`update promo_page_drafts set status='working',final_revision=null`;assert.equal((await invoke({operation:'advance-draft'})).complete,true);assert.equal((await h.sql`select status from promo_page_drafts`)[0].status,'complete');
 console.log('Unit draft SQL: 096 idempotence, explicit V2 gate, empty plan, source-only region persistence before later calls, failure/retry, lease contention, final-unit observation, atomic chat transition, replay and crash healing passed.');
}finally{await h.close();}
