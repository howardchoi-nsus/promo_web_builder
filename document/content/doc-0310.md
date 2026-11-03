# 프런트엔드 프레임워크 단일성 검토 및 개선안

## 0. 문서 정보

- 작성일: 2026-07-26
- 대상 저장소: `promo_web_builder`
- 기준 브랜치: `main` (작업 트리 기준, 미커밋 변경 포함)
- 검토 질문: "단일 프레임워크를 사용 중인가. Vue 이외 다른 프레임워크가 사용 중인가."
- 선행 문서:
  - `docs/계획/frontend-unification-remaining-p0-p2-development-plan-2026-07-24.md`
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/legacy-promo-wizard-retirement-audit-2026-07-24.md`
- 본 문서의 위치:
  - 위 선행 계획서의 P1·P2가 이미 Vue/Vanilla 혼재 해소를 다루고 있다. 본 문서는 이를 **대체하지 않는다**.
  - 본 문서의 개선안은 선행 계획서가 **완료로 표기했으나 실제로는 잔존하는 항목**과, 선행 계획서에 **누락된 재발 방지 장치**에 한정한다.

## 1. 결론

**프레임워크는 Vue 3 단일이다. 다른 프레임워크는 사용되지 않는다.**

React, Angular, Svelte, Preact, Alpine.js, htmx, jQuery, Lit, Backbone, Knockout 중 어느 것도 소스·의존성·잠금 파일에서 발견되지 않았다.

다만 **프레임워크는 하나지만 UI 구현 방식은 3가지로 분기**되어 있으며, 이것이 실질적 검토 대상이다. 아래 2절에서 근거를, 3절에서 분기 현황을, 4절 이후에서 개선안을 제시한다.

## 2. 검증 근거

### 2.1 의존성 선언

`package.json` 기준 런타임 의존성은 3개뿐이다.

| 구분 | 패키지 | 버전 | 성격 |
| --- | --- | --- | --- |
| dependencies | `vue` | ^3.5.39 | **프런트엔드 프레임워크(유일)** |
| dependencies | `@neondatabase/serverless` | ^0.10.4 | DB 드라이버 |
| dependencies | `@vercel/blob` | ^2.5.0 | 파일 스토리지 SDK |
| devDependencies | `vite` | ^8.1.4 | 번들러 |
| devDependencies | `@vitejs/plugin-vue` | ^6.0.8 | Vue SFC 컴파일러 |
| devDependencies | `playwright` | ^1.61.1 | 브라우저 테스트 |

### 2.2 잠금 파일 교차 검증

`pnpm-lock.yaml`에서 `react|svelte|angular`를 검색한 결과는 4건이며, **전부 `@vue/reactivity@3.5.39`의 부분 문자열 오탐**이다. 전이 의존성으로 유입된 타 프레임워크는 없다.

### 2.3 오탐으로 판정한 항목

초기 전체 검색에서 73개 파일이 걸렸으나, 실사용과 무관한 항목이 대부분이었다.

| 항목 | 건수 | 판정 |
| --- | --- | --- |
| `docs/자료/design-md/**/DESIGN.md` | 약 25개 브랜드 문서 | 타사 사이트 분석용 **참고 자료**. 실행 코드 아님 |
| `n8n/*.json`, `*.jq` | 다수 | n8n **워크플로 정의**. 앱 프레임워크 아님 |
| `db/migrations/*.sql`, `db/seeds/*.sql` | 다수 | 시드 데이터 문자열 |
| `document.createElement(...)` | 다수 | **네이티브 DOM API**. React `createElement` 아님 |
| `prototype/vendor/lucide/lucide.min.js` | 1 | **아이콘 라이브러리**. 프레임워크 아님 |

### 2.4 백엔드

`api/`, `scripts/`, `shared/`의 외부 패키지 import를 집계한 결과, 웹 프레임워크(Express·Fastify·Koa 등)는 **없다**. Vercel 서버리스 함수 시그니처 위에서 Node 내장 모듈과 `@neondatabase/serverless`만 사용한다.

```
54 node:assert/strict   16 @neondatabase/serverless   4 vue
46 node:path            10 node:crypto                1 vue/dist/vue.esm-bundler.js
41 node:fs               7 node:vm                    1 http
```

## 3. 검토 결과 — UI 구현 방식 3분기

프레임워크는 단일하나, 코드가 3개 패러다임으로 나뉘어 있다.

### 3.1 현황

| # | 방식 | 위치 | 규모 | 상태 |
| --- | --- | --- | --- | --- |
| A | **Vue 3 SFC + Vite** | `admin-app/src/`, `visual-editor/src/` | 4,994줄 (그중 `.vue` 3,765줄) | 목표 구조 |
| B | **Vue 3 전역 빌드 + 단일 대형 스크립트** | `prototype/app.js`, `prototype/generated.js` | 6,302줄 | 전환 대상 |
| C | **Vue 미사용 — 순수 DOM 조작** | `prototype/create-promo.js`, `promo-wizard.js`, `wizard/*.js`, `shared-shell.js`, `i18n-runtime.js`, `create-promo-layout-cache.js` | 5,441줄 | 전환 대상 |

합계 약 16,700줄 중 **목표 구조(A)는 약 30%**이며, 핵심 사용자 플로우인 Create Promo와 Promo Wizard는 **C(프레임워크 밖)** 에 있다.

### 3.2 C 영역 세부

| 파일 | 줄 수 | 비고 |
| --- | --- | --- |
| `prototype/promo-wizard.js` | 2,278 | 구형. `legacy-promo-wizard-retirement-audit`에서 `retirement_blocked` |
| `prototype/create-promo.js` | 2,149 | 현행 핵심 플로우. `document.createElement` 기반 전면 재조립 |
| `prototype/wizard/*.js` (7개) | 469 | IIFE + `globalThis` 전역 등록 패턴 |
| `prototype/shared-shell.js` | 225 | 공통 App Shell |
| `prototype/i18n-runtime.js` | 175 | i18n 런타임 |
| `prototype/create-promo-layout-cache.js` | 145 | 레이아웃 캐시 |

### 3.3 기존 계획과의 관계

3.1의 B·C 해소는 선행 계획서 `frontend-unification-remaining-p0-p2` 의 **P1-2(Create Promo 점진 전환)**, **P1-3(관리자 SFC 전환)**, **P2-A/B(구형 Wizard 감사·제거)** 가 이미 정의하고 있다. 본 문서는 이 부분에 **새 계획을 추가하지 않으며**, 아래 개선안은 그 계획에서 빠진 두 건에 집중한다.

## 4. 개선안 1 (P0) — Vue 로딩 경로 이원화 해소

### 4.1 문제

선행 계획서 `frontend-unification-remaining-p0-p2` §1.1은 **"관리자 Vue CDN 제거와 Vite 진입점"을 완료된 기반으로 기재**하고 있다. 관리자(`prototype/index.html`)는 실제로 완료되었음을 확인했다 — Vue를 Vite 번들에서만 얻는다.

그러나 **`prototype/generated.html`에 CDN 로딩이 잔존한다.**

```html
<!-- prototype/generated.html:108 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
```

### 4.2 이것이 실제 위험인 이유

죽은 코드가 아니라 **활성 경로**다.

- `prototype/app.js:6137` — 관리자에서 `window.open("generated.html", "_blank")`로 연다.
- `prototype/admin-assets/admin-app.js:13246` — 빌드 산출물에도 동일 경로가 포함되어 있다.
- 루트 `generated.html:11` — `/prototype/generated.html`로 리다이렉트한다.
- `prototype/shared-shell.js:22` — 내비게이션이 `generated` 라우트를 인식한다.

| 위험 | 내용 |
| --- | --- |
| 버전 미고정 | `vue@3`은 major만 고정. Vue 3.x 신규 릴리스가 사전 검증 없이 운영에 유입된다. 나머지 화면은 `^3.5.39`로 번들되어 **화면 간 Vue 버전이 달라질 수 있다** |
| 외부 SPOF | unpkg 장애·차단 시 해당 화면만 백지화된다. 사내망·국가별 CDN 차단 환경에서 재현 위험 |
| 공급망 노출 | 서드파티 CDN이 무결성 검증(SRI) 없이 실행 스크립트를 공급한다 |
| 문서 신뢰도 | 계획서가 완료로 기재한 항목이 실제로는 미완이라, 이후 판단의 기준선이 어긋난다 |

### 4.3 해소가 쉬운 근거

`prototype/generated.js`는 **33줄이며 Vue 사용이 사실상 없다.**

```js
createApp({
  data() { return { payload: loadPayload() }; },
  mounted() {
    if (this.payload) applyDesign(this.payload.design);
    window.PromoShell?.init(document);
  },
}).mount("#generatedApp");
```

반응형 바인딩도, 컴포넌트도, 템플릿 표현식도 없다. 하는 일은 localStorage 읽기 → CSS 변수 주입 → Shell 초기화뿐이다.

### 4.4 선택지

| 안 | 내용 | 장점 | 단점 |
| --- | --- | --- | --- |
| **1안 (권장)** | Vue 제거. `DOMContentLoaded` 핸들러로 대체하고 CDN `<script>` 삭제 | 외부 의존 소멸. 번들 증가 없음. 변경량 최소 | `#generatedApp` 마운트 전제 코드 확인 필요 |
| 2안 | 별도 Vite 진입점 추가 후 번들 Vue 사용 | 다른 화면과 로딩 방식 통일 | 33줄을 위해 빌드 타깃 1개 추가 |
| 3안 | CDN 유지하되 `vue@3.5.39` 고정 + SRI 부여 | 변경 최소 | 외부 SPOF·공급망 노출은 잔존. 근본 해결 아님 |

**1안을 권고한다.** Vue를 쓸 이유가 없는 33줄이며, 나머지 화면과 달리 이 화면만 프레임워크 런타임 전체를 CDN에서 받고 있다.

### 4.5 작업

1. `prototype/generated.js`의 `createApp` 블록을 `DOMContentLoaded` 핸들러로 치환한다.
2. `prototype/generated.html:108`의 unpkg `<script>` 태그를 제거한다.
3. `scripts/test-shared-shell-header-contract.js`(`generated.html`·`generated.js` 참조)와 `scripts/test-app-design-tokens-contract.js`(대상 목록에 `generated.html` 포함)가 통과하는지 확인한다.
4. `pnpm run check`의 `node --check prototype/generated.js`가 통과하는지 확인한다.

### 4.6 완료 기준

- 저장소 전체에서 `unpkg.com` 참조가 0건이다.
- 관리자 → `generated.html` 열기 경로에서 디자인 토큰(`--primary`, `--cta`, `--canvas`, 폰트, 굵기)이 기존과 동일하게 적용된다.
- 네트워크 차단 상태에서도 화면이 정상 렌더링된다.
- 전체 테스트와 Admin·Visual Editor Build가 통과한다.

## 5. 개선안 2 (P1) — 사문화된 테스트 스텁 정리

### 5.1 문제

관리자에서 CDN Vue가 제거되었음에도, 두 브라우저 테스트가 여전히 unpkg 요청을 가로채는 스텁을 유지하고 있다.

- `scripts/test-admin-i18n-browser.mjs:64-65`
- `scripts/test-admin-section-component-browser.mjs:91`

```js
await page.route("https://unpkg.com/vue@3/dist/vue.global.prod.js", (route) => route.fulfill({ ... }));
```

이제 발생하지 않는 요청을 가로채므로 **아무 효과가 없는 코드**다. 존재 자체가 "관리자는 CDN Vue를 쓴다"는 잘못된 신호를 주어, 향후 4절 같은 판단을 다시 어렵게 만든다.

### 5.2 작업

4절 완료 후 두 `page.route` 스텁을 제거한다. 4절보다 먼저 제거하면 안 된다 — 순서가 뒤바뀌면 `generated.html` 관련 테스트가 실제 네트워크로 나갈 수 있다.

### 5.3 완료 기준

- `scripts/` 하위에 `unpkg.com` 참조가 0건이다.
- 두 브라우저 테스트가 오프라인에서 통과한다.

## 6. 개선안 3 (P1) — 단일성 회귀 방지 가드

### 6.1 문제

현재 단일 프레임워크 상태는 **관례로만 유지되고 있으며, 이를 강제하는 자동 검사가 없다.** 저장소에는 58개 테스트 파일과 `qa:label-guard` 같은 가드 스크립트 관례가 이미 존재하므로, 동일 패턴으로 추가하는 것이 자연스럽다.

향후 다음이 검사 없이 유입될 수 있다.

- 타 프레임워크 의존성 추가
- 새로운 외부 CDN `<script>` 도입
- `prototype/app.js` 등 전환 대상 파일에 신규 기능 추가 (선행 계획서 §5.3이 "신규 기능은 `prototype/app.js`에 추가하지 않는다"를 완료 기준으로 정했으나, 이를 검증하는 장치가 없다)

### 6.2 작업

`scripts/test-frontend-single-framework-guard.js`를 추가하고 `scripts/run-tests.js`에 등록한다. 검사 항목은 다음 3가지로 한정한다.

| 검사 | 규칙 | 실패 조건 |
| --- | --- | --- |
| 의존성 단일성 | `package.json`의 `dependencies`·`devDependencies`에 Vue 외 UI 프레임워크 금지 | `react`, `preact`, `@angular/*`, `svelte`, `solid-js`, `lit`, `alpinejs`, `htmx.org`, `jquery`, `backbone`, `knockout` 중 하나라도 존재 |
| 외부 스크립트 금지 | 모든 `*.html`의 `<script src>`가 상대·절대 로컬 경로여야 함 | `http://` 또는 `https://` 로 시작하는 `src` 존재 |
| 레거시 동결 | `prototype/app.js` 줄 수가 기준선(6,269)을 초과하지 않음 | 기준선 초과 시 실패. 전환으로 줄어들면 기준선을 낮춰 갱신 |

세 번째 검사는 선행 계획서 §5.3의 완료 기준을 기계적으로 강제하는 장치다. 줄 수 기준선은 단순하지만 "레거시에 기능을 더하지 않는다"는 방향을 되돌릴 수 없게 만든다.

### 6.3 완료 기준

- 가드 스크립트가 현재 코드베이스에서 통과한다.
- 타 프레임워크를 임의로 추가한 상태에서 실패하는 것을 확인한다.
- `pnpm test`에 포함되어 실행된다.

## 7. 우선순위와 근거

| 순위 | 항목 | 근거 | 예상 변경 범위 |
| --- | --- | --- | --- |
| 1 | 4절 — CDN Vue 제거 | 활성 운영 경로의 외부 SPOF·버전 미고정. 33줄로 해소 가능해 투입 대비 효과가 가장 크다 | 파일 2개 |
| 2 | 6절 — 회귀 방지 가드 | 이후 모든 전환 작업의 기준선을 고정한다. 4절 완료 직후 넣어야 재유입을 막는다 | 신규 1개 + 등록 1줄 |
| 3 | 5절 — 사문화 스텁 제거 | 기능 영향 없음. 4절·6절 완료 후 정리 | 파일 2개 |
| — | 3.1의 B·C 전환 | **본 문서 범위 아님.** 선행 계획서 P1-2·P1-3·P2-A/B를 따른다 | — |

1~3번은 서로 독립적이지 않으므로 **4절 → 6절 → 5절 순서를 지킨다.**

## 8. 위험 요소

### 8.1 `generated.html` 회귀

- 위험: Vue 제거 과정에서 `#generatedApp` 마운트 시점 차이로 디자인 토큰 주입이 누락될 수 있다.
- 대응: `applyDesign`이 `document.documentElement`에 직접 CSS 변수를 설정하므로 마운트 대상과 무관하다. `DOMContentLoaded` 시점에 호출하면 동등하다. 변경 전후 CSS 변수 6종을 브라우저 테스트로 비교한다.

### 8.2 줄 수 기준선 가드의 오작동

- 위험: 6.2의 세 번째 검사가 정당한 리팩터링(주석 추가, 포매팅)에서 실패할 수 있다.
- 대응: 기준선은 상한선으로만 동작시키고, 전환으로 감소했을 때 기준선을 낮추는 것을 정상 절차로 문서화한다. 증가가 필요한 예외는 커밋 메시지에 사유를 남기고 기준선을 명시적으로 조정한다.

### 8.3 선행 계획서와의 표기 불일치

- 위험: 선행 계획서 §1.1의 "관리자 Vue CDN 제거" 완료 표기가 `generated.html` 잔존과 충돌한다.
- 대응: 4절 완료 시 선행 계획서에 보완 메모를 추가한다. 완료 항목을 미완으로 되돌리지 않고, **"관리자 화면은 완료, `generated.html`은 2026-07-26 후속 처리"** 로 범위를 명확히 한다.

## 9. Definition of Done

- [ ] 저장소 전체에서 `unpkg.com` 참조가 0건이다.
- [ ] 모든 HTML의 `<script src>`가 로컬 경로다.
- [ ] `generated.html`이 오프라인에서 정상 렌더링되고 디자인 토큰이 기존과 동일하다.
- [ ] 단일 프레임워크 가드 스크립트가 `pnpm test`에 포함되어 통과한다.
- [ ] 사문화된 unpkg 테스트 스텁이 제거됐다.
- [ ] 선행 계획서의 CDN 제거 항목 범위가 정정 기록됐다.
- [ ] 전체 테스트, Admin Build, Visual Editor Build, `git diff --check`가 통과한다.

## 10. 범위 밖 (기존 계획 유지)

다음은 본 문서가 다루지 않으며 선행 계획서를 따른다.

- Create Promo의 Vue 점진 전환 → `frontend-unification-remaining-p0-p2` §5.2 (P1-2)
- 관리자 `prototype/app.js`의 기능 단위 SFC 분리 → 동 문서 §5.3 (P1-3)
- 구형 Promo Wizard 감사·제거 → 동 문서 §6.1~6.2 (P2-A/B), `legacy-promo-wizard-retirement-audit-2026-07-24`
- TypeScript 도입 여부 → 동 문서 §11 (P2 이후 To-Be)
- 번들 크기·Lazy Loading 최적화 → 동 문서 §11
