const {createHash}=require('node:crypto');
const {assertValid,normalize,runtimeSchema,TYPES,LIMITS,safeUrl}=require('../shared/page-schema/contract.cjs');
const {assertLayoutTokens}=require('../shared/layout-token-policy.cjs');
const {assertContentConfirmed,emptyOptionalCta}=require('../shared/page-schema/content-confirmation.cjs');
const {TOKEN_USAGE_RULES}=require('../shared/token-usage-policy.cjs');
function contentContext(overview,{usagePolicy,tokenCatalog,tokenValues,tokenVersionId}){
 assertLayoutTokens({usagePolicy,tokenCatalog,tokenValues});
 assertContentConfirmed(overview);
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
 return {usagePolicy,tokenCatalog,tokenValues,tokenVersionId,contentSources,actions,assets:{},formFields:{},icons:{icon_check:{glyph:'check'},icon_arrow:{glyph:'arrow'},icon_star:{glyph:'star'},icon_info:{glyph:'info'}}};
}
async function generatePage({overview,context,instruction='',currentPage=null,promptConfig,generate}){
 const response=await generate({type:'promo_page_schema_planner',schemaName:'promo_page_schema',schema:runtimeSchema(context),promptConfig});
 const raw=response.result;
 assertValid(raw,context);
 const normalized=normalize(raw);const validation=assertValid(normalized.page,context);
 return {page:normalized.page,validation,adjustments:normalized.adjustments,provider:response.provider,usage:response.usage};
}
function structureFingerprint(page){return require('./_page-schema-design').structuralHash(page);}
function snapshotForPage(page,context,previous={}){
 return {...previous,compositionMeta:undefined,generationMeta:{generationPath:'page-schema',schemaVersion:page.schemaVersion,structureFingerprint:structureFingerprint(page),tokenVersionId:context.tokenVersionId},contractVersion:3,snapshotType:'page-schema',layoutIdentity:{rendererKey:'page-schema-renderer',rendererVersion:1},
 content:{contractVersion:3,pageSchema:page,pageContext:context,runtimeTheme:{designTokenSetVersionId:context.tokenVersionId,designTokens:{policy:'registered-only',values:context.tokenValues,catalog:context.tokenCatalog,usagePolicy:context.usagePolicy}},sectionSnapshot:[],sectionOrder:[],sectionInputs:{},formTemplate:{}},
 designSpec:{contractVersion:1,theme:{},itemStyles:{},sectionStyles:{},responsiveLayouts:{}},assets:{contractVersion:1,items:{}},motionSpec:{contractVersion:2,sections:{},items:{}}};
}
function plannerContext(context){const {contentSources,assets,actions,icons,formFields}=context;return {layoutTokens:assertLayoutTokens(context),spacingTokens:assertLayoutTokens(context).spacing,primitives:TYPES,omittedContent:context.omittedContent||[],unresolvedInputs:context.unresolvedInputs||[],contentSources,assets,actions,icons,formFields,policyRoles:TOKEN_USAGE_RULES.filter(r=>context.usagePolicy.bindings[r.key]).map(r=>({...r,token:context.usagePolicy.bindings[r.key],value:context.tokenValues[context.usagePolicy.bindings[r.key]]}))};}
module.exports={structureFingerprint,plannerContext,contentContext,generatePage,snapshotForPage,TYPES,LIMITS,assertValid,normalize};
