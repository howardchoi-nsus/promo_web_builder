const {resolveAdminOwner}=require('./_promo-admin-auth');
const {getSql}=require('./_prompt-template-store');
const {uuid,key}=require('./_work-log');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 try{
  resolveAdminOwner(req,res);
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const q=req.query||{},status=String(q.status||''),event=String(q.event||''),stage=String(q.stage||''),search=String(q.search||'').trim(),errorCode=String(q.errorCode||'').trim(),reference=String(q.reference||'').trim(),limit=Number(q.limit||50),openOnly=q.openOnly==='true';
  if(!Number.isInteger(limit)||limit<1||limit>100||!['','running','succeeded','failed','pending','cancelled'].includes(status)||!['','request_started','request_finished','model_started','model_finished','checkpoint','client_error'].includes(event)||stage.length>160||errorCode.length>160||reference.length>180||(search&&!uuid(search)))return res.status(400).json({error:'필터 또는 조회 건수를 확인해 주세요.',code:'WORK_LOG_FILTER_INVALID'});
  let before=null;if(q.cursor){try{const c=JSON.parse(Buffer.from(String(q.cursor),'base64url').toString());if(!/^[1-9][0-9]{0,18}$/.test(String(c.sequence))||BigInt(c.sequence)>9223372036854775807n)throw Error();before=String(c.sequence);}catch{return res.status(400).json({error:'조회 위치가 올바르지 않습니다.',code:'WORK_LOG_CURSOR_INVALID'});}}
  const sql=getSql(),ready=await sql`select to_regclass('public.promo_work_logs') is not null as ready`;
  if(!ready[0]?.ready)return res.status(503).json({error:'작업 로그 저장을 위해 migration 099를 먼저 적용해 주세요.',code:'WORK_LOG_MIGRATION_REQUIRED'});
  if(q.mode==='performance'){if(!uuid(search))return res.status(400).json({error:'성능 요약에는 작업 ID가 필요합니다.',code:'WORK_LOG_TASK_REQUIRED'});return res.status(200).json({ok:true,performance:await require('./_work-performance-report').performanceReport(sql,search)});}
  const rows=await sql`select id::text,sequence::text,created_at::text as "createdAt",task_id::text as "taskId",request_id::text as "requestId",document_id::text as "documentId",session_id::text as "sessionId",stage,operation,event,status,duration_ms as "durationMs",http_status as "httpStatus",error_code as "errorCode",message,metadata
   from promo_work_logs l where (${status}='' or status=${status}) and (${event}='' or event=${event}) and (${stage}='' or stage=${stage}) and (${errorCode}='' or error_code=${errorCode})
   and (${openOnly}=false or (event='request_started' and not exists(select 1 from promo_work_logs finished where finished.request_id=l.request_id and finished.event='request_finished')))
   and (${reference}='' or metadata->>'platformRequestId'=${reference} or metadata->>'providerRequestId'=${reference} or metadata->>'sourceRequestId'=${reference})
   and (${search}='' or task_id=${search||null}::uuid or request_id=${search||null}::uuid or document_id=${search||null}::uuid or session_id=${search||null}::uuid)
   and (${before}::bigint is null or sequence<${before}::bigint) order by sequence desc limit ${limit+1}`;
  const hasMore=rows.length>limit,logs=rows.slice(0,limit),last=logs.at(-1),cursor=hasMore&&last?Buffer.from(JSON.stringify({sequence:last.sequence})).toString('base64url'):null;
  return res.status(200).json({ok:true,logs,nextCursor:cursor,limitations:['요청·모델 이벤트 기록이며 request_started는 작업 전체 완료를 뜻하지 않습니다.','강제 종료·DB 장애 시 종료 로그가 남지 않을 수 있습니다. 시작 로그만 있으면 상태 미확인입니다.','migration 099 적용 및 이번 코드 반영 이후 기록만 조회하며 과거 실패 원문을 복원하지 않습니다.']});
 }catch(error){return res.status(error.statusCode||500).json({error:error.statusCode?error.message:'작업 로그 조회에 실패했습니다. DB 연결과 migration 099를 확인해 주세요.',code:key(error.code)||'WORK_LOG_READ_FAILED'});}
};
