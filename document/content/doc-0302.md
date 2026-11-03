# 검토 의견: 현재 운영 중인 관리자 페이지 (prototype/index.html + app.js)

Reviewer: Claude
Date: 2026-07-14
검토 범위: `prototype/index.html`(관리자 페이지 마크업, 642~857줄 및 상단 topbar 12~38줄), `prototype/app.js`(관리자 관련 메서드, 1490~1830줄 부근: `openPromptManager`, `loadPromptTemplates`, `loadWorkerWebhookSettings`, `saveWorkerWebhookSetting`, `selectPromptTemplate`, `savePromptTemplate`, `activatePromptTemplate`, `archivePromptTemplate`, `loadHandoffDocuments`, `openSelectedHandoff`), 관련 API(`api/prompt-template*.js`, `api/promo-generation-worker-settings.js`, `api/handoff-documents.js`).

## 결론

**관리자 페이지 자체의 프론트엔드 코드 품질은 양호하지만, 관리자 페이지와 그 API에 인증/인가가 전혀 없다는 점이 가장 큰 문제.** `currentView`를 `'prompts'`로 바꾸는 것은 버튼 클릭 하나면 되고, 실제 값을 바꾸는 API(`PATCH /api/prompt-template`, `POST /api/prompt-template-activate`, `POST /api/prompt-template-archive`, `POST /api/promo-generation-worker-settings`)에도 인증 검사가 코드 어디에도 없다. 즉 배포된 URL과 API 경로를 아는 사람이면 누구나 브라우저 UI 없이도 활성 LLM 프롬프트를 바꾸거나 n8n 웹훅 URL을 임의로 바꿀 수 있다. 별도로, 2026-07-10에 제안됐던 "handoff-picker를 사용자 화면에서 관리자 화면으로 이동" 건이 아직 코드에 반영되지 않아 내부 개발 기록이 여전히 사용자용 화면 상단에 노출되고 있다.

## 이슈사항

### 1. (보안, 최우선) 관리자 페이지·API에 인증/인가가 전혀 없음

- `index.html` 28행의 "관리자 페이지" 버튼은 `openPromptManager()`(app.js 1502줄)를 호출해 `currentView = "prompts"`로 바꿀 뿐, 로그인/토큰 검사 없이 누구나 클릭만으로 진입 가능.
- 더 중요한 부분은 API 레이어: `api/prompt-template.js`, `api/prompt-template-activate.js`, `api/prompt-template-archive.js`, `api/promo-generation-worker-settings.js` 전부 확인했으나 `Authorization` 헤더, API 키, 세션 검사 등 어떤 인증 로직도 없음(코드 전체에서 "Admin Page"라는 문자열은 주석에만 등장).
- 실질적 리스크: 배포 URL만 알면 외부에서 curl 한 번으로 활성 프롬프트 내용을 바꾸거나(`PATCH /api/prompt-template`), n8n 웹훅 URL을 공격자 서버로 바꿀 수 있음(`POST /api/promo-generation-worker-settings`). 후자는 `docs/claude/comprehensive-review-report-2026-07-12.md`에서 이미 지적된 "API 키 평문 유지" 문제와 결합하면, 웹훅을 가로채는 방식으로 OpenAI 키가 담긴 요청을 외부로 유출시키는 경로가 될 수 있음.
- `vercel.json`에는 접근 제어 관련 설정이 없어, Vercel 프로젝트 설정(Team/Deployment Protection 등 코드 밖 설정)에서 별도로 막아두지 않았다면 이 엔드포인트들은 인터넷에 그대로 열려 있는 상태로 봐야 함.
- 제안: 최소한 관리자 API 앞단에 공통 미들웨어(예: `x-admin-token` 헤더 검증 또는 Vercel/Neon 세션 기반 인증)를 추가하고, 프론트엔드도 인증 실패 시 관리자 페이지 진입을 막도록 처리.

### 2. (미반영) handoff-picker 사용자 화면 노출 — 2026-07-10 제안 아직 미적용

- `docs/claude/promo-admin-ui-separation-proposal-2026-07-10.md`에서 제안했던 "topbar의 handoff-picker를 관리자 페이지로 이동" 건을 확인한 결과, `index.html` 16~22행에 여전히 `currentView`와 무관하게(즉 "프로모션 빌더" 사용자 화면에서도) handoff-picker가 노출되고 있음.
- `/api/handoff-documents`가 서버의 `docs/handoff-*.md` 내부 개발 기록을 그대로 반환하므로, 사용자용 화면에서도 내부 진행 기록에 접근 가능한 상태가 계속 유지되고 있음.
- 이미 구체적인 마크업 이동안까지 제안돼 있으므로(코드 변경 없이 위치만 이동), 적용 여부만 결정하면 되는 상태.

### 3. (참고, UX 제약) 웹훅 URL을 UI에서 "삭제"할 방법이 없음

- `loadWorkerWebhookSettings()`(app.js 1536~1564줄)는 `webhookUrl` 편집 필드를 항상 빈 문자열로 초기화하고, `saveWorkerWebhookSetting()`(1606줄)은 `preserveExistingWebhook: !editor.webhookUrl && setting.isConfigured`로 저장 요청을 보냄.
- 즉 필드를 빈 값으로 제출하면 항상 "기존 URL 유지"로 해석되어, 한 번 설정한 웹훅 URL을 관리자 화면에서 빈 값으로 지울 방법이 없음(새 URL로 덮어쓰는 것만 가능). 의도된 안전장치일 수도 있으나, 웹훅을 완전히 비활성화(URL 제거)해야 하는 운영 상황이 생기면 이 UI로는 처리 불가.

## 간략한 내용 (좋은 점)

- 관리자 페이지는 Vue의 `v-model` 기반이라, `docs/claude/review-promo-wizard-frontend-source-2026-07-14.md`에서 지적한 promo-wizard.js의 "입력 중 포커스 손실" 버그가 여기엔 없음.
- 프롬프트/웹훅 저장 로직(`saveWorkerWebhookSetting`, `savePromptTemplate`, `activatePromptTemplate`, `archivePromptTemplate`)이 모두 `try/catch/finally` + 로딩 상태 플래그 + `setStatus()` 에러 노출 패턴으로 일관되게 구현됨.
- `v-html`을 전혀 사용하지 않고 전부 `{{ }}` 텍스트 보간만 사용해 XSS 삽입 경로 없음(프롬프트 본문처럼 임의 텍스트가 들어갈 수 있는 필드도 안전).
- 웹훅 URL 자체를 편집 필드에 평문으로 채워 넣지 않고 `maskedWebhookUrl`만 표시하는 방식은 이미 보안을 고려한 설계로 보임.

## 제안 우선순위

1. 관리자 API 인증/인가 추가 (이슈 1) — 실제 운영 리스크가 가장 큼.
2. handoff-picker 사용자 화면 노출 제거, 관리자 화면으로 이동 (이슈 2) — 이미 적용안이 나와 있어 결정만 하면 됨.
3. 웹훅 URL 삭제(초기화) 액션 추가 검토 (이슈 3) — 선택적.
