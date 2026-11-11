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
let snapshot=snapshotForPage(fixture('example-editorial'),structuredClone(context)),revision=1,activeReady=false,reconnects=0;
for(const key of Object.keys(snapshot.content.pageContext.tokenValues))if(/^--grid-|^--breakpoint-/.test(key))delete snapshot.content.pageContext.tokenValues[key];
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
 await page.addInitScript(()=>!sessionStorage.getItem('promoAiBuilder.activeChat.v2')&&sessionStorage.setItem('promoAiBuilder.activeChat.v2',JSON.stringify({documentId:'document-1',documentRevision:1,stage:'reviewing_overview',activeResultTab:'requirements',messages:[],overviewDraft:{title:'콘텐츠 확인 테스트',contentSections:[{sectionKey:'hero',sectionType:'hero',title:'소개',items:[],cta:{label:'',url:'',confirmationRequired:true}}],notices:[{title:'유의사항',body:'참여 조건을 확인하세요.',confirmationRequired:true}],additionalInformation:[{label:'기간',value:'',confirmationRequired:true}]}})));
 await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);
 const review=page.getByRole('region',{name:'콘텐츠 확인'});
 await review.getByRole('heading',{name:'확인이 필요한 콘텐츠 2개'}).waitFor();
 const buttons=review.getByRole('button',{name:'이 내용으로 확정',exact:true});assert.equal(await buttons.count(),2);
 assert.equal(await buttons.nth(0).isDisabled(),true);
 await buttons.nth(1).click();await review.getByRole('heading',{name:'확인이 필요한 콘텐츠 1개'}).waitFor();
 assert.equal(await review.getByRole('button',{name:'이 내용으로 확정',exact:true}).isDisabled(),true);
 await page.reload();await review.getByRole('heading',{name:'확인이 필요한 콘텐츠 1개'}).waitFor();
 await review.getByRole('textbox',{name:'기간 value',exact:true}).fill('별도 공지된 일정에 따릅니다.');
 await review.getByRole('button',{name:'이 내용으로 확정',exact:true}).click();await review.waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log('Content review browser: visible pending fields, blank facts cannot be confirmed, explicit approval and reload persistence passed.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
