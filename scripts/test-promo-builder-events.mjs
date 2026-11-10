import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {recordBuilderEvent} from '../visual-editor/src/builder/services/composition-client.mjs';
const require=createRequire(import.meta.url);
const auth=require('../api/_promo-builder-auth');
const session=auth.createSessionToken(),owner=auth.ownerSubjectForSession(session.sessionId);
let writes=[];
const storeId=require.resolve('../api/_promo-builder-document-store');
require.cache[storeId]={id:storeId,filename:storeId,loaded:true,exports:{getSql:()=>async(parts,...values)=>{writes.push(values);return [];},fetchDocument:async(sql,id,subject)=>id==='owned-document'&&subject===owner?{document:{id}}:null}};
const handler=require('../api/promo-builder-events');
const {EVENT_NAMES,EVENT_ALIASES,normalizeEvent}=handler;
// Cover every literal emitted by the real UI, including cached client event names.
const source=fs.readFileSync(new URL('../visual-editor/src/builder/AiBuilderApp.vue',import.meta.url),'utf8');
const emitted=[...source.matchAll(/eventName:\s*['"]([^'"]+)['"]/g)].map(match=>match[1]);
for(const name of emitted)assert.ok(EVENT_NAMES.has(normalizeEvent(name,{}).eventName),`Unsupported client event: ${name}`);
const migration=fs.readFileSync(new URL('../db/migrations/044_ai_promo_builder_composition_engine.sql',import.meta.url),'utf8').split('create table if not exists promo_builder_events (')[1].split(')),')[0];
for(const alias of Object.values(EVENT_ALIASES))assert.ok(migration.includes(`'${alias.name}'`),'Alias must be supported by the original DB constraint');
async function call(eventName,metadata={},documentId='owned-document',cookie=`${auth.COOKIE_NAME}=${session.token}`){let status=200,payload;const res={setHeader(){},status(code){status=code;return this;},json(value){payload=value;return this;}};await handler({method:'POST',headers:{cookie},body:{eventName,metadata,documentId,documentRevision:2}},res);return {status,payload};}
for(const [name,alias] of Object.entries(EVENT_ALIASES)){
 const res=await call(name,{attempt:2,sourceEventName:'forged',eventPhase:'forged',privateObject:{secret:'drop'}});
 assert.equal(res.status,202,JSON.stringify(res));const saved=writes.at(-1);assert.equal(saved[2],alias.name);
 const metadata=JSON.parse(saved[6]);assert.equal(metadata.sourceEventName,name);assert.equal(metadata.eventPhase,alias.phase);assert.equal(metadata.attempt,2);assert.equal(metadata.privateObject,null);
}
assert.equal((await call('composition_requested',{phase:'original'})).status,202);assert.deepEqual(JSON.parse(writes.at(-1)[6]),{phase:'original'});
const count=writes.length;
assert.equal((await call('unknown_event')).status,400);
assert.equal((await call('builder_quality_gate_passed',{},'foreign-document')).status,404);
assert.equal((await call('builder_quality_gate_passed',{},'owned-document','')).status,401);assert.equal(writes.length,count);
const oldFetch=globalThis.fetch;
try{globalThis.fetch=async url=>url==='/api/promo-builder-session'?new Response('{}',{status:200}):new Response('{"error":"database unavailable"}',{status:500});assert.equal(await recordBuilderEvent({eventName:'builder_quality_gate_passed'}),null);}finally{globalThis.fetch=oldFetch;}
console.log('Builder events: all client names, historical DB compatibility, quality/export/retry recording, protected metadata, session ownership and non-blocking failures passed.');
