# 관리자 LLM·프롬프트 하드코딩 정리 및 Control Plane 보완 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-29
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 검토 완료·개발 전
- 대상 관리자 메뉴: `설정 > LLM 및 프롬프트 관리`
- 기준 문서:
  - `docs/claude/review-hardcoded-llm-prompts-2026-07-28.md`
  - `docs/계획/admin-llm-prompt-control-plane-development-plan-2026-07-25.md`
  - `docs/계획/admin-llm-prompt-version-grouping-development-plan-2026-07-27.md`
- 신규 DB 마이그레이션: 1차 구현에는 없음

### 0.1 목적

프로모션 빌더에서 사용하는 LLM 실행 지침과 실행 설정을 관리자 Control Plane에서 관리하되, 서버가 반드시 강제해야 하는 안전·출력 계약까지 관리자 편집 대상으로 이동시키지 않는다.

이번 계획은 하드코딩 문자열을 단순히 모두 DB로 옮기는 작업이 아니다. 다음 네 영역을 명확히 분리하는 것이 목적이다.

```text
1. 관리자 편집 영역
   └─ 창작 방향, 품질, 톤, 매핑 지침, 모델 실행 설정

2. 서버 불변 계약
   └─ JSON Schema, 허용 목록, Scope, 잠금, 보안, 필수 출력 검증

3. 저장소 복구 기준
   └─ 신규 환경과 장애 복구를 위한 Repository Baseline

4. 제외·레거시 영역
   └─ 디자인 생성기와 n8n 구형·테스트 워크플로
```

### 0.2 핵심 목표

- 대상 LLM 기능이 활성 DB Prompt Version 없이 조용히 실행되지 않게 한다.
- 실제 실행 Prompt와 관리자 화면의 차이를 확인할 수 있게 한다.
- 저장소 기본값과 DB 활성 버전의 드리프트를 표시한다.
- 저장소 기본값을 관리자가 명시적으로 새 초안으로 가져올 수 있게 한다.
- 서버 안전 계약은 코드에 유지하되 관리자 화면에서 읽기 전용으로 확인 가능하게 한다.
- 디자인 생성기와 n8n은 이번 개발 범위에서 분리한다.

---

## 1. 범위

## 1.1 포함 Prompt Type

기존 Control Plane 대상 5종과 최근 추가된 프로모션 Overview·템플릿 기능 3종을 포함한다.

| Prompt Type | 기능 | 포함 |
|---|---|---:|
| `section_layout_planner` | 섹션 레이아웃·스타일 계획 | 예 |
| `multi_component_layout_planner` | 다중 컴포넌트 정렬 제안 | 예 |
| `section_composition_planner` | 자연어 기반 섹션 구성 | 예 |
| `section_background_image` | 섹션 배경 이미지 생성 | 예 |
| `component_image` | 컴포넌트 이미지 생성 | 예 |
| `promo_overview_parser` | 자연어 프로모션 개요 분석 | 예 |
| `promo_template_recommender` | Overview 기반 템플릿 추천 | 예 |
| `promo_template_composer` | 템플릿·섹션·콘텐츠 구성 초안 | 예 |

## 1.2 명시적 제외 범위

별도 디자인 생성기 파이프라인은 변경하지 않는다.

- `integrated_brief`
- `image_execution`
- `lofi_draft`
- `final_design`
- `promo-generation-*`
- `api/prompts/promo-integrated-design-brief-generation.js`
- `api/prompts/promo-ui-design-image-generation.js`
- `api/prompts/promo-page-generation.js`
- `api/generate-ui-design.js`
- n8n 디자인 생성 Worker
- n8n 테스트·고정본 JSON
- 디자인 생성기 Webhook과 최종 디자인 이미지 생성

제외 항목의 하드코딩은 기술 부채 목록에는 남기되 이번 계획의 P0/P1 구현 대상에는 포함하지 않는다.

## 1.3 별도 확인 후 결정할 영역

다음 파일은 운영 사용 여부를 먼저 확인한다.

