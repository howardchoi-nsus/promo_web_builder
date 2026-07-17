# AI 활용 전략 및 Admin–Wizard–Visual Editor 데이터 경계

- 최초 작성일: 2026-07-17
- 보강일: 2026-07-17
- 최초 작성: Claude
- 보강 목적: 다른 LLM이나 개발자가 추가 구두 설명 없이 현재 구조, 데이터 소유권, AI 적용 범위와 다음 구현 순서를 판단할 수 있도록 기준을 명확히 한다.
- 상태: 전략 및 아키텍처 기준 확정 / Wizard 사용 로그와 AI Design Spec 생성은 미구현
- 대상 프로젝트: promo_web_builder
- 기준 구현: main 브랜치의 Visual Editor P1 안정화 및 Wizard Form Template API

## 1. 이 문서가 해결하는 질문

이 문서는 다음 질문에 대한 기준 답변이다.

1. Admin Page, Promo Wizard Step 2와 Visual Editor는 각각 무엇을 소유하는가?
2. Admin에서 만든 템플릿이 Wizard에 어떻게 전달되는가?
3. Wizard 사용자가 입력한 값이나 Visual Editor에서 편집한 값을 Admin 템플릿에 다시 반영해야 하는가?
4. 템플릿 정의 변경 이력, Wizard 사용 이력과 AI 실행 Snapshot은 어떻게 구분하는가?
5. AI는 어느 단계에 적용하고 어떤 단계에는 적용하지 않는가?
6. 다음 LLM이나 개발자가 어떤 순서와 완료 기준으로 구현해야 하는가?

핵심 답변은 다음과 같다.

> Admin은 재사용 가능한 템플릿 정의를 관리한다. Wizard는 활성 템플릿을 읽기 전용으로 사용한다. Wizard 입력과 Visual Editor 결과는 실행 데이터로 저장하며 Admin 템플릿에 자동 역반영하지 않는다.

## 2. 현재 시스템 요약

### 2.1 기존 생성 파이프라인

기존 파이프라인은 다음 순서로 구성된다.

~~~text
Wizard Content
  → Integrated Brief
  → LO-FI 이미지
  → Final Design 이미지
  → 별도 Web Output
~~~

LO-FI와 Final Design이 이미지 생성 모델 산출물이므로 실제 웹페이지와 Source of Truth가 달라질 수 있다. 이미지에는 올바르게 보이지만 실제 DOM에는 반영되지 않거나, 반대로 실제 콘텐츠 계약이 이미지에서 누락되는 문제가 발생할 수 있다.

신규 방향은 이미지 전체 페이지를 최종 결과로 취급하지 않고, 구조화된 콘텐츠와 Design Spec을 동일 Renderer에 전달해 Preview와 Web Output을 생성하는 것이다.

### 2.2 현재 구현된 주요 구성요소

- Admin Page
  - Wizard Form Template 생성, 복제, 수정, 활성화와 보관
  - 템플릿 Section 및 Item 관리
  - Prompt, Model과 Worker Webhook 관리
- Promo Wizard
  - Step 1: 디자인 콘셉트
  - Step 2: 프로모션 콘텐츠 입력
  - Step 3: LO-FI
  - Step 4: Final Design
- Visual Editor
  - Vue 3 + Vite 기반 독립 편집기
  - 활성 기본 Form Template을 공개 API에서 로드
  - 콘텐츠, 자유 배치와 시각 속성을 편집
  - 동일 Renderer로 Preview와 Web Output 렌더링
- API와 DB
  - Admin용 Form Template CRUD API
  - Wizard와 Visual Editor용 공개 읽기 API
  - Admin 템플릿 구성 변경 감사 로그
  - 비동기 생성 Run과 Prompt/Model 실행 Snapshot

## 3. 확정 데이터 흐름

### 3.1 정상 흐름

~~~text
[Admin Page]
템플릿 Draft 생성·수정
        ↓
검증 및 활성화
        ↓
[Public Form Template API]
active + visible 데이터만 공개
        ↓
┌───────────────────────────────┐
│ Promo Wizard Step 2           │
│ 활성 템플릿 선택 및 입력 렌더링 │
└───────────────────────────────┘
        ↓
