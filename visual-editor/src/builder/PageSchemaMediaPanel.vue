<script setup>
import {computed,ref} from 'vue';
import {nodes} from '../../../shared/page-schema/runtime.mjs';
const props=defineProps({page:Object,context:Object,busy:Boolean});
const emit=defineEmits(['change']);
const urls=ref({}),captions=ref({}),error=ref('');
const pending=computed(()=>nodes(props.page).filter(n=>n.type==='image'||n.type==='video'||(n.type==='button'&&!n.actionId)));
async function upload(node,event){
 const file=event.target.files?.[0];if(!file)return;
 if(file.size>3000000||!['image/png','image/jpeg','image/webp'].includes(file.type)){error.value='3MB 이하 PNG, JPEG, WebP만 사용할 수 있습니다.';return;}
 const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file);});
 emit('change',{method:'PUT',nodeId:node.id,mimeType:file.type,base64});
}
</script>
<template>
 <details v-if="pending.length" class="ai-builder-result" :open="page.mediaRequests.length>0">
  <summary>이미지·버튼·동영상 연결</summary>
  <p v-if="error" role="alert">{{error}}</p>
  <div v-for="node in pending" :key="node.id" style="margin-block:1rem">
   <strong>{{node.id}} · {{node.label||node.alt||node.type}}</strong>
   <template v-if="node.type==='image'">
    <button v-if="node.requestId" type="button" :disabled="busy" @click="emit('change',{method:'POST',nodeId:node.id})">AI 이미지 생성</button>
    <label>이미지 업로드 <input type="file" accept="image/png,image/jpeg,image/webp" :disabled="busy" @change="upload(node,$event)" /></label>
   </template>
   <template v-else>
    <label>허용할 URL <input v-model="urls[node.id]" type="text" placeholder="https:// 또는 /경로" :disabled="busy" /></label>
    <label v-if="node.type==='video'">VTT 자막 URL <input v-model="captions[node.id]" type="text" :disabled="busy" /></label>
    <button type="button" :disabled="busy||!urls[node.id]" @click="emit('change',{method:'PATCH',nodeId:node.id,url:urls[node.id],captionUrl:captions[node.id]})">연결</button>
   </template>
  </div>
 </details>
</template>
