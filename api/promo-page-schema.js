const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {randomUUID}=require('node:crypto');
const {acquireGeneration,failGeneration,inputHash}=require('./_page-schema-generation-jobs');
const {designBrief,reviewDesign,structuralHash,compositionOutline}=require('./_page-schema-design');
const {pinPageRequirements}=require('./_page-schema-requirements');
const {requireBuilderFlag,builderFlags}=require('./_promo-builder-flags');
const {getSql,fetchDocument,createDocumentRevision,fetchRecentDocumentSnapshots}=require('./_promo-builder-document-store');
const {assertPageSchemaInfrastructure,loadPageSchemaLibrary}=require('./_page-schema-readiness');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {prepareOverviewForPreview,pendingCriticalInputs}=require('../shared/page-schema/content-confirmation.cjs');
const {normalizeOverview}=require('./_promo-overview-contract');
const {plannerContext,contentContext,generatePage,snapshotForPage,structureFingerprint,TYPES,LIMITS,assertValid,normalize}=require('./_page-schema-service');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 let generationJob=null,jobSql=null;
 try{
  requireBuilderFlag('pageSchemaV1');
  if(!['GET','POST','PUT'].includes(req.method)){res.setHeader('Allow','GET, POST, PUT');return res.status(405).json({error:'Method not allowed'});}
  const owner=resolveBuilderOwner(req,res),sql=getSql(),body=parseBody(req.body);jobSql=sql;
  await assertPageSchemaInfrastructure(sql);
  if(req.method==='GET'){
   const library=await loadPageSchemaLibrary(sql);
   return res.status(200).json({ok:true,ready:true,generationPath:'page-schema',rendererKey:'page-schema-renderer',tokenVersionId:library.tokenVersionId});
  }
  const found=await fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found)return res.status(404).json({error:'Builder document not found'});
  if(found.document.mode!=='ai')return res.status(422).json({error:'AI document required'});
  const generationRequestId=req.method==='POST'&&body.operation!=='approve-structure'?String(body.requestId||randomUUID()):null;
  const requestHash=generationRequestId?inputHash({overview:normalizeOverview(body.overview||{}),instruction:String(body.instruction||''),generationRequest:String(body.generationRequest||''),base:Number(body.baseDocumentRevision)}):null;
  if(generationRequestId&&found.snapshot?.generationMeta?.requestId===generationRequestId){
   if(found.snapshot.generationMeta.inputHash!==requestHash)return res.status(409).json({code:'GENERATION_REQUEST_MISMATCH',error:'생성 요청 ID와 입력이 다릅니다.',retryable:false});
   return res.status(200).json({ok:true,replayed:true,revision:found.document.currentDocumentRevision,snapshot:found.snapshot,warnings:found.snapshot.content.pageContext?.omittedContent||[]});
  }
  const base=Number(body.baseDocumentRevision);
  if(!Number.isInteger(base)||base!==found.document.currentDocumentRevision)return res.status(409).json({code:'DOCUMENT_REVISION_MISMATCH',error:'문서가 변경되었습니다. 다시 불러와 주세요.'});
  if(req.method==='POST'&&body.operation==='approve-structure'){
   const current=found.snapshot;
   if(!current?.content?.pageSchema)return res.status(409).json({code:'PAGE_SCHEMA_REQUIRED',error:'승인할 페이지 구성이 없습니다.'});
   const fingerprint=structureFingerprint(current.content.pageSchema);
   // Legacy hashes were computed before jsonb reordered keys. The revision check
   // above binds approval to the exact immutable snapshot the client inspected.
   const legacyMatch=!current.generationMeta?.structureFingerprintVersion&&typeof body.structureFingerprint==='string'&&body.structureFingerprint===current.generationMeta?.structureFingerprint;
   if(body.structureFingerprint!==fingerprint&&!legacyMatch)return res.status(409).json({code:'PAGE_SCHEMA_STRUCTURE_CHANGED',error:'페이지 구성이 변경되었습니다. 최신 미리보기를 확인해 주세요.'});
   if(builderFlags().chatWorkspaceV1&&current.generationMeta?.sourceRequirements)await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:current.generationMeta.sourceRequirements.revision});
   assertValid(current.content.pageSchema,current.content.pageContext);
   if(current.generationMeta?.review?.state==='approved')return res.status(200).json({ok:true,revision:base,snapshot:current});
   const snapshot={...current,generationMeta:{...current.generationMeta,structureFingerprint:fingerprint,structureFingerprintVersion:2,review:{state:'approved',structureFingerprint:fingerprint,sourceDocumentRevision:base,approvedAt:new Date().toISOString()}}};
   const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,source:'manual',changeNote:'PageSchema structure explicitly approved'});
   return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot});
  }
  let context,page,execution,requirementsPin=null;
  if(req.method==='PUT'){
   if(!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required'});
   context=found.snapshot.content.pageContext;
   assertValid(body.page,context);page=normalize(body.page).page;assertValid(page,context);
  }else{
   if(builderFlags().chatWorkspaceV1)requirementsPin=await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:body.requirementsRevision,overview:body.overview});
   const prepared=prepareOverviewForPreview(requirementsPin?.overview||normalizeOverview(body.overview||{}));
   const overview=prepared.overview;
   if(body.instruction&&!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required for revisions'});
   if(body.instruction){
    const previous=found.snapshot.content.pageContext;
    context=contentContext(overview,previous);
    context={...previous,...context,assets:previous.assets,icons:previous.icons,formFields:previous.formFields,actions:{...previous.actions,...context.actions}};
   }else context=contentContext(overview,await loadPageSchemaLibrary(sql));
   context.omittedContent=prepared.omittedItems;
   context.unresolvedInputs=pendingCriticalInputs(overview).filter(item=>!item.blocking).map(item=>({...item,message:item.message.replace(/(?:을|를) 입력해 주세요\.$/,' 정보가 미정입니다. 확정 사실로 출력하지 않습니다.')}));
   generationJob=await acquireGeneration(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,requestId:generationRequestId,hash:requestHash});
   if(generationJob.replayed)throw Object.assign(new Error('이 생성 결과 이후 문서가 변경되었습니다. 최신 문서를 불러와 주세요.'),{code:'GENERATION_RESULT_SUPERSEDED',statusCode:409,retryable:false});
   const recent=await fetchRecentDocumentSnapshots(sql,owner.ownerSubject,{limit:12});
   const recentStructures=[...new Set(recent.filter(s=>s?.content?.pageSchema).map(s=>structuralHash(s.content.pageSchema)))].slice(0,5);
   const recentCompositions=[...new Map(recent.filter(s=>s?.content?.pageSchema).map(s=>{const description=compositionOutline(s.content.pageSchema);return [description.fingerprint,description];})).values()].slice(0,3);
   context.designBrief=builderFlags().hallmarkDesign?designBrief(overview,{requestId:generationRequestId,recentStructures,recentCompositions}):null;
   const instruction=String(body.instruction||'').slice(0,4000);
   const generationRequest=String(body.generationRequest||'').slice(0,12000);
   const pinned=await createPromptExecutionSnapshot(sql,'promo_page_schema_planner',{
    overviewJson:JSON.stringify(overview),candidateSnapshotJson:JSON.stringify(plannerContext(context)),
    constraintsJson:JSON.stringify({limits:LIMITS,instruction,generationRequest,currentPage:instruction?found.snapshot.content.pageSchema:null,responsiveDefaults:'mobile one column; tablet max two columns; normal flow',requiredPolicy:'registered-only',contentCompletionPolicy:'Review flags are advisory, never a generation prerequisite. Generate missing editorial headings, descriptions and CTA copy from the user request with contentMode editorial. Never invent dates, amounts, eligibility, legal terms or URLs; omit unresolved factual material. Preserve supplied facts and copy.',designBrief:context.designBrief})});
   execution=await generatePage({overview,context,instruction,promptConfig:pinned.promptConfig,generate:generateStructuredPlannerResult});execution.promptConfig=pinned.promptConfig;page=execution.page;
   execution.designReview=builderFlags().hallmarkDesign?reviewDesign(page,{recentStructures:context.designBrief?.recentStructures||[],preserveLayout:Boolean(instruction)}):null;
  }
  const {designBrief:currentDesignBrief,...renderContext}=context;
  const snapshot=snapshotForPage(page,renderContext,found.snapshot||{});
  const prompt=execution?.promptConfig;
  snapshot.generationMeta={...snapshot.generationMeta,execution:execution?{provider:execution.provider,usage:execution.usage||{},model:prompt?.model}:found.snapshot?.generationMeta?.execution||null,requestId:generationRequestId,inputHash:requestHash,design:currentDesignBrief||found.snapshot?.generationMeta?.design||null,designReview:execution?.designReview||(builderFlags().hallmarkDesign?reviewDesign(page,{preserveLayout:true}):null),sourceRequirements:requirementsPin?{revision:requirementsPin.revision,fingerprint:requirementsPin.fingerprint}:found.snapshot?.generationMeta?.sourceRequirements||null,review:{state:'pending'},operation:req.method==='PUT'?'manual-edit':body.instruction?'ai-edit':'ai-generate',
   prompt:prompt?{id:prompt.promptId||null,type:prompt.promptType,version:prompt.promptVersion||null,provider:prompt.provider,model:prompt.model}:found.snapshot?.generationMeta?.prompt||null};
  const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,generationJob:generationJob?.claimToken?generationJob:null,chatTransition:requirementsPin?{requirementsRevision:requirementsPin.revision}:null,source:req.method==='PUT'?'manual':'ai',changeNote:req.method==='PUT'?'PageSchema validated manual edit':'AI dynamic PageSchema generation'});
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot,validation:execution?.validation,adjustments:execution?.adjustments||[],warnings:[...(context.omittedContent||[]),...(context.unresolvedInputs||[]),...(execution?.designReview?.designWarnings||[])]});
 }catch(error){if(generationJob?.claimToken&&jobSql){try{await failGeneration(jobSql,generationJob,error.code);}catch{}}if(/revision conflict/i.test(error.message)){error.statusCode=409;error.code='DOCUMENT_REVISION_MISMATCH';}return res.status(error.statusCode||500).json({error:error.message,code:error.code||'PAGE_SCHEMA_GENERATION_FAILED',errors:error.errors||[],retryable:typeof error.retryable==='boolean'?error.retryable:[429,500,502,503,504].includes(error.statusCode||500)});}
};

