# Visual Template Editor 및 LLM Vue 템플릿 생성 구조 검토안

- 작성일: 2026-07-16
- 상태: 아키텍처 검토 제안, 개발 미착수
- 목적: 다른 LLM과 개발자가 동일한 배경과 제약을 기준으로 추가 검토할 수 있도록 논의 내용을 통합 정리
- 대상: Promo Wizard, Admin Form Template, LO-FI/HI-FI 생성 파이프라인, Vue Web Output

## 1. 문서 목적

현재 Promo Wizard는 다음 순서로 동작한다.

```text
Design Concept 선택
→ Promo Content 입력
→ Integrated Brief 생성
→ LO-FI 전체 페이지 이미지 생성 및 선택
→ HI-FI 전체 페이지 이미지 생성
→ 별도 Vue Web Output 생성
```

이 구조에서는 LO-FI/HI-FI 이미지와 실제 Vue 웹페이지가 서로 다른 생성물이다. 이로 인해 선택한 LO-FI 레이아웃과 Final Design이 달라지거나, Final Design 이미지와 실제 Web Output의 구성 및 콘텐츠가 달라질 수 있다.

이번 논의의 핵심 제안은 다음과 같다.

1. Wizard Step 2를 단순 입력 폼이 아니라 실제 웹페이지를 보면서 콘텐츠를 등록하는 Visual Content Editor로 변경한다.
2. LO-FI와 HI-FI 전체 페이지 이미지 생성 과정을 장기적으로 제거한다.
3. LLM은 페이지 이미지를 생성하는 대신 제한된 규칙 안에서 Design Spec과 Vue 프론트 템플릿을 생성한다.
4. 동일한 Vue Renderer를 Wizard Preview와 최종 Web Output에 사용한다.
5. LLM 생성 코드는 Sandbox Build와 자동 시각 QA를 통과한 경우에만 Template Registry에 등록한다.

## 2. 현재 시스템에서 확인된 문제

### 2.1 이미지와 웹페이지의 Source of Truth가 다름

- LO-FI는 이미지 생성 모델의 결과다.
- HI-FI도 별도 이미지 생성 모델의 결과다.
- Web Output은 이미지 결과를 참고해 별도 코드로 구현해야 한다.
- 이미지 생성 모델과 코드 생성 모델이 레이아웃을 독립적으로 해석할 수 있다.
- 동일한 Promo Content를 사용해도 위치, 비율, Section 구조와 CTA 표현이 달라질 수 있다.

### 2.2 이미지 결과는 실제 웹 동작을 검증할 수 없음

- 반응형 레이아웃을 직접 검증할 수 없다.
- CTA URL, UTM, 키보드 포커스 및 접근성을 검증할 수 없다.
- 텍스트 Overflow와 실제 폰트 렌더링 결과가 다를 수 있다.
- 이미지에 표현된 버튼과 텍스트는 실제 DOM 요소가 아니다.
- 모바일에서 Section 순서가 어떻게 바뀌는지 알 수 없다.

### 2.3 Step 2의 입력 UX 한계

현재 Step 2는 관리자 템플릿의 Section과 Item을 아코디언 입력 폼으로 표시한다. 데이터 입력과 검증에는 적합하지만 사용자는 다음을 예상하기 어렵다.

- 입력한 텍스트가 페이지 어디에 표시되는가
- 이미지의 실제 비율과 Crop 결과가 어떤가
- Hero와 CTA의 시각적 우선순위가 어떤가
- Section 순서가 실제 페이지에서 어떻게 보이는가
- Header/Footer 고정값과 사용자 입력값이 어떻게 결합되는가

## 3. 제안하는 최종 방향

전체 페이지 디자인 이미지 대신 실제 Vue 페이지를 디자인 결과로 취급한다.

```text
Promo Content
+ Admin Form Template Schema
+ LLM Design Spec
+ Vue Renderer
+ Generated Image Assets
= 실제 Preview이자 최종 Web Output
```

핵심 원칙:

```text
LLM = 디자인 의사결정과 제한된 템플릿 코드 생성
Vue Renderer = 실제 웹 구현과 동작 보장
sectionInputs = 콘텐츠 Source of Truth
PageDesignSpec = 디자인 Source of Truth
```

## 4. 제안 Wizard 프로세스

### 4.1 단기 전환안

기존 4단계를 유지하면서 Step 2와 Step 3의 역할을 변경한다.

```text
Step 1. Style & Template
Step 2. Visual Content Editor
Step 3. AI Design Variants
Step 4. Final Web Output
```

### 4.2 Step 1: Style & Template

사용자가 생성 범위를 지정한다.

- 기본 배경색 또는 밝기 모드
- 폰트 색상
- Accent Color
- 버튼 스타일
- 콘텐츠 밀도
- 기본 톤앤매너
- Form Template 선택
- 선택 가능한 경우 기본 Renderer Family 선택

이 값은 LLM에 자유 요청으로 전달하기보다 허용된 enum 또는 token으로 전달한다.

