# Promo Web Builder 통합 정책서

- 작성일: 2026-07-23
- 최종 갱신일: 2026-08-06
- 대상 프로젝트: `promo_web_builder`
- 문서 성격: 정책(가드레일·규칙·거버넌스·소유권·경계)을 한 곳으로 취합
- 강제 수준: **MUST**(반드시) / **MUST NOT**(절대 금지) / **SHOULD**(특별 사유 없으면 준수) / **MAY**(선택)
- 취합 출처(각 계획서·문서에 흩어져 있던 정책 섹션을 통합):
  - `정책/source/collaboration-protocol-2026-07-21.md` (협업·소유권)
  - `계획/css-component-architecture-*`, `계획/css-design-token-unification-*` (디자인 토큰·하드코딩)
  - `계획/component-template-separation-*` (컴포넌트·템플릿, AI patch)
  - `계획/admin-i18n-locale-management-*`, `설계/admin-page-terminology-dictionary-*` (i18n·콘텐츠 경계)
  - `자료/기획-source/ai-design-recommendation-workflow-proposal-*`, `기획/promo-web-builder-product-plan-2026-07-23.md` (브랜드·법무 가드레일, Rule Base)
  - `계획/live-preview-outline-editor-text-alignment-development-plan-2026-07-31.md` (Live Preview·텍스트 배치)
  - `계획/visual-editor-structure-ai-design-transition-development-plan-2026-07-31.md` (구조 패널·AI 역할·Motion)
  - `설계/visual-editor-live-preview-rich-text-design-2026-08-01.md` (현행 Live Preview·라인 편집 계약)
  - `계획/ai-registry-composition-mode-supplement-development-plan-2026-08-04.md` (Registry Composition Contract v3)
  - `handoff/handoff-2026-08-06.md` (구현·DB·테스트 현황과 잔여 검증)

---

## 1. 협업·소유권 정책

- **MUST** 두 LLM 에이전트를 직접 대화시키지 않는다. 저장소의 공유 산출물(계약 파일, handoff, PR, 태스크)로 비동기 소통한다.
- **MUST** 단일 저장소(monorepo)를 유지하고, 디렉터리 소유권으로 병렬 작업한다.
- 소유권 경계:
  - Frontend(Codex): `prototype/*`, `visual-editor/src/*`, `*.css`
  - Backend(Claude): `api/*`, `db/*`
  - 공유 계약(양쪽 합의): `visual-editor/src/contracts.js`, `api/_*-contract.js`, 계약 테스트
  - 인프라/설정(사람 승인): `vercel.json`, 환경변수, `package.json` scripts
- **MUST** 구현자 ≠ 검증자. 구현한 세션이 자기 결과를 단독 검증하지 않는다.
- **MUST** 계약(인터페이스) 최종 승인은 사람(Howard)이 쥔다. PM 세션은 계약·문서 초안만 만들고 코드를 작성하지 않는다.
- **MUST** 세션 종료 시 handoff에 "변경한 것 / 남은 것 / 상대가 알아야 할 것"을 기록한다.

## 2. 디자인 토큰·하드코딩 정책

### 2.1 토큰 2계층 경계 (Layer A / Layer B)

- **MUST** 앱 UI(제작 도구) 디자인 값의 단일 출처는 `design-tokens.css`의 `--app-*`이다.
- **MUST** 프로모션 콘텐츠 값은 `--promo-*` / `--item-*` 네임스페이스로 격리한다.
- **MUST NOT** `.promo-renderer` 하위에서 `--app-*`를 참조한다.
- **MUST NOT** 앱 Sidebar/Panel/Modal 등이 `--promo-*`를 참조한다.
- **MUST NOT** 페이지별 CSS에서 자체 `:root` 색상·간격 alias를 새로 만든다(전환기 compatibility 제외).

### 2.2 하드코딩 금지 (Layer A CSS)

