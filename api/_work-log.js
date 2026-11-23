const {AsyncLocalStorage}=require('node:async_hooks');
const {randomUUID}=require('node:crypto');
const context=new AsyncLocalStorage(),UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const uuid=value=>UUID.test(String(value||''))?String(value):null;
const key=value=>String(value||'').replace(/[^a-zA-Z0-9_.:/[\]-]/g,'').slice(0,160);
function scrub(value,limit=700){return String(value||'').replace(/https?:\/\/[^\s"'<>]+/gi,'[URL]').replace(/Bearer\s+\S+/gi,'[REDACTED]').replace(/\b(?:sk-|AIza|vercel_blob_rw_)[a-zA-Z0-9_-]+/g,'[REDACTED]').replace(/["']?(?:password|secret|access[_ -]?key|api[_ -]?key|token|authorization|cookie)["']?\s*[:=]\s*(?:"[^"]*"|'[^']*'|[^\s,;}]+)/gi,'[REDACTED]').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[EMAIL]').slice(0,limit);}
function safeMeta(source={}){
 const out={};for(const name of ['provider','model','promptId','promptVersion','promptType','renderedPromptHash','unitId','groupId','nodeId','runId','sequence','revision','baseRevision','retryable','cached','replayed','pending','attempt','repairCalls','sourceEventName','eventPhase','buildSha','providerRequestId','platformRequestId','sourceRequestId'])if(source[name]!==undefined)out[name]=typeof source[name]==='boolean'||typeof source[name]==='number'?source[name]:scrub(source[name],180);
 if(Array.isArray(source.skills))out.skills=source.skills.slice(0,8).map(s=>({id:key(s.id),version:Number(s.version)||null}));
 if(source.usage&&typeof source.usage==='object'){out.usage={};for(const name of ['input_tokens','output_tokens','total_tokens','prompt_tokens','completion_tokens'])if(Number.isFinite(source.usage[name]))out.usage[name]=source.usage[name];}
 if(Array.isArray(source.errors))out.errors=source.errors.slice(0,12).map(e=>({path:scrub(e.path||e.instancePath,200),code:key(e.code),message:scrub(e.message,300)}));
 if(source.timings&&typeof source.timings==='object')out.timings=Object.fromEntries(Object.entries(source.timings).filter(([k,v])=>/Ms$/.test(k)&&Number.isFinite(v)).slice(0,16));
 return out;
}
let warned=false;
function unavailable(error){if(!warned){warned=true;console.warn(JSON.stringify({event:'work_log_unavailable',code:key(error.code)||'WORK_LOG_STORAGE_UNAVAILABLE',message:'Admin work logs could not be persisted. Check migration 099 and database connectivity.'}));}}
async function writeLog(sql,entry){
 await sql`insert into promo_work_logs(id,task_id,request_id,document_id,session_id,stage,operation,event,status,duration_ms,http_status,error_code,message,metadata) values (${randomUUID()}::uuid,${entry.taskId}::uuid,${entry.requestId}::uuid,${uuid(entry.documentId)}::uuid,${uuid(entry.sessionId)}::uuid,${key(entry.stage)},${key(entry.operation)},${entry.event},${entry.status},${Number.isFinite(entry.durationMs)?Math.min(2147483647,Math.max(0,Math.round(entry.durationMs))):null},${entry.httpStatus||null},${key(entry.errorCode)||null},${scrub(entry.message)},${JSON.stringify(safeMeta(entry.metadata))}::jsonb)`;
}
async function logEvent(entry){const ctx=context.getStore();if(!ctx)return;try{const writing=writeLog(ctx.sql,{...ctx,...entry});try{require('@vercel/functions').waitUntil(writing.catch(()=>{}));}catch{}await writing;}catch(error){ctx.logFailed=true;unavailable(error);console.warn(JSON.stringify({event:'work_log_fallback',taskId:ctx.taskId,requestId:ctx.requestId,stage:ctx.stage,operation:ctx.operation,logEvent:entry.event,status:entry.status,errorCode:key(entry.errorCode),message:scrub(entry.message),metadata:safeMeta(entry.metadata)}));}}
function bodyOf(req){if(req.body&&typeof req.body==='object')return req.body;try{return JSON.parse(req.body||'{}');}catch{return {};}}
function withWorkLog(stage,handler){
 const wrapped=async function(req,res){
  let sql;try{sql=require('./_prompt-template-store').getSql();}catch(error){unavailable(error);return handler(req,res);}
  const body=bodyOf(req),requestId=randomUUID(),ctx={sql,stage,operation:key(body.operation||req.method||'request'),taskId:uuid(req.headers?.['x-builder-task-id'])||uuid(body.taskId)||requestId,requestId,documentId:uuid(body.documentId||req.query?.documentId),sessionId:uuid(body.sessionId||req.query?.sessionId)};
  return context.run(ctx,async()=>{
   const started=Date.now();let payload,status=200,thrown;
   res.setHeader?.('X-Work-Request-Id',requestId);res.setHeader?.('X-Work-Task-Id',ctx.taskId);
   const originalStatus=res.status,originalJson=res.json;
   if(originalStatus)res.status=function(code){status=Number(code);return originalStatus.call(this,code);};
   if(originalJson)res.json=function(value){payload=value;return originalJson.call(this,value);};
   await logEvent({event:'request_started',status:'running',metadata:{baseRevision:body.baseDocumentRevision,runId:body.runId||body.requestId||req.query?.id,groupId:body.groupId,nodeId:body.nodeId,sequence:body.sequence,platformRequestId:req.headers?.['x-vercel-id'],buildSha:process.env.VERCEL_GIT_COMMIT_SHA}});
   try{return await handler(req,res);}catch(error){thrown=error;throw error;}finally{
    res.status=originalStatus;res.json=originalJson;
    ctx.documentId=ctx.documentId||uuid(payload?.document?.id);ctx.sessionId=ctx.sessionId||uuid(payload?.session?.id);
    const failed=Boolean(thrown)||status>=400||payload?.ok===false,httpStatus=thrown?thrown.statusCode||500:status;
    await logEvent({event:'request_finished',status:failed?'failed':payload?.pending?'pending':'succeeded',durationMs:Date.now()-started,httpStatus,errorCode:thrown?.code||payload?.code||(failed?(httpStatus<400?'WORK_OPERATION_FAILED':'HTTP_'+httpStatus):null),message:failed?(thrown?.message||payload?.message||payload?.error):'',metadata:{providerRequestId:payload?.requestId,revision:payload?.revision,retryable:payload?.retryable,cached:payload?.cached,replayed:payload?.replayed,pending:payload?.pending,errors:thrown?.errors||payload?.errors||payload?.details,timings:payload?.workTiming}});
    if(ctx.logFailed)console.warn(JSON.stringify({event:'work_log_incomplete',taskId:ctx.taskId,requestId,stage}));
   }
  });
 };
 Object.assign(wrapped,handler);return wrapped;
}
function withModelLog(fn){return async function(input,...args){if(!context.getStore())return fn.call(this,input,...args);let started;const cfg=input?.promptConfig||{},metadata={provider:cfg.provider,model:cfg.model,promptId:cfg.promptId,promptVersion:cfg.promptVersion,promptType:input?.type||cfg.promptType||(input?.targetType==='component'?'component_image':input?.targetType?'section_background_image':undefined),renderedPromptHash:cfg.renderedPromptHash,skills:cfg.skillSnapshots};await logEvent({event:'model_started',status:'running',metadata});started=Date.now();try{const result=await fn.call(this,input,...args);await logEvent({event:'model_finished',status:'succeeded',durationMs:Date.now()-started,metadata:{...metadata,usage:result?.usage}});return result;}catch(error){await logEvent({event:'model_finished',status:'failed',durationMs:Date.now()-started,errorCode:error.code,message:error.message,metadata:{...metadata,retryable:error.retryable,errors:error.errors,providerRequestId:error.requestId}});throw error;}};}
function withBackgroundLog(stage,fn){return async function(...args){const parent=context.getStore();if(!parent)return fn.apply(this,args);return context.run({...parent,stage,operation:'background',requestId:randomUUID()},async()=>{const started=Date.now();await logEvent({event:'request_started',status:'running'});try{const result=await fn.apply(this,args);await logEvent({event:'request_finished',status:result?.ok===false?'failed':'succeeded',durationMs:Date.now()-started,errorCode:result?.code,message:result?.ok===false?result?.error||result?.message:''});return result;}catch(error){await logEvent({event:'request_finished',status:'failed',durationMs:Date.now()-started,errorCode:error.code,message:error.message});throw error;}});};}
module.exports={context,uuid,key,scrub,safeMeta,writeLog,logEvent,withWorkLog,withModelLog,withBackgroundLog};
