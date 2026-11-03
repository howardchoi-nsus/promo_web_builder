# Visual Editor P1 안정화 개발계획서

- 작성일: 2026-07-17
- 대상 프로젝트: `promo_web_builder`
- 기준 브랜치: `main`
- 기준 문서: `docs/handoff-2026-07-16.md`
- 상태: 로컬 개발 및 검증 완료, 배포 대기
- 오늘 목표: 코드 리뷰 결함을 해소하고 Visual Editor 핵심 편집 흐름과 Web Output을 브라우저 및 배포 환경에서 검증한다.

## 1. 배경

2026-07-16 작업으로 독립 Visual Editor, Vue Renderer, 자유 배치, 텍스트 스타일 편집, 섹션 높이 조절, 배경 이미지, Guides ON/OFF, Web Output과 배포 경로가 구현됐다.

현재 계약 테스트와 주요 JavaScript 문법 검사는 통과하고 배포 경로도 HTTP 200을 반환한다. 다만 소스코드 리뷰에서 다음 결함과 검증 공백이 확인됐다.

1. CTA URL에 허용 스킴 검증이 없다.
2. Snapshot을 `localStorage`에 저장할 때 용량 초과 예외를 처리하지 않는다.
3. Renderer는 Y 좌표를 `yPx`로 저장하지만 CONTENT 패널은 `yPct`를 표시한다.
4. Visual Editor의 `Promo Builder` 링크가 Builder가 아니라 루트 랜딩으로 이동한다.
5. 현재 계약 테스트는 소스 문자열 중심이어서 위 상호작용 회귀를 검출하지 못한다.
6. 실제 브라우저에서 드래그, 섹션 리사이즈, 배경 이미지와 Web Output 동등성을 최종 검수하지 않았다.

오늘은 신규 편집 기능을 확장하기 전에 위 결함과 검증 공백을 닫아 P1 기준선을 안정화한다.

## 2. 오늘의 목표

오늘 완료할 결과는 다음과 같다.

- CTA가 안전한 URL만 링크로 출력된다.
- Snapshot 저장 실패가 사용자에게 명확히 안내되고 실패 상태에서 Web Output을 열지 않는다.
- 자유 배치 좌표가 저장값과 UI에서 동일한 단위로 표시된다.
- Visual Editor 내비게이션이 올바른 서비스 경로로 이동한다.
- 핵심 동작을 검증하는 자동 테스트가 추가된다.
- 로컬 브라우저와 최신 배포 환경에서 핵심 편집 흐름을 확인한다.
- 검증 결과와 남은 제한사항을 당일 handoff에 기록할 수 있는 상태를 만든다.

## 3. 개발 범위

### 3.1 P0 — CTA URL 안전성

대상:

- `visual-editor/src/PromoPageRenderer.vue`
- 필요 시 `visual-editor/src/contracts.js`
- `scripts/test-visual-editor-contract.js` 또는 신규 동작 테스트

개발 내용:

1. CTA 입력 URL을 Renderer에 전달하기 전에 정규화한다.
2. 초기 허용 범위는 다음으로 제한한다.
   - `https:`
   - `http:`
   - `/`로 시작하는 동일 Origin 절대 경로
   - `./`, `../`로 시작하는 상대 경로
   - `#`로 시작하는 페이지 내부 앵커
3. `javascript:`, `data:`, `vbscript:`와 해석이 불명확한 스킴은 차단한다.
4. 빈 값 또는 차단된 값은 안전한 fallback인 `#`으로 변환한다.
5. 새 창 링크를 지원하는 경우 `noopener noreferrer`를 유지한다.

완료 기준:

- 정상 HTTPS URL과 허용된 상대 경로가 유지된다.
- 대소문자와 앞뒤 공백이 섞인 위험 스킴도 차단된다.
- CTA 텍스트와 다른 디자인 속성에는 회귀가 없다.

### 3.2 P0 — Snapshot 저장 실패 처리

대상:

- `visual-editor/src/App.vue`
- 필요 시 `visual-editor/src/styles.css`
- 관련 테스트

개발 내용:

1. `localStorage.setItem()`과 직렬화를 `try/catch`로 감싼다.
2. 저장 성공 후에만 Web Output 창을 연다.
3. `QuotaExceededError`와 일반 저장 오류를 구분할 수 있으면 용량 안내를 우선 표시한다.
4. 오류 메시지는 Visual Editor 화면에서 확인할 수 있어야 한다.
5. 저장 실패 후 배경 이미지를 제거하거나 교체하고 다시 시도할 수 있어야 한다.
6. 오늘은 저장소 구조를 Blob으로 전환하지 않고 PoC 저장 실패를 안전하게 처리하는 데 한정한다.

