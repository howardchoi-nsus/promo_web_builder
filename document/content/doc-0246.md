# Promo Web Builder 정보구조(IA) 현황 — As-Is

- 작성일: 2026-07-21
- 현행화: 2026-07-23 (shared-shell 내비 통합, 관리자 `components` 탭, i18n·아이템 컴포넌트 API, 마이그레이션 030 기준)
- 대상 프로젝트: `promo_web_builder`
- 기준: 실제 소스(라우팅, HTML 진입점, 화면별 단계/탭, API 라우트) 직접 확인
- 관점: As-Is (현재 존재하는 구조를 있는 그대로 문서화)
- 배포: Vercel `cleanUrls: true`, `trailingSlash: false`

> 2026-07-23 현행화 요약: (1) 글로벌 내비가 4개 파일 중복에서 **`prototype/shared-shell.js` 단일 정의**로 통합되어 5개 화면에 주입된다. (2) 관리자에 **`components`(아이템 컴포넌트) 탭**이 추가됐다(탭 4개). (3) **i18n(`locale-*`)·아이템 컴포넌트(`item-component*`) API**가 추가되어 서버리스 라우트가 약 98개로 늘었다. (4) DB 마이그레이션이 **030**까지 진행됐다(`027 i18n`, `028 섹션 컴포넌트 레지스트리`, `029 아이템 컴포넌트+디자인 토큰+planner`, `030 run 스냅샷 복구`).

## 1. 개요

하나의 Vercel 프로젝트 안에 6개 사용자/관리 화면이 공존한다. 진입은 루트 랜딩(`/`)의 카드에서 시작하며, 실제 화면은 대부분 `/prototype/*` 아래에 있다. 루트의 일부 경로는 `/prototype/*`로 보내는 redirect 파일이다.

기술 스택은 화면마다 다르다. 루트 랜딩은 정적 HTML, Promo Builder/Admin은 CDN Vue SPA, Promo Wizard·Create Promo는 Vanilla JS, Visual Editor·Web Output은 Vue 3 + Vite 번들이다. 이 혼재가 UI 통일성 부재의 배경이다. 다만 **화면 간 공통 셸(사이드바 내비·테마)은 `shared-shell.js`로 통합**되어, 기술 스택은 갈려도 내비 정의는 한 곳에서 관리된다(§4 갱신).

## 2. 최상위 IA (사이트맵)

```text
/  (루트 랜딩 · index.html · 정적 HTML)
│   "프로모션 제작을 시작하세요" — 도구 선택 카드 5개
│
├─ 01 Create Promo      → /create-promo.html  ─(redirect)→  /prototype/create-promo.html
├─ 02 Promo Wizard      → /promo-wizard.html   ─(redirect)→  /prototype/promo-wizard.html
├─ 03 Promo Builder     → /prototype/index.html            (view=builder, 기본)
├─ 04 Admin             → /prototype/index.html?view=admin&tab=promo-form
└─ 05 Visual Editor     → /prototype/visual-editor.html
        └─ (파생) Web Output → /prototype/visual-output.html
        └─ (파생) 생성된 UI  → /prototype/generated.html  (루트 /generated.html redirect)
```

Promo Builder와 Admin은 **같은 SPA(`prototype/index.html` + `app.js`)**이며 URL 쿼리(`view`, `tab`)로 화면을 전환한다. 별도 페이지가 아니다.

## 3. 경로 · 진입점 매핑

| # | 화면 | 사용자 경로 | 실제 파일 | 기술 | 비고 |
|---|---|---|---|---|---|
| — | 루트 랜딩 | `/` | `index.html` | 정적 HTML | 카드 5개 진입 허브 |
| 01 | Create Promo | `/create-promo.html` | `prototype/create-promo.html` | Vanilla JS | 루트는 redirect |
| 02 | Promo Wizard | `/promo-wizard.html` | `prototype/promo-wizard.html` | Vanilla JS | 루트는 redirect |
| 03 | Promo Builder | `/prototype/index.html` | `prototype/index.html`+`app.js` | CDN Vue | `view=builder` |
| 04 | Admin | `/prototype/index.html?view=admin` | 동일 SPA | CDN Vue | `view=admin` |
| 05 | Visual Editor | `/prototype/visual-editor.html` | `visual-editor/src/` 빌드 | Vue 3+Vite | — |
| — | Web Output | `/prototype/visual-output.html` | 동일 Renderer 번들 | Vue 3+Vite | Visual Editor 파생 |
| — | 생성된 UI | `/generated.html` | `prototype/generated.html` | — | 루트는 redirect |

루트 redirect 파일: `create-promo.html`, `promo-wizard.html`, `generated.html` — JavaScript로 `/prototype/...`로 이동시키는 얇은 프록시.

## 4. 글로벌 내비게이션 (2026-07-23 갱신)

