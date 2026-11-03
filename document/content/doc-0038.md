# 프로모션 빌더 Overview 우선·템플릿 추천/구성 개발계획서

## 0. 문서 정보

- 최초 작성일: 2026-07-27
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: `프로모션 빌더(Create Promo)`
- 문서 상태: P0~P4 개발 반영 및 전체 회귀 테스트 완료
- 목표 흐름: `프로모션 개요 → 템플릿 추천·구성 → 레이아웃·디자인 → 웹 출력`
- 기준 원칙:
  - 프로모션 목적과 콘텐츠를 먼저 파악한다.
  - 템플릿 구조와 디자인 토큰의 책임을 분리한다.
  - LLM은 해석과 추천을 담당하고 서버는 정책과 유효성을 검증한다.
  - LLM 결과는 사용자 확인 전까지 실제 작업 상태에 적용하지 않는다.
  - AI가 관리자 템플릿 원본을 생성·수정하지 않는다.

### 0.1 관련 현행 구조

- 단계 정의: `prototype/wizard/wizard-flow.js`
- 프로모션 빌더 화면: `prototype/create-promo.html`
- 단계 렌더링 및 상태: `prototype/create-promo.js`
- 저장 상태: `prototype/wizard/wizard-storage.js`
- 기본 콘텐츠 모델: `prototype/wizard/wizard-content.js`
- 공개 템플릿 조회:
  - `api/wizard-form-templates-public.js`
  - `api/wizard-form-template-public.js`
- 디자인 토큰 조회: `api/design-token-sets.js`
- 섹션 자연어 구성:
  - `api/promo-section-composition-plan.js`
  - `api/promo-section-composition-validate.js`
- 프롬프트 실행 스냅샷: `api/_prompt-execution-snapshot.js`
- 프롬프트 관리: `api/_prompt-template-store.js`

### 0.2 2026-07-27 개발 반영 결과

- P0: 숫자형 Step 상태를 `overview → template → layout → output` key 기반 4단계로 전환하고 기존 세션 값을 마이그레이션했다.
- P1: 디자인 토큰 선택을 Overview에서 Layout 상단으로 이동하고 Layout 진입·Web Output 전 필수 검증을 연결했다.
- P2: 정형 입력과 자연어 입력이 동일한 `promotionOverview` 모델을 사용하도록 통합했다.
  - 자연어 분석 API: `POST /api/promo-overview-parse`
  - LLM 결과의 누락·불확실 항목과 신뢰도를 표시한다.
  - 사용자가 `분석 결과 적용`을 선택하기 전에는 실제 Overview를 변경하지 않는다.
  - 사용자 입력에 없는 CTA URL을 LLM이 생성하면 서버 정규화 단계에서 제거한다.
- P3: 활성 템플릿 추천 기능을 반영했다.
  - 추천 API: `POST /api/promo-template-recommendations`
  - Rule Base 필터와 점수를 먼저 계산하고 LLM은 서버 후보의 의미 순위만 보조한다.
  - LLM 실패 시 Rule Base 결과와 기본 템플릿으로 폴백한다.
  - Overview fingerprint가 달라지면 이전 추천을 stale로 표시하고 적용 근거에서 제외한다.
  - 관리자 템플릿 초안에서 `recommendationProfile`을 JSON으로 관리한다.
- P4: 현재 프로모션 세션 전용 `AI 구성 초안 생성`을 반영했다.
  - 구성 API: `POST /api/promo-template-composition-plan`
  - 활성 템플릿·섹션·컴포넌트 버전과 허용 Overview 경로만 사용할 수 있다.
  - 자유 CSS/HTML, 임의 URL, 신규 관리자 엔티티 생성 및 관리자 템플릿 변경을 허용하지 않는다.
  - 초안은 사용자 승인 후 현재 세션에만 적용한다.
- 신규 관리자 프롬프트 유형:
  - `promo_overview_parser`
  - `promo_template_recommender`
  - `promo_template_composer`
- 신규 DB 마이그레이션:
  - `db/migrations/043_promo_template_recommendation.sql`
  - 배포 전후 API 장애를 방지하기 위해 컬럼이 아직 없는 상태에서도 기존 템플릿 조회는 동작하도록 호환 처리했다.
- 검증 결과:
  - 전체 테스트 스위트 72개 통과
  - Create Promo 브라우저 스모크 통과
  - 관리자 기본 레이아웃 → Create Promo 통합 브라우저 테스트 통과
  - Node의 ESM 자동 판별 성능 경고 2건은 기존 비차단 경고이며 테스트 실패는 아니다.

---

## 1. 개발 목적

