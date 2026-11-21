import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url);
const {outlineSchema,outlineResult}=require('../api/_page-draft-contract');
const {runtimeSchema,walk}=require('../shared/page-schema/contract.cjs');
const Ajv=require('ajv/dist/2020').default;
for(const ctx of [context,{}]){
 const schema=outlineSchema(ctx),runtime=runtimeSchema(ctx);let refs=0;
 assert.deepEqual(schema.$defs,runtime.$defs);assert.equal(schema.properties.page.$defs,undefined);
 assert.equal(schema.properties.page.$id,undefined);
 const visit=(value,path=[])=>{if(!value||typeof value!=='object')return;
  if(value.$ref){refs++;assert.match(value.$ref,/^#\/\$defs\//);let target=schema;for(const token of value.$ref.slice(2).split('/'))target=target?.[token.replaceAll('~1','/').replaceAll('~0','~')];assert.ok(target,'Unresolved '+value.$ref);}
  if(path.length)assert.equal(value.$defs,undefined,'Nested definitions at '+path.join('.'));
  for(const [key,child] of Object.entries(value))visit(child,[...path,key]);
 };visit(schema);assert.ok(refs>0);
 new Ajv({strict:false}).compile(schema);
}
const page=fixture('example-editorial'),sourceAssignments=[];
walk(page.root,({node})=>{node.styles.spacing={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};if(node.type==='container')node.overlayRole=null;if(node.type==='image')node.presentation='content';if(node.type==='text'){if(node.contentMode==='source')sourceAssignments.push({nodeId:node.id,sourceId:node.sourceIds[0]});node.contentMode='editorial';node.sourceIds=[];node.text='';}});
for(const request of page.mediaRequests)request.regenerate=false;
const schema=outlineSchema(context),validate=new Ajv({strict:false}).compile(schema);
assert.equal(validate({page,sourceAssignments}),true,JSON.stringify(validate.errors));
assert.ok(outlineResult({page,sourceAssignments},context).page);
assert.equal(validate({page,sourceAssignments,unexpected:true}),false);
const bad=structuredClone(page);bad.root.type='script';assert.equal(validate({page:bad,sourceAssignments}),false);
assert.throws(()=>outlineResult({page,sourceAssignments:[{nodeId:sourceAssignments[0].nodeId,sourceId:'invented'}]},context),{code:'PAGE_DRAFT_INVALID'});
console.log('Draft outline schema: root-level definitions/references, recursive resolution, runtime parity, valid outline and invalid nodes/source bindings passed.');
