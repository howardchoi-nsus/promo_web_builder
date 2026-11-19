const Ajv=require('ajv/dist/2020').default;
const {assertValid,nodeTargets}=require('../shared/page-schema/contract.cjs');
const {treeNodes}=require('../shared/page-schema/section-design.cjs');
const {pageGenerationStyleRoles,pageStyleToken,pageNodeStyleRules,pageStyleRoles}=require('../shared/token-usage-policy.cjs');
const {assertLayoutTokens}=require('../shared/layout-token-policy.cjs');
const {structureFingerprint}=require('./_page-schema-service');
function sectionDesignSchema(group,context){
 const roles=pageGenerationStyleRoles(context).filter(role=>context.tokenValues[pageStyleToken(context,role)]).map(role=>role.key),spacing=assertLayoutTokens(context).spacing;
 const nullable=value=>({anyOf:[value,{type:'null'}]});
 const properties={nodeId:{type:'string',enum:group.nodeIds},viewport:{type:'string',enum:['desktop','tablet','mobile']},kind:{type:'string',enum:['styles','spacing','overlay']},roles:nullable({type:'array',items:{type:'string',enum:roles.length?roles:['__unavailable__']},maxItems:20}),spacing:nullable({type:'object',additionalProperties:false,properties:Object.fromEntries(['gap','padding','margin'].map(key=>[key,nullable({type:'string',enum:spacing.length?spacing:['__unavailable__']})])),required:['gap','padding','margin']}),overlayRole:nullable({type:'string',enum:roles.length?roles:['__unavailable__']}),reason:{type:'string',minLength:1,maxLength:500}};
 return {type:'object',additionalProperties:false,properties:{summary:{type:'string',minLength:1,maxLength:1000},patches:{type:'array',maxItems:96,items:{type:'object',additionalProperties:false,properties,required:Object.keys(properties)}}},required:['summary','patches']};
}
function applySectionDesign(page,context,group,result){
 const validate=new Ajv({strict:false,allErrors:true}).compile(sectionDesignSchema(group,context));
 const invalid=()=>Object.assign(new Error('영역 디자인 결과가 허용된 스타일 계약과 맞지 않습니다.'),{code:'SECTION_DESIGN_RESULT_INVALID',statusCode:422,retryable:true,errors:validate.errors||[]});
 if(!validate(result))throw invalid();
 const candidate=JSON.parse(JSON.stringify(page)),byId=new Map(treeNodes(candidate).map(node=>[node.id,node])),seen=new Set();
 for(const patch of result.patches){const node=byId.get(patch.nodeId),key=`${patch.nodeId}:${patch.viewport}:${patch.kind}`;
  if(!node||seen.has(key))throw invalid();seen.add(key);
  const expected={styles:'roles',spacing:'spacing',overlay:'overlayRole'}[patch.kind];
  if(['roles','spacing','overlayRole'].some(field=>field!==expected&&patch[field]!==null))throw invalid();
  const view=patch.viewport==='desktop'?'base':patch.viewport;
  if(patch.kind==='styles'&&patch.roles!==null)node.styles[view]=patch.roles;
  else if(patch.kind==='spacing'&&patch.spacing!==null)node.styles.spacing[view]=patch.spacing;
  else if(patch.kind==='overlay'&&node.type==='container'&&patch.viewport==='desktop')node.overlayRole=patch.overlayRole;
  else throw invalid();
 }
 try{assertValid(candidate,context);}catch(error){if(error.code==='PAGE_SCHEMA_INVALID')throw Object.assign(invalid(),{errors:error.errors||[]});throw error;}
 const roles=pageStyleRoles(context);
 for(const id of new Set(result.patches.map(patch=>patch.nodeId))){const node=byId.get(id);for(const view of ['desktop','tablet','mobile']){
  const border=pageNodeStyleRules(node,view,context,nodeTargets(node),roles).filter(role=>['border-color','border-width','border-style'].includes(role.property));
  if(border.length&&new Set(border.map(role=>role.property)).size!==3)throw invalid();
 }}
 if(structureFingerprint(candidate)!==structureFingerprint(page))throw invalid();
 return {page:candidate,summary:result.summary,patches:result.patches};
}
module.exports={sectionDesignSchema,applySectionDesign};
