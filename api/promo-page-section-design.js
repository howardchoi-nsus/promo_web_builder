const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {requireBuilderFlag}=require('./_promo-builder-flags');
const {getSql}=require('./_promo-builder-document-store');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 try{requireBuilderFlag('pageSchemaV1');requireBuilderFlag('sectionDesignV1');const owner=resolveBuilderOwner(req,res);return await require('./_page-section-design').processSectionDesign({sql:getSql(),owner,body:parseBody(req.body),res});}
 catch(e){return res.status(e.statusCode||500).json({error:e.message,code:e.code||'SECTION_DESIGN_FAILED',errors:e.errors||[],retryable:e.retryable===true});}
};
