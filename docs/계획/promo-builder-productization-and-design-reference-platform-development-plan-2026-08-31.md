# 프로모션 빌더 제품 고도화 및 디자인 레퍼런스 플랫폼 개발 계획서

## 0. 문서 정보

- 작성일: 2026-08-31
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 착수 전 통합 계획 초안
- 전환 단계: 기능 검증 중심 POC → 운영 가능한 제품 고도화
- 대상 기능:
  - 기존 프로모션 빌더·AI 구성·디자인 시스템의 안정화
  - 외부 웹 URL·웹페이지 경로·스크린샷 이미지 등록
  - 외부 디자인 레퍼런스 분석·구조화·검수·승인
  - 승인된 디자인 지식의 검색 및 프로모션 구성 활용
  - 운영자 피드백을 이용한 추천 품질 개선
- 우선순위:
  - P0: 기반 계약·안전성·검수 가능성 확보
  - P1: 디자인 레퍼런스 MVP와 빌더 연결
  - P2: URL 캡처·자동 검색·피드백 기반 최적화
- 관련 현행 문서:
  - `README.md`
  - `docs/기획/promo-web-builder-product-plan-2026-07-23.md`
  - `docs/기획/promo-builder-ai-design-and-component-analysis-report-2026-07-23.md`
  - `docs/설계/ai-promotion-builder-composition-engine-technical-design-2026-07-29.md`
  - `docs/계획/ai-builder-auto-composition-and-preview-readiness-development-plan-2026-08-17.md`
  - `docs/계획/ai-live-preview-design-quality-gate-development-plan-2026-08-20.md`

---

## 1. 작성 배경

지금까지 프로젝트는 다음 개념을 실제 E2E 흐름으로 검증하는 POC 성격으로 진행됐다.

- 자연어 요구사항을 프로모션 Overview로 구조화할 수 있는가
- Rule Base와 LLM을 함께 사용해 템플릿·섹션·컴포넌트를 구성할 수 있는가
- 관리자 레지스트리와 디자인 토큰으로 AI 결과를 통제할 수 있는가
- AI 이미지 생성과 레이아웃 편집을 프로모션 제작 흐름에 연결할 수 있는가
- 생성 결과를 Live Preview와 Web Output으로 확인할 수 있는가

이제부터는 단순히 정상 경로에서 기능이 동작하는지를 확인하는 단계가 아니다. 반복적인 실사용과 운영을 전제로 다음 조건을 만족해야 한다.

- 동일 입력과 동일 버전에서 결과를 추적하고 설명할 수 있어야 한다.
- 실패, Timeout, 외부 서비스 장애 후 안전하게 재시도할 수 있어야 한다.
- AI 결과가 운영 데이터에 반영되기 전에 검증과 승인 절차를 거쳐야 한다.
- 데이터·프롬프트·토큰·컴포넌트·레이아웃의 버전 관계를 재현할 수 있어야 한다.
- Desktop, Mobile, Preview, Export가 동일한 계약을 사용해야 한다.
- 운영자가 오류 원인과 현재 상태, 가능한 다음 행동을 이해할 수 있어야 한다.
- 기능 추가가 기존 정책·레이아웃·디자인 품질을 무너뜨리지 않아야 한다.

이번 계획은 이 전환을 위한 공통 고도화 작업과, 새롭게 검토한 외부 디자인 레퍼런스 기능을 하나의 제품 로드맵으로 통합한다.

---

## 2. 핵심 결론

### 2.1 제품 고도화 방향

현재 구현을 전면 폐기하고 새로 만드는 것은 적절하지 않다. 이미 다음 기반이 구현되어 있다.

- Design MD와 디자인 토큰의 구조화 저장
- 컴포넌트·레이아웃 패턴과 가이드라인 데이터
- 컴포넌트·섹션·레이아웃·디자인 토큰 레지스트리
- Rule Base와 LLM을 결합한 템플릿 추천
- Builder Document Revision과 AI 구성 Proposal
- 비동기 AI 자산 작업의 상태·Lease·Retry 기반
- Desktop·Mobile 레이아웃 프리셋
- 프롬프트 템플릿 버전과 실행 스냅샷
- Live Preview 품질 게이트로 확장 가능한 렌더링 기반

따라서 현행 자산을 다음 세 범주로 분류해 고도화한다.

1. **유지·재활용**: 현재 계약을 그대로 사용하거나 작은 정비만 필요한 영역
2. **수정·보완 후 재활용**: 목적은 맞지만 POC 가정, 입력 범위, 추적 정보가 부족한 영역
3. **신규 구축**: 현재 코드에 없는 외부 원본 수집, 멀티모달 분석, 검수, 검색, 피드백 영역

### 2.2 외부 디자인 레퍼런스 방향

외부 URL과 스크린샷을 모델에 즉시 학습시키거나 외부 페이지를 그대로 복제하는 방식은 채택하지 않는다.

목표 흐름은 다음과 같다.

```text
외부 URL / 스크린샷 / Design MD
→ 안전한 원본 수집 및 보관
→ DOM·CSS·스크린샷·비전 분석
→ 디자인 토큰·컴포넌트·레이아웃·가이드라인 구조화
→ 운영자 검수·수정·승인
→ 승인된 디자인 지식베이스
→ 프로모션 요구사항과 유사한 패턴 검색
→ 현재 등록된 컴포넌트·레이아웃·토큰으로 재조합
→ 품질 게이트
→ Live Preview
→ 선택·수정·거절 피드백 축적
```

외부 레퍼런스는 원본 사이트 자체가 아니라 재사용 가능한 디자인 원칙과 구성 패턴으로 활용한다.

### 2.3 학습 전략

초기 목표는 모델 파인튜닝이 아니다. 다음 세 단계를 분리한다.

1. **구조화 추출**: 이미지·URL·문서에서 디자인 특성을 표준 스키마로 추출한다.
2. **검색 기반 활용**: 승인된 패턴을 검색해 생성 컨텍스트와 후보 선택에 사용한다.
3. **실제 모델 학습**: 승인·거절·수정·성과 데이터가 충분히 축적된 이후 별도로 검토한다.

MVP에서는 `구조화 + 운영자 승인 + 규칙/RAG 검색 + 제한된 재조합`까지만 구현한다.

---

## 3. 목표와 비목표

