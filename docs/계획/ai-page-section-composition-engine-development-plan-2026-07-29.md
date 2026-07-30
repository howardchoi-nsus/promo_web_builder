# AI 섹션 조합형 프로모션 페이지 생성 엔진 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-29
- 개정일: 2026-07-29
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 전 계획 / 소스코드 미반영
- 기준 문서:
  - `ai_section_composition_handoff.md`
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/create-promo-overview-first-template-recommendation-development-plan-2026-07-27.md`
  - `docs/계획/admin-llm-prompt-hardcoding-remediation-development-plan-2026-07-29.md`
- 기준 플랫폼: Vue 3 + Vite + ESM
- 기준 렌더러: `visual-editor/src/PromoPageRenderer.vue`

### 0.1 이번 개정의 핵심

초기 계획을 실제 저장소와 신규 제품 요구에 다시 대조해 다음 내용을 보정했다.

1. 프로모션 빌더 진입 시 `템플릿으로 만들기`와 `AI로 만들기`를 선택하는 이중 모드를 추가했다.
2. AI 모드의 자연어 입력, 정형 분석 결과 확인, 공용 섹션 선택, 자동 생성, Web Output 수정 흐름을 구체화했다.
3. 신규 Composition 모델을 별도로 중복 구축하지 않고 기존 Layout Snapshot을 `Composition Contract v2`로 승격하도록 변경했다.
4. 현재의 범용 컴포넌트 필드 Renderer를 유지하고, `componentKey → 전용 SFC` 강제 매핑을 제거했다.
5. 디자인 생성기용 `promo_generation_runs`와 프로모션 빌더 저장 모델을 분리했다.
6. 디자인 토큰은 템플릿 소유가 아니라 프로모션별 선택값이라는 현재 정책을 반영했다.
7. 동일 `sectionKey` 중복으로 발생하는 콘텐츠·스타일 충돌을 반영해 초기 중복 섹션을 금지했다.
8. 현재 Planner가 섹션 선택·콘텐츠 매핑까지만 실제 적용하고 자유 Layout Command와 컴포넌트 인스턴스 생성은 지원하지 않는 점을 단계에 반영했다.
9. 경고와 확인 필요 항목이 없는 안전한 구성은 자동 적용하고, 위험하거나 불완전한 구성만 사용자 승인을 받도록 보정했다.
10. 키비주얼 생성은 페이지 구조 렌더링과 분리해 체감 생성 속도를 개선하도록 했다.
11. 트랜지션 효과는 자유 CSS가 아니라 관리 가능한 Motion Preset과 Motion Token으로 제한했다.
12. Web Output Preview와 실제 운영 게시를 별도 단계로 구분했다.

### 0.2 문서 목적

이 문서는 기존 프로모션 빌더를 폐기하거나 별도의 생성기를 새로 만드는 계획이 아니다.

현재 구현된 다음 자산을 유지하면서, 프로모션 개요에 따라 AI가 페이지의 섹션과 컴포넌트를 선택·조합하는 기능을 추가하는 것이 목적이다.

- 템플릿 및 템플릿 섹션
- 섹션 컴포넌트·버전·인스턴스
- 다중 컴포넌트 필드
- 디자인 토큰 세트·버전
- 레이아웃 명령과 Layout Spec
- 섹션 AI 구성 및 이미지 Asset Job
- 공통 Vue 프로모션 렌더러
- 관리자 및 프로모션 빌더의 공통 편집기

핵심 목표는 다음과 같다.

> AI는 허용된 섹션·컴포넌트·필드·레이아웃 명령·디자인 토큰을 조합한 구조화된 구성안을 만들고, 시스템의 공통 Vue 렌더러가 이를 실제 HTML DOM과 CSS로 출력한다.

## 1. 실행 요약

### 1.1 제품 진입 흐름

```text
프로모션 빌더 진입
  ├─ 템플릿으로 만들기
  │    └─ 현재 프로모션 빌더 흐름 유지
  │
  └─ AI로 만들기
       → 자연어 설명 입력
       → AI 개요 분석
       → 정형 입력 폼으로 확인·수정
       → 공용·필수 섹션 확인
       → AI로 프로모션 생성하기
       → Composition Proposal 생성·검증
       → 안전한 결과 자동 적용 또는 사용자 승인
       → 공통 Vue Renderer로 구조 즉시 출력
       → 키비주얼·이미지 비동기 생성 및 자동 적용
       → Web Output Preview
       → 자연어 부분 수정 또는 Live Preview 수동 편집
       → Builder Document 저장
       → 별도 운영 게시 승인
```

### 1.2 핵심 구현 원칙

1. AI가 자유 HTML, 자유 CSS, JavaScript 이벤트 핸들러를 생성하지 않는다.
2. AI는 현재 활성 상태인 버전과 허용 목록 안에서만 선택한다.
3. HTML과 퍼블리싱은 AI가 아니라 공통 Vue 컴포넌트와 Renderer가 담당한다.
4. 별도의 경쟁 모델을 만들지 않고 기존 Layout Snapshot을 `Composition Contract v2`로 승격한다.
5. Preview, Layout Editor, Web Output은 동일 Renderer와 동일 정규화 규칙을 사용한다.
6. 이미지 생성은 페이지 구성과 분리된 비동기 Asset Job으로 유지한다.
7. 금액, 기간, 법적 조건, CTA URL 등 사실 정보는 AI가 임의로 확정하지 않는다.
8. 템플릿은 제거하지 않고 검증된 `Composition Preset`으로 재정의한다.
9. 기존 컴포넌트 Registry와 디자인 토큰 Registry를 중복 구축하지 않는다.
10. 기본 렌더링은 현재의 범용 필드 Renderer를 유지하고 특수 UI만 별도 Renderer로 확장한다.
11. 디자인 토큰은 템플릿이 아니라 프로모션별 Appearance 선택값으로 관리한다.
12. 확인 필요 항목이 없는 안전한 결과는 자동 적용하고, 위험하거나 불완전한 결과만 승인받는다.
13. 동일 섹션 중복은 페이지 인스턴스 ID 전환이 완료되기 전까지 금지한다.
14. Motion은 관리자 등록 Preset과 Token만 사용하고 `prefers-reduced-motion`을 준수한다.
15. 대표 흐름의 Vertical Slice를 검증한 후 적용 범위를 확장한다.

## 2. 현행 구현 분석

### 2.1 이미 구현된 기반

| 영역 | 현행 구현 | 계획에서의 처리 |
|---|---|---|
| 섹션 컴포넌트 | `wizard_item_components` | 재사용 |
| 컴포넌트 버전 | `wizard_item_component_versions` | 재사용 |
| 컴포넌트 인스턴스 | `wizard_content_section_component_instances` | 재사용 |
| 다중 필드 | 컴포넌트 버전별 필드 계약 | 재사용·검증 보완 |
| 디자인 토큰 | `promo_design_token_sets`, 버전, 활성화 | 재사용 |
| 이미지 작업 | `promo_section_design_asset_jobs` 및 필드 Asset Job | 재사용 |
| 섹션 구성 AI | `promo-section-composition-plan` | 재사용·역할 조정 |
| 템플릿 추천 | `promo-template-recommendations` | 재사용 |
| 템플릿 구성 AI | `promo-template-composition-plan` | 페이지 구성으로 확장 |
| 구조 검증 | JSON Schema, 컴포넌트 ID, 콘텐츠 매핑, 레이아웃 명령 검증 | 재사용·페이지 정책 추가 |
| 렌더링 | `PromoPageRenderer.vue` | 단일 기준 Renderer로 유지 |
| 편집 | 공통 Editor Core와 Layout 명령 | 재사용 |
| Builder 상태 | `localStorage`의 Wizard Content와 Layout Snapshot | Contract v2로 확장 후 서버 저장 |
| Web Output | `localStorage` Snapshot 기반 별도 화면 | Preview로 유지, 운영 게시와 분리 |

### 2.2 신규로 필요한 핵심 기능

다음 기능은 기존 요소를 연결하는 페이지 단위 계층으로 추가해야 한다.

- 템플릿 모드와 AI 모드의 분리 진입 화면
- AI 모드 자연어 입력과 정형 분석 결과 확인 화면
- 관리자 공용 섹션 라이브러리 및 선택 정책
- 템플릿 선택을 사용자에게 노출하지 않는 AI Base Preset
- 페이지 전체 Composition Proposal
- 섹션 선택·제외·순서를 검증하는 정책
- 컴포넌트 및 필드 콘텐츠 출처 추적
- 안전 결과 자동 적용과 확인 필요 결과 승인 정책
- `Composition Contract v2` Snapshot과 revision
- 프로모션 빌더 전용 Document와 Version 저장
- 적용 시점의 버전·fingerprint 재검증
- 구성안 단위 변경 이력 및 롤백
- 렌더링 이후 시각·기하 검증
- 자연어 부분 수정 Operation
- Motion Preset과 Motion Token 관리
- Web Output Preview와 실제 게시의 분리

### 2.3 중복 구축을 금지하는 영역

다음 항목은 신규 시스템으로 다시 만들지 않는다.

- 별도의 Component Registry
- 별도의 Design Token Registry
- 별도의 React Renderer
- 관리자 전용 Renderer
- 프로모션 빌더 전용 Renderer
- AI가 출력하는 HTML 문자열 저장소
- 페이지 구성과 결합된 동기 이미지 생성기
- 디자인 생성기 `promo_generation_runs`에 Builder 문서를 종속시키는 저장 구조
- 모든 관리자 생성 컴포넌트에 전용 Vue SFC를 요구하는 구조

## 3. 용어와 책임

| 용어 | 정의 |
|---|---|
| Composition Contract v2 | 기존 Layout Snapshot을 확장해 섹션, 콘텐츠, 레이아웃, 토큰, 자산, AI 메타데이터를 함께 표현하는 구조화 계약 |
| Composition Preset | 검증된 초기 페이지 골격으로 사용하는 기존 템플릿 |
| AI Base Preset | AI 모드에서 사용자에게 템플릿 선택을 요구하지 않으면서 Header·동적 콘텐츠 영역·필수 고지·Footer를 제공하는 시스템 골격 |
| 공용 섹션 | 특정 템플릿에만 속하지 않고 관리자 정책에 따라 여러 AI Composition에서 재사용 가능한 활성 섹션 |
| 섹션 | 페이지를 구성하는 독립적인 콘텐츠 영역 |
| 섹션 컴포넌트 | 섹션 내부에서 조합되는 재사용 UI 단위 |
| 컴포넌트 필드 | 텍스트, 이미지, CTA 등 컴포넌트 내부의 입력·표현 속성 |
| 컴포넌트 인스턴스 | 특정 섹션에 배치된 컴포넌트 버전의 사용 객체 |
| Layout Spec | 섹션과 컴포넌트의 위치·크기·정렬·가시성 상태 |
| 디자인 토큰 바인딩 | 필드 또는 스타일 슬롯에 허용된 토큰을 연결한 값 |
| Composition Proposal | AI가 생성했지만 아직 적용되지 않은 페이지 구성안 |
| Renderer | Composition을 실제 Vue VNode 및 HTML DOM으로 변환하는 공통 출력 계층 |
| Web Output Preview | 현재 Snapshot을 별도 화면에서 확인하는 미리보기 |
| Published Promotion | 별도 저장·URL·권한·캐시·게시 승인을 거친 운영 페이지 |
| Motion Preset | 관리자가 허용한 트랜지션 종류와 Motion Token 조합 |

## 4. 목표 아키텍처

```text
Promotion Builder Entry
  ├─ Template Mode → Current Wizard
  └─ AI Mode
        │
        ▼
