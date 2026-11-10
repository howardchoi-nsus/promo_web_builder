import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url);
const {normalize}=require('../shared/page-schema/contract.cjs');
const {snapshotForPage}=require('../api/_page-schema-service');
const {htmlExport}=require('../api/_promo-builder-export-adapters');
const root=resolve(new URL('..',import.meta.url).pathname);
let current=fixture('example-split-nested');
const ctx=structuredClone(context);
const dangerous='<img src=x onerror="window.injected=true">';
ctx.contentSources.source_title.text=dangerous;
const server=createServer(async(req,res)=>{try{
 if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end(htmlExport(snapshotForPage(normalize(current).page,ctx)));}
 const path=resolve(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1));
 if(!path.startsWith(root+'/prototype/visual-editor-assets/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
 }catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1280,768,390]){
  await page.setViewportSize({width,height:900});await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.locator('[data-ps-node]').first().waitFor();
  assert.equal(await page.locator('main').count(),1);
  assert.equal(await page.locator('h1').textContent(),dangerous);
  assert.equal(await page.evaluate(()=>window.injected),undefined);
  const result=await page.evaluate(()=>({overflows:[...document.querySelectorAll('[data-ps-node]')].filter(el=>el.clientWidth&&el.scrollWidth>el.clientWidth+2).map(el=>el.dataset.psNode),colors:[...document.querySelectorAll('h1')].map(el=>getComputedStyle(el).color),grid:[...document.querySelectorAll('[data-ps-type=grid]')].map(el=>getComputedStyle(el).gridTemplateColumns)}));
  assert.deepEqual(result.overflows,[],JSON.stringify({width,...result}));assert.equal(result.colors[0],'rgb(238, 238, 238)');
  if(width===390)assert.ok(result.grid.every(value=>value.split(' ').length===1),JSON.stringify(result));
 }
 current=fixture('example-editorial');await page.reload();await page.locator('h1').waitFor();assert.equal(await page.locator('main').count(),1);assert.deepEqual(errors,[]);
 console.log('PageSchema browser: HTML export, recursive rendering, registered color, XSS text, desktop/tablet/mobile reflow and overflow passed.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