### 3.1 목표

- 현재 POC 기능을 운영 가능한 제품 계약으로 승격한다.
- 디자인 원본, 분석 결과, 승인 결과, 빌더 적용 결과를 추적 가능하게 연결한다.
- 외부 디자인 레퍼런스를 현재 디자인 시스템과 컴포넌트 계약 안에서 활용한다.
- 운영자가 AI 분석 결과를 확인·수정·승인할 수 있게 한다.
- 프로모션 목적과 콘텐츠 조건에 맞는 다양한 레이아웃·UI 디자인 후보를 추천한다.
- 정책과 필수 구조를 유지하면서 디자인 다양성을 높인다.
- 실패 복구, 감사, 보안, 품질 검사, 관측 가능성을 제품 기본 기능으로 만든다.

### 3.2 비목표

- 외부 웹사이트의 HTML/CSS를 그대로 복제하지 않는다.
- 승인되지 않은 AI 분석 결과를 활성 디자인 데이터로 사용하지 않는다.
- 외부 이미지·로고·문구를 권한 확인 없이 생성 결과에 재사용하지 않는다.
- AI가 임의 HTML, CSS, JavaScript 또는 등록되지 않은 컴포넌트를 생성하지 않는다.
- 초기 단계에서 범용 웹 크롤러를 만들지 않는다.
- 초기 단계에서 파인튜닝을 수행하지 않는다.
- 자동 생성 결과를 검수 없이 즉시 게시하지 않는다.

---

## 4. 제품 고도화 원칙

### 4.1 계약 우선

화면 구현 전에 다음 순서로 확정한다.

```text
도메인 용어
→ 데이터 스키마
→ 상태 전이
→ API 계약
→ 권한 정책
→ 실패·재시도 정책
→ 관리자 UI
→ 빌더 UI
→ 자동화·최적화
```

### 4.2 AI 제안과 운영 데이터 분리

AI 결과는 항상 제안 또는 분석 초안이다. 검증과 운영자 승인을 통과한 결과만 게시 가능한 디자인 지식이 된다.

### 4.3 결정론적 통제

- AI는 의미 해석, 분류, 후보 추천을 담당한다.
- 서버는 ID Allowlist, 상태, 권한, Revision, 정책을 검증한다.
- Compiler는 승인된 컴포넌트·토큰·레이아웃만 사용한다.
- 실제 렌더 결과는 Desktop과 Mobile 품질 게이트를 통과해야 한다.

### 4.4 출처와 재현성

모든 핵심 결과에는 다음 정보를 남긴다.

- 원본 출처와 Capture 버전
- 입력 해시
- 분석 모델과 프롬프트 버전
- 분석 계약 버전
- 자동 추출값과 운영자 수정값
- 승인자와 승인 시각
- 빌더 적용 문서와 Revision
- 사용된 토큰·컴포넌트·레이아웃 버전

### 4.5 작은 E2E 단위로 점진 전환

모든 영역을 한 번에 교체하지 않는다. 기존 동작을 유지하면서 새로운 계약을 Feature Flag와 점진적 Rollout으로 연결한다.

---

## 5. 현행 구현 평가

### 5.1 유지·재활용할 영역

| 현행 구현 | 재활용 방향 | 판정 |
|---|---|---|
| `design_token_sets`, `design_token_items` | 외부 레퍼런스에서 추출한 색상·폰트·간격·형태·표면 토큰 저장 | 유지 |
| `design_metadata_items` | 분위기·철학·밀도·시각적 특성 저장 | 유지 |
| `design_component_patterns` | Hero, CTA, 카드, 배지 등 패턴 저장 | 유지 |
| `design_layout_patterns` | 페이지·섹션·그리드·반응형 패턴 저장 | 유지 |
| `design_guideline_items` | Do, Don't, Avoid, Must 및 생성 가이드 저장 | 유지 |
| 디자인 토큰 Draft/Publish/Archive | 승인된 레퍼런스 토큰 관리 | 유지 |
| Item Component와 Component Field | 레퍼런스 패턴의 실제 구현 후보 | 유지 |
| Section Registry | 레퍼런스 섹션 구조의 매핑 대상 | 유지 |
| `wizard_content_section_layouts` | Desktop·Mobile 실제 레이아웃 프리셋 | 유지 |
| 템플릿 Rule Base + LLM 추천 | 디자인 레퍼런스 후보 추천으로 확장 | 유지 |
| Prompt Template·Execution Snapshot | 분석·추천·생성 재현성 관리 | 유지 |
| Builder Document Revision | 레퍼런스 적용 전후 비교와 Rollback | 유지 |
| 비동기 작업의 Lease·Retry 패턴 | 캡처·분석 Worker에 재사용 | 유지 |
| Vercel Blob 사용 기반 | 원본·캡처·썸네일 저장 어댑터로 활용 | 유지 |

### 5.2 수정·보완 후 재활용할 영역

| 현행 영역 | 현재 한계 | 필요한 보완 |
|---|---|---|
| `design_documents` | Markdown 중심 source 유형과 조회 조건 | 상위 Design Reference 도메인과 연결하고 source 유형 확장 |
| `analyze-design-md.js` | `rawMarkdown` 필수, n8n webhook 중심 | 입력 Adapter 분리, 비동기 분석 계약, 멀티모달 provider 추가 |
| `_design-md-data.js` | Markdown 패턴·정규식 기반 추출 | 비전·DOM 결과 정규화, 근거 위치와 신뢰도 추가 |
| 디자인 패턴 테이블 | 분석 출처·검수 상태·사용 범위 부족 | Evidence, Review, Rights 연결 추가 |
| 레이아웃 패턴 | 분석 데이터와 실행 프리셋 사이 변환 부재 | Pattern-to-Preset Adapter와 Contract Validator 추가 |
| 템플릿 추천 | Overview와 템플릿 후보 중심 | 승인된 레퍼런스·패턴 후보와 구현 가능성 점수 추가 |
| 원격 이미지 보안 | 이미지 URL과 고정 host 중심 | 페이지 캡처 전용 URL·네트워크 정책 추가 |
| 관리자 Design MD UI | 문서 등록·조회 중심 | 통합 레퍼런스 라이브러리와 검수 흐름으로 확장 |
| AI 품질 게이트 | 구성 결과 중심 | 레퍼런스 출처·패턴 매핑·모방 위험 검사 추가 |
| 생성 실행 이력 | 어떤 레퍼런스를 사용했는지 명시적 연결 부족 | Reference Usage Snapshot 추가 |