- **MUST NOT** 다음 리터럴을 직접 작성: hex 색상, `rgb()/rgba()/hsl()`, 반복 spacing, 반복 font-size/weight, 반복 border-radius, 반복 shadow, 공통 컨트롤 높이, 공통 transition duration, 공통 z-index.
- **MAY** 구조 값은 직접 작성: `0`, `100%`, `auto`, `1fr`, `minmax(0,1fr)`, `display/position/overflow/object-fit/text-overflow` 등.
- 예외는 코드 주석 + 하드코딩 검사 allowlist에 목적을 명시한다.

### 2.3 Breakpoint

- 표준 breakpoint(리터럴 허용, 문서상 고정): Desktop compact `1080`, Drawer `1023`, Tablet `980`, Mobile `680`.
- 기타 breakpoint는 기능적 이유 확인 후 표준으로 합칠 수 있는지 화면별 검토(기계적 변경 금지).

## 3. AI 생성 CSS / patch 정책

- **MUST NOT** AI가 자유 형식 CSS/HTML/JS를 최종 결과로 직접 반환한다. 서버는 **구조화된 layout/design patch만** 받는다.
- **MUST** 클라이언트/렌더러는 검증된 값만 CSS 변수·allowlisted style property로 변환한다.
- **MUST NOT** 다음을 허용: `@import`, `javascript:` URL, 임의 외부 URL, 앱 Shell 선택자, `html/body/:root` 수정, 무제한 `position: fixed`, 과도한 z-index, 관리자 잠금 속성 우회, `.promo-renderer` 범위를 벗어나는 선택자.
- **MUST** Layer B 정적 CSS의 최상위 선택자는 `.promo-renderer` 또는 그 하위(`.rendered-*`, `[data-section-key]`, `[data-item-key]`)로 시작한다.
- 런타임 인스턴스 값(`--promo-bg`, `--promo-accent` 등)은 계약·allowlist를 거쳐야 하며 하드코딩 검사 대상에서 제외한다.
- **MUST**(Section AI V2) LLM은 **허용 카탈로그(region·style slot·token·asset target)에서 선택만** 하고, 색/폰트/간격은 `ai_selectable=true` 디자인 토큰만 쓴다.
- **MUST NOT** LLM이 좌표(`xPct/yPx/widthPct/heightPx`)나 임의 CSS를 직접 만든다. **좌표는 결정론적 Executor 또는 사용자 드래그 편집으로만** 생성한다.
- **MUST** LLM 출력(예: `design_plan`/`SectionDesignSpec`)은 **Validator를 통과하기 전** 저장·적용하지 않는다.
- **MUST** 배경/컴포넌트 이미지 프롬프트는 서버에서 조립하고, 브랜드명·HEX·재질을 시스템 프롬프트에 하드코딩하지 않는다. 이미지에 페이드·그라데이션·마스크를 굽지 않고 Renderer가 CSS로 처리한다.

### 3.1 Registry Composition Contract v3

- **MUST** 신규 AI Composition은 active Composition Shell과 Registry의 Section, Component, Layout Preset, Resource, Design Token, Motion Preset 후보만 사용한다.
- **MUST NOT** Contract v3에서 Template ID를 필수 기반으로 사용하거나, Registry 밖의 ID·버전·필드를 LLM이 새로 만들게 한다.
- **MUST** Proposal에 candidate, policy, resource fingerprint와 pinned version/hash를 저장하고 Apply 직전에 현재 값과 다시 비교한다.
- **MUST** 최초 Structured Output 검증 실패 시에도 동일 allowlist 안에서 최대 1회만 repair한다. repair가 정책·후보 범위를 확장해서는 안 된다.
- **MUST** 사용자가 Proposal의 구조와 변경 내용을 확인하고 승인한 뒤 Apply한다. 자동 적용은 명시적으로 승인된 제한 시나리오 외에는 허용하지 않는다.
- **MUST** Feature Flag 비활성 또는 active Shell 부재 시 기존 Template Mode fallback을 유지하되, fallback 사실과 원인을 관측 이벤트로 구분한다.

