const {randomUUID,randomBytes,createHash}=require('node:crypto');
const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {requireBuilderFlag}=require('./_promo-builder-flags');
const {getSql,fetchDocument,createDocumentRevision}=require('./_promo-builder-document-store');
const {createPromptExecutionSnapshot}=require('./_prompt-execution-snapshot');
const {generateSectionImage}=require('./_promo-section-design-provider');
const {imageMetadata}=require('./_section-ai-control-plane');
const {walk,safeUrl,assertValid}=require('../shared/page-schema/contract.cjs');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{
  requireBuilderFlag('pageSchemaV1');
  if(!['POST','PUT','PATCH'].includes(req.method)){res.setHeader('Allow','POST, PUT, PATCH');return res.status(405).json({error:'Method not allowed'});}
  const owner=resolveBuilderOwner(req,res),sql=getSql(),body=parseBody(req.body);
  const found=await fetchDocument(sql,String(body.documentId||''),owner.ownerSubject,{includeSnapshot:true});
  if(!found?.snapshot?.content?.pageSchema)return res.status(404).json({error:'PageSchema document not found'});
  const base=Number(body.baseDocumentRevision);
  if(base!==found.document.currentDocumentRevision)return res.status(409).json({code:'DOCUMENT_REVISION_MISMATCH',error:'문서가 변경되었습니다. 다시 불러와 주세요.'});
  const snapshot=JSON.parse(JSON.stringify(found.snapshot)),page=snapshot.content.pageSchema,context=snapshot.content.pageContext;
  let node;walk(page.root,entry=>{if(entry.node.id===body.nodeId)node=entry.node;});
  if(!node)return res.status(404).json({error:'Node not found'});
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
   let image;
   if(req.method==='POST'){
    const request=page.mediaRequests.find(r=>r.id===node.requestId&&r.nodeId===node.id);
    if(!request)return res.status(409).json({error:'Pending image request required'});
    const pinned=await createPromptExecutionSnapshot(sql,'component_image',{sectionName:page.summary,componentName:'PageSchema image',fieldName:node.id,contentJson:JSON.stringify({intent:request.intent,sourceIds:request.sourceIds,contentSources:context.contentSources}),adminGuidance:''});
    const cfg=pinned.promptConfig;
    image=await generateSectionImage({prompt:cfg.renderedPrompt,targetType:'item',aspectRatio:request.aspectRatio,effectiveAspectRatio:request.aspectRatio,provider:cfg.provider,model:cfg.model,modelOptions:cfg.modelOptions,promptConfig:cfg});
   }else{
    if(!['image/png','image/jpeg','image/webp'].includes(body.mimeType)||typeof body.base64!=='string'||body.base64.length>4000000||!/^[A-Za-z0-9+/]+={0,2}$/.test(body.base64))return res.status(422).json({error:'3MB 이하 PNG, JPEG, WebP만 업로드할 수 있습니다.'});
    const bytes=Buffer.from(body.base64,'base64'),metadata=imageMetadata(bytes,body.mimeType);
    if(!metadata?.width||!metadata?.height||metadata.width>8192||metadata.height>8192||metadata.width*metadata.height>32000000||metadata.mimeType!==body.mimeType)return res.status(422).json({error:'이미지 파일 형식과 크기를 확인해 주세요.'});
    image={bytes,mimeType:metadata.mimeType,width:metadata.width,height:metadata.height};
   }
   const id=randomUUID(),viewToken=randomBytes(32).toString('base64url'),hash=createHash('sha256').update(viewToken).digest('hex');
   const extension={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[image.mimeType];
   if(!extension||image.bytes.length>20000000)throw Object.assign(new Error('지원하지 않는 이미지 결과입니다.'),{statusCode:422});
   const {put,del}=await import('@vercel/blob');
   const storageKey=`page-schema/${found.document.id}/${id}.${extension}`;
   const blob=await put(storageKey,image.bytes,{access:'private',contentType:image.mimeType});
   try{await sql`insert into promo_page_schema_assets(id,document_id,owner_subject,storage_key,mime_type,view_token_hash) values(${id}::uuid,${found.document.id}::uuid,${owner.ownerSubject},${blob.pathname||storageKey},${image.mimeType},${hash})`;}
   catch(error){await del(blob.url).catch(()=>{});throw error;}
   const assetId=`image_${id.replaceAll('-','')}`;
   context.assets[assetId]={kind:'image',url:`/api/promo-page-schema-image?id=${id}&token=${viewToken}`,width:image.width,height:image.height};
   const oldRequest=node.requestId;node.assetId=assetId;node.requestId=null;page.mediaRequests=page.mediaRequests.filter(r=>r.id!==oldRequest);
  }
  assertValid(page,context);
  const saved=await createDocumentRevision(sql,{documentId:found.document.id,ownerSubject:owner.ownerSubject,baseDocumentRevision:base,snapshot,source:'manual',changeNote:'PageSchema media/action binding'});
  return res.status(200).json({ok:true,revision:saved.revision,snapshot:saved.snapshot});
 }catch(error){if(/revision conflict/i.test(error.message)){error.statusCode=409;error.code='DOCUMENT_REVISION_MISMATCH';}return res.status(error.statusCode||500).json({error:error.message,code:error.code||'PAGE_SCHEMA_MEDIA_FAILED',errors:error.errors||[]});}
};