Natural-language Brief
        │
        ▼
Overview Normalizer
  - 사용자 입력 보존
  - AI 추론 구분
  - 확인 필요 항목 표시
        │
        ▼
Structured Overview Review
  - 필드 수정
  - 누락 정보 확인
  - 금액·기간·조건 확정
        │
        ▼
Shared Section Policy Resolver
  - Header/Footer
  - T&C/Legal
  - Market-required sections
        │
        ▼
Page Composition Planner
  - AI Base Preset
  - 섹션 선택/제외/순서
  - 기존 컴포넌트 인스턴스 선택/노출/순서
  - 필드 콘텐츠 매핑
  - 허용 Layout Variant 선택
  - Token Slot 선택
  - Motion Preset 선택
  - Asset Request 생성
        │
        ▼
Composition Validator
  - Schema
  - 활성 버전
  - 고정/필수 섹션
  - 콘텐츠 출처
  - Layout/Token
  - CTA/URL 보안
        │
        ▼
Composition Normalizer
  - 기본값 보정
  - Composition Contract v2 생성
  - 기존 Snapshot 호환 유지
        │
        ▼
PromoPageRenderer.vue
  ├─ Builder Live Preview
  ├─ Admin Layout Editor
  └─ Web Output
        │
        ▼
Builder Document / Version Storage
        │
        ├─ Separate Image Asset Jobs
        ├─ Natural-language Operations
        └─ Manual Editor Operations
```

### 4.1 템플릿의 목표 역할

템플릿은 완성된 HTML이 아니라 다음을 제공하는 선택 가능한 Preset으로 취급한다.

- 권장 섹션 조합
- 고정 Header/Footer
- 필수 법적·안내 섹션
- 초기 컴포넌트 인스턴스
- 기본 섹션 순서
- 검증된 Layout Spec

Planner는 두 가지 모드를 지원하도록 설계한다.

| 모드 | 설명 | 초기 적용 |
|---|---|---|
| `template` | 사용자가 활성 템플릿을 선택하고 현재 Wizard에서 콘텐츠·레이아웃을 수정 | 현행 유지 |
| `ai-base-preset` | 시스템 AI Base Preset과 공용 섹션 정책을 기반으로 AI가 페이지를 구성 | P1~P3 |
| `library-based` | 활성 공용 섹션·컴포넌트 라이브러리에서 페이지를 새로 조합 | 인스턴스 ID 전환 이후 |

템플릿 모드는 현재 상태를 유지한다. AI 모드는 사용자에게 템플릿 선택을 요구하지 않지만 내부적으로 다음 골격을 갖는 `AI Base Preset`을 사용한다.

```text
AI Base Preset
  Header
  Dynamic Content Area
  Market-required Section Area
  T&C / Legal
  Footer
