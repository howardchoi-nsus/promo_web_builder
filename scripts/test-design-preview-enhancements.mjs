import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {designFixture,png} from './fixtures/design-preview-enhancements.mjs';
import {analyzeTokenLibrary,tokenCssProperties} from '../shared/design-token-library.mjs';
import {pageStyleRoles} from '../shared/token-usage-policy.mjs';
import {pageCss} from '../shared/page-schema/runtime.mjs';
import {preparePageMedia} from '../visual-editor/src/builder/services/page-media-preparation.mjs';
const require=createRequire(import.meta.url);
const {assertValid,runtimeSchema}=require('../shared/page-schema/contract.cjs');
const {snapshotForPage,reusePreparedMedia}=require('../api/_page-schema-service');
const {processPageMedia}=require('../api/_page-schema-media-service');
const {loadPageAssets,normalizeRegisteredAsset}=require('../api/_page-schema-catalog');
const {page,context,role}=designFixture();
assertValid(page,context);
assert.doesNotThrow(()=>require('../api/_promo-builder-export-adapters').assertNuxtRuntimeCompatibility(snapshotForPage(page,context)));
const extraTokens=analyzeTokenLibrary([{category:'Border Style',type:'borderStyle',name:'--border-style-solid',value:'solid',reference:''},{category:'Gradient',type:'gradient',name:'--hero-overlay',value:'linear-gradient(transparent, #000000)',reference:''},{category:'Measurement',type:'dimension',name:'--hero-min-height',value:'100svh',reference:''}]);
assert.deepEqual(extraTokens.errors,[]);assert.deepEqual(tokenCssProperties(extraTokens.tokens[0]),['border-style']);assert.deepEqual(tokenCssProperties(extraTokens.tokens[1]),['background-image']);assert.deepEqual(tokenCssProperties(extraTokens.tokens[2]),['min-height']);
assert.ok(analyzeTokenLibrary([{category:'Gradient',type:'gradient',name:'--bad-gradient',value:'linear-gradient(url(https://evil.example), #000000)',reference:''}]).errors.length);

