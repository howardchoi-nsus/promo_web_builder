# Create Promo Step 3 AI 콘텐츠·템플릿 레이아웃 자동 구성 상세 개발계획서

- 작성일: 2026-07-19
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: `Create Promo > Step 3. Template & Content`
- 문서 상태: 구현 전 설계 기준안
- 구현 우선순위: P0 계약·검증, P1 AI 콘텐츠, P1 AI Layout Variant, P2 이미지·시각 QA, P3 Admin AI Draft
- 주요 독자: 후속 개발자, Codex/Claude/Gemini 등 다른 LLM, QA, 운영 관리자
- 관련 화면:
  - Create Promo: `/prototype/create-promo.html`
  - Admin 템플릿 관리: `/prototype/index.html?view=admin&tab=promo-form`
  - Admin Layout Editor: `/prototype/visual-editor.html?mode=admin-layout&templateId={id}`
  - Visual Editor: `/prototype/visual-editor.html`
- 선행 문서:
  - `docs/claude/ai-utilization-strategy-review-2026-07-17.md`
  - `docs/admin-template-default-layout-wizard-editing-development-plan-2026-07-17.md`
  - `docs/create-promo-admin-layout-sync-hardening-development-plan-2026-07-19.md`
  - `docs/visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md`
  - `docs/visual-renderer-p0-baseline-and-contract-2026-07-16.md`

## 1. 문서 목적

이 문서는 Create Promo Step 3에서 AI를 활용해 다음 두 결과를 생성하는 기능의 상세 개발 기준을 정의한다.

1. 프로모션 개요와 Admin Template의 Section/Item 구조를 기반으로 콘텐츠 초안을 생성한다.
2. 콘텐츠, 캠페인 목적과 디자인 방향을 분석해 폰트 크기, 굵기, 정렬, Item 위치, Section 높이와 반응형 구성을 포함하는 Layout Variant를 생성한다.

이 문서는 단순 아이디어 목록이 아니다. 다른 LLM이나 개발자가 별도 구두 설명 없이 다음을 판단할 수 있어야 한다.

- 현재 구현과 미구현 범위
- Admin, Create Promo, Visual Editor, AI Worker의 데이터 소유권
- AI가 변경할 수 있는 값과 변경하면 안 되는 값
- API, DB, Snapshot, Prompt와 Model 실행 계약
- UI 상태와 사용자 승인 흐름
- 검증, 보안, 접근성, 비용과 장애 처리
- 단계별 구현 파일과 테스트 완료 조건

## 2. 한 문장 결론

> AI는 활성 Admin Template을 기반으로 콘텐츠 Patch와 검증 가능한 Layout Variant를 제안하고, 결정적 코드가 이를 좌표·스타일 값으로 컴파일·검증하며, 사용자가 선택한 결과만 Create Promo 실행 Snapshot에 적용한다.

AI가 Admin 활성 템플릿을 직접 수정하거나 자유 CSS/Vue 코드를 운영 화면에 즉시 실행하는 방식은 이번 범위에서 금지한다.

## 3. 확정 목표 흐름

Create Promo 전체 흐름은 다음 순서를 유지한다.

```text
Step 1. Background
  → Create Promo 실행의 배경색과 기본 텍스트 대비 결정

Step 2. CTA Style
  → CTA 각진/둥근 형태와 고스트/채움 표현 결정

Step 3. Template & Content
  → 프로모션 개요 입력
  → 활성 Admin Template 선택
  → AI 콘텐츠 초안 생성 또는 수동 입력
  → AI Layout Variant 3개 생성
  → 실제 Vue Renderer에서 Desktop/Mobile 비교
  → Variant 선택 후 Visual Editor에서 수동 보정
  → 결정적 검증 통과

Step 4. Web Output
  → 선택된 Content + Layout + Asset Snapshot 확정
  → Step 3과 동일한 Renderer로 실제 웹 출력
```

### 3.1 Step 3 내부 목표 흐름

```text
프로모션 개요
  → 템플릿 선택
  → 콘텐츠 입력/AI 작성
  → AI 레이아웃 구성
  → Variant 비교
  → 선택·수동 수정
  → 콘텐츠·레이아웃 검증
  → Step 4 진행
```

## 4. 현재 구현 상태

### 4.1 구현 완료

- Create Promo는 기존 Promo Wizard와 분리된 독립 화면과 Storage Key를 사용한다.
- Step 1 배경색과 Step 2 CTA 스타일을 선택할 수 있다.
- Step 3에서 활성 Admin Form Template과 Section/Item 정의를 공개 API로 읽는다.
- Admin에서 활성화한 기본 Layout을 Step 3 Visual Editor iframe에 전달한다.
- Create Promo에서 사용자가 변경한 콘텐츠와 Layout은 Admin Template에 역반영되지 않는다.
- Step 1·2 Appearance가 Admin Layout보다 높은 최종 우선순위를 가진다.
- Visual Editor는 실제 Vue Renderer를 사용한다.
- Visual Editor는 다음 속성을 편집하고 렌더링한다.
  - Item 글자색
  - `fontSize`
  - `fontWeight`
  - `textAlign`
  - `positionMode`
  - `xPct`
  - `yPx`
  - Section `minHeight`
  - 기본 콘텐츠 폭과 Font Family
- Desktop/Mobile Preview 전환이 있다.
- Section별 콘텐츠 완료/누락 상태를 아이콘과 접근성 라벨로 표시한다.
- Admin Layout은 Draft 저장 후 Template 활성화 과정을 거쳐 Create Promo에 공개된다.
- Layout Identity와 Revision 충돌 방지 로직이 있다.

### 4.2 부분 구현

#### 자동등록

Create Promo Step 3의 `자동등록`은 AI 기능이 아니다.

현재 동작:

- 빈 Text Item에 프로모션 제목 또는 개요 요약을 입력한다.
- 빈 CTA Item에 목적 기반 버튼 문구와 `#` 링크를 입력한다.
- 이미 입력된 값은 덮어쓰지 않는다.
- 이미지 생성, 문장 작성, 톤 조절, Layout 생성은 하지 않는다.

관련 함수:

- `prototype/create-promo.js > autoRegisterPromoOverview()`
- `visual-editor/src/App.vue > requestAutoRegister()`

