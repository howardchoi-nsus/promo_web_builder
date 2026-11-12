import {spawnSync} from 'node:child_process';
const root=new URL('..',import.meta.url);
if(!process.env.PGLITE_TEST_MODULE)throw new Error('PGLITE_TEST_MODULE must point to a PGlite installation for the SQL storage check. See the design preview rollout guide.');
const checks=[
 'test-design-token-library.mjs','test-token-usage-policy.mjs','test-token-usage-policy-api.mjs','test-token-policy-cold-start.mjs',
 'test-page-schema.mjs','test-page-schema-style-targets.mjs','test-page-schema-api.mjs','test-page-schema-readiness.mjs',
 'test-design-preview-enhancements.mjs','test-page-quality-repair.mjs','test-registered-token-save-roundtrip.mjs','test-promo-quality-gate.js','test-nuxt-runtime-contract.mjs',
 'test-published-promotion-contract.mjs','test-ai-builder-chat-workspace-handlers.js','test-ai-builder-chat-workspace-contract.js','check-hallmark-postgres.mjs',
 'test-token-usage-policy-browser.mjs','test-design-preview-enhancements-browser.mjs','test-page-schema-builder-browser.mjs','test-content-preview-auto-browser.mjs',
 'test-hallmark-journey-browser.mjs','test-page-schema-browser.mjs','test-output-token-refresh-browser.mjs','test-output-isolation-ssr.mjs',
];
for(const check of checks){
 const result=spawnSync(process.execPath,['scripts/'+check],{cwd:root,stdio:'inherit',env:process.env});
 if(result.status!==0)process.exit(result.status||1);
}
console.log(`Design preview: ${checks.length} scoped contract/browser/PGlite checks passed. Actual LLM, Neon, Blob and Vercel Preview validation is separate and has not been performed by this command.`);
