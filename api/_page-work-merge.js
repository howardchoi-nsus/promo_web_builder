const {inputHash}=require('./_page-schema-generation-jobs');
const {treeNodes}=require('../shared/page-schema/section-design.cjs');
const {error}=require('./_page-work-unit-store');
const {structureFingerprint}=require('./_page-schema-service');
function flat(node){const {children,...own}=node;return own;}
function stableContent(snapshot){const page=snapshot.content.pageSchema,c=snapshot.content.pageContext;return inputHash({plan:snapshot.generationMeta.sectionDesign?.id,requirements:snapshot.generationMeta.sourceRequirements,request:snapshot.generationMeta.requestId||snapshot.generationMeta.draftRunId,structure:structureFingerprint(page),context:{tokenVersionId:c.tokenVersionId,tokenValues:c.tokenValues,tokenCatalog:c.tokenCatalog,usagePolicy:c.usagePolicy,contentSources:c.contentSources,actions:c.actions,formFields:c.formFields,icons:c.icons},nodes:treeNodes(page).map(node=>{const {styles,overlayRole,assetId,requestId,...other}=flat(node);return other;})});}
function mergeWorkSnapshot(latest,unit){
 const before=unit.input_json.found.snapshot,prepared=unit.result_json.snapshot;
 if(stableContent(latest)!==stableContent(before))throw error('WORK_INPUT_CHANGED');
 for(const [id,asset] of Object.entries(before.content.pageContext.assets||{}))if(inputHash(latest.content.pageContext.assets?.[id]||null)!==inputHash(asset))throw error('WORK_INPUT_CHANGED');
 for(const request of before.content.pageSchema.mediaRequests||[]){const current=latest.content.pageSchema.mediaRequests.find(r=>r.id===request.id),binding=latest.generationMeta.mediaBindings?.[request.nodeId];if(current?inputHash(current)!==inputHash(request):!binding||binding.requestId!==request.id||inputHash(binding.request||null)!==inputHash(request))throw error('WORK_INPUT_CHANGED');}
 const current=new Map(treeNodes(latest.content.pageSchema).map(n=>[n.id,n])),original=new Map(treeNodes(before.content.pageSchema).map(n=>[n.id,n])),result=new Map(treeNodes(prepared.content.pageSchema).map(n=>[n.id,n]));
 const targetIds=unit.kind==='design'?before.generationMeta.sectionDesign.groups.find(g=>g.id===unit.unit_key)?.nodeIds:[unit.unit_key];
 if(!targetIds?.length)throw error('WORK_UNIT_UNKNOWN');
 for(const id of targetIds)if(!current.has(id)||inputHash(flat(current.get(id)))!==inputHash(flat(original.get(id))))throw error('WORK_INPUT_CHANGED');
 const next=structuredClone(latest),nodes=new Map(treeNodes(next.content.pageSchema).map(n=>[n.id,n]));
 if(unit.kind==='design'){
  const plan=next.generationMeta.sectionDesign;if(plan.completed.some(g=>g.id===unit.unit_key))throw error('WORK_INPUT_CHANGED');
  for(const id of targetIds){const target=nodes.get(id),source=result.get(id);target.styles=structuredClone(source.styles);if(source.type==='container')target.overlayRole=source.overlayRole;}
  const record=prepared.generationMeta.sectionDesign.completed.find(g=>g.id===unit.unit_key);plan.completed.push(structuredClone(record));plan.promptIdentity=prepared.generationMeta.sectionDesign.promptIdentity;plan.state=plan.completed.length===plan.groups.length?'complete':'pending';
 }else{
  const target=nodes.get(unit.unit_key),source=result.get(unit.unit_key),binding=prepared.generationMeta.mediaBindings?.[unit.unit_key];if(!binding||!source.assetId||!target.requestId)throw error('WORK_INPUT_CHANGED');
  next.content.pageContext.assets[source.assetId]=structuredClone(prepared.content.pageContext.assets[source.assetId]);target.assetId=source.assetId;target.requestId=null;next.content.pageSchema.mediaRequests=next.content.pageSchema.mediaRequests.filter(r=>r.id!==binding.requestId);next.generationMeta.mediaBindings={...next.generationMeta.mediaBindings,[unit.unit_key]:structuredClone(binding)};
 }
 next.qualityGate={state:'pending'};require('./_page-structure-state').assertStructureReady(next);next.generationMeta.outputDiagnostics=require('./_page-schema-output-diagnostics').outputDiagnostics(next.content.pageSchema,next.content.pageContext);return next;
}
module.exports={stableContent,mergeWorkSnapshot};