## 4. 컴포넌트·템플릿 정책

- **MUST** 컴포넌트(섹션 아이템: Text/Image/CTA 등)는 전역으로 관리하고, 템플릿·섹션은 **참조·조립만** 한다.
- **MUST** 컴포넌트 정의(공유: 이름·항목·field_kind·AI 정책)와 템플릿 인스턴스 설정(오버라이드: 순서·필수·노출·고정위치·잠금)의 저장 위치를 분리한다.
- **MUST NOT** 템플릿 조립 API에서 컴포넌트 정의를 수정한다(인스턴스 오버라이드만 허용).
- **MUST NOT** 템플릿 clone 시 컴포넌트/항목을 복제한다(참조 행만 복사).
- **MUST NOT** 사용 중인 컴포넌트·섹션을 하드 삭제한다(archive/참조 차단만).
- **MUST** 컴포넌트·섹션·템플릿·프롬프트·메시지 등 관리 대상은 draft→active→archived 버전과 감사 이력을 따른다.
- **MUST** 상태별 active는 1건만 유지한다(DB partial unique).
- **MUST**(다중 필드 컴포넌트) 하나의 컴포넌트 버전은 여러 타입 필드(`fld_*`)를 가질 수 있고, 이미지 작업의 실제 주소는 **`componentInstanceId + fieldKey`** 다(`itemKey`는 호환용).
- **MUST NOT** 콘텐츠 잠금(`is_locked`)과 스타일 잠금을 하나로 해석한다. 스타일 잠금이 필요하면 콘텐츠 잠금과 분리된 `styleLock` 계약을 별도로 둔다.

## 5. i18n·콘텐츠 경계 정책

- **MUST** 관리자 i18n은 **제작 도구 UI 문구**(단계명·버튼·라벨·도움말·오류)에만 적용한다.
- **MUST NOT** 사용자가 등록/AI가 생성한 프로모션 제목·본문·CTA·이미지 설명을 관리자 locale 메시지로 변환한다.
- **MUST NOT** 최종 생성 페이지·Web Output에 관리자 baseline 문구나 번역 fallback을 삽입한다. 입력 없는 항목은 출력하지 않는다.
- **MUST** 저장 값(코드)과 표시 라벨을 분리한다. 드롭다운 저장 값을 메시지 키로 대체하지 않는다.
- **MUST** 메시지 value를 서버에서 sanitize한다: `<script`, `javascript:`, `on*=` 등 위험 패턴 금지, 허용 placeholder(`{count}` 등)만 통과.
- **MUST NOT** locale JSON을 관리자에서 자유 텍스트 통짜로 저장한다(키 단위 관리).
- 언어 코드는 ISO 639-1(필요 시 BCP 47)로 검증한다.

## 6. 거버넌스 정책 (버전·감사·롤백)

- 상태: `draft / active / inactive / archived`.
- **MUST** active 버전은 인플레이스 수정하지 않고 새 draft를 만들어 승격한다.
- **MUST** 변경은 감사 로그(트리거/이력 테이블)로 기록한다.
- 롤백은 과거 값을 신규 draft로 복원하는 방식으로 한다.

## 7. 데이터 삭제·보존 경계

- **MAY** 관리자 **설정 데이터**(템플릿·섹션·아이템·레이아웃·조립 관계)는 백업 후 초기화한다.
- **MUST NOT** 다음을 삭제한다: 생성 완료 프로모션·프로모션 목록, 사용자가 등록한 콘텐츠, 보존 대상 저장 초안, AI 디자인 run·입력/결과 스냅샷·생성 이미지 메타, Blob의 최종/섹션 이미지.
- **MUST** 초기화 전, 생성 완료 프로모션이 관리자 설정을 실시간 참조하지 않고 완전 스냅샷 기반임을 검증한다(아니면 초기화 금지).

