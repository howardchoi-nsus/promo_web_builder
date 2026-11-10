<script setup>
import {ref,shallowRef,onMounted,onBeforeUnmount,onServerPrefetch,createSSRApp,h,Teleport,useId,nextTick,watch} from 'vue';
import outputCss from './output-only.css?inline';
const props=defineProps({title:{type:String,default:'프로모션 페이지'},viewport:{type:String,default:''},variables:{type:Object,default:()=>({})}});
const slots=defineSlots();
const frame=ref(null),target=shallowRef(null),height=ref(0),id=`output-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
const bodyCss=()=>Object.entries(props.variables).filter(([key,value])=>/^--[a-zA-Z0-9-]+$/.test(key)&&typeof value==='string'&&!/[;{}<>]/.test(value)).map(([key,value])=>`${key}:${value}`).join(';');
const shell=markup=>`<!doctype html><html><head><meta charset="utf-8"><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${outputCss}</style><style id="output-token-values">body{${bodyCss()}}</style></head><body><div id="output-content">${markup}</div></body></html>`;
// Preserve server-rendered content for publications; mount the live Vue tree after load.
const source=ref(typeof document==='undefined'?shell(''):document.getElementById(id)?.getAttribute('srcdoc')||shell(''));
onServerPrefetch(async()=>{
 const {renderToString}=await import('vue/server-renderer');
 source.value=shell(await renderToString(createSSRApp({render:()=>h('div',slots.default?.())})));
});
let observer,resizeObserver,disposed=false;
function syncHeight(){if(disposed)return;const root=frame.value?.contentDocument?.getElementById('output-content');if(root)height.value=Math.max(1,Math.ceil(root.getBoundingClientRect().height));}
async function loaded(){
 if(disposed||target.value)return;
 const doc=frame.value?.contentDocument;if(!doc?.body||doc.URL!=='about:srcdoc')return;
 const root=doc.getElementById('output-content');if(!root)return;
 doc.body.style.cssText='';doc.getElementById('output-token-values').textContent=`body{${bodyCss()}}`;
 root.replaceChildren();target.value=root;
 await nextTick();syncHeight();
 observer=new MutationObserver(syncHeight);observer.observe(root,{childList:true,subtree:true,attributes:true,characterData:true});
 resizeObserver=new ResizeObserver(syncHeight);resizeObserver.observe(root);
 doc.addEventListener('load',syncHeight,true);
 // Navigation is confined to the frame; untrusted documents cannot access the parent.
}
watch(()=>props.variables,()=>{const doc=frame.value?.contentDocument;if(doc?.getElementById('output-token-values')){doc.body.style.cssText='';doc.getElementById('output-token-values').textContent=`body{${bodyCss()}}`;}},{deep:true});
onMounted(()=>{loaded();});
onBeforeUnmount(()=>{disposed=true;observer?.disconnect();resizeObserver?.disconnect();});
defineExpose({getDocument:()=>frame.value?.contentDocument,syncHeight});
</script>
<template>
 <iframe :id="id" ref="frame" :title="title" :srcdoc="source" sandbox="allow-same-origin allow-forms allow-top-navigation-by-user-activation" :style="{display:'block',width:'100%',height:height?`${height}px`:'auto',minHeight:viewport?undefined:'100vh',border:0}" @load="loaded" />
 <Teleport v-if="target" :to="target"><slot /></Teleport>
</template>