```

`library-based` 자유 조합은 공용 섹션 정책, 페이지 인스턴스 ID, 서버 저장, 롤백이 안정화된 후 Feature Flag로 활성화한다.

### 4.2 AI 모드 화면 흐름

#### 진입 화면

프로모션 빌더 진입 시 다음 두 선택지를 카드 형태로 제공한다.

- `템플릿으로 만들기`: 현재 기능과 데이터 흐름을 그대로 사용한다.
- `AI로 만들기`: 자연어 설명을 기반으로 프로모션 페이지를 생성한다.

선택 모드는 URL 또는 Builder Document 상태에 저장한다. 모드 전환 시 상대 모드의 초안을 삭제하지 않고 별도로 보존하며, 현재 편집 내용을 대체해야 할 경우 사용자 확인을 받는다.

#### 자연어 입력

AI 모드는 자연어 입력을 우선 표시한다. 초기에는 무제한 대화형 Agent보다 다음 범위로 제한한다.

1. 자연어 설명 입력
2. AI 분석
3. 누락 정보에 대한 제한된 추가 질문
4. 정형화된 결과 확인

#### 정형 분석 결과 확인

분석 결과는 수정 가능한 입력 필드로 표시한다.

- 프로모션 제목
- 리드 텍스트
- 목적
- 대상 고객
- 마켓/지역
- 캠페인 분위기
- 핵심 혜택
- 기간
- 중요 조건
- 참고사항

각 필드에는 `사용자 입력`, `AI 요약`, `AI 추론`, `확인 필요`, `관리자 고정` 상태를 표시한다. 확인이 필요한 금액·기간·조건이 남아 있으면 자동 생성 전에 사용자에게 수정 또는 확인을 요구한다.

#### 공용·필수 섹션 확인

AI 생성 전에 Header, Footer, T&C, Legal 등 공용 섹션을 보여준다.

```text
[필수] Header              상단 고정
[필수] Footer              하단 고정
[정책] T&C                 마켓·프로모션 유형에 따라 필수
[선택] Responsible Gaming  관리자 정책에 따라 선택 가능
```

사용자 선택보다 관리자 정책이 우선한다. 필수·고정 섹션은 해제하거나 이동할 수 없고, AI는 잠긴 콘텐츠를 변경할 수 없다.

### 4.3 관리자 공용 섹션 관리

기존 섹션 버전 관리 구조를 재사용하되 다음 메타데이터를 추가한다.

```json
{
  "scope": "shared",
  "sectionRole": "terms",
  "selectionPolicy": "required-by-market",
  "fixedPosition": "bottom",
  "allowedMarkets": ["KR"],
  "allowedPromotionPurposes": ["event"],
  "aiEditable": false,
  "duplicatePolicy": "forbidden"
}
```

관리자에서 다음 항목을 관리한다.

- 섹션 이름·설명·역할
- 공용/템플릿 전용 범위
- 활성 버전
- 필수·선택 정책
- 고정 위치
- 사용 가능 마켓과 프로모션 유형
- 포함된 컴포넌트 인스턴스
- 잠긴 콘텐츠와 레이아웃
- AI 편집 허용 범위
- 허용 Layout Variant
- 이미지 생성 허용 대상
- 디자인 토큰 스타일 슬롯
- Motion Preset 허용 범위
- 중복 정책

### 4.4 자동 생성 진행 상태

`AI로 프로모션 생성하기`는 하나의 장시간 HTTP 요청으로 처리하지 않는다. 페이지 구성과 자산 작업의 상태를 분리해 표시한다.

| 상태 | 사용자 표시 | 재시도 단위 |
|---|---|---|
| `analyzing_overview` | 프로모션 내용을 분석하고 있습니다 | Overview |
| `resolving_policies` | 필수 섹션과 정책을 확인하고 있습니다 | Policy |
| `composing_page` | 섹션과 컴포넌트를 구성하고 있습니다 | Composition |
| `validating_composition` | 구성 결과를 검증하고 있습니다 | Composition |
| `render_ready` | 편집 가능한 화면이 준비되었습니다 | 해당 없음 |
| `generating_assets` | 키비주얼과 이미지를 생성하고 있습니다 | 개별 Asset |
| `partial_ready` | 일부 이미지 생성이 완료되지 않았습니다 | 실패 Asset |
| `ready` | 프로모션 생성이 완료되었습니다 | 해당 없음 |
| `failed` | 프로모션 구성을 완료하지 못했습니다 | 실패 단계 |

`render_ready`가 되면 이미지가 완료되지 않았어도 사용자에게 편집 화면을 제공한다.

## 5. Composition Contract v2

### 5.1 기존 Snapshot 승격

현재 프로모션 빌더에는 이미 다음 구조를 가진 Layout Snapshot이 존재한다.

- `formTemplate`
- `sectionSnapshot`
- `sectionInputs`
- `sectionOrder`
- `designSpec`
- `assets`
- `layoutIdentity`
- `layoutRevision`

신규 Composition을 별도의 경쟁 모델로 추가하지 않는다. 기존 Snapshot을 `Composition Contract v2`로 승격하고 AI 메타데이터, Appearance, Motion, revision을 추가한다.

```json
{
  "contractVersion": 2,
  "compositionMeta": {
    "compositionId": "uuid",
    "documentId": "uuid",
    "revision": 1,
    "mode": "ai-base-preset",
    "overviewFingerprint": "sha256",
    "proposalId": "uuid",
    "sourceTemplateId": "uuid",
    "sourceTemplateVersion": 1,
    "promptTemplateVersionId": "uuid",
    "model": "configured-model",
    "reasoningSummary": "핵심 혜택을 먼저 전달하도록 소개 섹션을 상단에 배치"
  },
  "appearance": {
    "designTokenSetVersionId": "uuid",
    "motionEnabled": true,
    "motionPresetSetVersionId": "uuid"
  },
  "content": {
    "formTemplate": {},
    "sectionSnapshot": [
      {
        "sectionId": "uuid",
        "sectionKey": "promotionIntro",
        "sectionVersion": 1,
        "fixedPosition": null,
        "isRequired": true,
        "items": [
          {
            "id": "definition-instance-uuid",
            "itemKey": "titleDescription",
            "componentVersionId": "uuid",
            "fields": []
          }
        ]
      }
    ],
    "sectionInputs": {
      "promotionIntro": {
        "titleDescription": {
          "fields": {
            "title": "여름 신규 고객 충전 이벤트",
            "description": "신규 고객을 위한 특별 충전 혜택"
          }
        }
      }
    },
    "sectionOrder": ["promotionIntro"]
  },
  "provenance": {
    "promotionIntro.titleDescription.fields.title": {
      "source": "ai-derived",
      "sourceOverviewPath": "title",
      "confirmationRequired": false
    },
    "promotionIntro.titleDescription.fields.description": {
      "source": "ai-inferred",
      "sourceOverviewPath": "mainOffer",
      "confirmationRequired": true
    }
  },
  "designSpec": {
    "sectionStyles": {},
    "itemStyles": {},
    "visibility": {}
  },
  "motionSpec": {
    "sections": {},
    "items": {}
  },
  "assets": {
    "contractVersion": 1,
    "items": {},
    "requests": []
  },
  "validation": {
    "status": "pending",
    "errors": [],
    "warnings": []
  }
}
```

### 5.2 관리자 정의와 페이지 상태의 구분

`wizard_content_section_component_instances`의 인스턴스는 관리자 섹션 정의에 포함된 인스턴스다. AI가 생성한 페이지의 편집 인스턴스와 구분한다.

| 구분 | 의미 |
|---|---|
| 정의 인스턴스 | 관리자 활성 섹션 버전에 포함된 컴포넌트 인스턴스 |
| 페이지 인스턴스 | 특정 Builder Document에서 정의 인스턴스를 참조해 배치한 사용 객체 |

초기 Contract v2는 기존 `sectionKey.itemKey` 경로를 유지한다. 동일 섹션 중복과 동일 Item 반복은 금지한다. 자유 조합 단계에서는 다음 ID를 도입한다.

```text
sectionKey
  → pageSectionInstanceId

sectionKey.itemKey
  → pageSectionInstanceId.pageComponentInstanceId
```

페이지 인스턴스 ID 전환 전에는 같은 `sectionKey`를 두 번 배치하지 않는다.

### 5.3 ID 정책

- DB의 섹션·컴포넌트·토큰 정의와 버전은 기존 UUID를 참조한다.
- 초기 Vertical Slice는 기존 `sectionKey`, `itemKey`, `fieldKey`를 호환 키로 유지한다.
- 페이지 인스턴스 ID는 서버가 할당하며 AI가 자유 생성하지 않는다.
- 배열 위치, DOM index, CSS Selector를 영구 식별자로 사용하지 않는다.
- 인스턴스 ID 전환 시 과거 `sectionKey.itemKey` Snapshot을 읽는 Adapter를 제공한다.

### 5.4 Source of Truth

- 원본: 승인된 `Composition Contract v2` Snapshot
- 파생 상태: Vue VNode, HTML DOM, CSS Variables, Preview
- 별도 자산: 이미지 Blob과 Asset Job 결과
- 편집 상태: 현재 revision에 적용되는 Content·Layout·Motion operation
- 관리자 원본: 활성 섹션·컴포넌트·토큰·Motion Preset 버전

HTML 문자열은 캐시나 게시 산출물로 보관할 수 있지만 원본 데이터로 사용하지 않는다.

## 6. HTML 생성과 퍼블리싱 방식

### 6.1 책임 분리

AI가 생성하는 것은 DOM 문자열이 아니라 DOM을 구성하기 위한 구조화된 명령이다.

| 주체 | 책임 |
|---|---|
| AI Planner | 섹션·컴포넌트 선택, 순서, 콘텐츠 매핑, Variant와 토큰 슬롯 제안 |
| Validator | 존재 여부, 버전, 정책, URL, 필수값, Layout 및 Token 검증 |
| Normalizer | 누락된 기본값 적용, ID 생성, Renderer 입력 형태 통일 |
| Vue Renderer | Component Tree를 Vue VNode와 실제 HTML DOM으로 변환 |
| 범용 필드 Renderer/CSS | 컴포넌트 필드 종류별 태그, 반응형, 상태, 접근성, 기본 퍼블리싱 품질 |
| 디자인 토큰 | 색상, 타이포그래피, 간격, Radius, Shadow 등 브랜드 표현 |
| Layout Engine | 위치, 크기, 정렬, 반응형 변환 |
| Web Output | 승인된 동일 Composition을 사용자 페이지로 출력 |

### 6.2 범용 필드 Renderer

현재 관리자에서 만든 다중 필드 컴포넌트를 코드 추가 없이 출력할 수 있도록 기본 Renderer는 `componentKey`가 아니라 필드 정의를 순회한다.

```js
const fieldRenderers = {
  text: TextFieldRenderer,
  image: ImageFieldRenderer,
  cta: CtaFieldRenderer
};
```

기본 처리 흐름:

```text
Component Version
  → fields[]
  → fieldKind
  → Field Renderer
  → Vue VNode
  → HTML DOM
