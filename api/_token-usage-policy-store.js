function policyError(message,code='TOKEN_USAGE_POLICY_REQUIRED',statusCode=422) {
 return Object.assign(new Error(message),{code,statusCode});
}
async function activeTokenUsagePolicy(sql, tokenVersion) {
 let rows;
 try { rows=await sql`select id::text,version,policy_json from promo_token_usage_policy_versions where status='active' limit 1`; }
 catch(error) { if(error.code==='42P01') throw policyError('토큰 사용 정책 DB migration 085가 필요합니다.','TOKEN_USAGE_POLICY_MIGRATION_REQUIRED',503); throw error; }
 if(!rows.length) throw policyError('디자인 토큰 사용 정책을 관리자에서 연결·활성화하세요.');
 const {validateTokenUsagePolicy}=await import('../shared/token-usage-policy.mjs');
 const catalog=tokenPolicyCatalog(tokenVersion);
 const validation=validateTokenUsagePolicy(rows[0].policy_json,catalog,{activation:true});
 if(!validation.ok) throw Object.assign(policyError('현재 토큰 라이브러리와 사용 정책이 맞지 않습니다. 관리자에서 정책을 확인하세요.','TOKEN_USAGE_POLICY_INVALID'),{errors:validation.errors});
 return {...rows[0].policy_json,id:rows[0].id,version:Number(rows[0].version),tokenSetVersionId:tokenVersion.id};
}
function tokenPolicyCatalog(version) {
 return (version?.values||[]).filter(token=>token.value && token.valueType!=='typography'&&(!token.metadata?.libraryToken||token.metadata.state==='active')).map(token=>({
  tokenKey:token.tokenKey,name:token.tokenKey,cssProperties:token.cssProperties||[token.cssProperty].filter(Boolean),value:token.value,state:'active',reference:token.metadata?.libraryToken?.reference||'',
 }));
}
module.exports={activeTokenUsagePolicy,tokenPolicyCatalog};

async function policyTokenVersion(sql,version) {
 if(version?.setKey!=='design-system')return version;
 const usagePolicy=await activeTokenUsagePolicy(sql,version);
 const {policySelectableTokens}=await import('../shared/token-usage-policy.mjs');
 const catalog=policySelectableTokens(usagePolicy,tokenPolicyCatalog(version));
 const byKey=new Map(catalog.map(token=>[token.tokenKey,token]));
 return {...version,usagePolicy,values:version.values.map(token=>{
  const match=byKey.get(token.tokenKey);
  return {...token,aiSelectable:Boolean(match?.usageRules?.some(rule=>rule.state==='default')),usageRules:match?.usageRules||[],semanticRole:match?.semanticRole||'',cssProperty:match?.cssProperty||token.cssProperty};
 })};
}
module.exports.policyTokenVersion=policyTokenVersion;
