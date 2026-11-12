import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fixture,context} from './fixtures/page-schema.mjs';
const require=createRequire(import.meta.url);
const Ajv=require('ajv/dist/2020').default;
const {runtimeSchema,nodeTargets,walk,TYPES}=require('../shared/page-schema/contract.cjs');
const {TOKEN_USAGE_RULES}=require('../shared/token-usage-policy.cjs');
const schema=runtimeSchema(context);
for(const type of TYPES){
 const variants=schema.$defs[type].anyOf||[schema.$defs[type]];
 for(const definition of variants){
  const role=definition.properties.role?.const||definition.properties.role?.enum?.[0];
  const targets=nodeTargets({type,role});
  const expected=TOKEN_USAGE_RULES.filter(rule=>targets.includes(rule.target)&&context.usagePolicy.bindings[rule.key]&&context.tokenValues[context.usagePolicy.bindings[rule.key]]).map(rule=>rule.key);
  const styles=definition.properties.styles.properties;
  for(const items of [styles.base.items,styles.tablet.anyOf[0].items,styles.mobile.anyOf[0].items])assert.deepEqual(items.enum,expected.length?expected:['__unavailable__']);
 }
}
const check=new Ajv({strict:false}).compile(schema);
const page=fixture('example-editorial');
walk(page.root,({node})=>{if(node.type==='container')node.overlayRole=null;if(node.type==='image')node.presentation='content';node.styles.spacing={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};});
assert.equal(check(page),true,JSON.stringify(check.errors));
page.root.styles.base.push('text.font');
assert.equal(check(page),false,'Provider schema must reject text.font on root before model output is accepted');
page.root.styles.base.pop();
walk(page.root,({node})=>{if(node.type==='text')node.styles.base.push('text.font');});
assert.equal(check(page),true,JSON.stringify(check.errors));
console.log('Provider schema: node-specific role targets, container/group distinction, responsive roles and root text.font rejection passed.');