AI 기능 도입 후 혼동을 피하기 위해 버튼 이름을 `기본 자동등록`으로 변경한다.

#### 이미지 AI 계약

- Admin Section Item은 이미지 Source로 `ai`를 허용할 수 있다.
- `ai` Source를 허용하면 Prompt Text가 필수라는 서버 검증이 있다.
- Visual Editor는 이미지 설명을 입력받을 수 있다.
- 실제 이미지 생성 요청, 진행 상태, Asset 저장과 선택 적용은 미구현이다.

### 4.3 미구현

- AI 콘텐츠 초안 생성 API와 Worker
- 선택 필드 단위 AI 작성·재작성
- AI Layout Intent 생성
- Layout Intent를 Design Spec으로 변환하는 Layout Compiler
- AI Layout Variant 저장·조회·적용 API
- Variant 3개 비교 UI
- AI 결과 전/후 Diff UI
- 반응형 breakpoint별 Item/Section Style 계약
- 결정적 충돌·Overflow·대비·Touch Target 검사
- Renderer Screenshot 기반 Vision QA
- AI 결과 적용·거절·재생성 로그
- Admin AI 기본 레이아웃 Draft 제안

## 5. 데이터 소유권과 변경 경계

### 5.1 Source of Truth

| 데이터 | Source of Truth | 쓰기 주체 | AI 권한 |
|---|---|---|---|
| Form Template 정의 | Admin DB | Admin Draft API | 읽기만 가능 |
| Section/Item 계약 | Admin DB | Admin Draft API | 읽기만 가능 |
| Active/Draft 상태 | Admin DB | Admin 활성화 API | 변경 금지 |
| Admin 기본 Layout | Admin Template Layout DB | Admin Layout Editor | Admin AI Draft에서만 제안 가능 |
| Create Promo 콘텐츠 | 실행 Snapshot | 사용자 또는 승인된 AI Patch | 실행 범위 수정 가능 |
| Create Promo Layout | 실행 Snapshot | 사용자 또는 승인된 AI Variant | 실행 범위 수정 가능 |
| Step 1 Background | Create Promo Appearance | 사용자 | AI 변경 금지 |
| Step 2 CTA Style | Create Promo Appearance | 사용자 | AI 변경 금지 |
| 생성 Asset | Asset Registry/Snapshot | 업로드 또는 AI Worker | 승인 후 실행에 연결 |
| Prompt/Model 설정 | Admin DB | Admin | AI 실행 시 읽기만 가능 |
| AI 실행 Snapshot | Queue 시점 Snapshot | 서버 | 실행 후 불변 |

### 5.2 금지되는 흐름

```text
Create Promo 사용자 콘텐츠
  ✕ → Admin Template Section/Item 수정

Create Promo 실행별 Layout
  ✕ → Admin 기본 Layout 자동 저장

AI Layout 결과
  ✕ → Admin Active Template 자동 교체

AI 출력 CSS/Vue 코드
  ✕ → 운영 DOM에서 즉시 실행

AI Layout
  ✕ → Step 1 배경색 또는 Step 2 CTA 선택 덮어쓰기
```

### 5.3 스타일 우선순위

최종 렌더링 우선순위는 유지한다.

```text
Renderer Default
  → Admin Active Template Default Layout
  → Create Promo 실행별 수동 Layout
  → 승인된 AI Layout Variant/Patch
  → Step 1 Background Override
  → Step 2 CTA Override
```

AI Variant에 배경색이나 CTA 속성이 들어와도 Step 1·2 Override가 최종값을 가진다. 가능하면 API Schema 단계에서 해당 속성을 AI 출력 대상에서 제외한다.

## 6. AI와 결정적 코드의 역할 분리

### 6.1 AI가 담당하는 일

- 프로모션 개요 해석
- 콘텐츠 초안과 표현 Variant 생성
- 캠페인 톤에 맞는 문장 재작성
- 콘텐츠 위계와 강조점 제안
- 디자인 방향과 Composition 제안
- Section별 Layout Intent 제안
- 폰트 Scale, 정렬, 시각 밀도와 CTA 강조 전략 제안
- 이미지 Prompt 개선과 이미지 후보 생성
- 렌더링 Screenshot에 대한 시각적 문제 후보 탐지

### 6.2 결정적 코드가 담당하는 일

- Template/Section/Item 존재 여부 검증
- 잠금·숨김·필수 정책 적용
- Layout Intent의 실제 좌표 계산
- 값 범위 제한과 알 수 없는 속성 거부
- Step 1·2 Override 강제
- 콘텐츠 Coverage 판정
- URL Scheme과 CTA URL 검증
- Item 충돌과 Section 경계 검사
- 텍스트 Overflow와 대비 검사
- Mobile Stack/Fallback 계산
- Snapshot 병합과 Revision 판정
- Active/Draft 상태 변경
- 감사 로그 마스킹과 접근 통제

### 6.3 핵심 원칙

AI에게 임의 픽셀 좌표를 자유롭게 작성하게 하지 않는다.

권장 구조:

```text
AI Layout Intent
  → Layout Compiler
  → Design Spec v2
  → Schema/Reference/Geometry Validator
  → 실제 Renderer Preview
  → Screenshot/Vision QA
  → 사용자 승인
```

MVP에서는 AI가 제한된 수치 속성을 반환할 수 있지만, 서버가 반드시 정규화·Clamp·충돌 검사한 결과만 Variant로 저장한다.

## 7. AI 콘텐츠 기능 상세

### 7.1 전체 콘텐츠 초안

Step 3 Live Preview 헤더에 다음 기능을 제공한다.

- `기본 자동등록`: 기존 Rule-based 기능
- `AI 콘텐츠 작성`: 전체 콘텐츠 초안 생성

AI 입력:

- 프로모션 제목
- 목적과 기타 목적
- 마켓/지역
- 대상 고객
- 캠페인 톤
- 선택 템플릿과 Section/Item Schema
- 현재 콘텐츠
- 잠금/필수/표시 정책
- 출력 언어
- 핵심 혜택
- 목표 행동
- 기간
- 필수 고지와 금지 표현

현재 개요에 없는 `출력 언어`, `핵심 혜택`, `목표 행동`, `기간`, `필수 고지`는 P1 입력 항목으로 추가한다.

