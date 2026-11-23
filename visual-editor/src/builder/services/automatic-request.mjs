export async function automaticRequest(request,payload,{enabled=false,onRetry,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
 try{return await request(payload);}catch(error){
  if(!enabled||error.retryable!==true||[400,401,403,404,409,422].includes(Number(error.status)))throw error;
  onRetry?.(error);await wait(750);return request(payload);
 }
}
