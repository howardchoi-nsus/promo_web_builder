function treeNodes(page){const result=[],stack=[page?.root];while(stack.length&&result.length<201){const node=stack.pop();if(!node)continue;result.push(node);stack.push(...[...(node.children||[])].reverse());}return result;}
function designGroups(page){
 const all=treeNodes(page);if(!all.length)return [];
 const sections=all.filter(node=>node.type==='container'&&node.role==='section');
 const anchors=new Set((sections.length?sections:(page.root.children||[]).filter(node=>['container','grid','stack','card'].includes(node.type))).map(node=>node.id));
 const groups=[{id:page.root.id,label:'페이지 기본',nodeIds:[]}];
 function visit(node,group){if(node!==page.root&&anchors.has(node.id)){group={id:node.id,label:node.label||`${groups.length}번 영역`,nodeIds:[]};groups.push(group);}group.nodeIds.push(node.id);for(const child of node.children||[])visit(child,group);}
 visit(page.root,groups[0]);
 if(groups.length>12){const tail=groups.splice(12);for(const group of tail)groups[11].nodeIds.push(...group.nodeIds);groups[11].label='후속 디자인 영역';}
 return groups;
}
function sectionDesignPending(snapshot){const plan=snapshot?.generationMeta?.sectionDesign;if(!plan)return false;return plan.state!=='complete'||!plan.groups?.length||plan.groups.some(group=>!plan.completed?.some(item=>item.id===group.id));}
function designNodeStates(snapshot,activeId,failedId){
 const plan=snapshot?.generationMeta?.sectionDesign;if(!plan||!Array.isArray(plan.groups)||!Array.isArray(plan.completed)||snapshot.generationMeta.review?.state!=='approved')return [];
 return plan.groups.flatMap(group=>group.nodeIds.map(nodeId=>({nodeId,groupId:group.id,state:plan.completed.some(item=>item.id===group.id)?'ready':group.id===failedId?'failed':group.id===activeId?'generating':'waiting'})));
}
module.exports={treeNodes,designGroups,sectionDesignPending,designNodeStates};
