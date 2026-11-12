const {fetchTokenSets,fetchTokenVersion}=require('./_design-token-store');
const {activeTokenUsagePolicy,tokenPolicyCatalog}=require('./_token-usage-policy-store');
const {assertLayoutTokens}=require('../shared/layout-token-policy.cjs');
function blocked(code,message){return Object.assign(new Error(message),{code,statusCode:503});}
async function assertPageSchemaInfrastructure(sql){
 let rows;
 try{
  rows=await sql`select
    exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='create_promo_builder_document_revision'
      and case when p.prokind='f' then pg_get_functiondef(p.oid) like '%page-schema%' else false end) as schema_ready,
    exists(select 1 from prompt_templates where type='promo_page_schema_planner' and status='active' and archived_at is null) as prompt_ready,
    to_regclass('public.promo_page_schema_generation_jobs') is not null as generation_ready`;
 }catch(error){
  if(['42P01','42703','42883'].includes(error.code))throw blocked('PAGE_SCHEMA_MIGRATION_REQUIRED','동적 페이지 생성 DB migration 086·087을 적용한 후 다시 실행해 주세요.');
  throw error;
 }
 if(!rows[0]?.schema_ready)throw blocked('PAGE_SCHEMA_MIGRATION_REQUIRED','동적 페이지 저장을 위한 DB migration 086이 필요합니다.');
 if(!rows[0]?.generation_ready)throw blocked('PAGE_SCHEMA_MIGRATION_REQUIRED','중복 생성 방지 DB migration 088이 필요합니다.');
 if(!rows[0]?.prompt_ready)throw blocked('PAGE_SCHEMA_PROMPT_REQUIRED','관리자 프롬프트 관리에서 AI 동적 페이지 구조 설계(promo_page_schema_planner)를 검토·활성화해 주세요.');
}
async function loadPageSchemaLibrary(sql){
 const sets=await fetchTokenSets(sql,{activeOnly:true}),set=sets.find(s=>s.setKey==='design-system');
 if(!set?.versionId)throw blocked('TOKEN_LIBRARY_REQUIRED','관리자에서 공통 디자인 토큰을 저장·활성화해 주세요.');
 const version=await fetchTokenVersion(sql,set.versionId);
 if(!version||version.status!=='active')throw blocked('TOKEN_LIBRARY_CHANGED','활성 디자인 토큰 버전이 변경되었습니다. 다시 실행해 주세요.');
 const usagePolicy=await activeTokenUsagePolicy(sql,version),tokenCatalog=tokenPolicyCatalog(version);
 const registeredAssets=await require('./_page-schema-catalog').loadPageAssets(sql);
 const library={...registeredAssets,styleChoicesVersion:1,usagePolicy,tokenCatalog,tokenValues:Object.fromEntries(tokenCatalog.map(t=>[t.name||t.tokenKey,t.value])),tokenVersionId:version.id};
 assertLayoutTokens(library);
 return library;
}
module.exports={assertPageSchemaInfrastructure,loadPageSchemaLibrary};
