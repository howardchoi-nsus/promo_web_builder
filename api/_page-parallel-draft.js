const units=require('./_page-work-unit-store');
const {inputHash}=require('./_page-schema-generation-jobs');
const {readyGroups,applyRegion,regionSchema,draftProgress,nextGroup,unitPrefix,assertV2}=require('./_page-draft-units');
const {draftVariables}=require('./_page-draft-request');
async function processParallelDraft({sql,owner,body,found,res,row,use}){
 await units.assertWorkReady(sql);const runId=row.id,subject=owner.ownerSubject,base=row.base_revision;
 const read=async()=>(await sql`select * from promo_page_drafts where id=${runId}::uuid and owner_subject=${subject}`)[0];
 const respond=(current,pending=false)=>res.status(200).json({ok:true,draft:true,pending:false,runId,contractVersion:2,sequence:current.sequence,baseDocumentRevision:base,page:current.state.page,context:current.state.context,nextGroup:nextGroup(current.state),...draftProgress(current.state),...(pending?{workPending:true}:{}),completedGroup:body.unitId&&current.state.completedIndices?.some(i=>current.state.plan.regions[i].shell.id===body.unitId)?{nodeIds:[body.unitId]}:null});
 if(Number(body.baseDocumentRevision)!==Number(base)||found.document.currentDocumentRevision!==Number(base))throw units.error('DOCUMENT_REVISION_MISMATCH');
 if(row.status!=='working')throw units.error('WORK_CANCELLED');
 const selected=body.unitId?row.state.plan.regions.findIndex(r=>r.shell.id===body.unitId):readyGroups(row.state)[0]?.index;
 if(selected===undefined||selected<0)throw units.error('WORK_UNIT_UNKNOWN');
 const region=row.state.plan.regions[selected];if(row.state.completedIndices?.includes(selected))return respond(row);
 if(!readyGroups(row.state).some(g=>g.index===selected))throw units.error('WORK_DEPENDENCY_REQUIRED');
 let job=await units.readUnit(sql,units.workId(runId,'region',region.shell.id),subject);
 try{
  if(job?.state==='prepared'||job?.state==='completed'){await (use.verifyUnitConfig||units.verifyUnitConfig)(sql,job);}
  else{
   if(row.state.requirements)await require('./_page-schema-requirements').pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:subject,revision:row.state.requirements.revision});
   const variables=draftVariables({...row.state,cursor:selected},region,subject+':'+found.document.id+':'+runId);variables.constraintsJson=JSON.stringify({...JSON.parse(variables.constraintsJson),unitNodeIdPrefix:unitPrefix(region),maxRegionNodes:row.state.unitBudgets?.[region.shell.id]||48,previewContract:{...JSON.parse(variables.constraintsJson).previewContract,maxRegionNodes:row.state.unitBudgets?.[region.shell.id]||48},parallelUnit:true});
   const execution=await use.createPromptExecutionSnapshot(sql,'promo_page_region_builder',variables);assertV2(execution.promptConfig);
   const identity=inputHash({plan:row.state.plan,context:row.state.context,requirements:row.state.requirements,base,index:selected,config:units.configHash(execution.promptConfig)});
   job=await units.claimUnit(sql,{id:units.workId(runId,'region',region.shell.id),documentId:found.document.id,owner:subject,runId,key:region.shell.id,kind:'region',hash:identity,config:execution.promptConfig,input:{execution:{type:'promo_page_region_builder',variables,config:execution.promptConfig},index:selected}});
   if(job.pending)return respond(await read(),true);
   if(job.state==='running'){
    let generated=await use.generate({type:'promo_page_region_builder',schemaName:'page_parallel_region_v2',schema:regionSchema(row.state.context,region,{parallel:true}),promptConfig:execution.promptConfig});
    try{applyRegion({...row.state,cursor:selected},generated.result);}catch(error){
     await require('./_work-log').logEvent({event:'checkpoint',status:'failed',errorCode:error.code,message:error.message,metadata:{unitId:region.shell.id,attempt:1,errors:error.errors}});
     if(!['PAGE_DRAFT_INVALID','PAGE_IMAGE_PLAN_INCOMPLETE','PAGE_SCHEMA_INVALID'].includes(error.code))throw error;
     if(error.code==='PAGE_IMAGE_PLAN_INCOMPLETE'){
      const repaired=await require('./_page-image-plan-repair').repairRegionImages({state:{...row.state,cursor:selected},result:generated.result,variables,use,sql,originalConfig:execution.promptConfig});generated={result:repaired.result,usage:repaired.usage};
     }else{
     const repaired={...variables,constraintsJson:JSON.stringify({...JSON.parse(variables.constraintsJson),repairFeedback:{attempt:1,maxRepairs:1,code:error.code,errors:error.errors?.slice(0,12)}})};
     const correction=await use.createPromptExecutionSnapshot(sql,'promo_page_region_builder',repaired);if(units.configHash(correction.promptConfig)!==units.configHash(execution.promptConfig))throw units.error('WORK_CONFIG_CHANGED');
     generated=await use.generate({type:'promo_page_region_builder',schemaName:'page_parallel_region_v2',schema:regionSchema(row.state.context,region,{parallel:true}),promptConfig:correction.promptConfig});applyRegion({...row.state,cursor:selected},generated.result);
     }
    }
    job=await units.prepareUnit(sql,job,{result:generated.result,usage:generated.usage||{},execution:{type:'promo_page_region_builder',promptId:execution.promptConfig.promptId,promptVersion:execution.promptConfig.promptVersion,configHash:units.configHash(execution.promptConfig),model:execution.promptConfig.model,skills:execution.promptConfig.skillSnapshots||[]}});
   }
  }
  for(let attempt=0;attempt<8;attempt++){
   const current=await read();if(current.status!=='working')throw units.error('WORK_CANCELLED');
   if(current.state.completedIndices?.includes(selected))return respond(current);
   if(inputHash(current.state.plan)!==inputHash(row.state.plan)||inputHash(current.state.context)!==inputHash(row.state.context))throw units.error('WORK_INPUT_CHANGED');
   const state=structuredClone(current.state);state.page=applyRegion({...state,cursor:selected},job.result_json.result);state.completedIndices=[...new Set([...(state.completedIndices||[]),selected])].sort((a,b)=>a-b);state.cursor=state.completedIndices.length;state.executions.push(job.result_json.execution);
   try{await sql`select merge_promo_draft_unit(${job.id}::uuid,${subject},${current.sequence},${JSON.stringify(state)}::jsonb) as sequence`;return respond(await read());}catch(error){const translated=units.translate(error);if(['WORK_MERGE_CONFLICT','40P01','40001'].includes(translated.code))continue;throw translated;}
  }
  throw units.error('WORK_MERGE_CONFLICT');
 }catch(error){await units.failUnit(sql,job,error).catch(()=>{});throw error;}
}
module.exports={processParallelDraft};