### 7.2 기존값 보호 정책

기본값은 빈 필드만 작성한다.

사용자 옵션:

- `빈 항목만 작성` — 기본값
- `전체 콘텐츠 개선` — 기존값 포함
- `선택 Section만 작성`

잠금 Item은 어떤 모드에서도 AI가 수정하지 못한다.

### 7.3 선택 필드 AI 도우미

CONTENT 패널의 각 수정 가능한 필드에 `AI 작성` 메뉴를 제공한다.

- 새로 작성
- 더 짧게
- 더 명확하게
- 더 설득력 있게
- 캠페인 톤에 맞게
- 표현 3개 제안
- 번역
- 맞춤법과 문장 정리

접근성 이름은 대상 필드를 포함한다.

예:

```text
프로모션 타이틀 AI 작성
Hero 설명 AI 작성
참여 버튼 문구 AI 작성
```

### 7.4 콘텐츠 Patch 계약

AI는 전체 `sectionInputs`를 반환하지 않고 Patch 목록을 반환한다.

```json
{
  "contractVersion": 1,
  "requestId": "uuid",
  "patches": [
    {
      "path": "heroBanner.title",
      "operation": "replace",
      "value": "신규 회원을 위한 주말 웰컴 보너스",
      "reason": "대상 고객과 긴급한 캠페인 톤을 반영",
      "confidence": 0.87
    }
  ],
  "warnings": []
}
```

허용 Operation은 `add`, `replace`만 사용한다. AI가 Item이나 Section을 삭제하는 `remove`는 허용하지 않는다.

### 7.5 콘텐츠 Diff 적용

AI 응답을 즉시 저장하지 않는다.

```text
생성 완료
  → 변경 전/후 비교
  → 항목별 체크
  → 선택 적용
  → 결정적 콘텐츠 검증
  → 실행 Snapshot 저장
```

사용자가 입력한 값과 AI 결과가 충돌하면 사용자 값이 우선한다.

## 8. AI Layout 자동 구성 상세

### 8.1 사용자 목표

사용자는 디자인 전문 지식 없이도 현재 콘텐츠와 Admin Template 구조에 적합한 레이아웃 후보를 얻고, 후보를 실제 웹 화면으로 비교한 뒤 선택·수정할 수 있어야 한다.

### 8.2 기본 Variant 구성

한 번의 요청에서 기본 3개 Variant를 생성한다.

| Variant | 목적 | 특징 |
|---|---|---|
| Image-led | 시각적 주목 | 이미지 비중, 큰 Hero, 강한 첫 화면 |
| Editorial | 정보 전달 | 명확한 타이포 위계, 여백, 읽기 흐름 |
| Conversion | 행동 유도 | 핵심 혜택과 CTA 인접, 높은 CTA 가시성 |

동일한 세 Variant 이름을 기계적으로 반복하지 않고, 프로모션 특성에 맞는 이름과 이유를 함께 제공한다.

### 8.3 AI Layout Intent 계약

AI의 1차 출력은 DOM 좌표가 아니라 의미 기반 Layout Intent다.

```json
{
  "contractVersion": 1,
  "variantKey": "conversion-focused",
  "name": "CTA 중심",
  "summary": "혜택 설명과 참여 버튼을 첫 화면에서 연결합니다.",
  "designAxes": {
    "composition": "conversion",
    "density": "comfortable",
    "visualWeight": "text-led",
    "sectionRhythm": "progressive",
    "ctaEmphasis": "strong"
  },
  "sectionPlans": {
    "heroBanner": {
      "heightToken": "large",
      "contentAlign": "left",
      "layoutPattern": "stacked-copy",
      "items": {
        "title": {
          "fontScale": "display",
          "fontWeightToken": "extra-bold",
          "placement": "top-left",
          "maxLines": 2
        },
        "description": {
          "fontScale": "body-large",
          "placement": "below-title",
          "maxLines": 4
        },
        "button": {
          "placement": "below-description",
          "emphasis": "primary"
        }
      }
    }
  },
  "responsiveIntent": {
    "mobileStrategy": "single-column-stack",
    "preserveReadingOrder": true
  }
}
```

### 8.4 Layout Compiler

신규 순수 모듈을 만든다.

예상 파일:

- `visual-editor/src/layout-intent-contract.mjs`
- `visual-editor/src/layout-compiler.mjs`
- `visual-editor/src/layout-geometry-validator.mjs`

주요 함수:

```text
validateLayoutIntent(intent, templateSnapshot)
compileLayoutIntent(intent, templateSnapshot, contentMetrics, baseLayout)
applyAppearanceGuards(compiledSpec, appearance)
validateCompiledLayout(spec, templateSnapshot, viewportMetrics)
createLayoutVariantDiff(baseSpec, candidateSpec)
```

Compiler 입력:

- Admin 기본 Layout
- Template Section/Item Snapshot
- 실제 콘텐츠 길이와 종류
- Item 예상 또는 측정 크기
- Desktop/Mobile Viewport 규칙
- 허용 Font Scale/Spacing/Height Token
- Step 1·2 Appearance

Compiler 출력:

- Design Spec v2
- 계산 경고
- 적용 불가 Item 목록
- 자동 Fallback 내역

### 8.5 Design Spec v2

현재 `contractVersion: 1`을 AI 적용 전에 정리한다.

권장 구조:

```json
{
  "contractVersion": 2,
  "specKey": "ai-variant-conversion-focused",
  "source": {
    "type": "ai-variant",
    "variantId": "uuid",
    "baseLayoutRevision": 3
  },
  "theme": {
    "textColor": "#172033",
    "accentColor": "#156b5b",
    "fontFamily": "Inter, Pretendard, sans-serif"
  },
  "responsive": {
    "contentMaxWidth": 1440,
    "contentMinWidth": 1140,
    "mobileBreakpoint": 720
  },
  "sectionStyles": {
    "heroBanner": {
      "minHeight": 540
    }
  },
  "itemStyles": {
    "heroBanner.title": {
      "positionMode": "free",
      "xPct": 8,
      "yPx": 92,
      "fontSize": 54,
      "fontWeight": 800,
      "textAlign": "left"
    }
  },
  "breakpointOverrides": {
    "mobile": {
      "sectionStyles": {
        "heroBanner": {
          "minHeight": 420
        }
      },
      "itemStyles": {
        "heroBanner.title": {
          "positionMode": "auto",
          "fontSize": 36,
          "textAlign": "left"
        }
      }
    }
  }
}
```