현재 프로모션 빌더는 디자인 토큰을 먼저 선택한 뒤 프로모션 개요를 입력한다. 사용자는 아직 무엇을 만들지 충분히 정의하지 않은 상태에서 디자인 방향부터 선택해야 한다.

To-be에서는 프로모션 목적, 대상, 혜택과 톤을 먼저 입력받고 이 정보를 기준으로 다음 작업을 수행한다.

1. 활성 템플릿 중 적합한 템플릿 추천
2. 적합한 템플릿이 없거나 사용자가 요청한 경우 AI 구성 초안 생성
3. 선택한 템플릿 또는 구성 초안에 디자인 토큰 적용
4. 레이아웃, 콘텐츠, 이미지 편집
5. 최종 웹 출력 확인

프로모션 개요는 다음 두 입력 방식을 제공한다.

- 정형 입력: 정의된 폼 필드에 직접 입력
- 자연어 입력: 사용자가 문장으로 요구사항을 입력하고 LLM이 정형 데이터로 변환

두 방식은 별도 데이터를 만들지 않고 동일한 `promotionOverview` 모델로 수렴해야 한다.

---

## 2. 범위

### 2.1 포함 범위

- Overview를 첫 단계로 이동
- 기존 디자인 토큰 단독 단계를 제거
- 디자인 토큰 선택을 레이아웃 단계로 이동
- 정형 입력/NLP 입력 탭 제공
- NLP 입력 구조화 및 사용자 확인
- Overview 유효성 검증
- 템플릿 추천 후보 필터링 및 순위 계산
- 추천 이유, 적합도, 주의사항 표시
- 전체 활성 템플릿 직접 선택 유지
- AI 구성 초안 생성
- 생성 초안의 서버 검증 및 사용자 확인
- Overview 변경에 따른 추천·AI 결과 무효화
- 기존 세션 상태 마이그레이션
- 관리자 LLM·프롬프트 관리 연동
- 계약 테스트, API 테스트, 브라우저 통합 테스트

### 2.2 제외 범위

- LLM이 신규 관리자 템플릿을 자동 등록하는 기능
- LLM이 신규 관리자 컴포넌트를 생성하는 기능
- 자유 형식 HTML, CSS, JavaScript 생성
- 관리자 템플릿 원본 자동 수정
- 필수 CTA URL, 법적 조건, 기간 등의 임의 생성
- 비활성 템플릿, 비활성 컴포넌트 사용
- 디자인 생성기 기능 변경
- 최종 프로모션 배포 파이프라인 변경

---

## 3. As-is 분석

### 3.1 현재 단계

```text
Step 1. Design Token
Step 2. Overview
Step 3. Template
Step 4. Layout
Step 5. Web Output
```

현재 단계 인덱스는 다음 로직에 직접 사용된다.

- `currentStep === 0`: 디자인 토큰
- `currentStep === 1`: Overview
- `currentStep === 2`: Template
- `currentStep === 3`: Layout
- `currentStep === 4`: Web Output

다음 항목도 단계 숫자에 의존한다.

- 이전/다음 이동
- 단계 버튼 이동
- Overview 검증
- 템플릿 준비 상태 검증
- 디자인 토큰 선택 여부 검증
- 세션 스토리지 복원
- 브라우저 테스트

따라서 화면 제목만 변경하는 방식은 허용하지 않는다.

### 3.2 현재 Overview 모델

현재 기본 상태에는 다음 항목이 존재한다.

```text
promo.title
promo.promotionPurpose
promo.promotionPurposeOther
promo.market
simpleBrief.audience
simpleBrief.campaignTone
```

템플릿 추천에 필요한 혜택, 일정, 기본 CTA, 규제 조건 등은 표준 Overview 모델로 충분히 정리되어 있지 않다.

### 3.3 현재 템플릿 추천 한계

공개 템플릿은 주로 다음 정보로 노출된다.

- ID
- templateKey
- 이름
- 설명
- 버전
- 기본 템플릿 여부

이 정보만으로는 프로모션 목적, 지역, 대상 고객, 필수 컴포넌트 적합성을 안정적으로 평가하기 어렵다.

### 3.4 현재 자연어 AI 기능과의 차이

현재 `section_composition_planner`는 선택된 단일 섹션을 대상으로 다음 작업을 수행한다.

- 등록된 컴포넌트 선택
- 컴포넌트 필드 콘텐츠 제안
- 디자인 토큰 슬롯 선택
- 섹션 내 배치 제안
- 선택 시 배경 이미지 요청

프로모션 전체 Overview를 분석해 템플릿을 추천하거나 전체 페이지 구성 초안을 만드는 기능은 현재 범위를 넘어선다. 별도의 상위 Planner가 필요하다.

