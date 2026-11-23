import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url),{normalize}=require('../shared/page-schema/contract.cjs'),{snapshotForPage}=require('../api/_page-schema-service');
const {prepareAutomaticSnapshot,assertStructureReady}=require('../api/_page-structure-state');
assert.equal(require('../api/_promo-builder-flags').builderFlags({}).automaticPageFlow,true);
assert.equal(require('../api/_promo-builder-flags').builderFlags({PAGE_SCHEMA_AUTO_FLOW_ENABLED:'false'}).automaticPageFlow,false);
const snapshot=snapshotForPage(normalize(fixture('example-editorial')).page,context);prepareAutomaticSnapshot(snapshot,1,{design:true});
assert.equal(snapshot.generationMeta.review.state,'ready');assert.equal(snapshot.generationMeta.review.approvedAt,undefined);assert.equal(snapshot.generationMeta.sectionDesign.state,'pending');assertStructureReady(snapshot);
const changed=structuredClone(snapshot);changed.content.pageSchema.root.layout.desktop.justify='center';assert.throws(()=>assertStructureReady(changed),{code:'PAGE_STRUCTURE_VALIDATION_STALE'});
const invalid=structuredClone(snapshot);invalid.content.pageSchema.root.styles.base.push('button.background');assert.throws(()=>prepareAutomaticSnapshot(invalid,1));
const {customerProgress}=await import('../visual-editor/src/builder/services/customer-progress.mjs');
const logs=[{id:'u',role:'user',text:'make'},...Array.from({length:12},(_,i)=>({id:'s'+i,type:'status',operationId:'wireframe-1',text:i+' saved',status:'in_progress'})),{id:'d',type:'status',operationId:'page-design-1',text:'details',status:'completed'},{id:'q',type:'status',operationId:'page-quality-1',text:'품질 검사를 통과했습니다. 출력을 사용할 수 있습니다.',status:'completed'}];
assert.deepEqual(customerProgress(logs).filter(m=>m.type==='status').map(m=>m.text),['구성 중','디자인·이미지 적용 중','완성']);assert.equal(logs.length,15);
const {pageNodeDescriptor}=await import('../shared/page-schema/node-descriptor.mjs');const submit=pageNodeDescriptor({type:'button',id:'submit',label:'Submit',actionId:'submit'},{...context,actions:{submit:{kind:'submit',href:'/submit'}}},{mediaRequests:[]});assert.equal(submit.attrs.type,'submit');
console.log('Automatic flow: validated ready provenance, no fake approvals, stale/invalid structure rejection, compact customer progress with intact logs, submit renderer passed.');

const {automaticRequest}=await import('../visual-editor/src/builder/services/automatic-request.mjs');
let attempts=0,retries=0;const payload={requestId:'same-request'};
assert.equal(await automaticRequest(async value=>{assert.equal(value,payload);if(++attempts===1)throw Object.assign(Error('transient'),{retryable:true,status:503});return 'saved';},payload,{enabled:true,wait:async()=>{},onRetry:()=>retries++}),'saved');assert.equal(attempts,2);assert.equal(retries,1);
attempts=0;await assert.rejects(()=>automaticRequest(async()=>{attempts++;throw Object.assign(Error('invalid'),{retryable:true,status:422});},payload,{enabled:true,wait:async()=>{}}));assert.equal(attempts,1);
