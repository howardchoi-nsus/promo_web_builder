import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url);
const {snapshotForPage}=require('../api/_page-schema-service');
const {normalize}=require('../shared/page-schema/contract.cjs');
const {createHandler}=require('../api/promo-builder-chat-actions');
const action={id:'approval-1',key:'approve_wireframe',label:'페이지 구성 승인',status:'executed'};
const draft={contractVersion:3,content:{sectionSnapshot:[{sectionKey:'hero',sectionRole:'hero',items:[{itemKey:'title',fieldKind:'text',textType:'title'}]}],sectionInputs:{hero:{title:'등록된 결과'}},sectionOrder:['hero']}};
let snapshot={...snapshotForPage(normalize(fixture('example-editorial')).page,context),documentRevision:1,qualityGate:{state:'pending',documentRevision:1}},revision=1,applyCalls=0,approvalRequests=0,writes=0;
const workspace={session:{id:'session-1',documentId:'document-1',stage:'completed',confirmedWireframeRevision:1},messages:[{id:'assistant-1',role:'assistant',type:'assistant',text:'페이지 구성을 승인해 주세요.',actions:[action]}],wireframe:{revision:1,proposalId:'proposal-1',structureFingerprint:'a'.repeat(64),snapshot:draft,status:'confirmed'}};
const handler=createHandler({requireBuilderFlag(){},resolveBuilderOwner:()=>({ownerSubject:'owner'}),getSql:()=>({}),fetchSession:async()=>workspace,fetchAction:async()=>action,fetchCompletedDocument:async()=>({documentId:'document-1',documentRevision:revision}),executeAction:async()=>{writes++;throw Error('Approval must not execute twice');},fetchConfirmedWireframe:async()=>{throw Error('Do not reconfirm executed approval');}});
const root=resolve(new URL('..',import.meta.url).pathname);
const errors=[];
const server=createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path.startsWith('/api/')){
  let body={};if(['POST','PATCH'].includes(req.method)){let chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  res.setHeader('Content-Type','application/json');let data={ok:true};
  if(path==='/api/promo-builder-chat-actions'){approvalRequests++;return handler({method:'POST',body,headers:{}},{setHeader(){},status(n){res.statusCode=n;return this;},json(value){res.end(JSON.stringify(value));return this;}});}
  if(path==='/api/promo-builder-capabilities')data.capabilities={aiMode:true,chatWorkspaceV1:true,compositionV3:true};
  if(path==='/api/promo-composition-shells')data.versions=[{id:'shell-1',config:{isDefault:true}}];
  if(path==='/api/promo-builder-chat-sessions')data={ok:true,...workspace};
  if(path==='/api/promo-page-composition-proposals')data.proposal={id:'proposal-1',status:'applied',snapshot:draft,validation:{ok:true},autoApplicable:true};
  if(path==='/api/promo-builder-wireframes-confirm')data.wireframe={...workspace.wireframe,status:'confirmed'};
  if(path==='/api/promo-page-composition-apply'){applyCalls++;throw Error('Completed document must not be applied twice');}
  if(path==='/api/promo-builder-chat-messages')data.message={...body.message,actions:(body.message.actions||[]).map((a,i)=>({...a,id:`new-action-${i}`,status:'proposed'}))};
  if(path==='/api/promo-builder-documents'){
   if(req.method==='PATCH'){snapshot={...body.snapshot,documentRevision:++revision,qualityGate:{...body.snapshot.qualityGate,documentRevision:revision}};data={ok:true,revision,snapshot};}
   else data={ok:true,document:{id:'document-1',currentDocumentRevision:revision},snapshot};
  }
  return res.end(JSON.stringify(data));
 }
 if(path==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const file=resolve(root,path.slice(1));if(!file.startsWith(root+'/prototype/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch(error){errors.push(error.message);res.statusCode=500;res.end('{}');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 for(const actionStatus of ['executed','proposed','expired']){
 action.status=actionStatus;approvalRequests=0;
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(({draft,action})=>sessionStorage.setItem('promoAiBuilder.activeChat.v2',JSON.stringify({documentId:'document-1',documentRevision:1,chatSessionId:'session-1',stage:'failed',activeResultTab:'final',wireframeSnapshot:draft,wireframeRevision:1,wireframeFingerprint:'a'.repeat(64),messages:[],failedTask:{kind:'final-design',operationId:'failed-approval',label:'최종 디자인 생성',action,retryable:false,error:{code:'CHAT_ACTION_NOT_ALLOWED',message:'Action approve_wireframe is not allowed during completed'}}})),{draft,action});
 await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);
 await page.getByRole('button',{name:'다시 시도',exact:true}).click();
 await page.waitForFunction(()=>document.body.textContent.includes('디자인 미리보기를 완성했습니다.'));
 assert.equal(approvalRequests,1);assert.equal(applyCalls,0);assert.equal(writes,0);assert.equal(workspace.session.stage,'completed');assert.equal(snapshot.qualityGate.state,'passed');
 assert.equal(await page.getByRole('button',{name:'페이지 구성 승인',exact:true}).count(),0);
 assert.equal(action.status,actionStatus);await page.close();
 }
 assert.deepEqual(errors,[]);console.log('Approval retry browser: cached completed-stage 409 recovers saved document, passes quality, and never reapproves or reapplies.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
