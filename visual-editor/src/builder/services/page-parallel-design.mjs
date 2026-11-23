export async function prepareParallelSectionDesign({readCurrent,request,onUpdate,onProgress,wait=ms=>new Promise(r=>setTimeout(r,ms)),maxSteps=300,maxConcurrent=2}){
 const initial=readCurrent(),documentId=initial.documentId,runId=initial.snapshot.generationMeta.sectionDesign.id,running=new Map();let failure;
 const live=()=>{const value=readCurrent();if(value.documentId!==documentId||value.snapshot.generationMeta?.sectionDesign?.id!==runId)throw Object.assign(Error('페이지가 변경되었습니다.'),{code:'SECTION_DESIGN_DOCUMENT_CHANGED'});return value;};
 const accept=result=>{const current=live();if(!result.snapshot||Number(result.revision)<current.revision)return;onUpdate(result);};
 try{
  for(let step=0;step<maxSteps;step++){
   const current=live(),plan=current.snapshot.generationMeta.sectionDesign,requests=current.snapshot.content.pageSchema.mediaRequests||[];
   const design=plan.groups.find(g=>!plan.completed.some(done=>done.id===g.id));
   const image=requests.find(r=>plan.groups.some(g=>g.nodeIds.includes(r.nodeId)&&plan.completed.some(done=>done.id===g.id)));
   if(!design&&!requests.length&&!running.size)return current;
   const available=[];if(design)available.push({kind:'design',group:design,key:design.id});if(image){const group=plan.groups.find(g=>g.nodeIds.includes(image.nodeId));available.push({kind:'media',group,key:image.nodeId,image});}
   for(const task of available){const id=task.kind+':'+task.key;if(running.size>=Math.min(2,maxConcurrent)||running.has(id))continue;onProgress?.({phase:task.kind,group:task.group,index:plan.groups.indexOf(task.group),total:plan.groups.length,nodeId:task.image?.nodeId});const payload={documentId,runId,kind:task.kind,groupId:task.group.id,nodeId:task.image?.nodeId,requestId:task.image?.id};running.set(id,Promise.resolve().then(()=>request(payload)).then(result=>({id,result,task}),error=>({id,error,task})));}
   if(!running.size)throw Object.assign(Error('이미지와 디자인 작업의 의존성을 확인해 주세요.'),{code:'WORK_DEPENDENCY_REQUIRED'});
   const settled=await Promise.race(running.values());running.delete(settled.id);
   if(settled.error){failure=Object.assign(settled.error,{workKind:settled.task.kind,nodeId:settled.task.image?.nodeId,groupId:settled.task.group.id});break;}
   accept(settled.result);if(settled.result.pending)await wait(1000);
  }
 }finally{for(const settled of await Promise.all(running.values()))if(settled.result)accept(settled.result);}
 if(failure)throw failure;throw Object.assign(Error('작업이 진행 중입니다. 저장된 결과에서 이어갑니다.'),{code:'SECTION_DESIGN_PENDING',retryable:true});
}