### 5.3 신규 구축할 영역

- Design Reference Source/Capture 데이터 모델
- 스크린샷 직접 업로드 API와 검증
- URL 캡처 전용 격리 Browser Worker
- Desktop·Tablet·Mobile Capture Manifest
- DOM·Computed Style 요약 추출기
- 스크린샷 멀티모달 분석기
- 분석 결과와 원본 영역을 연결하는 Evidence 모델
- 운영자 분석 검수·수정·승인 UI
- 승인된 디자인 레퍼런스 라이브러리
- 규칙 기반 및 향후 Vector 기반 Retrieval 서비스
- Pattern-to-Registry 및 Pattern-to-Preset Adapter
- 빌더 디자인 레퍼런스 추천·선택 UI
- 레퍼런스 사용·선택·거절·수정 피드백
- 저작권·상표·개인정보·자산 재사용 정책
- 캡처·분석 비용·성공률·품질 관측 지표

---

## 6. 목표 도메인 구조

기존 Design MD를 독립 기능으로 유지하지 않고 상위 `Design Reference` 도메인의 입력 유형으로 편입한다.

```text
Design Reference
├─ Source
│  ├─ Design MD
│  ├─ Screenshot Upload
│  ├─ Multiple Screenshots
│  ├─ Public Web URL
│  └─ Manual Reference
├─ Capture
│  ├─ Desktop Screenshot
│  ├─ Tablet Screenshot
│  ├─ Mobile Screenshot
│  ├─ DOM Snapshot
│  └─ Computed Style Summary
├─ Analysis
│  ├─ Design Tokens
│  ├─ Metadata
│  ├─ Section Patterns
│  ├─ Component Patterns
│  ├─ Layout Patterns
│  ├─ Responsive Rules
│  └─ Guidelines/Risks
├─ Review
│  ├─ Draft
│  ├─ Review Required
│  ├─ Approved
│  ├─ Rejected
│  └─ Archived
├─ Retrieval
│  ├─ Rule Filter
│  ├─ Metadata Scoring
│  ├─ Semantic Search
│  └─ Implementability Score
└─ Builder Usage
   ├─ Template Recommendation
   ├─ Token Mapping
   ├─ Component Mapping
   ├─ Layout Mapping
   ├─ Quality Gate
   └─ Feedback
```

---

## 7. 목표 시스템 아키텍처

```text
Admin Reference Library
        │ URL / image / Design MD
        ▼
Reference Intake API
        │ validate / hash / deduplicate / authorize
        ▼
Original Storage + Source Record
        │
        ├──────── Screenshot Input ─────────┐
        │                                   │
        └──────── URL Capture Queue         │
                        │                   │
                        ▼                   │
                Isolated Browser Worker     │
                        │ screenshots/DOM/CSS
                        └─────────┬─────────┘
                                  ▼
                         Analysis Job Queue
                                  │
                     Vision + DOM/CSS Analyzers
                                  │
                                  ▼
                       Normalization & Validation
                                  │ draft patterns
                                  ▼
                         Human Review & Approval
                                  │ approved only
                                  ▼
                   Approved Design Knowledge Base
                                  │
                     Rule/Metadata/Semantic Retrieval
                                  │
                                  ▼
Promotion Overview → Candidate Resolver → Composition Planner
                                  │
                                  ▼
                 Registry Mapping & Deterministic Compiler
                                  │
                                  ▼
                   Asset Gate + Render Quality Gate
                                  │ pass
                                  ▼
                         Live Preview / Export
                                  │
                                  ▼
                    Usage and Review Feedback Store
```

### 7.1 책임 경계

| 계층 | 책임 | 금지 |
|---|---|---|
| Intake API | 입력 검증, 권한, 해시, 원본 등록 | 긴 캡처·분석 작업 동기 실행 |
| Capture Worker | 격리 렌더링, viewport별 캡처, DOM/CSS 요약 | 서비스 네트워크·사설망 접근 |
| Analyzer | 의미 분류와 디자인 특징 추출 | 운영 데이터 직접 Publish |
| Normalizer | 공통 스키마 변환과 범위 검증 | 근거 없는 값 자동 보정 |
| Reviewer UI | 확인·수정·승인·거절 | 원본 출처 없이 승인 |
| Retrieval | 승인된 후보 검색·점수화 | 비승인 데이터 반환 |
| Planner | 후보 중 의미·적합성 선택 | Raw HTML/CSS/임의 ID 생성 |
| Registry Adapter | 기존 컴포넌트·레이아웃·토큰으로 매핑 | 미등록 컴포넌트 자동 활성화 |
| Quality Gate | 렌더·정책·자산·출처 검사 | 실패 결과를 Ready 처리 |

---

## 8. 데이터 설계

### 8.1 신규 핵심 테이블

#### `design_reference_sources`

논리적인 외부 디자인 레퍼런스의 루트다.

주요 필드:

```text
id
source_type                 web_url | screenshot_upload | multi_screenshot | design_md | manual
name
description
original_url
normalized_url
owner_subject
status                      draft | capturing | analyzing | review_required | approved | rejected | archived
source_hash
rights_status               unknown | internal | permitted | restricted
pattern_reuse_allowed
asset_reuse_allowed
contains_personal_data
tags_json
created_at / updated_at / archived_at
```

#### `design_reference_captures`

특정 시각·viewport의 원본 캡처를 보관한다.

```text
id
source_id
capture_version
capture_type                screenshot | full_page | dom | computed_style
viewport_name               desktop | tablet | mobile | uploaded
viewport_width / viewport_height
blob_url
mime_type
file_size
content_hash
final_url
captured_at
capture_metadata_json
```

#### `design_reference_analysis_runs`

분석 작업과 재현 정보를 저장한다.

```text
id
source_id
capture_version
status
contract_version
provider
model
prompt_template_id
prompt_snapshot
input_hash
result_json
current_attempt / max_attempts
lease_token / lease_expires_at / next_retry_at
error_code / error_message / failure_stage
started_at / completed_at
```

#### `design_pattern_evidence`

기존 토큰·컴포넌트·레이아웃·가이드라인과 원본 근거를 연결한다.

