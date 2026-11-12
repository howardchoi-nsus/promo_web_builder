// Sequential, resumable orchestration. Every response is a durable document revision.
export async function preparePageMedia({readCurrent,request,onUpdate,onProgress,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),maxPolls=180}){
 const documentId=readCurrent().documentId;let polls=0;
 while(true){
  const current=readCurrent();
  if(current.documentId!==documentId)throw Object.assign(new Error('페이지가 변경되어 이미지 준비를 중단했습니다.'),{code:'MEDIA_DOCUMENT_CHANGED',retryable:false});
  const page=current.snapshot?.content?.pageSchema;
  if(current.snapshot?.generationMeta?.review?.state!=='approved')throw Object.assign(new Error('최신 페이지 구성을 승인해 주세요.'),{code:'PAGE_SCHEMA_APPROVAL_REQUIRED',retryable:false});
  const pending=page?.mediaRequests||[];
  if(!pending.length)return current;
  const next=pending[0];onProgress?.(pending.length);
  const result=await request({method:'POST',documentId,baseDocumentRevision:current.revision,nodeId:next.nodeId,requestId:next.id});
  // Never replace state after switching documents or after another local revision.
  const live=readCurrent();
  if(live.documentId!==documentId||live.revision!==current.revision)throw Object.assign(new Error('페이지가 변경되었습니다. 최신 결과에서 다시 진행해 주세요.'),{code:'MEDIA_DOCUMENT_CHANGED',retryable:true});
  if(!result.snapshot||!Number.isInteger(Number(result.revision)))throw Object.assign(new Error('이미지 준비 응답을 확인할 수 없습니다.'),{code:'MEDIA_RESPONSE_INVALID',retryable:true});
  onUpdate(result);
  if(result.pending){if(++polls>maxPolls)throw Object.assign(new Error('이미지 준비가 계속 진행 중입니다. 잠시 후 다시 확인해 주세요.'),{code:'MEDIA_PREPARATION_PENDING',retryable:true});await wait(Math.min(3000,Math.max(500,Number(result.retryAfterMs)||1500)));}
  else if(result.revision<=current.revision)throw Object.assign(new Error('이미지 연결 결과가 갱신되지 않았습니다.'),{code:'MEDIA_PREPARATION_STALLED',retryable:true});
 }
}
