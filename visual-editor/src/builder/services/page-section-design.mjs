// Durable, sequential design results. No timer-driven reveal of a finished page.
export async function prepareSectionDesign({readCurrent,request,onUpdate,onProgress,prepareMedia,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),maxPolls=180}){
 const initial=readCurrent(),documentId=initial.documentId,runId=initial.snapshot?.generationMeta?.sectionDesign?.id;let polls=0;
 if(!runId)throw Object.assign(new Error('영역 디자인 요청 정보가 없습니다.'),{code:'SECTION_DESIGN_REQUIRED',retryable:false});
 while(true){
  const current=readCurrent(),plan=current.snapshot?.generationMeta?.sectionDesign;
  if(current.documentId!==documentId||plan?.id!==runId||!['ready','approved'].includes(current.snapshot.generationMeta.review?.state))throw Object.assign(new Error('페이지가 변경되어 디자인 작업을 중단했습니다.'),{code:'SECTION_DESIGN_DOCUMENT_CHANGED',retryable:false});
  let advanced=false;
  for(let index=0;index<plan.groups.length;index++){
   const group=plan.groups[index];
   if(!plan.completed.some(item=>item.id===group.id)){
    onProgress?.({phase:'design',group,index,total:plan.groups.length});
    const saved=await request({documentId,baseDocumentRevision:current.revision,runId,groupId:group.id});
    const live=readCurrent();
    if(live.documentId!==documentId||live.revision!==current.revision||live.snapshot.generationMeta?.sectionDesign?.id!==runId)throw Object.assign(new Error('페이지가 변경되었습니다. 최신 결과에서 이어갑니다.'),{code:'SECTION_DESIGN_DOCUMENT_CHANGED',retryable:true});
    if(!saved.snapshot||!Number.isInteger(Number(saved.revision))||Number(saved.revision)<current.revision||saved.snapshot.generationMeta?.sectionDesign?.id!==runId||(!saved.pending&&Number(saved.revision)<=current.revision)||(!saved.pending&&!saved.snapshot.generationMeta.sectionDesign.completed.some(item=>item.id===group.id)))throw Object.assign(new Error('영역 디자인 저장 응답을 확인할 수 없습니다.'),{code:'SECTION_DESIGN_RESPONSE_INVALID',retryable:true});
    onUpdate(saved);advanced=true;
    if(saved.pending){if(++polls>maxPolls)throw Object.assign(new Error('영역 디자인이 계속 진행 중입니다. 결과를 보존했습니다.'),{code:'SECTION_DESIGN_PENDING',retryable:true});await wait(Math.min(3000,Math.max(500,Number(saved.retryAfterMs)||1500)));}
    break;
   }
   if(current.snapshot.content.pageSchema.mediaRequests.some(item=>group.nodeIds.includes(item.nodeId))){onProgress?.({phase:'media',group,index,total:plan.groups.length});await prepareMedia(group);advanced=true;break;}
  }
  if(!advanced){if(plan.state!=='complete')throw Object.assign(new Error('영역 디자인 완료 상태를 확인해 주세요.'),{code:'SECTION_DESIGN_STATE_INVALID',retryable:true});return readCurrent();}
 }
}
