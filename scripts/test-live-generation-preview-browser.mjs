import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {build} from 'vite';
import {chromium} from 'playwright';
import {png} from './fixtures/design-preview-enhancements.mjs';
const result=await build({configFile:false,logLevel:'silent',build:{write:false,lib:{entry:new URL('../visual-editor/src/builder/services/live-generation-preview.mjs',import.meta.url).pathname,formats:['es'],fileName:'live'},minify:false}});
const code=[result].flat().flatMap(item=>item.output||[]).find(item=>item.type==='chunk'&&item.isEntry).code;
const server=createServer(async(req,res)=>{
 if(req.url==='/helper.js'){res.setHeader('Content-Type','text/javascript');return res.end(code);}
 if(req.url.startsWith('/good.png')){await new Promise(resolve=>setTimeout(resolve,350));res.setHeader('Content-Type','image/png');return res.end(png);}
 if(req.url==='/bad.png'){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type','text/html');res.end(`<html><body><iframe id="preview" style="height:220px;width:400px" srcdoc="<html><head></head><body><div data-output-boundary><div data-ps-node='image' data-ps-type='image' style='width:200px;aspect-ratio:16/9'>이미지 생성 대기</div><img data-ps-node='kept' data-ps-type='image' src='/good.png' style='width:80px;height:60px'></div></body></html>"></iframe>
 <script type="module">
 import {createLiveGenerationPreview} from '/helper.js';
 window.identity='doc-a';window.activity={};window.animations=0;
 window.snapshot={generationMeta:{review:{state:'pending'}},content:{pageSchema:{root:{type:'container',id:'root',children:[{type:'image',id:'image',assetId:null,presentation:'background',aspectRatio:'16:9',children:[]},{type:'image',id:'kept',assetId:'kept',children:[]}]},mediaRequests:[{id:'req',nodeId:'image'}]},pageContext:{assets:{kept:{url:'/good.png'}}}}};
 window.doc=()=>document.querySelector('iframe').contentDocument;
 window.start=()=>{window.controller=createLiveGenerationPreview({getDocument:doc,getSnapshot:()=>snapshot,getActivity:()=>activity,getIdentity:()=>identity});controller.refresh();};
 window.bind=(id,url)=>{snapshot.content.pageSchema.root.children[0].assetId=id;snapshot.content.pageContext.assets[id]={url};snapshot.content.pageSchema.mediaRequests=[];const el=doc().querySelector('[data-ps-node]'),image=doc().createElement('img');image.dataset.psNode='image';image.dataset.psType='image';image.style.cssText='width:200px;aspect-ratio:16/9;height:auto';image.addEventListener('animationstart',()=>animations++);image.src=url;el.replaceWith(image);controller.refresh();};
 window.pending=()=>{snapshot.content.pageSchema.root.children[0].assetId=null;snapshot.content.pageSchema.mediaRequests=[{id:'req-2',nodeId:'image'}];const el=doc().querySelector('[data-ps-node]'),placeholder=doc().createElement('div');placeholder.dataset.psNode='image';placeholder.style.cssText='width:200px;aspect-ratio:16/9';el.replaceWith(placeholder);controller.refresh();};
 window.setup=true;
 </script></body></html>`);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>window.setup&&doc().querySelector('[data-output-boundary]'));
 const region=page.frameLocator('iframe').locator('[data-ps-node=image]');
 await page.evaluate(()=>{window.keptElement=doc().querySelector('[data-ps-node=kept]');start();});assert.equal(await region.getAttribute('data-live-state'),null);
 await page.evaluate(()=>{snapshot.generationMeta.review.state='approved';controller.refresh();});assert.equal(await region.getAttribute('data-live-state'),'waiting');
 assert.equal(await page.frameLocator('iframe').locator('[data-live-background]').count(),1);
 const before=await region.boundingBox();
 await page.evaluate(()=>{activity.activeNodeId='image';controller.refresh();});assert.equal(await region.getAttribute('data-live-state'),'generating');
 await page.evaluate(()=>{activity.failedNodeId='image';controller.refresh();});assert.equal(await region.getAttribute('data-live-state'),'failed');
 await page.evaluate(()=>{activity={activeNodeId:'image'};controller.refresh();});
 await page.evaluate(()=>bind('asset-1','/good.png?image=1'));assert.equal(await region.getAttribute('data-live-state'),'loading');
 await page.waitForFunction(()=>doc().querySelector('[data-ps-node=image][data-live-state=ready]'));
 await page.waitForFunction(()=>animations===1);
 assert.equal(await page.frameLocator('iframe').locator('[data-live-background]').count(),0);
 const after=await region.boundingBox();assert.ok(Math.abs(before.height-after.height)<2);
 await page.evaluate(()=>{controller.refresh();controller.refresh();});await page.waitForTimeout(380);assert.equal(await page.evaluate(()=>animations),1);
 const original=await page.evaluate(()=>JSON.stringify(snapshot));
 await page.evaluate(()=>controller.pause());assert.equal(await region.getAttribute('data-live-state'),null);assert.equal(await page.frameLocator('iframe').locator('[data-live-preview-style]').count(),0);
 await page.evaluate(()=>controller.resume());await page.waitForFunction(()=>doc().querySelector('[data-ps-node=image][data-live-state=ready]'));
 assert.equal(await region.getAttribute('data-live-reveal'),null);assert.equal(await page.evaluate(()=>JSON.stringify(snapshot)),original);
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>pending());await page.evaluate(()=>bind('asset-2','/good.png'));await page.waitForFunction(()=>doc().querySelector('[data-ps-node=image][data-live-state=ready]'));
 assert.equal(await region.evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.evaluate(()=>pending());await page.evaluate(()=>bind('bad','/bad.png'));await page.waitForFunction(()=>doc().querySelector('[data-live-state=failed]'));
 assert.equal(await page.evaluate(()=>keptElement===doc().querySelector('[data-ps-node=kept]')&&keptElement.naturalWidth>0),true);
 assert.equal(await page.frameLocator('iframe').locator('[data-ps-node=kept]').getAttribute('data-live-reveal'),null);
 await page.evaluate(()=>{identity='doc-b';activity={};pending();});
 assert.equal(await region.getAttribute('data-live-state'),'waiting');
 await page.evaluate(()=>bind('asset-1','/good.png?image=1'));await page.waitForFunction(()=>doc().querySelector('[data-ps-node=image][data-live-state=ready]'));
 assert.notEqual(await region.getAttribute('data-live-reveal'),null);
 await page.evaluate(()=>{controller.dispose();start();});await page.waitForFunction(()=>doc().querySelector('[data-ps-node=image][data-live-state=ready]'));
 assert.equal(await region.getAttribute('data-live-reveal'),null);
 await page.evaluate(()=>{pending();bind('stale','/good.png?late=1');identity='doc-c';pending();});
 await page.waitForTimeout(450);assert.equal(await region.getAttribute('data-live-state'),'waiting');
 await page.evaluate(()=>{controller.dispose();});assert.equal(await region.getAttribute('data-live-state'),null);
 assert.equal(await page.frameLocator('iframe').locator('[data-live-preview-style]').count(),0);assert.deepEqual(errors,[]);
 console.log('Live preview browser: approval, real active job/failure, async load+decode, stable ratio, one-time reveal, inspection isolation, reduced motion, completed-region preservation, document switching, late load, remount and cleanup passed');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