```

특수 UI가 필요한 경우에만 `rendererKey`와 검증된 Vue Renderer를 선택적으로 등록한다.

```json
{
  "rendererKey": "generic-fields",
  "rendererVariant": "title-visual-cta"
}
```

Renderer는 다음 원칙을 따라야 한다.

- 알 수 없는 `fieldKind` 또는 `rendererKey`는 임의 HTML로 대체하지 않고 오류나 안전한 Fallback을 표시한다.
- 관리자에서 생성한 일반 컴포넌트는 신규 Vue SFC 없이 범용 Renderer로 출력할 수 있어야 한다.
- 컴포넌트 필드는 정의된 계약을 통해서만 전달한다.
- `v-html`을 기본 출력 수단으로 사용하지 않는다.
- CTA 동작은 허용된 action type과 URL scheme만 사용한다.
- Preview, Layout Editor, Web Output은 동일한 범용·특수 Renderer Registry를 사용한다.

### 6.3 신규 UI가 필요한 경우

현재 Registry에 없는 UI는 AI가 직접 생성하지 않는다.

예를 들어 새로운 캐러셀이나 토너먼트 랭킹 표가 필요하면 다음 절차를 거친다.

1. 일반 텍스트·이미지·CTA 조합은 관리자가 필드 기반 컴포넌트로 정의한다.
2. 범용 Renderer 지원 범위를 벗어난 캐러셀·랭킹 표 등만 개발자가 특수 Renderer로 구현한다.
3. `rendererKey`, 필드·스타일 슬롯·접근성 계약을 등록한다.
4. 계약 테스트와 시각 검증을 통과한다.
5. 활성 버전으로 전환한다.
6. 이후 AI 후보 목록에 포함한다.

### 6.4 시맨틱 HTML 정책

현재 단순 `textType`만으로 모든 제목 계층을 정확히 결정하기 어렵기 때문에 필드 정의에 시맨틱 역할을 추가한다.

```json
{
  "fieldKey": "title",
  "fieldKind": "text",
  "textType": "title",
  "semanticRole": "section-title",
  "allowedTags": ["h2"]
}
```

기본 정책:

- 페이지 메인 제목: `h1`, 페이지당 최대 1개
- 섹션 제목: `h2`
- 하위 제목: `h3`
- 설명: `p`
- 탐색 링크: `a`
- 페이지 상태를 변경하는 동작: `button`

AI는 태그 문자열을 직접 선택하지 않고 등록된 `semanticRole`을 가진 컴포넌트만 선택한다.

### 6.5 Web Output와 게시 성공 기준

- Builder Preview와 Web Output의 DOM 의미 구조가 동일하다.
- 동일 Composition과 토큰 버전은 동일한 시각 결과를 만든다.
- 임의 HTML/CSS 없이 등록된 컴포넌트만 출력한다.
- 모바일·태블릿·데스크톱에서 가로 Overflow가 없다.
- Web Output Preview가 현재 Builder revision을 표시할 수 있다.
- 운영 게시가 도입되면 게시 URL에서 Composition revision을 추적할 수 있다.

현재 범위에서 `Web Output`은 별도 화면 Preview를 의미한다. 외부 사용자가 접근하는 영구 게시 URL, CDN 캐시, 접근 제어, 게시 취소는 별도 Publisher 단계로 다룬다.

## 7. AI 권한과 콘텐츠 안전 정책

### 7.1 콘텐츠 출처

모든 AI 생성 필드에는 다음 provenance 중 하나를 기록한다.

| 값 | 의미 | 자동 적용 |
|---|---|---|
| `user-supplied` | 사용자가 직접 입력 | 가능 |
| `admin-locked` | 관리자가 템플릿·컴포넌트에 고정 | 변경 금지 |
| `ai-derived` | 사용자 입력을 요약·재작성 | 정책에 따라 가능 |
| `ai-inferred` | 입력에 없던 내용을 추론 | 확인 필요 |
| `system-default` | 시스템 기본값 | 가능 |

### 7.2 AI가 임의 확정하면 안 되는 정보

- 프로모션 금액과 보너스 비율
- 이벤트 시작·종료 일자
- 지급 조건과 참가 자격
- 법적 고지와 책임 문구
- CTA URL
- 외부 브랜드·라이선스 정보

입력에 없는 값은 빈 값, 확인 필요 상태 또는 관리자가 정의한 안전한 기본값으로 반환한다.

### 7.3 AI가 선택할 수 있는 범위

- 활성 섹션 버전
- 활성 컴포넌트 버전
- 노출 가능한 선택 필드
- 허용된 섹션 순서
- 허용된 Layout Variant와 Layout Command
- 컴포넌트가 허용한 스타일 슬롯
- 선택된 디자인 토큰 세트의 토큰
- 이미지 생성이 허용된 대상 필드

### 7.4 금지 범위

- Raw HTML, CSS, JavaScript
- DB에 없는 ID
- 비활성 버전
- 잠긴 콘텐츠·레이아웃 변경
- 관리자가 허용하지 않은 컴포넌트 추가
- 임의 외부 이미지 URL
- 임의 이벤트 핸들러
- 허용 목록 밖의 CTA action

## 8. 이미지 생성 연계

### 8.1 Planner의 역할

페이지 구성 Planner는 실제 이미지를 생성하지 않고 다음 요청만 만든다.

- 이미지 필요 여부
- 대상 섹션 또는 컴포넌트 필드
- 이미지 역할: `key-visual`, `decorative`, `icon`, `component-visual`
- 등록 콘텐츠에서 추출한 시각적 주제
- 안전 영역과 레이아웃 방향
- 선택된 배경색과 디자인 토큰 참조

### 8.2 Asset Job의 역할

- 기존 관리자 활성 프롬프트와 실행 설정 사용
- 이미지 생성 Provider 호출
- Blob 저장
- 상태·lease·재시도 관리
- 결과 크기와 형식 검증
- 승인된 대상에 URL 적용

페이지 구성에 성공하고 이미지 생성만 실패하면 Composition은 유지하고 해당 Asset Job만 다시 실행한다.

### 8.3 적용 순서

```text
Composition Proposal 생성
  → 구조 Preview
  → 안전한 결과 자동 적용 또는 사용자 승인
  → 이미지 Asset Job 생성
  → 작업별 Polling
  → 성공 자산 자동 적용
  → 실패 자산만 재시도
```

### 8.4 Motion과 트랜지션

AI가 자유 CSS Animation을 생성하지 않는다. 관리자에서 등록한 Motion Preset과 Motion Token만 선택한다.

초기 Preset:

- `none`
- `fade-in`
- `fade-up`
- `slide-left`
- `slide-right`
- `scale-in`
- `staggered-reveal`

```json
{
  "preset": "fade-up",
  "durationToken": "motion.duration.normal",
  "easingToken": "motion.easing.standard",
  "delayToken": "motion.delay.short",
  "repeat": false
}
```

정책:

- `prefers-reduced-motion`에서는 `none` 또는 최소 효과로 전환한다.
- Header, Footer, T&C, Legal은 기본적으로 Motion을 사용하지 않는다.
- 반복·점멸·과도한 이동 효과를 금지한다.
- Preview와 Web Output은 동일 Motion Spec을 사용한다.
- 사용자가 페이지 전체 Motion을 끌 수 있어야 한다.

Motion Preset은 디자인 토큰의 duration·easing·delay 값을 참조한다. 디자인 토큰에 없는 임의 시간이나 easing 문자열은 AI가 만들지 않는다.

관리 모델 후보:

```text
promo_motion_presets
  id
  preset_key
  name
  status
  created_at
  updated_at

promo_motion_preset_versions
  id
  preset_id
  version
  status
  config_json
  change_note
  created_at
```

### 8.5 체감 생성 속도

구조와 이미지 생성을 분리해 사용자가 이미지 모델을 기다리지 않고 페이지를 확인하게 한다.

```text
Overview 분석
  → Composition 생성
  → Vue Renderer로 구조 즉시 출력
  → 이미지 위치에 Skeleton 표시
  → 이미지 작업 병렬 실행
  → 완료 자산부터 자동 적용
