# Promo Builder AI 자산 생성 및 Section Layout Preset 개선 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-30
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 전 계획 / 소스코드 미반영
- 우선순위: P0~P5
- 대상 기능:
  - Promo Builder AI 생성 후 키비주얼·컴포넌트 이미지 생성
  - Section Preset의 레이아웃 구성·저장·활성화·재사용
  - Header·Footer 등 정형 Section의 Desktop/Mobile 기본 배치
- 관련 문서:
  - `docs/계획/ai-page-section-composition-engine-development-plan-2026-07-29.md`
  - `docs/계획/visual-editor-three-mode-unification-development-plan-2026-07-30.md`
  - `docs/계획/admin-llm-prompt-hardcoding-remediation-development-plan-2026-07-29.md`

### 0.1 작성 배경

2026-07-30 Production 검증에서 다음 두 문제가 확인됐다.

1. Promo Builder에서 AI 프로모션 구성을 생성해도 Section 키비주얼이 생성되지 않는다.
2. Section Preset은 Component 구성과 정책만 관리하며, Logo·Badge 등의 위치와 크기를 포함한 실제 레이아웃을 저장할 수 없다.

첫 번째 문제는 현재 운영 기능의 장애이며 즉시 복구가 필요한 P0 항목이다.

두 번째 문제는 Header, Footer, Legal과 같은 정형 Section을 안정적으로 재사용하기 위한 구조적 결손이다. 현재 상태에서는 Section을 생성할 때 Component는 복제되지만 배치 정보가 따라오지 않아 Renderer의 일반 자동 배치 또는 AI의 추상적인 `layoutVariant` 선택에 의존한다.

### 0.2 개발 원칙

1. 기존 Builder Document, Template, Section 및 Component 데이터를 초기화하지 않는다.
2. AI 페이지 구성 성공과 이미지 자산 생성 성공을 별도 상태로 관리한다.
3. 프롬프트 미해결 변수 검증은 제거하지 않고 실행 경로의 변수 계약을 일치시킨다.
4. Section Definition, Section Layout Preset 및 Page Template Layout의 책임을 분리한다.
5. 레이아웃은 자유 HTML/CSS가 아니라 검증 가능한 구조화 Snapshot으로 저장한다.
6. 기존 `PromoPageRenderer`와 공통 Editor Core를 재사용한다.
7. Section Draft 활성화 전에 Layout Preset과 Component 참조 무결성을 검증한다.
8. 기존 활성 Section에는 안전한 기본 Layout을 backfill하고 즉시 동작을 변경하지 않는다.

### 0.3 2026-07-30 재검토 보정 기록

계획서를 현재 소스와 다시 대조한 결과 다음 내용을 보정했다.

1. `brandPalette`만 개별 보완하면 이후 다른 선택 변수가 Prompt에 추가될 때 같은 장애가 반복될 수 있다. `createPromptExecutionSnapshot()`에서 활성 Prompt가 선언한 선택 변수를 빈 값으로 완성하는 공통 안전장치를 P0에 포함한다.
2. AI Builder의 최초 Composition뿐 아니라 AI Document Visual Editor의 직접 자산 재생성도 `assetWarning`을 처리해야 한다. 실패 상태에서 성공 안내를 표시하거나 불필요한 Polling을 시작하지 않도록 범위를 확장한다.
3. Component Definition과 Section Component Instance가 이미 `defaultValue`와 `lockedValue`를 소유한다. 별도 `default_content_snapshot`은 콘텐츠 소유권을 중복시키므로 초기 Layout Preset 데이터 모델에서 제외한다.
4. 현재 Renderer와 Command Engine은 `positionMode: "free"` Geometry를 직접 지원하지만 `anchored` 배치는 지원하지 않는다. P1~P3의 필수 계약은 기존 Geometry와 Desktop/Mobile Override로 한정하고, Anchor Resolver는 Header 안정화 단계인 P4에서 도입한다.
5. Public Section 목록에 전체 Layout Snapshot을 항상 포함하면 응답 크기가 증가한다. 목록에는 Layout 요약과 기본 Key만 반환하고, 사용자가 Preset Section을 생성할 때 상세 Snapshot을 지연 조회한다.

## 1. 실행 요약

### 1.1 P0 운영 장애 복구

현재 활성 `section_background_image` 프롬프트가 `{{brandPalette}}`를 사용하지만 Promo Builder 자산 등록 경로가 해당 변수를 전달하지 않는다.

이 때문에 Composition Revision은 정상 저장되지만 Asset Job 등록이 실패한다.

```text
AI Composition 적용 성공
→ 키비주얼 Asset Request 생성
→ Prompt Snapshot 생성
→ brandPalette 미해결
→ Asset Job 등록 실패
→ 구성 화면은 열리지만 키비주얼 없음
```

P0에서는 다음을 수행한다.

- 모든 이미지 실행 경로가 동일한 Prompt Variable Builder를 사용하도록 통합
- 활성 Prompt가 선언한 선택 변수를 실행 직전에 빈 값으로 완성하는 공통 안전장치 추가
- 디자인 토큰에서 `brandPalette`를 생성하고 값이 없을 때도 명시적으로 빈 값을 전달
- 부분 성공 상태와 경고를 Visual Editor까지 유지
- 기존 미등록 `pending` Asset Request를 재등록할 수 있는 복구 API 제공
- 실제 활성 Prompt Template을 사용한 통합 테스트 추가

### 1.2 Section Layout Preset 도입

현재 Section Preset을 다음 세 계층으로 명확히 분리한다.

```text
Section Definition
  ├─ 역할·정책
  ├─ Component 구성
  └─ AI 허용 정책

Section Layout Preset
  ├─ Section 크기·배경
  ├─ Component 위치·크기·정렬
  ├─ 표시 여부
  ├─ Desktop/Mobile 배치
  └─ 기본/잠금 정책

Page Template Layout
  ├─ Page의 Section 구성
  ├─ Section 순서
  └─ Template별 Override
```

관리자는 Section Draft에서 Layout Preset을 작성하고, Section 활성화 시 함께 배포한다. Promo Builder가 Section을 생성하면 선택된 Layout Preset을 신규 Section·Component Instance ID에 맞게 변환해 적용한다.

## 2. 현재 상태와 확인된 이슈

## 2.1 AI 키비주얼 생성 장애

### 2.1.1 Production 확인 결과

- 확인 일시: 2026-07-30 19:15 KST 전후
- 대상 배포:
  - Production
  - Commit `24d774c1a80c22eb19a64c4c2b52afefadf8b63a`
  - Vercel 상태 `READY`
- 확인 Route:
  - `POST /api/promo-page-composition-operations`
- HTTP 결과:
  - `200`
- Runtime 오류:

```text
Builder composition applied but asset enqueue failed
Rendered section_background_image prompt contains unresolved variables: brandPalette
```

