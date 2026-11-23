const {inputHash}=require('./_page-schema-generation-jobs');
const {plannerContext}=require('./_page-schema-service');
const {measureSync}=require('./_work-performance');
const {context:logContext}=require('./_work-log');
function createPlanningCache({maxEntries=24,maxBytes=8*1024*1024,ttlMs=5*60*1000,clock=Date.now,build=plannerContext}={}){
 if(maxEntries<1||maxBytes<1||ttlMs<1)throw new RangeError('Planning cache bounds must be positive');
 const entries=new Map();let bytes=0;
 function remove(key){const item=entries.get(key);if(item){bytes-=item.bytes;entries.delete(key);}}
 function json(context,{scope=''}={}){
  const now=clock();for(const [key,item] of entries)if(item.expiresAt<=now)remove(key);
  const key=scope?measureSync('planningCacheKey',()=>inputHash({scope,context})):null,item=key?entries.get(key):null;
  const ctx=logContext.getStore();if(ctx)ctx.planningCacheHit=Boolean(item);
  if(item){entries.delete(key);entries.set(key,item);return item.value;}
  const value=measureSync('planningSnapshot',()=>JSON.stringify(build(context))),size=Buffer.byteLength(value);
  if(key&&size<=maxBytes){while(entries.size>=maxEntries||bytes+size>maxBytes)remove(entries.keys().next().value);entries.set(key,{value,bytes:size,expiresAt:now+ttlMs});bytes+=size;}
  return value;
 }
 return {json,clear(){entries.clear();bytes=0;},stats:()=>({entries:entries.size,bytes})};
}
const cache=createPlanningCache();
module.exports={createPlanningCache,planningContextJson:cache.json};