공통 셸 내비가 **단일 소스 `prototype/shared-shell.js`** 로 통합됐다. 이전에는 헤더 마크업이 4개 파일에 중복돼 수동 관리됐으나, 현재는 `shared-shell.js`가 내비 항목을 정의하고 이를 5개 화면(`index.html`, `create-promo.html`, `promo-wizard.html`, `visual-editor.html`, `generated.html`)에 주입한다. 레이아웃은 좌측 사이드바 셸(`app-shell` / `shell-sidebar`) 기반이다.

`shared-shell.js`의 내비 항목(6개):

```text
[프로모션 빌더]  → /prototype/index.html
[관리자 페이지]  → /prototype/index.html?view=admin&tab=promo-form
[Promo Wizard]  → /promo-wizard.html
[Create Promo]  → /create-promo.html
[Visual Editor] → /prototype/visual-editor.html
[생성된 UI]     → /prototype/generated.html
+ 테마 토글(Light/Dark)
```

내비 정의가 한 곳으로 모여, 이전의 "메뉴 4중 관리로 항목·활성상태가 어긋나는" 문제는 대부분 해소됐다. (기술 스택 혼재 자체는 남아 있다 — §7 참조)

## 5. 화면별 내부 IA

### 5.1 루트 랜딩 (`/`)

```text
루트 랜딩
├─ 헤더 (브랜드, Workspace 표시)
└─ 도구 카드 그리드
   ├─ 01 Create Promo   "Promo Wizard 기반 분리된 새 제작 흐름"
   ├─ 02 Promo Wizard   "템플릿 선택 → 콘텐츠 입력 → 디자인 생성 단계별"
   ├─ 03 Promo Builder  "디자인 설정과 생성 결과 관리"
   ├─ 04 Admin          "관리자 페이지"
   └─ 05 Visual Editor  "시각 편집"
```

### 5.2 Create Promo (`/prototype/create-promo.html`)

4단계 스텝 흐름. 렌더러는 `renderStep()`이 단계별 전용 렌더러를 호출한다.

```text
Create Promo
├─ Step 1  배경색 선택            renderBackgroundStep()
├─ Step 2  CTA 스타일 선택        renderCtaStep()
├─ Step 3  템플릿 및 콘텐츠 등록   renderContentStep()
│           └─ (섹션별) AI 디자인 생성/미리보기/적용
└─ Step 4  Web Output            renderWebOutputStep()
```

미리보기는 iframe으로 Visual Editor 렌더러를 임베드하고 `postMessage`로 스냅샷을 전달한다.

### 5.3 Promo Wizard (`/prototype/promo-wizard.html`)

구(舊) 생성 파이프라인 기반 4단계.

```text
Promo Wizard
├─ Concept        디자인 콘셉트 선택
├─ Content        프로모션 정보 입력
├─ LO-FI          저해상도 디자인 생성 (n8n 워커)
└─ Final Design   최종 디자인 이미지 (n8n 워커)
```

### 5.4 Promo Builder (`/prototype/index.html`, `view=builder`)

프로모션 디자인 설정과 생성 결과 관리. Admin과 같은 Vue 인스턴스를 공유한다.

### 5.5 Admin (`/prototype/index.html?view=admin`)

URL 탭 파라미터(`tab`)로 진입 지점이 갈린다. 코드상 허용된 탭 값은 `promo-form`(기본), `webhook`, `llm`, **`components`(2026-07-23 신설)** 4개다. 화면 내부에는 URL 탭 외에도 여러 관리 패널이 한 SPA에 집중되어 있다.

```text
Admin (단일 Vue SPA)
├─ URL 탭 (?tab=)
│   ├─ promo-form   Form Template / Wizard Content Section 관리 (기본)
│   ├─ components   아이템 컴포넌트 관리 (신설, item_components 029)
│   ├─ webhook      Worker webhook 설정
│   └─ llm          Prompt / Model 설정
└─ 화면 내 관리 패널 (단일 인스턴스에 혼재)
    ├─ 디자인 MD 관리
    ├─ Prompt Template 관리
    ├─ Wizard Content Section 관리
    ├─ Form Template 관리
    ├─ Template Layout 관리
    ├─ Section Audit Log
    └─ 생성 결과 관리
```

- **아이템 컴포넌트(`components` 탭)**: 섹션 아이템(Text/Image/CTA 등)을 전역 컴포넌트로 CRUD·버전 관리(`item-component*` API, 마이그레이션 029). 템플릿·섹션은 이 컴포넌트를 참조·조립한다.
- **i18n(다국어)**: `locale-*` API와 `locale_messages`(027)로 백엔드는 구현됐으나, 관리자 상단 URL 탭에는 아직 별도 `i18n` 탭이 노출되지 않는다(백엔드·데이터 우선 반영 단계).

관리 기능이 하나의 인스턴스·HTML 템플릿에 여전히 집중되어 있어 화면 분리 시 영향 범위가 크다.

### 5.6 Visual Editor (`/prototype/visual-editor.html`)

3열 편집 레이아웃. 편집기 UI(크롬)와 프로모션 콘텐츠(렌더러)가 토큰상 분리되어 있다.

