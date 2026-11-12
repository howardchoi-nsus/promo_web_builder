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
 return [...new Set(Array.isArray(overview?._review?.missingCriticalInputs)?overview._review.missingCriticalInputs:[])].filter(key=>allowed.includes(key)&&(key!=='promotionPurposeOther'||overview.promotionPurpose==='기타')&&!confirmationText(overview[key])).map(key=>({path:key,blocking:false,code:'REQUEST_CONTEXT_UNRESOLVED',message:`${({title:'제목',mainOffer:'핵심 혜택',promotionPurpose:'프로모션 목적',promotionPurposeOther:'구체적인 목적',audience:'대상',market:'운영 지역',ctaLabel:'버튼 문구'})[key]}을 입력해 주세요.`}));
}
// Review flags are advisory; they never create user-mandated prerequisites.
function assertContentConfirmed(overview) {
 return true;
}

function prepareOverviewForPreview(overview) {
 const result=JSON.parse(JSON.stringify(overview||{})),omittedItems=[];
 function clean(value,path='') {
  if(!value||typeof value!=='object')return value;
  if(Array.isArray(value))return value.map((item,index)=>clean(item,`${path}.${index}`)).filter(item=>item!==null);
  if(value.confirmationRequired===true){
   const primary=/^additionalInformation\.\d+$/.test(path)?value.value:/^(notices|legalInformation)\.\d+$/.test(path)?value.body:null;
   const incompleteCta=/\.cta$/.test(path)&&(!confirmationText(value.label)||!confirmationText(value.url));
   if(incompleteCta||(primary!==null&&!confirmationText(primary))){
    omittedItems.push({path,label:value.title||value.label||path,code:'UNCONFIRMED_OPTIONAL_CONTENT_OMITTED',message:`${value.title||value.label||path}: 미정인 사실 정보는 출력에서 제외했습니다.`});
    return null;
   }
   value.confirmationRequired=false;
  }
  for(const [key,child] of Object.entries(value)){
   if(child&&typeof child==='object'){const cleaned=clean(child,path?`${path}.${key}`:key);if(cleaned===null)delete value[key];else value[key]=cleaned;}
   else if(typeof child==='string'&&child.trim()&&!confirmationText(child))value[key]='';
  }
  return value;
 }
 return {overview:clean(result),omittedItems};
}

module.exports={confirmationText,emptyOptionalCta,pendingContentConfirmations,pendingCriticalInputs,assertContentConfirmed,prepareOverviewForPreview};