### 8.6 AI가 변경할 수 있는 Layout 속성

P1 허용:

- `fontSize`
- `fontWeight`
- `textAlign`
- Item 위치 Intent
- 컴파일된 `xPct`, `yPx`
- Section `minHeight`
- 콘텐츠 폭 Token
- Font Family Token
- Accent Color Token
- Mobile Stack/Font Scale

P1 금지:

- 임의 CSS 문자열
- 임의 HTML/Vue 코드
- `display`, `position`, `overflow` 같은 Raw CSS 주입
- 외부 Script나 Style URL
- Template Section/Item 추가·삭제
- 잠금 Item 변경
- Step 1 Background 변경
- Step 2 CTA 색상·Shape·Variant 변경
- Active/Draft 상태 변경

### 8.7 Variant 비교 UX

`AI 레이아웃 구성` 버튼을 Template Layout 헤더에 추가한다.

```text
AI 레이아웃 구성
  → 생성 방향 선택 또는 자동
  → 요청 접수
  → 생성/검증 진행
  → 3개 Variant 카드 표시
```

각 카드에는 다음을 표시한다.

- Variant 이름
- 한 줄 설명
- 실제 Vue Renderer Preview
- Desktop/Mobile 전환
- 폰트·위치·Section 높이 변경 요약
- 검증 결과
- AI 선택 이유
- `이 디자인 적용`
- `비슷한 방향으로 다시 생성`

적용 후:

- Visual Editor에서 모든 허용 속성을 수동 수정할 수 있다.
- `AI 적용 전으로 되돌리기`를 제공한다.
- `관리자 기본 레이아웃으로 초기화`는 계속 제공한다.

## 9. Admin AI 기본 레이아웃 기능

### 9.1 Create Promo AI와 분리

Create Promo AI Layout은 특정 프로모션 실행에만 적용된다.

Admin AI Layout은 재사용 가능한 기본 Layout Draft를 제안한다.

두 기능은 API, 권한과 저장 위치를 분리한다.

### 9.2 Admin 흐름

```text
Admin Draft Template 열기
  → AI 기본 레이아웃 제안
  → 3개 후보 Preview
  → 후보 선택
  → Admin Layout Editor에서 수동 수정
  → 변경 사유 입력
  → Draft 저장
  → 기존 Template 활성화 검증
  → 관리자가 명시적으로 활성화
```

### 9.3 금지 사항

- AI가 Active Template을 직접 수정하지 않는다.
- AI 결과가 자동 활성화되지 않는다.
- Create Promo 실행별 콘텐츠를 Admin AI Prompt에 자동 학습 자료로 전달하지 않는다.
- 사용자 실행 Layout을 관리자가 승인하지 않은 상태에서 재사용 Template으로 승격하지 않는다.

Admin AI 기능은 P3로 분류한다. Create Promo 실행별 Variant와 검증 체계가 안정화된 이후 구현한다.

## 10. API 설계

### 10.1 AI 콘텐츠 생성 요청

```http
POST /api/create-promo-ai-content-drafts
Content-Type: application/json
```

```json
{
  "runId": "uuid",
  "mode": "empty-only",
  "locale": "ko-KR",
  "templateIdentity": {
    "templateId": "uuid",
    "templateKey": "default-promo",
    "templateVersion": 4,
    "configRevision": "hash",
    "layoutRevision": 3,
    "rendererKey": "default-promo-renderer",
    "rendererVersion": 1
  },
  "promoOverview": {},
  "sectionSnapshot": [],
  "currentInputs": {},
  "selectedSectionKeys": [],
  "protectedPaths": []
}
```

초기 응답:

```json
{
  "ok": true,
  "draftId": "uuid",
  "status": "queued"
}
```

조회:

```http
GET /api/create-promo-ai-content-drafts?draftId={id}
```

### 10.2 AI Layout Variant 생성 요청

```http
POST /api/create-promo-ai-layout-variants
Content-Type: application/json
```

```json
{
  "runId": "uuid",
  "variantCount": 3,
  "direction": "auto",
  "templateIdentity": {},
  "promoOverview": {},
  "sectionSnapshot": [],
  "sectionInputs": {},
  "baseLayout": {},
  "appearance": {
    "backgroundKey": "forest",
    "ctaShape": "round",
    "ctaVariant": "fill"
  },
  "viewportTargets": ["desktop", "mobile"]
}
```

초기 응답:

```json
{
  "ok": true,
  "generationId": "uuid",
  "status": "queued"
}
```

조회:

```http
GET /api/create-promo-ai-layout-variants?generationId={id}
```

성공 응답:

```json
{
  "status": "ready",
  "variants": [
    {
      "variantId": "uuid",
      "name": "CTA 중심",
      "summary": "혜택과 참여 동선을 첫 화면에 집중합니다.",
      "layoutIntent": {},
      "compiledSpec": {},
      "validation": {
        "ok": true,
        "warnings": []
      },
      "qa": {
        "status": "passed",
        "issues": []
      }
    }
  ]
}
```

### 10.3 적용 API

AI 결과 적용은 사용자의 명시적 선택으로만 실행한다.

```http
POST /api/create-promo-ai-layout-variants/{variantId}/apply
```

서버는 적용 전에 다음을 다시 검사한다.

- Run 소유권
- Template Identity 일치
- Config/Layout Revision 일치
- Variant 상태 `ready`
- Validation 통과
- Step 1·2 Appearance Guard 적용 가능

클라이언트 Local Storage만으로 적용 기록을 끝내지 않는다. 서버 기록 실패 시 현재 화면은 유지하되 재시도 상태를 표시한다.

## 11. DB 설계

기존 `promo_generation_runs`, Prompt 실행 Snapshot과 Layout Usage Event 패턴을 재사용한다.

신규 Migration 예시:

- `db/migrations/024_create_promo_ai_content_and_layout_variants.sql`

### 11.1 AI 콘텐츠 Draft

권장 테이블: `promo_generation_ai_content_drafts`

