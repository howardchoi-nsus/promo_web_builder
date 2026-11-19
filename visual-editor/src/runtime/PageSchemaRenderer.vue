<script>
import {pageNodeDescriptor} from '../../../shared/page-schema/node-descriptor.mjs';
import { defineComponent, h, ref, useId, computed } from 'vue';
import {pageStyleRoles,pageStyleToken} from '../../../shared/token-usage-policy.mjs';
import { pageCss, tokenVariables, safeUrl, textContent, nodes, styleRules } from '../../../shared/page-schema/runtime.mjs';
import {inspectPageReadability} from './page-schema-quality.mjs';
// Preview-only paint overrides: keep token-derived geometry and typography metrics.
function wireframeCss(scope){
 const host=`[data-ps-scope="${scope}"]`;
 return `${host}{background:#fff!important;color:#333!important}
 ${host} [data-ps-node]{background-color:#fff!important;background-image:none!important;color:#333!important;border-color:#aaa!important;box-shadow:none!important;text-shadow:none!important;animation:none!important;transition:none!important}
 ${host} [data-ps-type="container"],${host} [data-ps-type="card"]{outline:1px dashed #bbb;outline-offset:-1px}
 ${host} [data-ps-type="text"]:empty{min-height:1lh;min-width:6ch;background-color:#e5e7eb!important}
 ${host} [data-ps-type="button"],${host} input{background:#eee!important;outline:1px solid #888;outline-offset:-1px}
 ${host} img,${host} video{object-fit:none!important;object-position:-100000px -100000px!important;background:#eee!important;outline:1px dashed #999;outline-offset:-1px}
 ${host} [data-ps-overlay]{display:none!important}
 ${host} [data-ps-type="image"],${host} [data-ps-type="video"]{background:#eee!important;outline:1px dashed #999;outline-offset:-1px}`;
}
export default defineComponent({
 name:'PageSchemaRenderer',
 props:{page:{type:Object,required:true},context:{type:Object,required:true},viewportOverride:{type:String,default:''},wireframe:{type:Boolean,default:false}},
 setup(props,{expose}){
  const resolvedRoles=computed(()=>pageStyleRoles(props.context));
  const host=ref(null),scope=`ps-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  function inspectLayoutQuality(){
   const diagnostics=[];
   const registeredRoles=resolvedRoles.value;
   for(const node of nodes(props.page)){
    if(props.context.styleChoicesVersion===1){
     const border=styleRules(node,props.viewportOverride||'desktop',props.context,registeredRoles).filter(rule=>['border-color','border-width','border-style'].includes(rule.property));
     if(border.length&&new Set(border.map(rule=>rule.property)).size!==3)diagnostics.push({code:'STYLE_TOKEN_REQUIRED',level:'blocking',path:node.id,message:'테두리 색상·두께·선 종류를 모두 등록 토큰으로 연결해 주세요.'});
    }
    if(node.type==='icon'&&!props.context.icons?.[node.iconId])diagnostics.push({code:'ICON_ASSET_REQUIRED',level:'blocking',path:node.id,message:'등록된 아이콘 연결이 필요합니다.'});
    if(node.type==='divider'&&props.context.styleChoicesVersion!==1&&(!props.context.usagePolicy?.bindings?.['divider.color']||!props.context.usagePolicy?.bindings?.['divider.width']))diagnostics.push({code:'STYLE_TOKEN_REQUIRED',level:'blocking',path:node.id,message:'구분선 색상과 두께를 등록 토큰 정책에 연결해 주세요.'});
    if(node.type==='image'&&(!node.assetId||!safeUrl(props.context.assets?.[node.assetId]?.url)))diagnostics.push({code:'IMAGE_GENERATION_PENDING',level:'blocking',path:node.id,message:'이미지 에셋을 연결해 주세요.'});
    if(node.type==='video'&&!safeUrl(props.context.assets?.[node.assetId]?.url))diagnostics.push({code:'VIDEO_ASSET_REQUIRED',level:'blocking',path:node.id,message:'동영상을 연결해 주세요.'});
    if(node.type==='button'&&node.actionId&&!props.context.actions?.[node.actionId])diagnostics.push({code:'ACTION_BINDING_REQUIRED',level:'blocking',path:node.id,message:'버튼에 허용된 이동 경로가 필요합니다.'});
    if(node.type==='input'&&!props.context.formFields?.[node.fieldId])diagnostics.push({code:'FORM_BINDING_REQUIRED',level:'blocking',path:node.id,message:'입력 필드 연결이 필요합니다.'});
   }
   for(const el of host.value?.querySelectorAll('[data-ps-node]')||[]){
    if(el.scrollWidth>el.clientWidth+2&&el.clientWidth>0)diagnostics.push({code:'CONTENT_OVERFLOW',level:'blocking',path:el.dataset.psNode,message:'콘텐츠가 사용 가능한 너비를 초과합니다.'});
    if(el.dataset.psType==='text'){const computed=getComputedStyle(el),size=parseFloat(computed.fontSize),line=parseFloat(computed.lineHeight);if((Number.isFinite(line)&&line<size)||el.scrollHeight>el.clientHeight+2)diagnostics.push({code:'TEXT_CLIPPING_OR_LINE_HEIGHT',level:'blocking',path:el.dataset.psNode,message:'등록된 글자 크기·줄 높이 또는 잘림을 확인해 주세요.'});}
    if(el.tagName==='VIDEO'&&(el.error||el.readyState===0))diagnostics.push({code:'VIDEO_LOAD_PENDING_OR_FAILED',level:'blocking',path:el.dataset.psNode,message:'동영상 메타데이터 로딩을 확인해 주세요.'});
    if(el.tagName==='IMG'&&(!el.complete||!el.naturalWidth))diagnostics.push({code:'IMAGE_LOAD_FAILED',level:'blocking',path:el.dataset.psNode,message:'이미지를 불러오지 못했습니다.'});
   }
   if(host.value&&!props.wireframe)diagnostics.push(...inspectPageReadability(host.value,props.page,props.viewportOverride||'desktop'));
   const metrics=[...(host.value?.querySelectorAll('[data-ps-node]')||[])].map(el=>{const rect=el.getBoundingClientRect();return {nodeId:el.dataset.psNode,width:Math.round(rect.width),height:Math.round(rect.height)};});
   return {viewport:props.viewportOverride||'auto',count:diagnostics.length,blockingCount:diagnostics.filter(d=>d.level==='blocking').length,warningCount:diagnostics.filter(d=>d.level==='warning').length,diagnostics,metrics};
  }
  expose({inspectLayoutQuality});
  function renderNode(n){const render=d=>typeof d==='string'?d:d?h(d.tag,{...d.attrs,...(d.attrs?.['data-unbound-form']?{onSubmit:e=>e.preventDefault()}:{} )},Array.isArray(d.children)?d.children.map(render):d.children):null;return render(pageNodeDescriptor(n,props.context,props.page,{wireframe:props.wireframe,viewportOverride:props.viewportOverride}));}
  // Compiler-generated CSS only: SSR text escaping would corrupt quoted selectors.
  // User copy remains ordinary escaped text nodes; never pass model HTML here.
  return ()=>h('div',{ref:host,class:'page-schema-renderer','data-ps-scope':scope,'data-ps-viewport':['desktop','tablet','mobile'].includes(props.viewportOverride)?props.viewportOverride:undefined,style:tokenVariables(props.context)},[h('style',{innerHTML:pageCss(props.page,props.context,scope)+(props.wireframe?wireframeCss(scope):'')}),renderNode(props.page.root)]);
 }
});
</script>
