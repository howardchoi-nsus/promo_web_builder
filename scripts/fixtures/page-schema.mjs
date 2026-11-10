import {readFileSync} from 'node:fs';
import {TOKEN_USAGE_RULES} from '../../shared/token-usage-policy.mjs';
export const fixture=name=>JSON.parse(readFileSync(new URL(`../../docs/설계/dynamic-page-schema/${name}.json`,import.meta.url)));
const values={'font-family':'Arial','font-size':'16px',color:'#eeeeee','background-color':'#232329',padding:'16px',gap:'16px','border-radius':'8px','box-shadow':'0 1px 2px rgba(84,84,94,0.05)','line-height':'1.5','font-weight':'400','border-color':'#232329','border-width':'1px'};
export const context={...fixture('example-context'),usagePolicy:{schemaVersion:1,bindings:{}},tokenValues:{},tokenCatalog:[],tokenVersionId:'fixture'};
TOKEN_USAGE_RULES.forEach((rule,index)=>{const name=`--fixture-${index}`;context.usagePolicy.bindings[rule.key]=name;context.tokenValues[name]=values[rule.property];context.tokenCatalog.push({name,tokenKey:name,value:values[rule.property],state:'active',cssProperties:[rule.property]});});
