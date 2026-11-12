const {createHash}=require('node:crypto');
const {assertValid,normalize,runtimeSchema,TYPES,LIMITS,safeUrl}=require('../shared/page-schema/contract.cjs');
const {assertLayoutTokens,previewReference}=require('../shared/layout-token-policy.cjs');
const {emptyOptionalCta,prepareOverviewForPreview}=require('../shared/page-schema/content-confirmation.cjs');
const {TOKEN_USAGE_RULES,pageStyleRoles,pageGenerationStyleRoles,pageStyleWarnings,pageStyleToken}=require('../shared/token-usage-policy.cjs');
function contentContext(overview,{usagePolicy,tokenCatalog,tokenValues,tokenVersionId,styleChoicesVersion,assets={},icons}){
 assertLayoutTokens({usagePolicy,tokenCatalog,tokenValues});
 overview=prepareOverviewForPreview(overview).overview;
 const contentSources={},actions={},sourceByText=new Map();
 const add=(path,value,required=true)=>{
  if(typeof value!=='string'||!value.trim())return;
  const existing=sourceByText.get(value);
  if(existing){const source=contentSources[existing];source.required=source.required||required;source.paths.push(path);return existing;}
  const id=`source_${createHash('sha256').update(path).digest('hex').slice(0,20)}`;
  contentSources[id]={text:value,required,locked:true,repeatAllowed:true,path,paths:[path]};sourceByText.set(value,id);return id;
 };
 for(const key of ['title','leadText','mainOffer'])add(key,overview[key]);
 const cta=(path,label,url)=>{add(path,label,false);if(label&&safeUrl(url))actions[`action_${createHash('sha256').update(path).digest('hex').slice(0,20)}`]={kind:'navigate',href:safeUrl(url),label};};
 cta('ctaLabel',overview.ctaLabel,overview.ctaUrl);
 const fields=new Set(['title','description','body','text','eyebrow','badge','value','label','question','answer']);
 function visit(value,path,required=true){if(typeof value==='string'){add(path,value,required);return;}if(!value||typeof value!=='object')return;if(Array.isArray(value)){value.forEach((v,i)=>visit(v,`${path}.${i}`,required));return;}
  if(emptyOptionalCta(value,path))return;
  if(value.required===false||/\.cta$/.test(path))required=false;
  for(const [key,v] of Object.entries(value)){if(fields.has(key)&&typeof v==='string')add(`${path}.${key}`,v,required);else if(v&&typeof v==='object')visit(v,`${path}.${key}`,required);}
  if(value.cta?.label)cta(`${path}.cta.label`,value.cta.label,value.cta.url);
  if(value.ctaLabel)cta(`${path}.ctaLabel`,value.ctaLabel,value.ctaUrl);
 }
 for(const key of ['contentSections','additionalInformation','notices','legalInformation'])visit(overview[key],key,true);
 const required=Object.values(contentSources).filter(source=>source.required);
 if(required.length>=LIMITS.nodes||Object.values(contentSources).reduce((sum,source)=>sum+source.text.length,0)>LIMITS.text)throw Object.assign(new Error('콘텐츠가 페이지 예산을 초과합니다. 요청을 나누거나 필수 콘텐츠를 줄여 주세요.'),{code:'PAGE_SCHEMA_LIMIT_EXCEEDED',statusCode:422});
 return {usagePolicy,tokenCatalog,tokenValues,tokenVersionId,styleChoicesVersion,contentSources,actions,assets,formFields:{},icons:icons||{icon_check:{glyph:'check'},icon_arrow:{glyph:'arrow'},icon_star:{glyph:'star'},icon_info:{glyph:'info'}}};
}
async function generatePage({overview,context,instruction='',currentPage=null,promptConfig,generate}){
 const response=await generate({type:'promo_page_schema_planner',schemaName:'promo_page_schema',schema:runtimeSchema(context),promptConfig});
 const raw=response.result;
 assertValid(raw,context);
 const normalized=normalize(raw);const validation=assertValid(normalized.page,context);
 return {page:normalized.page,validation,adjustments:normalized.adjustments,provider:response.provider,usage:response.usage};
}
function reusableMediaKey(request,context){
 if(!request)return '';
 const sourceText=(request.sourceIds||[]).map(id=>context.contentSources?.[id]?.text||'');
 return require('./_page-schema-generation-jobs').inputHash({intent:request.intent,aspectRatio:request.aspectRatio,sourceText});
}
function reusePreparedMedia(page,context,previous){
 if(!previous?.content?.pageSchema)return page;
 const bindings=previous.generationMeta?.mediaBindings||{};
 for(const request of [...page.mediaRequests]){
  if(request.regenerate===true)continue;
  const binding=bindings[request.nodeId];
  if(!binding?.request||binding.contentKey!==reusableMediaKey(request,context)||!context.assets?.[binding.assetId])continue;
  require('../shared/page-schema/contract.cjs').walk(page.root,({node})=>{if(node.id===request.nodeId&&node.type==='image'&&node.requestId===request.id){node.assetId=binding.assetId;node.requestId=null;page.mediaRequests=page.mediaRequests.filter(r=>r.id!==request.id);}});
 }
 return page;
}
function structureFingerprint(page){return require('./_page-schema-design').structuralHash(page);}
function snapshotForPage(page,context,previous={}){
 const mediaBindings={};
 require('../shared/page-schema/contract.cjs').walk(page.root,({node})=>{const previousBinding=previous.generationMeta?.mediaBindings?.[node.id];if(node.type==='image'&&node.assetId&&previousBinding?.assetId===node.assetId)mediaBindings[node.id]=previousBinding;});
 return {...previous,compositionMeta:undefined,generationMeta:{generationPath:'page-schema',mediaBindings,schemaVersion:page.schemaVersion,structureFingerprint:structureFingerprint(page),structureFingerprintVersion:2,tokenVersionId:context.tokenVersionId},contractVersion:3,snapshotType:'page-schema',layoutIdentity:{rendererKey:'page-schema-renderer',rendererVersion:context.styleChoicesVersion===1?2:1},
 content:{contractVersion:3,pageSchema:page,pageContext:context,runtimeTheme:{designTokenSetVersionId:context.tokenVersionId,designTokens:{policy:'registered-only',values:context.tokenValues,catalog:context.tokenCatalog,usagePolicy:context.usagePolicy}},sectionSnapshot:[],sectionOrder:[],sectionInputs:{},formTemplate:{}},
 designSpec:{contractVersion:1,theme:{},itemStyles:{},sectionStyles:{},responsiveLayouts:{}},assets:{contractVersion:1,items:{}},motionSpec:{contractVersion:2,sections:{},items:{}}};
}
function plannerContext(context){const {contentSources,actions,formFields}=context;
 const assets=Object.fromEntries(Object.entries(context.assets||{}).map(([id,asset])=>[id,{kind:asset.kind,label:asset.label||asset.intent||id,width:asset.width,height:asset.height,componentId:asset.componentId,versionId:asset.versionId}]));
 const icons=Object.fromEntries(Object.entries(context.icons||{}).map(([id,icon])=>[id,{label:icon.label||id,glyph:icon.glyph,text:icon.text}]));
 const layoutPolicy=assertLayoutTokens(context);
 const layoutGeometry=Object.fromEntries(['desktop','tablet','mobile'].map(view=>{
  const reference=previewReference(context,view),profile=layoutPolicy.profiles[view];
  const margin=parseFloat(context.tokenValues[profile.margin]),gutter=parseFloat(context.tokenValues[profile.gutter]),columns=Number(context.tokenValues[profile.columns]);
  const contentWidth=reference?reference.width-2*margin:null;
  return [view,{referenceWidthToken:reference?.key||null,referenceWidth:reference?.width||null,marginToken:profile.margin,margin,gutter,columns,contentWidth,columnWidth:contentWidth===null?null:(contentWidth-(columns-1)*gutter)/columns}];
 }));
 return {layoutGeometry,layoutTokens:layoutPolicy,spacingTokens:layoutPolicy.spacing,primitives:runtimeSchema(context).$defs.node.anyOf.map(option=>option.$ref.split('/').at(-1)),omittedContent:context.omittedContent||[],unresolvedInputs:context.unresolvedInputs||[],contentSources,assets,actions,icons,formFields,styleWarnings:pageStyleWarnings(context),policyRoles:pageGenerationStyleRoles(context).filter(r=>pageStyleToken(context,r)).map(r=>({...r,token:pageStyleToken(context,r),value:context.tokenValues[pageStyleToken(context,r)]}))};}
module.exports={reusePreparedMedia,reusableMediaKey,structureFingerprint,plannerContext,contentContext,generatePage,snapshotForPage,TYPES,LIMITS,assertValid,normalize};
