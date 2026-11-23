const {walk}=require('../shared/page-schema/contract.cjs');
function designTask(phase){return {version:1,phase,priority:'Content-led layout quality, readable hierarchy and coherent image composition.',layoutDecisions:['section order and grouping','nesting','column count and ratios','text-image relationship','hierarchy and CTA emphasis','density and rhythm','responsive reading order'],rules:['Honor explicit customer composition within registered capabilities.','Choose an appropriate composition when unspecified; do not force background hero, split, centered, three-card, brand palette or random novelty.','Decide geometry in manifest/region/full-page planning, not style-only design.','Use only supplied registered compatible tokens and schema-supported primitives.','Preserve factual sources, existing assets and the allowed task boundary.'],styleOnly:phase==='region-style'};}
function imageTarget(page,node,context){
 const entries=new Map();walk(page.root,e=>entries.set(e.node.id,e));let section=entries.get(node.id)?.parent;
 while(section&&!(section.type==='container'&&section.role==='section'))section=entries.get(section.id)?.parent;
 const owner=section||entries.get(node.id)?.parent||page.root,texts=[];
 walk(owner,({node:n})=>{if(n.type==='text'&&texts.length<12)texts.push({nodeId:n.id,role:n.role,copy:n.contentMode==='source'?context.contentSources?.[n.sourceIds[0]]?.text||'':n.text,layout:n.layout});});
 return {nodeId:node.id,sectionId:owner.id,sectionName:owner.label||texts.find(t=>t.role==='heading')?.copy||page.summary,purpose:node.presentation==='background'?'background-key-visual':'component-image',aspectRatio:node.aspectRatio,fit:node.fit,containerLayout:owner.layout,textLayout:texts,evidence:'PageSchema layout only; pixel positions and crop measurements are not supplied.'};
}
module.exports={designTask,imageTarget};
