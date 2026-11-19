// Sample-only visual variants. Switching does not reset tasks, assets or cursor state.
const canvas=document.querySelector('#canvas');
const buttons=[...document.querySelectorAll('button[data-layout]')];
for(const button of buttons)button.addEventListener('click',()=>{
 const before=[...canvas.querySelectorAll('.hero-copy,.feature-grid>[data-component],.site-footer')].map(el=>({el,rect:el.getBoundingClientRect()}));
 canvas.dataset.layout=button.dataset.layout;
 for(const item of buttons)item.setAttribute('aria-pressed',String(item===button));
 canvas.dispatchEvent(new CustomEvent('demo:layoutchange',{detail:{before}}));
 document.querySelector('#layout-help').textContent=button.dataset.layout==='center'?'중앙 카피 · 전체 배경 이미지 · 균등 카드':'좌측 카피 · 우측 비주얼 · 비대칭 카드';
});
