# Promo Web Builder 소스코드 정리 및 중복 검토 보고서

- 작성일: 2026-07-20
- 대상 저장소: `promo_web_builder`
- 검토 범위: 프런트엔드, 관리자 페이지, Promo Wizard, Create Promo, Visual Editor, API, 테스트, 생성 산출물
- 검토 방식: 정적 소스 분석, 내부 참조 검색, 파일 규모 비교, 함수 중복 비교, 문법 검사 및 전체 테스트 실행
- 변경 여부: 이 문서 외 소스코드 변경 없음

## 1. 검토 목적

현재 Promo Web Builder에는 Promo Builder, 관리자 페이지, Promo Wizard, Create Promo, Visual Editor, AI 생성 API 및 n8n 워크플로가 함께 존재한다. 기능 확장 과정에서 기존 코드를 복제하거나 이전 구현을 유지한 부분이 누적되어 다음 위험이 커지고 있다.

- 같은 기능을 여러 파일에서 각각 수정해야 하는 중복 유지보수
- 현재 화면에서 사용하지 않는 API 요청과 polling 실행
- 단일 HTML·JavaScript·CSS 파일의 비대화
- 공통 헤더와 메뉴를 여러 화면에서 수동 관리
- 테스트 결과물, SQL seed, n8n workflow 변형본의 저장소 혼재
- 정적 문자열 기반 테스트에 대한 과도한 의존

본 문서는 즉시 삭제 가능한 후보와 구조 개선이 필요한 부분을 구분하고, 기능 회귀를 최소화하는 정리 순서를 제안한다.

## 2. 전체 결론

현재 문법 검사와 기존 테스트는 통과하므로 즉각적인 기능 장애 상태는 아니다. 다만 다음 세 항목은 우선순위가 높다.

1. Create Promo에 남은 미사용 Promo Wizard 생성 코드와 초기 API 호출 제거
2. Create Promo와 Promo Wizard의 공통 상태·API·레이아웃 로직 추출
3. 관리자 페이지와 공통 App Shell을 기능 단위로 분리

저장소 정리는 기능 코드 정리와 별도로 수행해야 한다. 특히 `tmp/`, 중복 SQL seed, n8n 테스트·백업 파일은 운영 기준을 먼저 정한 뒤 삭제하거나 archive로 이동해야 한다.

## 3. 주요 검토 결과

### 3.1 높음: Create Promo에서 사용하지 않는 기존 Wizard 코드 실행

대상:

- `prototype/create-promo.js`

현재 Create Promo는 다음 네 단계로 구성된다.

1. 배경색 선택
2. CTA 스타일 선택
3. 템플릿 및 콘텐츠 등록
4. Web Output

그러나 파일에는 기존 Promo Wizard의 Design Concept, Integrated Brief, LO-FI, Final Design 생성 로직이 상당 부분 남아 있다. 현재 `renderStep()`은 아래 전용 렌더러만 사용한다.

- `renderBackgroundStep()`
- `renderCtaStep()`
- `renderContentStep()`
- `renderWebOutputStep()`

그럼에도 파일 마지막에서 다음 초기화가 실행된다.

```js
loadDesignDocuments();
loadWorkerSettings();
loadWizardSectionDefinitions();
syncRunPolling();
```

이 중 `loadDesignDocuments()`, `loadWorkerSettings()`, `syncRunPolling()`은 현재 Create Promo 화면에 노출되지 않는 과거 생성 흐름을 위한 코드다. 이 상태에서는 다음 부작용이 발생할 수 있다.

- `/api/design-documents` 불필요 호출
- `/api/promo-generation-worker-settings` 불필요 호출
- 기존 generation run이 active 상태이면 5초 간격 polling 재개
- 호출 완료 때마다 `renderStep()`이 다시 실행되어 불필요한 DOM 재생성
- Create Promo의 실제 의존성과 코드상 의존성이 달라짐

정적 참조 검색 결과, Create Promo 안에서 정의 외 참조가 확인되지 않은 함수는 다음과 같다.

- `workerStatusLabel`
- `createSectionInputSection`
- `autofillContent`
- `resetContent`
- `createSectionAiHeaderAction`
- `createSectionAiDesignPanel`
- `renderLofiStep`
- `renderFinalStep`
- `runStatusText`
- `renderConceptStep`

#### 권장 조치

