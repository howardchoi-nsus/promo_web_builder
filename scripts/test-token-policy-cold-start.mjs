import assert from 'node:assert/strict';import fs from 'node:fs';import {spawnSync} from 'node:child_process';
import {generatedPolicySource,outputUrl} from './build-token-usage-policy.mjs';
assert.equal(fs.readFileSync(outputUrl,'utf8'),generatedPolicySource(),'Server policy must be generated from the canonical policy source');
const child=spawnSync(process.execPath,['--no-experimental-require-module','-e',`for(const file of ['promo-page-composition-proposals','promo-builder-documents','promo-section-composition-plan','promo-section-design-runs','item-component-activate']) require('./api/'+file);`],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
assert.equal(child.status,0,child.stderr);
console.log('Token policy server cold-start passed without require(ESM), with generated-source consistency.');
