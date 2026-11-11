const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {requireBuilderFlag}=require('./_promo-builder-flags');
const {getSql,fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');
const {assertPageSchemaInfrastructure,loadPageSchemaLibrary}=require('./_page-schema-readiness');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {prepareOverviewForPreview}=require('../shared/page-schema/content-confirmation.cjs');
const {normalizeOverview}=require('./_promo-overview-contract');
const {plannerContext,contentContext,generatePage,snapshotForPage,structureFingerprint,TYPES,LIMITS,assertValid,normalize}=require('./_page-schema-service');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{
  requireBuilderFlag('pageSchemaV1');
  if(!['GET','POST','PUT'].includes(req.method)){res.setHeader('Allow','GET, POST, PUT');return res.status(405).json({error:'Method not allowed'});}
  const owner=resolveBuilderOwner(req,res),sql=getSql(),body=parseBody(req.body);
  await assertPageSchemaInfrastructure(sql);
  if(req.method==='GET'){
   const library=await loadPageSchemaLibrary(sql);
   return res.status(200).json({ok:true,ready:true,generationPath:'page-schema',rendererKey:'page-schema-renderer',tokenVersionId:library.tokenVersionId});
  }
  const found=await fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found)return res.status(404).json({error:'Builder document not found'});
  if(found.document.mode!=='ai')return res.status(422).json({error:'AI document required'});
  const base=Number(body.baseDocumentRevision);
  if(!Number.isInteger(base)||base!==found.document.currentDocumentRevision)return res.status(409).json({code:'DOCUMENT_REVISION_MISMATCH',error:'문서가 변경되었습니다. 다시 불러와 주세요.'});
  if(req.method==='POST'&&body.operation==='approve-structure'){
   const current=found.snapshot;
   if(!current?.content?.pageSchema)return res.status(409).json({code:'PAGE_SCHEMA_REQUIRED',error:'승인할 페이지 구성이 없습니다.'});
   const fingerprint=structureFingerprint(current.content.pageSchema);
   if(body.structureFingerprint!==fingerprint)return res.status(409).json({code:'PAGE_SCHEMA_STRUCTURE_CHANGED',error:'페이지 구성이 변경되었습니다. 최신 미리보기를 확인해 주세요.'});
   assertValid(current.content.pageSchema,current.content.pageContext);
   if(current.generationMeta?.review?.state==='approved')return res.status(200).json({ok:true,revision:base,snapshot:current});
   const snapshot={...current,generationMeta:{...current.generationMeta,review:{state:'approved',structureFingerprint:fingerprint,sourceDocumentRevision:base,approvedAt:new Date().toISOString()}}};
   const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,source:'manual',changeNote:'PageSchema structure explicitly approved'});
   return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot});
  }
  let context,page,execution;
  if(req.method==='PUT'){
   if(!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required'});
   context=found.snapshot.content.pageContext;
   assertValid(body.page,context);page=normalize(body.page).page;assertValid(page,context);
  }else{
   const prepared=prepareOverviewForPreview(normalizeOverview(body.overview||{}));
   const overview=prepared.overview;
   if(!overview.title)return res.status(422).json({error:'프로모션 제목이 필요합니다.'});
   if(body.instruction&&!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required for revisions'});
   if(body.instruction){context=found.snapshot.content.pageContext;}else{
    context=contentContext(overview,await loadPageSchemaLibrary(sql));
    context.omittedContent=prepared.omittedItems;
   }
   const instruction=String(body.instruction||'').slice(0,4000);
   const generationRequest=String(body.generationRequest||'').slice(0,12000);
   const pinned=await createPromptExecutionSnapshot(sql,'promo_page_schema_planner',{
    overviewJson:JSON.stringify(overview),candidateSnapshotJson:JSON.stringify(plannerContext(context)),
    constraintsJson:JSON.stringify({limits:LIMITS,instruction,generationRequest,currentPage:instruction?found.snapshot.content.pageSchema:null,responsiveDefaults:'mobile one column; tablet max two columns; normal flow',requiredPolicy:'registered-only'})});
   execution=await generatePage({overview,context,instruction,promptConfig:pinned.promptConfig,generate:generateStructuredPlannerResult});execution.promptConfig=pinned.promptConfig;page=execution.page;
  }
  const snapshot=snapshotForPage(page,context,found.snapshot||{});
  const prompt=execution?.promptConfig;
  snapshot.generationMeta={...snapshot.generationMeta,review:{state:'pending'},operation:req.method==='PUT'?'manual-edit':body.instruction?'ai-edit':'ai-generate',
   prompt:prompt?{id:prompt.promptId||null,type:prompt.promptType,version:prompt.promptVersion||null,provider:prompt.provider,model:prompt.model}:found.snapshot?.generationMeta?.prompt||null};
  const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,source:req.method==='PUT'?'manual':'ai',changeNote:req.method==='PUT'?'PageSchema validated manual edit':'AI dynamic PageSchema generation'});
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot,validation:execution?.validation,adjustments:execution?.adjustments||[],warnings:context.omittedContent||[]});
 }catch(error){if(/revision conflict/i.test(error.message)){error.statusCode=409;error.code='DOCUMENT_REVISION_MISMATCH';}return res.status(error.statusCode||500).json({error:error.message,code:error.code||'PAGE_SCHEMA_GENERATION_FAILED',errors:error.errors||[]});}
};

