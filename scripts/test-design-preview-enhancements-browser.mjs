import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {fixture,context} from './fixtures/page-schema.mjs';
import {pageStyleRoles} from '../shared/token-usage-policy.mjs';
import {designFixture,png} from './fixtures/design-preview-enhancements.mjs';
const require=createRequire(import.meta.url);
const {snapshotForPage}=require('../api/_page-schema-service');
const {normalize,walk}=require('../shared/page-schema/contract.cjs');
const {repairPageQuality}=require('../api/_page-schema-quality-repair');
const {structuralHash}=require('../api/_page-schema-design');
let repairCalls=0,agentEnabled=false,agentCalls=0,reviewConfigured=true,agentPatchKind='styles';
const {processQualityReview}=require('../api/_page-quality-agent');
let revision=0,snapshot,generated=0,edited=0,approved=0,savedGate,mediaCalls=0;
const errors=[],requests=[];
const overview={title:'동적 페이지 테스트',leadText:'혜택 안내',promotionPurpose:'기타',promotionPurposeOther:'프로모션',market:'한국',audience:'일반고객',campaignTone:'친근함',mainOffer:'',_review:{missingCriticalInputs:['mainOffer']},contentSections:[],additionalInformation:[{label:'기간',value:'미정',confirmationRequired:true}],notices:[],legalInformation:[]};
const root=resolve(new URL('..',import.meta.url).pathname);
const server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname.startsWith('/api/')){
  requests.push(pathname);let body={};if(['POST','PUT','PATCH'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  let payload={ok:true};
  if(pathname==='/api/promo-builder-capabilities')payload.capabilities={aiMode:true,pageSchemaV1:true,qualityReviewAgent:agentEnabled,compositionV3:true,export:true};
  if(pathname==='/api/promo-builder-documents'&&req.method==='GET')payload={ok:true,document:{id:'browser-doc',currentDocumentRevision:revision,mode:'ai'},snapshot};
  if(pathname==='/api/promo-builder-documents'&&req.method==='POST')payload.document={id:'browser-doc',currentDocumentRevision:0};
  if(pathname==='/api/promo-overview-parse')payload={ok:true,overview,overviewFingerprint:'fixture',missingCriticalInputs:['mainOffer'],warnings:[]};
  if(pathname==='/api/promo-page-quality-review'){
   res.status=function(code){this.statusCode=code;return this;};res.json=function(value){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(value));return this;};
   try{return await processQualityReview({sql:async()=>[],owner:{ownerSubject:'browser'},body,res},{
    fetchDocument:async()=>({document:{id:'browser-doc',currentDocumentRevision:revision},snapshot}),
    createPromptExecutionSnapshot:async(_,type,variables)=>{if(!reviewConfigured)throw new Error('Active promo_page_quality_reviewer prompt template not found');assert.equal(type,'promo_page_quality_reviewer');assert.ok(JSON.parse(variables.qualityReportJson).metrics.some(m=>m.viewport==='mobile'));return {promptConfig:{promptId:'reviewer',promptVersion:1,provider:'openai',model:'fixture-review-model',renderedPrompt:'review guidance'}};},
    acquireGeneration:async(_,job)=>({...job,claimToken:'browser-claim'}),failGeneration:async()=>{},
    generate:async()=>{agentCalls++;if(agentPatchKind==='imagePresentation')return {provider:{model:'fixture-review-model'},result:{summary:'이미지를 문구와 분리했습니다.',issues:[],patches:[{nodeId:'design_image',viewport:'desktop',kind:'imagePresentation',roles:null,spacing:null,layout:null,presentation:'content',overlayRole:null,reason:'Keep key visual visible'}]}};let heading;walk(snapshot.content.pageSchema.root,({node})=>{if(!heading&&node.type==='text'&&node.role==='heading')heading=node;});const roles=pageStyleRoles(snapshot.content.pageContext),white=roles.find(r=>r.target==='text'&&r.token==='--color-neutral-100');return {provider:{model:'fixture-review-model'},result:{summary:'제목 색상 위계를 정리했습니다.',issues:[{nodeId:heading.id,category:'hierarchy',severity:'warning',message:'제목을 명확히 구분합니다.',resolvedByPatch:true}],patches:[{nodeId:heading.id,viewport:'desktop',kind:'styles',roles:heading.styles.base.filter(key=>roles.find(r=>r.key===key)?.property!=='color').concat(white.key),spacing:null,layout:null,presentation:null,overlayRole:null,reason:'Improve title hierarchy'}]}};},
    createDocumentRevision:async(_,args)=>{assert.equal(args.baseDocumentRevision,revision);snapshot=args.snapshot;snapshot.documentRevision=++revision;return {snapshot,revision};}
   });}catch(e){return res.status(e.statusCode||500).json({error:e.message,code:e.code});}
  }
  if(pathname==='/api/promo-page-schema'&&body.operation==='repair-quality'){
   repairCalls++;assert.equal(body.baseDocumentRevision,revision);
   const repaired=repairPageQuality(snapshot.content.pageSchema,snapshot.content.pageContext,body.diagnostics);
   const requiresApproval=structuralHash(repaired.page)!==structuralHash(snapshot.content.pageSchema);
   if(repaired.changed){snapshot.content.pageSchema=repaired.page;snapshot.documentRevision=++revision;snapshot.qualityGate={state:'pending'};if(requiresApproval)snapshot.generationMeta.review={state:'pending'};}
   res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({ok:true,changed:repaired.changed,requiresApproval,revision,snapshot}));
  }
  if(pathname==='/api/promo-page-schema'){
   assert.equal(body.documentId,'browser-doc');assert.equal(body.baseDocumentRevision,revision);
   if(body.operation==='approve-structure'){approved++;snapshot.generationMeta.review={state:'approved'};}else if(req.method==='POST'){generated++;const designed=designFixture();snapshot=snapshotForPage(normalize(designed.page).page,designed.context);snapshot.generationMeta.review={state:'pending'};}else{edited++;snapshot.content.pageSchema=body.page;snapshot.generationMeta.review={state:'pending'};}
   payload={ok:true,revision:++revision,snapshot:{...snapshot,documentRevision:revision,qualityGate:{state:'pending',documentRevision:revision}}};snapshot=payload.snapshot;
  }
  if(pathname==='/api/promo-page-schema-media'){
   mediaCalls++;assert.equal(approved,1);assert.equal(savedGate,undefined);assert.equal(body.requestId,'design_request');assert.equal(body.baseDocumentRevision,revision);
   if(mediaCalls===1){res.statusCode=503;res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({error:'이미지 공급자 일시 오류',code:'TEST_MEDIA_FAILURE',retryable:true}));}
   const target=snapshot.content.pageSchema.root.children.find(n=>n.id==='design_image');target.requestId=null;target.assetId='image_ready';
   snapshot.content.pageContext.assets.image_ready={kind:'image',url:'/design-fixture.png',width:1,height:1,displayAspectRatio:'16:9'};
   snapshot.content.pageSchema.mediaRequests=[];snapshot.documentRevision=++revision;snapshot.qualityGate={state:'pending',documentRevision:revision};
   payload={ok:true,revision,snapshot};
  }
  if(pathname==='/api/promo-builder-documents'&&req.method==='PATCH'){savedGate=body.snapshot.qualityGate;snapshot={...body.snapshot,documentRevision:++revision,qualityGate:{...savedGate,documentRevision:revision}};payload={ok:true,revision,snapshot};}
  res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(payload));
 }
 if(pathname==='/design-fixture.png'){res.setHeader('Content-Type','image/png');return res.end(png);}
 if(pathname==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><link rel="stylesheet" href="/prototype/visual-editor-assets/promo-renderer.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const path=resolve(root,pathname.slice(1));if(!path.startsWith(root+'/prototype/visual-editor-assets/')&&!path.startsWith(root+'/prototype/wizard/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
 }catch(e){errors.push(e.message);res.statusCode=500;res.end('{}');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);
 await page.getByPlaceholder('무엇을 만들고 싶으신가요?').fill('이미지 배경과 등록된 다양한 제목 크기, 컬러, 보더, 아이콘을 적용한 프로모션');await page.getByRole('button',{name:'전송',exact:true}).click();
 await page.getByRole('button',{name:/^(?:AI가 구성하고 미리보기 생성|페이지 미리보기 생성)$/}).click();
 const frame=page.frameLocator('iframe').first();await frame.locator('[data-wireframe-node]').first().waitFor();
 const before=await frame.locator('[data-ps-node]').evaluateAll(nodes=>nodes.map(n=>({id:n.id,width:getComputedStyle(n).width,columns:getComputedStyle(n).gridTemplateColumns,gap:getComputedStyle(n).gap,padding:getComputedStyle(n).padding})));
 assert.equal(mediaCalls,0);assert.equal(savedGate,undefined);
 await page.locator('.ai-chat-pane').getByRole('button',{name:'페이지 구성 승인',exact:true}).click();
 await page.locator('.ai-chat-pane .ai-builder-error').getByText('TEST_MEDIA_FAILURE',{exact:true}).waitFor();
 assert.equal(savedGate,undefined);assert.equal(mediaCalls,1);assert.equal(approved,1);
 await page.reload();
 await page.locator('.ai-chat-pane').getByRole('button',{name:/^(?:실패한 단계부터 다시 시도|다시 시도)$/}).first().waitFor();assert.equal(mediaCalls,1);
 await page.locator('.ai-chat-pane').getByRole('button',{name:/^(?:실패한 단계부터 다시 시도|다시 시도)$/}).first().click();
 await page.waitForFunction(()=>document.body.textContent.includes('품질 검사 통과'));
 assert.equal(mediaCalls,2);assert.equal(approved,1);assert.ok(savedGate);
 assert.equal(await page.locator('.ai-chat-pane form').count(),1);assert.equal(await page.locator('.ai-chat-pane textarea').count(),1);
 await page.getByRole('button',{name:'데스크톱',exact:true}).click();
 const paint=await frame.locator('[data-ps-node="page_root"]').evaluate(root=>({borderStyle:getComputedStyle(root).borderTopStyle,borderWidth:getComputedStyle(root).borderTopWidth,heading:[...root.querySelectorAll('h1,h2')].map(n=>({id:n.id,size:getComputedStyle(n).fontSize,color:getComputedStyle(n).color})),image:root.querySelector('[data-ps-node=design_image]').tagName,loaded:root.querySelector('[data-ps-node=design_image]').naturalWidth,overlay:getComputedStyle(root.querySelector('[data-ps-overlay]')).backgroundImage,icon:root.querySelector('[data-ps-node=design_icon]').textContent,iconColor:getComputedStyle(root.querySelector('[data-ps-node=design_icon]')).color,dividerStyle:getComputedStyle(root.querySelector('[data-ps-node=design_divider]')).borderTopStyle,dividerSide:getComputedStyle(root.querySelector('[data-ps-node=design_divider]')).borderLeftStyle}));
 assert.equal(paint.borderStyle,'solid');assert.equal(paint.borderWidth,'2px');assert.equal(paint.icon,'♠');assert.equal(paint.iconColor,'rgb(238, 238, 238)');assert.equal(paint.dividerStyle,'solid');assert.equal(paint.dividerSide,'none');assert.equal(paint.image,'IMG');assert.equal(paint.loaded,1);assert.ok(paint.overlay.includes('linear-gradient'));
 assert.ok(paint.heading.some(h=>h.size==='48px'&&h.color==='rgb(255, 119, 119)'));assert.ok(paint.heading.some(h=>h.size==='28px'));
 const after=await frame.locator('[data-ps-node]').evaluateAll(nodes=>nodes.map(n=>({id:n.id,width:getComputedStyle(n).width,columns:getComputedStyle(n).gridTemplateColumns,gap:getComputedStyle(n).gap,padding:getComputedStyle(n).padding})));
 assert.deepEqual(after,before,'Image preparation must preserve approved layout geometry');
 // An approved pending document must resume when only the visible tab changes,
 // and after reload interrupted during image preparation. No second approval.
 for(const [stage,tab] of [['render_ready','requirements'],['generating_assets','final']]){
  const designed=designFixture();snapshot=snapshotForPage(normalize(designed.page).page,designed.context);
  snapshot.generationMeta.review={state:'approved'};snapshot.documentRevision=++revision;
  snapshot.qualityGate={state:'pending',documentRevision:revision};savedGate=undefined;
  const beforeCalls=mediaCalls;
  const resumedMedia=page.waitForResponse(response=>response.url().endsWith('/api/promo-page-schema-media')&&response.status()===200);
  const resumedQuality=page.waitForResponse(response=>response.url().endsWith('/api/promo-builder-documents')&&response.request().method()==='PATCH');
  await page.evaluate(({stage,tab})=>{
   const key='promoAiBuilder.activeChat.v2',cached=JSON.parse(sessionStorage.getItem(key));
   Object.assign(cached,{stage,activeResultTab:tab,failedTask:null});if(stage==='generating_assets')cached.messages=[];sessionStorage.setItem(key,JSON.stringify(cached));
  },{stage,tab});
  await page.reload();
  if(tab==='requirements'){
   await page.getByRole('button',{name:'페이지 구성 미리보기',exact:true}).waitFor();
   assert.equal(mediaCalls,beforeCalls);
   await page.getByRole('button',{name:'디자인 미리보기',exact:true}).click();
  }
  await Promise.all([resumedMedia,resumedQuality]);
  assert.equal(mediaCalls,beforeCalls+1,stage+' must resume pending images exactly once');assert.equal(approved,1);
 }
 // A real low-contrast rendered heading triggers registered-only paint repair.
 const designed=designFixture({pending:false});
 designed.context.tokenValues['--color-neutral-dark']='#232329';
 designed.context.tokenCatalog.push({name:'--color-neutral-dark',value:'#232329',state:'active',cssProperties:['color']});
 const dark=pageStyleRoles(designed.context).find(r=>r.target==='text'&&r.token==='--color-neutral-dark');
 let contrastHeading;walk(designed.page.root,({node})=>{if(node.type==='text'&&node.role==='heading'&&!contrastHeading)contrastHeading=node;if(node.type==='button')node.actionId=null;});
 const darkRoles=pageStyleRoles(designed.context);
 contrastHeading.styles.base=contrastHeading.styles.base.filter(key=>darkRoles.find(r=>r.key===key)?.property!=='color').concat(dark.key);
 snapshot=snapshotForPage(normalize(designed.page).page,designed.context);snapshot.generationMeta.review={state:'approved'};snapshot.documentRevision=++revision;snapshot.qualityGate={state:'pending'};savedGate=undefined;
 const paintComplete=page.waitForResponse(response=>response.url().endsWith('/api/promo-builder-documents')&&response.request().method()==='PATCH');
 await page.evaluate(()=>{const k='promoAiBuilder.activeChat.v2',c=JSON.parse(sessionStorage.getItem(k));Object.assign(c,{stage:'render_ready',activeResultTab:'final',failedTask:null});sessionStorage.setItem(k,JSON.stringify(c));});
 await page.reload();await paintComplete;
 assert.ok(repairCalls>=1,'actual contrast failure must execute automatic repair');assert.equal(snapshot.generationMeta.review.state,'approved');assert.equal(approved,1);
 assert.ok(savedGate.warningCount>0,'unconfigured CTA is advisory static copy, not a mandatory URL');
 assert.equal(await page.frameLocator('iframe').first().locator('[data-ps-action-state=unbound]').first().evaluate(el=>el.tagName),'SPAN');
 assert.equal(await page.locator('.ai-chat-pane').getByRole('button',{name:'새 창에서 확인',exact:true}).isEnabled(),true);
 // Opaque copy covering a key visual requires separation and explicit reapproval.
 const obscured=designFixture({pending:false}),photo=obscured.page.root.children.find(n=>n.id==='design_image'),hero=obscured.page.root.children.find(n=>n.type==='container'&&n.role==='section');
 obscured.page.root.children=obscured.page.root.children.filter(n=>n!==photo);hero.overlayRole=obscured.page.root.overlayRole;obscured.page.root.overlayRole=null;
 hero.children=[{type:'card',id:'opaque_hero_copy',label:'혜택 안내',sourceIds:[],layout:structuredClone(hero.layout),styles:{base:['card.background'],tablet:null,mobile:null,spacing:{base:{gap:null,padding:null,margin:null},tablet:null,mobile:null}},children:hero.children},photo];
 snapshot=snapshotForPage(normalize(obscured.page).page,obscured.context);snapshot.generationMeta.review={state:'approved'};snapshot.documentRevision=++revision;snapshot.qualityGate={state:'pending'};savedGate=undefined;
 const originalMediaCalls=mediaCalls;
 await page.evaluate(()=>{const k='promoAiBuilder.activeChat.v2',c=JSON.parse(sessionStorage.getItem(k));Object.assign(c,{stage:'render_ready',activeResultTab:'final',failedTask:null});sessionStorage.setItem(k,JSON.stringify(c));});
 await page.reload();
 await page.locator('.ai-chat-pane').getByRole('button',{name:'페이지 구성 승인',exact:true}).waitFor();
 assert.equal(snapshot.generationMeta.review.state,'pending');assert.equal(savedGate,undefined);
 assert.equal(snapshot.content.pageSchema.root.children.find(n=>n.id===hero.id).children.find(n=>n.id==='design_image').presentation,'content');
 const reapprovedGate=page.waitForResponse(response=>response.url().endsWith('/api/promo-builder-documents')&&response.request().method()==='PATCH');
 await page.locator('.ai-chat-pane').getByRole('button',{name:'페이지 구성 승인',exact:true}).click();await reapprovedGate;
 assert.equal(mediaCalls,originalMediaCalls,'structure repair must retain prepared image without regenerating');assert.equal(approved,2);assert.ok(savedGate);
 // The enabled agent reviews even a page with zero measured blockers, applies
 // its constrained patch, then the browser remeasures before certification.
 agentEnabled=true;
 async function restoreAgentFixture(){const designed=designFixture({pending:false});snapshot=snapshotForPage(normalize(designed.page).page,designed.context);snapshot.generationMeta.review={state:'approved'};snapshot.documentRevision=++revision;snapshot.qualityGate={state:'pending'};savedGate=undefined;await page.evaluate(()=>{const k='promoAiBuilder.activeChat.v2',c=JSON.parse(sessionStorage.getItem(k));Object.assign(c,{stage:'render_ready',activeResultTab:'final',failedTask:null});sessionStorage.setItem(k,JSON.stringify(c));});}
 await restoreAgentFixture();
 const agentGate=page.waitForResponse(r=>r.url().endsWith('/api/promo-builder-documents')&&r.request().method()==='PATCH');await page.reload();await agentGate;
 assert.equal(agentCalls,1);assert.equal(snapshot.generationMeta.qualityAgentReview.execution.model,'fixture-review-model');assert.equal(snapshot.generationMeta.qualityAgentRequired,true);assert.equal(savedGate.state,'passed');
 assert.equal(await page.locator('.ai-chat-pane').getByRole('button',{name:'새 창에서 확인',exact:true}).isEnabled(),true);
 reviewConfigured=false;await restoreAgentFixture();await page.reload();await page.locator('.ai-builder-error').getByText('QUALITY_AGENT_PROMPT_REQUIRED',{exact:true}).waitFor();
 assert.equal(savedGate,undefined);assert.equal(agentCalls,1);assert.equal(await page.locator('.ai-chat-pane').getByRole('button',{name:'새 창에서 확인',exact:true}).isDisabled(),true);
 reviewConfigured=true;const recoveredGate=page.waitForResponse(r=>r.url().endsWith('/api/promo-builder-documents')&&r.request().method()==='PATCH');await page.locator('.ai-chat-pane').getByRole('button',{name:'다시 검사',exact:true}).click();await recoveredGate;assert.equal(agentCalls,2);assert.equal(savedGate.state,'passed');
 agentPatchKind='imagePresentation';await restoreAgentFixture();const imageCallsBeforeAgent=mediaCalls;await page.reload();await page.locator('.ai-chat-pane').getByRole('button',{name:'페이지 구성 승인',exact:true}).waitFor();assert.equal(savedGate,undefined);assert.equal(agentCalls,3);
 const aiStructuralGate=page.waitForResponse(r=>r.url().endsWith('/api/promo-builder-documents')&&r.request().method()==='PATCH');await page.locator('.ai-chat-pane').getByRole('button',{name:'페이지 구성 승인',exact:true}).click();await aiStructuralGate;assert.equal(agentCalls,3,'reapproval must reuse the same durable AI review');assert.equal(mediaCalls,imageCallsBeforeAgent);assert.equal(savedGate.state,'passed');
 assert.deepEqual(errors,[]);
 console.log('Design preview browser: approval → automatic media failure → chat retry → image/background/overlay/icon/border/typographic hierarchy → three-viewport quality; tab-only and interrupted preparation resume; approved geometry preserved.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