```

속도 목표는 이미지 생성 시간을 줄이는 것이 아니라 `첫 편집 가능 화면까지의 시간`을 줄이는 것이다.

측정 지표:

- `time_to_overview_review`
- `time_to_composition_preview`
- `time_to_first_editable_output`
- `time_to_all_assets_ready`
- 자연어 수정 Operation 적용 시간

### 8.6 자연어 부분 수정

생성 이후의 자연어 수정은 전체 Composition 재생성이 아니라 제한된 Operation을 반환한다.

초기 Operation:

- `update-field`
- `set-visibility`
- `move-section`
- `move-component`
- `change-layout-variant`
- `change-token-binding`
- `change-motion-preset`
- `request-asset-regeneration`

```json
{
  "baseRevision": 3,
  "operations": [
    {
      "type": "update-field",
      "targetInstanceId": "uuid",
      "fieldKey": "title",
      "previousValueHash": "sha256",
      "value": "여름 첫 충전 혜택"
    }
  ],
  "summary": "프로모션 제목을 더 짧게 수정"
}
```

적용 전에 다음 내용을 Diff로 표시한다.

- 수정 대상
- 기존 값
- 변경 값
- 적용 이유
- 영향을 받는 섹션·자산

`baseRevision`이 현재 Builder Document revision과 다르면 자동 적용하지 않고 재검토를 요구한다.

## 9. 검증 체계

### 9.1 구조 검증

- `schemaVersion` 지원 여부
- 중복 ID
- 정의되지 않은 속성
- 필수 속성 누락
- 배열 개수 제한

### 9.2 도메인 검증

- 섹션·컴포넌트·필드 버전 존재 여부
- 활성 상태 여부
- 필수 섹션 존재 여부
- Header/Footer 고정 위치
- 초기 단계의 동일 `sectionKey` 중복 금지
- 페이지 인스턴스 ID 전환 후 섹션 중복 허용 개수
- 컴포넌트 최소·최대 인스턴스 수
- 필수 필드와 선택 필드
- 잠금 정책
- 마켓·프로모션 유형별 T&C·Legal 정책

### 9.3 콘텐츠 검증

- 출처와 원본 Overview path
- 글자 수 제한
- 필수 확인 항목
- CTA URL 명시 여부
- 금액·기간·법적 조건의 사용자 입력 근거
- 사용자가 입력한 줄바꿈 보존

### 9.4 레이아웃·토큰 검증

- 허용 Layout Command
- 좌표·크기 범위
- 기존 컴포넌트 간 충돌
- 활성 디자인 토큰 버전
- 허용 style slot과 token category 일치
- 모바일 Stack 정책
- Overflow 및 최소 터치 영역
- 허용 Motion Preset과 Motion Token
- `prefers-reduced-motion` 대체 정책

### 9.5 보안 검증

- URL scheme 및 host allowlist
- 임의 Script·event handler 금지
- 외부 Asset URL 검증
- 사용자 HTML 입력 escape
- 서버 적용 시 인증·권한 재검증

### 9.6 렌더링 후 검증

JSON 검증만으로 다음 문제를 찾기 어렵기 때문에 실제 Renderer 결과를 검증한다.

- 텍스트 겹침
- 화면 밖 요소
- 숨겨진 CTA
- 모바일 가로 스크롤
- 색상 대비
- 초점 이동 순서
- 이미지와 텍스트 안전 영역

자동 복구는 허용된 Layout Command 안에서 제한적으로 수행하고, 콘텐츠 사실값은 자동 수정하지 않는다.

## 10. 저장 및 데이터 모델

### 10.1 권장 저장 단위

- 사용자 원본 Overview
- 정규화 Overview 및 fingerprint
- Composition Proposal
- Proposal validation 결과
- 승인된 Composition Snapshot
- 적용 revision
- 참조한 템플릿·섹션·컴포넌트·토큰 버전
- 사용 모델·프롬프트 버전·실행 설정
- 변경 Operation
- Asset Job 참조

### 10.2 신규 테이블 후보

정확한 Migration은 P0 데이터 모델 검토 후 확정한다.

```text
wizard_content_sections 확장 후보
  composition_scope
  section_role
  composition_policy jsonb

promo_builder_documents
  id
  document_key
  mode
  status
  current_revision
  created_by
  created_at
  updated_at

promo_builder_composition_proposals
  id
  document_id
  request_id
  overview_fingerprint
  source_template_id
  source_template_version
  contract_version
  proposal_snapshot
  validation_json
  status
  prompt_template_version_id
  idempotency_key
  created_at
  updated_at

promo_builder_document_versions
  id
  document_id
  proposal_id
  revision
  contract_version
  snapshot_json
  snapshot_hash
  change_note
  applied_at
  created_at

promo_builder_document_operations
  id
  document_id
  base_revision
  applied_revision
  operation_type
  target_instance_id
  operation_json
  source
  created_at

promo_motion_presets
  id
  preset_key
  name
  status
  created_at
  updated_at

promo_motion_preset_versions
  id
  preset_id
  version
  status
  config_json
  change_note
  created_at
