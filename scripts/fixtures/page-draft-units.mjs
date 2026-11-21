import {fixture,context as baseContext} from './page-schema.mjs';
import {createRequire} from 'node:module';
const {walk}=createRequire(import.meta.url)('../../shared/page-schema/contract.cjs');
export function unitFixture(sources,{sourceOnly=true}={}){
 const page=fixture('example-editorial');
 walk(page.root,({node})=>{node.styles.spacing={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};if(node.type==='container')node.overlayRole=null;if(node.type==='button'){node.actionId=null;node.sourceIds=[];}});
 if(sourceOnly){const clean=node=>{if(node.children)node.children=node.children.filter(n=>n.type!=='button'&&!(n.type==='text'&&n.contentMode==='editorial'));for(const child of node.children||[])clean(child);};clean(page.root);}
 const plan={contractVersion:2,root:{...structuredClone(page.root),children:[]},summary:'맞춤 페이지 계획',regions:[]};
 const results=[];
 for(const child of page.root.children){const ids=[],sourceAssignments=[];const node=structuredClone(child);walk(node,({node:n})=>{if(n.type==='text'&&n.contentMode==='source'){const original=n.sourceIds[0];const match=Object.entries(sources).find(([id,s])=>id===original||s.text===baseContext.contentSources[original]?.text);if(!match)throw Error('Missing fixture source '+original);ids.push(match[0]);sourceAssignments.push({nodeId:n.id,sourceId:match[0]});n.sourceIds=[];n.contentMode='editorial';n.text='';}});plan.regions.push({shell:{...structuredClone(child),children:[]},parentId:page.root.id,intent:'콘텐츠에 맞는 구성',sourceIds:ids});results.push({node,sourceAssignments,mediaRequests:[]});}
 return {plan,results};
}
