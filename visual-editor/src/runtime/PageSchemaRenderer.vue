<script>
import { defineComponent, h, ref, useId } from 'vue';
import { pageCss, tokenVariables, safeUrl, textContent, nodes } from '../../../shared/page-schema/runtime.mjs';
export default defineComponent({
 name:'PageSchemaRenderer',
 props:{page:{type:Object,required:true},context:{type:Object,required:true},viewportOverride:{type:String,default:''},wireframe:{type:Boolean,default:false}},
 setup(props,{expose}){
  const host=ref(null),scope=`ps-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  function inspectLayoutQuality(){
   const diagnostics=[];
   for(const node of nodes(props.page)){
    if(node.type==='divider'&&(!props.context.usagePolicy?.bindings?.['divider.color']||!props.context.usagePolicy?.bindings?.['divider.width']))diagnostics.push({code:'STYLE_TOKEN_REQUIRED',level:'blocking',path:node.id,message:'구분선 색상과 두께를 등록 토큰 정책에 연결해 주세요.'});
    if(node.type==='image'&&(!node.assetId||!safeUrl(props.context.assets?.[node.assetId]?.url)))diagnostics.push({code:'IMAGE_GENERATION_PENDING',level:'blocking',path:node.id,message:'이미지 에셋을 연결해 주세요.'});
    if(node.type==='video'&&!safeUrl(props.context.assets?.[node.assetId]?.url))diagnostics.push({code:'VIDEO_ASSET_REQUIRED',level:'blocking',path:node.id,message:'동영상을 연결해 주세요.'});
    if(node.type==='button'&&!props.context.actions?.[node.actionId])diagnostics.push({code:'ACTION_BINDING_REQUIRED',level:'blocking',path:node.id,message:'버튼에 허용된 이동 경로가 필요합니다.'});
    if(node.type==='input'&&!props.context.formFields?.[node.fieldId])diagnostics.push({code:'FORM_BINDING_REQUIRED',level:'blocking',path:node.id,message:'입력 필드 연결이 필요합니다.'});
   }
   for(const el of host.value?.querySelectorAll('[data-ps-node]')||[]){
    if(el.scrollWidth>el.clientWidth+2&&el.clientWidth>0)diagnostics.push({code:'CONTENT_OVERFLOW',level:'blocking',path:el.dataset.psNode,message:'콘텐츠가 사용 가능한 너비를 초과합니다.'});
    if(el.dataset.psType==='text'){const computed=getComputedStyle(el),size=parseFloat(computed.fontSize),line=parseFloat(computed.lineHeight);if((Number.isFinite(line)&&line<size)||el.scrollHeight>el.clientHeight+2)diagnostics.push({code:'TEXT_CLIPPING_OR_LINE_HEIGHT',level:'blocking',path:el.dataset.psNode,message:'등록된 글자 크기·줄 높이 또는 잘림을 확인해 주세요.'});}
    if(el.tagName==='VIDEO'&&(el.error||el.readyState===0))diagnostics.push({code:'VIDEO_LOAD_PENDING_OR_FAILED',level:'blocking',path:el.dataset.psNode,message:'동영상 메타데이터 로딩을 확인해 주세요.'});
    if(el.tagName==='IMG'&&(!el.complete||!el.naturalWidth))diagnostics.push({code:'IMAGE_LOAD_FAILED',level:'blocking',path:el.dataset.psNode,message:'이미지를 불러오지 못했습니다.'});
   }
   return {viewport:props.viewportOverride||'auto',count:diagnostics.length,blockingCount:diagnostics.length,warningCount:0,diagnostics};
  }
  expose({inspectLayoutQuality});
  function renderNode(n){
   const attrs={key:n.id,id:n.id,'data-ps-node':n.id,'data-ps-type':n.type,'data-wireframe-node':props.wireframe?n.id:undefined,'data-wireframe-type':props.wireframe?n.type:undefined};
   const children=()=>n.children.map(renderNode);
   if(n.type==='container'){
    const tag=({page:props.viewportOverride?'div':'main',section:'section',header:'header',footer:'footer',navigation:'nav',form:'form',group:'div'})[n.role]||'div';
    const action=props.context.actions?.[n.formActionId];
    return h(tag,{...attrs,'aria-label':n.label||undefined,...(tag==='form'?{action:action?.kind==='submit'?safeUrl(action.href):undefined,method:'post',onSubmit:e=>{if(props.wireframe||!action)e.preventDefault();}}:{})},children());
   }
   if(['grid','stack','card'].includes(n.type))return h(n.type==='card'?'article':'div',{...attrs,'aria-label':n.label||undefined},children());
   if(n.type==='text')return h(n.role==='heading'?`h${n.headingLevel}`:n.role==='body'?'p':'span',attrs,textContent(n,props.context));
   if(n.type==='button'){if(props.wireframe)return h('span',attrs,n.label);const action=props.context.actions?.[n.actionId],href=action?.kind==='navigate'?safeUrl(action.href):'',submit=action?.kind==='submit'&&safeUrl(action.href).startsWith('/');return h(href?'a':'button',{...attrs,...(href?{href,rel:'noopener noreferrer'}:{type:submit?'submit':'button',disabled:!submit})},n.label);}
   if(n.type==='image'){const src=safeUrl(props.context.assets?.[n.assetId]?.url);return src?h('img',{...attrs,src,alt:n.alt,loading:'lazy',style:{aspectRatio:n.aspectRatio==='auto'?undefined:n.aspectRatio.replace(':','/'),objectFit:n.fit}}):h('div',{...attrs,role:'img','aria-label':n.alt||'이미지 생성 대기'},'이미지 생성 대기');}
   if(n.type==='input')return h('label',attrs,[h('span',n.label),h('input',{type:n.inputType,name:props.context.formFields?.[n.fieldId]?.name,placeholder:n.placeholder,required:n.required,disabled:props.wireframe||!props.context.formFields?.[n.fieldId]})]);
   if(n.type==='divider')return h('hr',{...attrs,'aria-orientation':n.direction});
   if(n.type==='icon')return h('span',{...attrs,role:n.decorative?undefined:'img','aria-label':n.decorative?undefined:n.label,'aria-hidden':n.decorative?'true':undefined},({check:'✓',arrow:'→',star:'★',info:'ⓘ'})[props.context.icons?.[n.iconId]?.glyph]||'');
   if(n.type==='video'){const src=safeUrl(props.context.assets?.[n.assetId]?.url);return src?h('video',{...attrs,src,poster:safeUrl(props.context.assets?.[n.posterAssetId]?.url)||undefined,controls:true,preload:'metadata','aria-label':n.label},n.captionAssetId?[h('track',{kind:'captions',src:safeUrl(props.context.assets?.[n.captionAssetId]?.url),srclang:props.context.language||'ko',default:true})]:[]):h('div',attrs,'동영상 연결 대기');}
   return null;
  }
  return ()=>h('div',{ref:host,class:'page-schema-renderer','data-ps-scope':scope,'data-ps-viewport':['desktop','tablet','mobile'].includes(props.viewportOverride)?props.viewportOverride:undefined,style:tokenVariables(props.context)},[h('style',pageCss(props.page,props.context,scope)),renderNode(props.page.root)]);
 }
});
</script>