```text
id
source_id
capture_id
analysis_run_id
entity_type                 token | metadata | component_pattern | layout_pattern | guideline
entity_id
source_region_json
source_excerpt
confidence
review_status
reviewed_by / reviewed_at
```

#### `design_reference_reviews`

승인·거절·수정 이력을 감사 로그로 저장한다.

```text
id
source_id
analysis_run_id
action                      request_review | approve | reject | revise | archive
previous_state_json
new_state_json
comment
actor_subject
created_at
```

#### `design_reference_usage_events`

추천과 적용 결과를 학습 가능한 피드백으로 남긴다.

```text
id
source_id
builder_document_id
document_revision
event_type                  recommended | viewed | selected | applied | rejected | edited | reverted | published
pattern_ids_json
usage_snapshot
edit_distance_json
quality_gate_result
actor_subject
created_at
```

### 8.2 기존 테이블 연결

```text
design_reference_sources
        │
        ├── design_reference_captures
        ├── design_reference_analysis_runs
        ├── design_reference_reviews
        └── design_pattern_evidence
                    │
                    ├── design_token_sets / design_token_items
                    ├── design_metadata_items
                    ├── design_component_patterns
                    ├── design_layout_patterns
                    └── design_guideline_items
```

### 8.3 상태 모델

#### Source 상태

```text
draft
→ capturing / uploaded
→ analyzing
→ review_required
→ approved | rejected
→ archived
```

#### Capture Job 상태

```text
queued
→ processing
→ ready | failed | cancelled
```

#### Analysis Job 상태

```text
queued
→ processing
→ normalizing
→ validating
→ review_required | failed | cancelled
```

상태 변경은 서버에서 허용된 전이만 받아들이며, `processing` 작업은 Lease 만료 후 복구할 수 있어야 한다.

---

## 9. 분석 계약

### 9.1 공통 결과 스키마

```json
{
  "contractVersion": 1,
  "sourceSummary": {
    "pageType": "promotion_landing",
    "visualStyle": [],
    "targetAudience": [],
    "promotionFit": []
  },
  "tokens": {},
  "pageStructure": [],
  "sections": [],
  "componentPatterns": [],
  "layoutPatterns": [],
  "responsiveRules": [],
  "imageTreatment": [],
  "guidelines": [],
  "risks": [],
  "confidence": {},
  "evidence": []
}
```

### 9.2 추출 대상

- 페이지 목적과 유형
- 섹션 순서와 역할
- 콘텐츠 계층과 정보 밀도
- Container, Grid, Column, Gap, Alignment
- 색상, Typography, Spacing, Radius, Border, Shadow
- Hero, CTA, 카드, 배지, 내비게이션, Footer 패턴
- 이미지 피사체 위치와 텍스트 Safe Area
- 데스크톱과 모바일 배치 차이
- 접근성 위험과 낮은 대비
- 프로모션 빌더 적용 적합도
- 기존 Registry로 구현 가능한 범위
- 자산 재사용과 패턴 참고의 구분

### 9.3 분석 우선순위

| 정보 | 우선 근거 |
|---|---|
| 실제 위치·크기 | 브라우저 DOM Rect·Computed Style |
| 색상·폰트 | Computed Style, 이후 비전 교차 확인 |
| 콘텐츠 의미·역할 | DOM 텍스트 + LLM/비전 |
| 시각적 분위기 | 비전 분석 |
| 이미지 구성 | 비전 분석 + 이미지 DOM 영역 |
| 모바일 동작 | 실제 Mobile Capture |
| 접근성 | DOM 속성·계산 대비·렌더 결과 |

스크린샷만 등록된 경우 DOM 기반 항목은 `unknown` 또는 추정값으로 남기며, 추정값을 사실로 승격하지 않는다.

---

## 10. 관리자 기능 계획

### 10.1 디자인 레퍼런스 라이브러리

필수 기능:

- URL 등록
- 단일·다중 스크린샷 업로드
- 기존 Design MD 등록 및 연결
- Capture·분석 상태 표시
- 썸네일 목록과 상세 보기
- 프로모션 유형·시장·톤·레이아웃 태그 필터
- 중복 출처 경고
- 재캡처·재분석
- 검수 요청·승인·거절·아카이브
- 원본 자산 재사용 허용 여부 관리
- 적용 이력과 사용 중인 프로모션 확인

### 10.2 분석 검수 화면

```text
┌────────────────────────────┬────────────────────────────┐
│ 원본 Desktop/Mobile 캡처    │ 구조화 분석 결과            │
│ 영역 선택·확대              │ 토큰·섹션·컴포넌트·레이아웃 │
│ 분석 근거 Highlight         │ 신뢰도·수정·승인            │
└────────────────────────────┴────────────────────────────┘
```

검수자는 다음을 수행할 수 있어야 한다.

- 잘못된 섹션 경계 수정
- 컴포넌트 역할 변경
- 색상·폰트·간격 토큰 수정 또는 제외
- Desktop·Mobile 레이아웃 규칙 수정
- 프로모션 적용 가능 범위 지정
- 패턴 참고만 허용하고 원본 자산 재사용 금지
- 낮은 신뢰도 항목 일괄 보류
- 승인 전 실제 Registry 매핑 미리보기

### 10.3 권한

권장 역할:

- `reference_viewer`: 조회만 가능
- `reference_editor`: 등록·수정·재분석 가능
- `reference_reviewer`: 승인·거절 가능
- `reference_admin`: 권한·정책·Archive 관리

등록자와 승인자는 운영 정책에 따라 분리할 수 있어야 한다.

---

## 11. 프로모션 빌더 연결 계획

### 11.1 추천 입력

레퍼런스 추천은 최소한 다음 정보를 사용한다.

- 프로모션 유형
- 시장과 Locale
- 대상 사용자
- 주요 혜택과 CTA
- 콘텐츠 양
- 필수 섹션과 고정 정책
- 원하는 톤과 디자인 태그
- 사용 가능한 컴포넌트와 레이아웃
- 이미지 비율과 자산 준비 여부

### 11.2 검색 단계

```text
승인 상태 필터
→ 권한·시장·브랜드 범위 필터
→ 프로모션 유형·태그 Rule Score
→ 콘텐츠·컴포넌트 구현 가능성 점수
→ Layout Fit Score
→ 향후 Semantic Similarity
→ 상위 후보 3~5개
```