### 2.1.2 직접 원인

`api/_promo-builder-assets.js`의 Section Background Prompt 변수에는 다음 값이 포함된다.

- `sectionName`
- `contentJson`
- `backgroundColor`
- `fadeMode`
- `adminGuidance`
- `aspectRatio`

그러나 활성 Prompt Template에서 사용할 수 있는 선택 변수 `brandPalette`는 전달하지 않는다.

반면 기존 `api/promo-section-design-runs.js` 경로는 다음과 같이 `brandPalette`를 전달한다.

```js
brandPalette: promptVariable(body.brandPalette)
```

Prompt Renderer는 전달되지 않은 Placeholder를 의도적으로 남기며, 실행 직전 `unresolvedVariables()` 검증이 이를 차단한다.

따라서 이미지 Provider 호출이나 Worker 실행 전에 Asset Job 등록이 중단된다.

### 2.1.3 부가 원인

자산 등록 실패는 `enqueueAndScheduleBuilderAssetJobs()`에서 예외가 흡수되어 다음 경고로 변환된다.

```text
ASSET_ENQUEUE_FAILED
```

그러나 Composition API 자체는 `200`과 정상 Revision을 반환한다. AI Builder는 경고를 Store에 기록한 직후 Visual Editor로 이동하므로 사용자가 경고를 확인하기 어렵다.

현재 사용자에게 보이는 결과는 다음과 같다.

```text
프로모션 구성 성공
+ Visual Editor 진입 성공
+ 오류 화면 없음
- 키비주얼 없음
- 이미지 생성 진행 상태 없음
- 재시도 필요 여부를 알 수 없음
```

### 2.1.4 테스트 공백

현재 Asset Enqueue 계약 테스트는 다음만 검증한다.

- Enqueue 성공 시 Schedule 호출
- Enqueue 실패 시 `ASSET_ENQUEUE_FAILED` 반환

실제 활성 Prompt Template의 Placeholder와 Builder가 제공하는 변수가 완전히 일치하는지는 검증하지 않는다.

그 결과 `brandPalette` 누락 상태에서도 전체 계약 테스트가 통과할 수 있다.

## 2.2 Section Layout Preset 결손

### 2.2.1 현재 저장 범위

`wizard_content_sections`와 하위 Component Instance는 다음 정보를 관리한다.

- Section 이름·설명·버전·상태
- Section Role과 Composition Policy
- Component Definition Version
- Component 순서와 필수·잠금 여부
- AI 디자인 허용 정책

현재 저장하지 않는 정보는 다음과 같다.

- Section 높이와 배경 스타일
- Component X/Y 위치
- Component 너비·높이
- Logo·Badge 등의 정렬 의도
- Desktop/Mobile별 배치
- z-index와 겹침 정책
- Layout Variant별 실제 Geometry
- Layout Preset 기본값

### 2.2.2 생성 시 동작

`createSectionInstanceFromPreset()`은 Section과 Component를 복제하며 신규 Key를 발급한다.

```text
preset.sectionKey → 신규 sectionKey
preset.itemKey    → 신규 itemKey
```

하지만 Preset에 Layout Snapshot이 없고, 기존 Item Style Key를 신규 Key로 변환하는 처리도 없다.

AI Composition도 `layoutVariant` 문자열과 기본 디자인 토큰 스타일만 생성한다. Component의 실제 Geometry는 생성하지 않는다.

레이아웃이 없으면 Renderer는 Component 순서에 따른 기본 자동 위치를 사용한다.

### 2.2.3 Header 사례

Header Preset이 다음 Component를 가진다고 가정한다.

```text
Header
├─ Logo
├─ Badge
├─ Navigation
└─ CTA
```

현재 저장 가능한 것은 구성과 순서다.

다음 배치 의도는 저장할 수 없다.

```text
Desktop
- Logo: 왼쪽 중앙
- Navigation: 중앙
- Badge: 오른쪽 중앙
- CTA: Badge 오른쪽

Mobile
- Logo: 왼쪽 중앙
- Badge: 오른쪽 중앙
- Navigation: 숨김
- CTA: 메뉴 내부 또는 숨김
```

따라서 동일 Header Preset을 사용해도 생성 결과가 일관되지 않으며, AI 또는 사용자가 매번 재배치해야 한다.

### 2.2.4 용어 문제

현재 UI의 “Section Preset”은 실제로는 다음 역할을 동시에 표현한다.

- 재사용 가능한 Section Definition
- Component 묶음
- AI Composition 후보

하지만 실제 Layout Preset 역할은 수행하지 않는다.

이번 개발에서는 다음 용어를 사용한다.

| 용어 | 의미 |
|---|---|
| Section Definition | Section 정책과 Component 구성 |
| Section Layout Preset | 특정 Section Definition의 시각적 배치 |
| Section Instance | 실제 Promo Document에 생성된 Section |
| Page Template Layout | Page 전체 Section 구성과 순서 |

## 3. 개발 목표

### 3.1 AI 자산 목표

- AI Composition 직후 대상 키비주얼과 Component 이미지 Job이 모두 등록된다.
- 활성 Prompt Template에 선언된 모든 변수가 실행 경로에서 해소된다.
- Composition 성공과 Asset 실패가 사용자에게 구분되어 표시된다.
- 실패한 Asset Request를 문서 Revision 손실 없이 재시도할 수 있다.
- 동일 Request의 중복 Worker 실행을 방지한다.

### 3.2 Section Layout Preset 목표

- 관리자가 Section Draft의 Layout Preset을 생성·편집·저장할 수 있다.
- 한 Section Definition에 여러 Layout Preset을 등록할 수 있다.
- 하나의 기본 Layout Preset을 지정할 수 있다.
- Desktop과 Mobile 배치를 모두 저장할 수 있다.
- Header의 Logo·Badge 위치와 표시 정책을 미리 구성할 수 있다.
- Section Instance 생성 시 Preset Layout이 신규 ID에 맞게 적용된다.
- AI는 허용된 실제 Layout Preset만 선택할 수 있다.
- Preview와 Web Output이 같은 결과를 렌더링한다.

## 4. 범위와 비범위

### 4.1 포함 범위

- Builder Asset Prompt Variable 계약 통합
- `brandPalette` 계산과 전달
- Asset 부분 성공 상태
- 실패 Asset Request 재등록
- Section Layout Preset DB 모델
- Section 단위 Visual Editor 모드
- Desktop/Mobile Layout Snapshot
- Preset Layout Instance 변환
- Section 활성화 Validator
- AI Composition Candidate 및 Snapshot 반영
- 회귀·통합·Browser 테스트

### 4.2 이번 개발에서 제외

- AI가 자유 HTML 또는 CSS를 생성하는 기능
- Admin Layout에서 키비주얼을 직접 생성하는 기능
- Tablet 전용 세 번째 Breakpoint
- 자유로운 Component 무한 중첩
- Layout Preset과 무관한 Page 게시 승인 기능
- 기존 모든 Section을 수작업으로 재디자인하는 작업

