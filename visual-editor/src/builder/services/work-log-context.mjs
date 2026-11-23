const STORAGE='promoAiBuilder.workLogContext.v1';
let state={active:null,documents:{},sessions:{}};
try{const saved=JSON.parse(globalThis.sessionStorage?.getItem(STORAGE)||'null');if(saved?.documents&&typeof saved.documents==='object'&&!Array.isArray(saved.documents)&&saved?.sessions&&typeof saved.sessions==='object'&&!Array.isArray(saved.sessions))state=saved;}catch{}
const valid=id=>/^[a-f0-9-]{36}$/i.test(String(id||''));
function persist(){try{globalThis.sessionStorage?.setItem(STORAGE,JSON.stringify(state));}catch{}}
export function startWorkTask(documentId,sessionId){const id=globalThis.crypto.randomUUID();state.active=id;state.startedAt||={};state.startedAt[id]=Date.now();if(documentId)state.documents[documentId]=id;if(sessionId)state.sessions[sessionId]=id;persist();return id;}
export function workTaskId(body={}){const stored=body.documentId?state.documents[body.documentId]:body.sessionId?state.sessions[body.sessionId]:null;return valid(stored)?stored:valid(state.active)?state.active:startWorkTask(body.documentId);}
export function bindWorkContext(taskId,body={},payload={}){if(!valid(taskId))return;const documentId=body.documentId||payload.document?.id,sessionId=body.sessionId||payload.session?.id;if(documentId)state.documents[documentId]=taskId;if(sessionId)state.sessions[sessionId]=taskId;persist();}

export function workElapsedMs(documentId){const id=workTaskId({documentId}),started=state.startedAt?.[id];return Number.isFinite(started)?Math.max(0,Date.now()-started):null;}
