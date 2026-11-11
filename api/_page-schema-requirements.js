const {normalizeOverview}=require('./_promo-overview-contract');
const {stableStringify}=require('./_promo-builder-chat-workspace-contract');
function conflict(code,message){return Object.assign(new Error(message),{code,statusCode:409,retryable:true});}
async function pinPageRequirements(sql,{documentId,ownerSubject,revision,overview}){
 const rows=await sql`select r.revision,r.requirements_fingerprint,r.requirements_json
   from promo_builder_chat_sessions s join promo_builder_requirements_revisions r
   on r.session_id=s.id and r.revision=s.latest_requirements_revision
   where s.document_id=${documentId}::uuid and s.owner_subject=${ownerSubject} limit 1`;
 const row=rows[0];
 if(!row)throw conflict('REQUIREMENTS_NOT_SAVED','요청 요약을 서버에 저장한 후 다시 생성해 주세요.');
 if(Number(revision)!==Number(row.revision))throw conflict('REQUIREMENTS_REVISION_MISMATCH','요청 요약 버전이 변경되었습니다. 최신 내용을 확인해 주세요.');
 const canonical=normalizeOverview(row.requirements_json);
 if(overview!==undefined&&stableStringify(normalizeOverview(overview))!==stableStringify(canonical))throw conflict('REQUIREMENTS_CONTENT_MISMATCH','화면과 서버의 요청 요약이 다릅니다. 변경 내용을 저장한 후 다시 생성해 주세요.');
 return {overview:canonical,revision:Number(row.revision),fingerprint:row.requirements_fingerprint};
}
module.exports={pinPageRequirements};
