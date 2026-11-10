const {getSql,fetchTokenSets,fetchTokenVersion,parseBody}=require('./_design-token-store');
const {resolveAdminOwner}=require('./_promo-admin-auth');
const {tokenPolicyCatalog}=require('./_token-usage-policy-store');
function createHandler({sqlFactory=getSql,authorize=resolveAdminOwner}={}) {
 return async (req,res)=>{
  res.setHeader('Cache-Control','private, no-store');
  try {
   if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Method not allowed'});}
   authorize(req,res);
   if(req.method==='POST'&&req.headers?.origin){const host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim();if(new URL(req.headers.origin).host!==host)return res.status(403).json({error:'같은 사이트에서만 저장할 수 있습니다.'});}
   const sql=sqlFactory();
   const library=(await fetchTokenSets(sql,{activeOnly:true})).find(set=>set.setKey==='design-system');
   if(!library?.versionId)return res.status(409).json({error:'공통 디자인 토큰 라이브러리를 먼저 저장·활성화하세요.'});
   const version=await fetchTokenVersion(sql,library.versionId);const catalog=tokenPolicyCatalog(version);
   const {TOKEN_USAGE_RULES,createTokenUsageDraft,validateTokenUsagePolicy}=await import('../shared/token-usage-policy.mjs');
   if(req.method==='GET'){
    const rows=await sql`select id::text,version,status,token_set_version_id::text,policy_json,created_at,change_note from promo_token_usage_policy_versions order by version desc limit 30`;
    const requested=String(req.query?.versionId||'');
    const selected=requested?rows.find(row=>row.id===requested):rows[0];
    if(requested&&!selected)return res.status(404).json({error:'정책 버전을 찾을 수 없습니다.'});
    const policy=selected?.policy_json||createTokenUsageDraft(catalog);
    return res.status(200).json({ok:true,policy,catalog,rules:TOKEN_USAGE_RULES,tokenVersionId:version.id,headId:rows[0]?.id||null,activeId:rows.find(row=>row.status==='active')?.id||null,selectedId:selected?.id||null,versions:rows.map(({policy_json,...row})=>row),validation:validateTokenUsagePolicy(policy,catalog,{activation:true})});
   }
   const body=parseBody(req.body);if(!Object.hasOwn(body,'expectedHeadId'))return res.status(400).json({error:'저장 기준 버전이 필요합니다.'});
   if(body.tokenVersionId!==version.id)return res.status(409).json({error:'토큰 라이브러리가 변경되었습니다. 새로고침하세요.'});
   const validation=validateTokenUsagePolicy(body.policy,catalog,{activation:body.activate===true});
   if(!validation.ok)return res.status(422).json({error:'정책 검증에 실패했습니다.',...validation});
   const policy={schemaVersion:1,bindings:Object.fromEntries(TOKEN_USAGE_RULES.map(rule=>[rule.key,body.policy.bindings[rule.key]||'']))};
   const saved=await sql`select publish_token_usage_policy(${body.expectedHeadId||null}::uuid,${version.id}::uuid,${JSON.stringify(policy)}::jsonb,${body.activate===true},${String(body.changeNote||'토큰 사용 정책 저장')})::text as id`;
   return res.status(200).json({ok:true,id:saved[0].id,active:body.activate===true});
  }catch(error){const missing=['42P01','42883'].includes(error.code);return res.status(missing?503:/changed/i.test(error.message)?409:error.statusCode||400).json({error:missing?'토큰 사용 정책 DB migration 085를 적용하세요.':error.message,code:error.code});}
 };
}
module.exports=createHandler();module.exports.createHandler=createHandler;
