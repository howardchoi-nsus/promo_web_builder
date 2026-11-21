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
const harness=await createUnitHarness({chat:false});harness.holdSecond();
let revision=0,snapshot,generated=0,edited=0,approved=0,savedGate;
const errors=[],requests=[];
const overview={...harness.overview,promotionPurpose:'기타',promotionPurposeOther:'프로모션',market:'한국',audience:'일반고객',campaignTone:'친근함',mainOffer:'',notices:[],legalInformation:[]};
const root=resolve(new URL('..',import.meta.url).pathname);
const server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname.startsWith('/api/')){
  requests.push(pathname);let body={};if(['POST','PUT','PATCH'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  let payload={ok:true};
  if(pathname==='/api/promo-builder-capabilities')payload.capabilities={aiMode:true,pageDraftV1:true,pageSchemaV1:true,compositionV3:true,export:true};
  if(pathname==='/api/promo-builder-documents'&&req.method==='GET')payload=await harness.read();
  if(pathname==='/api/promo-builder-documents'&&req.method==='POST')payload.document={id:harness.doc,currentDocumentRevision:0};
  if(pathname==='/api/promo-overview-parse')await new Promise(resolve=>setTimeout(resolve,1400));
  if(pathname==='/api/promo-overview-parse')payload={ok:true,overview,overviewFingerprint:'fixture',missingCriticalInputs:['mainOffer'],warnings:[]};
  if(pathname==='/api/promo-page-schema'){
   assert.equal(body.documentId,harness.doc);assert.equal(body.baseDocumentRevision,revision);
   if(['start-draft','advance-draft','read-draft'].includes(body.operation)){
    if(body.operation==='start-draft')generated++;
    const answer=await harness.invoke(body);
    if(answer.complete){revision=answer.revision;snapshot=answer.snapshot;}
    res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(answer));
   }
   if(body.operation==='approve-structure'){approved++;snapshot.generationMeta.review={state:'approved'};}else if(req.method==='POST'){generated++;snapshot=snapshotForPage(normalize(fixture('example-editorial')).page,context);snapshot.generationMeta.review={state:'pending'};}else{edited++;snapshot.content.pageSchema=body.page;snapshot.generationMeta.review={state:'pending'};}
   payload={ok:true,warnings:[{code:'UNCONFIRMED_OPTIONAL_CONTENT_OMITTED',message:'additionalInformation.0: 미정인 사실 정보는 출력에서 제외했습니다.'}],revision:++revision,snapshot:{...snapshot,documentRevision:revision,qualityGate:{state:'pending',documentRevision:revision}}};snapshot=payload.snapshot;
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
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);await page.getByPlaceholder('무엇을 만들고 싶으신가요?').fill('프리미엄 좌측 카피로 구성해줘');await page.getByRole('button',{name:'전송',exact:true}).click();await page.getByRole('button',{name:/^(?:AI가 구성하고 미리보기 생성|페이지 미리보기 생성)$/}).click();
 const frame=page.frameLocator('iframe').first();await frame.locator('[data-ps-node=page_root]').waitFor();assert.equal(revision,0);assert.equal(await page.locator('.ai-process-steps li').count(),2);assert.equal(await page.getByRole('button',{name:'페이지 구성 승인',exact:true}).count(),0);
 {const deadline=Date.now()+15000;while(!harness.waiting){assert.ok(Date.now()<deadline,'Second real provider call did not start: '+errors.join(';'));await new Promise(r=>setTimeout(r,10));}}
 // The actual service/SQL driver has saved region one while its provider call
 // for region two is deliberately held. No fabricated partial API response.
 await frame.locator('[data-ps-node=hero_title]').waitFor();
 assert.ok((await frame.locator('[data-ps-node=hero]').textContent()).includes(harness.overview.title));
 assert.equal(await frame.locator('[data-ps-node=benefits] [data-ps-node]').count(),0);
 assert.equal((await harness.sql`select state from promo_page_drafts`)[0].state.cursor,1);
 assert.equal((await harness.read()).document.currentDocumentRevision,0);
 assert.equal(await page.getByRole('button',{name:'페이지 구성 승인',exact:true}).count(),0);
 await frame.locator('[data-work-feedback]').waitFor({state:'attached'});assert.equal(await frame.locator('.work-cursor').count(),12);
 assert.ok(await frame.locator('.work-cursor:visible').count()>0);
 harness.failNext();harness.release();
 await page.getByRole('button',{name:'실패한 단계부터 다시 시도',exact:true}).waitFor();
 assert.ok((await frame.locator('[data-ps-node=hero]').textContent()).includes(harness.overview.title));
 await page.waitForFunction(()=>{const d=document.querySelector('iframe')?.contentDocument;return d&&[...d.querySelectorAll('.work-cursor')].every(el=>el.hidden);});
 await page.reload();
 await frame.locator('[data-ps-node=hero_title]').waitFor();
 assert.ok((await frame.locator('[data-ps-node=hero]').textContent()).includes(harness.overview.title));
 assert.equal(harness.modelCalls.length,3,'Reload must restore saved output without invoking the model');
 await page.getByRole('button',{name:'실패한 단계부터 다시 시도',exact:true}).click();
 await page.getByRole('button',{name:'페이지 구성 승인',exact:true}).waitFor();
 assert.equal(generated,2);assert.equal(harness.modelCalls.filter(call=>call.type==='promo_page_manifest_planner').length,1);assert.equal(revision,1);assert.equal(harness.modelCalls.length,4);
 assert.ok(harness.events.some(event=>event.completed===2&&!event.complete),'last region must be saved before final assembly');
 assert.equal(harness.events.at(-1).complete,true);
 assert.deepEqual(errors,[]);console.log('Real unit builder browser: real service plus PGlite, source-only first region visible while next provider call is held, no future components/early approval, real cursor target, failed-unit retry preserving prior output and final assembly passed.');
}finally{harness.release();await browser.close();await new Promise(r=>server.close(r));await harness.close();}
