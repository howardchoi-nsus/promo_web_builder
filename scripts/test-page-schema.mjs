import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {TOKEN_USAGE_RULES} from '../shared/token-usage-policy.mjs';
import {pageCss,tokenVariables,textContent,safeUrl as browserSafeUrl} from '../shared/page-schema/runtime.mjs';
const require=createRequire(import.meta.url);
const {validate,normalize,runtimeSchema,safeUrl,walk}=require('../shared/page-schema/contract.cjs');
const {generatePage,snapshotForPage,contentContext}=require('../api/_page-schema-service');
import {fixture,context} from './fixtures/page-schema.mjs';
for(const name of ['example-editorial','example-split-nested']){
 const page=fixture(name),result=validate(page,context);assert.equal(result.ok,true,JSON.stringify(result.errors));
 const normalized=normalize(page);assert.equal(validate(normalized.page,context).ok,true);
 const css=pageCss(normalized.page,context,'ps-test');assert.match(css,/grid-template-columns/);assert.match(css,/var\(--fixture-/);assert.match(css,/max-width:639px/);assert.equal(css.includes('position:absolute'),false);
 assert.deepEqual(page,fixture(name),'normalizer must not mutate input');
}
const base=fixture('example-editorial');
function reject(mutate,code){const page=structuredClone(base);mutate(page);const r=validate(page,context);assert.equal(r.ok,false,code);if(code)assert.ok(r.errors.some(e=>e.code===code),JSON.stringify(r.errors));}
reject(p=>p.root.onclick='alert(1)','PAGE_SCHEMA_INVALID');
reject(p=>p.root.children[0].id=p.root.id,'DUPLICATE_NODE_ID');
reject(p=>p.root.styles.base=['button.background'],'TOKEN_USAGE_POLICY_MISMATCH');
reject(p=>p.root.children=[],'CONTENT_SOURCE_REQUIRED');
reject(p=>{let n=p.root;for(let i=0;i<10;i++){const child=structuredClone(p.root);child.id=`nested_${i}`;child.role='group';child.children=[];n.children=[child];n=child;}},'PAGE_SCHEMA_LIMIT_EXCEEDED');
reject(p=>p.mediaRequests=[{id:'orphan',nodeId:p.root.id,kind:'image',intent:'visual',aspectRatio:'1:1',sourceIds:[]}],'MEDIA_TARGET_INVALID');
const badContext=structuredClone(context);badContext.tokenValues['--evil']='red;}body{display:none';assert.equal(validate(base,badContext).ok,false);assert.equal(Object.hasOwn(tokenVariables(badContext),'--evil'),false);
for(const url of ['javascript:alert(1)','data:image/svg+xml,test','//evil.test','https://127.0.0.1/a','https://0x7f000001/a','https://u:p@example.com','https://example.com\\@evil.test','https://[::1]/','https://10.0.0.1']){assert.equal(safeUrl(url),'',url);assert.equal(browserSafeUrl(url),'',url);}
for(const url of ['/offer','#details','https://example.com/offer'])assert.equal(safeUrl(url),browserSafeUrl(url));
const schema=runtimeSchema(context);assert.ok(schema.$defs.policyRole.enum.includes('text.primary'));assert.equal(schema.$defs.assetId.enum[0],'__unavailable__');
const c=contentContext({title:'제목',notices:['필수 고지'],legalInformation:[{body:'법적 내용'}]},context);assert.ok(Object.values(c.contentSources).some(v=>v.text==='필수 고지'));
const primitivePage=structuredClone(base),primitiveContext=structuredClone(context);
primitiveContext.assets.image_fixture={kind:'image',url:'/fixture.png'};
primitiveContext.assets.video_fixture={kind:'video',url:'https://example.com/video.mp4',hasAudio:false};
const primitive=(type,extra)=>({type,id:`primitive_${type}`,layout:structuredClone(base.root.layout),styles:{base:[],tablet:null,mobile:null},sourceIds:[],...extra});
primitivePage.root.children.push(
 primitive('container',{role:'section',purpose:'custom',label:'추가 영역',formActionId:null,children:[]}),
 primitive('grid',{children:[],layout:{...structuredClone(base.root.layout),desktop:{...base.root.layout.desktop,columns:[1,2]}}}),
 primitive('stack',{children:[]}),primitive('card',{label:'카드',children:[]}),
 primitive('text',{role:'body',headingLevel:0,contentMode:'editorial',text:'추가 안내'}),
 primitive('image',{assetId:'image_fixture',requestId:null,alt:'안내 이미지',decorative:false,aspectRatio:'4:3',fit:'cover'}),
 primitive('button',{label:'자세히 보기',actionId:'action_view_details'}),
 primitive('input',{fieldId:null,label:'이름',inputType:'text',placeholder:'이름 입력',required:false}),
 primitive('divider',{direction:'horizontal'}),primitive('icon',{iconId:'icon_check',label:'확인',decorative:false}),
 primitive('video',{assetId:'video_fixture',posterAssetId:null,captionAssetId:null,label:'소개 동영상',controls:true,autoplay:false,loop:false}));
primitiveContext.icons.icon_check={glyph:'check'};
const allTypes=validate(primitivePage,primitiveContext);assert.equal(allTypes.ok,true,JSON.stringify(allTypes.errors));
assert.ok(validate(primitivePage,primitiveContext,{final:true}).errors.some(e=>e.code==='FORM_BINDING_REQUIRED'));
primitivePage.root.children.at(-1).autoplay=true;assert.equal(validate(primitivePage,primitiveContext).ok,false);
reject(p=>{walk(p.root,({node})=>{if(node.type==='button')node.label='확정되지 않은 50% 할인';});},'UNSUPPORTED_FACT');
let request;
const generated=await generatePage({overview:{},context,promptConfig:{model:'fixture'},generate:async args=>{request=args;return {result:base,provider:{model:'fixture'}};}});
assert.equal(request.schemaName,'promo_page_schema');assert.equal(validate(generated.page,context).ok,true);assert.equal(snapshotForPage(generated.page,context).contractVersion,3);
await assert.rejects(generatePage({context,promptConfig:{},generate:async()=>({result:{...base,html:'<script/>'}})}),e=>e.code==='PAGE_SCHEMA_INVALID');
console.log('PageSchema: examples, recursive budgets, token policy, sources, URL security, provider contract and normalization passed.');
