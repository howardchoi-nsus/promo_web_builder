const {walk}=require('../shared/page-schema/contract.cjs');
function imageRequirements(overview={},context={}){
 const result=[];
 const add=(path,intent)=>{if(typeof intent!=='string'||!intent.trim()||/^(?:none|null|n\/a|no image|text[- ]only|없음|불필요|사용 안 함|미정)$/i.test(intent.trim()))return;const sourceIds=Object.entries(context.contentSources||{}).filter(([,source])=>(source.paths||[source.path]).some(p=>p===path||p?.startsWith(path+'.'))).map(([id])=>id);result.push({id:path,intent:intent.trim(),sourceIds});};
 (overview.contentSections||[]).forEach((section,i)=>{const path=`contentSections.${i}`;add(path,section.media?.imageIntent||section.imageIntent);(section.items||[]).forEach((item,j)=>add(`${path}.items.${j}`,item.imageIntent));});
 return result;
}
function imageOwner(requirement,plan){const target=plan.regions.findIndex(region=>region.sourceIds.some(id=>requirement.sourceIds.includes(id)));return target<0?0:target;}
function unitImageRequirements(requirements,plan,index){return requirements.filter(r=>imageOwner(r,plan)===index).map(r=>({...r,ownerRegionId:plan.regions[index].shell?.id,sourceIds:r.sourceIds.filter(id=>plan.regions[index].sourceIds.includes(id))}));}
function missingImageRequirements(page,context,requirements=context.imageRequirements||[]){
 const images=[];walk(page.root,({node})=>{if(node.type==='image')images.push(node);});
 // Find a complete one-to-one assignment, rather than greedily consuming a
 // shared-source image that may be the only candidate for another requirement.
 const matches=requirements.map(requirement=>images.flatMap((node,index)=>{
  const request=(page.mediaRequests||[]).find(r=>r.nodeId===node.id&&r.id===node.requestId),binding=context.assets?.[node.assetId];
  if(!request&&binding?.kind!=='image')return [];
  const sources=[...(node.sourceIds||[]),...(request?.sourceIds||[]),...(binding?.sourceIds||[])];
  return !requirement.sourceIds.length||sources.some(id=>requirement.sourceIds.includes(id))?[index]:[];
 }));
 const owners=new Map();
 const assign=(index,visited)=>{for(const image of matches[index]){if(visited.has(image))continue;visited.add(image);if(!owners.has(image)||assign(owners.get(image),visited)){owners.set(image,index);return true;}}return false;};
 const missing=[];
 requirements.forEach((requirement,index)=>{if(!assign(index,new Set()))missing.push(requirement);});
 return missing;
}
function assertImageCoverage(page,context,requirements=context.imageRequirements||[]){
 const missing=missingImageRequirements(page,context,requirements);
 if(missing.length)throw Object.assign(new Error('요청한 이미지가 페이지 구성에서 누락되어 해당 영역을 다시 구성해야 합니다.'),{code:'PAGE_IMAGE_PLAN_INCOMPLETE',statusCode:422,retryable:true,errors:missing.map(r=>({code:'IMAGE_INTENT_UNFULFILLED',path:r.id,message:'요청한 이미지의 노드와 생성 요청 또는 등록 에셋 연결이 누락되었습니다.'}))});
}

module.exports={imageRequirements,imageOwner,unitImageRequirements,missingImageRequirements,assertImageCoverage};