## 5. AI 자산 생성 개선 설계

## 5.1 Prompt Variable Builder 통합

이미지 Prompt 변수를 각 Route에서 직접 조립하지 않고 공통 함수로 이동한다.

권장 모듈:

```text
api/_section-image-prompt-variables.js
```

권장 인터페이스:

```js
buildSectionImagePromptVariables({
  promptType,
  section,
  component,
  field,
  sectionContent,
  designSpec,
  designTokenValues,
  request,
});
```

Section Background 결과에는 항상 다음 Key가 존재해야 한다.

```json
{
  "sectionName": "",
  "contentJson": "{}",
  "backgroundColor": "#000000",
  "fadeMode": "none",
  "adminGuidance": "",
  "brandPalette": "",
  "aspectRatio": "16:9"
}
```

선택 변수가 비어 있어도 Key 자체는 전달한다. 이를 통해 활성 Prompt가 해당 Placeholder를 사용할 때 미해결 상태가 발생하지 않게 한다.

## 5.2 Brand Palette 생성 규칙

`brandPalette`는 자유 텍스트 입력보다 현재 선택된 디자인 토큰에서 생성하는 것을 권장한다.

우선순위:

1. Builder Snapshot의 `content.formTemplate.designTokens.values`
2. 선택된 Design Token Version의 Runtime Values
3. `designSpec.theme`
4. 빈 문자열

포함 후보:

- `--app-bg`
- `--app-surface`
- `--app-ink`
- `--app-accent`
- `--app-cta-background`
- `--promo-*` 중 색상 Token

예시:

```text
Background #0B0D12
Surface #151923
Text #F6F7FB
Accent #FFB800
CTA #FFB800
```

Token의 원본 의미를 유지하고 임의 색상을 생성하지 않는다.

## 5.3 엄격한 Prompt 검증 유지

다음 검증은 그대로 유지한다.

- Prompt에 선언되지 않은 Placeholder 차단
- 필수 변수 누락 차단
- 실행 후 남아 있는 Placeholder 차단
- 배경색·Fade Mode·Aspect Ratio 값 검증

수정 방향은 검증을 느슨하게 하는 것이 아니라 모든 실행 경로가 같은 Variable Builder를 사용하도록 만드는 것이다.

## 5.4 부분 성공 상태

Composition API 응답에 명시적인 결과 상태를 추가한다.

```json
{
  "compositionStatus": "applied",
  "assetStatus": "enqueue_failed",
  "assetJobs": [],
  "assetWarning": {
    "code": "ASSET_ENQUEUE_FAILED",
    "retryable": true,
    "message": "..."
  }
}
```

권장 상태:

| 상태 | 의미 |
|---|---|
| `not_requested` | 생성 대상 없음 |
| `pending` | Request 생성됨 |
| `enqueued` | Job 등록됨 |
| `processing` | Worker 처리 중 |
| `ready` | 결과 적용 가능 |
| `failed` | Worker 실패 |
| `enqueue_failed` | Job 등록 전 실패 |

## 5.5 사용자 경고 유지

`assetWarning`이 존재할 때 AI Builder가 즉시 Visual Editor로 이동하면 안 된다.

권장 동작:

```text
Composition 적용
→ Asset 등록 결과 확인
  ├─ 정상: Visual Editor 자동 이동
  └─ 실패: 경고 표시
       ├─ 이미지 생성 다시 시도
       └─ 이미지 없이 편집 계속
```

Visual Editor로 이동한 경우에도 Builder Document의 Asset Request 상태를 조회해 상단 상태 영역에 표시한다.

## 5.6 기존 실패 문서 복구

Composition Revision은 이미 저장됐지만 Asset Job이 없는 문서가 존재할 수 있다.

복구 대상 조건:

```text
assets.requests[].status = pending
AND 대응 promo_section_design_runs 없음
```

권장 API:

```text
POST /api/promo-builder-assets-retry
```

요청:

```json
{
  "documentId": "uuid",
  "documentRevision": 2,
  "assetRequestIds": ["uuid"]
}
```

필수 정책:

- 현재 Revision 일치 확인
- 요청 대상이 해당 문서에 포함되는지 확인
- 기존 Run/Job이 있으면 중복 생성하지 않음
- 기존 Unique Index를 이용한 Idempotency 유지
- 성공 Job만 Schedule
- 실패 Request별 오류 반환

자동 복구는 초기에는 사용하지 않는다. 명시적 사용자 재시도와 운영 복구 도구를 먼저 제공하고 안정화 후 자동 재등록을 검토한다.

## 6. Section Layout Preset 데이터 설계

## 6.1 권장 모델

Section Layout은 `wizard_content_sections`의 단일 JSON Column으로 넣지 않고 Section Version의 하위 리소스로 관리한다.

권장 Table:

```text
wizard_content_section_layouts
```

권장 Column:

| Column | 용도 |
|---|---|
| `id` | Layout Row ID |
| `section_id` | 대상 `wizard_content_sections.id` |
| `layout_key` | Section Version 안의 안정적인 Key |
| `name` | 관리자 표시 이름 |
| `description` | 사용 목적 |
| `is_default` | 기본 Layout 여부 |
| `layout_snapshot` | Section/Component 배치 |
| `change_note` | 변경 이유 |
| `created_at`, `updated_at` | 감사 정보 |

Constraint:

```text
unique(section_id, layout_key)
한 section_id당 is_default = true는 최대 1개
```

Layout의 생명주기는 부모 Section Version을 따른다.

- Section Draft 생성 시 기존 Layout Row를 함께 복제
- Draft에서만 Layout 수정
- Section 활성화 시 Layout도 함께 활성 의미를 가짐
- 별도 Layout 활성화 상태를 두지 않아 Version 충돌을 줄임

## 6.2 Layout Snapshot 계약

권장 Contract:

```json
{
  "contractVersion": 1,
  "layoutMode": "free",
  "sectionStyle": {
    "minHeight": 88,
    "backgroundColor": "#0B0D12"
  },
  "viewports": {
    "desktop": {
      "items": {
        "logo": {
          "positionMode": "free",
          "xPct": 0,
          "yPx": 10,
          "widthPct": 18,
          "heightPx": 44,
          "zIndex": 2
        },
        "badge": {
          "positionMode": "free",
          "xPct": 86,
          "yPx": 16,
          "widthPct": 12,
          "heightPx": 32,
          "zIndex": 2
        }
      },
      "visibility": {
        "items": {
          "navigation": true
        }
      }
    },
    "mobile": {
      "items": {
        "logo": {
          "positionMode": "free",
          "xPct": 0,
          "yPx": 8,
          "widthPct": 34,
          "heightPx": 36
        },
        "badge": {
          "positionMode": "free",
          "xPct": 74,
          "yPx": 12,
          "widthPct": 24,
          "heightPx": 28
        }
      },
      "visibility": {
        "items": {
          "navigation": false
        }
      }
    }
  }
}
```

