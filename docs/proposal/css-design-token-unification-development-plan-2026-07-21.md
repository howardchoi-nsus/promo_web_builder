# CSS 디자인 토큰 통일 및 콘텐츠 토큰 격리 개발계획서

- 작성일: 2026-07-21
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: Promo Builder, 관리자 페이지, Promo Wizard, Create Promo, Visual Editor, Web Output
- 관련 문서: `docs/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md` (3.3 App Shell 항목과 연계)
- 상태: 계획 수립 / 소스코드 미반영
- 목표: 편집기 UI(툴 크롬)의 색·폰트·간격 토큰을 하나로 통일하고, 프로모션 콘텐츠 토큰(`--promo-*`)은 프로모션별로 달라지도록 격리 상태를 유지·명문화한다.

## 1. 배경

현재 5개 화면이 서로 다른 색 체계를 쓰고 있어 UI 통일성이 없다. 실제 CSS를 확인한 결과는 다음과 같다.

| 화면 | CSS 파일 | 줄 수 | 기본 테마 | 토큰 이름 체계 | accent |
|---|---|---:|---|---|---|
| 관리자 / Promo Builder | `prototype/styles.css` | 3,601 | light + 다크 토글 | `--primary/--ink/--sub/--accent` | 라이트 `#4768d8` / 다크 `#28c39d` |
| Create Promo | `prototype/create-promo.css` | 1,751 | light + 다크 토글 | 위와 유사(축소) | 라이트 `#4768d8` / 다크 `#7894ff` |
| Promo Wizard | `prototype/promo-wizard.css` | 1,217 | dark 고정 | `--ink/--sub/--panel/--surface` | `#7894ff` |
| Visual Editor | `visual-editor/src/styles.css` | 224 | light 고정, 변수 없음 | 변수 없이 hex 하드코딩 | `#156b5b` (녹색) |
| 공통 헤더 | `prototype/shared-shell-header.css` | 165 | — | 변수 없음 | — |

문제가 세 겹으로 겹쳐 있다.

1. 같은 개념을 다른 이름으로 부른다. 관리자는 `--primary`, Wizard는 `--ink`, Visual Editor는 변수 없이 `#182033`을 하드코딩한다.
2. 같은 이름인데 값이 다르다. `--accent`가 Create Promo 다크에선 `#7894ff`(파랑), 관리자 다크에선 `#28c39d`(녹색)이다.
3. 기본 테마가 다르다. Wizard는 다크 고정, Visual Editor는 라이트 고정, 나머지는 라이트+다크 토글이다. 화면 이동 시 배경색이 급변한다.

## 2. 핵심 발견 — 콘텐츠 토큰은 이미 올바르게 분리되어 있음

렌더러(`visual-editor/src/PromoPageRenderer.vue`)는 프로모션 콘텐츠를 `--promo-*` 네임스페이스로 스타일링하고, 이 값을 `designSpec.theme`에서 인라인으로 주입한다.

```text
--promo-bg      ← designSpec.theme.backgroundColor
--promo-ink     ← designSpec.theme.textColor
--promo-accent  ← designSpec.theme.accentColor
--promo-cta     ← designSpec.theme.ctaColor
--promo-font    ← designSpec.theme.fontFamily
--promo-width   ← designSpec.responsive.contentMaxWidth
```

이 변수들은 `.promo-renderer` 요소에만 걸려 있어, 프로모션마다 다른 브랜드 색·폰트로 콘텐츠가 렌더링된다. 즉 "콘텐츠는 적용하는 디자인 토큰에 따라 달라진다"는 요구는 이미 동작하고 있고, 편집기 UI 색과 분리돼 있다.

`.rendered-*` 클래스들이 `--promo-*`와 `--item-*`만 참조하고 앱 토큰으로 새는 곳이 없음을 확인했다. 격리 자체는 깨끗하다. 따라서 이 계획의 목표는 이 격리를 깨지 않으면서 편집기 UI 토큰만 통일하는 것이다.

## 3. 목표 구조 — 토큰 2계층 분리

```text
Layer A · 앱/편집기 UI 토큰
   대상: 헤더, 사이드 패널, 버튼, 네비, 카드 등 툴 크롬
   범위: Builder / Admin / Wizard / Create Promo / Visual Editor 전부 공유
   정의: design-tokens.css 한 곳  ← "하나의 CSS"가 통제하는 대상

Layer B · 프로모션 콘텐츠 토큰 (--promo-*)
   대상: .promo-renderer 하위 실제 프로모션 페이지
   범위: designSpec.theme에서 프로모션마다 주입, 이미 구현됨
   정의: 렌더러가 인라인 주입, 유지

경계 원칙:
   - Layer A와 Layer B는 서로 상속·혼용하지 않는다.
   - .promo-renderer 하위 어떤 규칙도 Layer A 토큰(--app-*, --accent 등)을 참조하지 않는다.
   - 편집기 크롬 어떤 규칙도 --promo-* 를 참조하지 않는다.
```

