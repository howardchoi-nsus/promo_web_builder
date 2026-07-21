# Promo Web Builder 정보구조(IA) 현황 — As-Is

- 작성일: 2026-07-21
- 대상 프로젝트: `promo_web_builder`
- 기준: 실제 소스(라우팅, HTML 진입점, 화면별 단계/탭, API 라우트) 직접 확인
- 관점: As-Is (현재 존재하는 구조를 있는 그대로 문서화)
- 배포: Vercel `cleanUrls: true`, `trailingSlash: false`

## 1. 개요

하나의 Vercel 프로젝트 안에 6개 사용자/관리 화면이 공존한다. 진입은 루트 랜딩(`/`)의 카드에서 시작하며, 실제 화면은 대부분 `/prototype/*` 아래에 있다. 루트의 일부 경로는 `/prototype/*`로 보내는 redirect 파일이다.

기술 스택은 화면마다 다르다. 루트 랜딩은 정적 HTML, Promo Builder/Admin은 CDN Vue SPA, Promo Wizard·Create Promo는 Vanilla JS, Visual Editor·Web Output은 Vue 3 + Vite 번들이다. 이 혼재가 UI 통일성 부재의 배경이다.

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

## 4. 글로벌 내비게이션

공통 헤더(상단 topbar)에서 화면 간 이동이 가능하다. 다만 헤더 마크업이 4개 파일(`index.html`, `create-promo.html`, `promo-wizard.html`, `App.vue`)에 각각 존재해 수동 관리된다. 공통 메뉴 항목은 다음과 같다.

```text
[브랜드: PROMO WEB BUILDER]  [handoff 문서 선택 ▼]
[프로모션 빌더] [관리자 페이지] [Promo Wizard] [Create Promo] [Visual Editor] [생성된 UI]
[테마 토글 Light/Dark] [상태 표시]
```

메뉴는 4곳에서 따로 관리되므로 항목·활성상태·URL이 화면마다 어긋날 수 있다.

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

URL 탭 파라미터(`tab`)로 진입 지점이 갈린다. 코드상 허용된 탭 값은 `promo-form`(기본), `webhook`, `llm`이다. 화면 내부에는 URL 탭 외에도 여러 관리 패널이 한 SPA에 집중되어 있다.

```text
Admin (단일 Vue SPA)
├─ URL 탭 (?tab=)
│   ├─ promo-form   Form Template / Wizard Content Section 관리 (기본)
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

관리 기능이 하나의 인스턴스·HTML 템플릿에 집중되어 있어 화면 분리 시 영향 범위가 크다.

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

Serverless API 라우트는 약 50개(공유 `_*.js` 모듈 제외). 도메인별 묶음은 다음과 같다.

| 도메인 | 대표 라우트 | 역할 |
|---|---|---|
| Wizard Form Template | `wizard-form-template*` (5+) | 관리자 폼 템플릿 draft/active |
| Wizard Content Section | `wizard-content-section*` (3+) | 섹션·아이템 정의 |
| Wizard Layout | `wizard-form-template-layout*`, `wizard-layout-usage` | 템플릿 레이아웃/사용 이벤트 |
| Section AI Design | `promo-section-design-*` (4) | 섹션 AI 레이아웃·이미지 (다이렉트 LLM) |
| Promo Design Assets | `promo-design-*` (4) | 디자인 에셋 저장 |
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
4. **글로벌 메뉴 4중 관리.** 공통 헤더가 4개 파일에 중복되어 항목·활성상태가 어긋날 수 있다.
5. **Create Promo와 Promo Wizard 흐름 중복.** Create Promo가 Promo Wizard에서 복제되어 두 제작 흐름이 병존한다.
6. **관리자 기능 집중.** 8개 이상의 관리 대상이 한 인스턴스에 몰려 있어 IA상 탐색·유지보수 비용이 크다.

## 8. 참고 — 화면 간 데이터 흐름 요약

```text
Admin(폼 템플릿/섹션/레이아웃 정의)
   → wizard-form-templates-public API
   → Create Promo / Promo Wizard (템플릿 로드, 콘텐츠 입력)
       → (Create Promo) Section AI Design API [다이렉트 LLM]
       → (Promo Wizard) Promo Generation API [n8n 워커]
   → Visual Editor / Web Output (스냅샷 렌더링, --promo-* 토큰)
```

이 문서는 현재 구조를 있는 그대로 기록한 것이며, 통합 방향(To-Be)은 `docs/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`와 `docs/css-design-token-unification-development-plan-2026-07-21.md`에서 다룬다.
