const {assertValid}=require('../shared/page-schema/contract.cjs');
const {structuralHash}=require('./_page-schema-design');
const {assertImageCoverage}=require('./_page-image-requirements');
function validateStructure(page,context,sourceRevision){
 assertValid(page,context);assertImageCoverage(page,context);
 return {state:'ready',mode:'automatic',structureFingerprint:structuralHash(page),sourceDocumentRevision:Number(sourceRevision||0),validatedAt:new Date().toISOString()};
}
function assertStructureReady(snapshot){
 const page=snapshot?.content?.pageSchema,context=snapshot?.content?.pageContext,review=snapshot?.generationMeta?.review;
 if(!page||!['ready','approved'].includes(review?.state))throw Object.assign(new Error('페이지 구조를 검증하고 있습니다. 저장된 결과에서 자동으로 이어갑니다.'),{code:review?.state==='pending'&&!snapshot?.generationMeta?.automaticFlowVersion?'PAGE_SCHEMA_APPROVAL_REQUIRED':'PAGE_STRUCTURE_VALIDATION_REQUIRED',statusCode:409,retryable:true});
 assertValid(page,context);assertImageCoverage(page,context);
 if(review.state==='ready'&&(review.mode!=='automatic'||review.structureFingerprint!==structuralHash(page)))throw Object.assign(new Error('현재 페이지 구조의 검증 상태가 오래되었습니다.'),{code:'PAGE_STRUCTURE_VALIDATION_STALE',statusCode:409,retryable:true});
 return true;
}
function prepareAutomaticSnapshot(snapshot,revision,{design=false,resetDesign=false}={}){
 snapshot.generationMeta={...snapshot.generationMeta,automaticFlowVersion:1,review:validateStructure(snapshot.content.pageSchema,snapshot.content.pageContext,revision),structureFingerprint:structuralHash(snapshot.content.pageSchema),structureFingerprintVersion:2};
 if(design&&(!snapshot.generationMeta.sectionDesign||resetDesign))snapshot.generationMeta.sectionDesign=require('./_page-section-design').newSectionDesign(snapshot.content.pageSchema);
 return snapshot;
}
module.exports={validateStructure,assertStructureReady,prepareAutomaticSnapshot};