- `n8n/design-md-concept-analyzer.workflow.json`
- `n8n/promo-ui-design-image-generator.workflow.json`
- `n8n/Promo UI Design Image Generator_*.json`
- 기타 n8n 테스트·고정본

운영에서 사용하지 않는 경우:

- Control Plane 편입 작업을 하지 않는다.
- `docs/archive` 또는 명확한 `n8n/legacy` 영역으로 이동하는 후속 정리 Task로 분리한다.

운영에서 사용하는 경우:

- 디자인 생성기 전용 별도 계획서를 작성한다.
- 이번 프로모션 빌더 Control Plane 계획에 혼합하지 않는다.

---

## 2. 사실관계 보정

## 2.1 Prompt Type 개수

`api/_prompt-template-store.js`의 `PROMPT_TYPES`는 총 12종이다.

```text
integrated_brief
image_execution
lofi_draft
final_design
section_layout_planner
multi_component_layout_planner
section_composition_planner
promo_overview_parser
promo_template_recommender
promo_template_composer
section_background_image
component_image
```

이 중 이번 계획의 대상은 8종이다.

## 2.2 Repository Baseline 초기화 동작

현행 `ensureDefaultPromptTemplates()`는 같은 `type`의 DB 행이 하나라도 존재하면 저장소 기본값을 추가하지 않는다.

따라서 다음 설명은 현재 코드와 다르다.

```text
활성 버전이 존재하면 저장소 기본값을 새 draft로 자동 추가한다.
```

실제 동작:

```text
해당 type의 행이 전혀 없음
  → 저장소 기본값 최초 삽입

해당 type의 active/draft/validated/inactive/archived 행 중 하나라도 있음
  → 아무것도 삽입하지 않음
```

이 정책은 관리자 편집 내용을 보호하지만 저장소 기본값 변경을 운영 DB에서 발견하기 어렵게 만든다.

## 2.3 프런트엔드 상태

현재 `prototype/`, `admin-app/`, `visual-editor/`의 런타임 코드에는 LLM에게 직접 전달되는 system/user Prompt 본문이 확인되지 않았다.

프런트엔드는 다음 역할만 담당한다.

- 프롬프트 버전 목록·그룹 표시
- 초안 편집
- 검증·활성화·롤백 요청
- 생성 요청에 사용자 입력과 옵션 전달

따라서 이번 하드코딩 정리의 주 대상은 API와 Provider 계층이다.

---

## 3. 하드코딩 분류 정책

## 3.1 A — 관리자 편집 가능

관리자가 결과 품질 조정을 위해 변경할 수 있어야 한다.

- Prompt Body
- 창작 방향과 톤
- 콘텐츠 해석 지침
- 레이아웃 제안 지침
- Overview 필드 생성 지침
- 템플릿 추천 기준의 설명
- 콘텐츠 역할 매핑 지침
- 이미지 분위기와 생성 지침
- Provider
- Model
- Temperature
- Max Tokens
- Response Format
- 허용된 Model Options
- Harness Additional Instructions
- Runtime Timeout·Retry의 허용 범위 내 값

권위 원천:

```text
active prompt_templates Version
```

## 3.2 B — 서버 불변 계약

관리자가 삭제하거나 약화할 수 없어야 한다.

- Structured Output JSON Schema
- `additionalProperties: false`
- 허용 Overview 경로
- 템플릿·섹션·컴포넌트·필드 Scope
- ID와 Key 존재 검증
- 잠금 콘텐츠·레이아웃 보호
- CSS Property allowlist
- Layout Operation allowlist
- 디자인 토큰·Style Slot 호환 검증
- URL·프로토콜 안전 정책
- 이미지 Signature·MIME·실제 해상도 검증
- Provider와 Vercel 절대 Timeout 상한
- API Key·DB URL·Blob Token
- 필수 출력 필드와 downstream 파서 계약
- Prompt Snapshot과 Input Fingerprint 검증

서버 불변 계약은 실행 Prompt에 포함될 수 있지만 일반 Prompt Body와 구분한다.

관리자 화면 표시:

```text
서버 실행 계약 · 읽기 전용
```

## 3.3 C — 저장소 복구 기준