Wizard 입력 Snapshot / 사용 로그 / Generation Run

동일 Public API
        ↓
┌───────────────────────────────┐
│ Visual Editor                 │
│ 기본 활성 템플릿 초기 로드      │
└───────────────────────────────┘
        ↓
Visual Editor Snapshot / Web Output
~~~

### 3.2 금지되는 역방향 흐름

다음 동작은 요구사항이 아니며 자동 구현하면 안 된다.

~~~text
Wizard 사용자 입력
  ✕ → Admin 템플릿 정의 수정

Visual Editor 콘텐츠 및 좌표 편집
  ✕ → Admin 템플릿 정의 수정

AI가 생성한 Design Spec
  ✕ → Admin 활성 템플릿 자동 교체
~~~

Wizard와 Visual Editor는 템플릿 소비자다. 사용자가 특정 프로모션을 위해 입력하거나 편집한 값은 재사용 가능한 템플릿 정의가 아니라 해당 실행의 결과다.

AI 결과를 재사용 템플릿으로 승격해야 할 때도 자동 쓰기를 금지한다. 검증을 통과한 결과를 후보로 저장하고 관리자가 검토한 후 명시적으로 새 Draft를 만들고 활성화해야 한다.

## 4. 역할과 데이터 소유권

| 영역 | 소유 데이터 | 쓰기 권한 | 다른 영역에 제공하는 값 |
|---|---|---|---|
| Admin Page | 템플릿 정의, Section/Item 계약, 표시·필수·잠금·순서 정책 | Admin API를 통해 Draft만 수정 | 활성 템플릿과 공개 가능한 Section/Item |
| Wizard Step 2 | 특정 프로모션의 사용자 입력, 선택한 템플릿과 사용자 순서 | 실행 데이터와 사용 로그만 기록 | Generation Run의 콘텐츠 입력 |
| Visual Editor | 특정 Snapshot의 콘텐츠, Design Spec, Asset 참조 | 현재는 브라우저 Snapshot에만 기록 | 동일 Renderer용 Preview와 Web Output |
| Generation Pipeline | Brief, LO-FI, Final, 향후 Design Spec Variant | Run 단위 결과 저장 | 검수 가능한 생성 산출물 |
| Admin Audit Log | 템플릿 정의 변경 전후 상태 | DB Trigger/API에서 기록 | 운영 감사와 변경 추적 |
| Wizard Usage Log | 템플릿 사용 및 Step 2 진행 이벤트 | Wizard 전용 수집 API | 분석, 장애 추적, 재현 |
| AI Execution Snapshot | Prompt/Model/옵션/입력 해시 | 실행 Queue 시 고정 | AI 실행 재현과 Eval |

### 4.1 Admin Page의 책임

Admin은 다음 항목의 Source of Truth다.

- Form Template 식별자, Template Key, 이름, 설명과 버전
- Draft, Active, Inactive와 Archived 상태
- 기본 템플릿 여부
- 포함할 Section과 순서
- Section 표시 여부, 필수 여부와 고정 위치
- Item 이름, Field Kind, Text Type
- Item 표시 여부, 필수 여부와 사용자 순서 변경 허용 여부
- 이미지 입력 정책, CTA UTM 기본 정책과 잠금 값

Admin에서 저장한 Draft는 Wizard에 즉시 공개되지 않는다. 검증 후 활성화된 버전만 공개 API를 통해 소비된다.

### 4.2 Wizard Step 2의 책임

Wizard는 다음 규칙을 따른다.

- 활성 템플릿 목록만 조회한다.
- 이전 브라우저 입력이 있고 해당 템플릿이 여전히 활성 상태면 같은 템플릿을 복원한다.
- 복원할 수 없으면 기본 활성 템플릿, 그다음 첫 번째 활성 템플릿 순으로 선택한다.
- 공개 상세 API가 반환한 Section과 Item으로 입력 UI를 동적 생성한다.
- isVisibleInWizard가 false인 Item은 표시하지 않는다.
- isLocked인 Item은 Admin 고정값을 유지한다.
- isRequired인 Section과 Item을 Step 이동 전에 검증한다.
- 템플릿 구성 변경 시 configRevision을 저장해 어떤 정의를 사용했는지 식별한다.
- 사용자 입력을 Admin 템플릿 API로 전송하지 않는다.

