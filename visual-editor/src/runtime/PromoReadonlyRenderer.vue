<script setup>
import {computed,ref} from 'vue';
import PromoPageRenderer from '../PromoPageRenderer.vue';
import PageSchemaRenderer from './PageSchemaRenderer.vue';
import IsolatedOutputFrame from './IsolatedOutputFrame.vue';
import {normalizeReadonlyRendererProps} from './readonly-renderer-contract.mjs';
import {enforceRegisteredDesignTokens} from '../../../shared/registered-token-policy.mjs';
import {layoutTokenPolicy} from '../../../shared/layout-token-policy.mjs';
import {tokenVariables} from '../../../shared/page-schema/runtime.mjs';
import {usageRuntimeStyle,validateTokenUsagePolicy} from '../../../shared/token-usage-policy.mjs';
const props=defineProps({snapshot:{type:Object,default:null},content:{type:Object,default:null},designSpec:{type:Object,default:null},assets:{type:Object,default:null},motionSpec:{type:Object,default:null},viewportOverride:{type:String,default:''},wireframe:{type:Boolean,default:false}});
const rendererProps=computed(()=>normalizeReadonlyRendererProps(props));
const library=computed(()=>rendererProps.value.content.runtimeTheme?.designTokens||rendererProps.value.content.formTemplate?.designTokens||{});
const context=computed(()=>rendererProps.value.content.pageContext||{tokenValues:library.value.values||{},tokenCatalog:library.value.catalog||[],usagePolicy:library.value.usagePolicy});
const policy=computed(()=>layoutTokenPolicy(context.value));
const errors=computed(()=>[
 ...policy.value.errors,
 ...(rendererProps.value.content.pageSchema?[]:enforceRegisteredDesignTokens(rendererProps.value.designSpec,context.value.tokenValues,context.value.tokenCatalog,context.value.usagePolicy,rendererProps.value.content.sectionSnapshot||[]).errors),
 ...validateTokenUsagePolicy(context.value.usagePolicy,context.value.tokenCatalog,{activation:true}).errors,
 ...Object.entries(context.value.usagePolicy?.bindings||{}).filter(([,token])=>(typeof token==='string'&&token.startsWith('--app-'))).map(([path])=>({code:'BUILDER_TOKEN_FORBIDDEN',path,message:'출력에 빌더 토큰을 사용할 수 없습니다.'})),
]);
const variables=computed(()=>({...tokenVariables(context.value),...usageRuntimeStyle(context.value.usagePolicy,context.value.tokenValues)}));
const frame=ref(null),renderer=ref(null);
function layoutCss(){
 if(!policy.value.ok)return '';
 const p=policy.value,values=context.value.tokenValues;
 const rule=view=>`.promo-renderer{--output-grid-margin:var(${p.profiles[view].margin});--output-grid-gutter:var(${p.profiles[view].gutter})}`;
 return `${rule('mobile')}@media(min-width:${values[p.breakpoints.tablet]}){${rule('tablet')}}@media(min-width:${values[p.breakpoints.desktop]}){${rule('desktop')}}@media(min-width:${values[p.breakpoints.wide]}){${rule('desktopWide')}}${props.viewportOverride?rule(props.viewportOverride):''}`;
}
function unavailable(){return {count:1,blockingCount:1,warningCount:0,diagnostics:errors.value.length?errors.value.map(e=>({...e,level:'blocking'})):[{code:'OUTPUT_RENDERER_NOT_READY',level:'blocking',message:'출력 렌더러가 준비되지 않았습니다.'}]};}
defineExpose({getOutputDocument:()=>frame.value?.getDocument(),inspectLayoutQuality:()=>errors.value.length?unavailable():renderer.value?.inspectLayoutQuality?.()||unavailable(),inspectLayoutCollisions:()=>renderer.value?.inspectLayoutCollisions?.()||{itemPatches:{},sectionPatches:{}},syncHeight:()=>frame.value?.syncHeight()});
</script>
<template>
 <section v-if="errors.length" role="alert" class="output-policy-error"><strong>등록된 디자인 토큰을 확인해 주세요.</strong><ul><li v-for="(error,index) in errors" :key="index">{{error.message||error.path||error.key}}</li></ul></section>
 <IsolatedOutputFrame v-else ref="frame" :viewport="rendererProps.viewportOverride" :variables="variables">
  <div data-output-boundary :style="variables">
   <component :is="'style'">{{layoutCss()}}</component>
   <PageSchemaRenderer v-if="rendererProps.content.pageSchema" ref="renderer" :page="rendererProps.content.pageSchema" :context="context" :viewport-override="rendererProps.viewportOverride" :wireframe="wireframe" />
   <PromoPageRenderer v-else ref="renderer" class="promo-readonly-renderer" :content="{...rendererProps.content,runtimeTheme:{...rendererProps.content.runtimeTheme,designTokens:{...library,policy:'registered-only'}}}" :design-spec="rendererProps.designSpec" :assets="rendererProps.assets" :motion-spec="rendererProps.motionSpec" :viewport-override="rendererProps.viewportOverride" :editable="false" :show-guides="false" :outline-mode="false" />
  </div>
 </IsolatedOutputFrame>
</template>