신규 환경과 장애 복구를 위한 기본값이다.

- Prompt Type
- 표시 이름
- Repository Default Body
- 필수·선택 변수 계약
- 기본 Provider·Model·옵션
- 기본 Harness Config
- 기본 Runtime Config
- 기본 Capability Snapshot

Repository Baseline은 Runtime Authority가 아니다.

```text
Repository Baseline
  └─ 관리자가 새 초안으로 가져오기
       └─ 검증
            └─ 활성화
```

배포만으로 기존 활성 버전을 자동 변경하지 않는다.

## 3.4 D — 제외·레거시

- 디자인 생성기 Prompt
- n8n system/user 메시지
- 테스트용 n8n JSON
- 구형 Prompt API fallback

이번 계획에서는 운영 영향 조사 결과만 기록한다.

---

## 4. As-is 주요 이슈

## 4.1 P0 — Section Layout Provider의 Prompt Fallback

파일:

```text
api/_promo-section-design-provider.js
```

`generateSectionDesignPlan()`은 `promptConfig.renderedPrompt`가 없어도 코드 문자열로 실행할 수 있다.

반면 다음 함수는 Prompt가 없으면 실패한다.

- `generateMultiComponentLayoutPlan()`
- `generateSectionCompositionPlan()`
- `generateStructuredPlannerResult()`

정상 API에서는 Run 생성 시 `createPromptExecutionSnapshot()`을 거치므로 fallback 도달 가능성은 낮다. 그러나 우회 호출, 오래된 Run, 잘못된 Snapshot이 있으면 관리자가 활성화하지 않은 코드 Prompt로 실행될 수 있다.

## 4.2 P0 — Model 이중 기본값

Provider 계층에 다음 형태가 반복된다.

```js
promptConfig?.model || process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini"
```

신규 실행에서 Model의 Runtime Authority는 활성 Prompt Version이어야 한다.

환경변수와 코드 기본값은 Repository Baseline 생성에만 사용한다.

## 4.3 P1 — Repository Baseline 드리프트 확인 불가

저장소 기본 Prompt가 변경돼도 기존 DB에 행이 있으면 아무 변화가 없다.

관리자는 다음을 알 수 없다.

- 저장소 기본값이 변경됐는지
- 현재 활성 버전이 기본값보다 오래됐는지
- 어떤 본문·모델·Harness 설정이 달라졌는지
- 새 기본값을 안전하게 초안으로 가져오는 방법

## 4.4 P1 — 실제 실행 계층 가시성 부족

관리자 화면은 Prompt Body와 Model Options를 표시하지만 실제 실행에는 여러 계층이 합성될 수 있다.

```text
활성 Prompt Body
+ Harness Additional Instructions
+ 서버 불변 계약
+ 런타임 변수
= Effective Prompt
```

현재 관리자가 쉽게 확인하기 어려운 항목:

- 최종 합성 순서
- Repository Body Hash
- Active Body Hash
- Rendered Prompt Hash
- Server Contract Key·Version
- 어떤 실행 옵션이 최종 적용됐는지

## 4.5 P1 — 저장소 기본 본문 위치 이원화

일부 Prompt는 Markdown 파일이고 다수는 `_prompt-template-store.js` 문자열 배열이다.

이번 범위 8종은 대부분 JS 배열에 존재한다.

문제:

- 본문 변경 Diff 가독성 저하
- 문서 편집과 코드 편집 혼합
- Default Body Hash 산출과 리뷰가 어려움

단, 파일 분리는 Runtime Authority 변경이 아니다. DB 활성 버전이 계속 실행 권위값이다.

## 4.6 P2 — 레거시 자산의 운영 상태 불명확

n8n과 `api/prompts/*.js`의 fallback 문제는 실제로 존재한다.

그러나 이번 개발의 명시적 제외 범위인 디자인 생성기와 연결돼 있다.

운영 여부를 확인하지 않고 제거하면 과거 생성 파이프라인이 중단될 수 있다.

---

## 5. To-be 아키텍처

## 5.1 Runtime Authority