초기에는 PostgreSQL 필터와 규칙 점수를 사용한다. 검색 품질을 측정한 뒤 `pgvector` 또는 별도 Vector Store를 검토한다.

### 11.3 빌더 사용자 기능

- 자동 추천 레퍼런스 3개 표시
- 추천 이유와 적용 가능한 영역 표시
- 직접 검색·선택
- 적용 범위 선택
  - 전체 분위기
  - 색상·Typography만
  - 레이아웃만
  - 컴포넌트 패턴만
  - 이미지 구성만
- 적용 전후 비교
- 선택 해제와 재추천
- 사용된 레퍼런스와 패턴 출처 확인

### 11.4 Compiler 계약

AI가 선택한 레퍼런스를 직접 CSS로 변환하지 않는다.

```text
Reference Pattern
→ Existing Registry Candidate
→ Allowed Token Slot
→ Approved Layout Preset 또는 Draft Preset Candidate
→ Deterministic Compiler
→ Quality Gate
```

최종 Composition Snapshot에는 다음을 남긴다.

```json
{
  "referenceUsage": {
    "contractVersion": 1,
    "sourceIds": [],
    "tokenSetVersionIds": [],
    "componentPatternIds": [],
    "layoutPatternIds": [],
    "mappingDecisions": [],
    "retrievalSnapshot": {},
    "rightsSnapshot": {}
  }
}
```

---

## 12. 품질 게이트 보완

기존 Live Preview 품질 게이트에 다음 검사를 추가한다.

### 12.1 데이터 품질

- 승인되지 않은 레퍼런스 사용 금지
- Evidence가 없는 고신뢰도 데이터 금지
- Archive 또는 권한 만료 레퍼런스 사용 금지
- 분석 계약 버전 호환성 검사
- 사용된 패턴과 원본 출처 연결 검사

### 12.2 구현 가능성

- Registry에 없는 컴포넌트 참조 금지
- 허용되지 않은 Style Slot 변경 금지
- Desktop·Mobile Layout Contract 검증
- 필수 섹션·고정 위치 보존
- 등록되지 않은 이미지 자산 직접 사용 금지

### 12.3 렌더 품질

- 요소 충돌, 잘림, Overflow
- 텍스트 대비와 최소 크기
- 과도한 빈 공간
- CTA 가시성
- 이미지 Safe Area
- Desktop·Mobile 콘텐츠 순서
- Terms와 Responsible Gaming 등 필수 정책 콘텐츠

### 12.4 모방·권리 위험

- 외부 로고와 상표 직접 포함 여부
- 외부 카피의 장문 일치
- 자산 재사용 금지 레퍼런스의 이미지 URL 포함 여부
- 하나의 외부 레퍼런스와 과도하게 유사한 조합
- 출처와 권한 스냅샷 누락

---

## 13. 보안·법무·운영 정책

### 13.1 URL 및 SSRF 방어

- HTTPS만 허용
- URL 자격 증명과 비표준 포트 차단
- DNS 확인 후 사설·Loopback·Link-local·Metadata IP 차단
- Redirect마다 URL과 DNS 재검증
- 최대 Redirect, Timeout, 응답 크기 제한
- Browser Worker의 모든 하위 요청에 네트워크 정책 적용
- 파일 다운로드, 새 창, 팝업, 외부 Protocol 차단
- 사내망 접근이 필요한 경우 공개 URL 수집과 분리된 별도 승인 경로 사용

현재 `_safe-remote-image.js`의 원격 이미지 검증 원칙을 공통화하되, 페이지 캡처는 별도 `safe-remote-page`와 브라우저 Request Interception으로 구현한다.

### 13.2 콘텐츠 격리

- 수집 HTML을 서비스 Origin에서 직접 실행하지 않는다.
- 저장된 Script는 재실행하지 않는다.
- DOM Snapshot은 정적 데이터로만 사용한다.
- 관리자 Preview는 Screenshot 우선으로 제공한다.
- 필요한 경우 Sandbox Origin과 제한된 CSP를 사용한다.

### 13.3 파일 업로드

- 확장자가 아니라 실제 MIME Signature 검사
- PNG, JPEG, WebP 중심 Allowlist
- 파일 크기와 최대 픽셀 제한
- EXIF와 불필요한 Metadata 제거
- 콘텐츠 해시와 중복 검사
- 악성 파일 검사 정책
- 원본 Blob 접근 권한과 만료 URL 정책

### 13.4 권리·개인정보

- 출처 URL과 수집 시점 보존
- 패턴 참고 허용과 원본 자산 재사용 허용을 분리
- 로고, 인물, 개인정보, 문구, 이미지 권리 상태 기록
- 삭제 요청 시 원본·파생 분석·검색 인덱스를 함께 비활성화
- 제한된 레퍼런스는 기존 사용 문서에 Snapshot만 남기고 신규 추천에서 제외

---

## 14. 비기능 요구사항

### 14.1 신뢰성

- 모든 캡처·분석 작업에 Idempotency Key 적용
- Lease 만료 작업 자동 복구
- 단계별 실패 원인과 Retry 가능 여부 저장
- 동일 해시 입력의 중복 분석 방지
- 외부 AI Provider 장애 시 명확한 실패 상태와 재시도 제공

### 14.2 성능

- 목록 API는 원본 대형 JSON을 반환하지 않는다.
- 썸네일과 원본 이미지를 분리한다.
- 분석 결과는 요약 목록과 상세 데이터로 분리한다.
- 검색용 Metadata에 적절한 인덱스를 추가한다.
- Capture와 분석은 사용자 HTTP 요청 생명주기와 분리한다.

### 14.3 관측성

추적할 지표:

- 등록 건수와 중복 차단 건수
- URL 캡처 성공률·평균 시간·실패 단계
- 이미지 분석 성공률·평균 시간·비용
- 검수 대기 시간과 승인·거절률
- 신뢰도 구간별 운영자 수정률
- 추천 노출·선택·적용·취소율
- 적용 후 수동 수정량
- 레퍼런스 사용 결과의 품질 게이트 통과율
- 모델·프롬프트 버전별 품질과 비용

### 14.4 접근성·국제화