## 8. 운영 정책 Rule Base (컴플라이언스) — 요구사항(미구현)

프로모션 페이지는 디자인뿐 아니라 운영 안전성이 중요하다. **MUST** AI 생성과 별개의 Rule Base가 아래를 통제한다(현재 최우선 미완 격차).

- 리전별 필수 약관, Responsible Gaming 문구
- 연령 고지(만 18세/21세), 국가별 금지 표현
- Bonus Code, Affiliate, Q-TAG
- CTA 링크 정책, 기간·조건 필수 입력
- 법무/컴플라이언스 체크
- **MUST** 판정은 fatal(차단)/warning(경고)로 구분하고, 정책 검증은 AI prompt가 아니라 Rule Base로 처리한다.

## 9. 브랜드·법무 가드레일 + 이미지 생성 정책

- **MUST** 브랜드 최소 가드레일(로고, 필수 색 규정, 법적 고지 문구)은 AI 추천 다양성과 별개로 항상 강제한다.
- **MUST** 최종 결과물의 텍스트·혜택은 담당자가 입력한 실제 값으로 채운다(이미지 문구가 아님).
- 이미지 생성:
  - **MUST** 서버에서 `[공통 스타일 토큰] + 유형 템플릿 + 검증된 변수 + 네거티브`로만 프롬프트를 조립한다(자유 프롬프트 그대로 전달 금지).
  - **MUST NOT** 실존 인물(예: 앰배서더 실명·실인물)·타사 로고·미성년 묘사를 생성한다.

### 9.1 Hero key visual

- **MUST** Hero의 `AI 키비주얼 만들기` 결과는 `section-key-visual` Asset으로 생성하고 해당 Hero Section의 background에 적용한다.
- Section 키비주얼 요청에서 `component-field-image` Job을 함께 만들지 않는다. 컴포넌트 이미지는 Section 정책이 `imageTarget: item`이고 대상 item key가 명시된 별도 요청에서만 생성한다.
- 기본 생성 비율은 Section의 `aiDesign.imageAspectRatio`를 사용하며 Desktop/Mobile에서 동일한 Section Asset을 각 viewport의 background render policy로 표시한다.
- **MUST NOT** 이미지 안에 제목, 설명, CTA, 버튼, 배지, 로고 또는 UI 문구를 생성한다.
- Hero 창작 지시문은 Section 키비주얼 요청의 guidance와 versioned prompt template으로 관리한다.
- 기존 Builder Document는 pinned snapshot이므로 Registry Seed 변경만으로 자동 갱신하지 않는다. 새 문서 생성 또는 명시적 Preset 재적용이 필요하다.

## 10. Visual Editor Live Preview 정책

### 10.1 Preview 표시 상태

- Preview 표시 상태는 `normal / selection / outline`으로 구분한다.
- **MUST** Outline을 Editor 전용 진단 상태로 취급한다. Template Layout, Builder Document, Page Output, AI Prompt에는 저장하거나 전달하지 않는다.
- **MUST** Outline에서 Section·Component 경계와 hidden·locked·empty·selected 상태를 Layout Shift 없이 구분할 수 있어야 한다.
- **MUST NOT** 경계 표시를 위해 실제 Component의 크기·padding·배치를 바꾸는 border를 사용한다.
- **MUST** Outline label과 guide는 Preview 콘텐츠의 클릭·드래그·텍스트 선택을 가로채지 않아야 한다.
- **MUST** Motion 측정 및 구조 확인 시 Outline 상태가 Component transform이나 저장된 motionSpec을 변경하지 않도록 한다.

### 10.2 선택 영역과 텍스트 실측

