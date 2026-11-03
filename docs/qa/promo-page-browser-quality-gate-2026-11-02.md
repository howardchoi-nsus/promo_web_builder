# 생성 페이지 브라우저 품질 게이트

생성 페이지는 저장 전에 두 개의 독립 게이트를 순서대로 통과해야 한다.

1. `POST /api/promo-page-generation-validate`: JSON·HTML·CSS·카피·URL 정적 계약 검증
2. 내부 Browser Quality Gate: 같은 결과를 Chromium의 1440×1000, 390×844 Viewport에 실제 렌더링해 가시성과 레이아웃 검증

구현 파일:

- `scripts/lib/promo-page-browser-quality-gate.mjs`: Playwright 평가기
- `scripts/promo-page-browser-quality-gate-service.mjs`: 내부 전용 Bearer 인증 HTTP 서비스
- `scripts/test-promo-page-browser-quality-gate.mjs`: 정상·적대적 브라우저 Fixture

## 차단 기준

- 필수 프로모션 카피가 실제로 보이고 수평 화면 밖에 배치되지 않음
- 문서 수평 스크롤과 `overflow: hidden|clip`에 의한 콘텐츠 잘림이 없음
- 전달된 CTA가 보이고 Keyboard로 도달 가능하며 최소 44×44 CSS pixel임
- CTA에 눈에 보이는 `:focus-visible` outline 또는 shadow가 있음
- 실제 표시 텍스트가 WCAG AA 대비를 충족함
- 배경 이미지·Gradient 때문에 대비를 안전하게 판정할 수 없는 텍스트는 fail-closed 처리
- `prefers-reduced-motion: reduce`에서 Animation·Transition duration이 0임
- 렌더 중 모든 Browser Network Request를 차단하고 제한적 CSP를 적용함

Browser 장애, Chromium 미설치, Timeout, URL·Credential 누락, 비 2xx 응답은 모두 저장 차단으로 처리한다.

## 내부 서비스 계약

Vercel Serverless가 아니라 Playwright Chromium을 포함한 내부 Container/Worker로 실행한다. Public Internet에 직접 노출하지 않는다.

- `PROMO_PAGE_BROWSER_QUALITY_GATE_TOKEN`: 최소 32자, n8n Browser Gate 호출용
- `PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET`: 최소 32자, Browser Service와 Artifact API만 공유하는 HMAC Secret. n8n에는 제공하지 않음
- `PROMO_PAGE_BROWSER_QUALITY_GATE_HOST`: 기본값 `127.0.0.1`
- `PROMO_PAGE_BROWSER_QUALITY_GATE_PORT`: 기본값 `4178`
- Endpoint: `POST /validate`
- 실행 명령: `pnpm start:promo-page-quality-gate`

n8n 순서는 다음과 같다.

`Validate Generated Page → Browser Quality Gate → Persist Promo Page Artifact → Build Promo Page Response → Return AI Page URL`

기존 n8n Static Data 저장과 `promo-ai-page-view` Webhook 조회 경로는 제거한다.

Browser Service는 통과 결과에 60초 TTL(최대 120초)의 HMAC Attestation을 발급한다. 서명 대상에는 Artifact ID, 제목, 정규화된 Prompt Meta, HTML/CSS 결과, 필수 카피·CTA·허용 URL·locale·market, Desktop/Mobile Gate 전체가 포함된다. Artifact API는 저장 직전에 서명·만료·대상 Hash를 다시 검증하고, Gate 보고서와 서명 증거의 발급시각·만료시각·nonce·subject hash를 `quality_snapshot`에 보존한다. 따라서 n8n Runtime Token만 가진 직접 호출자는 `passed` 값을 위조해 저장할 수 없다.

## 배포 전 필수 작업

현재 Workflow JSON의 `$env` URL·Token 표현식은 코드 계약을 고정하기 위한 Import Template이다. 운영 Import 전 다음을 n8n Credential Store 또는 External Secrets 기반 Credential로 치환해야 한다.

- Browser Gate URL과 별도 Header Auth Credential. HMAC Attestation Secret은 n8n Credential에 넣지 않음
- Prompt Runtime·Validator·Artifact API URL과 Header Auth Credential
- OpenAI Credential
- 생성 Webhook Header Auth Credential

`N8N_BLOCK_ENV_ACCESS_IN_NODE=true`를 유지한 Preview에서 Credential ID 매핑, Browser Service 배포, Migration 076 적용, 실패 Fixture의 Artifact 미저장을 확인하기 전에는 Workflow를 활성화하지 않는다. Secret 값과 Credential ID는 Git에 커밋하지 않는다.
