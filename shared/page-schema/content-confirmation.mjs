// Shared by requirements review and server validation. Approval never fabricates copy.
export function confirmationText(value) {
 return typeof value === 'string' && value.trim() && !/^(?:확인\s*필요|미입력|미정|추후\s*확인|입력\s*필요|tbd|to be confirmed)[.!\s]*$/i.test(value.trim());
}
export function emptyOptionalCta(value,path) {
 return /\.cta$/.test(path) && !String(value?.label||'').trim() && !String(value?.url||'').trim();
}
export function pendingContentConfirmations(overview) {
 const pending=[];
 function visit(value,path) {
  if(!value||typeof value!=='object')return;
  if(Array.isArray(value)){value.forEach((item,index)=>visit(item,`${path}.${index}`));return;}
  if(emptyOptionalCta(value,path))return;
  if(value.confirmationRequired===true){
   const fields=Object.entries(value).filter(([key,text])=>['title','description','body','value','label','eyebrow','badge','ctaLabel','ctaUrl','url'].includes(key)&&typeof text==='string'&&text.trim());
   const primary=/^additionalInformation\./.test(path)?value.value:/^(notices|legalInformation)\./.test(path)?value.body:/\.cta$/.test(path)?value.label:(value.description||value.value||value.title);
   const canConfirm=Boolean(confirmationText(primary)&&fields.every(([,text])=>confirmationText(text))&&(!/\.cta$/.test(path)||confirmationText(value.url))&&(!value.ctaLabel||confirmationText(value.ctaUrl)));
   const primaryKey=/^additionalInformation\./.test(path)?'value':/^(notices|legalInformation)\./.test(path)?'body':/\.cta$/.test(path)?'label':'description';
   const editableKeys=[...new Set([primaryKey,...fields.map(([key])=>key),...(/\.cta$/.test(path)?['url']:[])])];
   pending.push({editableFields:editableKeys.map(key=>({key,value:String(value[key]||'')})),path,label:value.title||value.label||path,text:fields.map(([key,text])=>`${key}: ${text}`).join('\n'),canConfirm,
    code:'CONTENT_CONFIRMATION_REQUIRED',message:`${value.title||value.label||path}: ${canConfirm?'내용을 확인한 후 확정해 주세요.':'누락되었거나 미정인 내용을 입력해 주세요.'}`});
  }
  for(const [key,child] of Object.entries(value))if(child&&typeof child==='object')visit(child,path?`${path}.${key}`:key);
 }
 for(const key of ['contentSections','additionalInformation','notices','legalInformation'])visit(overview?.[key],key);
 return pending;
}
export function assertContentConfirmed(overview) {
 const errors=pendingContentConfirmations(overview);
 if(errors.length)throw Object.assign(new Error(`확인할 콘텐츠 ${errors.length}개가 남아 있습니다. 요청 요약에서 항목별로 확인·확정하거나 내용을 수정해 주세요.`),{statusCode:422,code:'CONTENT_CONFIRMATION_REQUIRED',errors,details:errors});
}