- **MUST** 텍스트 Component의 선택 영역은 `.rendered-item`의 임의 고정 높이가 아니라 실제 렌더링된 `.rendered-text` 영역과 일치해야 한다.
- **MUST** Auto-height 텍스트는 줄 수, 폰트, line-height, 줄바꿈이 바뀌면 실제 DOM 크기를 기준으로 선택 영역을 갱신한다.
- **MUST NOT** Component Box resize가 Font Size 변경을 암묵적으로 유발하게 한다. Box geometry와 Typography는 별도 명령으로 변경한다.
- 기존 fixed-height 문서는 명시적 전환 전까지 기존 값을 보존하고, 신규·auto-height 텍스트에만 실측 정책을 적용한다.

### 10.3 직접 편집과 Drag 충돌 방지

- **MUST** 편집 가능한 텍스트를 Preview에서 더블클릭하면 현재 위치와 스타일을 유지한 채 직접 편집할 수 있어야 한다.
- **MUST NOT** 단순 클릭·더블클릭 시 Component 좌표를 기본값이나 Section 좌측 상단으로 재계산한다.
- Drag는 pointer 이동이 임계값을 넘은 뒤에만 활성화하고, pointer capture와 `preventDefault()`도 Drag 활성화 이후에 수행한다.
- 텍스트 편집 중 클릭·드래그는 문자 또는 라인 선택으로 해석하며 Component Drag를 시작하지 않는다.
- `Escape`는 편집 전 값으로 취소하고, blur 또는 확정 동작은 개행을 보존한 문자열로 저장한다.

## 11. 텍스트 편집·서식 정책

### 11.1 콘텐츠와 서식 저장 경계

- **MUST** 텍스트 콘텐츠를 개행으로 구분된 plain string으로 유지한다. 사용자 HTML, 임의 inline style, script를 저장하지 않는다.
- **MUST** 라인 단위 서식은 콘텐츠와 분리된 `itemStyle.lineStyles` 메타데이터에 저장한다.
- 다중 필드 Component의 서식 주소는 `fieldKey`, 단일 텍스트 Item은 예약 scope인 `$item`을 사용한다.
- 라인 주소는 0부터 시작하는 숫자 인덱스 문자열이며 허용 범위는 `0..999`다.
- **MUST** lineStyles의 scope, line index, property, token reference, enum, numeric range를 Client와 API 양쪽에서 검증한다.
- **MUST NOT** Section AI Design이 임의 `lineStyles`를 생성하도록 허용한다. 라인 서식은 명시적인 사용자 편집 결과로만 저장한다.

표준 저장 예:

```json
{
  "lineStyles": {
    "$item": {
      "0": { "fontWeight": 700, "listType": "bullet", "listIndent": 1 },
      "1": { "colorToken": "--promo-color-text" }
    },
    "fld_description": {
      "2": { "fontStyle": "italic" }
    }
  }
}
```

### 11.2 적용 범위

- **MUST** Font Family, Font Size, Text Style, Bold, Italic, Font Color/Gradient, Background Color, Line Height, Letter Spacing, Bullet, Number, Indent, Outdent를 현재 선택된 라인에만 적용·해제한다.
- 선택 범위가 여러 라인에 걸치면 포함된 모든 라인에 한 번의 원자적 patch를 적용한다.
- 라인 선택 또는 caret 위치가 확인되지 않은 상태에서는 라인 서식 컨트롤을 비활성화한다.
- Undo/Redo, Section 기준 배치, Component size·position은 라인 서식이 아닌 Document/Component 범위로 유지한다.
- 여러 라인의 값이 다른 경우 Toolbar는 mixed state를 표시하거나 공통값이 없음을 나타내야 하며, 한 라인의 값을 다른 라인 값으로 오인해 덮어쓰지 않는다.

### 11.3 Toolbar와 디자인 토큰