```text
관리자에서 활성화한 Prompt Version
  ├─ Prompt Body
  ├─ Provider
  ├─ Model
  ├─ Temperature
  ├─ Max Tokens
  ├─ Response Format
  ├─ Model Options
  ├─ Harness Config
  ├─ Runtime Config
  ├─ Capability Snapshot
  └─ Safety Contract Reference
```

신규 실행은 반드시 활성 Prompt Version에서 Execution Snapshot을 생성한다.

## 5.2 Effective Execution Layers

```text
Layer 1. Admin Prompt
  관리자가 편집·검증·활성화

Layer 2. Admin Harness
  Prompt Version과 함께 원자적으로 활성화

Layer 3. Server Contract
  서버 코드가 강제, 관리자 읽기 전용

Layer 4. Runtime Variables
  현재 요청의 Section·Content·Token·Overview 데이터
```

각 실행은 다음 메타데이터를 기록한다.

```json
{
  "promptId": "",
  "promptVersion": 1,
  "promptBodyHash": "",
  "harnessHash": "",
  "serverContract": {
    "key": "",
    "version": 1,
    "hash": ""
  },
  "renderedPromptHash": "",
  "provider": "",
  "model": "",
  "executionSnapshotVersion": 3
}
```

민감하거나 긴 실제 Prompt 본문은 실행 목록 기본 응답에 포함하지 않는다. 권한이 있는 관리자 상세 화면에서만 Snapshot을 확인한다.

## 5.3 Fail-closed

신규 실행은 다음 조건에서 LLM을 호출하지 않는다.

- 활성 Prompt Version 없음
- Prompt Body 없음
- Provider 또는 Model 없음
- 필수 변수 누락
- 미해결 placeholder 존재
- 지원하지 않는 Provider·Model 조합
- JSON Schema 또는 Response Format 불일치
- Control Plane 준비 버전 미달

표준 오류 코드:

```text
ACTIVE_PROMPT_REQUIRED
PROMPT_BODY_REQUIRED
PROMPT_MODEL_REQUIRED
PROMPT_VARIABLE_REQUIRED
PROMPT_PLACEHOLDER_UNRESOLVED
PROMPT_CONTROL_PLANE_NOT_READY
PROMPT_PROVIDER_UNSUPPORTED
```

---

## 6. 상세 개발 계획

## Phase 0 — 기준선·운영 영향 확인

### 작업

1. 포함 8종의 활성 Prompt 존재 여부 확인
2. 각 활성 버전의 Provider·Model·Control Plane 준비 상태 확인
3. `promo_section_design_runs`의 진행 중 Run 확인
4. Prompt Snapshot이 비어 있는 queued/processing Run 확인
5. Provider fallback 호출 경로 정적 검색
6. n8n·디자인 생성기 운영 여부는 별도 목록으로만 기록
7. 현재 전체 테스트 결과 기록

### 배포 게이트

- 포함 8종 모두 활성 Prompt 존재
- 신규 실행이 `createPromptExecutionSnapshot()`을 통과
- Prompt Snapshot 없는 진행 중 Run이 없거나 운영자가 처리 방식을 결정

### 산출물

- Control Plane readiness 리포트
- 활성 Prompt inventory
- Legacy Run 처리 목록

---

## Phase 1 — Provider Prompt·Model Fallback 제거

### 대상

```text
api/_promo-section-design-provider.js
```

### 작업

1. `generateSectionDesignPlan()`의 코드 Prompt fallback 제거
2. 빈 `renderedPrompt`이면 `ACTIVE_PROMPT_REQUIRED` 계열 오류 발생
3. 신규 실행에서 환경변수·문자열 Model fallback 제거
4. `promptConfig.model` 누락 시 호출 전 실패
5. 다른 Planner와 오류 정책 통일
6. Provider 함수 직접 호출 테스트에 필수 Prompt·Model 누락 사례 추가

### 주의

- `SECTION_LAYOUT_MODEL` 환경변수는 Repository Baseline 기본값 생성에는 유지할 수 있다.
- 기존 실행 Snapshot을 재처리할 때 활성 설정을 다시 읽지 않는다.
- Snapshot 자체가 불완전한 레거시 Run은 조용히 fallback하지 않고 명확히 실패시킨다.

