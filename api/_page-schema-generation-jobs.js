const {randomUUID,createHash}=require('node:crypto');
const {stableStringify}=require('./_promo-builder-chat-workspace-contract');
function jobError(code,message,statusCode=409){return Object.assign(new Error(message),{code,statusCode,retryable:true});}
function inputHash(input){return createHash('sha256').update(stableStringify(input)).digest('hex');}
async function acquireGeneration(sql,{documentId,ownerSubject,requestId,hash}){
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId))throw Object.assign(jobError('GENERATION_REQUEST_INVALID','유효한 생성 요청 ID가 필요합니다.',400),{retryable:false});
 const claimToken=randomUUID();
 await sql`update promo_page_schema_generation_jobs set status='failed',error_code='GENERATION_LEASE_EXPIRED',updated_at=now() where document_id=${documentId}::uuid and owner_subject=${ownerSubject} and status='running' and lease_expires_at<now()`;
 let rows;
 try{
 rows=await sql`insert into promo_page_schema_generation_jobs(document_id,request_id,owner_subject,input_hash,claim_token,status,lease_expires_at)
   values(${documentId}::uuid,${requestId}::uuid,${ownerSubject},${hash},${claimToken}::uuid,'running',now()+interval '10 minutes')
   on conflict(document_id,request_id) do update set claim_token=excluded.claim_token,status='running',lease_expires_at=excluded.lease_expires_at,attempts=promo_page_schema_generation_jobs.attempts+1,updated_at=now()
   where promo_page_schema_generation_jobs.owner_subject=excluded.owner_subject and promo_page_schema_generation_jobs.input_hash=excluded.input_hash
     and (promo_page_schema_generation_jobs.status='failed' or (promo_page_schema_generation_jobs.status='running' and promo_page_schema_generation_jobs.lease_expires_at<now()))
   returning *`;
 }catch(error){if(error.code==='23505')throw jobError('GENERATION_IN_PROGRESS','이 문서의 페이지 생성이 이미 진행 중입니다. 잠시 후 다시 확인해 주세요.');throw error;}
 if(rows.length)return {requestId,claimToken,documentId,ownerSubject,hash};
 const existing=await sql`select status,input_hash,result_revision from promo_page_schema_generation_jobs where document_id=${documentId}::uuid and request_id=${requestId}::uuid and owner_subject=${ownerSubject}`;
 if(!existing.length||existing[0].input_hash!==hash)throw Object.assign(jobError('GENERATION_REQUEST_MISMATCH','생성 요청 ID와 입력이 일치하지 않습니다.'),{retryable:false});
 if(existing[0].status==='completed')return {replayed:true,revision:Number(existing[0].result_revision),requestId};
 throw jobError('GENERATION_IN_PROGRESS','같은 페이지 생성이 진행 중입니다. 잠시 후 다시 확인해 주세요.');
}
async function failGeneration(sql,job,code){
 await sql`update promo_page_schema_generation_jobs set status='failed',error_code=${String(code||'GENERATION_FAILED').slice(0,100)},updated_at=now()
   where document_id=${job.documentId}::uuid and request_id=${job.requestId}::uuid and claim_token=${job.claimToken}::uuid and owner_subject=${job.ownerSubject} and status='running'`;
}
module.exports={inputHash,acquireGeneration,failGeneration};