- 관리자 UI의 Keyboard 탐색
- 상태를 색상만으로 표현하지 않음
- 분석·오류 메시지 Locale 지원
- 참조 화면과 편집 폼에 대체 텍스트 제공
- 생성된 프로모션의 대비와 텍스트 크기 Gate 유지

---

## 15. 단계별 개발 계획

### 15.1 Stage 0. 현행 기준선과 제품 계약 확정 — P0

#### 목적

POC에서 실제 유지할 기능과 계약을 확정하고, 신규 기능이 불안정한 기반 위에 추가되지 않도록 한다.

#### 작업

- 실제 사용 화면·API·DB·Worker 목록 작성
- `prototype`, `visual-editor`, `admin-app` 책임과 중복 로직 확인
- 핵심 E2E 흐름과 상태 정의
- 운영 스키마와 Migration 일치 확인
- 인증·권한·소유자 범위 점검
- 공통 API 오류·요청 ID·Idempotency 계약 정의
- Builder Document, Proposal, Asset Job 상태 전이 정리
- Preview·Export·Renderer 공통 계약 확인
- 기존 테스트의 실제 보장 범위 작성
- 레퍼런스 도메인 용어와 권리 정책 결정

#### 산출물

- AS-IS 시스템 맵
- 유지/보완/교체 결정표
- 공통 상태·오류·권한 계약
- 데이터 마이그레이션 원칙
- 회귀 테스트 기준선

#### 완료 기준

- 핵심 기능마다 단일 책임 Owner 모듈이 식별된다.
- 신규 Reference 도메인이 기존 Design MD와 충돌하지 않는다.
- P0 회귀 시나리오와 배포 차단 기준이 문서화된다.

### 15.2 Stage 1. 공통 운영 기반 안정화 — P0

#### 작업

- 공통 비동기 작업 상태·Lease·Retry 모듈화
- Prompt·Model·Input·Output Snapshot 표준화
- 감사 로그와 Actor Subject 규칙 확정
- Blob 저장과 DB Record 정합성 검사
- Feature Flag와 Rollout 정책
- Reference 관련 권한과 API Middleware
- 공통 오류 코드와 관리자용 오류 메시지
- Migration Apply/Verify/Rollback 절차

#### 완료 기준

- 중복 요청이 중복 작업을 만들지 않는다.
- Worker 중단 후 Lease 만료 작업이 복구된다.
- 모든 AI 결과가 입력·모델·프롬프트 버전으로 추적된다.
- 권한 없는 사용자가 원본과 분석 결과에 접근할 수 없다.

### 15.3 Stage 2. 스크린샷 기반 Design Reference MVP — P1

#### 작업

- Reference Source·Capture·Analysis·Evidence·Review Migration
- 스크린샷 직접 업로드 API
- 파일 검증·해시·중복 탐지·Blob 저장
- 멀티모달 분석 작업 생성·처리
- 공통 분석 스키마와 Validator
- 기존 Design MD 데이터 구조로 Normalization
- 관리자 Reference Library 목록·상세
- 분석 검수·수정·승인·거절
- 승인 데이터만 조회하는 API

#### 완료 기준

- 운영자가 Desktop·Mobile 스크린샷을 하나의 Reference로 등록할 수 있다.
- 분석 결과에 토큰·섹션·컴포넌트·레이아웃·근거·신뢰도가 존재한다.
- 승인 전 데이터는 빌더 검색 결과에 노출되지 않는다.
- 재분석해도 이전 분석과 검수 이력이 보존된다.

### 15.4 Stage 3. 빌더 수동 적용과 품질 게이트 — P1

#### 작업

- 승인 레퍼런스 검색·필터 API
- Builder Reference 선택 UI
- 적용 범위 선택
- Pattern-to-Registry Adapter
- Pattern-to-Preset Draft Adapter
- Reference Usage Snapshot
- 적용 전후 비교와 Undo
- 정책·렌더·권리 품질 게이트
- 사용·거절·수정 Event 저장

#### 완료 기준

- 사용자가 승인된 레퍼런스를 직접 선택할 수 있다.
- 결과가 기존 Registry와 Layout Contract만 사용한다.
- 적용 전후 출처와 Mapping 결정이 추적된다.
- Desktop·Mobile 품질 게이트 실패 시 Preview 승격이 차단된다.

### 15.5 Stage 4. 공개 URL 캡처 — P2

#### 작업

- Safe Remote Page URL Validator
- 격리 Browser Worker
- Browser Request Interception과 네트워크 차단
- Desktop·Tablet·Mobile Capture Manifest
- Full-page Screenshot, DOM Snapshot, Computed Style Summary
- 동적 로딩·Cookie Banner·Timeout 정책
- Capture 재시도와 재캡처 Version
- URL 정규화·Content Hash 중복 처리

#### 완료 기준

- 허용된 공개 HTTPS URL을 안전하게 캡처한다.
- 사설망·Metadata·비표준 요청이 차단된다.
- Desktop·Mobile Capture가 동일 Source 아래 버전 관리된다.
- 실패 단계와 재시도 가능 여부가 관리자에게 표시된다.

### 15.6 Stage 5. 자동 추천과 Retrieval 고도화 — P2

#### 작업

- Rule·Metadata 기반 Reference Ranker
- Implementability Score
- Layout Fit·Content Fit Score
- Template Recommender Context 연결
- 상위 추천 3~5개와 추천 이유
- 검색 평가 데이터셋
- 필요 시 Embedding과 `pgvector` 도입 검토
- Semantic Score와 Rule Score의 Hybrid Ranking

#### 완료 기준

- 동일 Overview에서 추천 근거를 설명할 수 있다.
- 비승인·권한 불일치·구현 불가 레퍼런스가 제외된다.
- 추천 선택률과 결과 품질을 버전별로 비교할 수 있다.

### 15.7 Stage 6. 피드백 기반 최적화 — P2 이후

#### 작업

- 추천·선택·적용·거절·수정·Rollback 이벤트 분석
- 운영자 수정량과 품질 통과율 기반 Ranking 개선
- Reference·Pattern별 효용 점수
- 시장·프로모션 유형별 추천 보정
- Offline Evaluation과 A/B Rollout
- 충분한 데이터 확보 후 파인튜닝 타당성 평가

#### 완료 기준

