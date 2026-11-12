// Presentation events do not change generation or approval state.
export function progressStage(operationId = '') {
  if (/quality/.test(operationId)) return '디자인 미리보기 · 자동 품질검사';
  if (/asset|media|approve_wireframe|final/.test(operationId)) return '디자인 미리보기 · 생성';
  if (/wireframe|composition|confirm_requirements/.test(operationId)) return '페이지 미리보기 · 구성';
  if (/attachment|reference/.test(operationId)) return '요청 요약 · 참고 자료 분석';
  return '요청 요약 · 요청 처리';
}
export function createProgressEvent({ operationId, text, status, previous, durations, now = Date.now() }) {
  if (previous?.text === text && previous?.status === status) return null;
  const stage = progressStage(operationId);
  const startedAt = previous?.metadata?.startedAt || previous?.startedAt || now;
  const measured = durations.get(stage);
  const elapsed = now - startedAt;
  if (status === 'completed' && elapsed > 0) durations.set(stage, elapsed);
  const eta = status !== 'in_progress' ? '단계 종료' : measured > elapsed
    ? `이전 실행 기준 약 ${Math.ceil((measured - elapsed) / 1000)}초 남음` : '예상 시간 계산 중';
  return { type: 'status', operationId, status, createdAt: new Date(now).toISOString(), metadata: { stage, startedAt, eta } };
}
export function isHistoricalAction(action, message, messages) {
  if (action.status && action.status !== 'proposed') return true;
  const index = messages.findIndex(item => item.id === message?.id);
  return index >= 0 && messages.slice(index + 1).some(item => item.role === 'user'
    || item.actions?.some(other => other.key === action.key));
}