- Create Promo에서 기존 AI generation 흐름을 사용하지 않는다면 관련 상태, 함수, API 요청 및 polling을 삭제한다.
- 향후 AI 기능에 재사용할 계획이면 `wizard-generation.js` 같은 별도 모듈로 추출하고 필요한 화면에서만 지연 로드한다.
- `loadWizardSectionDefinitions()`는 Step 3 템플릿·콘텐츠 구성에 필요하므로 유지한다.
- 제거 전 Create Promo Step 1~4 회귀 테스트를 추가한다.

### 3.2 높음: Create Promo와 Promo Wizard 코드 중복

파일 규모:

| 파일 | 줄 수 | 함수 수 |
|---|---:|---:|
| `prototype/create-promo.js` | 3,402 | 130 |
| `prototype/promo-wizard.js` | 2,436 | 95 |
| `prototype/create-promo.css` | 1,751 | - |
| `prototype/promo-wizard.css` | 1,217 | - |

Promo Wizard의 함수명 95개가 전부 Create Promo에도 존재한다. Create Promo가 Promo Wizard에서 복제된 이후 배경색·CTA·Step 3·Web Output 기능이 추가된 구조이기 때문이다.

공통 영역에는 다음이 포함된다.

- Wizard 콘텐츠 상태 생성·저장·마이그레이션
- 관리자 Section 정의 조회
- 관리자 Form Template 조회
- 템플릿 선택 및 콘텐츠 adapter
- Section 순서 변경
- layout snapshot과 localStorage cache
- Integrated Brief, LO-FI, Final Design API 통신
- 생성 run polling
- 콘텐츠 필드 생성과 검증
- concept/document helper

현재 구조에서는 관리자 템플릿 계약이나 API가 변경될 때 두 파일을 각각 수정해야 한다. 한쪽만 변경되면 Promo Wizard와 Create Promo의 동작이 조용히 달라질 수 있다.

#### 권장 모듈 구조

```text
prototype/wizard/
├── wizard-core.js
├── wizard-content.js
├── wizard-template.js
├── wizard-layout.js
├── wizard-generation.js
├── create-promo-flow.js
├── promo-wizard-flow.js
└── wizard-base.css
```

- `wizard-core.js`: 공통 상태, storage, fetch helper
- `wizard-content.js`: Section 입력, 검증, migration
- `wizard-template.js`: 관리자 Form Template 연동
- `wizard-layout.js`: layout identity, cache, order 처리
- `wizard-generation.js`: Integrated Brief, LO-FI, Final 생성
- `create-promo-flow.js`: 배경, CTA, Step 3, Web Output
- `promo-wizard-flow.js`: 기존 Promo Wizard 단계
- `wizard-base.css`: 두 Wizard의 공통 스타일

### 3.3 중간: 도달 불가능한 Step placeholder 코드

`prototype/create-promo.js`의 `steps` 설정에는 Step 3과 Step 4에 다음 내용이 남아 있다.

- “다음 개발 범위”
- 템플릿 입력 기능은 이후 연결한다는 설명
- Web Output 기능은 이후 연결한다는 설명

그러나 해당 기능은 이미 구현되어 있고, `renderStep()`은 Step 0~3에서 모두 전용 렌더러를 실행한 뒤 반환한다. 따라서 하단 `step.cards.forEach()` fallback은 정상 사용자 경로에서 도달할 수 없다.

#### 삭제 후보

- `steps[].cards`
- “다음 개발 범위” placeholder 문구
- `step.cards.forEach()` fallback 렌더링

유효하지 않은 step index를 처리할 필요가 있다면 placeholder 카드 대신 명시적인 오류 상태를 사용한다.

### 3.4 중간: 관리자 페이지 단일 파일 비대화

| 파일 | 줄 수 |
|---|---:|
| `prototype/app.js` | 5,148 |
| `prototype/index.html` | 1,770 |
| `prototype/styles.css` | 3,601 |

현재 관리자 관련 기능과 Promo Builder 기능이 하나의 Vue 인스턴스와 HTML template에 집중되어 있다.

포함 기능:

- 디자인 MD 관리
- 프로모션 생성 흐름
- Prompt Template 관리
- Worker webhook 설정
- Wizard Content Section 관리
- Form Template 관리
- Template Layout 관리
- Section audit log
- 생성 결과 관리

이 구조에서 공통 좌측 메뉴와 3열 App Shell을 추가하면 수정 영향 범위가 더 커진다.

#### 권장 분리 단위

- `AppShell`
- `PromoBuilderView`
- `AdminView`
- `DesignDocumentManager`
- `PromptManager`
- `WizardContentSectionManager`
- `TemplateLayoutManager`
- `SectionAuditLog`
- API별 service 모듈

