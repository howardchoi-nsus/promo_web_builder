const {walk}=require('../shared/page-schema/contract.cjs');
const {pageGenerationStyleRoles,pageStyleToken,pageStyleWarnings}=require('../shared/token-usage-policy.cjs');
// Metadata for diagnosis of a saved revision; not a live browser quality report.
function outputDiagnostics(page,context){
 const roles=pageGenerationStyleRoles(context),byKey=new Map(roles.map(role=>[role.key,role]));
 const candidateCounts={};
 for(const role of roles){const key=`${role.target}.${role.property}`;candidateCounts[key]=(candidateCounts[key]||0)+1;}
 const nodes=[];
 walk(page.root,({node})=>{
  const styles={};
  for(const viewport of ['base','tablet','mobile'])styles[viewport]=(node.styles?.[viewport]||[]).map(key=>{
   const role=byKey.get(key),token=role?pageStyleToken(context,role):null;
   return {role:key,token:token||null,property:role?.property||null,resolved:Boolean(token&&context.tokenValues?.[token])};
  });
  nodes.push({id:node.id,type:node.type,styles,...(node.type==='image'?{media:{assetId:node.assetId||null,registered:Boolean(node.assetId&&context.assets?.[node.assetId]),requested:(page.mediaRequests||[]).some(request=>request.nodeId===node.id)}}:{}),...(node.type==='icon'?{icon:{id:node.iconId||null,registered:Boolean(context.icons?.[node.iconId])}}:{})});
 });
 return {version:1,scope:'saved-schema',generationPath:'page-schema',tokenVersionId:context.tokenVersionId||null,candidateCounts,warnings:pageStyleWarnings(context),nodes};
}
module.exports={outputDiagnostics};
