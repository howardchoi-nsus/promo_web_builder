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

// Role/level pairs must be rejected by the provider schema, before draft save.
const textBranches=regionSchema(context,region).$defs.compact_text.anyOf;
for(const role of ['heading','body','label','caption']){
 const definition=textBranches.find(b=>b.properties.role.const===role);
 assert.ok(definition,role);
 const checkLevel=new Ajv({strict:false}).compile(definition.properties.headingLevel);
 for(let level=0;level<=6;level++)assert.equal(checkLevel(level),role==='heading'?level>0:level===0,`${role}/${level}`);
}
const pairSchema=regionSchema(context,region),pairCheck=new Ajv({strict:false}).compile(pairSchema);
function firstText(node){return node.type==='text'?node:(node.children||[]).map(firstText).find(Boolean);}
for(const role of ['heading','body','label','caption']){
 for(let level=0;level<=6;level++){
  const candidate=structuredClone(wire),text=firstText(candidate.node);assert.ok(text);
  text.role=role;text.headingLevel=level;
  assert.equal(pairCheck(candidate),role==='heading'?level>0:level===0,`full region ${role}/${level}`);
 }
}

// A varied registered library must not multiply enums by text role and viewport.
const rich=structuredClone(context);rich.styleChoicesVersion=1;
for(const property of ['color','font-size','font-family','font-weight','line-height','letter-spacing','background-color','border-color','border-width','border-style','min-height','height'])for(let i=0;i<12;i++){
 const name=`--sample-${property}-${i}`,value=property.includes('color')?`#${String(i+100000)}`:property==='border-style'?['solid','dashed','dotted'][i%3]:property==='font-family'?`Font${i}`:`${i+1}px`;
 rich.tokenValues[name]=value;rich.tokenCatalog.push({name,tokenKey:name,value,state:'active',cssProperties:[property]});
}
const {runtimeSchema}=require('../shared/page-schema/contract.cjs'),{pageGenerationStyleRoles,pageStyleToken}=require('../shared/token-usage-policy.cjs');
const richBefore=structuredClone(rich),richSchema=runtimeSchema(rich),richRegion=regionSchema(rich,region);
const enumCount=value=>!value||typeof value!=='object'?0:(Array.isArray(value.enum)?value.enum.length:0)+Object.values(value).reduce((n,v)=>n+enumCount(v),0);
assert.ok(enumCount(richSchema)<1000);assert.ok(enumCount(richRegion)<1000);
assertStructuredSchemaReferences(richSchema,'rich');assertStructuredSchemaReferences(richRegion,'rich-region');
for(const role of pageGenerationStyleRoles(rich).filter(r=>r.target==='text'&&rich.tokenValues[pageStyleToken(rich,r)]))assert.ok(richSchema.$defs.policyRole_text.enum.includes(role.key));
const allowed=new Ajv({strict:false}).compile(richSchema.$defs.policyRole_text);
assert.equal(allowed('button.background'),false);assert.equal(allowed('invented.role'),false);
assert.deepEqual(rich,richBefore);
console.log(`Rich registered catalog: shared enum references, preserved text candidates/target restrictions, runtime ${enumCount(richSchema)} and compact ${enumCount(richRegion)} enum values passed.`);
