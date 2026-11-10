import assert from 'node:assert/strict';
import {loadPromptExecutionDisplay} from '../visual-editor/src/builder/services/composition-client.mjs';
import {createAiBuilderStore,setBuilderError} from '../visual-editor/src/builder/state/ai-builder-store.mjs';
const oldFetch=globalThis.fetch;
try{
 globalThis.fetch=async()=>new Response('FUNCTION_INVOCATION_FAILED',{status:500,headers:{'content-type':'text/plain','x-vercel-error':'FUNCTION_INVOCATION_FAILED','x-vercel-id':'test-request-id'}});
 await assert.rejects(loadPromptExecutionDisplay('promo_page_composer'),error=>{
  assert.equal(error.code,'FUNCTION_INVOCATION_FAILED');assert.equal(error.requestId,'test-request-id');assert.match(error.message,/서버 실행 중 오류/);
  const store=createAiBuilderStore();setBuilderError(store,error);assert.equal(store.error.requestId,'test-request-id');return true;
 });
 globalThis.fetch=async()=>new Response(JSON.stringify({message:'정책을 활성화하세요.',code:'TOKEN_USAGE_POLICY_REQUIRED'}),{status:422});
 await assert.rejects(loadPromptExecutionDisplay('promo_page_composer'),error=>error.code==='TOKEN_USAGE_POLICY_REQUIRED'&&error.message==='정책을 활성화하세요.');
}finally{globalThis.fetch=oldFetch;}
console.log('Builder platform error handling passed: plain-text 500 diagnostics, request ID, and preserved policy errors.');