const Ajv=require('ajv/dist/2020').default,provider=new Ajv({strict:false}).compile(runtimeSchema(context));
assert.equal(provider(page),true,JSON.stringify(provider.errors));
// Adding registered tokens must not invalidate a previously selected token.
const expanded=structuredClone(context);
for(let index=0;index<20;index++){const name=`--typography-title-00-${index}-font-size`,value=`${100+index}px`;expanded.tokenValues[name]=value;expanded.tokenCatalog.push({name,value,state:'active',cssProperties:['font-size']});}
assertValid(page,expanded);
expanded.pinnedStyleRoles=[role('--typography-title-2xl-font-size'),role('--typography-title-md-font-size')];
const expandedProvider=new Ajv({strict:false}).compile(runtimeSchema(expanded));assert.equal(expandedProvider(page),true,JSON.stringify(expandedProvider.errors));
const removed=structuredClone(context);delete removed.tokenValues['--typography-title-2xl-font-size'];removed.tokenCatalog=removed.tokenCatalog.filter(token=>token.name!=='--typography-title-2xl-font-size');assert.throws(()=>assertValid(page,removed));
const bad=structuredClone(page);bad.root.styles.base=[role('--typography-title-2xl-font-size')];assert.equal(provider(bad),false);
assert.throws(()=>assertValid(bad,context),e=>e.errors.some(e=>e.code==='TOKEN_USAGE_POLICY_MISMATCH'));
assert.ok(pageCss(page,context,'ps-design').includes('font-size:var(--typography-title-2xl-font-size)'));
assert.ok(pageCss(page,context,'ps-design').includes('border-style:var(--border-style-solid)'));
const restricted=structuredClone(context);restricted.tokenCatalog.push({name:'--button-only-color',value:'#fff',state:'active',cssProperties:['color']});restricted.tokenValues['--button-only-color']='#fff';
assert.ok(!pageStyleRoles(restricted).some(r=>r.target==='text'&&r.token==='--button-only-color'));
restricted.tokenCatalog.push({name:'--icon-color-default',value:'#777777',state:'active',cssProperties:['color']});restricted.tokenValues['--icon-color-default']='#777777';
assert.ok(pageStyleRoles(restricted).some(r=>r.target==='icon'&&r.token==='--icon-color-default'));
assert.ok(!pageStyleRoles(restricted).some(r=>r.target==='text'&&r.token==='--icon-color-default'));
assert.deepEqual(tokenCssProperties({type:'dimension',name:'--icon-size-md'}),['font-size']);
const definition=require('../api/_item-components-store').validateDefinition({fields:[{name:'아이콘',fieldKind:'text',textType:'title'}],capabilities:{pageSchemaAsset:{kind:'icon',text:'♠'}}});
assert.equal(definition.capabilities.pageSchemaAsset.text,'♠');assert.equal(definition.fields[0].capabilities.pageSchemaAsset.text,'♠');
assert.throws(()=>normalizeRegisteredAsset({kind:'icon',url:'javascript:alert(1)'}));assert.throws(()=>normalizeRegisteredAsset({kind:'icon',text:'<svg>'}));
const catalog=await loadPageAssets({}, {fetch:async()=>[{id:'component',name:'브랜드 기호',status:'active',activeVersion:{id:'v1',status:'active',capabilities:{pageSchemaAsset:{kind:'icon',text:'♠'}}}},{id:'draft',status:'active',activeVersion:{id:'v0',status:'draft',capabilities:{pageSchemaAsset:{kind:'image',url:'/draft.png'}}}}]});
assert.equal(Object.values(catalog.icons).filter(i=>i.text==='♠').length,1);assert.equal(Object.keys(catalog.assets).length,0);
let snapshot=snapshotForPage(page,context),revision=1,providers=0,saves=0,claims=0,cleanups=0,failures=0;
snapshot.generationMeta.review={state:'approved'};
const deps={assertReady:async()=>{},fetchDocument:async()=>({document:{id:'document',currentDocumentRevision:revision},snapshot}),createPromptExecutionSnapshot:async()=>({promptConfig:{renderedPrompt:'managed prompt',provider:'openai',model:'fixture'}}),acquireGeneration:async(_,input)=>{claims++;return {...input,claimToken:'claim'};},failGeneration:async()=>{failures++;},generateSectionImage:async()=>{providers++;return {bytes:png,mimeType:'image/png',width:1,height:1};},blob:async()=>({put:async()=>({url:'https://blob.example/image',pathname:'image'}),del:async()=>{cleanups++;}}),createDocumentRevision:async(_,input)=>{assert.ok(input.generationJob);assert.equal(input.baseDocumentRevision,revision);assertValid(input.snapshot.content.pageSchema,input.snapshot.content.pageContext);snapshot=input.snapshot;saves++;return {revision:++revision,snapshot};}};
const sql=async()=>[];
async function media(body,overrides={}){let status=200,payload;const res={status(s){status=s;return this;},json(p){payload=p;return this;}};await processPageMedia({req:{method:'POST'},res,sql,owner:{ownerSubject:'owner'},body:{documentId:'document',baseDocumentRevision:revision,nodeId:'design_image',requestId:'design_request',...body}},{...deps,...overrides});return {status,payload};}
const before=structuredClone(page);
const saved=await media({});assert.equal(saved.status,200);assert.equal(providers,1);assert.equal(claims,1);assert.equal(saves,1);assert.equal(cleanups,0);assert.equal(snapshot.content.pageSchema.mediaRequests.length,0);
assert.equal(snapshot.content.pageSchema.root.children.at(-1).presentation,'background');assert.equal(snapshot.generationMeta.review.state,'approved');
const reused=structuredClone(before);reusePreparedMedia(reused,snapshot.content.pageContext,snapshot);assert.equal(reused.mediaRequests.length,0);assert.ok(reused.root.children.at(-1).assetId);
const forceNew=structuredClone(before);forceNew.mediaRequests[0].regenerate=true;reusePreparedMedia(forceNew,snapshot.content.pageContext,snapshot);assert.equal(forceNew.mediaRequests.length,1);
const changedIntent=structuredClone(before);changedIntent.mediaRequests[0].intent='다른 시각 소재';reusePreparedMedia(changedIntent,snapshot.content.pageContext,snapshot);assert.equal(changedIntent.mediaRequests.length,1);
const replay=await media({baseDocumentRevision:1});assert.equal(replay.payload.replayed,true);assert.equal(providers,1);
// In-progress work is polled without another paid provider call.
snapshot=snapshotForPage(before,context);snapshot.generationMeta.review={state:'approved'};
const pending=await media({}, {acquireGeneration:async()=>{throw Object.assign(new Error('running'),{code:'GENERATION_IN_PROGRESS'});}});assert.equal(pending.status,202);assert.equal(providers,1);
// Failure after upload cleans orphan assets and does not mark the job complete.
await assert.rejects(()=>media({}, {createDocumentRevision:async()=>{throw Object.assign(new Error('conflict'),{code:'DOCUMENT_REVISION_MISMATCH'});}}));assert.equal(cleanups,1);assert.equal(failures,1);
// A new structure arriving during generation must not receive the old image.
await assert.rejects(()=>media({}, {generateSectionImage:async()=>{snapshot=structuredClone(snapshot);snapshot.content.pageSchema.root.layout.desktop.direction='row';return {bytes:png,mimeType:'image/png',width:1,height:1};}}),e=>e.code==='MEDIA_REQUEST_SUPERSEDED');assert.equal(cleanups,2);
// Client orchestration updates durable results, polls, and stops on document switches.
let current={documentId:'doc',revision:1,snapshot:snapshotForPage(before,context)},requests=0;
current.snapshot.generationMeta.review={state:'approved'};
await preparePageMedia({readCurrent:()=>current,wait:async()=>{},request:async()=>{requests++;const next=structuredClone(current.snapshot);if(requests>1)next.content.pageSchema.mediaRequests=[];return {pending:requests===1,revision:requests===1?1:2,snapshot:next};},onUpdate:r=>current={...current,revision:r.revision,snapshot:r.snapshot}});
assert.equal(requests,2);assert.equal(current.revision,2);
console.log('Design preview: registered style hierarchy, target constraints, icon registration, media save/replay/poll/failure cleanup/supersession and sequential orchestration passed.');
