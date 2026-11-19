const Ajv=require('ajv/dist/2020').default;
const {runtimeSchema,validate,walk,assertValid}=require('../shared/page-schema/contract.cjs');
const {designGroups}=require('../shared/page-schema/section-design.cjs');
const invalid=message=>Object.assign(new Error(message),{code:'PAGE_DRAFT_INVALID',statusCode:422});
function outlineSchema(context){return {type:'object',additionalProperties:false,properties:{page:JSON.parse(JSON.stringify(runtimeSchema(context)).replaceAll('#/$defs/','#/properties/page/$defs/')),sourceAssignments:{type:'array',maxItems:200,items:{type:'object',additionalProperties:false,properties:{nodeId:{type:'string'},sourceId:{type:'string',minLength:1,maxLength:100}},required:['nodeId','sourceId']}}},required:['page','sourceAssignments']};}
function validateDraft(page,context){const result=validate(page,context);const errors=result.errors.filter(e=>e.code!=='CONTENT_EMPTY');if(errors.length)throw Object.assign(invalid('와이어프레임 초안 검증에 실패했습니다.'),{errors});return result;}
function outlineResult(result,context){
 const shape=new Ajv({strict:false,allErrors:false}).compile(outlineSchema(context));if(!shape(result))throw Object.assign(invalid('초안 응답 형식이 올바르지 않습니다.'),{errors:shape.errors?.slice(0,40)});
 const page=structuredClone(result.page),texts=new Map();walk(page.root,({node})=>{if(node.type==='text'){if(node.text!==''||node.contentMode!=='editorial'||node.sourceIds.length)throw invalid('초안은 비어 있는 텍스트 노드와 소스 배정으로 구성해야 합니다.');texts.set(node.id,node);}});
 const seen=new Set();for(const item of result.sourceAssignments||[]){const node=texts.get(item.nodeId);if(!node||seen.has(item.nodeId)||!Object.hasOwn(context.contentSources||{},item.sourceId))throw invalid('초안 소스 배정이 올바르지 않습니다.');seen.add(item.nodeId);node.contentMode='source';node.sourceIds=[item.sourceId];}
 validateDraft(page,context);const groups=designGroups(page).map(group=>({...group,nodeIds:group.nodeIds.filter(id=>texts.get(id)?.contentMode==='editorial')})).filter(g=>g.nodeIds.length);
 return {page,groups};
}
function fragmentSchema(group){return {type:'object',additionalProperties:false,properties:{texts:{type:'array',minItems:group.nodeIds.length,maxItems:group.nodeIds.length,items:{type:'object',additionalProperties:false,properties:{nodeId:{type:'string',enum:group.nodeIds},text:{type:'string',minLength:1,maxLength:2000}},required:['nodeId','text']}}},required:['texts']};}
function applyFragment(page,context,group,result){
 const shape=new Ajv({strict:false,allErrors:false}).compile(fragmentSchema(group));if(!shape(result))throw invalid('초안 텍스트 응답 형식이 올바르지 않습니다.');
 const copy=structuredClone(page),byId=new Map();walk(copy.root,({node})=>byId.set(node.id,node));const seen=new Set();
 for(const item of result.texts||[]){if(!group.nodeIds.includes(item.nodeId)||seen.has(item.nodeId)||typeof item.text!=='string'||!item.text.trim()||item.text.length>2000)throw invalid('초안 텍스트 범위가 올바르지 않습니다.');seen.add(item.nodeId);byId.get(item.nodeId).text=item.text;}
 if(seen.size!==group.nodeIds.length)throw invalid('생성할 텍스트가 누락되었습니다.');validateDraft(copy,context);return copy;
}
module.exports={outlineSchema,outlineResult,fragmentSchema,applyFragment,validateDraft};
