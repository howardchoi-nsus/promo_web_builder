import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {designFixture} from './fixtures/design-preview-enhancements.mjs';
import {reviewPageUntilReady} from '../visual-editor/src/builder/services/page-quality-review.mjs';
const require=createRequire(import.meta.url),{reviewSchema,applyReview,isCurrentReview}=require('../api/_page-quality-agent-contract');
const {processQualityReview}=require('../api/_page-quality-agent');
const {snapshotForPage}=require('../api/_page-schema-service');
const {walk}=require('../shared/page-schema/contract.cjs');
const {pageStyleRoles}=require('../shared/token-usage-policy.cjs');
const {page,context}=designFixture({pending:false});
let heading;walk(page.root,({node})=>{if(!heading&&node.type==='text')heading=node;});
const role=pageStyleRoles(context).find(r=>r.target==='text'&&r.property==='color'&&r.registeredVariant);
const patch=(overrides={})=>({nodeId:heading.id,viewport:'desktop',kind:'styles',roles:[role.key],spacing:null,layout:null,presentation:null,overlayRole:null,reason:'Improve hierarchy',...overrides});
const result={summary:'Registered hierarchy adjustment',issues:[{nodeId:heading.id,category:'hierarchy',severity:'blocking',message:'Improve heading hierarchy',resolvedByPatch:true}],patches:[patch()]};
const applied=applyReview(page,context,result);assert.equal(applied.changed,true);assert.equal(applied.blockingCount,0);
assert.deepEqual(context,designFixture({pending:false}).context);
const before=structuredClone(page);for(const change of applied.patches)assert.ok(change.nodeId);
const blocked=applyReview(page,context,{...result,patches:[]});assert.equal(blocked.blockingCount,1,'model cannot claim a blocking issue resolved without a related change');
assert.throws(()=>applyReview(page,context,{...result,patches:[{...patch(),text:'invented copy'}]}),{code:'QUALITY_AGENT_RESULT_INVALID'});
assert.throws(()=>applyReview(page,context,{...result,patches:[patch({roles:['--invented-css']})]}),{code:'QUALITY_AGENT_RESULT_INVALID'});
assert.throws(()=>applyReview(page,context,{...result,patches:[patch({layout:page.root.layout.desktop})]}),{code:'QUALITY_AGENT_PATCH_INVALID'});
assert.throws(()=>applyReview(page,context,{...result,patches:[patch(),patch()]}),{code:'QUALITY_AGENT_PATCH_INVALID'});
assert.deepEqual(page,before);
const staticWarning=applyReview(page,context,{summary:'CTA pending',patches:[],issues:[{nodeId:heading.id,category:'content-advisory',severity:'blocking',message:'URL remains unset',resolvedByPatch:false}]});assert.equal(staticWarning.blockingCount,0);
let revision=1,snapshot=snapshotForPage(page,context),providerCalls=0,saves=0,failed=0;
snapshot.generationMeta.review={state:'approved'};
let output=result;
const deps={fetchDocument:async(_,id,subject)=>id==='owned'&&subject==='owner'?{document:{id,currentDocumentRevision:revision},snapshot}:null,
 createPromptExecutionSnapshot:async(_,type,variables)=>{assert.equal(type,'promo_page_quality_reviewer');assert.equal(JSON.parse(variables.currentPageJson).root.id,page.root.id);assert.ok(JSON.parse(variables.candidateSnapshotJson).layoutGeometry);return {promptConfig:{promptId:'review-prompt',promptVersion:1,provider:'openai',model:'registered-model',renderedPrompt:'registered prompt',skillSnapshots:[]}};},
 acquireGeneration:async(_,args)=>({...args,claimToken:'claim'}),failGeneration:async()=>{failed++;},
 generate:async args=>{providerCalls++;assert.equal(args.type,'promo_page_quality_reviewer');assert.deepEqual(args.schema,reviewSchema(snapshot.content.pageSchema,{...context,pinnedStyleRoles:[]}));return {result:output,provider:{model:'registered-model'},usage:{output_tokens:10}};},
 createDocumentRevision:async(_,args)=>{assert.equal(args.baseDocumentRevision,revision);assert.ok(args.generationJob);saves++;snapshot=JSON.parse(JSON.stringify(args.snapshot));return {revision:++revision,snapshot};}};
