// Service stages are independent of provider call counts, regions and retries.
const STAGES = ['요청 정리', '페이지 구성', '디자인·이미지 적용', '품질 확인·마무리'];
const WORKING = [
  '요청하신 목적과 콘텐츠를 정리하고 있어요.',
  '페이지의 섹션과 콘텐츠 배치를 구성하고 있어요.',
  '페이지에 디자인과 필요한 이미지를 적용하고 있어요.',
  '화면별 배치와 가독성을 확인하고 있어요.',
];
const COMPLETED = [
  '요청 내용을 정리했어요.', '페이지 구성을 준비했어요.',
  '페이지 디자인과 이미지를 준비했어요.',
  '품질 확인을 마쳤어요. 완성된 페이지를 확인할 수 있어요.',
];

export function customerStage(operationId = '') {
  if (/open_output|revise_|complete_requirements_edit|cancel_requirements_edit/.test(operationId)) return null;
  const step = /quality/.test(operationId) ? 4
    : /asset|media|page-design|final|mobile-layout|approve_wireframe/.test(operationId) ? 3
    : /wireframe|composition|confirm_requirements/.test(operationId) ? 2 : 1;
  return { step, total: STAGES.length, label: STAGES[step - 1] };
}

export function customerProgressTurn(messages, fallback = 'initial') {
  const user = messages.findLast(message => message.role === 'user');
  if (user) return user.id;
  // A long-running request can outlive the bounded local history window.
  const last = messages.findLast(message => message.metadata?.customerTurnId || message.customerTurnId);
  return last?.metadata?.customerTurnId || last?.customerTurnId || fallback;
}

function eventSequence(message) {
  const value = message.metadata?.customerSequence ?? message.customerSequence;
  return Number.isSafeInteger(value) && value > 0 ? value : 0;
}

export function nextCustomerSequence(messages, turn) {
  const previous = messages.reduce((maximum, message) => (
    (message.metadata?.customerTurnId || message.customerTurnId) === turn
      ? Math.max(maximum, eventSequence(message)) : maximum
  ), 0);
  return previous < Number.MAX_SAFE_INTEGER ? previous + 1 : undefined;
}

function orderTiedEvents(messages) {
  // PostgreSQL orders equal timestamps by random UUID. Use the persisted client
  // emission order only to break same-request, same-millisecond status ties.
  // Other messages keep their slots, and legacy events without an order stay put.
  const groups = new Map();
  messages.forEach((message, index) => {
    const turn = message.metadata?.customerTurnId || message.customerTurnId;
    const time = message.createdAt instanceof Date ? message.createdAt.getTime() : Date.parse(message.createdAt);
    if (message.type !== 'status' || !turn || !eventSequence(message) || !Number.isFinite(time)) return;
    const key = `${turn}:${time}`;
    if (!groups.has(key)) groups.set(key, { slots: [], events: [] });
    const group = groups.get(key);
    group.slots.push(index); group.events.push(message);
  });
  const ordered = messages.slice();
  for (const { slots, events } of groups.values()) {
    events.sort((a, b) => eventSequence(a) - eventSequence(b));
    slots.forEach((slot, index) => { ordered[slot] = events[index]; });
  }
  return ordered;
}