- **MUST** Toolbar의 글꼴·크기·Text Style·Font Color/Gradient는 활성 Design Token 목록을 단일 출처로 사용한다.
- **MUST** 시스템 배경색 palette와 Promo Content Token palette를 UI에서 구분한다.
- **MUST** Undo, Redo, Bold, Italic, Bullet, Number, Indent, Outdent 등 토글/동작 컨트롤은 Font Awesome icon과 접근 가능한 이름(`title`, `aria-label`, `aria-pressed`)을 제공한다.
- Bold 해제는 상속값 제거만으로 끝내지 않고 정상 굵기 token 또는 `400`을 명시해 선택 라인에서 확실히 해제한다.
- Bullet/Number를 다시 누르면 선택 라인에서만 list를 해제하며 `listIndent`는 0으로 정규화한다.
- 들여쓰기·내어쓰기는 list가 적용된 라인에만 허용하고 `0..6` 범위로 제한한다.

### 11.4 텍스트 정렬과 Component 배치

- 텍스트 내부 정렬과 Component Box 위치를 별도 개념으로 관리한다.
- 기본 사용자 동작은 Section Content Bounds 기준 Component 배치다. `left / center / right`, `top / middle / bottom` anchor를 사용한다.
- Horizontal Anchor는 기본적으로 해당 텍스트의 내부 `text-align`과 연동할 수 있으나, Component 위치와 내부 글자 정렬의 저장 의미를 혼합하지 않는다.
- 자유 Drag를 시작하면 해당 viewport의 `positionMode`를 `free`로 전환하고, anchor 복원 동작을 별도로 제공한다.
- Desktop/Mobile override는 독립적으로 저장하며 한 viewport의 편집이 다른 viewport 값을 자동 덮어쓰지 않는다.

## 12. 구조 패널·AI 역할·Motion 정책

### 12.1 구조 패널과 AI 기능 분리

- **MUST** 선택된 Section과 펼쳐진 Section 상태를 분리한다. 같은 Section의 disclosure를 다시 누르면 선택을 잃지 않고 하위 내용을 닫을 수 있어야 한다.
- Component 상·하 화살표는 기본 구조 패널에 노출하지 않는다. 화면 위치는 Preview Drag/Anchor, 겹침은 Layer 명령, 읽기 순서는 별도 고급 기능으로 구분한다.
- `AI 디자인 생성`은 기존 Component 구조를 유지한 채 사용자 요구사항을 받아 Layout, Token, Key Visual, 허용 Motion을 제안한다.
- `AI 섹션 구성`은 신규·빈 Section에 등록된 Component 조합을 제안하는 기능이다. 미등록 Component ID나 임의 HTML을 만들 수 없다.
- **MUST** AI 제안은 Preview·검증 후 원자적으로 적용하며 `baseRevision` 불일치 시 덮어쓰지 않는다.

### 12.2 Motion

- **MUST** Section·Component Motion은 활성화된 Motion Preset ID만 사용하며 임의 CSS keyframe·JavaScript를 저장하지 않는다.
- **MUST** Editor Preview와 Web Output이 동일한 `motionSpec`과 preset registry를 사용한다.
- **MUST** `prefers-reduced-motion: reduce`에서 애니메이션을 제거하고 콘텐츠를 즉시 노출한다.
- **MUST** Runtime 초기화 또는 JavaScript 실행이 실패해도 콘텐츠가 숨은 상태로 남지 않게 한다.
- Motion 변경은 Undo/Redo와 revision 계약에 포함한다. Outline toggle과 같은 Editor 표시 상태는 포함하지 않는다.
- Desktop/Mobile별 Motion override 계약이 도입되기 전까지 Motion은 공통 적용으로 명시한다.

## 13. Overview·CTA 계약 정책

### 13.1 Overview 단일 계약

