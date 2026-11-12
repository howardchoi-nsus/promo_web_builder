import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {spawn,spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {fixture,context} from './fixtures/page-schema.mjs';
import {designFixture,png} from './fixtures/design-preview-enhancements.mjs';
if(!existsSync(new URL('../apps/promo-runtime-nuxt/.output/server/index.mjs',import.meta.url))){const built=spawnSync('pnpm',['run','build:nuxt-runtime'],{cwd:new URL('..',import.meta.url),encoding:'utf8'});assert.equal(built.status,0,built.stderr);}
const require=createRequire(import.meta.url);
const {snapshotForPage}=require('../api/_page-schema-service');
const {normalize}=require('../shared/page-schema/contract.cjs');
const snapshot=snapshotForPage(normalize(fixture('example-editorial')).page,context);
const publication={contractVersion:1,publication:{id:'test-publication',documentId:'test-document',slug:'strict-output',locale:'ko-KR',status:'published',publishedRevision:1},renderer:{key:'page-schema-renderer',version:1},snapshot,seo:{title:'Strict output SSR'},cache:{etag:'fixture',revalidateSeconds:0}};
const backend=createServer((req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,publication}));});
await new Promise(r=>backend.listen(0,'127.0.0.1',r));
const reservation=createServer();await new Promise(r=>reservation.listen(0,'127.0.0.1',r));const port=reservation.address().port;await new Promise(r=>reservation.close(r));
const child=spawn(process.execPath,['apps/promo-runtime-nuxt/.output/server/index.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,NITRO_PORT:String(port),PORT:String(port),NITRO_HOST:'127.0.0.1',NUXT_PROMO_API_BASE_URL:`http://127.0.0.1:${backend.address().port}`},stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',b=>logs+=b);child.stderr.on('data',b=>logs+=b);
let browser;
try{
 const url=`http://127.0.0.1:${port}/promotions/strict-output`;
 let response;for(let i=0;i<80;i++){try{response=await fetch(url);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 assert.equal(response?.status,200,logs);const html=await response.text();
 assert.ok(html.includes('새로운 프로모션을 만나보세요'),'Server-rendered srcdoc must contain visible source content');
 assert.ok(html.includes('srcdoc='));assert.equal(html.includes('--app-'),false);
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/hydration|mismatch/i.test(m.text()))errors.push(m.text());});
 await page.goto(url);await page.frameLocator('iframe').first().locator('h1').waitFor();
 assert.equal(await page.frameLocator('iframe').first().locator('h1').textContent(),context.contentSources.source_title.text);
 const enhanced=designFixture({pending:false});
 publication.snapshot=snapshotForPage(normalize(enhanced.page).page,enhanced.context);publication.renderer.version=2;publication.publication.slug='strict-enhanced';
 await page.route('**/design-fixture.png',route=>route.fulfill({contentType:'image/png',body:png}));
 await page.goto(`http://127.0.0.1:${port}/promotions/strict-enhanced`);
 const output=page.frameLocator('iframe').first();await output.locator('[data-ps-node=design_icon]').waitFor();
 assert.equal(await output.locator('h1').evaluate(el=>getComputedStyle(el).fontSize),'48px');
 assert.equal(await output.locator('[data-ps-node=page_root]').evaluate(el=>getComputedStyle(el).borderTopStyle),'solid');
 assert.equal(await output.locator('[data-ps-node=design_icon]').textContent(),'♠');
 const noJs=await browser.newPage({javaScriptEnabled:false});await noJs.goto(`http://127.0.0.1:${port}/promotions/strict-enhanced`);
 await noJs.frameLocator('iframe').first().locator('h1').waitFor();assert.equal(await noJs.frameLocator('iframe').first().locator('h1').evaluate(el=>getComputedStyle(el).fontSize),'48px');await noJs.close();
 assert.deepEqual(errors,[]);console.log('Output isolation SSR: Nuxt server srcdoc content, registered styles, client hydration and live isolated DOM passed.');
}catch(error){console.error(logs);throw error;}finally{await browser?.close();child.kill('SIGTERM');await new Promise(r=>backend.close(r));}
