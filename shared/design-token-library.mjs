export const TOKEN_TYPES = ['color', 'dimension', 'number', 'fontFamily', 'fontWeight', 'shadow', 'typography'];
export const TOKEN_CATEGORIES = ['Color', 'Spacing', 'Border Width', 'Border Radius', 'Typography', 'Shadow', 'Grid', 'Breakpoint', 'Measurement'];
export const CSV_HEADERS = ['카테고리', '토큰 유형', '토큰명', '값', '참조 토큰'];
export const TOKEN_NAME = /^--[a-z][a-z0-9-]*$/;
const length = /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|ch)$/;
const unsafe = /url\s*\(|expression\s*\(|[;{}<>]/i;

export function parseTokenCsv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  text = String(text).replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quoted || cell === '') quoted = !quoted;
      else throw new Error('CSV 따옴표 위치가 올바르지 않습니다.');
    } else if (!quoted && c === ',') { row.push(cell); cell = ''; }
    else if (!quoted && (c === '\n' || c === '\r')) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); if (row.some(v => v.trim())) rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (quoted) throw new Error('CSV 따옴표가 닫히지 않았습니다.');
  if (cell || row.length) { row.push(cell); if (row.some(v => v.trim())) rows.push(row); }
  if (!rows.length) throw new Error('CSV에 데이터가 없습니다.');
  const headers = rows.shift().map(v => v.trim());
  if (new Set(headers).size !== headers.length || CSV_HEADERS.some(h => !headers.includes(h))) throw new Error(`CSV 필수 컬럼: ${CSV_HEADERS.join(', ')}`);
  return rows.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV ${index + 2}행의 컬럼 수가 다릅니다.`);
    const r = Object.fromEntries(headers.map((h, i) => [h, values[i].trim()]));
    return { category: r['카테고리'], type: r['토큰 유형'], name: r['토큰명'], value: r['값'], reference: r['참조 토큰'] };
  });
}

export function exportTokenCsv(tokens) {
  const cell = value => { const s = String(value ?? ''); return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; };
  return '\uFEFF' + [CSV_HEADERS, ...tokens.map(t => [t.category, t.type, t.name, t.value, t.reference])].map(r => r.map(cell).join(',')).join('\r\n') + '\r\n';
}

function color(value) {
  if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(value)) return true;
  const m = value.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/);
  return !!m && m.slice(1, 4).every(v => Number(v) <= 255) && (m[4] === undefined || Number(m[4]) <= 1);
}

function shadow(value) {
  if (value === 'none') return true;
  const layers = value.split(/,(?![^()]*\))/);
  return layers.length > 0 && layers.length <= 8 && layers.every(layer => {
    const m = layer.trim().match(/^(inset\s+)?(.+?)\s+(#[\da-f]{6,8}|rgba?\([^()]+\))$/i);
    if (!m || !color(m[3])) return false;
    const dims = m[2].trim().split(/\s+/);
    return dims.length >= 2 && dims.length <= 4 && dims.every(v => v === '0' || /^-?(?:\d+|\d*\.\d+)(px|rem|em)$/.test(v)) && (dims.length < 3 || parseFloat(dims[2]) >= 0);
  });
}

export function typographyProperties(value) {
  const props = JSON.parse(value);
  if (!props || Array.isArray(props) || typeof props !== 'object') throw new Error('Typography는 JSON 속성 객체여야 합니다.');
  const types = { fontFamily: 'fontFamily', fontSize: 'dimension', lineHeight: 'dimension', fontWeight: 'fontWeight', letterSpacing: 'dimension', textDecoration: 'decoration' };
  if (Object.keys(props).some(k => !types[k])) throw new Error('Typography에 지원하지 않는 속성이 있습니다.');
  for (const [key, v] of Object.entries(props)) {
    if (v === null) continue;
    const s = String(v);
    if (key === 'textDecoration' ? !['none', 'underline', 'line-through'].includes(s) : !validValue(types[key], s)) throw new Error(`Typography ${key} 값이 올바르지 않습니다.`);
  }
  return props;
}

function validValue(type, value) {
  if (type !== 'typography' && unsafe.test(value)) return false;
  switch (type) {
    case 'color': return color(value);
    case 'dimension': return value === '0' || length.test(value);
    case 'number': return /^-?(?:\d+|\d*\.\d+)$/.test(value) && Number.isFinite(Number(value));
    case 'fontWeight': return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 1000;
    case 'fontFamily': return /^[\p{L}\p{N}\s,'"-]+$/u.test(value) && value.length <= 200;
    case 'shadow': return shadow(value);
    case 'typography': try { typographyProperties(value); return true; } catch { return false; }
    default: return false;
  }
}

export function analyzeTokenLibrary(input) {
  const errors = [], warnings = [], byName = new Map(), resolved = new Map();
  if (!Array.isArray(input) || input.length === 0 || input.length > 5000) return { tokens: [], errors: [{ message: '토큰은 1~5000개가 필요합니다.' }], warnings, resolved: {} };
  const tokens = input.map((t, index) => {
    const token = Object.fromEntries(['category', 'type', 'name', 'value', 'reference'].map(k => [k, String(t?.[k] ?? '').trim()]));
    token.state = 'active';
    const fail = message => errors.push({ row: index + 2, token: token.name, message });
    if (!token.category || token.category.length > 80) fail('카테고리를 입력하세요(80자 이하).');
    if (!TOKEN_TYPES.includes(token.type)) fail('지원하지 않는 토큰 유형입니다.');
    if (!TOKEN_NAME.test(token.name) || token.name.length > 180) fail('토큰명은 --영문소문자로 시작하며 숫자·하이픈만 사용할 수 있습니다.');
    if (byName.has(token.name)) fail('토큰명이 중복됩니다.');
    if (token.value && token.reference) fail('값과 참조 토큰 중 하나만 입력하세요.');
    if (token.reference && !TOKEN_NAME.test(token.reference)) fail('참조 토큰명이 올바르지 않습니다.');
    if (!token.value && !token.reference) token.state = 'incomplete';
    if (token.value && !validValue(token.type, token.value)) fail('토큰 유형에 맞지 않는 값입니다.');
    if (token.name.startsWith('--grid-') && token.name.endsWith('-columns') && token.value && (!Number.isInteger(Number(token.value)) || Number(token.value) < 1 || Number(token.value) > 64)) fail('그리드 컬럼 수는 1~64 사이 정수여야 합니다.');
    if (token.type === 'typography' && token.value && validValue(token.type, token.value)) {
      const p = typographyProperties(token.value);
      if (['fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'].some(k => p[k] == null)) token.state = 'incomplete';
    }
    byName.set(token.name, token); return token;
  });
  function visit(t, stack = []) {
    if (resolved.has(t.name)) return resolved.get(t.name);
    if (stack.length > 64) { errors.push({ token: t.name, message: '참조 깊이가 64단계를 초과합니다.' }); return ''; }
    if (stack.includes(t.name)) { errors.push({ token: t.name, message: '참조가 순환합니다.' }); return ''; }
    let value = t.value;
    if (t.reference) {
      const target = byName.get(t.reference);
      if (!target) errors.push({ token: t.name, message: `참조 토큰이 없습니다: ${t.reference}` });
      else if (target.type !== t.type) errors.push({ token: t.name, message: '참조 대상의 토큰 유형이 다릅니다.' });
      else { value = visit(target, [...stack, t.name]); if (target.state !== 'active') t.state = 'incomplete'; }
    }
    resolved.set(t.name, value || ''); return value || '';
  }
  tokens.forEach(t => visit(t));
  tokens.filter(t => t.state !== 'active').forEach(t => warnings.push({ token: t.name, message: '필수 값이 없어 저장만 하고 실제 적용·AI 선택에서는 제외합니다.' }));
  return { tokens, errors, warnings, resolved: Object.fromEntries(resolved) };
}

export function tokenCssProperties(token) {
  if (token.type === 'typography') return ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'];
  if (token.type === 'shadow') return ['box-shadow'];
  if (token.type === 'color') return ['color', 'background-color', 'border-color'];
  if (token.type === 'fontFamily') return ['font-family'];
  if (token.type === 'fontWeight') return ['font-weight'];
  if (/^--grid-.*-columns$|^--grid-columns$/.test(token.name)) return ['grid-template-columns'];
  if (/^--grid-.*-gutter$|^--grid-gutter$/.test(token.name)) return ['gap','column-gap','row-gap'];
  if (/^--grid-.*-margin-inline$|^--grid-margin-inline$/.test(token.name)) return ['margin-inline','padding-inline'];
  if (/^--breakpoint-|^--grid-reference-/.test(token.name)) return ['layout-breakpoint'];
  if (token.type === 'number') return ['width'];
  if (token.name.includes('radius')) return ['border-radius'];
  if (token.name.includes('border-width')) return ['border-width'];
  if (token.name.includes('font-size')) return ['font-size'];
  if (token.name.includes('line-height') || token.name.includes('line-hight')) return ['line-height'];
  if (token.name.includes('letter-spacing')) return ['letter-spacing'];
  return ['gap', 'padding', 'margin'];
}

// Semantic use is assigned by the versioned token usage policy, never by token name.
export function tokenPlannerRole() { return ''; }
