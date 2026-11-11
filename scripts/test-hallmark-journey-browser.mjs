import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve,extname} from 'node:path';
const root=resolve(new URL('..',import.meta.url).pathname);
const require=createRequire(root+'/package.json');const {chromium}=require('playwright');
const oldOverview={title:'기존 캠페인',leadText:'이전 안내 문구',mainOffer:'기존 혜택',market:'KR',audience:'general',contentSections:[],additionalInformation:[],notices:[{title:'참여 유의사항',body:'기존 참여 안내',confirmationRequired:true}],legalInformation:[]};
let requirements=structuredClone(oldOverview),writes=[],parsed=[],messages=[],stage='requirements_review',reqRevision=1;
const requests=[];
const {createHandler}=require('./api/promo-builder-chat-actions');
const actionsHandler=createHandler({requireBuilderFlag(){},resolveBuilderOwner:()=>({ownerSubject:'audit-owner'}),getSql:()=>({}),fetchSession:async()=>workspace(),fetchAction:async(_,{actionId})=>messages.flatMap(m=>m.actions||[]).find(a=>a.id===actionId),executeAction:async(_,{actionId,nextStage})=>{stage=nextStage;const action=messages.flatMap(m=>m.actions||[]).find(a=>a.id===actionId);action.status='executed';for(const candidate of messages.flatMap(m=>m.actions||[]))if(candidate.status==='proposed')candidate.status='expired';return {action,stage};}});
let generationAttempts=0,generationIds=[];
const {fixture,context}=await import('./fixtures/page-schema.mjs');
const {snapshotForPage}=require('./api/_page-schema-service');
let snapshot=null,docRevision=0;
const workspace=()=>({session:{id:'session-audit',documentId:'doc-audit',stage},requirements:{revision:reqRevision,value:requirements,fingerprint:'old-fingerprint'},wireframe:null,messages});
const server=createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path.startsWith('/api/')){
  let body={};if(['POST','PUT','PATCH'].includes(req.method)){const chunks=[];for await(const c of req)chunks.push(c);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  requests.push({path,method:req.method});res.setHeader('Content-Type','application/json');let data={ok:true};
  if(path==='/api/promo-builder-chat-actions')return actionsHandler({method:'POST',body,headers:{}},{setHeader(){},status(code){res.statusCode=code;return this;},json(value){res.end(JSON.stringify(value));return this;}});
  if(path==='/api/promo-page-schema'){
   generationAttempts++;generationIds.push(body.requestId);
   if(generationAttempts===1){res.statusCode=503;return res.end(JSON.stringify({code:'TEST_TEMPORARY_FAILURE',error:'테스트: 일시적인 생성 실패',retryable:true}));}
   assert.equal(body.requirementsRevision,reqRevision);assert.equal(body.overview.title,requirements.title);
   stage='wireframe_review';snapshot=snapshotForPage(fixture('example-editorial'),context);snapshot.generationMeta.review={state:'pending'};snapshot.generationMeta.requestId=body.requestId;snapshot.generationMeta.sourceRequirements={revision:reqRevision};
   docRevision++;return res.end(JSON.stringify({ok:true,snapshot,revision:docRevision,warnings:[]}));
  }
  if(path==='/api/promo-builder-capabilities')data.capabilities={aiMode:true,pageSchemaV1:true,chatWorkspaceV1:true};
  if(path==='/api/promo-builder-documents')data={ok:true,document:{id:'doc-audit',currentDocumentRevision:docRevision},snapshot};
  if(path==='/api/promo-builder-chat-sessions')data={ok:true,...workspace()};
  if(path==='/api/promo-builder-chat-messages'){const m={...body.message,actions:(body.message.actions||[]).map((a,i)=>({...a,id:`${body.message.id}-a${i}`,status:'proposed'}))};messages.push(m);data.message=m;}
  if(path==='/api/promo-builder-requirements-revisions'){assert.equal(body.expectedRequirementsRevision,reqRevision);writes.push(structuredClone(body.requirements));requirements=body.requirements;reqRevision++;stage='requirements_review';data.requirements={revision:reqRevision,value:requirements,fingerprint:body.fingerprint};}
  if(path==='/api/promo-overview-parse'){const next={...structuredClone(requirements),title:'새 캠페인으로 수정됨',leadText:'새 안내 문구',mainOffer:'새 혜택',notices:[]};parsed.push(next);data={ok:true,overview:next,overviewFingerprint:'new-fingerprint',missingCriticalInputs:[],inputLocale:'ko'};}
  return res.end(JSON.stringify(data));
 }
 if(path==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const file=resolve(root,path.slice(1));if(!file.startsWith(root+'/prototype/')){res.statusCode=404;return res.end();}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch(e){res.statusCode=500;res.end(JSON.stringify({error:e.message}));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});

try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(overview=>{if(!sessionStorage.getItem('promoAiBuilder.activeChat.v2'))sessionStorage.setItem('promoAiBuilder.activeChat.v2',JSON.stringify({documentId:'doc-audit',chatSessionId:'session-audit',documentRevision:0,stage:'reviewing_overview',activeResultTab:'requirements',overviewDraft:overview,messages:[]}));},oldOverview);
 const url=`http://127.0.0.1:${server.address().port}/?mode=ai`;
 await page.goto(url);const review=page.locator('.ai-chat-pane').getByRole('region',{name:'콘텐츠 확인'});await review.getByRole('heading',{name:'추가 검토할 콘텐츠 1개 · 선택 사항'}).waitFor();
 await page.getByPlaceholder('무엇을 만들고 싶으신가요?').waitFor();
 await page.waitForFunction(()=>!document.querySelector('.ai-chat-composer textarea')?.disabled);
 await review.getByRole('textbox',{name:'참여 유의사항 body',exact:true}).fill('사용자가 수정한 참여 안내');
 await review.getByRole('button',{name:'이 내용으로 확정',exact:true}).click();await review.waitFor({state:'detached'});await page.waitForFunction(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')).overviewDirty===false);
 const local=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')).overviewDraft);
 assert.equal(local.notices[0].confirmationRequired,false);assert.equal(requirements.notices[0].confirmationRequired,false);
 await page.reload();await page.waitForFunction(()=>!document.querySelector('.ai-chat-composer textarea')?.disabled);assert.equal(await review.count(),0);assert.equal(requirements.notices[0].body,'사용자가 수정한 참여 안내');
 const input=page.getByPlaceholder('무엇을 만들고 싶으신가요?');await input.fill('캠페인 제목과 혜택을 새 내용으로 변경해 주세요.');
 // The latest DOM contains the submit button next to this textarea.
 const submit=page.locator('.ai-chat-composer button[type=submit]');
 if(await submit.count())await submit.click();else await input.press('Enter');
 await page.waitForFunction(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')||'{}').messages?.some(m=>m.text?.includes('요구사항 분석을 완료했습니다.')));
 await page.waitForFunction(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')||'{}').stage==='reviewing_overview');
 assert.equal(parsed.length,1);assert.ok(writes.length>=2);
 assert.equal(parsed[0].title,writes.at(-1).title);assert.equal(parsed[0].leadText,writes.at(-1).leadText);
 await page.waitForFunction(()=>!document.querySelector('.ai-chat-composer textarea')?.disabled);
 // Resolve the restored pending flag, then inject a generation prerequisite failure.

 await page.getByRole('button',{name:'페이지 미리보기 생성',exact:true}).click();
 await page.locator('.ai-builder-error').getByText('TEST_TEMPORARY_FAILURE',{exact:true}).waitFor();
 const failedCache=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')));
 assert.equal(stage,'requirements_review');assert.equal(failedCache.failedTask.retryable,true);
 assert.equal(messages.flatMap(m=>m.actions||[]).find(a=>a.key==='confirm_requirements')?.status,'proposed');
 await page.getByRole('button',{name:'다시 시도',exact:true}).first().click();
 await page.frameLocator('iframe').first().locator('[data-wireframe-node]').first().waitFor();
 assert.equal(stage,'wireframe_review');assert.equal(generationIds.length,2);assert.equal(generationIds[0],generationIds[1]);
 assert.equal(requests.filter(r=>r.path==='/api/promo-builder-chat-actions').length,0);
 await page.getByRole('button',{name:'구성 수정 요청',exact:true}).click();
 await page.locator('.ai-operation-form select').selectOption('content');await page.locator('.ai-operation-form textarea').fill('핵심 혜택 문구를 최신 요청으로 수정해 주세요.');await page.getByRole('button',{name:'수정 제안',exact:true}).click();
 await page.waitForFunction(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')||'{}').stage==='reviewing_overview');
 assert.equal(parsed.length,2);assert.equal(generationAttempts,2,'Content edits must return to requirements review before another generation');
 assert.deepEqual(errors,[]);console.log('Hallmark journey with chat ON: inline save/reload, new analysis preservation, saved requirements pin, failure without consuming approval, stable request retry and structure preview passed.');

}finally{await browser.close();await new Promise(r=>server.close(r));}