### 4.3 Step 2: Visual Content Editor

관리자가 구성한 Section/Item을 실제 웹 템플릿 위에서 편집한다.

권장 데스크톱 구조:

```text
┌──────────────┬────────────────────────────┬──────────────────┐
│ Section 목록 │ 실제 Vue Web Preview       │ 선택 Item 편집   │
│              │                            │                  │
│ Header       │ Header                     │ Item 이름        │
│ Hero         │ Hero Banner                │ Text / Image      │
│ Content CTA  │ Content CTA                │ CTA URL / UTM     │
│ Footer       │ Footer                     │ Validation        │
└──────────────┴────────────────────────────┴──────────────────┘
```

필요 동작:

- Preview에서 텍스트, 이미지 또는 CTA를 클릭하면 해당 Item 편집 패널을 연다.
- 입력값은 즉시 Preview에 반영한다.
- Section 목록에서 현재 선택 위치와 필수값 상태를 표시한다.
- `userReorderAllowed=true`인 Section만 순서를 변경할 수 있다.
- `fixedPosition`과 Item `isLocked`를 기존 관리자 설정대로 유지한다.
- 필수값 누락, 이미지 비율 오류, URL 오류를 Preview와 목록에 동시에 표시한다.
- Desktop, Tablet, Mobile Preview를 전환할 수 있다.
- 모바일에서는 Section 목록, Preview, 편집 패널을 탭 또는 전환 View로 구성한다.

### 4.4 Step 3: AI Design Variants

기존 LO-FI 이미지를 생성하지 않는다. LLM이 구조화된 Page Design Spec 후보를 생성하고 실제 Vue Renderer로 표시한다.

예:

```json
{
  "variantId": "variant-a",
  "designAxes": {
    "composition": "editorial",
    "density": "comfortable",
    "visualWeight": "image-led",
    "sectionRhythm": "alternating",
    "ctaEmphasis": "strong",
    "surfaceStyle": "bordered",
    "backgroundStrategy": "mixed-dark"
  },
  "theme": {
    "mode": "dark",
    "primaryColor": "#2563eb",
    "backgroundColor": "#080b10",
    "headingFont": "Inter",
    "radius": "medium"
  },
  "sections": {
    "heroBanner": {
      "layoutVariant": "background-image-overlay",
      "contentAlign": "left",
      "height": "large",
      "overlayStrength": 0.58
    },
    "contentCta": {
      "layoutVariant": "split-image-right",
      "surface": "elevated"
    }
  }
}
```

사용자는 다음과 같이 실제 웹 Variant를 비교한다.

- Variant A: 이미지 중심
- Variant B: Editorial 중심
- Variant C: Conversion/CTA 중심

각 Variant는 스크린숏이 아니라 실제 DOM과 CSS로 렌더링된다.

### 4.5 Step 4: Final Web Output

선택된 Design Spec과 Asset을 동일한 Vue Renderer에 적용한다.

- Desktop/Tablet/Mobile 확인
- Promo Content Coverage 확인
- 필수 Section/Item 확인
- CTA URL 및 UTM 확인
- 이미지 로딩 및 Alt 확인
- Overflow와 겹침 확인
- 접근성 기본 검사
- 최종 Vue Output 저장 및 배포

별도 HI-FI 전체 페이지 이미지는 만들지 않는다. 필요하면 실제 Vue 페이지 스크린숏을 디자인 확인용 이미지로 저장한다.

## 5. Canva와 유사한 UX의 적용 범위

### 5.1 적용할 요소

- 실제 결과를 보며 편집
- 화면 요소 클릭 후 속성 변경
- 텍스트와 이미지의 즉시 반영
- Section 탐색
- 제한된 순서 변경
- Desktop/Mobile Preview
- 여러 디자인 Variant 비교
- Undo/Redo 또는 최근 변경 복구
- 자동 저장

### 5.2 적용하지 않을 요소

초기 범위에서 다음 자유 편집 기능은 제외한다.

- 픽셀 단위 자유 이동
- 임의 크기 조정
- 자유 Layer 생성
- 임의 z-index 변경
- 사용자의 임의 Vue Component 삽입
- 제한 없는 폰트·색상·CSS 변경
- 페이지 위에서 임의 Script 작성

이 프로젝트는 Canva 복제가 아니라 **템플릿 기반 Visual Content Editor**로 정의한다.

## 6. 이미지 처리 방향

전체 페이지 이미지는 제거하지만 페이지에 사용되는 이미지 Asset 생성은 유지한다.

대상:

- Hero 배경 이미지
- 콘텐츠 Section 이미지
- 제품/프로모션 Key Visual
- 패턴과 Texture
- 필요한 경우 아이콘 또는 장식 이미지

Asset 요청 예:

```json
{
  "assetRole": "hero-background",
  "generationPrompt": "Premium poker table scene with chips and cards, no text or UI",
  "aspectRatio": "16:9",
  "textSafeArea": "left",
  "overlayRequired": true,
  "requiredFocalPoint": "right"
}
```

