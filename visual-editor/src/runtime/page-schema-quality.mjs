import {parseColor,composite,contrast,gradientColor} from '../../../shared/page-schema/quality-colors.mjs';
import {effectiveLayout} from '../../../shared/page-schema/runtime.mjs';
function intersection(a,b){return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));}
// Inspect the rendered page, not the scaled outer preview. Image sampling is
// conservative; unreadable cross-origin pixels never become a false pass.
export function inspectPageReadability(host,page,viewport='desktop'){
 const diagnostics=[],byId=new Map();
 const collect=n=>{byId.set(n.id,n);for(const child of n.children||[])collect(child);};collect(page.root);
 const elements=[...host.querySelectorAll('[data-ps-node]')],byElementId=new Map(elements.map(el=>[el.dataset.psNode,el]));
 const win=host.ownerDocument.defaultView;
 for(const el of elements){
  const node=byId.get(el.dataset.psNode);if(!node)continue;
  if(node.type==='button'&&!node.actionId)diagnostics.push({code:'ACTION_NOT_CONFIGURED',level:'warning',path:node.id,message:'이동 경로가 미정인 CTA는 클릭 동작 없이 문구로 표시합니다.'});
  if(node.type!=='text'&&node.type!=='button')continue;
  const style=win.getComputedStyle(el),rect=el.getBoundingClientRect(),foreground=parseColor(style.color),fontSize=parseFloat(style.fontSize);
  if(!foreground||!rect.width||!rect.height)continue;
  let multiColumn=false;for(let ancestor=el.parentElement;ancestor&&ancestor!==host;ancestor=ancestor.parentElement){const parent=byId.get(ancestor.dataset?.psNode);if(!parent)continue;const layout=effectiveLayout(parent,viewport);if((parent.type==='grid'&&layout.columns?.length>1)||(['stack','container','card'].includes(parent.type)&&layout.direction==='row'&&(parent.children?.length||0)>1)){multiColumn=true;break;}}
  if(multiColumn&&node.type==='text'&&el.textContent.length>40&&rect.width/fontSize<12)diagnostics.push({code:'CONTENT_NARROW',level:'blocking',path:node.id,fontSize,message:'긴 문구가 지나치게 좁은 컬럼에 배치됐습니다.'});
  let current=el,layers=[],backgroundImage=null,imageEl=null;
  while(current&&current!==host){
   const currentStyle=win.getComputedStyle(current),paint=parseColor(currentStyle.backgroundColor);layers.push({paint,element:current,gradient:currentStyle.backgroundImage});
   const currentNode=byId.get(current.dataset?.psNode);
   const image=currentNode?.children?.find(child=>child.type==='image'&&child.presentation==='background');
   if(image){backgroundImage=image;imageEl=byElementId.get(image.id);break;}
   if(paint?.[3]===1)break;
   current=current.parentElement;
  }
  let samples=[],unknown=false;
  if(backgroundImage&&imageEl?.tagName==='IMG'&&imageEl.complete&&imageEl.naturalWidth){
   try{
    const imageRect=imageEl.getBoundingClientRect(),canvas=host.ownerDocument.createElement('canvas');canvas.width=5;canvas.height=5;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const fit=backgroundImage.fit,scale=(fit==='contain'?Math.min:Math.max)(imageRect.width/imageEl.naturalWidth,imageRect.height/imageEl.naturalHeight),w=imageEl.naturalWidth*scale,h=imageEl.naturalHeight*scale;
    const overlay=[...current.children].find(child=>child.hasAttribute('data-ps-overlay'));
    const overlayValue=overlay?win.getComputedStyle(overlay).backgroundImage:null;
    for(let iy=0;iy<5;iy++)for(let ix=0;ix<5;ix++){
     const px=rect.left+(ix+.5)/5*rect.width,py=rect.top+(iy+.5)/5*rect.height;
     const sx=(px-imageRect.left-(imageRect.width-w)/2)/scale,sy=(py-imageRect.top-(imageRect.height-h)/2)/scale;
     let color=layers.at(-1)?.paint;
     if(sx>=0&&sy>=0&&sx<imageEl.naturalWidth&&sy<imageEl.naturalHeight){ctx.clearRect(0,0,1,1);ctx.drawImage(imageEl,Math.floor(sx),Math.floor(sy),1,1,0,0,1,1);const pixel=ctx.getImageData(0,0,1,1).data;color=composite([pixel[0],pixel[1],pixel[2],pixel[3]/255],color);}
     if(overlayValue&&overlayValue!=='none'){const gradient=gradientColor(overlayValue,(px-imageRect.left)/imageRect.width,(py-imageRect.top)/imageRect.height);if(!gradient)unknown=true;else color=composite(gradient,color);}
     for(const layer of layers.slice(0,-1).reverse())color=composite(layer.paint,color);
     if(color?.[3]===1)samples.push(color);
    }
   }catch{unknown=true;}
  }else if(backgroundImage)unknown=true;
  else{
   for(const position of [0.1,0.5,0.9]){
    let color=null;
    for(const layer of [...layers].reverse()){
     color=composite(layer.paint,color);
     if(layer.gradient&&layer.gradient!=='none'){
      const bounds=layer.element.getBoundingClientRect(),x=(rect.left+position*rect.width-bounds.left)/(bounds.width||1),y=(rect.top+position*rect.height-bounds.top)/(bounds.height||1),gradient=gradientColor(layer.gradient,x,y);
      if(gradient)color=composite(gradient,color);else unknown=true;
     }
    }
    if(color?.[3]===1)samples.push(color);else unknown=true;
   }
  }
  const threshold=fontSize>=24||(fontSize>=18.66&&Number(style.fontWeight)>=700)?3:4.5;
  const ratio=samples.length?Math.min(...samples.map(color=>contrast(foreground,color))):0;
  if(unknown||!samples.length||ratio<threshold)diagnostics.push({code:backgroundImage?'IMAGE_TEXT_CONTRAST':'TEXT_CONTRAST',level:'blocking',path:node.id,imageNodeId:backgroundImage?.id,samples:samples.map(c=>c.map(n=>Math.round(n*1000)/1000)),threshold,fontSize,ratio:Math.round(ratio*100)/100,message:backgroundImage?'이미지 위 문구의 가독성을 확보하지 못했습니다. 등록 색상 보정 또는 이미지 분리 배치가 필요합니다.':'등록된 글자색과 배경색의 명암 대비가 부족하거나 확인되지 않았습니다.'});
 }
 for(const parent of elements){
  const siblings=[...parent.children].filter(el=>el.hasAttribute('data-ps-node')&&byId.get(el.dataset.psNode)?.presentation!=='background');
  for(let i=0;i<siblings.length;i++)for(let j=i+1;j<siblings.length;j++){
   const a=siblings[i].getBoundingClientRect(),b=siblings[j].getBoundingClientRect();
   if(a.width&&a.height&&b.width&&b.height&&intersection(a,b)>4)diagnostics.push({code:'CONTENT_OVERLAP',level:'blocking',path:siblings[j].dataset.psNode,message:'같은 영역의 콘텐츠가 겹칩니다.'});
  }
  const parentNode=byId.get(parent.dataset.psNode),background=parentNode?.children?.find(child=>child.presentation==='background');
  if(background){const image=byElementId.get(background.id),r=image?.getBoundingClientRect();if(!r?.width||!r.height)continue;
   const covers=siblings.filter(el=>parseColor(win.getComputedStyle(el).backgroundColor)?.[3]===1).map(el=>intersection(r,el.getBoundingClientRect())).reduce((sum,area)=>sum+area,0)/(r.width*r.height);
   if(covers>.7)diagnostics.push({code:'IMAGE_OCCLUDED',level:'blocking',path:background.id,imageNodeId:background.id,message:'불투명 콘텐츠가 배경 이미지 대부분을 가립니다. 이미지와 콘텐츠를 분리 배치해야 합니다.'});
  }
 }
 return diagnostics;
}
