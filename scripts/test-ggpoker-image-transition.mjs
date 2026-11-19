import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const root=new URL('../',import.meta.url);
let html=readFileSync(new URL('prototype/progressive-rendering-ggpoker.html',root),'utf8');
for(const name of ['demo','ggpoker'])html=html.replace(`<link rel="stylesheet" href="/prototype/progressive-rendering/${name}.css">`,()=>`<style>${readFileSync(new URL(`prototype/progressive-rendering/${name}.css`,root),'utf8')}</style>`);
for(const name of ['demo','ggpoker-layout','feedback'])html=html.replace(`<script type="module" src="/prototype/progressive-rendering/${name}.js"></script>`,()=>`<script type="module">${readFileSync(new URL(`prototype/progressive-rendering/${name}.js`,root),'utf8')}</script>`);
html=html.replace('/prototype/progressive-rendering/assets/poker-keyvisual.png','data:image/png;base64,'+readFileSync(new URL('prototype/progressive-rendering/assets/poker-keyvisual.png',root)).toString('base64'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent(html);await page.clock.install();
 await page.evaluate(()=>{const original=HTMLImageElement.prototype.decode;HTMLImageElement.prototype.decode=function(){return new Promise((resolve,reject)=>{window.releaseImage=()=>original.call(this).then(resolve,reject);});};window.fadeCount=0;document.addEventListener('transitionrun',e=>{if(e.target.matches('.premium-keyvisual')&&e.propertyName==='opacity')window.fadeCount++;});});
 await page.locator('#start').click();await page.clock.runFor(18000);
 assert.equal(await page.locator('#hero-art').getAttribute('data-ready'),'false');assert.notEqual(await page.locator('#status').textContent(),'샘플 디자인 완료');
 const rect=await page.locator('.hero').boundingBox();await page.evaluate(()=>window.releaseImage());await page.clock.runFor(150);
 assert.equal(await page.locator('#hero-art').getAttribute('data-ready'),'true');
 assert.equal(await page.locator('.premium-keyvisual').evaluate(el=>getComputedStyle(el).transitionDuration),'0.65s');
 await page.clock.runFor(800);await page.waitForTimeout(900);assert.equal(await page.locator('.premium-keyvisual').evaluate(el=>getComputedStyle(el).opacity),'1');assert.equal(await page.locator('#hero-art').evaluate(el=>getComputedStyle(el,'::after').opacity),'0');
 assert.deepEqual(await page.locator('.hero').boundingBox(),rect);
 const count=await page.evaluate(()=>window.fadeCount);assert.equal(count,1);
 await page.locator('button[data-layout=center]').click();await page.clock.runFor(800);await page.getByRole('button',{name:'Mobile',exact:true}).click();await page.clock.runFor(800);assert.equal(await page.evaluate(()=>window.fadeCount),count);
 await page.setViewportSize({width:390,height:844});await page.clock.runFor(500);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.premium-keyvisual').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');assert.deepEqual(errors,[]);
 console.log('PASS: decode-gated 650ms image/placeholder crossfade, stable layout, one-time transition across layout/view changes, mobile and reduced motion.');
}finally{await browser.close();}
