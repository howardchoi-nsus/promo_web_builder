import assert from 'node:assert/strict';
import {requireChatWorkspace} from '../visual-editor/src/builder/services/chat-workspace-response.mjs';
for(const value of [null,{},[],{sessions:[]},{session:{}},{session:{id:''}},{session:{id:' '}}]) {
 assert.throws(()=>requireChatWorkspace(value),error=>error.code==='CHAT_WORKSPACE_RESPONSE_INVALID'&&error.retryable===true&&error.status===502);
}
const workspace={session:{id:'session-valid'},messages:[]};
assert.equal(requireChatWorkspace(workspace),workspace);
console.log('Workspace response: reject list/malformed success bodies; preserve valid workspace passed');
