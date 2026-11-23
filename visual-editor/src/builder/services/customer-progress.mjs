export function customerProgress(messages){
 const result=[],positions=new Map();let turn=0;
 for(const message of messages){
  if(message.role==='user')turn++;
  if(message.type==='internal'||message.type==='notice')continue;
  if(message.type!=='status'){if(message.actions?.some(a=>['approve_wireframe','confirm_requirements','revise_wireframe','revise_requirements'].includes(a.key)))continue;result.push(message);continue;}
  const op=message.operationId||'';
  const phase=/quality/.test(op)?'마무리 중':/asset|media|page-design|final|mobile-layout/.test(op)?'디자인·이미지 적용 중':'구성 중';
  const text=message.status==='failed'?'작업을 완료하지 못했습니다. 준비된 내용은 보존했습니다.':/quality/.test(op)&&message.status==='completed'&&/통과|출력/.test(message.text)?'완성':phase;
  const key=turn+':'+phase,projected={...message,text,isStreaming:false,metadata:{...message.metadata,customerPhase:phase}};
  if(positions.has(key))result[positions.get(key)]=projected;else{positions.set(key,result.length);result.push(projected);}
 }
 return result;
}
export function customerError(error){
 if(/TOKEN|CONFIG|PROMPT|SKILL|MIGRATION|POLICY_REQUIRED/.test(error?.code||''))return '페이지 생성 설정을 확인하고 있습니다. 입력한 내용과 준비된 결과는 보존했습니다.';
 return '작업을 완료하지 못했습니다. 입력한 내용과 준비된 결과는 보존했습니다. 다시 시도해 주세요.';
}