---

## 4. To-be 사용자 흐름

### 4.1 최종 단계

```text
Step 1. 프로모션 개요
Step 2. 템플릿
Step 3. 레이아웃 및 디자인
Step 4. 웹 출력 미리보기
```

### 4.2 Step 1: 프로모션 개요

```text
[직접 입력] [자연어 입력]
```

#### 직접 입력

- 프로모션 제목
- 프로모션 목적
- 대상 지역
- 대상 고객
- 캠페인 톤
- 주요 혜택
- 운영 기간
- 기본 CTA 문구
- 기본 CTA URL
- 필수 고지 또는 운영 조건

필수/선택 여부는 관리자 정책과 실제 기능 범위를 기준으로 결정한다.

#### 자연어 입력

```text
신규 사용자를 대상으로 100% 충전 이벤트를 진행하고 싶어.
프리미엄한 분위기로 구성하고 게임 참가 버튼이 필요해.
```

처리 순서:

```text
자연어 입력
→ NLP 분석 요청
→ 구조화 결과 생성
→ 허용값 및 필수값 검증
→ 누락 항목 표시
→ 사용자 확인/수정
→ promotionOverview 저장
```

NLP 분석 결과는 사용자 확인 전에는 다음 단계에 사용하지 않는다.

### 4.3 Step 2: 템플릿

화면은 세 영역으로 구성한다.

```text
추천 템플릿
전체 템플릿
AI 구성 초안
```

추천 카드에는 다음 정보를 제공한다.

- 템플릿 이름
- 미리보기
- 적합도
- 추천 이유
- 포함된 핵심 섹션
- 누락되거나 추가 확인이 필요한 항목
- 템플릿 버전

기본 동작:

1. 추천 템플릿 상위 3개 표시
2. 전체 활성 템플릿 직접 선택 가능
3. 추천 실패 시 기본 템플릿과 전체 목록 제공
4. 사용자가 명시적으로 선택할 때만 AI 구성 초안 생성

### 4.4 Step 3: 레이아웃 및 디자인

```text
레이아웃 및 디자인
├─ 디자인 토큰 선택
├─ 섹션 목록
├─ 라이브 프리뷰
├─ 콘텐츠 및 속성
├─ AI 섹션 구성
└─ 이미지 생성
```

Layout 진입 시 활성 기본 디자인 토큰을 자동 선택한다. 저장된 선택이 있으면 해당 값을 우선한다.

사용자가 토큰을 변경하면 콘텐츠와 템플릿 구조는 유지하고 스타일 관련 결과만 다시 검증한다.

### 4.5 Step 4: 웹 출력 미리보기

- 선택한 템플릿 또는 AI 구성 초안
- 확정된 Overview
- 디자인 토큰 버전
- 레이아웃 수정 결과
- 콘텐츠 및 이미지

위 항목을 포함한 최종 스냅샷을 생성한다.

---

## 5. 단계 상태 모델 개선

### 5.1 숫자 인덱스 의존 제거

내부 상태의 기준을 숫자에서 키로 변경한다.

```js
const STEP_KEYS = Object.freeze({
  OVERVIEW: "overview",
  TEMPLATE: "template",
  LAYOUT: "layout",
  OUTPUT: "output",
});
```

UI 순서 계산이 필요할 때만 `STEPS.findIndex()`를 사용한다.

### 5.2 저장 버전

```text
promoPrototype.createPromo.currentStep.v3
promoPrototype.createPromo.content.v2
```

기존 데이터를 즉시 삭제하지 않고 읽기 시점에 마이그레이션한다.

### 5.3 기존 단계 변환

| 기존 인덱스 | 기존 단계 | 신규 단계 |
|---:|---|---|
| 0 | Design Token | Overview |
| 1 | Overview | Overview |
| 2 | Template | Template |
| 3 | Layout | Layout |
| 4 | Web Output | Output |

기존 `designTokenSetVersionId`는 유지한다. UI 위치만 Layout으로 이동한다.

### 5.4 뒤로 가기와 상태 보존

- Step 이동 시 Overview 입력 유지
- 직접 입력/NLP 탭 전환 시 구조화 데이터 유지
- Template에서 Overview로 돌아가 수정 가능
- Overview 변경 시 기존 추천·구성 결과를 삭제하지 않고 stale 상태로 전환
- 사용자가 유지 또는 재추천을 선택하도록 한다.

---

## 6. 표준 Overview 데이터 모델

### 6.1 제안 모델

