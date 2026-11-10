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
 const defaults=node.type==='text'?['text.primary','text.font',node.role==='heading'?'text.titleSize':'text.bodySize']:node.type==='button'?['button.background','button.color']:node.type==='container'&&node.role==='page'?['page.background']:[];
 for(const role of [...defaults,...node.styles.base,...(view==='desktop'?[]:node.styles[view]||[])]){
  const rule=TOKEN_USAGE_RULES.find(r=>r.key===role),token=context.usagePolicy?.bindings?.[role];
  if(rule&&nodeTargets(node).includes(rule.target)&&/^--[a-zA-Z][a-zA-Z0-9-]*$/.test(token||'')&&Object.hasOwn(context.tokenValues||{},token))result.set(`${rule.property}:${rule.state}`,{...rule,token});
 }
 return [...result.values()];
}
export function tokenVariables(context) {
 return Object.fromEntries(Object.entries(context.tokenValues||{}).filter(([key,value])=>/^--[a-zA-Z][a-zA-Z0-9-]*$/.test(key)&&typeof value==='string'&&!/[;{}<>]|url\s*\(|expression\s*\(|@import/i.test(value)));
}
export function textContent(node,context) {return node.contentMode==='source'?String(context.contentSources?.[node.sourceIds?.[0]]?.text||''):String(node.text||'');}
export function pageCss(page,context,scope) {
 if(!/^ps-[a-zA-Z0-9_-]+$/.test(scope))return '';
 const rules={desktop:[],tablet:[],mobile:[]};
 for(const node of nodes(page)){
  if(!/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(node.id||''))continue;
  for(const view of views){const l=effectiveLayout(node,view),selector=`[data-ps-scope="${scope}"] [data-ps-node="${node.id}"]`;
   const props={ 'align-items':({start:'flex-start',end:'flex-end',center:'center',stretch:'stretch'})[l.align], 'justify-content':({start:'flex-start',end:'flex-end',center:'center','space-between':'space-between'})[l.justify],width:l.width==='fill'?'100%':l.width==='fit-content'?'fit-content':'auto','grid-column':`span ${Math.max(1,Math.min(12,Number(l.columnSpan)||1))}`};
   if(['container','stack','card'].includes(node.type)){props.display='flex';props['flex-direction']=l.direction==='row'?'row':'column';props['flex-wrap']='wrap';}
   if(node.type==='grid'){props.display='grid';props['grid-template-columns']=(l.columns?.length?l.columns:[1]).map(n=>`minmax(0,${Math.max(.01,Math.min(12,Number(n)||1))}fr)`).join(' ');}
   const defaults=Object.entries(props).filter(([,v])=>v).map(([k,v])=>`${k}:${v}`).join(';');
   const byState={default:[],hover:[],pressed:[],disabled:[]};
   for(const r of styleRules(node,view,context))byState[r.state]?.push(`${r.property}:var(${r.token})`);
   rules[view].push(`${selector}{${defaults};${byState.default.join(';')}}`);
   for(const [state,pseudo] of [['hover',':hover'],['pressed',':active'],['disabled',':disabled']])if(byState[state].length)rules[view].push(`${selector}${pseudo}{${byState[state].join(';')}}`);
  }
 }
 const explicit=view=>rules[view].join('\n').replaceAll(`[data-ps-scope="${scope}"]`,`[data-ps-scope="${scope}"][data-ps-viewport="${view}"]`);
 const auto=view=>rules[view].join('\n').replaceAll(`[data-ps-scope="${scope}"]`,`[data-ps-scope="${scope}"]:not([data-ps-viewport])`);
 return `${auto('desktop')}\n@media(max-width:1023px){${auto('tablet')}}\n@media(max-width:639px){${auto('mobile')}}\n${views.map(explicit).join('\n')}`;
}
