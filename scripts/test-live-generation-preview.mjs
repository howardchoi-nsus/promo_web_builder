import assert from 'node:assert/strict';
import {generationRegions} from '../visual-editor/src/builder/services/live-generation-preview.mjs';
const snapshot={generationMeta:{review:{state:'pending'}},content:{pageSchema:{root:{id:'root',type:'container',children:[{id:'image',type:'image',aspectRatio:'auto',children:[]}]},mediaRequests:[{id:'req',nodeId:'image',aspectRatio:'16:9'}]},pageContext:{assets:{}}}};
assert.deepEqual(generationRegions(snapshot),[]);
snapshot.generationMeta.review.state='approved';
assert.equal(generationRegions(snapshot)[0].state,'waiting');
assert.equal(generationRegions(snapshot,{activeNodeId:'image'})[0].state,'generating');
assert.equal(generationRegions(snapshot,{failedNodeId:'image'})[0].state,'failed');
assert.equal(generationRegions(snapshot)[0].aspectRatio,'16:9');
snapshot.content.pageSchema.root.children[0].assetId='asset';
snapshot.content.pageContext.assets.asset={url:'/actual.png'};
assert.equal(generationRegions(snapshot)[0].state,'loading'); // Browser decode still required.
assert.equal(generationRegions(snapshot,{failedNodeId:'image'})[0].state,'loading'); // Durable completion wins.
const original=JSON.stringify(snapshot);generationRegions(snapshot);assert.equal(JSON.stringify(snapshot),original);
snapshot.content.pageContext.assets.asset.url='javascript:alert(1)';snapshot.content.pageSchema.mediaRequests=[];
assert.equal(generationRegions(snapshot)[0].state,'failed');
console.log('Live generation regions: approval, actual job, failure, completed binding, ratio and immutable safe input passed');