```json
{
  "schemaVersion": 2,
  "inputMode": "structured",
  "rawNaturalLanguage": "",
  "title": "",
  "purpose": {
    "code": "",
    "other": ""
  },
  "market": [],
  "audience": [],
  "tone": [],
  "benefits": [
    {
      "type": "",
      "value": "",
      "unit": "",
      "description": ""
    }
  ],
  "schedule": {
    "startsAt": null,
    "endsAt": null,
    "timezone": ""
  },
  "primaryAction": {
    "label": "",
    "url": ""
  },
  "requiredNotices": [],
  "constraints": [],
  "confirmedAt": null
}
```

### 6.2 호환성

기존 `promo`와 `simpleBrief`를 즉시 제거하지 않는다.

1차 전환에서는 신규 `promotionOverview`를 기준으로 저장하고, 기존 API와 렌더러가 필요한 값은 어댑터에서 변환한다.

```text
promotionOverview
→ toLegacyPromoState()
→ promo + simpleBrief
```

반대 방향도 제공한다.

```text
promo + simpleBrief
→ migrateLegacyOverview()
→ promotionOverview
```

### 6.3 Overview fingerprint

템플릿 추천과 AI 구성 초안의 입력 정합성을 확인하기 위해 정규화된 Overview의 해시를 생성한다.

해시 대상에서 제외:

- `confirmedAt`
- UI 탭 상태
- 임시 오류
- 분석 진행 상태

포함:

- 목적
- 지역
- 대상
- 톤
- 혜택
- 일정
- CTA
- 고지 및 제약

---

## 7. NLP 구조화 기능

### 7.1 신규 프롬프트 유형

관리자 `LLM 및 프롬프트 관리`에서 다음 유형을 관리한다.

```text
promo_overview_parser
```

하드코딩 프롬프트 본문을 API에 포함하지 않는다. 코드에는 다음 항목만 유지한다.

- 프롬프트 유형
- 입력 변수 계약
- 출력 JSON Schema
- 보안 및 정책 검증

### 7.2 입력 변수

```json
{
  "naturalLanguage": "string",
  "allowedPurposes": [],
  "allowedMarkets": [],
  "allowedAudiences": [],
  "allowedTones": [],
  "currentOverview": {}
}
```

### 7.3 출력 계약

```json
{
  "overview": {},
  "missingInputs": [
    {
      "field": "primaryAction.url",
      "reason": "사용자가 URL을 입력하지 않았습니다."
    }
  ],
  "uncertainInputs": [
    {
      "field": "market",
      "value": "Global",
      "reason": "대상 지역이 명확하지 않습니다."
    }
  ],
  "summary": "",
  "confidence": 0
}
```

### 7.4 서버 검증

- JSON Schema 검증
- 허용된 enum 값 검증
- 텍스트 길이 제한
- URL 형식 검증
- 사용자가 입력하지 않은 URL 생성 차단
- 법적 문구 임의 생성 차단
- 프롬프트 지시문을 데이터로만 취급
- 관리자 잠금 정책 재적용

### 7.5 적용 정책

- LLM 결과는 `pendingAnalysis`에 보관
- 사용자가 확인하면 `promotionOverview`에 병합
- 빈 결과나 검증 실패 시 기존 입력 유지
- 재분석은 기존 사용자가 확정한 값을 자동 덮어쓰지 않음

---

## 8. 템플릿 추천 설계

### 8.1 추천 원칙

템플릿 추천은 다음 두 단계로 처리한다.

#### 1단계: Rule Base 후보 필터

- 템플릿 상태가 `active`
- 버전이 현재 공개 버전
- 필수 섹션과 컴포넌트가 활성 상태
- 지역 및 필수 고지 조건 충족
- 필요한 컴포넌트 역할 제공
- 잠금 정책과 사용자 편집 정책 충족
- 선택 가능한 디자인 토큰의 스타일 슬롯과 호환 가능

#### 2단계: 의미 기반 순위

- 목적 적합성
- 대상 고객 적합성
- 캠페인 톤 적합성
- 혜택 표현 적합성
- 필수 CTA 지원 여부
- 콘텐츠 밀도 적합성

Rule Base 결과가 없는 경우 LLM을 호출하지 않는다.

### 8.2 템플릿 추천 메타데이터

`wizard_form_templates`는 버전 단위 레코드이므로 다음 버전 메타데이터를 추가하는 방안을 사용한다.

```json
{
  "promotionTypes": [],
  "markets": [],
  "audiences": [],
  "tones": [],
  "supportedComponentRoles": [],
  "requiredInputs": [],
  "requiredNotices": [],
  "tags": []
}
```

권장 DB 변경:

```text
wizard_form_templates.recommendation_profile jsonb
```

