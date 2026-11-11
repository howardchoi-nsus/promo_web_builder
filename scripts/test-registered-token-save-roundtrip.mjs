import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {analyzeTokenLibrary,tokenCssProperties} from '../shared/design-token-library.mjs';
import {createTokenUsageDraft,validateTokenUsagePolicy} from '../shared/token-usage-policy.mjs';
const require=createRequire(new URL('../package.json',import.meta.url));
const store=require('./api/_design-token-store');
const seed=JSON.parse(fs.readFileSync(new URL('../data/design-tokens/dark-library.json',import.meta.url),'utf8'));
const analysis=analyzeTokenLibrary([...seed,{category:'Color',type:'color',name:'--text-primary',value:'#eeeeee',reference:''}]);
const tokens=analysis.tokens.filter(t=>t.state==='active'&&t.type!=='typography');
const catalog=tokens.map(t=>({...t,tokenKey:t.name,value:analysis.resolved[t.name],cssProperties:tokenCssProperties(t)}));
const values=Object.fromEntries(catalog.map(t=>[t.name,t.value]));
const policy=createTokenUsageDraft(catalog);policy.bindings['text.primary']='--text-primary';
if(!validateTokenUsagePolicy(policy,catalog,{activation:true}).ok)throw Error('Invalid audit fixture policy');
const version={id:'11111111-1111-4111-8111-111111111111',setKey:'design-system',version:1,status:'active',values:catalog.map(t=>({...t,tokenKey:t.name,value:t.value,valueType:t.type,metadata:{libraryToken:t,state:'active'}}))};
require.cache[require.resolve('./api/_design-token-store')].exports={...store,fetchTokenVersion:async()=>version};
const {normalizeEditorSnapshot}=require('./api/promo-builder-documents');
const {layoutTokenPolicy}=require('./shared/layout-token-policy.cjs');
const snapshot={contractVersion:3,documentRevision:1,content:{runtimeTheme:{designTokenSetVersionId:version.id,designTokens:{policy:'registered-only',values,catalog,usagePolicy:policy}},formTemplate:{},sectionSnapshot:[],sectionInputs:{},sectionOrder:[]},designSpec:{contractVersion:1},assets:{},motionSpec:{}};
const incoming={...snapshot,qualityGate:{state:'passed',blockingCount:0,results:{desktop:{blockingCount:0},mobile:{blockingCount:0}}}};
const before=snapshot.content.runtimeTheme.designTokens;
const updated=await normalizeEditorSnapshot({},snapshot,incoming,version.id,1);
const after=updated.content.runtimeTheme.designTokens;
let exportResult;try{require('./api/_promo-quality-gate').assertPassedQualityGate(updated,2);exportResult='passed';}catch(error){exportResult=error.code;}
assert.deepEqual(after,before);
assert.equal(exportResult,'passed');
assert.equal(updated.designSpec.theme?.textColorToken,undefined); // Certification cannot rewrite inspected styles.
const changed=JSON.parse(JSON.stringify(incoming));changed.designSpec.theme={textColorToken:'--button-label-default'};
await assert.rejects(normalizeEditorSnapshot({},snapshot,changed,version.id,1),{code:'QUALITY_SNAPSHOT_CHANGED'});
const edited=await normalizeEditorSnapshot({},snapshot,{...snapshot,qualityGate:{state:'pending'}},version.id,1);
assert.equal(edited.qualityGate.state,'pending');
assert.equal(edited.content.runtimeTheme.designTokens.policy,'registered-only');
assert.equal(edited.content.runtimeTheme.designTokens.catalog.length,catalog.length);
assert.equal(edited.designSpec.theme.textColorToken,'--text-primary');
console.log('Real legacy V3 save roundtrip: catalog, policy, text binding, exact quality snapshot and pending edits passed.');

const {createDocumentRevision}=require('./api/_promo-builder-document-store');
const broken=structuredClone(snapshot);delete broken.content.runtimeTheme.designTokens.policy;
await assert.rejects(createDocumentRevision(()=>{throw Error('invalid policy reached database');},{snapshot:broken,baseDocumentRevision:1}),{code:'OUTPUT_TOKEN_POLICY_REQUIRED'});
