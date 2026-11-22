import {createWorkFeedback} from './work-feedback.mjs';
import {designNodeStates} from '../../../../shared/page-schema/section-design.mjs';
import {nodes,safeUrl} from '../../../../shared/page-schema/runtime.mjs';

export function generationRegions(snapshot, activity = {}) {
  if (snapshot?.generationMeta?.review?.state !== 'approved') return [];
  const page=snapshot.content?.pageSchema, context=snapshot.content?.pageContext;
  if (!page || !context) return [];
  return nodes(page).filter(node=>node.type==='image'||node.type==='icon'&&context.icons?.[node.iconId]?.url).map(node=>{
    const asset=node.type==='icon'?context.icons[node.iconId]:context.assets?.[node.assetId];
    const url=safeUrl(asset?.url),request=page.mediaRequests?.find(item=>item.nodeId===node.id);
    const state=url?'loading':activity.failedNodeId===node.id?'failed':request?(activity.activeNodeId===node.id?'generating':'waiting'):'failed';
    return {nodeId:node.id,background:node.presentation==='background',key:JSON.stringify([node.id,node.assetId||node.iconId||null,url]),url,state,aspectRatio:node.aspectRatio==='auto'?request?.aspectRatio:node.aspectRatio};
  });
}

// Bounded, preview-only replay guard survives an iframe/controller remount.
const maskHistory=new Map();
const previewCss=`
[data-ps-scope] [data-ps-node][data-live-skeleton]{min-block-size:3lh;background-color:#f3f4f6!important}
[data-live-skeleton]::before{content:attr(data-live-skeleton-label);display:block;color:#64748b;font:12px/1.5 sans-serif;padding:10px}
[data-ps-scope] [data-ps-node][data-live-skeleton-active]{outline:2px solid #647bdf!important;outline-offset:-2px}

[data-live-design-state="waiting"],[data-live-design-state="generating"],[data-live-design-state="failed"]{background-color:#f3f4f6!important;background-image:none!important;color:#4b5563!important;border-color:#cbd5e1!important;box-shadow:none!important;text-shadow:none!important}
[data-live-design-target]{outline:2px solid #647bdf;outline-offset:-2px}
[data-live-design-state="waiting"]>[data-ps-overlay],[data-live-design-state="generating"]>[data-ps-overlay],[data-live-design-state="failed"]>[data-ps-overlay]{visibility:hidden!important}
[data-live-design-reveal]{animation:live-preview-reveal 320ms ease-out both}

[data-live-background],[data-live-background] [data-ps-type="container"],[data-live-background] [data-ps-type="card"],[data-live-background] [data-ps-type="button"],[data-live-background] input{background-color:#f3f4f6!important;background-image:none!important}
[data-live-background] [data-ps-type="text"],[data-live-background] [data-ps-type="button"],[data-live-background] [data-ps-type="icon"],[data-live-background] input{color:#374151!important;text-shadow:none!important}
[data-live-background] [data-ps-overlay]{visibility:hidden!important}
[data-live-background-image][data-live-reveal]{animation:live-preview-reveal 350ms ease-out both}
@keyframes live-preview-background{from{filter:blur(2px)}to{filter:blur(0)}}

[data-live-state="waiting"],[data-live-state="generating"],[data-live-state="failed"]{background:#e5e7eb!important;color:#374151!important;font-size:0!important;overflow:hidden}
[data-live-state="waiting"]::after,[data-live-state="generating"]::after,[data-live-state="failed"]::after{content:attr(data-live-label);font:14px/1.5 sans-serif;display:block;text-align:center;padding:12px;color:#374151}
[data-live-state="generating"]{background-image:linear-gradient(100deg,transparent 20%,#fff8 50%,transparent 80%)!important;background-size:240% 100%!important;animation:live-preview-shimmer 1.8s linear infinite}
img[data-live-state="loading"]{opacity:.25}
[data-live-reveal]{animation:live-preview-reveal 350ms ease-out both}
[data-ps-scope] [data-ps-node][data-live-wireframe-entry]{animation:live-preview-reveal 250ms ease-out both!important}
[data-ps-scope] [data-ps-node][data-live-text-mask]{animation:none!important;transition:none!important}
[data-live-effects-paused] [data-live-reveal],[data-live-effects-paused] [data-live-design-reveal],[data-live-effects-paused] [data-live-wireframe-entry]{animation:none!important}
@keyframes live-preview-shimmer{from{background-position:100% 0}to{background-position:0 0}}
@keyframes live-preview-reveal{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){[data-live-state],[data-live-reveal],[data-live-design-reveal],[data-ps-scope] [data-ps-node][data-live-wireframe-entry]{animation:none!important}}
`;
const attributes=['data-live-skeleton','data-live-skeleton-label','data-live-skeleton-active','data-live-draft-pending','data-live-wireframe-entry','data-live-state','data-live-label','data-live-reveal','data-live-background-image','data-live-design-state','data-live-design-reveal','data-live-design-target'];
const labels={waiting:'이미지 생성 대기',generating:'이미지 생성 중',loading:'이미지 불러오는 중',failed:'이미지를 준비하지 못했습니다'};

