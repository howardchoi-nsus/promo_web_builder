const {createHash}=require('node:crypto');
const {safeUrl}=require('../shared/page-schema/contract.cjs');
const BUILTIN_ICONS=Object.freeze({icon_check:{glyph:'check'},icon_arrow:{glyph:'arrow'},icon_star:{glyph:'star'},icon_info:{glyph:'info'}});
function normalizeRegisteredAsset(value){
 if(!value||!value.kind)return null;
 if(!['image','icon'].includes(value.kind))throw Object.assign(new Error('페이지 에셋 종류는 image 또는 icon이어야 합니다.'),{statusCode:422});
 const url=safeUrl(value.url),text=typeof value.text==='string'?value.text.trim():'';
 if(value.url&&!url)throw Object.assign(new Error('허용되는 HTTPS 또는 내부 에셋 URL이 필요합니다.'),{statusCode:422});
 if(value.kind==='image'&&!url||value.kind==='icon'&&(!url&&!text||url&&text||text&&([...text].length>2||/[<>\u0000-\u001f]/u.test(text))))throw Object.assign(new Error('이미지는 URL, 아이콘은 URL 또는 두 글자 이내 기호 중 하나를 등록해 주세요.'),{statusCode:422});
 return {kind:value.kind,...(url?{url}:{text})};
}
async function loadPageAssets(sql,{fetch=require('./_item-components-store').fetchComponents}={}){
 const assets={},icons={...BUILTIN_ICONS};
 const components=await fetch(sql);
 for(const component of components){
  if(component.status!=='active'||component.activeVersion?.status!=='active')continue;
  const version=component.activeVersion;
  const id='registered_'+createHash('sha256').update(component.id+':'+version.id).digest('hex').slice(0,24);
  const spec=version.capabilities?.pageSchemaAsset;
  if(spec?.kind==='icon'){
   const url=safeUrl(spec.url),text=typeof spec.text==='string'&&[...spec.text].length<=2&&!/[<>\u0000-\u001f]/u.test(spec.text)?spec.text:'';
   if((url||text)&&Object.keys(icons).length<36)icons[id]={...(url?{url}:{text}),label:component.name,componentId:component.id,versionId:version.id};
  }
  const declared=spec?.kind==='image'?safeUrl(spec.url):'';
  const value=version.fieldKind==='image'&&typeof version.defaultValue==='string'?safeUrl(version.defaultValue):'';
  if((declared||value)&&Object.keys(assets).length<32)assets[id]={kind:'image',url:declared||value,label:component.name,componentId:component.id,versionId:version.id};
 }
 return {assets,icons};
}
module.exports={loadPageAssets,BUILTIN_ICONS,normalizeRegisteredAsset};
