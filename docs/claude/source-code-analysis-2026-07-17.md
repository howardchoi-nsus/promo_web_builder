# 소스코드 종합 분석 리포트

- 작성일: 2026-07-17
- 작성: Claude
- 상태: 코드 검토 / 소스코드 미수정
- 기준 커밋: `ffa9081` (main)
- 분석 범위: `api/`, `prototype/`, `visual-editor/`, `scripts/`, `db/migrations/`
- 이전 검토와의 관계: `review-api-folder-source-2026-07-12.md`, `review-admin-page-source-2026-07-15.md`, `review-promo-wizard-frontend-source-2026-07-14.md` 이후 변경분을 현재 기준으로 재평가

## 1. 코드 규모 인벤토리

| 영역 | 규모 | 비고 |
|---|---|---|
| `api/` | 61개 파일, 10,816줄 | Vercel Serverless Functions + `_*.js` 공유 store 모듈 |
| `prototype/app.js` | 5,147줄 | Admin/Builder 단일 Vue CDN SPA |
| `prototype/promo-wizard.js` | 2,438줄 | Wizard 4단계, Vanilla JS |
| `prototype/create-promo.js` | 2,631줄 | 신규 Create Promo 플로우 (배경색→CTA 스타일→템플릿/콘텐츠) |
| `prototype/shared-shell.js` | 57줄 | 공용 셸(테마 토글 등) |
| `visual-editor/src/` | 1,456줄 | Vue 3 + Vite (App 701, Renderer 344, layout-utils 79, editor-utils 50) |
| `scripts/` | 23개 | 계약 테스트 15개 + behavior 테스트 2개(.mjs) + 유틸 |
| `db/migrations/` | 002~023 (22개) | 001 초기 스키마 부재 |

## 2. 잘 되어 있는 것

### 2.1 API 계층

- **SQL injection 안전**: 전 엔드포인트가 Neon tagged template(`sql\`...\``) 기반 파라미터 바인딩. 문자열 결합 쿼리 없음.
- **일관된 핸들러 패턴**: method 가드 → body 파싱/검증 → store 호출 → 상태코드 응답. 오류 시 `{ error, message }` 형태 유지.
- **멱등성/동시성 처리 도입**: `wizard-layout-usage-events`는 `client_event_id` 부분 유니크 인덱스 + `on conflict`로 중복 이벤트를 흡수. 레이아웃 저장은 `expectedRevision` 낙관적 잠금.
- **입력 방어**: 이벤트명 allowlist, `changeSummary` 4KB 크기 제한, UUID 캐스팅.
- **이력 관례 정착**: 정의 테이블 + `*_histories` + 사용 이벤트 3분리가 마이그레이션 023에 반영됨 (`ai-utilization-strategy-review` 문서의 3-로그 구분과 일치).

### 2.2 프론트엔드 보안 위생

- `innerHTML` 사용처는 전부 `= ""`(비우기)뿐이고 콘텐츠 주입은 `textContent`/DOM API 사용 → XSS 방어 양호.
- `editor-utils.mjs`의 `normalizeCtaUrl()`이 `javascript:` 등 위험 프로토콜을 `#`으로 차단하고 http/https/상대경로만 허용.
- `_blank` 링크에 `noopener noreferrer` 적용.

### 2.3 Visual Editor — 직전 지적사항 대부분 해소 확인

2026-07-17 UI 분석에서 지적한 항목의 현재 상태:

| 지적 (07-17 채팅 검토) | 현재 상태 |
|---|---|
| "자동 배치로 복원"이 `yPx`를 안 지움 | **수정됨** — `withoutFreePosition()`이 positionMode/xPct/yPx/yPct 모두 삭제 |
| 위치 표시가 드래그 후 항상 Y 0% | **수정됨** — `yPx` px 단위로 표시 |
| Web Output 열기 localStorage 쿼터 초과 시 조용한 실패 | **수정됨** — `persistSnapshot()`이 QuotaExceededError 감지 후 사용자 메시지 반환 |
| 편집 모드 CTA 앵커 클릭 시 페이지 이탈 | **미해결** — `.rendered-cta`가 여전히 실제 `<a href>`이고 click 기본동작 차단 없음 (pointerdown preventDefault는 anchor 클릭을 막지 못함) |
| 로딩 실패 재시도 없음 | 부분 개선 — 오류 메시지는 표시하나 재시도 버튼은 여전히 없음 |

### 2.4 결정적 검증 계층 신설

`layout-utils.mjs`의 `validateLayoutSpec()`: xPct 0~100, yPx 0~1200, fontSize 10~80, textAlign enum, minHeight 50~1200 범위 검증 후 `{ok, errors, spec}` 반환. Admin 레이아웃 저장 전 강제 실행. **AI Design Spec 생성(전략 문서 2.1)에 그대로 재사용 가능한 기반**이며, 서버(`wizard-form-template-layout` PATCH)에서도 `validation_result`를 저장한다.

### 2.5 테스트

계약 테스트 15종(worker payload, wizard sections/templates/layout, visual editor contract 등) + behavior 테스트 2종(`test-visual-editor-behavior.mjs`, `test-wizard-layout-behavior.mjs`). PoC 단계 프로젝트로는 상당히 좋은 커버리지.