완료 기준:

- 저장 성공 시 기존과 동일하게 Web Output이 열린다.
- 저장 실패 시 새 창이 열리지 않는다.
- 실패 원인이 사용자에게 표시된다.
- 오류 발생 후 편집 상태가 유실되지 않는다.

### 3.3 P0 — 자유 배치 좌표 정합성

대상:

- `visual-editor/src/App.vue`
- `visual-editor/src/PromoPageRenderer.vue`
- 관련 테스트

개발 내용:

1. 자유 배치 상태의 X 좌표는 `xPct`, Y 좌표는 `yPx`를 기준으로 표시한다.
2. CONTENT 패널의 단위도 `X n% · Y npx`로 명시한다.
3. `자동 배치로 복원` 시 다음 자유 배치 속성을 정리한다.
   - `positionMode`
   - `xPct`
   - `yPx`
   - 과거 호환 값인 `yPct`
4. 기본 자동 배치 계산에 사용하는 내부 `yPct`와 사용자 저장값 `yPx`의 역할을 혼동하지 않도록 함수 또는 주석으로 경계를 명확히 한다.
5. 섹션 리사이즈가 아이템 Y 좌표를 고정하는 기존 동작을 유지한다.

완료 기준:

- 드래그 종료 후 CONTENT 패널에 실제 저장된 Y 픽셀값이 표시된다.
- 자동 배치 복원 후 자유 배치 좌표가 Snapshot에 남지 않는다.
- 다시 드래그했을 때 현재 위치를 기준으로 정상 저장된다.
- Preview와 Web Output에서 같은 Snapshot이 같은 위치로 출력된다.

### 3.4 P1 — 내비게이션 경로 수정

대상:

- `visual-editor/src/App.vue`
- 빌드 산출물

개발 내용:

1. Visual Editor의 `Promo Builder` 링크를 `/prototype/index.html`로 변경한다.
2. `Promo Wizard`와 `Visual Editor로 돌아가기` 링크도 현재 배포 경로 정책과 일치하는지 재확인한다.
3. Vercel `cleanUrls: true` 환경과 로컬 Vite alias 환경에서 모두 진입 가능한지 확인한다.

완료 기준:

- `Promo Builder` 클릭 시 Builder 화면으로 이동한다.
- 랜딩페이지로 이동하려면 별도 홈 링크만 사용한다.
- Visual Editor 및 Web Output 정적 자산에 404가 없다.

### 3.5 P1 — 테스트 보강

대상:

- `scripts/test-visual-editor-contract.js`
- 필요 시 별도 테스트 helper 또는 브라우저 검수 스크립트
- `package.json`

필수 자동 검증:

1. CTA URL 정규화
   - HTTPS 허용
   - 상대 경로 허용
   - `javascript:` 차단
   - 대소문자 및 공백 우회 차단
2. 좌표 계약
   - 드래그 저장 형식에 `xPct`, `yPx` 사용
   - 위치 UI가 `yPx`를 표시
   - 자동 배치 복원이 `yPx`와 레거시 `yPct`를 정리
3. Snapshot 저장
   - 저장 성공 후에만 `window.open()` 호출
   - 저장 예외 시 오류 상태 설정
4. 내비게이션
   - Promo Builder 경로가 `/prototype/index.html`
5. 기존 계약
   - Preview와 Output이 동일 Renderer bundle 사용
   - Guides가 Output에 노출되지 않음
   - Form Template 공개 API 계약 유지

테스트 원칙:

- 정규식으로 소스 문자열 존재만 확인하는 검사는 최소화한다.
- URL 정규화와 Snapshot 저장 로직은 가능한 한 순수 함수로 분리해 입력과 결과를 직접 검증한다.
- DOM 상호작용을 자동화하기 어려운 항목은 명시적인 브라우저 체크리스트로 보완한다.

## 4. 브라우저 검수 계획

### 4.1 기본 진입

- Root 랜딩에서 Visual Editor 카드가 표시된다.
- Visual Editor 진입 후 기본 Form Template이 로드된다.
- 브라우저 콘솔에 초기 로드 오류가 없다.
- CSS, JavaScript와 API 요청에 404 또는 5xx가 없다.

### 4.2 SECTIONS 및 CONTENT

- 첫 번째 섹션과 아이템이 초기 선택된다.
- 섹션 아코디언을 열고 닫을 수 있다.
- 다른 섹션을 열면 이전 섹션이 닫힌다.
- 아이템 선택과 CONTENT 패널 내용이 일치한다.
- 아이템이 없는 섹션도 오류 없이 표시된다.

