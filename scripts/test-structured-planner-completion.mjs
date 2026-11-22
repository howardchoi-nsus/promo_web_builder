import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{generateStructuredPlannerResult,assertStructuredSchemaReferences}=require('../api/_promo-section-design-provider');
const oldFetch=global.fetch,oldKey=process.env.OPENAI_API_KEY;process.env.OPENAI_API_KEY='fixture-only';
const config={provider:'openai',model:'registered-model',renderedPrompt:'Return supplied structured schema.',maxTokens:24000,modelOptions:{reasoning:{effort:'medium'},executionSnapshotVersion:2,runtimeConfig:{timeoutMs:240000,maxAttempts:1,retryBaseMs:0,retryMaxMs:0},harnessConfig:{},modelCapabilitySnapshot:{},safetyContract:{}}};
let payload,requests=[];
global.fetch=async(url,options)=>{requests.push(JSON.parse(options.body));return new Response(JSON.stringify(payload),{status:200,headers:{'x-request-id':'provider-test-id'}});};
const invoke=()=>generateStructuredPlannerResult({type:'promo_page_manifest_planner',schemaName:'test_manifest',schema:{type:'object',properties:{ok:{type:'boolean'}},required:['ok'],additionalProperties:false},promptConfig:config});
try{
 assertStructuredSchemaReferences({type:'object',properties:{literal:{const:{$ref:'literal-data',description:'data, not schema'}}}},'fixture');
 const callsBeforeInvalid=requests.length;
 await assert.rejects(generateStructuredPlannerResult({type:'promo_page_region_builder',schemaName:'invalid_ref',schema:{type:'object',properties:{layout:{$ref:'#/$defs/layout',description:'invalid sibling'}},$defs:{layout:{type:'object'}}},promptConfig:config}),{code:'PLANNER_RESPONSE_SCHEMA_INVALID'});
 assert.equal(requests.length,callsBeforeInvalid,'Invalid provider schemas must fail before a paid request');
 const truncated='{"plan":'+ ' '.repeat(118350);
 payload={status:'incomplete',incomplete_details:{reason:'max_output_tokens'},usage:{output_tokens:24000,output_tokens_details:{reasoning_tokens:12000}},output_text:truncated};
 await assert.rejects(invoke(),e=>{assert.equal(e.code,'PLANNER_OUTPUT_LIMIT_REACHED');assert.equal(e.retryable,false);assert.equal(e.providerDiagnostics.outputCharacters,truncated.length);assert.equal(e.providerDiagnostics.maxOutputTokens,24000);assert.equal(e.providerDiagnostics.requestId,'provider-test-id');assert.equal(e.providerDiagnostics.reasoningTokens,12000);return true;});
 payload={status:'incomplete',incomplete_details:{reason:'max_output_tokens'},output_text:'{"ok":true}'};await assert.rejects(invoke(),{code:'PLANNER_OUTPUT_LIMIT_REACHED'});
 payload={status:'completed',output:[{status:'incomplete',content:[{type:'output_text',text:'{"ok":true}'}]}]};await assert.rejects(invoke(),{code:'PLANNER_OUTPUT_INCOMPLETE'});
 payload={status:'completed',output:[{content:[{type:'refusal',refusal:'not disclosed in diagnostic'}]}]};await assert.rejects(invoke(),{code:'PLANNER_OUTPUT_REFUSED'});
 payload={status:'failed',error:{code:'server_error',message:'not disclosed'}};await assert.rejects(invoke(),{code:'PLANNER_OUTPUT_INCOMPLETE'});
 payload={status:'completed',output_text:'{"ok":'};await assert.rejects(invoke(),e=>e.code==='PLANNER_OUTPUT_JSON_INVALID'&&e.providerDiagnostics.status==='completed'&&e.providerDiagnostics.outputCharacters===6);
 payload={status:'completed',output_text:'{"ok":true}',usage:{output_tokens:5}};assert.deepEqual((await invoke()).result,{ok:true});
 delete config.modelOptions.reasoning;await invoke();assert.equal(requests.at(-1).reasoning,undefined);config.modelOptions.reasoning='low';await assert.rejects(invoke(),{code:'CONTROL_PLANE_CONFIG_INVALID'});
 assert.equal(requests.length,8,'Only the eight explicit cases may call the provider');for(const request of requests){assert.equal(request.max_output_tokens,24000);assert.equal(request.text.format.strict,true);assert.equal(request.store,false);if(request!==requests.at(-1))assert.deepEqual(request.reasoning,{effort:'medium'});}
 console.log('Structured planner completion: truncated/valid incomplete responses rejected before parsing, refusal/failure classified, safe diagnostics, malformed completed JSON rejected, registered budget preserved and no extra calls passed.');
}finally{global.fetch=oldFetch;if(oldKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=oldKey;}