### 완료 기준

- 대상 Provider에서 LLM 실행용 전체 Prompt 문자열 fallback 0건
- 신규 실행 Model 권위값이 `promptConfig.model` 하나로 통일
- Prompt 누락 테스트 통과

---

## Phase 2 — Repository Baseline Registry 분리

### 목표

기본 Prompt 본문을 코드 로직과 분리하고 hash를 계산할 수 있게 한다.

### 제안 구조

```text
prompts/control-plane/
  section-layout-planner.md
  multi-component-layout-planner.md
  section-composition-planner.md
  section-background-image.md
  component-image.md
  promo-overview-parser.md
  promo-template-recommender.md
  promo-template-composer.md
```

`_prompt-template-store.js`에는 다음만 유지한다.

- Prompt Type
- 이름
- 파일명
- 필수 변수
- 선택 변수
- 기본 Model 설정
- 기본 Control Plane 설정

### Baseline Descriptor

```json
{
  "type": "promo_overview_parser",
  "name": "Promotion Overview Parser",
  "bodyHash": "",
  "contractHash": "",
  "modelDefaultsHash": "",
  "repositoryRevision": ""
}
```

### 완료 기준

- 포함 8종의 기본 본문 원본 위치가 한 곳
- 저장소 기본 본문 hash 재현 가능
- 기존 신규 환경 seed 결과와 의미상 동일
- DB 활성 버전을 자동 수정하지 않음

---

## Phase 3 — Repository Baseline 비교·초안 가져오기 API

### 신규 또는 확장 API

```http
GET /api/prompt-repository-defaults
GET /api/prompt-repository-defaults?type=promo_overview_parser
POST /api/prompt-template-import-repository-default
```

### GET 응답 예시

```json
{
  "type": "promo_overview_parser",
  "repository": {
    "bodyHash": "",
    "contractHash": "",
    "modelDefaultsHash": ""
  },
  "active": {
    "id": "",
    "version": 4,
    "bodyHash": "",
    "contractHash": ""
  },
  "drift": {
    "body": true,
    "variables": false,
    "modelDefaults": true
  }
}
```

### Import 동작

- 기존 활성 버전을 수정하지 않는다.
- 같은 lineage에 새 draft를 만든다.
- 이미 draft 또는 validated 버전이 있으면 409로 차단한다.
- 변경 이력에 `repository-baseline-import` 기록
- source Prompt Version과 Repository hash 기록
- 생성 후에도 자동 활성화하지 않는다.

### DB

1차 구현은 신규 컬럼 없이 기존 필드를 사용한다.

- `model_options.repositoryBaseline`
- `change_note`
- 기존 History snapshot

필요 예시:

```json
{
  "repositoryBaseline": {
    "bodyHash": "",
    "contractHash": "",
    "importedAt": "",
    "repositoryRevision": ""
  }
}
```

### 완료 기준

- 관리자가 저장소 기본값 변경을 확인 가능
- 한 번의 명시적 작업으로 새 초안 생성 가능
- 활성 버전 자동 변경 없음

---

## Phase 4 — 관리자 UI 보완

### 그룹 대표 화면

기존 버전 그룹화 UI에 다음 상태를 추가한다.

- `저장소 기본값과 동일`
- `저장소 기본값 변경 있음`
- `변수 계약 변경 있음`
- `서버 계약 vN`
- `Control Plane 준비 완료`
- `실행 차단 상태`

### 아코디언 상세

```text
Prompt Body
Model & Runtime
Harness
Repository Baseline 비교
Server Contract · 읽기 전용
Effective Execution Preview
Version History
```

### Repository Baseline 작업

버튼:

```text
저장소 기본값과 비교
기본값을 새 초안으로 가져오기
```

버튼 조건:

- drift 존재
- 기존 후보 draft/validated 없음
- 활성 버전 직접 편집 상태가 아님

### Server Contract 표시

관리자에게 보이되 수정할 수 없는 항목:

