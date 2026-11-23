import {recordBuilderEvent} from './composition-client.mjs';
export function installWorkErrorReporting(app,view=globalThis.window){
 if(!view?.addEventListener)return ()=>{};
 let sent=0,start=Date.now();const recent=new Map();
 const report=(error,code)=>{if(Date.now()-start>60000){sent=0;start=Date.now();recent.clear();}const message=String(error?.message||error||'Browser error').slice(0,700),key=code+message;if(sent>=12||Date.now()-(recent.get(key)||0)<5000)return;sent++;recent.set(key,Date.now());void recordBuilderEvent({eventName:'builder_client_error',metadata:{code,message,retryable:false}});};
 const onError=event=>{if(event.error||event.message)report(event.error||event.message,'BROWSER_UNCAUGHT_ERROR');},onReject=event=>report(event.reason,'BROWSER_UNHANDLED_REJECTION');
 view.addEventListener('error',onError);view.addEventListener('unhandledrejection',onReject);
 const previous=app.config.errorHandler;
 const handler=(error,instance,info)=>{report(error,'VUE_RENDER_ERROR');if(previous)previous(error,instance,info);else console.error(error);};app.config.errorHandler=handler;
 return ()=>{view.removeEventListener('error',onError);view.removeEventListener('unhandledrejection',onReject);if(app.config.errorHandler===handler)app.config.errorHandler=previous;};
}