- **MUST** 자연어 분석 API, Legacy Template Host, Vue AI Builder, 저장소, Composer가 동일한 최신 Overview schema를 사용한다. 2026-08-06 기준은 `schemaVersion: 5`다.
- Overview v5의 CTA 단일 필드는 `ctaLabel`이다. `primaryAction`, `mainOffer`, `title`, `leadText`를 CTA label의 대체 source로 사용하지 않는다.
- **MUST** 브라우저와 서버가 같은 정규화 결과와 fingerprint를 생성한다. schemaVersion 또는 정규화 필드가 다르면 생성·추천·Apply를 진행하지 않고 계약 불일치로 처리한다.
- **MUST** API 분석 결과를 Legacy 콘텐츠에 반영할 때 `ctaLabel`을 `content.promo.ctaLabel`과 canonical `promotionOverview.ctaLabel` 양쪽에 유실 없이 동기화한다.
- Overview schema 변경은 서버 계약, 브라우저 adapter, fixture, fingerprint parity test를 하나의 변경 단위로 배포한다.

### 13.2 CTA 길이와 저장 경계

- CTA는 행동 중심의 짧은 문구로 생성하며 권장 길이는 2~4단어다.
- **MUST** 공백을 포함해 최대 20 Unicode code point로 제한한다.
- **MUST** Prompt, Structured Output Schema, 공통 Validator, Visual Editor, Template Layout 저장, Builder Document 저장에서 동일 제한을 적용한다.
- 브라우저의 HTML `maxlength`만 안전 경계로 간주하지 않는다. JavaScript 정규화와 서버 저장 검증을 함께 적용한다.
- 20자를 초과하면 `CTA_LABEL_TOO_LONG`으로 거부하며 자동 자르기로 의미를 바꾸지 않는다. 사용자가 직접 입력하는 편집 UI만 입력 중 20자로 제한할 수 있다.
- 과거 문서는 조회할 수 있으나 재저장·재생성 시 현행 정책을 적용한다.

## 14. Builder Document·Export 정책

- **MUST** AI Apply, 자연어 Operation, 수동 저장, rollback을 단일 `documentRevision` 직렬화 경계로 처리한다.
- **MUST NOT** `DOCUMENT_REVISION_MISMATCH`에서 자동 merge 또는 강제 덮어쓰기를 수행한다. 최신 문서를 reload한 뒤 사용자 변경을 다시 적용한다.
- Export는 문서 소유권, 요청 revision, Export Feature Flag, owner 기반 rollout을 모두 검증한다.
- 공개 Export Snapshot에서는 관리 metadata, provenance, validation, 미완료 Asset request를 제거하고 Renderer에 필요한 공개 데이터만 포함한다.
- HTML/Vue/React Export는 동일 공개 Snapshot과 동일 Renderer runtime을 사용한다.
- **MUST** JSON을 HTML에 삽입할 때 `<`, `>`, `&`, U+2028, U+2029를 escape한다.
- Editor toolbar, selection/outline, 관리용 metadata는 Export 결과에 포함하지 않는다.

## 15. Migration·Seed 재현성 정책

- **MUST** 운영 DB에서 수동으로 적용한 index, constraint, column, data repair를 다음 배포 가능한 idempotent Migration으로 저장소에 코드화한다.
- **MUST NOT** `CREATE TABLE IF NOT EXISTS`가 기존 테이블의 누락 constraint까지 보강한다고 가정한다.
- Seed의 `ON CONFLICT` target은 실제 PK/Unique 계약과 일치해야 하며, 해당 constraint가 모든 지원 DB 상태에서 존재하는지 Migration contract test로 검증한다.
- Seed는 최신 `main` 기준의 명시된 순서로 실행하고, 실행 전 database, schema, search path를 확인한다.
- Seed 004의 `promo_design_token_values` conflict key는 `(token_set_version_id, token_key, value_index)`다.
- `--app-hero-bg-image`의 동일 token/version 내 `value_index=0,1` 행은 list-valued gradient layer이므로 중복 데이터로 삭제하지 않는다.
- 이미 생성된 Builder Document와 Export는 pinned snapshot을 사용하며 Seed 재실행만으로 변경하지 않는다.

## 16. 빌드 산출물·테스트·릴리스 정책

### 16.1 빌드 산출물