처리 원칙:

- 이미지 안에 CTA 또는 본문 텍스트를 생성하지 않는다.
- 텍스트와 버튼은 실제 HTML로 렌더링한다.
- 파일 첨부, URL 등록, AI 생성 방식을 기존 Section Item 설정과 연결한다.
- Template Renderer가 aspect ratio, object-fit, focal point와 overlay를 처리한다.
- AI 생성 중, 실패, 재생성 및 이전 Asset 유지 상태를 지원한다.

## 7. LLM 프론트 코드 생성 가능성

규칙과 범위를 제공하면 LLM이 다양한 Vue 템플릿을 생성하는 것은 가능하다. 그러나 운영 요청마다 제한 없는 코드를 즉시 생성하고 실행하는 방식은 권장하지 않는다.

세 가지 접근 방식:

### 7.1 사전 제작 Template Registry

```text
LLM → 기존 Template/Variant 선택 → 콘텐츠 적용
```

- 안정성 높음
- 결과 예측 가능
- 다양성 제한

### 7.2 완전 자유 코드 생성

```text
LLM → Vue/HTML/CSS 전체 생성 → 즉시 실행
```

- 다양성 높음
- 빌드 실패와 보안 위험
- 반응형 및 콘텐츠 Coverage 편차
- 유지보수와 버전 관리 어려움

### 7.3 하이브리드 방식 - 권장

```text
공통 Component Library
+ Template Generation Contract
+ LLM Design Spec
+ 제한된 Vue 코드 생성
+ Sandbox Build 및 자동 QA
```

이 방식은 구조 안정성과 디자인 다양성을 함께 확보한다.

## 8. LLM 생성 범위

### 8.1 고정 영역

LLM이 변경하면 안 되는 부분:

- Vue 프로젝트 구조
- 공통 Component API
- `sectionInputs` 데이터 경로
- Form Template의 Section/Item Key
- CTA URL과 UTM 처리
- 이미지 업로드/URL/AI 생성 API
- 접근성 기본 속성
- 반응형 Breakpoint 범위
- Header/Footer 고정 정책
- 필수 콘텐츠 Coverage
- 인증과 관리자 API
- 최종 Web Output 인터페이스

공통 Props 예:

```vue
<script setup>
defineProps({
  content: Object,
  designSpec: Object,
  assets: Object
});
</script>
```

### 8.2 변경 허용 영역

- 허용된 Section 순서
- Hero Layout Variant
- Section별 Grid와 Split 방향
- 콘텐츠 최대 폭
- 간격과 콘텐츠 밀도
- 배경 처리 방식
- Typography Scale
- 색상 역할 매핑
- Card, Border, Divider와 Radius
- Shadow와 Depth
- CTA 강조 방식
- 이미지 Crop, Overlay와 Focal Point
- 모바일에서 이미지/텍스트 재배치
- 허용된 Component 조합

### 8.3 금지 영역

- 임의 외부 API 호출
- 외부 Script 삽입
- `eval` 또는 동적 코드 실행
- 임의 패키지 설치
- 사용자 콘텐츠 임의 삭제 또는 요약
- 필수 Section 삭제
- Item Key 변경
- CTA URL 변조
- 텍스트를 페이지 이미지 안에 합성
- 허용되지 않은 절대 위치 배치
- 모바일 Overflow를 만드는 고정 폭
- 쿠키, 인증정보 또는 관리자 데이터 접근

## 9. Template Generation Contract

LLM에 전달할 계약 예:

```json
{
  "contractVersion": 1,
  "framework": "vue-3",
  "requiredSections": ["heroBanner", "footer"],
  "optionalSections": [
    "header",
    "stepBar",
    "contentCta",
    "imageTextRow",
    "titleDescription"
  ],
  "allowedLayouts": {
    "heroBanner": [
      "background-overlay",
      "split-left",
      "split-right",
      "centered"
    ],
    "contentCta": [
      "horizontal-banner",
      "split-card",
      "centered-panel"
    ]
  },
  "allowedComponents": [
    "PromoPage",
    "PromoHeader",
    "HeroSection",
    "ContentGrid",
    "PromoCTA",
    "PromoFooter"
  ],
  "constraints": {
    "maxContentWidth": 1440,
    "minTextContrast": 4.5,
    "mobileBreakpoint": 768,
    "allowAbsolutePosition": false,
    "allowExternalScripts": false
  }
}
```

## 10. 2단계 LLM 생성

디자인 의사결정과 코드 생성을 분리한다.

### 10.1 1차: Design Spec 후보 생성

입력:

- Promo Content
- 선택된 Form Template Snapshot
- 브랜드/Design MD 규칙
- 사용자 Style 선택
- Template Generation Contract

출력:

- 2~3개의 구조화된 Page Design Spec
- 각 후보의 디자인 축
- Section별 Layout Variant
- 필요한 Asset Request
- 콘텐츠 Coverage Map

### 10.2 2차: Vue 템플릿 생성

입력:

- 선택된 Page Design Spec
- 허용 Component 목록과 API
- Form Template Snapshot
- Vue Code Contract

출력 예:

```text
template.json
PromoTemplate.vue
template.css
asset-manifest.json
```

Vue 예:

```vue
<template>
  <PromoPage :theme="designSpec.theme">
    <PromoHeader :content="content.header" />

    <HeroBackground
      :image="assets.heroBackground"
      :overlay="designSpec.sections.heroBanner.overlayStrength"
    >
      <PromoHeading :content="content.heroBanner" />
      <PromoCTA :content="content.heroBanner.button" />
    </HeroBackground>

    <ImageTextGrid :content="content.imageTextRow" />
    <PromoFooter :content="content.footer" />
  </PromoPage>
</template>
```

## 11. 다양성 생성과 검증

다양성은 랜덤 색상 변경이 아니라 구조적 디자인 축을 통해 만든다.

후보 예:

```json
{
  "composition": "editorial",
  "density": "comfortable",
  "visualWeight": "image-led",
  "sectionRhythm": "alternating",
  "ctaEmphasis": "strong",
  "surfaceStyle": "bordered",
  "backgroundStrategy": "mixed-dark"
}
```

각 후보는 최소 다음 항목 중 여러 개가 달라야 한다.

- Hero Variant
- Section Grid
- 이미지 위치
- 콘텐츠 밀도
- Section Rhythm
- CTA 구조
- Surface 처리
- 모바일 변환 방식

자동 다양성 평가 예:

```json
{
  "diversityScore": 0.82,
  "layoutDifference": 0.91,
  "componentDifference": 0.74,
  "colorOnlyVariation": false
}
```

`colorOnlyVariation=true`이거나 구조 차이가 기준 미만이면 후보를 다시 생성한다.

## 12. 생성 코드 안전 처리

생성 코드를 현재 서비스 권한으로 즉시 실행하지 않는다.

```text
LLM 코드 생성
→ 격리된 Sandbox Build
→ 정적 코드 검사
→ Preview 실행
→ Desktop/Mobile Screenshot
→ 자동 QA
→ 자동 수정 Loop
→ 통과한 템플릿만 Registry 등록
```

필수 보안 검사:

- 외부 Script 금지
- 허용되지 않은 import 금지
- `eval`, `Function`, 동적 Script 삽입 금지
- 임의 fetch/XHR 금지
- Cookie 및 Local Storage 직접 접근 금지 또는 제한
- 관리자 API 접근 금지
- 코드 크기와 빌드 시간 제한
- Sandbox CPU, Memory와 실행 시간 제한

## 13. 자동 QA

### 13.1 코드와 빌드

- Vue Compile 성공
- 허용 Component만 사용
- Props Contract 준수
- 필수 Section과 Item Key 유지
- 임의 네트워크 코드 없음

### 13.2 콘텐츠 Coverage

- Wizard에서 입력한 모든 필수 Section Item 반영
- 고정값 반영
- 텍스트 원문 보존
- CTA URL과 UTM 보존
- 이미지 Alt와 Asset Role 보존
- 숨김 Section 미출력
- Section Snapshot과 Revision 일치

### 13.3 시각 QA

- Desktop/Mobile 화면이 비어 있지 않음
- 가로 Overflow 없음
- 텍스트와 버튼 겹침 없음
- 최장 텍스트가 컨테이너 밖으로 나오지 않음
- Header/Footer 누락 없음
- CTA가 실제 버튼 또는 링크로 존재
- 이미지가 지나치게 Crop되지 않음
- 배경 이미지 위 텍스트 대비 확보
- 고정 포맷 요소가 콘텐츠에 따라 흔들리지 않음

### 13.4 접근성

- Heading 순서
- Landmark 구조
- 키보드 포커스
- 링크와 버튼의 접근 가능한 이름
- 이미지 Alt
- 색상 대비
- `prefers-reduced-motion`

### 13.5 자동 수정 Loop

```text
Build 실패 또는 QA 실패
→ 오류와 스크린숏을 LLM에 전달
→ 제한된 Patch 생성
→ 재빌드
→ QA 재실행
```

재시도 횟수를 제한하고 반복 실패 템플릿은 자동 보관한다.

## 14. 관리자 기능 제안

관리자 페이지에 향후 다음 기능을 추가할 수 있다.

- AI 템플릿 생성
- Template Generation Contract 선택
- 생성 요구사항 입력
- 생성/빌드/검증/수정 상태 표시
- Desktop/Mobile Preview
- Section/Item Mapping 확인
- 자동 QA 결과 확인
- 템플릿 활성화와 보관
- Template Version 관리
- 기존 Form Template과 Renderer 연결
- 생성 실패 로그와 재시도

데이터 관계:

```text
Form Template
├─ Section/Item Schema
├─ Renderer Template
├─ Allowed Design Variants
├─ Asset Rules
├─ Template Contract Version
└─ Published Renderer Version
```

## 15. 현재 데이터 모델에서 재사용할 요소

