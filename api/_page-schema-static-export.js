const {assertValid}=require('../shared/page-schema/contract.cjs');
const {readFileSync}=require('node:fs');const {join}=require('node:path');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const style=value=>Object.entries(value||{}).map(([k,v])=>`${k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}:${String(v)}`).join(';');
function serialize(d,overrides={},origin=''){if(d==null)return '';if(typeof d==='string')return escape(d);const attrs=Object.entries(d.attrs||{}).filter(([k,v])=>v!==false&&v!==undefined&&v!==null&&!/^on/i.test(k)).map(([k,v])=>{if(typeof v==='string'&&['src','href','poster','action'].includes(k)){v=overrides[v]||(origin&&v.startsWith('/')&&!v.startsWith('//')?new URL(v,origin).href:v);}return ` ${k}="${escape(k==='style'?style(v):v===true?'':v)}"`;}).join('');const content=Array.isArray(d.children)?d.children.map(child=>serialize(child,overrides,origin)).join(''):serialize(d.children,overrides,origin);return `<${d.tag}${attrs}>`+(['img','input','hr','track','br'].includes(d.tag)?'':content+`</${d.tag}>`);}
async function staticPageHtml(snapshot,{title='Promotion',assetOverrides={},origin=''}={}){
 const page=snapshot.content.pageSchema,context=snapshot.content.pageContext;assertValid(page,context,{final:true});
 const [{pageNodeDescriptor},{pageCss,tokenVariables},{usageRuntimeStyle}]=await Promise.all([import('../shared/page-schema/node-descriptor.mjs'),import('../shared/page-schema/runtime.mjs'),import('../shared/token-usage-policy.mjs')]);
 const scope='ps-export',vars={...tokenVariables(context),...usageRuntimeStyle(context.usagePolicy,context.tokenValues)};
 const base=readFileSync(join(__dirname,'../visual-editor/src/runtime/output-only.css'),'utf8');
 const css=base+`\n:root{${style(vars)}}\n`+pageCss(page,context,scope);
 if(/<\/style/i.test(css))throw Error('Unsafe output style');
 const html=`<!doctype html><html lang="${escape(context.language||'ko')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>${css}</style></head><body><div class="page-schema-renderer" data-ps-scope="${scope}">${serialize(pageNodeDescriptor(page.root,context,page),assetOverrides,origin)}</div></body></html>`;
 if(Buffer.byteLength(html,'utf8')>4*1024*1024)throw Object.assign(new Error('이미지를 포함한 HTML이 출력 크기 한도를 초과합니다. 이미지 크기를 줄여 주세요.'),{code:'EXPORT_HTML_TOO_LARGE',statusCode:422});
 return html;
}
async function resolveExportAssets(snapshot,{documentId,sql,blobGet}={}){
 const replacements={};let totalBytes=0;const used=new Set();require('../shared/page-schema/contract.cjs').walk(snapshot.content.pageSchema.root,({node})=>{if(node.assetId)used.add(node.assetId);if(node.posterAssetId)used.add(node.posterAssetId);});const context=snapshot.content.pageContext;
 for(const [assetId,asset] of Object.entries(context.assets||{})){
  if(!used.has(assetId))continue;
  if(!asset.url?.startsWith('/api/promo-page-schema-image?'))continue;
  const id=new URL(asset.url,'https://export.local').searchParams.get('id');
  const rows=await sql`select storage_key,mime_type from promo_page_schema_assets where id=${id}::uuid and document_id=${documentId}::uuid limit 1`;
  if(!rows.length)throw Object.assign(new Error('출력 이미지를 찾을 수 없습니다.'),{code:'EXPORT_ASSET_REQUIRED',statusCode:422});
  const result=await blobGet(rows[0].storage_key,{access:'private'});if(result?.statusCode!==200||!result.stream)throw Object.assign(new Error('출력 이미지를 준비하지 못했습니다.'),{code:'EXPORT_ASSET_REQUIRED',statusCode:502});
  if(!['image/png','image/jpeg','image/webp'].includes(rows[0].mime_type))throw Object.assign(new Error('허용되지 않는 출력 이미지 형식입니다.'),{code:'EXPORT_ASSET_TYPE_INVALID',statusCode:422});
  const bytes=Buffer.from(await new Response(result.stream).arrayBuffer());totalBytes+=bytes.length;if(bytes.length>12*1024*1024||totalBytes>32*1024*1024)throw Object.assign(new Error('이미지가 단일 HTML 출력 한도를 초과합니다.'),{code:'EXPORT_ASSET_TOO_LARGE',statusCode:422});
  replacements[asset.url]=`data:${rows[0].mime_type};base64,${bytes.toString('base64')}`;
 }
 return replacements;
}
module.exports={staticPageHtml,resolveExportAssets,serialize};
function exportOrigin(req={}){const configured=process.env.PROMO_PUBLIC_ORIGIN||(process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:'');if(configured){const url=new URL(configured);if(url.protocol!=='https:'||url.username||url.password)throw Object.assign(Error('PROMO_PUBLIC_ORIGIN에는 HTTPS 사이트 주소를 설정해 주세요.'),{statusCode:503,code:'EXPORT_ORIGIN_INVALID'});return url.origin;}const host=String(req.headers?.host||'');return /^[a-z0-9.-]+(?::[0-9]+)?$/i.test(host)?`${/^(localhost|127\.)/.test(host)?'http':'https'}://${host}`:'';}
module.exports.exportOrigin=exportOrigin;
