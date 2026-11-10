// The only authority for semantic target/property/state mapping.
const rule = (key, target, property, label, defaults = [], required = false, state = 'default') => ({key,target,property,label,defaults,required,state});
export const TOKEN_USAGE_RULES = Object.freeze([
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
  rule('button.borderWidth','button','border-width','버튼 테두리 두께',['--border-width-1']),
  rule('button.font','button','font-family','버튼 글꼴',['--typography-body-lg-typeface','--typeface-roboto']),
  rule('button.lineHeight','button','line-height','버튼 줄 높이',['--typography-body-md-line-height','--typography-body-md-line-hight']),
  rule('button.size','button','font-size','버튼 글자 크기',['--typography-label-md-font-size']),
  rule('button.weight','button','font-weight','버튼 글자 굵기',['--font-weight-600']),
  rule('button.hoverBackground','button','background-color','버튼 배경 · hover',['--button-container-brand-hover'],false,'hover'),
  rule('button.pressedBackground','button','background-color','버튼 배경 · pressed',['--button-container-brand-pressed'],false,'pressed'),
  rule('button.disabledBackground','button','background-color','버튼 배경 · disabled',['--button-container-brand-disable'],false,'disabled'),
  rule('button.disabledColor','button','color','버튼 문구 · disabled',['--button-label-disable'],false,'disabled'),
]);
const COMPONENT_SCOPES = new Set(['button','card','checkbox','chip','field','modal','navigation','radio','select','tab','tooltip','toast','badge','switch','avatar','divider','progress','slider']);
export function tokenScope(name) {
  const prefix=String(name||'').replace(/^--/,'').split('-')[0];
  return COMPONENT_SCOPES.has(prefix) ? prefix : 'shared';
}
export function tokenAllowedForRule(token, rule, catalog = []) {
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
export function createTokenUsageDraft(catalog=[]) {
  return {schemaVersion:1,bindings:Object.fromEntries(TOKEN_USAGE_RULES.map(rule=>[
    rule.key,rule.defaults.find(name=>catalog.some(token=>(token.name||token.tokenKey)===name && tokenAllowedForRule(token,rule,catalog)))||''
  ]))};
}
export function validateTokenUsagePolicy(policy,catalog=[],{activation=false}={}) {
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
export function usageToken(policy,key,values={}) {
  const token=policy?.bindings?.[key];
  return typeof token==='string' && typeof values[token]==='string' && values[token].trim()?token:'';
}
export function usageBindings(policy,values={}) {
  const get=key=>usageToken(policy,key,values);
  return {background:get('page.background'),surface:get('card.background'),text:get('text.primary'),muted:get('text.muted'),accent:get('button.background'),onAccent:get('button.color'),radius:get('card.radius'),shadow:get('card.shadow'),font:get('text.font')};
}
export function usageRuntimeStyle(policy,values={}) {
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
export function policyPermitsToken(policy,{target,property,state='default',tokenKey}) {
  return TOKEN_USAGE_RULES.some(rule=>rule.target===target&&rule.property===property&&rule.state===state&&policy?.bindings?.[rule.key]===tokenKey);
}

export function targetForProperty(property,{fieldKind='',tag='',sectionRole=''}={}) {
  if(fieldKind==='cta'||['a','button'].includes(tag)) return 'button';
  if(['gap','padding','margin'].includes(property)) return property==='padding'?'card':'layout';
  if(['background-color','border-radius','box-shadow'].includes(property)) return ['section','main'].includes(tag)||sectionRole==='page'?'page':'card';
  return 'text';
}
export function usageAssignmentErrors(policy,{tokenKey,property,target,state='default',path=''}) {
 return policyPermitsToken(policy,{target,property,state,tokenKey})?[]:[{code:'TOKEN_USAGE_POLICY_MISMATCH',path,tokenKey,target,property,state,message:'등록 토큰의 대상·속성·상태가 중앙 정책과 다릅니다.'}];
}
export function usageCatalog(policy,catalog=[]) {
 const rulesByToken=new Map();
 for(const rule of TOKEN_USAGE_RULES){const key=policy?.bindings?.[rule.key];if(key){if(!rulesByToken.has(key))rulesByToken.set(key,[]);rulesByToken.get(key).push(rule);}}
 return catalog.filter(token=>rulesByToken.has(token.tokenKey||token.name)).map(token=>({...token,usageRules:rulesByToken.get(token.tokenKey||token.name)}));
}

export function policySelectableTokens(policy,catalog=[]) {
 return usageCatalog(policy,catalog).map(token=>{
  const rule=token.usageRules.find(rule=>rule.state==='default')||token.usageRules[0];
  const semanticRole=rule.key==='text.muted'?'muted-color':rule.property==='color'?'text-color':rule.property==='background-color'?(rule.target==='button'?'accent-color':rule.target==='page'?'background-color':'surface-color'):({'border-radius':'radius','box-shadow':'shadow','font-family':'font-family','font-size':'title-size','padding':'spacing','gap':'spacing'})[rule.property]||rule.property;
  return {...token,tokenKey:token.tokenKey||token.name,cssProperty:rule.property,semanticRole,aiSelectable:true};
 });
}

export function styleCssProperty(property) {
 const key=String(property||'').replace(/Token$/,'');
 return ({radius:'border-radius',shadow:'box-shadow',textColor:'color',surfaceColor:'background-color',accentColor:'background-color'})[key] || key.replace(/[A-Z]/g,letter=>`-${letter.toLowerCase()}`);
}
