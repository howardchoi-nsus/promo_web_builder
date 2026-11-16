// A list response cannot be used as an individual workspace, even with HTTP 200.
export function requireChatWorkspace(payload) {
  if (!payload || typeof payload.session?.id !== 'string' || !payload.session.id.trim()) {
    throw Object.assign(new Error('대화 정보를 올바르게 불러오지 못했습니다. 기존 입력은 보존됩니다. 다시 시도해 주세요.'), {
      code: 'CHAT_WORKSPACE_RESPONSE_INVALID', status: 502, retryable: true,
    });
  }
  return payload;
}