관련 clone/activate 함수와 API DTO도 함께 갱신한다.

### 8.3 추천 API

```http
POST /api/promo-template-recommendations
```

요청:

```json
{
  "overview": {},
  "overviewFingerprint": "",
  "limit": 3
}
```

응답:

```json
{
  "ok": true,
  "overviewFingerprint": "",
  "recommendations": [
    {
      "templateId": "uuid",
      "templateKey": "default",
      "templateVersion": 1,
      "score": 92,
      "reasons": [],
      "warnings": [],
      "requiredConfirmations": []
    }
  ],
  "fallbackTemplateId": "uuid"
}
```

### 8.4 추천 프롬프트

관리자 프롬프트 유형:

```text
promo_template_recommender
```

LLM은 서버가 미리 필터링한 후보 ID만 선택할 수 있다. 목록에 없는 템플릿 ID를 반환하면 전체 결과를 거부한다.

### 8.5 추천 실패 처리

- LLM timeout: Rule Base 점수만 제공
- 활성 템플릿 없음: 설정에서 활성 템플릿 필요 안내
- 적합 후보 없음: 기본 템플릿 또는 AI 구성 초안 안내
- 이전 응답 도착: fingerprint 불일치 시 폐기

---

## 9. AI 구성 초안 설계

### 9.1 명칭

사용자 화면에서는 `템플릿 생성`보다 `AI 구성 초안 생성`을 사용한다.

이 결과는 관리자 템플릿이 아니라 현재 프로모션에서만 사용하는 구조 초안이다.

### 9.2 Planner 범위

Planner가 선택 가능한 대상:

- 활성 섹션 버전
- 활성 컴포넌트 버전
- 허용된 컴포넌트 필드
- 허용된 레이아웃 명령
- 선택된 디자인 토큰의 허용 스타일 슬롯

Planner가 할 수 없는 작업:

- 신규 템플릿 DB 레코드 생성
- 신규 컴포넌트 정의 생성
- 자유 CSS/HTML 반환
- 관리자 템플릿 수정
- 잠금값 변경
- URL 임의 생성

### 9.3 프롬프트 유형

```text
promo_template_composer
```

### 9.4 구성 초안 계약

```json
{
  "overviewFingerprint": "",
  "source": "ai-composition",
  "sections": [
    {
      "sectionVersionId": "uuid",
      "componentVersionIds": [],
      "contentMappings": [],
      "layoutCommands": []
    }
  ],
  "missingInputs": [],
  "warnings": [],
  "summary": ""
}
```

### 9.5 검증

- 모든 ID 존재 여부
- 활성 버전 여부
- 섹션/컴포넌트 호환성
- 필수 컴포넌트 포함 여부
- 컴포넌트 중복 정책
- 고정 위치 섹션
- 필드 필수값
- 잠금 필드
- 허용 스타일 슬롯
- 토큰 존재 여부
- CTA URL 출처
- Overview fingerprint

### 9.6 저장

1차 구현은 현재 프로모션 세션 스냅샷에 보관할 수 있다.

운영 이력과 재시도가 필요해지는 단계에서는 별도 run 저장 구조를 추가한다.

```text
promo_template_composition_runs
promo_template_composition_proposals
```

DB 저장 도입 전에도 다음 값은 반드시 유지한다.

- requestId
- overviewFingerprint
- template/component version snapshot
- promptExecutionSnapshot
- status
- error

---

## 10. 디자인 토큰 이동

### 10.1 Layout 상단 선택

기존 `renderAppearanceStep()` UI를 Layout 화면의 디자인 패널로 이동한다.

Layout 진입 순서:

```text
저장된 designTokenSetVersionId 확인
→ 없으면 활성 기본 토큰 선택
→ 토큰 버전 조회
→ 템플릿/컴포넌트 스타일 슬롯 호환성 검증
→ 편집기 스냅샷 전송
```

### 10.2 토큰 변경 영향

유지:

- Overview
- 선택한 템플릿
- 섹션 및 컴포넌트 구조
- 사용자가 등록한 콘텐츠
- CTA URL

재검증:

- 글자 크기 및 색상
- 컴포넌트 스타일 슬롯
- 섹션 배경색
- CTA 스타일
- AI 레이아웃 스타일 제안
- 토큰을 기준으로 생성한 이미지 프롬프트

### 10.3 stale 처리

이미 생성된 AI 이미지 파일을 즉시 삭제하지 않는다.

```text
기존 이미지: 유지 가능
새 토큰 기준 재생성: 선택 가능
```

토큰 버전이 다른 AI 제안 적용 시 서버에서 차단한다.

---

## 11. 무효화 및 동시성 정책

