// Demo-only feedback layer. No effect timers determine generation completion.
const canvas=document.querySelector('#canvas'),wrap=document.querySelector('.canvas-wrap');
const motion=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.querySelector('#effects-toggle'),rearrange=document.querySelector('#rearrange-demo');
const layer=document.createElement('div');layer.className='feedback-layer';layer.setAttribute('aria-hidden','true');wrap.append(layer);
let paused=false,ready=false;const animations=new Set();
const allowed=()=>!paused&&!motion.matches;
function animate(el,keyframes,options){if(!allowed())return;const a=el.animate(keyframes,options);animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
function feedback(el,text,failed=false){if(!el?.isConnected||!allowed())return;const r=el.getBoundingClientRect(),w=wrap.getBoundingClientRect();if(r.bottom<w.top||r.top>w.bottom)return;const box=document.createElement('div');box.className='feedback-stroke'+(failed?' failed-feedback':'');box.style.cssText=`left:${r.left-w.left+wrap.scrollLeft}px;top:${r.top-w.top+wrap.scrollTop}px;width:${r.width}px;height:${r.height}px`;
 const label=document.createElement('span');label.textContent=text;box.append(label);layer.append(box);if(failed)return;
 const a=animate(box,[{opacity:0},{opacity:.5,offset:.15},{opacity:.5,offset:.6},{opacity:0}],{duration:1400,easing:'ease-out'});a?.finished.finally(()=>box.remove()).catch(()=>{});
}
function move(before){for(const {el,rect} of before){if(!el.isConnected)continue;const now=el.getBoundingClientRect(),x=rect.left-now.left,y=rect.top-now.top;if(Math.abs(x)+Math.abs(y)>1)animate(el,[{transform:`translate(${x}px,${y}px)`},{transform:'translate(0,0)'}],{duration:340,easing:'cubic-bezier(.2,.7,.2,1)'});}}
canvas.addEventListener('demo:taskstart',({detail})=>{detail.el.classList.add('active-work-target');if(detail.phase==='wireframe')animate(detail.el,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});layer.querySelectorAll('.failed-feedback').forEach(el=>el.remove());});
canvas.addEventListener('demo:taskcomplete',({detail})=>{detail.el.classList.remove('active-work-target');feedback(detail.el,'✓ '+(detail.phase==='wireframe'?'구성 완료':'디자인 완료'));});
canvas.addEventListener('demo:taskfailed',({detail})=>{detail.el.classList.remove('active-work-target');feedback(detail.el,'준비 실패 · 채팅에서 재시도',true);});
canvas.addEventListener('demo:layoutchange',({detail})=>move(detail.before));
canvas.addEventListener('demo:complete',()=>{ready=true;rearrange.disabled=false;});
canvas.addEventListener('demo:reset',()=>{ready=false;rearrange.disabled=true;for(const a of animations)a.cancel();animations.clear();layer.replaceChildren();});
toggle.addEventListener('click',()=>{paused=!paused;wrap.dataset.effectsPaused=String(paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'효과 다시 재생':'효과만 일시정지';for(const a of animations)paused?a.pause():a.play();});
rearrange.addEventListener('click',()=>{if(!ready)return;const grid=canvas.querySelector('.feature-grid');if(!grid)return;const before=[...grid.children].map(el=>({el,rect:el.getBoundingClientRect()}));grid.prepend(grid.lastElementChild);move(before);for(const el of grid.children)feedback(el,'수정됨 · 배치 변경');const row=document.createElement('div');row.className='message';const meta=document.createElement('span');meta.className='meta';meta.textContent='샘플 배치 수정 · 완료';const body=document.createElement('span');body.className='body';body.textContent='콘텐츠 카드 순서를 변경했습니다. 문구와 이미지는 유지했습니다.';row.append(meta,body);document.querySelector('#history').append(row);});
motion.addEventListener('change',()=>{if(motion.matches){for(const a of animations)a.cancel();layer.replaceChildren();}});
