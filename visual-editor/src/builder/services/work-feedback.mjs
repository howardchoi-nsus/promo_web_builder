import {createTextReveal,textGeometry} from './text-reveal.mjs';
// Preview-only layer; never part of the saved PageSchema or exported page.
export function createWorkFeedback(doc){
 const host=doc.createElement('div');host.dataset.workFeedback='';host.setAttribute('aria-hidden','true');host.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:10000;overflow:hidden';
 const css=doc.createElement('style');css.dataset.workFeedbackStyle='';css.textContent=`[data-work-feedback] .work-cursor{position:absolute;left:0;top:0;opacity:.5;font:10px/1.4 sans-serif;will-change:transform}[data-work-feedback] .work-cursor b{background:var(--work-color);color:white;padding:3px 5px;white-space:nowrap;border-radius:3px}[data-work-feedback] .work-box{position:absolute;border:1px solid var(--work-color);opacity:.5;box-sizing:border-box}[data-work-feedback] .work-box i{position:absolute;width:6px;height:6px;border:1px solid var(--work-color);background:white}[data-work-feedback] .work-box i:nth-child(1){left:-3px;top:-3px}[data-work-feedback] .work-box i:nth-child(2){right:-3px;top:-3px}[data-work-feedback] .work-box i:nth-child(3){left:-3px;bottom:-3px}[data-work-feedback] .work-box i:nth-child(4){right:-3px;bottom:-3px}[data-work-feedback] .work-caret{position:absolute;width:1px;background:var(--work-color);pointer-events:none}`;
 const colors=['#246bce','#9a4fc4','#c4692f','#298367','#c24c77','#597bb5','#aa8135','#467e96','#895b93','#538342','#bf6656','#6669ae'];
 const summary=doc.createElement('div');summary.style.cssText='position:fixed;top:8px;right:8px;background:#25354b;color:white;padding:4px 7px;border-radius:4px;font:10px/1.4 sans-serif;opacity:.5';host.append(summary);
 const workers=colors.map((color,i)=>{const cursor=doc.createElement('div');cursor.className='work-cursor';cursor.style.setProperty('--work-color',color);cursor.innerHTML='<svg width="16" height="21" viewBox="0 0 24 28"><path d="M2 2L21 15L12 17L8 25Z" fill="'+color+'" stroke="white"/></svg><b></b>';const box=doc.createElement('div');box.className='work-box';box.style.setProperty('--work-color',color);for(let n=0;n<4;n++)box.append(doc.createElement('i'));const caret=doc.createElement('span');caret.className='work-caret';caret.hidden=true;box.append(caret);host.append(box,cursor);return {cursor,box,caret,color,index:i,position:null,targetId:null};});
 doc.head.append(css);doc.body.append(host);let targets=[],paused=false,frame=0,disposed=false;const reveals=new Map();const prior=new Map(),rects=new Map(),motions=new Set();let lastKey=null,lastViewport=null;
 function notice(target,text,persistent=false){if(paused||doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=target.el.getBoundingClientRect();if(r.bottom<0||r.top>doc.defaultView.innerHeight)return;const badge=doc.createElement('div');badge.dataset.workNotice='';badge.dataset.nodeId=target.el.dataset.psNode;if(persistent)badge.dataset.workFailed='';badge.textContent=text;badge.style.cssText=`position:absolute;left:${r.left+doc.defaultView.scrollX}px;top:${r.top+doc.defaultView.scrollY}px;font:10px/1.5 sans-serif;padding:3px 6px;background:#28684a;color:white;opacity:.5;border-radius:3px`;host.append(badge);if(persistent)return;const a=badge.animate([{opacity:.5},{opacity:.5,offset:.7},{opacity:0}],{duration:1400});motions.add(a);a.finished.finally(()=>{motions.delete(a);badge.remove();}).catch(()=>{});}

 function clearReveals(){for(const record of reveals.values())record.destroy();reveals.clear();}
 function draw(time){frame=0;if(disposed)return;const reduced=doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(reduced||paused)clearReveals();
 const textTargets=[];for(const [el,record] of reveals){const caret=record.frame(time);if(!caret){reveals.delete(el);continue;}textTargets.push({el,caret,state:'revealing',label:'텍스트 반영'});}
 const active=[...new Map([...targets,...textTargets].map(target=>[target.el,target])).values()].slice(0,12);
 // Keep each visible worker with its target instead of shuffling by array order.
 const assigned=new Set();for(const worker of workers){const match=active.find(t=>t.el===worker.targetId);worker.target=match||null;if(match)assigned.add(match);}
 for(const worker of workers)if(!worker.target){worker.target=active.find(t=>!assigned.has(t))||null;if(worker.target)assigned.add(worker.target);}
 host.hidden=paused||(!active.length&&!host.querySelector('[data-work-notice]'));if(host.hidden)return;summary.hidden=!active.length;summary.textContent=`표시 커서 12 · 작업 ${active.length} · 대기 ${12-active.length}`;
 for(const worker of workers){const target=worker.target;if(!target){worker.cursor.hidden=true;worker.box.hidden=true;worker.caret.hidden=true;worker.targetId=null;continue;}const r=target.el.getBoundingClientRect(),w=doc.defaultView;const visible=r.bottom>0&&r.top<w.innerHeight&&r.right>0&&r.left<w.innerWidth;worker.cursor.hidden=!visible;worker.box.hidden=!visible;if(!visible)continue;
 worker.box.dataset.nodeId=target.el.dataset.psNode;worker.cursor.dataset.nodeId=target.el.dataset.psNode;
 const x=r.left+w.scrollX,y=r.top+w.scrollY;
 worker.box.style.left=`${x}px`;worker.box.style.top=`${y}px`;worker.box.style.width=`${r.width}px`;worker.box.style.height=`${r.height}px`;
 const caret=target.caret||(target.el.dataset.psType==='text'?textGeometry(target.el)?.caret:null);
 worker.caret.hidden=!caret||reduced;if(caret){worker.caret.style.left=`${caret.x-x}px`;worker.caret.style.top=`${caret.y-y}px`;worker.caret.style.height=`${caret.height}px`;}
 const endpoint=caret?{x:caret.x+6,y:caret.y}:{x:x+Math.min(16,r.width/2),y:y+Math.min(20,r.height/2)};
 if(worker.targetId!==target.el){worker.origin=worker.position||endpoint;worker.travelStarted=time;worker.targetId=target.el;}
 const t=reduced?1:Math.min(1,Math.max(0,(time-worker.travelStarted)/220)),ease=1-(1-t)**3;
 worker.position={x:worker.origin.x+(endpoint.x-worker.origin.x)*ease,y:worker.origin.y+(endpoint.y-worker.origin.y)*ease};
 worker.cursor.style.transform=`translate(${worker.position.x}px,${worker.position.y}px)`;worker.cursor.querySelector('b').textContent=`${worker.index+1} · ${target.label}`;
 }
 if(active.length)frame=doc.defaultView.requestAnimationFrame(draw);
 }

 const visibilityChanged=()=>{if(doc.visibilityState==='hidden')clearReveals();};doc.addEventListener('visibilitychange',visibilityChanged);
 return {revealText(element){if(!doc.defaultView.CSS?.supports?.('clip-path',"path('M0 0H1V1H0Z')"))return;if(disposed||paused||doc.visibilityState==='hidden'||doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches)return;reveals.get(element)?.destroy();const record=createTextReveal(element,doc.defaultView.performance.now());reveals.set(element,record);record.frame(record.startedAt);if(!frame)frame=doc.defaultView.requestAnimationFrame(draw);},update(values,{effectsPaused=false,operation='',revisionKey='',viewport=''}={}){paused=effectsPaused;if(paused){clearReveals();host.hidden=true;if(frame){doc.defaultView.cancelAnimationFrame(frame);frame=0;}}
 const reduced=doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(paused||reduced)clearReveals();
 if(paused||reduced)for(const motion of motions)motion.cancel();
 const all=[...doc.querySelectorAll('[data-output-boundary] [data-ps-node]')],nextRects=new Map(all.map(el=>{const r=el.getBoundingClientRect();return [el.dataset.psNode,{x:r.left+doc.defaultView.scrollX,y:r.top+doc.defaultView.scrollY,width:r.width,height:r.height}];}));
 if(!paused&&!reduced&&lastKey!==null&&lastKey!==revisionKey&&lastViewport===viewport&&['manual-edit','ai-edit'].includes(operation)){
  const movers=all.filter(el=>{const before=rects.get(el.dataset.psNode),next=nextRects.get(el.dataset.psNode);return before&&Math.abs(before.x-next.x)+Math.abs(before.y-next.y)>1;});
  for(const el of movers.filter(el=>!movers.some(parent=>parent!==el&&parent.contains(el)))){const before=rects.get(el.dataset.psNode),next=nextRects.get(el.dataset.psNode);notice({el},'수정됨 · 배치 반영');const motion=el.animate([{transform:`translate(${before.x-next.x}px,${before.y-next.y}px)`},{transform:'translate(0,0)'}],{duration:340,easing:'ease-out'});motions.add(motion);motion.finished.catch(()=>{}).finally(()=>motions.delete(motion));}
 }
 rects.clear();for(const [id,r] of nextRects)rects.set(id,r);lastKey=revisionKey;lastViewport=viewport;
 for(const value of values){const id=value.el.dataset.psNode,previous=prior.get(id);if(previous==='generating'&&value.state==='ready')notice(value,'✓ 완료');if(value.state==='failed'&&previous!==value.state)notice(value,'준비 실패 · 채팅에서 재시도',true);if(value.state!=='failed')for(const badge of host.querySelectorAll('[data-work-failed]'))if(badge.dataset.nodeId===id)badge.remove();prior.set(id,value.state);}targets=values.filter(v=>v.state==='generating').slice(0,12);if(!frame&&!paused){frame=doc.defaultView.requestAnimationFrame(draw);}},dispose(){disposed=true;doc.removeEventListener('visibilitychange',visibilityChanged);clearReveals();for(const motion of motions)motion.cancel();motions.clear();doc.defaultView.cancelAnimationFrame(frame);host.remove();css.remove();}};
}
