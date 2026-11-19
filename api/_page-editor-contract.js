const {structureFingerprint}=require('./_page-schema-service');
const {walk}=require('../shared/page-schema/contract.cjs');
const {stableStringify}=require('./_promo-builder-chat-workspace-contract');
function assertSelectedScope(before,after,id){
 let found=false;
 const prune=node=>{if(node.id===id){found=true;return {selectedNode:id};}return {...node,...(node.children?{children:node.children.map(prune)}:{})};};
 const old=prune(before.root);if(!found)throw Object.assign(new Error('선택한 요소를 찾을 수 없습니다.'),{code:'EDITOR_SELECTION_INVALID',statusCode:422});
 found=false;const next=prune(after.root);if(!found||stableStringify(old)!==stableStringify(next))throw Object.assign(new Error('선택한 영역 밖의 변경이 포함되어 적용하지 않았습니다.'),{code:'EDITOR_SCOPE_VIOLATION',statusCode:422});
}
function manualReview(previous,page){return structureFingerprint(previous.content.pageSchema)===structureFingerprint(page)?previous.generationMeta?.review||{state:'pending'}:{state:'pending'};}
module.exports={assertSelectedScope,manualReview};