async function call(body={},overrides={},ownerSubject='owner'){let status=200,payload;await processQualityReview({sql:async()=>[],owner:{ownerSubject},body:{documentId:'owned',baseDocumentRevision:revision,report:{diagnostics:[],metrics:[]},...body},res:{status(s){status=s;return this;},json(v){payload=v;return this;}}},{...deps,...overrides});return {status,payload};}
await assert.rejects(call({documentId:'foreign'}),{code:'PAGE_SCHEMA_REQUIRED'});
await assert.rejects(call({baseDocumentRevision:0}),{code:'DOCUMENT_REVISION_MISMATCH'});
const saved=await call();assert.equal(saved.status,200);assert.equal(providerCalls,1);assert.equal(saves,1);assert.equal(isCurrentReview(snapshot),true);assert.equal(saved.payload.requiresApproval,false);assert.equal(snapshot.generationMeta.qualityAgentReview.execution.model,'registered-model');
assert.deepEqual(snapshot.content.pageContext,context);assert.equal(snapshot.content.pageSchema.root.children.find(n=>n.id==='design_image').assetId,'image_ready');
const cached=await call({baseDocumentRevision:0});assert.equal(cached.payload.cached,true);assert.equal(providerCalls,1);
const pending=await call({force:true},{acquireGeneration:async()=>{throw Object.assign(new Error('running'),{code:'GENERATION_IN_PROGRESS'});}});assert.equal(pending.status,202);assert.equal(providerCalls,1);
await assert.rejects(call({force:true},{generate:async()=>({result:{...result,patches:[patch({roles:['unknown']})]}})}),{code:'QUALITY_AGENT_RESULT_INVALID'});assert.equal(saves,1);assert.equal(failed,1);
output={summary:'Separate image',issues:[],patches:[patch({nodeId:'design_image',kind:'imagePresentation',roles:null,presentation:'content'})]};
const structural=await call({force:true});assert.equal(structural.payload.requiresApproval,true);assert.equal(snapshot.generationMeta.review.state,'pending');assert.equal(snapshot.content.pageSchema.root.overlayRole,null);assert.equal(snapshot.generationMeta.qualityAgentHistory.length,2);
snapshot.generationMeta.review={state:'approved'};snapshot.content.pageSchema.summary+=' changed';
await assert.rejects(call(),{code:'QUALITY_AGENT_LIMIT_REACHED'});
// Waiting clients resume a durable result, and cannot overwrite another local edit.
let client={documentId:'owned',revision:1},requests=0;
await reviewPageUntilReady({readCurrent:()=>client,report:{},wait:async()=>{},request:async()=>({pending:++requests===1,revision:requests===1?1:2,snapshot:{content:{pageSchema:{}},generationMeta:{qualityAgentReview:{}}}}),onUpdate:r=>client={...client,revision:r.revision}});assert.equal(requests,2);
await assert.rejects(reviewPageUntilReady({readCurrent:()=>client,report:{},request:async()=>{client={...client,revision:3};return {revision:3,snapshot:{}};},onUpdate(){}}),{code:'QUALITY_AGENT_DOCUMENT_CHANGED'});
const endpoint=require('../api/promo-page-quality-review');
async function api(headers={}){let status=200,payload;await endpoint({method:'POST',body:{},headers},{setHeader(){},status(s){status=s;return this;},json(p){payload=p;return this;}});return {status,payload};}
process.env.PAGE_QUALITY_REVIEW_AGENT_ENABLED='false';assert.equal((await api()).status,404);delete process.env.PAGE_QUALITY_REVIEW_AGENT_ENABLED;
assert.equal((await api()).status,401);
console.log('Quality agent: strict constrained patches, fact/asset preservation, unresolved issues, advisory facts, ownership/CAS, durable replay/poll, invalid-result rollback, model metadata, structural reapproval and bounded rounds passed.');