### 4.3 자유 배치 및 텍스트 편집

- 텍스트, CTA와 이미지 아이템을 각각 드래그할 수 있다.
- 선택한 아이템 외의 형제 아이템은 이동하지 않는다.
- 드래그 후 X/Y 표시가 실제 저장값과 일치한다.
- 자동 배치 복원 후 기본 위치로 돌아간다.
- 텍스트 더블클릭 편집과 CONTENT 패널 값이 동기화된다.
- 잠금 아이템은 사용자가 이동하거나 수정할 수 없다.

### 4.4 섹션 높이

- 섹션 하단 핸들로 높이를 확대·축소할 수 있다.
- 가장 아래 아이템이 섹션 밖으로 나가기 전에 축소가 멈춘다.
- CTA와 잠금 아이템의 Y 위치가 리사이즈 중 유지된다.
- 높이 초기화가 기본 높이로 복원된다.

### 4.5 배경 및 Guides

- 배경 컬러 토큰이 Preview에 즉시 반영된다.
- 이미지 첨부·교체·제거가 정상 동작한다.
- 허용 크기 초과 또는 이미지가 아닌 파일에 오류가 표시된다.
- Guides OFF 시 폭 가이드, 섹션 구분선과 리사이즈 핸들이 모두 숨겨진다.
- Web Output에는 편집 가이드가 표시되지 않는다.

### 4.6 Preview 및 Web Output 동등성

- Web Output 열기 후 동일 콘텐츠가 표시된다.
- 배경, 텍스트 스타일, 자유 배치 좌표와 섹션 높이가 Preview와 일치한다.
- CTA의 정상 URL은 동작하고 위험 URL은 실행되지 않는다.
- 저장 실패를 강제한 경우 Web Output이 열리지 않고 오류가 표시된다.
- Desktop과 Mobile Preview에서 치명적인 잘림이나 접근 불가능한 UI가 없다.

## 5. 구현 순서

1. CTA URL 정규화 함수를 분리하고 단위 테스트를 작성한다.
2. Snapshot 저장 함수와 오류 상태를 분리하고 테스트를 작성한다.
3. Y 좌표 표시와 자동 배치 초기화를 수정한다.
4. Promo Builder 링크를 수정한다.
5. Visual Editor 계약 테스트를 보강한다.
6. JavaScript 문법 검사와 계약 테스트를 실행한다.
7. Visual Editor production build를 실행한다.
8. 로컬 브라우저에서 핵심 UX를 검수한다.
9. 배포 후 Vercel 경로와 핵심 동작을 smoke test한다.
10. 당일 handoff에 검증 결과와 남은 제한사항을 기록한다.

## 6. 예상 변경 파일

필수:

- `visual-editor/src/App.vue`
- `visual-editor/src/PromoPageRenderer.vue`
- `scripts/test-visual-editor-contract.js`
- `prototype/visual-editor-assets/visual-editor.js`
- `prototype/visual-editor-assets/visual-editor.css` — 스타일 변경이 있을 때만

선택:

- `visual-editor/src/contracts.js` — 공통 정규화 또는 저장 helper를 둘 경우
- `package.json` — 신규 테스트 스크립트를 추가할 경우
- `docs/handoff-2026-07-17.md` — 작업 종료 시 작성

## 7. 검증 명령

프로젝트 의존성이 설치된 환경에서 다음을 실행한다.

```bash
npm run test:visual-editor-contract
npm run check
npm run build:visual-editor
git diff --check
```

현재 로컬에 Vite 의존성이 없으면 먼저 프로젝트 잠금 파일 기준으로 의존성을 복원한 뒤 build를 실행한다. 의존성 설치 결과로 생성되는 불필요한 파일이나 잠금 파일 변경은 커밋 범위에 포함하지 않는다.

## 8. 롤백 계획

1. URL 정규화 문제 발생 시 기존 CTA 표시를 유지하되 링크를 `#`으로 강제해 실행을 차단한다.
2. Snapshot 저장 변경에 문제가 있으면 Web Output 진입을 비활성화하고 편집 상태는 유지한다.
3. 좌표 변경에 회귀가 생기면 저장 계약 `xPct + yPx`는 유지하고 위치 표시 UI만 숨긴다.
4. 배포 자산에 문제가 생기면 직전 정상 Visual Editor bundle과 HTML 경로로 복원한다.
5. 기존 Promo Wizard와 Promo Builder는 이번 변경 범위에서 수정하지 않아 독립적으로 계속 사용할 수 있어야 한다.

## 9. 오늘 제외 범위

다음 기능은 P1 안정화 완료 후 별도 계획으로 진행한다.

