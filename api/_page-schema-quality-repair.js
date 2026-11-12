const {walk,nodeTargets,assertValid}=require('../shared/page-schema/contract.cjs');
const {pageStyleRoles,pageStyleToken,pageNodeStyleRules}=require('../shared/token-usage-policy.cjs');
const {parseColor,contrast}=require('../shared/page-schema/quality-colors.cjs');
// Server-owned bounded repairs. Client diagnostics identify a problem but never
// supply output CSS, URLs, content or arbitrary schema edits.
function repairPageQuality(source,context,diagnostics=[]){
 const page=JSON.parse(JSON.stringify(source)),entries=new Map(),actions=[],roles=pageStyleRoles(context);
 walk(page.root,entry=>entries.set(entry.node.id,entry));
 const applyRole=(node,view,property,role)=>{
  const key=view==='desktop'?'base':view;
  const previous=node.styles[key]||[];
  const next=previous.filter(key=>{const r=roles.find(r=>r.key===key);return r?.property!==property||r.state!=='default';});next.push(role.key);
  if(JSON.stringify(next)!==JSON.stringify(previous)){node.styles[key]=next;actions.push({nodeId:node.id,viewport:view,code:'REGISTERED_STYLE_REPAIRED',property,token:pageStyleToken(context,role)});}
 };
 const separateImage=id=>{const entry=entries.get(id);if(entry?.node.type!=='image'||entry.node.presentation!=='background')return;
  entry.node.presentation='content';if(entry.parent?.overlayRole)entry.parent.overlayRole=null;
  actions.push({nodeId:id,code:'IMAGE_SEPARATED',message:'완료된 이미지를 보존하고 문구와 분리 배치했습니다.'});
 };
 for(const diagnostic of Array.isArray(diagnostics)?diagnostics.slice(0,100):[]){
  if(!diagnostic||diagnostic.level==='warning')continue;
  const entry=entries.get(diagnostic.path||diagnostic.nodeId);if(!entry)continue;
  const {node}=entry,view=['desktop','tablet','mobile'].includes(diagnostic.viewport)?diagnostic.viewport:'desktop';
  const candidates=property=>roles.filter(role=>nodeTargets(node).includes(role.target)&&role.property===property&&role.state==='default'&&context.tokenValues?.[pageStyleToken(context,role)]);
  if(['TEXT_CONTRAST','IMAGE_TEXT_CONTRAST'].includes(diagnostic.code)&&['text','button'].includes(node.type)){
   const samples=Array.isArray(diagnostic.samples)?diagnostic.samples.slice(0,25).filter(c=>Array.isArray(c)&&c.length===4&&c.every(Number.isFinite)&&c.slice(0,3).every(n=>n>=0&&n<=255)&&c[3]===1):[];
   const fontSize=Math.max(0,Math.min(300,Number(diagnostic.fontSize)||0));
   // Diagnostics can request a stricter check, never weaken the normal threshold.
   const minimum=fontSize>=24?3:4.5;
   const ranked=candidates('color').map(role=>{const color=parseColor(context.tokenValues[pageStyleToken(context,role)]);return {role,score:color&&samples.length?Math.min(...samples.map(bg=>contrast(color,bg))):0};}).sort((a,b)=>b.score-a.score);
   if(ranked[0]?.score>=minimum)applyRole(node,view,'color',ranked[0].role);
   else if(diagnostic.code==='IMAGE_TEXT_CONTRAST'){
    const imageEntry=entries.get(diagnostic.imageNodeId);let ancestor=entry.parent;let related=false;
    while(ancestor){if(imageEntry?.parent?.id===ancestor.id){related=true;break;}ancestor=entries.get(ancestor.id)?.parent;}
    if(related)separateImage(diagnostic.imageNodeId);
   }
  }
  if(diagnostic.code==='IMAGE_OCCLUDED'&&node.type==='image')separateImage(node.id);
  if(diagnostic.code==='STYLE_TOKEN_REQUIRED'){
   const available=pageNodeStyleRules(node,view,context,nodeTargets(node),roles);
   const missing=['border-color','border-width','border-style'].some(property=>!available.some(role=>role.property===property));
   if(missing&&node.type==='divider'&&entry.parent){entry.parent.children=entry.parent.children.filter(child=>child.id!==node.id);actions.push({nodeId:node.id,code:'UNSUPPORTED_DIVIDER_REMOVED',message:'등록된 보더 속성이 부족한 장식 구분선을 제거했습니다.'});}
   else if(missing){
    const before=JSON.stringify(node.styles);
    for(const key of ['base','tablet','mobile'])if(node.styles[key])node.styles[key]=node.styles[key].filter(key=>!['border-color','border-width','border-style'].includes(roles.find(role=>role.key===key)?.property));
    if(before!==JSON.stringify(node.styles))actions.push({nodeId:node.id,code:'UNSUPPORTED_BORDER_REMOVED',message:'등록 매핑이 불완전한 선택 보더를 제거하고 콘텐츠를 보존했습니다.'});
   }
  }
  if(diagnostic.code==='TEXT_CLIPPING_OR_LINE_HEIGHT'&&node.type==='text'){
   const current=pageNodeStyleRules(node,view,context,nodeTargets(node),roles);
   const sizeToken=current.find(role=>role.property==='font-size')?.token,sizeValue=context.tokenValues[sizeToken];
   const size=Number(diagnostic.fontSize)||parseFloat(sizeValue);
   const options=candidates('line-height').map(role=>{const value=context.tokenValues[pageStyleToken(context,role)];const px=/^[\d.]+$/.test(value)?Number(value)*size:/px$/.test(value)?parseFloat(value):null;return {role,px};}).filter(item=>item.px>=size*1.2).sort((a,b)=>a.px-b.px);
   if(options.length)applyRole(node,view,'line-height',options[0].role);
  }
  if(['CONTENT_NARROW','CONTENT_OVERFLOW','CONTENT_OVERLAP'].includes(diagnostic.code)){
   let target=node;
   while(target&&!['grid','stack','container','card'].includes(target.type))target=entries.get(target.id)?.parent;
   while(target&&target.type!=='grid'&&target.layout?.desktop?.direction!=='row'&&target.layout?.desktop?.width==='fill')target=entries.get(target.id)?.parent;
   if(target){
    const before=JSON.stringify(target.layout),layout={...target.layout.desktop,...Object.fromEntries(Object.entries(target.layout[view]||{}).filter(([,value])=>value!==null)),width:'fill'};
    if(target.type==='grid'){layout.columns=[1];for(const child of target.children){child.layout[view]={...child.layout.desktop,...child.layout[view],columnSpan:1};}}
    else layout.direction='column';
    target.layout[view]=layout;
    if(JSON.stringify(target.layout)!==before)actions.push({nodeId:target.id,viewport:view,code:'FLOW_REPAIRED',message:'좁거나 겹친 배치를 단일 흐름으로 보정했습니다.'});
   }
  }
 }
 assertValid(page,context);
 return {page,changed:JSON.stringify(source)!==JSON.stringify(page),actions};
}
module.exports={repairPageQuality};