### 11.1 Overview 변경

stale 처리 대상:

- 템플릿 추천
- AI 구성 초안
- Overview 기반 섹션 콘텐츠 제안
- Overview 기반 이미지 프롬프트

유지 대상:

- 사용자 직접 입력 콘텐츠
- 확정 CTA URL
- 업로드한 이미지
- 수동 레이아웃 변경

### 11.2 템플릿 변경

- 기존 템플릿 전용 레이아웃 캐시 무효화
- 공통 sectionKey/itemKey가 동일하더라도 버전 identity 재검증
- 이전 템플릿 콘텐츠는 즉시 삭제하지 않고 전환 확인 후 병합

### 11.3 요청 경합

모든 LLM 요청에 다음 값을 포함한다.

```text
requestId
overviewFingerprint
templateIdentity
designTokenSetVersionId
createdAt
```

최신 상태와 일치하지 않는 응답은 UI에 적용하지 않는다.

---

## 12. 프런트엔드 구조 변경

### 12.1 신규 또는 분리 권장 모듈

```text
prototype/wizard/wizard-flow.js
prototype/wizard/promotion-overview.js
prototype/wizard/promotion-overview-nlp.js
prototype/wizard/template-recommendation.js
prototype/wizard/template-composition.js
prototype/wizard/design-token-selection.js
prototype/wizard/wizard-invalidation.js
```

`create-promo.js`에 모든 로직을 추가하지 않는다.

### 12.2 주요 책임

`promotion-overview.js`

- 표준 모델
- 직접 입력 변환
- legacy 변환
- fingerprint
- 검증

`promotion-overview-nlp.js`

- 분석 요청
- pending 결과
- 승인/취소
- stale 응답 차단

`template-recommendation.js`

- 추천 조회
- 후보·전체 목록 상태
- 선택
- 추천 무효화

`template-composition.js`

- AI 구성 요청
- 제안 미리보기
- 서버 검증
- 적용

`wizard-invalidation.js`

- Overview 변경
- 템플릿 변경
- 토큰 변경
- 레이아웃 revision 변경

---

## 13. 백엔드 구조 변경

### 13.1 API

```text
POST /api/promo-overview-parse
POST /api/promo-template-recommendations
POST /api/promo-template-composition-plan
POST /api/promo-template-composition-validate
```

### 13.2 공통 서비스

```text
api/_promo-overview-contract.js
api/_promo-template-recommendation.js
api/_promo-template-composition-contract.js
api/_promo-template-candidate-store.js
```

### 13.3 프롬프트 실행

모든 LLM API는 `createPromptExecutionSnapshot()`을 통해 활성 프롬프트와 모델 설정을 캡처한다.

다음 유형을 허용 목록에 추가한다.

```text
promo_overview_parser
promo_template_recommender
promo_template_composer
```

프롬프트 관리 화면에서 초안, 검증, 활성화, 롤백이 가능해야 한다.

---

## 14. DB 마이그레이션

### 14.1 필수 변경

다음 번호의 신규 마이그레이션으로 적용한다.

```text
wizard_form_templates.recommendation_profile jsonb not null default '{}'
```

함께 수정:

- 템플릿 초안 복제 함수
- 템플릿 활성화 함수
- 템플릿 조회 API
- 공개 템플릿 응답
- 템플릿 관리자 UI
- 템플릿 변경 이력 snapshot

### 14.2 프롬프트 seed

- `promo_overview_parser`
- `promo_template_recommender`
- `promo_template_composer`

각 프롬프트는 별도 lineage와 버전 수명주기를 가진다.

### 14.3 선택적 변경

AI 구성 실행 이력 저장이 필요한 경우에만 run/proposal 테이블을 추가한다. P0~P2 단계에서는 불필요한 테이블을 먼저 만들지 않는다.

### 14.4 Neon 적용 순서

```text
백업 브랜치 생성
→ 신규 마이그레이션 적용
→ 컬럼·인덱스·프롬프트 seed 확인
→ API 배포
→ 프로덕션 smoke test
```

마이그레이션은 재실행 가능한 형태로 작성한다.

---

## 15. 보안 및 정책

- NLP 원문을 시스템 지시로 취급하지 않음
- 입력 길이 제한
- 허용 enum 검증
- 자유 HTML/CSS 차단
- 관리자 잠금값 보호
- 활성 버전 ID만 허용
- CTA URL 임의 생성 차단
- 외부 URL scheme allowlist
- 프롬프트·모델 실행 스냅샷 저장
- 원문 로그에 비밀값이나 인증정보 저장 금지
- LLM 응답을 검증 없이 DB 또는 화면에 적용 금지

