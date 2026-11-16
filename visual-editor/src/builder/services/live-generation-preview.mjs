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

const previewCss=`
[data-live-background],[data-live-background] [data-ps-type="container"],[data-live-background] [data-ps-type="card"],[data-live-background] [data-ps-type="button"],[data-live-background] input{background-color:#f3f4f6!important;background-image:none!important}
[data-live-background] [data-ps-type="text"],[data-live-background] [data-ps-type="button"],[data-live-background] [data-ps-type="icon"],[data-live-background] input{color:#374151!important;text-shadow:none!important}
[data-live-background] [data-ps-overlay]{visibility:hidden!important}
[data-live-background-image][data-live-reveal]{animation-name:live-preview-background}
@keyframes live-preview-background{from{filter:blur(2px)}to{filter:blur(0)}}

[data-live-state="waiting"],[data-live-state="generating"],[data-live-state="failed"]{background:#e5e7eb!important;color:#374151!important;font-size:0!important;overflow:hidden}
[data-live-state="waiting"]::after,[data-live-state="generating"]::after,[data-live-state="failed"]::after{content:attr(data-live-label);font:14px/1.5 sans-serif;display:block;text-align:center;padding:12px;color:#374151}
[data-live-state="generating"]{background-image:linear-gradient(100deg,transparent 20%,#fff8 50%,transparent 80%)!important;background-size:240% 100%!important;animation:live-preview-shimmer 1.8s linear infinite}
img[data-live-state="loading"]{opacity:.25}
[data-live-reveal]{animation:live-preview-reveal 320ms ease-out both}
@keyframes live-preview-shimmer{from{background-position:100% 0}to{background-position:0 0}}
@keyframes live-preview-reveal{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){[data-live-state],[data-live-reveal]{animation:none!important}}
`;
const attributes=['data-live-state','data-live-label','data-live-reveal','data-live-background-image'];
const labels={waiting:'이미지 생성 대기',generating:'이미지 생성 중',loading:'이미지 불러오는 중',failed:'이미지를 준비하지 못했습니다'};

// Builder-only decoration. Never serialize these attributes/styles into PageSchema.
export function createLiveGenerationPreview({getDocument,getSnapshot,getActivity=()=>({}),getIdentity=()=>''}) {
  let doc,root,observer,style,frame=0,disposed=false,paused=false,attempts=0,identity=getIdentity();
  const backgrounds=new Set(),decorated=new Set(),records=new Map(),eligible=new Set(),revealed=new Set();
  const schedule=()=>{if(!frame&&!disposed&&!paused)frame=requestAnimationFrame(()=>{frame=0;refresh();});};
  function clearBackgrounds(){for(const element of backgrounds)element.removeAttribute('data-live-background');backgrounds.clear();}
  function paintBackground(element){const parent=element.parentElement;if(parent){parent.setAttribute('data-live-background','');backgrounds.add(parent);}}
  function clearPaint(){clearBackgrounds();for(const element of decorated)for(const attribute of attributes)element.removeAttribute(attribute);decorated.clear();style?.remove();style=null;}
  function disconnect(){observer?.disconnect();if(doc){doc.removeEventListener('load',schedule,true);doc.removeEventListener('error',schedule,true);}clearPaint();}
  function paint(element,state){element.setAttribute('data-live-state',state);element.setAttribute('data-live-label',labels[state]||'');decorated.add(element);}
  function refresh(){
    if(disposed||paused)return;
    const nextIdentity=getIdentity();
    if(nextIdentity!==identity){disconnect();doc=null;root=null;records.clear();eligible.clear();revealed.clear();identity=nextIdentity;}
    const current=getDocument(),boundary=current?.querySelector('[data-output-boundary]');
    if(!boundary){if(++attempts<90)schedule();return;}
    attempts=0;
    if(current!==doc||boundary!==root){disconnect();doc=current;root=boundary;observer=new MutationObserver(schedule);observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});doc.addEventListener('load',schedule,true);doc.addEventListener('error',schedule,true);}
    const snapshot=getSnapshot(),regions=generationRegions(snapshot,getActivity());
    if(!regions.length){clearPaint();return;}
    if(!style){style=doc.createElement('style');style.dataset.livePreviewStyle='';style.textContent=previewCss;doc.head.append(style);}
    const elements=new Map([...root.querySelectorAll('[data-ps-node]')].map(el=>[el.dataset.psNode,el]));
    clearBackgrounds();
    const active=new Set(regions.map(region=>elements.get(region.nodeId)));
    for(const element of decorated)if(!active.has(element)){for(const attribute of attributes)element.removeAttribute(attribute);decorated.delete(element);}
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
  }
  return {
    refresh,
    pause(){paused=true;if(frame)cancelAnimationFrame(frame);frame=0;clearPaint();},
    resume(){paused=false;schedule();},
    dispose(){disposed=true;if(frame)cancelAnimationFrame(frame);disconnect();records.clear();eligible.clear();revealed.clear();},
  };
}
