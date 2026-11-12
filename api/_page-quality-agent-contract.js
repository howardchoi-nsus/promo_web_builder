const Ajv=require('ajv/dist/2020').default;
const {walk,baseSchema,assertValid}=require('../shared/page-schema/contract.cjs');
const {pageGenerationStyleRoles,pageStyleToken}=require('../shared/token-usage-policy.cjs');
const {inputHash}=require('./_page-schema-generation-jobs');
function reviewFingerprint(snapshot){return inputHash({page:snapshot.content.pageSchema,context:snapshot.content.pageContext});}
function isCurrentReview(snapshot){return Boolean(snapshot?.generationMeta?.qualityAgentReview?.targetFingerprint===reviewFingerprint(snapshot));}
function reviewSchema(page,context){
 const nodeIds=[];walk(page.root,({node})=>nodeIds.push(node.id));
 const roles=pageGenerationStyleRoles(context).filter(role=>context.tokenValues[pageStyleToken(context,role)]).map(role=>role.key);
 const spacing=require('../shared/layout-token-policy.cjs').assertLayoutTokens(context).spacing;
 const nullable=spec=>({anyOf:[spec,{type:'null'}]});
 const properties={nodeId:{type:'string',enum:nodeIds},viewport:{type:'string',enum:['desktop','tablet','mobile']},kind:{type:'string',enum:['styles','spacing','layout','imagePresentation','overlay']},roles:nullable({type:'array',items:{type:'string',enum:roles.length?roles:['__unavailable__']},maxItems:20}),spacing:nullable({type:'object',additionalProperties:false,properties:Object.fromEntries(['gap','padding','margin'].map(key=>[key,nullable({type:'string',enum:spacing.length?spacing:['__unavailable__']})])),required:['gap','padding','margin']}),layout:nullable(JSON.parse(JSON.stringify(baseSchema.$defs.layout))),presentation:nullable({type:'string',enum:['content','background']}),overlayRole:nullable({type:'string',enum:roles.length?roles:['__unavailable__']}),reason:{type:'string',minLength:1,maxLength:500}};
 return {type:'object',additionalProperties:false,properties:{summary:{type:'string',maxLength:1000},issues:{type:'array',maxItems:24,items:{type:'object',additionalProperties:false,properties:{nodeId:{type:'string',enum:nodeIds},category:{type:'string',enum:['hierarchy','spacing','density','alignment','responsive','image-composition','content-advisory']},severity:{type:'string',enum:['blocking','warning']},message:{type:'string',minLength:1,maxLength:500},resolvedByPatch:{type:'boolean'}},required:['nodeId','category','severity','message','resolvedByPatch']}},patches:{type:'array',maxItems:32,items:{type:'object',additionalProperties:false,properties,required:Object.keys(properties)}}},required:['summary','issues','patches']};
}
function applyReview(page,context,result){
 const validate=new Ajv({allErrors:true,strict:false}).compile(reviewSchema(page,context));
 if(!validate(result))throw Object.assign(new Error('AI 품질 검토 응답이 허용된 수정 계약과 맞지 않습니다.'),{code:'QUALITY_AGENT_RESULT_INVALID',statusCode:422,errors:validate.errors});
 const candidate=JSON.parse(JSON.stringify(page)),entries=new Map(),changedIds=new Set(),seen=new Set();
 walk(candidate.root,entry=>entries.set(entry.node.id,entry));
 for(const patch of result.patches){
  const entry=entries.get(patch.nodeId),node=entry.node,key=`${patch.nodeId}:${patch.viewport}:${patch.kind}`;
  if(seen.has(key))throw Object.assign(new Error('동일 속성의 중복 보정은 허용하지 않습니다.'),{code:'QUALITY_AGENT_PATCH_INVALID',statusCode:422});seen.add(key);
  const field={styles:'roles',spacing:'spacing',layout:'layout',imagePresentation:'presentation',overlay:'overlayRole'}[patch.kind];
  if(['roles','spacing','layout','presentation','overlayRole'].some(key=>key!==field&&patch[key]!==null))throw Object.assign(new Error('보정 종류와 무관한 속성은 null이어야 합니다.'),{code:'QUALITY_AGENT_PATCH_INVALID',statusCode:422});
  const before=JSON.stringify(node);
  const property=patch.viewport==='desktop'?'base':patch.viewport;
  if(patch.kind==='styles'&&patch.roles!==null)node.styles[property]=patch.roles;
  else if(patch.kind==='spacing'&&patch.spacing!==null){node.styles.spacing||={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};node.styles.spacing[property]=patch.spacing;}
  else if(patch.kind==='layout'&&patch.layout!==null)node.layout[patch.viewport]=patch.layout;
  else if(patch.kind==='imagePresentation'&&node.type==='image'&&patch.presentation!==null){node.presentation=patch.presentation;if(patch.presentation==='content'&&entry.parent?.type==='container'&&!entry.parent.children.some(child=>child.type==='image'&&child.presentation==='background'))entry.parent.overlayRole=null;}
  else if(patch.kind==='overlay'&&node.type==='container')node.overlayRole=patch.overlayRole;
  else throw Object.assign(new Error('대상 노드에 허용되지 않는 AI 보정입니다.'),{code:'QUALITY_AGENT_PATCH_INVALID',statusCode:422});
  if(before!==JSON.stringify(node))changedIds.add(node.id);
 }
 assertValid(candidate,context);
 const issues=result.issues.map(issue=>{
  let related=changedIds.has(issue.nodeId),parent=entries.get(issue.nodeId)?.parent;
  while(!related&&parent){related=changedIds.has(parent.id);parent=entries.get(parent.id)?.parent;}
  if(!related)for(const id of changedIds){let ancestor=entries.get(id)?.parent;while(ancestor){if(ancestor.id===issue.nodeId){related=true;break;}ancestor=entries.get(ancestor.id)?.parent;}if(related)break;}
  return {...issue,severity:issue.category==='content-advisory'?'warning':issue.severity,resolvedByPatch:issue.resolvedByPatch&&related};
 });
 return {page:candidate,changed:changedIds.size>0,summary:result.summary,issues,blockingCount:issues.filter(issue=>issue.severity==='blocking'&&!issue.resolvedByPatch).length,patches:result.patches};
}
function sanitizedReport(report={}){
 report=report&&typeof report==='object'&&!Array.isArray(report)?report:{};
 const diagnostics=(Array.isArray(report.diagnostics)?report.diagnostics:[]).slice(0,100).map(d=>({code:String(d.code||'').slice(0,100),path:String(d.path||'').slice(0,80),viewport:['desktop','tablet','mobile'].includes(d.viewport)?d.viewport:null,level:d.level==='warning'?'warning':'blocking',message:String(d.message||'').slice(0,500),fontSize:Number.isFinite(d.fontSize)?d.fontSize:null,ratio:Number.isFinite(d.ratio)?d.ratio:null}));
 const metrics=(Array.isArray(report.metrics)?report.metrics:[]).slice(0,600).map(m=>({nodeId:String(m.nodeId||'').slice(0,80),viewport:['desktop','tablet','mobile'].includes(m.viewport)?m.viewport:null,width:Math.max(0,Math.min(100000,Number(m.width)||0)),height:Math.max(0,Math.min(100000,Number(m.height)||0))}));
 return {diagnostics,metrics};
}
module.exports={reviewFingerprint,isCurrentReview,reviewSchema,applyReview,sanitizedReport};
