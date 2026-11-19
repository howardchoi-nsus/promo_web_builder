const {validate,walk,hasRestrictedFacts}=require('../shared/page-schema/contract.cjs');
const canonical=text=>text.trim().replace(/\s+/gu,' ');

// Repair representation only: never authorize a substring, a new fact or a new source.
function repairApprovedSourceBindings(page,context){
 const initial=validate(page,context);
 if(!initial.errors.some(error=>error.code==='UNSUPPORTED_FACT')||initial.errors.some(error=>['PAGE_SCHEMA_INVALID','PAGE_SCHEMA_LIMIT_EXCEEDED'].includes(error.code)))return {page,adjustments:[]};
 const sources=context.contentSources||{},copy=structuredClone(page),adjustments=[];
 walk(copy.root,({node})=>{
  if(node.type!=='text'||node.contentMode!=='editorial'||!hasRestrictedFacts(node.text))return;
  const candidates=node.sourceIds.length?node.sourceIds:Object.keys(sources);
  const sourceId=candidates.find(id=>Object.hasOwn(sources,id)&&typeof sources[id].text==='string'&&canonical(sources[id].text)===canonical(node.text));
  // Invalid provenance must still be rejected by the regular validator.
  if(!sourceId||node.sourceIds.length>1||node.sourceIds.some(id=>!Object.hasOwn(sources,id)))return;
  node.contentMode='source';node.sourceIds=[sourceId];node.text='';
  adjustments.push({code:'APPROVED_SOURCE_REFERENCE_REPAIRED',nodeId:node.id,sourceId});
 });
 return {page:copy,adjustments};
}
module.exports={repairApprovedSourceBindings};