```

`promo_generation_runs`는 디자인 생성기의 비동기 실행 상태이므로 Builder Document의 소유 엔티티로 사용하지 않는다. 섹션 이미지 Asset Job은 필요할 경우 `document_id`, `document_revision`, `target_instance_id`를 별도 참조하도록 확장한다.

초기 P1에서는 localStorage의 기존 Snapshot과 Contract v2를 병행할 수 있다. P2부터 서버 Document 저장을 기준으로 전환하고 localStorage는 작업 중 캐시와 장애 복구 용도로 축소한다.

### 10.3 Migration 원칙

- 기존 템플릿·섹션·컴포넌트 데이터를 초기화하지 않는다.
- 기존 프로모션 결과를 일괄 변환하지 않는다.
- 신규 Composition을 사용하는 실행만 새 테이블에 저장한다.
- 기존 실행은 호환 Adapter로 계속 열 수 있어야 한다.
- 기존 `sectionKey.itemKey` Snapshot을 Contract v2로 읽는 Adapter를 제공한다.
- 문서 저장 API는 소유권, 인증, revision, idempotency를 검증한다.
- Snapshot과 Operation JSON 크기 제한을 정의한다.
- Migration 전후 API 응답 호환 테스트를 작성한다.
- Production 적용 전 DB 백업 또는 Neon branch에서 검증한다.

## 11. API와 프롬프트 관리

### 11.1 API 방향

기존 템플릿 구성 API를 중복 구현하지 않고 역할을 확장하거나 명확한 Page Composition API로 승격한다.

권장 엔드포인트:

```text
POST /api/promo-page-composition-proposals
GET  /api/promo-page-composition-proposals?proposalId=...
POST /api/promo-page-composition-apply
GET  /api/promo-builder-documents?documentId=...
GET  /api/promo-page-composition-versions?documentId=...
POST /api/promo-page-composition-rollback
POST /api/promo-page-composition-operations
```

최종 명칭은 기존 `promo-template-composition-plan`의 호환성과 호출처를 분석한 후 결정한다.

### 11.2 프롬프트 유형

신규 또는 확장 프롬프트는 관리자 `LLM 및 프롬프트 관리`에서 관리한다.

| 프롬프트 유형 | 역할 |
|---|---|
| `promo_template_recommender` | Overview에 적합한 Preset 추천 |
| `promo_template_composer` | 선택된 Preset 안에서 섹션·컴포넌트·콘텐츠 구성 |
| `promo_page_composer` | AI Base Preset과 공용 섹션 정책을 이용한 페이지 구성 |
| `section_composition_planner` | 단일 섹션 내부 구성 및 레이아웃 제안 |
| `promo_composition_editor` | 자연어 수정 요청을 제한된 Composition Operation으로 변환 |

프롬프트 문구와 실행 설정은 관리자에서 관리하지만 Structured Output Schema와 Operation allowlist는 서버 코드에서 강제한다. `promo_composition_editor`는 현재 Snapshot 전체를 자유롭게 재작성하지 않고 대상 후보, 현재 revision, 허용 Operation만 입력받는다.

소스코드에는 다음만 유지한다.

- 보안 정책
- JSON Schema
- 허용 목록
- 최대 개수·크기 등 실행 안전 한계
- 관리자 설정이 없을 때의 실패 안전 기본값

브랜드 지침, 카피 방향, 이미지 분위기, 선호 Variant와 같은 조정 가능한 Harness는 관리자에서 관리한다.

## 12. 단계별 개발 계획

## P0. 계약 및 현행 정합성 확정

### 목표

신규 개발 전에 현재 Snapshot과 목표 Contract v2의 경계를 확정하고 중복 Source of Truth를 방지한다.

### 작업

1. 템플릿 추천·템플릿 구성·섹션 구성 호출 흐름을 하나의 시퀀스로 문서화한다.
2. `PromoPageRenderer`가 실제로 소비하는 Snapshot 필드를 목록화한다.
3. 섹션·컴포넌트·필드·토큰·Layout Spec의 ID와 버전 관계를 확정한다.
4. 기존 Layout Snapshot을 기반으로 `Composition Contract v2` Schema를 작성한다.
5. 정의 인스턴스와 페이지 인스턴스의 역할을 구분한다.
6. 초기에는 동일 `sectionKey`와 `itemKey` 중복을 금지한다.
7. 고정·필수·선택 섹션 및 마켓별 Legal 정책을 정의한다.
8. 콘텐츠 provenance와 확인 필요 정책을 확정한다.
9. 범용 필드 Renderer와 특수 Renderer의 경계를 확정한다.
10. 기존 `promo-template-composition-plan`을 확장할지 AI Base Preset 전용 API로 분리할지 결정한다.
11. Builder Document, Version, Proposal, Operation의 DB Migration과 롤백 방법을 확정한다.
12. Web Output Preview와 운영 게시의 범위를 명확히 분리한다.

### 완료 기준

- 현재 Snapshot을 대체하지 않고 승격하는 Contract v2가 승인된다.
- 기존 API와 신규 책임의 경계가 문서화된다.
- `promo_generation_runs`와 Builder Document가 분리된다.
- 동일 섹션 중복이 초기 범위에서 차단된다.
- 디자인 토큰이 프로모션별 Appearance 값으로 정의된다.
- 대표 Vertical Slice와 Fixture가 확정된다.
- P1 구현 전에 해결해야 할 미확정 정책이 없다.

### 검증

- Schema Fixture 정적 테스트
- 현재 Contract v1 Snapshot의 v2 읽기·쓰기 호환 테스트
- 현재 활성 템플릿 1개의 Contract v2 변환 테스트
- 존재하지 않는 ID·비활성 버전·잠금 위반 거부 테스트
- 중복 `sectionKey`·`itemKey` 거부 테스트
- 범용 필드 Renderer Fixture 테스트

## P1. AI 모드 진입·개요 확인·공용 섹션 정책

### 목표

템플릿 모드를 변경하지 않고 AI 모드의 입력·확인 흐름과 관리자 공용 섹션 정책을 구축한다.

### 범위

- 프로모션 빌더 진입 모드 선택
- 기존 자연어 Overview 분석 재사용
- 정형 분석 결과 수정 화면
- 콘텐츠 provenance와 확인 필요 표시
- 공용 섹션 관리자 메타데이터
- Header, Footer, T&C, Legal 선택 정책
- AI Base Preset 정의
- 실제 페이지 자동 조합은 P2에서 진행

### 작업

1. 진입 화면에 `템플릿으로 만들기`, `AI로 만들기` 선택 카드를 추가한다.
2. 템플릿 모드는 현재 Wizard 상태와 호출 흐름을 변경하지 않는다.
3. AI 모드는 자연어 입력을 첫 화면으로 표시한다.
4. 현재 Overview Parser 결과를 수정 가능한 정형 필드로 표시한다.
5. 사용자 입력, AI 요약, AI 추론, 확인 필요 상태를 필드별로 표시한다.
6. 금액·기간·조건이 입력에 없으면 확인 필요 상태로 유지한다.
7. 모드별 초안을 별도로 보존하고 전환 시 대체 확인을 제공한다.
8. 섹션 정의에 `scope`, `sectionRole`, `selectionPolicy`, 마켓, AI 편집, Motion 정책을 추가한다.
9. 관리자에서 공용 섹션을 생성·버전 관리·활성화할 수 있게 한다.
10. AI Base Preset에 Header, 동적 콘텐츠 영역, Legal 영역, Footer를 정의한다.
11. 사용자에게 공용·필수 섹션을 확인시키되 관리자 필수 정책을 우선 적용한다.

### 완료 기준

- 템플릿 모드의 기존 기능과 저장 상태에 회귀가 없다.
- AI 모드에서 자연어 분석 결과를 수정할 수 있다.
- 사용자가 입력하지 않은 사실값이 자동 확정되지 않는다.
- Header/Footer 고정 정책이 해제되지 않는다.
- 마켓 정책상 필요한 T&C·Legal이 자동으로 필수 처리된다.
- 공용 섹션의 비활성 버전은 AI 후보에 포함되지 않는다.

### 디버깅 Gate

- 모드 전환 및 상태 보존 테스트
- Overview Parser 계약·브라우저 테스트
- 분석 결과 수정·재분석 fingerprint 테스트
- 공용 섹션 CRUD·활성 버전 테스트
- 마켓·프로모션 유형별 섹션 정책 테스트
- 템플릿 모드 브라우저 회귀 테스트

P1 Gate가 통과해야 P2로 진행한다.

## P2. AI Base Preset Composition Vertical Slice

### 목표

AI Base Preset과 기존 활성 컴포넌트 인스턴스를 이용해 Composition Proposal을 만들고 공통 Renderer에서 즉시 Preview한다.

### 범위

- 활성 디자인 토큰 세트 중 AI가 1개 선택
- AI Base Preset 1개
- 공용·콘텐츠 섹션 4개 내외
- 현재 등록된 컴포넌트 인스턴스만 사용
- 필수·고정 컴포넌트 유지
- 선택 컴포넌트의 노출·순서 결정
- 신규 페이지 컴포넌트 인스턴스 생성은 제외
- 자유 Layout Command 제외
- 등록된 Layout Variant와 Token Slot만 선택
- 이미지 생성은 제외하고 Asset Request만 생성

### 작업

1. AI Base Preset과 공용 섹션 후보를 Planner 입력 Snapshot으로 정규화한다.
2. Structured Output에 섹션 순서, 선택 컴포넌트, 필드 매핑, Layout Variant, Token Slot, Motion Preset, Asset Request를 추가한다.
3. Overview fingerprint와 후보 Snapshot fingerprint를 저장한다.
4. Composition Contract v2 Validator와 Normalizer를 구현한다.
5. 기존 Snapshot을 Contract v2로 확장하는 Adapter를 구현한다.
6. 필수·고정 컴포넌트는 반드시 유지하고 선택 컴포넌트만 노출·순서를 변경한다.
7. 디자인 토큰 세트는 템플릿이 아니라 `appearance.designTokenSetVersionId`에 기록한다.
8. 구성 이유, AI 추론값, 확인 필요 항목을 Preview에 표시한다.
9. 경고와 확인 필요 항목이 없으면 자동 적용하고 다음 화면으로 이동한다.
10. 확인 필요 항목이 있으면 Diff와 승인 버튼을 표시한다.
11. Vue Renderer로 구조를 먼저 출력하고 이미지 영역은 Skeleton으로 표시한다.

### 완료 기준

- AI 결과에 자유 HTML, 자유 CSS, JavaScript가 없다.
- 필수·고정 컴포넌트가 정확히 한 번 유지된다.
- 선택 컴포넌트는 허용 정책에 따라 노출 또는 비노출된다.
- Registry에 존재하지만 선택되지 않은 컴포넌트를 강제로 모두 배치하지 않는다.
- title, lead text, description 등 주요 Overview 매핑이 누락되지 않는다.
- 동일 `sectionKey`가 중복되지 않는다.
- 동일 Composition이 Builder Preview와 Layout Editor에서 동일하게 보인다.
- 검증 실패 결과는 적용되지 않는다.

### 디버깅 Gate

- 계약 테스트
- API Handler 테스트
- 2·3개 이상 컴포넌트 구성 테스트
- 필수·선택·잠금 컴포넌트 정책 테스트
- 자동 적용과 승인 필요 분기 테스트
- Token Slot 및 Motion Preset 검증 테스트
- 브라우저 Smoke Test
- Desktop·Tablet·Mobile Preview 비교

P2 Gate가 통과해야 P3로 진행한다.

## P3. Builder Document·페이지 인스턴스·적용 이력

### 목표

AI Composition을 서버에 저장하고 페이지 단위 컴포넌트 조립, 재검증, 롤백을 지원한다.

### 작업

1. `promo_builder_documents`, Proposal, Version, Operation 저장 구조를 추가한다.
2. 기존 localStorage Snapshot은 작업 중 캐시와 장애 복구 용도로 축소한다.
3. 서버가 `pageSectionInstanceId`, `pageComponentInstanceId`를 할당한다.
4. 기존 `sectionKey.itemKey` Snapshot을 읽는 호환 Adapter를 구현한다.
5. 페이지 전용 컴포넌트 인스턴스의 추가·제거·순서를 지원한다.
6. 필수·고정·잠금 컴포넌트의 제거를 차단한다.
7. 적용 API에서 Overview fingerprint를 다시 비교한다.
8. 섹션·컴포넌트·토큰·Motion Preset 활성 버전을 다시 검증한다.
9. 관리자 잠금과 Legal 정책을 적용 시점에 다시 검증한다.
10. 적용을 원자적 transaction으로 처리한다.
11. 현재 revision과 제안 기준 revision 불일치를 거부한다.
12. 이전 revision으로 롤백하는 기능을 추가한다.
13. 적용 이력에 사용자, 프롬프트, 모델, 이유를 기록한다.
14. 인증, 문서 소유권, idempotency key를 검증한다.

### 완료 기준

- 생성 후 섹션·컴포넌트·토큰 정책이 변경되면 오래된 Proposal 적용이 거부된다.
- 중복 Apply가 발생하지 않는다.
- 적용 실패 시 현재 Composition이 유지된다.
- 이전 revision으로 복구할 수 있다.
- 새로고침 후에도 승인된 결과가 동일하게 복원된다.
- 정의 인스턴스와 페이지 인스턴스가 혼동되지 않는다.
- 기존 Contract v1 Snapshot을 계속 열 수 있다.

### 디버깅 Gate

- Migration 및 rollback SQL 테스트
- Transaction rollback 테스트
- 동시 적용 테스트
- stale fingerprint/revision 테스트
- 잠금 정책 변경 후 적용 거부 테스트
- 인증·문서 소유권·idempotency 테스트
- Contract v1 호환 로드 테스트
- 컴포넌트 추가·제거·순서·잠금 테스트
- 브라우저 저장·새로고침·복구 테스트

## P4. 이미지·Motion·자연어 수정·선택적 자유 조합

### 목표

페이지 구조를 현재 이미지 Pipeline과 연결하고 자연어 부분 수정 및 제한된 공용 섹션 자유 조합을 지원한다.

### 작업

1. Composition의 `assetRequests`를 기존 Asset Job 요청으로 변환한다.
2. 섹션 Key Visual과 컴포넌트 필드 이미지 대상을 구분한다.
3. 활성 관리자 프롬프트와 실행 설정을 사용한다.
4. 이미지 작업 상태를 대상 섹션·필드에 표시한다.
5. 실패 이미지 작업만 재시도한다.
6. 구조 Preview 후 이미지 작업을 병렬로 실행하고 완료 자산부터 자동 적용한다.
7. Motion Preset과 Token을 관리자에서 관리한다.
8. Preview와 Web Output에 동일 Motion Spec을 적용한다.
9. `prefers-reduced-motion` 대체 동작을 제공한다.
10. 자연어 수정 요청을 전체 재생성이 아닌 Operation으로 변환한다.
11. Operation 적용 전에 대상, 기존 값, 변경 값, 영향을 Diff로 표시한다.
12. 수동 Live Preview 편집과 자연어 수정이 동일 Document revision을 사용한다.
13. 비고정 공용 섹션의 선택·제외·순서 변경을 허용한다.
14. 페이지 인스턴스 ID 기반 중복 섹션 정책과 최대 개수를 검증한다.
15. `library-based` 구성은 Feature Flag 뒤에서 제한적으로 검증한다.

### 완료 기준

- 이미지 실패가 Composition 적용 상태를 실패로 바꾸지 않는다.
- 이미지가 정확한 대상 섹션 또는 컴포넌트 필드에 적용된다.
- Header/Footer와 필수 법적 섹션은 이동·삭제되지 않는다.
- 허용되지 않은 섹션 중복이 차단된다.
- AI가 자유 Animation CSS를 생성하지 않는다.
- Motion 비활성화와 `prefers-reduced-motion`이 동작한다.
- 자연어 수정 시 관계없는 섹션과 이미지를 재생성하지 않는다.
- 자연어 수정과 수동 편집의 revision 충돌이 감지된다.

### 디버깅 Gate

- 이미지 성공·실패·재시도 테스트
- 비동기 Polling 중 페이지 재진입 테스트
- 섹션 삭제 후 늦게 도착한 이미지 결과 거부 테스트
- Motion Preset allowlist와 Reduced Motion 테스트
- 자연어 Operation Schema·Diff·Apply 테스트
- 자연어 수정과 수동 편집 동시성 테스트
- Builder Preview와 Web Output Motion 동등성 테스트
- Feature Flag 비활성 상태 회귀 테스트

## P5. 운영 품질 및 게시 확장

### 목표

페이지 단위 AI 구성 기능을 운영 가능한 수준으로 고도화하고 실제 게시 기능의 도입 여부를 검토한다.

### 작업

- Undo/Redo와 저장 revision 연계
- 시각·기하 자동 검증
- 접근성 검증
- A/B Composition Variant
- 프롬프트·모델·토큰 버전별 품질 지표
- 실패 유형별 관측성 Dashboard
- 구 Schema Version Migration
- 운영 게시 URL·권한·캐시·게시 취소 정책
- 게시 revision과 Builder current revision 비교
- 게시 전 최종 검수 Gate

### 완료 기준

- 부분 수정 시 전체 페이지를 재생성하지 않는다.
- AI 변경 전후 차이를 사용자가 확인할 수 있다.
- 렌더링 오류와 정책 위반이 추적 가능하다.
- 과거 Composition을 현재 Renderer에서 열거나 명시적으로 Migration할 수 있다.
- 운영 게시를 도입하는 경우 게시 revision을 추적하고 이전 게시본으로 복구할 수 있다.

## 13. 테스트 전략

### 13.1 계약 테스트

- Composition JSON Schema
- `additionalProperties: false`
- 모든 컴포넌트 버전 ID 후보 제한
- 콘텐츠 provenance
- Layout Command allowlist
- token slot/category 일치
- CTA action과 URL

### 13.2 API 테스트

- Proposal 생성
- Builder Document 생성·조회
- Provider 오류
- 잘못된 Structured Output
- 검증 오류
- 중복 요청
- Apply와 rollback
- 인증·권한
- idempotency와 revision 충돌

### 13.3 Renderer 테스트

- Fixture Composition 렌더링
- 필수·선택 필드
- 필드 노출/비노출
- 줄바꿈
- 토큰 적용
- 반응형 Stack
- 알 수 없는 fieldKind·rendererKey Fallback
- 시맨틱 제목 계층
- Motion Preset과 Reduced Motion

### 13.4 브라우저 통합 테스트

```text
프로모션 빌더 진입
  → AI 모드 선택
  → 자연어 Overview 입력
  → 정형 분석 결과 수정
  → 공용·필수 섹션 확인
  → AI로 프로모션 생성하기
  → 구조 Preview 확인
  → 이미지 비동기 자동 적용
  → 자연어 부분 수정
  → Layout Editor 수동 수정
  → Builder Document 저장
  → Web Output Preview 확인
