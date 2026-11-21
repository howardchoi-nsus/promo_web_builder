import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {validateControlPlaneConfig}=require('../api/_section-ai-control-plane');
const source=readFileSync('prototype/app.js','utf8');
function method(name,next){const start=source.indexOf('    '+name+'('),end=source.indexOf('    '+next+'(',start);assert.ok(start>=0&&end>start);return Function('return ({'+source.slice(start,end)+'})')()[name];}
const snapshotVersion=method('promptSnapshotVersion','promptUsesSectionAiControlPlane');
const controlled=method('promptUsesSectionAiControlPlane','promptUsesSectionImagePolicy');
const image=method('promptUsesSectionImagePolicy','promptModelOptionsForSave');
const save=method('promptModelOptionsForSave','promptEditorSavePayload');
for(const type of ['promo_page_manifest_planner','promo_page_region_builder','promo_page_outline_planner','promo_page_fragment_writer','promo_page_schema_planner','promo_page_section_designer','promo_page_quality_reviewer','layout_reference_analyzer']){
 const editor={executionSnapshotVersion:2,timeoutMs:240000,maxAttempts:1,retryBaseMs:0,retryMaxMs:0,modelOptionsText:'{"reasoningEffort":"low"}',promptLayersText:'{}',skillBindings:[{skillVersionId:'pinned-version'}],harnessConfigText:'{"additionalInstructions":[]}',modelCapabilitySnapshotText:'{}',safetyContractText:'{"key":"page-section-design-v1","version":1}'};
 const ctx={promptSnapshotVersion:snapshotVersion,promptEditor:editor,parseModelOptionsText:JSON.parse,promptUsesSectionAiControlPlane:controlled,promptUsesSectionImagePolicy:image,promptSupportsImageSize:()=>false};
 assert.equal(controlled({type}),true);
 for(const legacy of [undefined,0,1,'1','invalid']){
  editor.executionSnapshotVersion=legacy;
  const repaired=save.call(ctx,{type});
  assert.equal(repaired.executionSnapshotVersion,2);
  assert.equal(validateControlPlaneConfig(type,{modelOptions:repaired}),true);
 }
 editor.executionSnapshotVersion=3;assert.equal(save.call(ctx,{type}).executionSnapshotVersion,3);
 editor.executionSnapshotVersion=2;
 const saved=save.call(ctx,{type});
 assert.equal(saved.executionSnapshotVersion,2);assert.equal(saved.runtimeConfig.timeoutMs,240000);assert.equal(saved.reasoningEffort,'low');assert.deepEqual(saved.skillBindings,editor.skillBindings);assert.deepEqual(saved.safetyContract,JSON.parse(editor.safetyContractText));
 assert.equal(validateControlPlaneConfig(type,{modelOptions:saved}),true);
 const stripped={...saved};delete stripped.executionSnapshotVersion;
 assert.throws(()=>validateControlPlaneConfig(type,{modelOptions:stripped}),{code:'CONTROL_PLANE_CONFIG_REQUIRED'});
}
assert.equal(controlled({type:'legacy-custom'}),false);
console.log('Admin Snapshot save: new page prompt types preserve V2, runtime, skills, safety and provider options; saved payload passes real server validation.');
