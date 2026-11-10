import {layoutTokenPolicy} from '../layout-token-policy.mjs';
import { TOKEN_USAGE_RULES } from '../token-usage-policy.mjs';
export const views = ['desktop', 'tablet', 'mobile'];
export function safeUrl(value) {
 const s=String(value||''); if(!s||/[\s\\\u0000-\u001f\u007f]/u.test(s)||s.startsWith('//'))return '';
 if(/^(?:\/(?!\/)|#)/u.test(s))return s;
 try {const u=new URL(s),h=u.hostname.toLowerCase();return u.protocol==='https:'&&!u.username&&!u.password&&h!=='localhost'&&!h.endsWith('.local')&&!h.includes(':')&&!/^(127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)?s:'';}catch{return '';}
}
export function nodes(page) {const out=[],pending=[page?.root];while(pending.length&&out.length<201){const n=pending.pop();if(!n)continue;out.push(n);if(Array.isArray(n.children))pending.push(...[...n.children].reverse());}return out;}
export function effectiveLayout(node, view) {
 const base=node.layout.desktop, override=node.layout[view];
 const layout={...base,...Object.fromEntries(Object.entries(override||{}).filter(([,v])=>v!==null))};
 if(view==='mobile'&&!override){if(node.type==='grid')layout.columns=[1];if(node.type==='stack')layout.direction='column';layout.columnSpan=1;}
 if(view==='tablet'&&!override&&node.type==='grid'&&layout.columns.length>2)layout.columns=[1,1];
 return layout;
}
export function nodeTargets(node) {return node.type==='container'?(node.role==='group'?['layout']:['page','layout']):({grid:['layout'],stack:['layout'],card:['card','layout'],text:['text'],button:['button','layout'],input:['input','layout'],image:['image','layout'],divider:['divider','layout'],icon:['icon','layout'],video:['video','layout']}[node.type]||[]);}
export function styleRules(node, view, context) {
 const result=new Map();
 const defaults=node.type==='text'?['text.primary','text.font',node.role==='heading'?'text.titleSize':'text.bodySize']:node.type==='button'?['button.background','button.color']:node.type==='divider'?['divider.color','divider.width']:node.type==='container'&&node.role==='page'?['page.background']:[];
 for(const role of [...defaults,...node.styles.base,...(view==='desktop'?[]:node.styles[view]||[])]){
  const rule=TOKEN_USAGE_RULES.find(r=>r.key===role),token=context.usagePolicy?.bindings?.[role];
  if(rule&&nodeTargets(node).includes(rule.target)&&/^--[a-zA-Z][a-zA-Z0-9-]*$/.test(token||'')&&Object.hasOwn(context.tokenValues||{},token))result.set(`${rule.property}:${rule.state}`,{...rule,token});
 }
 return [...result.values()];
}
export function tokenVariables(context) {
 return Object.fromEntries(Object.entries(context.tokenValues||{}).filter(([key,value])=>(context.tokenCatalog||[]).some(token=>(token.name||token.tokenKey)===key&&token.state!=='draft'&&token.state!=='incomplete')&&/^--[a-zA-Z][a-zA-Z0-9-]*$/.test(key)&&!key.startsWith('--app-')&&typeof value==='string'&&!/[;{}<>]|url\s*\(|expression\s*\(|@import/i.test(value)));
}
export function textContent(node,context) {return node.contentMode==='source'?String(context.contentSources?.[node.sourceIds?.[0]]?.text||''):String(node.text||'');}
// Translate logical AI columns into spans on the registered physical grid.
export function gridTrackSpans(weights,budget){
 const raw=weights.map(value=>budget*value/weights.reduce((sum,n)=>sum+n,0));
 const spans=raw.map(value=>Math.max(1,Math.floor(value)));
 let remaining=budget-spans.reduce((sum,n)=>sum+n,0);
 while(remaining!==0){
  const indices=spans.map((_,index)=>index).filter(index=>remaining>0||spans[index]>1);
  if(!indices.length)break;
  indices.sort((a,b)=>remaining>0?(raw[b]-spans[b])-(raw[a]-spans[a]):(spans[b]-raw[b])-(spans[a]-raw[a]));
  spans[indices[0]]+=remaining>0?1:-1;remaining+=remaining>0?-1:1;
 }
 return spans;
}
export function pageCss(page,context,scope) {
 if(!/^ps-[a-zA-Z0-9_-]+$/.test(scope))return '';
 const policy=layoutTokenPolicy(context);if(!policy.ok)return '';
 const rules={desktop:[],desktopWide:[],tablet:[],mobile:[]};
 for(const node of nodes(page)){
  if(!/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(node.id||''))continue;
  for(const view of ['desktop','desktopWide','tablet','mobile']){const l=effectiveLayout(node,view==='desktopWide'?'desktop':view),selector=`[data-ps-scope="${scope}"] [data-ps-node="${node.id}"]`;
   const props={ 'align-items':({start:'flex-start',end:'flex-end',center:'center',stretch:'stretch'})[l.align], 'justify-content':({start:'flex-start',end:'flex-end',center:'center','space-between':'space-between'})[l.justify],width:l.width==='fill'?'100%':l.width==='fit-content'?'fit-content':'auto','grid-column':`span ${Math.max(1,Math.min(12,Number(l.columnSpan)||1))}`};
   if(['container','stack','card'].includes(node.type)){props.display='flex';props['flex-direction']=l.direction==='row'?'row':'column';props['flex-wrap']='wrap';}
   if(node.type==='divider')props[node.direction==='vertical'?'border-left-style':'border-top-style']='solid';
   if(node.type==='grid'){props.display='grid';props['grid-template-columns']=`repeat(var(${policy.profiles[view].columns}),minmax(0,1fr))`;}
   const spacing={...(node.styles.spacing?.base||{}),...(['desktop','desktopWide'].includes(view)?{}:Object.fromEntries(Object.entries(node.styles.spacing?.[view]||{}).filter(([,value])=>value!==null)))};
   for(const [property,token] of Object.entries(spacing))if(token&&policy.spacing.includes(token))props[property]=`var(${token})`;
   if(node.type==='grid'&&!spacing.gap&&!node.styles.base.some(role=>role==='layout.gap'))props['column-gap']=`var(${policy.profiles[view].gutter})`;
   if(node===page.root)props['padding-inline']=`var(${policy.profiles[view].margin})`;
   const defaults=Object.entries(props).filter(([,v])=>v).map(([k,v])=>`${k}:${v}`).join(';');
   const byState={default:[],hover:[],pressed:[],disabled:[]};
   for(const r of styleRules(node,view,context))if(!spacing[r.property])byState[r.state]?.push(`${r.property}:var(${r.token})`);
   rules[view].push(`${selector}{${defaults};${byState.default.join(';')}${node===page.root?`;padding-inline:var(${policy.profiles[view].margin})`:''}}`);
   if(node.type==='grid'){
    const weights=l.columns?.length?l.columns:[1],tracks=gridTrackSpans(weights,Number(context.tokenValues[policy.profiles[view].columns]));let cursor=0;
    for(const child of node.children){const logicalSpan=Math.min(weights.length,effectiveLayout(child,view==='desktopWide'?'desktop':view).columnSpan);if(cursor+logicalSpan>weights.length)cursor=0;
     const start=1+tracks.slice(0,cursor).reduce((sum,n)=>sum+n,0),end=start+tracks.slice(cursor,cursor+logicalSpan).reduce((sum,n)=>sum+n,0);
     rules[view].push(`${selector}>[data-ps-node="${child.id}"]{grid-column:${start}/${end}}`);cursor=(cursor+logicalSpan)%weights.length;
    }
   }
   for(const [state,pseudo] of [['hover',':hover'],['pressed',':active'],['disabled',':disabled']])if(byState[state].length)rules[view].push(`${selector}${pseudo}{${byState[state].join(';')}}`);
  }
 }
 const explicit=view=>rules[view].join('\n').replaceAll(`[data-ps-scope="${scope}"]`,`[data-ps-scope="${scope}"][data-ps-viewport="${view}"]`);
 const auto=view=>rules[view].join('\n').replaceAll(`[data-ps-scope="${scope}"]`,`[data-ps-scope="${scope}"]:not([data-ps-viewport])`);
 return `${auto('mobile')}\n@media(min-width:${context.tokenValues[policy.breakpoints.tablet]}){${auto('tablet')}}\n@media(min-width:${context.tokenValues[policy.breakpoints.desktop]}){${auto('desktop')}}\n@media(min-width:${context.tokenValues[policy.breakpoints.wide]}){${auto('desktopWide')}}\n${views.map(explicit).join('\n')}`;
}