현재 Wizard 입력은 브라우저 localStorage에 보존되고 Generation Run 요청에 포함된다. 운영 분석과 재현을 위한 별도 서버 로그는 아래 7절 기준으로 추가해야 한다.

### 4.3 Visual Editor의 책임

Visual Editor는 현재 다음 역할을 수행한다.

- 공개 API에서 기본 활성 템플릿을 읽는다.
- Section/Item 구조로 초기 입력값을 만든다.
- 콘텐츠와 Design Spec을 하나의 Snapshot으로 구성한다.
- 동일 Renderer에 Snapshot을 전달해 Preview와 Web Output을 렌더링한다.
- 현재 Web Output Snapshot은 localStorage에 저장한다.

Visual Editor는 Admin 편집기가 아니다. Visual Editor의 자유 배치 좌표, 배경, 글자 스타일과 콘텐츠 수정은 템플릿 정의에 자동 반영하지 않는다.

장기적으로 Snapshot을 서버에 저장할 수 있지만 저장 대상은 Template Definition이 아니라 Promo Artifact 또는 Generation Run이어야 한다.

## 5. API 계약과 공개 경계

### 5.1 Admin API

Admin Page는 다음 계열 API를 사용한다.

- /api/wizard-form-templates
- /api/wizard-form-template
- /api/wizard-form-template-activate
- /api/wizard-form-template-archive
- /api/wizard-form-template-sections
- /api/wizard-content-section
- /api/wizard-content-section-items

수정은 Draft에서만 허용해야 한다. 이미 활성화된 버전을 수정하려면 새 Draft 또는 편집용 복제본을 만든다.

### 5.2 공개 읽기 API

Wizard와 Visual Editor는 다음 공개 API만 사용한다.

- GET /api/wizard-form-templates-public
- GET /api/wizard-form-template-public?id={templateId}

목록 API는 active 상태의 템플릿만 반환한다.

상세 API는 다음 필터를 적용한다.

- 요청 템플릿이 active인지 확인
- isVisible인 템플릿 Section만 포함
- 실제 sectionId 연결이 있는 Section만 포함
- isVisibleInWizard인 Item만 포함
- 공개 가능한 Item이 없는 Section은 결과에서 제외하고 configurationWarnings에 기록

### 5.3 configRevision의 목적

configRevision은 특정 Wizard 입력이 어떤 템플릿 구성에서 만들어졌는지 식별하기 위한 값이다.

최소 구성 요소:

- Form Template ID
- Template Version
- Template Updated At
- 공개 Section ID와 Key
- 공개 Item ID와 Updated At

새로운 사용 로그와 Generation Run에는 formTemplateId, templateKey, templateVersion과 configRevision을 함께 저장해야 한다.

## 6. 서로 다른 세 종류의 로그

세 로그는 목적과 보존 데이터가 다르다. 하나로 합치지 않는다.

### 6.1 Admin 템플릿 감사 로그

현재 wizard_section_audit_logs가 담당한다.

목적:

- 누가 어떤 템플릿 구조를 변경했는지 추적
- Section/Item의 생성, 수정, 삭제, 순서 변경과 활성화 이력 확인
- 장애 발생 시 이전 정의와 새 정의 비교

기록 예:

- form_template_id, form_template_key
- section_id, section_key
- item_id, item_key
- entity_type, action
- previous_state, new_state
- created_at

이 로그는 Wizard 사용자 행동 로그가 아니다.

### 6.2 Wizard 템플릿 사용 및 Step 2 이벤트 로그

현재 별도 영구 로그가 충분히 구현되어 있지 않으므로 신규 설계가 필요하다.

목적:

- 어떤 활성 템플릿이 실제로 사용되는지 파악
- 구성 오류, 검증 실패와 Step 2 이탈 분석
- 특정 Generation Run의 입력 조건 재현
- 템플릿 버전별 성공률과 장애율 비교

권장 이벤트:

| 이벤트 | 발생 시점 | 필수 정보 |
|---|---|---|
| template_loaded | 활성 템플릿 상세 로드 성공 | 템플릿 ID/Key/Version, configRevision |
| template_load_failed | 목록 또는 상세 로드 실패 | 오류 코드, HTTP 상태, 요청 템플릿 ID |
| template_selected | 사용자가 다른 템플릿 선택 | 이전/새 템플릿 ID, 입력 보관 여부 |
| step2_started | Step 2 최초 진입 | sessionId, 템플릿 정보 |
| step2_validation_failed | 다음 단계 이동 차단 | 오류가 난 Section/Item Key 목록 |
| step2_completed | 유효한 입력으로 다음 단계 이동 | 입력 해시, 완료 시간, 필드 개수 |
| generation_run_linked | 생성 Run 생성 | runId, 입력 해시, 템플릿 정보 |

### 6.3 AI 실행 Snapshot

Prompt/Model 실행 Snapshot은 AI 실행을 재현하기 위한 데이터다.

포함 대상:

- Prompt Template ID, Type, Version과 Hash
- Model Provider, Model Name과 옵션
- Worker Stage
- 입력 Hash
- Queue 시각과 실행 상태

AI 실행 Snapshot은 Wizard 템플릿 사용 로그를 대체하지 않는다. 두 로그는 runId나 correlationId로 연결한다.

## 7. Wizard 사용 로그 상세 제안

### 7.1 권장 테이블

이름 예시: wizard_template_usage_events

~~~sql
create table wizard_template_usage_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text not null,
  run_id uuid null references promo_generation_runs(id) on delete set null,
  form_template_id uuid null references wizard_form_templates(id) on delete set null,
  template_key text not null default '',
  template_version integer,
  config_revision text not null default '',
  input_hash text not null default '',
  section_keys jsonb not null default '[]'::jsonb,
  item_keys jsonb not null default '[]'::jsonb,
  validation_error_keys jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
~~~

권장 Index:

- created_at desc
- form_template_id, created_at desc
- run_id
- event_name, created_at desc
- config_revision

### 7.2 입력 원문 저장 정책

기본 로그에는 Step 2 원문 전체를 저장하지 않는다.

기본 저장:

- 입력 JSON의 안정적인 Hash
- 사용한 Section/Item Key
- 필드별 값 존재 여부
- 검증 실패 Key
- 텍스트 길이 등 비식별 통계

재현을 위해 원문 Snapshot이 필요하면 promo_generation_runs 또는 별도 접근 통제 Snapshot에 저장하고 사용 로그에서는 runId만 참조한다.

저장 전 제거 또는 마스킹 대상:

- 이메일, 전화번호와 계정 식별자
- 인증 Token, Cookie와 Secret
- 내부 전용 URL Query
- 사용자 자유 입력에 포함된 개인정보

### 7.3 수집 API

권장 API:

- POST /api/wizard-template-usage-events

요구사항:

- 허용된 event_name만 받는다.
- 본문 크기를 제한한다.
- 서버가 created_at을 생성한다.
- 클라이언트가 전달한 템플릿 메타데이터를 그대로 신뢰하지 않고 가능한 범위에서 DB와 검증한다.
- 로그 실패가 Wizard 입력을 유실시키면 안 된다.
- 중복 전송을 고려해 clientEventId 또는 idempotency key를 받을 수 있다.
- 로그 API 오류는 사용자 진행을 차단하지 않되 운영 관측에 남긴다.

## 8. AI 적용 핵심 원칙

> AI는 발산과 해석에 사용하고, 결정적 코드는 정합성과 검증에 사용한다.

| 구분 | 담당 | 예 |
|---|---|---|
| AI | 콘텐츠 의도 해석, 디자인 방향 발산, 카피, 에셋과 레이아웃 제안 | Design Spec Variant, 모바일 재배치 제안 |
| 결정적 코드 | 계약 검증, 좌표 계산, 접근성 검사, UTM 조립과 마이그레이션 | JSON Schema, WCAG 대비 검사, Renderer |

