# Visual Renderer 및 웹 출력 개발 계획서

- 작성일: 2026-07-16
- 상태: 개발 착수 전 계획
- 전제: n8n 유지
- 관련 문서: `visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md`

## 1. 목적

현재의 이미지 중심 프로세스를 실제 웹 Renderer 중심 프로세스로 점진적으로 전환한다.

```text
현재
Content -> Integrated Brief -> LO-FI Image -> Final Image -> Web Output

목표
Content -> Integrated Brief -> Design Spec -> Vue Renderer Preview
        -> Section Asset Generation -> QA -> Web Output
```

기존 n8n Workflow는 제거하지 않는다. 운영 중인 Integrated Brief, LO-FI, Final Design 생성 기능을 유지하면서 신규 Design Spec과 Asset 생성 Workflow를 추가한다.

## 2. 확정 원칙

1. n8n은 LLM·이미지 모델 실행과 외부 서비스 연동을 담당한다.
2. 애플리케이션은 입력 검증, DB 상태, Snapshot, 결과 검증의 Source of Truth다.
3. 관리자 Form Template은 콘텐츠 입력 스키마로 유지한다.
4. Visual Template은 별도의 Renderer Registry로 관리한다.
5. Preview와 최종 Web Output은 동일 Vue Renderer를 사용한다.
6. 초기 LLM은 자유 Vue 코드를 생성하지 않고 구조화된 Design Spec만 생성한다.
7. 기존 LO-FI/Final 이미지 기능은 Feature Flag로 병행한다.
8. 신규 파이프라인이 검증되기 전 기존 Workflow와 테이블을 삭제하지 않는다.

## 3. 시스템 역할 분담

### 애플리케이션

- Form Template, Section, Item 관리
- Promo Content 입력과 필수값 검증
- `configRevision`, `sectionSnapshot`, 콘텐츠 Snapshot 저장
- Generation Run 및 단계별 상태 관리
- n8n 요청 payload 생성과 callback 검증
- Design Spec Schema 검증
- 콘텐츠 coverage validation
- Renderer 선택과 실제 Preview
- Web Output 저장·조회
- 관리자 실행 이력과 오류 표시

### n8n

- Integrated Brief LLM 실행
- Page Design Spec 후보 생성
- Section Asset 요청 분석
- 이미지 모델 실행
- 모델별 인증 및 호출 방식 추상화
- 재시도 가능한 외부 API 처리
- 애플리케이션 callback API 호출

### Vue Renderer

- Promo Content를 실제 DOM으로 렌더링
- Design Spec을 허용된 Variant와 Token에 적용
- Desktop/Mobile 반응형 출력
- Generic Section/Item fallback
- Preview와 Web Output의 단일 렌더링 Source of Truth

## 4. 목표 Wizard 흐름

### Step 1. Style Setup

- 배경색, 글자색, CTA 스타일, 기본 톤 선택
- 기존 Concept 데이터와 연결 여부는 별도 결정

### Step 2. Visual Content Editor

- Form Template 선택
- 실제 Vue 페이지 Preview 표시
- Section/Item 선택 시 입력 패널 표시
- 입력값을 Preview에 즉시 반영
- 관리자 설정에 따라 Section/Item 순서 변경
- 필수값, URL, 이미지 입력 검증

### Step 3. Design Variants

- Integrated Brief 생성 또는 기존 결과 재사용
- n8n을 통해 Design Spec 후보 2~3개 생성
- 동일 Renderer에 후보 Spec을 적용해 실제 웹으로 비교
- 필요한 Section 이미지를 n8n에서 생성
- Variant 하나 선택

### Step 4. Web Output

- 선택된 Content, Design Spec, Asset Manifest Snapshot 확정
- 동일 Renderer로 최종 페이지 출력
- Desktop/Mobile Preview
- QA 결과 표시
- 저장된 Web Output 이력 조회

## 5. 데이터 모델 계획

### 5.1 Renderer Registry

`wizard_renderers`

- `id`
- `renderer_key`
- `name`
- `description`
- `status`
- `version`
- `component_entry`
- `contract_version`
- `supported_section_kinds`
- `created_at`, `updated_at`

### 5.2 Form Template 연결

`wizard_form_template_renderers`

- `form_template_id`
- `renderer_id`
- `is_default`
- `sort_order`
- `is_visible`

초기 관계는 Form Template 1:N Renderer로 구성한다. 각 Form Template에는 반드시 기본 Renderer 하나가 있어야 한다.

