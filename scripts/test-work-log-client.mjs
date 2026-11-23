import assert from 'node:assert/strict';
const values=new Map();globalThis.sessionStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
const {startWorkTask,workTaskId,bindWorkContext}=await import('../visual-editor/src/builder/services/work-log-context.mjs');
const first=startWorkTask('doc-a','session-a');assert.equal(workTaskId({documentId:'doc-a'}),first);assert.equal(workTaskId({sessionId:'session-a'}),first);
const next=startWorkTask('doc-a','session-a');assert.notEqual(next,first);assert.equal(workTaskId({sessionId:'session-a'}),next);
bindWorkContext(next,{}, {document:{id:'doc-b'},session:{id:'session-b'}});assert.equal(workTaskId({documentId:'doc-b'}),next);
const requests=[];globalThis.fetch=async(path,options)=>{requests.push({path,options});return {ok:true,json:async()=>({ok:true}),headers:new Headers()};};
const client=await import('../visual-editor/src/builder/services/composition-client.mjs');
await client.createPromoRequestV3({},'idempotent');assert.equal(requests.at(-1).options.headers['X-Builder-Task-Id'],next);assert.equal(requests.at(-1).options.headers['Idempotency-Key'],'idempotent');
startWorkTask('another');await client.loadBuilderDocument('doc-a');assert.equal(requests.at(-1).options.headers['X-Builder-Task-Id'],next);
console.log('Work log client: per-request task/session/document continuity, follow-up separation, GET lookup and custom header preservation passed.');

const handlers=new Map(),view={addEventListener:(name,fn)=>handlers.set(name,fn),removeEventListener:name=>handlers.delete(name)};let previousCalled=0;
const app={config:{errorHandler:()=>previousCalled++}}, {installWorkErrorReporting}=await import('../visual-editor/src/builder/services/work-error-reporting.mjs');
const uninstall=installWorkErrorReporting(app,view);const count=requests.length;app.config.errorHandler(Error('render failure'));handlers.get('unhandledrejection')({reason:Error('async failure')});await new Promise(resolve=>setTimeout(resolve,10));assert.equal(previousCalled,1);assert.ok(requests.slice(count).some(r=>r.options.body?.includes('VUE_RENDER_ERROR')));assert.ok(requests.slice(count).some(r=>r.options.body?.includes('BROWSER_UNHANDLED_REJECTION')));uninstall();assert.equal(handlers.size,0);
