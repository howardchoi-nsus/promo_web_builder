const {context}=require('./_work-log');
const now=()=>Number(process.hrtime.bigint())/1e6;
function record(name,elapsed){const ctx=context.getStore();if(!ctx)return;ctx.performance||={};ctx.performance[name+'Ms']=(ctx.performance[name+'Ms']||0)+Math.max(0,elapsed);}
async function measure(name,fn){const started=now();try{return await fn();}finally{record(name,now()-started);}}
function measureSync(name,fn){const started=now();try{return fn();}finally{record(name,now()-started);}}
module.exports={measure,measureSync};
// Keep Neon query objects lazy and intact for sql.transaction([...queries]).
function instrumentSql(sql){
 function observe(result,args){const ctx=context.getStore(),template=args?.[0];if(!ctx||!result?.then||(Array.isArray(template)&&template.join('').includes('promo_work_logs')))return result;
  const proxy=new Proxy(result,{get(target,name,receiver){if(name==='then')return(resolve,reject)=>{const started=now();ctx.sqlCalls=(ctx.sqlCalls||0)+1;return target.then(value=>{ctx.performance||={};ctx.performance.databaseMs=(ctx.performance.databaseMs||0)+Math.max(0,now()-started);return resolve?resolve(value):value;},error=>{ctx.performance||={};ctx.performance.databaseMs=(ctx.performance.databaseMs||0)+Math.max(0,now()-started);if(reject)return reject(error);throw error;});};if(name==='catch')return reject=>proxy.then(undefined,reject);if(name==='finally')return callback=>proxy.then(value=>Promise.resolve(typeof callback==='function'?callback():null).then(()=>value),error=>Promise.resolve(typeof callback==='function'?callback():null).then(()=>{throw error;}));return Reflect.get(target,name,receiver);}});return proxy;
 }
 return new Proxy(sql,{apply(target,thisArg,args){return observe(Reflect.apply(target,thisArg,args),args);},get(target,name,receiver){if(name==='transaction')return(...args)=>measure('databaseTransaction',()=>Reflect.apply(target.transaction,target,args));if(name==='query')return(...args)=>observe(Reflect.apply(target.query,target,args),args);return Reflect.get(target,name,receiver);}});
}
module.exports.instrumentSql=instrumentSql;