## 3. 주요 이슈 (우선순위순)

### 3.1 [심각] 인증·인가 전무

`api/` 61개 파일 전체에서 요청 인증 코드가 없다 (grep 매치는 Blob 토큰 outbound 헤더뿐). 다음이 모두 공개 URL에서 무인증 호출 가능하다:

- 템플릿/섹션/프롬프트/웹훅 설정의 생성·수정·활성화·보관
- 레이아웃 PATCH, 사용 이벤트 INSERT (DoS성 대량 적재 가능 — rate limit 없음)
- 생성 파이프라인 trigger (n8n 실행 → 모델 API 비용 발생)

PoC 정책으로 이연된 것은 문서화되어 있으나, **비용이 발생하는 생성 trigger와 쓰기 API만이라도** Vercel Deployment Protection 또는 공유 시크릿 헤더를 우선 적용할 것을 권고한다.

### 3.2 [높음] 프론트 대형 단일 파일 3개의 유지보수 한계

`app.js` 5,147줄(빌드 없는 CDN Vue), `create-promo.js` 2,631줄, `promo-wizard.js` 2,438줄. 세 파일이 템플릿 로드·검증·렌더링 로직을 각각 중복 구현하고 있다(예: 활성 템플릿 조회 + fail-closed 처리가 3곳에 존재). Visual Editor에서 증명된 Vite 번들 + 모듈 분리 패턴을 Wizard/Create Promo에 확장하는 리팩터링 단위를 계획에 넣을 시점이다. 수동 캐시버스팅(`?v=create-promo-appearance-v18` — 벌써 v18)도 Vite 해시 파일명으로 대체 가능하다.

### 3.3 [높음] 레이아웃 데이터 흐름의 localStorage 의존

Wizard가 템플릿별 사용자 레이아웃을 `contentState.templateLayouts[templateKey]`로 localStorage에 보존하고 layoutRevision 불일치 시 base로 폴백하는 구조는 합리적이나, Visual Editor Snapshot(배경 이미지 Data URL 포함 가능)과 같은 저장소를 공유한다. 쿼터 실패 처리는 생겼지만 근본적으로 **run 단위 서버 저장(Generation Run 또는 Promo Artifact)** 으로의 전환이 필요하다. `@vercel/blob` 의존성은 이미 있으나 미사용.

### 3.4 [중간] 편집 모드 CTA 클릭 이탈 (미해결 잔존)

3.1절 표 참조. `editable`일 때 앵커에 `@click.prevent` 추가 또는 `<a>` 대신 `<span role="link">` 렌더링 필요. 편집 내용이 localStorage 저장 전이면 유실된다.

### 3.5 [중간] DB 스키마 기준선 불확실

마이그레이션 001 부재 + seed가 "initial schema 존재" 전제. `review-db-tables-cleanup-2026-07-15.md`의 삭제 후보 처리 전 라이브 DB 대조 절차가 여전히 유효하다. 신규 023 테이블은 `if not exists`로 방어하고 있어 재실행 안전.

### 3.6 [낮음] 기타

- `api/_db.js`의 env 폴백 체인(NEON→DATABASE→POSTGRES→parts 조합)은 편리하나 어떤 env가 실제 사용됐는지 로그가 없어 환경 혼선 디버깅이 어렵다.
- `estimatedItemHeight`(250/64/86), 캔버스 `-76` 매직넘버가 Renderer에 잔존.
- `qa-label-guard.js` 실패(n8n workflow JSON 3개 prompt guard 문구 누락)가 07-14부터 미해결 상태로 유지 중.
- 모바일 breakpoint 좌표 override 미구현(기존 known issue 유지).

## 4. 권고 요약

1. **인증 최소 적용** — 쓰기 API + 생성 trigger에 공유 시크릿/Deployment Protection (1일 내 가능한 범위).
2. **CTA 클릭 이탈 수정** — Renderer 한 줄 수정 수준.
3. **레이아웃/Snapshot 서버 저장 설계** — Blob + run 연계, localStorage는 캐시로 강등.
4. **Wizard/Create Promo의 Vite 모듈화 로드맵 수립** — Visual Editor 패턴 재사용, 템플릿 로드 로직 공용 모듈 추출.
5. **validateLayoutSpec을 AI Design Spec 검증기로 확장** — 전략 문서 2.1 착수 시 신규 작성이 아니라 이 모듈 확장으로 진행.

## 5. 결론

07-12~07-15 검토에서 지적된 사항 중 상당수(false-success 저장, 포커스 유실, 쿼터 실패, 좌표 복원, 검증 부재)가 실제 코드에 반영·해소되었고, 낙관적 잠금·멱등 이벤트·결정적 검증 같은 운영 품질 패턴이 자리잡기 시작했다. 현재 가장 큰 격차는 코드 품질이 아니라 **인증 부재**와 **프론트 3대 단일 파일의 구조적 부채**다. AI Design Spec 단계로 진입하기 전에 3.1과 3.3을 해소하는 것이 순서상 안전하다.
