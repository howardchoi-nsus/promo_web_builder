import assert from 'node:assert/strict';import fs from 'node:fs';import {spawnSync} from 'node:child_process';
import {generatedPolicySource,outputUrl} from './build-token-usage-policy.mjs';
assert.equal(fs.readFileSync(outputUrl,'utf8'),generatedPolicySource(),'Server policy must be generated from the canonical policy source');
const child=spawnSync(process.execPath,['--no-experimental-require-module','-e',`for(const file of ['promo-page-schema','promo-page-schema-media','promo-page-schema-image','promo-page-composition-proposals','promo-builder-documents','promo-section-composition-plan','promo-section-design-runs','item-component-activate']) require('./api/'+file);`],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
assert.equal(child.status,0,child.stderr);
console.log('Token policy server cold-start passed without require(ESM), with generated-source consistency.');

const layout=fs.readFileSync(new URL('../shared/layout-token-policy.cjs',import.meta.url),'utf8').replace('module.exports={PROFILES,layoutTokenPolicy,assertLayoutTokens,previewReference};','export {PROFILES,layoutTokenPolicy,assertLayoutTokens,previewReference};');
assert.equal(fs.readFileSync(new URL('../shared/layout-token-policy.mjs',import.meta.url),'utf8'),'// Generated from layout-token-policy.cjs.\n'+layout);
const registered=fs.readFileSync(new URL('../shared/registered-token-policy.mjs',import.meta.url),'utf8').replace('import { usageAssignmentErrors, targetForProperty } from "./token-usage-policy.mjs";','const {usageAssignmentErrors,targetForProperty}=require("./token-usage-policy.cjs");').replace(/^export /gm,'');
assert.equal(fs.readFileSync(new URL('../shared/registered-token-policy.cjs',import.meta.url),'utf8'),'// Generated from registered-token-policy.mjs.\n'+registered+'\nmodule.exports={enforceRegisteredDesignTokens};\n');

const renderer=fs.readFileSync(new URL('../packages/promo-contracts/src/renderer.mjs',import.meta.url),'utf8');
const rendererNames=[...renderer.matchAll(/^export (?:const|function) (\w+)/gm)].map(match=>match[1]);
assert.equal(fs.readFileSync(new URL('../shared/renderer-contract.cjs',import.meta.url),'utf8'),'// Generated from packages/promo-contracts/src/renderer.mjs; run build:token-policy.\n'+renderer.replace(/^export /gm,'')+'\nmodule.exports={'+rendererNames.join(',')+'};\n');

const colors=fs.readFileSync(new URL('../shared/page-schema/quality-colors.mjs',import.meta.url),'utf8');
const colorNames=[...colors.matchAll(/^export function (\w+)/gm)].map(match=>match[1]);
assert.equal(fs.readFileSync(new URL('../shared/page-schema/quality-colors.cjs',import.meta.url),'utf8'),'// Generated from quality-colors.mjs; run build:token-policy.\n'+colors.replace(/^export /gm,'')+'\nmodule.exports={'+colorNames.join(',')+'};\n');