- 추천 변경이 기존 품질보다 개선됐음을 Offline/Online 지표로 확인한다.
- 파인튜닝은 권리·데이터 품질·비용·효과 기준을 통과할 때만 별도 승인한다.

---

## 16. API 초안

```text
POST   /api/design-references
GET    /api/design-references
GET    /api/design-reference?id={id}
PATCH  /api/design-reference?id={id}
DELETE /api/design-reference?id={id}

POST   /api/design-reference-upload
POST   /api/design-reference-capture
GET    /api/design-reference-captures?sourceId={id}

POST   /api/design-reference-analysis
GET    /api/design-reference-analysis-runs?sourceId={id}
POST   /api/design-reference-analysis-retry

POST   /api/design-reference-review
GET    /api/design-reference-review-history?sourceId={id}

POST   /api/design-reference-recommendations
POST   /api/design-reference-apply
POST   /api/design-reference-usage-event
```

공통 요구사항:

- 인증과 역할 검증
- `requestId`, `idempotencyKey`, `contractVersion`
- 구조화된 오류 코드
- 현재 Resource Revision 또는 Analysis Version
- 감사 가능한 Actor Subject
- 목록·상세 응답 분리

---

## 17. 테스트 및 검증 계획

### 17.1 단위 테스트

- URL 정규화와 SSRF 차단
- MIME Signature와 파일 크기 제한
- Content Hash와 중복 판정
- 상태 전이와 Lease 복구
- 분석 결과 스키마 검증
- Evidence와 Pattern 연결
- 승인 상태 필터
- Rule/Metadata Ranking
- Pattern-to-Registry Mapping
- Pattern-to-Preset 변환
- 권리 정책 Gate

### 17.2 통합 테스트

- 업로드 → 분석 → 검수 → 승인
- URL 등록 → Capture → 분석 → 승인
- 재분석 후 기존 승인 데이터 보존
- 승인 Reference → 빌더 선택 → Composition 적용
- 적용 후 Undo·Rollback
- Worker Timeout → Lease 만료 → Retry
- Blob 저장 성공·DB 실패 및 반대 상황의 정합성 복구
- Archive 후 신규 추천 제외

### 17.3 브라우저 E2E

- 관리자 Reference 등록과 상태 표시
- Desktop·Mobile 원본과 분석 근거 비교
- 분석값 수정과 승인
- 빌더 추천 카드와 적용 범위 선택
- 적용 전후 비교
- Desktop·Mobile Preview 품질 검사
- 오류·재시도·권한 제한 UX

### 17.4 보안 테스트

- `localhost`, 사설 IP, IPv6 Loopback, Redirect 우회
- DNS Rebinding 대응
- Metadata Endpoint 접근
- 대형 응답과 느린 응답
- 악성 이미지·잘못된 MIME
- 저장 HTML Script 재실행 방지
- 비인가 원본 Blob 접근
- 삭제·Archive 후 검색 인덱스 잔존 여부

### 17.5 품질 평가 데이터셋

초기 고정 평가 세트를 만든다.

- 프로모션 페이지 유형별 공개·내부 승인 샘플
- Desktop·Mobile 쌍
- 고밀도·저밀도 콘텐츠
- 이미지 중심·텍스트 중심 레이아웃
- 유사하지만 구현 불가능한 패턴
- 로고·상표·외부 자산이 포함된 위험 샘플
- 실패해야 하는 URL·파일 케이스

모델·프롬프트·Ranking 변경마다 동일 데이터셋으로 비교한다.

---

## 18. 데이터 마이그레이션 및 호환성

### 18.1 기존 Design MD

- 기존 `design_documents`와 추출 데이터를 즉시 이동하지 않는다.
- 신규 Reference Source에 기존 Document를 연결하는 Backfill Migration을 제공한다.
- 초기에는 기존 API와 신규 API를 병행한다.
- 기존 화면은 신규 Reference Library로 이동 가능한 Redirect 또는 Entry를 제공한다.
- 검증 완료 후 `design-documents` 조회를 신규 Store Adapter로 전환한다.

### 18.2 기존 토큰·패턴

- 기존 Seed와 관리자가 발행한 데이터를 자동 승인된 내부 Reference로 간주할지 정책 결정이 필요하다.
- 출처가 불명확한 기존 데이터는 `rights_status=unknown`으로 표시한다.
- 기존 활성 토큰과 Layout을 신규 Reference 승인 여부 때문에 비활성화하지 않는다.
- 신규 Reference가 기존 데이터의 Source/Provenance를 보완하는 방향으로 연결한다.

### 18.3 Builder 호환성

- `referenceUsage`가 없는 기존 Builder Document도 정상 렌더링해야 한다.
- Reference 기능은 Feature Flag로 활성화한다.
- 기존 Template Mode와 AI Mode의 기본 결과는 Flag Off에서 변경하지 않는다.
- 신규 Snapshot 필드는 Optional로 시작하고 Cutover 이후 필수화한다.

---

## 19. 성공 지표

### 19.1 안정성

- Capture/Analysis 작업이 중간 상태에 영구 정체되지 않는다.
- 동일 Idempotency Key로 중복 Source·작업이 생성되지 않는다.
- 실패 작업의 단계와 복구 방법이 모두 표시된다.
- 승인되지 않은 레퍼런스의 빌더 사용 건수는 0건이다.

### 19.2 데이터 품질

- 모든 승인 Pattern에 Source와 Evidence가 연결된다.
- 낮은 신뢰도 항목의 자동 승인 건수는 0건이다.
- 재분석 후 이전 분석·승인 이력을 재현할 수 있다.
- Reference 사용 결과에서 토큰·컴포넌트·레이아웃 버전을 추적할 수 있다.

### 19.3 디자인 활용

- 추천 후보 간 레이아웃·시각 스타일 다양성이 측정된다.
- 운영자의 추천 선택률과 적용 완료율이 증가한다.
- 레퍼런스 적용 후 수동 수정량이 기준선보다 감소한다.
- Desktop·Mobile 품질 게이트 통과율이 유지 또는 개선된다.

### 19.4 운영 효율

- 레퍼런스 등록부터 승인까지 소요 시간을 측정할 수 있다.
- 실패 원인 상위 항목과 비용 상위 분석 유형을 확인할 수 있다.
- 모델·프롬프트 변경 전후의 승인율과 수정률을 비교할 수 있다.

