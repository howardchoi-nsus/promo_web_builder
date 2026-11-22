import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url),Ajv=require('ajv/dist/2020').default;
const {assertStructuredSchemaReferences}=require('../api/_promo-section-design-provider');
const {compactRegion,hydrateRegion}=require('../api/_page-draft-compact'),{regionSchema}=require('../api/_page-draft-units'),{walk,assertValid,normalize}=require('../shared/page-schema/contract.cjs');
let bytesBefore=0,bytesAfter=0;
for(const name of ['example-editorial','example-split-nested']){
 const page=fixture(name);walk(page.root,({node,depth})=>{if(node.type==='container'&&depth>2)node.role='group';node.styles.spacing??={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};if(node.type==='container')node.overlayRole??=null;if(node.type==='image')node.presentation??='content';});for(const r of page.mediaRequests)r.regenerate??=false;
 const original=structuredClone(page);
 for(const child of page.root.children){
  const shell={...structuredClone(child),children:[]};const canonical={node:child,sourceAssignments:[],mediaRequests:page.mediaRequests.filter(r=>JSON.stringify(child).includes(r.nodeId))};
  const compact=compactRegion(canonical),schema=regionSchema(context,{shell,sourceIds:Object.keys(context.contentSources)}),check=new Ajv({strict:false}).compile(schema);
  assert.equal(check(compact),true,JSON.stringify(check.errors));assert.deepEqual(hydrateRegion(compact),canonical);
  bytesBefore+=Buffer.byteLength(JSON.stringify(canonical));bytesAfter+=Buffer.byteLength(JSON.stringify(compact));
  const malicious=structuredClone(compact);malicious.node.children[0].onclick='alert(1)';assert.equal(check(malicious),false);
  assertStructuredSchemaReferences(schema,'promo_page_region_builder');
  const refs=value=>{if(!value||typeof value!=='object')return;if(value.$ref){assert.deepEqual(Object.keys(value),['$ref']);assert.match(value.$ref,/^#\/\$defs\//);assert.ok(schema.$defs[value.$ref.slice(8)]);}for(const child of Object.values(value))refs(child);};refs(schema);
 }
 assert.deepEqual(page,original);assertValid(normalize(page).page,context);
}
assert.ok(bytesAfter<bytesBefore*.8,`${bytesAfter}/${bytesBefore}: compact transport must materially shrink output`);
console.log(`Compact regions: registered geometry/styles, responsive overrides, source facts, nested primitives/media preserved, unknown fields rejected; ${bytesBefore} → ${bytesAfter} bytes on existing fixtures.`);
// Explicit viewport geometry/style/spacing overrides must survive, not just nulls.
const responsive=fixture('example-editorial').root.children[0];
walk(responsive,({node})=>{node.styles.spacing={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};if(node.type==='container')node.overlayRole=null;});
const title=responsive.children.find(n=>n.type==='text');title.layout.tablet={...title.layout.desktop,align:'center'};title.layout.mobile={...title.layout.desktop,align:'end'};title.styles.tablet=[...title.styles.base];title.styles.mobile=[...title.styles.base];title.styles.spacing.mobile={gap:null,padding:'--spacing-8',margin:null};
const explicit={node:responsive,sourceAssignments:[],mediaRequests:[]},wire=compactRegion(explicit),region={shell:{...structuredClone(responsive),children:[]},sourceIds:Object.keys(context.contentSources)};
assert.equal(new Ajv({strict:false}).compile(regionSchema(context,region))(wire),true);assert.deepEqual(hydrateRegion(wire),explicit);