Snapshot Key는 DB Row ID가 아니라 Section Definition 안의 안정적인 `itemKey`를 사용한다.

## 6.3 Layout Mode

초기 Runtime은 현재 Editor와 Renderer가 이미 지원하는 `free` Geometry를 사용한다.

### Free — P1~P3 필수

- `xPct`, `yPx`, `widthPct`, `heightPx`
- 기존 Visual Editor Drag/Resize 결과와 직접 호환
- Desktop/Mobile Snapshot을 별도로 저장

### Anchored — 후속 확장 검토

- `start`, `center`, `end`
- `top`, `center`, `bottom`
- Header, Footer, Badge, Logo에 적합
- 반응형에서 의도가 유지됨

P4에서는 별도 Desktop/Mobile Free Geometry로 Header를 먼저 안정화한다. 현재 Renderer, 저장 Validator, Drag/Resize Engine이 같은 좌표 계약을 사용하므로 Preview/Web Output의 결정성이 높다. Anchor Resolver는 다양한 Header 폭과 동적 Navigation 요구가 확인된 후 Contract Version을 올려 도입한다.

## 6.4 Default Content 분리

Layout Snapshot과 콘텐츠를 혼합하지 않는다.

초기 데이터 모델에는 `default_content_snapshot`을 추가하지 않는다.

- Admin Preview는 Component Definition의 `defaultValue`를 사용한다.
- 고정 Logo URL과 Legal 문구는 기존 `lockedValue`를 사용한다.
- 빈 Section Instance의 초기값은 기존 `createSectionInputs()` 계약을 사용한다.
- Layout Preset은 시각적 배치와 표시 여부만 소유한다.

## 6.5 기존 `allowedLayoutVariants` 개선

현재 `split-left`, `split-right`, `centered-hero`는 실제 Layout Snapshot과 연결되지 않은 문자열이다.

개선 후에는 다음처럼 실제 `layout_key`를 참조한다.

```json
{
  "allowedLayoutVariants": [
    "standard-header",
    "compact-header"
  ]
}
```

AI Composition Candidate에는 Layout 이름뿐 아니라 다음 메타데이터를 제공한다.

- Layout Key
- 설명
- 지원 Viewport
- Section Role
- 필수·잠금 Component
- 미리보기 Thumbnail

AI는 Geometry를 직접 생성하지 않고 허용된 Layout Preset을 선택한다.

## 7. Admin UX 설계

## 7.1 진입 위치

기존 Admin의 콘텐츠 Section 상세에 다음 영역을 추가한다.

```text
콘텐츠 Section 상세
├─ 기본 정보
├─ AI 페이지 구성 정책
├─ AI 디자인 정책
├─ Section Component
└─ Layout Preset
```

Layout Preset 영역:

- Preset 목록
- 기본 Preset 표시
- 새 Preset 만들기
- 복제
- 편집
- 삭제
- 기본값 지정
- 마지막 수정 시각

## 7.2 Section Preset Editor

기존 Visual Editor를 다음 모드로 재사용한다.

```text
mode=section-preset
sectionId={draftSectionId}
layoutKey={layoutKey}
```

Workspace 구성:

```text
왼쪽
- Section Tree
- Component Library
- Layout Preset 목록

중앙
- 단일 Section Live Preview
- Desktop/Mobile 전환
- Drag/Resize

오른쪽
- Section 속성
- Component 위치·크기
- 정렬 및 Free Geometry
- 표시·잠금
- 초기화
```

허용 기능:

- Component 추가·삭제·순서 변경
- Component 위치·크기 변경
- Desktop/Mobile 표시 여부
- Section 높이·배경
- Free Geometry 편집
- Undo/Redo
- Draft 저장

제외 기능:

- 키비주얼 생성
- Promo Override 저장
- Page Section 순서 변경
- Web Output 게시

## 7.3 Header Preset 권장 정책

```json
{
  "compositionScope": "shared",
  "sectionRole": "header",
  "fixedPosition": "top",
  "compositionPolicy": {
    "selectionPolicy": "required",
    "layoutLocked": true,
    "duplicatePolicy": "forbidden",
    "maxInstances": 1
  }
}
```

Component 권장값:

| Component | 정책 |
|---|---|
| Logo | 필수, 위치 잠금, 콘텐츠 교체 정책 선택 |
| Badge | 선택, Desktop/Mobile 표시 설정 |
| Navigation | 선택, Mobile 기본 숨김 |
| CTA | 선택, Header 오른쪽 Anchor |

`layoutLocked`는 Promo Builder에서 전체 Header 배치를 보호하되, Admin Section Preset Editor에서는 Draft 권한으로 수정할 수 있어야 한다.

## 8. Section Instance 생성 및 Layout 적용

## 8.1 Key 변환

Preset 생성 시 다음 Mapping을 만든다.

```text
source sectionKey → pageSectionInstanceId
source itemKey    → pageComponentInstanceId
source fieldKey   → 동일 fieldKey 또는 명시적 field mapping
```

예:

```text
header.logo  → sec_ab12.cmp_91ef
header.badge → sec_ab12.cmp_38ca
```

Layout Snapshot 변환:

```text
items.logo  → itemStyles["sec_ab12.cmp_91ef"]
items.badge → itemStyles["sec_ab12.cmp_38ca"]
```

Visibility도 동일 Mapping을 사용한다.

## 8.2 적용 순서

```text
Section Definition 선택
→ Layout Preset 선택
→ Section Instance ID 생성
→ Component Instance ID 생성
→ Content 기본값 생성
→ Layout Key Mapping
→ Desktop/Mobile Snapshot 적용
→ Validator 실행
→ Editor Document에 원자적으로 반영
```

중간 단계가 실패하면 Section과 Component를 부분 생성하지 않는다.

## 8.3 Layout 우선순위

최종 Layout 계산 우선순위:

```text
Promo Instance Override
→ 선택한 Section Layout Preset
→ Section 기본 Layout Preset
→ 안전한 Legacy Auto Layout
```

기존 문서는 Preset이 없어도 Legacy Auto Layout으로 계속 렌더링한다.

## 9. API 변경 계획

## 9.1 신규 API

### Layout 목록·생성

```text
GET  /api/wizard-content-section-layouts?sectionId={id}
POST /api/wizard-content-section-layouts
```

### Layout 조회·수정·삭제

```text
GET    /api/wizard-content-section-layout?id={id}
PATCH  /api/wizard-content-section-layout
DELETE /api/wizard-content-section-layout?id={id}
```

### 기본 Layout 지정

```text
POST /api/wizard-content-section-layout-default
```

