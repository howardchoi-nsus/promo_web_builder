// Generated from content-confirmation.mjs; run build:token-policy.
// Shared by requirements review and server validation. Approval never fabricates copy.
function confirmationText(value) {
 return typeof value === 'string' && value.trim() && !/^(?:확인\s*필요|미입력|미정|추후\s*확인|입력\s*필요|tbd|to be confirmed)[.!\s]*$/i.test(value.trim());
}
function emptyOptionalCta(value,path) {
 return /\.cta$/.test(path) && !String(value?.label||'').trim() && !String(value?.url||'').trim();
}
function pendingContentConfirmations(overview) {
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
function pendingCriticalInputs(overview) {
 const allowed=['title','mainOffer','promotionPurpose','promotionPurposeOther','audience','market','ctaLabel'];
 return [...new Set(Array.isArray(overview?._review?.missingCriticalInputs)?overview._review.missingCriticalInputs:[])].filter(key=>allowed.includes(key)&&(key!=='promotionPurposeOther'||overview.promotionPurpose==='기타')&&!confirmationText(overview[key])).map(key=>({path:key,blocking:['title','mainOffer'].includes(key),code:['title','mainOffer'].includes(key)?'CRITICAL_INPUT_REQUIRED':'REQUEST_CONTEXT_UNRESOLVED',message:`${({title:'제목',mainOffer:'핵심 혜택',promotionPurpose:'프로모션 목적',promotionPurposeOther:'구체적인 목적',audience:'대상',market:'운영 지역',ctaLabel:'버튼 문구'})[key]}을 입력해 주세요.`}));
}
function assertContentConfirmed(overview) {
 const errors=[...pendingCriticalInputs(overview).filter(item=>item.blocking),...pendingContentConfirmations(overview)];
 if(errors.length)throw Object.assign(new Error(`확인할 콘텐츠 ${errors.length}개가 남아 있습니다. 요청 요약에서 항목별로 확인·확정하거나 내용을 수정해 주세요.`),{statusCode:422,code:'CONTENT_CONFIRMATION_REQUIRED',errors,details:errors});
}

// An incomplete optional action/supporting fact is omitted, never guessed.
// Required items, notices and legal text still require explicit confirmation.
function prepareOverviewForPreview(overview) {
 const result=JSON.parse(JSON.stringify(overview||{})),omittedItems=[];
 const pending=pendingContentConfirmations(result);
 for(const item of pending){
  if(item.canConfirm||!(/^additionalInformation\.\d+$/.test(item.path)||/\.cta$/.test(item.path)))continue;
  const parts=item.path.split('.'),key=parts.pop();
  const parent=parts.reduce((value,part)=>value?.[part],result);
  if(!parent)continue;
  if(Array.isArray(parent))parent[Number(key)]=null;else delete parent[key];
  omittedItems.push({path:item.path,label:item.label,code:'UNCONFIRMED_OPTIONAL_CONTENT_OMITTED',message:`${item.label}: 미확정 선택 항목을 이번 출력에서 제외했습니다.`});
 }
 if(Array.isArray(result.additionalInformation))result.additionalInformation=result.additionalInformation.filter(Boolean);
 return {overview:result,omittedItems};
}

module.exports={confirmationText,emptyOptionalCta,pendingContentConfirmations,pendingCriticalInputs,assertContentConfirmed,prepareOverviewForPreview};
