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
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){fs.writeFileSync(outputUrl,generatedPolicySource());console.log('Generated server token usage policy.');}
