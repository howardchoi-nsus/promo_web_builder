const {assembleEffectivePrompt}=require('./_prompt-assembler');
const {promptVariableContract}=require('./_prompt-template-store');
const MAX_BYTES=250000;
function preflightPrompt(prompt,skills=[]){
 const type=prompt.type,contract=promptVariableContract(type);
 // Synthetic placeholders establish template correctness, not actual model quality
 // or the runtime size of request data. Runtime checks remain mandatory.
 const variables=Object.fromEntries([...(prompt.required_variables||prompt.requiredVariables||contract.requiredVariables),...(prompt.optional_variables||prompt.optionalVariables||contract.optionalVariables)].map(name=>[name,`[sample:${name}]`]));
 const {renderPrompt}=require('./_prompt-template-store');
 const options=prompt.model_options||prompt.modelOptions||{};
 const result=assembleEffectivePrompt({type,renderedBody:renderPrompt(prompt.body,variables),variables,promptLayers:options.promptLayers||{},harnessConfig:options.harnessConfig||{},skills});
 const bytes=Buffer.byteLength(result.renderedPrompt);
 if(bytes>MAX_BYTES)throw Object.assign(new Error('조립된 프롬프트가 길이 예산을 초과합니다.'),{code:'PROMPT_ASSEMBLY_BUDGET_EXCEEDED',statusCode:422});
 return {mode:'synthetic-input-contract-only',renderedPrompt:result.renderedPrompt,renderedPromptHash:result.renderedPromptHash,layerSources:result.layerSources,bytes,skillVersions:skills.map(s=>({id:s.id,key:s.key,version:s.version})),limitations:['실제 고객 데이터 길이와 외부 모델 결과는 별도 검증이 필요합니다.']};
}
function assertEditToken(body,current){
 const {promptEditToken}=require('./_prompt-template-store');
 if(body.editToken!==promptEditToken(current))throw Object.assign(new Error('프롬프트가 변경되었거나 편집 정보가 오래되었습니다. 최신 버전을 불러와 주세요.'),{code:'PROMPT_EDIT_CONFLICT',statusCode:409});
}
module.exports={preflightPrompt,assertEditToken,MAX_BYTES};