현재 구현 중 다음 요소는 유지할 가치가 있다.

- `formTemplate`
- `sectionInputs`
- `sectionSnapshot`
- `configRevision`
- `templateInputs`
- `templateSectionOrders`
- `userReorderAllowed`
- `fixedPosition`
- Item `isLocked`
- Item `isRequired`
- Item 이미지 허용 방식
- CTA UTM 설정

변경이 필요한 핵심은 입력 데이터가 아니라 Renderer 계층과 디자인 생성 파이프라인이다.

## 16. 추가 데이터 모델 후보

### 16.1 Renderer Registry

```json
{
  "rendererId": "uuid",
  "rendererKey": "promo-template-ai-001",
  "formTemplateId": "uuid",
  "contractVersion": 1,
  "rendererVersion": 3,
  "status": "draft|validating|active|failed|archived",
  "sourceStorageKey": "...",
  "buildStorageKey": "...",
  "qaReport": {},
  "createdAt": "..."
}
```

### 16.2 Page Design Spec

```json
{
  "designSpecVersion": 1,
  "rendererKey": "promo-template-ai-001",
  "theme": {},
  "designAxes": {},
  "sections": {},
  "responsive": {},
  "assetRequests": [],
  "coverageMap": {}
}
```

### 16.3 Template Snapshot

생성 Run 시작 시 다음을 Snapshot으로 저장한다.

- Form Template ID/Version
- Section/Item 정의
- Renderer Key/Version
- Template Contract Version
- Page Design Spec
- Promo Content
- Asset Manifest

관리자가 이후 템플릿을 변경해도 이미 진행 중인 Run 결과가 바뀌지 않아야 한다.

## 17. 단계적 개발 제안

### Phase 0. 기술 검증

- Default Template 하나를 Vue Renderer로 구현
- 기존 `sectionInputs` 연결
- Desktop/Mobile 렌더링
- 실제 Web Output과 Preview에서 동일 컴포넌트 사용 검증

### Phase 1. Visual Content Editor MVP

- Section 목록
- 실제 Vue Preview
- 선택 Item 편집 패널
- 실시간 입력 반영
- 필수값과 오류 표시
- Section 순서 변경
- 이미지 Placeholder와 URL 방식

### Phase 2. Design Spec Variant

- 제한된 Design Spec Schema 정의
- 기존 Renderer Variant 조합
- LLM이 2~3개 Design Spec 생성
- 실제 Vue Preview 비교 및 선택
- 다양성 검증

### Phase 3. Asset Generation

- Section별 Asset Request
- Hero/Content 이미지 생성
- Asset 상태와 재생성
- Focal Point와 Text Safe Area 적용

### Phase 4. LLM Vue Template 생성

- Template Generation Contract
- 공통 Component Library
- Sandbox Build
- 자동 코드/시각 QA
- 수정 Loop
- Registry 등록

### Phase 5. 기존 이미지 파이프라인 제거

- LO-FI 전체 이미지 생성 제거
- HI-FI 전체 이미지 생성 제거
- 기존 Run 데이터 조회 호환 유지
- 필요하면 레거시 결과는 Read-only로 보관
- n8n Workflow를 Design Spec/Asset 생성 중심으로 재구성

## 18. 마이그레이션 주의사항

- 현재 LO-FI/Final Design Run API를 즉시 삭제하지 않는다.
- 새 Renderer Run과 기존 Image Run을 명시적으로 구분한다.
- 기존 생성 이력은 계속 조회할 수 있어야 한다.
- 관리자 Prompt와 n8n Workflow의 역할을 한 번에 변경하지 않는다.
- Default Template 하나로 Preview/Web Output 동등성을 먼저 증명한다.
- 새 구조가 안정화되기 전까지 기존 이미지 파이프라인을 Feature Flag로 유지할 수 있다.

## 19. 주요 위험

### 19.1 생성 코드 품질 편차

완화:

- 공통 Component Library
- 엄격한 Template Contract
- 제한된 import
- Sandbox Build
- 자동 수정 Loop

### 19.2 규칙이 너무 강해 다양성이 사라짐

완화:

- Layout Variant와 Design Axis를 충분히 제공
- Section별 조합 가능 범위 정의
- 구조적 다양성 점수 적용
- 신규 Component/Variant를 별도 승인 과정으로 Registry에 추가

### 19.3 규칙이 너무 약해 결과가 불안정함

완화:

- 고정 영역과 변경 가능 영역 분리
- 임의 CSS와 절대 위치 제한
- 데이터 Key 변경 금지
- Coverage 및 Overflow Gate 적용

### 19.4 Preview와 최종 Web Output이 다시 달라짐

완화:

- 동일 Renderer Build를 두 화면에서 사용
- Preview 전용 복제 컴포넌트를 만들지 않음
- Renderer Version과 Asset Manifest Snapshot 저장

### 19.5 관리자 HTML 직접 등록

