import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {designFixture,png} from './fixtures/design-preview-enhancements.mjs';
const require=createRequire(import.meta.url);
const {snapshotForPage}=require('../api/_page-schema-service');
const {newSectionDesign,processSectionDesign}=require('../api/_page-section-design');
const {treeNodes}=require('../shared/page-schema/section-design.cjs');
const {pageStyleRoles,pageStyleToken}=require('../shared/token-usage-policy.cjs');
let snapshot,revision=0,mediaCalls=0,savedGate,failedOnce=false;const attempts={},errors=[];
const root=resolve(new URL('..',import.meta.url).pathname);
const overview={title:'실시간 디자인',promotionPurpose:'기타',promotionPurposeOther:'프로모션',audience:'일반고객',campaignTone:'친근함',contentSections:[],additionalInformation:[],notices:[],legalInformation:[]};
const server=createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path.startsWith('/api/')){
  let body={};if(['POST','PATCH','PUT'].includes(req.method)){const chunks=[];for await(const c of req)chunks.push(c);body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}
  let data={ok:true};res.setHeader('Content-Type','application/json');
  if(path==='/api/promo-builder-capabilities')data.capabilities={aiMode:true,pageSchemaV1:true,pageSchemaMedia:true,sectionDesignV1:true,qualityReviewAgent:false};
  if(path==='/api/promo-builder-documents'&&req.method==='POST')data.document={id:'browser-doc',currentDocumentRevision:revision};
  if(path==='/api/promo-builder-documents'&&req.method==='GET')data={ok:true,document:{id:'browser-doc',mode:'ai',currentDocumentRevision:revision},snapshot};
  if(path==='/api/promo-overview-parse')data={ok:true,overview,overviewFingerprint:'fixture',missingCriticalInputs:[]};
  if(path==='/api/promo-page-schema'){
   if(body.operation==='approve-structure'){assert.equal(body.sectionDesignVersion,1);snapshot.generationMeta.review={state:'approved'};snapshot.generationMeta.sectionDesign=newSectionDesign(snapshot.content.pageSchema);}
   else {const design=designFixture();snapshot=snapshotForPage(design.page,design.context);snapshot.generationMeta.review={state:'pending'};}
   data={ok:true,revision:++revision,snapshot};
  }
  if(path==='/api/promo-page-section-design'){
   const deps={fetchDocument:async(_,id,subject)=>id==='browser-doc'&&subject==='owner'?{document:{id,currentDocumentRevision:revision},snapshot}:null,
    createPromptExecutionSnapshot:async(_,type,vars)=>{assert.equal(type,'promo_page_section_designer');return {promptConfig:{promptId:'active-designer',promptVersion:1,model:'registered-designer',provider:'openai',skillSnapshots:[],section:JSON.parse(vars.sectionJson)}};},
    acquireGeneration:async(_,job)=>({...job,claimToken:'claim'}),failGeneration:async()=>{},
    generate:async({promptConfig:cfg})=>{
     const section=cfg.section;attempts[section.id]=(attempts[section.id]||0)+1;await new Promise(resolve=>setTimeout(resolve,700));
     if(section.id===snapshot.generationMeta.sectionDesign.groups[1].id&&!failedOnce){failedOnce=true;throw Object.assign(new Error('디자인 공급자 일시 오류'),{code:'SECTION_PROVIDER_TEST_FAILURE',statusCode:503,retryable:true});}
     const text=section.nodes.find(node=>node.type==='text'),roles=pageStyleRoles(snapshot.content.pageContext);
     const color=section.id===snapshot.generationMeta.sectionDesign.groups[0].id?'#ff7777':'#eeeeee';
     const role=roles.find(role=>role.target==='text'&&role.property==='color'&&snapshot.content.pageContext.tokenValues[pageStyleToken(snapshot.content.pageContext,role)]===color);
     return {result:{summary:'영역별 등록 디자인 생성',patches:text?[{nodeId:text.id,viewport:'desktop',kind:'styles',roles:[...text.styles.base.filter(key=>roles.find(role=>role.key===key)?.property!=='color'),role.key],spacing:null,overlayRole:null,reason:'Actual generated token choice'}]:[]},provider:{model:cfg.model}};
    },createDocumentRevision:async(_,args)=>{assert.equal(args.baseDocumentRevision,revision);snapshot=JSON.parse(JSON.stringify(args.snapshot));return {revision:++revision,snapshot};}};
   try{return await processSectionDesign({sql:{},owner:{ownerSubject:'owner'},body,res:{status(code){res.statusCode=code;return this;},json(value){res.end(JSON.stringify(value));return this;}}},deps);}catch(error){res.statusCode=error.statusCode||500;return res.end(JSON.stringify({code:error.code,error:error.message,retryable:error.retryable}));}
  }
  if(path==='/api/promo-page-schema-media'){
   mediaCalls++;assert.equal(body.baseDocumentRevision,revision);
   if(mediaCalls===1){res.statusCode=503;return res.end(JSON.stringify({code:'MEDIA_PROVIDER_TEST_FAILURE',error:'이미지 공급자 일시 오류',retryable:true}));}
   assert.ok(snapshot.generationMeta.sectionDesign.completed.some(done=>snapshot.generationMeta.sectionDesign.groups.find(group=>group.id===done.id).nodeIds.includes(body.nodeId)));
   const node=treeNodes(snapshot.content.pageSchema).find(node=>node.id===body.nodeId);node.assetId='actual-image';node.requestId=null;snapshot.content.pageContext.assets['actual-image']={kind:'image',url:'/actual.png',width:1,height:1,displayAspectRatio:'16:9'};snapshot.content.pageSchema.mediaRequests=snapshot.content.pageSchema.mediaRequests.filter(item=>item.nodeId!==body.nodeId);data={ok:true,revision:++revision,snapshot};
  }
  if(path==='/api/promo-builder-documents'&&req.method==='PATCH'){assert.equal(snapshot.generationMeta.sectionDesign.state,'complete');assert.equal(snapshot.content.pageSchema.mediaRequests.length,0);savedGate=body.snapshot.qualityGate;snapshot={...body.snapshot,qualityGate:{...savedGate,documentRevision:++revision},documentRevision:revision};data={ok:true,revision,snapshot};}
  return res.end(JSON.stringify(data));
 }
 if(path==='/actual.png'){res.setHeader('Content-Type','image/png');return res.end(png);}
 if(path==='/'){res.setHeader('Content-Type','text/html');return res.end('<html><head><style>*{box-sizing:border-box}body{margin:0}</style><link rel="stylesheet" href="/prototype/visual-editor-assets/ai-builder.css"><script src="/prototype/wizard/promotion-overview.js"></script></head><body><div id="ai-builder-app"></div><script type="module" src="/prototype/visual-editor-assets/ai-builder.js"></script></body></html>');}
 const file=resolve(root,path.slice(1));if(!file.startsWith(root+'/prototype/')){res.statusCode=404;return res.end();}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream');res.end(await readFile(file));
}catch(error){errors.push(error.message);res.statusCode=500;res.end('{}');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/?mode=ai`);await page.getByPlaceholder('무엇을 만들고 싶으신가요?').fill('섹션과 컴포넌트가 실제 디자인되는 과정을 보여줘');await page.getByRole('button',{name:'전송',exact:true}).click();await page.getByRole('button',{name:/^(?:AI가 구성하고 미리보기 생성|페이지 미리보기 생성)$/}).click();
 await page.frameLocator('iframe').first().locator('[data-wireframe-node]').first().waitFor();
 await page.getByRole('button',{name:'페이지 구성 승인',exact:true}).click();
 const frame=page.frameLocator('iframe').first();await frame.locator('[data-live-design-state=generating]').first().waitFor();assert.equal(savedGate,undefined);
 await page.locator('.ai-builder-error').getByText('MEDIA_PROVIDER_TEST_FAILURE',{exact:true}).waitFor();
 assert.equal(snapshot.generationMeta.sectionDesign.completed.length,1);assert.equal(mediaCalls,1);
 await page.reload();await page.getByRole('button',{name:'실패한 단계부터 다시 시도',exact:true}).waitFor();
 await page.getByRole('button',{name:'실패한 단계부터 다시 시도',exact:true}).click();
 await page.locator('.ai-builder-error').getByText('SECTION_PROVIDER_TEST_FAILURE',{exact:true}).waitFor();
 await frame.locator('[data-live-design-state=failed]').first().waitFor();
 const plan=snapshot.generationMeta.sectionDesign,completedRootId=plan.groups[0].id;
 const rootTextId=treeNodes(snapshot.content.pageSchema).find(node=>node.type==='text'&&plan.groups[0].nodeIds.includes(node.id)).id;
 assert.equal(await frame.locator(`[data-ps-node="${rootTextId}"]`).evaluate(el=>getComputedStyle(el).color),'rgb(255, 119, 119)');
 assert.equal(plan.completed.length,1);assert.equal(mediaCalls,2);assert.equal(savedGate,undefined);
 await page.locator('.ai-final-review').screenshot({path:'/tmp/section-design-partial.png'});
 await page.reload();await page.locator('.ai-chat-pane').getByRole('button',{name:'실패한 단계부터 다시 시도',exact:true}).waitFor();
 assert.equal(await page.frameLocator('iframe').first().locator(`[data-ps-node="${rootTextId}"]`).evaluate(el=>getComputedStyle(el).color),'rgb(255, 119, 119)');
 await page.getByRole('button',{name:'실패한 단계부터 다시 시도',exact:true}).click();
 await page.waitForFunction(()=>document.body.textContent.includes('품질 검사 통과'));
 assert.equal(attempts[completedRootId],1);assert.equal(mediaCalls,2);assert.equal(snapshot.generationMeta.sectionDesign.state,'complete');assert.equal(savedGate.state,'passed');
 await page.locator('.ai-final-review').screenshot({path:'/tmp/section-design-complete.png'});
 assert.deepEqual(errors,[]);console.log('Section design browser: approved wireframe → real per-region model result → durable styles/media → partial failure/reload/retry without repeating finished regions → final quality passed');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