---

## 16. 단계별 개발 계획

### P0. 단계 상태 기반 정리

목표: 기능을 추가하기 전에 단계 번호 의존성을 제거한다.

작업:

- `currentStep`을 키 기반으로 전환
- 4단계 정의
- Overview를 첫 단계로 이동
- 기존 세션 마이그레이션
- 진행 표시 4열 대응
- 이전/다음/직접 이동 검증
- 기존 디자인 토큰 선택값 유지

완료 기준:

- 기존 저장 데이터로 접속해도 Overview부터 시작
- Overview 검증 없이 Template 진입 불가
- Template 준비 없이 Layout 진입 불가
- Web Output 기존 기능 유지

### P1. 디자인 토큰 Layout 이동

작업:

- 디자인 토큰 UI를 Layout 상단으로 이동
- 기본 토큰 자동 선택
- 토큰 미선택 상태 처리
- 토큰 변경 영향 범위 분리
- 편집기 스냅샷 동기화
- AI 요청의 토큰 버전 검증 유지

완료 기준:

- 별도 Design Token 단계 없음
- Layout에서 선택·변경 가능
- 토큰 변경 시 콘텐츠 및 템플릿 구조 유지
- 웹 출력에 선택 토큰 적용

### P2. Overview 표준 모델과 이중 입력

작업:

- `promotionOverview` 모델 추가
- legacy 어댑터
- 직접 입력 UI
- NLP 입력 UI
- `promo_overview_parser` 프롬프트와 API
- 구조화 결과 확인 UI
- 누락/불확실 항목 표시
- fingerprint 생성

완료 기준:

- 두 입력 방식이 동일 모델을 갱신
- 탭 전환 시 데이터 유실 없음
- 사용자 승인 전 NLP 결과 미적용
- CTA URL 임의 생성 차단

### P3. 템플릿 추천

작업:

- 추천 메타데이터 DB/API/Admin UI
- Rule Base 후보 필터
- 추천 점수 계약
- `promo_template_recommender`
- 상위 추천 카드
- 전체 템플릿 목록
- 기본 템플릿 fallback
- stale 추천 처리

완료 기준:

- 활성 후보만 추천
- 추천 이유와 주의사항 표시
- LLM 실패 시 Rule Base 추천 또는 기본 템플릿 제공
- Overview 변경 후 이전 추천 적용 차단

### P4. AI 구성 초안

작업:

- 전체 프로모션 구성 Planner
- 활성 섹션/컴포넌트 후보 snapshot
- plan API
- validate API
- 적용 전 미리보기
- 누락 입력 확인
- 적용 및 Undo

완료 기준:

- 관리자 템플릿 원본 변경 없음
- 임의 ID, CSS, URL 적용 차단
- 사용자 확인 후에만 적용
- 부분 실패 시 기존 콘텐츠 유지

### P5. 운영 안정화

작업:

- 브라우저 통합 테스트
- API timeout/retry
- 중복 요청 차단
- 분석 및 추천 latency 측정
- 추천 선택률 기록
- 오류 코드·로그 표준화
- 기존 문서 현행화

---

## 17. 테스트 계획

### 17.1 단위 테스트

- 단계 키 정규화
- 기존 단계 마이그레이션
- legacy Overview 변환
- 직접 입력/NLP 결과 동등성
- Overview fingerprint 안정성
- 필수값 검증
- URL 검증
- 추천 점수 정렬
- stale 응답 판정
- 토큰 변경 무효화 범위

### 17.2 API 테스트

- NLP 정상 구조화
- JSON Schema 위반
- 허용하지 않은 enum
- URL 임의 생성
- 활성 템플릿 없음
- 비활성 템플릿 반환 차단
- 후보 외 템플릿 ID 반환 차단
- fingerprint 불일치
- 프롬프트 미활성
- LLM timeout 및 fallback
- 구성 초안의 임의 컴포넌트 차단

### 17.3 브라우저 테스트

1. 직접 입력 → 추천 → 템플릿 선택 → 토큰 선택 → Web Output
2. NLP 입력 → 분석 → 수정 → 승인 → 추천
3. NLP 분석 취소
4. Overview 변경 후 추천 stale 표시
5. 추천 실패 후 전체 템플릿 선택
6. Layout에서 토큰 변경
7. 토큰 변경 후 콘텐츠 유지
8. AI 구성 초안 적용·취소·Undo
9. 새로고침 후 단계와 데이터 복원
10. 기존 v1/v2 세션 데이터 마이그레이션

### 17.4 회귀 테스트

