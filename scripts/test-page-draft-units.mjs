import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {context} from './fixtures/page-schema.mjs';import {unitFixture} from './fixtures/page-draft-units.mjs';
const require=createRequire(import.meta.url),{planSchema,planResult,regionSchema,applyRegion,assertV2}=require('../api/_page-draft-units'),{assertValid,walk}=require('../shared/page-schema/contract.cjs');
const {plan,results}=unitFixture(context.contentSources);const state={...planResult(plan,context),context};
assert.equal(state.page.root.children.length,2);assert.equal(state.page.root.children[0].children.length,0);assert.equal(state.page.root.children[1].children.length,0);assert.equal(state.cursor,0);
let generated=0;walk(state.page.root,({node})=>{if(node.type==='text')generated++;});assert.equal(generated,0);
for(const schema of [planSchema(context),regionSchema(context,plan.regions[0])]){
 const visit=(v,path=[])=>{if(!v||typeof v!=='object')return;if(v.$ref){assert.match(v.$ref,/^#\/\$defs\//);let ref=schema;for(const k of v.$ref.slice(2).split('/'))ref=ref?.[k];assert.ok(ref,v.$ref);}if(path.length)assert.equal(v.$defs,undefined);for(const [k,c] of Object.entries(v))visit(c,[...path,k]);};visit(schema);
}
const fullPlan=structuredClone(plan);fullPlan.regions[0].shell.children=results[0].node.children;assert.throws(()=>planResult(fullPlan,context),{code:'PAGE_DRAFT_INVALID'});
const omitted=structuredClone(plan);omitted.regions[0].sourceIds=[];assert.throws(()=>planResult(omitted,context),{code:'PAGE_DRAFT_INVALID'});
const foreign=structuredClone(results[0]);foreign.node.children[0].sourceIds=['foreign'];assert.throws(()=>applyRegion(state,foreign),{code:'PAGE_DRAFT_INVALID'});
const wrong=structuredClone(results[0]);wrong.node.label='Changed outside unit children';assert.throws(()=>applyRegion(state,wrong),{code:'PAGE_DRAFT_INVALID'});
const injection=structuredClone(results[0]);injection.node.children[0].contentMode='editorial';injection.node.children[0].text='$999';injection.sourceAssignments=[];assert.throws(()=>applyRegion(state,injection),{code:'PAGE_DRAFT_INVALID'});
state.page=applyRegion(state,results[0]);state.cursor++;
assert.equal(state.page.root.children[0].children.length,results[0].node.children.length);assert.equal(state.page.root.children[1].children.length,0);assert.equal(state.page.root.children[1].id,'benefits');
state.page=applyRegion(state,results[1]);state.cursor++;assertValid(state.page,context);
assertV2({modelOptions:{pageDraftContractVersion:2}});assert.throws(()=>assertV2({modelOptions:{}}),{code:'PAGE_DRAFT_PROMPT_V2_REQUIRED'});
console.log('Draft units: empty manifest, real source-only region accumulation, future content absent, root-level refs, immutable shells, source/fact safety and final validation passed.');

// Nested planned sections remain independent units instead of hidden children.
const nested=structuredClone(plan);nested.regions[1].parentId=nested.regions[0].shell.id;
const ns={...planResult(nested,context),context};ns.page=applyRegion(ns,results[0]);ns.cursor++;
assert.equal(ns.page.root.children.length,1);assert.equal(ns.page.root.children[0].children.at(-1).id,'benefits');
ns.page=applyRegion(ns,results[1]);ns.cursor++;assertValid(ns.page,context);
const unplanned=structuredClone(results[0]);unplanned.node.children.push({...structuredClone(plan.regions[1].shell),id:'hidden_section'});assert.throws(()=>applyRegion({...planResult(plan,context),context},unplanned),{code:'PAGE_DRAFT_INVALID'});
const future=structuredClone(plan);future.regions[0].parentId=future.regions[1].shell.id;assert.throws(()=>planResult(future,context),{code:'PAGE_DRAFT_INVALID'});

const {waitForDraftPaint}=await import('../visual-editor/src/builder/services/page-draft.mjs');
const doc=new EventTarget();doc.visibilityState='visible';let scheduled;doc.defaultView={requestAnimationFrame:cb=>(scheduled=cb,1),cancelAnimationFrame:()=>{scheduled=null;}};
let painted=false;const painting=waitForDraftPaint(doc).then(()=>painted=true);await Promise.resolve();assert.equal(painted,false);scheduled();await Promise.resolve();assert.equal(painted,false);scheduled();await painting;assert.equal(painted,true);
const hidden=waitForDraftPaint(doc);doc.visibilityState='hidden';doc.dispatchEvent(new Event('visibilitychange'));await hidden;assert.equal(scheduled,null);await waitForDraftPaint(doc);

// In-flight older V2 drafts can fill missing plan shells without discarding work.
const older={...planResult(plan,context),context};older.page.root.children.pop();older.page=applyRegion(older,results[0]);assert.equal(older.page.root.children[1].id,'benefits');assert.deepEqual(older.page.root.children[1].children,[]);

// A lightweight manifest cannot repeat large style lists / descriptions.
const oversized=structuredClone(plan);oversized.regions[0].shell.styles.base=Array(7).fill(oversized.regions[0].shell.styles.base[0]);assert.throws(()=>planResult(oversized,context),{code:'PAGE_DRAFT_INVALID'});
const verbose=structuredClone(plan);verbose.regions[0].intent='a'.repeat(161);assert.throws(()=>planResult(verbose,context),{code:'PAGE_DRAFT_INVALID'});
