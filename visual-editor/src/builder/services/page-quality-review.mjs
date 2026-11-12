export async function reviewPageUntilReady({readCurrent,request,report,onUpdate,force=false,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),maxPolls=180}){
 const documentId=readCurrent().documentId;
 for(let polls=0;polls<=maxPolls;polls++){
  const current=readCurrent();if(current.documentId!==documentId)throw Object.assign(new Error('페이지가 변경되어 AI 검토를 중단했습니다.'),{code:'QUALITY_AGENT_DOCUMENT_CHANGED'});
  const result=await request({documentId,baseDocumentRevision:current.revision,report,force});
  const live=readCurrent();if(live.documentId!==documentId||live.revision!==current.revision)throw Object.assign(new Error('최신 페이지에서 AI 검토를 다시 진행해 주세요.'),{code:'QUALITY_AGENT_DOCUMENT_CHANGED'});
  if(!result.snapshot?.content?.pageSchema||!Number.isInteger(Number(result.revision))||Number(result.revision)<current.revision||(!result.pending&&!result.snapshot.generationMeta?.qualityAgentReview))throw Object.assign(new Error('AI 검토 응답을 확인할 수 없습니다.'),{code:'QUALITY_AGENT_RESPONSE_INVALID'});
  onUpdate(result);if(!result.pending)return result;
  if(polls<maxPolls)await wait(Math.min(3000,Math.max(500,Number(result.retryAfterMs)||1500)));
 }
 throw Object.assign(new Error('AI 검토가 진행 중입니다. 저장된 결과는 보존되며 다시 확인할 수 있습니다.'),{code:'QUALITY_AGENT_PENDING',retryable:true});
}
