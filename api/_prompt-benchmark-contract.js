const {runtimeSchema,assertValid}=require('../shared/page-schema/contract.cjs');
const {planSchema,planResult,regionSchema,applyRegion}=require('./_page-draft-units');
const {sectionDesignSchema,applySectionDesign}=require('./_page-section-design-contract');
const {reviewSchema,applyReview}=require('./_page-quality-agent-contract');
const SUPPORTED=['promo_overview_parser','promo_page_manifest_planner','promo_page_region_builder','promo_page_schema_planner','promo_page_section_designer','promo_page_quality_reviewer','section_background_image','component_image'];
function contract(type,input){const c=input.context,page=input.page,state=input.state,group=input.group;
 if(type==='promo_overview_parser')return {schema:require('./_promo-overview-contract').OVERVIEW_PARSE_SCHEMA,validate:result=>require('./_promo-overview-contract').normalizeParsedOverview({result,instruction:input.variables.naturalLanguage})};
 if(!c||typeof c!=='object')throw Object.assign(Error('페이지 단계 비교에는 context가 필요합니다.'),{statusCode:422,code:'BENCHMARK_CONTEXT_REQUIRED'});
 require('../shared/layout-token-policy.cjs').assertLayoutTokens(c);
 if(type==='promo_page_manifest_planner')return {schema:planSchema(c),validate:result=>planResult(result,c)};
 if(type==='promo_page_region_builder'){const region=state?.plan?.regions[state.cursor];if(!region)throw Error('영역 state와 cursor가 필요합니다.');return {schema:regionSchema(c,region,{parallel:state.parallelV1===true}),validate:result=>applyRegion({...state,context:c},result)};}
 if(type==='promo_page_schema_planner')return {schema:runtimeSchema(c),validate:result=>{const repaired=require('./_page-schema-source-bindings').repairApprovedSourceBindings(result,c);assertValid(repaired.page,c);require('./_page-image-requirements').assertImageCoverage(repaired.page,c);return require('../shared/page-schema/contract.cjs').normalize(repaired.page).page;}};
 if(type==='promo_page_section_designer'){assertValid(page,c);if(!group?.nodeIds?.length)throw Error('group이 필요합니다.');return {schema:sectionDesignSchema(group,c),validate:result=>applySectionDesign(page,c,group,result)};}
 if(type==='promo_page_quality_reviewer'){assertValid(page,c);return {schema:reviewSchema(page,c),validate:result=>applyReview(page,c,result)};}
 if(['section_background_image','component_image'].includes(type))return {image:true};
 throw Object.assign(Error('지원하지 않는 비교 단계입니다.'),{statusCode:422,code:'BENCHMARK_TYPE_UNSUPPORTED'});
}
module.exports={SUPPORTED,contract};
