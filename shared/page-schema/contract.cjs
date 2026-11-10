const Ajv = require('ajv/dist/2020').default;
const baseSchema = require('./page-schema.schema.json');
const {TOKEN_USAGE_RULES,validateTokenUsagePolicy} = require('../token-usage-policy.cjs');
const LIMITS=Object.freeze({nodes:200,depth:8,bytes:262144,mediaRequests:8,text:60000});
const TYPES=Object.freeze(['container','grid','stack','text','image','button','card','input','divider','icon','video']);
const clone=value=>JSON.parse(JSON.stringify(value));
const ajv=new Ajv({allErrors:true,strict:false,ownProperties:true,discriminator:true});
// Dispatch by type locally to avoid repeatedly traversing every container union.
const localSchema=clone(baseSchema);
localSchema.$defs.node.oneOf=localSchema.$defs.node.anyOf;
delete localSchema.$defs.node.anyOf;
localSchema.$defs.node.discriminator={propertyName:'type'};
const validateShape=ajv.compile(localSchema);
function error(code,path,message,nodeId){return {code,path,message,...(nodeId?{nodeId}:{})};}
function safeUrl(value,{external=true}={}){
 const url=String(value||'');
 if(!url||/[\s\\\u0000-\u001f\u007f]/u.test(url)||url.startsWith('//'))return '';
 if(/^(?:\/(?!\/)|#)/u.test(url))return url;
 if(!external)return '';
 try{const parsed=new URL(url);if(parsed.protocol!=='https:'||parsed.username||parsed.password)return '';const host=parsed.hostname.toLowerCase();if(host==='localhost'||host.endsWith('.local')||/^(?:127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host)||host.includes(':'))return '';return url;}catch{return '';}
}
function walk(root,visitor){const pending=[{node:root,parent:null,depth:1,path:'root'}];while(pending.length){const entry=pending.pop();visitor(entry);for(let index=(entry.node?.children?.length||0)-1;index>=0;index--)pending.push({node:entry.node.children[index],parent:entry.node,depth:entry.depth+1,path:`${entry.path}.children[${index}]`});}}
function nodeTargets(node){if(node.type==='container')return node.role==='group'?['layout']:['page','layout'];return {grid:['layout'],stack:['layout'],card:['card','layout'],text:['text'],button:['button','layout'],input:['input','layout'],image:['image','layout'],divider:['divider','layout'],icon:['icon','layout'],video:['video','layout']}[node.type]||[];}
function runtimeSchema(context={}){
 const schema=clone(baseSchema);delete schema.$schema;delete schema.$id;
 const approvedRoles=TOKEN_USAGE_RULES.filter(rule=>context.usagePolicy?.bindings?.[rule.key]&&context.tokenValues?.[context.usagePolicy.bindings[rule.key]]).map(rule=>rule.key);
 for(const [name,keys] of Object.entries({policyRole:approvedRoles,sourceId:Object.keys(context.contentSources||{}),assetId:Object.keys(context.assets||{}),actionId:Object.keys(context.actions||{}),formFieldId:Object.keys(context.formFields||{}),iconId:Object.keys(context.icons||{})}))schema.$defs[name]={type:'string',enum:keys.length?keys:['__unavailable__']};
 return schema;
}
function normalize(page){
 const result=clone(page),adjustments=[];
 walk(result.root,({node,path})=>{
  const desktop=node.layout.desktop;
  const override=(value)=>Object.fromEntries(Object.entries({...desktop,...Object.fromEntries(Object.entries(value||{}).filter(([,v])=>v!==null))}));
  const tablet=override(node.layout.tablet),mobile=override(node.layout.mobile);
  if(!node.layout.tablet){if(node.type==='grid'&&tablet.columns.length>2)tablet.columns=[1,1];adjustments.push({nodeId:node.id,path:`${path}.layout.tablet`,code:'TABLET_LAYOUT_DEFAULTED'});}
  if(!node.layout.mobile){if(node.type==='grid')mobile.columns=[1];if(node.type==='stack')mobile.direction='column';mobile.columnSpan=1;adjustments.push({nodeId:node.id,path:`${path}.layout.mobile`,code:'MOBILE_LAYOUT_DEFAULTED'});}
  node.layout.tablet=tablet;node.layout.mobile=mobile;
 });
 // Child spans are relative to the parent, never to a global fixed template.
 walk(result.root,({node,parent})=>{if(parent?.type==='grid')for(const view of ['desktop','tablet','mobile']){const columns=parent.layout[view]?.columns||parent.layout.desktop.columns;const layout=node.layout[view];if(layout.columnSpan>columns.length){if(view==='desktop')continue;adjustments.push({nodeId:node.id,code:'RESPONSIVE_SPAN_DEFAULTED',path:`${node.id}.layout.${view}.columnSpan`});layout.columnSpan=Math.max(1,columns.length);}}});
 return {page:result,adjustments};
}
function validate(page,context={},options={}){
 const errors=[],warnings=[];
 let encoded;try{encoded=JSON.stringify(page);}catch{return {ok:false,errors:[error('PAGE_SCHEMA_INVALID','','PageSchema must be JSON')],warnings};}
 if(!encoded||Buffer.byteLength(encoded)>LIMITS.bytes)return {ok:false,errors:[error('PAGE_SCHEMA_LIMIT_EXCEEDED','','PageSchema payload exceeds the limit')],warnings};
 // Enforce traversal budgets before recursive schema validation.
 let count=0,totalText=0,tooDeep=false;
 const pending=[{node:page?.root,depth:1}];const visited=new Set();
 while(pending.length){const {node,depth}=pending.pop();if(!node||typeof node!=='object')continue;if(visited.has(node)){tooDeep=true;break;}visited.add(node);if(++count>LIMITS.nodes||depth>LIMITS.depth){tooDeep=true;break;}if(Array.isArray(node.children))for(const child of node.children)pending.push({node:child,depth:depth+1});}
 if(tooDeep)return {ok:false,errors:[error('PAGE_SCHEMA_LIMIT_EXCEEDED','root','Maximum node count or depth exceeded')],warnings};
 if(!validateShape(page))return {ok:false,errors:validateShape.errors.slice(0,40).map(e=>error('PAGE_SCHEMA_INVALID',e.instancePath,e.message)),warnings};
 const tokenValidation=validateTokenUsagePolicy(context.usagePolicy,context.tokenCatalog||[],{activation:true});
 if(!tokenValidation.ok)errors.push(...tokenValidation.errors.map(e=>error(e.code,e.key,e.message)));
 const seen=new Set(),usedSources=new Map(),headings=[],requests=new Map(),imageRequests=new Map(),parentById=new Map();
 for(const [key,value] of Object.entries(context.tokenValues||{}))if(!/^--[a-zA-Z][a-zA-Z0-9-]*$/.test(key)||typeof value!=="string"||/[;{}<>]|url\s*\(|expression\s*\(|@import/i.test(value))errors.push(error("TOKEN_VALUE_INVALID",key,"Unsafe registered token value"));
 for(const request of page.mediaRequests){if(requests.has(request.id))errors.push(error('DUPLICATE_MEDIA_REQUEST',request.id,'Duplicate media request'));requests.set(request.id,request);}
 if(page.root.role!=='page')errors.push(error('ROOT_PAGE_REQUIRED','root.role','Root container must have page role'));
 walk(page.root,({node,parent,depth,path})=>{
  const add=(code,message)=>errors.push(error(code,path,message,node.id));
  parentById.set(node.id,parent);
  if(seen.has(node.id))add('DUPLICATE_NODE_ID','Node IDs must be unique');seen.add(node.id);
  if(depth>1&&node.type==='container'&&node.role==='page')add('NESTED_MAIN_NOT_ALLOWED','Only one page/main is allowed');
  for(const source of node.sourceIds)if(!Object.hasOwn(context.contentSources||{},source))add('CONTENT_SOURCE_INVALID',`Unknown source: ${source}`);
  const rootRole=node.type==='container'?node.role:node.type;
  if(['navigation','form'].includes(rootRole)&&!node.label.trim())add('ACCESSIBILITY_INVALID','Navigation and form labels are required');
  for(const view of ['desktop','tablet','mobile']){
   const layout=node.layout[view];if(layout&&node.type==='grid'&&!layout.columns?.length&&view==='desktop')add('GRID_COLUMNS_REQUIRED','Grid must declare desktop column ratios');
   if(layout&&parent?.type==='grid'&&view==='desktop'&&layout.columnSpan>parent.layout.desktop.columns.length)add('GRID_SPAN_INVALID','Span exceeds parent columns');
   const properties=new Set();for(const roleKey of node.styles[view==='desktop'?'base':view]||[]){
    const rule=TOKEN_USAGE_RULES.find(rule=>rule.key===roleKey);const token=context.usagePolicy?.bindings?.[roleKey];
    if(!rule||!token||!Object.hasOwn(context.tokenValues||{},token)||!nodeTargets(node).includes(rule.target)){add('TOKEN_USAGE_POLICY_MISMATCH',`Policy role cannot target this node: ${roleKey}`);continue;}
    const propertyKey=`${rule.property}:${rule.state}`;if(properties.has(propertyKey))add('DUPLICATE_STYLE_ROLE',`Duplicate property/state: ${propertyKey}`);properties.add(propertyKey);
   }
  }
  if(node.type==='text'){
   if(node.role==='heading'){if(node.headingLevel<1)add('ACCESSIBILITY_INVALID','Heading level is required');headings.push(node.headingLevel);}else if(node.headingLevel!==0)add('ACCESSIBILITY_INVALID','Non-heading text level must be zero');
   if(node.contentMode==='source'){if(node.sourceIds.length!==1||node.text!=='')add('CONTENT_SOURCE_INVALID','Source text must use exactly one source ID and empty text');else usedSources.set(node.sourceIds[0],(usedSources.get(node.sourceIds[0])||0)+1);}
   else {if(!node.text.trim())add('CONTENT_EMPTY','Editorial text must not be empty');if(/\d|[%$€₩]|https?:\/\//u.test(node.text))add('UNSUPPORTED_FACT','Numbers, amounts and URLs must use approved source content');}
   totalText+=node.contentMode==='source'?String(context.contentSources?.[node.sourceIds[0]]?.text||'').length:node.text.length;
  }
  if(node.type==='button'){
   if(/\d|[%$€₩]|https?:\/\//u.test(node.label)&&!Object.values(context.contentSources||{}).some(source=>source.text===node.label)&&!Object.values(context.actions||{}).some(action=>action.label===node.label))add('UNSUPPORTED_FACT','Factual CTA labels must use approved content');
   for(const id of node.sourceIds)if(context.contentSources?.[id]?.text===node.label)usedSources.set(id,(usedSources.get(id)||0)+1);
   if(node.actionId===null){warnings.push(error('ACTION_BINDING_REQUIRED',path,'CTA has no approved action',node.id));if(options.final)add('ACTION_BINDING_REQUIRED','Resolve CTA action before export');}
   else if(!context.actions?.[node.actionId]||!safeUrl(context.actions[node.actionId].href,{external:context.actions[node.actionId].kind==='navigate'}))add('ACTION_REFERENCE_INVALID','Unapproved action');
   const action=context.actions?.[node.actionId];
   if(action&& !['navigate','submit'].includes(action.kind))add('ACTION_REFERENCE_INVALID','Unsupported action kind');
   if(action?.kind==='submit'){let ancestor=parent;while(ancestor&&!(ancestor.type==='container'&&ancestor.role==='form'))ancestor=parentById.get(ancestor.id);if(ancestor?.formActionId!==node.actionId)add('FORM_BINDING_REQUIRED','Submit button must belong to its registered form');}
   if(['button','input'].includes(parent?.type))add('INTERACTIVE_NESTING_INVALID','Interactive controls cannot be nested');
  }
  if(node.type==='image'){
   if((node.assetId===null)===(node.requestId===null))add('ASSET_REFERENCE_INVALID','Image needs an asset OR a generation request');
   if(node.decorative?node.alt!=='':!node.alt.trim())add('ACCESSIBILITY_INVALID','Image alt does not match decorative status');
   if(node.assetId!==null&&(!context.assets?.[node.assetId]||context.assets[node.assetId].kind!=='image'||!safeUrl(context.assets[node.assetId].url)))add('ASSET_REFERENCE_INVALID','Unknown image asset');
   if(node.requestId!==null){imageRequests.set(node.requestId,(imageRequests.get(node.requestId)||0)+1);const request=requests.get(node.requestId);if(!request||request.nodeId!==node.id)add('ASSET_REFERENCE_INVALID','Image request target mismatch');warnings.push(error('IMAGE_GENERATION_PENDING',path,'Image generation is pending',node.id));if(options.final)add('IMAGE_GENERATION_PENDING','Resolve images before export');}
  }
  if(node.type==='icon'&&(!Object.hasOwn(context.icons||{},node.iconId)||(!node.decorative&&!node.label.trim())))add('ACCESSIBILITY_INVALID','Icon must be approved and labelled or decorative');
  if(node.type==='input'){
   if(!node.fieldId){warnings.push(error('FORM_BINDING_REQUIRED',path,'Input is preview-only',node.id));if(options.final)add('FORM_BINDING_REQUIRED','Register form fields before export');}
   else if(!context.formFields?.[node.fieldId]||context.formFields[node.fieldId].inputType!==node.inputType)add('FORM_FIELD_INVALID','Unapproved form field/type');
   if(options.final){let ancestor=parent;while(ancestor&&!(ancestor.type==='container'&&ancestor.role==='form'))ancestor=parentById.get(ancestor.id);if(!ancestor?.formActionId)add('FORM_BINDING_REQUIRED','Input needs a registered form submission');}
  }
  if(node.type==='container'&&node.role==='form'){let ancestor=parent;while(ancestor){if(ancestor.type==='container'&&ancestor.role==='form'){add('INTERACTIVE_NESTING_INVALID','Forms cannot be nested');break;}ancestor=parentById.get(ancestor.id);}}
  if(node.type==='container'&&node.formActionId!==null){const action=context.actions?.[node.formActionId];if(node.role!=='form'||action?.kind!=='submit'||!safeUrl(action.href,{external:false}))add('ACTION_REFERENCE_INVALID','Unapproved form submission');}
  if(node.type==='video'){
   const asset=context.assets?.[node.assetId];if(!asset){warnings.push(error('VIDEO_ASSET_REQUIRED',path,'Video asset is pending',node.id));if(options.final)add('VIDEO_ASSET_REQUIRED','Video is required before export');}
   else if(asset.kind!=='video'||!safeUrl(asset.url))add('ASSET_REFERENCE_INVALID','Unapproved video');
   for(const [id,kind] of [[node.posterAssetId,'image'],[node.captionAssetId,'caption']])if(id!==null&&(!context.assets?.[id]||context.assets[id].kind!==kind||!safeUrl(context.assets[id].url)))add('ASSET_REFERENCE_INVALID','Unapproved poster or caption');
   if(asset?.hasAudio&&!node.captionAssetId)add('ACCESSIBILITY_INVALID','Spoken video requires captions');
  }
 });
 if(headings.filter(level=>level===1).length!==1||headings[0]!==1)errors.push(error('ACCESSIBILITY_INVALID','root','Exactly one first h1 is required'));
 for(let i=1;i<headings.length;i++)if(headings[i]>headings[i-1]+1)errors.push(error('ACCESSIBILITY_INVALID','root','Heading hierarchy skips a level'));
 for(const [id,source] of Object.entries(context.contentSources||{})){if(source.required&&!usedSources.has(id))errors.push(error('CONTENT_SOURCE_REQUIRED',id,'Required content was omitted'));if(source.repeatAllowed===false&&(usedSources.get(id)||0)>1)errors.push(error('CONTENT_SOURCE_DUPLICATED',id,'Required content was duplicated'));}
 for(const request of page.mediaRequests)if(!seen.has(request.nodeId)||imageRequests.get(request.id)!==1)errors.push(error('MEDIA_TARGET_INVALID',request.nodeId,'Media request needs exactly one matching image'));
 if(totalText>LIMITS.text)errors.push(error('PAGE_SCHEMA_LIMIT_EXCEEDED','root','Total content exceeds the text limit'));
 return {ok:!errors.length,errors:errors.slice(0,100),warnings,metrics:{nodes:count,textLength:totalText}};
}
function assertValid(page,context,options){const result=validate(page,context,options);if(!result.ok)throw Object.assign(new Error('PageSchema 검증에 실패했습니다.'),{code:'PAGE_SCHEMA_INVALID',statusCode:422,errors:result.errors});return result;}
module.exports={LIMITS,TYPES,baseSchema,runtimeSchema,validate,assertValid,normalize,walk,safeUrl,nodeTargets};
