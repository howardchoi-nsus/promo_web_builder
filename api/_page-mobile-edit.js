const {walk}=require('../shared/page-schema/contract.cjs');
function mobileOnlyPage(before,proposed){
 const nodes=new Map();walk(proposed.root,({node})=>nodes.set(node.id,node));
 const result=structuredClone(before);
 walk(result.root,({node})=>{
  const patch=nodes.get(node.id);
  if(!patch||patch.type!==node.type)throw Object.assign(new Error('모바일 배치 수정은 기존 요소와 콘텐츠를 유지해야 합니다.'),{code:'MOBILE_EDIT_STRUCTURE_CHANGED',statusCode:422});
  node.layout.mobile=structuredClone(patch.layout.mobile);
  node.styles.mobile=structuredClone(patch.styles.mobile);
  node.styles.spacing??={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};
  node.styles.spacing.mobile=structuredClone(patch.styles.spacing?.mobile??null);
 });
 return result;
}
module.exports={mobileOnlyPage};