주요 컬럼:

- `id uuid primary key`
- `run_id uuid not null`
- `attempt integer not null`
- `status queued|running|ready|failed|cancelled`
- `mode text`
- `input_hash text`
- `template_identity jsonb`
- `input_snapshot jsonb`
- `content_patches jsonb`
- `validation_result jsonb`
- `prompt_meta jsonb`
- `model_meta jsonb`
- `error_code text`
- `error_message text`
- `applied_at timestamptz`
- `created_at`, `updated_at`

Unique:

```text
(run_id, attempt)
```

### 11.2 AI Layout 생성

권장 테이블: `promo_generation_ai_layout_generations`

주요 컬럼:

- `id uuid primary key`
- `run_id uuid not null`
- `attempt integer not null`
- `status`
- `input_hash`
- `template_identity jsonb`
- `base_layout jsonb`
- `appearance_snapshot jsonb`
- `prompt_meta jsonb`
- `model_meta jsonb`
- `error_code`, `error_message`
- `created_at`, `updated_at`

권장 테이블: `promo_generation_ai_layout_variants`

- `id uuid primary key`
- `generation_id uuid not null`
- `variant_order integer`
- `variant_key text`
- `name text`
- `summary text`
- `layout_intent jsonb`
- `compiled_spec jsonb`
- `validation_result jsonb`
- `qa_result jsonb`
- `applied_at timestamptz`
- `rejected_at timestamptz`
- `created_at`

### 11.3 실행 Snapshot 연결

Step 4 Snapshot에는 다음을 남긴다.

```json
{
  "ai": {
    "contentDraftId": "uuid-or-null",
    "layoutGenerationId": "uuid-or-null",
    "layoutVariantId": "uuid-or-null"
  },
  "templateIdentity": {},
  "content": {},
  "resolvedLayout": {},
  "appearance": {},
  "assets": {}
}
```

## 12. Prompt와 Model 설정

### 12.1 Prompt Type

Admin Prompt 관리에 다음 Type을 추가한다.

- `content_draft`
- `content_rewrite`
- `layout_intent`
- `layout_visual_qa`
- `section_image`

P1 필수:

- `content_draft`
- `layout_intent`

### 12.2 실행 Snapshot

Queue 시점에 다음 값을 고정한다.

- Prompt ID/Type/Version
- Provider/Model
- Temperature/Max Tokens
- Response Format
- Required Variables
- Rendered Prompt Hash
- Template Identity
- 입력 Hash
- Design MD 근거 ID/Source Path

Admin이 실행 중 Prompt나 Model을 바꿔도 기존 요청 결과가 변경되면 안 된다.

### 12.3 Structured Output

가능하면 Provider의 JSON Schema/Structured Output을 사용한다.

Structured Output을 지원하지 않는 Provider도 서버 JSON Schema Validator를 반드시 통과해야 한다.

검증 실패 처리:

1. 동일 응답을 자동 수정 Parsing하지 않는다.
2. 허용 범위 안에서 최대 1회 Repair Prompt를 허용한다.
3. 다시 실패하면 Attempt를 `failed` 처리한다.
4. 기본 Layout 또는 직전 정상 Snapshot을 유지한다.

## 13. Design MD 활용

`docs/design-md`와 데이터화된 Design Token/Metadata는 AI Layout의 참고 근거로 사용할 수 있다.

### 13.1 권장 검색 흐름

```text
프로모션 개요 + 캠페인 톤
  → 디자인 스타일 분류
  → Design MD 후보 검색
  → 2~3개 Source의 Color/Typography/Layout Token 추출
  → Prompt Context에 주입
  → Layout Intent 생성
```

### 13.2 제한

- Design MD 원문 전체를 Prompt에 넣지 않는다.
- 근거 Source Path와 Token ID를 실행 Snapshot에 저장한다.
- 서로 충돌하는 Token은 Brand/Admin 정책을 우선한다.
- Step 1·2 사용자 선택과 충돌하는 색상/CTA 제안은 제거한다.
- 외부 디자인을 그대로 복제하지 않고 추상화된 Pattern과 Token만 사용한다.

## 14. 검증 체계

### 14.1 JSON Schema

- 지원 Contract Version 확인
- 허용된 최상위 Key만 허용
- 알 수 없는 CSS 속성 거부
- String/Number/Enum 범위 검사
- Payload 크기 제한

### 14.2 참조 무결성

- 모든 Section Key가 Template Snapshot에 존재
- 모든 Item Style Key가 실제 Item에 존재
- 숨김 Item은 AI 대상에서 제외
- 잠금 Item Patch 거부
- 삭제된 Item Style은 적용 전에 제거 또는 Warning
- Template Identity가 변경되면 Variant 적용 차단

### 14.3 현재 Layout 범위

- `xPct`: 0~100
- `yPx`: 0~1200
- `fontSize`: 10~80
- `fontWeight`: 400, 500, 700, 800
- `textAlign`: left, center, right
- `minHeight`: 50~1200
- `positionMode`: auto, free

### 14.4 추가 Geometry 검증

- Item Bounding Box가 Section 안에 존재
- Item 간 겹침 없음
- CTA가 다른 필수 Item을 가리지 않음
- Section 최소 높이가 모든 Item을 포함
- 텍스트가 콘텐츠 폭을 초과하지 않음
- 이미지와 Text Safe Area가 충돌하지 않음
- 자유 배치 Item의 Reading Order가 DOM 순서와 크게 어긋나지 않음

### 14.5 반응형 검증

- Desktop 좌표를 Mobile에 그대로 재사용하지 않음
- Mobile은 기본적으로 단일 Column Stack
- Title/CTA 최소 가독 크기 유지
- 가로 Scroll 없음
- Touch Target 최소 크기 준수
- 200% Zoom에서 핵심 콘텐츠 손실 없음

### 14.6 접근성 검증

- 텍스트 대비
- CTA 대비와 Focus 표시
- Heading 순서
- 이미지 Alt
- 색상만으로 Variant/오류 상태 구분 금지
- 생성 상태 `aria-live`
- 변경 적용 결과를 Screen Reader에 요약
- Keyboard로 Variant 선택·적용·원복 가능

### 14.7 Vision QA

P2에서 실제 Renderer Screenshot을 Vision Model로 확인한다.