// Builder-only decoration. Never serialize these attributes/styles into PageSchema.
export function createLiveGenerationPreview({getDocument,getSnapshot,getActivity=()=>({}),getIdentity=()=>''}) {
  const wireSeen=new Map();
  const designEligible=new Set(),designRevealed=new Set();
  let feedback,wireInitialized=false;const localMaskHistory=new Set();
  let doc,root,observer,style,frame=0,disposed=false,paused=false,attempts=0,identity=getIdentity();
  const backgrounds=new Set(),decorated=new Set(),records=new Map(),eligible=new Set(),revealed=new Set();
  const schedule=()=>{if(!frame&&!disposed&&!paused)frame=requestAnimationFrame(()=>{frame=0;refresh();});};
  function clearBackgrounds(){for(const element of backgrounds)element.removeAttribute('data-live-background');backgrounds.clear();}
  function paintBackground(element){const parent=element.parentElement;if(parent){parent.setAttribute('data-live-background','');backgrounds.add(parent);}}
  function clearPaint(){root?.removeAttribute('data-live-effects-paused');feedback?.dispose();feedback=null;clearBackgrounds();for(const element of decorated)for(const attribute of attributes)element.removeAttribute(attribute);decorated.clear();style?.remove();style=null;}
  function disconnect(){observer?.disconnect();if(doc){doc.removeEventListener('load',schedule,true);doc.removeEventListener('error',schedule,true);}clearPaint();}
  function paint(element,state){element.setAttribute('data-live-state',state);element.setAttribute('data-live-label',labels[state]||'');decorated.add(element);}
  function refresh(){
    if(disposed||paused)return;
    const nextIdentity=getIdentity();
    if(nextIdentity!==identity){disconnect();doc=null;root=null;records.clear();eligible.clear();revealed.clear();designEligible.clear();designRevealed.clear();wireSeen.clear();wireInitialized=false;identity=nextIdentity;}
    const current=getDocument(),boundary=current?.querySelector('[data-output-boundary]');
    if(!boundary){if(++attempts<90)schedule();return;}
    attempts=0;
    if(current!==doc||boundary!==root){disconnect();doc=current;root=boundary;observer=new MutationObserver(schedule);observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});doc.addEventListener('load',schedule,true);doc.addEventListener('error',schedule,true);}
    const snapshot=getSnapshot(),regions=generationRegions(snapshot,getActivity()),designs=designNodeStates(snapshot,getActivity().activeDesignId,getActivity().failedDesignId);
    const draftNodes=snapshot?.generationMeta?.draftActivity?.nodeIds||[];const isWireframe=getActivity().wireframe;
    if(!regions.length&&!designs.length&&!draftNodes.length&&!isWireframe){clearPaint();return;}
    if(!style){style=doc.createElement('style');style.dataset.livePreviewStyle='';style.textContent=previewCss;doc.head.append(style);}
    const elements=new Map([...root.querySelectorAll('[data-ps-node]')].map(el=>[el.dataset.psNode,el]));
    if(!feedback)feedback=createWorkFeedback(doc);
    if(getActivity().effectsPaused)root.setAttribute('data-live-effects-paused','');else root.removeAttribute('data-live-effects-paused');
    if(isWireframe){
      const completed=snapshot?.generationMeta?.draftActivity?.completedNodeIds||[],run=snapshot?.generationMeta?.draftActivity?.runId||snapshot?.generationMeta?.draftRunId||'';
      for(const [id,el] of elements){const text=el.childElementCount?'':el.textContent,key=text||'';
        if(wireSeen.get(id)===key)continue;wireSeen.set(id,key);
        if(el.dataset.psType==='text'){
          const historyKey=JSON.stringify([identity,run,id,key]),history=identity?maskHistory:localMaskHistory;
          const justSaved=completed.some(nodeId=>elements.get(nodeId)?.contains(el));
          if(key.trim()&&(wireInitialized||justSaved)&&!history.has(historyKey)){
            if(history instanceof Map){history.set(historyKey,true);if(history.size>1000)history.delete(history.keys().next().value);}else history.add(historyKey);
            if(!getActivity().effectsPaused)feedback.revealText(el);
          }
        }else {el.setAttribute('data-live-wireframe-entry','');decorated.add(el);}
      }
      wireInitialized=true;
    }
    // The entire saved AI plan is a skeleton; only the active shell is a task.
    for(const el of decorated)if(el.hasAttribute('data-live-skeleton')){el.removeAttribute('data-live-skeleton');el.removeAttribute('data-live-skeleton-label');el.removeAttribute('data-live-skeleton-active');}
    const skeletonIds=snapshot?.generationMeta?.draftActivity?.pendingNodeIds||[];
    for(const id of skeletonIds){const el=elements.get(id);if(!el)continue;const active=draftNodes.includes(id);el.setAttribute('data-live-skeleton','');el.setAttribute('data-live-skeleton-label',`${el.getAttribute('aria-label')||'계획 영역'} · ${active?'콘텐츠 구성 중':'준비 중'}`);if(active)el.setAttribute('data-live-skeleton-active','');decorated.add(el);}

    for(const el of decorated)if(el.hasAttribute('data-live-draft-pending')){el.removeAttribute('data-live-draft-pending');el.removeAttribute('data-live-state');el.removeAttribute('data-live-label');}
    for(const id of draftNodes){const el=elements.get(id);if(el&&!skeletonIds.includes(id)&&!el.children.length&&!el.textContent){paint(el,'generating');el.setAttribute('data-live-label','콘텐츠 구성 중');el.setAttribute('data-live-draft-pending','');}}
    const completedDraftNodes=snapshot?.generationMeta?.draftActivity?.completedNodeIds||[];
    const work=[...designs,...regions,...completedDraftNodes.map(nodeId=>({nodeId,state:'ready'})),...(snapshot?.generationMeta?.draftActivity?.failedNodeIds||[]).map(nodeId=>({nodeId,state:'failed'})),...draftNodes.map(nodeId=>({nodeId,state:'generating'}))].map(r=>({el:elements.get(r.nodeId),state:r.state,label:snapshot.content.pageSchema&&elements.get(r.nodeId)?.getAttribute('aria-label')||'영역 구성 중'})).filter(r=>r.el);
    clearBackgrounds();
    const active=new Set([...(isWireframe?[...elements.keys()].map(nodeId=>({nodeId})):[]),...regions,...designs].map(region=>elements.get(region.nodeId)));
    for(const element of decorated)if(!active.has(element)){for(const attribute of attributes)element.removeAttribute(attribute);decorated.delete(element);}
    for(const region of designs){
      const element=elements.get(region.nodeId);if(!element)continue;
      element.setAttribute('data-live-design-state',region.state);decorated.add(element);
      if(region.state==='generating'&&region.nodeId===region.groupId)element.setAttribute('data-live-design-target','');else element.removeAttribute('data-live-design-target');
      const key=JSON.stringify([snapshot.generationMeta.sectionDesign.id,region.nodeId]);
      if(region.state!=='ready')designEligible.add(key);
      else if(designEligible.has(key)&&!designRevealed.has(key)){designRevealed.add(key);element.setAttribute('data-live-design-reveal','');}
    }
    for(const region of regions){
      const element=elements.get(region.nodeId);if(!element)continue;
      if(!region.url){eligible.add(region.nodeId);paint(element,region.state);if(region.background)paintBackground(element);continue;}
      if(element.tagName!=='IMG')continue;
      element.loading='eager';
      let record=records.get(region.key);
      if(!record||record.element!==element){
        record={element,state:'loading'};records.set(region.key,record);
        const settle=async()=>{
          if(!element.complete)return;
          if(!element.naturalWidth){record.state='failed';schedule();return;}
          try{await element.decode?.();record.state='ready';}catch{record.state='failed';}
          schedule();
        };
        record.settle=settle;
        if(element.complete)settle();
      } else if(record.state==='loading'&&element.complete)record.settle();
      paint(element,record.state);
      if(region.background){element.setAttribute('data-live-background-image','');if(record.state!=='ready')paintBackground(element);}
      if(record.state==='ready'&&eligible.has(region.nodeId)&&!revealed.has(region.key)){
        revealed.add(region.key);element.setAttribute('data-live-reveal','');
      }
    }
    feedback.update([...new Map(work.map(w=>[w.el,{...w,state:w.el.getAttribute('data-live-state')||w.state}])).values()],{...getActivity(),operation:snapshot.generationMeta?.operation,revisionKey:snapshot.documentRevision||snapshot.generationMeta?.requestId||''});
  }
  return {
    refresh,
    pause(){paused=true;if(frame)cancelAnimationFrame(frame);frame=0;clearPaint();},
    resume(){
      // Inspection displayed the real result without effects. Never hide it again
      // when ready results arrived during the inspection pause.
      const snapshot=getSnapshot(),elements=new Map([...(getDocument()?.querySelectorAll('[data-ps-node]')||[])].map(el=>[el.dataset.psNode,el]));
      for(const region of generationRegions(snapshot,getActivity())){const element=elements.get(region.nodeId);if(region.url&&element?.tagName==='IMG'&&element.complete&&element.naturalWidth)revealed.add(region.key);}
      for(const region of designNodeStates(snapshot,getActivity().activeDesignId,getActivity().failedDesignId))if(region.state==='ready')designRevealed.add(JSON.stringify([snapshot.generationMeta.sectionDesign.id,region.nodeId]));
      if(getActivity().wireframe){
        const run=snapshot?.generationMeta?.draftActivity?.runId||snapshot?.generationMeta?.draftRunId||'';
        for(const [id,el] of elements){const key=el.childElementCount?'':el.textContent||'';wireSeen.set(id,key);if(el.dataset.psType==='text'){const historyKey=JSON.stringify([identity,run,id,key]);if(identity){maskHistory.set(historyKey,true);if(maskHistory.size>1000)maskHistory.delete(maskHistory.keys().next().value);}else localMaskHistory.add(historyKey);}}
        wireInitialized=true;
      }
      paused=false;schedule();
    },
    dispose(){disposed=true;if(frame)cancelAnimationFrame(frame);disconnect();records.clear();eligible.clear();revealed.clear();},
  };
}
