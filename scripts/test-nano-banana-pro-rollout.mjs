import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite');
const db=new PGlite(),read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const migration=read('db/migrations/103_nano_banana_pro_image_prompts.sql');
const store=require('../api/_prompt-template-store');
const sql=async(strings,...values)=>(await db.query(strings.reduce((query,part,i)=>query+(i?'$'+i:'')+part,''),values)).rows;
store.getSql=()=>sql;
require('../api/_promo-admin-auth').resolveAdminOwner=()=>({ownerSubject:'admin:test'});
const validate=require('../api/prompt-template-validate'),activate=require('../api/prompt-template-activate');
const types=['section_background_image','component_image'];
const ids=['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222'];
const rows=async()=>(await db.query('select * from prompt_templates order by type,status,version')).rows;
const history=async()=>(await db.query('select * from prompt_template_histories order by id')).rows;
let skill,fetchCalls=0;
const originalFetch=globalThis.fetch,originalKey=process.env.GEMINI_API_KEY;

async function seed(){
  await db.exec('truncate prompt_templates cascade');
  for(let i=0;i<types.length;i++){
    const type=types[i],vars=store.promptVariableContract(type),version=i?3:2;
    const options={provider:'openai',model:'gpt-image-2',responseFormat:'image',size:'1024x1536',quality:'high',background:'opaque',outputFormat:'png',
      executionSnapshotVersion:version,skillBindings:[{skillVersionId:skill.id}],
      promptLayers:{preInstructions:['Keep approved content.']},
      harnessConfig:{creativeIntentRules:['Polished approved subject.'],subjectScaleInstruction:'Respect subject crop.',keyVisualTextInstructions:{none:'No rendered text.',explicit:'Approved text only.'}},
      runtimeConfig:{timeoutMs:120000,maxAttempts:1,retryBaseMs:0,retryMaxMs:0,...(!i?{outputMimeType:'image/png'}:{})},
      safetyContract:{key:'image-contract',version:1},modelCapabilitySnapshot:{provider:'openai',model:'gpt-image-2',openAiImageSizes:['1024x1536']},
      customOption:'Keep custom configuration',
      ...(i?{policySchemaVersion:1,generationPolicy:{requestedTier:'4K',outputMimeType:'image/png',aspectRatioStrategy:'target',quality:'high'},
        renderPolicy:{componentImage:{fitMode:'cover'},fade:{defaultMode:'none'}},validationPolicy:{rejectLowResolution:true}}:{})};
    const body=read('docs/mouse-swarm-builder/layout-image-phase1/prompts/'+(i?'component-image.md':'section-background-image.md'));
    await db.query(`insert into prompt_templates(id,lineage_id,type,name,body,status,version,required_variables,optional_variables,provider,model,temperature,max_tokens,response_format,model_options)
      values($1,$1,$2,'Custom image prompt',$3,'active',5,$4,$5,'openai','gpt-image-2',0.5,9000,'image',$6)`,
      [ids[i],type,body,JSON.stringify(vars.requiredVariables),JSON.stringify(vars.optionalVariables),JSON.stringify(options)]);
  }
  await db.query(`insert into prompt_templates(type,name,body,status,version,lineage_id,provider,model)
    values('promo_page_section_designer','Do not change text model','existing body','active',9,gen_random_uuid(),'openai','gpt-6.1-sol')`);
}
async function reject(pattern){
  const before=await rows(),audit=await history();
  await assert.rejects(db.exec(migration),pattern);await db.exec('rollback');
  assert.deepEqual(await rows(),before);assert.deepEqual(await history(),audit);
}
async function call(handler,id){
  const row=(await rows()).find(row=>row.id===id);let status=200,payload;
  await handler({method:'POST',query:{},body:{id,editToken:store.promptEditToken(row)}},{setHeader(){},status(value){status=value;return this;},json(value){payload=value;return this;}});
  assert.equal(status,200,JSON.stringify({status,payload}));return payload;
}
try{
  await db.exec(read('db/migrations/010_prompt_templates.sql').replace('create extension if not exists pgcrypto;',''));
  await db.exec(read('db/migrations/011_generation_runs_and_prompt_model_settings.sql').split('update prompt_templates')[0].replace('create extension if not exists pgcrypto;',''));
  for(const file of ['033_prompt_template_version_lifecycle.sql','073_llm_model_registry.sql','091_admin_agent_skills.sql','097_skill_prompt_scopes.sql'])await db.exec(read('db/migrations/'+file).replace('create extension if not exists pgcrypto;',''));
  await db.exec(`insert into llm_models(provider,model_id,display_name,modality,status,default_response_format,model_options,supported_image_sizes)
    values('google','gemini-3-pro-image','Nano Banana Pro','image','active','image','{"imageSize":"2K"}','["1K","2K","4K"]')`);
  skill=await require('../api/_agent-skill-store').saveSkill(sql,{key:'pro-image-test',name:'Image skill',active:true,markdown:'Use the approved campaign intent.',allowedPromptTypes:types},'test');
  await seed();const before=await rows();
  const report=(await db.exec(migration)).at(-1).rows;
  assert.equal(report.length,2);assert.ok(report.every(row=>row.status==='draft'&&row.model==='gemini-3-pro-image'));
  let all=await rows();assert.deepEqual(all.filter(row=>row.status==='active'),before);
  const drafts=all.filter(row=>row.status==='draft');assert.equal(drafts.length,2);
  for(const draft of drafts){
    const original=before.find(row=>row.type===draft.type);
    for(const field of ['name','body','required_variables','optional_variables','lineage_id'])assert.deepEqual(draft[field],original[field]);
    for(const field of ['harnessConfig','promptLayers','skillBindings','runtimeConfig','safetyContract','generationPolicy','renderPolicy','validationPolicy','customOption'])assert.deepEqual(draft.model_options[field],original.model_options[field],field);
    assert.equal(draft.provider,'google');assert.equal(draft.response_format,'image');assert.equal(draft.version,6);
    assert.equal(draft.source_prompt_template_id,original.id);
    assert.equal(draft.model_options.size,undefined);assert.equal(draft.model_options.quality,undefined);
    assert.equal(draft.model_options.modelCapabilitySnapshot.model,'gemini-3-pro-image');
    if(draft.type==='section_background_image')assert.equal(draft.model_options.imageSize,'2K');
    else assert.equal(draft.model_options.imageSize,undefined);
  }
  const replay=await rows(),audit=await history();await db.exec(migration);
  assert.deepEqual(await rows(),replay);assert.deepEqual(await history(),audit);
  for(const draft of drafts){const result=await call(validate,draft.id);assert.equal(result.assembledPreview.skillVersions[0].id,skill.id);}
  const validated=await rows();await db.exec(migration);assert.deepEqual(await rows(),validated);
  for(const draft of drafts)await call(activate,draft.id);
  const activated=await rows(),activatedAudit=await history();await db.exec(migration);
  assert.deepEqual(await rows(),activated);assert.deepEqual(await history(),activatedAudit);
  assert.deepEqual(activated.find(row=>row.type==='promo_page_section_designer'),before.find(row=>row.type==='promo_page_section_designer'));

  // Use the actual prompt snapshot and provider transport, with only HTTP mocked.
  process.env.GEMINI_API_KEY='local-fixture-only';
  globalThis.fetch=async(url,options)=>{
    const body=JSON.parse(options.body);fetchCalls++;
    assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(body.model,'gemini-3-pro-image');assert.equal(body.input[0].type,'text');
    assert.ok(body.input[0].text.includes('Use the approved campaign intent.'));
    const fourK=body.response_format.image_size==='4K';
    assert.equal(body.response_format.image_size,fetchCalls===1?'2K':'4K');
    assert.equal(body.response_format.mime_type,'image/png');
    const image=Buffer.alloc(4096);Buffer.from([137,80,78,71,13,10,26,10]).copy(image);
    image.write('IHDR',12);image.writeUInt32BE(fourK?4096:2560,16);image.writeUInt32BE(fourK?4096:1440,20);
    return new Response(JSON.stringify({output_image:{data:image.toString('base64'),mime_type:'image/png'}}),{status:200,headers:{'content-type':'application/json','x-goog-request-id':'fixture-pro'}});
  };
  for(const type of types){
    const variables=Object.fromEntries([...store.promptVariableContract(type).requiredVariables,...store.promptVariableContract(type).optionalVariables].map(key=>[key,key==='contentJson'?'{}':key==='backgroundColor'?'#171719':key==='aspectRatio'?'16:9':key==='fadeMode'?'none':'Approved image intent']));
    const {promptConfig}=await require('../api/_prompt-execution-snapshot').createPromptExecutionSnapshot(sql,type,variables);
    const generated=await require('../api/_promo-section-design-provider').generateSectionImage({targetType:type==='component_image'?'component':'section-background',prompt:promptConfig.renderedPrompt,aspectRatio:type==='component_image'?'1:1':'16:9',promptConfig,modelOptions:promptConfig.modelOptions});
    assert.equal(generated.provider.model,'gemini-3-pro-image');assert.equal(generated.mimeType,'image/png');
  }
  assert.equal(fetchCalls,2);

  await seed();await db.query("update llm_models set status='inactive' where model_id='gemini-3-pro-image'");
  await reject(/NANO_PRO_MODEL_REQUIRED/);await db.query("update llm_models set status='active' where model_id='gemini-3-pro-image'");
  await seed();await db.query('delete from prompt_templates where id=$1',[ids[1]]);await reject(/NANO_PRO_ACTIVE_REQUIRED/);
  await seed();await db.query("update prompt_templates set model_options=model_options||'{\"executionSnapshotVersion\":1}'::jsonb where id=$1",[ids[1]]);await reject(/NANO_PRO_CONTROL_PLANE_REQUIRED/);
  await seed();await db.query("update prompt_templates set model_options=jsonb_set(model_options,'{generationPolicy,requestedTier}','\"8K\"') where id=$1",[ids[1]]);await reject(/NANO_PRO_TIER_UNSUPPORTED/);
  await seed();
  await db.query(`insert into prompt_templates(type,name,body,status,version,lineage_id,model_options)
    select type,'Existing validated','Custom candidate','validated',6,lineage_id,model_options from prompt_templates where id=$1`,[ids[1]]);
  await reject(/NANO_PRO_VALIDATED_CANDIDATE/);
  await db.exec("update prompt_templates set status='draft' where status='validated'");
  await db.exec(migration);
  assert.equal((await rows()).find(row=>row.name==='Existing validated').body,'Custom candidate');
  console.log('Nano Banana Pro 103: V2/V3 Drafts, original active/text prompts/body/variables/skills/policies preserved, exact replay, real Admin validate/activate, 2K/4K Google transport, and atomic missing/inactive/V1/tier/validated-candidate failures passed. HTTP is mocked; no live image or operating DB calls.');
}finally{
  globalThis.fetch=originalFetch;
  if(originalKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=originalKey;
  await db.close();
}