관리자 페이지 전체를 한 번에 재작성하지 말고, 공통 Shell을 먼저 만들고 독립성이 높은 관리 탭부터 분리하는 것이 안전하다.

### 3.5 중간: 공통 헤더 마크업 중복

동일한 브랜드, 글로벌 메뉴, 테마 버튼, 상태 표시 마크업이 다음 파일에 각각 존재한다.

- `prototype/index.html`
- `prototype/create-promo.html`
- `prototype/promo-wizard.html`
- `visual-editor/src/App.vue`

현재 공통화된 것은 `shared-shell-header.css`와 `shared-shell.js`의 테마 처리뿐이다. 메뉴 항목, URL, 활성 상태, 페이지 이름은 네 위치에서 수동 관리된다.

#### 위험

- 메뉴 추가 시 일부 화면 누락
- URL 또는 활성 상태 불일치
- 좌측 사이드바 개편 시 네 화면을 각각 수정
- Visual Editor 빌드 산출물과 소스 간 불일치

#### 권장 조치

- 글로벌 메뉴를 공통 설정 객체로 정의한다.
- Vue 화면은 `AppShell` 컴포넌트를 사용한다.
- 정적 HTML 화면은 공통 Shell renderer 또는 build 시 partial 주입 방식을 사용한다.
- Visual Editor embedded mode에서는 글로벌 Shell을 렌더링하지 않는다.

### 3.6 중간: CSS 책임 중복과 cascade 의존성

`prototype/index.html`에서는 같은 요소에 다음 클래스가 동시에 적용된다.

```html
<header class="topbar shell-header">
<nav class="top-nav shell-nav">
<div class="status-pill shell-status">
```

관련 스타일은 두 파일에 나뉜다.

- `prototype/styles.css`: `.topbar`, `.top-nav`, `.status-pill`
- `prototype/shared-shell-header.css`: `.shell-header`, `.shell-nav`, `.shell-status`

이 구조는 CSS 로드 순서와 specificity에 의존한다. padding, border, radius, responsive 규칙이 어느 파일의 책임인지 명확하지 않다.

#### 권장 조치

- 공통 Shell 스타일은 `shared-shell-header.css` 또는 신규 `app-shell.css` 하나에서 관리한다.
- `.topbar`, `.top-nav`, `.status-pill`의 중복 역할을 제거한다.
- 페이지 전용 보정은 `.admin-shell`, `.create-promo-shell`처럼 범위를 명시한다.
- Create Promo와 Promo Wizard CSS는 `wizard-base.css`와 페이지별 override로 분리한다.

### 3.7 중간: 생성 산출물과 임시 파일 혼재

확인된 규모:

| 영역 | 크기 | 상태 |
|---|---:|---|
| `tmp/` | 약 5.1MB | 테스트 MD, PDF 렌더 이미지 추적 중 |
| `db/seeds/001_seed_design_md.sql` | 약 4.1MB | 생성된 전체 seed |
| `db/seeds/chunks/` | 약 4.1MB | 동일 데이터의 chunk seed |
| `prototype/visual-editor-assets/` | 약 148KB | Vite 빌드 결과 추적 중 |
| `n8n/` | 약 824KB | 운영·테스트·backup 변형 혼재 |

현재 `.gitignore`에는 다음 항목만 있다.

```gitignore
node_modules/
.vercel
.env*
```

`scripts/test-design-prompt-md.js`는 다음 파일을 다시 생성한다.

- `tmp/design-prompt-md-test.md`
- `tmp/section-input-log-md-test.md`

따라서 해당 파일은 소스라기보다 테스트 산출물에 가깝다.

#### 권장 조치

- `tmp/`를 `.gitignore`에 추가한다.
- 문서 증거로 보존해야 하는 이미지는 `docs/assets/`로 이동한다.
- SQL seed는 원본 Markdown을 source of truth로 두고 전체 또는 chunk 중 하나만 관리한다.
- 생성 SQL이 반드시 저장소에 필요하면 자동 생성 파일임을 README에 명시한다.
- Visual Editor bundle을 커밋해야 한다면 직접 수정 금지와 생성 명령을 문서화한다.

### 3.8 중간: n8n workflow 변형본 관리 불명확

`n8n/`에는 다음 유형이 함께 존재한다.

- 실제 workflow
- provider-routed 버전
- image-edit 버전
- admin-driven 버전
- testing 버전
- gemini-fixed 버전
- backup 버전

