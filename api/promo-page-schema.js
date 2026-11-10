const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {requireBuilderFlag}=require('./_promo-builder-flags');
const {getSql,fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');
const {fetchTokenSets,fetchTokenVersion}=require('./_design-token-store');
const {activeTokenUsagePolicy,tokenPolicyCatalog}=require('./_token-usage-policy-store');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {normalizeOverview}=require('./_promo-overview-contract');
const {plannerContext,contentContext,generatePage,snapshotForPage,TYPES,LIMITS,assertValid,normalize}=require('./_page-schema-service');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{
  requireBuilderFlag('pageSchemaV1');
  if(!['POST','PUT'].includes(req.method)){res.setHeader('Allow','POST, PUT');return res.status(405).json({error:'Method not allowed'});}
  const owner=resolveBuilderOwner(req,res),sql=getSql(),body=parseBody(req.body);
  const found=await fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found)return res.status(404).json({error:'Builder document not found'});
  if(found.document.mode!=='ai')return res.status(422).json({error:'AI document required'});
  const base=Number(body.baseDocumentRevision);
  if(!Number.isInteger(base)||base!==found.document.currentDocumentRevision)return res.status(409).json({code:'DOCUMENT_REVISION_MISMATCH',error:'문서가 변경되었습니다. 다시 불러와 주세요.'});
  let context,page,execution;
  if(req.method==='PUT'){
   if(!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required'});
   context=found.snapshot.content.pageContext;
   assertValid(body.page,context);page=normalize(body.page).page;assertValid(page,context);
  }else{
   const overview=normalizeOverview(body.overview||{});
   if(!overview.title)return res.status(422).json({error:'프로모션 제목이 필요합니다.'});
   if(body.instruction&&!found.snapshot?.content?.pageSchema)return res.status(409).json({error:'PageSchema document required for revisions'});
   if(body.instruction){context=found.snapshot.content.pageContext;}else{
    const sets=await fetchTokenSets(sql,{activeOnly:true}),set=sets.find(s=>s.setKey==='design-system');
    if(!set)throw Object.assign(new Error('활성 단일 디자인 토큰 라이브러리가 필요합니다.'),{statusCode:422,code:'TOKEN_LIBRARY_REQUIRED'});
    const version=await fetchTokenVersion(sql,set.versionId),policy=await activeTokenUsagePolicy(sql,version),catalog=tokenPolicyCatalog(version);
    context=contentContext(overview,{usagePolicy:policy,tokenCatalog:catalog,tokenValues:Object.fromEntries(catalog.map(t=>[t.name,t.value])),tokenVersionId:version.id});
   }
   const instruction=String(body.instruction||'').slice(0,4000);
   const pinned=await createPromptExecutionSnapshot(sql,'promo_page_schema_planner',{
    overviewJson:JSON.stringify(overview),candidateSnapshotJson:JSON.stringify(plannerContext(context)),
    constraintsJson:JSON.stringify({limits:LIMITS,instruction,currentPage:instruction?found.snapshot.content.pageSchema:null,responsiveDefaults:'mobile one column; tablet max two columns; normal flow',requiredPolicy:'registered-only'})});
   execution=await generatePage({overview,context,instruction,promptConfig:pinned.promptConfig,generate:generateStructuredPlannerResult});page=execution.page;
  }
  const snapshot=snapshotForPage(page,context,found.snapshot||{});
  const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,source:req.method==='PUT'?'manual':'ai',changeNote:req.method==='PUT'?'PageSchema validated manual edit':'AI dynamic PageSchema generation'});
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot,validation:execution?.validation,adjustments:execution?.adjustments||[]});
 }catch(error){if(/revision conflict/i.test(error.message)){error.statusCode=409;error.code='DOCUMENT_REVISION_MISMATCH';}return res.status(error.statusCode||500).json({error:error.message,code:error.code||'PAGE_SCHEMA_GENERATION_FAILED',errors:error.errors||[]});}
};

