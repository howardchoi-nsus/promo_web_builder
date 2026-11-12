const {fetchTokenSets,fetchTokenVersion,toRuntimeTokenMap}=require('./_design-token-store');
const {activeTokenUsagePolicy,tokenPolicyCatalog}=require('./_token-usage-policy-store');
const {assertLayoutTokens}=require('../shared/layout-token-policy.cjs');
const {enforceRegisteredDesignTokens}=require('../shared/registered-token-policy.cjs');
async function refreshOutputTokens(sql,snapshot,deps={}){
 const use={fetchTokenSets,fetchTokenVersion,toRuntimeTokenMap,activeTokenUsagePolicy,tokenPolicyCatalog,...deps};
 if(!snapshot?.content)throw Object.assign(new Error('다시 연결할 디자인 문서가 없습니다.'),{statusCode:409,code:'BUILDER_SNAPSHOT_NOT_READY'});
 const sets=await use.fetchTokenSets(sql,{activeOnly:true}),set=sets.find(row=>row.setKey==='design-system');
 if(!set?.versionId)throw Object.assign(new Error('활성 디자인 토큰 라이브러리가 필요합니다.'),{statusCode:422,code:'TOKEN_LIBRARY_REQUIRED'});
 const version=await use.fetchTokenVersion(sql,set.versionId);
 if(!version||version.status!=='active')throw Object.assign(new Error('활성 토큰 버전이 변경되었습니다. 다시 확인해 주세요.'),{statusCode:409,code:'TOKEN_LIBRARY_CHANGED'});
 const policy=await use.activeTokenUsagePolicy(sql,version),catalog=use.tokenPolicyCatalog(version),values=use.toRuntimeTokenMap(version.values);
 const context={...(snapshot.content.pageContext?.styleChoicesVersion?{styleChoicesVersion:snapshot.content.pageContext.styleChoicesVersion}:{}),tokenValues:values,tokenCatalog:catalog,usagePolicy:policy,tokenVersionId:version.id};
 assertLayoutTokens(context);
 const next=JSON.parse(JSON.stringify(snapshot));
 if(next.content.pageSchema){
  next.content.pageContext={...next.content.pageContext,...context};
  require('../shared/page-schema/contract.cjs').assertValid(next.content.pageSchema,next.content.pageContext);
 }else{
  const validation=enforceRegisteredDesignTokens(next.designSpec,values,catalog,policy,next.content.sectionSnapshot||[]);
  if(validation.errors.length)throw Object.assign(new Error('현재 디자인이 활성 토큰 정책과 호환되지 않습니다. 미등록 스타일을 수정하거나 디자인을 다시 생성해 주세요.'),{statusCode:422,code:'TOKEN_RECONNECT_INCOMPATIBLE',errors:validation.errors});
 }
 const designTokens={policy:'registered-only',values,catalog,usagePolicy:policy};
 next.content.runtimeTheme={...next.content.runtimeTheme,designTokenSetVersionId:version.id,designTokens};
 if(next.content.formTemplate)next.content.formTemplate={...next.content.formTemplate,designTokenSetVersionId:version.id,designTokens};
 next.appearance={...next.appearance,designTokenSetVersionId:version.id};
 return next;
}
module.exports={refreshOutputTokens};
