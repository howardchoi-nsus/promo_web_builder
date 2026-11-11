<script>
import {defineComponent,h} from 'vue';
import {textContent} from '../../../shared/page-schema/runtime.mjs';
export default defineComponent({
 name:'PageSchemaWireframe',
 props:{page:{type:Object,required:true},context:{type:Object,required:true},viewport:{type:String,default:'desktop'}},
 setup(props){
  function render(node,parentColumns=0){
   const layout=node.layout?.[props.viewport]||node.layout?.desktop||{};
   const columns=layout.columns||[],grid=node.type==='grid';
   const style={display:grid?'grid':['container','stack','card'].includes(node.type)?'flex':undefined,flexDirection:layout.direction||'column',gridTemplateColumns:grid?columns.map(n=>`${n}fr`).join(' ')||'1fr':undefined,alignItems:layout.align,justifyContent:layout.justify,gap:'16px',minWidth:0,gridColumn:parentColumns?`span ${Math.min(parentColumns,Math.max(1,layout.columnSpan||1))}`:undefined};
   const attrs={key:node.id,'data-wireframe-node':node.id,'data-wireframe-type':node.type,style};
   const children=(node.children||[]).map(child=>render(child,grid?Math.max(1,columns.length):0));
   if(children.length)return h(node.role==='section'?'section':'div',{...attrs,class:['schema-wireframe__group',node.role==='section'?'schema-wireframe__section':'']},children);
   if(node.type==='text')return h(node.role==='heading'?`h${node.headingLevel}`:'p',attrs,textContent(node,props.context));
   if(node.type==='button')return h('span',{...attrs,class:'schema-wireframe__button'},node.label);
   if(node.type==='image'||node.type==='video')return h('div',{...attrs,class:'schema-wireframe__media'},node.alt||node.label||'이미지 영역');
   if(node.type==='input')return h('div',{...attrs,class:'schema-wireframe__input'},node.label||'입력 항목');
   if(node.type==='divider')return h('hr',attrs);
   if(node.type==='icon')return h('span',attrs,node.label||'아이콘');
   return h('div',attrs,children);
  }
  return()=>h('div',{class:'schema-wireframe','data-viewport':props.viewport,'aria-label':'동적 페이지 구성 미리보기'},[render(props.page.root)]);
 }
});
</script>
<style scoped>
.schema-wireframe{width:100%;max-width:1100px;margin:0 auto;padding:20px;background:#fff;color:#20252d;overflow-wrap:anywhere}
.schema-wireframe[data-viewport=tablet]{max-width:768px}.schema-wireframe[data-viewport=mobile]{max-width:375px}
.schema-wireframe :deep(p),.schema-wireframe :deep(h1),.schema-wireframe :deep(h2),.schema-wireframe :deep(h3){margin:0;white-space:pre-wrap;line-height:1.5}
.schema-wireframe :deep(.schema-wireframe__section){padding:20px;border:1px dashed #9ca3af}
.schema-wireframe :deep(.schema-wireframe__button){display:inline-block;padding:10px 16px;border:1px solid #6b7280}
.schema-wireframe :deep(.schema-wireframe__media){display:grid;place-items:center;min-height:160px;padding:16px;background:#e5e7eb;border:1px dashed #9ca3af}
.schema-wireframe :deep(.schema-wireframe__input){padding:12px;border:1px solid #9ca3af}
</style>
