export async function generateParallelDraft(payload,initial,{request,onDraft,wait,isCurrent,maxSteps=300}){
 let latest=initial,steps=0;const running=new Map();let failure;
 const transport={documentId:payload.documentId,baseDocumentRevision:payload.baseDocumentRevision,requestId:payload.requestId,requirementsRevision:payload.requirementsRevision};
 async function accept(result){if(!isCurrent())throw Object.assign(Error('문서가 변경되었습니다.'),{code:'PAGE_DRAFT_DOCUMENT_CHANGED'});if(result.draft&&Number(result.sequence)>=Number(latest.sequence)){latest=result;await onDraft?.({...result,activeGroups:[...running.keys()].map(unitId=>({nodeIds:[unitId]}))});}}
 try{
  while(++steps<maxSteps){
   if(!isCurrent())throw Object.assign(Error('문서가 변경되었습니다.'),{code:'PAGE_DRAFT_DOCUMENT_CHANGED'});
   if(latest.completedRegions===latest.totalRegions&&!running.size)return request({...transport,operation:'advance-draft',sequence:latest.sequence});
   for(const group of latest.nextGroups||[]){if(running.size>=Math.min(2,latest.maxConcurrency||2))break;if(running.has(group.unitId))continue;const id=group.unitId;running.set(id,Promise.resolve().then(()=>request({...transport,operation:'advance-unit',unitId:id})).then(result=>({id,result}),error=>({id,error})));}
   if(!running.size){await wait(1000);await accept(await request({...transport,operation:'read-draft'}));continue;}
   const settled=await Promise.race(running.values());running.delete(settled.id);if(settled.error){failure=settled.error;break;}
   await accept(settled.result);if(settled.result.workPending&&latest.completedRegions<latest.totalRegions){await wait(1000);await accept(await request({...transport,operation:'read-draft'}));}
  }
 }finally{if(running.size)for(const settled of await Promise.all(running.values()))if(settled.result)await accept(settled.result);}
 if(failure)throw failure;throw Object.assign(Error('병렬 생성 결과를 기다리고 있습니다.'),{code:'PAGE_DRAFT_PENDING',retryable:true});
}
