import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {fixture,context} from './fixtures/page-schema.mjs';
import {editNode,moveSibling,createEditorHistory,mergeEditorChanges} from '../visual-editor/src/builder/services/page-editor-commands.mjs';
const require=createRequire(import.meta.url),{assertSelectedScope,manualReview}=require('../api/_page-editor-contract');
const page=fixture('example-editorial'),id=page.root.children[0].id,history=createEditorHistory(page),snapshot={content:{pageSchema:page,pageContext:context},generationMeta:{review:{state:'approved'}}};
const edited=editNode(page,id,n=>n.layout.desktop.align='end');assertSelectedScope(page,edited,id);assert.equal(manualReview(snapshot,edited).state,'pending');
const style=editNode(page,id,n=>n.styles.base=[]);assert.equal(manualReview(snapshot,style).state,'approved');history.push(edited);assert.ok(history.canUndo);assert.deepEqual(history.undo(),page);assert.deepEqual(history.redo(),edited);
const outside=structuredClone(edited);outside.root.layout.desktop.justify='end';assert.throws(()=>assertSelectedScope(page,outside,id),{code:'EDITOR_SCOPE_VIOLATION'});
const {staticPageHtml,resolveExportAssets}=require('../api/_page-schema-static-export');const html=await staticPageHtml(snapshot,{title:'<unsafe>',origin:'https://sample.example'});
assert.ok(html.startsWith('<!doctype html>'));assert.ok(html.includes('&lt;unsafe&gt;'));assert.ok(!html.includes('<script'));assert.ok(!html.includes('export-runtime'));assert.ok(html.includes('var(--fixture-'));assert.ok(!html.includes('requestText'));
const {serialize}=require('../api/_page-schema-static-export');assert.equal(serialize({tag:'p',attrs:{},children:'<script>alert(1)</script>'}),'<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
const {generateProgressivePage}=await import('../visual-editor/src/builder/services/page-draft.mjs');let calls=0,updates=0;const saved=await generateProgressivePage({requestId:'run'},{request:async()=>++calls===1?{draft:true,runId:'run',sequence:1,page:{root:{}},context:{}}:{complete:true,revision:1,snapshot},onDraft:()=>updates++});assert.equal(saved.revision,1);assert.equal(updates,1);
await assert.rejects(generateProgressivePage({requestId:'run'},{request:async()=>({draft:true,runId:'foreign'})}),{code:'PAGE_DRAFT_RESPONSE_INVALID'});
console.log('Editor/export: scoped tree edits, approval invalidation, undo/redo, static HTML without JS/runtime, escaped copy and progressive client response guards passed.');

const remote=editNode(page,id,n=>n.layout.desktop.justify='center');const merged=mergeEditorChanges(page,edited,remote);assert.equal(merged.conflicts.length,0);assert.equal(merged.page.root.children[0].layout.desktop.align,'end');assert.equal(merged.page.root.children[0].layout.desktop.justify,'center');
const simultaneous=editNode(page,id,n=>n.layout.desktop.align='center');assert.ok(mergeEditorChanges(page,edited,simultaneous).conflicts.length);
const exportPage=fixture('example-split-nested'),exportContext=structuredClone(context),privateUrl='/api/promo-page-schema-image?id=11111111-1111-4111-8111-111111111111&token=private-test-token';
require('../shared/page-schema/contract.cjs').walk(exportPage.root,({node})=>{if(node.type==='image'){node.assetId='export_asset';node.requestId=null;}});exportPage.mediaRequests=[];exportContext.assets.export_asset={kind:'image',url:privateUrl,width:1,height:1};
const privateSnapshot={content:{pageSchema:exportPage,pageContext:exportContext}};let reads=0;
const overrides=await resolveExportAssets(privateSnapshot,{documentId:'owned',sql:async(strings,...values)=>{assert.ok(values.includes('owned'));return [{storage_key:'private-key',mime_type:'image/png'}];},blobGet:async()=>{reads++;return {statusCode:200,stream:new Response(new Uint8Array([137,80,78,71])).body};}});
assert.equal(reads,1);assert.equal(exportContext.assets.export_asset.url,privateUrl);assert.ok(overrides[privateUrl].startsWith('data:image/png;base64,'));const portable=await staticPageHtml(privateSnapshot,{origin:'https://sample.example',assetOverrides:overrides});assert.ok(portable.includes('data:image/png;base64,'));assert.ok(!portable.includes('private-test-token'));

await assert.rejects(staticPageHtml(privateSnapshot,{assetOverrides:{[privateUrl]:"data:image/png;base64,"+"A".repeat(4*1024*1024)}}),{code:"EXPORT_HTML_TOO_LARGE"});