모든 AI 출력 경계에는 Schema Validator를 둔다. 검증 실패 시 fail-closed로 차단하고 기본 Spec 또는 직전 정상 결과를 사용한다.

## 9. AI 적용 우선순위

문서 내 우선순위 표현을 다음과 같이 통일한다.

### 우선순위 1: Design MD RAG 준비와 Design Spec 계약 정비

두 작업을 같은 선행 단계로 본다.

1. docs/design-md 코퍼스와 DB 토큰을 검색 가능한 컨텍스트로 준비한다.
2. 현재 DEFAULT_DESIGN_SPEC과 P0 계약 문서의 드리프트를 해소한다.
3. PageDesignSpec JSON Schema와 contractVersion 정책을 확정한다.

RAG만 먼저 붙여도 AI가 출력할 안정된 계약이 없으면 운영할 수 없고, Schema만 있어도 디자인 근거가 없으면 품질이 낮다.

### 우선순위 2: 스키마 강제 Design Spec Variant 생성

- 자유 CSS나 Vue 코드가 아닌 JSON만 생성
- 색상은 허용 Token 또는 검증된 값 범위로 제한
- fontSize와 좌표 범위 제한
- 한 실행에서 3~5개 Variant 생성
- 실패 결과는 사용자에게 노출하지 않음

### 우선순위 3: 결정적 자동 필터

- WCAG 텍스트 대비
- 텍스트 Overflow
- 콘텐츠 폭 1140~1440px 준수
- 필수 Item Coverage 100%
- 허용되지 않은 URL Scheme
- 최소/최대 섹션 높이와 좌표 범위

### 우선순위 4: Vision 기반 시각 QA

Renderer Screenshot을 Vision Model에 입력해 겹침, 잘림과 시각적 불균형을 검출한다.

Vision 결과는 직접 DOM이나 DB를 수정하지 않는다. 검증 가능한 Design Spec Patch 제안으로 반환하고 사용자 승인 또는 자동 검증을 통과한 경우에만 실행 Snapshot에 적용한다.

### 우선순위 5: Eval

- 대표 프로모션 콘텐츠 5~10개의 Golden Set
- 기대 특성: 대비, 폭, 필수 콘텐츠와 Token 준수율
- Prompt/Model 변경 시 회귀 평가
- 템플릿 버전과 configRevision별 결과 비교

## 10. 세부 AI 적용 지점

### 10.1 Design Spec 생성

LLM 출력은 PageDesignSpec JSON Schema를 만족해야 한다.

최소 검사:

- contractVersion
- theme
- responsive
- itemStyles
- sectionStyles
- 허용되지 않은 속성
- 수치 범위와 유효 CSS 값

현재 구현은 backgroundImage, itemStyles와 sectionStyles가 초기 P0 문서보다 확장됐지만 contractVersion이 1이다. AI 생성 구현 전에 계약 문서와 Version을 정리한다.

### 10.2 Design MD RAG

Wizard Step 1에서 고른 디자인 콘셉트를 기준으로 유사 브랜드 2~3개의 색상, 타이포와 간격 Token을 주입한다.

RAG 검색 결과는 근거 ID 또는 Source Path와 함께 실행 Snapshot에 남겨야 한다. 그래야 동일 입력을 다시 생성하거나 품질 차이를 설명할 수 있다.

### 10.3 이미지 AI

전체 페이지 이미지 생성은 단계적으로 축소한다.

허용:

- Hero 배경
- Section Illustration
- Product 또는 Campaign Asset
- 기존 Asset Retouch

금지:

- CTA 텍스트를 이미지에 굽기
- 약관과 법적 고지를 이미지로만 제공
- 전체 웹페이지 이미지를 실제 Web Output으로 간주

### 10.4 모바일 재배치와 AI 정돈

자유 배치의 Desktop 좌표를 기반으로 AI가 Mobile 위치를 제안할 수 있다.

반환 형식은 Design Spec Patch로 제한하며 다음을 검증한다.

- Section 경계 밖으로 나가지 않음
- 필수 Item 누락 없음
- 최소 Touch Target
- 텍스트 겹침 없음
- 허용 좌표와 크기 범위

## 11. AI를 사용하지 않는 영역

