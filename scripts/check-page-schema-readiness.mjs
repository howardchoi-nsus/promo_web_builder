// Run with the target environment's existing DB configuration. Never prints credentials.
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {builderFlags}=require('../api/_promo-builder-flags');
const {getSql}=require('../api/_promo-builder-document-store');
const {assertPageSchemaInfrastructure,loadPageSchemaLibrary}=require('../api/_page-schema-readiness');
try{
 if(!builderFlags().pageSchemaV1)throw Object.assign(Error('PAGE_SCHEMA_GENERATION_ENABLED를 true로 설정해 주세요.'),{code:'PAGE_SCHEMA_DISABLED'});
 const sql=getSql();await assertPageSchemaInfrastructure(sql);const library=await loadPageSchemaLibrary(sql);
 console.log(JSON.stringify({ready:true,generationPath:'page-schema',rendererKey:'page-schema-renderer',tokenVersionId:library.tokenVersionId}));
}catch(error){console.error(JSON.stringify({ready:false,code:error.code||'PAGE_SCHEMA_ENVIRONMENT_NOT_READY',message:error.message}));process.exitCode=1;}
