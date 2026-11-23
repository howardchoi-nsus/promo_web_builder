const units=require('./_page-work-unit-store');const {inputHash}=require('./_page-schema-generation-jobs');
async function processParallelDesign({sql,owner,body,res},dependencies={}){
 const store=require('./_promo-builder-document-store'),snapshots=require('./_prompt-execution-snapshot');
 const use={fetchDocument:store.fetchDocument,createDocumentRevision:store.createDocumentRevision,createPromptExecutionSnapshot:snapshots.createPromptExecutionSnapshot,...dependencies};
 await units.assertWorkReady(sql);const subject=owner.ownerSubject;let found=await use.fetchDocument(sql,String(body.documentId||''),subject,{includeSnapshot:true});
 if(!found?.snapshot?.generationMeta?.sectionDesign||found.snapshot.generationMeta.sectionDesign.id!==body.runId)throw units.error('WORK_INPUT_CHANGED');
 const enabled=require('./_promo-builder-flags').builderFlags().parallelPageWork;
 if(body.kind==='prepare'){if(!enabled)throw units.error('WORK_FEATURE_DISABLED');if(found.snapshot.generationMeta.sectionDesign.parallelV1)return res.status(200).json({ok:true,revision:found.document.currentDocumentRevision,snapshot:found.snapshot});const next=structuredClone(found.snapshot);next.generationMeta.sectionDesign.parallelV1=true;const saved=await use.createDocumentRevision(sql,{documentId:body.documentId,ownerSubject:subject,baseDocumentRevision:found.document.currentDocumentRevision,snapshot:next,requirementsGuard:require('./_promo-builder-flags').builderFlags().chatWorkspaceV1?next.generationMeta.sourceRequirements?.revision||null:null,source:'manual',changeNote:'Parallel work contract prepared'});return res.status(200).json({ok:true,...saved});}
 if(!enabled&&!found.snapshot.generationMeta.sectionDesign.parallelV1)throw units.error('WORK_FEATURE_DISABLED');
 const kind=body.kind;if(!['design','media'].includes(kind))throw units.error('WORK_UNIT_UNKNOWN');const key=String(kind==='design'?body.groupId:body.nodeId),id=units.workId(body.runId,kind,key);
 let unit=await units.readUnit(sql,id,subject);
 const respond=(saved,pending=false)=>res.status(pending?202:200).json({ok:true,pending,revision:saved.revision??saved.document?.currentDocumentRevision,snapshot:saved.snapshot,...(pending?{retryAfterMs:1000}:{})});
 if(unit?.state==='completed')return respond(found);
 if(unit?.state==='running'&&Date.parse(unit.lease_expires_at)>Date.now())return respond(found,true);
 try{
  if(!unit||['failed','pending'].includes(unit.state)||(unit.state==='running'&&Date.parse(unit.lease_expires_at)<=Date.now())){
   if(unit?.input_json?.found)found=unit.input_json.found;
   const plan=found.snapshot.generationMeta.sectionDesign,group=plan.groups.find(g=>kind==='design'?g.id===key:g.nodeIds.includes(key));
   if(!group||kind==='media'&&!plan.completed.some(g=>g.id===group.id))throw units.error('WORK_DEPENDENCY_REQUIRED');
   let execution;
   const deps={...dependencies,fetchDocument:async()=>found,failGeneration:async()=>{},createPromptExecutionSnapshot:async(s,type,variables)=>{const current=await use.createPromptExecutionSnapshot(s,type,variables);execution={type,variables,config:current.promptConfig};return current;},
    acquireGeneration:async()=>{const hash=inputHash({runId:body.runId,kind,key,config:units.configHash(execution.config),found:{document:{id:found.document.id,currentDocumentRevision:found.document.currentDocumentRevision},snapshot:found.snapshot}});unit=await units.claimUnit(sql,{id,documentId:body.documentId,owner:subject,runId:body.runId,key,kind,config:execution.config,hash,input:{found,execution}});if(unit.pending)throw units.error('WORK_PENDING');if(unit.state!=='running')throw units.error('WORK_PREPARED');return {requestId:id,claimToken:unit.claim_token};},
    createDocumentRevision:async(s,args)=>{unit=await units.prepareUnit(sql,unit,{snapshot:args.snapshot});return {revision:found.document.currentDocumentRevision+1,snapshot:args.snapshot};}
   };
   const fakeRes={status(){return this;},json(value){if(value.pending)throw units.error('WORK_PENDING');if(!value.ok)throw units.error(value.code||'WORK_FAILED',value.error);return value;}};
   const workBody={...body,baseDocumentRevision:found.document.currentDocumentRevision};
   if(kind==='design')await require('./_page-section-design').processSectionDesign({sql,owner,body:workBody,res:fakeRes},deps);
   else await require('./_page-schema-media-service').processPageMedia({req:{method:'POST'},sql,owner,body:workBody,res:fakeRes},deps);
  }
  if(!unit?.result_json)throw units.error('WORK_RESULT_REQUIRED');
  await (use.verifyUnitConfig||units.verifyUnitConfig)(sql,unit);
  for(let attempt=0;attempt<8;attempt++){
   const current=await use.fetchDocument(sql,body.documentId,subject,{includeSnapshot:true});
   if(!current)throw units.error('WORK_INPUT_CHANGED');
   const actual=await units.readUnit(sql,id,subject);if(actual?.state==='completed')return respond(current);
   const next=require('./_page-work-merge').mergeWorkSnapshot(current.snapshot,unit);
   try{const saved=await use.createDocumentRevision(sql,{documentId:body.documentId,ownerSubject:subject,baseDocumentRevision:current.document.currentDocumentRevision,snapshot:next,workUnit:{id,claimToken:unit.claim_token},requirementsGuard:require('./_promo-builder-flags').builderFlags().chatWorkspaceV1?next.generationMeta.sourceRequirements?.revision||null:null,source:'ai',changeNote:'Parallel '+kind+' unit persisted'});return respond(saved);}catch(error){if(/revision conflict/i.test(error.message)||error.code==='DOCUMENT_REVISION_MISMATCH'||error.code==='WORK_RESULT_CHANGED'||['40P01','40001'].includes(error.code))continue;throw error;}
  }
  throw units.error('WORK_MERGE_CONFLICT');
 }catch(error){if(['WORK_PENDING','WORK_PREPARED'].includes(error.code))return respond(await use.fetchDocument(sql,body.documentId,subject,{includeSnapshot:true}),true);await units.failUnit(sql,unit,error).catch(()=>{});throw error;}
}
module.exports={processParallelDesign};
