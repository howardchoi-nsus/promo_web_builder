import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {designFixture} from './fixtures/design-preview-enhancements.mjs';
import {previewReference} from '../shared/layout-token-policy.mjs';
import {analyzeTokenLibrary,tokenCssProperties} from '../shared/design-token-library.mjs';
import {pageStyleRoles,pageStyleWarnings,pageStyleToken} from '../shared/token-usage-policy.mjs';
import {parseColor,contrast,gradientColor} from '../shared/page-schema/quality-colors.mjs';
const require=createRequire(import.meta.url),{repairPageQuality}=require('../api/_page-schema-quality-repair');
const {structuralHash}=require('../api/_page-schema-design');
const {assertValid,walk}=require('../shared/page-schema/contract.cjs');
const seed=JSON.parse(readFileSync(new URL('../data/design-tokens/dark-library.json',import.meta.url)));
const analyzed=analyzeTokenLibrary(seed),registered={tokenValues:analyzed.resolved,tokenCatalog:analyzed.tokens.map(t=>({...t,value:analyzed.resolved[t.name],cssProperties:tokenCssProperties(t)}))};
assert.equal(previewReference(registered,'desktop').width,1440);
assert.equal(1440-2*parseFloat(registered.tokenValues['--grid-desktop-1440-margin-inline']),720);
assert.equal(previewReference(registered,'mobile').width,375);
const {plannerContext}=require('../api/_page-schema-service');
const geometry=plannerContext({...designFixture().context,tokenValues:{...designFixture().context.tokenValues,...registered.tokenValues},tokenCatalog:[...designFixture().context.tokenCatalog,...registered.tokenCatalog]}).layoutGeometry;
assert.equal(geometry.desktop.contentWidth,720);assert.equal(geometry.desktop.columnWidth,38);

assert.equal(previewReference({tokenValues:{'--grid-reference-desktop-1440-width':'1440px'},tokenCatalog:[]},'desktop'),null,'unregistered values must not configure preview width');
assert.equal(parseColor('#fff')[0],255);assert.equal(contrast(parseColor('#ffffff'),parseColor('#000000')),21);
assert.deepEqual(gradientColor('linear-gradient(transparent, #000000)',.5,.5),[0,0,0,.5]);
const {page,context}=designFixture({pending:false}),original=structuredClone(page),roles=pageStyleRoles(context);
let text;walk(page.root,({node})=>{if(!text&&node.type==='text')text=node;});
const repaired=repairPageQuality(page,context,[{code:'TEXT_CONTRAST',path:text.id,viewport:'mobile',fontSize:16,samples:[[0,0,0,1]],level:'blocking'}]);
assert.equal(repaired.changed,true);assert.equal(structuralHash(repaired.page),structuralHash(page),'paint repairs preserve approval structure');
const patch=[];walk(repaired.page.root,({node})=>{if(node.id===text.id)patch.push(node);});
const choice=roles.find(role=>role.key===patch[0].styles.mobile.at(-1));assert.ok(contrast(parseColor(context.tokenValues[pageStyleToken(context,choice)]),[0,0,0,1])>=4.5);
assert.deepEqual(page,original,'repair must never mutate current stored source');
const separated=repairPageQuality(page,context,[{code:'IMAGE_OCCLUDED',path:'design_image',viewport:'desktop',level:'blocking'}]);
assert.equal(separated.changed,true);assert.notEqual(structuralHash(separated.page),structuralHash(page),'image separation requires renewed structure approval');
const image=separated.page.root.children.find(n=>n.id==='design_image');assert.equal(image.presentation,'content');assert.equal(image.assetId,'image_ready');assert.deepEqual(context.assets.image_ready,{kind:'image',url:'/design-fixture.png',width:1,height:1,displayAspectRatio:'16:9'});
assert.equal(separated.page.root.overlayRole,null);assertValid(separated.page,context);
assert.equal(repairPageQuality(page,context,[{code:'IMAGE_OCCLUDED',path:'unknown',level:'blocking'}]).changed,false);
assert.equal(repairPageQuality(page,context,[{code:'TEXT_CONTRAST',path:text.id,samples:[[999,0,0,1]],fontSize:16}]).changed,false);
const noStyle={...context,tokenCatalog:context.tokenCatalog.filter(t=>!t.cssProperties.includes('border-style'))};
assert.ok(pageStyleWarnings(noStyle).every(w=>w.missingProperties.includes('border-style')));
const partial=structuredClone(page);partial.root.styles.base=partial.root.styles.base.filter(key=>roles.find(r=>r.key===key)?.property!=='border-style');
const borderRepair=repairPageQuality(partial,noStyle,[{code:'STYLE_TOKEN_REQUIRED',path:partial.root.id,viewport:'desktop'},{code:'STYLE_TOKEN_REQUIRED',path:'design_divider',viewport:'desktop'}]);
assert.equal(borderRepair.changed,true);assert.ok(borderRepair.actions.some(action=>action.code==='UNSUPPORTED_BORDER_REMOVED'));assert.ok(borderRepair.actions.some(action=>action.code==='UNSUPPORTED_DIVIDER_REMOVED'));assert.equal(borderRepair.page.root.children.some(n=>n.id==='design_divider'),false);
const line=repairPageQuality(page,context,[{code:'TEXT_CLIPPING_OR_LINE_HEIGHT',path:text.id,viewport:'mobile',fontSize:48}]);assert.equal(line.changed,true);assertValid(line.page,context);
// Missing factual URLs are preserved as non-interactive copy, never invented.
const unbound=structuredClone(page);walk(unbound.root,({node})=>{if(node.type==='button')node.actionId=null;});
assertValid(unbound,context,{final:true});
// A narrow multi-column row is repaired, keeping every node and factual copy.
let grid;walk(page.root,({node})=>{if(node.type==='grid')grid=node;});
if(grid){const flow=repairPageQuality(page,context,[{code:'CONTENT_NARROW',path:grid.id,viewport:'desktop'}]);assert.equal(flow.changed,true);assert.notEqual(structuralHash(flow.page),structuralHash(page));assertValid(flow.page,context);}
console.log('Quality repair: original grid reference/margins, registered-only contrast math, immutable paint repair, image preservation, structural reapproval, CTA static copy and border mapping diagnostics passed.');
