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
let revision=0,snapshot,generated=0,edited=0,savedGate;
const errors=[],requests=[];
const overview={title:'동적 페이지 테스트',leadText:'혜택 안내',promotionPurpose:'기타',promotionPurposeOther:'프로모션',market:'한국',audience:'일반고객',campaignTone:'친근함',mainOffer:'등록된 혜택',contentSections:[],additionalInformation:[],notices:[],legalInformation:[]};
const root=resolve(new URL('..',import.meta.url).pathname);
const server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname.startsWith('/api/')){
  requests.push(pathname);let body={};if(['POST','PUT','PATCH'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  let payload={ok:true};
  if(pathname==='/api/promo-builder-capabilities')payload.capabilities={aiMode:true,pageSchemaV1:true,compositionV3:true,export:true};
  if(pathname==='/api/promo-builder-documents'&&req.method==='POST')payload.document={id:'browser-doc',currentDocumentRevision:0};
  if(pathname==='/api/promo-overview-parse')payload={ok:true,overview,overviewFingerprint:'fixture',missingCriticalInputs:[],warnings:[]};
  if(pathname==='/api/promo-page-schema'){
   assert.equal(body.documentId,'browser-doc');assert.equal(body.baseDocumentRevision,revision);
   if(req.method==='POST'){generated++;snapshot=snapshotForPage(normalize(fixture('example-editorial')).page,context);}else{edited++;snapshot.content.pageSchema=body.page;}
   payload={ok:true,revision:++revision,snapshot:{...snapshot,documentRevision:revision,qualityGate:{state:'pending',documentRevision:revision}}};snapshot=payload.snapshot;
  }
  if(pathname==='/api/promo-builder-documents'&&req.method==='PATCH'){savedGate=body.snapshot.qualityGate;snapshot={...body.snapshot,documentRevision:++revision,qualityGate:{...savedGate,documentRevision:revision}};payload={ok:true,revision,snapshot};}
  res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(payload));
 }
 if(pathname==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><link rel="stylesheet" href="/prototype/visual-editor-assets/promo-renderer.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const path=resolve(root,pathname.slice(1));if(!path.startsWith(root+'/prototype/visual-editor-assets/')&&!path.startsWith(root+'/prototype/wizard/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
 }catch(e){errors.push(e.message);res.statusCode=500;res.end('{}');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);
 await page.getByPlaceholder('무엇을 만들고 싶으신가요?').fill('등록된 혜택으로 페이지를 만들어줘');await page.getByRole('button',{name:'전송',exact:true}).click();
 await page.getByRole('button',{name:'페이지 미리보기 생성',exact:true}).click();
 await page.frameLocator('iframe').first().locator('[data-ps-node="page_root"]').waitFor().catch(async error=>{console.error(JSON.stringify({requests,errors,body:await page.locator('body').innerText()},null,2));throw error;});assert.equal(generated,1);assert.equal(requests.includes('/api/promo-composition-shells'),false);assert.equal(requests.includes('/api/promo-page-composition-proposals'),false);
 await page.getByRole('button',{name:'태블릿',exact:true}).click();await page.getByRole('button',{name:'모바일',exact:true}).click();
 const editorButton=page.getByRole('button',{name:'직접 편집',exact:true});
 await editorButton.click();await page.getByLabel('PageSchema JSON').waitFor();
 const json=JSON.parse(await page.getByLabel('PageSchema JSON').inputValue());json.summary='구조 편집 테스트';
 await page.getByLabel('PageSchema JSON').fill(JSON.stringify(json));await page.getByRole('button',{name:'검증 후 저장',exact:true}).click();
 await page.waitForFunction(()=>!document.querySelector('#page-schema-json'));assert.equal(edited,1);
 await page.getByRole('button',{name:'다시 검사'}).first().click();
 await page.waitForFunction(()=>document.body.textContent.includes('품질 검사 통과'));
 assert.deepEqual(Object.keys(savedGate.results),['desktop','tablet','mobile']);assert.deepEqual(errors,[]);
 console.log('PageSchema Builder browser: natural request → dynamic API → recursive preview → responsive views → JSON edit → three viewport quality save passed.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
