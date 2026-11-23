const {randomUUID}=require('node:crypto');const {inputHash}=require('./_page-schema-generation-jobs');
const {uuid,scrub}=require('./_work-log');
async function processBenchmark({sql,owner,body,res},dependencies={}){
 const use={validateCase:async(type,input)=>{if(type!=='promo_overview_parser'){const library=await require('./_page-schema-readiness').loadPageSchemaLibrary(sql);const fields=value=>({tokenVersionId:value.tokenVersionId,tokenValues:value.tokenValues,tokenCatalog:value.tokenCatalog,usagePolicy:value.usagePolicy});if(inputHash(fields(library))!==inputHash(fields(input.context||{})))throw Object.assign(Error('실제 활성 토큰 라이브러리와 동일한 context를 사용해 주세요.'),{code:'BENCHMARK_LIBRARY_CHANGED',statusCode:422});}},active:require('./_prompt-execution-snapshot').createPromptExecutionSnapshot,candidate:require('./_prompt-execution-snapshot').createValidatedPromptExecutionSnapshot,generate:require('./_promo-section-design-provider').generateStructuredPlannerResult,image:require('./_promo-section-design-provider').generateSectionImage,...dependencies};
 const ready=await sql`select to_regclass('public.promo_prompt_benchmarks') is not null as ready`;if(!ready[0]?.ready)throw Object.assign(Error('모델 비교에는 migration 101이 필요합니다.'),{statusCode:503,code:'BENCHMARK_MIGRATION_REQUIRED'});
 const id=uuid(body.benchmarkId);if(!id)throw Object.assign(Error('비교 작업 ID가 필요합니다.'),{statusCode:400,code:'BENCHMARK_ID_INVALID'});
 const read=async()=>(await sql`select * from promo_prompt_benchmarks where id=${id}::uuid and owner_subject=${owner}`)[0];
 const publicRecord=row=>({id:row.id,promptType:row.prompt_type,baselineId:row.baseline_id,candidateId:row.candidate_id,status:row.status,results:row.results_json.map((result,index)=>{const {imageBase64,...publicResult}=result;return {...publicResult,...(imageBase64?{imageUrl:'/api/admin-prompt-benchmarks?operation=image&benchmarkId='+row.id+'&variant='+index}:{})};}),errorCode:row.error_code,createdAt:row.created_at});
 if(body.operation==='start'){
  const input=body.input;if(!input?.variables||JSON.stringify(input).length>1000000||!uuid(body.baselineId)||!uuid(body.candidateId)||body.baselineId===body.candidateId)throw Object.assign(Error('비교 버전과 1MB 이하 입력 케이스를 확인해 주세요.'),{statusCode:422,code:'BENCHMARK_INPUT_INVALID'});
  const [candidate]=await sql`select type,status from prompt_templates where id=${body.candidateId}::uuid and status='validated'`;if(!candidate||!require('./_prompt-benchmark-contract').SUPPORTED.includes(candidate.type))throw Object.assign(Error('검증된 후보 프롬프트를 선택해 주세요.'),{statusCode:422,code:'BENCHMARK_VALIDATED_REQUIRED'});
  await use.validateCase(candidate.type,input);require('./_prompt-benchmark-contract').contract(candidate.type,input);
  const baseline=await use.active(sql,candidate.type,input.variables),proposed=await use.candidate(sql,body.candidateId,input.variables,{expectedType:candidate.type});
  if(baseline.promptConfig.promptId!==body.baselineId)throw Object.assign(Error('현재 활성 기준 버전이 변경되었습니다.'),{statusCode:409,code:'BENCHMARK_BASELINE_CHANGED'});
  const hashes=[baseline,proposed].map(p=>inputHash({config:require('./_page-work-unit-store').configHash(p.promptConfig),prompt:p.promptConfig.renderedPromptHash||p.promptConfig.renderedPrompt}));
  const hash=inputHash({input,baseline:body.baselineId,candidate:body.candidateId,hashes});
  await sql`insert into promo_prompt_benchmarks(id,owner_subject,prompt_type,baseline_id,candidate_id,input_hash,case_json,status,lease_expires_at) values(${id}::uuid,${owner},${candidate.type},${body.baselineId}::uuid,${body.candidateId}::uuid,${hash},${JSON.stringify({input,hashes})}::jsonb,'running',now()+interval '20 minutes') on conflict(id) do nothing`;
  const row=await read();if(!row||row.input_hash!==hash)throw Object.assign(Error('비교 요청 ID의 입력이 다릅니다.'),{statusCode:409,code:'BENCHMARK_INPUT_CHANGED'});return res.status(200).json({ok:true,benchmark:publicRecord(row)});
 }
 let row=await read();if(!row)throw Object.assign(Error('비교 작업을 찾을 수 없습니다.'),{statusCode:404,code:'BENCHMARK_NOT_FOUND'});
 if(body.operation==='read'||row.status!=='running')return res.status(200).json({ok:true,benchmark:publicRecord(row)});
 if(body.operation!=='advance')throw Object.assign(Error('지원하지 않는 작업입니다.'),{statusCode:400});
 if(Date.parse(row.lease_expires_at)<Date.now())throw Object.assign(Error('비교 작업이 만료되었습니다. 완료된 결과는 보존했습니다.'),{statusCode:409,code:'BENCHMARK_EXPIRED'});
 const claim=randomUUID(),claimed=await sql`select claim_promo_benchmark_step(${id}::uuid,${owner},${claim}::uuid) as claimed`;
 if(!claimed[0]?.claimed)return res.status(202).json({ok:true,pending:true,benchmark:publicRecord(row)});
 row=await read();if(row.claim_token!==claim)throw Object.assign(Error('비교 작업 소유권이 변경되었습니다.'),{code:'BENCHMARK_LEASE_CHANGED',statusCode:409});
 const index=row.results_json.length,input=row.case_json.input;let output;
 try{
  if(index>1)throw Error('Benchmark already has two variants');
  await use.validateCase(row.prompt_type,input);
  const execution=index===0?await use.active(sql,row.prompt_type,input.variables):await use.candidate(sql,row.candidate_id,input.variables,{expectedType:row.prompt_type});
  const cfg=execution.promptConfig;if((index===0&&cfg.promptId!==row.baseline_id)||inputHash({config:require('./_page-work-unit-store').configHash(cfg),prompt:cfg.renderedPromptHash||cfg.renderedPrompt})!==row.case_json.hashes[index])throw Object.assign(Error('비교 프롬프트 또는 모델 설정이 변경되었습니다.'),{code:'BENCHMARK_CONFIG_CHANGED'});
  const selection=require('./_prompt-benchmark-contract').contract(row.prompt_type,input),started=Date.now();
  let generated,preview,imageBase64,mimeType;
  if(selection.image){generated=await use.image({prompt:cfg.renderedPrompt,promptConfig:cfg,modelOptions:cfg.modelOptions,provider:cfg.provider,model:cfg.model,targetType:row.prompt_type==='section_background_image'?'section':'item',aspectRatio:input.aspectRatio||'16:9'});const info=require('./_section-ai-control-plane').imageMetadata(generated.bytes,generated.mimeType);if(!info||!['image/png','image/jpeg','image/webp'].includes(info.mimeType))throw Error('Invalid benchmark image');if(info.width>8192||info.height>8192||info.width*info.height>32000000||generated.bytes.length>3000000)throw Object.assign(Error('비교 이미지가 3MB 예산을 초과했습니다. 후보의 등록 이미지 크기 설정을 확인해 주세요.'),{code:'BENCHMARK_IMAGE_LIMIT'});imageBase64=generated.bytes.toString('base64');mimeType=generated.mimeType;preview=null;}
  else{generated=await use.generate({type:row.prompt_type,schemaName:'admin_benchmark',schema:selection.schema,promptConfig:cfg});const check=new(require('ajv/dist/2020').default)({strict:false,allErrors:false}).compile(selection.schema);if(!check(generated.result))throw Object.assign(Error('비교 응답이 구조화 스키마에 맞지 않습니다.'),{code:'BENCHMARK_SCHEMA_INVALID'});preview=selection.validate(generated.result);}
  output={variant:index===0?'baseline':'candidate',ok:true,provider:cfg.provider,model:cfg.model,promptId:cfg.promptId,promptVersion:cfg.promptVersion,durationMs:Date.now()-started,usage:generated.usage||{},preview,imageBase64,mimeType,validation:'schema-and-runtime-contract-only',limitations:['디자인 미감/브랜드 적합성·실서비스 품질 통과를 뜻하지 않습니다.','활성 설정·고객 문서·에셋에는 적용하지 않습니다.']};
 }catch(error){output={variant:index===0?'baseline':'candidate',ok:false,errorCode:error.code||'BENCHMARK_FAILED',message:scrub(error.message)};}
 const results=[...row.results_json,output],state=results.length===2?'completed':'running';
 const saved=await sql`update promo_prompt_benchmarks set results_json=${JSON.stringify(results)}::jsonb,status=${state},claim_token=null,step_lease_expires_at=null,updated_at=now() where id=${id}::uuid and owner_subject=${owner} and claim_token=${claim}::uuid returning *`;
 if(!saved.length)throw Object.assign(Error('비교 결과 저장 권한이 변경되었습니다.'),{statusCode:409,code:'BENCHMARK_LEASE_CHANGED'});
 return res.status(200).json({ok:true,benchmark:publicRecord(saved[0])});
}
module.exports={processBenchmark};