### 3.1 중요한 판단 — 전체를 하나의 토큰셋으로 합치면 안 된다

편집기 accent와 프로모션 accent를 같은 `--accent` 하나로 통합하면, 프로모션 콘텐츠가 편집 도구의 색을 물려받아 "프로모션마다 브랜드 색이 달라진다"는 핵심이 깨진다. 현재 코드가 `--promo-*`를 별도로 둔 것이 이를 막는 장치다. 따라서 통일 작업은 Layer A에만 적용하고, Layer B는 격리를 유지한다. "하나의 CSS로 통제"는 Layer A 토큰의 단일 출처(`design-tokens.css`)를 의미하며, 전체 스타일 파일을 물리적으로 한 파일로 합치는 것을 의미하지 않는다.

## 4. 목표 파일 구조

```text
prototype/
├── design-tokens.css   ← 신규. Layer A 토큰 단일 출처 (light + dark)
├── app-shell.css       ← 신규. 공통 헤더/네비/버튼/카드 등 공용 크롬 컴포넌트
├── styles.css          ← 관리자/Builder 전용 스타일만 잔류
├── create-promo.css    ← 화면 전용 override만 잔류
├── promo-wizard.css    ← 화면 전용 override만 잔류
└── shared-shell-header.css → app-shell.css로 흡수 검토

visual-editor/src/
├── styles.css          ← 두 블록으로 분리:
│                          (1) 편집기 크롬 = Layer A 토큰 참조로 교체
│                          (2) .promo-renderer = --promo-* 만 참조, 유지
└── (design-tokens.css를 import 하거나 빌드에 포함)
```

핵심은 색·폰트·간격 변수가 `design-tokens.css` 한 곳에서만 정의되고, 나머지 파일은 그 변수를 참조만 한다는 점이다. 이렇게 하면 "여러 CSS 운영" 부담은 남지만 통제점은 하나가 된다.

## 5. Layer A 토큰 표준안 (초안)

이름은 화면 간 충돌을 피하기 위해 `--app-` 접두어를 권장한다. 기존 `--accent`, `--ink` 등을 그대로 쓰면 렌더러의 잔재 참조와 헷갈릴 수 있다.

```text
--app-bg, --app-panel, --app-surface
--app-ink, --app-ink-soft, --app-sub, --app-muted
--app-line, --app-line-strong, --app-focus
--app-accent, --app-accent-soft
--app-success, --app-success-soft
--app-danger, --app-danger-soft
--app-radius, --app-shadow
--app-space-1 ~ --app-space-5, --app-control-height, --app-panel-gap
--app-font-heading, --app-font-body
```

light 값과 `[data-theme="dark"]` 값을 `design-tokens.css` 한 파일에 정의한다. 기본 테마 통일 방향(라이트 기준 등)은 6장에서 별도로 결정한다.

## 6. 결정 필요 사항

착수 전에 다음을 확정한다.

1. 통일 기본 테마: 전 화면 라이트+다크 토글로 맞출지, 특정 테마 고정으로 맞출지. (현재 Wizard=다크 고정, Editor=라이트 고정)
2. 통일 accent 색: 파랑 계열(`#4768d8`) 또는 녹색 계열(`#156b5b`/`#28c39d`) 중 브랜드 기준 색 확정.
3. Layer A 토큰 접두어: `--app-*` 신규 도입 또는 기존 `--accent` 등 유지.
4. `shared-shell-header.css`를 `app-shell.css`로 흡수할지 유지할지.

## 7. 단계별 실행 순서

### Phase 1. 토큰 정의 및 격리 명문화

1. `design-tokens.css`를 만들고 Layer A 토큰의 light/dark 값을 단일 정의한다.
2. `visual-editor/src/styles.css`를 편집기 크롬 블록과 `.promo-renderer` 블록으로 물리적으로 분리하고, 각 블록 상단에 "Layer A only / Layer B only" 주석 경계를 추가한다.
3. `.promo-renderer` 하위 규칙이 Layer A 토큰을 참조하지 않는지, 편집기 크롬이 `--promo-*`를 참조하지 않는지 검사 스크립트로 확인한다.

### Phase 2. 관리자/Builder/Wizard/Create Promo 크롬 토큰 치환

