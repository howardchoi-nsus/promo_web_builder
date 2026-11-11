<script setup>
import {computed} from 'vue';
import CompositionPreviewCanvas from './CompositionPreviewCanvas.vue';
const props=defineProps({page:{type:Object,required:true},context:{type:Object,required:true},viewport:{type:String,default:'desktop'}});
const content=computed(()=>({pageSchema:props.page,pageContext:props.context,runtimeTheme:{designTokens:{policy:'registered-only',values:props.context.tokenValues,catalog:props.context.tokenCatalog,usagePolicy:props.context.usagePolicy}}}));
</script>
<template>
 <div class="schema-wireframe" aria-label="동적 페이지 구성 미리보기">
  <CompositionPreviewCanvas :snapshot="{contractVersion:3,content,designSpec:{},assets:{}}" :viewport="viewport" wireframe />
 </div>
</template>