### 실패 Asset 재등록

```text
POST /api/promo-builder-assets-retry
```

## 9.2 기존 API 변경

### `GET /api/wizard-content-sections?scope=public`

Section별 다음 정보를 포함한다.

```json
{
  "layoutPresets": [
    {
      "id": "uuid",
      "layoutKey": "standard-header",
      "name": "Standard Header",
      "isDefault": true
    }
  ],
  "defaultLayoutKey": ""
}
```

목록에는 요약만 반환한다. Visual Editor가 Preset Section을 실제 생성할 때 선택된 Layout 상세 Snapshot을 별도 조회한다.

### `POST /api/wizard-content-sections`

Draft Clone 시 하위 Layout Preset Row도 복제한다.

### `POST /api/wizard-content-section-activate`

활성화 전 Layout Validator를 실행한다.

### Composition Candidate API

`allowedLayoutVariants`를 실제 Layout Preset Key와 연결한다.

### Composition Apply API

선택된 Layout Preset Snapshot을 신규 Instance Key로 변환해 `designSpec`에 반영한다.

## 10. Validator

## 10.1 Section Layout Validator

필수 검증:

- `contractVersion` 지원 여부
- Layout Key 중복 여부
- 기본 Layout 1개 이하
- Snapshot이 현재 Section Version을 참조하는지 확인
- Snapshot의 모든 `itemKey`가 현재 Component Instance에 존재
- 삭제된 Component Style이 남아 있지 않음
- 필수 Component가 숨겨지지 않음
- 잠긴 Component의 Geometry 변경 금지
- Desktop/Mobile Viewport 존재
- 너비·높이·좌표 범위
- Section 경계 이탈
- 신규 Component 충돌
- Header/Footer의 필수 Anchor
- `allowedLayoutVariants`가 실제 Layout Key를 참조

## 10.2 활성화 차단 조건

다음 경우 Section 활성화를 차단한다.

- Layout Preset은 있으나 기본값이 없음
- 기본 Layout에 필수 Component 배치가 없음
- 현재 Section에 없는 `itemKey`를 참조
- Mobile Layout이 필수인데 누락
- JSON Contract Version이 지원되지 않음

기존 활성 Section에 Layout Preset이 하나도 없는 경우에는 Legacy 호환을 위해 활성화를 즉시 차단하지 않는다. 신규 Draft에서 Layout을 수정하기 시작한 이후부터 엄격한 검증을 적용한다.

## 11. Database Migration 계획

## 11.1 Additive Migration

권장 Migration:

```text
047_wizard_content_section_layout_presets.sql
```

포함 내용:

- `wizard_content_section_layouts` 생성
- Unique Constraint 및 Index
- 기본 Layout Partial Unique Index
- Draft Clone Function에 Layout 복제 추가
- Section History에 Layout 변경 요약 추가
- 기존 데이터용 Default Layout Backfill

## 11.2 Backfill

기존 활성 Section에는 다음 중 하나를 적용한다.

### 권장안

Layout Row를 강제로 생성하지 않고 `defaultLayoutKey = null`을 유지한다.

Runtime은 Legacy Auto Layout을 사용한다.

관리자가 Section Draft에서 최초 Layout을 저장하면 신규 계약으로 전환한다.

### 선택안

현재 Component 순서를 기반으로 `legacy-stack` Layout을 자동 생성한다.

이 방식은 데이터가 명시적으로 남지만 불필요한 Layout Row가 대량 생성될 수 있다.

초기 배포에서는 권장안을 사용한다.

## 11.3 롤백

- 신규 Table은 즉시 삭제하지 않는다.
- Feature Flag로 Layout Preset 적용만 비활성화한다.
- Runtime은 기존 Legacy Auto Layout으로 돌아간다.
- 기존 Builder Document의 `designSpec`은 변경하지 않는다.
- Asset Prompt 수정은 공통 Variable Builder 이전 상태로 롤백 가능하되 미해결 변수 검증은 유지한다.

## 12. 단계별 개발 계획

## P0 — AI 자산 생성 긴급 복구

### 구현

- 공통 Image Prompt Variable Builder 추가
- `createPromptExecutionSnapshot()`에서 선언된 선택 변수 기본값 완성
- Promo Builder 경로에 `brandPalette` 전달
- 기존 Section Design 경로도 공통 Builder 사용
- 실제 Prompt Placeholder 완전성 테스트
- 경고 자동 이동 방지
- AI Document 직접 자산 요청에서 `assetWarning` 처리 및 실패 Polling 차단
- 실패 Asset Retry API

### 완료 조건

- 초기 AI 생성 키비주얼 Job 등록
- 자연어 수정 후 신규 키비주얼 Job 등록
- Component 이미지 Job 등록
- `ASSET_ENQUEUE_FAILED` 0건
- 기존 실패 문서 수동 재시도 성공

## P1 — Section Layout Contract 및 DB

### 구현

- Layout Snapshot Schema
- Migration 047
- CRUD Store/API
- Draft Clone
- Validator
- History

### 완료 조건

- Section Draft에 복수 Layout 저장
- 기본 Layout 1개 지정
- Draft Clone 후 Layout 동일
- 잘못된 `itemKey` 저장 차단

## P2 — Admin Section Preset Editor

### 구현

- `section-preset` Editor Mode
- 단일 Section Workspace
- Layout Preset 목록
- Desktop/Mobile Preview
- 기존 Editor와 동일한 Free Geometry 배치
- 저장·Undo/Redo

### 완료 조건

- Header Logo와 Badge 배치 저장
- 재진입 후 동일 배치
- Mobile 표시 여부 유지
- 활성 버전은 읽기 전용

## P3 — Runtime 적용

### 구현

- Preset → Instance Key Mapping
- Layout Resolver
- Create Promo의 Section 추가 경로 적용
- AI Composition Apply 적용
- Legacy Fallback

### 완료 조건

- Section 추가 즉시 기본 Layout 적용
- AI가 선택한 Layout Preset 적용
- Preview와 Web Output 일치
- 중복 Section 생성 시 Style Key 충돌 없음

## P4 — Header 및 공용 Section 정책

### 구현

- Header 기본 Layout 작성
- Header Top/Logo/Desktop/Mobile Validator
- Logo 필수 정책
- Badge·Navigation·CTA 선택 정책
- Footer·Legal 확장 기준 작성

### 완료 조건

- Desktop/Mobile Header 기준 이미지 통과
- Header 중복 생성 차단
- Promo Editor에서 잠긴 Layout 보호

## P5 — 운영 안정화

### 구현

- Production Browser E2E
- 시각 회귀 기준 이미지
- Runtime Error 대시보드
- Asset Retry 운영 도구
- Legacy Layout 사용 현황 집계

### 완료 조건

- Production 실제 DB 기반 전체 시나리오 통과
- Asset Job 실패 원인 사용자 노출
- Layout Preset 없는 기존 Section 무회귀

