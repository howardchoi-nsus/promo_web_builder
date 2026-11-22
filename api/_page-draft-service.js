const {randomUUID}=require('node:crypto');
const {planSchema,planResult,regionSchema,applyRegion,nextGroup,assertV2,draftProgress}=require('./_page-draft-units');
const {contentContext,plannerContext,snapshotForPage,structureFingerprint,assertValid,normalize}=require('./_page-schema-service');
const {loadPageSchemaLibrary}=require('./_page-schema-readiness');const {normalizeOverview}=require('./_promo-overview-contract');
const {prepareOverviewForPreview}=require('../shared/page-schema/content-confirmation.cjs');const {designBrief}=require('./_page-schema-design');
const {pinPageRequirements}=require('./_page-schema-requirements');const {builderFlags}=require('./_promo-builder-flags');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');const {inputHash,acquireGeneration,failGeneration}=require('./_page-schema-generation-jobs');
const error=(code,message,statusCode=409)=>Object.assign(new Error(message),{code,statusCode,retryable:true});
async function processPageDraft({sql,owner,body,found,res},deps={}){
 const receivedAt=Date.now();let finalJob;
 const use={acquireGeneration,failGeneration,loadPageSchemaLibrary,createPromptExecutionSnapshot,generate:generateStructuredPlannerResult,createDocumentRevision,fetchDocument,...deps};
 const runId=String(body.requestId||'');if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(runId))throw error('PAGE_DRAFT_REQUEST_INVALID','유효한 생성 요청 ID가 필요합니다.',400);
 const read=async()=>{const rows=await sql`select * from promo_page_drafts where id=${runId}::uuid and document_id=${found.document.id}::uuid and owner_subject=${owner.ownerSubject}`;return rows[0];};
 let row=await read(),lease=null;
 // Read-only recovery never invokes a model, acquires a lease or advances work.
 if(body.operation==='read-draft'&&row?.status==='working'){
  if(Number(body.baseDocumentRevision)!==found.document.currentDocumentRevision||Number(row.base_revision)!==found.document.currentDocumentRevision)throw error('DOCUMENT_REVISION_MISMATCH','문서가 변경되었습니다. 최신 문서를 확인해 주세요.');
  if(!row.state.page)return res.status(200).json({ok:true,pending:true,runId});
  return res.status(200).json({ok:true,draft:true,runId,contractVersion:row.state.contractVersion||1,sequence:row.sequence,page:row.state.page,context:row.state.context,nextGroup:row.state.contractVersion===2?nextGroup(row.state):row.state.groups[row.state.cursor]||null,completedRegions:row.state.cursor,...(row.state.contractVersion===2?draftProgress(row.state):{})});
 }
 if(body.operation==='read-draft'&&!row)throw error('PAGE_DRAFT_REQUIRED','저장된 초안이 없습니다.');
 // In-flight V1 drafts retain their original contracts and saved work.
 if(row&&row.state?.contractVersion!==2)return require('./_page-draft-legacy-service').processPageDraft({sql,owner,body,found,res},deps);
 if(found.snapshot?.generationMeta?.draftRunId===runId&&row?.status!=='complete'){await sql`update promo_page_drafts set status='complete',final_revision=${found.document.currentDocumentRevision},lease_token=null,lease_expires_at=null where id=${runId}::uuid and owner_subject=${owner.ownerSubject}`;return res.status(200).json({ok:true,complete:true,revision:found.document.currentDocumentRevision,snapshot:found.snapshot});}
 if(row?.status==='complete'){
  if(found.snapshot?.generationMeta?.draftRunId!==runId||Number(row.final_revision)!==found.document.currentDocumentRevision)throw error('PAGE_DRAFT_SUPERSEDED','최신 문서를 불러와 주세요.');
  return res.status(200).json({ok:true,complete:true,revision:row.final_revision,snapshot:found.snapshot});
 }
 if(row?.status==='abandoned')throw error('PAGE_DRAFT_SUPERSEDED','새 구성 생성이 시작되었습니다. 최신 작업에서 이어가 주세요.');
 if(row&&body.operation==='start-draft'&&body.overview&&inputHash({overview:prepareOverviewForPreview(normalizeOverview(body.overview)).overview,request:body.generationRequest,base:Number(body.baseDocumentRevision)})!==row.request_hash)throw error('PAGE_DRAFT_REQUEST_MISMATCH','생성 요청과 입력이 일치하지 않습니다.');
 const base=Number(body.baseDocumentRevision);
 if(base!==found.document.currentDocumentRevision||row&&Number(row.base_revision)!==base)throw error('DOCUMENT_REVISION_MISMATCH','문서가 변경되었습니다. 초안은 보존했습니다.');
 if(!row){
  if(body.operation!=='start-draft')throw error('PAGE_DRAFT_REQUIRED','먼저 페이지 구성 생성을 시작해 주세요.');
  const requirement=builderFlags().chatWorkspaceV1?await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:body.requirementsRevision,overview:body.overview}):null;
  const prepared=prepareOverviewForPreview(requirement?.overview||normalizeOverview(body.overview||{}));const overview=prepared.overview;
  const context=contentContext(overview,await use.loadPageSchemaLibrary(sql));context.omittedContent=prepared.omittedItems;context.designBrief=designBrief(overview,{requestText:body.generationRequest,requestId:runId});
  const state={createdAt:receivedAt,timings:[],contractVersion:2,plan:null,overview,context,requirements:requirement?{revision:requirement.revision,fingerprint:requirement.fingerprint}:null,page:null,cursor:0,executions:[]};
  const hash=inputHash({overview,request:body.generationRequest,base});
  await sql`update promo_page_drafts set status='abandoned',updated_at=now() where document_id=${found.document.id}::uuid and owner_subject=${owner.ownerSubject} and status='working' and id<>${runId}::uuid and (lease_token is null or lease_expires_at<now())`;
  await sql`insert into promo_page_drafts(id,document_id,owner_subject,base_revision,request_hash,state) values(${runId}::uuid,${found.document.id}::uuid,${owner.ownerSubject},${base},${hash},${JSON.stringify(state)}::jsonb) on conflict(id) do nothing`;
  row=await read();if(!row||row.request_hash!==hash)throw error('PAGE_DRAFT_REQUEST_MISMATCH','생성 요청과 입력이 일치하지 않습니다.');
 }
 if(body.operation==='start-draft'&&row.state.page)return res.status(200).json({ok:true,draft:true,runId,sequence:row.sequence,baseDocumentRevision:base,page:row.state.page,context:row.state.context,nextGroup:nextGroup(row.state),...draftProgress(row.state)});
 if(Number(body.sequence||0)<Number(row.sequence))return res.status(200).json({ok:true,draft:true,runId,sequence:row.sequence,baseDocumentRevision:base,page:row.state.page,context:row.state.context,nextGroup:nextGroup(row.state),...draftProgress(row.state)});
 if(Number(body.sequence||0)>Number(row.sequence))throw error('PAGE_DRAFT_SEQUENCE_INVALID','초안 작업 순서가 올바르지 않습니다.');
 lease=randomUUID();const claims=await sql`update promo_page_drafts set lease_token=${lease}::uuid,lease_expires_at=now()+interval '6 minutes',updated_at=now() where id=${runId}::uuid and owner_subject=${owner.ownerSubject} and sequence=${row.sequence} and (lease_token is null or lease_expires_at<now()) returning id`;
 if(!claims.length)return res.status(202).json({ok:true,pending:true,runId,sequence:row.sequence,retryAfterMs:1500});
 const attemptStarted=Date.now();let phase='preparation',phaseStarted=attemptStarted;
 const timing={kind:row.state.plan?(row.state.plan.regions[row.state.cursor]?'region':'assembly'):'plan'};
 const endPhase=next=>{timing[`${phase}Ms`]=Math.max(0,Date.now()-phaseStarted);phase=next;phaseStarted=Date.now();};
 try{
  const state=structuredClone(row.state),context=state.context,region=state.plan?.regions[state.cursor];
  if(state.requirements)await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:state.requirements.revision});
  // One request creates a lightweight plan OR one real region. Final assembly
  // is a separate request so even the last saved region is observable first.
  if(!state.plan||region){
   endPhase('prompt');
   const type=state.plan?'promo_page_region_builder':'promo_page_manifest_planner';
   const variables={overviewJson:JSON.stringify(state.overview),candidateSnapshotJson:JSON.stringify(plannerContext(context)),constraintsJson:JSON.stringify({contractVersion:2,phase:state.plan?'region':'plan',previewContract:{skeletonFirst:true,initialViewport:'desktop',responsiveDefaults:true,placeholders:'planned-shells-only',granularity:'major-sections-and-layout-groups',compactManifest:true,maxShellStyleRoles:6,manifestIntentMaxLength:160,regionTransport:'compact-desktop-v1',maxRegionNodes:48,maxRegionStyleRoles:8},designBrief:context.designBrief,region:region||null,plan:state.plan,page:state.page,policy:'Return only the supplied schema. Plan empty shells only. Build only the current region. Facts use assigned existing sources. No HTML/CSS or numeric editorial claims.'})};
   const execution=await use.createPromptExecutionSnapshot(sql,type,variables);assertV2(execution.promptConfig);endPhase('model');
   const response=await use.generate({type,schemaName:state.plan?'page_draft_region_v2':'page_draft_plan_v2',schema:state.plan?regionSchema(context,region):planSchema(context),promptConfig:execution.promptConfig});endPhase('validation');
   if(state.plan){state.page=applyRegion(state,response.result);state.cursor++;}else Object.assign(state,planResult(response.result,context));
   state.executions.push({type,promptId:execution.promptConfig.promptId,promptVersion:execution.promptConfig.promptVersion,model:execution.promptConfig.model,renderedPromptHash:execution.promptConfig.renderedPromptHash,skills:execution.promptConfig.skillSnapshots||[],usage:response.usage||{}});
   endPhase('save');state.timings||=[];state.timings.push({...timing});
   const updated=await sql`update promo_page_drafts set state=${JSON.stringify(state)}::jsonb,sequence=sequence+1,lease_token=null,lease_expires_at=null,updated_at=now() where id=${runId}::uuid and lease_token=${lease}::uuid and lease_expires_at>now() returning sequence`;
   if(!updated.length)throw error('PAGE_DRAFT_LEASE_CHANGED','작업 소유권이 변경되었습니다. 저장된 초안을 다시 불러와 주세요.');
   endPhase('response');
   return res.status(200).json({ok:true,draft:true,runId,contractVersion:2,workTiming:{...timing,totalMs:Math.max(0,Date.now()-attemptStarted)},sequence:updated[0].sequence,baseDocumentRevision:base,page:state.page,context,nextGroup:nextGroup(state),completedGroup:state.cursor?{nodeIds:[state.plan.regions[state.cursor-1].shell.id]}:null,completedRegions:state.cursor,totalRegions:state.plan.regions.length,...draftProgress(state)});
  }
  const alive=await sql`update promo_page_drafts set lease_expires_at=now()+interval '6 minutes' where id=${runId}::uuid and lease_token=${lease}::uuid and lease_expires_at>now() returning id`;if(!alive.length)throw error('PAGE_DRAFT_LEASE_CHANGED','생성 작업이 변경되었습니다. 저장된 초안에서 이어가 주세요.');
  if(state.plan&&state.cursor>=state.plan.regions.length){
   endPhase('validation');
   state.page=normalize(state.page).page;assertValid(state.page,context);const latest=await use.fetchDocument(sql,found.document.id,owner.ownerSubject,{includeSnapshot:true});
   if(latest.document.currentDocumentRevision!==base)throw error('DOCUMENT_REVISION_MISMATCH','구성 생성 중 문서가 변경되었습니다.');
   if(state.requirements)await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:state.requirements.revision});
   endPhase('save');state.timings||=[];state.timings.push({...timing});
   await sql`update promo_page_drafts set state=${JSON.stringify(state)}::jsonb,sequence=sequence+1,updated_at=now() where id=${runId}::uuid and lease_token=${lease}::uuid`;
   finalJob=await use.acquireGeneration(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,requestId:runId,hash:inputHash({draft:row.request_hash,page:state.page,brief:context.designBrief?.briefHash})});
   if(finalJob.replayed)throw error('PAGE_DRAFT_SUPERSEDED','저장된 최신 문서를 확인해 주세요.');
   const snapshot=snapshotForPage(state.page,context,found.snapshot||{});snapshot.generationMeta={...snapshot.generationMeta,draftRunId:runId,draftExecutions:state.executions,draftTimings:state.timings||[],design:context.designBrief,sourceRequirements:state.requirements,review:{state:'pending'},structureFingerprint:structureFingerprint(state.page),structureFingerprintVersion:2};
   const saved=await use.createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,generationJob:finalJob,requirementsGuard:state.requirements?.revision||null,chatTransition:state.requirements?{requirementsRevision:state.requirements.revision}:null,source:'ai',changeNote:'Validated accumulated PageSchema wireframe'});
   await sql`update promo_page_drafts set status='complete',final_revision=${saved.revision},state=${JSON.stringify(state)}::jsonb,sequence=sequence+1,lease_token=null,lease_expires_at=null,updated_at=now() where id=${runId}::uuid and lease_token=${lease}::uuid`;
   endPhase('response');
   return res.status(200).json({ok:true,complete:true,workTiming:{...timing,totalMs:Math.max(0,Date.now()-attemptStarted)},revision:saved.revision,snapshot:saved.snapshot,warnings:context.omittedContent||[]});
  }
  throw error('PAGE_DRAFT_STATE_INVALID','초안 진행 상태를 확인할 수 없습니다.');
 }catch(e){endPhase('failed');timing.totalMs=Math.max(0,Date.now()-attemptStarted);if(finalJob?.claimToken)await use.failGeneration(sql,finalJob,e.code).catch(()=>{});await sql`update promo_page_drafts set state=jsonb_set(state,'{lastFailure}',${JSON.stringify({...timing,failed:true,errorCode:e.code||'PAGE_DRAFT_FAILED',...(e.providerDiagnostics?{providerDiagnostics:e.providerDiagnostics}:{})})}::jsonb),lease_token=null,lease_expires_at=null,updated_at=now() where id=${runId}::uuid and lease_token=${lease}::uuid`;throw e;}
}
module.exports={processPageDraft};
