const {parseBody}=require('./_wizard-form-templates-store');
const {resolveBuilderOwner}=require('./_promo-builder-auth');
const {requireBuilderFlag}=require('./_promo-builder-flags');
const {getSql}=require('./_promo-builder-document-store');
const {processPageMedia}=require('./_page-schema-media-service');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{
  requireBuilderFlag('pageSchemaV1');
  if(req.method==='POST')requireBuilderFlag('pageSchemaMedia');
  if(!['POST','PUT','PATCH'].includes(req.method)){res.setHeader('Allow','POST, PUT, PATCH');return res.status(405).json({error:'Method not allowed'});}
  const owner=resolveBuilderOwner(req,res),sql=getSql(),body=parseBody(req.body);
  return await processPageMedia({req,res,sql,owner,body});
 }catch(error){return res.status(error.statusCode||500).json({error:error.message,code:error.code||'PAGE_SCHEMA_MEDIA_FAILED',retryable:error.retryable??[409,429,500,502,503,504].includes(error.statusCode||500),errors:error.errors||[]});}
};
