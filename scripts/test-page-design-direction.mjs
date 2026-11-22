import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),{designDirection,savedDesignBrief}=require('../api/_page-design-direction');
const {designBrief}=require('../api/_page-schema-design');const {pageGenerationStyleRoles}=require('../shared/token-usage-policy.cjs');
import {context} from './fixtures/page-schema.mjs';
const original=designBrief({},{requestText:'프리미엄 레드 #aa1122 굵은 제목 좌측 카피 시네마틱',instruction:'중앙 카피로 바꿔줘'});
assert.equal(original.artDirection.composition.hero,'center');assert.ok(original.tokenPreferences.values.includes('#aa1122'));assert.equal(original.briefVersion,2);
assert.equal(original.briefHash,designBrief({},{requestText:original.requestText,instruction:original.revisionRequest}).briefHash);
assert.notEqual(original.briefHash,designBrief({},{requestText:'미니멀'}).briefHash);
assert.equal(designDirection({previous:original}).requestText,original.requestText);assert.equal(savedDesignBrief({generationMeta:{design:original}}),original);
const ctx=structuredClone(context);ctx.styleChoicesVersion=1;ctx.designBrief=original;
for(let i=0;i<30;i++){const name=`--text-colour-${String(i).padStart(2,'0')}`,value=i===29?'#aa1122':`#${String(i).padStart(6,'0')}`;ctx.tokenCatalog.push({name,tokenKey:name,type:'color',value,state:'active',cssProperties:['color']});ctx.tokenValues[name]=value;}
const selected=pageGenerationStyleRoles(ctx);assert.ok(selected.some(role=>ctx.tokenValues[role.token]==='#aa1122'));
assert.ok(selected.filter(role=>role.target==='text'&&role.property==='color'&&role.registeredVariant).length<=6);
for(const file of ['_page-section-design.js','_page-quality-agent.js','_page-schema-media-service.js'])assert.ok(readFileSync(new URL('../api/'+file,import.meta.url),'utf8').includes('savedDesignBrief'));
console.log('Design direction: provenance/hash/revision continuity, bounded request-aware token choice and all downstream carriers passed.');

const next=designDirection({previous:original,request:original.requestText,instruction:'본문 문구를 짧게 해줘'});assert.equal(next.artDirection.composition.hero,'center');assert.deepEqual(next.tokenPreferences.values,original.tokenPreferences.values);

const publicRecord=require('../api/_promo-publication-store').publicationEnvelope({snapshot_json:{content:{pageContext:{designBrief:original}},generationMeta:{draftTimings:[{modelMs:123}],design:original,review:{state:'approved'}}}});assert.equal(publicRecord.snapshot.content.pageContext.designBrief,undefined);assert.equal(publicRecord.snapshot.generationMeta.design,undefined);assert.equal(publicRecord.snapshot.generationMeta.review.state,'approved');

assert.equal(publicRecord.snapshot.generationMeta.draftTimings,undefined);
