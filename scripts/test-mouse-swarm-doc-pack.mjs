import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {validatePromptTemplateContract}=require('../api/_prompt-template-store');
const root=new URL('../docs/mouse-swarm-builder/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',root),'utf8'));
assert.equal(manifest.productionApplied,false);
assert.equal(new Set(manifest.prompts.map(p=>p.type)).size,5);
for(const entry of manifest.prompts){
 const body=readFileSync(new URL(entry.promptFile,root),'utf8');
 const result=validatePromptTemplateContract(entry.type,{body,requiredVariables:entry.requiredVariables,optionalVariables:entry.optionalVariables});
 assert.deepEqual(new Set(result.placeholders),new Set([...entry.requiredVariables,...entry.optionalVariables]));
 assert.equal(entry.status,'draft');assert.equal(entry.preserveRegisteredModelConfig,true);
 assert.equal(entry.skillFiles.length,1);
 for(const path of entry.skillFiles){const text=readFileSync(new URL(path,root),'utf8');assert.ok(text.includes(entry.type));assert.ok(!text.includes('{{'));assert.notEqual(path,manifest.frontendSkillFile);}
 assert.match(body,/Return only/i);
 assert.match(body,/registered/i);
 if(entry.type.startsWith('promo_'))assert.match(body,/cursor/i);
 assert.match(body,entry.type.startsWith('promo_')?/constraintsJson\.designBrief/:/contentJson\.designBrief/);
}
const policy=readFileSync(new URL('policy.md',root),'utf8');
for(const term of ['12','persisted','Revision','pointer-events:none','aria-hidden=true','채팅','초안','모션 감소','단일 전체 결과'])assert.ok(policy.includes(term),term);
const agents=readFileSync(new URL('../AGENTS.md',import.meta.url),'utf8');
assert.ok(agents.includes('## Mouse Swarm Builder 표시 정책'));
assert.ok(agents.includes('docs/mouse-swarm-builder/README.md'));


const plan=readFileSync(new URL('../docs/계획/unified-page-builder-editor-plan-2026-11-19.md',import.meta.url),'utf8');
assert.ok(agents.includes('1. 요청 요약 → 2. 페이지 제작'));
assert.ok(!agents.includes('요청 요약 → 페이지 미리보기 → 고객의 구성 승인 → 디자인 미리보기 순서를 유지한다'));
for(const term of ['구성 승인','동일 documentId','PageSchema','Revision','6단계','자동 검사','초안','실제 Preview','E06'])assert.ok(plan.includes(term),term);

assert.equal(manifest.packageVersion,2);assert.equal(manifest.runtimeInjectionImplemented,true);
const direction=readFileSync(new URL(manifest.designDirectionContract,root),'utf8');
for(const term of ['artDirection','pinned','constraintsJson.designBrief','contentJson.designBrief']){assert.ok(direction.includes(term),term);}
assert.ok(agents.includes('## 공통 디자인 방향과 생성 일관성'));
assert.ok(plan.includes('D10'));
console.log('Design direction pack v2: 5 existing prompt-variable contracts, 4 scoped AI skills, shared brief carriers, Draft/model preservation, policy/6-stage plan linkage passed. Runtime/Admin activation remains unverified.');

assert.ok(agents.includes('opacity: 0.5'));assert.ok(policy.includes('opacity: 0.5'));assert.ok(plan.includes('opacity: 0.5'));

for(const term of ['## 12. 채팅 진행 이력','P07','1.8초','opacity: 0.5','25%'])assert.ok(plan.includes(term),term);

assert.ok(agents.includes('## 최종 웹 출력 형식'));for(const term of ['## 13. 최종 출력','O08','프레임워크 런타임','PageSchema','interactions.js'])assert.ok(plan.includes(term),term);

for(const term of ['## 14. 와이어프레임','650ms','효과만 일시정지','F08','340ms'])assert.ok(plan.includes(term),term);

assert.equal(manifest.progressiveContractVersion,2);
for(const entry of manifest.progressivePrompts){const body=readFileSync(new URL(entry.promptFile,root),'utf8');validatePromptTemplateContract(entry.type,{body,requiredVariables:entry.requiredVariables,optionalVariables:[]});}

const unitMigration=readFileSync(new URL('../db/migrations/096_page_draft_units_v2.sql',import.meta.url),'utf8');
for(const entry of manifest.progressivePrompts){const body=readFileSync(new URL(entry.promptFile,root),'utf8');assert.ok(unitMigration.includes(body.replaceAll("'","''")),'096 must match '+entry.promptFile);}
