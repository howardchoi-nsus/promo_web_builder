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
let current=fixture('example-split-nested'),snapshotOverride=null;
const ctx=structuredClone(context);
const dangerous='<img src=x onerror="window.injected=true">';
ctx.contentSources.source_title.text=dangerous;
const server=createServer(async(req,res)=>{try{
 if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end(htmlExport(snapshotOverride||snapshotForPage(normalize(current).page,ctx)).replace('</head>','<style>:root{--app-ink:red}body{font-size:99px;color:red}h1,p,button,article{color:red!important;font-size:99px!important;margin:85px!important}</style></head>'));}
 const path=resolve(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1));
 if(!path.startsWith(root+'/prototype/visual-editor-assets/')){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
 }catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1280,768,390,2048]){
  await page.setViewportSize({width,height:900});await page.goto(`http://127.0.0.1:${server.address().port}/`);const output=page.frameLocator('iframe').first();await output.locator('[data-ps-node]').first().waitFor();
  assert.equal(await page.frameLocator('iframe').first().locator('main').count(),1);
  assert.equal(await page.frameLocator('iframe').first().locator('h1').textContent(),dangerous);
  assert.equal(await page.evaluate(()=>window.injected),undefined);
  const result=await page.locator('iframe').first().evaluate((frame)=>{const document=frame.contentDocument;return ({overflows:[...document.querySelectorAll('[data-ps-node]')].filter(el=>el.clientWidth&&el.scrollWidth>el.clientWidth+2).map(el=>el.dataset.psNode),builderVariable:document.defaultView.getComputedStyle(document.querySelector('h1')).getPropertyValue('--app-ink'),fontSize:document.defaultView.getComputedStyle(document.querySelector('h1')).fontSize,pageMargin:document.defaultView.getComputedStyle(document.querySelector('[data-ps-node=page_root]')).paddingInlineStart,colors:[...document.querySelectorAll('h1')].map(el=>el.ownerDocument.defaultView.getComputedStyle(el).color),grid:[...document.querySelectorAll('[data-ps-type=grid]')].map(el=>el.ownerDocument.defaultView.getComputedStyle(el).gridTemplateColumns)});});
  assert.deepEqual(result.overflows,[],JSON.stringify({width,...result}));assert.equal(result.colors[0],'rgb(238, 238, 238)');assert.equal(result.builderVariable,'');assert.equal(result.fontSize,'16px');assert.equal(result.pageMargin,width===2048?'40px':width===1280?'32px':width===768?'24px':'16px');
  assert.ok(result.grid.every(value=>value.split(' ').length===(width===390?4:width===768?8:12)),JSON.stringify(result));
 }
 const splitShape=await page.frameLocator('iframe').first().locator('main').evaluate(el=>{const shape=n=>({tag:n.tagName,type:n.dataset.psType,children:[...n.children].filter(c=>c.dataset.psNode).map(shape)});return shape(el);});
 current=fixture('example-editorial');await page.reload();await page.frameLocator('iframe').first().locator('h1').waitFor();assert.equal(await page.frameLocator('iframe').first().locator('main').count(),1);assert.deepEqual(errors,[]);
 const editorialShape=await page.frameLocator('iframe').first().locator('main').evaluate(el=>{const shape=n=>({tag:n.tagName,type:n.dataset.psType,children:[...n.children].filter(c=>c.dataset.psNode).map(shape)});return shape(el);});
 assert.notDeepEqual(splitShape,editorialShape,'The renderer must preserve different generated trees rather than apply a fixed DOM template');
 assert.equal(await page.frameLocator('iframe').first().locator('.rendered-items').count(),0);
 // Registered spacing values override role defaults, not arbitrary pixel literals.
 current.root.styles.base.push('layout.padding');current.root.styles.spacing={base:{gap:'--spacing-8',padding:null,margin:null},tablet:null,mobile:null};
 await page.reload();await page.frameLocator('iframe').first().locator('[data-ps-node=page_root]').waitFor();
 assert.equal(await page.frameLocator('iframe').first().locator('[data-ps-node=page_root]').evaluate(el=>el.ownerDocument.defaultView.getComputedStyle(el).gap),'8px');
 assert.equal(await page.frameLocator('iframe').first().locator('[data-ps-node=page_root]').evaluate(el=>el.ownerDocument.defaultView.getComputedStyle(el).paddingInlineStart),'40px');
 const bad=ctx.tokenValues['--grid-mobile-375-gutter'];delete ctx.tokenValues['--grid-mobile-375-gutter'];
 await page.reload();await page.getByRole('alert').waitFor();assert.equal(await page.locator('iframe').count(),0);ctx.tokenValues['--grid-mobile-375-gutter']=bad;
 const template=snapshotForPage(normalize(fixture('example-editorial')).page,ctx);
 delete template.content.pageSchema;delete template.content.pageContext;
 template.content.sectionSnapshot=[{sectionKey:'legacy',sectionRole:'hero',items:[{itemKey:'title',fieldKind:'text',textType:'title'}]}];template.content.sectionInputs={legacy:{title:'Legacy registered output'}};template.content.sectionOrder=['legacy'];
 template.designSpec.sectionStyles={legacy:{layoutMode:'flow',layoutColumns:1}};template.designSpec.itemStyles={'legacy.title':{positionMode:'flow',widthMode:'fill'}};
 snapshotOverride=template;
 await page.reload();await page.frameLocator('iframe').first().getByText('Legacy registered output',{exact:true}).waitFor();
 const legacyColor=await page.frameLocator('iframe').first().locator('.rendered-text').evaluate(el=>el.ownerDocument.defaultView.getComputedStyle(el).color);assert.equal(legacyColor,'rgb(238, 238, 238)');
 template.designSpec.itemStyles['legacy.title'].color='#ff0000';
 await page.reload();await page.getByRole('alert').waitFor();assert.equal(await page.locator('iframe').count(),0);
 assert.deepEqual(errors,[]);
 console.log('PageSchema browser: HTML export, recursive rendering, registered color, XSS text, desktop/tablet/mobile reflow and overflow passed.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