## 13. 테스트 계획

## 13.1 AI 자산 테스트

### Contract

- 활성 Prompt가 `brandPalette`를 포함해도 미해결 변수가 없음
- 선택 변수 미입력 시 빈 문자열로 치환
- 잘못된 Placeholder는 계속 차단
- Prompt Variable Builder 결과 Key 고정

### API

- Composition Apply 후 Asset Job 생성
- Composition Operations 후 Asset Job 생성
- 동일 Request 재시도 시 중복 Job 없음
- 일부 Job 실패 시 성공 Job은 유지
- Revision 불일치 Retry 차단

### Browser

```text
AI로 프로모션 생성
→ Visual Editor 진입
→ 키비주얼 진행 상태
→ 자동 적용
→ 저장·재진입
→ 이미지 유지
```

## 13.2 Section Layout 테스트

### Unit

- Anchor → Geometry 변환
- Desktop/Mobile 선택
- Preset Item Key → Instance ID 변환
- Layout 우선순위
- Visibility 변환

### Contract

- Layout Snapshot Schema
- Default Layout Unique
- Draft Clone
- Section 활성화 Validator
- 실제 Layout Key만 AI 허용

### Browser

#### Header 작성

```text
Header Draft 선택
→ standard-header 생성
→ Logo 왼쪽 배치
→ Badge 오른쪽 배치
→ Mobile Navigation 숨김
→ 저장
→ 재진입
→ 동일 배치 확인
```

#### Promo 적용

```text
Create Promo 진입
→ Header Preset 추가
→ 기본 Layout 자동 적용
→ Logo/Badge 위치 확인
→ 저장
→ 재진입
→ Web Output 비교
```

#### AI 적용

```text
AI 프로모션 생성
→ Header 선택 확인
→ 허용된 Header Layout 선택
→ Layout Snapshot 적용
→ 키비주얼 Job과 독립적으로 렌더링
```

## 13.3 회귀 테스트

- 기존 Template Mode
- Admin Template Layout
- AI Document
- 기존 활성 Section
- Layout Preset 없는 Section
- Component Library 추가·삭제
- Section 순서 변경
- Undo/Redo
- Design Token 적용
- 키비주얼 삭제·재생성

## 14. 배포 전략

## 14.1 권장 순서

```text
P0 Prompt Variable 복구
→ 테스트
→ Production 배포
→ 기존 실패 Asset 재시도
→ Migration 047
→ Layout API 배포
→ Admin Section Preset Editor 활성화
→ Runtime 적용 Flag 활성화
→ Header Preset 등록
→ AI Composition 적용 활성화
```

## 14.2 Feature Flag

권장 Flag:

```text
BUILDER_ASSET_RETRY
SECTION_LAYOUT_PRESET_EDITOR
SECTION_LAYOUT_PRESET_RUNTIME
SECTION_LAYOUT_PRESET_AI_SELECTION
SECTION_LAYOUT_ANCHORED_MODE
```

## 14.3 운영 Gate

- [ ] Production Commit SHA 확인
- [ ] 활성 Prompt Template Version 확인
- [ ] `brandPalette` 미해결 오류 없음
- [ ] Asset Job 생성·처리·적용 확인
- [ ] Migration 047 적용 확인
- [ ] Header Default Layout 확인
- [ ] Desktop/Mobile Screenshot 확인
- [ ] Preview/Web Output 구조 동등성 확인
- [ ] 기존 Section Legacy Fallback 확인
- [ ] 예상하지 않은 API 4xx/5xx 없음

## 15. 위험요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 선택 Prompt 변수 추가 시 다른 Route 재실패 | 이미지 생성 중단 | 공통 Variable Builder와 활성 Prompt 통합 테스트 |
| Composition 성공과 Asset 실패 혼동 | 사용자가 결과를 정상으로 오인 | 부분 성공 상태와 Retry UI |
| 실패 Request 자동 재시도 폭주 | 비용·중복 Job | 명시적 Retry와 Idempotency |
| Layout Snapshot이 DB ID를 참조 | Draft Clone·Instance 생성 후 연결 손실 | 안정적인 `itemKey` 사용 |
| 신규 ID 변환 누락 | Style 미적용 | 단일 Mapping 함수와 Round-trip 테스트 |
| Desktop 좌표를 Mobile에 재사용 | Header 겹침 | Viewport별 Layout 필수 |
| 자유 좌표만 저장 | 반응형 의도 손실 | Header는 Anchor Mode 기본 |
| Layout과 콘텐츠 혼합 | Promo 입력값 덮어쓰기 | Layout Snapshot에 콘텐츠를 저장하지 않고 기존 `defaultValue`·`lockedValue` 사용 |
| Section과 Page Layout 책임 혼합 | 저장 경로 충돌 | Section Preset과 Template Layout 분리 |
| 기존 Section 활성화 차단 | 운영 회귀 | Legacy Fallback과 점진적 Validator |
| AI가 존재하지 않는 Layout 선택 | Composition 실패 | Candidate ID Allowlist와 서버 검증 |
| Header Layout을 Promo에서 임의 변경 | 브랜드 구조 훼손 | `layoutLocked` 정책 |

## 16. 예상 변경 파일

### AI 자산

- `api/_promo-builder-assets.js`
- `api/promo-section-design-runs.js`
- `api/_prompt-execution-snapshot.js`
- 신규 `api/_section-image-prompt-variables.js`
- 신규 `api/promo-builder-assets-retry.js`
- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/App.vue`

### Section Layout Preset

- 신규 `db/migrations/047_wizard_content_section_layout_presets.sql`
- `api/_wizard-content-sections-store.js`
- `api/wizard-content-sections.js`
- `api/wizard-content-section.js`
- `api/wizard-content-section-activate.js`
- 신규 Section Layout CRUD API
- `api/_promo-page-composition-candidates.js`
- `api/_promo-page-composition-contract.js`
- `visual-editor/src/editor-context.mjs`
- `visual-editor/src/App.vue`
- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/platform/editor-core/composition-structure.mjs`
- `visual-editor/src/platform/layout-engine/*`
- `visual-editor/src/platform/editor-ui/*`
- `prototype/index.html`
- `prototype/app.js`

### Tests

- `scripts/test-promo-builder-asset-enqueue-contract.js`
- 신규 Prompt Variable 통합 테스트
- 신규 Section Layout Schema 테스트
- 신규 Section Layout Draft Clone 테스트
- 신규 Header Layout Browser 테스트
- 신규 AI Composition Layout Preset 테스트

## 17. 현재 진행 상황 및 이슈 기록

### 17.1 완료된 확인