관리자가 임의 HTML 문자열을 등록하는 방식은 XSS, 반응형 편차와 Slot 매핑 오류가 크다. 초기 구조에서는 승인된 Vue Renderer Registry를 권장한다.

## 20. 검토가 필요한 미확정 사항

다른 LLM 또는 개발 검토자는 다음 항목에 의견을 제시해야 한다.

1. Wizard Step 3에서 Design Spec 후보만 생성할지 Vue Template까지 사용자 요청마다 생성할지
2. 생성된 Vue Template을 사용자 Run 전용으로 둘지 Registry에 재사용할지
3. Form Template과 Renderer를 1:1, 1:N 또는 N:M으로 연결할지
4. 관리자가 Renderer를 직접 선택할지 LLM이 자동 선택할지
5. Sandbox 실행 환경으로 Vercel Sandbox 또는 별도 격리 Runner를 사용할지
6. 생성 코드의 허용 import 목록과 Component Library 범위
7. 디자인 다양성 점수 산정 방식
8. 자동 시각 QA에 사용할 Browser/Viewport와 Visual LLM
9. 이미지 생성 Asset의 저장소와 버전 정책
10. 기존 LO-FI/HI-FI Run과 신규 Renderer Run의 DB 통합 방식
11. 사용자별 생성 템플릿의 보관 기간과 비용 제한
12. 자동 생성 실패 시 기존 Registry Template으로 Fallback할지

## 21. 권장 의사결정

현 단계 권장안:

1. 전체 페이지 LO-FI/HI-FI 이미지 제거 방향은 장기 목표로 채택한다.
2. 먼저 Default Template 기반 Visual Content Editor MVP를 구현한다.
3. 초기에 LLM은 Vue 코드를 생성하지 않고 구조화된 Design Spec만 생성한다.
4. Design Spec과 Vue Renderer 방식이 안정화된 뒤 LLM Vue Template 생성을 추가한다.
5. 생성 Vue 코드는 반드시 Sandbox와 자동 QA를 거쳐 Registry에 등록한다.
6. 운영 요청마다 완전 자유 코드를 즉시 실행하지 않는다.
7. 동일 Vue Renderer를 Preview와 Final Web Output의 유일한 렌더링 Source of Truth로 사용한다.

## 22. 최종 요약

제안 구조:

```text
Admin Form Template Schema
          ↓
Visual Content Editor에서 Promo Content 입력
          ↓
LLM이 제한된 Page Design Spec 후보 생성
          ↓
실제 Vue Renderer로 Variant 비교
          ↓
필요한 Section Image Asset만 AI 생성
          ↓
선택된 Design Spec + Asset + Content Snapshot
          ↓
동일 Vue Renderer로 Final Web Output
```

확장 구조:

```text
Template Generation Contract
          ↓
LLM Vue Template 생성
          ↓
Sandbox Build
          ↓
Code/Coverage/Responsive/Visual QA
          ↓
자동 수정
          ↓
Template Registry 등록
```

이 방향은 현재 이미지 기반 디자인과 웹 출력 사이의 불일치를 제거하고, 사람이 개입하지 않는 자동 생성 목표를 유지하면서도 웹페이지의 안정성, 반응형, 콘텐츠 충실도와 접근성을 높일 수 있다.

## 23. 현재 구현 상세 분석

분석 기준은 2026-07-16 로컬 소스와 DB migration이다. 문서에 적힌 계획과 실제 구현을 혼동하지 않도록 `구현 완료`, `부분 구현`, `계획만 존재`로 구분한다.

### 23.1 화면 및 프런트엔드 구성

| 영역 | 현재 구현 | 판정 |
|---|---|---|
| Landing | Wizard, Builder, Admin 진입 화면이 분리되어 있다. | 구현 완료 |
| Promo Wizard | `prototype/promo-wizard.html/js/css` 기반의 독립 4단계 화면이다. | 구현 완료 |
| Builder/Admin | `prototype/app.js`를 중심으로 한 Vue SPA에 관리 기능과 기존 Builder 기능이 함께 있다. | 구현 완료 |
| Generated Page | `prototype/generated.js`가 Local Storage payload의 색상·폰트 값을 CSS 변수에 반영한다. | 프로토타입 |
| Visual Template Editor | 실제 웹 레이아웃 위에서 Section Item을 입력·미리보기하는 편집기는 없다. | 미구현 |

현재 Wizard Step 2는 동적 폼 입력 UX이고, Canva형 웹 캔버스 편집기가 아니다. 따라서 기존 Step 2를 폐기하기보다 입력 상태와 검증 로직을 유지한 채, 표시 계층을 `Form View`에서 `Visual Renderer View`로 확장하는 것이 적절하다.

### 23.2 관리자 Form Template 구현

현재 관리자 템플릿은 이름 때문에 시각 템플릿으로 오해할 수 있으나, 실제 역할은 **프로모션 콘텐츠 입력 스키마**다.

구현된 범위:

