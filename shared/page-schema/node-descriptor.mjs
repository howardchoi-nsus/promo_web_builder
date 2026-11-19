import {pageStyleRoles,pageStyleToken} from '../token-usage-policy.mjs';
import {safeUrl,textContent} from './runtime.mjs';
function descriptor(tag,attrs,children=[]){if(typeof attrs==='string'||Array.isArray(attrs)){children=attrs;attrs={};}return {tag,attrs,children:typeof children==='function'?children():children};}
export function pageNodeDescriptor(n,context,page,options={}){
 const {wireframe=false,viewportOverride=''}=options;const resolvedRoles=pageStyleRoles(context);
   const attrs={id:n.id,'data-ps-node':n.id,'data-ps-type':n.type,'data-wireframe-node':wireframe?n.id:undefined,'data-wireframe-type':wireframe?n.type:undefined};
   const children=()=>n.children.map(child=>pageNodeDescriptor(child,context,page,options));
   if(n.type==='container'){
    const tag=({page:viewportOverride?'div':'main',section:'section',header:'header',footer:'footer',navigation:'nav',form:'form',group:'div'})[n.role]||'div';
    const action=context.actions?.[n.formActionId];
    const hasBackground=n.children.some(child=>child.type==='image'&&child.presentation==='background');
    const overlay=resolvedRoles.find(role=>role.key===n.overlayRole),overlayToken=overlay&&pageStyleToken(context,overlay);
    const content=children();
    if(hasBackground){for(const child of content)if(child.attrs?.['data-ps-type']!=='image'||!n.children.find(node=>node.id===child.attrs?.id&&node.presentation==='background'))child.attrs={...child.attrs,style:{...child.attrs?.style,position:'relative',zIndex:2}};}
    if(overlayToken)content.unshift(descriptor('div',{'data-ps-overlay':true,'aria-hidden':'true',style:{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',backgroundImage:`var(${overlayToken})`}}));
    return descriptor(tag,{...attrs,style:hasBackground||overlayToken?{position:'relative',isolation:'isolate'}:undefined,'aria-label':n.label||undefined,...(tag==='form'?{action:action?.kind==='submit'?safeUrl(action.href):undefined,method:'post','data-unbound-form':wireframe||!action?'true':undefined}:{})},content);
   }
   if(['grid','stack','card'].includes(n.type))return descriptor(n.type==='card'?'article':'div',{...attrs,'aria-label':n.label||undefined},children());
   if(n.type==='text')return descriptor(n.role==='heading'?`h${n.headingLevel}`:n.role==='body'?'p':'span',attrs,textContent(n,context));
   if(n.type==='button'){if(wireframe||!n.actionId)return descriptor('span',{...attrs,'data-ps-action-state':!n.actionId?'unbound':undefined},n.label);const action=context.actions?.[n.actionId],href=action?.kind==='navigate'?safeUrl(action.href):'',submit=action?.kind==='submit'&&safeUrl(action.href).startsWitdescriptor('/');return descriptor(href?'a':'button',{...attrs,...(href?{href,rel:'noopener noreferrer'}:{type:submit?'submit':'button',disabled:!submit})},n.label);}
   if(n.type==='image'){
    const asset=context.assets?.[n.assetId],src=safeUrl(asset?.url);
    const request=page.mediaRequests.find(request=>request.id===n.requestId);
    const ratio=n.aspectRatio==='auto'?(asset?.displayAspectRatio||request?.aspectRatio||(asset?.width&&asset?.height?`${asset.width}/${asset.height}`:undefined)):n.aspectRatio;
    const style=n.presentation==='background'?{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:n.fit,zIndex:0,pointerEvents:'none'}:{aspectRatio:ratio?.replace(':','/'),objectFit:n.fit,maxWidth:'100%',height:'auto'};
    return src?descriptor('img',{...attrs,src,alt:n.alt,loading:'lazy',style}):descriptor('div',{...attrs,style,role:'img','aria-label':n.alt||'이미지 생성 대기'},'이미지 생성 대기');
   }
   if(n.type==='input')return descriptor('label',attrs,[descriptor('span',n.label),descriptor('input',{type:n.inputType,name:context.formFields?.[n.fieldId]?.name,placeholder:n.placeholder,required:n.required,disabled:wireframe||!context.formFields?.[n.fieldId]})]);
   if(n.type==='divider')return descriptor('hr',{...attrs,'aria-orientation':n.direction});
   if(n.type==='icon'){
    const icon=context.icons?.[n.iconId],url=safeUrl(icon?.url);
    const iconAttrs={...attrs,role:n.decorative?undefined:'img','aria-label':n.decorative?undefined:n.label,'aria-hidden':n.decorative?'true':undefined};
    return url?descriptor('img',{...iconAttrs,src:url,alt:n.decorative?'':n.label,style:{width:'1em',height:'1em',objectFit:'contain'}}):descriptor('span',iconAttrs,icon?.text||({check:'✓',arrow:'→',star:'★',info:'ⓘ'})[icon?.glyph]||'');
   }
   if(n.type==='video'){const src=safeUrl(context.assets?.[n.assetId]?.url);return src?descriptor('video',{...attrs,src,poster:safeUrl(context.assets?.[n.posterAssetId]?.url)||undefined,controls:!wireframe,preload:'metadata','aria-label':n.label},n.captionAssetId?[descriptor('track',{kind:'captions',src:safeUrl(context.assets?.[n.captionAssetId]?.url),srclang:context.language||'ko',default:true})]:[]):descriptor('div',attrs,'동영상 연결 대기');}
   return null;
}
