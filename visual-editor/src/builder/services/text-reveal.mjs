// Geometry only: never split, replace or rewrite the saved text DOM.
export const TEXT_REVEAL_MS=360;
function textMeasure(element){
 const doc=element.ownerDocument,view=doc.defaultView,walker=doc.createTreeWalker(element,view.NodeFilter.SHOW_TEXT),parts=[];let node,total=0;
 while((node=walker.nextNode())){parts.push({node,start:total,end:total+node.length});total+=node.length;}
 const text=parts.map(p=>p.node.data).join('');if(!text.trim())return null;
 const segments=[];if(typeof Intl.Segmenter==='function')for(const part of new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text))segments.push(part.index);else {let offset=0;for(const char of text){segments.push(offset);offset+=char.length;}}segments.push(total);
 return progress=>{if(!element.isConnected||element.textContent!==text)return null;
 const scaled=Math.max(0,Math.min(1,progress))*(segments.length-1),index=Math.min(segments.length-2,Math.floor(scaled)),fraction=progress>=1?1:scaled-index;
 const point=offset=>{const p=parts.find(p=>offset<p.end)||parts.at(-1);return [p.node,Math.max(0,Math.min(p.node.length,offset-p.start))];};
 const prefix=doc.createRange();prefix.setStart(...point(0));prefix.setEnd(...point(segments[index]));
 const current=doc.createRange();current.setStart(...point(segments[index]));current.setEnd(...point(segments[index+1]));
 const rectangles=[...prefix.getClientRects()].filter(r=>r.width>0&&r.height>0),glyph=[...current.getClientRects()].filter(r=>r.height>0).at(-1),box=element.getBoundingClientRect(),rtl=view.getComputedStyle(element).direction==='rtl';
 if(!glyph)return null;
 const edge=rtl?glyph.right-glyph.width*fraction:glyph.left+glyph.width*fraction;
 if(fraction>0)rectangles.push({left:rtl?edge:glyph.left,right:rtl?glyph.right:edge,top:glyph.top,bottom:glyph.bottom});
 const path=rectangles.map(r=>{const l=Math.max(0,r.left-box.left),t=Math.max(0,r.top-box.top),right=Math.min(box.width,r.right-box.left),bottom=Math.min(box.height,r.bottom-box.top);return `M${l},${t}H${right}V${bottom}H${l}Z`;}).join(' ');
 return {clipPath:path?`path('${path}')`:'inset(0 100% 0 0)',caret:{x:edge+view.scrollX,y:glyph.top+view.scrollY,height:glyph.bottom-glyph.top}};
 };
}
export function textGeometry(element,progress=1){return textMeasure(element)?.(progress)||null;}
export function createTextReveal(element,now){
 const prior=element.style.getPropertyValue('clip-path'),priority=element.style.getPropertyPriority('clip-path');
 const measure=textMeasure(element);element.setAttribute('data-live-text-mask','');let destroyed=false;
 return {element,startedAt:now,
  frame(time){if(destroyed)return null;const progress=Math.min(1,Math.max(0,(time-now)/TEXT_REVEAL_MS));if(progress>=1||!element.isConnected){this.destroy();return null;}const geometry=measure?.(progress);if(!geometry){this.destroy();return null;}element.style.setProperty('clip-path',geometry.clipPath,'important');return geometry.caret;},
  destroy(){if(destroyed)return;destroyed=true;element.removeAttribute('data-live-text-mask');if(prior)element.style.setProperty('clip-path',prior,priority);else element.style.removeProperty('clip-path');},
 };
}