- 관리자 템플릿 수정 반영
- 기본 레이아웃 저장/활성화
- 섹션 AI 구성
- 섹션 배경 이미지 생성
- 컴포넌트 이미지 생성
- 레이아웃 편집
- Web Output 별도 페이지
- 디자인 토큰 실제 렌더링

---

## 18. 관측 및 운영 지표

다음 이벤트를 기록한다.

```text
overview_input_mode_selected
overview_nlp_requested
overview_nlp_confirmed
overview_nlp_failed
template_recommendation_requested
template_recommendation_selected
template_manual_selected
template_composition_requested
template_composition_applied
design_token_selected
overview_changed_after_template
```

운영 지표:

- NLP 분석 성공률
- NLP 분석 후 사용자 수정 비율
- 추천 템플릿 선택률
- 수동 템플릿 선택률
- AI 구성 초안 적용률
- 평균 추천 시간
- stale 응답 발생률
- Layout 진입 후 토큰 변경률

---

## 19. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 단계 인덱스 변경 회귀 | 이동·검증 오류 | 키 기반 상태 전환 후 기능 개발 |
| 기존 세션 데이터 충돌 | 사용자 작업 유실 | 버전 마이그레이션 및 legacy 백업 |
| NLP 환각 | 잘못된 URL·조건 | Schema, allowlist, 사용자 확인 |
| 추천 정확도 부족 | 신뢰도 저하 | 템플릿 메타데이터 + Rule Base |
| LLM 실패 | 추천 불가 | 기본 템플릿·Rule Base fallback |
| Overview 수정 후 결과 불일치 | 잘못된 템플릿 적용 | fingerprint 및 stale 처리 |
| 토큰 변경 후 AI 결과 불일치 | 스타일·이미지 부조화 | 토큰 버전 재검증 |
| AI 생성 결과가 공용 템플릿 오염 | 관리자 데이터 증가 | 사용자 전용 구성 초안으로 분리 |
| 장시간 요청 | 서버리스 timeout | 단계 분리, requestId, 비동기 run 검토 |
| create-promo.js 비대화 | 유지보수 저하 | 기능별 모듈 분리 |

---

## 20. 배포 및 롤백

### 20.1 배포 순서

```text
P0 단계 모델
→ P1 토큰 이동
→ P2 NLP 입력
→ P3 추천
→ P4 구성 초안
```

각 단계는 독립 커밋과 독립 검증 게이트를 가진다.

### 20.2 기능 플래그

권장 플래그:

```text
CREATE_PROMO_OVERVIEW_V2
CREATE_PROMO_TEMPLATE_RECOMMENDATION
CREATE_PROMO_TEMPLATE_COMPOSITION
```

### 20.3 롤백

- 신규 컬럼은 nullable/default 구조로 기존 API와 호환
- 기존 공개 템플릿 API 계약 유지
- 구형 `promo + simpleBrief` 변환 어댑터 유지
- 신규 추천/구성 API 실패 시 수동 템플릿 선택으로 복귀
- 기존 디자인 토큰 값은 삭제하지 않음

---

## 21. 최종 완료 기준

- 프로모션 빌더의 첫 화면이 Overview이다.
- 직접 입력과 자연어 입력이 동일한 Overview 모델을 사용한다.
- NLP 결과는 사용자 확인 후 적용된다.
- Overview 기준으로 활성 템플릿을 추천한다.
- 추천 실패 시 수동 선택과 기본 템플릿 fallback이 동작한다.
- AI 구성 초안은 관리자 템플릿을 변경하지 않는다.
- 디자인 토큰은 Layout 단계에서 선택한다.
- 토큰 변경 시 콘텐츠와 템플릿 구조가 유지된다.
- Overview, 템플릿, 토큰 변경의 무효화 범위가 분리된다.
- 모든 LLM 기능은 관리자 프롬프트 및 모델 설정을 사용한다.
- 계약/API/브라우저 테스트가 통과한다.
- 기존 Web Output과 섹션 AI 기능에 회귀가 없다.

---

## 22. 개발 시작 전 확인 항목

1. 최종 단계 수를 4단계로 확정한다.
2. `템플릿 생성`의 사용자 명칭을 `AI 구성 초안 생성`으로 확정한다.
3. Overview의 필수 필드와 선택 필드를 확정한다.
4. 템플릿 추천 메타데이터의 관리자 입력 UI 범위를 확정한다.
5. AI 구성 초안을 1차에는 세션에만 저장할지 DB 이력까지 저장할지 확정한다.
6. 추천 및 NLP 기능 플래그 적용 여부를 확정한다.

본 계획에서는 4단계, 사용자 전용 AI 구성 초안, 관리자 프롬프트 관리 연동을 기본안으로 채택한다.