1. `styles.css`, `create-promo.css`, `promo-wizard.css`의 색·폰트·간격 하드코딩과 로컬 변수를 Layer A 토큰 참조로 교체한다.
2. 공통 헤더/버튼/카드 스타일을 `app-shell.css`로 추출하고 각 화면 CSS에는 화면 전용 override만 남긴다.
3. 화면별로 교체 후 육안 회귀를 확인한다(헤더, 버튼, 카드, 폼 입력, 다크 토글).

### Phase 3. Visual Editor 크롬 토큰 치환 및 재빌드

1. `visual-editor/src/styles.css`의 편집기 크롬 하드코딩 hex(`#156b5b`, `#182033` 등)를 Layer A 토큰으로 교체한다.
2. `design-tokens.css`를 Visual Editor 빌드에 포함하거나 import한다.
3. `npm run build:visual-editor`로 재빌드하고 `visual-editor-assets/`가 갱신되는지 확인한다. 빌드 산출물은 직접 수정하지 않는다.

### Phase 4. 검증

1. 5개 화면을 순차 이동하며 헤더·accent·배경 테마가 일관된지 확인한다.
2. `.promo-renderer` 프리뷰가 `designSpec.theme` 값에 따라 프로모션별로 다르게 렌더링되는지 확인한다(격리 유지 검증).
3. Create Promo와 Visual Editor가 같은 프로모션 스냅샷에 대해 동일한 콘텐츠 스타일을 렌더링하는지 확인한다.
4. Web Output이 편집기 프리뷰와 동일한 콘텐츠 스타일로 출력되는지 확인한다.

## 8. 검증 방법

- 정적 검사: `.rendered-*`, `.promo-renderer` 규칙에서 Layer A 토큰(`--app-*`, `--accent`, `--ink` 등) 사용 여부를 grep으로 0건 확인.
- 정적 검사: 편집기 크롬 규칙에서 `--promo-*` 사용 여부를 grep으로 0건 확인.
- 빌드: `npm run build:visual-editor` 통과.
- 브라우저: 5개 화면 헤더/테마 일관성, 렌더러 프로모션별 색 변화, Web Output 동등성 육안 확인.
- 회귀: 기존 계약 테스트와 `npm run check` 통과.

## 9. 리스크 및 완화

1. 렌더러 격리 붕괴: Layer A 토큰이 `.promo-renderer`로 새면 프로모션 브랜드 색이 편집기 색으로 덮인다. Phase 1의 경계 주석과 8장 정적 grep 검사로 방지한다.
2. Visual Editor 빌드 누락: 소스만 고치고 재빌드를 안 하면 배포에 반영되지 않는다. Phase 3에서 재빌드를 필수 단계로 둔다.
3. 다크 토글 회귀: 토큰 치환 중 다크 값 누락 시 대비가 깨진다. 화면별 라이트/다크 양쪽 육안 확인을 회귀 항목에 포함한다.
4. 대규모 치환 회귀: 3,601줄 `styles.css` 등 대형 파일 치환 시 예기치 않은 변화 가능. 화면 단위로 나눠 커밋하고 각 커밋 후 확인한다.

## 10. 롤백 계획

1. 특정 화면 크롬 치환에서 레이아웃이 깨지면 해당 화면 CSS만 이전 상태로 되돌리고 `design-tokens.css`와 다른 화면은 유지한다.
2. Visual Editor 재빌드 결과에 문제가 생기면 직전 정상 `visual-editor-assets/` 번들로 복원한다.
3. 렌더러 격리가 깨진 것이 확인되면 해당 규칙만 `--promo-*` 참조로 즉시 되돌린다.
4. 각 치환은 화면 단위 별도 커밋으로 분리해 되돌리기 쉽게 한다.

## 11. 제외 범위

- 프로모션 콘텐츠 렌더링 로직 변경 (Layer B는 격리 유지만)
- Visual Editor 신규 편집 기능
- 관리자 페이지 컴포넌트 분리 (source-cleanup 계획서 3.4에서 별도 진행)
- 반응형/모바일 좌표 체계 변경

## 12. Definition of Done

1. `design-tokens.css`가 Layer A 토큰의 단일 출처로 존재한다.
2. 5개 화면 편집기 크롬이 동일 토큰을 참조해 헤더·accent·테마가 일관된다.
3. `.promo-renderer` 콘텐츠가 `designSpec.theme`에 따라 프로모션별로 다르게 렌더링된다.
4. 정적 grep 검사에서 Layer A ↔ Layer B 토큰 교차 참조가 0건이다.
5. Visual Editor 재빌드가 통과하고 배포 산출물이 갱신된다.
6. Web Output이 편집기 프리뷰와 동일한 콘텐츠 스타일로 출력된다.
7. 기존 계약 테스트와 `npm run check`가 통과한다.
