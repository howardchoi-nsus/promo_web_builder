const {fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateStructuredPlannerResult}=require('./_promo-section-design-provider');
const {acquireGeneration,failGeneration,inputHash}=require('./_page-schema-generation-jobs');
const {plannerContext,structureFingerprint}=require('./_page-schema-service');
const {treeNodes,designGroups}=require('../shared/page-schema/section-design.cjs');
const {sectionDesignSchema,applySectionDesign}=require('./_page-section-design-contract');
const error=(code,message,statusCode=409)=>Object.assign(new Error(message),{code,statusCode,retryable:false});
function newSectionDesign(page){return {version:1,parallelV1:require('./_promo-builder-flags').builderFlags().parallelPageWork,id:require('node:crypto').randomUUID(),structureFingerprint:structureFingerprint(page),state:'pending',groups:designGroups(page),completed:[],promptIdentity:null};}
async function processSectionDesign({sql,owner,body,res},dependencies={}){
 const use={fetchDocument,createDocumentRevision,createPromptExecutionSnapshot,generate:generateStructuredPlannerResult,acquireGeneration,failGeneration,...dependencies};let job;
 try{
  const found=await use.fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found?.snapshot?.content?.pageSchema)throw error('PAGE_SCHEMA_REQUIRED','디자인할 페이지를 찾을 수 없습니다.',404);
  const current=found.snapshot,plan=current.generationMeta?.sectionDesign;
  if(!plan||plan.id!==body.runId)throw error('SECTION_DESIGN_RUN_CHANGED','페이지 디자인 요청이 변경되었습니다. 최신 페이지에서 이어갑니다.');
  if(!Array.isArray(plan.groups)||!Array.isArray(plan.completed))throw error('SECTION_DESIGN_STATE_INVALID','디자인 상태가 유효하지 않습니다. 새 페이지 구성을 생성해 주세요.');
  require('../shared/page-schema/contract.cjs').assertValid(current.content.pageSchema,current.content.pageContext);
  require('./_page-structure-state').assertStructureReady(current);
  if(plan.completed.some(item=>item.id===body.groupId))return res.status(200).json({ok:true,cached:true,revision:found.document.currentDocumentRevision,snapshot:current});
  if(Number(body.baseDocumentRevision)!==found.document.currentDocumentRevision)throw error('DOCUMENT_REVISION_MISMATCH','페이지가 변경되었습니다. 최신 결과에서 이어가 주세요.');
  if(structureFingerprint(current.content.pageSchema)!==plan.structureFingerprint)throw error('SECTION_DESIGN_STRUCTURE_CHANGED','페이지 구조가 변경되었습니다. 새 구성을 확인해 주세요.');
  const group=plan.groups.find(group=>!plan.completed.some(item=>item.id===group.id));
  if(!group||group.id!==body.groupId)throw error('SECTION_DESIGN_ORDER_INVALID','현재 디자인할 영역과 요청이 다릅니다.');
  const context={...current.content.pageContext,designBrief:require('./_page-design-direction').savedDesignBrief(current)};
  context.pinnedStyleRoles=[...new Set(treeNodes(current.content.pageSchema).flatMap(node=>[...node.styles.base,...node.styles.tablet||[],...node.styles.mobile||[],node.overlayRole].filter(Boolean)))];
  const sourceRevision=current.generationMeta.sourceRequirements?.revision;
  if(sourceRevision&&require('./_promo-builder-flags').builderFlags().chatWorkspaceV1)await require('./_page-schema-requirements').pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision:sourceRevision});
  const execution=await use.createPromptExecutionSnapshot(sql,'promo_page_section_designer',{currentPageJson:JSON.stringify(current.content.pageSchema),sectionJson:JSON.stringify({...group,nodes:treeNodes(current.content.pageSchema).filter(node=>group.nodeIds.includes(node.id)).map(node=>({...node,children:(node.children||[]).map(child=>child.id)}))}),candidateSnapshotJson:JSON.stringify(plannerContext(context)),constraintsJson:JSON.stringify({designTask:require('./_page-design-task').designTask('region-style'),designBrief:context.designBrief,allowedChanges:['registered styles','registered spacing','registered overlay'],preserve:['tree','layout','text','facts','source IDs','assets','actions','URLs','media requests'],completed:plan.completed.map(item=>({id:item.id,summary:item.summary}))})});
  const cfg=execution.promptConfig,identity=inputHash({id:cfg.promptId,version:cfg.promptVersion,provider:cfg.provider,model:cfg.model,temperature:cfg.temperature,maxTokens:cfg.maxTokens,modelOptions:cfg.modelOptions,skills:cfg.skillSnapshots||[]});
  if(plan.promptIdentity&&plan.promptIdentity!==identity)throw error('SECTION_DESIGN_PROMPT_CHANGED','디자인 프롬프트 설정이 변경되었습니다. 새 페이지 구성을 생성·승인해 주세요.');
  const hash=inputHash({runId:plan.id,groupId:group.id,identity,source:inputHash({page:current.content.pageSchema,context:current.content.pageContext})}),hex=hash.slice(0,32),requestId=`${hex.slice(0,8)}-${hex.slice(8,12)}-5${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20)}`;
  job=await use.acquireGeneration(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,requestId,hash});
  if(job.replayed){
   const latest=await use.fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
   if(latest?.snapshot?.generationMeta?.sectionDesign?.id===plan.id&&latest.snapshot.generationMeta.sectionDesign.completed.some(item=>item.id===group.id))return res.status(200).json({ok:true,cached:true,revision:latest.document.currentDocumentRevision,snapshot:latest.snapshot});
   throw error('SECTION_DESIGN_RESULT_SUPERSEDED','이 영역의 결과 이후 페이지가 변경되었습니다.');
  }
  const result=await use.generate({type:'promo_page_section_designer',schemaName:'page_section_design',schema:sectionDesignSchema(group,context),promptConfig:cfg});
  const applied=applySectionDesign(current.content.pageSchema,context,group,result.result),snapshot=JSON.parse(JSON.stringify(current));
  snapshot.content.pageSchema=applied.page;snapshot.content.pageContext=JSON.parse(JSON.stringify(context));snapshot.generationMeta.outputDiagnostics=require('./_page-schema-output-diagnostics').outputDiagnostics(applied.page,context);snapshot.qualityGate={state:'pending'};
  const record={id:group.id,summary:applied.summary,patches:applied.patches,execution:{promptId:cfg.promptId,promptVersion:cfg.promptVersion,provider:cfg.provider,model:cfg.model,skillSnapshots:cfg.skillSnapshots||[],renderedPromptHash:cfg.renderedPromptHash,usage:result.usage||{}}};
  const completed=[...plan.completed,record];snapshot.generationMeta.sectionDesign={...plan,promptIdentity:identity,completed,state:completed.length===plan.groups.length?'complete':'pending'};
  const saved=await use.createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:found.document.currentDocumentRevision,snapshot,generationJob:job,requirementsGuard:require('./_promo-builder-flags').builderFlags().chatWorkspaceV1?sourceRevision||null:null,source:'ai',changeNote:`Registered section design ${completed.length}/${plan.groups.length}`});
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot});
 }catch(e){
  if(e.code==='GENERATION_IN_PROGRESS'){const found=await use.fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});return res.status(202).json({ok:true,pending:true,retryAfterMs:1500,revision:found.document.currentDocumentRevision,snapshot:found.snapshot});}
  if(job?.claimToken)await use.failGeneration(sql,job,e.code).catch(()=>{});
  if(/revision conflict/i.test(e.message)){e.code='DOCUMENT_REVISION_MISMATCH';e.statusCode=409;}
  if(/Active promo_page_section_designer prompt template not found/.test(e.message)){e.code='SECTION_DESIGN_PROMPT_REQUIRED';e.statusCode=503;e.retryable=true;e.message='관리자에서 migration 093의 AI 영역 디자인 프롬프트를 검증·활성화해 주세요.';}
  throw e;
 }
}
module.exports={newSectionDesign,processSectionDesign};