다음은 결정적 코드로 처리한다.

- 좌표 계산
- Section 최소 높이 산정
- URL Scheme과 UTM 조립
- DB Migration
- 계약 준수 판정
- 필수 입력 검증
- Active/Draft 상태 전환
- Template Version 선택
- 로그 마스킹과 접근 통제

LLM Vue 코드 생성은 마지막 단계로 미룬다. 진행할 경우에도 Component 단위로 제한하고 Sandbox Build, Schema 검사와 시각 QA를 통과한 결과만 후보 Registry에 저장한다.

## 12. Source of Truth와 Snapshot 계층

| 데이터 | Source of Truth | 변경 방식 |
|---|---|---|
| 템플릿 정의 | Admin DB | Draft 편집 후 명시적 활성화 |
| Wizard Step 2 입력 | Wizard 실행 Snapshot 또는 Generation Run | 사용자 입력 |
| Visual Design | Design Spec Snapshot | 사용자 편집 또는 검증된 AI 결과 |
| Asset | Asset Registry 또는 Snapshot 참조 | 업로드/AI 생성 |
| Prompt/Model 설정 | Admin DB | Admin 변경 후 새 실행부터 적용 |
| AI 실행 조건 | Prompt Execution Snapshot | Queue 시점에 불변 고정 |
| Preview/Web Output | Content + Design Spec + Assets | 동일 Renderer가 계산 |

Preview와 Web Output은 같은 Snapshot과 Renderer를 사용해야 한다. 이미지 생성 결과를 별도의 Source of Truth로 두지 않는다.

## 13. 실패 처리 원칙

### Admin

- Draft 저장 실패 시 Active 버전에 영향 없음
- 검증 실패 시 활성화 금지
- 공개 가능한 Section/Item이 없으면 경고 또는 활성화 차단 정책 적용

### Wizard

- 활성 템플릿 목록 로드 실패 시 Step 2 진행 차단
- 선택한 템플릿 상세에 Item이 없으면 명확한 관리자 요청 메시지 표시
- 로그 저장 실패는 사용자 입력 진행을 차단하지 않음
- Generation Run 생성 실패 시 입력 Snapshot 유지

### Visual Editor

- 공개 템플릿 로드 실패 시 편집 화면 대신 오류 표시
- localStorage 용량 초과 시 Web Output 열기 차단
- AI Design Spec 검증 실패 시 현재 정상 Spec 유지

### AI Pipeline

- Schema 실패 시 자동 재시도 횟수 제한
- 재시도 종료 후 기본 Spec 또는 직전 정상 Spec 사용
- 실패 Prompt/Model/입력 Hash와 Validator 오류 저장

## 14. 구현 단계

### Phase A: 경계 문서화와 계약 정비

1. PageDesignSpec 계약과 현재 구현 차이 정리
2. contractVersion 정책 확정
3. Wizard Usage Event Schema 확정
4. 민감정보 저장 정책 확정

### Phase B: Wizard 사용 로그

1. Migration 추가
2. 로그 수집 Store/API 추가
3. Wizard에 template_loaded, step2_started, validation_failed, completed 이벤트 연결
4. runId 연결
5. Contract Test와 중복 전송 Test 추가

### Phase C: Design Spec 생성

1. Design MD 검색 Context 준비
2. JSON Schema 기반 Worker 추가
3. Prompt/Model Snapshot 연결
4. 결정적 Validator와 기본 Spec Fallback
5. Feature Flag로 기존 Flow와 병행

### Phase D: Variant와 QA

1. 3~5개 Variant 생성
2. 자동 필터
3. 사용자 선택
4. Vision QA
5. Eval Dashboard 또는 Report

### Phase E: 운영 전환

1. Template/Config Revision별 성공률 확인
2. 기존 LO-FI/Final 이미지 Flow 의존도 축소
3. Preview/Web Output Renderer 일원화
4. 롤백 절차 검증

## 15. 완료 기준

### Admin–Wizard 연동

- Admin에서 활성화한 템플릿만 Wizard에 노출된다.
- Section/Item 표시, 필수, 잠금과 순서 정책이 Step 2에 반영된다.
- Wizard 입력이 Admin 템플릿을 수정하지 않는다.
- 구성 오류가 사용자와 운영자에게 식별 가능하다.