- Undo/Redo
- 복사·붙여넣기·삭제
- 키보드 방향키 이동
- 아이템 폭·높이 직접 리사이즈
- 정렬 및 스냅 가이드
- z-index 편집 UI
- breakpoint별 좌표 및 크기 override
- 배경 이미지 Blob 저장소 전환
- Renderer Registry DB 및 관리자 CRUD
- 관리자 템플릿 초기 좌표·크기·스타일 연동
- LLM Vue 코드 생성과 Sandbox

## 10. Definition of Done

오늘 범위는 다음 조건을 모두 충족해야 완료로 판정한다.

1. 코드 리뷰에서 확인된 CTA URL, Snapshot 저장, Y 좌표와 내비게이션 결함이 수정됐다.
2. 위험 CTA URL이 실행되지 않는다.
3. Snapshot 저장 실패가 사용자에게 표시되고 편집 상태가 유지된다.
4. 자유 배치 좌표의 저장값, CONTENT 패널 표시와 Web Output 결과가 일치한다.
5. 계약 테스트, JavaScript 문법 검사, production build와 `git diff --check`가 통과한다.
6. 핵심 브라우저 체크리스트를 로컬에서 통과한다.
7. 최신 Vercel 배포에서 Visual Editor, Web Output, 정적 자산과 공개 Form Template API가 정상 응답한다.
8. 미완료 항목과 알려진 제한사항이 `handoff-2026-07-17.md`에 기록된다.

## 11. 오늘 작업 종료 시 남아 있어도 되는 제한사항

- 배경 이미지는 PoC 기준으로 Data URL과 `localStorage`를 사용한다.
- Y 좌표는 픽셀, X 좌표는 비율 단위를 사용한다.
- 모바일 전용 좌표 override는 제공하지 않는다.
- 아이템 크기와 z-index를 UI에서 직접 편집하지 않는다.
- Web Output은 배포 가능한 영구 Artifact가 아니라 현재 브라우저 Snapshot 기반 결과 화면이다.

위 제한사항은 오류가 아니라 다음 개발 단계의 명시적 범위로 관리한다.

## 12. 실행 결과 — 2026-07-17

계획서의 로컬 개발 및 디버깅 범위를 다음과 같이 완료했다.

### 반영 완료

- CTA URL을 HTTP/HTTPS, 안전한 상대 경로와 앵커만 허용하도록 정규화했다.
- Snapshot 저장을 안전한 helper로 분리하고 저장 공간 초과 및 일반 저장 실패를 사용자 메시지로 처리했다.
- 저장 성공 후에만 Web Output을 열도록 변경했다.
- 자유 배치 위치 표시를 `X n% · Y npx`로 통일했다.
- 자동 배치 복원 시 `positionMode`, `xPct`, `yPx`, 레거시 `yPct`를 제거한다.
- Visual Editor의 Promo Builder 링크를 `/prototype/index.html`로 수정했다.
- URL, 좌표 초기화와 저장 실패를 직접 검증하는 동작 테스트를 추가했다.
- 기존 계약 테스트에 좌표 표시, 저장 예외, 내비게이션과 preview 서버 경로 검사를 추가했다.

### 디버깅 중 추가 수정

- 저장 오류 알림 추가 후 Vue `v-else`가 잘못 연결되어 템플릿 로드 전에 workspace가 렌더링되던 초기 런타임 오류를 수정했다.
- 로컬 preview 서버가 `/prototype/*` 정적 자산 경로를 처리하지 못하던 문제를 수정했다.
- 로컬 preview 서버의 `/favicon.ico` 요청을 204로 처리해 브라우저 콘솔 404를 제거했다.

### 검증 완료

- `scripts/test-visual-editor-behavior.mjs`: 통과
- `scripts/test-visual-editor-contract.js`: 통과
- 주요 JavaScript 문법 검사: 통과
- Visual Editor production build: 통과
- `git diff --check`: 통과
- Headless Chromium 브라우저 검증: 통과
  - 초기 화면 및 핵심 UI 렌더링
  - 위험 CTA URL 차단
  - 자유 배치 후 Y 픽셀 표시
  - 자동 배치 복원
  - Guides ON/OFF
  - Web Output 렌더링 및 편집 가이드 제거
  - 저장 공간 초과 오류 표시 및 새 창 차단
  - 브라우저 콘솔 및 페이지 런타임 오류 없음

### 남은 단계

- 변경 사항 커밋 및 원격 반영
- 최신 Vercel 배포 완료 후 동일 smoke test 재실행
- 배포 결과와 운영 제한사항을 당일 handoff에 기록
