const {randomUUID,randomBytes,createHash}=require('node:crypto');
const {fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateSectionImage}=require('./_promo-section-design-provider');
const {imageMetadata}=require('./_section-ai-control-plane');
const {walk,safeUrl,assertValid}=require('../shared/page-schema/contract.cjs');
const {acquireGeneration,failGeneration,inputHash}=require('./_page-schema-generation-jobs');
const {structureFingerprint,reusableMediaKey}=require('./_page-schema-service');
async function assertMediaRequirements(sql,found,owner){
 if(!found)throw Object.assign(new Error('이미지 준비 중 문서가 변경되거나 삭제되었습니다.'),{code:'MEDIA_REQUEST_SUPERSEDED',statusCode:409,retryable:false});
 const revision=found.snapshot?.generationMeta?.sourceRequirements?.revision;
 if(revision&&require('./_promo-builder-flags').builderFlags().chatWorkspaceV1)await require('./_page-schema-requirements').pinPageRequirements(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,revision});
}
async function assertMediaReady(sql){
 const rows=await sql`select to_regclass('public.promo_page_schema_assets') is not null as assets_ready,to_regclass('public.promo_page_schema_generation_jobs') is not null as generation_ready`;
 if(!rows[0]?.assets_ready)throw Object.assign(new Error('이미지 저장을 위한 DB migration 086을 확인해 주세요.'),{code:'PAGE_SCHEMA_MIGRATION_REQUIRED',statusCode:503});
 if(!rows[0]?.generation_ready)throw Object.assign(new Error('이미지 중복 실행 방지를 위한 DB migration 088을 확인해 주세요.'),{code:'PAGE_SCHEMA_MIGRATION_REQUIRED',statusCode:503});
 if(!process.env.BLOB_READ_WRITE_TOKEN)throw Object.assign(new Error('이미지 저장소 연결 설정이 필요합니다. BLOB_READ_WRITE_TOKEN을 환경 비밀 설정에서 확인해 주세요.'),{code:'MEDIA_STORAGE_REQUIRED',statusCode:503,retryable:false});
}

