process.env.PAGE_SCHEMA_AUTO_FLOW_ENABLED='true';
import assert from 'node:assert/strict';import {createUnitHarness} from './fixtures/page-draft-units-harness.mjs';
const h=await createUnitHarness();const requestId='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
try{
 let result=await h.invoke({operation:'start-draft',requestId,overview:h.overview,generationRequest:'구조를 자동으로 만들어줘'});assert.equal(result.completedRegions,0);
 h.invalidNext();result=await h.invoke({operation:'advance-draft',requestId,sequence:result.sequence});assert.equal(result.completedRegions,1);assert.equal(result.workTiming.repairCalls,1);assert.equal(h.modelCalls.length,3);
 const state=(await h.sql`select state from promo_page_drafts`)[0].state;assert.equal(state.executions.filter(e=>e.failedValidation).length,1);assert.equal(state.executions.filter(e=>e.repair).length,1);
 result=await h.invoke({operation:'advance-draft',requestId,sequence:result.sequence});assert.equal(result.completedRegions,2);
 result=await h.invoke({operation:'advance-draft',requestId,sequence:result.sequence});assert.equal(result.complete,true);assert.equal(result.snapshot.generationMeta.review.state,'ready');assert.equal(result.snapshot.generationMeta.review.approvedAt,undefined);
 assert.equal((await h.sql`select stage from promo_builder_chat_sessions`)[0].stage,'finalizing');assert.equal((await h.sql`select status from promo_builder_chat_actions`)[0].status,'expired');
 const calls=h.modelCalls.length;const replay=await h.invoke({operation:'start-draft',requestId});assert.equal(replay.complete,true);assert.equal(h.modelCalls.length,calls);
 console.log('Automatic SQL: bounded invalid-unit regeneration with recorded calls, unchanged partial sequence, final validated structure, automatic chat stage without fabricated action execution and replay passed.');
}finally{await h.close();}

const failed=await createUnitHarness({chat:false});
try{let r=await failed.invoke({operation:'start-draft',requestId,overview:failed.overview});failed.invalidNext(2);await assert.rejects(()=>failed.invoke({operation:'advance-draft',requestId,sequence:r.sequence}),{code:'PAGE_DRAFT_INVALID'});const row=(await failed.sql`select sequence,state from promo_page_drafts`)[0];assert.equal(row.state.cursor,0);assert.equal(Number(row.sequence),1);assert.equal(row.state.lastFailure.repairCalls,1);assert.equal(failed.modelCalls.length,3);}finally{await failed.close();}
