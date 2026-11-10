import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {analyzeTokenLibrary,tokenCssProperties} from '../shared/design-token-library.mjs';
import {createTokenUsageDraft} from '../shared/token-usage-policy.mjs';
const require=createRequire(import.meta.url);const {createHandler}=require('../api/design-token-usage-policy');
const seed=JSON.parse(fs.readFileSync(new URL('../data/design-tokens/dark-library.json',import.meta.url)));
const analysis=analyzeTokenLibrary([...seed,{category:'Color',type:'color',name:'--text-primary',value:'#eeeeee',reference:''}]);
const catalog=analysis.tokens.filter(token=>token.state==='active').map(token=>({...token,tokenKey:token.name,cssProperties:tokenCssProperties(token)}));
const policy=createTokenUsageDraft(catalog);let writes=0;
const sql=async(parts)=>{const query=parts.join('');
 if(query.includes('publish_token_usage_policy')){writes++;return [{id:'saved-policy'}];}
 if(query.includes('promo_token_usage_policy_versions'))return [];
 if(query.includes('from promo_design_token_values'))return analysis.tokens.map(token=>({token_key:token.name,token_value:analysis.resolved[token.name],value_type:token.type,css_properties:tokenCssProperties(token),metadata:{libraryToken:token,state:token.state}}));
 if(query.includes('where version.id'))return [{id:'token-version',set_key:'design-system',version:1,status:'active'}];
 if(query.includes('from promo_design_token_sets'))return [{id:'set',set_key:'design-system',version_id:'token-version',version_status:'active',status:'active'}];
 throw Error('Unexpected query');
};
const handler=createHandler({sqlFactory:()=>sql,authorize(){}});
function response(){return {statusCode:200,setHeader(){},status(value){this.statusCode=value;return this;},json(value){this.body=value;return this;}};}
let res=response();await handler({method:'GET',headers:{},query:{}},res);assert.equal(res.statusCode,200);assert.deepEqual(res.body.validation.missing,['text.primary']);
const body={policy,tokenVersionId:'token-version',expectedHeadId:null,activate:false};
res=response();await handler({method:'POST',headers:{},body},res);assert.equal(res.statusCode,200);assert.equal(writes,1);
res=response();await handler({method:'POST',headers:{},body:{...body,activate:true}},res);assert.equal(res.statusCode,422);assert.equal(writes,1);
policy.bindings['text.primary']='--button-label-default';res=response();await handler({method:'POST',headers:{},body},res);assert.equal(res.statusCode,422);
policy.bindings['text.primary']='--text-primary';res=response();await handler({method:'POST',headers:{},body:{...body,activate:true}},res);assert.equal(res.statusCode,200);assert.equal(writes,2);
res=response();await handler({method:'POST',headers:{origin:'https://foreign.test',host:'app.test'},body},res);assert.equal(res.statusCode,403);
res=response();await createHandler({authorize(){throw Object.assign(Error('admin required'),{statusCode:403});},sqlFactory(){throw Error('must not read');}})({method:'GET',headers:{}},res);assert.equal(res.statusCode,403);
res=response();await handler({method:'POST',headers:{},body:{...body,tokenVersionId:'old'}},res);assert.equal(res.statusCode,409);
console.log('Token usage policy API passed: admin/origin checks, Draft vs activation, invalid scope rejection, version checks and catalog response.');

const {createHandler:createLibraryHandler}=require('../api/design-token-library');
let libraryWrites=0;
const libraryHandler=createLibraryHandler({authorize(){},sqlFactory:()=>async(parts)=>{
 const query=parts.join('');
 if(query.includes('publish_single')){libraryWrites++;return [{version_id:'saved-library'}];}
 if(query.includes('promo_token_usage_policy_versions'))return [{policy_json:policy}];
 return [{id:'library'}];
}});
res=response();await libraryHandler({method:'POST',headers:{},body:{tokens:[...seed,{category:'Color',type:'color',name:'--text-primary',value:'#eeeeee',reference:''}],expectedVersionId:null}},res);assert.equal(res.statusCode,200);assert.equal(libraryWrites,1);
res=response();await libraryHandler({method:'POST',headers:{},body:{tokens:seed,expectedVersionId:null}},res);assert.equal(res.statusCode,422);assert.equal(libraryWrites,1);
console.log('Active usage-policy dependency prevents deletion of required mapped tokens.');