async function processPageMedia({req,res,sql,owner,body},dependencies={}){
 const use={assertRequirements:assertMediaRequirements,assertReady:assertMediaReady,fetchDocument,createDocumentRevision,createPromptExecutionSnapshot,generateSectionImage,acquireGeneration,failGeneration,blob:()=>import('@vercel/blob'),...dependencies};
 let job=null,uploaded=null,committed=false,originalRequest,originalStructure,originalNodeId,originalRequestId,originalRequirements,originalRequestData,imageExecution;
 try{
  let found=await use.fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found?.snapshot?.content?.pageSchema)return res.status(404).json({error:'PageSchema document not found'});
  const base=Number(body.baseDocumentRevision);

  let snapshot=JSON.parse(JSON.stringify(found.snapshot)),page=snapshot.content.pageSchema,context=snapshot.content.pageContext;
  let node;walk(page.root,entry=>{if(entry.node.id===body.nodeId)node=entry.node;});
  if(!node)return res.status(404).json({error:'Node not found'});
  if(req.method==='POST'&&node.assetId&&body.requestId&&snapshot.generationMeta?.mediaBindings?.[node.id]?.requestId===body.requestId)return res.status(200).json({ok:true,replayed:true,revision:found.document.currentDocumentRevision,snapshot:found.snapshot});
  if(base!==found.document.currentDocumentRevision)return res.status(409).json({code:'DOCUMENT_REVISION_MISMATCH',error:'문서가 변경되었습니다. 다시 불러와 주세요.'});
  if(req.method==='PATCH'){
   const url=safeUrl(body.url);if(!url)return res.status(422).json({error:'허용되는 HTTPS 또는 사이트 내부 URL을 입력해 주세요.'});
   const id=`approved_${randomUUID().replaceAll('-','')}`;
   if(node.type==='button'){context.actions[id]={kind:'navigate',href:url,label:node.label};node.actionId=id;}
   else if(node.type==='video'){
    // Caption requirements cannot be cleared through a media URL binding.
    const captions=safeUrl(body.captionUrl);if(!captions)return res.status(422).json({error:'접근성을 위한 자막 VTT URL이 필요합니다.'});
    context.assets[id]={kind:'video',url,hasAudio:true};node.assetId=id;
    const captionId=`caption_${randomUUID().replaceAll('-','')}`;context.assets[captionId]={kind:'caption',url:captions};node.captionAssetId=captionId;
   }else return res.status(422).json({error:'Button or video node required'});
  }else{
   if(node.type!=='image')return res.status(422).json({error:'Image node required'});
   await use.assertReady(sql);
   let image;
   if(req.method==='POST'){
    if(snapshot.generationMeta?.review?.state!=='approved')throw Object.assign(new Error('페이지 구성을 승인한 후 이미지를 준비할 수 있습니다.'),{code:'PAGE_SCHEMA_APPROVAL_REQUIRED',statusCode:409});
    await use.assertRequirements(sql,found,owner);
    const request=page.mediaRequests.find(r=>r.id===node.requestId&&r.nodeId===node.id);
    if(body.requestId&&body.requestId!==node.requestId)throw Object.assign(new Error('이미지 요청이 변경되었습니다.'),{code:'MEDIA_REQUEST_SUPERSEDED',statusCode:409,retryable:false});
    if(!request)return res.status(409).json({error:'Pending image request required'});
    const backgroundColor=context.tokenValues[context.usagePolicy.bindings['page.background']];
    const isBackground=node.presentation==='background';
    const promptType=isBackground&&/^#[0-9a-f]{6}$/i.test(backgroundColor||'')?'section_background_image':'component_image';
    const variables={sectionName:page.summary,contentJson:JSON.stringify({intent:request.intent,sourceIds:request.sourceIds,contentSources:context.contentSources,backgroundColor}),adminGuidance:''};
    if(promptType==='section_background_image')Object.assign(variables,{backgroundColor,aspectRatio:request.aspectRatio,fadeMode:'none',brandPalette:JSON.stringify(Object.fromEntries(['page.background','text.primary','button.background'].map(role=>[role,context.tokenValues[context.usagePolicy.bindings[role]]])))});
    else Object.assign(variables,{componentName:isBackground?'PageSchema key visual':'PageSchema image',fieldName:node.id});
    const pinned=await use.createPromptExecutionSnapshot(sql,promptType,variables);
    const cfg=pinned.promptConfig;
    imageExecution={promptType,promptId:cfg.promptId,promptVersion:cfg.promptVersion,provider:cfg.provider,model:cfg.model};
    const hash=inputHash({generationRequestId:snapshot.generationMeta.requestId,documentId:found.document.id,nodeId:node.id,request,prompt:cfg.renderedPrompt,model:cfg.model,sourceRequirements:snapshot.generationMeta.sourceRequirements});
    const hex=hash.slice(0,32),requestId=`${hex.slice(0,8)}-${hex.slice(8,12)}-5${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20)}`;
    job=await use.acquireGeneration(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,requestId,hash});
    if(job.replayed)throw Object.assign(new Error('저장된 이미지 결과 이후 문서가 변경되었습니다. 최신 페이지를 확인해 주세요.'),{code:'GENERATION_RESULT_SUPERSEDED',statusCode:409});
    originalRequestData=request;originalRequest=inputHash(request);originalStructure=structureFingerprint(page);originalNodeId=node.id;originalRequestId=node.requestId;originalRequirements=inputHash(snapshot.generationMeta.sourceRequirements||null);
    image=await use.generateSectionImage({prompt:cfg.renderedPrompt,targetType:isBackground?'section':'item',aspectRatio:request.aspectRatio,effectiveAspectRatio:request.aspectRatio,provider:cfg.provider,model:cfg.model,modelOptions:cfg.modelOptions,promptConfig:cfg});
   }else{
    if(!['image/png','image/jpeg','image/webp'].includes(body.mimeType)||typeof body.base64!=='string'||body.base64.length>4000000||!/^[A-Za-z0-9+/]+={0,2}$/.test(body.base64))return res.status(422).json({error:'3MB 이하 PNG, JPEG, WebP만 업로드할 수 있습니다.'});
    const bytes=Buffer.from(body.base64,'base64'),metadata=imageMetadata(bytes,body.mimeType);
    if(!metadata?.width||!metadata?.height||metadata.width>8192||metadata.height>8192||metadata.width*metadata.height>32000000||metadata.mimeType!==body.mimeType)return res.status(422).json({error:'이미지 파일 형식과 크기를 확인해 주세요.'});
    image={bytes,mimeType:metadata.mimeType,width:metadata.width,height:metadata.height};
   }
   const verified=imageMetadata(image.bytes,image.mimeType);
   if(!verified?.width||!verified?.height||verified.mimeType!==image.mimeType||verified.width>8192||verified.height>8192||verified.width*verified.height>32000000)throw Object.assign(new Error('생성 이미지의 파일 형식과 크기를 확인할 수 없습니다.'),{code:'IMAGE_RESULT_INVALID',statusCode:422});
   image.width=verified.width;image.height=verified.height;
   const id=randomUUID(),viewToken=randomBytes(32).toString('base64url'),hash=createHash('sha256').update(viewToken).digest('hex');
   const extension={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[image.mimeType];
   if(!extension||image.bytes.length>20000000)throw Object.assign(new Error('지원하지 않는 이미지 결과입니다.'),{statusCode:422});
   const {put,del}=await use.blob();
   const storageKey=`page-schema/${found.document.id}/${id}.${extension}`;
   const blob=await put(storageKey,image.bytes,{access:'private',contentType:image.mimeType});
   uploaded={id,url:blob.url,del,documentId:found.document.id};
   try{await sql`insert into promo_page_schema_assets(id,document_id,owner_subject,storage_key,mime_type,view_token_hash) values(${id}::uuid,${found.document.id}::uuid,${owner.ownerSubject},${blob.pathname||storageKey},${image.mimeType},${hash})`;}
   catch(error){await del(blob.url).catch(()=>{});throw error;}
   if(req.method==='POST'){
    found=await use.fetchDocument(sql,found.document.id,owner.ownerSubject,{includeSnapshot:true});
    await use.assertRequirements(sql,found,owner);
    const latest=found?.snapshot;
    let target;walk(latest?.content?.pageSchema?.root,entry=>{if(entry.node?.id===originalNodeId)target=entry.node;});
    const currentRequest=latest?.content?.pageSchema?.mediaRequests?.find(r=>r.id===originalRequestId&&r.nodeId===originalNodeId);
    if(!latest||latest.generationMeta?.review?.state!=='approved'||inputHash(latest.generationMeta.sourceRequirements||null)!==originalRequirements||structureFingerprint(latest.content.pageSchema)!==originalStructure||!target||target.requestId!==originalRequestId||inputHash(currentRequest||null)!==originalRequest)throw Object.assign(new Error('이미지 준비 중 페이지 요청이 변경되었습니다. 최신 구성을 확인해 주세요.'),{code:'MEDIA_REQUEST_SUPERSEDED',statusCode:409,retryable:false});
    snapshot=JSON.parse(JSON.stringify(latest));page=snapshot.content.pageSchema;context=snapshot.content.pageContext;
    walk(page.root,entry=>{if(entry.node.id===originalNodeId)node=entry.node;});
   }
   const assetId=`image_${id.replaceAll('-','')}`;
   context.assets[assetId]={kind:'image',label:node.alt||originalRequestData?.intent||node.id,url:`/api/promo-page-schema-image?id=${id}&token=${viewToken}`,width:image.width,height:image.height,displayAspectRatio:page.mediaRequests.find(r=>r.id===node.requestId)?.aspectRatio};
   const oldRequest=node.requestId;
   snapshot.generationMeta={...snapshot.generationMeta,mediaBindings:{...snapshot.generationMeta?.mediaBindings,[node.id]:{requestId:oldRequest,assetId,request:originalRequestData,execution:imageExecution?{...imageExecution,providerResult:image.provider,usage:image.usage}:undefined,contentKey:originalRequestData?reusableMediaKey(originalRequestData,context):null}}};
   node.assetId=assetId;node.requestId=null;page.mediaRequests=page.mediaRequests.filter(r=>r.id!==oldRequest);
  }
  assertValid(page,context);
  const saved=await use.createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:req.method==='POST'?found.document.currentDocumentRevision:base,snapshot,generationJob:job,requirementsGuard:require('./_promo-builder-flags').builderFlags().chatWorkspaceV1?snapshot.generationMeta?.sourceRequirements?.revision||null:null,source:'manual',changeNote:'PageSchema media/action binding'});
  committed=true;
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot});
 }catch(error){
  if(error.code==='GENERATION_IN_PROGRESS'){const current=await use.fetchDocument(sql,String(body.documentId),owner.ownerSubject,{includeSnapshot:true});return res.status(202).json({ok:true,pending:true,retryAfterMs:1500,revision:current.document.currentDocumentRevision,snapshot:current.snapshot});}
  if(job?.claimToken)await use.failGeneration(sql,job,error.code).catch(()=>{});
  if(/revision conflict/i.test(error.message)){error.statusCode=409;error.code='DOCUMENT_REVISION_MISMATCH';}
  throw error;
 }finally{
  if(uploaded&&!committed){
   await uploaded.del(uploaded.url).catch(()=>{});
   await sql`delete from promo_page_schema_assets where id=${uploaded.id}::uuid and document_id=${uploaded.documentId}::uuid and owner_subject=${owner.ownerSubject}`.catch(()=>{});
  }
 }
}
module.exports={processPageMedia};
