import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const sourceUrl=new URL('../shared/token-usage-policy.mjs',import.meta.url);
export const outputUrl=new URL('../shared/token-usage-policy.cjs',import.meta.url);
export function generatedPolicySource(){
 const source=fs.readFileSync(sourceUrl,'utf8');
 const names=[...source.matchAll(/^export (?:const|function) (\w+)/gm)].map(match=>match[1]);
 if(!names.length||/^import /m.test(source))throw Error('Token policy CommonJS generation requires explicit named exports and no imports');
 return '// Generated from token-usage-policy.mjs. Do not edit; run npm run build:token-policy.\n'+source.replace(/^export /gm,'')+'\nmodule.exports = { '+names.join(', ')+' };\n';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){fs.writeFileSync(outputUrl,generatedPolicySource());
 const layout=fs.readFileSync(new URL('../shared/layout-token-policy.cjs',import.meta.url),'utf8').replace('module.exports={PROFILES,layoutTokenPolicy,assertLayoutTokens};','export {PROFILES,layoutTokenPolicy,assertLayoutTokens};');
 fs.writeFileSync(new URL('../shared/layout-token-policy.mjs',import.meta.url),'// Generated from layout-token-policy.cjs.\n'+layout);const registered=fs.readFileSync(new URL('../shared/registered-token-policy.mjs',import.meta.url),'utf8').replace('import { usageAssignmentErrors, targetForProperty } from "./token-usage-policy.mjs";','const {usageAssignmentErrors,targetForProperty}=require("./token-usage-policy.cjs");').replace(/^export /gm,'');
 fs.writeFileSync(new URL('../shared/registered-token-policy.cjs',import.meta.url),'// Generated from registered-token-policy.mjs.\n'+registered+'\nmodule.exports={enforceRegisteredDesignTokens};\n');
 const confirmation=fs.readFileSync(new URL('../shared/page-schema/content-confirmation.mjs',import.meta.url),'utf8');
 const confirmationNames=[...confirmation.matchAll(/^export function (\w+)/gm)].map(match=>match[1]);
 fs.writeFileSync(new URL('../shared/page-schema/content-confirmation.cjs',import.meta.url),'// Generated from content-confirmation.mjs; run build:token-policy.\n'+confirmation.replace(/^export /gm,'')+'\nmodule.exports={'+confirmationNames.join(',')+'};\n');
 console.log('Generated server token usage policy.');}