- Contract Key
- Contract Version
- JSON Schema Hash
- 허용 Scope 요약
- 잠금 정책
- URL/CSS/Layout allowlist 버전
- 필수 출력 검증 목록

### Effective Execution Preview

실제 사용자 데이터를 사용하지 않는 샘플 Context로 다음 계층을 표시한다.

```text
Admin Prompt
Admin Harness
Server Contract
Resolved Variables
Final Hash
```

긴 Prompt는 기본 접힘 상태로 제공한다.

---

## Phase 5 — 검증·활성화 Gate 강화

### Draft 검증

- 필수 변수 선언과 placeholder 일치
- required와 optional 중복 금지
- 미선언 placeholder 금지
- 지원 Provider·Model 검증
- Response Format 검증
- Control Plane JSON 구조 검증
- Repository Baseline drift 정보 저장
- Server Contract 호환성 검증

### 활성화 차단 조건

- `validated` 상태가 아님
- 필수 변수 계약 오류
- 활성 Server Contract와 비호환
- Provider·Model Capability 불일치
- 신규 Snapshot Version 필수 설정 누락
- 같은 Type의 활성화 트랜잭션 실패

### 활성화

기존 원자적 lifecycle을 유지한다.

```text
validated → active
기존 active → inactive
```

---

## Phase 6 — 정적 감사와 회귀 테스트

### 하드코딩 감사

포함 8종 Runtime 경로에서 다음 패턴을 검사한다.

- `promptConfig?.renderedPrompt || [...]`
- Provider 함수 내부 전체 system/user Prompt
- 관리자 Prompt 누락 시 실행되는 문자열 fallback
- `promptConfig?.model || process.env...`
- Response Format의 이중 Authority

Repository Baseline 파일은 허용 목록으로 제외한다.

서버 불변 계약 문자열은 별도 허용 목록과 설명 주석을 요구한다.

### 필수 계약 테스트

- 활성 Prompt 없음 → LLM 미호출·명확한 오류
- Prompt Body 없음 → LLM 미호출
- Model 없음 → LLM 미호출
- unresolved placeholder → 차단
- Repository Baseline 변경 → drift true
- 기본값 가져오기 → 새 draft 생성
- 기존 draft 존재 → 409
- 활성 버전 자동 변경 없음
- Server Contract는 UI에서 읽기 전용
- Snapshot hash 재현
- 재시도는 최초 Snapshot 사용

### 브라우저 테스트

- Prompt 그룹 상태 배지
- Baseline 비교 아코디언
- 새 초안 가져오기
- 검증
- 활성화
- 롤백
- Server Contract 편집 불가
- Effective Preview 표시

### 전체 회귀

- 프로모션 빌더 Step 1 Overview
- 템플릿 추천
- AI 구성 초안
- Section AI Layout
- Section Background Image
- Component Image
- 다중 컴포넌트 정렬
- 자연어 섹션 구성
- 관리자 Prompt Lifecycle

---

## Phase 7 — 레거시·제외 영역 후속 조사

이번 개발 완료 후 별도 리포트만 작성한다.

### 조사 대상

- `api/prompts/*.js`
- `api/generate-ui-design.js`
- n8n workflow JSON
- Integrated Brief Guard
- 디자인 생성기 fallback

### 조사 결과 분류

```text
active-production
active-staging
test-only
reference-only
retired
unknown
```

### 후속 결정

- `retired`: archive 또는 삭제 계획
- `test-only`: 테스트 폴더로 격리
- `active-production`: 디자인 생성기 전용 Control Plane 계획
- `unknown`: 제거 금지

---

## 7. 배포 순서

## 7.1 사전 점검

1. 포함 8종 active Prompt 존재 확인
2. 진행 중 AI Run 확인
3. Prompt Snapshot 누락 Run 확인
4. 전체 테스트 기준선 기록
5. DB 백업 또는 Neon Branch 확보

## 7.2 코드 배포 1

- Baseline Registry
- 비교 API
- UI drift 표시
- 테스트

이 단계에서는 Provider fallback을 아직 제거하지 않아도 된다.

## 7.3 운영 준비

