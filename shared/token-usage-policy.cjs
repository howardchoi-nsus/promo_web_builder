// Generated from token-usage-policy.mjs. Do not edit; run npm run build:token-policy.
// The only authority for semantic target/property/state mapping.
const rule = (key, target, property, label, defaults = [], required = false, state = 'default') => ({key,target,property,label,defaults,required,state});
const TOKEN_USAGE_RULES = Object.freeze([
  rule('page.background','page','background-color','페이지 배경',['--color-bg-dark-800'],true),
  rule('text.primary','text','color','일반 텍스트 · 기본',[],true),
  rule('text.muted','text','color','일반 텍스트 · 보조'),
  rule('text.font','text','font-family','기본 글꼴',['--typography-body-lg-typeface','--typeface-roboto'],true),
  rule('text.bodySize','text','font-size','본문 크기',['--typography-body-md-font-size'],true),
  rule('text.titleSize','text','font-size','제목 크기',['--typography-title-lg-font-size'],true),
  rule('text.bodyWeight','text','font-weight','본문 굵기',['--font-weight-400']),
  rule('text.titleWeight','text','font-weight','제목 굵기',['--font-weight-700']),
  rule('text.bodyLineHeight','text','line-height','본문 줄 높이',['--typography-body-md-line-height','--typography-body-md-line-hight']),
  rule('text.titleLineHeight','text','line-height','제목 줄 높이',['--typography-title-lg-line-height','--typography-title-lg-line-hight']),
  rule('card.background','card','background-color','카드 배경',['--card-container-default'],true),
  rule('card.radius','card','border-radius','카드 모서리',['--border-radius-md']),
  rule('card.shadow','card','box-shadow','카드 그림자',['--shadow-elevation-1']),
  rule('card.padding','card','padding','카드 패딩',['--spacing-24']),
  rule('layout.gap','layout','gap','요소 간격',['--spacing-16']),
  rule('layout.padding','layout','padding','섹션 패딩',['--spacing-32']),
  rule('button.background','button','background-color','주요 버튼 배경',['--button-container-brand-default'],true),
  rule('button.color','button','color','주요 버튼 문구',['--button-label-on-color','--button-label-default'],true),
  rule('button.radius','button','border-radius','버튼 모서리',['--border-radius-md']),
  rule('button.padding','button','padding','버튼 좌우 패딩',['--spacing-16']),
  rule('button.border','button','border-color','버튼 테두리',['--button-border-brand-default']),
  rule('button.borderWidth','button','border-width','버튼 테두리 두께',['--border-width-sm','--border-width-1']),
  rule('button.font','button','font-family','버튼 글꼴',['--typography-body-lg-typeface','--typeface-roboto']),
  rule('button.lineHeight','button','line-height','버튼 줄 높이',['--typography-body-md-line-height','--typography-body-md-line-hight']),
  rule('button.size','button','font-size','버튼 글자 크기',['--typography-label-md-font-size']),
  rule('button.weight','button','font-weight','버튼 글자 굵기',['--font-weight-600']),
  rule('button.hoverBackground','button','background-color','버튼 배경 · hover',['--button-container-brand-hover'],false,'hover'),
  rule('button.pressedBackground','button','background-color','버튼 배경 · pressed',['--button-container-brand-pressed'],false,'pressed'),
  rule('button.disabledBackground','button','background-color','버튼 배경 · disabled',['--button-container-brand-disable'],false,'disabled'),
  rule('button.disabledColor','button','color','버튼 문구 · disabled',['--button-label-disable'],false,'disabled'),
  rule('divider.color','divider','border-color','구분선 색상'),
  rule('divider.width','divider','border-width','구분선 두께',['--border-width-sm','--border-width-1']),
]);
// Optional registered-only roles; old policies remain valid without these bindings.
const PAGE_STYLE_VARIANT_PROPERTIES = Object.freeze({
 text:['color','font-size','font-family','font-weight','line-height','letter-spacing'],
 page:['background-color','background-image','border-color','border-width','border-style'],
 card:['background-color','border-color','border-width','border-style'],
 button:['background-color','color','border-color','border-width','border-style'],
 icon:['color','font-size'],
 divider:['border-color','border-width','border-style'],
 layout:['min-height','height'],
});
// Stable version-1 role IDs: do not change this encoding for persisted documents.
function roleHash(value){let first=2166136261,second=2246822519;for(const character of value){const code=character.charCodeAt(0);first=Math.imul(first^code,16777619);second=Math.imul(second^code,3266489917);}return (first>>>0).toString(36).padStart(7,'0')+(second>>>0).toString(36).padStart(7,'0');}
function pageStyleRoles(context={}, {bounded=false}={}) {
 const result=[...TOKEN_USAGE_RULES];
 if(context.styleChoicesVersion!==1)return result;
 const catalog=context.tokenCatalog||[],values=context.tokenValues||{};
 for(const [target,properties] of Object.entries(PAGE_STYLE_VARIANT_PROPERTIES))for(const property of properties){
  const base={target,property,state:'default'};
  // Resolution keeps every registered alias; only new generation is bounded.
  let candidates=catalog.filter(token=>{
   const name=token.name||token.tokenKey;
   return /^--[a-zA-Z][a-zA-Z0-9-]*$/.test(name||'')&&!name.startsWith('--app-')&&typeof values[name]==='string'&&values[name]===token.value&&!/[;{}<>]|url\s*\(|expression\s*\(|@import/i.test(values[name])&&!(target==='text'&&property==='color'&&/^--color-bg-/.test(name))&&tokenAllowedForRule(token,base,catalog);
  }).sort((a,b)=>{
   const score=t=>/typography-(title|body|label)|text-|label-|border-/.test(t.name||t.tokenKey)?0:1;
   const left=a.name||a.tokenKey,right=b.name||b.tokenKey;
   return score(a)-score(b)||(left<right?-1:left>right?1:0);
  });
  if(bounded){
  const groups=new Map(),seenValues=new Set();
  for(const token of candidates){
   const name=token.name||token.tokenKey;
   const family=name.match(/^--(?:typography-(?:title|body|label)|color-[a-z]+|[a-z]+-[a-z]+)/)?.[0]||name;
   if(!groups.has(family))groups.set(family,[]);groups.get(family).push(token);
  }
  const limit=target==='text'?({'color':6,'font-size':8,'font-family':2,'font-weight':4,'line-height':8}[property]||4):target==='icon'?6:target==='layout'?3:property==='border-width'||property==='border-style'||property==='background-image'?3:4;
  candidates=[];
  while(candidates.length<limit&&[...groups.values()].some(group=>group.length))for(const group of groups.values()){
   const token=group.shift();if(!token||seenValues.has(token.value))continue;
   seenValues.add(token.value);candidates.push(token);if(candidates.length===limit)break;
  }
  }
  for(const token of candidates){const name=token.name||token.tokenKey;result.push({key:`registered.${target}.v${roleHash(property+':'+name)}`,target,property,state:'default',label:name,token:name,registeredVariant:true});}
 }
 return result;
}
function pageGenerationStyleRoles(context={}){
 const roles=pageStyleRoles(context,{bounded:true});
 if(context.styleChoicesVersion!==1)return roles;
 const pinned=new Set(context.pinnedStyleRoles||[]);
 if(pinned.size)for(const role of pageStyleRoles(context))if(pinned.has(role.key)&&!roles.some(existing=>existing.key===role.key))roles.push(role);
 return roles.filter(role=>!['border-color','border-width','border-style'].includes(role.property)||['border-color','border-width','border-style'].every(property=>roles.some(candidate=>candidate.target===role.target&&candidate.property===property&&context.tokenValues?.[pageStyleToken(context,candidate)])));
}
function pageStyleWarnings(context={}){
 if(context.styleChoicesVersion!==1)return [];
 const roles=pageStyleRoles(context);
 return ['page','card','button','divider'].flatMap(target=>{
  const missing=['border-color','border-width','border-style'].filter(property=>!roles.some(role=>role.target===target&&role.property===property&&context.tokenValues?.[pageStyleToken(context,role)]));
  return missing.length?[{code:'BORDER_TOKEN_SET_INCOMPLETE',level:'warning',tier:'designWarning',path:target,missingProperties:missing,message:`${target} 보더에 사용할 수 있는 등록 매핑이 없습니다: ${missing.join(', ')}. 기존 색상·두께 토큰을 유지하며 누락 속성을 임의 값으로 대체하지 않습니다.`}]:[];
 });
}
function pageStyleToken(context,role){return role?.registeredVariant?role.token:context.usagePolicy?.bindings?.[role?.key];}
function pageNodeStyleRules(node, view, context, targets, resolvedRoles=pageStyleRoles(context)) {
 const result=new Map();
 const defaults=node.type==='text'?['text.primary','text.font',node.role==='heading'?'text.titleSize':'text.bodySize']:node.type==='button'?['button.background','button.color']:node.type==='divider'?['divider.color','divider.width']:node.type==='container'&&node.role==='page'?['page.background']:[];
 for(const role of [...defaults,...node.styles.base,...(view==='desktop'?[]:node.styles[view]||[])]){
  const rule=resolvedRoles.find(r=>r.key===role),token=pageStyleToken(context,rule);
  if(rule&&targets.includes(rule.target)&&/^--[a-zA-Z][a-zA-Z0-9-]*$/.test(token||'')&&Object.hasOwn(context.tokenValues||{},token))result.set(`${rule.property}:${rule.state}`,{...rule,token});
 }
 if(context.styleChoicesVersion===1&&node.type==='icon')for(const [property,reference] of [['color','text.primary'],['font-size','text.bodySize']])if(!result.has(property+':default')){
  const candidates=resolvedRoles.filter(rule=>rule.target==='icon'&&rule.property===property&&pageStyleToken(context,rule));
  const candidate=candidates.find(rule=>pageStyleToken(context,rule)===context.usagePolicy?.bindings?.[reference])||candidates[0];
  if(candidate)result.set(property+':default',{...candidate,token:pageStyleToken(context,candidate)});
 }
 if(context.styleChoicesVersion===1&&(node.type==='divider'||['border-color:default','border-width:default','border-style:default'].some(key=>result.has(key)))){
  for(const property of ['border-color','border-width','border-style'])if(!result.has(property+':default')){
   const candidates=resolvedRoles.filter(rule=>targets.includes(rule.target)&&rule.property===property&&pageStyleToken(context,rule));
   const candidate=property==='border-style'?candidates.find(rule=>context.tokenValues[pageStyleToken(context,rule)]==='solid')||candidates[0]:candidates[0];
   if(candidate)result.set(property+':default',{...candidate,token:pageStyleToken(context,candidate)});
  }
 }
 return [...result.values()];
}
const COMPONENT_SCOPES = new Set(['button','card','icon','checkbox','chip','field','modal','navigation','radio','select','tab','tooltip','toast','badge','switch','avatar','divider','progress','slider']);
function tokenScope(name) {
  const prefix=String(name||'').replace(/^--/,'').split('-')[0];
  return COMPONENT_SCOPES.has(prefix) ? prefix : 'shared';
}
function tokenAllowedForRule(token, rule, catalog = []) {
  if(!token || !rule || token.state==='incomplete' || token.state==='draft') return false;
  const name=token.name||token.tokenKey;
  if (/^--render-policy-/.test(name)) return false;
  const scope=tokenScope(name);
  if(scope!=='shared' && scope!==rule.target) return false;
  const properties=token.cssProperties||[];
  if(!properties.includes(rule.property)) return false;
  if (token.reference && catalog.length) {
    const byName = new Map(catalog.map(entry=>[entry.name||entry.tokenKey,entry]));
    const seen = new Set([name]); let reference = token.reference;
    while (reference) {
      if (seen.has(reference)) return false;
      seen.add(reference);
      const next=byName.get(reference);
      if(!next) return false;
      const sourceScope=tokenScope(reference);
      if(sourceScope!=='shared'&&sourceScope!==rule.target) return false;
      reference=next.reference;
    }
  }
  if(rule.state==='default' && /-(hover|pressed|disable|disabled|selected|focused)$/.test(name)) return false;
  if(rule.state!=='default') {
    const state=rule.state==='disabled'?'(?:disable|disabled)':rule.state;
    if(scope!=='shared' && !new RegExp(`-${state}$`).test(name)) return false;
  }
  return true;
}
function createTokenUsageDraft(catalog=[]) {
  return {schemaVersion:1,bindings:Object.fromEntries(TOKEN_USAGE_RULES.map(rule=>[
    rule.key,rule.defaults.find(name=>catalog.some(token=>(token.name||token.tokenKey)===name && tokenAllowedForRule(token,rule,catalog)))||''
  ]))};
}
function validateTokenUsagePolicy(policy,catalog=[],{activation=false}={}) {
  const errors=[];const missing=[];const definitions=new Map(catalog.map(token=>[token.name||token.tokenKey,token]));
  if(policy?.schemaVersion!==1 || !policy.bindings || typeof policy.bindings!=='object' || Array.isArray(policy.bindings)) return {ok:false,errors:[{code:'INVALID_POLICY',message:'정책 형식이 올바르지 않습니다.'}],missing:[]};
  for(const key of Object.keys(policy.bindings)) if(!TOKEN_USAGE_RULES.some(rule=>rule.key===key)) errors.push({key,code:'UNKNOWN_POLICY_RULE',message:'지원하지 않는 정책 항목입니다.'});
  for(const rule of TOKEN_USAGE_RULES) {
    const name=policy.bindings[rule.key];
    if(!name){if(rule.required) missing.push(rule.key);continue;}
    if(typeof name!=='string'||!tokenAllowedForRule(definitions.get(name),rule,catalog)) errors.push({key:rule.key,token:name,code:'TOKEN_USAGE_MISMATCH',message:`${rule.label}: 등록 여부·대상·속성·상태를 확인하세요.`});
  }
  if(activation) for(const key of missing) errors.push({key,code:'REQUIRED_MAPPING_MISSING',message:`필수 연결이 없습니다: ${TOKEN_USAGE_RULES.find(rule=>rule.key===key).label}`});
  return {ok:!errors.length,errors,missing};
}
function usageToken(policy,key,values={}) {
  const token=policy?.bindings?.[key];
  return typeof token==='string' && typeof values[token]==='string' && values[token].trim()?token:'';
}
function usageBindings(policy,values={}) {
  const get=key=>usageToken(policy,key,values);
  return {background:get('page.background'),surface:get('card.background'),text:get('text.primary'),muted:get('text.muted'),accent:get('button.background'),onAccent:get('button.color'),radius:get('card.radius'),shadow:get('card.shadow'),font:get('text.font')};
}
function usageRuntimeStyle(policy,values={}) {
  const roles={
    '--promo-bg':'page.background','--promo-ink':'text.primary','--promo-muted-ink':'text.muted','--promo-font':'text.font',
    '--promo-font-size-body':'text.bodySize','--promo-title-size':'text.titleSize','--promo-font-weight-body':'text.bodyWeight','--promo-font-weight-title':'text.titleWeight',
    '--promo-line-height-body':'text.bodyLineHeight','--promo-line-height-title':'text.titleLineHeight',
    '--promo-component-radius':'card.radius','--promo-component-shadow':'card.shadow','--component-content-padding':'card.padding',
    '--component-field-gap':'layout.gap','--promo-layout-gap':'layout.gap','--promo-layout-padding':'layout.padding',
    '--promo-cta-bg':'button.background','--promo-cta':'button.background','--promo-accent':'button.background','--promo-cta-ink':'button.color',
    '--promo-cta-radius':'button.radius','--promo-space-4':'button.padding','--promo-button-border':'button.border','--promo-border-width':'button.borderWidth',
    '--promo-button-font':'button.font','--promo-button-line-height':'button.lineHeight','--promo-font-size-button':'button.size','--promo-button-weight':'button.weight',
    '--promo-button-hover-bg':'button.hoverBackground','--promo-button-pressed-bg':'button.pressedBackground','--promo-button-disabled-bg':'button.disabledBackground','--promo-button-disabled-color':'button.disabledColor',
  };
  return Object.fromEntries(Object.entries(roles).flatMap(([alias,key])=>{const token=usageToken(policy,key,values);return token?[[alias.replace(/^--promo-/, '--render-policy-').replace(/^--component-/, '--render-policy-component-'),`var(${token})`]]:[];}));
}
function policyPermitsToken(policy,{target,property,state='default',tokenKey}) {
  return TOKEN_USAGE_RULES.some(rule=>rule.target===target&&rule.property===property&&rule.state===state&&policy?.bindings?.[rule.key]===tokenKey);
}

function targetForProperty(property,{fieldKind='',tag='',sectionRole=''}={}) {
  if(fieldKind==='cta'||['a','button'].includes(tag)) return 'button';
  if(['gap','padding','margin'].includes(property)) return property==='padding'?'card':'layout';
  if(['background-color','border-radius','box-shadow'].includes(property)) return ['section','main'].includes(tag)||sectionRole==='page'?'page':'card';
  return 'text';
}
function usageAssignmentErrors(policy,{tokenKey,property,target,state='default',path=''}) {
 return policyPermitsToken(policy,{target,property,state,tokenKey})?[]:[{code:'TOKEN_USAGE_POLICY_MISMATCH',path,tokenKey,target,property,state,message:'등록 토큰의 대상·속성·상태가 중앙 정책과 다릅니다.'}];
}
function usageCatalog(policy,catalog=[]) {
 const rulesByToken=new Map();
 for(const rule of TOKEN_USAGE_RULES){const key=policy?.bindings?.[rule.key];if(key){if(!rulesByToken.has(key))rulesByToken.set(key,[]);rulesByToken.get(key).push(rule);}}
 return catalog.filter(token=>rulesByToken.has(token.tokenKey||token.name)).map(token=>({...token,usageRules:rulesByToken.get(token.tokenKey||token.name)}));
}

function policySelectableTokens(policy,catalog=[]) {
 return usageCatalog(policy,catalog).map(token=>{
  const rule=token.usageRules.find(rule=>rule.state==='default')||token.usageRules[0];
  const semanticRole=rule.key==='text.muted'?'muted-color':rule.property==='color'?'text-color':rule.property==='background-color'?(rule.target==='button'?'accent-color':rule.target==='page'?'background-color':'surface-color'):({'border-radius':'radius','box-shadow':'shadow','font-family':'font-family','font-size':'title-size','padding':'spacing','gap':'spacing'})[rule.property]||rule.property;
  return {...token,tokenKey:token.tokenKey||token.name,cssProperty:rule.property,semanticRole,aiSelectable:true};
 });
}

function styleCssProperty(property) {
 const key=String(property||'').replace(/Token$/,'');
 return ({radius:'border-radius',shadow:'box-shadow',textColor:'color',surfaceColor:'background-color',accentColor:'background-color'})[key] || key.replace(/[A-Z]/g,letter=>`-${letter.toLowerCase()}`);
}

module.exports = { TOKEN_USAGE_RULES, PAGE_STYLE_VARIANT_PROPERTIES, pageStyleRoles, pageGenerationStyleRoles, pageStyleWarnings, pageStyleToken, pageNodeStyleRules, tokenScope, tokenAllowedForRule, createTokenUsageDraft, validateTokenUsagePolicy, usageToken, usageBindings, usageRuntimeStyle, policyPermitsToken, targetForProperty, usageAssignmentErrors, usageCatalog, policySelectableTokens, styleCssProperty };
