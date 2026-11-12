async function request(query='',options={}){
 const response=await fetch('/api/agent-skills'+query,{cache:'no-store',...options,headers:{'Content-Type':'application/json',...options.headers}});
 const result=await response.json().catch(()=>({}));if(!response.ok)throw Object.assign(new Error(result.error||'스킬 요청을 처리하지 못했습니다.'),{code:result.code});return result;
}
export const agentSkillService={list:()=>request(),read:id=>request('?versionId='+encodeURIComponent(id)),save:payload=>request('',{method:'POST',body:JSON.stringify(payload)}),setActive:payload=>request('',{method:'PATCH',body:JSON.stringify(payload)})};
export function announceSkillChange(){window.dispatchEvent(new CustomEvent('promo-agent-skills-changed'));}
