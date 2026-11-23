import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url),{imageRequirements,unitImageRequirements,assertImageCoverage}=require('../api/_page-image-requirements'),{mobileOnlyPage}=require('../api/_page-mobile-edit');
const ctx=structuredClone(context);ctx.contentSources={title:{path:'contentSections.0.title',text:'Hero'},card:{paths:['contentSections.0.items.0.title'],text:'Card'}};
const overview={contentSections:[{media:{imageIntent:'Hero visual'},items:[{imageIntent:'Reward visual'}]}]};const requirements=imageRequirements(overview,ctx);assert.equal(requirements.length,2);assert.deepEqual(requirements[1].sourceIds,['card']);
const plan={regions:[{sourceIds:['title']},{sourceIds:['card']}]};assert.equal(unitImageRequirements(requirements,plan,0).length,1);assert.equal(unitImageRequirements(requirements,plan,1).length,1);
const page={root:{type:'container',children:[]},mediaRequests:[]};assert.throws(()=>assertImageCoverage(page,ctx,requirements),{code:'PAGE_IMAGE_PLAN_INCOMPLETE'});
page.root.children.push({type:'image',id:'hero',sourceIds:['title'],requestId:'h'});page.mediaRequests.push({id:'h',nodeId:'hero',sourceIds:['title']});assert.throws(()=>assertImageCoverage(page,ctx,requirements),{code:'PAGE_IMAGE_PLAN_INCOMPLETE'});
page.root.children.push({type:'image',id:'card',sourceIds:['card'],requestId:'c'});page.mediaRequests.push({id:'c',nodeId:'card',sourceIds:['card']});assertImageCoverage(page,ctx,requirements);
const before=structuredClone(page);assertImageCoverage(page,ctx,requirements);assert.deepEqual(page,before);
page.mediaRequests=[];ctx.assets={hero_asset:{kind:'image',url:'/hero.png'},card_asset:{kind:'image',url:'/card.png'}};page.root.children[0].assetId='hero_asset';page.root.children[1].assetId='card_asset';assertImageCoverage(page,ctx,requirements);
const old=fixture('example-editorial'),proposal=structuredClone(old);proposal.root.layout.mobile={...proposal.root.layout.desktop,direction:'column',align:'center'};proposal.root.layout.desktop.align='end';proposal.summary='unwanted';proposal.root.children[0].label='unwanted';
const result=mobileOnlyPage(old,proposal);assert.deepEqual(result.root.layout.mobile,proposal.root.layout.mobile);assert.deepEqual(result.root.layout.desktop,old.root.layout.desktop);assert.equal(result.summary,old.summary);assert.equal(result.root.children[0].label,old.root.children[0].label);assert.deepEqual(old,fixture('example-editorial'));
proposal.root.children=[];assert.throws(()=>mobileOnlyPage(old,proposal),{code:'MOBILE_EDIT_STRUCTURE_CHANGED'});
const review=readFileSync(new URL('../visual-editor/src/builder/CompositionReview.vue',import.meta.url),'utf8').split('<template>')[1];for(const text of ['Revision','발행 결과와 동일한','현재 미리보기 기준','TokenUsageReport','qualityLabel'])assert.equal(review.includes(text),false,text);
console.log('Preview policy: explicit section/card image coverage, unit ownership, asset readiness, preserved inputs, mobile-only projection and clean preview header passed.');

const {contentContext,plannerContext,generatePage}=require('../api/_page-schema-service');
const derived=contentContext({contentSections:[{title:'Hero',media:{imageIntent:'Key visual'},items:[{title:'Reward',imageIntent:'Reward image'}]}]},context);
assert.equal(derived.imageRequirements.length,2);assert.deepEqual(plannerContext(derived).imageRequirements,derived.imageRequirements);
await assert.rejects(()=>generatePage({overview:{},context:{...context,imageRequirements:[{id:'hero',intent:'Visual',sourceIds:['source_title']}]},generate:async()=>({result:fixture('example-editorial')})}),{code:'PAGE_IMAGE_PLAN_INCOMPLETE'});

for(const intent of ['none','없음','text-only','미정',''])assert.deepEqual(imageRequirements({contentSections:[{media:{imageIntent:intent}}]},ctx),[]);

for(const node of page.root.children){ctx.assets[node.assetId].sourceIds=[...node.sourceIds];node.sourceIds=[];}assertImageCoverage(page,ctx,requirements);

// A shared-source image must not starve another requirement (augmenting match).
const overlapping={root:{type:'container',children:[{type:'image',id:'shared',assetId:'shared'},{type:'image',id:'only_a',assetId:'only_a'}]},mediaRequests:[]};
assertImageCoverage(overlapping,{assets:{shared:{kind:'image',sourceIds:['a','b']},only_a:{kind:'image',sourceIds:['a']}}},[{id:'a',sourceIds:['a']},{id:'b',sourceIds:['b']}]);
assert.throws(()=>assertImageCoverage({...overlapping,root:{type:'container',children:overlapping.root.children.slice(0,1)}},{assets:{shared:{kind:'image',sourceIds:['a','b']}}},[{id:'a',sourceIds:['a']},{id:'b',sourceIds:['b']}]),{code:'PAGE_IMAGE_PLAN_INCOMPLETE'});
const {isMobileLayoutRequest}=await import('../visual-editor/src/builder/services/mobile-layout-intent.mjs');
for(const text of ['모바일 배치를 구성해줘','모바일도 만들어줘','mobile layout please'])assert.equal(isMobileLayoutRequest(text),true,text);
for(const text of ['모바일 게임 혜택으로 구성해줘','모바일 제목 문구를 수정해줘','모바일 배치와 이미지를 바꿔줘'])assert.equal(isMobileLayoutRequest(text),false,text);
assert.equal(isMobileLayoutRequest('모바일 배치를 구성해줘',{hasPendingAttachment:true}),false);
