import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url),tokens=require('../api/_design-token-store'),policies=require('../api/_token-usage-policy-store');
let available=true,active=true,policyReady=true;
require.cache[require.resolve('../api/_design-token-store')].exports={...tokens,fetchTokenSets:async()=>available?[{setKey:'design-system',versionId:'fixture'}]:[],fetchTokenVersion:async()=>({id:'fixture',status:active?'active':'draft'})};
require.cache[require.resolve('../api/_token-usage-policy-store')].exports={...policies,tokenPolicyCatalog:()=>context.tokenCatalog,activeTokenUsagePolicy:async()=>{if(!policyReady)throw Object.assign(Error('정책 없음'),{code:'TOKEN_USAGE_POLICY_REQUIRED'});return context.usagePolicy;}};
const {assertPageSchemaInfrastructure,loadPageSchemaLibrary}=require('../api/_page-schema-readiness');
await assertPageSchemaInfrastructure(async()=>[{schema_ready:true,prompt_ready:true,generation_ready:true}]);
await assert.rejects(assertPageSchemaInfrastructure(async()=>[{schema_ready:false,prompt_ready:true,generation_ready:true}]),{code:'PAGE_SCHEMA_MIGRATION_REQUIRED'});
await assert.rejects(assertPageSchemaInfrastructure(async()=>[{schema_ready:true,prompt_ready:false,generation_ready:true}]),{code:'PAGE_SCHEMA_PROMPT_REQUIRED'});
await assert.rejects(assertPageSchemaInfrastructure(async()=>{throw Object.assign(Error('missing table'),{code:'42P01'});}),{code:'PAGE_SCHEMA_MIGRATION_REQUIRED'});
assert.equal((await loadPageSchemaLibrary(async()=>[])).tokenVersionId,'fixture');
available=false;await assert.rejects(loadPageSchemaLibrary(async()=>[]),{code:'TOKEN_LIBRARY_REQUIRED'});available=true;
active=false;await assert.rejects(loadPageSchemaLibrary(async()=>[]),{code:'TOKEN_LIBRARY_CHANGED'});active=true;
policyReady=false;await assert.rejects(loadPageSchemaLibrary(async()=>[]),{code:'TOKEN_USAGE_POLICY_REQUIRED'});
console.log('Dynamic generation readiness: migration, active prompt, library version and usage policy checked before generation.');

await assert.rejects(assertPageSchemaInfrastructure(async()=>[{schema_ready:true,prompt_ready:true,generation_ready:false}]),{code:'PAGE_SCHEMA_MIGRATION_REQUIRED'});