### 5.3 Design Spec

`promo_generation_design_specs`

- `id`, `run_id`, `attempt`
- `renderer_id`, `renderer_version`
- `status`
- `design_spec jsonb`
- `prompt_snapshot jsonb`
- `model_meta jsonb`
- `validation_result jsonb`
- `error_message`
- 생성·수정 시각

### 5.4 Asset Manifest

`promo_generation_assets`

- `id`, `run_id`, `design_spec_id`
- `section_key`, `item_key`
- `asset_role`
- `source_type`
- `status`
- `asset_url`
- `mime_type`, `width`, `height`
- `focal_point jsonb`
- `safe_area jsonb`
- `prompt_snapshot jsonb`
- `model_meta jsonb`

### 5.5 Web Output

`promo_generation_web_outputs`

- `id`, `run_id`, `design_spec_id`
- `renderer_id`, `renderer_version`
- `status`
- `content_snapshot jsonb`
- `design_spec_snapshot jsonb`
- `asset_manifest_snapshot jsonb`
- `validation_result jsonb`
- `preview_url`
- 생성·수정 시각

## 6. n8n Workflow 계획

### 유지 Workflow

- Integrated Brief
- LO-FI Draft Image
- Final Design Image

기존 payload와 callback 계약을 변경하지 않는다. 신규 파이프라인 안정화 전까지 Wizard에서 계속 사용할 수 있어야 한다.

### 신규 Workflow A: Design Spec Generation

입력:

- `runId`, `designSpecId`
- Integrated Brief
- Content Snapshot
- Form Template Snapshot
- Renderer Contract
- Style Setup
- 관리자 Prompt/Model 설정

출력:

- JSON Design Spec
- coverage map
- asset requests
- model metadata

처리:

```text
Webhook
 -> 요청 ID 검증
 -> 관리자 설정 조회
 -> LLM Structured Output
 -> JSON Parse
 -> Callback API
```

### 신규 Workflow B: Section Asset Generation

입력:

- `runId`, `assetId`
- Section/Item Content
- 이미지 역할과 비율
- Design Spec의 tone, focal point, safe area

출력:

- 생성 이미지 또는 저장소 URL
- 크기와 MIME type
- model metadata

### n8n 운영 규칙

- n8n은 DB 상태를 임의로 직접 변경하지 않고 callback API를 우선 사용한다.
- 모든 요청에 `runId`, 대상 ID, attempt, contract version을 포함한다.
- callback은 중복 호출에 안전한 idempotent 방식으로 구현한다.
- Workflow ID와 version을 실행 Snapshot에 저장한다.
- 테스트 Workflow와 운영 active Workflow를 명확히 구분한다.
- 각 노드는 입력과 출력 Schema를 가진다.

## 7. API 계획

### Renderer

- `GET /api/wizard-renderers`
- `GET /api/wizard-renderer?id=...`
- `POST /api/wizard-renderers`
- `PATCH /api/wizard-renderer`
- `POST /api/wizard-form-template-renderers`

### Design Spec

- `POST /api/promo-generation-design-specs`
- `POST /api/promo-generation-design-spec-complete`
- `GET /api/promo-generation-design-specs?runId=...`
- `POST /api/promo-generation-design-spec-select`

### Asset

- `POST /api/promo-generation-assets`
- `POST /api/promo-generation-asset-complete`
- `GET /api/promo-generation-assets?runId=...`

### Web Output

- `POST /api/promo-generation-web-outputs`
- `GET /api/promo-generation-web-output?id=...`
- `GET /api/promo-generation-web-outputs?runId=...`

모든 callback API는 대상 ID, 상태 전이, attempt, 중복 요청을 검증해야 한다.

## 8. Design Spec 계약

초기 LLM 출력은 다음 범위만 허용한다.

- 색상 Token
- Typography Token
- Section별 Layout Variant
- 정렬과 간격 단계
- 이미지 배치 방식
- CTA Variant
- Desktop/Mobile 구성 옵션
- Asset Request

금지 항목:

- 임의 HTML
- 임의 Vue 코드
- 임의 JavaScript
- 외부 Script 및 CDN
- DB Key 변경
- 콘텐츠 원문 변경
- 임의 URL 생성

Design Spec은 JSON Schema 또는 Zod로 검증하고, 허용되지 않은 속성이 있으면 완료 상태로 저장하지 않는다.

## 9. Renderer 개발 계획

### 공통 Component