- Form Template 생성, 버전, 상태(`draft`, `active`, `inactive`, `archived`), 기본 템플릿 지정
- 템플릿 소유 Section 및 Section Item CRUD
- Section/Item 표시 여부, 필수 여부, 고정 위치, 사용자 순서 변경 허용
- 텍스트, 이미지, 이미지+설명, CTA 계열 입력 정의
- 이미지 입력 방식 설정과 CTA URL/UTM 관련 설정
- 템플릿 복제 및 활성화
- Section CRUD 감사 로그
- Wizard 공개 API에서 active 템플릿과 표시 가능한 Section/Item만 제공
- `configRevision`을 생성해 실행 시점 설정 변경을 추적

핵심 제약:

- HTML 구조, Vue Component, CSS Layout, 반응형 규칙은 저장하지 않는다.
- Form Template과 실제 화면 Renderer의 연결 모델이 없다.
- 현재 이름을 유지하더라도 UI에서는 `콘텐츠 폼 템플릿`으로 명시해 시각 템플릿과 구분할 필요가 있다.

### 23.3 Wizard Step 2 구현

현재 Step 2에는 다음 데이터 흐름이 구현되어 있다.

1. active Form Template 목록 조회 및 타일 선택
2. 선택된 템플릿의 Section/Item 동적 렌더링
3. 공통 프로모션 개요 입력
4. Section별 Accordion, 표시 순서 및 사용자 재정렬
5. 템플릿별 입력값과 순서 상태 유지
6. 필수값 검증
7. `formTemplate`, `configRevision`, `sectionSnapshot`, `sectionInputs`를 생성 요청에 포함
8. 기존 worker 호환을 위한 `templateContentAdapter()` 제공

이 구조는 신규 Visual Editor의 데이터 기반으로 재사용 가치가 높다. 특히 `sectionInputs`를 콘텐츠 Source of Truth로 유지하면 기존 Integrated Brief와 coverage validation을 보존하면서 렌더링 UI만 교체할 수 있다.

주의할 점:

- 사용자 정의 Section Key가 계속 추가될 수 있으므로 Renderer가 특정 `header`, `contents`, `cta`만 하드코딩하면 안 된다.
- 알려진 Section에는 전용 Component를 사용하고, 알 수 없는 Section에는 Generic Section Renderer를 제공해야 한다.
- File 직접 첨부는 입력 옵션 정의와 실제 파일 업로드·저장·보안 검증을 분리해 확인해야 한다. 현재 구조만으로 운영용 Asset Pipeline이 완성됐다고 볼 수 없다.

### 23.4 Integrated Brief, LO-FI, Final 구현

현재 생성 파이프라인은 다음과 같이 실제 연결되어 있다.

```text
Step 2 content snapshot
  -> generation prepare/run 생성
  -> n8n Integrated Brief worker
  -> LO-FI draft image 생성(여러 attempt 누적)
  -> 사용자 Confirm Draft 선택
  -> n8n Final Design worker
  -> Final Design image 저장·조회
```

구현 특성:

- Run 상태와 단계별 polling이 있다.
- LO-FI는 재생성 시 기존 시안을 유지하고 새 attempt를 추가한다.
- Confirmed Draft가 Final Design의 입력 기준이다.
- LO-FI 및 Final 결과는 이미지 URL/프록시를 통해 표시한다.
- 관리자에서 worker webhook, model, prompt 관련 설정을 관리한다.
- DB migration 011~015가 generation run과 이미지 worker 설정을 지원한다.

이는 운영 가능한 이미지 생성 파이프라인이지만, 실시간 웹 Renderer 기반 파이프라인과는 별개다. 신규 구조 도입 초기에는 삭제하지 말고 Feature Flag로 병행해야 한다.

### 23.5 현재 웹 출력 구현 수준

`api/generate-promo-page.js`는 요청 payload를 `N8N_PROMO_WEBHOOK_URL`로 전달하고 JSON 또는 HTML 응답을 반환하는 프록시다. 자체적으로 Vue 프로젝트를 생성하거나 빌드·검증·배포하지 않는다.

`prototype/generated.js`는 저장된 디자인 값으로 CSS 변수를 설정하는 로컬 데모다. 다음 기능은 현재 코드에서 확인되지 않는다.

- 생성 결과용 DB 테이블과 attempt 이력
- Vue 소스 파일 생성 및 Artifact 저장
- Vite build 실행
- 격리된 Sandbox
- import allowlist 및 보안 검사
- Desktop/Mobile 자동 Screenshot QA
- 콘텐츠 coverage/overflow/accessibility gate
- Preview URL 및 ZIP Artifact 관리
- Renderer Registry와 버전 관리

따라서 `final-design-vue-webpage-generation-development-plan-2026-07-14.md`의 Vue 코드 생성 구조는 **개발 계획**이며 현재 구현 완료 기능으로 간주하면 안 된다.

## 24. 재사용·변경·신규 개발 매트릭스

