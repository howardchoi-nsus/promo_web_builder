import assert from 'node:assert/strict';
import {createServer} from 'vite';
import vue from '@vitejs/plugin-vue';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite'),db=new PGlite();
await db.exec(readFileSync(new URL('../db/migrations/091_admin_agent_skills.sql',import.meta.url),'utf8'));
const sql=async(strings,...values)=>(await db.query(strings.reduce((q,s,i)=>q+(i?'$'+i:'')+s,''),values)).rows;
require('../api/_prompt-template-store').getSql=()=>sql;
process.env.PROMO_ADMIN_SESSION_SECRET='browser-test-agent-skill-secret-long-enough';process.env.VERCEL='1';
const auth=require('../api/_promo-admin-auth'),token=auth.createAdminSessionToken({subject:'browser-test'}),handler=require('../api/agent-skills');
const server=await createServer({configFile:false,root:process.cwd(),plugins:[vue(),{
 name:'skill-test',resolveId(id){if(id==='/__skill-entry.js')return '\0skill-entry';},
 load(id){if(id==='\0skill-entry')return `import{createApp,ref}from'vue';import Manager from '/admin-app/src/components/AgentSkillManager.vue';import Bindings from '/admin-app/src/components/PromptSkillBindings.vue';createApp({components:{Manager,Bindings},setup(){return{bindings:ref([])}},template:'<Manager/><fieldset><legend>프롬프트 연결 테스트</legend><Bindings v-model="bindings"/><output id="binding-result">{{JSON.stringify(bindings)}}</output></fieldset>'}).mount('#app');`;},
 configureServer(server){server.middlewares.use(async(req,res,next)=>{
  if(req.url==='/__skill-test'){res.setHeader('Content-Type','text/html');return res.end('<style>*{box-sizing:border-box}body{font-family:Arial}input,textarea,select{max-width:100%}</style><div id="app"></div><script type="module" src="/__skill-entry.js"></script>');}
  if(!req.url.startsWith('/api/agent-skills'))return next();
  const query=Object.fromEntries(new URL(req.url,'http://localhost').searchParams);let body={};
  if(['POST','PATCH'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);body=JSON.parse(Buffer.concat(chunks).toString());}
  res.status=function(code){this.statusCode=code;return this;};res.json=function(value){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(value));return this;};
  await handler({method:req.method,headers:req.headers,body,query},res);
 });}
}],resolve:{alias:{vue:'vue/dist/vue.esm-bundler.js'}},server:{host:'127.0.0.1',port:0}});
let browser;
try{
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium'});
 const context=await browser.newContext();await context.addCookies([{name:auth.ADMIN_COOKIE_NAME,value:token,url:origin}]);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/__skill-test');await page.getByRole('heading',{name:'스킬 관리',exact:true}).waitFor();
 await page.getByLabel('스킬 키',{exact:true}).fill('taste-guidance');await page.getByLabel('스킬 이름',{exact:true}).fill('Taste guidance');
 const markdown='# Guidance\nUse registered tokens.\n<script>window.skillExecuted=true</script>\n{{literal_reference}}';
 await page.getByLabel('MD 파일 불러오기',{exact:true}).setInputFiles({name:'SKILL.md',mimeType:'text/markdown',buffer:Buffer.from(markdown)});
 assert.equal(await page.getByLabel('MD 지침',{exact:true}).inputValue(),markdown);
 await page.getByRole('button',{name:'스킬 등록',exact:true}).click();await page.getByRole('status').getByText(/v1을 저장/).waitFor();
 const [{id:firstId}]=(await sql`select id::text from promo_agent_skill_versions order by version`);
 await page.getByLabel('추가할 스킬 버전',{exact:true}).selectOption(firstId);await page.getByRole('button',{name:'스킬 연결',exact:true}).click();
 assert.deepEqual(JSON.parse(await page.locator('#binding-result').textContent()),[{skillVersionId:firstId}]);
 await page.getByLabel('MD 지침',{exact:true}).fill('# Guidance version two');await page.getByRole('button',{name:'새 버전 저장',exact:true}).click();await page.getByRole('status').getByText(/v2을 저장/).waitFor();
 assert.deepEqual(JSON.parse(await page.locator('#binding-result').textContent()),[{skillVersionId:firstId}]);
 await page.getByRole('button',{name:'내용 보기',exact:true}).click();assert.equal(await page.locator('.prompt-skill-bindings pre').textContent(),markdown);assert.equal(await page.evaluate(()=>Boolean(window.skillExecuted)),false);
 await page.getByRole('button',{name:'비활성화',exact:true}).click();await page.getByRole('status').getByText(/비활성화했습니다/).waitFor();
 assert.equal(await page.getByLabel('추가할 스킬 버전').locator('option:not([value=""]):not(:disabled)').count(),0);
 await page.getByRole('button',{name:'연결 해제',exact:true}).click();assert.equal(await page.locator('#binding-result').textContent(),'[]');
 await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth>el.clientWidth+2),false);
 assert.deepEqual(errors,[]);await page.screenshot({path:'/tmp/admin-agent-skills.png',fullPage:true});
 console.log('Agent skills browser + PGlite: MD upload/create, append v2, pinned binding, safe literal preview, global disable, unlink and responsive form passed.');
}finally{await browser?.close();await server.close();await db.close();delete process.env.VERCEL;delete process.env.PROMO_ADMIN_SESSION_SECRET;}