```

필수 Viewport:

- Desktop: 1440px
- 콘텐츠 기준 경계: 1280px
- Drawer 경계: 1023px와 1024px
- Tablet 경계: 980px
- Mobile: 768px와 390px

### 13.5 회귀 기준

- 기존 템플릿 선택 흐름 유지
- 템플릿 모드와 AI 모드의 상태 분리
- 수동 편집 흐름 유지
- 기존 저장 프로모션 열기 유지
- Admin Layout Editor와 Builder Preview 동작 동일
- Web Output과 Preview의 주요 DOM·시각 결과 동등

## 14. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 기존 Snapshot과 신규 Composition 중복 | Source of Truth 불명확 | 기존 Snapshot을 Contract v2로 승격하고 경쟁 모델을 만들지 않음 |
| 모든 componentKey에 전용 SFC 요구 | 관리자 생성 컴포넌트의 동적 출력 불가 | 범용 fieldKind Renderer 유지, 특수 UI만 rendererKey 사용 |
| 디자인 생성기 Run과 Builder 결합 | 소유권·생명주기 혼선 | Builder Document를 별도 엔티티로 저장 |
| 동일 sectionKey 중복 | 콘텐츠·스타일·AI 상태 충돌 | 페이지 인스턴스 ID 전환 전 중복 금지 |
| 모드 전환 중 초안 손실 | 사용자 작업 유실 | 모드별 Draft 분리, 대체 전 확인 |
| AI가 프로모션 사실을 창작 | 운영·법적 위험 | provenance와 confirmationRequired 강제 |
| 비활성 또는 오래된 버전 적용 | 잘못된 렌더링 | Apply 시점 재검증 |
| Renderer 분기 | Preview/Web Output 불일치 | Vue 공통 Renderer만 사용 |
| 자유 CSS/HTML 생성 | 보안·디자인 붕괴 | Schema와 Registry allowlist |
| 너무 큰 단일 LLM 호출 | 지연·실패·비용 증가 | 페이지 구성과 이미지 생성 분리 |
| 콘텐츠 길이로 레이아웃 붕괴 | UI 회귀 | 길이 제한, Variant 정책, 렌더 후 검사 |
| 템플릿 없는 자유 조합 | 필수 섹션 누락 | 초기에는 Preset 기반, 자유 조합은 Feature Flag |
| 이미지 생성 지연 | 결과 확인까지 대기 증가 | 구조 먼저 렌더링, Asset Job 병렬 처리 |
| 과도한 Motion | 접근성·성능 저하 | Motion Preset, Reduced Motion, 반복 금지 |
| 자연어 수정의 과도한 영향 | 관계없는 영역 회귀 | 제한된 Operation, Diff, revision 검사 |
| Schema 변경 | 과거 결과 로드 실패 | schemaVersion과 Migration Adapter |
| 운영 DB Migration 실패 | 서비스 장애 | Neon branch 검증, transaction, rollback SQL |

## 15. 배포 및 롤백

### 15.1 Feature Flag

다음 단계별 Flag를 권장한다.

- `PROMO_PAGE_COMPOSITION_PROPOSAL_ENABLED`
- `PROMO_PAGE_COMPOSITION_APPLY_ENABLED`
- `PROMO_PAGE_COMPOSITION_LIBRARY_MODE_ENABLED`
- `PROMO_BUILDER_AI_MODE_ENABLED`
- `PROMO_PAGE_COMPOSITION_MOTION_ENABLED`
- `PROMO_PAGE_COMPOSITION_NL_EDIT_ENABLED`

### 15.2 점진 배포

1. 내부 관리자 계정
2. 기본 템플릿 1개
3. 테스트용 프로모션
4. 제한된 사용자 그룹
5. 전체 사용자

### 15.3 롤백

- Flag를 비활성화하면 기존 템플릿 선택 흐름으로 돌아간다.
- 이미 적용한 Composition은 이전 revision으로 복원한다.
- 신규 테이블은 기존 테이블을 대체하지 않으므로 초기 롤백에서 삭제하지 않는다.
- Renderer Adapter 실패 시 기존 Snapshot Adapter를 사용한다.

## 16. 운영 관측성

다음 지표를 기록한다.

- Proposal 생성 성공률과 지연
- Overview 분석 완료 시간
- 첫 Composition Preview 표시 시간
- 첫 편집 가능 화면 표시 시간
- 전체 Asset 준비 시간
- Schema·도메인 검증 실패율
- 자동 보정 발생률
- 사용자 승인·거절·재생성 비율
- 적용 후 수동 수정 횟수
- 섹션·컴포넌트별 선택 빈도
- 이미지 Asset Job 성공·실패·재시도율
- 자연어 Operation 성공·거부·충돌 비율
- Motion Preset 선택과 Reduced Motion 적용 비율
- Preview와 Web Output 렌더 오류
- 사용 프롬프트·모델·토큰 버전

AI의 자유도가 높아질수록 “생성 성공”보다 “승인 후 수정량”을 주요 품질 지표로 사용한다.

## 17. 구현 착수 전 확정 사항

P0에서 다음 항목을 확정해야 한다.

1. AI Base Preset Planner를 기존 `promo_template_composer` 확장으로 구현할지 `promo_page_composer`로 분리할지
2. 페이지 인스턴스 ID 전환과 `library-based` 모드의 최초 활성화 시점
3. 공용 섹션의 필수·고정·중복 정책을 어느 관리자 화면에서 관리할지
4. AI 추론 콘텐츠 중 자동 적용 가능한 범위
5. 구조 Preview 직후 이미지를 자동 생성할지 별도 이미지 생성 확인을 받을지
6. Builder Document의 사용자·조직 소유권 모델
7. 운영 게시 기능을 본 계획에 포함할지 후속 프로젝트로 분리할지
8. 렌더링 후 시각 검증의 자동화 범위
9. 특수 Renderer 등록과 검수 책임

별도 결정이 있기 전까지 권장 기본값은 다음과 같다.

- 기존 `promo_template_composer`를 호환 확장하되 AI Base Preset 모드를 명시한다.
- 초기 AI 모드는 `ai-base-preset`만 활성화한다.
- AI 추론 사실 정보는 확인 필요로 표시한다.
- 경고·확인 필요가 없는 결과는 자동 적용하고, 그 외 결과는 사용자 승인을 받는다.
- 구조를 먼저 출력하고 이미지는 비동기로 생성한다.
- Composition revision은 디자인 생성기 Run이 아니라 별도 Builder Document에 연결한다.
- 동일 섹션 중복은 페이지 인스턴스 ID 전환 전까지 금지한다.
- 범용 필드 Renderer를 기본으로 유지한다.

## 18. 최종 완료 정의

다음 조건을 모두 만족해야 본 계획의 핵심 개발이 완료된 것으로 본다.

1. 프로모션 빌더에서 템플릿 모드와 AI 모드를 선택할 수 있다.
2. 템플릿 모드의 현재 기능과 저장 흐름이 유지된다.
3. AI 모드에서 자연어 설명을 입력하고 정형 분석 결과를 수정할 수 있다.
4. 사용자가 공용·필수 섹션을 확인할 수 있고 관리자 필수 정책이 우선 적용된다.
5. AI가 활성 섹션·컴포넌트·토큰·Motion Preset만 사용해 구성안을 만든다.
6. AI 결과에 자유 HTML, 자유 CSS, 임의 Script가 없다.
7. 구성안이 서버 검증을 통과해야만 Preview된다.
8. 안전한 구성은 자동 적용되고 확인 필요 구성은 사용자 승인을 요구한다.
9. 공통 범용 Vue Renderer가 실제 HTML DOM과 Web Output Preview를 생성한다.
10. Builder Preview, Admin Layout Editor, Web Output이 동일 Renderer를 사용한다.
11. 기존 Layout Snapshot이 Contract v2 Source of Truth로 승격된다.
12. 적용 시점에 revision, fingerprint, 활성 버전, Legal·잠금 정책을 재검증한다.
13. Builder Document와 변경 이력이 저장되고 롤백할 수 있다.
14. 이미지 생성 실패가 구성 결과를 손상시키지 않으며 실패 작업만 재시도할 수 있다.
15. 구조가 이미지보다 먼저 출력되어 이미지 생성 중에도 편집할 수 있다.
16. 자연어 수정이 제한된 Operation으로 적용되고 Live Preview 수동 편집과 revision을 공유한다.
17. Motion은 허용 Preset만 사용하고 Reduced Motion을 지원한다.
18. 계약·API·Renderer·브라우저 회귀 테스트가 통과한다.

## 19. 결론

목표 시스템은 AI가 임의의 웹페이지 코드를 작성하는 생성기가 아니다.

> 템플릿 모드는 현재의 안정적인 제작 흐름을 유지하고, AI 모드는 자연어로 분석한 Overview와 관리자 공용 섹션 정책을 기반으로 검증된 섹션 컴포넌트, 컴포넌트 필드, 디자인 토큰, Motion Preset을 조합한다. 공통 Vue Renderer가 이 Composition Contract v2를 실제 HTML과 CSS로 출력한다.

이 구조는 AI 자유도를 통제하면서도 기존 완성형 템플릿 추천보다 다양한 페이지 구성을 제공한다. 동시에 관리자가 컴포넌트와 토큰을 통제할 수 있고, 사용자는 Preview와 편집기를 통해 결과를 수정할 수 있다.

개발은 기존 Registry, Layout Snapshot, 범용 Renderer를 새로 만드는 방식이 아니다. 기존 Snapshot을 Contract v2로 승격하고 AI 모드 진입, 공용 섹션 정책, Composition Proposal, Builder Document, 검증, 버전 관리, 비동기 Asset, 자연어 Operation 계층을 단계적으로 추가해야 한다.

구조가 준비되는 즉시 화면을 렌더링하고 이미지는 별도 Asset Job으로 생성함으로써 이미지 생성 시간 자체와 무관하게 사용자가 첫 결과를 확인하고 편집할 수 있는 시간을 단축한다.
