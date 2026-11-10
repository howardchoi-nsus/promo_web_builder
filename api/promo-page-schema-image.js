const {createHash}=require('node:crypto');
const {getSql}=require('./_promo-builder-document-store');
module.exports=async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).send('Method not allowed');}
 try{
  const id=String(req.query?.id||''),token=String(req.query?.token||'');
  if(!/^[a-f0-9-]{36}$/i.test(id)||!/^[A-Za-z0-9_-]{43}$/.test(token))return res.status(404).send('Not found');
  const hash=createHash('sha256').update(token).digest('hex');
  const rows=await getSql()`select storage_key,mime_type from promo_page_schema_assets where id=${id}::uuid and view_token_hash=${hash} limit 1`;
  if(!rows.length)return res.status(404).send('Not found');
  const {get}=await import('@vercel/blob'),blob=await get(rows[0].storage_key,{access:'private'});
  if(!blob||blob.statusCode!==200||!blob.stream)return res.status(502).send('Image unavailable');
  res.setHeader('Content-Type',rows[0].mime_type);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','private, max-age=300');
  return res.status(200).send(Buffer.from(await new Response(blob.stream).arrayBuffer()));
 }catch{return res.status(500).send('Image unavailable');}
};
