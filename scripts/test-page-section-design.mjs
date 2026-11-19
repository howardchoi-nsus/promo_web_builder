import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {designFixture} from './fixtures/design-preview-enhancements.mjs';
import {prepareSectionDesign} from '../visual-editor/src/builder/services/page-section-design.mjs';
import {designGroups,treeNodes,sectionDesignPending,designNodeStates} from '../shared/page-schema/section-design.mjs';
const require=createRequire(import.meta.url);
const {newSectionDesign,processSectionDesign}=require('../api/_page-section-design');
const {applySectionDesign}=require('../api/_page-section-design-contract');
const {snapshotForPage}=require('../api/_page-schema-service');
const {pageStyleRoles}=require('../shared/token-usage-policy.cjs');
const {page,context}=designFixture({pending:false}),groups=designGroups(page),all=treeNodes(page);
assert.ok(groups.length>1);assert.deepEqual(groups.flatMap(group=>group.nodeIds).sort(),all.map(node=>node.id).sort());
const large=structuredClone(page);large.root.children=Array.from({length:30},(_,i)=>({...structuredClone(page.root),id:`section_${i}`,role:'section',children:[]}));
assert.equal(designGroups(large).length,12);assert.equal(new Set(designGroups(large).flatMap(group=>group.nodeIds)).size,31);
const heading=all.find(node=>node.type==='text'),group=groups.find(group=>group.nodeIds.includes(heading.id));
const role=pageStyleRoles(context).find(role=>role.target==='text'&&role.property==='color'&&role.registeredVariant);
const patch={nodeId:heading.id,viewport:'desktop',kind:'styles',roles:[role.key],spacing:null,overlayRole:null,reason:'Registered hierarchy'};
const buttonRole=pageStyleRoles(context).find(role=>role.target==='button'&&role.property==='color');
assert.throws(()=>applySectionDesign(page,context,group,{summary:'wrong target',patches:[{...patch,roles:[buttonRole.key]}]}),error=>error.code==='SECTION_DESIGN_RESULT_INVALID'&&error.retryable===true);
const original=structuredClone(page),applied=applySectionDesign(page,context,group,{summary:'Designed',patches:[patch]});
assert.deepEqual(page,original);assert.notDeepEqual(applied.page,original);
assert.throws(()=>applySectionDesign(page,context,group,{summary:'bad',patches:[{...patch,text:'invented'}]}),{code:'SECTION_DESIGN_RESULT_INVALID'});
assert.throws(()=>applySectionDesign(page,context,group,{summary:'bad',patches:[{...patch,kind:'layout'}]}),{code:'SECTION_DESIGN_RESULT_INVALID'});
assert.throws(()=>applySectionDesign(page,context,group,{summary:'bad',patches:[{...patch,roles:['--invented']}]}),{code:'SECTION_DESIGN_RESULT_INVALID'});
assert.throws(()=>applySectionDesign(page,context,group,{summary:'bad',patches:[patch,patch]}),{code:'SECTION_DESIGN_RESULT_INVALID'});
assert.throws(()=>applySectionDesign(page,context,group,{summary:'bad',patches:[{...patch,nodeId:groups.find(g=>g.id!==group.id).nodeIds[0]}]}),{code:'SECTION_DESIGN_RESULT_INVALID'});
let revision=1,snapshot=snapshotForPage(page,context),calls=0,failed=0,model='registered-model',invalid=false;
snapshot.generationMeta.review={state:'approved'};snapshot.generationMeta.sectionDesign=newSectionDesign(page);
const deps={fetchDocument:async(_,id,subject)=>id==='owned'&&subject==='owner'?{document:{id,currentDocumentRevision:revision},snapshot}:null,
 createPromptExecutionSnapshot:async(_,type,vars)=>{assert.equal(type,'promo_page_section_designer');assert.ok(JSON.parse(vars.sectionJson).nodeIds.length);return {promptConfig:{promptId:'designer',promptVersion:1,model,provider:'openai',skillSnapshots:[]}};},
 acquireGeneration:async(_,args)=>({...args,claimToken:'claim'}),failGeneration:async()=>failed++,
 generate:async()=>{calls++;return {result:invalid?{summary:'bad',patches:[{...patch,roles:['--invented']}]}:{summary:'Designed',patches:[]},provider:{}};},
 createDocumentRevision:async(_,args)=>{assert.equal(args.baseDocumentRevision,revision);assert.ok(args.generationJob);snapshot=args.snapshot;return {revision:++revision,snapshot};}};