Vision QA 대상:

- 겹침
- 잘림
- 비정상 여백
- 시각적 무게 불균형
- 지나치게 작은 텍스트
- CTA 가시성
- 이미지 위 텍스트 가독성

Vision Model은 직접 DOM을 수정하지 않는다. 문제 목록과 제한된 Patch 제안만 반환한다. 결정적 Validator를 통과한 Patch만 사용자에게 노출한다.

## 15. UI 상태 정의

### 15.1 AI 콘텐츠

| 상태 | UI |
|---|---|
| idle | `AI 콘텐츠 작성` |
| queued | `요청 접수됨` |
| running | Spinner + `콘텐츠 작성 중` |
| ready | Diff 목록 + 적용 버튼 |
| partially_valid | 유효 Patch만 선택 가능, 경고 표시 |
| failed | 오류 요약 + 재시도 |
| applied | 적용 개수와 Undo 제공 |

### 15.2 AI Layout

| 상태 | UI |
|---|---|
| idle | `AI 레이아웃 구성` |
| queued | 요청 접수 상태 |
| running | Variant별 생성/검증 진행률 |
| ready | 3개 실제 Renderer Preview |
| failed_partial | 정상 Variant만 표시, 실패 개수 안내 |
| failed_all | 기존 Layout 유지 + 재시도 |
| applied | 적용 Variant 표시 + Undo |
| stale | Template/Admin Revision 변경 안내, 적용 차단 |

### 15.3 중복 요청

- 동일 `input_hash`로 실행 중인 요청이 있으면 중복 Queue를 만들지 않는다.
- 사용자가 콘텐츠를 변경하면 기존 Variant를 `stale`로 표시한다.
- Stale Variant는 재검증 전 Step 4에 사용할 수 없다.

## 16. 오류와 Fallback

| 오류 | 처리 |
|---|---|
| Provider Timeout | 기존 화면 유지, 재시도 제공 |
| JSON Schema 실패 | 1회 Repair 후 실패 처리 |
| Template Revision 변경 | 결과 적용 차단, 재생성 안내 |
| 일부 Variant 실패 | 정상 Variant만 표시 |
| 모든 Variant 실패 | Admin 기본 Layout 유지 |
| Vision QA 실패 | 결정적 검증 통과 시 경고와 함께 표시 가능 |
| 저장 실패 | 화면 상태 유지, 적용 미확정 표시 |
| 네트워크 단절 | Polling 재개 가능 상태 저장 |
| 비용 제한 초과 | 생성 차단, 수동 편집 경로 유지 |

AI 실패가 콘텐츠 입력이나 수동 Layout 편집을 차단하면 안 된다.

## 17. 보안·개인정보·비용

### 17.1 보안

- 자유 CSS/HTML/Vue 출력 금지
- 외부 Script/Import 금지
- 허용 URL Scheme 검증
- Prompt Injection성 사용자 입력은 데이터로만 전달
- Worker Callback 서명 검증
- Run/Variant 소유권 검증
- Admin AI API는 Admin 권한 필요

### 17.2 개인정보

Prompt 전송 전 다음을 마스킹한다.

- 이메일과 전화번호
- 계정 ID와 내부 식별자
- Cookie, Token, Secret
- 내부 전용 URL Query
- 사용자 자유 입력에 포함된 개인정보

원문 Prompt와 응답을 무제한 장기 저장하지 않는다. 운영 보존 기간을 별도 환경 설정으로 둔다.

### 17.3 비용

- 기본 Variant 수 3개
- 한 Run의 재생성 횟수 제한
- 동일 Input Hash 결과 재사용 정책
- Layout Intent에는 Text Model 사용
- Vision QA는 최종 후보에만 수행
- 이미지 생성은 사용자가 명시적으로 요청할 때만 수행
- Admin에서 Provider별 예산과 Timeout 설정

## 18. 로그와 관측성

### 18.1 필수 로그

- Request/Generation/Variant ID
- Run ID와 Session ID
- Template Identity
- Prompt/Model Version
- Input Hash
- Queue/Start/Complete 시간
- Token/비용/Latency
- Validator 결과
- Vision QA 결과
- 사용자 적용·거절·재생성·Undo
- 오류 코드

### 18.2 권장 이벤트

- `ai_content_requested`
- `ai_content_ready`
- `ai_content_failed`
- `ai_content_patch_applied`
- `ai_content_patch_rejected`
- `ai_layout_requested`
- `ai_layout_variant_ready`
- `ai_layout_variant_failed`
- `ai_layout_variant_applied`
- `ai_layout_variant_rejected`
- `ai_layout_variant_undone`
- `ai_layout_stale`
- `ai_layout_validation_failed`

기존 `wizard_layout_usage_events`의 허용 Event 목록을 확장하거나 AI 전용 Event Table을 만든다. AI Payload 원문을 사용 로그에 그대로 저장하지 않는다.

## 19. 구현 단계

### Phase 0 — 계약 정비와 Feature Flag

목표:

- AI 결과가 들어올 수 있는 안정된 계약과 비활성 기본 상태를 만든다.

작업:

1. Design Spec v2 Schema 정의
2. `layout-utils.mjs` Validator 강화
3. breakpoint override 계약 추가
4. Content Patch Schema 추가
5. Layout Intent Schema 추가
6. Feature Flag 추가
   - `createPromoAiContentEnabled`
   - `createPromoAiLayoutEnabled`
   - `adminAiLayoutEnabled`
7. 기존 contractVersion 1 Migration/Normalizer 작성

완료 기준:

- AI 기능이 꺼진 상태에서 기존 Create Promo가 동일하게 동작한다.
- v1 Layout을 v2로 정규화해도 렌더링 회귀가 없다.
- 알 수 없는 속성과 잘못된 참조가 자동 테스트에서 거부된다.

### Phase 1 — AI 콘텐츠 Draft

작업:

1. 개요 입력 확장
2. Prompt Type과 Worker 설정 추가
3. AI 콘텐츠 API/DB 추가
4. Patch 생성·검증
5. Diff UI와 선택 적용
6. 필드별 AI 작성 메뉴
7. 적용·Undo·로그

완료 기준:

- 빈 필드 모드가 기존 값을 덮어쓰지 않는다.
- 잠금 Item은 변경되지 않는다.
- 잘못된 Path와 Field Kind가 거부된다.
- 적용 후 Section 완료 아이콘과 Preview가 즉시 갱신된다.

### Phase 2 — AI Layout Variant P1

작업:

1. Layout Intent Worker
2. Layout Compiler
3. Geometry Validator
4. Layout Generation/Variant DB와 API
5. Variant 3개 실제 Renderer Preview
6. Desktop/Mobile 비교
7. 선택·적용·Undo
8. Template Revision Stale 처리
9. Step 1·2 Appearance Guard

완료 기준:

- 세 Variant가 동일 Template/Content Snapshot을 사용한다.
- 각 Variant는 실제 DOM으로 렌더링된다.
- AI가 Step 1·2 값을 변경할 수 없다.
- 충돌·Overflow·잘못된 참조가 있는 Variant는 표시되지 않는다.
- 적용 후 사용자가 Visual Editor에서 수정할 수 있다.

### Phase 3 — AI 이미지와 Vision QA

작업:

1. Image Item AI Source 실행 API
2. Prompt 개선
3. Asset Registry 저장
4. 이미지 후보 선택·적용·재생성
5. Alt 초안
6. Desktop/Mobile Screenshot QA
7. QA Patch 제안

완료 기준:

- 이미지는 허용된 Item에서만 생성된다.
- 법적 고지나 CTA 텍스트를 이미지에만 넣지 않는다.
- Asset와 Prompt/Model Snapshot이 연결된다.

### Phase 4 — Admin AI 기본 Layout Draft

작업:

1. Admin 전용 권한과 API
2. Draft Template만 대상
3. 후보 3개 Preview
4. Admin Layout Editor 적용
5. 변경 사유와 History
6. 활성화 전 검증

완료 기준:

- Active Template 직접 수정이 불가능하다.
- AI 결과는 Draft에만 저장된다.
- 관리자 명시적 활성화 전 Create Promo에 반영되지 않는다.

### Phase 5 — Eval과 운영 최적화

작업:

1. Golden Set 5~10개
2. Provider/Model/Prompt별 결과 비교
3. Layout 다양성 지표
4. 성공·적용·Undo율
5. 비용/Latency Dashboard
6. 자동 회귀 Screenshot Test

## 20. 예상 코드 변경 위치

### Frontend

- `prototype/create-promo.js`
  - AI 요청과 Polling
  - 실행 Snapshot
  - Stale 판정
  - 적용·Undo
- `prototype/create-promo.css`
  - AI 상태, Diff, Variant Gallery
- `visual-editor/src/App.vue`
  - AI 버튼과 Variant 선택 UI
  - 적용 결과와 접근성 상태
- `visual-editor/src/PromoPageRenderer.vue`
  - breakpoint override 적용
  - Geometry 측정 Hook
- `visual-editor/src/contracts.js`
  - Design Spec v2
- `visual-editor/src/layout-utils.mjs`
  - 엄격한 Schema/Reference 검증
- 신규 `visual-editor/src/layout-intent-contract.mjs`
- 신규 `visual-editor/src/layout-compiler.mjs`
- 신규 `visual-editor/src/layout-geometry-validator.mjs`

### API

- 신규 `api/create-promo-ai-content-drafts.js`
- 신규 `api/create-promo-ai-layout-variants.js`
- 신규 `api/create-promo-ai-layout-variant-apply.js`
- 신규 또는 확장 `api/_prompt-execution-snapshot.js`
- 확장 `api/wizard-layout-usage-events.js`
- 재사용 `api/wizard-form-template-public.js`

### DB

- 신규 Migration 024
- Prompt Type/Model 설정 Seed
- AI Attempt/Variant/Event Index

### Tests

- 신규 `scripts/test-create-promo-ai-content-contract.js`
- 신규 `scripts/test-create-promo-ai-layout-contract.js`
- 신규 `scripts/test-layout-intent-compiler.mjs`
- 신규 `scripts/test-layout-geometry-validator.mjs`
- 확장 `scripts/test-create-promo-clone-contract.js`
- 확장 `scripts/test-create-promo-layout-cache.js`
- 확장 `scripts/test-visual-editor-contract.js`
- 확장 `scripts/test-visual-editor-behavior.mjs`

## 21. 테스트 계획

### 21.1 Unit

- Content Patch Path/Type 검증
- 잠금/숨김 Item 거부
- Layout Intent Enum/참조 검증
- Font/Position/Height 범위
- v1 → v2 정규화
- Appearance Guard
- Layout Compiler Token 변환
- Geometry 충돌/경계
- Mobile Stack
- Diff/Undo

### 21.2 API Contract

- 인증과 Run 소유권
- Idempotency/Input Hash
- Queue/Running/Ready/Failed 상태
- Template Identity 충돌
- Callback 서명
- Structured Output 실패
- Partial Variant 성공
- Apply 재검증

### 21.3 Integration

1. Create Promo Step 3 진입
2. AI 콘텐츠 생성
3. 일부 Patch 적용
4. AI Layout 3개 생성
5. Desktop/Mobile 확인
6. 한 Variant 적용
7. Visual Editor 수동 수정
8. 관리자 Layout Revision 변경 감지
9. Stale 처리와 재생성
10. Step 4 Snapshot 생성

### 21.4 E2E 시나리오

#### 정상

- 신규 고객 이벤트 + Default Template + 3개 Variant
- 수동 콘텐츠가 있는 상태의 빈 필드 생성
- Conversion Variant 적용 후 수동 Title 이동
- Mobile Stack 정상

#### 오류

- AI Timeout
- 잘못된 JSON
- 존재하지 않는 Item Key
- Item 충돌
- Template 비활성화
- Layout Revision 변경
- 네트워크 단절 후 Polling 재개

#### 회귀

- AI Feature Flag OFF
- Step 1 배경 유지
- Step 2 CTA 유지
- Admin 변경 확인/적용/유지 UX
- 기존 기본 자동등록
- Light/Dark Shell
- Promo Wizard 상태와 Create Promo Storage 분리

### 21.5 접근성

- Keyboard-only Variant 선택
- Screen Reader 생성 상태
- Diff 읽기 순서
- Focus 복원
- 색상 외 상태 표시
- 200% Zoom
- Mobile Reflow

