// Preserve explicit legacy approval-path regression coverage. New automatic flow is tested separately.
process.env.PAGE_SCHEMA_AUTO_FLOW_ENABLED='true';process.env.PAGE_PARALLEL_WORK_ENABLED='true';process.env.PAGE_SCHEMA_SECTION_DESIGN_ENABLED='true';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {createUnitHarness} from './fixtures/page-draft-units-harness.mjs';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url);
const {snapshotForPage}=require('../api/_page-schema-service');
const {normalize}=require('../shared/page-schema/contract.cjs');
const harness=await createUnitHarness({chat:false,parallel:true});harness.holdFirst();
let revision=0,snapshot,generated=0,edited=0,approved=0,savedGate;
const errors=[],requests=[];
const overview={...harness.overview,promotionPurpose:'기타',promotionPurposeOther:'프로모션',market:'한국',audience:'일반고객',campaignTone:'친근함',mainOffer:'',notices:[],legalInformation:[]};
const root=resolve(new URL('..',import.meta.url).pathname);
const server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname.startsWith('/api/')){
  requests.push(pathname);let body={};if(['POST','PUT','PATCH'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  let payload={ok:true};
  if(pathname==='/api/promo-builder-capabilities')payload.capabilities={automaticPageFlow:true,aiMode:true,parallelPageWork:true,pageDraftV1:true,pageSchemaV1:true,compositionV3:true,export:true};
  if(pathname==='/api/promo-builder-documents'&&req.method==='GET')payload=await harness.read();
  if(pathname==='/api/promo-builder-documents'&&req.method==='POST')payload.document={id:harness.doc,currentDocumentRevision:0};
  if(pathname==='/api/promo-overview-parse')await new Promise(resolve=>setTimeout(resolve,1400));
  if(pathname==='/api/promo-overview-parse')payload={ok:true,overview,overviewFingerprint:'fixture',missingCriticalInputs:['mainOffer'],warnings:[]};
  if(pathname==='/api/promo-page-schema'){
   assert.equal(body.documentId,harness.doc);assert.equal(body.baseDocumentRevision,revision);
   if(['start-draft','advance-draft','advance-unit','read-draft'].includes(body.operation)){
    if(body.operation==='start-draft')generated++;
    const answer=await harness.invoke(body);
    if(answer.complete){revision=answer.revision;snapshot=answer.snapshot;}
    res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(answer));
   }
   if(body.operation==='approve-structure'){approved++;snapshot.generationMeta.review={state:'approved'};}else if(req.method==='POST'){generated++;snapshot=snapshotForPage(normalize(fixture('example-editorial')).page,context);snapshot.generationMeta.review={state:'pending'};}else{edited++;snapshot.content.pageSchema=body.page;snapshot.generationMeta.review={state:'pending'};}
   payload={ok:true,warnings:[{code:'UNCONFIRMED_OPTIONAL_CONTENT_OMITTED',message:'additionalInformation.0: 미정인 사실 정보는 출력에서 제외했습니다.'}],revision:++revision,snapshot:{...snapshot,documentRevision:revision,qualityGate:{state:'pending',documentRevision:revision}}};snapshot=payload.snapshot;
  }
  if(pathname==='/api/promo-page-work'){
   let answer;await require('../api/_page-parallel-design').processParallelDesign({sql:harness.sql,owner:{ownerSubject:harness.owner},body,res:{status(){return this;},json(value){answer=value;return this;}}},{fetchDocument:harness.read,verifyUnitConfig:async()=>{},createPromptExecutionSnapshot:async(s,type,variables)=>({promptConfig:{promptId:'registered-design',promptVersion:1,provider:'fixture',model:'registered-model',modelOptions:{},renderedPrompt:'registered directive'}}),generate:async()=>({result:{summary:'같은 토큰 기반 디자인',patches:[]}})});
   revision=answer.revision;snapshot=answer.snapshot;res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(answer));
  }
  if(pathname==='/api/promo-builder-documents'&&req.method==='PATCH'){savedGate=body.snapshot.qualityGate;snapshot={...body.snapshot,documentRevision:++revision,qualityGate:{...savedGate,documentRevision:revision}};payload={ok:true,revision,snapshot};}
  res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(payload));
 }
 if(pathname==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><link rel="stylesheet" href="/prototype/visual-editor-assets/promo-renderer.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const path=resolve(root,pathname.slice(1));if(!path.startsWith(root+'/prototype/visual-editor-assets/')&&!path.startsWith(root+'/prototype/wizard/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
 }catch(e){if(e.message!=='unit provider test failure')errors.push(e.message);res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:e.message,code:e.code||'TEST_PROVIDER_FAILED',retryable:true}));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);
 await page.getByPlaceholder('무엇을 만들고 싶으신가요?').fill('요청 한 번으로 페이지를 구성하고 완성해줘');await page.getByRole('button',{name:'전송',exact:true}).click();
 {const deadline=Date.now()+20000;while(!harness.waiting){assert.ok(Date.now()<deadline,'Automatic generation did not start: '+errors.join(';'));await new Promise(r=>setTimeout(r,10));}}
 const frame=page.frameLocator('iframe').first();await frame.locator('[data-live-skeleton]').first().waitFor({state:'attached'});
 assert.equal(await page.getByRole('button',{name:'페이지 구성 승인',exact:true}).count(),0);
 assert.equal(await page.getByRole('button',{name:'페이지 미리보기 생성',exact:true}).count(),0);
 {const deadline=Date.now()+20000;while(!harness.events.some(e=>e.completed===1)){assert.ok(Date.now()<deadline,'Second unit did not render before first');await new Promise(r=>setTimeout(r,10));}const [draft]=await harness.sql`select state from promo_page_drafts`;assert.ok(draft.state.completedIndices.includes(1));assert.equal(draft.state.completedIndices.includes(0),false);const text=draft.state.context.contentSources[draft.state.plan.regions[1].sourceIds[0]].text;await frame.getByText(text,{exact:true}).first().waitFor({state:'attached'});}
 harness.release();
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='새 창에서 확인'&&!b.disabled),{timeout:30000});
 assert.equal(generated,1);assert.equal(approved,0);assert.equal(snapshot.generationMeta.review.state,'ready');assert.equal(snapshot.generationMeta.review.mode,'automatic');assert.equal(snapshot.generationMeta.review.approvedAt,undefined);
 assert.ok(requests.includes('/api/promo-page-work'));assert.equal(snapshot.generationMeta.sectionDesign.state,'complete');assert.equal(savedGate.state,'passed');assert.deepEqual(Object.keys(savedGate.results),['desktop','tablet','mobile']);
 assert.equal(await page.locator('.ai-chat-progress-detail').count(),0);
 assert.equal(await page.getByText('완성',{exact:true}).count()>0,true);
 assert.ok(harness.events.some(e=>e.completed===1&&!e.complete),'Real first unit must be persisted before final assembly');
 assert.deepEqual(errors,[]);console.log('Parallel builder browser: one submit, real two-unit SQL with second region visible before first release, section work API durable design, no approval and automatic QA/output passed.');
}finally{harness.release();await browser.close();await new Promise(r=>server.close(r));await harness.close();}