- `PromoPageRenderer`
- `SectionRenderer`
- `GenericSection`
- `TextItem`
- `ImageItem`
- `ImageDescriptionItem`
- `CtaItem`
- `AssetPlaceholder`

### Renderer 규칙

- `sectionInputs`를 변경 없이 입력으로 받는다.
- 알려진 Section은 전용 Component를 사용할 수 있다.
- 알 수 없는 Section은 Generic Renderer로 출력한다.
- 모든 Wizard-visible Item이 DOM 또는 명시적 비노출 결과로 매핑되어야 한다.
- CTA URL은 사용자 입력값과 UTM 규칙을 사용한다.
- 텍스트를 배경 이미지에 합성하지 않는다.
- Renderer 내부에서 LLM을 호출하지 않는다.

## 10. 검증 계획

### 데이터 검증

- 필수 Section/Item 누락
- Content Snapshot과 표시 DOM coverage
- Design Spec Schema
- Renderer Contract version
- Asset 상태와 URL
- CTA URL/UTM

### 화면 검증

- Desktop 1440px
- Tablet 768px
- Mobile 375px
- 텍스트 overflow
- 버튼과 이미지 겹침
- Section 순서
- 이미지 focal point
- 배경 대비
- 키보드 접근과 heading 구조

### Preview/Output 동등성

동일한 아래 입력으로 Preview와 Web Output을 렌더링한다.

- Renderer ID/Version
- Content Snapshot
- Design Spec Snapshot
- Asset Manifest Snapshot

두 화면이 다른 데이터 변환기를 사용하지 않도록 한다.

## 11. 단계별 개발 계획

### Phase 0. 계약 확정

- 기존 n8n payload와 callback 목록화
- Form Template과 Renderer 경계 확정
- Renderer Contract 작성
- Design Spec Schema 작성
- 상태 전이표와 Feature Flag 정의

완료 기준:

- API/DB/n8n 간 요청·응답 Schema가 문서화됨
- 기존 Workflow에 변경이 없음을 확인

### Phase 1. Default Renderer 기술 검증

- DB 없이 코드 Registry로 Default Renderer 구현
- 현재 Step 2 `sectionInputs` 연결
- Generic Section/Item 구현
- 별도 Web Output route 구현
- Preview/Output 동등성 테스트

완료 기준:

- Default Form Template의 모든 표시 Item 출력
- Desktop/Mobile에서 동일 콘텐츠 확인
- 기존 Wizard 생성 기능 영향 없음

### Phase 2. Renderer Registry와 관리자 연결

- migration 및 CRUD API
- Form Template-Renderer 연결
- 관리자 `프로모션 폼관리`에 Renderer 연결 UI 추가
- active/default/version 검증

완료 기준:

- 템플릿별 기본 Renderer 선택 가능
- active Form Template 공개 API에 Renderer metadata 포함

### Phase 3. Wizard Visual Content Editor

- 실제 Renderer Preview 추가
- Section/Item 선택과 편집 패널 연결
- 입력 즉시 반영
- 순서 변경과 고정 규칙 반영
- 이미지 placeholder/URL 표시
- 기존 Accordion 입력은 초기 fallback으로 유지

완료 기준:

- 입력값 변경이 Preview에 즉시 반영
- 새로 만든 관리자 Section도 Generic Renderer로 출력
- 필수값과 순서 저장 정상

### Phase 4. n8n Design Spec Workflow

- 관리자 Model/Prompt 설정 확장
- Design Spec 생성 API 및 DB
- 신규 n8n Workflow
- callback 및 Schema validation
- 후보 2~3개 Renderer Preview

완료 기준:

- 동일 콘텐츠로 유효한 Variant 후보 생성
- 콘텐츠 원문이 Design Spec에 의해 변경되지 않음
- 실패 시 원인과 재시도 표시

### Phase 5. n8n Asset Workflow

- Asset Request 추출
- 이미지 생성 Workflow
- 저장소 업로드와 metadata 저장
- focal point/safe area 적용
- Asset 재생성 이력

완료 기준:

- 필요한 Section 이미지만 생성
- 이미지 실패가 전체 콘텐츠 입력을 유실시키지 않음
- 기존 Asset과 신규 attempt가 함께 보존됨

### Phase 6. Web Output과 QA

- Web Output Snapshot 저장
- Desktop/Mobile Preview
- coverage, overflow, accessibility 검사
- QA 실패 차단 및 재실행
- 생성 이력 조회

완료 기준:

- 선택된 Variant와 Web Output이 동일
- 모든 필수 콘텐츠 coverage 통과
- 반응형 오류가 없는 결과만 완료 처리

### Phase 7. 병행 운영과 전환 판단

- 기존 Image Pipeline과 신규 Renderer Pipeline Feature Flag
- 동일 프로모션 A/B 결과 비교
- 실패율, 시간, 비용, 콘텐츠 충실도 측정
- LO-FI/Final 이미지 단계 유지 또는 축소 결정

완료 기준:

- 신규 Renderer의 운영 기준 충족
- 기존 이력 조회와 재생성 기능 영향 없음
- 전환 승인 전 기존 n8n Workflow 삭제 금지

### Phase 8. 선택적 LLM Vue 코드 생성

Design Spec 방식이 안정화된 이후 별도 승인으로 진행한다.

- Template Generation Contract
- Sandbox Build
- import allowlist
- 자동 QA 및 수정 Loop
- 승인된 Renderer Registry 등록

이 단계는 MVP 필수 범위가 아니다.

## 12. 우선순위

| 우선순위 | 작업 |
|---|---|
| P0 | 계약 확정, Default Renderer, Preview/Output 동등성 |
| P1 | Renderer Registry, 관리자 연결, Visual Content Editor |
| P1 | Design Spec Schema/API/n8n Workflow |
| P2 | Section Asset Pipeline과 자동 QA |
| P2 | 병행 운영 및 전환 지표 |
| P3 | LLM Vue 코드 생성과 Sandbox |

## 13. 예상 이슈와 대응

### n8n과 앱의 payload 버전 불일치

- `contractVersion` 필수화
- callback에서 지원 version 검사
- Workflow version Snapshot 저장

### Form Template 변경으로 기존 Run 재현 불가

- 실행 시 Form Template, Section, Item 전체 Snapshot 저장
- Renderer와 Design Spec version도 함께 고정

### 관리자 신규 Section이 Renderer에 없음

- Generic Renderer fallback
- unsupported item은 생성 차단이 아니라 configuration warning으로 표시

### Design Spec이 콘텐츠를 변경

- LLM 출력에서 콘텐츠 필드 금지
- 콘텐츠는 `sectionInputs`에서만 Renderer에 공급

### n8n 실행 중복

- 대상 ID + attempt unique constraint
- callback idempotency
- 허용된 상태 전이만 적용

### Preview와 Web Output 차이

- 동일 Component와 입력 Snapshot 사용
- Preview 전용 HTML/CSS 금지

## 14. 테스트 범위

- Form Template별 Renderer 조회
- active/default/version 충돌
- 사용자 정의 Section/Item fallback
- Section/Item 순서 및 고정 규칙
- 텍스트, 이미지, 이미지+설명, CTA 렌더링
- n8n 성공·실패·timeout·중복 callback
- Design Spec invalid JSON 및 Schema 오류
- Asset 부분 실패와 재생성
- Desktop/Mobile visual regression
- 기존 Integrated Brief·LO-FI·Final 회귀 테스트
- 기존 생성 이력 조회

## 15. 첫 번째 개발 단위

첫 개발은 다음 범위로 제한한다.

1. Renderer Contract 문서화
2. Default Renderer 한 개 구현
3. 현재 Wizard `sectionInputs` 연결
4. Step 2 Preview와 별도 Web Output route에서 동일 Renderer 사용
5. Desktop/Mobile 및 콘텐츠 coverage 테스트

n8n Workflow, DB migration, 관리자 UI는 첫 기술 검증이 통과한 다음 진행한다. 이 순서로 진행하면 기존 운영 파이프라인을 수정하지 않고도 신규 구조의 핵심인 Preview/Output 동등성을 먼저 검증할 수 있다.

## 16. 최종 완료 기준

- 관리자 Form Template의 모든 표시 콘텐츠가 Visual Editor에 나타난다.
- 사용자가 입력한 값이 실제 Vue Preview에 즉시 반영된다.
- n8n에서 유효한 Design Spec과 Section Asset을 생성한다.
- 선택한 Preview와 최종 Web Output이 동일 Renderer로 출력된다.
- 콘텐츠 coverage와 반응형 QA를 통과한 결과만 완료된다.
- 기존 Integrated Brief·LO-FI·Final n8n Workflow와 생성 이력이 유지된다.
- 장애 발생 시 Run, n8n Execution, callback 로그로 원인을 추적할 수 있다.
