const {fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {acquireGeneration,failGeneration,inputHash}=require('./_page-schema-generation-jobs');
const {plannerContext,structureFingerprint}=require('./_page-schema-service');
const {reviewFingerprint,isCurrentReview,reviewSchema,applyReview,sanitizedReport}=require('./_page-quality-agent-contract');
const error=(code,message,statusCode=409)=>Object.assign(new Error(message),{code,statusCode,retryable:false});
async function processQualityReview({sql,owner,body,res},dependencies={}){
 const use={fetchDocument,createDocumentRevision,createPromptExecutionSnapshot,generate:generateStructuredPlannerResult,acquireGeneration,failGeneration,...dependencies};
 let job;
 try{
  const found=await use.fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found?.snapshot?.content?.pageSchema)throw error('PAGE_SCHEMA_REQUIRED','검토할 페이지 구성을 찾을 수 없습니다.',404);
  const current=found.snapshot;
  require('../shared/page-schema/contract.cjs').assertValid(current.content.pageSchema,current.content.pageContext);
  if(current.content.pageSchema.mediaRequests.length)throw error('QUALITY_AGENT_MEDIA_PENDING','이미지 준비 완료 후 AI 품질 검토를 진행합니다.');
  if(isCurrentReview(current)&&!(body.force===true&&(current.generationMeta?.qualityAgentHistory||[]).length<2))return res.status(200).json({ok:true,cached:true,changed:false,requiresApproval:current.generationMeta.review?.state==='pending',revision:found.document.currentDocumentRevision,snapshot:current});
  if(Number(body.baseDocumentRevision)!==found.document.currentDocumentRevision)throw error('DOCUMENT_REVISION_MISMATCH','문서가 변경되었습니다. 최신 페이지에서 자동 검토를 다시 진행합니다.');
  if(current.generationMeta?.review?.state!=='approved')throw error('PAGE_SCHEMA_APPROVAL_REQUIRED','페이지 구성 승인 후 AI 검토를 진행합니다.');
  const history=current.generationMeta?.qualityAgentHistory||[];
  if(history.length>=2)throw error('QUALITY_AGENT_LIMIT_REACHED','AI 자동 검토·수정 횟수에 도달했습니다. 현재 결과와 미해결 항목을 보존했습니다.');
  const sourceRevision=current.generationMeta?.sourceRequirements?.revision;
  if(sourceRevision&&require('./_promo-builder-flags').builderFlags().chatWorkspaceV1)await require('./_page-schema-requirements').pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:sourceRevision});
  const report=sanitizedReport(body.report),context={...current.content.pageContext};
  // Previously selected aliases remain resolvable even when a generation list is bounded.
  const pinned=new Set();require('../shared/page-schema/contract.cjs').walk(current.content.pageSchema.root,({node})=>{for(const key of [...node.styles.base,...node.styles.tablet||[],...node.styles.mobile||[],node.overlayRole].filter(Boolean))pinned.add(key);});context.pinnedStyleRoles=[...pinned];
  const execution=await use.createPromptExecutionSnapshot(sql,'promo_page_quality_reviewer',{currentPageJson:JSON.stringify(current.content.pageSchema),qualityReportJson:JSON.stringify(report),candidateSnapshotJson:JSON.stringify(plannerContext(context)),constraintsJson:JSON.stringify({maxPatches:32,maxAgentRounds:2,allowedChanges:['registered styles','registered spacing','layout enums and ratios','image presentation','registered overlay'],preserve:['node IDs','tree order and nesting','text and factual copy','source references','asset IDs and files','actions and URLs','form bindings'],reviewScope:'PageSchema and supplied browser measurements; no screenshot or visual pixel access is supplied. Never claim browser tests were run by the model.',history:history.map(record=>({summary:record.summary,blockingCount:record.blockingCount}))})});
  const cfg=execution.promptConfig,fingerprint=reviewFingerprint(current),hash=inputHash({documentId:found.document.id,fingerprint,round:history.length,prompt:cfg.renderedPromptHash||cfg.renderedPrompt,model:cfg.model});
  const hex=hash.slice(0,32),requestId=`${hex.slice(0,8)}-${hex.slice(8,12)}-5${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20)}`;
  job=await use.acquireGeneration(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,requestId,hash});
  if(job.replayed)throw error('QUALITY_AGENT_RESULT_SUPERSEDED','기존 검토 이후 문서가 변경되었습니다. 최신 페이지를 확인해 주세요.');
  const result=await use.generate({type:'promo_page_quality_reviewer',schemaName:'page_quality_review',schema:reviewSchema(current.content.pageSchema,context),promptConfig:cfg});
  const applied=applyReview(current.content.pageSchema,context,result.result);
  const requiresApproval=structureFingerprint(applied.page)!==structureFingerprint(current.content.pageSchema);
  const snapshot=JSON.parse(JSON.stringify(current));snapshot.content.pageSchema=applied.page;snapshot.qualityGate={state:'pending'};
  const review={requestId,summary:applied.summary,issues:applied.issues,blockingCount:applied.blockingCount,patches:applied.patches,sourceRevision:found.document.currentDocumentRevision,inputFingerprint:fingerprint,targetFingerprint:reviewFingerprint(snapshot),execution:{promptId:cfg.promptId,promptVersion:cfg.promptVersion,provider:cfg.provider,model:cfg.model,skillSnapshots:cfg.skillSnapshots||[],renderedPromptHash:cfg.renderedPromptHash,providerResult:result.provider,usage:result.usage||{}}};
  snapshot.generationMeta={...snapshot.generationMeta,qualityAgentRequired:true,qualityAgentReview:review,qualityAgentHistory:[...history,review],structureFingerprint:structureFingerprint(applied.page),structureFingerprintVersion:2,review:requiresApproval?{state:'pending'}:snapshot.generationMeta.review};
  const saved=await use.createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:found.document.currentDocumentRevision,snapshot,generationJob:job,requirementsGuard:require('./_promo-builder-flags').builderFlags().chatWorkspaceV1?sourceRevision||null:null,source:'ai',changeNote:'AI quality review and constrained repair; browser recheck required'});
  return res.status(200).json({ok:true,changed:applied.changed,requiresApproval,revision:saved.revision,snapshot:saved.snapshot});
 }catch(e){
  if(e.code==='GENERATION_IN_PROGRESS'){const current=await use.fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});return res.status(202).json({ok:true,pending:true,retryAfterMs:1500,revision:current.document.currentDocumentRevision,snapshot:current.snapshot});}
  if(job?.claimToken)await use.failGeneration(sql,job,e.code).catch(()=>{});
  if(/revision conflict/i.test(e.message)){e.code='DOCUMENT_REVISION_MISMATCH';e.statusCode=409;}
  if(/Active promo_page_quality_reviewer prompt template not found/.test(e.message)){e.code='QUALITY_AGENT_PROMPT_REQUIRED';e.statusCode=503;e.message='관리자에서 migration 092의 AI 품질 검토·수정 프롬프트를 검증·활성화해 주세요.';}
  if(e.code==='42P01'){e.code='QUALITY_AGENT_MIGRATION_REQUIRED';e.statusCode=503;e.message='AI 품질 검토에 필요한 DB migration 088·092 적용을 확인해 주세요.';}
  throw e;
 }
}
module.exports={processQualityReview};
