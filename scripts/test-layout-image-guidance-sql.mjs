import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { PGlite } = await import(process.env.PGLITE_TEST_MODULE || '@electric-sql/pglite');
const { promptVariableContract, validatePromptTemplateContract } = require('../api/_prompt-template-store');
const db = new PGlite();
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const patch = read('db/migrations/102_layout_and_image_prompt_guidance.sql');
const types = ['promo_page_manifest_planner', 'promo_page_region_builder', 'promo_page_schema_planner', 'section_background_image', 'component_image'];
const files = ['page-unit-plan.md','page-unit-region.md','page-schema-planner.md','section-background-image.md','component-image.md'];
const ids = Array.from({length:5},(_,i)=>`11111111-1111-4111-8111-11111111111${i}`);
const candidateId = '99999999-9999-4999-8999-999999999999';
const rows = async () => (await db.query('select * from prompt_templates order by type,status,version')).rows;
const histories = async () => (await db.query('select * from prompt_template_histories order by prompt_type,id')).rows;
async function seed() {
  await db.exec('truncate prompt_templates cascade');
  for (let i = 0; i < types.length; i++) {
    const variables = promptVariableContract(types[i]);
    const body = read('docs/mouse-swarm-builder/automatic-design-pack/prompts/' + files[i]) + '\nCUSTOM ACTIVE REQUIREMENT';
    await db.query(`insert into prompt_templates(id,lineage_id,type,name,body,status,version,
      required_variables,optional_variables,provider,model,temperature,max_tokens,response_format,model_options,change_note)
      values($1,$1,$2,'Custom name',$3,'active',7,$4,$5,'openai','registered-model',0.25,10000,'json_object',$6,'Existing custom note')`,
    [ids[i], types[i], body, JSON.stringify(variables.requiredVariables), JSON.stringify(variables.optionalVariables), JSON.stringify({ ...(i<2?{pageDraftContractVersion:2}:{}), executionSnapshotVersion: 2, skillBindings: [{ skillVersionId: 'existing-skill' }], runtimeConfig: { timeoutMs: 240000 }, safetyContract: { key: 'page-schema-v1', version: 1 } })]);
    if(i>=3)await db.query("update prompt_templates set provider='google',model='registered-image-model',response_format='image',temperature=null where id=$1",[ids[i]]);
  }
}
async function candidate(status = 'draft', suffix = 'CUSTOM DRAFT REQUIREMENT') {
  await db.query(`insert into prompt_templates(id,lineage_id,source_prompt_template_id,type,name,body,status,version,
    required_variables,optional_variables,provider,model,temperature,max_tokens,response_format,model_options,change_note,validated_at)
    select $1,lineage_id,id,type,name,body||$2,$3,8,required_variables,optional_variables,provider,
      'custom-candidate-model',temperature,max_tokens,response_format,model_options,'Draft custom note',
      case when $3='validated' then now() else null end
    from prompt_templates where id=$4`, [candidateId, '\n' + suffix, status, ids.at(-1)]);
}
async function rejectAtomically(pattern) {
  const before = await rows(), history = await histories();
  await assert.rejects(db.exec(patch), pattern);
  await db.exec('rollback');
  assert.deepEqual(await rows(), before, 'Failure in any prompt must roll back the whole pack');
  assert.deepEqual(await histories(), history);
}
try {
  await db.exec(read('db/migrations/010_prompt_templates.sql').replace('create extension if not exists pgcrypto;', ''));
  await db.exec(read('db/migrations/011_generation_runs_and_prompt_model_settings.sql').split('update prompt_templates')[0].replace('create extension if not exists pgcrypto;', ''));
  await db.exec(read('db/migrations/033_prompt_template_version_lifecycle.sql'));
  await seed();
  const activeBefore = await rows();
  await db.exec(patch);
  let all = await rows();
  assert.deepEqual(all.filter(row => row.status === 'active'), activeBefore);
  const preserved = ['name', 'lineage_id', 'required_variables', 'optional_variables', 'provider', 'model', 'temperature', 'max_tokens', 'response_format', 'model_options'];
  for (const draft of all.filter(row => row.status === 'draft')) {
    const source = activeBefore.find(row => row.type === draft.type);
    for (const field of preserved) assert.deepEqual(draft[field], source[field], field);
    assert.equal(draft.source_prompt_template_id, source.id);
    assert.equal(draft.version, 8);
    assert.ok(draft.body.startsWith(source.body));
    assert.ok(draft.body.includes('CUSTOM ACTIVE REQUIREMENT'));
    assert.equal(draft.validated_at, null);
    validatePromptTemplateContract(draft.type, { body: draft.body, requiredVariables: draft.required_variables, optionalVariables: draft.optional_variables });
  }
  assert.equal((await histories()).length, 5);
  const historyBefore = await histories();
  await db.exec(patch);
  assert.deepEqual(await rows(), all);
  assert.deepEqual(await histories(), historyBefore);
  // Activated guidance must not create further candidates on replay.
  await db.exec("update prompt_templates set status='inactive' where status='active'; update prompt_templates set status='active' where status='draft'");
  all = await rows();
  await db.exec(patch);
  assert.deepEqual(await rows(), all);
  assert.deepEqual(await histories(), historyBefore);

  await seed(); await candidate();
  const beforeExisting = await rows(), beforeDraft = beforeExisting.find(row => row.id === candidateId);
  await db.exec(patch);
  all = await rows();
  const afterDraft = all.find(row => row.id === candidateId);
  for (const field of preserved) assert.deepEqual(afterDraft[field], beforeDraft[field]);
  assert.equal(afterDraft.version, beforeDraft.version);
  assert.ok(afterDraft.body.startsWith(beforeDraft.body));
  assert.ok(afterDraft.change_note.startsWith(beforeDraft.change_note));
  assert.deepEqual(all.filter(row => row.status === 'active'), beforeExisting.filter(row => row.status === 'active'));
  assert.equal((await histories()).length, 5);

  // Compatibility with previously supplied two-prompt SQL and copied MD bodies.
  await seed();
  await db.exec(read('docs/mouse-swarm-builder/layout-diversity-prompt-pack/apply-two-prompt-bodies.sql'));
  const previousTwo=(await rows()).filter(row=>row.status==='draft');
  await db.exec(patch);
  for(const old of previousTwo) assert.deepEqual((await rows()).find(row=>row.id===old.id),old);
  assert.equal((await histories()).length,5);
  await seed();
  for(let i=0;i<2;i++)await db.query('update prompt_templates set body=$1 where id=$2',[read('docs/mouse-swarm-builder/layout-diversity-prompt-pack/prompts/'+files[i]),ids[i]]);
  const priorActiveTwo=(await rows()).filter(row=>types.slice(0,2).includes(row.type));
  await db.exec(patch);
  assert.equal((await rows()).filter(row=>row.status==='draft').length,3);
  for(const old of priorActiveTwo)assert.deepEqual((await rows()).find(row=>row.id===old.id),old);
  assert.equal((await histories()).length,3);

  await seed(); await candidate('validated');
  await rejectAtomically(/LAYOUT_PROMPT_VALIDATED_CANDIDATE/);
  await seed(); await candidate();
  await db.query("update prompt_templates set type='unrelated_type' where id=$1", [candidateId]);
  await rejectAtomically(/LAYOUT_PROMPT_CANDIDATE_INVALID/);
  await seed(); await db.query('delete from prompt_templates where id=$1', [ids.at(-1)]);
  await rejectAtomically(/LAYOUT_PROMPT_ACTIVE_REQUIRED/);
  await seed(); await candidate('draft', '<!-- layout-image-phase1-v1 --> incompatible patch');
  await rejectAtomically(/LAYOUT_PROMPT_PATCH_CONFLICT/);
  await seed(); await db.query("update prompt_templates set model_options='{}'::jsonb where id=$1", [ids[1]]);
  await rejectAtomically(/LAYOUT_PROMPT_V2_REQUIRED/);
  console.log('Phase1 SQL 102: actual lifecycle schema; five drafts, custom copy/model/options/variables/skills preserved; audit history; exact replay; active no-op; existing-draft update; validated/conflicting/missing/V1 atomic rollback passed. No external DB/provider calls.');
} finally { await db.close(); }
