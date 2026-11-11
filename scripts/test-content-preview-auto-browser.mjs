import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url);
const {snapshotForPage}=require('../api/_page-schema-service');
const {refreshOutputTokens}=require('../api/_promo-output-token-refresh');
const {normalizeEditorSnapshot}=require('../api/promo-builder-documents');
let snapshot=snapshotForPage(fixture('example-editorial'),structuredClone(context)),revision=1,activeReady=false,reconnects=0,generationCalls=0;

snapshot.qualityGate={state:'pending',documentRevision:1};
const originalPage=JSON.stringify(snapshot.content.pageSchema);
const version={id:'active-library',status:'active',values:context.tokenCatalog.map(token=>({...token,tokenKey:token.name}))};
const root=resolve(new URL('..',import.meta.url).pathname),errors=[];
const server=createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path.startsWith('/api/')){
  let body={};if(['POST','PATCH'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  res.setHeader('Content-Type','application/json');let data={ok:true};
  if(path==='/api/promo-builder-capabilities')data.capabilities={aiMode:true,pageSchemaV1:true};
  if(path==='/api/promo-page-schema'&&req.method==='POST'){
   generationCalls++;
   const {prepareOverviewForPreview,assertContentConfirmed}=require('../shared/page-schema/content-confirmation.cjs');
   const prepared=prepareOverviewForPreview(body.overview);assertContentConfirmed(prepared.overview);
   assert.equal(prepared.omittedItems.length,3);assert.equal(prepared.overview.additionalInformation.length,0);assert.equal(prepared.overview.contentSections[0].cta,undefined);
   snapshot={...snapshot,documentRevision:++revision};return res.end(JSON.stringify({ok:true,revision,snapshot,warnings:prepared.omittedItems}));
  }
  if(path==='/api/promo-builder-documents'){
   if(req.method==='PATCH'){
    assert.equal(body.baseDocumentRevision,revision);
    if(body.operation==='refresh-token-library'){
     reconnects++;
     try{snapshot=await refreshOutputTokens({},snapshot,{fetchTokenSets:async()=>[{setKey:'design-system',versionId:version.id}],fetchTokenVersion:async()=>activeReady?version:{...version,values:version.values.filter(t=>!/^--grid-|^--breakpoint-/.test(t.name))},activeTokenUsagePolicy:async()=>context.usagePolicy,tokenPolicyCatalog:()=>context.tokenCatalog});}
     catch(error){res.statusCode=error.statusCode||500;return res.end(JSON.stringify({code:error.code,message:error.message,errors:error.errors}));}
     snapshot={...snapshot,documentRevision:++revision,qualityGate:{state:'pending',documentRevision:revision}};
    }else{const checked=await normalizeEditorSnapshot({},snapshot,body.snapshot,'',revision);snapshot={...checked,documentRevision:++revision};}
    data={ok:true,revision,snapshot};
   }else data={ok:true,document:{id:'document-1',currentDocumentRevision:revision},snapshot};
  }
  return res.end(JSON.stringify(data));
 }
 if(path==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const file=resolve(root,path.slice(1));if(!file.startsWith(root+'/prototype/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch(e){errors.push(e.message);res.statusCode=500;res.end('{}');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>sessionStorage.setItem('promoAiBuilder.activeChat.v2',JSON.stringify({documentId:'document-1',documentRevision:1,stage:'reviewing_overview',activeResultTab:'requirements',messages:[{id:'confirm-message',role:'assistant',type:'assistant',text:'요청 내용을 확인해 주세요.',actions:[{key:'confirm_requirements',label:'AI가 구성하고 미리보기 생성',status:'proposed'}]}],overviewDraft:{title:'쿠폰 프로모션',contentSections:[{sectionKey:'hero',sectionType:'hero',title:'소개',items:[],cta:{label:'지금 가입하고 혜택 받기',url:'',confirmationRequired:true}}],additionalInformation:[{label:'쿠폰 사용 조건',value:'',confirmationRequired:true},{label:'쿠폰 배송 조건',value:'미정',confirmationRequired:true}]}})));
 await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);
 await page.getByRole('button',{name:'AI가 구성하고 미리보기 생성',exact:true}).click();
 await page.frameLocator('iframe').first().locator('[data-ps-node]').first().waitFor();
 await page.waitForFunction(()=>JSON.parse(sessionStorage.getItem('promoAiBuilder.activeChat.v2')||'{}').documentRevision>=3);
 assert.equal(snapshot.qualityGate.state,'passed');
 assert.equal(generationCalls,1);assert.equal(await page.locator('.ai-builder-error').count(),0);
 await page.locator('.ai-builder-warning').getByText('UNCONFIRMED_OPTIONAL_CONTENT_OMITTED',{exact:true}).waitFor();
 assert.ok((await page.locator('.ai-builder-warning').innerText()).includes('쿠폰 사용 조건'));
 assert.deepEqual(errors,[]);console.log('Preview button: incomplete optional CTA and coupon conditions omitted; generation and automatic quality check proceed without confirmation error.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
