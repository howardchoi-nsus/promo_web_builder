export async function generateProgressivePage(payload,{request,onDraft,wait=ms=>new Promise(r=>setTimeout(r,ms)),isCurrent=()=>true,maxSteps=300}={}){
 let sequence=0,operation='start-draft';
 for(let step=0;step<maxSteps;step++){
  if(!isCurrent())throw Object.assign(Error('문서가 변경되어 초안 생성을 중단했습니다.'),{code:'PAGE_DRAFT_DOCUMENT_CHANGED'});
  const result=await request({...payload,operation,sequence});
  if(!isCurrent())throw Object.assign(Error('이전 문서의 응답은 적용하지 않았습니다.'),{code:'PAGE_DRAFT_DOCUMENT_CHANGED'});
  if(result.complete)return result;
  if(result.pending){await wait(Math.min(3000,Math.max(500,Number(result.retryAfterMs)||1500)));continue;}
  if(!result.draft||result.runId!==payload.requestId||!result.page||!result.context||!Number.isInteger(Number(result.sequence))||Number(result.sequence)<sequence)throw Object.assign(Error('초안 응답을 확인할 수 없습니다.'),{code:'PAGE_DRAFT_RESPONSE_INVALID'});
  sequence=Number(result.sequence);await onDraft?.(result);operation='advance-draft';
 }
 throw Object.assign(Error('초안 생성이 진행 중입니다. 저장된 결과에서 다시 이어갈 수 있습니다.'),{code:'PAGE_DRAFT_PENDING',retryable:true});
}

// Wait for a real paint opportunity, not a presentation timer. Background tabs
// must not suspend server generation just because their RAF is throttled.
export function waitForDraftPaint(doc=globalThis.document){
 const view=doc?.defaultView;if(!view?.requestAnimationFrame||doc.visibilityState==='hidden')return Promise.resolve();
 return new Promise(resolve=>{let frame=0,done=false;const finish=()=>{if(done)return;done=true;if(frame)view.cancelAnimationFrame(frame);doc.removeEventListener('visibilitychange',changed);resolve();};const changed=()=>{if(doc.visibilityState==='hidden')finish();};doc.addEventListener('visibilitychange',changed);frame=view.requestAnimationFrame(()=>{frame=view.requestAnimationFrame(finish);});changed();});
}
