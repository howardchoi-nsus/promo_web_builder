// Layout design values come exclusively from the pinned registered library.
const PROFILES = Object.freeze({desktopWide:'desktop-1920',desktop:'desktop-1440',tablet:'tablet-768',mobile:'mobile-375'});
function layoutTokenPolicy(context={}) {
 const values=context.tokenValues||{},catalog=new Map((context.tokenCatalog||[]).map(t=>[t.name||t.tokenKey,t]));
 const errors=[],profiles={};
 const required=(key,kind)=>{
  const value=values[key],registered=catalog.get(key);
  if(!registered||registered.state==='draft'||registered.state==='incomplete'||typeof value!=='string'||!value.trim())errors.push({code:'LAYOUT_TOKEN_REQUIRED',path:key,message:`등록된 레이아웃 토큰이 필요합니다: ${key}`});
  else if(kind==='count'?!/^[1-9]\d*$/.test(value)||Number(value)>64:!/^\d+(?:\.\d+)?px$/.test(value))errors.push({code:'LAYOUT_TOKEN_INVALID',path:key,message:`레이아웃 기준은 컬럼 정수 또는 px 단위여야 합니다: ${key}`});
  return key;
 };
 for(const [view,name] of Object.entries(PROFILES))profiles[view]={columns:required(`--grid-${name}-columns`,'count'),gutter:required(`--grid-${name}-gutter`),margin:required(`--grid-${name}-margin-inline`)};
 const tablet=required('--breakpoint-tablet-min'),desktop=required('--breakpoint-desktop-min'),wide=required('--grid-reference-desktop-1920-width');
 if(!errors.length&&!(parseFloat(values[tablet])>0&&parseFloat(values[tablet])<parseFloat(values[desktop])&&parseFloat(values[desktop])<parseFloat(values[wide])))errors.push({code:'LAYOUT_BREAKPOINT_ORDER',path:'breakpoints',message:'태블릿·데스크톱·와이드 기준을 오름차순으로 설정하세요.'});
 const spacing=Object.keys(values).filter(key=>/^--spacing-[a-z0-9-]+$/.test(key)&&catalog.has(key)&&/^(?:0|\d+(?:\.\d+)?(?:px|rem|em))$/.test(values[key]));
 return {ok:!errors.length,errors,profiles,breakpoints:{tablet,desktop,wide},spacing};
}
function assertLayoutTokens(context){const result=layoutTokenPolicy(context);if(!result.ok)throw Object.assign(new Error('등록된 그리드·반응형 토큰을 확인해 주세요.'),{code:'LAYOUT_TOKEN_POLICY_INVALID',statusCode:422,errors:result.errors});return result;}
function previewReference(context={},view='desktop'){
 const profile={desktop:'desktop-1440',tablet:'tablet-768',mobile:'mobile-375'}[view];
 const key=profile&&`--grid-reference-${profile}-width`;
 const registered=(context.tokenCatalog||[]).find(t=>(t.name||t.tokenKey)===key&&!['draft','incomplete'].includes(t.state));
 const value=context.tokenValues?.[key];
 return registered&&/^\d+(?:\.\d+)?px$/.test(value||'')&&parseFloat(value)>0?{key,width:parseFloat(value)}:null;
}
module.exports={PROFILES,layoutTokenPolicy,assertLayoutTokens,previewReference};
