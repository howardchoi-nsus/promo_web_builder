// Keep the registered V2 region prompt's node/sourceAssignments/mediaRequests
// response contract. Only image edits can pass this repair's merge validation.
const {isDeepStrictEqual}=require('node:util');
const {walk}=require('../shared/page-schema/contract.cjs');
const {hydrateRegion,compactRegion}=require('./_page-draft-compact');
const {unitImageRequirements,missingImageRequirements}=require('./_page-image-requirements');
const fail=message=>Object.assign(new Error(message),{code:'PAGE_IMAGE_PLAN_INCOMPLETE',statusCode:422,retryable:false});
function repairContract(state,result){
 const region=state.plan.regions[state.cursor],local=hydrateRegion(result);
 const requirements=unitImageRequirements(state.context.imageRequirements||[],state.plan,state.cursor),missing=missingImageRequirements({root:local.node,mediaRequests:local.mediaRequests},state.context,requirements);
 if(!missing.length)throw fail('이미지 보정 대상이 없습니다.');
 return {local,requirements,missing,schema:require('./_page-draft-units').regionSchema(state.context,region,{parallel:state.parallelV1===true})};
}
function withoutImages(node){const next=structuredClone(node);if(next.children)next.children=next.children.filter(n=>n.type!=='image').map(withoutImages);return next;}
function applyImageRepair(state,result,repaired){
 const schema=repairContract(state,result).schema,check=new(require('ajv/dist/2020').default)({strict:false,allErrors:false}).compile(schema);if(!check(repaired))throw fail('이미지 보정 응답이 기존 영역 계약에 맞지 않습니다.');
 const before=hydrateRegion(result),after=hydrateRegion(repaired);
 const assignments=value=>[...value].sort((a,b)=>a.nodeId.localeCompare(b.nodeId)||a.sourceId.localeCompare(b.sourceId));
 if(!isDeepStrictEqual(assignments(result.sourceAssignments),assignments(repaired.sourceAssignments))||!isDeepStrictEqual(withoutImages(before.node),withoutImages(after.node)))throw fail('이미지 보정은 기존 문구·소스 배정·비이미지 구조/스타일을 변경할 수 없습니다.');
 const nodes=new Map();walk(after.node,({node})=>nodes.set(node.id,node));
 walk(before.node,({node})=>{
  if(node.type!=='image')return;
  const request=before.mediaRequests.find(r=>r.id===node.requestId&&r.nodeId===node.id);
  if(node.assetId||request){if(!isDeepStrictEqual(node,nodes.get(node.id))||(request&&!isDeepStrictEqual(request,after.mediaRequests.find(r=>r.id===request.id))))throw fail('연결된 이미지와 완료 에셋·기존 생성 요청은 보존해야 합니다.');}
 });
 // Full source, token, ID/URL, geometry, accessibility, image coverage and budget
 // validation is mandatory before this result can be persisted or rendered.
 require('./_page-draft-units').applyRegion(state,repaired);return repaired;
}
async function repairRegionImages({state,result,variables,use,sql,originalConfig}){
 require('./_page-draft-units').applyRegion(state,result,{imageRepairValidationOnly:true});
 const spec=repairContract(state,result),constraints=JSON.parse(variables.constraintsJson),region=state.plan.regions[state.cursor];
 const repairVariables={...variables,constraintsJson:JSON.stringify({...constraints,phase:'region',...(state.parallelV1?{unitNodeIdPrefix:require('./_page-draft-units').unitPrefix(region),maxRegionNodes:state.unitBudgets?.[region.shell.id]||48}:{}),repairFeedback:{attempt:1,maxRepairs:1,code:'PAGE_IMAGE_PLAN_INCOMPLETE',errors:spec.missing.map(r=>({path:r.id,code:'IMAGE_INTENT_UNFULFILLED',message:'이미지 노드와 sourceIds 및 생성 요청/등록 에셋 연결이 필요합니다.'}))},imageRepair:{currentResult:result,missingRequirements:spec.missing,allowedChanges:['add images under existing parents or fix unlinked image nodes and matching mediaRequests in this region only'],preserve:['all sourceAssignments and text','every existing non-image node, property and relative order','connected images and completed assets','other regions'],imagePlacement:'Use existing parent nodes. A background image needs a container parent with at most one background image; otherwise use content presentation.',responseContract:'Return node, sourceAssignments and mediaRequests as usual. Copy currentResult exactly except missing image nodes and their connections. Fulfill every missingRequirements entry with a distinct image and its region-scoped sourceIds. Never return patches or a full page.'}})};
 const execution=await use.createPromptExecutionSnapshot(sql,'promo_page_region_builder',repairVariables);require('./_page-draft-units').assertV2(execution.promptConfig);
 const pinned=state.executions?.findLast(item=>item.type==='promo_page_region_builder');if(!originalConfig&&pinned?.configHash&&pinned.configHash!==require('./_page-work-unit-store').configHash(execution.promptConfig))throw Object.assign(Error('WORK_CONFIG_CHANGED'),{code:'WORK_CONFIG_CHANGED',statusCode:409,retryable:false});if(!originalConfig&&pinned&&['promptId','promptVersion','model'].some(key=>pinned[key]!==undefined&&pinned[key]!==execution.promptConfig[key]))throw Object.assign(Error('WORK_CONFIG_CHANGED'),{code:'WORK_CONFIG_CHANGED',statusCode:409,retryable:false});
 if(originalConfig&&require('./_page-work-unit-store').configHash(originalConfig)!==require('./_page-work-unit-store').configHash(execution.promptConfig))throw Object.assign(Error('WORK_CONFIG_CHANGED'),{code:'WORK_CONFIG_CHANGED',statusCode:409,retryable:false});
 await require('./_work-log').logEvent({event:'checkpoint',status:'running',metadata:{unitId:region.shell.id,repairCalls:1,errors:spec.missing.map(r=>({path:r.id,code:'IMAGE_PLAN_REPAIR',message:'이미지 노드·요청 연결만 보정합니다.'}))}});
 const response=await use.generate({type:'promo_page_region_builder',schemaName:'page_image_plan_repair_v1',schema:spec.schema,promptConfig:execution.promptConfig});
 try{return {result:applyImageRepair(state,result,response.result),usage:response.usage,execution:execution.promptConfig};}catch(error){error.retryable=false;error.errors||=spec.missing.map(r=>({path:r.id,code:'IMAGE_PLAN_REPAIR_FAILED',message:error.message}));throw error;}
}
function existingRegionResult(state,index){
 const region=state.plan.regions[index],reserved=new Set(state.plan.regions.map(r=>r.shell.id));let node;walk(state.page.root,({node:n})=>{if(n.id===region.shell.id)node=n;});if(!node)throw fail('저장된 이미지 보정 영역이 없습니다.');
 node=structuredClone(node);const strip=n=>{if(n.children){n.children=n.children.filter(c=>!reserved.has(c.id));n.children.forEach(strip);}};strip(node);
 const ids=new Set(),sourceAssignments=[];walk(node,({node:n})=>{ids.add(n.id);if(n.type==='text'&&n.contentMode==='source'&&n.sourceIds.length===1){sourceAssignments.push({nodeId:n.id,sourceId:n.sourceIds[0]});n.contentMode='editorial';n.sourceIds=[];n.text='';}});return compactRegion({node,sourceAssignments,mediaRequests:state.page.mediaRequests.filter(r=>ids.has(r.nodeId))});
}
module.exports={repairContract,applyImageRepair,repairRegionImages,existingRegionResult};
