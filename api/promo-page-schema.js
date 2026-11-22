const {dynamicLayoutPolicy}=require('./_page-schema-planning-policy');
const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {randomUUID}=require('node:crypto');
const {acquireGeneration,failGeneration,inputHash}=require('./_page-schema-generation-jobs');
const {pageStyleWarnings}=require('../shared/token-usage-policy.cjs');
const {designBrief,reviewDesign,structuralHash,compositionOutline}=require('./_page-schema-design');
const {pinPageRequirements}=require('./_page-schema-requirements');
const {requireBuilderFlag,builderFlags}=require('./_promo-builder-flags');
const {getSql,fetchDocument,createDocumentRevision,fetchRecentDocumentSnapshots}=require('./_promo-builder-document-store');
const {assertPageSchemaInfrastructure,loadPageSchemaLibrary}=require('./_page-schema-readiness');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {prepareOverviewForPreview,pendingCriticalInputs}=require('../shared/page-schema/content-confirmation.cjs');
const {normalizeOverview}=require('./_promo-overview-contract');
const {reusePreparedMedia,plannerContext,contentContext,generatePage,snapshotForPage,structureFingerprint,TYPES,LIMITS,assertValid,normalize}=require('./_page-schema-service');
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
  if(['start-draft','advance-draft','read-draft'].includes(body.operation)){requireBuilderFlag('pageDraftV1');return await require('./_page-draft-service').processPageDraft({sql,owner,body,found,res});}
  const generationRequestId=req.method==='POST'&&!['approve-structure','repair-quality'].includes(body.operation)?String(body.requestId||randomUUID()):null;
  const requestHash=generationRequestId?inputHash({overview:normalizeOverview(body.overview||{}),instruction:String(body.instruction||''),...(body.viewportScope?{viewportScope:body.viewportScope}:{}),generationRequest:String(body.generationRequest||''),...(body.selectionNodeId?{selectionNodeId:String(body.selectionNodeId)}:{}),base:Number(body.baseDocumentRevision)}):null;
  if(generationRequestId&&found.snapshot?.generationMeta?.requestId===generationRequestId){
   if(found.snapshot.generationMeta.inputHash!==requestHash)return res.status(409).json({code:'GENERATION_REQUEST_MISMATCH',error:'생성 요청 ID와 입력이 다릅니다.',retryable:false});
   return res.status(200).json({ok:true,replayed:true,revision:found.document.currentDocumentRevision,snapshot:found.snapshot,warnings:found.snapshot.content.pageContext?.omittedContent||[]});
  }
  const base=Number(body.baseDocumentRevision);
  if(!Number.isInteger(base)||base!==found.document.currentDocumentRevision)return res.status(409).json({code:'DOCUMENT_REVISION_MISMATCH',error:'문서가 변경되었습니다. 다시 불러와 주세요.'});
  if(req.method==='POST'&&body.operation==='repair-quality'){
   const current=found.snapshot;
   if(!current?.content?.pageSchema)return res.status(409).json({code:'PAGE_SCHEMA_REQUIRED',error:'보정할 페이지 구성이 없습니다.'});
   if(builderFlags().chatWorkspaceV1&&current.generationMeta?.sourceRequirements)await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:current.generationMeta.sourceRequirements.revision});
   const repaired=require('./_page-schema-quality-repair').repairPageQuality(current.content.pageSchema,current.content.pageContext,body.diagnostics);
   if(!repaired.changed)return res.status(200).json({ok:true,changed:false,revision:base,snapshot:current,actions:[]});
   const fingerprint=structureFingerprint(repaired.page),requiresApproval=fingerprint!==structureFingerprint(current.content.pageSchema);
   const snapshot={...current,content:{...current.content,pageSchema:repaired.page},qualityGate:{state:'pending'},generationMeta:{...current.generationMeta,structureFingerprint:fingerprint,structureFingerprintVersion:2,review:requiresApproval?{state:'pending'}:current.generationMeta.review,qualityRepair:{sourceRevision:base,actions:repaired.actions}}};
   const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,requirementsGuard:builderFlags().chatWorkspaceV1?current.generationMeta?.sourceRequirements?.revision||null:null,source:'manual',changeNote:'Registered-token automatic quality repair'});
   return res.status(200).json({ok:true,changed:true,requiresApproval,actions:repaired.actions,revision:saved.revision,snapshot:saved.snapshot});
  }
  if(req.method==='POST'&&body.operation==='approve-structure'){
   if(body.sectionDesignVersion!==undefined&&body.sectionDesignVersion!==1)return res.status(400).json({code:'SECTION_DESIGN_VERSION_UNSUPPORTED',error:'지원하지 않는 영역 디자인 버전입니다.'});
   if(body.sectionDesignVersion===1&&!builderFlags().sectionDesignV1)return res.status(503).json({code:'SECTION_DESIGN_DISABLED',error:'영역 디자인 기능이 비활성화되어 있습니다. 관리자 설정을 확인해 주세요.',retryable:true});
   const current=found.snapshot;
   if(!current?.content?.pageSchema)return res.status(409).json({code:'PAGE_SCHEMA_REQUIRED',error:'승인할 페이지 구성이 없습니다.'});
   const fingerprint=structureFingerprint(current.content.pageSchema);
   // Legacy hashes were computed before jsonb reordered keys. The revision check
   // above binds approval to the exact immutable snapshot the client inspected.
   const legacyMatch=!current.generationMeta?.structureFingerprintVersion&&typeof body.structureFingerprint==='string'&&body.structureFingerprint===current.generationMeta?.structureFingerprint;
   if(body.structureFingerprint!==fingerprint&&!legacyMatch)return res.status(409).json({code:'PAGE_SCHEMA_STRUCTURE_CHANGED',error:'페이지 구성이 변경되었습니다. 최신 미리보기를 확인해 주세요.'});
   if(builderFlags().chatWorkspaceV1&&current.generationMeta?.sourceRequirements)await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:current.generationMeta.sourceRequirements.revision});
   assertValid(current.content.pageSchema,current.content.pageContext);
   require('./_page-image-requirements').assertImageCoverage(current.content.pageSchema,current.content.pageContext);
   if(current.generationMeta?.review?.state==='approved')return res.status(200).json({ok:true,revision:base,snapshot:current});
   const snapshot={...current,generationMeta:{...current.generationMeta,structureFingerprint:fingerprint,structureFingerprintVersion:2,review:{state:'approved',structureFingerprint:fingerprint,sourceDocumentRevision:base,approvedAt:new Date().toISOString()}}};
   if(body.sectionDesignVersion===1&&builderFlags().sectionDesignV1&&!snapshot.generationMeta.sectionDesign)snapshot.generationMeta.sectionDesign=require('./_page-section-design').newSectionDesign(snapshot.content.pageSchema);
   const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,source:'manual',changeNote:'PageSchema structure explicitly approved'});
   return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot});
  }
  let context,page,execution,requirementsPin=null;
  if(req.method==='PUT'){
   if(!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required'});
   context=found.snapshot.content.pageContext;
   if(builderFlags().chatWorkspaceV1&&found.snapshot.generationMeta?.sourceRequirements)await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:found.snapshot.generationMeta.sourceRequirements.revision});
   assertValid(body.page,context);page=normalize(body.page).page;assertValid(page,context);
  }else{
   if(builderFlags().chatWorkspaceV1)requirementsPin=await pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:body.requirementsRevision,overview:body.overview});
   const prepared=prepareOverviewForPreview(requirementsPin?.overview||normalizeOverview(body.overview||{}));
   const overview=prepared.overview;
   if(body.instruction&&!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required for revisions'});
   if(body.instruction){
    const previous=found.snapshot.content.pageContext;
    context=!body.overview&&!requirementsPin?{...previous,styleChoicesVersion:1}:contentContext(overview,{...previous,styleChoicesVersion:1});
    const pinned=new Set();require('../shared/page-schema/contract.cjs').walk(found.snapshot.content.pageSchema.root,({node})=>{for(const role of [...node.styles.base,...(node.styles.tablet||[]),...(node.styles.mobile||[]),node.overlayRole].filter(Boolean))pinned.add(role);});
    context.pinnedStyleRoles=[...pinned];
    const registry=await require('./_page-schema-catalog').loadPageAssets(sql);
    context={...previous,...context,assets:{...registry.assets,...previous.assets},icons:{...registry.icons,...previous.icons},formFields:previous.formFields,actions:{...previous.actions,...context.actions}};
   }else context=contentContext(overview,await loadPageSchemaLibrary(sql));
   context.omittedContent=prepared.omittedItems;
   context.unresolvedInputs=pendingCriticalInputs(overview).filter(item=>!item.blocking).map(item=>({...item,message:item.message.replace(/(?:을|를) 입력해 주세요\.$/,' 정보가 미정입니다. 확정 사실로 출력하지 않습니다.')}));
   generationJob=await acquireGeneration(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,requestId:generationRequestId,hash:requestHash});
   if(generationJob.replayed)throw Object.assign(new Error('이 생성 결과 이후 문서가 변경되었습니다. 최신 문서를 불러와 주세요.'),{code:'GENERATION_RESULT_SUPERSEDED',statusCode:409,retryable:false});
   const recent=await fetchRecentDocumentSnapshots(sql,owner.ownerSubject,{limit:12});
   const recentStructures=[...new Set(recent.filter(s=>s?.content?.pageSchema).map(s=>structuralHash(s.content.pageSchema)))].slice(0,5);
   const recentCompositions=[...new Map(recent.filter(s=>s?.content?.pageSchema).map(s=>{const description=compositionOutline(s.content.pageSchema);return [description.fingerprint,description];})).values()].slice(0,3);
   if(body.viewportScope&&body.viewportScope!=='mobile')throw Object.assign(new Error('지원하지 않는 화면 수정 범위입니다.'),{statusCode:422,code:'VIEWPORT_SCOPE_INVALID'});
   if(body.viewportScope==='mobile'&&(found.snapshot?.generationMeta?.review?.state!=='approved'||found.snapshot?.qualityGate?.state!=='passed'||Number(found.snapshot?.qualityGate?.documentRevision)!==found.document.currentDocumentRevision))throw Object.assign(new Error('기존 페이지의 구성 승인과 자동 품질검사를 완료한 후 모바일 구성을 요청해 주세요.'),{statusCode:409,code:'PAGE_SCHEMA_APPROVAL_REQUIRED'});
   const instruction=String(body.instruction||'').slice(0,4000)+(body.viewportScope==='mobile'?'\nChange only mobile layout/styles/spacing overrides on existing node IDs. Preserve desktop, tablet, tree, text, assets and actions.':'');
   if(body.selectionNodeId){if(!instruction||!found.snapshot?.content?.pageSchema)throw Object.assign(new Error('선택 영역 수정에는 기존 페이지가 필요합니다.'),{statusCode:422,code:'EDITOR_SELECTION_INVALID'});require('./_page-editor-contract').assertSelectedScope(found.snapshot.content.pageSchema,found.snapshot.content.pageSchema,String(body.selectionNodeId));}
   const generationRequest=String(body.generationRequest||'').slice(0,12000);
   context.designBrief=designBrief(overview,{requestId:generationRequestId,recentStructures,recentCompositions,requestText:generationRequest,instruction,previous:require('./_page-design-direction').savedDesignBrief(found.snapshot)});
   const pinned=await createPromptExecutionSnapshot(sql,'promo_page_schema_planner',{
    overviewJson:JSON.stringify(overview),candidateSnapshotJson:JSON.stringify(plannerContext(context)),
    constraintsJson:JSON.stringify({limits:LIMITS,dynamicLayoutPolicy,selectionNodeId:body.selectionNodeId||null,selectionPolicy:body.selectionNodeId?'Change only the selected subtree; preserve every node and property outside it.':null,instruction,generationRequest,currentPage:instruction?found.snapshot.content.pageSchema:null,responsiveDefaults:'mobile one column; tablet max two columns; normal flow',requiredPolicy:'registered-only',layoutGeometryPolicy:'Use supplied layoutGeometry.contentWidth after registered outer margins. Do not assume a 1280px canvas or shrink registered margins. Reduce logical column count when text would be squeezed. Do not place opaque full-size cards over a key visual. Prefer separate content images when registered foreground/overlay colours cannot ensure legibility. Preserve approved layout unless structural repair is explicitly reapproved.',styleSelectionPolicy:'Choose registered policyRoles by semantic content hierarchy: hero heading, section heading, card heading, body, label, supporting copy and key statistic. Use compatible registered size/weight/line-height/color variants deliberately; do not use one title size for every heading. Use border color, width and style together only when registered. Never invent CSS or values. Preserve legibility and responsive hierarchy. Use an image with presentation background inside a container for a key visual; use container.overlayRole only for supplied registered gradient roles. Missing gradient tokens do not permit invented overlays. Set mediaRequests.regenerate true only when the user requests a new image; otherwise preserve or reuse already prepared matching assets.',factualSourcePolicy:'For text containing numbers, amounts, percentages or URLs, use contentMode source with exactly one supplied contentSources ID and empty text. Preserve the entire approved source, including qualifiers. Do not extract amounts, rewrite factual claims, or invent numbered step labels. Editorial text must contain no restricted facts.',contentCompletionPolicy:'Review flags are advisory, never a generation prerequisite. Generate missing editorial headings, descriptions and CTA copy from the user request with contentMode editorial. Never invent dates, amounts, eligibility, legal terms or URLs; omit unresolved factual material. Preserve supplied facts and copy.',designBrief:context.designBrief})});
   execution=await generatePage({overview,context,instruction,promptConfig:pinned.promptConfig,generate:generateStructuredPlannerResult});execution.promptConfig=pinned.promptConfig;page=reusePreparedMedia(execution.page,context,found.snapshot);if(body.viewportScope==='mobile')page=require('./_page-mobile-edit').mobileOnlyPage(found.snapshot.content.pageSchema,page);assertValid(page,context);require('./_page-image-requirements').assertImageCoverage(page,context);if(body.selectionNodeId)require('./_page-editor-contract').assertSelectedScope(found.snapshot.content.pageSchema,page,String(body.selectionNodeId));
   execution.designReview=builderFlags().hallmarkDesign?reviewDesign(page,{recentStructures:context.designBrief?.recentStructures||[],preserveLayout:Boolean(instruction)}):{blockingCount:0,designWarnings:[]};
   execution.designReview.designWarnings.push(...pageStyleWarnings(context));
  }
  const currentDesignBrief=context.designBrief;const renderContext=context;
  const snapshot=snapshotForPage(page,renderContext,found.snapshot||{});
  snapshot.generationMeta.styleSelectionDiagnostics=plannerContext(context).styleSelectionDiagnostics;
  const prompt=execution?.promptConfig;
  snapshot.generationMeta={...snapshot.generationMeta,execution:execution?{provider:execution.provider,usage:execution.usage||{},model:prompt?.model}:found.snapshot?.generationMeta?.execution||null,requestId:generationRequestId,inputHash:requestHash,design:currentDesignBrief||found.snapshot?.generationMeta?.design||null,designReview:execution?.designReview||(builderFlags().hallmarkDesign?reviewDesign(page,{preserveLayout:true}):null),sourceRequirements:requirementsPin?{revision:requirementsPin.revision,fingerprint:requirementsPin.fingerprint}:found.snapshot?.generationMeta?.sourceRequirements||null,review:{state:'pending'},operation:req.method==='PUT'?'manual-edit':body.instruction?'ai-edit':'ai-generate',
   prompt:prompt?{id:prompt.promptId||null,type:prompt.promptType,version:prompt.promptVersion||null,provider:prompt.provider,model:prompt.model,skillSnapshots:prompt.skillSnapshots||[]}:found.snapshot?.generationMeta?.prompt||null};
  if(found.snapshot?.generationMeta?.qualityAgentRequired)snapshot.generationMeta.qualityAgentRequired=true;
  if(req.method==='PUT'||body.selectionNodeId){
   snapshot.generationMeta.review=require('./_page-editor-contract').manualReview(found.snapshot,page);
   if(snapshot.generationMeta.review.state==='approved'&&found.snapshot.generationMeta?.sectionDesign)snapshot.generationMeta.sectionDesign=found.snapshot.generationMeta.sectionDesign;
  }
  const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,generationJob:generationJob?.claimToken?generationJob:null,chatTransition:requirementsPin?{requirementsRevision:requirementsPin.revision}:null,source:req.method==='PUT'?'manual':'ai',changeNote:req.method==='PUT'?'PageSchema validated manual edit':'AI dynamic PageSchema generation'});
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot,validation:execution?.validation,adjustments:execution?.adjustments||[],warnings:[...(context.omittedContent||[]),...(context.unresolvedInputs||[]),...(execution?.designReview?.designWarnings||[])]});
 }catch(error){if(['start-draft','advance-draft','read-draft'].includes(parseBody(req.body)?.operation)){if(error.code==='42P01'){error.statusCode=503;error.code='PAGE_DRAFT_MIGRATION_REQUIRED';error.message='누적 와이어프레임 DB migration 095를 확인해 주세요.';}if(/Active promo_page_(manifest_planner|region_builder|outline_planner|fragment_writer) prompt template not found/.test(error.message)){error.statusCode=503;error.code='PAGE_DRAFT_PROMPT_REQUIRED';error.message='관리자에서 migration 096의 작업 계획 V2·영역 구성 V2 프롬프트를 검증·활성화해 주세요.';}if(error.code==='23505'){error.statusCode=409;error.code='PAGE_DRAFT_IN_PROGRESS';error.message='이 문서의 초안 생성이 이미 진행 중입니다.';}}if(generationJob?.claimToken&&jobSql){try{await failGeneration(jobSql,generationJob,error.code);}catch{}}if(/revision conflict/i.test(error.message)){error.statusCode=409;error.code='DOCUMENT_REVISION_MISMATCH';}return res.status(error.statusCode||500).json({error:error.message,code:error.code||'PAGE_SCHEMA_GENERATION_FAILED',errors:error.errors||[],...(error.providerDiagnostics?{providerDiagnostics:error.providerDiagnostics}:{}),retryable:typeof error.retryable==='boolean'?error.retryable:[429,500,502,503,504].includes(error.statusCode||500)});}
};

