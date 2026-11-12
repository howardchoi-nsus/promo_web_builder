const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {getSql,parseBody}=require('./_prompt-template-store');
const {requireBuilderFlag}=require('./_promo-builder-flags');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 try{requireBuilderFlag('pageSchemaV1');requireBuilderFlag('qualityReviewAgent');const owner=resolveBuilderOwner(req,res);return await require('./_page-quality-agent').processQualityReview({sql:getSql(),owner,body:parseBody(req.body),res});}
 catch(e){return res.status(e.statusCode||500).json({error:e.message,code:e.code||'QUALITY_AGENT_FAILED',errors:e.errors||[],retryable:e.retryable===true});}
};