- 포함 8종 활성 버전 검증
- Control Plane 준비 상태 확인
- 누락된 Prompt는 Baseline에서 draft 생성 후 검증·활성화

## 7.4 코드 배포 2

- Provider Prompt fallback 제거
- Model fallback 제거
- Fail-closed 활성화

## 7.5 배포 후

- 각 8종 기능 1회 이상 실행
- 실행 Snapshot과 hash 확인
- Vercel 로그에서 fallback 0건 확인
- 오류율·응답시간 비교

---

## 8. 롤백 전략

### Prompt 품질 문제

- 이전 Prompt Version을 롤백 활성화
- 코드 롤백 불필요

### Baseline Import 문제

- 생성된 draft를 보관 처리
- active에는 영향 없음

### Provider Fail-closed 문제

- 원인은 Prompt·Model·Snapshot 누락으로 명시적으로 확인
- 코드 문자열 fallback을 재도입하지 않는다.
- 누락된 활성 Prompt를 복구하거나 이전 코드 릴리스를 일시 롤백한다.

### UI 문제

- 비교·가져오기 UI만 이전 버전으로 롤백
- Prompt 실행 API와 활성 버전은 유지

---

## 9. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 활성 Prompt 누락 상태에서 fallback 제거 | AI 기능 중단 | Phase 0 readiness gate |
| 오래된 Run의 Snapshot 누락 | 재처리 실패 | 진행 Run 사전 조사·명시적 종료 |
| Repository Baseline 자동 활성화 | 운영 Prompt 예기치 않은 변경 | draft만 생성, 자동 활성화 금지 |
| Server Contract를 관리자 편집 가능하게 노출 | 보안·파서 계약 약화 | 읽기 전용 고정 |
| Hash만 보고 의미 변경을 판단 | 불필요한 업데이트 | 본문·변수·모델을 분리 비교 |
| n8n 구형 파일을 운영으로 오인 | 불필요한 개발 | 운영 사용 여부 선확인 |
| 운영 n8n을 구형으로 오인해 삭제 | 파이프라인 중단 | unknown은 제거 금지 |
| 디자인 생성기 변경이 섞임 | 범위 확대·회귀 | 별도 계획서로 분리 |

---

## 10. 완료 기준

다음 조건을 모두 만족해야 완료로 판단한다.

### Runtime

- 포함 8종의 신규 실행이 활성 Prompt Version을 반드시 사용
- Provider의 전체 Prompt fallback 0건
- 신규 실행의 Model 이중 기본값 0건
- Prompt·Model 누락 시 LLM 호출 전 실패

### Admin

- Repository Baseline과 Active Version의 drift 표시
- 저장소 기본값을 새 draft로 가져오기 가능
- 자동 활성화 없음
- Server Contract 읽기 전용 표시
- Effective Execution 계층과 hash 확인 가능

### Safety

- JSON Schema·Scope·잠금·allowlist는 서버 강제 유지
- 관리자가 Server Contract를 삭제하거나 약화할 수 없음
- 재시도는 최초 Snapshot 사용

### Test

- 신규 계약 테스트 통과
- 관리자 브라우저 테스트 통과
- 포함 8종 기능 회귀 테스트 통과
- 전체 테스트 스위트 통과

### Scope

- 디자인 생성기 실행 Payload 변경 없음
- n8n 워크플로 변경 없음
- 제외 영역은 운영 상태 조사 결과만 별도 기록

---

## 11. 최종 권장 Task 순서

### P0

1. 포함 8종 활성 Prompt readiness 검사
2. 진행 중 Run과 누락 Snapshot 조사
3. `generateSectionDesignPlan` Prompt fallback 제거 준비
4. Provider Model Runtime Authority 통일

### P1

5. Repository Baseline 파일 분리
6. Baseline hash·drift 비교 API
7. 기본값을 새 초안으로 가져오기
8. 관리자 drift·Server Contract·Effective Preview UI
9. 검증·활성화 Gate 강화

### P2

10. 정적 하드코딩 감사 테스트
11. 전체 회귀 테스트
12. 디자인 생성기·n8n 운영 상태 별도 조사
13. 레거시 정리 또는 전용 계획서 작성