특히 아래 두 파일은 같은 workflow ID를 사용하지만 노드 수와 내용이 다르다.

- `Promo UI Design Image Generator_test (2).gemini-fixed.json`
- `Promo UI Design Image Generator_testing.gemini-http.json`

활성 기준이 문서와 파일명만으로 명확하지 않아 잘못된 버전을 import할 위험이 있다.

#### 권장 구조

```text
n8n/
├── active/
├── archive/
├── fixtures/
├── transforms/
└── manifest.md
```

`manifest.md`에는 workflow 이름, ID, 활성 파일, provider, webhook 경로, 마지막 검증일을 기록한다. 실제 n8n 상태를 확인하기 전에는 동일 ID 파일을 바로 삭제하지 않는다.

### 3.9 낮음: 루트 proxy 및 redirect 파일

내부 HTML 참조가 확인되지 않은 얇은 proxy 파일:

- `app.js`
- `styles.css`
- `generated.js`

루트 redirect 화면:

- `create-promo.html`
- `promo-wizard.html`
- `generated.html`

redirect HTML은 JavaScript로 `/prototype/...` 경로로 이동시킨다. Vercel routing으로 처리하면 중간 HTML과 fallback markup을 제거할 수 있다.

#### 주의사항

- 외부 북마크나 과거 배포 페이지가 루트 URL을 사용할 수 있다.
- 현재 계약 테스트가 루트 redirect 존재를 확인한다.
- 삭제 전 Vercel access log 또는 실제 외부 링크 사용 여부를 확인한다.
- route rewrite와 테스트 변경을 같은 배포에 포함한다.

### 3.10 낮음: API boilerplate 중복

확인 결과 35개 API 파일에 HTTP method guard가 반복된다. `getSql()`과 `parseBody()`도 여러 store에 각각 구현되어 있다.

공통화 후보:

- `allowMethods(req, res, methods)`
- `parseJsonBody(req)`
- `requireString(body, key)`
- `createSqlClient()`
- UUID 및 배열 중복 검증
- 공통 오류 응답
- reorder SQL helper

API별 업무 규칙은 분리하되 HTTP와 DB 연결 boilerplate만 공통화해야 한다. 모든 API를 하나의 거대한 handler로 합치는 방식은 권장하지 않는다.

### 3.11 낮음: 테스트 실행 진입점 및 테스트 방식

`package.json`에는 18개의 `test:*` 명령이 있지만 기본 `test` 명령이 없다.

정적 계약 테스트의 특징:

- `assert.match`: 407건
- `assert.doesNotMatch`: 40건
- HTTP 또는 browser를 사용하는 테스트: 0건

현재 테스트는 특정 함수명, CSS selector, 소스 문자열의 존재 여부를 강하게 검사한다. 회귀 방지에는 도움이 되지만 다음 문제를 잡기 어렵다.

- 실제 DOM 렌더링 실패
- API 요청·응답 계약 불일치
- redirect 또는 route 오류
- Create Promo 단계 이동 실패
- 관리자에서 저장한 layout의 실제 반영 실패
- Visual Editor embedded mode 중복 Shell

#### 권장 조치

- 모든 테스트를 실행하는 `test` 명령을 추가한다.
- `check`, contract test, behavior test, browser smoke test를 구분한다.
- Create Promo Step 1~4 기본 흐름을 브라우저 테스트로 추가한다.
- 관리자 템플릿 저장 → Create Promo 로드 → Visual Editor 반영 흐름을 통합 테스트한다.

### 3.12 낮음: ESM 모듈 경고

`scripts/test-wizard-layout-behavior.mjs` 실행 시 `visual-editor/src/contracts.js`를 ESM으로 재해석한다는 `MODULE_TYPELESS_PACKAGE_JSON` 경고가 발생한다.

프로젝트의 API와 다수 스크립트는 CommonJS를 사용하므로 `package.json` 전체에 `"type": "module"`을 추가하면 더 큰 변경이 발생한다.

#### 권장 조치

- `visual-editor/src/contracts.js`를 `contracts.mjs`로 변경한다.
- 관련 import 경로를 함께 변경한다.
- 또는 Visual Editor 하위에 별도 `package.json`을 두고 해당 영역만 ESM으로 선언한다.

## 4. 삭제 후보 분류

### 4.1 비교적 안전하게 삭제 검토 가능

다음 항목은 참조와 실행 경로를 다시 확인한 후 정리할 수 있다.