- Production 배포가 `READY`이고 최신 `main` Commit과 일치함을 확인
- Migration 046 적용 및 세 Column 생성 확인
- Promo Builder 키비주얼 실패 Runtime Log 확인
- 실패 원인이 `brandPalette` 미해결 변수임을 확인
- 이미지 Provider 호출 전에 Asset Enqueue가 실패함을 확인
- Section Preset 생성 경로가 Layout을 복제하지 않음을 확인
- AI Composition이 실제 Geometry가 아닌 `layoutVariant` 문자열만 저장함을 확인
- Renderer가 Layout 미설정 Component를 Legacy Auto Layout으로 배치함을 확인

### 17.2 미해결 운영 이슈

- 신규 AI Composition의 키비주얼이 생성되지 않을 수 있음
- 실패 Asset Request의 전용 Retry API 없음
- Asset Warning이 화면 이동 과정에서 사용자에게 보이지 않음
- 영향받은 Builder Document 수가 집계되지 않음

### 17.3 미구현 제품 기능

- Section Layout Preset DB 모델 없음
- Admin Section 단위 Layout Editor 없음
- Desktop/Mobile Layout 저장 없음
- Preset Item Key → Instance ID Style Mapping 없음
- Header Anchor Layout 없음
- AI Layout Variant와 실제 Snapshot 연결 없음

### 17.4 개발 전 결정 필요 항목

권장안을 기본값으로 제안한다.

| 항목 | 권장 결정 |
|---|---|
| Layout 생명주기 | Section Version에 종속 |
| Layout 저장 단위 | 복수 Preset |
| 기본 Layout | Section Version당 1개 |
| 반응형 | Desktop + Mobile |
| 초기 위치 모델 | 기존 Free Geometry |
| Header 안정화 위치 모델 | P4에서 Anchor 확장 |
| 기존 Section | Legacy Fallback |
| 실패 Asset 복구 | 명시적 Retry |
| AI Layout 역할 | Geometry 생성이 아니라 Preset 선택 |

### 17.5 2026-07-30 P0 개발 및 디버깅 기록

완료:

- Section Background와 Item Image Prompt 변수를 하나의 공통 Builder로 통합했다.
- Design Token에서 `brandPalette`를 생성하고, 선언된 Optional Prompt Variable은 빈 문자열로 보완하도록 실행 계약을 강화했다.
- 실패 또는 대기 중인 Builder Asset Request를 재등록하는 전용 Retry API와 Visual Editor 동작을 추가했다.
- AI Builder가 Asset Warning 상태에서 자동으로 편집 화면으로 이동하지 않도록 수정했다.
- 사용자가 `재시도` 또는 `이미지 없이 편집 계속`을 명시적으로 선택하도록 했다.
- AI Document 직접 생성 경로에서도 Asset Warning을 성공 상태로 오인하지 않도록 수정했다.

검증:

- Section AI Prompt Admin Contract 통과
- Promo Builder Asset Enqueue Contract 통과
- Promo Builder Asset Retry Contract 통과
- AI Document Visual Editor Contract 통과
- 전체 90개 Test Script 통과
- Admin/Visual Editor Production Build 통과
- AI Builder Browser Test 및 Create Promo Browser Smoke Test 통과
- Git Conflict Marker 및 Whitespace 오류 없음

남은 운영 확인:

- 변경 사항은 아직 Production에 배포하지 않았다.
- Production 배포 후 실제 Provider 호출, Asset 생성 완료, 저장·재진입 유지 여부를 확인해야 한다.

### 17.6 2026-07-30 P1 개발 및 디버깅 기록

완료:

- Migration 047에 Section Version 하위 Layout Preset, 변경 이력, 기본 Layout 전환 함수를 추가했다.
- Section Draft 복제 시 Component Instance와 Layout Preset이 함께 복제되도록 최신 Clone Function을 확장했다.
- Contract v1은 `free` Geometry와 Desktop/Mobile Viewport만 허용하도록 제한했다.
- Layout Snapshot의 좌표 범위, 화면 밖 Overflow, 색상, 표시 여부, 미등록 `itemKey`를 검증한다.
- Layout 목록·생성·조회·수정·삭제·기본값 지정 API를 추가했다.
- Layout 변경은 Draft Section에만 허용하고 생성·수정·삭제·기본값·복제 이력을 저장한다.
- Layout이 있는 Section 활성화 시 기본 Layout 1개와 Snapshot 유효성을 검증한다.
- Public Section 목록에는 Snapshot 전체가 아닌 Layout Summary와 `defaultLayoutKey`만 제공한다.
- AI Layout Variant가 고정된 세 문자열뿐 아니라 실제 `layoutKey`를 참조할 수 있도록 계약을 확장했다.

검증:

- 신규 Layout Contract Test 통과
- Wizard Section AI Policy Contract 통과
- Wizard Content Sections Contract 통과
- 전체 91개 Test Script 통과
- Git Whitespace 오류 없음

남은 운영 확인:

- Migration 047은 아직 Production DB에 적용하지 않았다.
- 실제 DB Transaction과 Clone 결과는 Migration 적용 후 Integration Test가 필요하다.

### 17.7 2026-07-30 P2 개발 및 디버깅 기록

완료:

- Admin 콘텐츠 Section 상세에 Layout Preset 목록·생성·기본값·AI 허용·삭제 관리를 추가했다.
- Draft에서만 변경할 수 있고 활성·비활성 Version은 읽기 전용으로 표시한다.
- `mode=section-preset` 전용 Visual Editor Workspace를 추가했다.
- Desktop/Mobile 전환, Component Drag/Resize, 숫자 좌표, 표시 여부, Section 높이·배경색을 편집할 수 있다.
- Undo/Redo와 변경 사유 저장을 지원한다.
- Section에 나중에 추가된 Component도 Preset Editor 진입 시 초기 Geometry를 보완한다.
- AI가 선택할 수 있는 Layout Key를 Preset 목록에서 명시적으로 허용·해제할 수 있다.
- AI 허용 상태인 Preset은 정책을 먼저 해제하기 전까지 삭제하지 못하도록 보호했다.

검증:

- Admin/Visual Editor Production Build 통과
- Header Logo·Badges Desktop/Mobile Preset Browser Test 통과
- Mobile 표시 여부 저장 및 재진입 유지 확인
- 활성 Section Version 읽기 전용 확인
- 전체 93개 Test Script 통과

남은 운영 확인:

- Migration 047 미적용 상태이므로 배포 환경의 Admin API 실연동은 아직 확인하지 않았다.
- 실제 관리자 권한 정책은 기존 Wizard Section Admin API의 인증 정책을 그대로 따른다.

### 17.8 2026-07-30 P3 개발 및 디버깅 기록

완료:

- 공통 Preset Resolver가 안정적인 `itemKey`를 문서별 Section/Component Instance Key로 변환한다.
- AI Composition Candidate에는 Layout 이름·설명·지원 Viewport만 Prompt로 제공하고, 서버 내부 Candidate Snapshot에는 적용할 Geometry를 유지한다.
- AI가 허용된 실제 Layout Key만 선택하도록 Composition Schema와 Validator를 연결했다.
- 초기 AI Composition과 자연어 `change-layout-variant` Operation 모두 동일한 Preset Resolver를 사용한다.
- 일반 Visual Editor에서 Section Preset 추가 시 기본 Layout을 조회해 즉시 적용한다.
- Layout이 없거나 조회가 실패하면 기존 자동 배치로 안전하게 Fallback한다.
- `responsiveLayouts.mobile` 계약과 Renderer 반응형 선택을 추가했다.
- Preview의 Desktop/Mobile Toggle과 Web Output의 실제 Browser 폭이 같은 Layout 계약을 사용한다.
- Runtime 제한과 불일치하던 Preset 좌표 범위를 Section 1200px, Component 높이 900px로 보정했다.

검증:

- AI Composition에서 Preset Geometry와 Design Token Style 병합 확인
- 신규 Instance ID에 Desktop/Mobile Geometry Mapping 확인
- Desktop 1000px 및 Mobile 390px Web Output Browser Test 통과
- Mobile Component 표시 여부 적용 확인
- 전체 95개 Test Script 통과

### 17.9 2026-07-30 P4 개발 및 디버깅 기록

계획 조정:

- Anchor는 현재 Runtime에 별도 좌표 모델과 Resize 규칙을 추가해야 하므로 이번 단계의 필수 범위에서 제외했다.
- 현재 Free Geometry를 Desktop/Mobile에 각각 명시 저장하는 방식이 Preview, 저장 Validator, Web Output에서 동일하게 동작한다.
- Anchor는 동적 Navigation과 가변 Header 폭 요구가 확인되면 다음 Contract Version에서 도입한다.

완료:

- Migration 047이 기존 Header Version에 `standard_header` 기본 Preset을 생성한다.
- Desktop은 Logo 좌측·Badges 우측, Mobile은 Logo 유지·Badges 숨김으로 초기화한다.
- Header AI/Composition Layout 허용값을 실제 `standard_header` Key로 전환한다.
- Header 활성화 전 Top 고정, Visible Logo, 기본 Preset, Desktop/Mobile Logo Geometry와 노출을 검증한다.
- Badge·Navigation·CTA는 선택 요소로 유지하며 Layout별 표시 여부로 제어한다.

검증:

- Header Layout Policy Test 통과
- Migration Seed Contract Test 통과
- Wizard Section Layout 및 Activation Contract 회귀 통과
- 전체 96개 Test Script 통과

### 17.10 2026-07-30 P5 최종 검증 기록

완료:

- Admin 및 Visual Editor Production Build 재실행 통과
- 전체 96개 Test Script 최종 통과
- AI Builder, Create Promo, Section Preset Editor, Responsive Web Output Browser Test 통과
- Git Conflict Marker 없음
- `git diff --check` 통과
- 사용자 소유 Untracked `.claude/`는 변경하지 않음

참고:

- 첫 최종 Test Run에서 기존 Admin Prompt Grouping Browser Test가 문구 대기 중 1회 Timeout됐다.
- 해당 Test 단독 재실행은 통과했고, 전체 96개 Test 재실행도 통과해 일시적 Browser Timing 문제로 판정했다.
- Build Runtime은 Project 요구 Node 22.x가 아닌 Bundled Node 24.14.0이어서 Engine Warning이 발생했으나 Build 결과는 정상이다.

배포 전 필수:

1. Migration 047을 Production DB에 적용한다.
2. Migration 적용 후 Header `standard_header` Seed와 Clone 결과를 조회한다.
3. Application을 배포한다.
4. 실제 Provider로 AI Composition Key Visual 생성·자동 적용·재진입 유지·Retry를 검증한다.
5. Admin에서 Header Preset 저장 후 Create Promo 및 AI Composition 결과를 Desktop/Mobile로 확인한다.

### 17.11 2026-07-30 추가 디버깅 기록

발견 및 수정:

- `responsiveLayouts.mobile`은 Renderer에서 사용되지만 기존 공통 Layout Validator가 검증하지 않는 누락을 발견했다.
- 서버 저장 Validator와 Visual Editor Validator 양쪽에 Mobile Geometry 검증을 추가했다.
- X/Y, Width/Height, Z-index, 화면 폭 Overflow, `positionMode`, Mobile 표시 여부 타입을 검증한다.
- 잘못된 `responsiveLayouts` 및 `mobile.itemStyles` 자료형도 저장 전에 차단한다.

재검증:

- Wizard Form Template Layout Contract 통과
- Wizard Layout Behavior Test 통과
- Section Layout Preset Runtime Test 통과
- Responsive Web Output Browser Test 통과
- Admin/Visual Editor Production Build 통과
- 전체 96개 Test Script 통과

## 18. 완료 정의

### AI 자산

- [x] AI Composition 후 대상 Asset Job이 모두 등록된다.
- [x] `brandPalette`를 포함한 활성 Prompt에서 미해결 변수가 없다.
- [x] Composition과 Asset 상태가 별도로 표시된다.
- [x] 실패 Asset Request를 안전하게 재시도할 수 있다.
- [x] 생성 완료 후 키비주얼이 자동 적용된다.
- [x] 저장·재진입 후 이미지가 유지된다.

### Section Layout Preset

- [x] Section Draft에 복수 Layout Preset을 저장할 수 있다.
- [x] 하나의 기본 Layout을 지정할 수 있다.
- [x] Desktop/Mobile 배치를 각각 저장할 수 있다.
- [x] Header Logo·Badge 위치를 사전 설정할 수 있다.
- [x] Section Instance 생성 시 Layout이 신규 ID에 맞게 적용된다.
- [x] AI는 실제 허용된 Layout Preset만 선택한다.
- [x] 필수·잠금·고정 정책이 Runtime에서 유지된다.
- [x] Preview와 Web Output 결과가 동일하다.
- [x] 기존 Layout Preset 없는 Section이 정상 동작한다.

## 19. 최종 권고

개발은 두 Track으로 분리하되 P0 완료 후 Section Layout Track을 진행한다.

```text
Track A — 운영 복구
Prompt Variable 계약 통합
→ Asset Retry
→ 경고 가시성
→ Production 검증

Track B — Section Layout Preset
DB·Contract
→ Admin 단일 Section Editor
→ Instance Mapping
→ Header Preset
→ AI 선택 연동
```

가장 중요한 기준은 다음과 같다.

```text
Section Definition은 무엇을 포함하는지 정의하고,
Section Layout Preset은 어떻게 배치되는지 정의하며,
Page Template Layout은 페이지에서 어디에 놓이는지 정의한다.
```

세 책임을 분리해야 Header와 같은 정형 Section을 안정적으로 재사용하면서도 Promo별 편집과 AI Composition을 함께 지원할 수 있다.