| 구분 | 대상 | 처리 방향 |
|---|---|---|
| 재사용 | Form Template/Section/Item CRUD와 버전 | 콘텐츠 스키마 계층으로 유지 |
| 재사용 | Wizard `sectionInputs`, 필수값 검증, 템플릿별 상태 | Visual Editor의 입력 상태로 연결 |
| 재사용 | `configRevision`, `sectionSnapshot` | Run 재현성과 감사 추적에 유지 |
| 재사용 | CTA URL/UTM 처리 | 실제 DOM CTA Component에 연결 |
| 재사용 | Generation Run/polling/error UI 패턴 | Design Spec·Asset·Render Run으로 확장 |
| 변경 | Wizard Step 2 Accordion 중심 화면 | 실제 Renderer Preview + 선택 Item 편집 패널로 확장 |
| 변경 | Step 3 LO-FI 이미지 후보 | Page Design Spec + Renderer Variant 후보로 교체 |
| 변경 | Step 4 Final 이미지 | 선택 Variant의 실제 반응형 웹 Preview로 교체 |
| 변경 | n8n 이미지 worker 중심 역할 | Design Spec 및 Section Asset 생성 중심으로 재구성 |
| 신규 | Renderer Registry 및 Renderer Version | Form Template과 별도 엔터티로 구현 |
| 신규 | Form Template-Renderer 연결 | 초기에는 1:N, 기본 Renderer 1개 필수 |
| 신규 | Page Design Spec Schema | LLM 출력의 구조화·검증 가능한 계약 |
| 신규 | Asset Manifest/Pipeline | 이미지 출처, 크기, focal point, safe area, 상태 관리 |
| 신규 | Sandbox Build/QA/Artifact | LLM Vue 코드 생성 단계에 필수 |

## 25. 현행 구조에서 발견된 핵심 이슈

### 25.1 Form Template과 Visual Template의 개념 충돌

하나의 엔터티에 입력 스키마와 화면 코드를 같이 넣으면 버전, 배포, 보안, 재사용 규칙이 복잡해진다. 다음처럼 분리해야 한다.

```text
Form Template = 어떤 콘텐츠를 받을 것인가
Renderer      = 그 콘텐츠를 어떤 웹 구조로 보여줄 것인가
Design Spec   = Renderer를 어떤 톤과 Variant로 표현할 것인가
```

### 25.2 전체 이미지가 현재 파이프라인의 중심

현재 Confirm Draft와 Final Design은 이미지 ID를 중심으로 연결된다. 이를 즉시 제거하면 Run API, UI 상태, n8n workflow와 기존 이력이 동시에 깨질 수 있다. 신규 `render` 파이프라인을 병행한 뒤 트래픽과 이력을 단계적으로 전환해야 한다.

### 25.3 웹 출력의 실행 안전장치 부재

현재 webhook 프록시만으로 LLM 생성 코드를 운영하면 임의 import, 외부 통신, 빌드 실패, XSS, 무한 렌더링을 통제하기 어렵다. 자유 코드 생성은 Visual Renderer MVP 이후 별도 Sandbox 단계로 미뤄야 한다.

### 25.4 Preview와 Output의 동등성 미보장

현재 Step 2 폼, LO-FI 이미지, Final 이미지, generated page가 서로 다른 표현 계층이다. 신규 구조에서는 Preview 전용 복제 UI를 만들지 말고 동일 Renderer Build를 편집 화면과 최종 출력에서 사용해야 한다.

### 25.5 동적 Section 대응

관리자가 새로운 Section과 Item을 만들 수 있으므로 생성 Renderer가 모든 스키마를 사전에 알 수 없다. `GenericSection`, `GenericTextItem`, `GenericImageItem`, `GenericCtaItem`을 기본 계약으로 제공하고, 전용 Component는 점진적으로 추가해야 한다.

## 26. 코드 기준 권장 착수 순서

1. `Renderer Registry`의 최소 데이터 계약과 Form Template 1:N 연결을 정의한다.
2. 기존 `sectionInputs`를 그대로 받는 Default Vue Renderer 한 개를 만든다.
3. Wizard Step 2에서 Accordion 입력과 Renderer Preview를 양방향 연결한다.
4. 같은 Renderer를 별도 Web Output route에서 사용해 Preview/Output 동등성을 검증한다.
5. Design Spec Schema와 제한된 Variant 생성을 추가한다.
6. Section Asset Pipeline을 추가한다.
7. 기존 LO-FI/Final 이미지 파이프라인과 A/B 운영한다.
8. 안정화 후 LLM Vue 코드 생성, Sandbox, 자동 QA를 추가한다.

첫 개발 목표는 “LLM이 다양한 Vue 코드를 생성하는 것”이 아니라 다음 한 문장을 증명하는 것이어야 한다.

> 관리자 콘텐츠 스키마로 입력한 모든 값이 동일한 Vue Renderer를 통해 편집 Preview와 최종 Web Output에 빠짐없이 동일하게 표시된다.

이 동등성이 확보된 뒤 Design Spec 다양화와 LLM 코드 생성을 추가해야 기존 LO-FI/HI-FI에서 발생했던 디자인 충실도 손실을 반복하지 않는다.