- Create Promo의 도달 불가능한 `steps[].cards`
- Create Promo의 `step.cards.forEach()` fallback
- 정의 외 참조가 없는 함수
- 테스트가 재생성하는 `tmp/*.md`
- 임시 PDF 렌더 이미지
- 내부 참조가 없는 루트 `app.js`, `styles.css`, `generated.js`

### 4.2 기능 분리 후 삭제

- Create Promo에 복제된 generation 코드
- Create Promo와 Promo Wizard에 중복된 content/template/layout helper
- 페이지별로 반복되는 Shell 마크업
- `.topbar`와 `.shell-header`의 중복 스타일
- Wizard CSS 공통 블록

### 4.3 운영 확인 전 삭제 금지

- 루트 redirect HTML
- 동일 workflow ID의 n8n 변형본
- 전체 SQL seed 또는 chunk seed
- Visual Editor 빌드 결과
- legacy localStorage migration 코드
- `legacy_layout_cache_invalidated` 관련 처리

legacy migration은 일정 기간의 사용 로그를 확인하고 구버전 storage 사용률이 0에 가까운 경우 제거해야 한다.

## 5. 권장 실행 계획

### 1단계: 무동작 코드와 불필요 호출 제거

- Create Promo 미사용 함수 목록 재확인
- 불필요한 `loadDesignDocuments()` 제거
- 불필요한 `loadWorkerSettings()` 제거
- 불필요한 `syncRunPolling()` 제거
- stale placeholder 제거
- 기존 contract test 수정
- Create Promo Step 1~4 smoke test 추가

### 2단계: Wizard 공통 모듈 추출

- storage와 fetch helper 추출
- 관리자 Section·Template 연동 추출
- layout cache 및 identity 처리 추출
- generation 흐름 분리
- 공통 Wizard CSS 추출
- 기존 Promo Wizard와 Create Promo 동시 회귀 테스트

### 3단계: 공통 App Shell 적용

- 글로벌 메뉴 설정 단일화
- 상단 utility header, 좌측 navigation, 중앙 workspace, 우측 context panel 구조 정의
- Admin과 Create Promo 우선 적용
- Promo Wizard 적용
- Visual Editor full page와 embedded mode 분기

### 4단계: 관리자 페이지 분리

- 관리자 탭별 컴포넌트 분리
- API service 분리
- template/layout 관리 우선 분리
- audit log 분리
- CSS를 컴포넌트 또는 기능 영역별로 분리

### 5단계: 저장소 정리

- `tmp/` ignore
- 문서 자산 이동
- SQL seed source-of-truth 확정
- n8n manifest 작성 및 archive 이동
- Visual Editor bundle 정책 문서화
- 루트 redirect 사용 여부 확인

### 6단계: 테스트 체계 보강

- 통합 `test` 명령 추가
- Node 문법 검사 유지
- contract test와 behavior test 분리
- 브라우저 smoke test 추가
- 관리자 layout → Create Promo → Visual Editor E2E 추가

## 6. 검증 결과

검토 시점에 다음을 확인했다.

- Git 작업 트리: clean
- JavaScript 문법 검사: 통과
- `scripts/test-*.js`, `scripts/test-*.mjs`: 전체 통과
- 실행한 테스트 수: 18개
- 경고: Wizard layout behavior 테스트에서 ESM 모듈 형식 경고 1건
- 소스 변경: 없음

테스트가 모두 통과했다는 사실은 현재 정적 계약이 유지된다는 의미다. 실제 브라우저 흐름과 API 통합 동작까지 완전히 검증했다는 의미는 아니다.

## 7. 최종 권고

가장 먼저 Create Promo의 불필요한 generation 코드와 호출을 제거해야 한다. 이 작업은 화면 구조 개편과 독립적으로 수행할 수 있고, 코드 규모와 API 호출을 즉시 줄일 수 있다.

그다음 Create Promo와 Promo Wizard의 공통 로직을 추출해야 한다. 이 과정을 거치지 않고 새 App Shell이나 AI 기능을 계속 추가하면 두 Wizard의 차이가 커지고 관리자 템플릿 계약 변경 비용도 증가한다.

마지막으로 공통 App Shell을 적용하면서 관리자 페이지를 기능 단위로 분리하는 것이 좋다. 좌측 글로벌 메뉴와 우측 보조 패널 구조는 현재 제품에 적합하지만, 기존의 거대한 단일 파일 위에 직접 덧붙이기보다 Shell과 콘텐츠 모듈의 경계를 먼저 만드는 것이 안전하다.
