import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {customerProgress,customerProgressHeading,nextCustomerSequence} from '../visual-editor/src/builder/services/customer-progress.mjs';

const {PGlite}=await import(process.env.PGLITE_TEST_MODULE||'@electric-sql/pglite');
const require=createRequire(import.meta.url),db=new PGlite();
const store=require('../api/_promo-builder-chat-workspace-store');
const sql=async(strings,...values)=>(await db.query(strings.reduce((query,part,i)=>query+(i?'$'+i:'')+part,''),values)).rows;
const doc='11111111-1111-4111-8111-111111111111',owner='progress-test';
const turn='22222222-2222-4222-8222-222222222222';
let session,sequence=0;
const statusRows=messages=>customerProgress(messages).filter(row=>row.type==='status');
async function save(operationId,status,customerWork={}){
  const id=`33333333-3333-4333-8333-${String(++sequence).padStart(12,'0')}`;
  const message={id,role:'system',type:'status',operationId,status,text:'INTERNAL_PROVIDER_DIAGNOSTIC',
    createdAt:new Date(sequence*1000).toISOString(),metadata:{customerTurnId:turn,customerWork}};
  const result=await store.saveMessage(sql,{sessionId:session.id,ownerSubject:owner,message,actions:[]});
  assert.equal(result.customerTurnId,turn);
  assert.deepEqual(result.customerWork,customerWork,'Actual chat API response flattens metadata');
  return message;
}
async function restored(){return (await store.fetchSession(sql,{sessionId:session.id,ownerSubject:owner})).messages;}
try{
  await db.exec('create table promo_builder_documents(id uuid primary key,owner_subject text);create table promo_builder_composition_proposals(id uuid primary key)');
  await db.exec(readFileSync(new URL('../db/migrations/077_ai_builder_chat_workspace.sql',import.meta.url),'utf8'));
  await db.query('insert into promo_builder_documents values($1,$2)',[doc,owner]);
  session=await store.createOrLoadSession(sql,{documentId:doc,ownerSubject:owner});
  const user={id:turn,role:'user',type:'user',text:'혜택 페이지를 만들어줘',createdAt:new Date(0).toISOString()};
  await store.saveMessage(sql,{sessionId:session.id,ownerSubject:owner,message:user,actions:[]});
  await save('overview-1','in_progress');await save('overview-1','completed');
  const outline=await save('wireframe-1','in_progress',{kind:'outline'});
  const before=statusRows(await restored()),id=before[1].id;
  const detail=await save('wireframe-1','in_progress',{kind:'region',label:'혜택 안내'});
  let rows=statusRows(await restored());
  assert.equal(rows.length,2);assert.equal(rows[1].id,id);
  assert.equal(rows[1].metadata.customerProgress.detail,'혜택 안내 영역의 문구와 배치를 구성하고 있어요.');
  assert.equal(customerProgressHeading(rows[1]),'총 4단계 중 2단계 진행 중 · 페이지 구성');
  const localProjection=statusRows([user,{...outline,metadata:{...outline.metadata}},{...detail,metadata:{...detail.metadata}}]);
  assert.equal(localProjection[0].id,rows[1].id,'Nested local and actual SQL/API history have identical row identity');
  await save('wireframe-1','completed');await save('page-design-doc','in_progress',{kind:'image'});
  await save('page-design-doc','completed');await save('page-quality-doc','in_progress');
  await save('page-quality-doc-0-desktop','completed',{kind:'viewport',scope:'task',viewport:'desktop',state:'completed'});
  rows=statusRows(await restored());assert.equal(rows.length,4);assert.equal(rows[3].status,'in_progress');
  await save('page-quality-doc','failed');
  assert.equal(statusRows(await restored())[3].metadata.customerProgress.active,false);
  await save('page-quality-doc','in_progress',{kind:'check',restart:true});
  await save('page-quality-doc','completed',{kind:'quality-passed'});
  const wire=await restored();rows=statusRows(wire);
  assert.equal(rows.length,4);assert.equal(rows[3].status,'completed');
  assert.equal(rows.filter(row=>row.metadata.customerProgress.active).length,0);
  assert.equal(JSON.stringify(rows).includes('INTERNAL_PROVIDER_DIAGNOSTIC'),false);
  assert.equal(wire.length,sequence+1,'All original state events remain persisted');
  assert.deepEqual(statusRows(JSON.parse(JSON.stringify(wire))),JSON.parse(JSON.stringify(rows)));
  assert.equal(await store.fetchSession(sql,{sessionId:session.id,ownerSubject:'other-owner'}),null);
  // A long-running chat must restore its latest completion, not its oldest 500 events.
  const followTurn='44444444-4444-4444-8444-444444444444';
  await store.saveMessage(sql,{sessionId:session.id,ownerSubject:owner,actions:[],message:{id:followTurn,role:'user',type:'user',text:'다음 페이지',createdAt:new Date(1000000).toISOString()}});
  for(let i=0;i<510;i++)await store.saveMessage(sql,{sessionId:session.id,ownerSubject:owner,actions:[],message:{
    id:`55555555-5555-4555-8555-${String(i).padStart(12,'0')}`,role:'system',type:'status',operationId:'page-quality-long',
    status:i===509?'completed':'in_progress',text:'internal',createdAt:new Date(1000001+i).toISOString(),
    metadata:{customerTurnId:followTurn,customerWork:i===509?{kind:'quality-passed'}:{kind:'review'}},
  }});
  const recent=await restored();
  assert.equal(recent.length,500,'Existing response-size bound must remain');
  assert.equal(recent.at(-1).id,'55555555-5555-4555-8555-000000000509','Latest completion must survive the 500-event window');
  assert.equal(statusRows(recent).at(-1).status,'completed');
  // Random UUID tie-breaking can reverse a start and completion emitted in one ms.
  const tieTurn='77777777-7777-4777-8777-777777777777';
  await store.saveMessage(sql,{sessionId:session.id,ownerSubject:owner,actions:[],message:{id:tieTurn,role:'user',type:'user',text:'재검사',createdAt:new Date(2000000).toISOString()}});
  for(const [id,status,order,customerWork] of [
    ['99999999-9999-4999-8999-999999999999','in_progress',1,{kind:'check',restart:true}],
    ['88888888-8888-4888-8888-888888888888','completed',2,{kind:'quality-passed'}],
  ])await store.saveMessage(sql,{sessionId:session.id,ownerSubject:owner,actions:[],message:{id,role:'system',type:'status',operationId:'page-quality-tied',status,text:'internal',createdAt:new Date(2000001).toISOString(),metadata:{customerTurnId:tieTurn,customerSequence:order,customerWork}}});
  const tied=await restored();
  assert.equal(tied.at(-1).status,'in_progress','Fixture must reproduce reversed UUID ordering');
  assert.equal(statusRows(tied).at(-1).status,'completed','Equal timestamps must not reopen a completed quality stage');
  assert.equal(nextCustomerSequence(tied,tieTurn),3);
  assert.equal((await db.query('select count(*)::int as count from promo_builder_chat_messages')).rows[0].count,sequence+515,'The response window must not delete saved history');
  console.log('Customer progress PostgreSQL: actual 077/chat store, stable stage rows and raw history, task/main QA, failure/retry, latest-500 ascending window without deletion, same-ms UUID-order reversal corrected by emission order, flattened metadata and ownership passed.');
}finally{await db.close();}