```text
Visual Editor
├─ 상단 편집기 헤더 (네비, 전역 액션)
└─ 3열 워크스페이스
   ├─ SECTIONS  섹션 목록/아코디언
   ├─ CONTENT   선택 아이템 속성 편집 (텍스트 스타일, 좌표)
   └─ PREVIEW   실제 Renderer 미리보기 (--promo-* 토큰)
        └─ Guides ON/OFF, 섹션 높이 조절, 자유 배치
```

- 파생: **Web Output** (`visual-output.html`) — 동일 Renderer 번들 + 동일 스냅샷으로 편집 가이드 없이 출력.
- Create Promo도 이 렌더러를 임베드 모드로 사용(`is-create-promo-wizard` 레이아웃).

## 6. 콘텐츠/데이터 IA (백엔드 API 도메인)

Serverless API 라우트는 약 98개(공유 `_*.js` 모듈 포함)로 늘었다. 도메인별 묶음은 다음과 같다.

| 도메인 | 대표 라우트 | 역할 |
|---|---|---|
| Wizard Form Template | `wizard-form-template*` (5+) | 관리자 폼 템플릿 draft/active |
| Wizard Content Section | `wizard-content-section*` (3+) | 섹션·아이템 정의 |
| Wizard Layout | `wizard-form-template-layout*`, `wizard-layout-usage` | 템플릿 레이아웃/사용 이벤트 |
| **Item Component** | `item-component*`, `item-components` (신설) | 아이템 컴포넌트 CRUD·버전·사용처 (029) |
| **i18n / Locale** | `locale-*`, `locale-messages*`, `locale-snapshot` (신설) | 다국어 메시지 관리·스냅샷 (027) |
| Section AI Design | `promo-section-design-*` | 섹션 AI 레이아웃·이미지 (다이렉트 LLM) |
| Promo Design Assets | `promo-design-*` | 디자인 에셋 저장 |
| Promo Generation | `promo-generation-*` (integrated-brief/lofi/final 등) | 구 생성 파이프라인 (n8n 워커) |
| Prompt Template | `prompt-template*`, `prompts` | 프롬프트 관리 |
| Design MD | `design-*`, `analyze-design-md`, `register-design` | 브랜드 디자인 MD 코퍼스 |
| Worker/Webhook | `promo-generation-worker-settings`, `_worker-*` | n8n 워커 설정 |
| Audit | `wizard-section-audit*` | 섹션 변경 감사 로그 |

두 생성 계보가 공존한다. **n8n 경유**(Promo Generation: Integrated Brief / LO-FI / Final)와 **다이렉트 LLM**(Section AI Design)이다.

## 7. As-Is 구조의 특징과 문제점

1. **진입 계층 이중화.** 루트(`/`)와 `/prototype/*`가 섞여 있고, 일부 루트 경로는 redirect 프록시다. 외부 북마크·계약 테스트가 루트 경로를 참조해 즉시 제거가 어렵다.
2. **화면-기술 스택 불일치.** 정적 HTML / CDN Vue / Vanilla JS / Vite Vue가 화면별로 갈려 헤더·테마·컴포넌트가 통일되지 않는다.
3. **Promo Builder와 Admin의 물리적 결합.** 서로 다른 목적의 두 화면이 단일 SPA에서 URL 파라미터로만 분기한다.
4. **글로벌 메뉴 4중 관리 → 해소(2026-07-23).** 내비가 `shared-shell.js` 단일 정의로 통합되어 항목·활성상태 불일치 문제는 대부분 사라졌다. (기술 스택 혼재 자체는 잔존)
5. **Create Promo와 Promo Wizard 흐름 중복.** Create Promo가 Promo Wizard에서 복제되어 두 제작 흐름이 병존한다.
6. **관리자 기능 집중.** 관리 대상이 한 인스턴스에 몰려 있고 `components` 탭까지 추가되어(9개 이상) IA상 탐색·유지보수 비용이 크다.
7. **두 생성 계보 병존.** n8n 경유(구 파이프라인)와 다이렉트 LLM(섹션 AI 디자인)이 공존해 흐름이 이원화되어 있다.

## 8. 참고 — 화면 간 데이터 흐름 요약

```text
Admin(폼 템플릿/섹션/레이아웃 정의)
   → wizard-form-templates-public API
   → Create Promo / Promo Wizard (템플릿 로드, 콘텐츠 입력)
       → (Create Promo) Section AI Design API [다이렉트 LLM]
       → (Promo Wizard) Promo Generation API [n8n 워커]
   → Visual Editor / Web Output (스냅샷 렌더링, --promo-* 토큰)
```

이 문서는 현재 구조를 있는 그대로 기록한 것이며, 통합 방향(To-Be)과 관련 계획서는 `docs/proposal/`로 이관됐다: `information-architecture-to-be-2026-07-21.md`, `source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`, `css-design-token-unification-development-plan-2026-07-21.md`, `left-sidebar-global-navigation-development-plan-2026-07-21.md`, `component-template-separation-development-plan-2026-07-22.md`, `admin-i18n-locale-management-development-plan-2026-07-22.md`.