초기 기준선이 없으므로 Stage 0~2에서 지표를 수집한 후 구체적인 목표 수치를 확정한다.

---

## 20. 주요 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| POC 중복 로직 위에 신규 기능 추가 | 수정 범위 확대와 회귀 | Stage 0에서 단일 책임과 Cutover 경계 확정 |
| AI 분석 오류가 디자인 지식에 축적 | 생성 품질 오염 | Draft·Evidence·신뢰도·운영자 승인 필수 |
| 외부 페이지 과도한 모방 | 법무·브랜드 위험 | 패턴 추상화, 자산 재사용 분리, 유사성 Gate |
| URL 수집을 통한 SSRF | 내부 시스템 침해 | 격리 Worker, DNS/IP 검증, 요청 Interception |
| URL의 동적 렌더링 실패 | 분석 불완전 | Capture 정책, 실패 단계, 수동 Screenshot 대체 |
| Vector 검색 조기 도입 | 복잡도 증가, 효과 불명 | 규칙 기반 MVP 후 평가에 따라 도입 |
| 파인튜닝 조기 추진 | 비용·권리·품질 위험 | 승인 피드백 데이터 축적 후 별도 Gate |
| 분석 결과와 실제 Registry 불일치 | 적용 실패 | Implementability Score와 Adapter 검증 |
| 기존 Design MD 이중 관리 | 데이터 혼선 | 상위 Reference 연결, 단계적 API Cutover |
| 대형 이미지·분석 비용 증가 | 성능·비용 악화 | 크기 제한, 썸네일, 중복 Hash, 비용 지표 |

---

## 21. 결정이 필요한 정책 항목

개발 착수 전 다음 결정을 확정한다.

1. 외부 공개 URL 등록 허용 범위와 Host 정책
2. 내부 사이트 또는 로그인 페이지 지원 여부
3. 원본 이미지·로고·카피 재사용 허용 기준
4. 등록자와 승인자 역할 분리 여부
5. 승인된 Reference의 브랜드·시장별 노출 범위
6. 기존 Design MD 데이터의 초기 승인 상태
7. Capture 원본과 DOM Snapshot 보존 기간
8. 삭제 요청 시 파생 토큰·패턴·사용 Snapshot 처리 방식
9. n8n과 애플리케이션 Worker의 장기 책임 경계
10. Vector 검색 도입 판단에 사용할 평가 기준

---

## 22. 우선 개발 백로그

### P0 — 착수 전 기반

- [ ] 현행 화면·API·DB·Worker 인벤토리
- [ ] Design Reference 용어·상태·권한 계약
- [ ] 신규 DB Migration 설계 검토
- [ ] 공통 작업 Lease·Retry Adapter 설계
- [ ] 기존 Design MD 연결 전략
- [ ] Reference 분석 JSON Schema
- [ ] Rights·Provenance 정책
- [ ] Feature Flag와 Rollout 계획
- [ ] 회귀 테스트 기준선

### P1 — Screenshot MVP

- [ ] Reference Source/Capture/Analysis/Evidence/Review 테이블
- [ ] Screenshot Upload API
- [ ] 파일 검증·Hash·Blob Adapter
- [ ] Vision Analysis Worker
- [ ] Normalizer와 Validator
- [ ] Reference Library 목록·상세
- [ ] 분석 검수·수정·승인
- [ ] 승인 Reference 조회 API
- [ ] 빌더 수동 선택
- [ ] Pattern-to-Registry Mapping
- [ ] Reference Usage Snapshot
- [ ] 품질 게이트와 Usage Event

### P2 — URL 및 자동 추천

- [ ] Safe Remote Page Validator
- [ ] Isolated Browser Capture Worker
- [ ] Desktop·Tablet·Mobile Capture
- [ ] DOM·Computed Style Summary
- [ ] Rule/Metadata Ranker
- [ ] Implementability·Layout Fit Score
- [ ] Template Recommender 연결
- [ ] 추천 근거 UI
- [ ] Retrieval 평가 데이터셋
- [ ] Vector 검색 도입 여부 결정

---

## 23. 최종 완료 정의

다음 조건을 만족하면 외부 디자인 레퍼런스 기능을 제품 수준으로 완료한 것으로 본다.

1. 운영자가 URL, 스크린샷, Design MD를 하나의 Reference Library에서 관리한다.
2. 원본과 Capture, 분석, Evidence, 검수, 승인이 버전으로 연결된다.
3. 승인되지 않은 데이터는 추천과 생성에 사용되지 않는다.
4. 프로모션 Overview에 적합한 Reference와 Pattern을 설명 가능한 방식으로 추천한다.
5. Reference Pattern은 기존 컴포넌트·토큰·레이아웃 계약으로만 적용된다.
6. 필수 정책과 Desktop·Mobile 품질 게이트를 통과한 결과만 Live Preview로 승격된다.
7. 실패 작업은 복구 가능하고, 운영자가 실패 원인과 다음 행동을 확인할 수 있다.
8. 적용 결과에서 사용한 원본·분석·토큰·컴포넌트·레이아웃 버전을 추적할 수 있다.
9. 선택·거절·수정·Rollback 이벤트가 향후 추천 개선 데이터로 축적된다.
10. 외부 자산과 권리 제한이 생성 결과에 안전하게 반영된다.

---

## 24. 권장 착수 순서

즉시 구현을 시작할 첫 단위는 URL 자동 캡처가 아니라 **Screenshot 기반 승인형 Reference MVP**다.

```text
1. 현행 기준선·공통 계약 확정
2. Reference 데이터 모델과 상태 머신
3. Screenshot Upload와 원본 보관
4. 멀티모달 분석과 공통 스키마
5. 운영자 검수·승인
6. 빌더 수동 선택과 Registry Mapping
7. 품질 게이트와 피드백
8. 공개 URL Capture
9. 자동 추천·Semantic Retrieval
10. 데이터가 충분한 시점에 모델 학습 검토
```

이 순서는 보안과 브라우저 변수가 큰 URL Capture에 앞서 핵심 가치인 `분석 → 구조화 → 검수 → 빌더 활용`을 먼저 검증한다. 동시에 POC에서 제품으로 전환하는 데 필요한 상태, 권한, 감사, 재현성, 품질 계약을 실제 E2E 흐름 안에서 완성할 수 있다.