- `prototype/admin-assets/*`, `prototype/visual-editor-assets/*`처럼 저장소가 직접 제공하는 정적 산출물은 대응 소스와 같은 커밋에서 생성·검증한다.
- **MUST** shared runtime, Vue component, CSS 또는 Vite entry가 변경되면 관련 Admin·Visual Editor build를 모두 다시 실행한다.
- **MUST** 빌드 후 생성된 산출물과 소스의 semantic contract가 일치하는지 확인한다. 소스만 최신이고 커밋된 정적 bundle이 이전 구현인 상태로 배포하지 않는다.
- CI/릴리스 환경은 프로젝트 `engines.node`와 동일한 Node 22.x를 사용한다. 다른 major에서의 성공은 참고 결과이며 최종 release evidence가 아니다.

### 16.2 테스트 분류와 Gate

- 전체 Suite 실패는 `제품 회귀 / 오래된 assertion·selector / fixture 누락 / browser timing·flaky / 환경 제한` 중 하나로 증거와 함께 분류한다.
- **MUST NOT** 실패 테스트를 단순히 삭제하거나 제품 동작에 맞춰 무조건 완화한다. 먼저 정책·기대 UX와 실제 DOM/API 계약을 대조한다.
- 브라우저·서버 Overview fingerprint parity, CTA 저장, Builder 저장/reload, Export parity, revision 충돌은 release blocking 계약이다.
- 노후 테스트를 확인했으면 같은 변경에서 fixture·selector·기대 계약을 갱신해 전체 Suite가 실제 회귀 신호를 제공하도록 복구한다.
- 미분류 브라우저 timeout 또는 실패가 남아 있으면 “전체 검증 완료”로 표시하지 않는다.

## 부록. 강제 수준 표기·출처

각 정책의 상세 배경·구현 지침은 취합 출처 문서에 있다. 본 정책서는 흩어진 규칙을 한 곳에서 참조·강제하기 위한 단일 기준이며, 개별 계획서가 갱신되면 해당 정책 항목도 함께 갱신한다.

### 2026-08-01 갱신 요약

- Live Preview의 Normal/Selection/Outline 정책과 실측 Selection Box 규칙을 추가했다.
- Preview 직접 텍스트 편집과 Drag pointer capture 충돌 방지 규칙을 추가했다.
- 기존 계획에서 제외했던 라인 단위 서식을 `lineStyles` 제한 계약으로 현행화했다.
- Font Awesome Toolbar, Design Token, List/Indent, Section Anchor의 적용 범위를 확정했다.
- 구조 패널, AI 디자인/구성 역할 분리, Motion preset·Reduced Motion 정책을 통합했다.

### 2026-08-06 갱신 요약

- Registry Composition Contract v3, fingerprint, pinned Resource, Proposal 승인 정책을 추가했다.
- Overview v5와 `ctaLabel` 단일 source, 20 Unicode code point 저장 경계를 확정했다.
- Hero `section-key-visual` Section background와 이미지 내 UI 문구 금지 정책을 확정했다.
- Builder Document revision, Export 공개 Snapshot·rollout 정책을 추가했다.
- 운영 수동 DB 보완의 Migration 코드화와 Seed 재현성 정책을 추가했다.
- 커밋 정적 bundle과 소스 동기화, Node 22, 실패 테스트 분류·릴리스 Gate를 명시했다.
- Legacy Template Host의 Overview v5·`ctaLabel` 동기화와 browser/server fingerprint parity를 복구했다.
- 운영 수동 Unique Index 보완을 idempotent Migration 054와 회귀 테스트로 코드화했다.
- 텍스트 자동 높이의 Renderer·Toolbar 판정을 공통화하고 Admin·Visual Editor 정적 bundle을 재생성했다.
- 현행 UI 구조와 locale fixture에 맞춰 회귀 테스트를 복구했으며, 최종 릴리스 증거는 Node 22.x 전체 Suite로 확정한다.