### Wizard 사용 로그

- Template Load, Step 2 시작, 검증 실패와 완료 이벤트가 기록된다.
- 모든 이벤트가 Template Version과 configRevision을 포함한다.
- Generation Run 생성 후 runId로 연결된다.
- 원문 입력과 민감정보가 일반 이벤트 로그에 저장되지 않는다.
- 로그 API 실패가 사용자의 Wizard 진행을 막지 않는다.

### AI Design Spec

- 모든 AI 결과가 Versioned JSON Schema를 통과한다.
- 실패 결과가 Renderer를 깨뜨리지 않는다.
- Preview와 Web Output이 동일 Snapshot으로 동일하게 렌더링된다.
- Prompt/Model/RAG Context와 입력 Hash를 재현할 수 있다.
- Admin 템플릿 정의에 자동 역반영되지 않는다.

## 16. 다른 LLM을 위한 작업 지침

이 문서를 이어받는 LLM은 다음 규칙을 반드시 지킨다.

1. Admin 템플릿과 Wizard 실행 데이터를 같은 저장 대상으로 취급하지 않는다.
2. Wizard 또는 Visual Editor 값을 Admin API에 저장하는 기능을 임의로 만들지 않는다.
3. 신규 로그를 wizard_section_audit_logs에 섞지 않는다.
4. AI 실행 Snapshot과 Wizard Usage Event를 runId 또는 correlationId로 연결하되 목적은 분리한다.
5. 현재 구현 여부를 확인하지 않고 문서의 제안을 완료 기능으로 표현하지 않는다.
6. DB 변경 전 기존 Migration과 배포 DB 적용 여부를 확인한다.
7. 모든 AI 출력은 Schema Validator와 실패 Fallback을 설계한 뒤 연결한다.
8. Feature Flag 없이 기존 LO-FI/Final Flow를 삭제하지 않는다.
9. 보안, 개인정보와 로그 보존 정책이 불명확하면 원문 저장을 기본값으로 선택하지 않는다.
10. 구현 완료 보고에는 변경 파일, Migration, Test, 배포 확인과 남은 제한사항을 함께 기록한다.

## 17. 관련 파일과 문서

핵심 소스:

- prototype/app.js
- prototype/promo-wizard.js
- visual-editor/src/App.vue
- visual-editor/src/contracts.js
- visual-editor/src/PromoPageRenderer.vue
- api/wizard-form-templates-public.js
- api/wizard-form-template-public.js
- api/_wizard-form-templates-store.js
- api/_prompt-execution-snapshot.js
- db/migrations/011_generation_runs_and_prompt_model_settings.sql
- db/migrations/017_wizard_form_templates.sql
- db/migrations/022_wizard_section_audit_logs.sql

관련 문서:

- docs/claude/service-architecture-2026-07-17.md
- docs/visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md
- docs/visual-renderer-p0-baseline-and-contract-2026-07-16.md
- docs/visual-renderer-development-plan-with-n8n-2026-07-16.md
- docs/automated-vue-web-generation-process-recommendation-2026-07-14.md
- docs/claude/zero-click-ax-concept-2026-07-14.md
- docs/visual-editor-p1-stabilization-development-plan-2026-07-17.md
- docs/handoff-2026-07-17.md

## 18. 최종 결정 요약

~~~text
Admin = 템플릿 정의 및 활성화의 Source of Truth
Wizard Step 2 = 활성 템플릿의 읽기 전용 소비자
Visual Editor = 실행 Snapshot 기반 콘텐츠·디자인 편집기
Wizard Usage Log = 템플릿 사용과 Step 2 이벤트 추적
Admin Audit Log = 템플릿 정의 변경 추적
AI Execution Snapshot = Prompt/Model/입력 조건 재현

Wizard/Visual Editor 실행 데이터는 Admin 템플릿에 자동 역반영하지 않는다.
AI 결과는 검증 후 실행 결과로 저장하고, 템플릿 승격은 관리자 승인으로만 수행한다.
~~~