async function call(body={},owner='owner'){let payload,status=200;try{await processSectionDesign({sql:{},owner:{ownerSubject:owner},body:{documentId:'owned',baseDocumentRevision:revision,runId:snapshot.generationMeta.sectionDesign.id,groupId:snapshot.generationMeta.sectionDesign.groups.find(g=>!snapshot.generationMeta.sectionDesign.completed.some(c=>c.id===g.id))?.id,...body},res:{status(code){status=code;return this;},json(value){payload=value;return this;}}},deps);return {status,payload};}catch(error){return {status:error.statusCode||500,error};}}
assert.equal((await call({},'other')).status,404);
assert.equal((await call({runId:'old'})).error.code,'SECTION_DESIGN_RUN_CHANGED');
assert.equal((await call({baseDocumentRevision:0})).error.code,'DOCUMENT_REVISION_MISMATCH');
assert.equal((await call({groupId:groups.at(-1).id})).error.code,'SECTION_DESIGN_ORDER_INVALID');
const acquire=deps.acquireGeneration;deps.acquireGeneration=async()=>{throw Object.assign(new Error('running'),{code:'GENERATION_IN_PROGRESS'});};
assert.equal((await call()).status,202);assert.equal(calls,0);deps.acquireGeneration=acquire;
assert.equal((await call()).status,200);assert.equal(calls,1);assert.ok(sectionDesignPending(snapshot));
assert.equal(designNodeStates(snapshot)[0].state,'ready');
assert.equal((await call({groupId:groups[0].id,baseDocumentRevision:0})).payload.cached,true);assert.equal(calls,1);
model='changed';assert.equal((await call()).error.code,'SECTION_DESIGN_PROMPT_CHANGED');model='registered-model';
invalid=true;const saved=structuredClone(snapshot);assert.equal((await call()).status,422);assert.deepEqual(snapshot,saved);assert.equal(failed,1);invalid=false;
while(sectionDesignPending(snapshot))assert.equal((await call()).status,200);
assert.equal(snapshot.generationMeta.sectionDesign.state,'complete');
// Resume skips durable completed design, finishes its media, then designs the next group.
let clientRevision=1,client=snapshotForPage(designFixture().page,designFixture().context),events=[];
client.generationMeta.review={state:'approved'};client.generationMeta.sectionDesign=newSectionDesign(client.content.pageSchema);
const first=client.generationMeta.sectionDesign.groups[0];client.generationMeta.sectionDesign.completed=[{id:first.id,summary:'persisted'}];
await prepareSectionDesign({readCurrent:()=>({documentId:'doc',revision:clientRevision,snapshot:client}),request:async body=>{
 events.push('design:'+body.groupId);const next=structuredClone(client),plan=next.generationMeta.sectionDesign;plan.completed.push({id:body.groupId,summary:'done'});if(plan.completed.length===plan.groups.length)plan.state='complete';return {revision:clientRevision+1,snapshot:next};},onUpdate:saved=>{client=saved.snapshot;clientRevision=saved.revision;},prepareMedia:async group=>{events.push('media:'+group.id);client=structuredClone(client);client.content.pageSchema.mediaRequests=client.content.pageSchema.mediaRequests.filter(req=>!group.nodeIds.includes(req.nodeId));clientRevision++;},wait:async()=>{}});
assert.equal(events[0],'media:'+first.id);assert.ok(!events.includes('design:'+first.id));assert.equal(sectionDesignPending(client),false);
assert.throws(()=>require('../api/_promo-quality-gate').assertPassedQualityGate({...snapshot,generationMeta:{...snapshot.generationMeta,sectionDesign:{...snapshot.generationMeta.sectionDesign,state:'pending'}}},revision),{code:'SECTION_DESIGN_PENDING'});
console.log('Section design: grouping, strict token-only scope, immutable facts/assets/layout, CAS/cache/config/failure, ordered real design/media and export gate passed');

assert.equal(require('../api/_promo-builder-flags').builderFlags({}).sectionDesignV1,false);
assert.equal(require('../api/_promo-builder-flags').builderFlags({PAGE_SCHEMA_SECTION_DESIGN_ENABLED:'true'}).sectionDesignV1,true);
const config=deps.createPromptExecutionSnapshot;snapshot.generationMeta.sectionDesign=newSectionDesign(snapshot.content.pageSchema);
deps.createPromptExecutionSnapshot=async()=>{throw new Error('Active promo_page_section_designer prompt template not found');};
assert.equal((await call()).error.code,'SECTION_DESIGN_PROMPT_REQUIRED');deps.createPromptExecutionSnapshot=config;

const staleSnapshot=structuredClone(snapshot);staleSnapshot.generationMeta.sectionDesign=newSectionDesign(staleSnapshot.content.pageSchema);
let staleDoc='first',updated=false;
await assert.rejects(prepareSectionDesign({readCurrent:()=>({documentId:staleDoc,revision:1,snapshot:staleSnapshot}),request:async()=>{staleDoc='second';return {revision:2,snapshot:staleSnapshot};},onUpdate:()=>{updated=true;},prepareMedia:async()=>{}}),{code:'SECTION_DESIGN_DOCUMENT_CHANGED'});
assert.equal(updated,false);
