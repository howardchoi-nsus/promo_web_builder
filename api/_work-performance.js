const {context}=require('./_work-log');
const now=()=>Number(process.hrtime.bigint())/1e6;
function record(name,elapsed){const ctx=context.getStore();if(!ctx)return;ctx.performance||={};ctx.performance[name+'Ms']=(ctx.performance[name+'Ms']||0)+Math.max(0,elapsed);}
async function measure(name,fn){const started=now();try{return await fn();}finally{record(name,now()-started);}}
function measureSync(name,fn){const started=now();try{return fn();}finally{record(name,now()-started);}}
module.exports={measure,measureSync};
