import {readFileSync} from 'node:fs';
import {TOKEN_USAGE_RULES} from '../../shared/token-usage-policy.mjs';
export const fixture=name=>JSON.parse(readFileSync(new URL(`../../docs/설계/dynamic-page-schema/${name}.json`,import.meta.url)));
const values={'font-family':'Arial','font-size':'16px',color:'#eeeeee','background-color':'#232329',padding:'16px',gap:'16px','border-radius':'8px','box-shadow':'0 1px 2px rgba(84,84,94,0.05)','line-height':'1.5','font-weight':'400','border-color':'#232329','border-width':'1px'};
export const context={...fixture('example-context'),usagePolicy:{schemaVersion:1,bindings:{}},tokenValues:{},tokenCatalog:[],tokenVersionId:'fixture'};
TOKEN_USAGE_RULES.forEach((rule,index)=>{const name=`--fixture-${index}`;context.usagePolicy.bindings[rule.key]=name;context.tokenValues[name]=values[rule.property];context.tokenCatalog.push({name,tokenKey:name,value:values[rule.property],state:'active',cssProperties:[rule.property]});});

// Synthetic registered layout values, deliberately distinct across viewports.
for(const [name,columns,gutter,margin] of [['desktop-1920','12','28px','40px'],['desktop-1440','12','24px','32px'],['tablet-768','8','16px','24px'],['mobile-375','4','8px','16px']])for(const [suffix,value] of [['columns',columns],['gutter',gutter],['margin-inline',margin]]){const key=`--grid-${name}-${suffix}`;context.tokenValues[key]=value;context.tokenCatalog.push({name:key,tokenKey:key,value,state:'active',cssProperties:[suffix==='columns'?'grid-template-columns':suffix==='gutter'?'gap':'padding-inline']});}
for(const [key,value] of Object.entries({'--breakpoint-tablet-min':'768px','--breakpoint-desktop-min':'1024px','--grid-reference-desktop-1920-width':'1920px','--spacing-0':'0px','--spacing-8':'8px','--spacing-16':'16px','--spacing-32':'32px'})){context.tokenValues[key]=value;context.tokenCatalog.push({name:key,tokenKey:key,value,state:'active',cssProperties:key.startsWith('--spacing-')?['gap','padding','margin']:['layout-breakpoint']});}