function workDescription(message, stage, completed) {
  // Existing chat API spreads persisted metadata onto the message; the local
  // cache retains the nested form. Both shapes describe the same saved event.
  const work = message.metadata?.customerWork || message.customerWork || {};
  // Specific descriptions come from known activities, never raw provider errors.
  const label = String(work.label || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (completed) return COMPLETED[stage.step - 1];
  switch (work.kind) {
    case 'outline': return '전체 섹션 배치를 준비했어요. 각 영역의 콘텐츠를 구성하고 있어요.';
    case 'region': return label ? `${label} 영역의 문구와 배치를 구성하고 있어요.` : WORKING[1];
    case 'assemble': return '완성된 영역을 연결하고 전체 페이지 구성을 확인하고 있어요.';
    case 'design': return label ? `${label} 영역에 디자인을 적용하고 있어요.` : WORKING[2];
    case 'image': return label ? `${label} 영역의 이미지를 준비하고 있어요.` : '페이지에 사용할 이미지를 준비하고 있어요.';
    case 'viewport': {
      const viewport = { desktop: '데스크톱', tablet: '태블릿', mobile: '모바일' }[work.viewport];
      return viewport ? work.state === 'completed'
        ? `${viewport} 화면 검사를 마쳤어요. 전체 품질 확인을 이어가고 있어요.`
        : `${viewport} 화면의 배치와 가독성을 확인하고 있어요.` : WORKING[3];
    }
    case 'review': return '페이지 구성을 검토하고 필요한 부분을 보정하고 있어요.';
    case 'repair': return '확인된 배치 문제를 보정한 뒤 다시 검사하고 있어요.';
    case 'retry': return '응답을 다시 확인하고 있어요. 준비된 내용은 유지하고 있어요.';
    case 'references': return '첨부한 이미지의 내용과 구성을 살펴보고 있어요.';
    default: return WORKING[stage.step - 1];
  }
}

export function customerProgressHeading(message) {
  const progress = message.metadata?.customerProgress;
  if (!progress) return '';
  const state = message.status === 'completed' ? '완료'
    : message.status === 'failed' ? '중단' : progress.active ? '진행 중' : '진행 기록';
  return `총 ${progress.total}단계 중 ${progress.step}단계 ${state} · ${progress.label}`;
}

export function customerProgress(messages) {
  const result = [], stages = new Map(), seen = new Set();
  let turn = 'initial';
  for (const message of orderTiedEvents(messages)) {
    if (message.id && seen.has(message.id)) continue;
    if (message.id) seen.add(message.id);
    if (message.role === 'user') {
      for (const row of stages.values()) row.metadata.customerProgress.active = false;
      turn = message.id;
    }
    if (message.type === 'internal' || message.type === 'notice') continue;
    if (message.type !== 'status') {
      if (message.actions?.some(a => ['approve_wireframe', 'confirm_requirements', 'revise_wireframe', 'revise_requirements'].includes(a.key))) continue;
      result.push(message);
      continue;
    }
    const stage = customerStage(message.operationId);
    if (!stage) continue;
    const stageTurn = message.metadata?.customerTurnId || message.customerTurnId || turn;
    if (turn === 'initial') turn = stageTurn;
    const key = `${stageTurn}:${stage.step}`;
    const previous = stages.get(key);
    const work = message.metadata?.customerWork || message.customerWork || {};
    const task = work.scope === 'task'
      || /page-quality-.*-\d+-(desktop|tablet|mobile)$/.test(message.operationId || '');
    const completed = message.status === 'completed' && !task && (stage.step !== 4
      || work.kind === 'quality-passed'
      || /품질 검사를 통과/.test(message.text || ''));
    // A task finishing is not the stage finishing. Ignore stale polls of a
    // completed operation; late earlier-stage events cannot restart the animation.
    if (['completed', 'failed'].includes(previous?.status) && task) continue;
    if (previous?.status === 'completed' && message.status === 'in_progress'
      && message.operationId === previous.metadata.customerProgress.lastOperationId
      && work.restart !== true) continue;
    const later = [...stages.values()].some(row => row.metadata.customerProgress.turn === stageTurn
      && row.metadata.customerProgress.step > stage.step && row.status !== 'failed');
    if (!later && stageTurn === turn) for (const row of stages.values()) row.metadata.customerProgress.active = false;
    const status = message.status === 'failed' ? 'failed' : completed ? 'completed' : 'in_progress';
    const detail = status === 'failed'
      ? previous?.metadata.customerProgress.detail || WORKING[stage.step - 1]
      : workDescription(message, stage, completed);
    const projected = {
      ...message, id: `customer-progress:${key}`,
      createdAt: previous?.createdAt || message.createdAt,
      text: completed && stage.step === 4 ? '완성' : stage.label,
      status, isStreaming: false,
      metadata: {
        ...message.metadata,
        customerProgress: { ...stage, detail, key, turn: stageTurn,
          active: status === 'in_progress' && !later && stageTurn === turn,
          lastOperationId: message.operationId, lastEventId: message.id },
      },
    };
    if (previous) Object.assign(previous, projected);
    else { stages.set(key, projected); result.push(projected); }
  }
  return result;
}

export function customerError(error) {
  if (/TOKEN|CONFIG|PROMPT|SKILL|MIGRATION|POLICY_REQUIRED/.test(error?.code || '')) return '페이지 생성 설정을 확인하고 있습니다. 입력한 내용과 준비된 결과는 보존했습니다.';
  return '작업을 완료하지 못했습니다. 입력한 내용과 준비된 결과는 보존했습니다. 다시 시도해 주세요.';
}