## 22. 최종 수용 기준

### P0 계약

- [ ] Design Spec v2가 문서와 코드에서 일치한다.
- [ ] 알 수 없는 속성과 잘못된 Section/Item 참조를 거부한다.
- [ ] Step 1·2 Appearance Guard가 테스트로 고정된다.
- [ ] Feature Flag OFF에서 기존 동작이 유지된다.

### AI 콘텐츠

- [ ] AI가 Patch만 반환한다.
- [ ] 빈 항목 모드가 사용자 값을 덮어쓰지 않는다.
- [ ] 잠금 Item이 변경되지 않는다.
- [ ] 사용자가 변경 전/후를 보고 선택 적용할 수 있다.
- [ ] 적용·거절·Undo가 기록된다.

### AI Layout

- [ ] 기본 3개 Variant가 생성된다.
- [ ] Variant는 이미지가 아닌 실제 Vue Renderer로 표시된다.
- [ ] Desktop/Mobile 검증이 존재한다.
- [ ] 충돌·Overflow·범위 오류 Variant가 차단된다.
- [ ] 사용자가 적용 후 수동으로 수정할 수 있다.
- [ ] Admin Template에 자동 역반영되지 않는다.

### Admin AI

- [ ] Draft Template에서만 실행된다.
- [ ] 관리자 승인 전 저장·활성화되지 않는다.
- [ ] 기존 Layout History와 Change Note가 유지된다.

## 23. 배포와 Rollback

### 23.1 배포 순서

1. Schema/DB/API를 비활성 Feature Flag로 배포
2. 내부 Fixture에서 AI 응답 Mock 검증
3. 개발 환경 실제 Provider 검증
4. 내부 사용자 10% 활성화
5. 비용·오류·Undo율 관찰
6. Create Promo AI 콘텐츠 확대
7. Layout Variant 확대
8. Admin AI는 별도 Rollout

### 23.2 Rollback

- Feature Flag를 즉시 OFF
- 기존 Admin 기본 Layout과 수동 편집 경로 유지
- AI Variant Row는 감사 목적으로 보존하되 적용 차단
- 적용된 실행 Snapshot은 해당 Run에 고정
- Active Admin Template에는 Rollback 영향 없음

## 24. 미확정 사항과 권장 기본값

| 항목 | 권장 기본값 |
|---|---|
| Layout Variant 수 | 3개 |
| 콘텐츠 기본 모드 | 빈 필드만 작성 |
| Layout 출력 | Layout Intent + 서버 Compiler |
| 전체 Vue 코드 생성 | 이번 범위 제외 |
| Vision QA | P2, 최종 후보만 |
| Admin AI | P3, Draft 전용 |
| 저장 | Run 단위 DB + Snapshot |
| Mobile | 단일 Stack Fallback 우선 |
| Repair Prompt | 최대 1회 |
| 동일 입력 재사용 | Input Hash 기준 허용 |
| AI 실패 시 | 기존 Layout과 수동 편집 유지 |

추가 결정이 필요한 항목:

1. Content Patch와 Layout Variant Worker를 n8n으로 실행할지 Vercel Function에서 직접 실행할지
2. Design MD 검색을 DB Query로 시작할지 Vector Search를 추가할지
3. Run 생성 시점을 Step 3 진입으로 앞당길지 AI 요청 시 생성할지
4. Provider별 Structured Output 지원 차이를 어떻게 추상화할지
5. Vision QA의 운영 Viewport와 비용 상한
6. Admin AI Layout을 별도 Prompt Type으로 완전히 분리할지

권장안:

- 기존 Worker/Prompt Snapshot 패턴과 운영 관측성을 재사용하기 위해 비동기 Worker 방식을 사용한다.
- Layout Intent 생성은 Text Model, 이미지 생성은 Image Model, Vision QA는 후보 선택 후 실행한다.
- AI 요청 시 Run이 없으면 서버가 Run을 생성하거나 기존 Draft Run을 재사용한다.

## 25. 후속 LLM 작업 순서

다른 LLM이 이 문서를 받아 개발을 시작할 때 다음 순서를 바꾸지 않는다.

1. 이 문서와 선행 문서의 데이터 소유권을 확인한다.
2. 현재 `contracts.js`, `layout-utils.mjs`, `PromoPageRenderer.vue`를 실제로 읽는다.
3. Design Spec v2와 Layout Intent JSON Schema부터 작성한다.
4. Schema/Compiler/Validator Unit Test를 먼저 작성한다.
5. Feature Flag를 추가한다.
6. AI Provider 없이 Fixture 응답으로 UI와 Apply/Undo를 구현한다.
7. API/DB/Prompt Snapshot을 구현한다.
8. 실제 Worker를 연결한다.
9. Desktop/Mobile E2E를 수행한다.
10. Step 1·2와 Admin Layout Sync 회귀를 확인한다.
11. 운영 Smoke Test 전까지 Admin AI 기능을 활성화하지 않는다.

## 26. 최종 요약

현재 Create Promo와 Visual Editor에는 AI Layout을 적용할 수 있는 기반이 이미 있다. 실제 Renderer가 `fontSize`, `fontWeight`, `textAlign`, Item 자유 위치와 Section 높이를 처리하고, Admin 기본 Layout과 Create Promo 실행별 변경을 분리한다.

부족한 것은 AI 모델 자체보다 다음 계약과 운영 장치다.

- AI 콘텐츠 Patch 계약
- Layout Intent와 Layout Compiler
- Design Spec v2
- 엄격한 Reference/Geometry/Responsive Validator
- 실제 Renderer 기반 Variant 비교
- 사용자 승인·Undo·Stale 처리
- Prompt/Model/결과 Snapshot과 Eval

따라서 첫 구현은 자유로운 Vue 코드 생성이 아니라 `AI 콘텐츠 Patch + 제한된 Layout Variant`여야 한다. 이 구조가 안정화된 뒤 이미지 AI, Vision QA와 Admin AI 기본 Layout Draft로 확장한다.

> 최종 원칙: AI는 디자인을 제안하고, 코드는 안전성을 검증하며, 사용자가 결과를 선택하고, Admin 활성 템플릿은 관리자가 통제한다.
